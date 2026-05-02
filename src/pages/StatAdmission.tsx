import { Card, CardContent, CardHeader } from "../components/ui/card";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, TrendingDown, Home } from "lucide-react";

export function StatAdmission() {
  const flowData = [
    { name: '10月', 入住: 12, 退住: 4 },
    { name: '11月', 入住: 15, 退住: 5 },
    { name: '12月', 入住: 18, 退住: 8 },
    { name: '1月', 入住: 22, 退住: 6 },
    { name: '2月', 入住: 15, 退住: 3 },
    { name: '3月', 入住: 25, 退住: 7 },
  ];

  const ageData = [
    { name: '60-70岁', value: 45 },
    { name: '71-80岁', value: 85 },
    { name: '81-90岁', value: 120 },
    { name: '90岁以上', value: 30 },
  ];
  const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171'];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">长者入住及流转分析</h2>
          <p className="text-slate-500 text-sm mt-1">分析长者入住趋势、床位周转率及年龄结构分布</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">在院长者</p>
                <h3 className="text-xl font-bold text-slate-800">280 <span className="text-xs font-normal text-slate-500">人</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月新入住</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-bold text-slate-800">25</h3>
                  <span className="text-xs text-emerald-500 font-medium">+15%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月退住</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-bold text-slate-800">7</h3>
                  <span className="text-xs text-slate-500 font-medium">环比持平</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <Home className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">床位使用率</p>
                <h3 className="text-xl font-bold text-slate-800">86.4%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">近半年入住与退住趋势</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="入住" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIn)" />
                <Area type="monotone" dataKey="退住" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorOut)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardHeader className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">长者年龄段分布</h3>
          </CardHeader>
          <CardContent className="p-4 pt-6 h-80 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {ageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col min-h-[300px]">
        <CardHeader className="pb-3 border-b border-slate-100 bg-white z-10 shrink-0">
           <h3 className="font-bold text-slate-800">近期流转明细</h3>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">长者姓名</th>
                <th className="px-6 py-4 font-medium">业务类型</th>
                <th className="px-6 py-4 font-medium">发生日期</th>
                <th className="px-6 py-4 font-medium">床位号</th>
                <th className="px-6 py-4 font-medium">办理人</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
               {[1,2,3,4,5].map((item) => (
                  <tr key={item} className="hover:bg-slate-50/50 transition">
                     <td className="px-6 py-4 font-bold text-slate-800">{['王文远', '李国强', '张桂兰', '陈建国', '刘玉英'][item-1]}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${item % 2 === 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                           {item % 2 === 0 ? '退住出院' : '新入住建档'}
                        </span>
                     </td>
                     <td className="px-6 py-4 font-mono">2026-04-[2{item}]</td>
                     <td className="px-6 py-4 font-mono">{item % 2 === 0 ? '-' : `A1-${item}0${item}`}</td>
                     <td className="px-6 py-4 text-slate-500">张明宇</td>
                  </tr>
               ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
