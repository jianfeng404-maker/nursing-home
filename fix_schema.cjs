const fs = require('fs');
let schemaPath = './src/db/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

// remove all deletedAt completely
schema = schema.replace(/,\s*deletedAt:\s*timestamp\('deleted_at'\)/g, "");
schema = schema.replace(/,\s*deletedAt:\s*text\('deleted_at'\)/g, "");

// remove any consecutive commas
schema = schema.replace(/,,+/g, ",");

// Fix lines that end with comma before });
// We can just append the deletedAt explicitly
schema = schema.replace(/(\n}\);)/g, ",\n  deletedAt: timestamp('deleted_at'),\n});");

// Now we need to remove ',,\n' or ',\n,\n'
schema = schema.replace(/,\s*,/g, ",");

fs.writeFileSync(schemaPath, schema);
console.log('Fixed schema.ts');
