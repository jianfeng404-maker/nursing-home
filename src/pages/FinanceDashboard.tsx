import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { CreditCard, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight, Wallet, Activity, ShieldAlert, Banknote, BarChart3, PieChart } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface FinanceDashboardProps {
  setActiveTab?: (tab: string) => void;
}

export function FinanceDashboard({ setActiveTab }: FinanceDashboardProps) {
  const [timeRange, setTimeRange] = useState('month');

  // 模拟数据
  const revenueTrend = [
    { name: '10月', 收入: 450000, 支出: 280000 },
    { name: '11月', 收入: 480000, 支出: 290000 },
    { name: '12月', 收入: 520000, 支出: 310000 },
    { name: '1月', 收入: 500000, 支出: 300000 },
    { name: '2月', 收入: 490000, 支出: 270000 },
    { name: '3月', 收入: 550000, 支出: 320000 },
    { name: '4月(预)', 收入: 580000, 支出: 330000 },
  ];

  const revenueComposition = [
    { name: '床位费', value: 240000 },
    { name: '照护费', value: 180000 },
    { name: '餐饮费', value: 90000 },
    { name: '医疗及康复', value: 45000 },
    { name: '其他杂费', value: 25000 },
  ];

  const expenseComposition = [
    { name: '人力薪酬', value: 160000 },
    { name: '餐饮食材', value: 65000 },
    { name: '耗材与用具', value: 45000 },
    { name: '水电物业', value: 35000 },
    { name: '营销与其他', value: 25000 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const EXPENSE_COLORS = ['#f43f5e', '#ef4444', '#f97316', '#eab308', '#64748b'];

  const pendingBills = [
    { id: 'BILL-001', elder: '王大山', type: '月账单', amount: 8450, dueDate: '2026-05-05', status: '待缴' },
    { id: 'BILL-002', elder: '李秀红', type: '补缴押金', amount: 20000, dueDate: '2026-05-02', status: '催缴中' },
    { id: 'BILL-003', elder: '赵四海', type: '月账单', amount: 7600, dueDate: '2026-05-06', status: '待缴' },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">财务数据大盘中台</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            全局资金流向监控、收支组成分析、资金池异动追踪
          </span>
        </div>
        <div className="flex gap-2 bg-slate-100/50 p-1 rounded-xl">
          <button 
             onClick={() => setTimeRange('week')}
             className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeRange === 'week' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >本周</button>
          <button 
             onClick={() => setTimeRange('month')}
             className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeRange === 'month' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >本月</button>
          <button 
             onClick={() => setTimeRange('year')}
             className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeRange === 'year' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >本年年度</button>
        </div>
      </div>

      {/* Top Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <div 
           className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
           onClick={() => setActiveTab && setActiveTab('payment_settle')}
        >
           <div className="absolute top-0 right-0 p-4 opacity-20">
              <Wallet className="w-16 h-16" />
           </div>
           <div className="relative z-10">
              <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">当月已确认总营收</p>
              <h3 className="text-3xl font-black font-mono tracking-tight mb-2">¥ 580,000.00</h3>
              <div className="flex items-center gap-2 text-sm">
                 <span className="flex items-center bg-blue-500/30 px-1.5 py-0.5 rounded text-emerald-300 font-bold">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5.4%
                 </span>
                 <span className="text-blue-200 text-xs">较上月同期</span>
              </div>
           </div>
        </div>

        <div 
           className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:border-slate-300"
           onClick={() => setActiveTab && setActiveTab('procurement')}
        >
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">当月总支出</p>
              <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg"><TrendingDown className="w-4 h-4" /></div>
           </div>
           <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight mb-2">¥ 330,000.00</h3>
           <div className="flex items-center gap-2 text-sm">
                 <span className="flex items-center text-rose-500 font-bold text-xs">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> 3.1%
                 </span>
                 <span className="text-slate-400 text-xs">较上月同期</span>
           </div>
        </div>

        <div 
           className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:border-slate-300"
           onClick={() => setActiveTab && setActiveTab('deposit_manage')}
        >
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">当前资金池沉淀总额</p>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><PiggyBank className="w-4 h-4" /></div>
           </div>
           <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight mb-2">¥ 4,520,000</h3>
           <div className="text-xs text-slate-500 flex items-center gap-1">
              押金 <span className="font-bold text-slate-700">¥ 3,850,000</span> | 备用金 <span className="font-bold text-slate-700">¥ 670,000</span>
           </div>
        </div>

        <div 
           className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:border-slate-300"
           onClick={() => setActiveTab && setActiveTab('billing')}
        >
           <div className="flex justify-between items-start mb-2">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">当期应收账款净额</p>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><Banknote className="w-4 h-4" /></div>
           </div>
           <h3 className="text-2xl font-black text-slate-800 font-mono tracking-tight mb-2">¥ 124,500.00</h3>
           <div className="flex items-center gap-2 text-sm">
                 <span className="flex items-center text-amber-500 font-bold text-xs">
                    包含 <span className="mx-1 text-slate-800 font-black">12</span> 笔逾期未缴
                 </span>
           </div>
        </div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 flex-1 min-h-[350px]">
         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
               <Activity className="w-5 h-5 text-blue-600" />
               <h3 className="font-black text-slate-800 text-lg">近半年收支趋势对比</h3>
            </div>
            <div className="flex-1 w-full min-h-[250px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                     <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(val) => `¥${val/10000}w`} />
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`¥ ${value.toLocaleString()}`, undefined]}
                     />
                     <Legend verticalAlign="top" height={36} iconType="circle" />
                     <Area type="monotone" dataKey="收入" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                     <Area type="monotone" dataKey="支出" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6">
               <PieChart className="w-5 h-5 text-emerald-600" />
               <h3 className="font-black text-slate-800 text-lg">本月营收结构</h3>
            </div>
            <div className="flex-1 w-full min-h-[220px] relative">
               <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                     <Pie
                        data={revenueComposition}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                     >
                        {revenueComposition.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip formatter={(value: number) => [`¥ ${value.toLocaleString()}`, undefined]} />
                  </RechartsPieChart>
               </ResponsiveContainer>
               {/* Center text for donut */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase mb-0.5">总额</span>
                  <span className="font-black font-mono text-slate-800">58w</span>
               </div>
            </div>
            <div className="space-y-3 mt-4 overflow-y-auto max-h-[120px] hidden-scrollbar">
               {revenueComposition.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="font-medium text-slate-600">{item.name}</span>
                     </div>
                     <span className="font-bold text-slate-800 font-mono">¥ {item.value.toLocaleString()}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* 支出结构 / 预算分析如果需要也可以用图表，这里先弄一个简易列表或图柱 */}
         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
               <BarChart3 className="w-5 h-5 text-rose-600" />
               <h3 className="font-black text-slate-800 text-lg">支出类目 Top 5</h3>
            </div>
            <div className="space-y-4">
               {expenseComposition.map((item, idx) => (
                  <div key={item.name}>
                     <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-slate-700">{item.name}</span>
                        <span className="font-bold font-mono text-slate-600">¥ {item.value.toLocaleString()}</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                           className="bg-rose-500 h-2 rounded-full" 
                           style={{ width: `${(item.value / 160000) * 100}%`, backgroundColor: EXPENSE_COLORS[idx] }}
                        ></div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* 待办风险/催缴提醒 */}
         <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-600" />
                  <h3 className="font-black text-slate-800 text-lg">重点关注：大额应收预警</h3>
               </div>
               <button className="text-blue-600 text-xs font-bold hover:text-blue-700">查看全部</button>
            </div>
            <div className="space-y-3">
               {pendingBills.map(bill => (
                  <div key={bill.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold text-slate-500">
                           {bill.elder[0]}
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 flex items-center gap-2">
                              {bill.elder} <span className="text-[10px] font-medium bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{bill.type}</span>
                           </div>
                           <div className="text-xs text-slate-500 mt-0.5">最后期限: {bill.dueDate}</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="font-black font-mono text-rose-600 text-base">¥ {bill.amount.toLocaleString()}</div>
                        <div className={`text-[10px] font-bold mt-0.5 ${bill.status === '催缴中' ? 'text-rose-600' : 'text-slate-400'}`}>
                           {bill.status}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
}
