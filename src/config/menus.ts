import { 
  Home, UserPlus, Users, Heart, Phone, ShieldAlert, Cpu, 
  CreditCard, Package, BarChart, Settings, Code, LucideIcon, Stethoscope,
  Megaphone, UserCheck
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
}

export interface MenuGroup {
  title: string;
  icon: LucideIcon;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    title: "工作台",
    icon: Home,
    items: [
      { id: "overview", label: "数据中台" },
      { id: "dispatch", label: "全院协同工单大厅" },
      { id: "nurse_station", label: "各主要护理站" },
    ]
  },
  {
    title: "长者综合库",
    icon: Users,
    items: [
      { id: "bed_board", label: "全院视图与床位分配" },
      { id: "elder_info", label: "长者综合档案" },
      { id: "leave_manage", label: "外出与请假审批" }
    ]
  },
  {
    title: "照护与医疗运营",
    icon: Heart,
    items: [
      { id: "care_dashboard", label: "照护服务全局大盘" },
      { id: "care_assess", label: "健康与自理评估" },
      { id: "care_plan", label: "个人照护计划与目标" },
      { id: "care_tasks", label: "每日照护任务管理" },
      { id: "care_log", label: "移动端护工执行台" },
      { id: "care_record", label: "执行台账与总结分析" },
    ]
  },
  {
    title: "康复理疗与专业医务",
    icon: Stethoscope,
    items: [
      { id: "rehab_plan", label: "康复计划与理疗项目" },
      { id: "doctor_rounds", label: "医师巡查与看诊记录" },
      { id: "clinical_records", label: "专业医疗护理方案" },
      { id: "medication_manage", label: "医嘱与配发药协同" },
    ]
  },
  {
    title: "营销与客户中心",
    icon: Megaphone,
    items: [
      { id: "marketing", label: "全渠道线索与来访接待" },
      { id: "customer_archives", label: "潜在客户意向档案" },
      { id: "complaints", label: "家属服务与客诉跟进" },
    ]
  },
  {
    title: "出入退住业务办理",
    icon: UserCheck,
    items: [
      { id: "admission_assess", label: "长者入住前全级评估" },
      { id: "admission_record", label: "试住及正式入住办理" },
      { id: "discharge_record", label: "物资清算及最终退住" },
    ]
  },
  {
    title: "前台与呼叫中心",
    icon: Phone,
    items: [
      { id: "call_monitor", label: "前台接听与工单创建" },
      { id: "call_history", label: "呼叫流水与话务回溯" }
    ]
  },
  {
    title: "公共空间安防",
    icon: ShieldAlert,
    items: [
      { id: "security_camera", label: "视频监控与AI异常行为" },
      { id: "security_access", label: "门禁通行与访客管理" },
      { id: "security_geofence", label: "电子围栏与人员防走失" },
    ]
  },
  {
    title: "智能物联网管控",
    icon: Cpu,
    items: [
      { id: "command_center", label: "实时中控大屏可视化" },
      { id: "iot_dashboard", label: "物联设备运行大盘" },
      { id: "iot_instances", label: "设备台账与生命周期管理" },
      { id: "iot_catalog", label: "网关配置与标准物模型" },
      { id: "alert_rules_config", label: "智能设备预警规则配置" },
    ]
  },
  {
    title: "财务收支中心",
    icon: CreditCard,
    items: [
      { id: "finance_dashboard", label: "财务经营数据大盘" },
      { id: "admission_payment", label: "入住办理收银台" },
      { id: "billing", label: "在院长者月度账单" },
      { id: "discharge_refund", label: "退住清算与退费申请" },
      { id: "payment_settle", label: "零星收退费与前台结算" },
      { id: "insurance_settle", label: "长护险与医保结算" },
      { id: "deposit_manage", label: "预存账户与押金管理" },
      { id: "fee_items", label: "收费标准与项目字典" },
      { id: "invoice_manage", label: "发票与收银单据管理" },
    ]
  },
  {
    title: "后勤中心",
    icon: Package,
    items: [
      { id: "catering", label: "适老化餐饮与特殊膳食" },
      { id: "material_manage", label: "后勤仓储物资档案" },
      { id: "procurement", label: "供应商名录与采购计划" },
      { id: "inventory_manage", label: "库房流转与出入库记录" },
      { id: "material_consume", label: "长者商品代购与小额扣费" },
      { id: "utility_record", label: "水电气表按量抄收实录" },
      { id: "maintenance", label: "设施报修与巡检保养任务" },
    ]
  },
  {
    title: "数据统计中心",
    icon: BarChart,
    items: [
      { id: "stat_admission", label: "客户与入住统计" },
      { id: "stat_care", label: "照护运营统计" },
      { id: "stat_inventory", label: "财务与物资统计" },
      { id: "stat_call", label: "设施物联与告警统计" },
    ]
  },
  {
    title: "企业管理中枢",
    icon: Settings,
    items: [
      { id: "staff_struct", label: "组织架构与人员库" },
      { id: "attendance", label: "员工考勤打卡" },
      { id: "schedule_plan", label: "全院考勤与班次排班" },
      { id: "sys_basic", label: "字典及规则设置" },
      { id: "care_sop", label: "照护等级与SOP引擎" },
      { id: "bed_manage", label: "房态与楼宇字典" },
      { id: "sys_roles", label: "系统角色管理" },
      { id: "sys_logs", label: "系统操作日志" }
    ]
  },
  {
    title: "开发者空间",
    icon: Code,
    items: [
      { id: "dev_docs", label: "系统架构与组件目录" },
      { id: "dev_apis", label: "API 接口与数据字典" },
      { id: "dev_deploy", label: "环境部署与持续集成" },
      { id: "dev_security", label: "数据安全与权限策略" }
    ]
  }
];
