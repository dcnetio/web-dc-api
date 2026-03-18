const fs = require('fs');
const file = './lib/implements/threaddb/cbor/event.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const eventObj = \(eNode as any\)\._obj as any;\n    if \(!eventObj \|\| !eventObj\.header\) {\n      console\.error\("Invalid EventObj content:", eventObj\);\n      throw new Error\("Invalid EventObj: missing header"\);\n    }/,
  `const rawObj = (eNode as any)._obj as any;\n    const eventObj = {\n      header: rawObj.header || rawObj.Header,\n      body: rawObj.body || rawObj.Body\n    } as EventObj;\n    if (!eventObj || !eventObj.header) {\n      console.error("Invalid EventObj content:", rawObj);\n      throw new Error("Invalid EventObj: missing header");\n    }`
);

fs.writeFileSync(file, content);
