import "../polyfills/process-env-browser";
import type { NodePath, Visitor } from "@babel/traverse";
import type * as T from "@babel/types";
import { loadBabel } from "./babel-browser";

export type PrintableSchema = {
  entityName: string;
  namespace?: string;
  ttlSeconds?: number;
  versioned?: boolean;
  columns: Array<{
    name: string;
    type?: string;
    required?: boolean;
    unique?: boolean;
    index?: boolean;
    default?: unknown;
  }>;
  indexes: Array<{
    name: string;
    fields: Array<{ field: string; order: "asc" | "desc" }>;
    unique?: boolean;
    ttlSeconds?: number;
  }>;
};

interface FileContentMap {
  [fileName: string]: string;
}

export async function extractSchemasFromSources(sources: FileContentMap): Promise<PrintableSchema[]> {
  const { parse, t, traverse } = await loadBabel();
  const result: PrintableSchema[] = [];

  // 解析源码（优先标准装饰器，失败回退 legacy）
  function tryParse(code: string) {
    const common = {
      sourceType: "module" as const,
      errorRecovery: true,
      plugins: ["typescript"] as any[],
    };
    try {
      return parse(code, {
        ...common,
        plugins: [
          ["decorators", { decoratorsBeforeExport: true }],
          "classProperties",
          "classPrivateProperties",
          ...common.plugins,
        ],
      } as any);
    } catch {
      return parse(code, {
        ...common,
        plugins: [
          "decorators-legacy",
          "classProperties",
          "classPrivateProperties",
          ...common.plugins,
        ],
      } as any);
    }
  }

  // 将装饰器参数表达式转 JS 值（常见字面量/对象/数组）
  function exprToValue(node: any): any {
    if (!node) return undefined;
    if (t.isStringLiteral(node) || t.isNumericLiteral(node) || t.isBooleanLiteral(node)) return (node as any).value;
    if (t.isNullLiteral(node)) return null;
    if (t.isIdentifier(node) && (node.name === "undefined")) return undefined;
    if (t.isObjectExpression(node)) {
      const obj: any = {};
      for (const p of node.properties) {
        if (t.isObjectProperty(p)) {
          const key = t.isIdentifier(p.key) ? p.key.name : t.isStringLiteral(p.key) ? p.key.value : undefined;
          if (!key) continue;
          obj[key] = exprToValue(p.value as any);
        }
      }
      return obj;
    }
    if (t.isArrayExpression(node)) return node.elements.map((e: any) => exprToValue(e ));
    return undefined;
  }

  // 规范化索引字段
  function normIndexFields(fields: any, fallbackField?: string): Array<{ field: string; order: "asc" | "desc" }> {
    const out: Array<{ field: string; order: "asc" | "desc" }> = [];
    const arr = Array.isArray(fields) ? fields : (fields ? [fields] : []);
    if (arr.length === 0 && fallbackField) return [{ field: fallbackField, order: "asc" }];
    for (const it of arr) {
      if (typeof it === "string") out.push({ field: it, order: "asc" });
      else if (it && typeof it === "object" && typeof it.field === "string") {
        out.push({ field: it.field, order: it.order === "desc" ? "desc" : "asc" });
      }
    }
    return out;
  }

  // 默认索引名
  function defaultIndexName(fields: Array<{ field: string; order: "asc" | "desc" }>) {
    const seg = fields.map(f => f.field + (f.order === "desc" ? "_desc" : "")).join("_");
    return `idx_${seg}`;
  }

  // 去重 key
  function indexKey(name: string | undefined, fields: Array<{ field: string; order: "asc" | "desc" }>) {
    const seg = fields.map(f => `${f.field}:${f.order}`).join(",");
    return `${name ?? defaultIndexName(fields)}|${seg}`;
  }

  // 装饰器名/参数
  function getDecoratorName(dec: any): string | undefined {
    const ex = dec.expression;
    if (t.isIdentifier(ex)) return ex.name;
    if (t.isCallExpression(ex) && t.isIdentifier(ex.callee)) return ex.callee.name;
    return undefined;
  }
  function getDecoratorArgs(dec: any): any[] {
    const ex = dec.expression;
    if (t.isCallExpression(ex)) return ex.arguments.map((arg: any) => exprToValue(arg as any));
    return [];
  }

  // 统一处理类（ClassDeclaration / ClassExpression）
  const visitClass = (path: NodePath<T.ClassDeclaration | T.ClassExpression>) => {
    const node = path.node as any;
    const className = (node.id && node.id.name) || "AnonymousClass";
    const decorators: any[] = node.decorators ?? [];

    // 解析 @Entity
    let entityName = className;
    let entityOpts: any = {};
    for (const d of decorators) {
      const name = getDecoratorName(d);
      if (name === "Entity") {
        const [opt] = getDecoratorArgs(d);
        if (opt && typeof opt === "object") {
          entityOpts = opt;
          if (typeof opt.name === "string") entityName = opt.name;
        }
      }
    }

    // 字段与字段级装饰器
    const columns: PrintableSchema["columns"] = [];
    const fieldLevelIndexes: PrintableSchema["indexes"] = [];

    for (const m of node.body.body as any[]) {
      const isClassProp = (t as any).isClassProperty?.(m) || (t as any).isPropertyDefinition?.(m);
      const isPrivateProp = (t as any).isClassPrivateProperty?.(m);
      if (!isClassProp && !isPrivateProp) continue;

      const keyNode = m.key;
      const key =
        t.isIdentifier(keyNode) ? keyNode.name :
        t.isStringLiteral(keyNode) ? keyNode.value :
        undefined;
      if (!key) continue;

      let columnOpts: any | undefined = undefined;
      const explicitIndexFromDecorator: any[] = [];
      const mDecos: any[] = m.decorators ?? [];

      for (const d of mDecos) {
        const dn = getDecoratorName(d);
        const args = getDecoratorArgs(d);
        if (dn === "Column") {
          columnOpts = args[0] && typeof args[0] === "object" ? args[0] : {};
        } else if (dn === "Index") {
          explicitIndexFromDecorator.push(args);
        }
      }

      const resolvedName = (columnOpts?.name as string) ?? key;
      columns.push({
        name: resolvedName,
        ...(columnOpts?.type !== undefined ? { type: columnOpts.type } : {}),
        ...(columnOpts?.required !== undefined ? { required: !!columnOpts.required } : {}),
        ...(columnOpts?.unique !== undefined ? { unique: !!columnOpts.unique } : {}),
        ...(columnOpts?.index !== undefined ? { index: !!columnOpts.index } : {}),
        ...(columnOpts?.default !== undefined ? { default: columnOpts.default } : {}),
      });

      // Column 的 index/unique → 单列索引
      if (columnOpts?.index || columnOpts?.unique) {
        const fields = [{ field: resolvedName, order: "asc" as const }];
        fieldLevelIndexes.push({
          name: defaultIndexName(fields),
          fields,
          ...(columnOpts?.unique ? { unique: true } : {}),
        });
      }

      // 字段级 @Index
      for (const args of explicitIndexFromDecorator) {
        let idxName: string | undefined;
        let idxFields: any;
        let idxUnique: boolean | undefined;
        let idxTTL: number | undefined;
        if (args.length === 0) {
          idxFields = [resolvedName];
        } else if (typeof args[0] === "string") {
          idxName = args[0];
          idxFields = args[1] ?? [resolvedName];
        } else if (typeof args[0] === "object") {
          idxName = args[0].name;
          idxFields = args[0].fields ?? [resolvedName];
          idxUnique = args[0].unique;
          idxTTL = args[0].ttlSeconds;
        }
        const fields = normIndexFields(idxFields, resolvedName);
        if (fields.length === 0) continue;
        const name2 = idxName ?? defaultIndexName(fields);
        fieldLevelIndexes.push({
          name: name2,
          fields,
          ...(idxUnique !== undefined ? { unique: !!idxUnique } : {}),
          ...(idxTTL !== undefined ? { ttlSeconds: idxTTL } : {}),
        });
      }
    }

    // 类级 @Index
    const classLevelIndexes: PrintableSchema["indexes"] = [];
    for (const d of decorators) {
      const dn = getDecoratorName(d);
      if (dn !== "Index") continue;
      const args = getDecoratorArgs(d);
      let idxName: string | undefined;
      let idxFields: any;
      let idxUnique: boolean | undefined;
      let idxTTL: number | undefined;
      if (args.length === 0) continue;
      else if (typeof args[0] === "string") {
        idxName = args[0]; idxFields = args[1] ?? [];
      } else if (typeof args[0] === "object") {
        idxName = args[0].name; idxFields = args[0].fields ?? [];
        idxUnique = args[0].unique; idxTTL = args[0].ttlSeconds;
      }
      const fields = normIndexFields(idxFields);
      if (fields.length === 0) continue;
      const name2 = idxName ?? defaultIndexName(fields);
      classLevelIndexes.push({
        name: name2,
        fields,
        ...(idxUnique !== undefined ? { unique: !!idxUnique } : {}),
        ...(idxTTL !== undefined ? { ttlSeconds: idxTTL } : {}),
      });
    }

    // 合并去重
    const allIndexes = [...fieldLevelIndexes, ...classLevelIndexes];
    const dedup = new Map<string, PrintableSchema["indexes"][number]>();
    for (const ix of allIndexes) {
      const key = indexKey(ix.name, ix.fields);
      if (!dedup.has(key)) dedup.set(key, ix);
    }

    const printable: PrintableSchema = {
      entityName: (entityOpts?.name as string) ?? entityName,
      ...(entityOpts?.namespace !== undefined ? { namespace: entityOpts.namespace } : {}),
      ...(entityOpts?.ttlSeconds !== undefined ? { ttlSeconds: entityOpts.ttlSeconds } : {}),
      ...(entityOpts?.versioned !== undefined ? { versioned: entityOpts.versioned } : {}),
      columns,
      indexes: Array.from(dedup.values()),
    };

    result.push(printable);
  };

  // 遍历每个文件的 AST
  for (const [, content] of Object.entries(sources)) {
    const ast = tryParse(content);
    const visitors: Visitor = {
      ClassDeclaration(path: NodePath<T.ClassDeclaration>) { visitClass(path); },
      ClassExpression(path: NodePath<T.ClassExpression>) { visitClass(path); },
    };
    traverse(ast as any, visitors);
  }

  return result;
}