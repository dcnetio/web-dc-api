// 领域模型基类：不包含任何存储逻辑
export abstract class BaseEntity {
  // 默认元字段
  public dc_timestamp?: number;  // 毫秒时间戳
  public dc_opuser?: string;    // 操作人

  constructor() {
    // 时间戳,opuser 留空，主要用于从dc取回数据时填充
   
  }

  // 可重写以自定义主键策略
  protected getPrimaryKey(): string {
    const anySelf = this as any;
    const id = anySelf.id ?? anySelf._id  ?? anySelf.key ?? anySelf.pk;

    // 仅判 null/undefined，为 0 的数字是合法主键
    if (id === null || id === undefined) {
      throw new Error(`${this.constructor.name}: primary key (id/key/pk) is required`);
    }

    if (typeof id === 'string') {
      const s = id.trim();
      if (s.length === 0) {
        throw new Error(`${this.constructor.name}: primary key (string) cannot be empty`);
      }
      return s;
    }

    if (typeof id === 'number') {
      if (Number.isNaN(id)) {
        throw new Error(`${this.constructor.name}: primary key (number) cannot be NaN`);
      }
      return String(id);
    }

    if (typeof id === 'bigint') {
      return id.toString();
    }

    // 其它类型统一转字符串（如需自定义请在子类中重写）
    return String(id);
  }

  // 标记更新时间与操作人
  touch(opuser?: string, timeMs: number = Date.now()): this {
    this.dc_timestamp = timeMs;
    if (opuser !== undefined) this.dc_opuser = opuser;
    return this;
  }

  // 设置操作人
  setOpUser(opuser: string): this {
    this.dc_opuser = opuser;
    return this;
  }

  // 可选：领域校验（子类覆盖）
  validate(): void {
    // no-op by default
  }

  // 工厂：从 PlainObject 创建实体
  static from<T extends BaseEntity>(this: new () => T, data: Partial<T>): T {
    const inst = new this();
    Object.assign(inst, data);
    return inst;
  }

  // 导出为可序列化对象（可覆写以裁剪敏感字段）
  toJSON(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(this as any)) {
      (out as any)[k] = (this as any)[k];
    }
    return out;
  }
}