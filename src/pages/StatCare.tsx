import { Card, CardContent, CardHeader } from "../components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Clock, CheckCircle2, Star } from "lucide-react";

export function StatCare() {
  const workloadData = [
    { name: '护理一部', 计划任务: 450, 实际完成: 430 },
    { name: '护理二部', 计划任务: 380, 实际完成: 365 },
    { name: '特级护理区', 计划任务: 520, 实际完成: 512 },
    { name: '医疗中心', 计划任务: 210, 实际完成: 205 },
  ];

  const responseTimeData = [
    { time: '08:00', 平均响应秒数: 45 },
    { time: '10:00', 平均响应秒数: 30 },
    { time: '12:00', 平均响应秒数: 65 },
    { time: '14:00', 平均响应秒数: 25 },
    { time: '16:00', 平均响应秒数: 35 },
    { time: '18:00', 平均响应秒数: 55 },
    { time: '20:00', 平均响应秒数: 40 },
    { time: '22:00', 平均响应秒数: 75 },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">护理工作量与响应统计</h2>
          <p className="text-slate-500 text-sm mt-1">统计各部门护理任务完成率、呼叫响应速度与服务评分</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">今日总任务量</p>
                <h3 className="text-xl font-bold text-slate-800">1,560 <span className="text-xs font-normal text-slate-500">项</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">平均完成率</p>
                <h3 className="text-xl font-bold text-emerald-600">96.8%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">平均呼叫响应</p>
                <h3 className="text-xl font-bold text-slate-800">42 <span className="text-xs font-normal text-slate-500">秒</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">平均服务满意度</p>
                <h3 className="text-xl font-bold text-indigo-600">4.92 <span className="text-xs font-normal text-slate-500">/ 5.0</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 flex-1 min-h-[400px]">
        <Card className="border-none shadow-sm shadow-slate-200/50 flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">各部门工作量对比 (今日)</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workloadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="计划任务" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="实际完成" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50 flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">24小时呼叫平均响应时间 (秒)</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="平均响应秒数" stroke="#f59e0b" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: "white" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
