import { db } from './db/index.ts';
import { 
  elders, staff, beds, tasks, alerts, careRecords, rehabPlans, rounds, 
  inventory, admissions, discharges, bills, insuranceClaims, users, sysRoles, 
  iotDevices, carePlans, assessments, schedules, transactions, buildings, 
  floors, rooms, roomTypes, careLevels, serviceItems, nursingStations, 
  customerArchives, agreements, inventoryAudits 
} from './db/schema.ts';

import { useStore } from './store/index.ts';
import crypto from 'crypto';

const state = useStore.getState();

const sysUsersMapped = state.sysUsers.map((u: any) => ({
    id: parseInt(String(u.id).replace(/\\D/g, '')) || Math.floor(Math.random() * 1000), 
    email: u.username || u.id, 
    name: u.name,
    password: 'pw',
    role: u.roles?.[0] || 'employee'
}));

const dbMap: Record<string, any> = {
  elders: { schema: elders, data: state.elders },
  staff: { schema: staff, data: state.staff },
  beds: { schema: beds, data: state.beds },
  tasks: { schema: tasks, data: state.tasks },
  alerts: { schema: alerts, data: state.alerts },
  careRecords: { schema: careRecords, data: state.careRecords },
  rehabPlans: { schema: rehabPlans, data: state.rehabPlans },
  rounds: { schema: rounds, data: state.rounds },
  inventory: { schema: inventory, data: state.inventory },
  admissions: { schema: admissions, data: state.admissions },
  discharges: { schema: discharges, data: state.discharges },
  bills: { schema: bills, data: state.bills },
  insuranceClaims: { schema: insuranceClaims, data: state.insuranceClaims },
  users: { schema: users, data: sysUsersMapped },
  sysRoles: { schema: sysRoles, data: state.sysRoles },
  iotDevices: { schema: iotDevices, data: state.iotDevices },
  carePlans: { schema: carePlans, data: state.carePlans },
  assessments: { schema: assessments, data: state.assessments },
  schedules: { schema: schedules, data: state.schedules },
  transactions: { schema: transactions, data: state.transactions },
  buildings: { schema: buildings, data: state.buildings },
  floors: { schema: floors, data: state.floors },
  rooms: { schema: rooms, data: state.rooms },
  roomTypes: { schema: roomTypes, data: state.roomTypes },
  careLevels: { schema: careLevels, data: state.careLevels },
  serviceItems: { schema: serviceItems, data: state.serviceItems },
  nursingStations: { schema: nursingStations, data: state.nursingStations },
  customerArchives: { schema: customerArchives, data: state.customerArchives },
  agreements: { schema: agreements, data: state.agreements },
  inventoryAudits: { schema: inventoryAudits, data: state.inventoryAudits }
};

function cleanNumericFields(obj: any): any {
  const o = {...obj};
  for (const k of Object.keys(o)) {
    if (k === 'id') continue;
    if (k.endsWith('Id') && typeof o[k] === 'number') { o[k] = String(o[k]); continue; }
  }
  return o;
}

async function seed() {
  for (const [name, def] of Object.entries(dbMap)) {
    console.log(`Seeding \${name}...`);
    try {
      if (!def.data || def.data.length === 0) continue;
      
      const toInsert = def.data.map((item:any) => cleanNumericFields(item));
      for(const item of toInsert) {
        if(!item.id) item.id = crypto.randomUUID();
      }
      
      await db.insert(def.schema).values(toInsert).onConflictDoNothing();
      console.log(`  Inserted \${def.data.length} records into \${name}.`);
    } catch (e: any) {
      console.error(`Error seeding \${name}:`, e.message);
    }
  }
  console.log("Done seeding.");
  process.exit(0);
}

seed();
