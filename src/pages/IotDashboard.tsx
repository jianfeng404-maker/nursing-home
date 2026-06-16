import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Activity, Cpu, Router, Wifi, WifiOff, AlertTriangle, ArrowUpRight, ArrowDownRight, Server, Zap } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts";
import { useStore } from "../store";

const trafficData = [
  { time: "00:00", value: 120 },
  { time: "02:00", value: 110 },
  { time: "04:00", value: 90 },
  { time: "06:00", value: 150 },
  { time: "08:00", value: 450 },
  { time: "10:00", value: 580 },
  { time: "12:00", value: 520 },
  { time: "14:00", value: 540 },
  { time: "16:00", value: 490 },
  { time: "18:00", value: 680 },
  { time: "20:00", value: 720 },
  { time: "22:00", value: 410 },
  { time: "24:00", value: 150 },
];

const categoryData = [
  { name: "智能床垫", value: 45, color: "#3b82f6" },
  { name: "防跌倒雷达", value: 30, color: "#10b981" },
  { name: "健康腕表", value: 85, color: "#8b5cf6" },
  { name: "呼叫器", value: 120, color: "#f59e0b" },
];

export function IotDashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const iotDevices = useStore(state => state.iotDevices);
  
  const onlineCount = iotDevices.filter(d => d.status === '在线').length;
  const offlineCount = iotDevices.filter(d => d.status === '离线').length;
  const totalCount = iotDevices.length;
  
  // Fake chart animation
  const [data, setData] = useState(trafficData);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const last = newData[newData.length - 1];
        const newValue = Math.max(50, last.value + (Math.random() * 60 - 30));
        newData.push({ time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), value: Math.floor(newValue) });
        newData.shift();
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in fade-in pb-8 h-full overflow-auto">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">物联设备运行大盘</h2>
          <p className="text-slate-500 text-sm mt-1">集中看板呈现各类健康体征设备、雷达传感器的在线与数据流入量状态</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={() => setActiveTab('command_center')}
             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
             <Zap className="w-4 h-4" />
             进入全景大屏
          </button>
          <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm text-sm">
            <div className="px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium">MQTT Gateway: 运行中</span>
            </div>
            <div className="w-px h-4 bg-slate-200"></div>
            <div className="px-3 py-1 text-slate-500">
              Node: ws-cn-east-01
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">接入设备总数</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{totalCount}</h3>
                <span className="text-xs text-emerald-500 flex items-center font-medium"><ArrowUpRight className="w-3 h-3"/> 12%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Wifi className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">当前在线</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{onlineCount}</h3>
                <span className="text-xs text-slate-500 font-medium">({Math.round(onlineCount/totalCount*100 || 0)}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
              <WifiOff className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">离线异常</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-800">{offlineCount}</h3>
                <span className="text-xs text-rose-500 flex items-center font-medium"><ArrowUpRight className="w-3 h-3"/> {Math.max(2, offlineCount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">今日流转消息数</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-slate-800">42.5k</h3>
                <span className="text-xs text-emerald-500 flex items-center font-medium"><ArrowUpRight className="w-3 h-3"/> 5.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  实时遥测数据吞吐量 (Msg/Min)
                </CardTitle>
                <CardDescription>最近24小时上行数据流监控</CardDescription>
              </div>
              <div className="flex gap-2">
                <span className="text-xs border border-slate-200 px-2 py-1 rounded bg-slate-50 text-slate-600 font-medium">1小时</span>
                <span className="text-xs border border-blue-200 px-2 py-1 rounded bg-blue-50 text-blue-700 font-medium">24小时</span>
                <span className="text-xs border border-slate-200 px-2 py-1 rounded bg-slate-50 text-slate-600 font-medium">7天</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              接入设备品类分布
            </CardTitle>
            <CardDescription>当前物网关承载实例的品类占比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-y-3 mt-4 px-2">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 flex-1">{item.name}</span>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tables for logs or offline devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <Card className="shadow-sm border-slate-200">
           <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
             <div className="flex justify-between items-center">
               <CardTitle className="text-base font-bold text-slate-800">最新离线异常设备</CardTitle>
               <button className="text-sm font-medium text-blue-600 hover:underline">查看全部</button>
             </div>
           </CardHeader>
           <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
               {iotDevices.filter(d => d.status === '离线').slice(0, 5).map(device => (
                 <div key={device.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded bg-rose-50 flex items-center justify-center text-rose-600">
                       <WifiOff className="w-5 h-5"/>
                     </div>
                     <div>
                       <div className="font-medium text-slate-800 text-sm">{device.name} <span className="text-slate-400 text-xs ml-1">({device.sn})</span></div>
                       <div className="text-xs text-slate-500 mt-0.5">{device.catalog} · 绑定至 {device.bindTarget}</div>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="text-xs font-bold text-rose-600 mb-0.5">离线警告</div>
                     <div className="text-xs text-slate-500">最后活跃: {device.lastActive}</div>
                   </div>
                 </div>
               ))}
               {iotDevices.filter(d => d.status === '离线').length === 0 && (
                 <div className="p-8 text-center text-slate-500 text-sm">
                   暂无离线设备，网络连接良好
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

         <Card className="shadow-sm border-slate-200">
           <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
             <div className="flex justify-between items-center">
               <CardTitle className="text-base font-bold text-slate-800">报警触发日志 (最近2小时)</CardTitle>
               <button className="text-sm font-medium text-blue-600 hover:underline">查看全部</button>
             </div>
           </CardHeader>
           <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
                <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-rose-500 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-slate-800 text-sm"><span className="text-rose-600 font-bold mr-1">[危急]</span>长时间未出现生命体征</div>
                      <div className="text-xs text-slate-500">10分钟前</div>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded truncate mt-1">
                      发生源: 李大爷 (A栋201) - 毫米波雷达 (SN: MM-8021) 
                    </div>
                  </div>
                </div>
                
                <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-slate-800 text-sm"><span className="text-amber-600 font-bold mr-1">[紧急]</span>心率过高预警</div>
                      <div className="text-xs text-slate-500">45分钟前</div>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded truncate mt-1">
                      发生源: 张阿姨 (B栋305) - 智能手环 (SN: HW-092) - 当前值: 115 bpm
                    </div>
                  </div>
                </div>

                <div className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500 shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-slate-800 text-sm"><span className="text-amber-600 font-bold mr-1">[紧急]</span>夜间异常离床时间过长</div>
                      <div className="text-xs text-slate-500">1.2小时前</div>
                    </div>
                    <div className="text-xs text-slate-500 bg-slate-100 p-2 rounded truncate mt-1">
                      发生源: 王桂英 (A栋102) - 智能床垫 (SN: BM-110) - 离床超过 20 分钟
                    </div>
                  </div>
                </div>
             </div>
           </CardContent>
         </Card>
      </div>

    </div>
  );
}
