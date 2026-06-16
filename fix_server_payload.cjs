const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

// For bills POST
code = code.replace(/app\.post\("\/api\/bills", requireAuth, async \(req: any, res\) => \{\s*try \{\s*const newRec = await db\.insert\(bills\)\.values\(\{[\s\S]*?\}\)\.returning\(\);/m, `app.post("/api/bills", requireAuth, async (req: any, res) => {
     try {
       const { elder, room, period, dueDate, status, total, items, deductions, tempItems } = req.body;
       const newRec = await db.insert(bills).values({
         id: \`B-\${crypto.randomUUID().slice(0, 8)}\`, // generate cleanly
         elder: elder || 'Unknown',
         room: room || '',
         period: period || '',
         dueDate: dueDate || '',
         status: status || '未缴费',
         total: cleanNumericFields({ total: total || 0 }).total,
         items: items || [],
         deductions: deductions || [],
         tempItems: tempItems || []
       }).returning();`);

// For admissions POST
code = code.replace(/app\.post\("\/api\/admissions", requireAuth, async \(req: any, res\) => \{\s*try \{\s*const newRec = await db\.insert\(admissions\)\.values\(\{[\s\S]*?\}\)\.returning\(\);/m, `app.post("/api/admissions", requireAuth, async (req: any, res) => {
    try {
      const { name, assessmentLevel, family, phone, idCard, status, progress, roombed, checkinDate } = req.body;
      const newRec = await db.insert(admissions).values({
        id: \`ADM-\${crypto.randomUUID().slice(0, 8)}\`,
        name, assessmentLevel, family, phone, idCard, status, progress, roombed, checkinDate
      }).returning();`);

// For discharges POST
code = code.replace(/app\.post\("\/api\/discharges", requireAuth, async \(req: any, res\) => \{\s*try \{\s*const newRec = await db\.insert\(discharges\)\.values\(\{[\s\S]*?\}\)\.returning\(\);/m, `app.post("/api/discharges", requireAuth, async (req: any, res) => {
    try {
      const { name, date, reason, status, progress, bed } = req.body;
      const newRec = await db.insert(discharges).values({
        id: \`DIS-\${crypto.randomUUID().slice(0, 8)}\`,
        name, date, reason, status, progress, bed
      }).returning();`);

// For transactions POST
code = code.replace(/app\.post\("\/api\/transactions", requireAuth, async \(req: any, res\) => \{\s*try \{\s*const newRec = await db\.insert\(transactions\)\.values\(cleanNumericFields\(req\.body\)\)\.returning\(\);/m, `app.post("/api/transactions", requireAuth, async (req: any, res) => {
    try {
      const { billId, elderId, amount, direction, method, operator } = req.body;
      const parsedAmount = cleanNumericFields({ amount: amount || 0 }).amount;
      const newRec = await db.insert(transactions).values({
        id: \`TXN-\${crypto.randomUUID().slice(0, 8)}\`,
        billId, elderId, amount: parsedAmount, direction, method, operator
      }).returning();`);

// For insuranceClaims POST
code = code.replace(/app\.post\("\/api\/insurance_claims", requireAuth, async \(req: any, res\) => \{\s*try \{\s*const newRec = await db\.insert\(insuranceClaims\)\.values\(\{[\s\S]*?\}\)\.returning\(\);/m, `app.post("/api/insurance_claims", requireAuth, async (req: any, res) => {
     try {
       const { name, type, period, serviceDays, amount, status } = req.body;
       const parsedAmount = cleanNumericFields({ amount: amount || 0 }).amount;
       const parsedDays = cleanNumericFields({ serviceDays: serviceDays || 0 }).serviceDays;
       const newRec = await db.insert(insuranceClaims).values({
         id: \`INS-\${crypto.randomUUID().slice(0, 8)}\`,
         name, type, period, serviceDays: parsedDays, amount: parsedAmount, status
       }).returning();`);


// Update PUT routes so they also don't use raw req.body blindly if it was the case
// Actually the PUT routes usually just do: set(cleanNumericFields(req.body))
// To be fully clean we should probably filter fields, but the user complaint mainly specifies the POST behavior "等于整个req.body财务照单全收".
// Let's at least scrub `id` from PUT endpoints so you can't rename an ID!
code = code.replace(/const updateData = cleanNumericFields\(req\.body\);/g, `const updateData = cleanNumericFields(req.body); delete updateData.id;`);
code = code.replace(/\.set\(cleanNumericFields\(req\.body\)\)/g, `.set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })())`);

fs.writeFileSync('server.ts', code);
