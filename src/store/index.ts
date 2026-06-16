import { create } from 'zustand';
import { toast } from 'sonner';



export interface CareLevel {
  id: string;
  name: string;
  desc: string;
  price: number;
  color: string;
}

export interface ServiceItem {
  id: string;
  category: string;
  name: string;
  frequency: string;
  duration: string;
  includedIn: string[]; // care level IDs
  sopSteps: string[];
}

export interface StaffMember {
  id: string;
  name: string;
  dept: string;
  position: string;
  phone: string;
  status: string;
  role: string;
  avatar?: string;
  face?: boolean;
  card?: string | null;
  fingerprint?: boolean;
  doors?: string[];
}

export interface Elder {
  id: string;
  name: string;
  room: string;
  age: number;
  gender: string;
  careLevel: string;
  healthStatus: string;
  admissionDate: string;
  avatar?: string;
  face?: boolean;
  card?: string | null;
  fingerprint?: boolean;
  doors?: string[];
}

interface Bed {
  id: string;
  building: string;
  floor: string;
  room: string;
  roomType: '单人间' | '双人间' | '三人间' | '多人间';
  status: 'occupied' | 'empty' | 'reserved' | 'maintenance';
  elderId?: string;
}

export interface RoomType {
  id: string;
  name: string;
  beds: number;
  price: number;
  desc: string;
  allowPackage?: boolean;
}

export interface Building {
  id: string;
  name: string;
  note?: string;
}

export interface Floor {
  id: string;
  name: string;
  type: string;
  buildingId: string;
}

export interface Room {
  id: string;
  roomNo: string;
  roomTypeId: string;
  floorId: string;
  buildingId: string;
  status: '启用中' | '停用中' | '维修中';
  specialFacilities?: string[];
}

interface Alert {
  id: string;
  type: string;
  title: string;
  level: 'critical' | 'high' | 'warning' | 'low';
  time: string;
  resident: string;
  location: string;
  device: string;
  status: 'pending' | 'processing' | 'resolved';
  notes?: string;
  processedBy?: string;
}

interface Task {
  id: string;
  name: string;
  elder: string;
  time: string;
  staff: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  type: 'care' | 'medical' | 'entertainment' | 'cleaning' | 'temporary' | 'rehab';
  medications?: string[];
  requirements?: string;
}

export interface Round {
  id: string;
  elder: string;
  elderId: string;
  room: string;
  time: string;
  doctor: string;
  type: string;
  status: string;
  notes: string;
}

export interface RehabPlanModel {
  id: string;
  elder: string;
  elderId: string;
  room: string;
  desc: string;
  therapist: string;
  status: string;
  progress: number;
}

export interface NursingStation {
  id: string;
  name: string;
  manager: string;
  buildings: string[]; // 关联的楼栋
  floors: string[]; // 关联的楼层
  assignedStaff: string[]; // 分配到该护理站的常规人员
}

export interface WeeklySchedule {
  id: string;      // {stationId}-{weekStart}
  stationId: string;
  weekStart: string; // YYYY-MM-DD representing the Monday
  shifts: {
    staffId: string;
    staffName: string;
    isBorrowed: boolean;  // 标识是否是外站借调
    days: string[]; // length 7 (Mon-Sun), values '白班', '夜班', '休息', etc
  }[];
}

export interface CareRecord {
  id: string;
  time: string;
  type: 'alert_resolve' | 'planned_task' | 'temporary_care';
  content: string; // Action taken
  result: string; // The outcome or notes
  elderId: string;
  elderName: string;
  caregiver: string;
}

export interface IoTDevice {
  id: string;
  sn: string;
  name: string;
  catalog: string;
  bindType: string;
  bindTarget: string;
  status: '在线' | '离线';
  lastActive: string;
  ip: string;
  elderId?: string; // Add elderId to link it with an elder
}

export interface Assessment {
  id: string;
  elderId: string;
  elderName: string;
  room: string;
  type: string;
  score: string | number;
  assessor: string;
  date: string;
  status: '待评估' | '已完成';
  answers?: Record<string, number>;
}

export interface AdmissionRecordType {
  id: string;
  name: string;
  assessmentLevel: string;
  family: string;
  phone: string;
  idCard: string;
  status: 'pending' | 'processing' | 'completed';
  progress: { info: boolean; bed: boolean; contract: boolean; payment: boolean };
  roombed?: string;
}

export interface DischargeRecordType {
  id: string;
  name: string;
  room: string;
  type: string;
  reason: string;
  applyDate: string;
  leaveDate: string;
  status: 'pending' | 'processing' | 'completed';
  checks: { items: boolean; medical: boolean; fee: boolean };
}

export interface BillItem {
  name: string;
  amount: string;
  type?: string;
  category?: string;
}

export interface BillRecordType {
  id: string;
  elder: string;
  room?: string;
  period: string;
  dueDate?: string;
  status: string; // e.g. '待核对', '已核发 (待缴款)', '已缴费', '未缴费'
  total: string; // totalAmount
  items?: BillItem[];
  deductions?: BillItem[];
  tempItems?: any[];
}

export interface TransactionType {
  id: string;
  billId?: string | null;
  elderId: string;
  amount: number;
  direction: string;
  method: string;
  operator: string;
  txTime: string;
}

export interface InsuranceClaimType {
  id: string;
  name: string;
  type: string;
  period: string;
  serviceDays: number;
  amount: number;
  status: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  warehouse: string;
  stock: number;
  unit: string;
  safeStock: number;
  val: string;
  lastUpdate: string;
}

export interface CarePlanModel {
  id: string;
  elderId: string;
  elderName: string;
  room: string;
  careLevel: string;
  goal: string;
  nextReview: string;
  manager: string;
  status: string;
  tasks: any[];
}

export interface SysUser {
  id: string; // Auth UID
  username: string; // Email
  name: string; // Display Name
  roles: string[];
  status: '正常' | '锁定';
  lastLogin: string;
}

export interface SysRole {
  id: string;
  name: string;
  code: string;
  desc: string;
  userCount: number;
  permissions?: string[];
}

export interface CustomerArchive {
  id: string;
  name: string;
  age: number;
  gender: string;
  status: string;
  careLevel?: string;
  familyContact?: string;
  phone?: string;
  date?: string;
  idCard?: string;
  bedInfo?: string;
  agreementStatus?: string;
}

export interface Agreement {
  id: string;
  archiveId: string;
  title: string;
  startDate: string;
  endDate?: string;
  guarantor?: string;
  status?: string;
}

export interface InventoryAudit {
  id: string;
  title: string;
  status: string;
  date: string;
}

export interface StoreState {
  elders: Elder[];
  staff: StaffMember[];
  beds: Bed[];
  alerts: Alert[];
  tasks: Task[];
  rounds: Round[];
  rehabPlans: RehabPlanModel[];
  careRecords: CareRecord[];
  iotDevices: IoTDevice[];
  transactions: TransactionType[];
  careLevels: CareLevel[];
  serviceItems: ServiceItem[];
  assessments: Assessment[];
  buildings: Building[];
  floors: Floor[];
  rooms: Room[];
  roomTypes: RoomType[];
  sysUsers: SysUser[];
  sysRoles: SysRole[];
  nursingStations: NursingStation[];
  schedules: WeeklySchedule[];
  customerArchives: CustomerArchive[];
  agreements: Agreement[];
  inventoryAudits: InventoryAudit[];
  
  admissions: AdmissionRecordType[];
  discharges: DischargeRecordType[];
  bills: BillRecordType[];
  insuranceClaims: any[];
  inventory: InventoryItem[];
  carePlans: CarePlanModel[];

  // Drawer Global State
  targetElderId: string | null;
  targetAction: string | null;
  targetElderTab: string;
  setTargetElderId: (id: string | null) => void;
  setTargetAction: (action: string | null) => void;
  setTargetElderTab: (tab: string) => void;
  
  // Actions
  addRound: (round: Round) => void;
  updateRound: (id: string, updates: Partial<Round>) => void;
  updateRoundStatus: (id: string, status: string, notes?: string) => void;

  addRehabPlan: (plan: RehabPlanModel) => void;
  updateRehabPlan: (id: string, updates: Partial<RehabPlanModel>) => void;

  addElder: (elder: Elder) => void;
  updateElder: (id: string, elder: Partial<Elder>) => void;
  removeElder: (id: string) => void;
  
  addStaff: (staff: StaffMember) => void;
  updateStaff: (id: string, staff: Partial<StaffMember>) => void;
  removeStaff: (id: string) => void;
  
  updateBed: (id: string, bed: Partial<Bed>) => void;
  
  addAlert: (alert: Alert) => void;
  updateAlertStatus: (id: string, status: Alert['status']) => void;
  resolveAlert: (id: string, notes: string, processedBy: string) => void;
  
  addTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  updateTaskStaff: (id: string, staff: string) => void;
  autoAssignTasks: () => void;

  addCareRecord: (record: CareRecord) => void;

  bindIoTDevice: (device: IoTDevice) => void;

  addCareLevel: (level: CareLevel) => void;
  updateCareLevel: (id: string, updates: Partial<CareLevel>) => void;
  removeCareLevel: (id: string) => void;

  addServiceItem: (item: ServiceItem) => void;
  updateServiceItem: (id: string, updates: Partial<ServiceItem>) => void;
  removeServiceItem: (id: string) => void;
  
  saveNursingStation: (station: NursingStation) => void;
  removeNursingStation: (id: string) => void;
  saveSchedule: (schedule: WeeklySchedule) => void;

  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;

  addBuilding: (building: Building) => void;
  updateBuilding: (id: string, building: Partial<Building>) => void;
  removeBuilding: (id: string) => void;
  
  addFloor: (floor: Floor) => void;
  updateFloor: (id: string, floor: Partial<Floor>) => void;
  removeFloor: (id: string) => void;

  addRoom: (room: Room) => void;
  updateRoom: (id: string, room: Partial<Room>) => void;
  removeRoom: (id: string) => void;

