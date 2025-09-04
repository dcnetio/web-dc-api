
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: 'json' };

// 外部依赖（这些将不会被打包进最终文件）
const allExternals = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];
// 例外 - 这些依赖必须被打包
const internalDependencies = [
  'buffer', // 必须打包buffer以解决Buffer.from错误
  // 其他...
];

// 最终外部依赖列表
const external = allExternals.filter(dep => !internalDependencies.includes(dep));

console.log('NODE_ENV:', process.env.NODE_ENV);

const basePlugins = [
  // 替换 __DEV__ 变量
  replace({
    __IS_PROD__: true,
    preventAssignment: true
  }),
  json()
];

const productionPlugins = [
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
  })
];

const minifyPlugin = terser({
  compress: {
    drop_console: true,
    drop_debugger: true
  },
  format: {
    comments: false
  },
});

// 全局变量名
const GLOBAL_NAME = 'WebDcApi';

// 为每个构建配置对应的TypeScript选项
const getTsConfig = (outDir) => ({
  tsconfig: './tsconfig.json',
  declaration: false,
  outDir,        // 指定输出目录匹配Rollup
  rootDir: 'lib' // 确保TypeScript知道源代码根目录
});

export default [
  // ESM构建 - 使用代码拆分
  {
    input: {
      index: 'lib/index.ts',
      // 添加额外的入口点 - 根据你的实际模块结构调整
      // 例如，如果你有API模块、工具模块等，可以分别添加
      // api: 'lib/api/index.ts',
      // utils: 'lib/utils/index.ts',
    },
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true, // 保留模块结构
      preserveModulesRoot: 'lib',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      sourcemap: false
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs({
        transformMixedEsModules: true
      }),
      typescript(getTsConfig('dist/esm')), // 匹配Rollup输出目录
      ...basePlugins,
      ...productionPlugins
    ]
  },
  
  // CJS构建 - 使用代码拆分
  {
    input: {
      index: 'lib/index.ts',
      // 根据你的模块结构添加更多入口点
    },
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'lib',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/[name]-[hash].js',
      exports: 'named',
      sourcemap: false
    },
    external,
    plugins: [
      resolve({
        preferBuiltins: false,
        browser: true
      }),
      commonjs({
        transformMixedEsModules: true
      }),
      typescript(getTsConfig('dist/cjs')), // 匹配Rollup输出目录
      ...basePlugins,
      ...productionPlugins
    ]
  },
  
  // 类型定义文件
  {
    input: 'lib/index.ts',
    output: {
      dir: 'dist/types',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'lib'
    },
    plugins: [dts()],
    external
  },
  
  // // UMD构建 - 分块版本
  // {
  //   input: 'lib/index.ts',
  //   output: {
  //     dir: 'dist/umd',
  //     format: 'umd',
  //     name: GLOBAL_NAME,
  //     sourcemap: false,
  //     exports: 'named',
  //     // 拆分成多个文件
  //     entryFileNames: '[name].js',
  //     chunkFileNames: 'chunks/[name]-[hash].js',
  //     // 确保所有导出都正确挂载到全局对象
  //     intro: `var global = typeof window !== 'undefined' ? window : this;`,
  //     globals: {
  //       'grpc-libp2p-client': 'GrpcLibp2pClient'
  //     }
  //   },
  //   external: ['grpc-libp2p-client'],
  //   manualChunks: function(id) {
  //     // 根据模块路径拆分chunks
  //     if (id.includes('node_modules')) {
  //       // 将node_modules依赖分组
  //       const packageName = id.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/)?.[1];
  //       return packageName ? `vendor-${packageName.replace('@', '')}` : 'vendor-other';
  //     }
      
  //     // 根据你的项目结构拆分自己的代码
  //     // 例如，如果lib文件夹下有api、utils等子目录
  //     if (id.includes('/lib/api/')) {
  //       return 'api';
  //     }
  //     if (id.includes('/lib/utils/')) {
  //       return 'utils';
  //     }
      
  //     // 其他模块可以根据实际情况添加更多条件
  //   },
  //   plugins: [
  //     resolve({
  //       browser: true,
  //       preferBuiltins: false,
  //       paths: ['node_modules', '../']
  //     }),
  //     commonjs({
  //       transformMixedEsModules: true,
  //     }),
  //     typescript(getTsConfig('dist/umd')), // 匹配Rollup输出目录
  //     ...basePlugins,
  //     ...productionPlugins,
  //     minifyPlugin
  //   ]
  // },
  
  // 单一UMD文件 (兼容旧版本引用)
  {
    input: 'lib/index.ts',
    output: {
      file: 'dist/dc.min.js',
      format: 'umd',
      name: GLOBAL_NAME,
      sourcemap: false,
      exports: 'named',
      intro: `var global = typeof window !== 'undefined' ? window : this;`,
      globals: {
        'grpc-libp2p-client': 'GrpcLibp2pClient'
      }
    },
    external: ['grpc-libp2p-client'],
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false,
        paths: ['node_modules', '../']
      }),
      commonjs({
        transformMixedEsModules: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false
      }), // 单文件输出不需要指定outDir
      ...basePlugins,
      ...productionPlugins,
      minifyPlugin
    ]
  }
];
