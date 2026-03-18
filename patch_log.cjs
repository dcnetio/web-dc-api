const fs = require('fs');
const file = './lib/implements/threaddb/cbor/event.ts';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /const eventObj = \(eNode as any\)\._obj as EventObj;\n    if \(!eventObj \|\| !eventObj\.header\) {\n      throw new Error\("Invalid EventObj: missing header"\);\n    }/,
  `const eventObj = (eNode as any)._obj as any;\n    if (!eventObj || !eventObj.header) {\n      console.error("Invalid EventObj content:", eventObj);\n      throw new Error("Invalid EventObj: missing header");\n    }`
);
fs.writeFileSync(file, content);
