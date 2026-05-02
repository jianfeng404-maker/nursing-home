import { useState, useEffect } from "react";
import { 
  Home, UserPlus, FileText, Users, Bed, 
  Heart, ShieldAlert, Phone, Cpu, 
  Coffee, Package, CreditCard, Calendar, BarChart, Settings, Code,
  ChevronDown, ChevronRight, X
} from "lucide-react";
import { cn } from "../../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "工作台": true,
    "个人照护管理": true,
    "智能安防与物联": true,
  });

  const toggleGroup = (title: string) => {
    setExpandedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // Close sidebar on mobile when tab changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsOpen]);

    const menuGroups = [
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

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 h-screen flex flex-col text-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shrink-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
      )}>
        <div className="h-16 lg:h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              S
            </div>
            智能颐养
          </h1>
          <button 
            className="lg:hidden p-1 text-slate-400 hover:bg-slate-100 rounded-md"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto hidden-scrollbar">
          {menuGroups.map((group, idx) => {
            const isExpanded = expandedGroups[group.title];
            const hasActiveItem = group.items.some(item => item.id === activeTab);
            
            return (
              <div key={idx} className="px-3 mb-1">
                <button
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors group",
                    hasActiveItem && !isExpanded ? "text-blue-700 bg-blue-50/50" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <group.icon className={cn(
                      "h-4 w-4", 
                      hasActiveItem ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                    )} />
                    <span className={cn("font-medium", hasActiveItem && "text-blue-700")}>{group.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="mt-1 mb-2 pl-[34px] space-y-1">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) setIsOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center px-3 py-2 text-xs rounded-lg transition-colors",
                          activeTab === item.id 
                            ? "bg-blue-50 text-blue-700 font-semibold shadow-sm shadow-blue-100" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 border border-blue-200 font-bold text-xs shrink-0">
              Admin
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">系统管理员</p>
              <p className="text-[10px] text-slate-500 truncate">超级管理员</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
