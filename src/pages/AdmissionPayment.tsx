import { useState, useMemo } from "react";
import { Search, Calculator, CheckCircle2, QrCode, CreditCard, Banknote, FileText, SmartphoneNfc, UserPlus } from "lucide-react";
import { useStore } from "../store";
import { toast } from "sonner";

export function AdmissionPayment() {
  const [activeTab, setActiveTab] = useState('unpaid');
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Mock data for admission payments
  const [admissions, setAdmissions] = useState([
     { id: "ADM-20231101-01", elder: "王建军", room: "A栋-205室", date: "2023-11-01", status: "未收银", total: 15600, items: [
        { name: "首月床位费 (单间)", amount: 5000 },
        { name: "首月护理费 (二级)", amount: 3500 },
        { name: "首月餐饮费 (基础餐)", amount: 1500 },
        { name: "医疗备用金 (押金)", amount: 5000 },
        { name: "门禁及物资押金", amount: 600 }
     ] },
     { id: "ADM-20231102-02", elder: "李淑芬", room: "B栋-302室", date: "2023-11-02", status: "未收银", total: 18000, items: [
        { name: "首月床位费 (套房)", amount: 8000 },
        { name: "首月护理费 (三级)", amount: 4500 },
        { name: "首月餐饮费 (营养餐)", amount: 2500 },
        { name: "医疗备用金 (押金)", amount: 3000 }
     ] },
     { id: "ADM-20231025-01", elder: "赵铁柱", room: "A栋-102室", date: "2023-10-25", status: "已收银", total: 15000, items: [
        { name: "首月床位费", amount: 4500 },
        { name: "首月护理费", amount: 4000 },
        { name: "医疗备用金 (押金)", amount: 6500 }
     ] }
  ]);

  const filteredAdmissions = useMemo(() => {
     return admissions.filter(a => {
        const matchesTab = activeTab === 'unpaid' ? a.status === '未收银' : a.status === '已收银';
        const matchesSearch = a.elder.includes(searchQuery) || a.id.includes(searchQuery) || a.room.includes(searchQuery);
        return matchesTab && matchesSearch;
     });
  }, [admissions, activeTab, searchQuery]);

  const handlePay = () => {
     if (!selectedAdmission) return;
     if (!paymentMethod) {
         toast.error("请先选择支付方式");
         return;
     }
     setIsPaying(true);
     setTimeout(() => {
        setAdmissions(prev => prev.map(a => a.id === selectedAdmission.id ? { ...a, status: '已收银' } : a));
        setSelectedAdmission({ ...selectedAdmission, status: '已收银' });
        setIsPaying(false);
        setPaymentMethod('');
        toast.success(`收银成功 (${paymentMethod})`);
     }, 1500);
  };

  const handleInvoice = () => {
      toast.success("正在调用电子发票接口...");
      setTimeout(() => {
          toast.success("开票成功");
      }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">入住办理收银台</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            长者正式入住前，收取首期综合费用及各类押金结算大厅
          </span>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-[600px] overflow-hidden">
         {/* Left col */}
         <div className="w-[45%] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 shrink-0">
               <div className="flex gap-2 bg-slate-100/50 p-1 rounded-lg w-max">
                  <button
                     onClick={() => { setActiveTab('unpaid'); setSelectedAdmission(null); }}
                     className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                       activeTab === 'unpaid' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                  >
                     待收银业务
                  </button>
                  <button
                     onClick={() => { setActiveTab('paid'); setSelectedAdmission(null); }}
                     className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                       activeTab === 'paid' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                  >
                     今日已收银
                  </button>
               </div>
               <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入长者姓名、房号或办理单号..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-inner"
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50">
               {filteredAdmissions.map((adm) => (
                  <div 
                     key={adm.id} 
                     onClick={() => { setSelectedAdmission(adm); setPaymentMethod(''); }}
                     className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedAdmission?.id === adm.id 
                        ? 'bg-indigo-50 border-indigo-300 shadow-md ring-1 ring-indigo-500/20' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-slate-400 font-medium">{adm.id}</span>
                     </div>
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-slate-800 text-lg">{adm.elder} <span className="text-sm text-slate-500 font-medium ml-1">({adm.room})</span></h4>
                        <span className="font-black text-slate-900 text-lg">¥{adm.total}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">入住排期: {adm.date}</span>
                        <span className="text-indigo-600 font-bold hover:underline">付款清单 {'>'}</span>
                     </div>
                  </div>
               ))}
               {filteredAdmissions.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 mt-10">
                     <CheckCircle2 className="w-12 h-12 mb-3 text-slate-300 opacity-50" />
                     <p className="text-sm font-medium">没找到相关业务单据</p>
                  </div>
               )}
            </div>
         </div>

         {/* Right col */}
         <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden relative shadow-inner">
            {selectedAdmission ? (
               <div className="flex-1 flex flex-col absolute inset-0">
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 relative">
                        {selectedAdmission.status === '已收银' && (
                           <div className="absolute top-10 right-10 rotate-12 border-4 border-emerald-500 text-emerald-500 font-black text-2xl tracking-widest px-4 py-2 rounded-lg opacity-80 pointer-events-none">
                              已收讫 PAID
                           </div>
                        )}
                        
                        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                           <h2 className="text-xl font-black text-slate-900 tracking-tight">星愿颐养社区 - 入住结算</h2>
                           <p className="text-xs text-slate-500 font-mono mt-2 flex justify-between">
                              <span>NO. {selectedAdmission.id}</span>
                              <span>{selectedAdmission.date}</span>
                           </p>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-6 border-b border-dashed border-slate-300 pb-6">
                           <div className="flex gap-2">
                              <span className="text-slate-500 w-16">客户姓名:</span>
                              <span className="font-bold text-slate-800">{selectedAdmission.elder}</span>
                           </div>
                           <div className="flex gap-2">
                              <span className="text-slate-500 w-16">分配房号:</span>
                              <span className="font-bold text-slate-800">{selectedAdmission.room}</span>
                           </div>
                        </div>

                        <div className="mb-6">
                           <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">首次预缴款项明细</div>
                           {selectedAdmission.items?.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm mb-2 font-medium">
                                 <span className="text-slate-700">{item.name}</span>
                                 <span className="text-slate-900 font-mono">¥ {item.amount}</span>
                              </div>
                           ))}
                        </div>

                        <div className="border-t-2 border-slate-800 pt-4 mt-8 flex justify-between items-end">
                           <span className="font-bold text-slate-600">应收总计 (RMB)</span>
                           <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">¥{selectedAdmission.total}</span>
                        </div>
                     </div>
                  </div>

                  {selectedAdmission.status !== '已收银' && (
                     <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0 z-10 block">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest">选择支付方式并完成收银</h3>
                        <div className="grid grid-cols-4 gap-3 mb-5">
                           <button 
                              onClick={() => setPaymentMethod('扫码付')}
                              className={`flex flex-col items-center justify-center gap-3 p-4 border rounded-xl transition-all group ${paymentMethod === '扫码付' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50'}`}
                           >
                              <QrCode className={`w-8 h-8 transition-transform group-hover:scale-110 ${paymentMethod === '扫码付' ? 'text-emerald-600' : 'text-emerald-500'}`} />
                              <span className={`text-sm font-bold ${paymentMethod === '扫码付' ? 'text-emerald-700' : 'text-slate-700 group-hover:text-emerald-700'}`}>扫码付</span>
                           </button>
                           <button 
                              onClick={() => setPaymentMethod('刷卡')}
                              className={`flex flex-col items-center justify-center gap-3 p-4 border rounded-xl transition-all group ${paymentMethod === '刷卡' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50'}`}
                           >
                              <CreditCard className={`w-8 h-8 transition-transform group-hover:scale-110 ${paymentMethod === '刷卡' ? 'text-indigo-600' : 'text-indigo-500'}`} />
                              <span className={`text-sm font-bold ${paymentMethod === '刷卡' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-700'}`}>刷卡</span>
                           </button>
                           <button 
                              onClick={() => setPaymentMethod('现金')}
                              className={`flex flex-col items-center justify-center gap-3 p-4 border rounded-xl transition-all group ${paymentMethod === '现金' ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-500 hover:bg-amber-50'}`}
                           >
                              <Banknote className={`w-8 h-8 transition-transform group-hover:scale-110 ${paymentMethod === '现金' ? 'text-amber-600' : 'text-amber-500'}`} />
                              <span className={`text-sm font-bold ${paymentMethod === '现金' ? 'text-amber-700' : 'text-slate-700 group-hover:text-amber-700'}`}>现金</span>
                           </button>
                           <button 
                              onClick={() => setPaymentMethod('组合支付')}
                              className={`flex flex-col items-center justify-center gap-3 p-4 border rounded-xl transition-all group ${paymentMethod === '组合支付' ? 'border-slate-500 bg-slate-100 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-500 hover:bg-slate-50'}`}
                           >
                              <span className={`text-sm font-bold border-b border-dashed ${paymentMethod === '组合支付' ? 'text-slate-900 border-slate-600' : 'text-slate-700 group-hover:text-slate-900 border-slate-400'}`}>组合支付</span>
                           </button>
                        </div>
                        <button 
                           onClick={handlePay}
                           disabled={isPaying}
                           className="w-full py-4 bg-indigo-600 text-white font-black text-lg shadow-lg shadow-indigo-600/30 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                           {isPaying ? (
                              <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 正在处理...</span>
                           ) : (
                              <span className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6"/> {paymentMethod ? `确认通过 ${paymentMethod} 收款` : `全额收款`} ¥{selectedAdmission.total}</span>
                           )}
                        </button>
                     </div>
                  )}

                  {selectedAdmission.status === '已收银' && (
                     <div className="bg-slate-100 border-t border-slate-200 p-6 shrink-0 z-10 flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> 收银完成，已解除出入凭证发卡锁定</p>
                        <div className="flex gap-3">
                           <button onClick={handleInvoice} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                             <FileText className="w-4 h-4"/> 开具证明与发票
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <UserPlus className="w-10 h-10 text-indigo-300" />
                  </div>
                  <h3 className="font-bold text-slate-500 text-lg">请在左侧选择待办理的入住结算单</h3>
                  <p className="text-sm mt-2">支持收取床位费、护理费及各类押金</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
