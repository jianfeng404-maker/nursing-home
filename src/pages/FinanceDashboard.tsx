import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { CreditCard, TrendingUp, TrendingDown, PiggyBank, ArrowUpRight, ArrowDownRight, Wallet, Activity, ShieldAlert, Banknote, BarChart3, PieChart, CheckCircle2, History, AlertCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { useStore } from "../store";

interface FinanceDashboardProps {
  setActiveTab?: (tab: string) => void;
}

export function FinanceDashboard({ setActiveTab }: FinanceDashboardProps) {
  const [timeRange, setTimeRange] = useState('month');
  const bills = useStore(state => state.bills);

  // Derived Pipeline metrics
  const toCheckBills = bills.filter(b => b.status === "待核对");
  const toPayBills = bills.filter(b => b.status === "已核发 (待缴款)" || b.status === "未缴费");
  const paidBills = bills.filter(b => b.status === "已缴费" || b.status === "已结清");
  const overdueBills = bills.filter(b => b.status === "逾期未缴");

  const sumAmt = (arr: any[]) => arr.reduce((acc, b) => acc + parseFloat(String(b.total || "0").replace(/,/g, '')), 0);

  const pipelineStages = [
    { id: 'check', title: '待核对账单', count: toCheckBills.length, amount: sumAmt(toCheckBills), icon: History, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', target: 'billing' },
    { id: 'pay', title: '已核发(待缴款)', count: toPayBills.length, amount: sumAmt(toPayBills), icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', target: 'billing' },
    { id: 'overdue', title: '逾期欠费预警', count: overdueBills.length, amount: sumAmt(overdueBills), icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', target: 'payment_settle' },
    { id: 'paid', title: '已缴款到账', count: paidBills.length, amount: sumAmt(paidBills), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', target: 'payment_settle' }
  ];

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

  const pendingBills = [...overdueBills, ...toPayBills, ...bills.filter(b => b.status === "已核发 (待缴款)")]
    .slice(0, 3)
    .map(b => ({
      id: b.id,
      elder: b.elder,
      type: b.period.includes('月') ? '月账单' : '账单',
      amount: parseFloat(String(b.total || "0").replace(/,/g, '')),
      dueDate: b.dueDate || 'N/A',
      status: b.status === '逾期未缴' ? '催缴中' : '待缴'
    }));

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">财务大盘与管线中台</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            全局资金流向监控、收支组成分析、一站式结算管线全览
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
          >本月汇总</button>
          <button 
             onClick={() => setTimeRange('year')}
             className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${timeRange === 'year' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >年度财报</button>
        </div>
      </div>

      {/* 财务工作流水线 Pipeline */}
      <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
         <Activity className="w-5 h-5 text-indigo-600"/> 实事财务结算管线
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-8 shrink-0">
        {pipelineStages.map((stage, idx) => (
           <Card key={stage.id} className="border-none shadow-sm hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer relative overflow-hidden" onClick={() => setActiveTab && setActiveTab(stage.target)}>
              <CardContent className="p-5 flex items-center justify-between">
                 <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">{stage.title}</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-3xl font-black text-slate-800">{stage.count}</h3>
                       <span className="text-xs font-bold text-slate-400">单</span>
                    </div>
                 </div>
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${stage.bg} ${stage.color} border ${stage.border}`}>
                    <stage.icon className="w-6 h-6" strokeWidth={2.5} />
                 </div>
              </CardContent>
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                 <span className="font-medium text-slate-500">累计本金金额</span>
                 <span className={`font-mono font-bold text-sm ${stage.amount > 0 ? stage.color : 'text-slate-400'}`}>
                    ¥ {stage.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                 </span>
              </div>
           </Card>
        ))}
      </div>
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
