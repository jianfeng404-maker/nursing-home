const fs = require('fs');
const content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

const newMenu = `  const menuGroups = [
    {
      title: "工作台",
      icon: Home,
      items: [
        { id: "overview", label: "数据总览" },
        { id: "dispatch", label: "任务调度工作台" },
        { id: "nurse_station", label: "护理站大屏看板" },
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
      title: "照护运营大厅",
      icon: Heart,
      items: [
        { id: "care_tasks", label: "全院服务大纲排程" },
        { id: "care_log", label: "全院照护服务台账" },
      ]
    },
    {
      title: "接待与退住",
      icon: UserPlus,
      items: [
        { id: "marketing", label: "市场接待与跟进" },
        { id: "admission_assess", label: "入住意向评估" },
        { id: "admission_record", label: "试住与入住申请" },
        { id: "discharge_record", label: "退住申请与结算" },
      ]
    },
    {
      title: "智能告警平台",
      icon: ShieldAlert,
      items: [
        { id: "safety", label: "告警总控调度" },
        { id: "call_monitor", label: "呼叫弹窗监控" },
        { id: "iot_instances", label: "物联网设备台账" },
        { id: "iot_catalog", label: "标准物模型库" },
      ]
    },
    {
      title: "财务与后勤支援",
      icon: CreditCard,
      items: [
        { id: "payment_settle", label: "结算缴费大厅" },
        { id: "invoice_manage", label: "发票账单开具" },
        { id: "procurement", label: "采购与物资管理" },
        { id: "catering", label: "点餐及后厨配餐" },
        { id: "maintenance", label: "设施报修维保" },
      ]
    },
    {
      title: "企业管理中枢",
      icon: Settings,
      items: [
        { id: "staff_struct", label: "组织架构与人员库" },
        { id: "schedule_plan", label: "班次设置及排班表" },
        { id: "sys_basic", label: "字典及规则设置" }
      ]
    }
  ];`;

const replaced = content.replace(/const menuGroups = \[\s*\{\s*title: "工作台"[\s\S]*?\];\s*return \(/, newMenu + '\n\n  return (');
fs.writeFileSync('src/components/layout/Sidebar.tsx', replaced);
