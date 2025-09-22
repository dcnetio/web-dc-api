import { Direction } from "../common/define";
import type { IKeyValueOperations } from "../interfaces/keyvalue-interface";
import type { KeyValueDB } from "../implements/keyvalue/manager";
import { metadata } from "./decorator_factory";
import { BaseEntity } from "./base_entity";

type Ctor<T> = new (...args: any[]) => T;

const EXTRA_SEP = "$$$dckv_extra$$$";

function extractRawValue(s: string): [string, string]  {
  const i = s.indexOf(EXTRA_SEP);
  return i >= 0 ? [s.slice(0, i), s.slice(i + EXTRA_SEP.length)] : [s, ""];
}

function safeParseJSON<T>(s: string | null): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}




// 兼容 getWithIndex 返回的两种格式（string[] 或 Record<string,string>[]）
function parseIndexResultValues(raw: string): string[] {
  const parsed = safeParseJSON<any>(raw);
  if (!Array.isArray(parsed)) return [];
  const out: string[] = [];
  for (const item of parsed) {
    if (typeof item === "string") {
      out.push(item);
    } else if (item && typeof item === "object") {
      for (const v of Object.values(item)) {
        if (v != null) out.push(String(v));
      }
    }
  }
  return out;
}

function maybeStripKeyPrefix(s: string): string {
  const t = s.trimStart();
  const i = t.indexOf(":");
  if (i > 0 && i < 64 && t[0] !== "{" && t[0] !== "[" && t[0] !== "\"") {
    return t.slice(i + 1).trim();
  }
  return s;
}



// 将列声明类型与实际值映射到 KV 可识别的索引类型和值
function asIndexTypeAndValue(value: unknown, declaredType?: string): { type: string; value: string } {
  const t = declaredType ?? (value instanceof Date ? "date" : typeof value);
  switch (t) {
    case "date":
      return { type: "number", value: String(value instanceof Date ? value.getTime() : Number(value)) };
    case "boolean":
      return { type: "number", value: String(value ? 1 : 0) };
    case "number":
      return { type: "number", value: String(value ?? 0) };
    case "json":
      return { type: "json", value: JSON.stringify(value) };
    default:
      return { type: "string", value: String(value ?? "") };
  }
}

function buildIndexPayload(entity: object, ctor: Function): string {
  const cols = metadata.getColumns(ctor);
  const colTypeByName = new Map<string, string>();
  cols.forEach(c => {
    if (c.options?.type) colTypeByName.set(c.resolvedName, c.options.type);
  });

  const idxMetas = metadata.getIndexes(ctor);
  const items: Array<{ key: string; type: string; value: string }> = [];

    for (const idx of idxMetas) {
    if (!idx.fields.length) continue;

    if (idx.fields.length === 1) {
      const [first] = idx.fields;
      if (!first) continue;
      const f = first.field;
      const raw = (entity as any)[f];
      const { type, value } = asIndexTypeAndValue(raw, colTypeByName.get(f));
      // 单列索引用字段名作为索引键
      items.push({ key: f, type, value });
    } else {
      // 复合索引：索引名作为 key，值为字段值数组的 JSON，类型 json
      const key = idx.name;
      const tuple = idx.fields.map(ff => (entity as any)[ff.field]);
      items.push({ key, type: "json", value: JSON.stringify(tuple) });
    }
  }

  return JSON.stringify(items);
}

export function composeCompositeIndexValue(values: unknown[]): string {
  // 用于复合索引查询：indexValue 需为 JSON 数组字符串
  return JSON.stringify(values);
}

export type FindIndexOptions = {
  type?: "string" | "number" | "boolean" | "date" | "json" | "binary";
  limit?: number;
  seekKey?: string;
  direction?: Direction;
  offset?: number;
  vaccount?: string;
};

export type FindValuesOptions = {
  limit?: number;
  seekKey?: string;
  direction?: Direction;
  offset?: number;
  vaccount?: string;
};

function sanitizeGetWithIndexOptions(options: FindIndexOptions): { type?: string; limit?: number; seekKey?: string; direction?: Direction; offset?: number } {
  return {
    ...(options.type !== undefined ? { type: options.type } : {}),
    ...(options.limit !== undefined ? { limit: options.limit } : {}),
    ...(options.seekKey !== undefined ? { seekKey: options.seekKey } : {}),
    ...(options.direction !== undefined ? { direction: options.direction } : {}),
    ...(options.offset !== undefined ? { offset: options.offset } : {}),
  };
}

function sanitizeGetValuesOptions(options: FindValuesOptions): { limit?: number; seekKey?: string; direction?: Direction; offset?: number } {
  return {
    ...(options.limit !== undefined ? { limit: options.limit } : {}),
    ...(options.seekKey !== undefined ? { seekKey: options.seekKey } : {}),
    ...(options.direction !== undefined ? { direction: options.direction } : {}),
    ...(options.offset !== undefined ? { offset: options.offset } : {}),
  };
}



