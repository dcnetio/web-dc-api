const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/implements/threaddb/pb/net_pb.js');

if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Replace global root references with local references to fix "undefined" errors
// when $root is not fully populated at runtime.
let newContent = content;

const classes = [
    'Log',
    'GetLogsRequest',
    'GetLogsReply',
    'PushLogRequest',
    'PushLogReply',
    'GetRecordsRequest',
    'GetRecordsReply',
    'PushRecordRequest',
    'PushRecordReply',
    'ExchangeEdgesRequest',
    'ExchangeEdgesReply'
];

classes.forEach(cls => {
    // Replace $root.net.pb.ClassName.Something -> pb.ClassName.Something
    // We use pb.ClassName because these are cross-references between classes in the same module
    const nestedRegex = new RegExp(`\\$root\\.net\\.pb\\.${cls}\\.`, 'g');
    newContent = newContent.replace(nestedRegex, `pb.${cls}.`);
    
    // Also $root.net.pb.ClassName( -> pb.ClassName(  (constructors)
    const ctorRegex = new RegExp(`new \\$root\\.net\\.pb\\.${cls}\\(`, 'g');
    newContent = newContent.replace(ctorRegex, `new pb.${cls}(`);
    
    // instanceof checks
    const instanceOfRegex = new RegExp(`instanceof \\$root\\.net\\.pb\\.${cls}`, 'g');
    newContent = newContent.replace(instanceOfRegex, `instanceof pb.${cls}`);
});

// For remaining cross-references, use pb.X
newContent = newContent.replace(/\$root\.net\.pb\./g, 'pb.');

if (content !== newContent) {
  fs.writeFileSync(filePath, newContent);
  console.log('Successfully patched lib/implements/threaddb/pb/net_pb.js');
} else {
  console.log('No changes needed for lib/implements/threaddb/pb/net_pb.js');
}
