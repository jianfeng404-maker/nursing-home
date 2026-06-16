const fs = require('fs');

// 1. Modify schema.ts
let schemaPath = './src/db/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

// replace the end of pgTable definitions to include deletedAt
schema = schema.replace(/(\n}\);\n)/g, ",\n  deletedAt: timestamp('deleted_at'),\n});\n");

// If any table missed it (because no trailing newline), we handle it:
schema = schema.replace(/(\n})\);/g, ",\n  deletedAt: timestamp('deleted_at'),\n});");

fs.writeFileSync(schemaPath, schema);
console.log('Modified schema.ts');

// 2. Modify server.ts
let serverPath = './server.ts';
let server = fs.readFileSync(serverPath, 'utf8');

// Ensure isNull and and are imported from drizzle-orm
if (!server.includes('isNull')) {
  server = server.replace(/import { eq(.+?) } from 'drizzle-orm';/, "import { eq$1, isNull, and } from 'drizzle-orm';");
}
if (!server.includes('and')) {
    server = server.replace(/import { eq(.+?)isNull(.+?) } from 'drizzle-orm';/, "import { eq$1isNull$2, and } from 'drizzle-orm';");
}


// Replace db.delete(table).where(...) with db.update(table).set({ deletedAt: new Date() }).where(...)
server = server.replace(/await db\.delete\((.+?)\)\.where\((.+?)\);/g, "await db.update($1).set({ deletedAt: new Date() }).where($2);");

// Now handle db.select
// For db.select().from(table) without where:
server = server.replace(/await db\.select\(\)\.from\(([a-zA-Z0-9_\[\]]+)\)(?!(\.where|\.orderBy))/g, "await db.select().from($1).where(isNull($1.deletedAt))");

// For db.select().from(table).orderBy(...):
server = server.replace(/await db\.select\(\)\.from\(([a-zA-Z0-9_\[\]]+)\)\.orderBy/g, "await db.select().from($1).where(isNull($1.deletedAt)).orderBy");

// For db.select().from(table).where(condition) -> we need to add 'and(..., isNull(table.deletedAt))'
// Wait, regex might fail on nested parentheses. Let's do a simple string replace for known patterns:
let lines = server.split('\n');
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];

  if (line.includes('db.select().from(') && line.includes('.where(')) {
     // match await db.select().from(tableName).where(eq(...)).limit(1)
     let m = line.match(/(await db\.select\(\)\.from\((.+?)\)\.where\()(.+?)\)(.*)/);
     if (m) {
       let prefix = m[1]; // await db.select().from(tableName).where(
       let tableName = m[2]; // tableName (might be dbMap[resource])
       let content = m[3]; // eq(elders.id, req.params.id)
       // Check if content already ends with parenthesis, we might need a parser or just a simple split.
       // Actually drizzle's where takes a condition object. We can just construct and(content, isNull(tableName.deletedAt)).
       // Wait, m[3] captures up to the FIRST `)`, which will break `eq(a, b)`. We need greedier or parser.
     }
  }
}

fs.writeFileSync(serverPath, server);
console.log('Modified server.ts (partially)');
