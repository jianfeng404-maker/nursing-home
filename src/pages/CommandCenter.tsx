import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { Activity, ShieldAlert, Cpu, Users, Layers, Zap, WifiOff, Thermometer, Droplets, BatteryCharging, ArrowLeft } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// CSS Isometric Floor Plan
const FloorPlan = () => {
    const { rooms } = useStore();
    return (
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center overflow-hidden bg-slate-900 rounded-xl border border-slate-800" style={{ perspective: '1200px' }}>
             <motion.div 
               className="relative grid grid-cols-4 gap-4 p-8 bg-slate-800/40 rounded-3xl border border-slate-700/50 shadow-2xl shadow-blue-900/20"
               initial={{ rotateX: 60, rotateZ: -45, scale: 0.8, y: 50 }}
               animate={{ rotateX: 55, rotateZ: -40, scale: 0.9, y: 0 }}
               transition={{ duration: 1.5, type: 'spring' }}
               style={{ transformStyle: 'preserve-3d' }}
             >
                {rooms.map((room, i) => {
                   const isAlert = i === 1 || i === 4; 
                   return (
                     <motion.div 
                         key={room.id}
                         className={`w-32 h-32 rounded-xl border relative shadow-xl backdrop-blur-md flex flex-col items-center justify-center transition-all ${isAlert ? 'bg-rose-500/20 border-rose-500/50' : 'bg-slate-700/40 border-slate-600/50 hover:bg-slate-600/50'}`}
                         style={{ transformStyle: 'preserve-3d' }}
                         whileHover={{ translateZ: 20 }}
                     >
                         <span className="font-bold text-white text-lg">{room.roomNo}</span>
                         {isAlert && (
                           <motion.div 
                             className="absolute -top-4 -right-4 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.8)]"
                             animate={{ scale: [1, 1.2, 1] }} 
                             transition={{ repeat: Infinity, duration: 1 }}
                           >
                              <ShieldAlert className="w-4 h-4 text-white" />
                           </motion.div>
                         )}
                         <div className="absolute bottom-2 flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                         </div>
                     </motion.div>
                   )
                })}
             </motion.div>
        </div>
    );
};

