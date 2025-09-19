/* Serverless-friendly decorators (TS 5 standard + legacy)
   - @Entity(options?)
   - @Column(options?)
   - @Index(nameOrOptions[, fields])
*/

export type PrimitiveType = 'string' | 'number' | 'boolean' | 'date' | 'json' | 'binary';

export interface EntityOptions {
  name?: string;         // 实体名（默认类名）
  namespace?: string;    // 可选命名空间/前缀
  ttlSeconds?: number;   // 过期秒数，用于 serverless KV/缓存等
  versioned?: boolean;   // 是否启用版本
}

export interface ColumnOptions<T = unknown> {
  name?: string;                 // 存储层字段名（默认属性名）
  type?: PrimitiveType;          // 简化类型映射
  required?: boolean;            // 是否必填
  default?: T | (() => T);       // 默认值
  index?: boolean;               // 单列索引
  unique?: boolean;              // 唯一约束（需要底层支持）
}

export type IndexField =
  | string
  | { field: string; order?: 'asc' | 'desc' };

export interface IndexOptions {
  name?: string;
  fields: IndexField[];
  unique?: boolean;
  ttlSeconds?: number;
}

export interface EntityMeta {
  target: Function;
  name: string;
  options: EntityOptions;
}

export interface ColumnMeta {
  target: Function;
  propertyKey: string | symbol;
  options: ColumnOptions;
  resolvedName: string;
}

export interface NormalizedIndexField {
  field: string;
  order: 'asc' | 'desc';
}

export interface IndexMeta {
  target: Function;
  name: string;
  fields: NormalizedIndexField[];
  unique?: boolean;
  ttlSeconds?: number;
}

type StdDecoratorContext = {
  kind: 'class' | 'field' | 'accessor' | 'method' | 'getter' | 'setter';
  name?: string | symbol;
  addInitializer?: (fn: () => void) => void;
};

function isStdCtx(v: unknown): v is StdDecoratorContext {
  return !!v && typeof v === 'object' && 'kind' in (v as any);
}

class MetadataStorage {
  private entities = new WeakMap<Function, EntityMeta>();
  private columns = new WeakMap<Function, Map<string | symbol, ColumnMeta>>();
  private indexes = new WeakMap<Function, IndexMeta[]>();

  registerEntity(target: Function, options: EntityOptions = {}, nameHint?: string) {
    const name = options.name ?? nameHint ?? target.name;
    const meta: EntityMeta = { target, name, options: { ...options, name } };
    this.entities.set(target, meta);
    return meta;
  }

  registerColumn(target: Function, propertyKey: string | symbol, options: ColumnOptions = {}) {
    const colMap = this.columns.get(target) ?? new Map();
    const resolvedName = options.name ?? String(propertyKey);
    const meta: ColumnMeta = { target, propertyKey, options, resolvedName };
    colMap.set(propertyKey, meta);
    this.columns.set(target, colMap);
    return meta;
  }

  registerIndex(target: Function, input: { name?: string; fields: IndexField[]; unique?: boolean; ttlSeconds?: number }) {
    if (!input.fields || input.fields.length === 0) {
      throw new Error('@Index requires at least one field');
    }
    const normalizedFields: NormalizedIndexField[] = input.fields.map(f =>
      typeof f === 'string' ? { field: f, order: 'asc' } : { field: f.field, order: f.order ?? 'asc' }
    );
    const name = input.name ?? this.defaultIndexName(normalizedFields);

    const arr = this.indexes.get(target) ?? [];
    const dedupKey = this.makeIndexKey(name, normalizedFields);
    const exists = arr.some(i => this.makeIndexKey(i.name, i.fields) === dedupKey);

    if (!exists) {
      const norm: IndexMeta = {
        target,
        name,
        fields: normalizedFields,
        ...(input.unique !== undefined ? { unique: input.unique } : {}),
        ...(input.ttlSeconds !== undefined ? { ttlSeconds: input.ttlSeconds } : {}),
      };
      arr.push(norm);
      this.indexes.set(target, arr);
    }
  }

  getEntity(target: Function | object): EntityMeta | undefined {
    const ctor = typeof target === 'function' ? target : (target as any)?.constructor;
    return this.entities.get(ctor);
  }

  getColumns(target: Function | object): ColumnMeta[] {
    const ctor = typeof target === 'function' ? target : (target as any)?.constructor;
    const map = this.columns.get(ctor);
    return map ? Array.from(map.values()) : [];
  }

  getIndexes(target: Function | object): IndexMeta[] {
    const ctor = typeof target === 'function' ? target : (target as any)?.constructor;
    return this.indexes.get(ctor) ?? [];
  }

  getSchema(target: Function | object) {
    return {
      entity: this.getEntity(target),
      columns: this.getColumns(target),
      indexes: this.getIndexes(target),
    };
  }

  private defaultIndexName(fields: NormalizedIndexField[]) {
    const part = fields.map(f => `${f.field}_${f.order}`).join('_');
    return `idx_${part}`;
  }

  private makeIndexKey(name: string, fields: NormalizedIndexField[]) {
    return `${name}|${fields.map(f => `${f.field}:${f.order}`).join(',')}`;
  }
}

export const metadata = new MetadataStorage();

// ---------- Decorators (dual-mode: standard + legacy) ----------

