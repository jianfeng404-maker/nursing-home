import React, { useState, useEffect } from "react";
import { Toaster, toast } from 'sonner';
import { useStore } from './store';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { io } from 'socket.io-client';

// Only connect when authenticated
const socket = io('/', { autoConnect: false });

import { LoginForm } from './components/LoginForm';

// imports...

import { TaskDispatch } from './pages/TaskDispatch';
import { MarketingReception } from './pages/MarketingReception';
import { CustomerArchives } from './pages/CustomerArchives';
import { Complaints } from './pages/Complaints';
import { AdmissionAssess } from './pages/AdmissionAssess';
import { AdmissionRecord } from './pages/AdmissionRecord';
import { DischargeRecord } from './pages/DischargeRecord';
import { ReceptionPipeline } from './pages/ReceptionPipeline';
import { CareDashboard } from './pages/CareDashboard';
import { BedBoard } from './pages/BedBoard';
import { BedManage } from './pages/BedManage';
import { LeaveManage } from './pages/LeaveManage';
import { UtilityRecord } from './pages/UtilityRecord';
import { ElderInfo } from './pages/ElderInfo';
import { FamilyBind } from './pages/FamilyBind';
import { HealthRecord } from './pages/HealthRecord';
import { CareAssess } from './pages/CareAssess';
import { CarePlan } from './pages/CarePlan';
import { CareTasks } from './pages/CareTasks';
import { CareLog } from './pages/CareLog';
import { CareRecord } from './pages/CareRecord';
import { SafetyMonitor } from './pages/SafetyMonitor';
import { IoTCatalog } from './pages/IoTCatalog';
import { NurseStation } from './pages/NurseStation';
import { IoTInstances } from './pages/IoTInstances';
import { CallMonitor } from './pages/CallMonitor';
import { CallHistory } from './pages/CallHistory';
import { AlertRulesConfig } from './pages/AlertRulesConfig';
import { FinanceDashboard } from './pages/FinanceDashboard';
import { FeeItems } from './pages/FeeItems';
import { DepositManage } from './pages/DepositManage';
import { PaymentSettle } from './pages/PaymentSettle';
import { InsuranceSettle } from './pages/InsuranceSettle';
import { Billing } from './pages/Billing';
import { InvoiceManage } from './pages/InvoiceManage';
import { AdmissionPayment } from './pages/AdmissionPayment';
import { DischargeRefund } from './pages/DischargeRefund';
import { MaterialManage } from './pages/MaterialManage';
import { InventoryManage } from './pages/InventoryManage';
import { Procurement } from './pages/Procurement';
import { Catering } from './pages/Catering';
import { Maintenance } from './pages/Maintenance';

import { SchedulePlan } from './pages/SchedulePlan';
import { Attendance } from './pages/Attendance';
import { StaffStruct } from './pages/StaffStruct';
import { StatAdmission } from './pages/StatAdmission';
import { StatCare } from './pages/StatCare';
import { StatInventory } from './pages/StatInventory';
import { StatCall } from './pages/StatCall';
import { Elder360Drawer } from './components/Elder360Drawer';
import { SysBasic } from './pages/SysBasic';
import { CareSOPManage } from './pages/CareSOPManage';
import { SysRoles } from './pages/SysRoles';
import { SysLogs } from './pages/SysLogs';
import { DevDocs } from './pages/DevDocs';
import { DevApis } from './pages/DevApis';
import { DevDeploy } from './pages/DevDeploy';
import { DevSecurity } from './pages/DevSecurity';

import { IotDashboard } from './pages/IotDashboard';
import { CommandCenter } from './pages/CommandCenter';
import { SecurityCamera } from './pages/SecurityCamera';
import { SecurityAccess } from './pages/SecurityAccess';
import { SecurityGeofence } from './pages/SecurityGeofence';
import { ContractManage } from './pages/ContractManage';
import { MaterialConsume } from './pages/MaterialConsume';
import { MedicationManage } from './pages/MedicationManage';
import { RehabPlan } from './pages/RehabPlan';
import { DoctorRounds } from './pages/DoctorRounds';
import { ClinicalRecords } from './pages/ClinicalRecords';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['overview']));
  const { nursingStations } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch(console.error)
      .finally(() => setIsAuthLoading(false));
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
        useStore.getState().fetchInitialData().then(() => {
            setIsDataLoading(false);
        });
        
        const token = localStorage.getItem('token');
        if (token) {
          socket.auth = { token };
          socket.connect();
        }
        
        socket.on('new-task', (task) => {
          toast.info(`新任务: ${task.name}`, { description: `执行人: ${task.staff}` });
        });
        
        socket.on('new-alert', (alert) => {
          toast.error(`紧急告警: ${alert.title}`, { description: `位置: ${alert.location}`});
        });

        return () => {
          socket.disconnect();
          socket.off('new-task');
          socket.off('new-alert');
        };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setVisitedTabs(prev => {
      if (prev.has(activeTab)) return prev;
      const newVisited = new Set(prev);
      newVisited.add(activeTab);
      return newVisited;
    });
  }, [activeTab]);

