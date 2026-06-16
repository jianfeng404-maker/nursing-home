// src/db/schema.ts
import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, serial, integer, jsonb, boolean, numeric } from 'drizzle-orm/pg-core';

// Define the 'users' table.
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(), // Can use email or phone as login
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull().default('用户'),
  role: text('role').notNull().default('employee'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const elders = pgTable('elders', {
  id: text('id').primaryKey(), // Using text ID (E.g. ELD-001) or serial? Based on existing zustand uses ELD-xxx string ID
  name: text('name').notNull(),
  room: text('room').notNull(),
  age: integer('age').notNull(),
  gender: text('gender').notNull(),
  careLevel: text('care_level').notNull(),
  healthStatus: text('health_status').notNull(),
  admissionDate: text('admission_date').notNull(),
  avatar: text('avatar'),
  face: boolean('face'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const staff = pgTable('staff', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  dept: text('dept').notNull(),
  position: text('position').notNull(),
  phone: text('phone').notNull(),
  status: text('status').notNull(),
  role: text('role').notNull(),
  avatar: text('avatar'),
  face: boolean('face'),
  card: text('card'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  elder: text('elder').notNull(), // elderName or elderId+elderName
  time: text('time').notNull(),
  staff: text('staff').notNull(),
  status: text('status').notNull(), // 'pending' | 'in_progress' | 'completed' | 'cancelled'
  type: text('type').notNull(),
  medications: jsonb('medications'),
  requirements: text('requirements'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const beds = pgTable('beds', {
  id: text('id').primaryKey(),
  building: text('building').notNull(),
  floor: text('floor').notNull(),
  room: text('room').notNull(),
  roomType: text('room_type').notNull(),
  status: text('status').notNull(),
  elderId: text('elder_id').references(() => elders.id, { onDelete: 'set null', onUpdate: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  level: text('level').notNull(),
  time: text('time').notNull(),
  resident: text('resident').notNull(),
  location: text('location').notNull(),
  device: text('device').notNull(),
  status: text('status').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// Existing business tables below:
export const clinicalRecords = pgTable('clinical_records', {
    id: serial('id').primaryKey(),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    elderName: text('elder_name').notNull(),
    time: timestamp('time').notNull().defaultNow(),
    doctor: text('doctor').notNull(),
    type: text('type').notNull(), // '看诊' | '查房'
    notes: text('notes').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const careRecords = pgTable('care_records', {
    id: text('id').primaryKey(),
    time: text('time').notNull(),
    type: text('type').notNull(),
    content: text('content').notNull(),
    result: text('result').notNull(),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    elderName: text('elder_name').notNull(),
    caregiver: text('caregiver').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const rounds = pgTable('rounds', {
    id: text('id').primaryKey(),
    elder: text('elder').notNull(),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    room: text('room').notNull(),
    time: text('time').notNull(),
    doctor: text('doctor').notNull(),
    type: text('type').notNull(),
    status: text('status').notNull(),
    notes: text('notes').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const rehabPlans = pgTable('rehab_plans', {
    id: text('id').primaryKey(),
    elder: text('elder').notNull(),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    room: text('room').notNull(),
    desc: text('desc').notNull(),
    therapist: text('therapist').notNull(),
    status: text('status').notNull(),
    progress: integer('progress').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const inventory = pgTable('inventory', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    warehouse: text('warehouse').notNull(),
    stock: integer('stock').notNull().default(0),
    unit: text('unit').notNull(),
    safeStock: integer('safe_stock').notNull().default(10),
    val: text('val').notNull().default(''),
    lastUpdate: text('last_update').notNull().default(''),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const appStates = pgTable('app_states', {
    id: serial('id').primaryKey(),
    stateData: jsonb('state_data').notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

// -- Finance & Billing --
export const bills = pgTable('bills', {
    id: text('id').primaryKey(),
    elder: text('elder').notNull(),
    room: text('room'),
    period: text('period').notNull(),
    dueDate: text('due_date'),
    status: text('status').notNull(),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),
    items: jsonb('items'),
    deductions: jsonb('deductions'),
    tempItems: jsonb('temp_items'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const insuranceClaims = pgTable('insurance_claims', {
    id: text('id').primaryKey(), // e.g. INS-001
    name: text('name').notNull(),
    type: text('type').notNull(), // '长护险 - 三级', '职工医保 (床日)'
    period: text('period').notNull(), // '2026年05月'
    serviceDays: integer('service_days').notNull(),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    status: text('status').notNull(), // '资料已齐' | '待医生签字' | '医保局审核中' | '拨付到账'
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const transactions = pgTable('transactions', {
    id: text('id').primaryKey(), // 账单流水 TXN-10293
    billId: text('bill_id'),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
    direction: text('direction').notNull(), // 'IN' | 'OUT'
    method: text('method').notNull(), // '微信' | '支付宝' | '银行转账' | '现金'
    operator: text('operator').notNull(),
    txTime: timestamp('tx_time').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

export const schedules = pgTable('schedules', {
    id: text('id').primaryKey(),
    stationId: text('station_id').notNull(),
    weekStart: text('week_start').notNull(),
    shifts: jsonb('shifts').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const buildings = pgTable('buildings', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    note: text('note'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const floors = pgTable('floors', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').notNull(),
    buildingId: text('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const roomTypes = pgTable('room_types', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    beds: integer('beds').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    desc: text('desc'),
    allowPackage: boolean('allow_package'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const rooms = pgTable('rooms', {
    id: text('id').primaryKey(),
    roomNo: text('room_no').notNull(),
    roomTypeId: text('room_type_id').notNull().references(() => roomTypes.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    floorId: text('floor_id').notNull().references(() => floors.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    buildingId: text('building_id').notNull().references(() => buildings.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    status: text('status').notNull(),
    specialFacilities: jsonb('special_facilities'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});



export const careLevels = pgTable('care_levels', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    desc: text('desc'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const serviceItems = pgTable('service_items', {
    id: text('id').primaryKey(),
    category: text('category').notNull(),
    name: text('name').notNull(),
    frequency: text('frequency'),
    duration: text('duration'),
    includedIn: jsonb('included_in'),
    sopSteps: jsonb('sop_steps'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const nursingStations = pgTable('nursing_stations', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    manager: text('manager').notNull(),
    buildings: jsonb('buildings'),
    floors: jsonb('floors'),
    assignedStaff: jsonb('assigned_staff'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const customerArchives = pgTable('customer_archives', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    age: integer('age').notNull(),
    gender: text('gender').notNull(),
    status: text('status').notNull(),
    careLevel: text('care_level'),
    familyContact: text('family_contact'),
    phone: text('phone'),
    date: text('date'),
    idCard: text('id_card'),
    bedInfo: text('bed_info'),
    agreementStatus: text('agreement_status'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const agreements = pgTable('agreements', {
    id: text('id').primaryKey(),
    archiveId: text('archive_id').notNull(),
    title: text('title').notNull(),
    startDate: text('start_date').notNull(),
    endDate: text('end_date'),
    guarantor: text('guarantor'),
    status: text('status'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const inventoryAudits = pgTable('inventory_audits', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    status: text('status').notNull(),
    date: text('date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const sysRoles = pgTable('sys_roles', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    code: text('code').notNull(),
    desc: text('desc'),
    userCount: integer('user_count').default(0),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const iotDevices = pgTable('iot_devices', {
    id: text('id').primaryKey(),
    sn: text('sn').notNull(),
    name: text('name').notNull(),
    catalog: text('catalog'),
    bindType: text('bind_type'),
    bindTarget: text('bind_target'),
    status: text('status').notNull(),
    lastActive: text('last_active'),
    ip: text('ip'),
    elderId: text('elder_id').references(() => elders.id, { onDelete: 'set null', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const carePlans = pgTable('care_plans', {
    id: text('id').primaryKey(),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    elderName: text('elder_name').notNull(),
    room: text('room'),
    careLevel: text('care_level'),
    goal: text('goal'),
    nextReview: text('next_review'),
    manager: text('manager'),
    status: text('status'),
    tasks: jsonb('tasks'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const assessments = pgTable('assessments', {
    id: text('id').primaryKey(),
    elderId: text('elder_id').notNull().references(() => elders.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    elderName: text('elder_name').notNull(),
    room: text('room'),
    type: text('type'),
    score: text('score'),
    assessor: text('assessor'),
    date: text('date'),
    status: text('status'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const admissions = pgTable('admissions', {
    id: text('id').primaryKey(), // ADM-xxx
    name: text('name').notNull(),
    assessmentLevel: text('assessment_level'),
    family: text('family'),
    phone: text('phone'),
    idCard: text('id_card'),
    roombed: text('roombed'),
    status: text('status').notNull(), // 'pending' | 'processing' | 'completed'
    progress: jsonb('progress'), // { info: true, bed: true, contract: false, payment: false }
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const discharges = pgTable('discharges', {
    id: text('id').primaryKey(), // OUT-xxx
    name: text('name').notNull(),
    room: text('room'),
    type: text('type'),
    reason: text('reason'),
    applyDate: text('apply_date'),
    leaveDate: text('leave_date'),
    status: text('status').notNull(), // 'processing' | 'completed'
    checks: jsonb('checks'), // { items: true, medical: false, fee: false }
    refundAmount: numeric('refund_amount', { precision: 10, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