export function Entity(options: EntityOptions = {}) {
  // Standard: (value, context)
  // Legacy: (ctor)
  return function entityDecorator(valueOrTarget: any, maybeContext?: unknown) {
    if (isStdCtx(maybeContext) && maybeContext.kind === 'class') {
      const ctor = valueOrTarget as Function;
      metadata.registerEntity(ctor, options, maybeContext.name ? String(maybeContext.name) : undefined);
      return;
    }
    // Legacy
    const ctor = valueOrTarget as Function;
    metadata.registerEntity(ctor, options, ctor.name);
  };
}

export function Column(options: ColumnOptions = {}) {
  // Standard: (initialValue, context)
  // Legacy: (target, propertyKey)
  return function columnDecorator(a: any, b: any) {
    // Standard field/accessor
    if (isStdCtx(b) && (b.kind === 'field' || b.kind === 'accessor')) {
      const ctx = b as StdDecoratorContext;
      const prop = ctx.name as string | symbol;

      ctx.addInitializer?.(function (this: any) {
        const ctor = this?.constructor;
        if (!ctor) return;
        const colMeta = metadata.registerColumn(ctor, prop, options);
        if (options.index || options.unique) {
          metadata.registerIndex(ctor, {
            name: `idx_${String(colMeta.resolvedName)}`,
            fields: [String(colMeta.resolvedName)],
            ...(options.unique !== undefined ? { unique: options.unique } : {}),
          });
        }
      });
      return;
    }
    // Legacy property decorator
    const target = a;
    const propertyKey = b as string | symbol;
    const ctor = target?.constructor;
    const colMeta = metadata.registerColumn(ctor, propertyKey, options);
    if (options.index || options.unique) {
      metadata.registerIndex(ctor, {
        name: `idx_${String(colMeta.resolvedName)}`,
        fields: [String(colMeta.resolvedName)],
        ...(options.unique !== undefined ? { unique: options.unique } : {}),
      });
    }
  };
}

export function Index(nameOrOptions: string | IndexOptions, fields?: IndexOptions['fields']) {
  return function indexDecorator(valueOrTarget: any, maybeContext?: unknown) {
    // Standard mode
    if (isStdCtx(maybeContext)) {
      const ctx = maybeContext as StdDecoratorContext;

      if (ctx.kind === 'class') {
        // ...existing code...
      }

      if (ctx.kind === 'field' || ctx.kind === 'accessor') {
        const prop = ctx.name as string | symbol;
        const base: IndexOptions =
          typeof nameOrOptions === 'string'
            ? { name: nameOrOptions, fields: [String(prop)] }
            : { ...(nameOrOptions ?? {}), fields: (nameOrOptions as IndexOptions)?.fields?.length ? (nameOrOptions as IndexOptions).fields : [String(prop)] };

        ctx.addInitializer?.(function (this: any) {
          const ctor = this?.constructor;
          if (!ctor) return;
          metadata.registerIndex(ctor, {
            ...(base.name ? { name: base.name } : {}),
            fields: base.fields,
            ...(base.unique !== undefined ? { unique: base.unique } : {}),
            ...(base.ttlSeconds !== undefined ? { ttlSeconds: base.ttlSeconds } : {}),
          });
        });
        return;
      }
    }

    // Legacy mode
    if (typeof maybeContext === 'string' || typeof maybeContext === 'symbol') {
      // Property decorator
      const target = valueOrTarget;
      const prop = maybeContext as string | symbol;
      const ctor = target?.constructor;
      const base: IndexOptions =
        typeof nameOrOptions === 'string'
          ? { name: nameOrOptions, fields: [String(prop)] }
          : { ...(nameOrOptions ?? {}), fields: (nameOrOptions as IndexOptions)?.fields?.length ? (nameOrOptions as IndexOptions).fields : [String(prop)] };

      metadata.registerIndex(ctor, {
        ...(base.name ? { name: base.name } : {}),
        fields: base.fields,
        ...(base.unique !== undefined ? { unique: base.unique } : {}),
        ...(base.ttlSeconds !== undefined ? { ttlSeconds: base.ttlSeconds } : {}),
      });
    } else {
      // Class decorator
      const ctor = valueOrTarget as Function;
      const opts: IndexOptions =
        typeof nameOrOptions === 'string'
          ? { name: nameOrOptions, fields: fields ?? [] }
          : nameOrOptions;

      if (!opts.fields || opts.fields.length === 0) {
        throw new Error(`@Index on class ${ctor.name} requires fields`);
      }
      metadata.registerIndex(ctor, {
        ...(opts.name ? { name: opts.name } : {}),
        fields: opts.fields,
        ...(opts.unique !== undefined ? { unique: opts.unique } : {}),
        ...(opts.ttlSeconds !== undefined ? { ttlSeconds: opts.ttlSeconds } : {}),
      });
    }
  };
}

// ---------- Helpers for consumers ----------

export function getEntitySchema(target: Function | object) {
  return metadata.getSchema(target);
}

export function getEntityName(target: Function | object) {
  return metadata.getEntity(target)?.name;
}

export function getColumns(target: Function | object) {
  return metadata.getColumns(target);
}

export function getIndexes(target: Function | object) {
  return metadata.getIndexes(target);
}

/*
Usage example:

@Entity({ name: 'User', namespace: 'app', ttlSeconds: 86400 })
class User {
  @Column({ type: 'string', required: true })
  id!: string;

  @Column({ type: 'string', index: true })
  email!: string;

  @Column({ type: 'date', default: () => new Date() })
  createdAt!: Date;

  @Index('idx_email_unique', ['email'])
  // or put @Index() on the field to use single-column default index
}
*/