export function CommandCenter({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    const { iotDevices, alerts, sysUsers } = useStore();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const activityData = [
        { time: '08:00', value: 120 }, { time: '10:00', value: 210 },
        { time: '12:00', value: 180 }, { time: '14:00', value: 290 },
        { time: '16:00', value: 250 }, { time: '18:00', value: 320 },
        { time: '20:00', value: 190 },
    ];
    
    const deviceStatusData = [
        { name: '在线', value: iotDevices.filter(d => d.status === '在线').length, color: '#34d399' },
        { name: '离线', value: iotDevices.filter(d => d.status === '离线').length, color: '#f43f5e' },
        { name: '告警', value: 2, color: '#fbbf24' }
    ];

    return (
        <div className="h-full bg-slate-950 text-slate-200 overflow-hidden font-mono selection:bg-blue-500/30 flex flex-col">
           {/* Top Navigation */}
           <header className="flex items-center justify-between px-8 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl shrink-0 h-[80px]">
               <div className="flex items-center gap-6">
                   <button 
                       onClick={() => setActiveTab('overview')} 
                       className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                   >
                       <ArrowLeft className="w-5 h-5" />
                   </button>
                   <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                          <Cpu className="w-5 h-5 text-white" />
                       </div>
                       <div>
                           <h1 className="text-xl font-bold text-white tracking-widest">智能颐养 实时监控大屏</h1>
                           <p className="text-xs text-blue-400 uppercase opacity-80 tracking-[0.2em] mt-1">hardware operation center</p>
                       </div>
                   </div>
               </div>
               <div className="flex flex-col items-end">
                   <div className="text-2xl font-bold tracking-widest text-emerald-400 shadow-emerald-400/50 drop-shadow-md">
                       {time.toLocaleTimeString('zh-CN', { hour12: false })}
                   </div>
                   <div className="text-sm text-slate-400 tracking-wider">
                       {time.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                   </div>
               </div>
           </header>

           <main className="p-6 grid grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
               {/* Left Column */}
               <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
                   {/* Summary Cards */}
                   <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                           <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
                           <span className="text-slate-400 text-sm font-medium mb-1">活跃设备数</span>
                           <span className="text-3xl font-bold text-blue-400">{iotDevices.length}</span>
                       </div>
                       <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                           <div className="absolute -right-4 -top-4 w-16 h-16 bg-rose-500/10 rounded-full blur-xl"></div>
                           <span className="text-slate-400 text-sm font-medium mb-1">今日预警</span>
                           <span className="text-3xl font-bold text-rose-400">{alerts.length}</span>
                       </div>
                   </div>

                   {/* Data Chart */}
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col">
                       <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                           <Activity className="w-4 h-4 text-blue-400" />
                           实时生命体征网络吞吐
                       </h3>
                       <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} />
                                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                       </div>
                   </div>

                   {/* Device Status */}
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col">
                       <h3 className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                           <Layers className="w-4 h-4 text-emerald-400" />
                           节点连接状态
                       </h3>
                       <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={deviceStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {deviceStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-2xl font-bold text-white">{98}%</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest">在线率</span>
                            </div>
                       </div>
                   </div>
               </div>

               {/* Center 3D Floor Plan visualization */}
               <div className="col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col relative overflow-hidden h-full min-h-0">
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000000_1px,transparent_1px),linear-gradient(to_bottom,#818cf808_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                   <div className="flex justify-between items-center mb-4 z-10">
                       <h3 className="text-slate-200 font-bold flex items-center gap-2">
                           <Zap className="w-4 h-4 text-blue-400" />
                           实时空间孪生模型 // SPACE MAP
                       </h3>
                       <div className="px-3 py-1 bg-slate-800 rounded-full text-xs text-blue-400 border border-blue-900/50 flex items-center gap-2 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                           LIVE RENDERING
                       </div>
                   </div>

                   <FloorPlan />

                   <div className="absolute bottom-6 left-6 z-10 flex gap-4">
                       <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 p-3 rounded-xl flex items-center gap-3">
                           <Thermometer className="w-5 h-5 text-amber-500" />
                           <div>
                               <div className="text-xs text-slate-400">平均室温</div>
                               <div className="text-lg font-bold text-white">24.5°C</div>
                           </div>
                       </div>
                       <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 p-3 rounded-xl flex items-center gap-3">
                           <Droplets className="w-5 h-5 text-cyan-500" />
                           <div>
                               <div className="text-xs text-slate-400">平均湿度</div>
                               <div className="text-lg font-bold text-white">55%</div>
                           </div>
                       </div>
                   </div>
               </div>

               {/* Right Column */}
               <div className="col-span-3 flex flex-col gap-6 h-full min-h-0">
                   {/* Alarms Feed */}
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex-1 flex flex-col relative overflow-hidden min-h-0">
                       <div className="absolute pointer-events-none inset-x-0 top-0 h-2 bg-gradient-to-r from-rose-500 to-orange-500"></div>
                       <h3 className="text-slate-200 font-bold mb-4 flex items-center justify-between">
                           <span className="flex items-center gap-2">
                               <ShieldAlert className="w-4 h-4 text-rose-500" />
                               紧急硬件告警栈
                           </span>
                           <span className="text-[10px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20 animate-pulse">ACTIVE</span>
                       </h3>
                       
                       <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 overflow-x-hidden">
                           {alerts.slice(0, 5).map(alert => (
                               <motion.div 
                                  key={alert.id} 
                                  initial={{ x: 50, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:bg-slate-800 transition-colors"
                               >
                                  <div className="flex justify-between items-start mb-1">
                                      <span className="text-sm font-bold text-rose-400">{alert.title}</span>
                                      <span className="text-[10px] text-slate-400">{alert.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-300 mt-1 mb-2">{alert.resident} - {alert.location}</p>
                                  <div className="flex justify-between items-center text-[10px]">
                                      <span className="text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono">CODE: {alert.level}</span>
                                      <span className="text-slate-500">UID: {alert.id.split('-')[1]}</span>
                                  </div>
                               </motion.div>
                           ))}
                       </div>
                   </div>

                   {/* Terminal Style logs */}
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-[250px] flex flex-col font-mono">
                       <h3 className="text-slate-400 text-xs font-bold mb-3 uppercase tracking-widest border-b border-slate-800 pb-2">
                           System Stream
                       </h3>
                       <div className="flex-1 overflow-y-auto space-y-2 text-[10px] scrollbar-thin scrollbar-thumb-slate-700">
                           <div className="text-emerald-400">&gt; NODE_CONNECT: MM-8021 established</div>
                           <div className="text-slate-400">&gt; PING: Gateway A3 latency 12ms</div>
                           <div className="text-blue-400">&gt; SYNC: State synchronized at {time.toLocaleTimeString()}</div>
                           <div className="text-rose-400">&gt; WARN: Drop packet detected on sub-band C</div>
                           <div className="text-emerald-400">&gt; AUTH: System admin session validated</div>
                           <div className="text-slate-400">&gt; CACHE: Cleared 24MB telemetry data</div>
                           <div className="text-slate-400 animate-pulse">_</div>
                       </div>
                   </div>
               </div>
           </main>
        </div>
    );
}
