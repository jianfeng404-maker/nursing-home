const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const newSysUsersGet = `
  app.get("/api/sys_users", requireAuth, async (req, res) => {
    try {
      const allUsers = await db.select().from(users);
      res.json(allUsers.map(u => ({
        id: String(u.id),
        username: u.email,
        name: u.name,
        roles: [u.role],
        status: '正常'
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sys_users" });
    }
  });`;

const newSysUsersEndpoints = `
  app.post("/api/sys_users", requireAuth, async (req: any, res) => {
    try {
      const { username, name, roles } = req.body;
      const existing = await db.select().from(users).where(eq(users.email, username)).limit(1);
      if (existing.length > 0) return res.status(400).json({ error: "Email/Username already exists" });
      const passwordHash = await bcrypt.hash('123456', 10);
      const newRec = await db.insert(users).values({
        email: username,
        name: name || '用户',
        role: (roles && roles.length > 0) ? roles[0] : 'employee',
        passwordHash
      }).returning();
      res.json({
        id: String(newRec[0].id),
        username: newRec[0].email,
        name: newRec[0].name,
        roles: [newRec[0].role],
        status: '正常'
      });
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/sys_users/:id", requireAuth, async (req, res) => {
    try {
      const { username, name, roles } = req.body;
      const toUpdate: any = {};
      if (username) toUpdate.email = username;
      if (name) toUpdate.name = name;
      if (roles && roles.length > 0) toUpdate.role = roles[0];

      const b = await db.update(users).set(toUpdate).where(eq(users.id, Number(req.params.id))).returning();
      if (b.length > 0) {
        res.json({
          id: String(b[0].id),
          username: b[0].email,
          name: b[0].name,
          roles: [b[0].role],
          status: '正常'
        });
      } else res.json({});
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });
  app.delete("/api/sys_users/:id", requireAuth, async (req, res) => {
     try {
       await db.delete(users).where(eq(users.id, Number(req.params.id)));
       res.json({success: true});
     } catch(e) { res.status(500).json({error: "Fail"}) }
  });`;

// Remove old sys_users GET
code = code.replace(/app\.get\("\/api\/sys_users"[\s\S]*?\}\);/m, newSysUsersGet.trim());

// Remove old endpoints
const oldEndpointsMatch = /app\.post\("\/api\/sys_users"[\s\S]*?app\.delete\("\/api\/sys_users\/:id"[\s\S]*?\}\);/m;
code = code.replace(oldEndpointsMatch, newSysUsersEndpoints.trim());

fs.writeFileSync('server.ts', code);
