const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

// Replace standard "return 404" with an upsert logic for endpoints we know use id: string
const pattern = /const (updated|b) = await db\.update\(([\w]+)\)\.set\(([\s\S]*?)\)\.where\(eq\(\2\.id,\s*req\.params\.id\)\)\.returning\(\);\s*if \(\1\.length === 0\) return res\.status\(404\)\.json\(\{error: "Not Found"\}\); res\.json\(\1\[0\]\);/g;

code = code.replace(pattern, (match, varName, tableName, setLogic) => {
    // If it's the `users` table or `sysRoles` whatever where id is serial, we skip
    // Wait, sysRoles uses text id. users uses serial.
    if (tableName === 'users' || tableName === 'clinicalRecords' || tableName === 'appStates') return match;

    // For other tables, try to insert if 0 rows updated
    return `let updatedRes = await db.update(${tableName}).set(${setLogic}).where(eq(${tableName}.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(${tableName}).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);`;
});

fs.writeFileSync('server.ts', code);
