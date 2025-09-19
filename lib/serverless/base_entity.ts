// 领域模型基类：不包含任何存储逻辑
export abstract class BaseEntity {
  // 可重写以自定义主键策略
  protected getPrimaryKey(): string {
    const anySelf = this as any;
    const id = anySelf.id ?? anySelf.key ?? anySelf.pk;
    if (!id) throw new Error(`${this.constructor.name}: primary key (id/key/pk) is required`);
    return String(id);
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