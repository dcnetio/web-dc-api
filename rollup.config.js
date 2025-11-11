import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { visualizer } from "rollup-plugin-visualizer";
import dts from "rollup-plugin-dts";
import pkg from "./package.json" assert { type: "json" };

const tsconfig = {
  tsconfig: "./tsconfig.json",
  declaration: false,
};

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
];

const isProduction = process.env.NODE_ENV === "production";

const plugins = [
  replace({
    __IS_PROD__: isProduction,
    preventAssignment: true,
  }),
  json(),
  typescript(tsconfig),
  babel({
    babelHelpers: "bundled",
    presets: [
      [
        "@babel/preset-env",
        {
          targets: "defaults, not IE 11", // 更现代的目标浏览器
          useBuiltIns: "usage",
          corejs: 3,
          modules: false, // 让 Rollup 处理模块
        },
      ],
    ],
    extensions: [".js", ".ts"],
    // 排除 core-js 导入，让 Rollup 处理
    exclude: "node_modules/core-js/**",
  }),
  isProduction &&
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    }),
  // 添加包分析工具
  // visualizer({
  //   filename: "bundle-analysis.html",
  //   open: true,
  //   gzipSize: true,
  // }),
].filter(Boolean);

// 为 UMD 构建创建全局变量映射
const getGlobals = () => {
  const globals = {
    "grpc-libp2p-client": "GrpcLibp2pClient",
  };

  // 为常见库添加全局变量映射
  const commonLibs = {
    lodash: "_",
    react: "React",
    "react-dom": "ReactDOM",
    axios: "axios",
    // 添加您项目中其他常见库的映射
  };

  Object.keys(pkg.dependencies || {}).forEach((dep) => {
    if (commonLibs[dep]) {
      globals[dep] = commonLibs[dep];
    }
  });

  return globals;
};

export default [
  {
    input: "lib/index.ts",
    output: [
      {
        file: pkg.module,
        format: "esm",
        sourcemap: !isProduction,
        inlineDynamicImports: true,
      },
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: !isProduction,
        inlineDynamicImports: true,
      },
    ],
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      ...plugins,
    ],
  },

  {
    input: "lib/index.ts",
    output: {
      file: pkg.types,
      format: "es",
      inlineDynamicImports: true,
    },
    plugins: [dts()],
    external,
  },

  {
    input: "lib/index.ts",
    output: {
      file: "dist/dc.min.js",
      format: "umd",
      name: "WebDcApi",
      sourcemap: !isProduction,
      exports: "named",
      globals: getGlobals(),
      inlineDynamicImports: true,
    },
    external: external.filter((dep) => dep !== "core-js"), // 确保 core-js 被打包
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      ...plugins,
    ],
  },
];
