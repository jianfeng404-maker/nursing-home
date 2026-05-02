import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, FileSpreadsheet, X, Info, Calculator, CheckCircle2, AlertCircle, FileText, Send } from "lucide-react";
import { ElderLink } from "../components/ElderLink";

export function Billing() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const [draftBills, setDraftBills] = useState([
    { 
      id: "B-202604-001", elder: "张明宇", room: "A栋-101", period: "2026年04月",
      totalAmount: "8,500.00", status: "待核对",
      items: [
        { category: "固定费用", name: "床位费", amount: "4,000.00" },
        { category: "固定费用", name: "二级护理费", amount: "3,000.00" },
        { category: "增值费用", name: "就医陪同服务", amount: "200.00" },
        { category: "餐饮费用", name: "月度餐饮费", amount: "1,500.00" },
      ],
      deductions: [
        { name: "长护险补贴扣除", amount: "-200.00" }
      ]
    },
    { 
      id: "B-202604-002", elder: "李秀兰", room: "A栋-102", period: "2026年04月",
      totalAmount: "6,200.00", status: "待核对",
      items: [
        { category: "固定费用", name: "床位费", amount: "3,500.00" },
        { category: "固定费用", name: "三级护理费", amount: "2,000.00" },
        { category: "商品代购", name: "成人纸尿裤", amount: "700.00" },
      ],
      deductions: []
    },
  ]);

  const [issuedBills, setIssuedBills] = useState([
    { id: "B-202603-055", elder: "王建国", room: "B栋-201", period: "2026年03月", totalAmount: "15,800.00", status: "已核发 (待缴款)", items: [], deductions: [] },
    { id: "B-202603-056", elder: "赵桂芳", room: "C栋-302", period: "2026年03月", totalAmount: "7,000.00", status: "已结清", items: [], deductions: [] },
  ]);

  const currentList = activeTab === 'pending' ? draftBills : issuedBills;
  const filteredList = currentList.filter(b => 
    b.elder.includes(searchQuery) || b.room.includes(searchQuery) || b.id.includes(searchQuery)
  );

  const handleVerify = (id: string) => {
    const billToApprove = draftBills.find(b => b.id === id);
    if (!billToApprove) return;
    setDraftBills(draftBills.filter(b => b.id !== id));
    setIssuedBills([{...billToApprove, status: "已核发 (待缴款)"}, ...issuedBills]);
    setSelectedBill(null);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">长者大账单生成与核对</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            每月自动汇总合同费、各类临时增值服务与耗材费用，生成月度综合账单供财务人员核对发单
          </span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95">
             <Calculator className="w-4 h-4" /> 一键提取本期数据生成账单
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">本期待核对草稿</p>
           <h3 className="text-2xl font-black text-slate-800">{draftBills.length} 份</h3>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 shadow-sm">
           <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1">本期已核发账单</p>
           <h3 className="text-2xl font-black text-indigo-900">{issuedBills.filter(b=>b.status==='已核发 (待缴款)').length} 份</h3>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm md:col-span-2 flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">本期自动计费规则运行状态</p>
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                 所有子模块(餐饮、护理、耗材)数据已就绪
              </h3>
           </div>
        </div>
      </div>

      <div className="flex bg-slate-100/50 p-1 rounded-xl w-max mb-6">
         {['pending', 'issued'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'pending' && '待核对账单 (草稿)'}
              {tab === 'issued' && '已核发账单 (正式)'}
            </button>
         ))}
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
         <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-800">
               {activeTab === 'pending' ? '财务人员需在此复核各项费用是否存在遗漏或错误' : '已核准下发给家属及前台的正式账单记录'}
            </h3>
            <div className="relative">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input
                 type="text"
                 placeholder="搜索长者姓名、房号或流水号..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white transition-all shadow-inner"
               />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                 <tr className="text-slate-500 text-sm">
                   <th className="px-6 py-4 font-medium">账单流水号</th>
                   <th className="px-6 py-4 font-medium">长者姓名 / 房号</th>
                   <th className="px-6 py-4 font-medium">计费基准周期</th>
                   <th className="px-6 py-4 font-medium text-right">应付总计</th>
                   <th className="px-6 py-4 font-medium">账单状态</th>
                   <th className="px-6 py-4 font-medium text-center">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {filteredList.map((bill) => (
                     <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-slate-500 font-medium">{bill.id}</td>
                        <td className="px-6 py-4">
                           <div className="font-bold text-slate-800 text-base">{bill.elder}</div>
                           <div className="text-xs text-slate-500">{bill.room}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-600">{bill.period}</td>
                        <td className="px-6 py-4 text-right font-black text-slate-900 text-lg">¥ {bill.totalAmount}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2.5 py-1 rounded-md text-xs font-bold w-max ${
                             bill.status === '待核对' ? 'bg-amber-100 text-amber-800' :
                             bill.status === '已结清' ? 'bg-emerald-100 text-emerald-800' :
                             'bg-indigo-100 text-indigo-800'
                           }`}>
                             {bill.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <button 
                             onClick={() => setSelectedBill(bill)} 
                             className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-white hover:border-indigo-300 text-indigo-600 font-bold text-xs rounded-lg transition-all shadow-sm"
                           >
                              {activeTab === 'pending' ? '进入明细核对' : '查看账单详情'}
                           </button>
                        </td>
                     </tr>
                  ))}
                  {filteredList.length === 0 && (
                    <tr>
                       <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-50" />
                          没有查找到对应的账单信息
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">
             
             {/* Modal Header */}
             <div className="flex items-center justify-between p-5 bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-3">
                   <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                      <FileText className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-800 text-lg">综合账单复核与明细清单</h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">Bill NO. {selectedBill.id} | Base Period: {selectedBill.period}</p>
                   </div>
                </div>
                <button onClick={() => setSelectedBill(null)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             {/* Modal Content */}
             <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 custom-scrollbar">
                
                {/* Left side: Bill Overview & Details */}
                <div className="flex-1 space-y-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-50 rounded-full opacity-50 blur-2xl"></div>
                      
                      <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 relative z-10">
                         <div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">长者信息</div>
                            <div className="text-2xl font-black text-slate-900">{selectedBill.elder}</div>
                            <div className="text-sm text-slate-600 font-medium">{selectedBill.room}</div>
                         </div>
                         <div className="text-right">
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">本期应缴总额</div>
                            <div className="text-3xl font-black text-indigo-700 font-mono">¥ {selectedBill.totalAmount}</div>
                         </div>
                      </div>

                      <div className="space-y-6 relative z-10">
                         <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> 费用明细项
                            </div>
                            <div className="space-y-2">
                               {selectedBill.items?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-slate-50 rounded transition-colors group">
                                     <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200 bg-slate-50 text-slate-500 group-hover:border-slate-300">
                                           {item.category}
                                        </span>
                                        <span className="font-medium text-slate-700">{item.name}</span>
                                     </div>
                                     <div className="font-mono text-slate-900 font-medium">¥ {item.amount}</div>
                                  </div>
                               ))}
                               {(!selectedBill.items || selectedBill.items.length === 0) && <div className="text-sm text-slate-400 italic py-2">暂无费用明细</div>}
                            </div>
                         </div>

                         <div>
                            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> 抵扣与减免项
                            </div>
                            <div className="space-y-2">
                               {selectedBill.deductions?.map((item: any, i: number) => (
                                  <div key={i} className="flex justify-between items-center text-sm p-2 hover:bg-emerald-50/50 rounded transition-colors border border-transparent hover:border-emerald-100">
                                     <span className="font-medium text-emerald-700">{item.name}</span>
                                     <div className="font-mono font-bold text-emerald-600">{item.amount}</div>
                                  </div>
                               ))}
                               {(!selectedBill.deductions || selectedBill.deductions.length === 0) && <div className="text-sm text-slate-400 italic py-2 pl-2">本期无抵扣事项</div>}
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {activeTab === 'pending' && (
                     <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                           <p className="text-sm font-bold text-amber-900 mb-1">财务核对注意事项</p>
                           <p className="text-xs text-amber-800 leading-relaxed">
                              请确认所有临时增值服务（如陪同就医、代购报销等）均已足额包含在内。核准下发后，账单将通过小程序/短信推送给绑定家属，并推送到前台收银系统等待结算缴费。
                           </p>
                        </div>
                     </div>
                   )}
                </div>
                
                {/* Right side: Operations & Logs (Only visible in pending state for this mockup, or change text for issued) */}
                <div className="w-full md:w-80 flex flex-col gap-4">
                   <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <h4 className="font-bold text-slate-800 mb-4 text-sm pb-2 border-b border-slate-100">账单操作</h4>
                      
                      {activeTab === 'pending' ? (
                         <div className="space-y-3">
                            <button className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                               修改明细项 (调整金额)
                            </button>
                            <button className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                               新增临时扣费项
                            </button>
                            <div className="my-4 border-t border-slate-100"></div>
                            <button 
                              onClick={() => handleVerify(selectedBill.id)}
                              className="w-full py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                               核准并下发账单 <Send className="w-4 h-4 ml-1" />
                            </button>
                         </div>
                      ) : (
                         <div className="space-y-3">
                            <button className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                               重新发送家属通知
                            </button>
                            <button className="w-full py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                               下载账单 PDF
                            </button>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-4 text-xs text-slate-500 text-center">
                               该账单已于 2026-04-18 核发并流转至收银中心
                            </div>
                         </div>
                      )}
                   </div>
                </div>

             </div>
          </div>
        </div>
      )}
    </div>
  );
}

