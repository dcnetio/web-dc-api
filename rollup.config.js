// dcapi/rollup.config.js  
import resolve from '@rollup/plugin-node-resolve';  
import commonjs from '@rollup/plugin-commonjs';  
import typescript from '@rollup/plugin-typescript';  

export default {  
  input: 'lib/index.ts',  
  output: [  
    {  
      file: 'dist/index.js',  
      format: 'esm',  
      sourcemap: true  
    },  
    {  
      file: 'dist/index.cjs',  
      format: 'cjs',  
      sourcemap: true  
    }  
  ],  
  plugins: [  
    resolve({ browser: true }),  
    commonjs(),  
    typescript()  
  ],  
  // 标记这些是外部依赖，不打包进库  
  "exclude": ["node_modules", "**/*.test.ts", "dist"]  
};  