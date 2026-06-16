import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { useStore } from "../store";
import {
  LogIn,
  KeySquare,
  Users,
  ShieldCheck,
  Clock,
  UserPlus,
  Fingerprint,
  Search,
  Filter,
  Check,
  X,
  DoorClosed,
  Settings2,
  AlertCircle,
  Building2,
  MapPin,
  Wifi,
  WifiOff,
  Loader2,
  Server,
  HardDrive,
  ChevronRight,
  QrCode,
  Hash,
  Camera,
  Car,
  IdCard,
  Upload,
  AlertTriangle,
  Siren,
  BatteryWarning
} from "lucide-react";
import { toast } from "sonner";

export function SecurityAccess() {
  const [activeTab, setActiveTab] = useState("logs");
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [isVisitorDeploying, setIsVisitorDeploying] = useState(false);
  const [visitorDeployStep, setVisitorDeployStep] = useState(0);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showCredentialModal, setShowCredentialModal] = useState(false);
  const [showDoorAuthModal, setShowDoorAuthModal] = useState(false);
  const [selectedAuthUser, setSelectedAuthUser] = useState<any>(null);
  const [reviewingVisitor, setReviewingVisitor] = useState<any>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [isAuthDeploying, setIsAuthDeploying] = useState(false);

  const staff = useStore(state => state.staff);
  const updateStaff = useStore(state => state.updateStaff);
  const elders = useStore(state => state.elders);
  const updateElder = useStore(state => state.updateElder);

  const authUsers = [
    ...staff.map(s => ({
       id: s.id,
       name: s.name,
       role: s.role,
       dept: s.dept,
       face: s.face,
       card: s.card,
       fingerprint: s.fingerprint,
       doors: s.doors || [],
       type: 'staff' as const
    })),
    ...elders.map(e => ({
       id: e.id,
       name: e.name,
       role: "长者",
       dept: e.room,
       face: e.face,
       card: e.card,
       fingerprint: e.fingerprint,
       doors: e.doors || [],
       type: 'elder' as const
    }))
  ];

  const [pendingVisitors, setPendingVisitors] = useState([
    { id: 1, name: "王建国", relation: "儿子", target: "张阿姨", time: "今日 14:00 - 16:00", phone: "138-0000-0001", status: "pending", roomInfo: "A栋 1层 101室", plate: "京A88888", devices: [{ id: "G-001", name: "园区主入口道闸", status: "online", type: "道闸" }, { id: "A-001", name: "园区正大门人脸闸机", status: "online", type: "闸机" }, { id: "A-100", name: "A栋一楼大厅门禁", status: "online", type: "楼宇门禁" }, { id: "A-101", name: "101室智能门锁", status: "online", type: "房门锁" }] },
    { id: 2, name: "李梅梅", relation: "女儿", target: "李建国", time: "明日 09:30 - 11:30", phone: "139-0000-0002", status: "pending", roomInfo: "B栋 2层 205室", devices: [{ id: "A-002", name: "园区东侧通道人脸闸机", status: "online", type: "闸机" }, { id: "B-200", name: "B栋大门门禁", status: "online", type: "楼宇门禁" }, { id: "B-205", name: "205室电子锁", status: "offline", type: "房门锁" } ] }
  ]);

  const handleApprove = async (id: number) => {
    if (!reviewingVisitor) {
      setPendingVisitors((prev) => prev.filter((v) => v.id !== id));
      toast.success("审核通过，凭证及数据已下发至相关门禁节点");
      return;
    }

    setIsDeploying(true);
    setDeployStep(0);

    for (let i = 0; i < reviewingVisitor.devices?.length; i++) {
        setDeployStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    setDeployStep(reviewingVisitor.devices?.length || 0);
    await new Promise(resolve => setTimeout(resolve, 500));

    setPendingVisitors((prev) => prev.filter((v) => v.id !== id));
    setReviewingVisitor(null);
    setIsDeploying(false);
    setDeployStep(0);
    toast.success("审核已通过，预约人员通行凭证已成功同步至目标门禁链路！");
  };

  const handleReject = (id: number) => {
    setPendingVisitors((prev) => prev.filter((v) => v.id !== id));
    setReviewingVisitor(null);
    toast.error("已驳回访客申请");
  };

  const handleCredentialDeploy = async () => {
    setIsAuthDeploying(true);
    // simulate sync
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 600));
    }
    setIsAuthDeploying(false);
    setShowCredentialModal(false);
    toast.success(`已下发 ${selectedAuthUser?.name} 的通行凭证数据至所有授权节点`);
  };

  const handleStaffAuthDeploy = async () => {
    setIsAuthDeploying(true);
    // simulate device sync
    for (let i = 0; i < 3; i++) {
        await new Promise(r => setTimeout(r, 600));
    }
    setIsAuthDeploying(false);
    setShowDoorAuthModal(false);
    
    // Save to store
    if (selectedAuthUser) {
        if (selectedAuthUser.type === 'staff') {
            updateStaff(selectedAuthUser.id, { doors: selectedAuthUser.doors });
        } else if (selectedAuthUser.type === 'elder') {
            updateElder(selectedAuthUser.id, { doors: selectedAuthUser.doors });
        }
    }

    toast.success(`已成功更新 ${selectedAuthUser?.name} 的网络权限节点`);
  };

  const handleCreateVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVisitorDeploying(true);
    setVisitorDeployStep(0);
    
    // Simulate deployment steps for devices
    for (let i = 0; i <= 3; i++) {
        setVisitorDeployStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setIsVisitorDeploying(false);
    setShowVisitorForm(false);
    toast.success("临时访客登记成功，门禁凭证已全部下发并生成访客二维码");
  };

  const accessLogs = [
    {
      id: 1,
      time: "10:45:22",
      name: "李阿姨",
      type: "长者",
      method: "人脸识别",
      location: "中心大门进",
      status: "允许",
    },
    {
      id: 2,
      time: "10:42:15",
      name: "王护工",
      type: "员工",
      method: "IC卡刷卡",
      location: "康复中心门",
      status: "允许",
    },
    {
      id: 3,
      time: "10:38:05",
      name: "张先生",
      type: "家属访客",
      method: "访客二维码",
      location: "中心大门进",
      status: "允许",
    },
    {
      id: 4,
      time: "10:30:11",
      name: "未知人员",
      type: "外部人",
      method: "人脸防伪拦截",
      location: "中心大门进",
      status: "拦截",
    },
    {
      id: 5,
      time: "10:15:33",
      name: "赵爷爷",
      type: "长者",
      method: "人脸识别",
      location: "活动室",
      status: "允许",
    },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            门禁通行与访客管理
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            统一管控大门、楼宇及特殊通道门禁权限，家属访客预约及智能放行审核。
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowVisitorForm(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> 临时访客登记
          </button>
          <button
            onClick={() => setShowPermissionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95"
          >
            <KeySquare className="w-4 h-4" /> 门禁权限管理
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-800/70 mb-1">
                今日通行总人次
              </p>
              <h3 className="text-3xl font-black text-indigo-900">
                1,204{" "}
                <span className="text-base font-bold text-indigo-800/60">
                  次
                </span>
              </h3>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <LogIn className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white border border-slate-100">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">
                今日来访家属
              </p>
              <h3 className="text-3xl font-black text-slate-800">
                42{" "}
                <span className="text-base font-bold text-slate-500">人</span>
              </h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white border border-slate-100">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">
                门禁拦截告警
              </p>
              <h3 className="text-3xl font-black text-rose-600">
                3 <span className="text-base font-bold text-slate-500">次</span>
              </h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden rounded-2xl">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0 px-6 py-5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "logs" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
            >
              通行记录监控
            </button>
            <button
              onClick={() => setActiveTab("visitors")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "visitors" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
            >
              访客预约审核
            </button>
            <button
              onClick={() => setActiveTab("auth")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === "auth" ? "bg-slate-800 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
            >
              人员入库明细与授权
            </button>
            <button
              onClick={() => setActiveTab("alarms")}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === "alarms" ? "bg-rose-500 text-white shadow-sm" : "text-rose-600 hover:bg-rose-50"}`}
            >
               <Siren className="w-4 h-4" />
              异常告警与设备
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-sm ml-1">3</span>
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索姓名/通行位置..."
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 hover:border-slate-300 transition-all bg-slate-50/50 focus:bg-white"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm bg-white">
              <Filter className="w-4 h-4" /> 筛选查询
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-y-auto flex-1 bg-slate-50/30 custom-scrollbar">
          {activeTab === "logs" && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    通行时间
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    人员姓名
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    人员类型
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    通行位置
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    验证方式
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500 text-right">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                {accessLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4 font-mono text-slate-500 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> {log.time}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {log.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                          log.type === "长者"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : log.type === "员工"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : log.type === "家属访客"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {log.location}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Fingerprint className="w-4 h-4" /> {log.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {log.status === "允许" ? (
                        <span className="text-emerald-600 font-bold">
                          通行允许
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold">
                          拦截报警
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "visitors" && (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    预约来访时间
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    访客姓名
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    联系方式
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    探视长者及关系
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500">
                    车牌号码
                  </th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-500 text-right">
                    审核操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                {pendingVisitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600">
                      <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {visitor.time}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{visitor.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{visitor.phone}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700">{visitor.target}</span>
                      <span className="ml-2 px-2 py-0.5 rounded text-xs border border-indigo-200 bg-indigo-50 text-indigo-700">{visitor.relation}</span>
                    </td>
                    <td className="px-6 py-4">
                      {visitor.plate ? (
                         <div className="flex items-center gap-1.5"><Car className="w-4 h-4 text-slate-400" /><span className="font-mono text-sm font-bold text-slate-700">{visitor.plate}</span></div>
                      ) : (
                         <span className="text-xs text-slate-400">无车辆</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setReviewingVisitor(visitor)} className="px-3 py-1.5 text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 font-bold rounded-lg transition" title="查阅审核">查看预约并审核</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingVisitors.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-slate-400">
                      <Users className="w-12 h-12 mb-3 mx-auto text-slate-200" />
                      <p className="font-bold text-slate-500">目前没有任何待审核的访客预约</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {activeTab === "auth" && (
             <table className="w-full text-left border-collapse">
                 <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                     <tr>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">人员信息</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">人脸凭证</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">IC实体卡</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">指纹流水号</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">通行区域授权</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500 text-right">授权操作</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                    {authUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                               <div className="font-bold text-slate-800">{user.name} <span className="text-xs font-normal text-slate-500 ml-1">({user.role})</span></div>
                               <div className="text-xs text-slate-500 mt-0.5">{user.dept}</div>
                            </td>
                            <td className="px-6 py-4">
                               {user.face ? <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-200">已录入人脸</span> : <span className="text-slate-400 text-xs font-medium">未补录</span>}
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">
                               {user.card ? <span className="text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200 font-bold">{user.card}</span> : <span className="text-slate-400 font-medium">无发卡</span>}
                            </td>
                            <td className="px-6 py-4">
                               {user.fingerprint ? <span className="text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs font-bold border border-blue-200">库编号 {user.id}0A</span> : <span className="text-slate-400 text-xs font-medium">未采集</span>}
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex flex-wrap gap-1.5">
                                  {user.doors.map((d, i) => <span key={i} className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">{d}</span>)}
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => {setSelectedAuthUser(user); setShowCredentialModal(true);}} className="p-2 text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-lg transition" title="录入凭证(发卡/人脸)"><Fingerprint className="w-5 h-5" /></button>
                                  <button onClick={() => {setSelectedAuthUser(user); setShowDoorAuthModal(true);}} className="p-2 text-emerald-600 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 rounded-lg transition" title="分配门禁区域"><KeySquare className="w-5 h-5" /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                 </tbody>
             </table>
          )}
          {activeTab === "alarms" && (
             <div className="flex flex-col h-full bg-slate-50 relative custom-scrollbar">
                <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
                   {/* Left Col: Alarms */}
                   <div className="xl:col-span-2 space-y-4">
                      <div className="flex items-center justify-between pointer-events-none mb-1">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2"><Siren className="w-5 h-5 text-rose-500" /> 未处理安全告警</h3>
                      </div>
                      
                      {/* Alarm 1: Tailgating/unauthorized */}
                      <div className="bg-white border-l-4 border-l-rose-500 rounded-xl p-5 shadow-sm">
                         <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                               <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0 border border-rose-100">
                                  <Users className="w-6 h-6" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-rose-700 text-lg">防尾随拦截告警</span>
                                     <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded font-black tracking-wide">高危</span>
                                  </div>
                                  <p className="text-slate-500 text-sm mt-1">检测到园区南门异常双人尾随通过，系统已自动锁死第二道防尾随闸门。</p>
                                  <div className="flex items-center gap-4 mt-3">
                                     <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><MapPin className="w-3.5 h-3.5 text-slate-400" /> 园区南门通道 A 闸机</span>
                                     <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><Clock className="w-3.5 h-3.5" /> 刚刚</span>
                                  </div>
                               </div>
                            </div>
                            <button className="px-4 py-2 bg-rose-500 text-white font-bold text-sm rounded-xl hover:bg-rose-600 transition shadow-sm">处理</button>
                         </div>
                      </div>

                      {/* Alarm 2: Wandering */}
                      <div className="bg-white border-l-4 border-l-orange-500 rounded-xl p-5 shadow-sm">
                         <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                               <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0 border border-orange-100">
                                  <Building2 className="w-6 h-6" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-slate-800 text-lg">失智长者疑似越界尝试</span>
                                     <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded font-black tracking-wide">中危</span>
                                  </div>
                                  <p className="text-slate-500 text-sm mt-1">检测到带有【防走失手环】的李爷爷靠近一楼大厅主干道，无家属陪同，门禁已拒开。</p>
                                  <div className="flex items-center gap-4 mt-3">
                                     <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><MapPin className="w-3.5 h-3.5 text-slate-400" /> A栋 一楼北侧大门</span>
                                     <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><Clock className="w-3.5 h-3.5" /> 10分钟前</span>
                                  </div>
                               </div>
                            </div>
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition">查看录像</button>
                         </div>
                      </div>

                      {/* Alarm 3: Device failure */}
                      <div className="bg-white border-l-4 border-l-amber-400 rounded-xl p-5 shadow-sm">
                         <div className="flex items-start justify-between">
                            <div className="flex gap-4">
                               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                                  <BatteryWarning className="w-6 h-6" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2">
                                     <span className="font-bold text-slate-800 text-lg">门锁低电量预警</span>
                                     <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-0.5 rounded font-black tracking-wide">低危</span>
                                  </div>
                                  <p className="text-slate-500 text-sm mt-1">302室智能门锁电量剩余7%，请尽快安排工程人员更换电池以防反锁失效。</p>
                                  <div className="flex items-center gap-4 mt-3">
                                     <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100"><MapPin className="w-3.5 h-3.5 text-slate-400" /> C栋 302室房门</span>
                                     <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><Clock className="w-3.5 h-3.5" /> 1小时前</span>
                                  </div>
                               </div>
                            </div>
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition">派单维护</button>
                         </div>
                      </div>
                   </div>

                   {/* Right Col: Device Status & Blacklist */}
                   <div className="space-y-6">
                      {/* Device Status */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Server className="w-4 h-4 text-slate-500" /> 边缘通信状态</h3>
                         <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                  <span className="text-sm font-bold text-slate-700">园区正大门人脸闸机群组</span>
                               </div>
                               <span className="text-xs font-mono text-emerald-600 font-bold">ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                  <span className="text-sm font-bold text-slate-700">车辆AI道闸识别服务器</span>
                               </div>
                               <span className="text-xs font-mono text-emerald-600 font-bold">ONLINE</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl border border-rose-100">
                               <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse"></div>
                                  <span className="text-sm font-bold text-rose-800">康复中心二楼东侧门禁</span>
                               </div>
                               <span className="text-xs font-mono text-rose-600 font-bold">OFFLINE</span>
                            </div>
                         </div>
                      </div>

                      {/* Blacklist Control */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                         <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-slate-500" /> 黑名单布控库</h3>
                            <button className="text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded text-xs font-bold transition">管理</button>
                         </div>
                         <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-600">当前已布控 4 人, 2 辆车</p>
                            <p className="text-xs text-slate-400 mt-1">黑名单人员/车辆一旦识别将触发高危告警</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </CardContent>
      </Card>

      {/* Visitor Registration Modal */}
      {showVisitorForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
             {isVisitorDeploying && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 border border-indigo-200 shadow-inner">
                       <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                    <h3 className="font-black text-slate-800 text-xl mb-2 tracking-tight">正在授权通信发码...</h3>
                    <p className="text-slate-500 text-sm font-medium">配置边缘节点进度: {visitorDeployStep} / 3</p>
                    
                    <div className="w-64 h-2.5 bg-slate-100 rounded-full mt-6 border border-slate-200 overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-300 shadow-sm" style={{ width: `${(visitorDeployStep / 3) * 100}%` }} />
                    </div>
                </div>
             )}
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                      <UserPlus className="w-5 h-5 text-indigo-600" />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-800 text-xl tracking-tight">访客通行登记签发</h3>
                      <p className="text-xs text-slate-500 font-medium">录入访客信息并自动签发园区门禁通行凭证</p>
                   </div>
                </div>
                <button type="button" onClick={() => setShowVisitorForm(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleCreateVisitor}>
               <div className="flex flex-col md:flex-row h-[500px]">
                 {/* Left Column: Media / Photo */}
                 <div className="w-72 bg-slate-50 p-6 border-r border-slate-100 flex flex-col items-center shrink-0">
                    <div className="w-full space-y-4">
                       <div>
                          <p className="text-sm font-bold text-slate-700 mb-2">人脸图像采集 (选填)</p>
                          <div className="w-full aspect-[3/4] bg-white rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 transition-colors cursor-pointer group">
                             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                                <Camera className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                             </div>
                             <div className="text-center">
                                <span className="text-sm font-bold text-indigo-600">点击拍照</span>
                                <p className="text-[10px] text-slate-400 mt-1">或上传近期免冠照片</p>
                             </div>
                          </div>
                       </div>
                       <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3">
                          <Upload className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-slate-500 leading-tight">上传人脸照片后，访客即可使用人脸识别闸机，体验无感通行。</p>
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Info */}
                 <div className="flex-1 p-6 overflow-y-auto bg-white">
                    <div className="space-y-6">
                       {/* Basic Info */}
                       <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                             <IdCard className="w-4 h-4 text-indigo-500" /> 身份信息
                          </h4>
                          <div className="grid grid-cols-2 gap-5">
                             <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">访客姓名 <span className="text-rose-500">*</span></label>
                                <input required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-slate-50/50 hover:bg-slate-50" placeholder="例如: 王建国" />
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">联系电话 <span className="text-rose-500">*</span></label>
                                <input required className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-slate-50/50 hover:bg-slate-50" placeholder="11位手机号" />
                             </div>
                             <div className="space-y-1.5 col-span-2">
                                <label className="text-xs font-bold text-slate-500">身份证号 (用于闸机刷证)</label>
                                <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all bg-slate-50/50 hover:bg-slate-50" placeholder="18位身份证号" />
                             </div>
                          </div>
                       </div>

                       {/* Visit Details */}
                       <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                             <Clock className="w-4 h-4 text-emerald-500" /> 探访详情
                          </h4>
                          <div className="grid grid-cols-2 gap-5">
                             <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">探访长者对象</label>
                                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50/50 hover:bg-slate-50">
                                   <option value="">请选择长者 (输入姓名搜索)</option>
                                   {elders.map(elder => (
                                      <option key={elder.id} value={elder.id}>{elder.name} ({elder.room})</option>
                                   ))}
                                </select>
                             </div>
                             <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500">与长者关系</label>
                                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50/50 hover:bg-slate-50">
                                   <option>家属 (子女/配偶)</option>
                                   <option>亲戚</option>
                                   <option>朋友</option>
                                   <option>其他</option>
                                </select>
                             </div>
                             <div className="space-y-1.5 col-span-2">
                                <label className="text-xs font-bold text-slate-500">预计来访时间段 <span className="text-rose-500">*</span></label>
                                <select className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50/50 hover:bg-slate-50">
                                   <option>今日 09:00 - 12:00 (有效时长: 3小时)</option>
                                   <option>今日 14:00 - 18:00 (有效时长: 4小时)</option>
                                   <option>明日 09:00 - 12:00 (有效时长: 3小时)</option>
                                </select>
                             </div>
                          </div>
                       </div>

                       {/* Vehicle (Optional) */}
                       <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                             <Car className="w-4 h-4 text-blue-500" /> 车辆通行 (选填)
                          </h4>
                          <div className="space-y-1.5">
                             <label className="text-xs font-bold text-slate-500">车牌号码</label>
                             <input className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all bg-slate-50/50 hover:bg-slate-50 placeholder-slate-300 uppercase" placeholder="例如: 京A88888 (入园道闸自动放行)" />
                          </div>
                       </div>
                       
                       {/* Auto Assigned Devices */}
                       <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                             <Fingerprint className="w-4 h-4 text-slate-500" /> 系统将自动下发通行权限至以下门禁
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                             <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                   <UserPlus className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700">园区正大门</p>
                                   <p className="text-[10px] text-slate-400">人脸闸机</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                   <Car className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700">园区车辆主入口</p>
                                   <p className="text-[10px] text-slate-400">AI识别道闸</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                   <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                   <p className="text-xs font-bold text-slate-700">长者所在楼宇</p>
                                   <p className="text-[10px] text-slate-400">一楼大厅门禁</p>
                                </div>
                             </div>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-3 flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" /> 当未填写车牌号码时，车辆道闸权限将自动取消</p>
                       </div>
                    </div>
                 </div>
               </div>
               <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div className="flex gap-2">
                     <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                        <QrCode className="w-3.5 h-3.5 text-indigo-500" /> 生成动态门禁码
                     </span>
                     <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                        <Hash className="w-3 h-3 text-indigo-500" /> 生成临时开门密码
                     </span>
                  </div>
                  <div className="flex gap-3">
                     <button type="button" onClick={() => setShowVisitorForm(false)} className="px-6 py-2.5 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm">取消</button>
                     <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        授权发码并下发门禁
                     </button>
                  </div>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Visitor Review Modal */}
      {reviewingVisitor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100">
                      <ShieldCheck className="w-5 h-5 text-amber-600" />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-800 text-xl tracking-tight">访客通行授权审核</h3>
                      <p className="text-xs text-slate-500 font-medium">联机验证并下发人脸及通行扫码凭证</p>
                   </div>
                </div>
                {!isDeploying && <button type="button" onClick={() => setReviewingVisitor(null)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>}
             </div>
             
             <div className="flex flex-col md:flex-row h-[500px]">
                 {/* Visitor Column */}
                 <div className="w-72 bg-white p-6 border-r border-slate-100 flex flex-col items-center shrink-0 overflow-y-auto custom-scrollbar">
                    <div className="w-32 h-40 shrink-0 bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative flex items-center justify-center mb-4">
                       <div className="w-full h-full bg-slate-200 absolute inset-0 mix-blend-multiply opacity-50"></div>
                       <UserPlus className="w-12 h-12 text-slate-300 relative z-10" />
                       <div className="absolute inset-0 border-4 border-emerald-500/0 hover:border-emerald-500/20 transition rounded-xl pointer-events-none"></div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold tracking-wider flex items-center gap-1.5 mb-8 border border-emerald-100">
                       <Check className="w-3.5 h-3.5" /> 人脸图像检测合规
                    </div>
                    <div className="w-full text-left space-y-5">
                       <div>
                          <p className="text-xs font-bold text-slate-400 mb-1">访客姓名</p>
                          <p className="font-black text-slate-800 text-xl">{reviewingVisitor.name}</p>
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-400 mb-1">联系电话</p>
                          <p className="font-mono font-bold text-slate-700 text-lg">{reviewingVisitor.phone}</p>
                       </div>
                       {reviewingVisitor.plate && (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                             <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1"><Car className="w-3.5 h-3.5" /> 登记车辆车牌号</p>
                             <p className="font-mono font-bold text-slate-700 text-sm mt-1 bg-white p-2 border border-slate-200 rounded">{reviewingVisitor.plate}</p>
                          </div>
                       )}
                       <div>
                          <p className="text-xs font-bold text-slate-400 mb-1">预约探访时间</p>
                          <p className="font-bold text-indigo-700 text-sm bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 mt-1">{reviewingVisitor.time}</p>
                       </div>
                       
                       {/* Generation types */}
                       <div className="pt-2 border-t border-slate-100">
                           <p className="text-xs font-bold text-slate-400 mb-3">授权并生成凭证类型</p>
                           <div className="space-y-2">
                               <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
                                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                  <span className="text-xs font-bold text-slate-700">人员面部特征</span>
                               </label>
                               <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
                                  <div className="flex items-center gap-2">
                                     <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                     <span className="text-xs font-bold text-slate-700">动态二维码</span>
                                  </div>
                                  <QrCode className="w-3.5 h-3.5 text-slate-400" />
                               </label>
                               <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition">
                                  <div className="flex items-center gap-2">
                                     <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                                     <span className="text-xs font-bold text-slate-700">按键临时密码</span>
                                  </div>
                                  <div className="flex items-center gap-1"><Hash className="w-3 h-3 text-indigo-400" /><span className="font-mono text-[10px] font-black text-indigo-600">682 390</span></div>
                               </label>
                           </div>
                       </div>
                    </div>
                 </div>
                 
                 {/* Target Details && Device Sync Column */}
                 <div className="flex-1 bg-slate-50/50 p-6 flex flex-col overflow-y-auto">
                    {/* Elder Location */}
                    <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-5 text-white mb-6 shadow-md relative overflow-hidden shrink-0">
                       <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                          <Building2 className="w-40 h-40" />
                       </div>
                       <div className="relative z-10">
                          <p className="text-indigo-100 text-xs font-bold tracking-wider mb-2 uppercase">被探视人员信息</p>
                          <div className="flex items-end gap-3 mb-4">
                             <h4 className="text-3xl font-black">{reviewingVisitor.target}</h4>
                             <span className="bg-indigo-400/40 border border-indigo-400/50 text-white px-2.5 py-1 rounded-md text-xs font-bold mb-1 backdrop-blur-sm">关系: {reviewingVisitor.relation}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium bg-black/20 w-fit px-3 py-2 rounded-xl border border-white/10 backdrop-blur-sm shadow-inner">
                             <MapPin className="w-4 h-4 text-indigo-200" />
                             {reviewingVisitor.roomInfo}
                          </div>
                       </div>
                    </div>

                    {/* Devices Path */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 flex-1 shadow-sm flex flex-col min-h-0">
                      <div className="flex items-center justify-between mb-4 shrink-0">
                         <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                            <Server className="w-4 h-4 text-indigo-600" />
                            授权下发门禁链路
                         </h4>
                         <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Sync Path</span>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                         {reviewingVisitor.devices?.map((device: any, idx: number) => {
                             const isActive = isDeploying && deployStep === idx;
                             const isDone = isDeploying && deployStep > idx;
                             const isWaiting = !isDeploying || deployStep < idx;

                             return (
                                <div key={device.id} className={`flex items-center justify-between p-3 rounded-2xl border ${isActive ? 'border-indigo-500 bg-indigo-50 shadow-md ring-4 ring-indigo-500/10' : isDone ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'} transition-all duration-300`}>
                                   <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-indigo-600 text-white shadow-inner' : isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-slate-200 shadow-sm text-slate-500'}`}>
                                         {device.type === '闸机' ? <HardDrive className="w-5 h-5" /> : device.type === '道闸' ? <Car className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
                                      </div>
                                      <div>
                                         <p className={`text-sm font-bold ${isActive ? 'text-indigo-900' : isDone ? 'text-emerald-900' : 'text-slate-800'}`}>{device.name}</p>
                                         <div className="flex items-center gap-2 mt-1">
                                            {device.status === 'online' ? (
                                               <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><Wifi className="w-3 h-3" /> 设备在线</span>
                                            ) : (
                                               <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400"><WifiOff className="w-3 h-3" /> 设备离线 (待唤醒)</span>
                                            )}
                                            <span className="text-[10px] text-slate-400 font-mono bg-white px-1 py-0.5 border border-slate-100 rounded">SN:{device.id}</span>
                                         </div>
                                      </div>
                                   </div>
                                   <div className="flex items-center w-24 justify-end">
                                      {isWaiting && <span className="text-xs font-bold text-slate-400">尚未下发</span>}
                                      {isActive && (
                                         <span className="flex items-center justify-end gap-1.5 text-xs font-bold text-indigo-600 animate-pulse">
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> 下发中
                                         </span>
                                      )}
                                      {isDone && (
                                         <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 slide-in-from-left-2 animate-in">
                                            <Check className="w-4 h-4" /> 已同步
                                         </span>
                                      )}
                                   </div>
                                </div>
                             )
                         })}
                      </div>
                    </div>
                 </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center gap-3">
                <div className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                   <AlertCircle className="w-4 h-4 text-amber-500" />
                   审核放行后，凭证将于预约时效结束时自动解绑销毁
                </div>
                <div className="flex gap-3">
                   <button disabled={isDeploying} onClick={() => handleReject(reviewingVisitor.id)} className="px-6 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-sm font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition shadow-sm disabled:opacity-50">驳回申请</button>
                   <button disabled={isDeploying} onClick={() => handleApprove(reviewingVisitor.id)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2 disabled:opacity-80">
                      {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                      {isDeploying ? "正在联机同步..." : "批准并下发门禁链路"}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Permission Settings Modal */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                     <Settings2 className="w-5 h-5 text-indigo-600" />
                   </div>
                   <div>
                     <h3 className="font-black text-slate-800 text-xl tracking-tight">门禁通行权限管理</h3>
                     <p className="text-xs text-slate-500 font-medium mt-0.5">配置全院各区域门禁通行规则，决定人员角色是否可以开门</p>
                   </div>
                </div>
                <button type="button" onClick={() => setShowPermissionModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="overflow-y-auto flex-1 p-0 bg-slate-50/30 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                   <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                      <tr>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">门禁位置</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">当前管控策略</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">员工授权</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">长者授权</th>
                         <th className="px-6 py-4 font-bold text-sm text-slate-500">家属授权</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                      {[
                        { id: 1, name: "园区正大门", mode: "严控出入", staff: true, elder: false, family: true },
                        { id: 2, name: "康复理疗区", mode: "刷卡入内", staff: true, elder: true, family: false },
                        { id: 3, name: "公共活动室", mode: "自由通行", staff: true, elder: true, family: true },
                        { id: 4, name: "厨房后场区", mode: "严控出入", staff: true, elder: false, family: false },
                        { id: 5, name: "行政办公区", mode: "刷卡入内", staff: true, elder: false, family: false },
                      ].map(door => (
                        <tr key={door.id} className="hover:bg-slate-50/80 transition-colors">
                           <td className="px-6 py-4">
                              <span className="font-bold text-slate-800 flex items-center gap-2">
                                <DoorClosed className="w-4 h-4 text-slate-400" />
                                {door.name}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <select defaultValue={door.mode} className="border border-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-indigo-500">
                                 <option>白名单严控</option>
                                 <option>刷卡入内</option>
                                 <option>自由通行</option>
                              </select>
                           </td>
                           <td className="px-6 py-4">
                              <input type="checkbox" defaultChecked={door.staff} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                           </td>
                           <td className="px-6 py-4">
                              <input type="checkbox" defaultChecked={door.elder} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                           </td>
                           <td className="px-6 py-4">
                              <input type="checkbox" defaultChecked={door.family} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             
             <div className="px-6 py-5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
                <span className="text-sm text-slate-500">注：权限修改实时下发至终端设备</span>
                <button onClick={() => {
                   setShowPermissionModal(false);
                   toast.success("门禁权限策略集已下发生效");
                }} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm">
                   保存所有配置更改
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Credential Setup Modal */}
      {showCredentialModal && selectedAuthUser && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                       <Fingerprint className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                       <h3 className="font-black text-slate-800 text-xl tracking-tight">录入通行凭证</h3>
                       <p className="text-sm text-slate-500 font-medium">当前操作对象: <span className="text-slate-800 font-bold">{selectedAuthUser.name}</span> ({selectedAuthUser.role})</p>
                    </div>
                 </div>
                 <button type="button" onClick={() => setShowCredentialModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 bg-slate-50/50 flex flex-col gap-6">
                 {/* Face Recognition */}
                 <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden relative">
                       {selectedAuthUser.face ? (
                          <>
                             <div className="absolute inset-0 bg-emerald-500/20 mix-blend-multiply"></div>
                             <UserPlus className="w-8 h-8 text-emerald-600 relative z-10" />
                          </>
                       ) : (
                          <UserPlus className="w-8 h-8 text-slate-300" />
                       )}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-800 mb-1">人脸底库绑定</h4>
                       <p className="text-xs text-slate-500 mb-3">使用摄像头录入人脸，用于所有大门进出识别。</p>
                       {selectedAuthUser.face ? (
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-bold text-emerald-600 flex items-center gap-1"><Check className="w-4 h-4" /> 已录入</span>
                             <button onClick={() => toast.success("正在调用摄像头重新采集...")} className="text-xs text-indigo-600 font-medium hover:underline">重新采集</button>
                             <button onClick={() => toast.error("已移除人脸凭证")} className="text-xs text-rose-600 font-medium hover:underline">删除</button>
                          </div>
                       ) : (
                          <button onClick={() => toast.success("正在调用前置摄像头...")} className="text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition">开始扫描采集</button>
                       )}
                    </div>
                 </div>

                 {/* IC Card */}
                 <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200">
                       <KeySquare className={`w-8 h-8 ${selectedAuthUser.card ? "text-indigo-600" : "text-slate-300"}`} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-800 mb-1">IC实体卡分发</h4>
                       <p className="text-xs text-slate-500 mb-3">贴近读卡器自动读取并绑定新卡片。</p>
                       {selectedAuthUser.card ? (
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">{selectedAuthUser.card}</span>
                             <button onClick={() => toast.success("请将新卡贴近读卡器...")} className="text-xs text-indigo-600 font-medium hover:underline">更换卡片</button>
                             <button onClick={() => toast.error("已挂失并解绑实体卡")} className="text-xs text-rose-600 font-medium hover:underline">挂失解绑</button>
                          </div>
                       ) : (
                          <button onClick={() => toast.success("请将空白卡放置在读卡器区域")} className="text-xs font-bold border border-slate-300 text-slate-700 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition shadow-sm">发卡 (读取硬件)</button>
                       )}
                    </div>
                 </div>

                 {/* Fingerprint */}
                 <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200">
                       <Fingerprint className={`w-8 h-8 ${selectedAuthUser.fingerprint ? "text-blue-600" : "text-slate-300"}`} />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-slate-800 mb-1">指纹信息采集</h4>
                       <p className="text-xs text-slate-500 mb-3">连接指纹机，需连续按压三次完成建库。</p>
                       {selectedAuthUser.fingerprint ? (
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-bold text-blue-600 flex items-center gap-1"><Check className="w-4 h-4" /> 库编号 {selectedAuthUser.id}0A</span>
                             <button onClick={() => toast.success("请连接指纹仪并按压三次")} className="text-xs text-indigo-600 font-medium hover:underline">重新录取</button>
                             <button onClick={() => toast.error("已清除指纹库记录")} className="text-xs text-rose-600 font-medium hover:underline">删除指纹</button>
                          </div>
                       ) : (
                          <button onClick={() => {
                             toast.success("系统尝试连接 USB 指纹仪模块中...");
                             setTimeout(() => toast.success("指纹特征提取完成，请按压手指。"), 1000);
                          }} className="text-xs font-bold border border-slate-300 text-slate-700 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-50 transition shadow-sm">外接设备录入指纹</button>
                       )}
                    </div>
                 </div>
              </div>
              <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3">
                 <button disabled={isAuthDeploying} onClick={() => setShowCredentialModal(false)} className="px-5 py-2.5 bg-slate-100/80 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition disabled:opacity-50">取消</button>
                 <button disabled={isAuthDeploying} onClick={handleCredentialDeploy} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2 disabled:opacity-80">
                    {isAuthDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
                    {isAuthDeploying ? "正在联机同步特征库..." : "完成并下发凭证"}
                 </button>
              </div>
           </div>
         </div>
      )}

      {/* Door Access Modal */}
      {showDoorAuthModal && selectedAuthUser && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white shrink-0">
                 <div>
                    <h3 className="font-black text-slate-800 text-xl tracking-tight">配置人员专属门禁权限</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">控制 <span className="text-slate-800 font-bold">{selectedAuthUser.name}</span> ({selectedAuthUser.role}) 可通行的具体物理区域</p>
                 </div>
                 <button type="button" onClick={() => setShowDoorAuthModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar flex-1">
                 <div className="space-y-4">
                    {[
                      { area: "公共与出入口", doors: ["园区正大门", "侧门(消防通道)", "公共活动室"] },
                      { area: "服务与医疗区", doors: ["康复理疗区", "医疗室", "药房", "心理咨询室"] },
                      { area: "后勤与行政", doors: ["厨房后场区", "物资仓库", "行政办公区", "机房"] },
                      { area: "住宿区域", doors: ["A栋一楼大门", "A栋二楼信道", "B栋主入口"] }
                    ].map((group, idx) => (
                       <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                          <div className="bg-slate-100/50 px-4 py-2 border-b border-slate-200">
                             <h4 className="font-bold text-slate-700 text-sm">{group.area}</h4>
                          </div>
                          <div className="p-2 flex flex-col">
                             {group.doors.map((d, i) => (
                                <label key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer transition">
                                   <input 
                                      type="checkbox" 
                                      checked={selectedAuthUser.doors.includes(d)}
                                      onChange={(e) => {
                                          const checked = e.target.checked;
                                          setSelectedAuthUser((prev: any) => ({
                                              ...prev,
                                              doors: checked 
                                                ? [...(prev.doors || []), d]
                                                : (prev.doors || []).filter((door: string) => door !== d)
                                          }));
                                      }}
                                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                                   />
                                   <span className="text-sm font-medium text-slate-700">{d}</span>
                                </label>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="px-6 py-5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
                 <button onClick={() => toast.success("正在一键同步该部门的标准权限...")} className="text-sm text-indigo-600 font-bold hover:underline">按照角色/部门一键填充</button>
                 <div className="flex gap-3">
                    <button disabled={isAuthDeploying} onClick={() => setShowDoorAuthModal(false)} className="px-5 py-2.5 bg-slate-100/80 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition disabled:opacity-50">取消</button>
                    <button disabled={isAuthDeploying} onClick={handleStaffAuthDeploy} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm flex items-center gap-2 disabled:opacity-80">
                       {isAuthDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                       {isAuthDeploying ? "正在联机写入..." : "保存并下发"}
                    </button>
                 </div>
              </div>
           </div>
         </div>
      )}
    </div>
  );
}
