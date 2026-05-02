import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, History, PiggyBank, AlertTriangle, ArrowDownRight, ArrowUpRight, X, CreditCard, Banknote, Receipt, CheckCircle2, ShieldAlert } from "lucide-react";

export function DepositManage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [modalState, setModalState] = useState<{ type: 'topup' | 'history' | null, account: any }>({ type: null, account: null });
  const [topupAmount, setTopupAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wechat');
  const [fundType, setFundType] = useState<'reserve'|'deposit'>('reserve'); // Choose which fund to operate on

  const [accounts, setAccounts] = useState([
    { id: "ACC-001", elder: "张明宇", room: "A栋-101", depositBalance: 50000.00, reserveBalance: 10000.00, minReserve: 5000.00, lastUpdate: "2026-04-15 14:30" },
    { id: "ACC-002", elder: "李秀兰", room: "A栋-102", depositBalance: 30000.00, reserveBalance: 3500.00, minReserve: 5000.00, lastUpdate: "2026-04-20 09:15" },
    { id: "ACC-003", elder: "王建国", room: "B栋-201", depositBalance: 50000.00, reserveBalance: 25000.00, minReserve: 10000.00, lastUpdate: "2026-03-10 11:20" },
    { id: "ACC-004", elder: "赵桂芳", room: "C栋-302", depositBalance: 20000.00, reserveBalance: -500.00, minReserve: 5000.00, lastUpdate: "2026-04-25 16:45" },
    { id: "ACC-005", elder: "刘建华", room: "B栋-105", depositBalance: 30000.00, reserveBalance: 4800.00, minReserve: 5000.00, lastUpdate: "2026-04-28 10:00" },
  ]);

  const mockHistory = [
     { date: "2026-04-15 14:30", type: "recharge", amount: 5000, fund: "reserve", method: "微信支付", note: "家属(儿子)代充值备用金", balance: 10000 },
     { date: "2026-04-02 09:15", type: "deduct", amount: -200, fund: "reserve", method: "-", note: "代购：成人纸尿裤", balance: 5000 },
     { date: "2026-03-15 10:00", type: "deduct", amount: -150, fund: "reserve", method: "-", note: "就医挂号费垫付", balance: 5200 },
     { date: "2026-01-05 11:20", type: "recharge", amount: 50000, fund: "deposit", method: "银行转账", note: "首次入住初始押金缴纳", balance: 50000 },
  ];

  const getStatus = (balance: number, minRequired: number) => {
    if (balance < 0) return { label: '已欠费', color: 'bg-rose-100 text-rose-800 border-rose-200' };
    if (balance < minRequired) return { label: '余额不足 (预警)', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { label: '正常', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const filteredAccounts = accounts.filter(acc => {
     const matchesSearch = acc.elder.includes(searchQuery) || acc.room.includes(searchQuery) || acc.id.includes(searchQuery);
     if (!matchesSearch) return false;
     if (activeTab === 'all') return true;
     if (activeTab === 'warning') return acc.reserveBalance >= 0 && acc.reserveBalance < acc.minReserve;
     if (activeTab === 'deficit') return acc.reserveBalance < 0;
     return true;
  });

  const handleTopup = () => {
    if (!topupAmount || isNaN(Number(topupAmount))) return;
    const amount = Number(topupAmount);
    setAccounts(prev => prev.map(d => {
       if (d.id === modalState.account.id) {
          if (fundType === 'reserve') {
             return { ...d, reserveBalance: d.reserveBalance + amount, lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
          } else {
             return { ...d, depositBalance: d.depositBalance + amount, lastUpdate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
          }
       }
       return d;
    }));
    setModalState({ type: null, account: null });
    setTopupAmount('');
    setFundType('reserve');
  };

  const totalReserve = accounts.reduce((acc, curr) => acc + curr.reserveBalance, 0);
  const totalDeposit = accounts.reduce((acc, curr) => acc + curr.depositBalance, 0);
  const warningCount = accounts.filter(d => d.reserveBalance >= 0 && d.reserveBalance < d.minReserve).length;
  const deficitCount = accounts.filter(d => d.reserveBalance < 0).length;

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">长者押金与备用金管理</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            押金用于应对毁损或违约 (冻结属性)，备用金用于日常零星增值消费、就医垫付等代扣代缴
          </span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95">
             <Plus className="w-4 h-4" /> 新建资金账户
          </button>
        </div>
      </div>

      {/* 核心指标监控区 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
         <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
               <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1">园区备用金总池</p>
               <h3 className="text-2xl font-black text-indigo-900 font-mono">¥ {totalReserve.toLocaleString()}</h3>
            </div>
            <PiggyBank className="w-8 h-8 text-indigo-300 opacity-50" />
         </div>
         <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between shadow-sm">
            <div>
               <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">在管入住押金总额</p>
               <h3 className="text-xl font-black text-blue-900 font-mono">¥ {totalDeposit.toLocaleString()}</h3>
            </div>
            <ShieldAlert className="w-8 h-8 text-blue-300 opacity-50" />
         </div>
         <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
               <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">备用金低余额预警</p>
               <h3 className="text-xl font-black text-amber-900">{warningCount} 个账户</h3>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-400 opacity-50" />
         </div>
         <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
               <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">备用金已欠费</p>
               <h3 className="text-xl font-black text-rose-900">{deficitCount} 个账户</h3>
            </div>
            <ArrowDownRight className="w-8 h-8 text-rose-400 opacity-50" />
         </div>
      </div>

      <div className="flex bg-slate-100/50 p-1 rounded-xl w-max mb-6">
         {[
            { id: 'all', label: '全部账户' },
            { id: 'warning', label: `备用金预警 (${warningCount})` },
            { id: 'deficit', label: `备用金欠费/负债 (${deficitCount})` }
         ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
         ))}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-800">
               长者资金双账户分类台账
            </h3>
            <div className="relative">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input
                 type="text"
                 placeholder="搜索姓名 / 房号 / 账户ID..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white transition-all shadow-inner"
               />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                 <tr className="text-slate-500 text-sm">
                   <th className="px-6 py-4 font-medium">长者姓名 / 房号</th>
                   <th className="px-6 py-4 font-medium">账户ID</th>
                   <th className="px-6 py-4 font-medium text-right bg-blue-50/30">入住押金 (冻结)</th>
                   <th className="px-6 py-4 font-medium text-right bg-emerald-50/30">日常备用金余额</th>
                   <th className="px-6 py-4 font-medium text-right bg-emerald-50/30">备用金预警线</th>
                   <th className="px-6 py-4 font-medium">备用金状态</th>
                   <th className="px-6 py-4 font-medium">最后流水</th>
                   <th className="px-6 py-4 font-medium text-center">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredAccounts.map((acc) => {
                     const status = getStatus(acc.reserveBalance, acc.minReserve);
                     return (
                     <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800 text-base">{acc.elder}</div>
                           <div className="text-xs text-slate-500 font-medium">{acc.room}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500 font-medium">{acc.id}</td>
                        <td className="px-6 py-4 text-right bg-blue-50/10">
                           <div className="font-bold text-slate-700 font-mono">¥ {acc.depositBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                        </td>
                        <td className="px-6 py-4 text-right bg-emerald-50/10">
                           <div className={`font-black text-lg font-mono ${acc.reserveBalance < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                              ¥ {acc.reserveBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-400 bg-emerald-50/10">¥ {acc.minReserve.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${status.color}`}>
                             {status.label}
                           </span>
                           {acc.reserveBalance < acc.minReserve && (
                              <div className="text-[10px] text-slate-400 mt-1 cursor-pointer hover:text-indigo-500 transition-colors">向家属发送催缴单</div>
                           )}
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">{acc.lastUpdate}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => { setFundType('reserve'); setModalState({ type: 'topup', account: acc }); }}
                                className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 font-bold text-xs rounded-lg transition-colors border border-emerald-200 whitespace-nowrap"
                              >
                                充备用金
                              </button>
                              <button 
                                onClick={() => setModalState({ type: 'history', account: acc })}
                                className="px-2.5 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 font-bold text-xs rounded-lg transition-colors border border-slate-200 whitespace-nowrap"
                              >
                                查流水
                              </button>
                           </div>
                        </td>
                     </tr>
                  )})}
                  {filteredAccounts.length === 0 && (
                     <tr>
                        <td colSpan={8} className="px-6 py-16 text-center text-slate-400">
                           <PiggyBank className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-50" />
                           没有查找到对应的资金账户信息
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Top-up / Deduction Modal */}
      {modalState.type === 'topup' && modalState.account && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
               <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                     <Plus className="w-5 h-5 text-emerald-600" />
                     办理账户充值收取
                  </h3>
                  <button onClick={() => setModalState({ type: null, account: null })} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* 长者信息与当前余额 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                        <div>
                           <div className="text-xs font-bold text-slate-500 mb-1">长者</div>
                           <div className="font-black text-slate-800">{modalState.account.elder} <span className="text-sm font-medium text-slate-500 ml-1">({modalState.account.room})</span></div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <div className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> 入住押金余额</div>
                           <div className="font-black font-mono text-slate-800">¥ {modalState.account.depositBalance.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                           <div className="text-[10px] font-bold text-emerald-600 uppercase mb-1 flex items-center justify-end gap-1"><PiggyBank className="w-3 h-3"/> 备用金余额</div>
                           <div className={`font-black font-mono ${modalState.account.reserveBalance < 0 ? 'text-rose-600' : 'text-slate-800'}`}>¥ {modalState.account.reserveBalance.toLocaleString()}</div>
                        </div>
                     </div>
                  </div>

                  {/* 选择充值目标 */}
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">选择资金入账类型</label>
                     <div className="flex gap-2">
                        <button
                          onClick={() => setFundType('reserve')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                             fundType === 'reserve' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                           充值日常备用金
                        </button>
                        <button
                          onClick={() => setFundType('deposit')}
                          className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${
                             fundType === 'deposit' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                           收取入住押金
                        </button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">充值金额 (元)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">¥</span>
                        <input 
                           type="number"
                           value={topupAmount}
                           onChange={(e) => setTopupAmount(e.target.value)}
                           placeholder="0.00"
                           className={`w-full pl-8 pr-4 py-3 border rounded-xl text-lg font-mono font-bold focus:outline-none focus:ring-1 transition-colors ${
                              fundType === 'reserve' ? 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
                           }`}
                        />
                     </div>
                     {fundType === 'reserve' && (
                        <div className="flex gap-2 mt-3">
                           {[1000, 3000, 5000].map(amt => (
                              <button 
                                key={amt} 
                                onClick={() => setTopupAmount(amt.toString())}
                                className="flex-1 py-1.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                              >
                                 +{amt}
                              </button>
                           ))}
                        </div>
                     )}
                     {fundType === 'deposit' && (
                        <div className="flex gap-2 mt-3">
                           {[10000, 30000, 50000].map(amt => (
                              <button 
                                key={amt} 
                                onClick={() => setTopupAmount(amt.toString())}
                                className="flex-1 py-1.5 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition"
                              >
                                 +{amt}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">支付方式</label>
                     <div className="grid grid-cols-2 gap-3 relative z-0">
                        <label className={`cursor-pointer flex items-center justify-center gap-2 p-3 border rounded-xl font-bold text-sm transition-all ${
                           paymentMethod === 'wechat' ? (fundType === 'reserve' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-blue-500 bg-blue-50 text-blue-800') : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}>
                           <input type="radio" value="wechat" className="hidden" checked={paymentMethod==='wechat'} onChange={()=>setPaymentMethod('wechat')} />
                           <Receipt className="w-4 h-4" /> 微信/支付宝
                           {paymentMethod === 'wechat' && <CheckCircle2 className={`w-4 h-4 absolute top-2 right-2 ${fundType==='reserve'?'text-emerald-500':'text-blue-500'}`} />}
                        </label>
                        <label className={`cursor-pointer flex items-center justify-center gap-2 p-3 border rounded-xl font-bold text-sm transition-all ${
                           paymentMethod === 'card' ? (fundType === 'reserve' ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-blue-500 bg-blue-50 text-blue-800') : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}>
                           <input type="radio" value="card" className="hidden" checked={paymentMethod==='card'} onChange={()=>setPaymentMethod('card')} />
                           <CreditCard className="w-4 h-4" /> 银行卡/转账
                           {paymentMethod === 'card' && <CheckCircle2 className={`w-4 h-4 absolute top-2 right-2 ${fundType==='reserve'?'text-emerald-500':'text-blue-500'}`} />}
                        </label>
                     </div>
                  </div>
               </div>

               <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3">
                  <button onClick={() => setModalState({ type: null, account: null })} className="flex-1 py-2.5 border border-slate-300 bg-white text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition">取消</button>
                  <button onClick={handleTopup} disabled={!topupAmount || Number(topupAmount) <= 0} className={`flex-1 py-2.5 text-white rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                     fundType === 'reserve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}>确认充值入账</button>
               </div>
            </div>
         </div>
      )}

      {/* History Modal */}
      {modalState.type === 'history' && modalState.account && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
               <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><History className="w-5 h-5" /></div>
                     <div>
                        <h3 className="font-black text-slate-800">资金池双账户流水明细</h3>
                        <p className="text-xs text-slate-500">{modalState.account.elder} ({modalState.account.room}) | 账户: {modalState.account.id}</p>
                     </div>
                  </div>
                  <button onClick={() => setModalState({ type: null, account: null })} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-0 custom-scrollbar">
                  <table className="w-full text-left">
                     <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
                        <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                           <th className="px-5 py-3">时间</th>
                           <th className="px-5 py-3">发生金额</th>
                           <th className="px-5 py-3">资金账户</th>
                           <th className="px-5 py-3">摘要 / 收付款类型</th>
                           <th className="px-5 py-3 text-right">变动后余额</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 text-sm">
                        {mockHistory.map((log, idx) => (
                           <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-medium text-xs">{log.date}</td>
                              <td className="px-5 py-4">
                                 <span className={`font-mono font-black ${log.type === 'recharge' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {log.type === 'recharge' ? '+' : ''}{log.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                                 </span>
                              </td>
                              <td className="px-5 py-4">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                    log.fund === 'deposit' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                 }`}>
                                    {log.fund === 'deposit' ? '入住押金' : '备用金'}
                                 </span>
                              </td>
                              <td className="px-5 py-4 text-slate-700">
                                 <div className="font-bold text-slate-800 text-xs">{log.note}</div>
                                 <div className="text-[10px] text-slate-400">{log.method}</div>
                              </td>
                              <td className="px-5 py-4 text-right font-mono text-slate-700 font-medium">
                                 ¥ {log.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               
               <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                  <button className="px-4 py-2 border border-slate-300 font-bold text-slate-700 bg-white rounded-lg flex items-center gap-2 hover:bg-slate-50">
                     <Receipt className="w-4 h-4" /> 打印对账单
                  </button>
                  <button onClick={() => setModalState({ type: null, account: null })} className="px-6 py-2 bg-slate-800 font-bold text-white rounded-lg hover:bg-slate-900">
                     关闭
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}

