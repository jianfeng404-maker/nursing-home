import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, Calculator, CheckCircle2, Clock, Printer, QrCode, CreditCard, Banknote, FileText, SmartphoneNfc } from "lucide-react";
import { ElderLink } from "../components/ElderLink";
import { useStore, BillRecordType } from "../store";

export function PaymentSettle() {
  const [activeTab, setActiveTab] = useState('unpaid');
  const [selectedBill, setSelectedBill] = useState<BillRecordType | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const bills = useStore(state => state.bills);
  const updateBillStatus = useStore(state => state.updateBillStatus);
  const addTransaction = useStore(state => state.addTransaction);

  const handlePay = () => {
     if (!selectedBill) return;
     setIsPaying(true);
     setTimeout(() => {
        updateBillStatus(selectedBill.id, '已缴费');
        addTransaction({
           id: `TXN-${Date.now()}`,
           billId: selectedBill.id,
           elderId: selectedBill.elder,
           amount: parseFloat(selectedBill.total.toString().replace(/,/g, '')),
           direction: 'IN',
           method: '支付宝',
           operator: '系统自动核销',
           txTime: new Date().toISOString()
        });
        setIsPaying(false);
        setSelectedBill({ ...selectedBill, status: '已缴费' });
     }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">前台缴费与结算大厅</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            将长者的【周期合同费用】与日常护理中的【临时增值服务】、【代购物资】自动汇聚，实现一键结算
          </span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95">
             <Calculator className="w-4 h-4" /> 批量自动生成本期账单
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-[600px] overflow-hidden">
         {/* Left col: Counter queue list */}
         <div className="w-[45%] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 shrink-0">
               <div className="flex gap-2 bg-slate-100/50 p-1 rounded-lg w-max">
                  {['unpaid', 'paid', 'overdue'].map((tab) => (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                         activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                       }`}
                     >
                       {tab === 'unpaid' && '待收银业务'}
                       {tab === 'paid' && '历史已缴纪录'}
                       {tab === 'overdue' && '待催收账款'}
                     </button>
                  ))}
               </div>
               <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="输入长者姓名、房号或账单号..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-inner"
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50">
               {bills.filter(b => 
                  (activeTab === 'unpaid' && (b.status === '未缴费' || b.status === '已核发 (待缴款)')) ||
                  (activeTab === 'paid' && b.status === '已缴费') ||
                  (activeTab === 'overdue' && b.status === '逾期未缴')
               ).map((bill) => (
                  <div 
                     key={bill.id} 
                     onClick={() => setSelectedBill(bill)}
                     className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedBill?.id === bill.id 
                        ? 'bg-indigo-50 border-indigo-300 shadow-md ring-1 ring-indigo-500/20' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-slate-400 font-medium">{bill.id}</span>
                        {bill.status === '逾期未缴' && <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">逾期警告</span>}
                     </div>
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-slate-800 text-lg">{bill.elder} <span className="text-sm text-slate-500 font-medium ml-1">({bill.room})</span></h4>
                        <span className="font-black text-slate-900 text-lg">¥{bill.total}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 周期: {bill.period}</span>
                        <span className="text-indigo-600 font-bold hover:underline flex items-center gap-1">详细结算单 {'>'}</span>
                     </div>
                  </div>
               ))}
               {bills.filter(b => 
                  (activeTab === 'unpaid' && (b.status === '未缴费' || b.status === '已核发 (待缴款)')) ||
                  (activeTab === 'paid' && b.status === '已缴费') ||
                  (activeTab === 'overdue' && b.status === '逾期未缴')
               ).length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 mt-10">
                     <CheckCircle2 className="w-12 h-12 mb-3 text-slate-300 opacity-50" />
                     <p className="text-sm font-medium">当前分类下没有待处理账单</p>
                  </div>
               )}
            </div>
         </div>

         {/* Right col: POS settlement view */}
         <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden relative shadow-inner">
            {selectedBill ? (
               <div className="flex-1 flex flex-col absolute inset-0">
                  {/* 收银台上半部分：收费明细详单 (Simulate thermal receipt layout inside a nice wrapper) */}
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 relative">
                        {selectedBill.status === '已缴费' && (
                           <div className="absolute top-10 right-10 rotate-12 border-4 border-emerald-500 text-emerald-500 font-black text-2xl tracking-widest px-4 py-2 rounded-lg opacity-80 pointer-events-none">
                              已结清 PAID
                           </div>
                        )}
                        
                        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                           <h2 className="text-xl font-black text-slate-900 tracking-tight">星愿颐养社区 - 结算单</h2>
                           <p className="text-xs text-slate-500 font-mono mt-2 flex justify-between">
                              <span>NO. {selectedBill.id}</span>
                              <span>P {selectedBill.period}</span>
                           </p>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-6 border-b border-dashed border-slate-300 pb-6">
                           <div className="flex gap-2">
                              <span className="text-slate-500 w-16">客户姓名:</span>
                              <span className="font-bold text-slate-800">{selectedBill.elder}</span>
                           </div>
                           <div className="flex gap-2">
                              <span className="text-slate-500 w-16">所居房号:</span>
                              <span className="font-bold text-slate-800">{selectedBill.room}</span>
                           </div>
                           <div className="flex gap-2 mt-4 bg-amber-50 p-2 rounded border border-amber-100">
                              <span className="text-amber-800 font-medium text-xs">出纳提示: 此结算单已同步包含该长者本周期的医护临时工单与代买费用，无需手工补录。</span>
                           </div>
                        </div>

                        <div className="mb-6">
                           <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">一、 合同固定费用</div>
                           {selectedBill.items?.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm mb-2 font-medium">
                                 <span className="text-slate-700">{item.name}</span>
                                 <span className="text-slate-900 font-mono">¥ {item.amount}</span>
                              </div>
                           ))}
                           {selectedBill.items?.length === 0 && <p className="text-slate-400 text-sm">无记录</p>}
                        </div>

                        <div className="mb-6">
                           <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase flex items-center gap-2">
                              二、 临时增值与消耗 <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px]">来自护理系统同步</span>
                           </div>
                           {selectedBill.tempItems?.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm mb-2 font-medium">
                                 <div className="flex flex-col">
                                    <span className="text-slate-700">{item.name}</span>
                                    <span className="text-slate-400 text-xs font-mono">{item.date}</span>
                                 </div>
                                 <span className="text-slate-900 font-mono">¥ {item.amount}</span>
                              </div>
                           ))}
                           {selectedBill.tempItems?.length === 0 && <p className="text-slate-500 text-sm italic">本期无临时增值消费</p>}
                        </div>

                        <div className="border-t-2 border-slate-800 pt-4 mt-8 flex justify-between items-end">
                           <span className="font-bold text-slate-600">应付总计 (RMB)</span>
                           <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">¥{selectedBill.total}</span>
                        </div>
                     </div>
                  </div>

                  {/* 收银台下半部分：支付动作面板 */}
                  {selectedBill.status !== '已缴费' && (
                     <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0 z-10 block">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest">选择支付方式并完成收银</h3>
                        <div className="grid grid-cols-4 gap-3 mb-5">
                           <button className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                              <QrCode className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">微信/支付宝扫描</span>
                           </button>
                           <button className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group">
                              <CreditCard className="w-8 h-8 text-indigo-500 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">刷医保卡/银行卡</span>
                           </button>
                           <button className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all group">
                              <Banknote className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold text-slate-700 group-hover:text-amber-700">现金支付收取</span>
                           </button>
                           <button className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all group">
                              <SmartphoneNfc className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-bold text-slate-700 group-hover:text-rose-700">亲属远程代付</span>
                           </button>
                        </div>
                        <button 
                           onClick={handlePay}
                           disabled={isPaying}
                           className="w-full py-4 bg-indigo-600 text-white font-black text-lg shadow-lg shadow-indigo-600/30 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                           {isPaying ? (
                              <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 正在处理支付...</span>
                           ) : (
                              <span className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6"/> 确认已全额收到 ¥{selectedBill.total}</span>
                           )}
                        </button>
                     </div>
                  )}

                  {selectedBill.status === '已缴费' && (
                     <div className="bg-slate-100 border-t border-slate-200 p-6 shrink-0 z-10 flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> 该账单已结清，系统已解锁相关扣费限制</p>
                        <div className="flex gap-3">
                           <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                             <FileText className="w-4 h-4"/> 开具正规电子发票
                           </button>
                           <button className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                             <Printer className="w-4 h-4"/> 打印小票凭证
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <Calculator className="w-10 h-10 text-indigo-300" />
                  </div>
                  <h3 className="font-bold text-slate-500 text-lg">请在左侧选择需要办理业务的账单</h3>
                  <p className="text-sm mt-2">支持查看缴费详情、处理各种当面交易</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}

