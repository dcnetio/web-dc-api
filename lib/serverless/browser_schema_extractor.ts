import "../polyfills/process-env-browser"; 
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

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

function tryParse(code: string) {
  const base = {
    sourceType: "module" as const,
    allowReturnOutsideFunction: false,
    errorRecovery: true,
    plugins: ["typescript", "classProperties", "classPrivateProperties"] as any[],
  };
  try {
    // TS 5+ 标准装饰器语法
    return parse(code, {
      ...base,
      plugins: [...base.plugins, ["decorators", { version: "2023-05" }]],
    });
  } catch {
    // 旧版 legacy 装饰器语法
    return parse(code, {
      ...base,
      plugins: [...base.plugins, "decorators-legacy"],
    });
  }
}

function exprToValue(node: t.Expression | t.PrivateName | null | undefined): any {
  if (!node) return undefined;
  if (t.isStringLiteral(node)) return node.value;
  if (t.isNumericLiteral(node)) return node.value;
  if (t.isBooleanLiteral(node)) return node.value;
  if (t.isNullLiteral(node as any)) return null;
  if (t.isIdentifier(node) && node.name === "undefined") return undefined;
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return node.quasis.map(q => q.value.cooked ?? q.value.raw).join("");
  }
  if (t.isUnaryExpression(node) && node.operator === "-" && t.isNumericLiteral(node.argument)) {
    return -node.argument.value;
  }
  if (t.isArrayExpression(node)) {
    return node.elements.map(el => (el && t.isExpression(el) ? exprToValue(el) : undefined));
  }
  if (t.isObjectExpression(node)) {
    const out: Record<string, any> = {};
    for (const prop of node.properties) {
      if (t.isObjectProperty(prop)) {
        const key = prop.key;
        const name = t.isIdentifier(key) ? key.name : t.isStringLiteral(key) ? key.value : undefined;
        if (!name) continue;
        const val = t.isExpression(prop.value) ? exprToValue(prop.value) : undefined;
        if (val !== undefined) out[name] = val;
      }
    }
    return out;
  }
  // 非字面量表达式不展开，返回占位
  return undefined;
}

function normIndexFields(fields: any, fallbackField?: string): Array<{ field: string; order: "asc" | "desc" }> {
  const out: Array<{ field: string; order: "asc" | "desc" }> = [];
  if (Array.isArray(fields) && fields.length > 0) {
    for (const f of fields) {
      if (typeof f === "string") {
        out.push({ field: f, order: "asc" });
        continue;
      }
      if (f && typeof f === "object") {
        const field = "field" in f && f.field != null ? String((f as any).field) : (fallbackField ?? "");
        if (!field) continue;
        const order: "asc" | "desc" = (f as any).order === "desc" ? "desc" : "asc";
        out.push({ field, order });
        continue;
      }
      if (fallbackField) {
        out.push({ field: fallbackField, order: "asc" });
      }
    }
    return out;
  }
  if (fallbackField) return [{ field: fallbackField, order: "asc" }];
  return [];
}

function defaultIndexName(fields: Array<{ field: string; order: "asc" | "desc" }>) {
  const part = fields.map(f => `${f.field}_${f.order}`).join("_");
  return `idx_${part}`;
}

function indexKey(name: string, fields: Array<{ field: string; order: "asc" | "desc" }>) {
  return `${name}|${fields.map(f => `${f.field}:${f.order}`).join(",")}`;
}

function getDecoratorName(dec: t.Decorator): string | undefined {
  const exp = dec.expression as t.Expression;
  if (t.isIdentifier(exp)) return exp.name;
  if (t.isCallExpression(exp)) {
    const callee = exp.callee;
    if (t.isIdentifier(callee)) return callee.name;
  }
  return undefined;
}

function getDecoratorArgs(dec: t.Decorator): any[] {
  const exp = dec.expression as t.Expression;
  if (t.isCallExpression(exp)) {
    return exp.arguments
      .map(arg => (t.isExpression(arg) ? exprToValue(arg) : undefined))
      .filter(a => a !== undefined);
  }
  return [];
}



