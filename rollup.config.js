import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';


import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

const tsconfig = {
  tsconfig: './tsconfig.json',
  declaration: false,
};

// 外部依赖（这些将不会被打包进最终文件）
const external = [
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];
console.log('NODE_ENV:', process.env.NODE_ENV);
const plugins = [
      // 替换 __DEV__ 变量
      replace({
        __IS_PROD__: true,
        preventAssignment: true
      }),
      json(),
      typescript(tsconfig),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            // 指定目标浏览器
            targets: ">0.25%, not dead, not IE 11",
            // 按需引入 polyfill
            useBuiltIns: 'usage',
            corejs: 3
          }]
        ],
        // 确保处理 .ts 文件
        extensions: ['.js', '.ts']
      }),
      terser({
        // 暂时去掉混淆
        // mangle: {
        //   toplevel: true, // 混淆顶层变量和函数名
        // },
        compress: {
          drop_console: true, // 移除console
          drop_debugger: true // 移除debugger
        },
        format: {
          comments: false // 移除注释
        },
      }),
    ];

// 全局变量名
const GLOBAL_NAME = 'WebDcApi';

export default [
  // 原有的ESM和CJS构建
  {
    input: 'lib/index.ts',
    output: [
      {
      //  file: pkg.module, // ESM格式
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: false,
        inlineDynamicImports: true
      },
      {
        // file: pkg.main, // CJS格式
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap: false,
        inlineDynamicImports: true
      }
    ],
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs({
        transformMixedEsModules: true
      }),
      ...plugins,
    ],
    inlineDynamicImports: true
  },
  
  // 类型定义文件
  {
    input: 'lib/index.ts',
    output: {
      file: pkg.types,
      format: 'es',
      inlineDynamicImports: true
    },
    plugins: [dts()],
    external,
  },
  
  // 压缩版本
  {
    input: 'lib/index.ts',
    output: {
      file: 'dist/dc.min.js', // 未压缩版本
      format: 'umd',
      name: GLOBAL_NAME,
      sourcemap: false,
      exports: 'named',
      // 确保所有导出都正确挂载到全局对象
      intro: `var global = typeof window !== 'undefined' ? window : this;`,
      globals: {
        // 明确告诉 Rollup 本地包的全局变量名
        'grpc-libp2p-client': 'GrpcLibp2pClient'
      },
      inlineDynamicImports: true
    },
    // 注意：浏览器版本应该包含所有依赖（除非是全局可用的）
    // external: [], // 不设置external，以便捆绑所有依赖
    external: ['grpc-libp2p-client'], // 设为外部依赖
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
        // 包括node_modules和上级目录
        paths: ['node_modules', '../']
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      ...plugins,
    ],
  }
];