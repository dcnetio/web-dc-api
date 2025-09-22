// 按需动态加载 Babel 依赖，局部提供最小 env，避免污染全局与打包差异问题
export async function loadBabel() {
  if (!(globalThis as any).process) {
    (globalThis as any).process = { env: {} };
  }

  const [{ parse }, tMod, trvMod] = await Promise.all([
    import("@babel/parser"),
    import("@babel/types"),
    import("@babel/traverse"),
  ]);

  // 运行时 types
  const t = tMod as any;

  // 规范化 traverse（适配不同打包形态：函数/默认导出/具名导出）
  const traverse: (node: any, visitors: any) => void =
    (trvMod as any).default?.default
    ?? (trvMod as any).default
    ?? (trvMod as any).traverse
    ?? (trvMod as any);

  return { parse, t, traverse };
}