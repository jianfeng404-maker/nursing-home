import { useState, useEffect } from "react";
import { User, Heart, ClipboardList, ShieldAlert, Phone, Users, X, Activity, FileText, CalendarCheck, Watch } from "lucide-react";
import { ElderInfo } from "../pages/ElderInfo";
import { FamilyBind } from "../pages/FamilyBind";
import { HealthRecord } from "../pages/HealthRecord";
import { CareAssess } from "../pages/CareAssess";
import { CarePlan } from "../pages/CarePlan";
import { CareRecord } from "../pages/CareRecord";
import { ElderDevices } from "../pages/ElderDevices";
import { useStore } from "../store";

export function Elder360Drawer() {
  const { 
    targetElderId: elderId, 
    targetAction, 
    targetElderTab: initialTab, 
    setTargetElderId, 
    setTargetAction, 
    setTargetElderTab,
    elders
  } = useStore();
  
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [elderId, initialTab, targetAction]);

  const onClose = () => {
    setTargetElderId(null);
    setTargetAction(null);
    setTargetElderTab('info');
  };

  if (!elderId) return null;
  const storeElder = elders.find(e => e.id === elderId);
  const getAvatar = () => {
    if (storeElder?.avatar) return <img src={storeElder.avatar} className="w-full h-full object-cover" />;
    if (elderId && elderId.includes('001')) return <img src="https://i.pravatar.cc/150?u=ELD-001" className="w-full h-full object-cover" />;
    if (elderId && elderId.includes('002')) return <img src="https://i.pravatar.cc/150?u=ELD-002" className="w-full h-full object-cover" />;
    return storeElder?.name?.[0] || '长';
  };
  const getName = () => {
    if (storeElder) return `${storeElder.name} (${storeElder.room || '未分配床位'})`;
    if (elderId && elderId.includes('001')) return '张明宇 (A栋-101床)';
    if (elderId && elderId.includes('002')) return '李秀红 (A栋-105床)';
    return '长者档案';
  };

  const tabs = [
    { id: 'info', label: '基本资料', icon: User },
    { id: 'family', label: '家属绑定', icon: Users },
    { id: 'health', label: '健康档案', icon: Heart },
    { id: 'assess', label: '评估记录', icon: ClipboardList },
    { id: 'plan', label: '照护计划', icon: FileText },
    { id: 'record', label: '服务记录', icon: CalendarCheck },
    { id: 'devices', label: '智能设备', icon: Watch },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-4xl bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden shrink-0">
              {getAvatar()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {getName()}
              </h2>
              <p className="text-sm text-slate-500">档案编号: {elderId}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <div className="bg-white px-6 border-b border-slate-200">
          <div className="flex gap-6">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 flex items-center gap-2 font-medium text-sm transition-colors relative ${
                    activeTab === tab.id 
                      ? 'text-blue-600' 
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
           {activeTab === 'info' && <div className="bg-white p-4 rounded-xl shadow-sm"><ElderInfo targetElderId={elderId} setActiveTab={(t) => {
               if (t === 'health_record') setActiveTab('health');
               else if (t === 'family_bind') setActiveTab('family');
               else setActiveTab(t);
           }} setTargetElderId={() => {}} targetAction={targetAction || null} embedded /></div>}
           {activeTab === 'family' && <div className="bg-white p-4 rounded-xl shadow-sm"><FamilyBind targetElderId={elderId} setTargetElderId={() => {}} embedded /></div>}
           {activeTab === 'health' && <div className="bg-white p-4 rounded-xl shadow-sm"><HealthRecord targetElderId={elderId} setTargetElderId={() => {}} embedded /></div>}
           {activeTab === 'assess' && <div className="bg-white p-4 rounded-xl shadow-sm"><CareAssess embedded elderId={elderId} /></div>}
           {activeTab === 'plan' && <div className="bg-white p-4 rounded-xl shadow-sm"><CarePlan setActiveTab={() => {}} embedded elderId={elderId} /></div>}
           {activeTab === 'record' && <div className="bg-white p-0 rounded-xl shadow-sm overflow-hidden"><CareRecord embedded initialElderId={elderId} /></div>}
           {activeTab === 'devices' && <div className="bg-white p-4 rounded-xl shadow-sm overflow-hidden"><ElderDevices embedded targetElderId={elderId} /></div>}
        </div>
      </div>
    </div>
  );
}