  addRoomType: (roomType: RoomType) => void;
  updateRoomType: (id: string, roomType: Partial<RoomType>) => void;
  removeRoomType: (id: string) => void;

  addSysUser: (user: SysUser) => void;
  updateSysUser: (id: string, user: Partial<SysUser>) => void;
  removeSysUser: (id: string) => void;

  addSysRole: (role: SysRole) => void;
  updateSysRole: (id: string, role: Partial<SysRole>) => void;
  removeSysRole: (id: string) => void;

  addCustomerArchive: (archive: CustomerArchive) => void;
  updateCustomerArchive: (id: string, arc: Partial<CustomerArchive>) => void;
  removeCustomerArchive: (id: string) => void;

  addAgreement: (agreement: Agreement) => void;
  updateAgreement: (id: string, agr: Partial<Agreement>) => void;
  removeAgreement: (id: string) => void;

  addInventoryAudit: (audit: InventoryAudit) => void;
  updateInventoryAudit: (id: string, aud: Partial<InventoryAudit>) => void;
  removeInventoryAudit: (id: string) => void;

  updateAdmission: (id: string, record: Partial<AdmissionRecordType>) => void;
  addAdmission: (record: AdmissionRecordType) => void;
  updateDischarge: (id: string, record: Partial<DischargeRecordType>) => void;
  addDischarge: (record: DischargeRecordType) => void;
  updateBillStatus: (id: string, status: string) => void;
  addTransaction: (tx: TransactionType) => void;
  addBill: (bill: BillRecordType) => void;
  updateBill: (id: string, updates: Partial<BillRecordType>) => void;
  updateInsuranceClaimStatus: (id: string, status: string) => void;
  addInsuranceClaim?: (claim: InsuranceClaimType) => void;
  updateInventory: (id: string, updates: Partial<InventoryItem>) => void;
  addCarePlan: (plan: CarePlanModel) => void;

  fetchInitialData: () => Promise<void>;
}

// Initial mock data to bootstrap the state
export const initialInventory: InventoryItem[] = [
  { id: "MAT-1001", name: "医用外科口罩", warehouse: "医疗库", stock: 1500, unit: "个", safeStock: 2000, val: "750.00", lastUpdate: "今天 09:30" },
  { id: "MAT-1002", name: "无菌纱布块", warehouse: "医疗库", stock: 850, unit: "包", safeStock: 500, val: "2,125.00", lastUpdate: "昨天 14:20" },
  { id: "MAT-2001", name: "大米(东北珍宝岛)", warehouse: "食品库", stock: 50, unit: "kg", safeStock: 100, val: "425.00", lastUpdate: "2天前" },
  { id: "MAT-3001", name: "成人纸尿裤(L号)", warehouse: "后勤库", stock: 320, unit: "包", safeStock: 150, val: "14,400.00", lastUpdate: "今天 10:15" },
  { id: "MAT-4001", name: "84消毒液", warehouse: "后勤库", stock: 12, unit: "桶", safeStock: 20, val: "540.00", lastUpdate: "3天前" },
  { id: "MAT-1005", name: "轮椅(标准版)", warehouse: "固定资产库", stock: 2, unit: "辆", safeStock: 5, val: "1,200.00", lastUpdate: "1周前" },
];

export const initialStaff: StaffMember[] = [
  { id: "EMP-001", name: "张明宇", dept: "护理一部", position: "护理主管", phone: "138-0011-0001", status: "在职", role: "主管", avatar: "https://i.pravatar.cc/150?u=EMP-1", face: true, card: "1A:2B:3C", fingerprint: false, doors: ["园区正大门", "公共活动室", "康复理疗区"] },
  { id: "EMP-002", name: "李雪", dept: "护理一部", position: "高级护理员", phone: "138-0011-0002", status: "在职", role: "员工", avatar: "https://i.pravatar.cc/150?u=EMP-2", face: false, card: null, fingerprint: false, doors: [] },
  { id: "EMP-003", name: "赵铁柱", dept: "护理部", position: "初级护理员", phone: "138-0011-0003", status: "在职", role: "员工", avatar: "https://i.pravatar.cc/150?u=EMP-3", face: true, card: "1A:2B:3C", fingerprint: false, doors: ["园区正大门", "公共活动室", "康复理疗区"] },
  { id: "EMP-004", name: "罗大牛", dept: "后勤部(仓库/厨房)", position: "后勤专员", phone: "138-0011-0005", status: "在职", role: "员工", avatar: "https://i.pravatar.cc/150?u=EMP-4", face: true, card: "5F:8A:21", fingerprint: false, doors: ["园区正大门", "厨房后场区", "物资仓库"] },
  { id: "EMP-005", name: "孙国轩", dept: "医疗中心", position: "全科医生", phone: "138-0011-0004", status: "在职", role: "主管", avatar: "https://i.pravatar.cc/150?u=EMP-5", face: false, card: null, fingerprint: false, doors: ["园区正大门", "医疗室", "药房", "行政办公区"] },
  { id: "EMP-006", name: "陈敏儿", dept: "护理部", position: "高级护理员", phone: "138-0011-0006", status: "在职", role: "员工", avatar: "https://i.pravatar.cc/150?u=EMP-6", face: true, card: "2A:3B:4C", fingerprint: false, doors: ["园区正大门", "公共活动室"] },
  { id: "EMP-007", name: "周文华", dept: "行政部", position: "行政专员", phone: "138-0011-0007", status: "在职", role: "员工", avatar: "https://i.pravatar.cc/150?u=EMP-7", face: false, card: null, fingerprint: false, doors: ["园区正大门", "行政办公区"] },
  { id: "EMP-008", name: "林建国", dept: "安保部", position: "安保队长", phone: "138-0011-0008", status: "在职", role: "主管", avatar: "https://i.pravatar.cc/150?u=EMP-8", face: true, card: "8B:9C:0D", fingerprint: true, doors: ["园区正大门", "监控室", "所有区域"] },
  { id: "EMP-009", name: "王康复", dept: "医疗与康复部", position: "理疗师", phone: "138-0011-0009", status: "在职", role: "员工", avatar: "https://i.pravatar.cc/150?u=EMP-9", face: true, card: null, fingerprint: false, doors: ["园区正大门", "康复理疗区", "医疗室"] },
  { id: "EMP-010", name: "李医师", dept: "医疗与康复部", position: "康复医师", phone: "138-0011-0010", status: "在职", role: "主管", avatar: "https://i.pravatar.cc/150?u=EMP-10", face: true, card: null, fingerprint: false, doors: ["园区正大门", "康复理疗区", "医疗室"] },
];

