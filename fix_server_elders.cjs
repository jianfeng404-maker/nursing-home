const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const replacement = `
  app.put("/api/elders/:id", requireAuth, async (req, res) => {
    try {
       const oldElderRes = await db.select().from(elders).where(eq(elders.id, req.params.id)).limit(1);
       if (oldElderRes.length === 0) return res.status(404).json({error: "Elder not found"});
       const oldElder = oldElderRes[0];

       const updated = await db.update(elders).set(cleanNumericFields(req.body)).where(eq(elders.id, req.params.id)).returning();
       const newElderName = updated[0].name;

       if (newElderName !== oldElder.name) {
           await db.update(tasks).set({ elder: newElderName }).where(eq(tasks.elder, oldElder.name));
           await db.update(bills).set({ elder: newElderName }).where(eq(bills.elder, oldElder.name));
           await db.update(insuranceClaims).set({ name: newElderName }).where(eq(insuranceClaims.name, oldElder.name));
           await db.update(admissions).set({ name: newElderName }).where(eq(admissions.name, oldElder.name));
           await db.update(discharges).set({ name: newElderName }).where(eq(discharges.name, oldElder.name));
           await db.update(rounds).set({ elder: newElderName }).where(eq(rounds.elder, oldElder.name));
           await db.update(rehabPlans).set({ elder: newElderName }).where(eq(rehabPlans.elder, oldElder.name));
           await db.update(clinicalRecords).set({ elderName: newElderName }).where(eq(clinicalRecords.elderId, oldElder.id));
           await db.update(careRecords).set({ elderName: newElderName }).where(eq(careRecords.elderId, oldElder.id));
       }
       res.json(updated[0]);
    } catch (error) {
       res.status(500).json({ error: "Failed to update elder" });
    }
  });

  app.delete("/api/elders/:id", requireAuth, async (req, res) => {
    try {
        const oldElderRes = await db.select().from(elders).where(eq(elders.id, req.params.id)).limit(1);
        if (oldElderRes.length > 0) {
            const oldElder = oldElderRes[0];
            await db.delete(tasks).where(eq(tasks.elder, oldElder.name));
            await db.delete(bills).where(eq(bills.elder, oldElder.name));
            await db.delete(insuranceClaims).where(eq(insuranceClaims.name, oldElder.name));
            await db.delete(admissions).where(eq(admissions.name, oldElder.name));
            await db.delete(discharges).where(eq(discharges.name, oldElder.name));
            await db.delete(rounds).where(eq(rounds.elder, oldElder.name));
            await db.delete(rehabPlans).where(eq(rehabPlans.elder, oldElder.name));
            
            // These have elderId FK, so we might delete them manually to be safe before elder
            await db.delete(clinicalRecords).where(eq(clinicalRecords.elderId, oldElder.id));
            await db.delete(careRecords).where(eq(careRecords.elderId, oldElder.id));
            await db.delete(transactions).where(eq(transactions.elderId, oldElder.id));
            
            await db.delete(elders).where(eq(elders.id, oldElder.id));
        }
        res.json({success: true});
    } catch (error) {
      res.status(500).json({ error: "Failed to delete elder" });
    }
  });
`;

code = code.replace(/app\.put\("\/api\/elders\/:id", requireAuth, async \(req, res\) => \{[\s\S]*?res\.status\(500\)\.json\(\{ error: "Failed to update elder" \}\);\n\s*\}\n  \}\);/m, replacement.trim());

fs.writeFileSync('server.ts', code);
