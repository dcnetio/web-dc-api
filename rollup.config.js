import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";

import dts from "rollup-plugin-dts";
import pkg from "./package.json" assert { type: "json" };

// 外部依赖（这些将不会被打包进最终文件）
const external = [
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  // 🔧 移除可能有问题的库，让它们被打包进来
  // 如果 uint8arrays 在 external 中，需要将其移除
].filter((dep) => !["uint8arrays", "multiformats"].includes(dep));

console.log("NODE_ENV:", process.env.NODE_ENV);

const basePlugins = [
  replace({
    __IS_PROD__: true,
    preventAssignment: true,
  }),
  json(),
  babel({
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/preset-env",
        {
          targets: ">0.25%, not dead, not IE 11",
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
    ],
    extensions: [".js", ".ts"],
  }),
];

const compressionPlugin = terser({
  compress: {
    drop_console: true,
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
  // 🔧 确保正确解析这些有问题的库
  dedupe: ["uint8arrays", "multiformats"],
});

// 🔧 优化的 commonjs 配置
const getCommonJSConfig = () => ({
  transformMixedEsModules: true,
  // 🔧 显式包含可能有问题的库
  include: [
    "node_modules/**",
    "node_modules/uint8arrays/**",
    "node_modules/multiformats/**",
  ],
  // 🔧 确保正确处理命名导出
  namedExports: {
    uint8arrays: ["concat", "toString", "fromString", "equals"],
    "multiformats/bases/base16": ["base16"],
    "multiformats/bases/base32": ["base32"],
    "multiformats/bases/base58": ["base58btc"],
    "multiformats/bases/base64": ["base64"],
  },
});

export default [
  // ESM格式 - 优化的代码拆分
  {
    input: "lib/index.ts",
    output: {
      dir: "dist/esm",
      format: "esm",
      sourcemap: false,
      chunkFileNames: "chunks/[name]-[hash].js",
      entryFileNames: "index.js",
      preserveModules: false,
      // 🔧 优化的手动拆分策略
      manualChunks: (id) => {
        // 调试信息：查看正在处理的文件
        if (process.env.DEBUG_CHUNKS) {
          console.log("Processing chunk:", id);
        }

        // 处理 node_modules 中的大型依赖
        if (id.includes("node_modules")) {
          // 🔧 将有问题的库单独打包
          if (id.includes("uint8arrays") || id.includes("multiformats")) {
            return "vendor-encoding";
          }

          // Polkadot 相关 - 通常很大
          if (id.includes("@polkadot/")) return "vendor-polkadot";

          // Helia IPFS 相关库群
          if (id.includes("@helia/") || id.includes("helia"))
            return "vendor-helia";

          // P2P网络相关
          if (id.includes("libp2p") || id.includes("@libp2p/"))
            return "vendor-libp2p";

          // Protocol Buffers 相关
          if (id.includes("protobufjs") || id.includes("google-protobuf"))
            return "vendor-protobuf";

          // 其他工具库
          if (id.includes("ajv")) return "vendor-validation";
        }
        // 默认返回null，让Rollup自动决定
        return null;
      },

      // 设置chunk大小警告
      chunkSizeWarningLimit: 500, // 500KB 警告阈值
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
      }),
      ...basePlugins,
      compressionPlugin,
    ],
  },

  // CJS格式 - 单文件
  {
    input: "lib/index.ts",
    output: {
      file: pkg.main,
      format: "cjs",
      sourcemap: false,
      inlineDynamicImports: true,
    },
    external,
    plugins: [
      resolve(getResolveConfig(true)),
      commonjs(getCommonJSConfig()),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        outDir: "dist",
      }),
      ...basePlugins,
      compressionPlugin,
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
  {
    input: "lib/index.ts",
    output: {
      file: "dist/dc.min.js",
      format: "umd",
      name: GLOBAL_NAME,
      sourcemap: false,
      exports: "named",
      intro: `var global = typeof window !== 'undefined' ? window : this;`,
      globals: {
        "grpc-libp2p-client": "GrpcLibp2pClient",
      },
      inlineDynamicImports: true,
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
      }),
      ...basePlugins,
      compressionPlugin,
    ],
  },

  // 开发版本ESM（带调试信息）
  {
    input: "lib/index.ts",
    output: {
      dir: "dist/dev",
      format: "esm",
      sourcemap: true,
      chunkFileNames: "chunks/[name].js",
      entryFileNames: "index.js",
      manualChunks: (id) => {
        // 开发版本使用简化的拆分策略
        if (id.includes("node_modules")) {
          // 🔧 将有问题的库单独打包
          if (id.includes("uint8arrays") || id.includes("multiformats")) {
            return "vendor-encoding";
          }

          if (id.includes("@polkadot/")) return "vendor-polkadot";
          if (id.includes("@helia/") || id.includes("helia"))
            return "vendor-helia";
          if (id.includes("libp2p")) return "vendor-libp2p";

          const packageName = id.split("node_modules/")[1].split("/")[0];
          return `vendor-${packageName.replace("@", "").replace("/", "-")}`;
        }
        return null;
      },
    },
    external,
    plugins: [
      resolve(getResolveConfig(true)),
      commonjs(getCommonJSConfig()),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        outDir: "dist/dev",
      }),
      replace({
        __IS_PROD__: false,
        preventAssignment: true,
      }),
      json(),
    ],
  },
];
