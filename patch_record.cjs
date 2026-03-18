const fs = require('fs');
const file = './lib/implements/threaddb/cbor/record.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const maybe = \(bstore as any\)\.get\(this\._obj\.block\);[\s\S]*?this\._block = await cbornode\.wrapObject\(data\);/,
  `const maybe = await (bstore as any).get(this._obj.block);
    let data;
    if (maybe instanceof Uint8Array) {
      data = maybe;
    } else if (maybe && typeof maybe[Symbol.asyncIterator] === 'function') {
      const chunks = [];
      for await (const ch of maybe) {
        chunks.push(ch);
      }
      data = concat(chunks);
    } else if (maybe && typeof maybe[Symbol.iterator] === 'function') {
      const chunks = [];
      for (const ch of maybe) {
        chunks.push(ch);
      }
      data = concat(chunks);
    } else {
      data = maybe;
    }

    this._block = await cbornode.decode(data);`
);
fs.writeFileSync(file, content);
