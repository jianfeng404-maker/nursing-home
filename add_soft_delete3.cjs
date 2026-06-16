const fs = require('fs');

// 1. Modify schema.ts
let schemaPath = './src/db/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

// Replace table endings
schema = schema.replace(/(\n}\);\n)/g, ",\n  deletedAt: timestamp('deleted_at'),\n});\n");
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

// Convert deletes to updates
server = server.replace(/await db\.delete\((.+?)\)\.where\((.+?)\);/g, "await db.update($1).set({ deletedAt: new Date() }).where($2);");

// Convert simple selects
server = server.replace(/await db\.select\(\)\.from\(([a-zA-Z0-9_\[\]]+)\)(?!\.where|\.orderBy)/g, "await db.select().from($1).where(isNull($1.deletedAt))");

// Convert selects with OrderBy
server = server.replace(/await db\.select\(\)\.from\(([a-zA-Z0-9_\[\]]+)\)\.orderBy/g, "await db.select().from($1).where(isNull($1.deletedAt)).orderBy");

// Convert selects with where(eq(users.email, email)) and limit
// 1. existingUserCountRes
server = server.replace(/await db\.select\(\)\.from\(users\)\.limit\(1\);/g, "await db.select().from(users).where(isNull(users.deletedAt)).limit(1);");

// 2. existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
server = server.replace(/await db\.select\(\)\.from\(users\)\.where\(eq\(users\.email, email\)\)\.limit\(1\);/g, "await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt))).limit(1);");

// 3. result = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
server = server.replace(/await db\.select\(\)\.from\(users\)\.where\(eq\(users\.id, req\.user\.id\)\)\.limit\(1\);/g, "await db.select().from(users).where(and(eq(users.id, req.user.id), isNull(users.deletedAt))).limit(1);");

// 4. oldElderRes = await db.select().from(elders).where(eq(elders.id, req.params.id)).limit(1);
server = server.replace(/await db\.select\(\)\.from\(elders\)\.where\(eq\(elders\.id, req\.params\.id\)\)\.limit\(1\);/g, "await db.select().from(elders).where(and(eq(elders.id, req.params.id), isNull(elders.deletedAt))).limit(1);");

// 5. existing = await db.select().from(users).where(eq(users.email, username)).limit(1);
server = server.replace(/await db\.select\(\)\.from\(users\)\.where\(eq\(users\.email, username\)\)\.limit\(1\);/g, "await db.select().from(users).where(and(eq(users.email, username), isNull(users.deletedAt))).limit(1);");

fs.writeFileSync(serverPath, server);
console.log('Modified server.ts');
