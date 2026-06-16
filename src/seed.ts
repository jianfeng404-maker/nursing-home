import { db } from './db/index.ts';
import { 
  elders, staff, beds, tasks, alerts, careRecords, rehabPlans, rounds, 
  inventory, admissions, discharges, bills, insuranceClaims, users, sysRoles, 
  iotDevices, carePlans, assessments, schedules, transactions, buildings, 
  floors, rooms, roomTypes, careLevels, serviceItems, nursingStations, 
  customerArchives, agreements, inventoryAudits 
} from './db/schema.ts';

import {
  initialElders, initialStaff, initialBeds, initialTasks, initialAlerts, 
  initialCareRecords, initialRehabPlans, initialRounds, initialInventory, 
  initialAdmissions, initialDischarges, initialBills, initialInsuranceClaims, 
  initialSysUsers, initialSysRoles, initialIotDevices, initialCarePlans, 
  initialAssessments, initialSchedules, initialTransactions, initialBuildings, 
  initialFloors, initialRooms, initialRoomTypes, initialCareLevels, 
  initialServiceItems, initialNursingStations, initialCustomerArchives, 
  initialAgreements, initialInventoryAudits
} from './store/index.ts';

const dbMap: Record<string, any> = {
  elders: { schema: elders, data: initialElders },
  staff: { schema: staff, data: initialStaff },
  beds: { schema: beds, data: initialBeds },
  tasks: { schema: tasks, data: initialTasks },
  alerts: { schema: alerts, data: initialAlerts },
  careRecords: { schema: careRecords, data: initialCareRecords },
  rehabPlans: { schema: rehabPlans, data: initialRehabPlans },
  rounds: { schema: rounds, data: initialRounds },
  inventory: { schema: inventory, data: initialInventory },
  admissions: { schema: admissions, data: initialAdmissions },
  discharges: { schema: discharges, data: initialDischarges },
  bills: { schema: bills, data: initialBills },
  insuranceClaims: { schema: insuranceClaims, data: initialInsuranceClaims },
  users: { schema: users, data: initialSysUsers.map(u => ({...u, id: parseInt(u.id)||1, role: u.roles?.[0]||'employee', email: u.username||u.id, password: 'pw'})) }, // mapped to users schema
  sysRoles: { schema: sysRoles, data: initialSysRoles },
  iotDevices: { schema: iotDevices, data: initialIotDevices },
  carePlans: { schema: carePlans, data: initialCarePlans },
  assessments: { schema: assessments, data: initialAssessments },
  schedules: { schema: schedules, data: initialSchedules },
  transactions: { schema: transactions, data: initialTransactions },
  buildings: { schema: buildings, data: initialBuildings },
  floors: { schema: floors, data: initialFloors },
  rooms: { schema: rooms, data: initialRooms },
  roomTypes: { schema: roomTypes, data: initialRoomTypes },
  careLevels: { schema: careLevels, data: initialCareLevels },
  serviceItems: { schema: serviceItems, data: initialServiceItems },
  nursingStations: { schema: nursingStations, data: initialNursingStations },
  customerArchives: { schema: customerArchives, data: initialCustomerArchives },
  agreements: { schema: agreements, data: initialAgreements },
  inventoryAudits: { schema: inventoryAudits, data: initialInventoryAudits }
};

// Helper: numeric conversion mimicking server.js
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
      // Truncate table? Might cause FK issues. Better to ignore errors or do ON CONFLICT DO NOTHING.
      // Easiest is insert straight
      
      const toInsert = def.data.map(item => cleanNumericFields(item));
      for(const item of toInsert) {
        if(!item.id) item.id = Math.random().toString(36).substr(2, 9);
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