export const initialElders: Elder[] = [
  { id: '1', name: '王桂珍', room: 'A栋-101', age: 78, gender: '女', careLevel: '二级护理', healthStatus: '高血压', admissionDate: '2023-05-12', avatar: 'https://i.pravatar.cc/150?u=ELD-1', face: true, card: null, fingerprint: true, doors: ["园区正大门", "公共活动室", "康复理疗区"] },
  { id: '2', name: '钱德明', room: 'B栋-205', age: 82, gender: '男', careLevel: '特级护理', healthStatus: '糖尿病, 行动不便', admissionDate: '2022-11-08', avatar: 'https://i.pravatar.cc/150?u=ELD-2', face: false, card: null, fingerprint: false, doors: [] },
  { id: '3', name: '吴秀兰', room: 'A栋-102', age: 76, gender: '女', careLevel: '三级护理', healthStatus: '心血管疾病', admissionDate: '2021-03-20', avatar: 'https://i.pravatar.cc/150?u=ELD-3', face: false, card: null, fingerprint: false, doors: [] },
  { id: '4', name: '冯国强', room: 'A栋-101', age: 85, gender: '男', careLevel: '一级护理', healthStatus: '阿尔茨海默症早期表现', admissionDate: '2022-08-15', avatar: 'https://i.pravatar.cc/150?u=ELD-4', face: true, card: null, fingerprint: false, doors: ["园区正大门", "公共活动室"] },
  { id: '5', name: '楚玉英', room: 'A栋-102', age: 72, gender: '女', careLevel: '三级护理', healthStatus: '一般', admissionDate: '2024-01-10', avatar: 'https://i.pravatar.cc/150?u=ELD-5', face: true, card: 'FC:11:8A', fingerprint: true, doors: ["园区正大门", "公共活动室", "手工艺室"] },
  { id: '6', name: '卫广平', room: 'A栋-103', age: 88, gender: '男', careLevel: '特级护理', healthStatus: '冠心病，常年卧床', admissionDate: '2020-12-05', avatar: 'https://i.pravatar.cc/150?u=ELD-6', face: false, card: null, fingerprint: false, doors: [] },
  { id: '7', name: '蒋雪梅', room: 'A栋-201', age: 69, gender: '女', careLevel: '三级护理', healthStatus: '骨质疏松，视力不佳', admissionDate: '2023-07-22', avatar: 'https://i.pravatar.cc/150?u=ELD-7', face: true, card: null, fingerprint: true, doors: ["园区正大门", "公共活动室", "阅览室"] },
  { id: '8', name: '沈建设', room: 'A栋-201', age: 74, gender: '男', careLevel: '二级护理', healthStatus: '慢性支气管炎', admissionDate: '2023-09-01', avatar: 'https://i.pravatar.cc/150?u=ELD-8', face: true, card: null, fingerprint: false, doors: ["园区正大门", "棋牌室"] },
  { id: '9', name: '韩佩云', room: 'A栋-202', age: 81, gender: '女', careLevel: '一级护理', healthStatus: '中风后遗症，偏瘫', admissionDate: '2021-10-18', avatar: 'https://i.pravatar.cc/150?u=ELD-9', face: false, card: null, fingerprint: false, doors: [] },
  { id: '10', name: '杨德培', room: 'A栋-203', age: 79, gender: '男', careLevel: '二级护理', healthStatus: '帕金森综合症', admissionDate: '2022-04-30', avatar: 'https://i.pravatar.cc/150?u=ELD-10', face: true, card: null, fingerprint: false, doors: ["园区正大门", "康复理疗区"] },
  { id: '11', name: '朱金凤', room: 'A栋-105', age: 75, gender: '女', careLevel: '二级护理', healthStatus: '糖尿病', admissionDate: '2023-11-12', avatar: 'https://i.pravatar.cc/150?u=ELD-11', face: true, card: null, fingerprint: true, doors: ["园区正大门", "公共活动室"] },
  { id: '12', name: '秦振宇', room: 'A栋-105', age: 80, gender: '男', careLevel: '一级护理', healthStatus: '高血压、脑梗后遗症', admissionDate: '2022-02-28', avatar: 'https://i.pravatar.cc/150?u=ELD-12', face: false, card: null, fingerprint: false, doors: [] },
  { id: '13', name: '尤秋叶', room: 'A栋-202', age: 77, gender: '女', careLevel: '三级护理', healthStatus: '一般', admissionDate: '2024-03-05', avatar: 'https://i.pravatar.cc/150?u=ELD-13', face: true, card: 'AA:BB:CC', fingerprint: true, doors: ["园区正大门", "公共活动室", "阅览室"] },
  { id: '14', name: '许万才', room: 'B栋-205', age: 86, gender: '男', careLevel: '特级护理', healthStatus: '长期卧床、需要全面护理', admissionDate: '2021-08-20', avatar: 'https://i.pravatar.cc/150?u=ELD-14', face: false, card: null, fingerprint: false, doors: [] },
  { id: '15', name: '吕淑芳', room: 'A栋-103', age: 71, gender: '女', careLevel: '自理护理', healthStatus: '骨关节炎', admissionDate: '2024-05-18', avatar: 'https://i.pravatar.cc/150?u=ELD-15', face: true, card: null, fingerprint: false, doors: ["园区正大门", "公共活动室"] },
  { id: '16', name: '张宝林', room: 'B栋-201', age: 84, gender: '男', careLevel: '二级护理', healthStatus: '前列腺增生，轻度认知衰退', admissionDate: '2022-01-20', avatar: 'https://i.pravatar.cc/150?u=ELD-16', face: false, card: null, fingerprint: false, doors: ["园区正大门"] },
  { id: '17', name: '曹翠屏', room: 'C栋-302', age: 89, gender: '女', careLevel: '特级护理', healthStatus: '老年病综合征，营养不良', admissionDate: '2020-03-10', avatar: 'https://i.pravatar.cc/150?u=ELD-17', face: false, card: null, fingerprint: false, doors: [] },
  { id: '18', name: '孔祥辉', room: 'A栋-203', age: 73, gender: '男', careLevel: '一级护理', healthStatus: '痛风，下肢静脉曲张', admissionDate: '2023-08-05', avatar: 'https://i.pravatar.cc/150?u=ELD-18', face: true, card: null, fingerprint: true, doors: ["园区正大门", "公共活动室", "棋牌室"] },
  { id: '19', name: '施玉英', room: 'B栋-202', age: 81, gender: '女', careLevel: '二级护理', healthStatus: '轻度贫血，骨质疏松', admissionDate: '2023-12-11', avatar: 'https://i.pravatar.cc/150?u=ELD-19', face: true, card: null, fingerprint: false, doors: ["园区正大门", "阅览室"] },
  { id: '20', name: '华志明', room: 'C栋-301', age: 78, gender: '男', careLevel: '自理护理', healthStatus: '健康状况良好，高血脂', admissionDate: '2024-06-01', avatar: 'https://i.pravatar.cc/150?u=ELD-20', face: true, card: "AA:11:22", fingerprint: true, doors: ["园区正大门", "公共活动室", "康复理疗区", "棋牌室", "健身房"] },
];

export const initialBeds: Bed[] = [
  { id: '101-1', building: 'A栋', floor: '一层 (重度护理区)', room: '101', roomType: '双人间', status: 'occupied', elderId: '1' },
  { id: '101-2', building: 'A栋', floor: '一层 (重度护理区)', room: '101', roomType: '双人间', status: 'occupied', elderId: '4' },
  { id: '102-1', building: 'A栋', floor: '一层 (重度护理区)', room: '102', roomType: '双人间', status: 'occupied', elderId: '3' },
  { id: '102-2', building: 'A栋', floor: '一层 (重度护理区)', room: '102', roomType: '双人间', status: 'occupied', elderId: '5' },
  { id: '103-1', building: 'A栋', floor: '一层 (重度护理区)', room: '103', roomType: '单人间', status: 'occupied', elderId: '6' },
  { id: '105-1', building: 'A栋', floor: '一层 (重度护理区)', room: '105', roomType: '三人间', status: 'maintenance' },
  { id: '105-2', building: 'A栋', floor: '一层 (重度护理区)', room: '105', roomType: '三人间', status: 'occupied', elderId: '11' },
  { id: '105-3', building: 'A栋', floor: '一层 (重度护理区)', room: '105', roomType: '三人间', status: 'occupied', elderId: '12' },
  { id: '201-1', building: 'A栋', floor: '二层 (中度护理区)', room: '201', roomType: '双人间', status: 'occupied', elderId: '7' },
  { id: '201-2', building: 'A栋', floor: '二层 (中度护理区)', room: '201', roomType: '双人间', status: 'occupied', elderId: '8' },
  { id: '202-1', building: 'A栋', floor: '二层 (中度护理区)', room: '202', roomType: '双人间', status: 'occupied', elderId: '9' },
  { id: '202-2', building: 'A栋', floor: '二层 (中度护理区)', room: '202', roomType: '双人间', status: 'occupied', elderId: '13' },
  { id: '203-1', building: 'A栋', floor: '二层 (中度护理区)', room: '203', roomType: '单人间', status: 'occupied', elderId: '10' },
  // B栋 beds
  { id: '205-1', building: 'B栋', floor: '二层 (特级护理区)', room: '205', roomType: '双人间', status: 'occupied', elderId: '2' },
  { id: '205-2', building: 'B栋', floor: '二层 (特级护理区)', room: '205', roomType: '双人间', status: 'occupied', elderId: '14' },
];

export const initialAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "fall",
    title: "毫米波跌倒雷达：发生跌倒",
    location: "102-1",
    resident: "吴秀兰",
    device: "毫米波跌倒雷达",
    time: "2分钟前",
    level: "critical",
    status: 'pending',
  },
  {
    id: "ALT-002",
    type: "sos",
    title: "床头呼叫器：紧急呼叫",
    location: "101-1",
    resident: "王桂珍",
    device: "床头呼叫器",
    time: "刚刚",
    level: "critical",
    status: 'pending',
  },
  {
    id: "ALT-003",
    type: "vital_signs",
    title: "智能床垫：心率异常偏高 (135次/分)",
    location: "205-1",
    resident: "钱德明",
    device: "智能生命体征床垫",
    time: "5分钟前",
    level: "high",
    status: 'pending',
    notes: "护工(赵铁柱)正在现场确认"
  },
  {
    id: "ALT-004",
    type: "leave_bed",
    title: "智能床垫：夜间起夜离床超时 (>30分钟)",
    location: "105-2",
    resident: "李建国",
    device: "智能床垫",
    time: "15分钟前",
    level: "warning",
    status: 'pending',
  },
  {
    id: "ALT-005",
    type: "geo_fence",
    title: "防走失系统：认知症长者越界报警 (靠近大门)",
    location: "102-2",
    resident: "防走失长者",
    device: "防走失胸牌/蓝牙基站",
    time: "刚刚",
    level: "critical",
    status: 'pending',
  },
  {
    id: "ALT-006",
    type: "vital_signs",
    title: "智能床垫：连续睡眠呼吸暂停超时 (>15秒)",
    location: "103-1",
    resident: "刘爱华",
    device: "智能生命体征床垫",
    time: "1分钟前",
    level: "critical",
    status: 'pending',
  },
  {
    id: "ALT-007",
    type: "device_offline",
    title: "系统健康：防跌倒雷达设备离线",
    location: "201-1",
    resident: "未知",
    device: "101套房主卫防跌倒",
    time: "1小时前",
    level: "low",
    status: 'pending',
    notes: "网络波动导致假掉线"
  },
  {
    id: "ALT-008",
    type: "smoke_fire",
    title: "消防系统：烟雾浓度超标告警",
    location: "203-1",
    resident: "公共区域",
    device: "无线烟感器",
    time: "3分钟前",
    level: "critical",
    status: 'pending',
    notes: "安保处已派员核查"
  }
];

export const initialTasks: Task[] = [
  { id: '1', name: '辅助服药 (降压药)', elder: '王桂珍 (A栋-101)', time: '10:30', staff: '待指派', status: 'pending', type: 'medical' },
  { id: '2', name: '协助沐浴', elder: '钱德明 (B栋-205)', time: '14:00', staff: '赵铁柱', status: 'in_progress', type: 'care' },
  { id: '3', name: '环境消杀', elder: '公共区域', time: '16:00', staff: '罗大牛', status: 'pending', type: 'cleaning' },
  { id: '4', name: '偏瘫肢体综合测试、步态训练', elder: '张伟明 (A栋-201)', time: '09:30', staff: '李医师', status: 'pending', type: 'rehab' },
  { id: '5', name: '记忆力卡片、积木拼图 (认知训练)', elder: '王秀兰 (B栋-305)', time: '14:00', staff: '王康复', status: 'in_progress', type: 'rehab' },
];

export const initialCareRecords: CareRecord[] = [
  { id: 'REC-001', time: '2023-10-27 08:30:00', type: 'planned_task', content: '晨间护理及测血压', result: '血压130/80，心率75，状态可', elderId: '1', elderName: '王桂珍', caregiver: '张明宇' },
  { id: 'REC-002', time: '2023-10-27 09:15:00', type: 'temporary_care', content: '更换床单被套', result: '已更换', elderId: '3', elderName: '吴秀兰', caregiver: '李雪' },
];

