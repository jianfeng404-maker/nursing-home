# 智能颐养平台 - 开发者与架构文档 (Developer & Architecture Guide)

## 1. 技术栈概述 (Tech Stack)
本项目采用前后端分离但同构运行的全栈架构：
* **前端 (Frontend)**: React 18 + Vite + Tailwind CSS + Zustand (全局状态管理) + React Router + Lucide Icons
* **后端 (Backend)**: Node.js + Express (内置 Vite 中间件提供服务)
* **数据库 (Database)**: PostgreSQL (通过 Drizzle ORM 进行架构管理与查询)
* **安全性 (Security)**: JWT (JsonWebToken) 基于角色的鉴权 + bcryptjs 密码哈希加密

---

## 2. 数据库架构 (Database Schema)
项目使用 PostgreSQL 结合 Drizzle ORM。所有表结构定义在 `/src/db/schema.ts`。

**数据防泄漏与关联留存规则 (Data Retention & Foreign Key Policies)**：
避免物理删除核心长者资产（`elders`）引发的历史记录丢失，本平台严格实行外键级限制：
* 对病历记录 (`clinical_records`, `rounds`)、护理及评估 (`care_records`, `assessments`, `care_plans`, `rehab_plans`)、财务流水 (`transactions`) 等，采用 `onDelete: 'restrict'` 的强关联。即长者若拥有上述记录，系统禁止删除该档案记录。
* 对于非核心物理或绑定绑定关系如床位分派 (`beds`) 和物联设备 (`iot_devices`)，则采用 `onDelete: 'set null'`。长者档案退出时，床位与设备外键置空以重新入库。

### 核心业务表 (Core Domain Tables)
* **`elders` (长者档案)**: 记录入住老人的基本信息（姓名、年龄、护工等级、健康状况、所在房间等）。
* **`staff` (员工档案)**: 记录医护人员、后勤等员工信息（部门、职位、权限角色）。
* **`beds` (床位管理)**: 绑定床位与对应的 `elders` (外键关联)。
* **`tasks` (护理任务)**: 记录每日为长者分配的护理或用药任务及执行状态。
* **`alerts` (紧急告警)**: 物联网或手动触发的预警信息。
* **`care_records` (护理记录)**: 护工提交的照护详情（饮食、康复、日常记录等）。
* **`clinical_records` & `rounds` (医疗与查房)**: 医生查房日志及临床医疗记录，外键关联 `elders`。
* **`rehab_plans` & `care_plans` & `assessments` (康复与健康评估)**: 为长者定制的专项照护计划及阶段性健康评估。

### 财务与出入院 (Financial & Administration)
* **`admissions` & `discharges` (出入院流程)**: 追踪从申请入院、评估到退床结算的全生命周期。
* **`bills` & `transactions` (账单与流水)**: 记录长者账单及流水明细。
* **`insurance_claims` (长护险)**: 记录医保及长护险等理赔申请。

### 资源与资产 (Resources & Assets)
* **`inventory` & `inventory_audits` (物资库存及盘点)**: 医疗与生活物资出入库与期末盘点记录。
* **`buildings` & `floors` & `rooms` & `room_types` (楼宇空间)**: 养老机构的物理空间树状管理。
* **`nursing_stations` (护士站)**: 管辖指定楼层/楼宇及排班调度的站点信息。
* **`iot_devices` (智能设备)**: 与长者实时绑定的各类 IoT 设备。

### 系统鉴权与配置 (System Config & Auth)
* **`users` (登录账号)**: 系统注册及登录实体，使用 JWT 及 bcrypt 加密。
* **`sys_roles` (系统角色)**: RBAC 角色表（管理员、护工、医生等）。
* **`service_items` & `care_levels` (服务与等级字典)**: 预设的收费服务项目及照护等级标准。

---

## 3. 后端 API 接口 (API Endpoints)
所有接口默认受到 JWT Token 保护（`/api/auth/*` 及健康检查 `/api/health` 除外）。携带在 HTTP Header `Authorization: Bearer <token>`。

### 认证接口 (Authentication)
* `POST /api/auth/register` - 注册新账号
* `POST /api/auth/login` - 账号密码登录，返回 token
* `GET  /api/auth/me` - 获取当前登录用户信息

### 核心 RESTful CRUD 路由
针对系统内大多数名词（如 `elders`、`staff`、`tasks`、`inventory` 等），平台提供标准的 RESTful 增删改查：
* `GET    /api/{resource}` - 获取数据列表
* `POST   /api/{resource}` - 新增实体（若不传 `id` 则自动生成 `uuid`）
* `PUT    /api/{resource}/:id` - 更新指定实体（基于 UPSERT 逻辑，若指定 ID 不存在会尝试新建）
* `DELETE /api/{resource}/:id` - 删除指定实体

**受支持的通用资源路径 (`{resource}`)**:
* `elders`, `staff`, `tasks`, `alerts`, `beds`, `inventory`, `rounds`, `care_records`, `admissions`, `discharges`, `bills`, `insurance_claims`, `sys_users`*(废弃转移作users)*, `sys_roles`, `iot_devices`, `care_plans`, `assessments`, `schedules`, `transactions`, `buildings`, `floors`, `rooms`, `room_types`, `care_levels`, `service_items`, `nursing_stations`, `customer_archives`, `agreements`, `inventory_audits`

### 特殊业务接口
* `GET    /api/tasks/pending/:elderId` - 获取指定长者的待办任务
* `PUT    /api/tasks/:id/status` - 快捷更新任务状态

---

## 4. 前端状态管理 (Zustand Store)
前端使用 `Zustand` (`src/store/index.ts`) 做为全局内存引擎与后端同步。
* **`fetchInitialData`**: 登录后，统一在此处调用 `Promise.all` 获取全量字典/配置和核心表数据填充到内存中。
* **Action Methods**: 包含针对各大资源的 `addXxx`、`updateXxx`、`removeXxx`。这些动作执行双工更新：先调用对应 `/api/xxx` 更新服务端，然后静默更新本地内存数组避免闪烁，若后端失败则给出 Toast 提示并回滚。

## 5. 本地开发与数据库同步
如果新增或修改了数据库结构：
1. 修改 `src/db/schema.ts`
2. 运行 `npx drizzle-kit push --config=./src/db/drizzle.config.ts --force` 重置并迁移架构。
3. 检查并确保无数据级联外键（Foreign Key）报错，若有冲突，可能需要先清库。
