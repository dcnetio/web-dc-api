import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import inject from "@rollup/plugin-inject";

import dts from "rollup-plugin-dts";
import fs from "fs";
import { fileURLToPath } from "url";

// Read package.json without using import assertions to avoid loader issues
const __dirname = fileURLToPath(new URL("./", import.meta.url));
const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url), "utf8"),
);

// 外部依赖（这些将不会被打包进最终文件）
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  // 注意：如果你需要 uint8arrays 被打包，请确保它不在这些列表中，或者手动从 external 数组中过滤掉
];

console.log("NODE_ENV:", process.env.NODE_ENV);
const isProduction = process.env.NODE_ENV === "production";

const basePlugins = [
  // 🔧 添加 process polyfill
  inject({
    process: "process",
  }),
  replace({
    preventAssignment: true,
  }),
  json(),
  babel({
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            esmodules: true,
          },
          modules: false,
        },
      ],
    ],
  }),
  [("@babel/plugin-proposal-class-properties", { loose: true })],
];

// 🔧 UMD 专用压缩配置 (仅用于 CDN .min.js 版本)
const umdCompressionPlugin = terser({
  compress: {
    drop_console: ["debug", "trace"], // 保留 info/warn/error
    drop_debugger: true,
  },
  format: {
    comments: false,
  },
});

// 全局变量名
const GLOBAL_NAME = "WebDcApi";

// 🔧 优化的 resolve 配置
const getResolveConfig = (isBrowser = true) => ({
  preferBuiltins: false,
  browser: isBrowser,
  // 🔧 添加导出条件，帮助正确解析模块
  exportConditions: isBrowser
    ? ["browser", "import", "module", "default"]
    : ["import", "module", "default"],
  // 🔧 确保正确解析 uint8arrays
  dedupe: ["uint8arrays"],
});

// 🔧 优化的 commonjs 配置
const getCommonJSConfig = () => ({
  transformMixedEsModules: true,
  // include: ["node_modules/**"],
  // 🔧 确保 uint8arrays 的所有导出都被正确处理
  namedExports: {
    uint8arrays: [
      "fromString",
      "toString",
      "concat",
      "equals",
      "compare",
      "xor",
      "alloc",
    ],
    "uint8arrays/from-string": ["fromString"],
    "uint8arrays/to-string": ["toString"],
    "uint8arrays/concat": ["concat"],
    "uint8arrays/equals": ["equals"],
  },
  // 🔧 强制转换这些模块
  requireReturnsDefault: "auto",
});

// 高级优化策略
const manualChunks = (id) => {
  // 调试信息：查看正在处理的文件
  if (!id.includes("node_modules")) return null;

  const pathParts = id.split("node_modules/")[1].split("/");
  const packageName = pathParts[0].startsWith("@")
    ? `${pathParts[0]}/${pathParts[1]}`
    : pathParts[0];

  // 🔧 只分离最大的、最独立的包
  const largeIndependentPackages = {
    "polkadot-api": ["@polkadot/api"],
    protobuf: ["protobufjs"],
    "helia-core": ["helia"], // 只分离核心，插件保留在主包
    "babel-tools": ["@babel/parser", "@babel/traverse"], // Babel 工具
    // 🔧 可以安全添加的大包（相对独立）
    validation: ["ajv"], // JSON Schema 验证，相对独立
    jwt: ["jose"], // JWT 库，相对独立
    cache: ["lru-cache"], // 缓存库，独立
  };

  for (const [chunkName, packages] of Object.entries(
    largeIndependentPackages,
  )) {
    if (packages.some((pkg) => packageName.includes(pkg))) {
      return chunkName;
    }
  }

  return null; // 其他所有包都保留在主 chunk
};

export default [
  // ESM格式 - 优化的代码拆分
  // ⚠️ 变更：开启 SourceMap，关闭压缩
  {
    input: "lib/index.ts",
    output: {
      dir: "dist/esm",
      format: "es",
      sourcemap: true, // ✅ 开启 Source Map
      sourcemapPathTransform: (relativeSourcePath) => {
        return relativeSourcePath;
      },
      chunkFileNames: "chunks/[name]-[hash].js",
      entryFileNames: "index.js",
      // 🔧 优化的手动拆分策略
      manualChunks,
      // 设置chunk大小警告
      chunkSizeWarningLimit: 500, // 500KB 警告阈值
      exports: "auto",
    },
    external,
    plugins: [
      resolve(getResolveConfig(true)),
      commonjs(getCommonJSConfig()),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        outDir: "dist/esm",
        sourceMap: true, // ✅ 确保 TS 编译生成 Map
      }),
      ...basePlugins,
      // compressionPlugin, // ❌ ESM 版本不压缩，方便调试
    ],
  },

  // CJS格式 - 单文件
  // ⚠️ 变更：开启 SourceMap，关闭压缩
  {
    input: "lib/index.ts",
    output: {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true, // ✅ 开启 Source Map
      manualChunks,
      // 设置chunk大小警告
      chunkSizeWarningLimit: 500, // 500KB 警告阈值
      exports: "auto",
    },
    external,
    plugins: [
      resolve(getResolveConfig(true)),
      commonjs(getCommonJSConfig()),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        outDir: "dist/cjs",
        sourceMap: true, // ✅ 确保 TS 编译生成 Map
      }),
      ...basePlugins,
      // compressionPlugin, // ❌ CJS 版本不压缩
    ],
  },

  // 类型定义文件
  {
    input: "lib/index.ts",
    output: {
      file: pkg.types,
      format: "es",
      inlineDynamicImports: true,
    },
    plugins: [
      dts({
        tsconfig: "./tsconfig.json",
      }),
    ],
    external,
  },

  // UMD格式
  // ⚠️ 变更：开启 SourceMap (虽然会被压缩，但有 Map 文件)
  {
    input: "lib/index.ts",
    output: {
      file: "dist/dc.min.js",
      format: "umd",
      name: GLOBAL_NAME,
      sourcemap: true, // ✅ 开启 Source Map
      exports: "named",
      intro: `var global = typeof window !== 'undefined' ? window : this;`,
      globals: {
        "grpc-libp2p-client": "GrpcLibp2pClient",
      },
      inlineDynamicImports: true,
      exports: "auto",
    },
    external: ["grpc-libp2p-client"],
    plugins: [
      resolve({
        ...getResolveConfig(true),
        paths: ["node_modules", "../"],
      }),
      commonjs(getCommonJSConfig()),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        outDir: "dist",
        sourceMap: true, // ✅ 确保 TS 编译生成 Map
      }),
      ...basePlugins,
      umdCompressionPlugin, // ✅ 只在 UMD/Min 版本保留强压缩
    ],
  },
];