export const initialIotDevices: IoTDevice[] = [
  { id: "DEV-RD-101", sn: "SN88492011", name: "101套房主卫防跌倒", catalog: "毫米波防跌倒雷达", bindType: "位置绑定", bindTarget: "A栋-1层-101房-卫生间", status: "在线", lastActive: "刚刚", ip: "192.168.10.15", elderId: "1" },
  { id: "DEV-RD-102", sn: "SN88492012", name: "102套房主卫防跌倒", catalog: "毫米波防跌倒雷达", bindType: "位置绑定", bindTarget: "A栋-1层-102房-卫生间", status: "在线", lastActive: "5分钟前", ip: "192.168.10.16", elderId: "3" },
  { id: "DEV-SOS-01", sn: "SN-S-00102", name: "随身呼叫器", catalog: "一键紧急呼叫器", bindType: "人员绑定", bindTarget: "王桂珍 (A101)", status: "在线", lastActive: "刚刚", ip: "Zigbee 网关", elderId: "1" },
  { id: "DEV-MAT-05", sn: "SM300-99X2", name: "A105智能床垫", catalog: "智能体征监测床垫", bindType: "床位绑定", bindTarget: "A栋-105房-1号床", status: "离线", lastActive: "2小时前", ip: "4G网络", elderId: "1" },
];

export const initialRounds: Round[] = [
  { id: "R2026-001", elder: "张伟明", elderId: "E001", room: "A栋-201", time: "09:30", doctor: "王主任", type: "例行查房", status: "已完成", notes: "血压偏高，建议调整降压药" },
  { id: "R2026-002", elder: "李秀兰", elderId: "E002", room: "B栋-305", time: "10:15", doctor: "刘医生", type: "重点观察", status: "未开始", notes: "昨日有咳嗽症状" },
  { id: "R2026-003", elder: "赵建国", elderId: "E003", room: "A栋-102", time: "11:00", doctor: "王主任", type: "家属预约", status: "未开始", notes: "复查关节情况" },
];

export const initialRehabPlans: RehabPlanModel[] = [
  { id: "RP2026-001", elder: "张伟明", elderId: "E001", room: "A栋-201", desc: "右侧偏瘫肢体康复", therapist: "李医师", status: "进行中", progress: 65 },
  { id: "RP2026-002", elder: "王秀兰", elderId: "E00X", room: "B栋-305", desc: "阿尔茨海默症认知训练", therapist: "王康复", status: "进行中", progress: 40 },
  { id: "RP2026-003", elder: "刘建国", elderId: "E00Y", room: "A栋-102", desc: "髋关节置换术后恢复", therapist: "李医师", status: "已完成", progress: 100 },
];

