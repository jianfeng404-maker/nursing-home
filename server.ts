import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { db } from './src/db/index.ts';
import { clinicalRecords, rehabPlans, inventory, users, appStates, elders, staff, tasks, beds, alerts, careRecords, rounds, admissions, discharges, bills, insuranceClaims, sysRoles, iotDevices, carePlans, assessments, schedules, transactions, buildings, floors, rooms, roomTypes, careLevels, serviceItems, nursingStations, customerArchives, agreements, inventoryAudits } from './src/db/schema.ts';
import { eq, desc, isNull, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { GoogleGenAI } from "@google/genai";

const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-secret-12345';
if (!process.env.JWT_SECRET) {
    console.warn("WARNING: JWT_SECRET environment variable is not set. Using insecure fallback.");
}


async function startServer() {
  const app = express();
  const PORT = 3000;

function cleanNumericFields(body: any) {
  if (!body || typeof body !== 'object') return body;
  const fields = ['total', 'amount', 'price', 'refundAmount'];
  const res = { ...body };
  for (const f of fields) {
    if (typeof res[f] === 'string') {
      res[f] = res[f].replace(/,/g, '');
    }
  }
  return res;
}


  // Add middleware to parse JSON using express.json()
  app.use(express.json());

  const httpServer = createServer(app);
  const io = new Server(httpServer);

  
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      next(new Error('Authentication error'));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });

  // Attach io to req for usage in route handlers
  app.use((req: any, res, next) => {
    req.io = io;
    next();
  });

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "智能颐养平台后端服务已启动" });
  });



  // Auth API
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      // Determine if bootstrap is allowed (0 users)
      const existingUserCountRes = await db.select().from(users).where(isNull(users.deletedAt)).limit(1);
      const isBootstrap = existingUserCountRes.length === 0;

      let userRole = 'employee';
      if (isBootstrap) {
        userRole = 'admin'; // automatically admin if first user
      } else {
        // Must be authenticated and admin to register new users if not bootstrapping
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized: Missing token' });
        }
        const token = authHeader.split('Bearer ')[1];
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          if (decoded.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Only admins can register new users' });
          }
        } catch (error) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
      }
      const existingUser = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt))).limit(1);
      if (existingUser.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await db.insert(users).values({
        email,
        passwordHash,
        name: name || "Unknown User",
        role: userRole
      }).returning();

      res.status(201).json({ message: "User registered successfully", user: { id: newUser[0].id, email: newUser[0].email, name: newUser[0].name, role: newUser[0].role } });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await db.select().from(users).where(and(eq(users.email, email), isNull(users.deletedAt))).limit(1);

      if (result.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = result[0];
      const match = await bcrypt.compare(password, user.passwordHash);

      if (!match) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/me", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || !req.user.id) {
         return res.status(401).json({ error: "Unauthorized" });
      }
      const result = await db.select().from(users).where(and(eq(users.id, req.user.id), isNull(users.deletedAt))).limit(1);
      if (result.length === 0) {
        return res.status(401).json({ error: "User not found" });
      }
      const user = result[0];
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
      console.error("Auth status error:", error);
      res.status(500).json({ error: "Status check failed" });
    }
  });

  // DB API: Clinical Records
  app.get("/api/clinical_records", requireAuth, async (req: AuthRequest, res) => {
    try {
      const records = await db.select().from(clinicalRecords).where(isNull(clinicalRecords.deletedAt));
      res.json(records);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch clinical records" });
    }
  });

  app.post("/api/clinical_records", requireAuth, async (req: AuthRequest, res) => {
    try {
        const { elderId, elderName, doctor, type, notes } = req.body;
        const newRecord = await db.insert(clinicalRecords).values({
            elderId,
            elderName,
            doctor,
            type,
            notes
        }).returning();
        res.json(newRecord[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add clinical record" });
    }
  });

  // Global state logic removed

  // Set up mock data to serve via API
  const MODEL_NAME = 'gemini-2.5-flash';
  let ai: any = null;
  const lazyGetAI = () => {
    if (!ai) {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
      }
      ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return ai;
  };

  app.post("/api/ai/generate", requireAuth, async (req: AuthRequest, res) => {
    try {
       const aiClient = lazyGetAI();
       const { prompt } = req.body;
       const response = await aiClient.models.generateContent({
         model: MODEL_NAME,
         contents: prompt,
       });
       res.json({ text: response.text });
    } catch(error) {
       console.error("AI Proxy Error:", error);
       res.status(500).json({ error: "AI generation failed" });
    }
  });

  // API route for dashboard overview stats
  app.get("/api/stats", requireAuth, async (req, res) => {
    try {
      const allBeds = await db.select().from(beds).where(isNull(beds.deletedAt));
      const allTasks = await db.select().from(tasks).where(isNull(tasks.deletedAt));
      const allAlerts = await db.select().from(alerts).where(isNull(alerts.deletedAt));
      
      const totalBeds = allBeds.length || 120; // fallback if no beds defined
      const occupiedBeds = allBeds.filter(b => b.status === 'occupied').length;
      
      res.json({
        occupiedBeds: occupiedBeds,
        freeBeds: totalBeds - occupiedBeds,
        occupancyRate: Math.round((occupiedBeds / totalBeds) * 100) || 0,
        totalTasks: allTasks.length,
        taskCompletionRate: allTasks.length > 0 ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100) : 0,
        pendingAlertsCount: allAlerts.filter(a => a.status === 'pending').length,
        criticalAlertsCount: allAlerts.filter(a => a.status === 'pending' && a.level === 'critical').length,
      });
    } catch (error) {
       console.error(error);
       res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // API endpoints for elders
  app.get("/api/elders", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(elders).where(isNull(elders.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch elders" });
    }
  });

  app.post("/api/elders", requireAuth, async (req, res) => {
    try {
       const newElder = await db.insert(elders).values(cleanNumericFields(req.body)).returning();
       res.json(newElder[0]);
    } catch (error) {
       res.status(500).json({ error: "Failed to add elder" });
    }
  });

  app.put("/api/elders/:id", requireAuth, async (req, res) => {
    try {
       const oldElderRes = await db.select().from(elders).where(and(eq(elders.id, req.params.id), isNull(elders.deletedAt))).limit(1);
       if (oldElderRes.length === 0) return res.status(404).json({error: "Elder not found"});
       const oldElder = oldElderRes[0];

       const updated = await db.update(elders).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(elders.id, req.params.id)).returning();
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
       if (updated.length === 0) return res.status(404).json({error: "Not Found"}); res.json(updated[0]);
    } catch (error) {
       res.status(500).json({ error: "Failed to update elder" });
    }
  });

  app.delete("/api/elders/:id", requireAuth, async (req, res) => {
    try {
        const oldElderRes = await db.select().from(elders).where(and(eq(elders.id, req.params.id), isNull(elders.deletedAt))).limit(1);
        if (oldElderRes.length > 0) {
            const oldElder = oldElderRes[0];
            await db.update(tasks).set({ deletedAt: new Date() }).where(eq(tasks.elder, oldElder.name));
            await db.update(bills).set({ deletedAt: new Date() }).where(eq(bills.elder, oldElder.name));
            await db.update(insuranceClaims).set({ deletedAt: new Date() }).where(eq(insuranceClaims.name, oldElder.name));
            await db.update(admissions).set({ deletedAt: new Date() }).where(eq(admissions.name, oldElder.name));
            await db.update(discharges).set({ deletedAt: new Date() }).where(eq(discharges.name, oldElder.name));
            await db.update(rounds).set({ deletedAt: new Date() }).where(eq(rounds.elder, oldElder.name));
            await db.update(rehabPlans).set({ deletedAt: new Date() }).where(eq(rehabPlans.elder, oldElder.name));
            
            // These have elderId FK, so we might delete them manually to be safe before elder
            await db.update(clinicalRecords).set({ deletedAt: new Date() }).where(eq(clinicalRecords.elderId, oldElder.id));
            await db.update(careRecords).set({ deletedAt: new Date() }).where(eq(careRecords.elderId, oldElder.id));
            await db.update(transactions).set({ deletedAt: new Date() }).where(eq(transactions.elderId, oldElder.id));
            
            await db.update(elders).set({ deletedAt: new Date() }).where(eq(elders.id, oldElder.id));
        }
        res.json({success: true});
    } catch (error) {
      res.status(500).json({ error: "Failed to delete elder" });
    }
  });

  // API endpoints for staff
  app.get("/api/staff", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(staff).where(isNull(staff.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", requireAuth, async (req, res) => {
    try {
       const newStaff = await db.insert(staff).values(cleanNumericFields(req.body)).returning();
       res.json(newStaff[0]);
    } catch (error) {
       res.status(500).json({ error: "Failed to add staff" });
    }
  });

  app.put("/api/staff/:id", requireAuth, async (req, res) => {
    try {
       const updated = await db.update(staff).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(staff.id, req.params.id)).returning();
          if (updated.length === 0) return res.status(404).json({error: "Not Found"});
          res.json(updated[0]);
    } catch (error) {
       res.status(500).json({ error: "Failed to update staff" });
    }
  });

  // API endpoints for tasks
  app.get("/api/tasks", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(tasks).where(isNull(tasks.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", requireAuth, async (req: any, res) => {
    try {
      const newTaskData = {
        id: req.body.id || `T-${crypto.randomUUID()}`,
        ...cleanNumericFields(req.body)
      };
      
      const newRec = await db.insert(tasks).values(newTaskData).returning();
      
      if (req.io) {
         req.io.emit("new-task", newRec[0]);
      }
      res.json(newRec[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to add task" });
    }
  });

  app.put("/api/tasks/:id/status", requireAuth, async (req, res) => {
    const { id } = req.params;
    const { status, staff: taskStaff } = req.body;
    try {
      const toUpdate: any = {};
      if (status !== undefined) toUpdate.status = status;
      if (taskStaff !== undefined) toUpdate.staff = taskStaff;
      
      const updated = await db.update(tasks).set(toUpdate).where(eq(tasks.id, id)).returning();
      if(updated.length) {
         if (updated.length === 0) return res.status(404).json({error: "Not Found"}); res.json(updated[0]);
      } else {
         res.status(404).json({ error: "Task not found" });
      }
    } catch (error) {
       res.status(500).json({ error: "Failed to update task status" });
    }
  });

  // API endpoints for alerts
  app.get("/api/alerts", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(alerts).where(isNull(alerts.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  app.post("/api/alerts", requireAuth, async (req: any, res) => {
     try {
       const newRec = await db.insert(alerts).values(cleanNumericFields(req.body)).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add alert" });
     }
  });

  app.put("/api/alerts/:id", requireAuth, async (req, res) => {
     try {
       const updated = await db.update(alerts).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(alerts.id, req.params.id)).returning();
          if (updated.length === 0) return res.status(404).json({error: "Not Found"});
          res.json(updated[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update alert" });
     }
  });


  // API endpoints for beds
  app.get("/api/beds", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(beds).where(isNull(beds.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch beds" });
    }
  });

  app.post("/api/beds", requireAuth, async (req: any, res) => {
     try {
       const newRec = await db.insert(beds).values(cleanNumericFields(req.body)).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add bed" });
     }
  });

  app.put("/api/beds/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(beds).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(beds.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(beds).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update bed" });
     }
  });

  // API endpoints for inventory
  app.get("/api/inventory", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(inventory).where(isNull(inventory.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory", requireAuth, async (req: any, res) => {
     try {
       const dataToInsert = { ...cleanNumericFields(req.body), id: req.body.id || `INV-${crypto.randomUUID()}` };
       const newRec = await db.insert(inventory).values(dataToInsert).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add inventory" });
     }
  });

  app.put("/api/inventory/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(inventory).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(inventory.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(inventory).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update inventory" });
     }
  });

  // API endpoints for rounds
  app.get("/api/rounds", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(rounds).where(isNull(rounds.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rounds" });
    }
  });

  app.post("/api/rounds", requireAuth, async (req: any, res) => {
     try {
       const newRec = await db.insert(rounds).values(cleanNumericFields(req.body)).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add round" });
     }
  });

  app.put("/api/rounds/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(rounds).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(rounds.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(rounds).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update round" });
     }
  });

  // API endpoints for care_records
  app.get("/api/care_records", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(careRecords).where(isNull(careRecords.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch care records" });
    }
  });

  app.post("/api/care_records", requireAuth, async (req: any, res) => {
     try {
       const newRec = await db.insert(careRecords).values(cleanNumericFields(req.body)).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add care record" });
     }
  });

  // API endpoints for admissions
  app.get("/api/admissions", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(admissions).where(isNull(admissions.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admissions" });
    }
  });

  app.post("/api/admissions", requireAuth, async (req: any, res) => {
    try {
      const { name, assessmentLevel, family, phone, idCard, status, progress, roombed } = req.body;
      const newRec = await db.insert(admissions).values({
        id: `ADM-${crypto.randomUUID().slice(0, 8)}`,
        name, assessmentLevel, family, phone, idCard, status, progress, roombed
      }).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add admission" });
     }
  });

  app.put("/api/admissions/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(admissions).set({ status: req.body.status, progress: req.body.progress, roombed: req.body.roombed }).where(eq(admissions.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(admissions).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update admission" });
     }
  });

  // API endpoints for discharges
  app.get("/api/discharges", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(discharges).where(isNull(discharges.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch discharges" });
    }
  });

  app.post("/api/discharges", requireAuth, async (req: any, res) => {
    try {
      const { name, room, type, reason, applyDate, leaveDate, status, checks, refundAmount } = req.body;
      const parsedRefundAmount = cleanNumericFields({ refundAmount: refundAmount || 0 }).refundAmount;
      const newRec = await db.insert(discharges).values({
        id: `DIS-${crypto.randomUUID().slice(0, 8)}`,
        name, room, type, reason, applyDate, leaveDate, status, checks, refundAmount: parsedRefundAmount
      }).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add discharge" });
     }
  });

  app.put("/api/discharges/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(discharges).set({ status: req.body.status, checks: req.body.checks }).where(eq(discharges.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(discharges).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update discharge" });
     }
  });

  // API endpoints for bills
  app.get("/api/bills", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(bills).where(isNull(bills.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  app.post("/api/bills", requireAuth, async (req: any, res) => {
     try {
       const { elder, room, period, dueDate, status, total, items, deductions, tempItems } = req.body;
       const newRec = await db.insert(bills).values({
         id: `B-${crypto.randomUUID().slice(0, 8)}`, // generate cleanly
         elder: elder || 'Unknown',
         room: room || '',
         period: period || '',
         dueDate: dueDate || '',
         status: status || '未缴费',
         total: cleanNumericFields({ total: total || 0 }).total,
         items: items || [],
         deductions: deductions || [],
         tempItems: tempItems || []
       }).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add bill" });
     }
  });

  app.put("/api/bills/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(bills).set({ status: req.body.status, items: req.body.items, deductions: req.body.deductions, tempItems: req.body.tempItems, total: req.body.total ? cleanNumericFields({total: req.body.total}).total : undefined }).where(eq(bills.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(bills).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update bill" });
     }
  });

  // API endpoints for insurance claims
  app.get("/api/insurance_claims", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(insuranceClaims).where(isNull(insuranceClaims.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch insurance claims" });
    }
  });

  app.post("/api/insurance_claims", requireAuth, async (req: any, res) => {
     try {
       const { name, type, period, serviceDays, amount, status } = req.body;
       const parsedAmount = cleanNumericFields({ amount: amount || 0 }).amount;
       const parsedDays = cleanNumericFields({ serviceDays: serviceDays || 0 }).serviceDays;
       const newRec = await db.insert(insuranceClaims).values({
         id: `INS-${crypto.randomUUID().slice(0, 8)}`,
         name, type, period, serviceDays: parsedDays, amount: parsedAmount, status
       }).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add insurance claim" });
     }
  });

  app.put("/api/insurance_claims/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(insuranceClaims).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(insuranceClaims.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(insuranceClaims).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update insurance claim" });
     }
  });

  app.post("/api/schedules", requireAuth, async (req: any, res) => {
    try {
      const newRec = await db.insert(schedules).values(cleanNumericFields(req.body)).returning();
      res.json(newRec[0]);
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/schedules/:id", requireAuth, async (req, res) => {
    try {
      let updatedRes = await db.update(schedules).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(schedules.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(schedules).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });
  app.get("/api/schedules", requireAuth, async (req, res) => {
    try { res.json(await db.select().from(schedules).where(isNull(schedules.deletedAt))); }
    catch(e) { res.status(500).json({error: "Fail"}) }
  });

  ['buildings', 'floors', 'rooms', 'room_types', 'care_levels', 'service_items', 'nursing_stations', 'customer_archives', 'agreements', 'inventory_audits'].forEach((resource) => {
      const dbMap: Record<string, any> = {
          buildings, floors, rooms, room_types: roomTypes, care_levels: careLevels, service_items: serviceItems, nursing_stations: nursingStations,
          customer_archives: customerArchives, agreements, inventory_audits: inventoryAudits
      };
      
      app.get(`/api/${resource}`, requireAuth, async (req, res) => {
        try { res.json(await db.select().from(dbMap[resource]).where(isNull(dbMap[resource].deletedAt))); }
        catch(e) { res.status(500).json({error: "Fail"}); }
      });
      app.post(`/api/${resource}`, requireAuth, async (req: any, res) => {
        try {
          const dataToInsert = { ...cleanNumericFields(req.body), id: req.body.id || crypto.randomUUID() };
          const newRec = await db.insert(dbMap[resource]).values(dataToInsert).returning();
          res.json(newRec[0]);
        } catch(err) { res.status(500).json({ error: "Fail" }); }
      });
      app.put(`/api/${resource}/:id`, requireAuth, async (req, res) => {
        try {
          const b = await db.update(dbMap[resource]).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(dbMap[resource].id, req.params.id)).returning();
          if (b.length === 0) {
            const dataToInsert = { ...cleanNumericFields(req.body), id: req.params.id };
            const inserted = await db.insert(dbMap[resource]).values(dataToInsert).returning();
            return res.json(inserted[0]);
          }
          res.json(b[0]);
        } catch(e) { res.status(500).json({error: "Fail"}); }
      });
      app.delete(`/api/${resource}/:id`, requireAuth, async (req, res) => {
         try {
           await db.update(dbMap[resource]).set({ deletedAt: new Date() }).where(eq(dbMap[resource].id, req.params.id));
           res.json({success: true});
         } catch(e) { res.status(500).json({error: "Fail"}); }
      });
  });

  app.post("/api/transactions", requireAuth, async (req: any, res) => {
    try {
      const { billId, elderId, amount, direction, method, operator } = req.body;
      const parsedAmount = cleanNumericFields({ amount: amount || 0 }).amount;
      const newRec = await db.insert(transactions).values({
        id: `TXN-${crypto.randomUUID().slice(0, 8)}`,
        billId, elderId, amount: parsedAmount, direction, method, operator
      }).returning();
      res.json(newRec[0]);
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/transactions/:id", requireAuth, async (req, res) => {
    try {
      let updatedRes = await db.update(transactions).set({ method: req.body.method, operator: req.body.operator }).where(eq(transactions.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(transactions).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });
  app.get("/api/transactions", requireAuth, async (req, res) => {
    try { res.json(await db.select().from(transactions).where(isNull(transactions.deletedAt))); }
    catch(e) { res.status(500).json({error: "Fail"}) }
  });

  // API endpoints for remainder tables
  app.post("/api/sys_users", requireAuth, async (req: any, res) => {
    try {
      const { username, name, roles } = req.body;
      const existing = await db.select().from(users).where(and(eq(users.email, username), isNull(users.deletedAt))).limit(1);
      if (existing.length > 0) return res.status(400).json({ error: "Email/Username already exists" });
      const passwordHash = await bcrypt.hash('123456', 10);
      const newRec = await db.insert(users).values({
        email: username,
        name: name || '用户',
        role: (roles && roles.length > 0) ? roles.join(',') : 'employee',
        passwordHash
      }).returning();
      res.json({
        id: String(newRec[0].id),
        username: newRec[0].email,
        name: newRec[0].name,
        roles: newRec[0].role.split(','),
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
      if (roles && roles.length > 0) toUpdate.role = roles.join(',');

      const b = await db.update(users).set(toUpdate).where(eq(users.id, Number(req.params.id))).returning();
      if (b.length > 0) {
        res.json({
          id: String(b[0].id),
          username: b[0].email,
          name: b[0].name,
          roles: b[0].role.split(','),
          status: '正常'
        });
      } else res.json({});
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });
  app.delete("/api/sys_users/:id", requireAuth, async (req, res) => {
     try {
       await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, Number(req.params.id)));
       res.json({success: true});
     } catch(e) { res.status(500).json({error: "Fail"}) }
  });

  app.post("/api/sys_roles", requireAuth, async (req: any, res) => {
    try {
      const newRec = await db.insert(sysRoles).values(cleanNumericFields(req.body)).returning();
      res.json(newRec[0]);
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/sys_roles/:id", requireAuth, async (req, res) => {
    try {
      let updatedRes = await db.update(sysRoles).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(sysRoles.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(sysRoles).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });
  app.delete("/api/sys_roles/:id", requireAuth, async (req, res) => {
     try {
       await db.update(sysRoles).set({ deletedAt: new Date() }).where(eq(sysRoles.id, req.params.id));
       res.json({success: true});
     } catch(e) { res.status(500).json({error: "Fail"}) }
  });

  app.post("/api/iot_devices", requireAuth, async (req: any, res) => {
    try {
      const newRec = await db.insert(iotDevices).values(cleanNumericFields(req.body)).returning();
      res.json(newRec[0]);
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/iot_devices/:id", requireAuth, async (req, res) => {
    try {
      let updatedRes = await db.update(iotDevices).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(iotDevices.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(iotDevices).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });

  app.post("/api/care_plans", requireAuth, async (req: any, res) => {
    try {
      const newRec = await db.insert(carePlans).values(cleanNumericFields(req.body)).returning();
      res.json(newRec[0]);
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/care_plans/:id", requireAuth, async (req, res) => {
    try {
      let updatedRes = await db.update(carePlans).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(carePlans.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(carePlans).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });

  app.post("/api/assessments", requireAuth, async (req: any, res) => {
    try {
      const newRec = await db.insert(assessments).values(cleanNumericFields(req.body)).returning();
      res.json(newRec[0]);
    } catch(err) { res.status(500).json({ error: "Fail" }) }
  });
  app.put("/api/assessments/:id", requireAuth, async (req, res) => {
    try {
      let updatedRes = await db.update(assessments).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(assessments.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(assessments).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
    } catch(e) { res.status(500).json({error: "Fail"}) }
  });
  // API endpoints for sys_users
  app.get("/api/sys_users", requireAuth, async (req, res) => {
    try {
      const allUsers = await db.select().from(users).where(isNull(users.deletedAt));
      res.json(allUsers.map(u => ({
        id: String(u.id),
        username: u.email,
        name: u.name,
        roles: u.role ? u.role.split(',') : ['employee'],
        status: '正常'
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sys_users" });
    }
  });

  // API endpoints for sys_roles
  app.get("/api/sys_roles", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(sysRoles).where(isNull(sysRoles.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sys_roles" });
    }
  });

  // API endpoints for iot_devices
  app.get("/api/iot_devices", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(iotDevices).where(isNull(iotDevices.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch iot_devices" });
    }
  });

  // API endpoints for care_plans
  app.get("/api/care_plans", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from( carePlans));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch care_plans" });
    }
  });

  // API endpoints for assessments
  app.get("/api/assessments", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(assessments).where(isNull(assessments.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  app.get("/api/rehab_plans", requireAuth, async (req, res) => {
    try {
      res.json(await db.select().from(rehabPlans).where(isNull(rehabPlans.deletedAt)));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rehab plans" });
    }
  });

  app.post("/api/rehab_plans", requireAuth, async (req: any, res) => {
     try {
       const dataToInsert = { ...cleanNumericFields(req.body), id: req.body.id || `REHAB-${crypto.randomUUID()}` };
       const newRec = await db.insert(rehabPlans).values(dataToInsert).returning();
       res.json(newRec[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to add rehab plan" });
     }
  });

  app.put("/api/rehab_plans/:id", requireAuth, async (req, res) => {
     try {
       let updatedRes = await db.update(rehabPlans).set((() => { const d = cleanNumericFields(req.body); delete d.id; return d; })()).where(eq(rehabPlans.id, req.params.id)).returning();
       if (updatedRes.length === 0) {
         try {
           const insertPayload = typeof req.body === 'object' ? { ...req.body } : {};
           // remove id from payload to avoid conflict then assign req.params.id
           delete insertPayload.id;
           const newRes = await db.insert(rehabPlans).values({ ...insertPayload, id: req.params.id }).returning();
           return res.json(newRes[0]);
         } catch(e) {
           return res.status(404).json({error: "Not Found"});
         }
       }
       res.json(updatedRes[0]);
     } catch (error) {
       res.status(500).json({ error: "Failed to update rehab plan" });
     }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true' ? { overlay: false } : false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
