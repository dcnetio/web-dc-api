export async function loadBabel() {
  if (!(globalThis as any).process) {
    (globalThis as any).process = { env: {} };
  }

  const [parserMod, typesMod, traverseMod] = await Promise.all([
    import("@babel/parser"),
    import("@babel/types"),
    import("@babel/traverse"),
  ]);

  // 规范化 parser.parse（兼容多种打包形态）
  const parse =
    (parserMod as any).parse ??
    (parserMod as any).default?.parse ??
    (parserMod as any).default; // 有些打包器把默认导出直接设为 parse

  if (typeof parse !== "function") {
    console.error("parserMod keys:", Object.keys(parserMod));
    throw new Error("Failed to resolve @babel/parser.parse as a function");
  }

  // types：有的环境在 default 下
  const t = (typesMod as any).default ?? typesMod;

  // 规范化 traverse
  const traverse: (node: any, visitors: any) => void =
    (traverseMod as any).default?.default ??
    (traverseMod as any).default ??
    (traverseMod as any).traverse ??
    (traverseMod as any);

  if (typeof traverse !== "function") {
    console.error("traverseMod keys:", Object.keys(traverseMod));
    throw new Error("Failed to resolve @babel/traverse as a function");
  }

  return { parse, t, traverse };
}