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
    // Replace $root.net.pb.ClassName.Something -> ClassName.Something
    const nestedRegex = new RegExp(`\\$root\\.net\\.pb\\.${cls}\\.`, 'g');
    newContent = newContent.replace(nestedRegex, `${cls}.`);
    
    // Also $root.net.pb.ClassName( -> ClassName(  (constructors)
    const ctorRegex = new RegExp(`new \\$root\\.net\\.pb\\.${cls}\\(`, 'g');
    newContent = newContent.replace(ctorRegex, `new ${cls}(`);
    
    // instanceof checks
    const instanceOfRegex = new RegExp(`instanceof \\$root\\.net\\.pb\\.${cls}`, 'g');
    newContent = newContent.replace(instanceOfRegex, `instanceof ${cls}`);
});

// For remaining cross-references, use pb.X
newContent = newContent.replace(/\$root\.net\.pb\./g, 'pb.');

if (content !== newContent) {
  fs.writeFileSync(filePath, newContent);
  console.log('Successfully patched lib/implements/threaddb/pb/net_pb.js');
} else {
  console.log('No changes needed for lib/implements/threaddb/pb/net_pb.js');
}
