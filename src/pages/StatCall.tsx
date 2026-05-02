import { Card, CardContent, CardHeader } from "../components/ui/card";
import { AreaChart, Area, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PhoneCall, PhoneForwarded, PhoneMissed, Clock } from "lucide-react";

export function StatCall() {
  const hourlyData = [
    { time: '06:00', 接通数: 15, 漏接数: 2 },
    { time: '08:00', 接通数: 45, 漏接数: 5 },
    { time: '10:00', 接通数: 65, 漏接数: 8 },
    { time: '12:00', 接通数: 30, 漏接数: 1 },
    { time: '14:00', 接通数: 55, 漏接数: 6 },
    { time: '16:00', 接通数: 40, 漏接数: 4 },
    { time: '18:00', 接通数: 75, 漏接数: 12 },
    { time: '20:00', 接通数: 85, 漏接数: 15 },
    { time: '22:00', 接通数: 35, 漏接数: 3 },
  ];

  const trendData = [
    { date: '11/01', 总呼入: 320, 接通率: 95.5 },
    { date: '11/02', 总呼入: 345, 接通率: 92.1 },
    { date: '11/03', 总呼入: 290, 接通率: 97.4 },
    { date: '11/04', 总呼入: 410, 接通率: 88.5 },
    { date: '11/05', 总呼入: 380, 接通率: 91.2 },
    { date: '11/06', 总呼入: 305, 接通率: 98.0 },
    { date: '11/07', 总呼入: 285, 接通率: 99.1 },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">呼叫中心接通率统计</h2>
          <p className="text-slate-500 text-sm mt-1">分析长者呼出的接听效率、繁忙时段及整体服务响应情况</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">今日总呼入</p>
                <h3 className="text-xl font-bold text-slate-800">428 <span className="text-xs font-normal text-slate-500">次</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <PhoneForwarded className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">总体接通率</p>
                <h3 className="text-xl font-bold text-emerald-600">94.8%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                <PhoneMissed className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">漏接告警</p>
                <h3 className="text-xl font-bold text-rose-600">22 <span className="text-xs font-normal text-rose-500">次</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">最繁忙时段</p>
                <h3 className="text-xl font-bold text-slate-800">20:00 - 22:00</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1 min-h-[400px]">
        <Card className="border-none shadow-sm shadow-slate-200/50 flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">今日 24 小时呼叫量分布 (次)</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMissed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" name="接通数" dataKey="接通数" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCalls)" />
                <Area type="monotone" name="漏接数" dataKey="漏接数" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorMissed)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">近七日呼量与接通率趋势</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" name="总呼入 (次)" dataKey="总呼入" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Line yAxisId="right" name="接通率 (%)" type="monotone" dataKey="接通率" stroke="#10b981" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: "white" }} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