const pages: Record<string, React.ReactNode> = {
  'overview': <Dashboard />,
  'dispatch': <TaskDispatch />,
  'nurse_station': <NurseStation setActiveTab={setActiveTab} />,
  'marketing': <MarketingReception setActiveTab={setActiveTab} />,
  'customer_archives': <CustomerArchives />,
  'complaints': <Complaints />,
  'admission_assess': <AdmissionAssess />,
  'admission_record': <AdmissionRecord />,
  'discharge_record': <DischargeRecord />,
  'reception_pipeline': <ReceptionPipeline setActiveTab={setActiveTab} />,
  'care_dashboard': <CareDashboard setActiveTab={setActiveTab} />,
  'bed_board': <BedBoard setActiveTab={setActiveTab} />,
  'bed_manage': <BedManage />,
  'leave_manage': <LeaveManage />,
  'utility_record': <UtilityRecord />,
  'elder_info': <ElderInfo setActiveTab={setActiveTab} />,
  'care_assess': <CareAssess />,
  'care_plan': <CarePlan setActiveTab={setActiveTab} />,
  'care_tasks': <CareTasks />,
  'care_log': <CareLog key="care_log" />,
  'care_record': <CareRecord />,
  'security_camera': <SecurityCamera />,
  'security_access': <SecurityAccess />,
  'security_geofence': <SecurityGeofence />,
  'iot_dashboard': <IotDashboard setActiveTab={setActiveTab} />,
  'command_center': <CommandCenter setActiveTab={setActiveTab} />,
  'iot_catalog': <IoTCatalog />,
  'iot_instances': <IoTInstances />,
  'alert_rules_config': <AlertRulesConfig />,
  'call_monitor': <CallMonitor />,
  'call_history': <CallHistory />,
  'finance_dashboard': <FinanceDashboard />,
  'admission_payment': <AdmissionPayment />,
  'discharge_refund': <DischargeRefund />,
  'fee_items': <FeeItems />,
  'deposit_manage': <DepositManage />,
  'payment_settle': <PaymentSettle />,
  'insurance_settle': <InsuranceSettle />,
  'billing': <Billing />,
  'invoice_manage': <InvoiceManage />,
  'contract_manage': <ContractManage />,
  'material_consume': <MaterialConsume />,
  'medication_manage': <MedicationManage />,
  'rehab_plan': <RehabPlan />,
  'doctor_rounds': <DoctorRounds />,
  'clinical_records': <ClinicalRecords />,
  'material_manage': <MaterialManage />,
  'inventory_manage': <InventoryManage />,
  'procurement': <Procurement />,
  'catering': <Catering />,
  'maintenance': <Maintenance />,
  'staff_struct': <StaffStruct />,
  'schedule_plan': <SchedulePlan />,
  'attendance': <Attendance />,
  'stat_admission': <StatAdmission />,
  'stat_care': <StatCare />,
  'stat_inventory': <StatInventory />,
  'stat_call': <StatCall />,
  'sys_basic': <SysBasic />,
  'care_sop': <CareSOPManage />,
  'sys_roles': <SysRoles />,
  'sys_logs': <SysLogs />,
  'dev_docs': <DevDocs />,
  'dev_apis': <DevApis />,
  'dev_deploy': <DevDeploy />,
  'dev_security': <DevSecurity />
};

nursingStations.forEach(station => {
  pages[`nurse_station_${station.id}`] = <NurseStation setActiveTab={setActiveTab} stationId={station.id} />;
});

  if (isAuthLoading || (isAuthenticated && isDataLoading)) {
    return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span>系统数据同步中...</span>
      </div>
    </div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100">
        <Toaster position="top-right" richColors closeButton duration={3000} />
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <Toaster position="top-right" richColors closeButton duration={3000} />
      
      {activeTab !== 'command_center' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
        />
      )}
      
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {activeTab !== 'command_center' && (
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
        )}
        
        <main className={`flex-1 overflow-hidden relative content-container min-h-0 ${activeTab === 'command_center' ? 'bg-slate-950 p-0' : 'bg-slate-50/50'}`}>
          {Object.entries(pages).map(([key, component]) => {
            if (!visitedTabs.has(key)) return null;
            return (
              <div 
                key={key} 
                style={{ display: activeTab === key ? 'block' : 'none' }} 
                className={`h-full w-full hidden-scrollbar ${(activeTab === 'command_center' || activeTab === 'overview') ? 'p-0 overflow-hidden' : 'overflow-y-auto p-4 sm:p-6 md:p-8'}`}
              >
                {component}
              </div>
            );
          })}
          
          <Elder360Drawer />

          {!Object.keys(pages).includes(activeTab) && (
            <div className="flex flex-col items-center justify-center w-full h-full text-center animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">模块正在建设中</h2>
              <p className="text-slate-500 max-w-sm text-sm">
                当前视图 {activeTab} 的详细功能正在开发集成中。点击左侧的 "总览大盘" 查看核心业务数据。
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
