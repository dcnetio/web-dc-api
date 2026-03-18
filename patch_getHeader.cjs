const fs = require('fs');
const file = 'lib/implements/threaddb/cbor/event.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /throw new Error\(\n\s*`Failed to decode header: \${\n\s*err instanceof Error \? err\.message : String\(err\)\n\s*}`\n\s*\);/g,
  `throw err;`
);

fs.writeFileSync(file, code);
