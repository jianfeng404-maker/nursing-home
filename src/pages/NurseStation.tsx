import React, { useState, useEffect } from "react";
import { Activity, Bell, Clock, AlertTriangle, ShieldAlert, HeartPulse, BedDouble, CheckCircle2, User, Phone, MapPin, Volume2, Monitor, Users, X, Siren, Sparkles, Loader2, Calendar, Maximize, Minimize } from "lucide-react";
import { useStore } from "../store";
import { ElderLink } from "../components/ElderLink";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { analyzeVitalSignsAnomaly } from "../services/aiService";
import { toast } from "sonner";

export function NurseStation({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedVitalsPerson, setSelectedVitalsPerson] = useState<any>(null);
  const [historyRange, setHistoryRange] = useState('day');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [anomalyAnalysis, setAnomalyAnalysis] = useState('');
  const [vitalsData, setVitalsData] = useState<Record<string, any>>({});

  const { elders, beds, tasks: globalTasks, addCareRecord, updateTaskStatus, careRecords, staff } = useStore();

  useEffect(() => {
    // Initial mock vitals for each occupied bed
    const initialVitals: Record<string, any> = {};
    beds.forEach((b, index) => {
       if (b.status === 'occupied') {
          initialVitals[b.id] = {
             hr: 65 + (index % 10) * 2,
             rr: 16 + (index % 3),
             bpSys: 110 + (index % 5) * 5,
             bpDia: 70 + (index % 4) * 3,
             status: 'normal',
             isAwake: index % 3 === 0
          };
       }
    });
    setVitalsData(initialVitals);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const vitalsTimer = setInterval(() => {
       setVitalsData(prev => {
          const next = { ...prev };
          Object.keys(next).forEach(bedId => {
             const hrChange = Math.floor(Math.random() * 5) - 2;
             const rrChange = Math.floor(Math.random() * 3) - 1;
             const item = next[bedId];
             next[bedId] = {
                ...item,
                hr: Math.max(50, Math.min(110, item.hr + hrChange)),
                rr: Math.max(12, Math.min(24, item.rr + rrChange)),
             };
          });
          return next;
       });
    }, 3000);

    return () => { clearInterval(timer); clearInterval(vitalsTimer); };
  }, [beds]);

  const generateHistoryData = (range: string) => {
    const data = [];
    let points = 24;
    // ... basic mock
    let baseHr = 75;
    let baseRr = 16;
    let baseBpSys = 120;
    let baseBpDia = 80;

    for (let i = 0; i < points; i++) {
      data.push({
        time: `${i}:00`,
        hr: Math.round(baseHr + (Math.random() * 20 - 10)),
        rr: Math.round(baseRr + (Math.random() * 6 - 3)),
        bpSys: Math.round(baseBpSys + (Math.random() * 20 - 10)),
        bpDia: Math.round(baseBpDia + (Math.random() * 10 - 5)),
      });
    }
    return data;
  };

  const globalAlerts = useStore(state => state.alerts);
  const resolveAlert = useStore(state => state.resolveAlert);
  
  // Format global alerts for NurseStation UI mapping pending ones
  const activeAlerts = globalAlerts
    .filter(a => a.status === 'pending')
    .map(a => ({
      ...a,
      bed: a.location,
      elder: a.resident,
      desc: a.title,
    }));

  const [handlingAlert, setHandlingAlert] = useState<any>(null);
  const [handleNotes, setHandleNotes] = useState('');

  const [handlingTask, setHandlingTask] = useState<any>(null);
  const [taskNotes, setTaskNotes] = useState('');

  const [showShiftReport, setShowShiftReport] = useState(false);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [addingFromElder, setAddingFromElder] = useState<any>(null);
  const [newRecordContent, setNewRecordContent] = useState('');
  const [newRecordResult, setNewRecordResult] = useState('');

  const handleAIAnalysis = async () => {
    if (!selectedVitalsPerson) return;
    setIsAnalyzing(true);
    try {
      const payload = {
        name: selectedVitalsPerson.name,
        currentVitals: {
          hr: selectedVitalsPerson.hr,
          rr: selectedVitalsPerson.rr,
          bpSys: selectedVitalsPerson.bpSys,
          bpDia: selectedVitalsPerson.bpDia,
        },
        historicalTrend: historyData
      };
      const result = await analyzeVitalSignsAnomaly(payload);
      setAnomalyAnalysis(result);
      toast.success('AI研判完成');
    } catch (e: any) {
      toast.error(e.message || '研判失败');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Map tasks
  const pendingTasks = globalTasks.map(t => ({
    id: t.id,
    time: t.time,
    task: t.name,
    elderRaw: t.elder,
    bed: t.elder.includes('(') ? t.elder.split('(')[1].replace(')', '') : 'N/A',
    elder: t.elder.split(' ')[0],
    assigned: t.staff,
    status: t.status,
  }));

  // Map beds to their current elders
  const floorBeds = beds.filter(b => b.building === 'A栋');

  const getAlertIcon = (type: string, sizeClass = "w-6 h-6") => {
    switch(type) {
      case 'sos': return <Bell className={`${sizeClass} text-rose-500 animate-pulse`} />;
      case 'fall': return <Activity className={`${sizeClass} text-rose-500 animate-pulse`} />;
      case 'vitals': return <HeartPulse className={`${sizeClass} text-amber-500`} />;
      default: return <ShieldAlert className={`${sizeClass} text-blue-500`} />;
    }
  };

  return (
    <div className={`text-slate-700 flex flex-col overflow-y-auto ${isFullscreen ? "fixed inset-0 z-50 bg-[#F4F7FA] p-6 pb-20" : "h-full -mx-4 sm:-mx-6 md:-mx-8 -my-4 sm:-my-6 md:-my-8 bg-[#F4F7FA] p-4 sm:p-6 pb-20"}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 shrink-0 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <Monitor className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-wider">A栋 护理与体征综合监控大屏</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> 责任护士: 李雪、张峰</span>
              <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> 开放床位: {floorBeds.length}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 在院: {floorBeds.filter(b => b.status === 'occupied').length}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex items-center gap-4">
          <button 
             onClick={() => setIsFullscreen(!isFullscreen)}
             className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 transition-colors text-slate-600"
          >
             {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
             <span className="font-bold">{isFullscreen ? '退出大屏' : '投射大屏'}</span>
          </button>
          <button 
             onClick={() => setShowShiftReport(true)}
             className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-200 transition-colors text-emerald-700"
          >
             <Clock className="w-5 h-5 text-emerald-600" />
             <span className="text-sm font-bold">班次服务报告</span>
          </button>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Volume2 className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-bold text-slate-600">语音播报开启</span>
          </div>
          <div>
            <div className="text-4xl font-black font-mono tracking-tight text-slate-800 drop-shadow-sm">
              {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 text-right">
              {currentTime.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Column: Tasks */}
        <div className="w-[380px] flex flex-col gap-6 shrink-0 h-full">
          
          {/* On-Duty Staff */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 shrink-0">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Users className="w-4 h-4 text-indigo-500" />
                   当班护理小组
                </h3>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">A栋 · 早班</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                   {staff.filter(s => s.id === 'EMP-002' || s.id === 'EMP-001').map((s, idx) => (
                     <img key={s.id} src={s.avatar} alt={s.name} className={`w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover relative z-${10 - idx}0`} />
                   ))}
                </div>
                <div>
                   <div className="text-sm font-bold text-slate-800">{staff.find(s=>s.id==='EMP-002')?.name} (组长), {staff.find(s=>s.id==='EMP-001')?.name}</div>
                   <div className="text-xs text-slate-500 mt-0.5">负责当前楼层任务及呼叫响应</div>
                </div>
             </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col shadow-lg flex-1 min-h-0">
            <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-bold text-slate-800">今日待办护理计划</h2>
              </div>
              <div className="text-sm text-blue-700 font-bold bg-blue-100/50 px-3 py-1 rounded-full border border-blue-200">
                {pendingTasks.filter(t => t.status === 'pending').length} 项待执行
              </div>
            </div>
            <div className="p-4 overflow-y-auto hidden-scrollbar space-y-2">
              {pendingTasks.map(task => (
                <div key={task.id} className={`flex items-stretch gap-3 p-3 rounded-xl border ${task.status === 'completed' ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'}`}>
                  <div className="flex flex-col items-center justify-center min-w-[50px] shrink-0 border-r border-slate-100 pr-3">
                    <div className={`text-lg font-black font-mono ${task.status === 'completed' ? 'text-slate-400' : 'text-blue-600'}`}>{task.time.split(':')[0]}</div>
                    <div className={`text-xs font-bold ${task.status === 'completed' ? 'text-slate-400' : 'text-blue-500'}`}>{task.time.split(':')[1]}</div>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className={`font-bold text-sm truncate ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {task.task}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1 truncate">
                      <span className="text-slate-600 font-medium z-10">{task.bed} <ElderLink id="1" text={task.elder} /></span>
                      <span>·</span>
                      <span>{task.assigned}</span>
                    </div>
                  </div>
                  <div className="flex items-center shrink-0">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
                    ) : (
                      <button 
                         onClick={() => {
                           setHandlingTask(task);
                           setTaskNotes('');
                         }}
                         className="w-8 h-8 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-400 hover:shadow-sm flex items-center justify-center transition-all group"
                      >
                        <CheckCircle2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>



        </div>

        {/* Right Column: Room & Bed Status Array */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col min-h-0 shadow-lg overflow-y-auto hidden-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              楼层床位实时监控
            </h2>
            <div className="flex gap-4 text-sm font-medium">
               <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>正常入住</div>
               <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>长者请假</div>
               <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></div>告警中</div>
               <div className="flex items-center gap-2 text-slate-600"><div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>空床</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {floorBeds.map(bed => {
              const bedElder = elders.find(e => e.id === bed.elderId);
              const bedAlert = activeAlerts.find(a => a.bed === bed.id);
              const isLeave = (bedElder as any)?.status === '外出请假'; // Mock stat for UI
              const bedVitals = vitalsData[bed.id];
              
              let statusBg = "bg-slate-50 border-slate-200 shadow-sm";
              let statusDot = "bg-slate-300";
              
              if (bedAlert) {
                statusBg = bedAlert.level === 'critical' ? "bg-rose-50 border-rose-300 shadow-md shadow-rose-100" : "bg-amber-50 border-amber-300 shadow-md shadow-amber-100";
                statusDot = bedAlert.level === 'critical' ? "bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" : "bg-amber-500";
              } else if (bed.status === 'occupied') {
                statusBg = "bg-white border-blue-100 hover:border-blue-300 shadow-sm hover:shadow-md";
                statusDot = "bg-emerald-500";
              }

              return (
                <div 
                  key={bed.id} 
                  className={`p-4 rounded-2xl border transition-all ${statusBg} flex flex-col ${bedElder ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0' : ''}`}
                  onClick={() => {
                     if (bedElder) {
                       setSelectedVitalsPerson({ ...bedVitals, name: bedElder.name, room: `${bed.building}-${bed.id}`, device: "A105智能床垫", status: bedAlert ? 'abnormal' : 'normal' });
                       setHistoryData(generateHistoryData(historyRange));
                       setAnomalyAnalysis('');
                     }
                  }}
                >
                   <div className="flex justify-between items-start mb-3 border-b border-transparent pb-0">
                     <div className="flex items-center gap-2">
                       <div className="font-mono text-lg font-bold text-slate-800">{bed.id} <span className="text-xs text-slate-400 font-normal">床位</span></div>
                       <div className={`w-2 h-2 rounded-full ${statusDot}`}></div>
                     </div>
                     {bedAlert && (
                       <div className={`flex items-center gap-1.5 text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-sm border ${bedAlert.level === 'critical' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                         <Siren className={`w-3.5 h-3.5 ${bedAlert.level === 'critical' ? 'animate-pulse text-rose-500' : ''}`} />
                         {bedAlert.type === 'sos' ? '紧急呼叫' : bedAlert.type === 'fall' ? '跌倒警报' : '异常警报'}
                       </div>
                     )}
                     {bed.status === 'occupied' && !bedAlert && bedVitals && (
                        <div className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">监测正常</div>
                     )}
                   </div>
                   
                   {bed.status === 'occupied' && bedElder ? (
                     <div className="mt-auto flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                           <div>
                              <div className="font-black text-slate-900 text-lg mb-0.5">{bedElder.name} <span className="text-xs text-slate-500 font-medium ml-1 bg-slate-100 px-1.5 py-0.5 rounded">{bedElder.gender} · {bedElder.age}岁</span></div>
                              <div className="text-xs text-slate-500">
                                {bedElder.careLevel} · {bedElder.healthStatus || '一般'}
                              </div>
                           </div>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedBedId(bed.id); }}
                             className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600 overflow-hidden"
                             title="查看长者档案"
                           >
                              {bedElder.avatar ? <img src={bedElder.avatar} className="w-full h-full object-cover" alt={bedElder.name} /> : <User className="w-4 h-4" />}
                           </button>
                        </div>
                        
                        {bedAlert ? (
                           <div className={`mt-auto p-3 rounded-xl ${bedAlert.level === 'critical' ? 'bg-white border text-rose-700 border-rose-200 shadow-sm' : 'bg-white border text-amber-700 border-amber-200 shadow-sm'} animate-in slide-in-from-bottom-2`}>
                             <div className="flex items-center gap-2 mb-2">
                                {getAlertIcon(bedAlert.type, "w-5 h-5 shrink-0")}
                                <div className="font-bold text-sm tracking-tight">{bedAlert.desc}</div>
                             </div>
                             <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                               <span className="text-xs opacity-70 font-medium">{bedAlert.time}</span>
                               <button className={`px-4 py-1.5 rounded-lg text-xs font-bold ${bedAlert.level === 'critical' ? 'bg-rose-600 text-white shadow-sm hover:bg-rose-500' : 'bg-amber-500 text-white hover:bg-amber-600'}`} onClick={(e) => { 
                                 e.stopPropagation(); 
                                 setHandlingAlert(bedAlert);
                                 setHandleNotes('');
                               }}>
                                 立即处理
                               </button>
                             </div>
                           </div>
                        ) : bedVitals ? (
                          <div className="mt-auto bg-slate-50 border border-slate-100 rounded-xl flex overflow-hidden divide-x divide-slate-100 pointer-events-none">
                             <div className="flex-1 p-2 flex flex-col items-center justify-center relative bg-white">
                                <span className="text-[10px] text-slate-400 font-bold mb-0.5">心率 (bpm)</span>
                                <div className="flex items-end gap-1">
                                  <span className={`text-xl font-black ${bedVitals.hr > 100 || bedVitals.hr < 60 ? 'text-rose-600' : 'text-slate-800'}`}>{bedVitals.hr}</span>
                                </div>
                             </div>
                             <div className="flex-1 p-2 flex flex-col items-center justify-center relative bg-white">
                                <span className="text-[10px] text-slate-400 font-bold mb-0.5">呼吸率 (次)</span>
                                <div className="flex items-end gap-1">
                                  <span className={`text-xl font-black ${bedVitals.rr > 22 || bedVitals.rr < 12 ? 'text-amber-500' : 'text-slate-800'}`}>{bedVitals.rr}</span>
                                </div>
                             </div>
                             <div className="flex-1 p-2 flex flex-col items-center justify-center relative bg-white col-span-2">
                                <span className="text-[10px] text-slate-400 font-bold mb-0.5">血压 (mmHg)</span>
                                <div className="flex items-end">
                                  <span className={`text-sm font-black`}>{bedVitals.bpSys}</span>
                                  <span className="text-[10px] font-bold text-slate-400 mx-0.5">/</span>
                                  <span className={`text-sm font-black text-slate-600`}>{bedVitals.bpDia}</span>
                                </div>
                             </div>
                          </div>
                        ) : null}
                     </div>
                   ) : (
                     <div className="mt-auto flex flex-col items-center justify-center flex-1 py-4">
                        <BedDouble className="w-8 h-8 text-slate-200 mb-2" />
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{bed.status === 'maintenance' ? '设施维修中' : '空闲暂无长者'}</div>
                     </div>
                   )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Top Level History Modal */}
      {selectedVitalsPerson && (
        <div className="fixed inset-0 bg-slate-900/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  {selectedVitalsPerson.name} 的生命体征曲线
                </h3>
                <span className="text-sm border border-slate-200 px-2 py-0.5 rounded-full bg-slate-50 text-slate-600">
                  {selectedVitalsPerson.room}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white ${selectedVitalsPerson.status === 'normal' ? 'bg-emerald-500' : selectedVitalsPerson.status === 'warning' ? 'bg-amber-500' : selectedVitalsPerson.status === 'abnormal' ? 'bg-rose-600' : 'bg-slate-400'}`}>
                  {selectedVitalsPerson.status === 'normal' ? '正常' : selectedVitalsPerson.status === 'warning' ? '预警' : selectedVitalsPerson.status === 'abnormal' ? '告警' : '未知'}
                </span>
              </div>
              <button onClick={() => setSelectedVitalsPerson(null)} className="text-slate-400 text-xl hover:text-slate-600 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 min-h-0">
              <div className="flex justify-between items-center mb-6">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                  <button 
                    onClick={() => { setHistoryRange('day'); setHistoryData(generateHistoryData('day')); setAnomalyAnalysis(''); }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${historyRange === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >日曲线</button>
                  <button 
                    onClick={() => { setHistoryRange('week'); setHistoryData(generateHistoryData('week')); setAnomalyAnalysis(''); }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${historyRange === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >周趋势</button>
                  <button 
                    onClick={() => { setHistoryRange('month'); setHistoryData(generateHistoryData('month')); setAnomalyAnalysis(''); }}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${historyRange === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >月报表</button>
                </div>
                
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <button 
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors font-medium border border-indigo-200 shadow-sm"
                  >
                    {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    AI异动早筛
                  </button>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> 设备: A105智能床垫</span>
                </div>
              </div>

              {anomalyAnalysis && (
                <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <h4 className="flex items-center gap-2 text-indigo-800 font-bold mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    AI 异动分析报告
                  </h4>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {anomalyAnalysis}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {/* Heart Rate Chart */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    心率走势 (Heart Rate)
                  </h4>
                  <div className="h-[200px] w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="hrColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="hr" name="心率(bpm)" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#hrColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Respiration Chart */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    呼吸率走势 (Respiration Rate)
                  </h4>
                  <div className="h-[200px] w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="rrColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="rr" name="呼吸率(次/分)" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#rrColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Blood Pressure Chart */}
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    血压走势 (Blood Pressure)
                  </h4>
                  <div className="h-[200px] w-full border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={historyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="bpSysColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="bpDiaColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip />
                        <Area type="monotone" dataKey="bpSys" name="收缩压(高压)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#bpSysColor)" />
                        <Area type="monotone" dataKey="bpDia" name="舒张压(低压)" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#bpDiaColor)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Elder Info Modal */}
      {selectedBedId && (() => {
        const bed = floorBeds.find(b => b.id === selectedBedId);
        const elder = elders.find(e => e.id === bed?.elderId);
        if (!bed || !elder) return null;

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBedId(null)}>
            <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" /> 长者基础档案
                </h3>
                <button onClick={() => setSelectedBedId(null)} className="p-2 text-slate-500 hover:text-slate-700 bg-white shadow-sm border border-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg overflow-hidden shrink-0">
                    {elder.avatar ? <img src={elder.avatar} className="w-full h-full object-cover" alt={elder.name} /> : elder.name[0]}
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-900 tracking-wider">{elder.name} <span className="text-lg text-slate-500 font-normal ml-2">{elder.gender} · {elder.age}岁</span></div>
                    <div className="mt-2 flex gap-2">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-200">{bed.id} 床位</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-200">{elder.careLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-slate-500 text-sm font-medium mb-1">健康状态</div>
                    <div className="text-slate-800 font-bold">{elder.healthStatus || '一般'}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-slate-500 text-sm font-medium mb-1">入院时间</div>
                    <div className="text-slate-800 font-bold">{elder.admissionDate || '2023-01-01'}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 col-span-2 flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-slate-500 text-xs font-medium">紧急联系人</div>
                      <div className="text-slate-800 font-bold">{(elder as any).contact || '家属 13800138000'}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      近期护理及报警处理记录
                    </h4>
                    <button 
                      onClick={() => {
                        setIsAddingRecord(true);
                        setAddingFromElder({ bed, elder });
                        setNewRecordContent('');
                        setNewRecordResult('');
                        setSelectedBedId(null); // or we could keep it open underneath
                      }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors shadow-sm border border-blue-200"
                    >
                      + 临时护理记录
                    </button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto hidden-scrollbar pr-2">
                    {careRecords.filter(r => r.elderId === elder.id).length === 0 ? (
                       <div className="text-center py-6 text-slate-400 text-sm">暂无近期记录</div>
                    ) : (
                      careRecords.filter(r => r.elderId === elder.id).map(record => (
                        <div key={record.id} className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                              {record.type === 'alert_resolve' ? <Siren className="w-3.5 h-3.5 text-rose-500" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                              {record.content}
                            </div>
                            <div className="text-xs text-slate-400 font-medium">{record.time.split(' ')[1] || record.time}</div>
                          </div>
                          <div className="text-xs text-slate-600 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            {record.result}
                          </div>
                          <div className="flex justify-between items-center text-[11px] text-slate-400">
                            <span>记录人: <span className="text-slate-600 font-medium">{record.caregiver}</span></span>
                            <span>{record.time.split(' ')[0]}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* Task Handling Modal */}
      {handlingTask && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-4 border-b flex items-center justify-between bg-blue-50 border-blue-100`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 text-blue-700`}>
                <CheckCircle2 className="w-5 h-5" />
                完成护理任务
              </h3>
              <button onClick={() => setHandlingTask(null)} className="p-1.5 text-slate-400 hover:text-slate-600 bg-white rounded-full transition-colors border border-slate-200 shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">任务内容</span>
                   <span className="font-bold text-slate-800">{handlingTask.task}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">服务对象</span>
                   <span className="font-bold text-slate-800">{handlingTask.bed} · {handlingTask.elder}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">计划时间</span>
                   <span className="font-bold text-slate-800">{handlingTask.time}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">服务内容/结果记录</label>
                  <textarea 
                    rows={3} 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-none"
                    placeholder="请输入服务详情、老人状态或异常情况..."
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-2">
                   <button 
                     onClick={() => setHandlingTask(null)} 
                     className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                   >
                     取消
                   </button>
                   <button 
                     onClick={() => {
                       updateTaskStatus(handlingTask.id, 'completed');
                       const bedItem = beds.find(b => b.id === handlingTask.bed) || beds.find(b => b.elderId && elders.find(e => e.id === b.elderId && e.name === handlingTask.elder));
                       const elderItem = elders.find(e => e.name === handlingTask.elder);
                       addCareRecord({
                         id: `REC-${Date.now()}`,
                         time: new Date().toLocaleString('zh-CN'),
                         type: 'planned_task',
                         content: handlingTask.task,
                         result: taskNotes || '已完成',
                         elderId: elderItem?.id || '',
                         elderName: handlingTask.elder,
                         caregiver: '李雪' // Mock current user
                       });
                       setHandlingTask(null);
                     }} 
                     className="flex-1 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-500 transition-all active:scale-[0.98]"
                   >
                     保存记录
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Handling Modal */}
      {handlingAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-4 border-b flex items-center justify-between ${handlingAlert.level === 'critical' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${handlingAlert.level === 'critical' ? 'text-rose-700' : 'text-amber-700'}`}>
                {getAlertIcon(handlingAlert.type, "w-5 h-5")} 
                处理报警事件
              </h3>
              <button onClick={() => setHandlingAlert(null)} className="p-1.5 text-slate-400 hover:text-slate-600 bg-white rounded-full transition-colors border border-slate-200 shadow-sm">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">报警类型</span>
                   <span className="font-bold text-slate-800">{handlingAlert.desc}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">关联对象</span>
                   <span className="font-bold text-slate-800">{handlingAlert.bed} · {handlingAlert.elder}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">发生时间</span>
                   <span className="font-bold text-slate-800">{handlingAlert.time}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">处理记录 / 原因反馈</label>
                  <textarea 
                    rows={3} 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-none"
                    placeholder="请输入现场处理情况，如：长者不慎按到，长者已安全等..."
                    value={handleNotes}
                    onChange={(e) => setHandleNotes(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-2">
                   <button 
                     onClick={() => setHandlingAlert(null)} 
                     className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                   >
                     取消
                   </button>
                   <button 
                     onClick={() => {
                       resolveAlert(handlingAlert.id, handleNotes, '护理站护士: 李雪');
                       setHandlingAlert(null);
                     }} 
                     className="flex-1 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-500 transition-all active:scale-[0.98]"
                   >
                     保存并结束报警
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Manual Record Modal */}
      {isAddingRecord && addingFromElder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-4 border-b flex items-center justify-between bg-blue-50 border-blue-100`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 text-blue-700`}>
                <Activity className="w-5 h-5" />
                新增临时护理记录
              </h3>
              <button 
                onClick={() => {
                   setIsAddingRecord(false);
                   setAddingFromElder(null);
                }} 
                className="p-1.5 text-slate-400 hover:text-slate-600 bg-white rounded-full transition-colors border border-slate-200 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 text-sm flex flex-col gap-2">
                <div className="flex items-center justify-between">
                   <span className="text-slate-500">服务对象</span>
                   <span className="font-bold text-slate-800">{addingFromElder.bed.id}床 · {addingFromElder.elder.name}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 block">服务内容 (必填)</label>
                  <input 
                    type="text"
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    placeholder="如：协助上厕所、修剪指甲、沟通安抚..."
                    value={newRecordContent}
                    onChange={(e) => setNewRecordContent(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 block">护理结果 / 详情备注</label>
                  <textarea 
                    rows={3} 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-none"
                    placeholder="请输入现场详情等..."
                    value={newRecordResult}
                    onChange={(e) => setNewRecordResult(e.target.value)}
                  ></textarea>
                </div>
                
                <div className="flex gap-3 pt-2">
                   <button 
                     onClick={() => {
                       setIsAddingRecord(false);
                       setAddingFromElder(null);
                     }} 
                     className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                   >
                     取消
                   </button>
                   <button 
                     disabled={!newRecordContent.trim()}
                     onClick={() => {
                       addCareRecord({
                         id: `REC-${Date.now()}`,
                         time: new Date().toLocaleString('zh-CN'),
                         type: 'temporary_care',
                         content: newRecordContent,
                         result: newRecordResult || '无备注',
                         elderId: addingFromElder.elder.id,
                         elderName: addingFromElder.elder.name,
                         caregiver: '李雪' // Mock current user
                       });
                       setIsAddingRecord(false);
                       setAddingFromElder(null);
                     }} 
                     className="flex-1 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white shadow-sm shadow-blue-200 hover:bg-blue-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                   >
                     确认记录
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shift Report Modal */}
      {showShiftReport && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className={`p-5 flex items-center justify-between border-b border-slate-100`}>
              <div>
                <h3 className={`text-xl font-bold flex items-center gap-2 text-slate-800`}>
                  <Clock className="w-6 h-6 text-emerald-500" />
                  本班次服务报告 / 汇总大屏
                </h3>
                <div className="text-sm text-slate-500 mt-1 flex items-center gap-4">
                   <span>当班人员: 李雪, 张峰</span>
                   <span>班次: 白班 (08:00 - 18:00)</span>
                </div>
              </div>
              <button 
                onClick={() => setShowShiftReport(false)} 
                className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors border border-slate-200 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto hidden-scrollbar flex-1 bg-slate-50">
              <div className="grid grid-cols-3 gap-4 mb-6">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500"/> 完成计划任务</div>
                   <div className="text-3xl font-black text-slate-800">{careRecords.filter(r => r.type === 'planned_task').length}</div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1.5"><Siren className="w-4 h-4 text-rose-500" /> 响应告警处理</div>
                   <div className="text-3xl font-black text-slate-800">{careRecords.filter(r => r.type === 'alert_resolve').length}</div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-500" /> 补充临时记录</div>
                   <div className="text-3xl font-black text-slate-800">{careRecords.filter(r => r.type === 'temporary_care').length}</div>
                 </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">时间</th>
                      <th className="px-4 py-3 font-medium">服务类型</th>
                      <th className="px-4 py-3 font-medium">服务对象</th>
                      <th className="px-4 py-3 font-medium">项目 / 详情</th>
                      <th className="px-4 py-3 font-medium">执行人</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {careRecords.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">本班次暂无记录</td>
                      </tr>
                    ) : (
                      careRecords.map(record => (
                        <tr key={record.id} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-mono text-xs">{record.time.split(' ')[1] || record.time}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              record.type === 'planned_task' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                              record.type === 'alert_resolve' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {record.type === 'planned_task' ? '计划任务' : record.type === 'alert_resolve' ? '告警处理' : '临时护理'}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium">{record.elderName}</td>
                          <td className="px-4 py-3">
                            <div className="font-bold">{record.content}</div>
                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">{record.result}</div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{record.caregiver}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-white">
               <button className="px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm border border-blue-200 shadow-sm hover:bg-blue-100 transition-colors">
                  导出报告为Excel
               </button>
               <button 
                 onClick={() => setShowShiftReport(false)} 
                 className="px-5 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-slate-700 transition-colors"
               >
                 关闭窗口
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

