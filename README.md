1. node_modules/multiformats 修改
   dist/src/hashes 替换文件 sha1-browser.js sha2-browser.js
   src/hashes 替换文件 sha1-browser.ts sha2-browser.ts
2. node_modules/@libp2p
   webtransport/package.json browser 去掉"./dist/src/webtransport.js": "./dist/src/webtransport.browser.js"
3. node_modules/.vite 文件夹删除