// 通用仓储：承载所有持久化与查询逻辑
export class EntityRepository<T extends BaseEntity> {
  constructor(
    private readonly entityCtor: Ctor<T>,
    private readonly ops: IKeyValueOperations,
    private readonly db: KeyValueDB
  ) {}

  // 保存实体（写入并附带索引）
  async save(entity: T, vaccount?: string): Promise<number> {
    entity.validate();
    const key= (entity as any).getPrimaryKey();
    //移除dc_timestamp和dc_opuser字段，由dc节点自动维护
    delete (entity as any).dc_timestamp;
    delete (entity as any).dc_opuser;
    const value = JSON.stringify(entity.toJSON());
    const indexs = buildIndexPayload(entity, this.entityCtor);

    const [ok,resTimestamp, err] = await this.ops.set(this.db, key, value, indexs, vaccount);
    if (err) throw err;
    if (!ok) throw new Error(`${this.entityCtor.name}.save failed`);
    entity.dc_timestamp = resTimestamp ? resTimestamp : 0; // 设置时间戳
    return entity.dc_timestamp;
  }


  async deleteById(id: string, vaccount?: string): Promise<void> {
    const key = id;
    const [ok,_ ,err] = await this.ops.set(this.db, key, "","", vaccount); // 空值用于标记删除
    if (err) throw err;
    if (!ok) throw new Error(`${this.entityCtor.name}.deleteById failed`);
  }

  // 局部更新（按 id 合并字段后保存）
  async update(id: string, patch: Partial<T>, vaccount?: string): Promise<T | null> {
    const key = id; 
     const [curr, err] = await this.ops.getValueSetByCurrentUser(this.db, key, vaccount);
    if (err || !curr) return null;
    const [json, extra] = extractRawValue(curr);
    const obj = safeParseJSON<any>(json);
    if (!obj) return null;
    if (extra) {
        const extraObj = safeParseJSON<any>(extra);
        if (extraObj) Object.assign(obj, extraObj);
    }   
    const inst = new this.entityCtor();
    Object.assign(inst, obj);
    Object.assign(inst as any, patch);
    const resTimestamp = await this.save(inst, vaccount);
    inst.dc_timestamp = resTimestamp;
    return inst;
  }



  // 通过 id 获取
  async findById(id: string, writerPubkey?: string, vaccount?: string): Promise<T | null> {
    const key = id; 
    const [raw, err] = await this.ops.get(this.db, key, writerPubkey, vaccount);
    if (err || !raw) return null;

    const [json, extra] = extractRawValue(raw);
    const obj = safeParseJSON<any>(json);
    if (!obj) return null;
    if (extra) {
      const extraObj = safeParseJSON<any>(extra);
      if (extraObj) Object.assign(obj, extraObj);
    }   
    

    const inst = new this.entityCtor();
    Object.assign(inst, obj);
    return inst;
  }


  

  // 通过索引查询（单字段：indexKey=字段名；复合：indexKey=索引名，indexValue=JSON数组字符串）
  async findByIndex(indexKey: string, indexValue: string, options: FindIndexOptions = {}): Promise<T[]> {
    const [raw, err] = await this.ops.getWithIndex(
      this.db,
      indexKey,
      indexValue,
      sanitizeGetWithIndexOptions(options),
      options.vaccount
    );
    if (err || !raw) return [];

    const values = parseIndexResultValues(raw);
    const out: T[] = [];
    for (let val of values) {
      // 兼容老格式 "key:value"；新格式是纯 value，不会命中
      val = maybeStripKeyPrefix(val);

      const [json, extra] = extractRawValue(val);
      const obj = safeParseJSON<any>(json);
      if (!obj) continue;
      if (extra) {
        const extraObj = safeParseJSON<any>(extra);
        if (extraObj) Object.assign(obj, extraObj);
      }
      const inst = new this.entityCtor();
      Object.assign(inst, obj);
      out.push(inst);
    }
    return out;
  }

  async findOneByIndex(indexKey: string, indexValue: string, options: Omit<FindIndexOptions, "limit"> = {}): Promise<T | null> {
    const list = await this.findByIndex(indexKey, indexValue, { ...options, limit: 1 });
    return list[0] ?? null;
  }

  // 按键前缀遍历（用于分页场景）
  async getValues(keyPrefix: string, options: FindValuesOptions = {}): Promise<T[]> {
    const [raw, err] = await this.ops.getValues(
      this.db,
      keyPrefix,
      sanitizeGetValuesOptions(options),
      options.vaccount
    );
    if (err || !raw) return [];

    const list = safeParseJSON<string[]>(raw) ?? [];
    const out: T[] = [];
    for (const item of list) {
      const [v,extra] = extractRawValue(String(item));
      const obj = safeParseJSON<any>(v);
      if (!obj) continue;
      if (extra) {
        const extraObj = safeParseJSON<any>(extra);
        if (extraObj) Object.assign(obj, extraObj);
      }
      const inst = new this.entityCtor();
      Object.assign(inst, obj);
      out.push(inst);
    }
    return out;
  }
}