export const initialCareLevels: CareLevel[] = [
  { id: 'lvl-1', name: '一级护理 (专护)', desc: '完全不能自理，需要24小时专人陪护。', price: 6000, color: 'bg-red-50 text-red-600 border-red-200' },
  { id: 'lvl-2', name: '二级护理 (高护)', desc: '半自理，认知障碍或肢体功能部分丧失，需协助完成日常起居。', price: 4500, color: 'bg-orange-50 text-orange-600 border-orange-200' },
  { id: 'lvl-3', name: '三级护理 (中护)', desc: '基本自理，需要提供基础生活照料与健康监测。', price: 3000, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { id: 'lvl-4', name: '自理护理 (普护)', desc: '完全自理长者，仅提供安全巡视及文化娱乐等常规服务。', price: 1500, color: 'bg-green-50 text-green-600 border-green-200' },
];

export const initialServiceItems: ServiceItem[] = [
  {
    id: 'ltc-001',
    category: '清洁照料',
    name: '洗头 (床上洗发) [国标]',
    frequency: '1-2次/周',
    duration: '20-30分钟',
    includedIn: ['lvl-2', 'lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 评估与准备：评估长者头皮、头发状况及全身情况（有无颈椎损伤等禁忌症）。准备马蹄形垫、防水布、水壶（水温40-45℃）、毛巾、洗发液、吹风机。',
      '2. 环境准备：关闭门窗，调节室温至24-26℃，保护长者隐私。',
      '3. 体位安置：协助长者平卧，将头部移至床沿，解开衣领，将其衣领向内折叠，铺上毛巾和防水垫。',
      '4. 实施洗发：放置马蹄形洗发垫，用棉球塞住双耳，纱布遮盖双眼。用温水润湿头发，涂抹洗发液，指腹轻轻揉搓头皮和头发。',
      '5. 冲洗与擦干：反复清水冲洗干净，撤去洗发用具。用毛巾擦干头发，注意保暖。',
      '6. 整理与恢复：使用吹风机吹干头发（注意温度适宜距离15cm以上），协助长者梳理并恢复舒适体位。',
      '7. 观察与记录：洗发过程中密切观察长者面色、脉搏、呼吸，如有异常立即停止。记录头皮状况及洗发过程。'
    ]
  },
  {
    id: 'ltc-002',
    category: '清洁照料',
    name: '擦浴 (温水擦浴) [国标]',
    frequency: '每天或隔天1次',
    duration: '30分钟',
    includedIn: ['lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 评估与准备：评估长者皮肤状况及耐受度，准备脸盆2个（水温50-52℃）、毛巾、大浴巾、清洁衣物。',
      '2. 环境准备：冬日开暖气室温调至24℃以上，关门窗避风，拉好床帘。',
      '3. 实施-上肢：脱去长者衣物（先脱近侧后脱远侧），大浴巾覆盖全身。洗净面部、颈部，依次擦洗双上肢（注意腋下清洁）。',
      '4. 实施-躯干：擦洗胸腹部，观察有无皮疹、破溃。协助长者侧卧，擦洗背部、臀部。',
      '5. 实施-下肢及足部：换水后擦洗双下肢，重点清洁大腿根部和腘窝。洗净双足后擦干。',
      '6. 更换衣物：擦洗完毕后迅速擦干，抹上润肤露，协助穿上清洁衣物（先穿远侧后穿近侧）。',
      '7. 整理记录：整理床单位及用物，记录长者皮肤完整性及生命体征变化。'
    ]
  },
  {
    id: 'ltc-003',
    category: '清洁照料',
    name: '口腔清洁护理 [国标]',
    frequency: '2次/天',
    duration: '10-15分钟',
    includedIn: ['lvl-2', 'lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 评估准备：评估口腔粘膜、牙龈有无出血、溃疡，有无假牙。准备治疗碗、压舌板、血管钳、棉球/海绵棒、漱口液。',
      '2. 体位安置：长者取侧卧位或仰卧偏头位，颈下垫毛巾，放置弯盘。',
      '3. 擦洗顺序：拧干棉球（以不滴水为宜），嘱长者咬合上、下颌，从外侧由内向外纵向擦洗牙齿外面。',
      '4. 内部清洁：嘱长者张口，擦洗牙齿内面、咬合面及颊部、硬腭。注意每次只夹一个棉球，防止遗留在口腔。',
      '5. 假牙处理：如有活动假牙，应取下用冷水刷洗干净，浸泡于清水中保存（不可用热水）。',
      '6. 整理记录：协助漱口、擦干面部。涂抹润唇油防止干裂。记录口腔粘膜情况、气味等。'
    ]
  },
  {
    id: 'ltc-004',
    category: '排泄照料',
    name: '失禁护理及更换尿布 [国标]',
    frequency: '有污需即刻处理',
    duration: '15-20分钟',
    includedIn: ['lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 评估与准备：评估排泄物性状、量及皮肤状况。准备温水盆、毛巾/湿巾、清洁尿裤或纸尿垫、润肤膏/护臀霜、垃圾袋。',
      '2. 环境与体位：关闭门窗，保护隐私。协助长者仰卧，褪下裤子，解开脏纸尿裤。',
      '3. 初步清洁：对于大便失禁者，先用纸尿裤干净部分或卫生纸擦去主要粪便。',
      '4. 彻底清洗：用温水和湿毛巾从前向后擦洗会阴部，臀部和肛周，注意皮肤褶皱处的清洁。女性必须由前向后擦拭，防止泌尿系感染。',
      '5. 干燥与保护：用干毛巾擦干皮肤，针对肛周皮肤发红部位涂抹护臀霜或氧化锌软膏。',
      '6. 更换敷料：更换清洁垫或纸尿裤，整理床单，恢复长者衣着及舒适体位。',
      '7. 观察记录：观察并记录排泄物颜色、量、性状，以及皮肤是否有红斑或压疮。'
    ]
  },
  {
    id: 'ltc-005',
    category: '饮食照料',
    name: '协助进食水 [国标]',
    frequency: '3餐/天',
    duration: '30-40分钟',
    includedIn: ['lvl-2', 'lvl-3'],
    sopSteps: [
      '1. 评估与准备：评估长者咀嚼及吞咽能力，是否存在呛咳风险。检查食物温度(微温38-40℃合适)、质地。准备围巾、餐具。',
      '2. 体位安置：协助长者取坐位或半坐卧位（床头抬高30°~60°），头稍前倾。',
      '3. 进食过程：少量多口喂食（每次1/3汤匙），送入健侧舌根部，确认上一口完全吞咽后再喂下一口。',
      '4. 应对呛咳：若发生呛咳，立即停止喂食，协助长者头偏向一侧或前倾咳出异物，拍打背部。',
      '5. 饭后处理：进食后保持同一体位30分钟，防止反流。协助长者漱口，清洁面部及口腔内食物残渣。',
      '6. 记录报备：记录进食量、种类，以及吞咽过程中有无异常（如呛咳、吞咽困难等）。'
    ]
  },
  {
    id: 'ltc-006',
    category: '体位与安全',
    name: '协助翻身及有效叩背 [国标]',
    frequency: '每2小时1次',
    duration: '10-15分钟',
    includedIn: ['lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 评估与准备：评估长者皮肤受压情况，有无禁忌症（如骨折未固定）。解开约束带或导管，准备软枕。',
      '2. 翻身操作：操作者站于要翻向的一侧，一手托住长者肩背部，一手托住臀部，同时用力将其翻转至侧卧位。',
      '3. 垫靠软枕：在长者背部、胸前及两膝之间垫上软枕，保持肢体处于功能位，防止局部皮肤直接受压。',
      '4. 叩背排痰：五指并拢，掌心空杯状（或使用硅胶叩背器），由下至上、由外向内叩击背部，避开脊柱和肾区。',
      '5. 叩背频率与时间：叩击频率100-120次/分钟，每次3-5分钟，听取有无空洞声。观察长者呼吸及面色，协助咳痰。',
      '6. 整理记录：整理长者衣物被褥，记录翻身时间、卧位及受压部位皮肤情况。'
    ]
  },
  {
    id: 'ltc-007',
    category: '体位与安全',
    name: '轮椅/床椅转移 [国标]',
    frequency: '按需',
    duration: '5-10分钟',
    includedIn: ['lvl-2', 'lvl-3'],
    sopSteps: [
      '1. 评估环境用物：评估长者肌力及配合度。准备轮椅，检查刹车、轮胎气压，移开脚踏板。',
      '2. 放置轮椅：将轮椅置于长者健侧，斜放与床呈30°-45°角，一定要锁定轮椅刹车。',
      '3. 协助起坐：先协助长者翻身至床沿，双下肢垂于床边，静坐1-2分钟观察有无头晕（预防体位性低血压）。',
      '4. 站立转移：护理员双膝抵住长者患侧膝盖，双手抱住其腰背部（或抓紧转移腰带）。长者双手环在护理员肩背部。',
      '5. 旋转落座：以健侧下肢为轴心旋转身体，背对轮椅后，缓慢屈膝坐下。',
      '6. 整理保护：放下脚踏板，固定双足。系好安全带，询问其舒适度。'
    ]
  },
  {
    id: 'ltc-008',
    category: '基础医疗护理',
    name: '压疮预防与护理 [国标]',
    frequency: '每日基础巡查',
    duration: '15分钟',
    includedIn: ['lvl-2', 'lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 风险评估：使用Braden量表定期评估。识别高危部位（骶尾、足跟、枕骨粗隆等）。',
      '2. 减压措施：睡气垫床，保证每2小时翻身一次。使用软枕或硅胶减压垫腾空足跟、脚踝。',
      '3. 保持干燥：大小便后及时清洗擦干，出汗多时及时换衣，保持床单位平整、干燥、无渣屑。',
      '4. 营养支持：遵医嘱或营养师建议，给予高蛋白、高热量、富含维生素饮食，补充水分。',
      '5. 局部观察：严禁强力按摩发红和受压部位皮肤。若发现可疑发红（Ⅰ期），使用减压贴保护；有破溃及时报告并由护士处理。'
    ]
  },
  {
    id: 'ltc-009',
    category: '基础医疗护理',
    name: '鼻饲管喂食 [国标]',
    frequency: '按要求顿服',
    duration: '20分钟',
    includedIn: ['lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 评估与准备：评估有无腹胀、腹泻。准备温度适宜的流质饮食（38-40℃）、温水50ml、用药、无菌注射器。',
      '2. 体位安置：抬高床头30°-45°，如无禁忌防止食物反流。',
      '3. 核对与确认：回抽胃液确认胃管在胃内，观察抽出液颜色及量（若抽出量过多可能需推迟喂食）。',
      '4. 喂食操作：先注入20ml温开水润滑胃管，随后缓慢注入流质食物，每次注入量不超过200ml，整个过程不少于15分钟。',
      '5. 冲管：注入完毕后，再注入20-30ml温开水冲洗胃管，防止食物残渣堵塞或发酵。',
      '6. 封管与整理：盖好胃管开口，端妥固定。要求长者保持半卧位30-60分钟。'
    ]
  },
  {
    id: 'ltc-010',
    category: '基础医疗护理',
    name: '留置导尿管护理 [国标]',
    frequency: '1-2次/天',
    duration: '15分钟',
    includedIn: ['lvl-3', 'lvl-4'],
    sopSteps: [
      '1. 洗手与准备：戴上手套，准备温水、棉签、碘伏或温和清洁液。',
      '2. 尿道口清洁：女性从前向后、男性以尿道口为中心向外旋转擦拭尿道口及导尿管近端。',
      '3. 导管固定与尿袋位置：妥善固定导管防止牵拉，尿袋必须保持在膀胱水平以下（低于大腿或挂在床边），防止尿液倒流感染。',
      '4. 排空尿液：定时清空尿袋，防止过满（不要超过2/3处）。排空时不要让排尿口接触容器。',
      '5. 观察记录：观察并记录尿液的颜色、性状和量，如发现浑浊、血尿等立即上报。'
    ]
  }
];

export const initialAssessments: Assessment[] = [
  { id: "ASM-001", elderId: "1", elderName: "王桂珍", room: "A栋-101", type: "日常生活能力评定 (ADL / Barthel)", score: "65", assessor: "张明宇", date: "2023-11-20", status: "已完成" },
  { id: "ASM-002", elderId: "2", elderName: "钱德明", room: "B栋-205", type: "精神状态评估 (MMSE)", score: "12", assessor: "孙国轩", date: "2023-10-15", status: "已完成" },
  { id: "ASM-003", elderId: "3", elderName: "吴秀兰", room: "A栋-102", type: "跌倒坠床风险评估 (Morse)", score: "-", assessor: "李雪", date: "2023-11-25", status: "待评估" }
];

export const initialSysUsers: SysUser[] = [
  { id: 'U1', username: 'admin@system.com', name: '系统管理员', roles: ['超级管理员'], status: '正常', lastLogin: '-' }
];

export const initialSysRoles: SysRole[] = [
  { id: 'R1', name: '超级管理员', code: 'admin', desc: '拥有系统所有权限', userCount: 1 },
  { id: 'R2', name: '部门主管', code: 'dept_manager', desc: '负责部门内人员和排班', userCount: 0 },
  { id: 'R3', name: '护理员', code: 'caregiver', desc: '一线护理人员，处理任务', userCount: 0 },
];

export const initialAdmissions: AdmissionRecordType[] = [
  { id: "ADM-20231102-01", name: "张明宇", assessmentLevel: "二级护理", family: "张小强", phone: "13800138000", idCard: "1101051945XXXXXXXX", status: "processing", progress: { info: true, bed: true, contract: false, payment: false } },
  { id: "ADM-20231030-01", name: "李秀红", assessmentLevel: "认知症专护", family: "王芳", phone: "13900139000", idCard: "1101081950XXXXXXXX", status: "pending", progress: { info: false, bed: false, contract: false, payment: false } },
  { id: "ADM-20231028-02", name: "王大山", assessmentLevel: "自理", family: "王建国", phone: "13700137000", idCard: "1101011940XXXXXXXX", status: "completed", progress: { info: true, bed: true, contract: true, payment: true }, roombed: "B栋-302-01" },
];

export const initialDischarges: DischargeRecordType[] = [
  { id: "OUT-20231102-01", name: "赵大爷", room: "A栋-305", type: "正常退住", reason: "家属接回居家照护", applyDate: "2023-11-01", leaveDate: "2023-11-05", status: "processing", checks: { items: true, medical: false, fee: false } },
  { id: "OUT-20231028-02", name: "王奶奶", room: "B栋-102", type: "医疗转院", reason: "突发疾病转三甲医院", applyDate: "2023-10-28", leaveDate: "2023-10-28", status: "completed", checks: { items: true, medical: true, fee: true } },
  { id: "OUT-20231025-01", name: "刘建国", room: "A栋-102", type: "正常退住", reason: "试住期满不满意", applyDate: "2023-10-20", leaveDate: "2023-10-24", status: "completed", checks: { items: true, medical: true, fee: true } },
];

export const initialCarePlans: CarePlanModel[] = [
  { id: "PLN-001", elderId: "1", elderName: "王桂珍", room: "A栋-101", careLevel: "二级护理", goal: "维持现有日常生活自理能力，控制高血压指标稳定。", nextReview: "2026-10-20", manager: "李护士长", status: "执行中", tasks: [] },
  { id: "PLN-002", elderId: "2", elderName: "钱德明", room: "B栋-205", careLevel: "特级护理", goal: "防游走迷失，延缓认知退化，保障营养摄入。", nextReview: "2026-10-05", manager: "张主管", status: "执行中", tasks: [] }
];

export const initialBills: BillRecordType[] = [
  { 
    id: "B-202604-001", elder: "张明宇", room: "A栋-101", period: "2026年04月",
    total: "8,500.00", status: "待核对",
    items: [
      { category: "固定费用", name: "床位费", amount: "4,000.00" },
      { category: "固定费用", name: "二级护理费", amount: "2,500.00" },
      { category: "固定费用", name: "基础餐饮费", amount: "1,500.00" },
      { category: "浮动费用", name: "点餐费/加餐费", amount: "350.00" },
      { category: "浮动费用", name: "水电费(超额)", amount: "150.00" }
    ],
    deductions: [
      { name: "长护险补贴扣除", amount: "-200.00" }
    ]
  },
  { 
    id: "B-202604-002", elder: "王秀芳", room: "B栋-205", period: "2026年03月",
    total: "6,200.00", status: "已核发 (待缴款)",
    items: [
      { category: "固定费用", name: "床位费", amount: "3,000.00" },
      { category: "固定费用", name: "三级护理费", amount: "1,500.00" },
      { category: "固定费用", name: "基础餐饮费", amount: "1,500.00" },
      { category: "浮动费用", name: "耗材购买费", amount: "200.00" }
    ]
  },
  { 
    id: "B-202604-003", elder: "陈建国", room: "A栋-102", period: "2026年03月",
    total: "6,000.00", status: "已缴费",
    items: [
      { category: "固定费用", name: "床位费", amount: "3,000.00" },
      { category: "固定费用", name: "三级护理费", amount: "1,500.00" },
      { category: "固定费用", name: "基础餐饮费", amount: "1,500.00" }
    ]
  },
  { 
    id: "BILL-2026-04-101", elder: "刘奶奶", room: "A栋-101床", period: "2026年04月 (下半月)", dueDate: "2026-05-05", status: "未缴费", total: "4,600.00",
    items: [
       { name: "基础床位费 (套房单间)", amount: "2,500.00", type: "fixed" },
       { name: "二级护理服务费", amount: "1,500.00", type: "fixed" },
       { name: "营养餐饮费", amount: "600.00", type: "fixed" },
    ]
  },
  { 
    id: "BILL-2026-04-102", elder: "王爷爷", room: "C栋-305床", period: "2026年04月 (下半月)", dueDate: "2026-05-05", status: "未缴费", total: "3,250.00",
    items: [
       { name: "基础床位费 (标准双人)", amount: "1,500.00", type: "fixed" },
       { name: "三级护理服务费", amount: "1,000.00", type: "fixed" },
       { name: "基础餐饮费", amount: "600.00", type: "fixed" },
       { name: "特需陪同看病", amount: "150.00", type: "variable" }
    ]
  }
];

export const initialInsuranceClaims: InsuranceClaimType[] = [
  { id: 'INS-001', name: '王桂珍', type: '长护险 - 三级', period: '2026年05月', serviceDays: 31, amount: 3100, status: '资料已齐' },
  { id: 'INS-002', name: '刘建国', type: '长护险 - 特级', period: '2026年05月', serviceDays: 28, amount: 4200, status: '资料已齐' },
  { id: 'INS-003', name: '陈伯伯', type: '职工医保 (床日)', period: '2026年05月', serviceDays: 15, amount: 1500, status: '待医生签字' },
  { id: 'INS-011', name: '赵奶奶', type: '长护险 - 二级', period: '2026年04月', serviceDays: 30, amount: 2400, status: '医保局审核中' },
  { id: 'INS-012', name: '张老先生', type: '长护险 - 三级', period: '2026年04月', serviceDays: 30, amount: 3000, status: '医保局审核中' },
  { id: 'INS-013', name: '李大爷', type: '职工医保 (床位)', period: '2026年04月', serviceDays: 30, amount: 1800, status: '部分材料需补充' },
  { id: 'INS-091', name: '王桂珍', type: '长护险 - 三级', period: '2026年03月', serviceDays: 31, amount: 3100, status: '拨付到账' },
  { id: 'INS-092', name: '刘建国', type: '长护险 - 特级', period: '2026年03月', serviceDays: 31, amount: 4650, status: '拨付到账' },
];

export const initialTransactions: TransactionType[] = [];
export const initialSchedules: WeeklySchedule[] = [
  {
      id: "NS-001-2026-04-27",
      stationId: "NS-001",
      weekStart: "2026-04-27",
      shifts: [
        { staffId: "EMP-001", staffName: "张明宇", isBorrowed: false, days: ["白班", "白班", "白班", "夜班", "夜班", "休息", "休息"] },
        { staffId: "EMP-002", staffName: "李雪", isBorrowed: false, days: ["休息", "休息", "白班", "白班", "夜班", "夜班", "白班"] },
        { staffId: "EMP-003", staffName: "赵铁柱", isBorrowed: false, days: ["夜班", "夜班", "休息", "白班", "白班", "白班", "夜班"] },
        { staffId: "EMP-004", staffName: "罗大牛", isBorrowed: false, days: ["白班", "白班", "白班", "白班", "休息", "休息", "白班"] }
      ]
  }
];

export const initialCustomerArchives: CustomerArchive[] = [
  { id: "A001", name: "王建军", age: 78, gender: "男", status: "已交定金", careLevel: "意向二级", familyContact: "王小明 (儿子)", phone: "13912345678", date: "2023-05-12", idCard: "11010519450812XXXX", bedInfo: "意向床位: A栋-205室", agreementStatus: "normal" },
  { id: "A002", name: "李淑芬", age: 82, gender: "女", status: "初次咨询", careLevel: "待评估", familyContact: "张伟 (女婿)", phone: "13888889999", date: "2023-10-20", idCard: "11010819410315XXXX", bedInfo: "未确定", agreementStatus: "pending" },
  { id: "A003", name: "赵铁柱", age: 75, gender: "男", status: "意向强烈", careLevel: "意向三级", familyContact: "赵强 (儿子)", phone: "13766667777", date: "2022-11-05", idCard: "31010419481122XXXX", bedInfo: "意向单间(带独立卫浴)", agreementStatus: "expiring" },
  { id: "A004", name: "陈阿娇", age: 85, gender: "女", status: "预定床位", careLevel: "意向特级", familyContact: "林雪 (女儿)", phone: "13655554444", date: "2023-10-22", idCard: "32010219380918XXXX", bedInfo: "预定(C栋-1层)", agreementStatus: "none" },
  { id: "A005", name: "钱多多", age: 79, gender: "男", status: "无意向", careLevel: "-", familyContact: "钱少 (儿子)", phone: "13544443333", date: "2021-08-15", idCard: "44010619440510XXXX", bedInfo: "-", agreementStatus: "expired" },
];

export const initialAgreements: Agreement[] = [
  { id: "AGR-2023-001", archiveId: "A001", title: "机构养老服务合同", startDate: "2023-05-12", endDate: "2024-05-11", guarantor: "王小明", status: "active" },
  { id: "AGR-2023-002", archiveId: "A001", title: "补充医疗照护协议", startDate: "2023-06-01", endDate: "2024-05-11", guarantor: "王小明", status: "active" },
];

export const initialInventoryAudits: InventoryAudit[] = [
  { id: "PD-20260401-01", title: "全库盘点", status: "已完成", date: "2026-04-01" },
  { id: "PD-20260301-01", title: "医疗库盘点", status: "已调账", date: "2026-03-01" },
];

export const useStore = create<StoreState>((set) => ({
  sysUsers: initialSysUsers,
  sysRoles: initialSysRoles,
  nursingStations: [
    {
      id: "NS-001",
      name: "A栋综合护理站",
      manager: "EMP-001",
      buildings: ["A栋"],
      floors: [],
      assignedStaff: ["EMP-001", "EMP-002", "EMP-003", "EMP-004"]
    },
    {
      id: "NS-002",
      name: "B栋1层护理站",
      manager: "EMP-002",
      buildings: ["B栋"],
      floors: ["1层"],
      assignedStaff: ["EMP-002", "EMP-005"]
    }
  ],
  schedules: initialSchedules,
  transactions: initialTransactions,
  customerArchives: initialCustomerArchives,
  agreements: initialAgreements,
  inventoryAudits: initialInventoryAudits,
  
  admissions: initialAdmissions,
  discharges: initialDischarges,
  bills: initialBills,
  insuranceClaims: initialInsuranceClaims,
  inventory: initialInventory,
  carePlans: initialCarePlans,

  elders: initialElders,
  staff: initialStaff,
  beds: initialBeds,
  alerts: initialAlerts,
  tasks: initialTasks,
  rounds: initialRounds,
  rehabPlans: initialRehabPlans,
  careRecords: initialCareRecords,
  iotDevices: initialIotDevices,
  careLevels: initialCareLevels,
  serviceItems: initialServiceItems,
  assessments: initialAssessments,
  buildings: [
    { id: 'BLD-A', name: 'A栋 (主楼)' },
    { id: 'BLD-B', name: 'B栋 (VIP区)' },
    { id: 'BLD-C', name: 'C栋 (医疗中心)' }
  ],
  floors: [
    { id: 'FL-A-1', name: '一层', type: '重度护理区', buildingId: 'BLD-A' },
    { id: 'FL-A-2', name: '二层', type: '中度护理区', buildingId: 'BLD-A' },
    { id: 'FL-A-3', name: '三层', type: '自理长者区', buildingId: 'BLD-A' }
  ],
  rooms: [
    { id: 'RM-A-101', roomNo: '101', roomTypeId: 'T2', floorId: 'FL-A-1', buildingId: 'BLD-A', status: '启用中', specialFacilities: ['自带独卫', '防滑地板'] },
    { id: 'RM-A-102', roomNo: '102', roomTypeId: 'T2', floorId: 'FL-A-1', buildingId: 'BLD-A', status: '启用中', specialFacilities: [] },
    { id: 'RM-A-103', roomNo: '103', roomTypeId: 'T1', floorId: 'FL-A-1', buildingId: 'BLD-A', status: '启用中', specialFacilities: ['中心供氧'] },
    { id: 'RM-A-105', roomNo: '105', roomTypeId: 'T3', floorId: 'FL-A-1', buildingId: 'BLD-A', status: '停用中', specialFacilities: [] },
  ],
  roomTypes: [
    { id: 'T1', name: '单人间 (VIP)', beds: 1, price: 6000, desc: '包含独立卫浴，朝南' },
    { id: 'T2', name: '双人间 (标准)', beds: 2, price: 4500, desc: '含卫浴，南北通透' },
    { id: 'T3', name: '三人间 (护理)', beds: 3, price: 3200, desc: '中心供氧，近护士站' },
  ],
  
  targetElderId: null,
  targetAction: null,
  targetElderTab: 'info',
  setTargetElderId: (id) => set({ targetElderId: id }),
  setTargetAction: (action) => set({ targetAction: action }),
  setTargetElderTab: (tab) => set({ targetElderTab: tab }),

  addRound: async (round) => {
    
    try {
      const res = await fetch('/api/rounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(round)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ rounds: [...state.rounds, round] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addRound', e);
    }
  },
  updateRound: async (id, updates) => {
    
    try {
      const res = await fetch(`/api/rounds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      rounds: state.rounds.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateRound', e);
    }
  },
  updateRoundStatus: async (id, status, notes) => {
    
    try {
      const res = await fetch(`/api/rounds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status, notes })
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      rounds: state.rounds.map(r => r.id === id ? { ...r, status, notes: notes || r.notes } : r)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateRoundStatus', e);
    }
  },

  addRehabPlan: async (plan) => {
    
    try {
      const res = await fetch('/api/rehab_plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(plan)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ rehabPlans: [...state.rehabPlans, plan] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addRehabPlan', e);
    }
  },
  updateRehabPlan: async (id, updates) => {
    
    try {
      const res = await fetch(`/api/rehab_plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      rehabPlans: state.rehabPlans.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateRehabPlan', e);
    }
  },
  
  addElder: async (elder) => {
    
    try {
      const res = await fetch('/api/elders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(elder)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ elders: [...state.elders, elder] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addElder', e);
    }
  },
  updateElder: async (id, updatedElder) => {
    
    try {
      const res = await fetch(`/api/elders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updatedElder)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      elders: state.elders.map(e => e.id === id ? { ...e, ...updatedElder } : e)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateElder', e);
    }
  },
  removeElder: (id) => {
    
    set((state) => ({ elders: state.elders.filter(e => e.id !== id) }));
  },
  
  addStaff: async (staff) => {
    
    try {
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(staff)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ staff: [...state.staff, staff] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addStaff', e);
    }
  },
  updateStaff: async (id, updatedStaff) => {
    
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updatedStaff)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      staff: state.staff.map(s => s.id === id ? { ...s, ...updatedStaff } : s)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateStaff', e);
    }
  },
  removeStaff: (id) => {
    
    set((state) => ({ staff: state.staff.filter(s => s.id !== id) }));
  },
  
  updateBed: async (id, bed) => {
    
    try {
      const res = await fetch(`/api/beds/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(bed)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      beds: state.beds.map(b => b.id === id ? { ...b, ...bed } : b)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateBed', e);
    }
  },
  
  addAlert: async (alert) => {
    
    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(alert)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ alerts: [alert, ...state.alerts] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addAlert', e);
    }
  },
  updateAlertStatus: async (id, status) => {
    
    try {
      const res = await fetch(`/api/alerts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      alerts: state.alerts.map(a => a.id === id ? { ...a, status } : a)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateAlertStatus', e);
    }
  },
  resolveAlert: (id, notes, processedBy) => set((state) => {
    const alert = state.alerts.find(a => a.id === id);
    let newRecords = state.careRecords;
    
    if (alert) {
      
      
      const bed = state.beds.find(b => b.id === alert.location);
      const elder = state.elders.find(e => e.name === alert.resident || (bed && e.id === bed.elderId));
      
      if (elder) {
        const record: CareRecord = {
          id: `REC-${Date.now()}`,
          time: new Date().toLocaleString('zh-CN'),
          type: 'alert_resolve',
          content: `处理告警: ${alert.title}`,
          result: notes,
          elderId: elder.id,
          elderName: elder.name,
          caregiver: processedBy
        };
        
        newRecords = [record, ...state.careRecords];

        // Sync the new record to API
        fetch('/api/care_records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(record)
        }).catch(e => { toast.error('操作失败'); console.error(e); });
      }
    }
    
    // Sync the alert resolved status to API
    fetch(`/api/alerts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status: 'resolved', notes }) // Only synced status and notes here
    }).catch(e => { toast.error('操作失败'); console.error(e); });

    return {
      alerts: state.alerts.map(a => a.id === id ? { ...a, status: 'resolved', notes } : a),
      careRecords: newRecords
    };
  }),
  
  addTask: async (task) => {
    
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(task)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ tasks: [task, ...state.tasks] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addTask', e);
    }
  },
  updateTaskStatus: async (id, status) => {
    
    set((state) => {
      const taskIndex = state.tasks.findIndex(t => t.id === id);
      if (taskIndex === -1) return state;
      
      const task = state.tasks[taskIndex];
      if (task.status === status) return state; // no change

      const newTasks = [...state.tasks];
      newTasks[taskIndex] = { ...task, status };

      if (status === 'completed') {
        const elderNameMatch = task.elder.match(/^([^\s\(]+)/);
        const elderName = elderNameMatch ? elderNameMatch[1] : task.elder;
        
        let details = '操作人打卡：已完成任务。情况正常，长者配合。';
        if (task.type === 'medical') {
          details = `服药打卡：${task.medications ? task.medications.join(', ') : '按医嘱服药'}。长者已服下。`;
        } else if (task.type === 'cleaning') {
          details = '保洁打卡：清洁消毒完毕，环境整洁。';
        }

        // Format date to YYYY-MM-DD HH:mm:ss
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timeStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        const newRecord: CareRecord = {
          id: `REC-${Date.now()}`,
          elderId: `ELD-${Math.floor(Math.random() * 900) + 100}`, 
          elderName: elderName,
          type: task.type === 'temporary' ? 'temporary_care' : 'planned_task',
          content: task.name,
          result: details,
          caregiver: task.staff !== '待指派' && task.staff !== '未指派' ? task.staff : '值班护工',
          time: timeStr
        };
        
        // Sync the new record to API
        fetch('/api/care_records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(newRecord)
        }).catch(e => { toast.error('操作失败'); console.error(e); });

        return { 
          tasks: newTasks,
          careRecords: [newRecord, ...state.careRecords]
        };
      }

      return { tasks: newTasks };
    });
    try {
      await fetch(`/api/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ status })
      });
    } catch(e) { console.error('Failed to sync updateTaskStatus', e); }
  },
  updateTaskStaff: async (id, staff) => {
    
    try {
      const res = await fetch(`/api/tasks/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ staff, status: 'pending' })
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, staff, status: 'pending' as const } : t)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateTaskStatus', e);
    }
  },
  autoAssignTasks: () => set((state) => {
    // Simple mock logic: assign pending tasks to random staff who is '在线'
    const onlineStaff = state.staff.filter(s => s.status === '在线');
    if (onlineStaff.length === 0) return state; // No one to assign to

    const updatedTasks = state.tasks.map(t => {
      if (t.staff === '未指派' || t.staff === '待指派' || t.staff === '自动排程未指派' || !t.staff) {
        const randomStaff = onlineStaff[Math.floor(Math.random() * onlineStaff.length)];
        const newTask = { ...t, staff: randomStaff.name, status: 'pending' as const };
        
        return newTask;
      }
      return t;
    });
    return { ...state, tasks: updatedTasks };
  }),

  addCareRecord: async (record) => {
    
    try {
      const res = await fetch('/api/care_records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(record)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ careRecords: [record, ...state.careRecords] }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync addCareRecord', e);
    }
  },

  bindIoTDevice: async (device) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch('/api/iot_devices', { method: 'POST', headers, body: JSON.stringify(device) });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ iotDevices: [device, ...state.iotDevices] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addCareLevel: async (cl) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/care_levels', { method: 'POST', headers, body: JSON.stringify(cl) });
      set((state) => ({ careLevels: [...state.careLevels, cl] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateCareLevel: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/care_levels/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ careLevels: state.careLevels.map(c => c.id === id ? { ...c, ...updated } : c) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeCareLevel: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/care_levels/${id}`, { method: 'DELETE', headers });
      set((state) => ({ careLevels: state.careLevels.filter(c => c.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addServiceItem: async (si) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/service_items', { method: 'POST', headers, body: JSON.stringify(si) });
      set((state) => ({ serviceItems: [...state.serviceItems, si] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateServiceItem: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/service_items/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ serviceItems: state.serviceItems.map(s => s.id === id ? { ...s, ...updated } : s) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeServiceItem: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/service_items/${id}`, { method: 'DELETE', headers });
      set((state) => ({ serviceItems: state.serviceItems.filter(s => s.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  
  saveNursingStation: async (station) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const existing = useStore.getState().nursingStations.find(s => s.id === station.id);
      if (existing) {
         await fetch(`/api/nursing_stations/${station.id}`, { method: 'PUT', headers, body: JSON.stringify(station) });
         set(state => ({ nursingStations: state.nursingStations.map(s => s.id === station.id ? station : s) }));
      } else {
         await fetch('/api/nursing_stations', { method: 'POST', headers, body: JSON.stringify(station) });
         set(state => ({ nursingStations: [...state.nursingStations, station] }));
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  
  removeNursingStation: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/nursing_stations/${id}`, { method: 'DELETE', headers });
      set((state) => ({ nursingStations: state.nursingStations.filter(s => s.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  
  addTransaction: async (tx) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/transactions', { method: 'POST', headers, body: JSON.stringify(tx) });
      set(state => ({ transactions: [tx, ...state.transactions] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  
  saveSchedule: async (schedule) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const existing = useStore.getState().schedules.find(s => s.id === schedule.id);
      if (existing) {
        await fetch(`/api/schedules/${schedule.id}`, { method: 'PUT', headers, body: JSON.stringify(schedule) });
        set(state => ({ schedules: state.schedules.map(s => s.id === schedule.id ? schedule : s) }));
      } else {
        await fetch('/api/schedules', { method: 'POST', headers, body: JSON.stringify(schedule) });
        set(state => ({ schedules: [...state.schedules, schedule] }));
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addAssessment: async (assessment) => {
    try {
       const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
       await fetch('/api/assessments', { method: 'POST', headers, body: JSON.stringify(assessment) });
       set(state => ({ assessments: [assessment, ...state.assessments] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateAssessment: async (id, updates) => {
    try {
       const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
       await fetch(`/api/assessments/${id}`, { method: 'PUT', headers, body: JSON.stringify(updates) });
       set(state => ({ assessments: state.assessments.map(a => a.id === id ? { ...a, ...updates } : a) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addBuilding: async (building) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/buildings', { method: 'POST', headers, body: JSON.stringify(building) });
      set((state) => ({ buildings: [...state.buildings, building] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateBuilding: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/buildings/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ buildings: state.buildings.map(b => b.id === id ? { ...b, ...updated } : b) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeBuilding: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/buildings/${id}`, { method: 'DELETE', headers });
      set((state) => ({ buildings: state.buildings.filter(b => b.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addFloor: async (floor) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/floors', { method: 'POST', headers, body: JSON.stringify(floor) });
      set((state) => ({ floors: [...state.floors, floor] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateFloor: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/floors/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ floors: state.floors.map(f => f.id === id ? { ...f, ...updated } : f) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeFloor: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/floors/${id}`, { method: 'DELETE', headers });
      set((state) => ({ floors: state.floors.filter(f => f.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addRoom: async (room) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/rooms', { method: 'POST', headers, body: JSON.stringify(room) });
      set((state) => ({ rooms: [...state.rooms, room] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateRoom: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/rooms/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ rooms: state.rooms.map(r => r.id === id ? { ...r, ...updated } : r) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeRoom: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/rooms/${id}`, { method: 'DELETE', headers });
      set((state) => ({ rooms: state.rooms.filter(r => r.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addRoomType: async (rt) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/room_types', { method: 'POST', headers, body: JSON.stringify(rt) });
      set((state) => ({ roomTypes: [...state.roomTypes, rt] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateRoomType: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/room_types/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ roomTypes: state.roomTypes.map(t => t.id === id ? { ...t, ...updated } : t) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeRoomType: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/room_types/${id}`, { method: 'DELETE', headers });
      set((state) => ({ roomTypes: state.roomTypes.filter(t => t.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addSysUser: async (user) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch('/api/sys_users', { method: 'POST', headers, body: JSON.stringify(user) });
      if (res.ok) {
        const created = await res.json();
        set((state) => ({ sysUsers: [...state.sysUsers, created] }));
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateSysUser: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/sys_users/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ sysUsers: state.sysUsers.map(u => u.id === id ? { ...u, ...updated } : u) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeSysUser: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/sys_users/${id}`, { method: 'DELETE', headers });
      set((state) => ({ sysUsers: state.sysUsers.filter(u => u.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addSysRole: async (role) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/sys_roles', { method: 'POST', headers, body: JSON.stringify(role) });
      set((state) => ({ sysRoles: [...state.sysRoles, role] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateSysRole: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/sys_roles/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ sysRoles: state.sysRoles.map(r => r.id === id ? { ...r, ...updated } : r) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeSysRole: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/sys_roles/${id}`, { method: 'DELETE', headers });
      set((state) => ({ sysRoles: state.sysRoles.filter(r => r.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addCustomerArchive: async (archive) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/customer_archives', { method: 'POST', headers, body: JSON.stringify(archive) });
      set((state) => ({ customerArchives: [...state.customerArchives, archive] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateCustomerArchive: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/customer_archives/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ customerArchives: state.customerArchives.map(a => a.id === id ? { ...a, ...updated } : a) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeCustomerArchive: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/customer_archives/${id}`, { method: 'DELETE', headers });
      set((state) => ({ customerArchives: state.customerArchives.filter(a => a.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addAgreement: async (agreement) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/agreements', { method: 'POST', headers, body: JSON.stringify(agreement) });
      set((state) => ({ agreements: [...state.agreements, agreement] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateAgreement: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/agreements/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ agreements: state.agreements.map(a => a.id === id ? { ...a, ...updated } : a) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeAgreement: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/agreements/${id}`, { method: 'DELETE', headers });
      set((state) => ({ agreements: state.agreements.filter(a => a.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  addInventoryAudit: async (audit) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch('/api/inventory_audits', { method: 'POST', headers, body: JSON.stringify(audit) });
      set((state) => ({ inventoryAudits: [...state.inventoryAudits, audit] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateInventoryAudit: async (id, updated) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/inventory_audits/${id}`, { method: 'PUT', headers, body: JSON.stringify(updated) });
      set((state) => ({ inventoryAudits: state.inventoryAudits.map(a => a.id === id ? { ...a, ...updated } : a) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  removeInventoryAudit: async (id) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/inventory_audits/${id}`, { method: 'DELETE', headers });
      set((state) => ({ inventoryAudits: state.inventoryAudits.filter(a => a.id !== id) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  updateAdmission: async (id, record) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/admissions/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(record)
      });
      set(state => ({ admissions: state.admissions.map(a => a.id === id ? { ...a, ...record } : a) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  addAdmission: async (record) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/admissions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
      if (res.ok) {
        const created = await res.json();
        set(state => ({ admissions: [created, ...state.admissions] }));
      } else {
        throw new Error('API Sync Failed');
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateDischarge: async (id, record) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/discharges/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(record)
      });
      set(state => ({ discharges: state.discharges.map(a => a.id === id ? { ...a, ...record } : a) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  addDischarge: async (record) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/discharges`, {
        method: 'POST',
        headers,
        body: JSON.stringify(record)
      });
      if (res.ok) {
        const created = await res.json();
        set(state => ({ discharges: [created, ...state.discharges] }));
      } else {
        throw new Error('API Sync Failed');
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateBillStatus: async (id, status) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/bills/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });
      set(state => ({ bills: state.bills.map(b => b.id === id ? { ...b, status } : b) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  addBill: async (bill) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/bills`, {
        method: 'POST',
        headers,
        body: JSON.stringify(bill)
      });
      if (res.ok) {
        const created = await res.json();
        set(state => ({ bills: [created, ...state.bills] }));
      } else {
        throw new Error('API Sync Failed');
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateBill: async (id, updates) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/bills/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updates)
      });
      set(state => ({ bills: state.bills.map(b => b.id === id ? { ...b, ...updates } : b) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateInsuranceClaimStatus: async (id, status) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      await fetch(`/api/insurance_claims/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status })
      });
      set(state => ({ insuranceClaims: state.insuranceClaims.map(b => b.id === id ? { ...b, status } : b) }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  addInsuranceClaim: async (claim) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/insurance_claims`, {
        method: 'POST',
        headers,
        body: JSON.stringify(claim)
      });
      if (res.ok) {
        const created = await res.json();
        set(state => ({ insuranceClaims: [created, ...state.insuranceClaims] }));
      } else {
        throw new Error('API Sync Failed');
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },
  updateInventory: async (id, updates) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
        inventory: state.inventory.map(m => m.id === id ? { ...m, ...updates, lastUpdate: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } : m)
      }));
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateInventory', e);
    }
  },

  addCarePlan: async (plan) => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' };
      const res = await fetch(`/api/care_plans`, {
        method: 'POST',
        headers,
        body: JSON.stringify(plan)
      });
      if (res.ok) {
        set(state => ({ carePlans: [plan, ...state.carePlans] }));
      }
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },

  fetchInitialData: async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      
      const fetchApiList = async (path: string) => {
        const res = await fetch(path, { headers });
        if (!res.ok) {
          throw new Error(`加载数据失败: ${path} (Status: ${res.status})`);
        }
        let data = await res.json();
        if (Array.isArray(data)) {
          // Coerce numeric types from DB back to Javascript numbers for frontend safety
          data = data.map(item => {
             const r = { ...item };
             ['total', 'amount', 'price', 'refundAmount', 'totalAmount', 'totalRefund'].forEach(f => {
                if (typeof r[f] === 'string' && !isNaN(Number(r[f].replace(/,/g, '')))) {
                   r[f] = Number(r[f].replace(/,/g, ''));
                }
             });
             return r;
          });
          return data;
        }
        return [];
      };

      const promises = [
        fetchApiList('/api/elders'),
        fetchApiList('/api/staff'),
        fetchApiList('/api/beds'),
        fetchApiList('/api/tasks'),
        fetchApiList('/api/alerts'),
        fetchApiList('/api/care_records'),
        fetchApiList('/api/rehab_plans'),
        fetchApiList('/api/rounds'),
        fetchApiList('/api/inventory'),
        fetchApiList('/api/admissions'),
        fetchApiList('/api/discharges'),
        fetchApiList('/api/bills'),
        fetchApiList('/api/insurance_claims'),
        fetchApiList('/api/sys_users'),
        fetchApiList('/api/sys_roles'),
        fetchApiList('/api/iot_devices'),
        fetchApiList('/api/care_plans'),
        fetchApiList('/api/assessments'),
        fetchApiList('/api/schedules'),
        fetchApiList('/api/transactions'),
        fetchApiList('/api/buildings'),
        fetchApiList('/api/floors'),
        fetchApiList('/api/rooms'),
        fetchApiList('/api/room_types'),
        fetchApiList('/api/care_levels'),
        fetchApiList('/api/service_items'),
        fetchApiList('/api/nursing_stations'),
        fetchApiList('/api/customer_archives'),
        fetchApiList('/api/agreements'),
        fetchApiList('/api/inventory_audits')
      ];

      const [elders, staff, beds, tasks, alerts, careRecords, rehabPlans, rounds, inventory, admissions, discharges, bills, insuranceClaims, sysUsers, sysRoles, iotDevices, carePlans, assessments, schedules, transactions, buildings, floors, rooms, roomTypes, careLevels, serviceItems, nursingStations, customerArchives, agreements, inventoryAudits] = await Promise.all(promises);

      // Don't re-fill mock fallbacks empty for dictionary tables
      const nS = nursingStations.length > 0 ? nursingStations : [];
      const bD = buildings.length > 0 ? buildings : [];
      const fL = floors.length > 0 ? floors : [];
      const rM = rooms.length > 0 ? rooms : [];
      const rT = roomTypes.length > 0 ? roomTypes : [];
      
      set({ elders, staff, beds, tasks, alerts, careRecords, rehabPlans, rounds, inventory, admissions, discharges, bills, insuranceClaims, sysUsers, sysRoles, iotDevices, carePlans, assessments, schedules, transactions, buildings: bD, floors: fL, rooms: rM, roomTypes: rT, careLevels: careLevels, serviceItems: serviceItems, nursingStations: nS, customerArchives, agreements, inventoryAudits });
    } catch (e: any) {
      console.error('Failed to load initial data from backend', e);
      toast.error(e.message || '加载初始数据失败，请检查网络或登录状态');
    }
  }
}));
