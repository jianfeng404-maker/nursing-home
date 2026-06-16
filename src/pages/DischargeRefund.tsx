import { useState, useMemo } from "react";
import { Search, CheckCircle2, QrCode, CreditCard, Banknote, FileText, UserMinus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function DischargeRefund() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refundMethod, setRefundMethod] = useState('');

  // Mock data for discharge refunds
  const [refunds, setRefunds] = useState([
     { id: "REF-20231101-01", elder: "钱多多", room: "C栋-101室", date: "2023-11-01", status: "待清算", totalRefund: 3500, items: [
        { name: "医疗备用金退还", amount: 5000, type: 'credit' },
        { name: "门禁及物资押金退还", amount: 600, type: 'credit' },
        { name: "未满月床位费折算退回", amount: 1500, type: 'credit' },
        { name: "历史未结清临时消费", amount: 200, type: 'debit' },
        { name: "提前解约违约金扣款", amount: 3000, type: 'debit' },
        { name: "物资损坏赔偿金", amount: 400, type: 'debit' }
     ] },
     { id: "REF-20231102-02", elder: "吴老三", room: "B栋-405室", date: "2023-11-02", status: "待清算", totalRefund: 6500, items: [
        { name: "医疗备用金退还", amount: 5000, type: 'credit' },
        { name: "未满月代收生活费退回", amount: 1500, type: 'credit' }
     ] },
     { id: "REF-20231020-05", elder: "孙如意", room: "A栋-108室", date: "2023-10-20", status: "已退费", totalRefund: 5500, items: [
        { name: "医疗备用金退还", amount: 6000, type: 'credit' },
        { name: "设施损耗赔偿", amount: 500, type: 'debit' }
     ] }
  ]);

  const filteredRefunds = useMemo(() => {
     return refunds.filter(r => {
        const matchesTab = activeTab === 'pending' ? r.status === '待清算' : r.status === '已退费';
        const matchesSearch = r.elder.includes(searchQuery) || r.id.includes(searchQuery) || r.room.includes(searchQuery);
        return matchesTab && matchesSearch;
     });
  }, [refunds, activeTab, searchQuery]);

  const handleProcessRefund = () => {
     if (!selectedRefund) return;
     if (!refundMethod) {
         toast.error("请先选择打款路径");
         return;
     }
     setIsProcessing(true);
     setTimeout(() => {
        setRefunds(prev => prev.map(r => r.id === selectedRefund.id ? { ...r, status: '已退费' } : r));
        setSelectedRefund({ ...selectedRefund, status: '已退费' });
        setIsProcessing(false);
        setRefundMethod('');
        toast.success(`归档清算成功，款项将通过 (${refundMethod}) 打款`);
     }, 1500);
  };

  const handleUploadProof = () => {
      toast.success("正在调取本地文件选择器...");
      setTimeout(() => {
          toast.success("凭证上传成功，归档完成");
      }, 1000);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">退住清算与退费申请</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            处理长者退院时的各项押金退还、未结违约金扣款、财务清算
          </span>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-[600px] overflow-hidden">
         {/* Left col */}
         <div className="w-[45%] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-3 shrink-0">
               <div className="flex gap-2 bg-slate-100/50 p-1 rounded-lg w-max">
                  <button
                     onClick={() => { setActiveTab('pending'); setSelectedRefund(null); }}
                     className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                       activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                  >
                     待清算退费
                  </button>
                  <button
                     onClick={() => { setActiveTab('processed'); setSelectedRefund(null); }}
                     className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                       activeTab === 'processed' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                     }`}
                  >
                     今日已处理
                  </button>
               </div>
               <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="输入长者姓名、房号或清算单号..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-full focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all shadow-inner"
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar bg-slate-50">
               {filteredRefunds.map((ref) => (
                  <div 
                     key={ref.id} 
                     onClick={() => { setSelectedRefund(ref); setRefundMethod(''); }}
                     className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedRefund?.id === ref.id 
                        ? 'bg-indigo-50 border-indigo-300 shadow-md ring-1 ring-indigo-500/20' 
                        : 'bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono text-slate-400 font-medium">{ref.id}</span>
                     </div>
                     <div className="flex justify-between items-center mb-1">
                        <h4 className="font-black text-slate-800 text-lg">{ref.elder} <span className="text-sm text-slate-500 font-medium ml-1">({ref.room})</span></h4>
                        <span className={`font-black text-lg ${ref.totalRefund > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                           {ref.totalRefund > 0 ? "+" : ""}¥{ref.totalRefund}
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">发起日期: {ref.date}</span>
                        <span className="text-indigo-600 font-bold hover:underline">审核单 {'>'}</span>
                     </div>
                  </div>
               ))}
               {filteredRefunds.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-slate-400 mt-10">
                     <CheckCircle2 className="w-12 h-12 mb-3 text-slate-300 opacity-50" />
                     <p className="text-sm font-medium">没找到待退费账单</p>
                  </div>
               )}
            </div>
         </div>

         {/* Right col */}
         <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden relative shadow-inner">
            {selectedRefund ? (
               <div className="flex-1 flex flex-col absolute inset-0">
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                     <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-slate-200 relative">
                        {selectedRefund.status === '已退费' && (
                           <div className="absolute top-10 right-10 rotate-12 border-4 border-slate-400 text-slate-400 font-black text-2xl tracking-widest px-4 py-2 rounded-lg opacity-80 pointer-events-none">
                              流水已结
                           </div>
                        )}
                        
                        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                           <h2 className="text-xl font-black text-slate-900 tracking-tight">星愿颐养社区 - 退住清算单</h2>
                           <p className="text-xs text-slate-500 font-mono mt-2 flex justify-between">
                              <span>NO. {selectedRefund.id}</span>
                              <span>{selectedRefund.date}</span>
                           </p>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-6 border-b border-dashed border-slate-300 pb-6">
                           <div className="flex gap-2">
                              <span className="text-slate-500 w-16">客户姓名:</span>
                              <span className="font-bold text-slate-800">{selectedRefund.elder}</span>
                           </div>
                           <div className="flex gap-2">
                              <span className="text-slate-500 w-16">原住房号:</span>
                              <span className="font-bold text-slate-800">{selectedRefund.room}</span>
                           </div>
                           {selectedRefund.status !== '已退费' && (
                              <div className="flex gap-2 mt-4 bg-rose-50 p-2 rounded border border-rose-100 flex items-start">
                                 <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                                 <span className="text-rose-800 font-medium text-xs">出纳提示: 请核对扣费项目是否与该长者此前签署的退住协议一致，并确认长者银行卡信息正确。</span>
                              </div>
                           )}
                        </div>

                        <div className="mb-6">
                           <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">退款项 (本金及预存款)</div>
                           {selectedRefund.items?.filter((i:any) => i.type==='credit').map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm mb-2 font-medium">
                                 <span className="text-slate-700">{item.name}</span>
                                 <span className="text-emerald-600 font-mono">+ ¥ {item.amount}</span>
                              </div>
                           ))}
                        </div>
                        
                        <div className="mb-6">
                           <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">扣减项 (违约金及损耗)</div>
                           {selectedRefund.items?.filter((i:any) => i.type==='debit').map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm mb-2 font-medium">
                                 <span className="text-slate-700">{item.name}</span>
                                 <span className="text-rose-600 font-mono">- ¥ {item.amount}</span>
                              </div>
                           ))}
                           {selectedRefund.items?.filter((i:any) => i.type==='debit').length === 0 && <p className="text-slate-400 text-sm italic">无扣减项</p>}
                        </div>

                        <div className="border-t-2 border-slate-800 pt-4 mt-8 flex justify-between items-end">
                           <span className="font-bold text-slate-600">最终应退还 (RMB)</span>
                           <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">¥{selectedRefund.totalRefund}</span>
                        </div>
                     </div>
                  </div>

                  {selectedRefund.status !== '已退费' && (
                     <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] shrink-0 z-10 block">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest">打款操作记录</h3>
                        <div className="grid grid-cols-2 gap-3 mb-5">
                           <button 
                              onClick={() => setRefundMethod('原缴费账号')}
                              className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl transition-all group ${refundMethod === '原缴费账号' ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' : 'border-slate-200 hover:border-indigo-500 hover:bg-indigo-50'}`}
                           >
                              <CreditCard className={`w-6 h-6 transition-transform group-hover:scale-110 ${refundMethod === '原缴费账号' ? 'text-indigo-600' : 'text-indigo-500'}`} />
                              <span className={`text-sm font-bold ${refundMethod === '原缴费账号' ? 'text-indigo-700' : 'text-slate-700 group-hover:text-indigo-700'}`}>退至原缴费账号</span>
                           </button>
                           <button 
                              onClick={() => setRefundMethod('指定银行卡')}
                              className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-xl transition-all group ${refundMethod === '指定银行卡' ? 'border-slate-500 bg-slate-100 ring-2 ring-slate-200' : 'border-slate-200 hover:border-slate-500 hover:bg-slate-50'}`}
                           >
                              <span className={`text-sm font-bold border-b border-dashed ${refundMethod === '指定银行卡' ? 'text-slate-900 border-slate-600' : 'text-slate-700 group-hover:text-slate-900 border-slate-400'}`}>退至指定银行卡</span>
                           </button>
                        </div>
                        <button 
                           onClick={handleProcessRefund}
                           disabled={isProcessing}
                           className="w-full py-4 bg-slate-800 text-white font-black text-lg shadow-lg shadow-slate-800/30 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                           {isProcessing ? (
                              <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> 处理中...</span>
                           ) : (
                              <span className="flex items-center gap-2"><CheckCircle2 className="w-6 h-6"/> {refundMethod ? `通过 ${refundMethod} 退费` : '确认已打款退费'} (¥{selectedRefund.totalRefund})</span>
                           )}
                        </button>
                     </div>
                  )}

                  {selectedRefund.status === '已退费' && (
                     <div className="bg-slate-100 border-t border-slate-200 p-6 shrink-0 z-10 flex justify-between items-center">
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500"/> 清算归档完毕。该长者系统档案已彻底注销。</p>
                        <div className="flex gap-3">
                           <button onClick={handleUploadProof} className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                             <FileText className="w-4 h-4"/> 凭证附件上传
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                     <UserMinus className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="font-bold text-slate-500 text-lg">请在左侧选择待退住清算的账户</h3>
                  <p className="text-sm mt-2">支持处理押金退还与违约折算业务</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
