import { 
  Home, UserPlus, Users, Heart, Phone, ShieldAlert, Cpu, 
  CreditCard, Package, BarChart, Settings, Code, LucideIcon
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
      { id: "overview", label: "数据总览" },
      { id: "dispatch", label: "任务调度工作台" },
      { id: "nurse_station", label: "护理站与体征监控台" },
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
      { id: "care_dashboard", label: "照护指挥调度中心" },
      { id: "care_assess", label: "健康与自理评估" },
      { id: "care_plan", label: "个人照护计划与目标" },
      { id: "care_tasks", label: "全局计划与派单排班" },
      { id: "care_log", label: "移动端护工执行台" },
      { id: "care_record", label: "执行台账与总结分析" },
      { id: "medication_manage", label: "医嘱与配发药协同" },
    ]
  },
  {
    title: "接待与退住流程",
    icon: UserPlus,
    items: [
      { id: "reception_pipeline", label: "接退住全生命周期看板" },
      { id: "marketing", label: "沟通回访与接待" },
      { id: "customer_archives", label: "客户意向档案" },
      { id: "admission_assess", label: "入住意向评估" },
      { id: "admission_record", label: "试住与正式入住" },
      { id: "discharge_record", label: "清点结算与退住" },
      { id: "complaints", label: "投诉与建议跟进" },
    ]
  },
  {
    title: "应急响应与呼叫中心",
    icon: Phone,
    items: [
      { id: "call_monitor", label: "实时呼叫台与坐席调度" },
      { id: "call_history", label: "呼叫处理记录与回溯" }
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
      { id: "iot_dashboard", label: "物联设备运行大盘" },
      { id: "iot_instances", label: "设备台账与生命周期管理" },
      { id: "iot_catalog", label: "网关配置与标准物模型" },
      { id: "alert_rules_config", label: "智能设备预警规则配置" },
    ]
  },
  {
    title: "财务中心",
    icon: CreditCard,
    items: [
      { id: "finance_dashboard", label: "财务数据大盘中台" },
      { id: "fee_items", label: "收费标准与项目库" },
      { id: "contract_manage", label: "周期合同与计费引擎" },
      { id: "billing", label: "长者大账单生成与核对" },
      { id: "payment_settle", label: "前台缴费与结算大厅" },
      { id: "deposit_manage", label: "长者押金与备用金管理" },
      { id: "invoice_manage", label: "电子发票与纸质收据" },
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
      { id: "schedule_plan", label: "班次设置及排班表" },
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
