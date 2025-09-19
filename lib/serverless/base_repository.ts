import { Direction } from "../common/define";
import type { IKeyValueOperations } from "../interfaces/keyvalue-interface";
import type { KeyValueDB } from "../implements/keyvalue/manager";
import { metadata, getEntityName } from "./decorator_factory";
import { BaseEntity } from "./base_entity";

type Ctor<T> = new (...args: any[]) => T;

const EXTRA_SEP = "$$$dckv_extra$$$";

function extractRawValue(s: string): string {
  const i = s.indexOf(EXTRA_SEP);
  return i >= 0 ? s.slice(0, i) : s;
}

function safeParseJSON<T>(s: string | null): T | null {
  if (!s) return null;
  try { return JSON.parse(s) as T; } catch { return null; }
}

function buildKeyFromMeta(ctor: Function, id: string): string {
  const e = metadata.getEntity(ctor);
  const name = e?.name ?? getEntityName(ctor) ?? ctor.name;
  const ns = e?.options.namespace ? `${e.options.namespace}:` : "";
  return `${ns}${name}:${id}`;
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
  async save(entity: T, vaccount?: string): Promise<void> {
    entity.validate();
    const id = (entity as any).getPrimaryKey();
    const key = buildKeyFromMeta(this.entityCtor, id);
    const value = JSON.stringify(entity.toJSON());
    const indexs = buildIndexPayload(entity, this.entityCtor);

    const [ok, err] = await this.ops.set(this.db, key, value, indexs, vaccount);
    if (err) throw err;
    if (!ok) throw new Error(`${this.entityCtor.name}.save failed`);
  }

  // 局部更新（按 id 合并字段后保存）
  async update(id: string, patch: Partial<T>, vaccount?: string): Promise<T | null> {
    const curr = await this.findById(id, undefined, vaccount);
    if (!curr) return null;
    Object.assign(curr as any, patch);
    await this.save(curr, vaccount);
    return curr;
  }

  // 通过 id 获取
  async findById(id: string, writerPubkey?: string, vaccount?: string): Promise<T | null> {
    const key = buildKeyFromMeta(this.entityCtor, id);
    const [raw, err] = await this.ops.get(this.db, key, writerPubkey, vaccount);
    if (err || !raw) return null;

    const json = extractRawValue(raw);
    const obj = safeParseJSON<any>(json);
    if (!obj) return null;

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

    const list = safeParseJSON<string[]>(raw) ?? [];
    const out: T[] = [];
    for (const item of list) {
      const v = extractRawValue(String(item));
      const obj = safeParseJSON<any>(v);
      if (!obj) continue;
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
      const v = extractRawValue(String(item));
      const obj = safeParseJSON<any>(v);
      if (!obj) continue;
      const inst = new this.entityCtor();
      Object.assign(inst, obj);
      out.push(inst);
    }
    return out;
  }
}