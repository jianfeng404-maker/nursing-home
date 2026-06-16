import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Bed, Info, CheckCircle2, User, UserX, AlertCircle, RefreshCcw, Home, Filter, ChevronDown, UserPlus, FileText, Settings, X, LogOut, ArrowRightCircle } from "lucide-react";
import { useStore } from "../store";
import { toast } from "sonner";
import { ElderLink } from "../components/ElderLink";

export function BedBoard({ setActiveTab }: { setActiveTab?: (tab: string) => void } = {}) {
  const [selectedBuilding, setSelectedBuilding] = useState("A栋");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeBedId, setActiveBedId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  // Real full-screen (or large) modals for operations
  const [showChangeBedModal, setShowChangeBedModal] = useState(false);
  const [selectedTargetBuilding, setSelectedTargetBuilding] = useState<string>('');
  const [selectedTargetFloor, setSelectedTargetFloor] = useState<string>('');
  const [selectedTargetRoom, setSelectedTargetRoom] = useState<string>('');
  const [selectedTargetBedId, setSelectedTargetBedId] = useState<string>('');
  const [selectedTargetCareLevel, setSelectedTargetCareLevel] = useState<string>('');
  
  const [showDischargeModal, setShowDischargeModal] = useState(false);

  const { beds, elders, updateBed, updateElder, setTargetElderId, setTargetElderTab, setTargetAction } = useStore();

  const unassignedElders = elders.filter(e => !beds.some(b => b.elderId === e.id));
  const emptyBeds = beds.filter(b => b.status === 'empty');

  const stats = [
    { label: "总床位数", value: beds.length, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "已入住", value: beds.filter(b => b.status === "occupied").length, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "空闲床位", value: beds.filter(b => b.status === "empty").length, color: "text-slate-600", bg: "bg-slate-100" },
    { label: "已预订", value: beds.filter(b => b.status === "reserved").length, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "维修中", value: beds.filter(b => b.status === "maintenance").length, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'empty': return 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500';
      case 'reserved': return 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-800';
      case 'maintenance': return 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-800';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied': return <User className="w-5 h-5 text-emerald-600 mb-2" strokeWidth={2.5} />;
      case 'empty': return <Bed className="w-5 h-5 text-slate-400 mb-2" strokeWidth={2.5} />;
      case 'reserved': return <CheckCircle2 className="w-5 h-5 text-amber-500 mb-2" strokeWidth={2.5} />;
      case 'maintenance': return <AlertCircle className="w-5 h-5 text-rose-500 mb-2" strokeWidth={2.5} />;
      default: return null;
    }
  };

  const activeBeds = React.useMemo(() => {
    return beds.filter(b => 
      b.building === selectedBuilding && 
      (selectedFilter === "all" || b.status === selectedFilter)
    );
  }, [beds, selectedBuilding, selectedFilter]);

  const floorsMap = React.useMemo(() => {
    return activeBeds.reduce((acc, bed) => {
      if (!acc[bed.floor]) acc[bed.floor] = {};
      if (!acc[bed.floor][bed.room]) acc[bed.floor][bed.room] = [];
      acc[bed.floor][bed.room].push(bed);
      return acc;
    }, {} as Record<string, Record<string, typeof beds>>);
  }, [activeBeds]);

  const floorKeys = Object.keys(floorsMap).sort();

  const activeBedDetail = beds.find(b => b.id === activeBedId);
  const activeElderDetail = activeBedDetail?.elderId ? elders.find(e => e.id === activeBedDetail.elderId) : null;

  const closePanel = () => {
    setActiveBedId(null);
    setIsAssigning(false);
  };

  const handleAssign = (elderId: string) => {
    if (!activeBedDetail) return;
    updateBed(activeBedDetail.id, { status: 'occupied', elderId });
    setIsAssigning(false);
    toast.success(`已成功办理入住至 ${activeBedDetail.id} 床位`);
  };

  const submitChangeBed = () => {
    if (!activeBedDetail || !selectedTargetBedId) {
      toast.error("请选择目标床位");
      return;
    }
    updateBed(activeBedDetail.id, { status: 'empty', elderId: undefined });
    updateBed(selectedTargetBedId, { status: 'occupied', elderId: activeBedDetail.elderId });
    if (activeElderDetail) {
       const newBed = emptyBeds.find(b => b.id === selectedTargetBedId);
       updateElder(activeElderDetail.id, { 
         careLevel: selectedTargetCareLevel || activeElderDetail.careLevel,
         room: newBed ? `${newBed.building}${newBed.room}-${newBed.id.split('-')[1]||'1'}床` : activeElderDetail.room
       });
    }
    setShowChangeBedModal(false);
    setActiveBedId(selectedTargetBedId);
    setSelectedTargetBedId('');
    setSelectedTargetBuilding('');
    setSelectedTargetFloor('');
    setSelectedTargetRoom('');
    setSelectedTargetCareLevel('');
    toast.success(`已成功完成调床流程，长者档案及服务项已自动迁移至 ${selectedTargetBedId}`);
  };

  const submitDischarge = () => {
    if (!activeBedDetail || !activeElderDetail) return;
    
    // Instead of directly emptying the bed here, we trigger a processing discharge record.
    useStore.getState().addDischarge({
       id: `OUT-${new Date().toISOString().replace(/\D/g,'').slice(0,8)}-${Math.floor(Math.random()*900+100)}`,
       name: activeElderDetail.name,
       room: activeBedDetail.roomType + ' ' + activeBedDetail.room,
       type: "退住申请",
       reason: "由房态图申请发起的离院",
       applyDate: new Date().toISOString().split('T')[0],
       leaveDate: new Date().toISOString().split('T')[0],
       status: "processing",
       checks: { items: false, medical: false, fee: false }
    });
    
    updateElder(activeElderDetail.id, { healthStatus: "办理退住中" });

    setShowDischargeModal(false);
    toast.success(`已发起长者离院结算申请，请前往【退住办理】完成后续清退流程。`);
    // if (setActiveTab) setActiveTab('discharge_record'); // Requires setActiveTab properly passed or not currently.
  };

  const handleStatusChange = (status: any, elderId?: string, msg?: string) => {
    if (!activeBedDetail) return;
    updateBed(activeBedDetail.id, { status, elderId });
    toast.success(msg || `状态已更新为主: ${status}`);
  };

  const availableBuildingsInModal = Array.from(new Set(emptyBeds.map(b => b.building)));
  const availableFloorsInModal = selectedTargetBuilding ? Array.from(new Set(emptyBeds.filter(b => b.building === selectedTargetBuilding).map(b => b.floor))) : [];
  const availableRoomsInModal = selectedTargetFloor ? Array.from(new Set(emptyBeds.filter(b => b.building === selectedTargetBuilding && b.floor === selectedTargetFloor).map(b => b.room))) : [];
  const availableBedsInModal = selectedTargetRoom ? emptyBeds.filter(b => b.building === selectedTargetBuilding && b.floor === selectedTargetFloor && b.room === selectedTargetRoom) : [];

  return (
    <div className="animate-in fade-in duration-500 pb-8 relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">全院床位看板</h1>
          <span className="text-sm text-slate-500">直观展示全院楼宇、楼层、房间的床位使用状态及长者信息</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            <RefreshCcw className="h-4 w-4" />
            刷新状态
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white overflow-hidden relative group">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="relative z-10">
                <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                <h3 className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>
                <Home className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm flex-1">
        <CardHeader className="bg-white border-b border-slate-100 pb-4 pt-5 px-6 rounded-t-xl">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg w-fit shadow-inner">
              {['A栋', 'B栋', 'C栋', '护理院'].map((b) => (
                <button 
                  key={b}
                  onClick={() => setSelectedBuilding(b)}
                  className={`px-5 py-2 text-sm font-bold rounded-md transition-all ${selectedBuilding === b ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  {b}
                </button>
              ))}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 justify-end">
              {[
                { id: "all", label: "全部状态", color: "bg-slate-100 text-slate-600" },
                { id: "occupied", label: "已入住", color: "bg-emerald-100 text-emerald-700" },
                { id: "empty", label: "空闲", color: "bg-white border text-slate-600" },
                { id: "reserved", label: "已预订", color: "bg-amber-100 text-amber-700" },
                { id: "maintenance", label: "维修中", color: "bg-rose-100 text-rose-700" }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    selectedFilter === filter.id 
                      ? `${filter.color} ring-2 ring-slate-300 ring-offset-1` : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-slate-50/50 min-h-[500px]">
          {floorKeys.length > 0 ? (
            <div className="space-y-8">
              {floorKeys.map((level) => {
                const floorRooms = floorsMap[level];
                const roomKeys = Object.keys(floorRooms).sort();
                return (
                  <div key={level} className="bg-white p-5 outline outline-1 outline-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                      <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">{level}</h3>
                      <div className="flex-1 h-px bg-slate-100 ml-4"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {roomKeys.map((roomNo) => {
                        const roomBeds = floorRooms[roomNo];
                        return (
                          <div key={roomNo} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                            <div className="bg-white px-4 py-3 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                              <span className="font-extrabold text-slate-800 tracking-tight text-lg">{roomNo} <span className="text-sm font-medium text-slate-400 ml-1">房</span></span>
                              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                {roomBeds[0].roomType}
                              </span>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-3 flex-1 relative min-h-[120px]">
                               {roomBeds.map((bed) => {
                                 const elder = bed.elderId ? elders.find(e => e.id === bed.elderId) : null;
                                 return (
                                  <div 
                                    key={bed.id} 
                                    onClick={() => setActiveBedId(bed.id)}
                                    className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${getStatusColor(bed.status)} ${roomBeds.length === 1 ? 'col-span-2' : ''}`}
                                  >
                                    {getStatusIcon(bed.status)}
                                    <span className="text-[13px] font-extrabold mb-1 tracking-tight text-slate-700">{bed.id} 床</span>
                                    {elder ? (
                                      <div className="flex flex-col items-center">
                                        <span className="text-[14px] font-bold text-slate-900">{elder.name}</span>
                                        <span className="text-[10px] font-semibold text-slate-500 mt-1 bg-white/60 px-1.5 py-0.5 rounded">{elder.careLevel}</span>
                                      </div>
                                    ) : bed.status === 'reserved' ? (
                                      <span className="text-xs font-semibold text-amber-700">已预订</span>
                                    ) : (
                                      <span className="text-xs font-bold opacity-60">
                                        {bed.status === 'empty' ? '空位' : '维修'}
                                      </span>
                                    )}
                                  </div>
                                 );
                               })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
               <Info className="w-16 h-16 mb-4 text-slate-300" />
               <p className="text-lg font-medium text-slate-500 mb-2">未找到符合条件的床位数据</p>
               <p className="text-sm">当前楼宇 (${selectedBuilding}) 暂无配置的床位，或全部被筛选过滤。</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Overlay */}
      {activeBedId && activeBedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300 border-l border-slate-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border shadow-sm ${
                  activeBedDetail.status === 'occupied' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 
                  activeBedDetail.status === 'empty' ? 'bg-slate-100 border-slate-200 text-slate-600' :
                  'bg-amber-100 border-amber-200 text-amber-700'
                }`}>
                  {activeBedDetail.status === 'occupied' ? <User className="w-6 h-6" strokeWidth={2.5} /> : <Bed className="w-6 h-6" strokeWidth={2.5} />}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{activeBedDetail.id} 床位详情</h2>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{activeBedDetail.building} - {activeBedDetail.floor} - {activeBedDetail.room}房 ({activeBedDetail.roomType})</p>
                </div>
              </div>
              <button 
                onClick={closePanel}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                title="关闭"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              {activeBedDetail.status === "occupied" && activeElderDetail ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">长者档案集要</h3>
                    <Card className="border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white shadow-sm overflow-hidden">
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-2xl font-black text-slate-800 tracking-tight"><ElderLink id={activeElderDetail.id} text={activeElderDetail.name} className="text-slate-800" /></h4>
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">{activeElderDetail.gender} · {activeElderDetail.age}岁</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-500">入住日期: {activeElderDetail.admissionDate}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setTargetElderId(activeElderDetail.id);
                              setTargetElderTab('info');
                            }}
                            className="flex items-center justify-center p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm cursor-pointer"
                            title="打开档案抽屉"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="text-[11px] font-bold text-slate-400 mb-1">照护等级</div>
                            <div className="text-sm font-extrabold text-blue-700">{activeElderDetail.careLevel}</div>
                          </div>
                          <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                            <div className="text-[11px] font-bold text-slate-400 mb-1">健康状态</div>
                            <div className="text-sm font-extrabold text-amber-700">{activeElderDetail.healthStatus}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">床位操作</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setShowChangeBedModal(true)} className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors group shadow-sm text-slate-700">
                        <RefreshCcw className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-bold text-sm">办理调床</span>
                      </button>
                      <button onClick={() => {
                        setTargetElderId(activeElderDetail.id);
                        setTargetAction('create_leave');
                        if (setActiveTab) setActiveTab('leave_manage');
                      }} className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors group shadow-sm text-slate-700">
                        <UserX className="w-5 h-5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                        <span className="font-bold text-sm">请假外出</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeBedDetail.status === "empty" && (
                     <div className="bg-slate-50 mt-4 rounded-2xl overflow-hidden border border-slate-200">
                       {!isAssigning ? (
                         <div className="p-6 text-center border-2 border-dashed border-transparent">
                           <Bed className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                           <h3 className="text-lg font-bold text-slate-700 mb-1">当前床位空闲</h3>
                           <p className="text-sm font-medium text-slate-500 mb-5">可随时安排新长者入住此床位</p>
                           <button 
                             onClick={() => setIsAssigning(true)}
                             className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm shadow-emerald-200/50 transition-colors"
                           >
                             <UserPlus className="w-5 h-5" />
                             办理入住 / 分配长者
                           </button>
                         </div>
                       ) : (
                         <div className="p-5 animate-in slide-in-from-bottom-2">
                           <div className="flex items-center justify-between mb-4">
                             <h4 className="font-bold text-slate-800">分配拟入住长者</h4>
                             <button onClick={() => setIsAssigning(false)} className="text-xs text-slate-500 hover:text-slate-800 font-medium">取消选择</button>
                           </div>
                           
                           {unassignedElders.length > 0 ? (
                             <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                               {unassignedElders.map(elder => (
                                 <div key={elder.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all group">
                                   <div>
                                     <div className="font-bold text-slate-800 mb-0.5">{elder.name} <span className="text-xs font-normal text-slate-500 ml-1">{elder.gender} · {elder.age}岁</span></div>
                                     <div className="text-[11px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shadow-sm inline-block">{elder.careLevel}</div>
                                   </div>
                                   <button 
                                     onClick={() => handleAssign(elder.id)}
                                     className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-bold rounded-lg transition-colors border border-emerald-200 hover:border-emerald-600"
                                   >
                                     确认入住
                                   </button>
                                 </div>
                               ))}
                             </div>
                           ) : (
                             <div className="text-center py-6">
                               <p className="text-sm text-slate-500">检测不到未分配床位的在院长者。</p>
                               <button 
                                 onClick={() => { setIsAssigning(false); setActiveTab('admission_record'); toast.success('已为您跳转至长者录入页'); }}
                                 className="mt-3 text-sm font-bold text-blue-600 hover:text-blue-800"
                               >
                                 + 录入新长者档案
                               </button>
                             </div>
                           )}
                         </div>
                       )}
                     </div>
                  )}

                  {activeBedDetail.status === "reserved" && (
                    <div className="p-6 border border-amber-200 rounded-2xl bg-gradient-to-b from-amber-50 to-white shadow-sm mt-4">
                       <CheckCircle2 className="w-10 h-10 text-amber-500 mb-3" />
                       <h3 className="text-lg font-bold text-amber-900 mb-1">已预定状态</h3>
                       <p className="text-sm font-medium text-amber-700/80 mb-5">此床位已被预定保留，近期将办理入住。</p>
                       <div className="flex gap-3">
                         <button onClick={() => setIsAssigning(true) || updateBed(activeBedDetail.id, {status: 'empty'})} className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                           指派长者入住
                         </button>
                         <button onClick={() => handleStatusChange('empty', undefined, "预订已成功取消，释放空位")} className="flex-1 py-2.5 bg-white border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-bold text-sm transition-colors shadow-sm">
                           取消预订
                         </button>
                       </div>
                    </div>
                  )}

                   {activeBedDetail.status === "maintenance" && (
                    <div className="p-6 border border-rose-200 rounded-2xl bg-gradient-to-b from-rose-50 to-white shadow-sm mt-4">
                       <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
                       <h3 className="text-lg font-bold text-rose-900 mb-1">维修中</h3>
                       <p className="text-sm font-medium text-rose-700/80 mb-5">此床位硬件设备正在检修维护中，暂时不可使用。</p>
                       <div className="flex gap-3">
                         <button onClick={() => handleStatusChange('empty', undefined, '标记为恢复正常，床位空闲')} className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm">
                           修复完成，恢复使用
                         </button>
                       </div>
                    </div>
                  )}

                  {activeBedDetail.status !== "maintenance" && (
                    <div>
                       <h3 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider mt-8">扩展操作</h3>
                       <div className="grid grid-cols-1 gap-2">
                         <button onClick={() => handleStatusChange('maintenance', undefined, '已标记为维修中')} className="flex items-center justify-between p-4 border border-slate-200 bg-white rounded-xl hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 transition-colors text-slate-700 group shadow-sm">
                           <div className="flex items-center gap-3">
                             <Settings className="w-5 h-5 text-slate-400 group-hover:text-rose-600" />
                             <span className="font-bold text-sm">标记为维修中</span>
                           </div>
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {activeBedDetail.status === 'occupied' && (
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                 <button 
                   onClick={() => setShowDischargeModal(true)}
                   className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl font-bold shadow-sm transition-colors"
                 >
                   <LogOut className="w-5 h-5" />
                   办理退床离院...
                 </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 办理调床 独立巨型表单模态框 */}
      {showChangeBedModal && activeBedDetail && activeElderDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><RefreshCcw className="w-6 h-6 text-blue-600" /> 办理房位调换调整</h2>
                <button onClick={() => setShowChangeBedModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="p-6 bg-white overflow-y-auto max-h-[70vh]">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-6">
                   <div className="text-xs font-bold text-blue-800 mb-2 uppercase flex items-center gap-2"><User className="w-3.5 h-3.5" />当前长者档案信息</div>
                   <div className="font-medium text-slate-700 flex justify-between"><div className="font-bold text-lg text-slate-900">{activeElderDetail.name}</div><div className="text-slate-500">原床位: <span className="font-bold text-slate-800">{activeBedDetail.id}</span> 床</div></div>
                   <div className="text-sm text-slate-600 mt-1">护理等级: {activeElderDetail.careLevel}</div>
                </div>

                <div className="space-y-5">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">目标楼宇 *</label>
                       <select 
                         className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium shadow-sm transition-colors"
                         value={selectedTargetBuilding}
                         onChange={e => {
                           setSelectedTargetBuilding(e.target.value);
                           setSelectedTargetFloor('');
                           setSelectedTargetRoom('');
                           setSelectedTargetBedId('');
                         }}
                       >
                         <option value="">-- 选择楼宇 --</option>
                         {availableBuildingsInModal.map(b => (
                           <option key={b} value={b}>{b}</option>
                         ))}
                       </select>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">目标楼层 *</label>
                       <select 
                         className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium shadow-sm transition-colors"
                         value={selectedTargetFloor}
                         onChange={e => {
                           setSelectedTargetFloor(e.target.value);
                           setSelectedTargetRoom('');
                           setSelectedTargetBedId('');
                         }}
                         disabled={!selectedTargetBuilding}
                       >
                         <option value="">-- 选择楼层 --</option>
                         {availableFloorsInModal.map(f => (
                           <option key={f} value={f}>{f}</option>
                         ))}
                       </select>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">目标房间 *</label>
                       <select 
                         className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium shadow-sm transition-colors"
                         value={selectedTargetRoom}
                         onChange={e => {
                           setSelectedTargetRoom(e.target.value);
                           setSelectedTargetBedId('');
                         }}
                         disabled={!selectedTargetFloor}
                       >
                         <option value="">-- 选择房间 --</option>
                         {availableRoomsInModal.map(r => (
                           <option key={r} value={r}>{r}房</option>
                         ))}
                       </select>
                     </div>

                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">目标床位 *</label>
                       <select 
                         className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white font-medium shadow-sm transition-colors"
                         value={selectedTargetBedId}
                         onChange={e => setSelectedTargetBedId(e.target.value)}
                         disabled={!selectedTargetRoom}
                       >
                         <option value="">-- 选择床位 --</option>
                         {availableBedsInModal.map(b => (
                           <option key={b.id} value={b.id}>{b.id} ({b.roomType})</option>
                         ))}
                       </select>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">调换日期 *</label>
                       <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 bg-white" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">调换原因性质 *</label>
                       <select className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 bg-white">
                          <option>自愿申请升级</option>
                          <option>长者间摩擦调房</option>
                          <option>医疗护理需要</option>
                          <option>原房间设备维修需要</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">调整护理等级 (可选)</label>
                       <select 
                         className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                         value={selectedTargetCareLevel}
                         onChange={e => setSelectedTargetCareLevel(e.target.value)}
                       >
                          <option value="">保持原等级 ({activeElderDetail.careLevel})</option>
                          <option value="一级护理">一级护理</option>
                          <option value="二级护理">二级护理</option>
                          <option value="三级护理">三级护理</option>
                          <option value="特级护理">特级护理</option>
                       </select>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 block">调换明细事由及备注附录</label>
                     <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-blue-500 bg-white resize-none" placeholder="请详细提供调换原因和需要协调交接的事项..."></textarea>
                   </div>

                   <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-lg flex items-start gap-3">
                      <div className="border border-slate-300 bg-white p-1 rounded"><Settings className="w-4 h-4 text-slate-500" /></div>
                      <div>
                         <p className="text-sm font-bold text-slate-800">系统联动行为提示:</p>
                         <p className="text-xs text-slate-600 leading-relaxed mt-1">确诊调床后，计费引擎将根据新床位的价格自动进行后续账单折算；已分配给该长者的护工和护理任务可能会重定向到新楼层区域负责；智能手环定位原信息将重置。</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-200 flex justify-end gap-3 bg-white">
                <button onClick={() => setShowChangeBedModal(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">放弃</button>
                <button onClick={submitChangeBed} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">提交调换申请 <ArrowRightCircle className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      )}

      {/* 办理退住 模态框 */}
      {showDischargeModal && activeBedDetail && activeElderDetail && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="p-5 border-b border-rose-100 bg-rose-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><LogOut className="w-6 h-6 text-rose-600" /> 发起退住离院申请</h2>
                <button onClick={() => setShowDischargeModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             
             <div className="p-6 bg-white overflow-y-auto max-h-[70vh]">
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl mb-6">
                   <div className="text-xs font-bold text-rose-800 mb-2 uppercase flex items-center gap-2"><User className="w-3.5 h-3.5" />办理退住长者信息</div>
                   <div className="font-medium text-slate-700 flex justify-between"><div className="font-bold text-lg text-slate-900">{activeElderDetail.name}</div><div className="text-slate-500">释放床位编号: <span className="font-bold text-slate-800">{activeBedDetail.id}</span></div></div>
                   <div className="text-sm text-slate-600 mt-1">评估状态: {activeElderDetail.healthStatus}</div>
                </div>

                <div className="space-y-5">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">拟定正式离院日期 *</label>
                       <input type="date" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-rose-500 bg-white" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-bold text-slate-700 block">离院退住原因类型 *</label>
                       <select className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-rose-500 bg-white">
                          <option>家属接回居家</option>
                          <option>突发重疾医疗转院</option>
                          <option>长者辞世</option>
                          <option>试住期满终止合约</option>
                          <option>其他原因终止协议</option>
                       </select>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 block">押金退回账户 (选填)</label>
                     <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-rose-500 bg-white" placeholder="请输入银行卡号或收款支付宝账户" />
                   </div>

                   <div className="space-y-3">
                     <label className="text-sm font-bold text-slate-700 block">离院前快速确认清单</label>
                     <div className="space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                           <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">房间物资实物清点已通知后勤部门</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                           <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">个人自备药品/用品已通知家属带走</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                           <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-rose-600 focus:ring-rose-500" />
                           <span className="text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">当月伙食、护理费用已完成预结算确认</span>
                        </label>
                     </div>
                   </div>

                   <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-700 block">详细离院及去向说明 *</label>
                     <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:border-rose-500 bg-white resize-none" placeholder="请描述退住的具体情形记录..."></textarea>
                   </div>

                   <div className="p-4 bg-slate-50 border border-slate-200 border-dashed rounded-lg flex items-start gap-3">
                      <div className="border border-slate-300 bg-white p-1 rounded"><FileText className="w-4 h-4 text-slate-500" /></div>
                      <div>
                         <p className="text-sm font-bold text-slate-800">退住清点提交流程说明:</p>
                         <p className="text-xs text-slate-600 leading-relaxed mt-1">提交本申请后，将进入业务系统的“清退处理池”，需至 【退住办理】 模块由后勤、药房、财务分别进行物资确认、停药算结、余款账单结算，确认完毕床位才可被正式接管入住新长者。</p>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowDischargeModal(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">取消</button>
                <button onClick={submitDischarge} className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2">发起退院清点审核 <ArrowRightCircle className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
      )}
      {/* END MODALS */}
    </div>
  );
}