export function extractSchemasFromSources(sources: FileContentMap): PrintableSchema[] {
  const result: PrintableSchema[] = [];
  // 临时缓存：文件里可能出现多个类
  for (const [_, content] of Object.entries(sources)) {
    const ast = tryParse(content);

    traverse(ast, {
      Class(path) {
        const node = path.node;
        const className = (node.id && node.id.name) || "AnonymousClass";
        const decorators = node.decorators ?? [];

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

        // 解析字段与字段级装饰器
        const columns: PrintableSchema["columns"] = [];
        const fieldLevelIndexes: PrintableSchema["indexes"] = [];

        for (const m of node.body.body) {
          if (t.isClassProperty(m) || t.isClassPrivateProperty(m)) {
            const key = ((): string | undefined => {
              if (t.isIdentifier(m.key)) return m.key.name;
              if (t.isStringLiteral(m.key)) return m.key.value;
              return undefined;
            })();
            if (!key) continue;

            let columnOpts: any | undefined = undefined;
            let explicitIndexFromDecorator: any[] = [];
            const mDecos = (m.decorators ?? []) as t.Decorator[];

            for (const d of mDecos) {
              const name = getDecoratorName(d);
              const args = getDecoratorArgs(d);
              if (name === "Column") {
                columnOpts = args[0] && typeof args[0] === "object" ? args[0] : {};
              } else if (name === "Index") {
                explicitIndexFromDecorator.push(args);
              }
            }

            // 记录列
            const resolvedName = (columnOpts?.name as string) ?? key;
            columns.push({
              name: resolvedName,
              ...(columnOpts?.type !== undefined ? { type: columnOpts.type } : {}),
              ...(columnOpts?.required !== undefined ? { required: !!columnOpts.required } : {}),
              ...(columnOpts?.unique !== undefined ? { unique: !!columnOpts.unique } : {}),
              ...(columnOpts?.index !== undefined ? { index: !!columnOpts.index } : {}),
              ...(columnOpts?.default !== undefined ? { default: columnOpts.default } : {}),
            });

            // 列上隐式索引（Column.index/unique）
            if (columnOpts?.index || columnOpts?.unique) {
              const fields = [{ field: resolvedName, order: "asc" as const }];
              fieldLevelIndexes.push({
                name: defaultIndexName(fields),
                fields,
                ...(columnOpts?.unique ? { unique: true } : {}),
              });
            }

            // 列上显式 @Index(...)
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
              const name = idxName ?? defaultIndexName(fields);
              fieldLevelIndexes.push({
                name,
                fields,
                ...(idxUnique !== undefined ? { unique: !!idxUnique } : {}),
                ...(idxTTL !== undefined ? { ttlSeconds: idxTTL } : {}),
              });
            }
          }
        }

        // 解析类级 @Index(...)
        const classLevelIndexes: PrintableSchema["indexes"] = [];
        for (const d of decorators) {
          const name = getDecoratorName(d);
          if (name !== "Index") continue;
          const args = getDecoratorArgs(d);

          let idxName: string | undefined;
          let idxFields: any;
          let idxUnique: boolean | undefined;
          let idxTTL: number | undefined;

          if (args.length === 0) continue; // 类级必须提供字段
          else if (typeof args[0] === "string") {
            idxName = args[0];
            idxFields = args[1] ?? [];
          } else if (typeof args[0] === "object") {
            idxName = args[0].name;
            idxFields = args[0].fields ?? [];
            idxUnique = args[0].unique;
            idxTTL = args[0].ttlSeconds;
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

        // 合并索引并去重
        const allIndexes = [...fieldLevelIndexes, ...classLevelIndexes];
        const dedup = new Map<string, PrintableSchema["indexes"][number]>();
        for (const ix of allIndexes) {
          const key = indexKey(ix.name, ix.fields);
          if (!dedup.has(key)) dedup.set(key, ix);
        }

        // 生成最终 schema
        const printable: PrintableSchema = {
          entityName: (entityOpts?.name as string) ?? entityName,
          ...(entityOpts?.namespace !== undefined ? { namespace: entityOpts.namespace } : {}),
          ...(entityOpts?.ttlSeconds !== undefined ? { ttlSeconds: entityOpts.ttlSeconds } : {}),
          ...(entityOpts?.versioned !== undefined ? { versioned: entityOpts.versioned } : {}),
          columns,
          indexes: Array.from(dedup.values()),
        };
        result.push(printable);
      },
    });
  }
  return result;
}


// 不加路径注释：示例用法
// import { extractSchemasFromSources } from "../lib/serverless/browser_schema_extractor";

// // 你已有的数据：[{ filepath: "/x/user.entity.ts", content: "..." }, ...]
// const sources = downloadedPairs.map(([filepath, content]) => ({ filepath, content }));

// const schemas = extractSchemasFromSources(sources);
// console.log(JSON.stringify(schemas, null, 2));