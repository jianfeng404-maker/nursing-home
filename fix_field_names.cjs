const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

// For admissions POST
code = code.replace(/const \{ name, assessmentLevel, family, phone, idCard, status, progress, roombed, checkinDate \} = req\.body;\s*const newRec = await db\.insert\(admissions\)\.values\(\{([\s\S]*?)\}\)\.returning\(\);/m, `const { name, assessmentLevel, family, phone, idCard, status, progress, roombed } = req.body;
      const newRec = await db.insert(admissions).values({
        id: \`ADM-\${crypto.randomUUID().slice(0, 8)}\`,
        name, assessmentLevel, family, phone, idCard, status, progress, roombed
      }).returning();`);

// For discharges POST
code = code.replace(/const \{ name, date, reason, status, progress, bed \} = req\.body;\s*const newRec = await db\.insert\(discharges\)\.values\(\{([\s\S]*?)\}\)\.returning\(\);/m, `const { name, room, type, reason, applyDate, leaveDate, status, checks, refundAmount } = req.body;
      const parsedRefundAmount = cleanNumericFields({ refundAmount: refundAmount || 0 }).refundAmount;
      const newRec = await db.insert(discharges).values({
        id: \`DIS-\${crypto.randomUUID().slice(0, 8)}\`,
        name, room, type, reason, applyDate, leaveDate, status, checks, refundAmount: parsedRefundAmount
      }).returning();`);

fs.writeFileSync('server.ts', code);
