const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

// The pattern is:
// const b = await db.update(...).returning();
// res.json(b[0] || {});
// This occurs in the dbMap foreach loop and in some endpoints like /api/schedules.

code = code.replace(/const b = await db\.update\(([^)]+)\)[\s\S]*?returning\(\);\s*res\.json\(\s*b\[0\]\s*\|\|\s*\{\}\s*\);/gm, (match) => {
    return match.replace(/res\.json\(\s*b\[0\]\s*\|\|\s*\{\}\s*\);/, `if (b.length === 0) return res.status(404).json({error: "Not Found"}); res.json(b[0]);`);
});

// Also fix `res.json(updated[0] || {});` or similar in case anything uses `updated`.
code = code.replace(/const updated = await db\.update\(([^)]+)\)[\s\S]*?returning\(\);\s*res\.json\(\s*updated\[0\]\s*\|\|\s*\{\}\s*\);/gm, (match) => {
    return match.replace(/res\.json\(\s*updated\[0\]\s*\|\|\s*\{\}\s*\);/, `if (updated.length === 0) return res.status(404).json({error: "Not Found"}); res.json(updated[0]);`);
});
code = code.replace(/const updated = await db\.update\(([^)]+)\)[\s\S]*?returning\(\);\s*res\.json\(\s*updated\[0\]\s*\);/gm, (match) => {
    return match.replace(/res\.json\(\s*updated\[0\]\s*\);/, `if (updated.length === 0) return res.status(404).json({error: "Not Found"}); res.json(updated[0]);`);
});
code = code.replace(/const newRec = await db\.update\(([^)]+)\)[\s\S]*?returning\(\);\s*res\.json\(\s*newRec\[0\]\s*\|\|\s*\{\}\s*\);/gm, (match) => {
    return match.replace(/res\.json\(\s*newRec\[0\]\s*\|\|\s*\{\}\s*\);/, `if (newRec.length === 0) return res.status(404).json({error: "Not Found"}); res.json(newRec[0]);`);
});

// Specifically, some returns look like `res.json(updated[0])` or `res.json(b[0])` directly, which returns `undefined` successfully.
// Let's globally replace `const (\w+) = await db\.update(.*)\.returning\(\);\s*res\.json\(\1\[0\]\);`
code = code.replace(/const (\w+) = await db\.update(.*)\.returning\(\);\s*res\.json\(\1\[0\]\);/g, `const $1 = await db.update$2.returning();\n          if ($1.length === 0) return res.status(404).json({error: "Not Found"});\n          res.json($1[0]);`);

// Double check /api/bills, /api/admissions, /api/transactions to make sure their POST endpoints don't allow arbitrary ID injection or status injection.

fs.writeFileSync('server.ts', code);
