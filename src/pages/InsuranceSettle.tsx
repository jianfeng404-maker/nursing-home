import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, ShieldPlus, FileCheck, Landmark, CheckCircle2, AlertCircle, FileSpreadsheet, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../store";

export function InsuranceSettle() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const { insuranceClaims } = useStore();

  // Mock data tailored to Long-Term Care Insurance & MSB (医疗保障局) forms
  const stats = [
    { label: '当期符合申报长者', value: '42', assist: '人已通过长护险评估', icon: ShieldPlus, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { label: '本月预计可结算额', value: '¥ 126,500', assist: '其中长护险 10.2w, 医保 2.45w', icon: Landmark, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: '上月医保局拨付率', value: '98.5%', assist: '个别材料打回已在复审', icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' }
  ];

  const pendingList = insuranceClaims.filter(c => ['资料已齐', '待医生签字'].includes(c.status));
  const auditingList = insuranceClaims.filter(c => ['医保局审核中', '部分材料需补充'].includes(c.status));
  const settledList = insuranceClaims.filter(c => c.status === '拨付到账');

  const currentList = activeTab === 'pending' ? pendingList : activeTab === 'auditing' ? auditingList : settledList;
  const filteredList = currentList.filter(item => item.name.includes(searchQuery) || item.id.includes(searchQuery));

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(true);
      toast.success("已生成医保局规范结算清单", {
        description: "预览可查阅《长护险服务提供记录表》及《结算汇总单》"
      });
    }, 2000);
  };

  const handleDownloadSingle = (id: string, name: string) => {
    toast.success(`已开始下载 ${name} 的结算明细单`, {
      description: `文件编号: ${id}`
    });
  };

  const handleExportBatch = () => {
    toast.success("已开始导出所有报表", {
      description: "包含 PDF 汇总及相关业务附件的打包下载"
    });
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">长护险与医保结算报表</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">对接地方医保局规范，自动化生成与追踪涉保对账单据</span>
        </div>
        <button 
           onClick={handleGenerateReport}
           disabled={isGenerating}
           className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
          {isGenerating ? "正在对账并生成报表..." : "生成上报结算明细单"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 shrink-0">
        {stats.map(stat => (
          <Card key={stat.label} className={`border-none shadow-sm relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10 ${stat.bg}`}></div>
            <CardContent className="p-5 relative z-10 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${stat.bg} ${stat.color} ${stat.border}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2 mb-1.5">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                </div>
                <div className="text-xs font-semibold text-slate-400">
                  {stat.assist}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex gap-1 bg-slate-100/70 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >待平台申报汇编 ({pendingList.length})</button>
            <button 
              onClick={() => setActiveTab('auditing')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'auditing' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >医保局审核中 ({auditingList.length})</button>
            <button 
              onClick={() => setActiveTab('settled')}
              className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${activeTab === 'settled' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >拨付已到账历史</button>
          </div>
          
          <div className="relative w-64">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="姓名 / 申报编号..." 
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
               className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-white"
             />
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm whitespace-nowrap hidden-scrollbar">
            <thead className="bg-slate-50 sticky top-0 z-10 before:absolute before:inset-0 before:border-b before:border-slate-200">
              <tr className="text-slate-500 font-semibold relative">
                <th className="px-6 py-4">申报编号</th>
                <th className="px-6 py-4">长者姓名</th>
                <th className="px-6 py-4">险种 / 护理定级</th>
                <th className="px-6 py-4">服务周期</th>
                <th className="px-6 py-4 text-right">有效核销天数</th>
                <th className="px-6 py-4 text-right">拟兑付金额 (元)</th>
                <th className="px-6 py-4">当前状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map(item => (
                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold text-slate-500 px-2.5 py-1 bg-slate-100 rounded border border-slate-200">
                      {item.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${item.type.includes('长护险') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {item.type}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.period}</td>
                  <td className="px-6 py-4 text-slate-600 text-right">{item.serviceDays} 天</td>
                  <td className="px-6 py-4 text-right font-black font-mono text-indigo-600 text-base">
                     ¥ {item.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                     {activeTab === 'pending' && <span className={`flex items-center gap-1.5 text-xs font-bold ${item.status === '资料已齐' ? 'text-emerald-600' : 'text-amber-600'}`}><CheckCircle2 className="w-3.5 h-3.5" /> {item.status}</span>}
                     {activeTab === 'auditing' && <span className={`flex items-center gap-1.5 text-xs font-bold ${item.status === '医保局审核中' ? 'text-blue-600' : 'text-rose-600'}`}>{item.status === '部分材料需补充' ? <AlertCircle className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />} {item.status}</span>}
                     {activeTab === 'settled' && <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500"><Landmark className="w-3.5 h-3.5" /> {item.status}</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDownloadSingle(item.id, item.name)}
                      className="text-indigo-600 hover:text-indigo-800 p-1.5 rounded hover:bg-indigo-50 transition" 
                      title="下载该账单明细"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {filteredList.length === 0 && (
                <tr>
                   <td colSpan={8} className="px-6 py-16 text-center">
                     <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                     <p className="text-slate-500 font-medium">没有找到相关申报记录</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-4xl max-h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
                 <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-800">2026年05月 长期护理保险服务费用结算明细单</h3>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={handleExportBatch}
                     className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-bold shadow-sm flex items-center gap-1.5 hover:bg-indigo-700"
                   >
                     <Download className="w-4 h-4"/> 导出 PDF 与发票附件
                   </button>
                   <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors" title="关闭预览">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                   </button>
                 </div>
              </div>
              <div className="p-6 overflow-y-auto hidden-scrollbar bg-slate-100 flex-1">
                 <div className="bg-white max-w-3xl mx-auto shadow-sm p-10 min-h-[800px] border border-slate-200">
                    <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                      <h1 className="text-2xl font-black text-slate-900 tracking-widest mb-1">XX市长期护理保险结算汇总单</h1>
                      <div className="text-sm font-bold text-slate-600">申报机构：悦年华智慧康养中心 (编码: H029311) | 申报期：2026年05月</div>
                    </div>
                    
                    <div className="mb-6">
                       <h2 className="font-bold text-slate-800 mb-2">一、 基本汇总信息</h2>
                       <table className="w-full text-sm border-collapse border border-slate-400">
                         <tbody>
                           <tr>
                              <td className="border border-slate-400 bg-slate-50 p-2 font-bold w-1/4">本期总申报人次</td>
                              <td className="border border-slate-400 p-2 w-1/4 font-mono font-medium">42 人</td>
                              <td className="border border-slate-400 bg-slate-50 p-2 font-bold w-1/4">核定总服务天数</td>
                              <td className="border border-slate-400 p-2 w-1/4 font-mono font-medium">1,245 天</td>
                           </tr>
                           <tr>
                              <td className="border border-slate-400 bg-slate-50 p-2 font-bold">申请拨付金额 (长护险)</td>
                              <td className="border border-slate-400 p-2 font-black text-indigo-700 font-mono">¥ 102,000.00</td>
                              <td className="border border-slate-400 bg-slate-50 p-2 font-bold">申请拨付金额 (医保)</td>
                              <td className="border border-slate-400 p-2 font-black text-indigo-700 font-mono">¥ 24,500.00</td>
                           </tr>
                         </tbody>
                       </table>
                    </div>
                    
                    <div className="mb-6">
                       <h2 className="font-bold text-slate-800 mb-2">二、 申报明细 (平台已落库)</h2>
                       <table className="w-full text-xs border-collapse border border-slate-400 text-center">
                          <thead className="bg-slate-50 font-bold border-b-2 border-slate-800">
                            <tr>
                              <th className="border border-slate-400 p-2 font-bold">系统流水号</th>
                              <th className="border border-slate-400 p-2 font-bold">参保人</th>
                              <th className="border border-slate-400 p-2 font-bold">医保凭据编号</th>
                              <th className="border border-slate-400 p-2 font-bold">定级档次</th>
                              <th className="border border-slate-400 p-2 font-bold">天数</th>
                              <th className="border border-slate-400 p-2 font-bold">医保拨付标价</th>
                              <th className="border border-slate-400 p-2 font-bold">合规统筹支付 (元)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-slate-400 p-2 font-mono">LTC-202605-001</td>
                              <td className="border border-slate-400 p-2 font-bold">王桂珍</td>
                              <td className="border border-slate-400 p-2 font-mono text-slate-500">110101****45</td>
                              <td className="border border-slate-400 p-2">长护险(三级)</td>
                              <td className="border border-slate-400 p-2 font-mono">31</td>
                              <td className="border border-slate-400 p-2 font-mono text-slate-600">¥ 100</td>
                              <td className="border border-slate-400 p-2 font-mono font-bold">3,100.00</td>
                            </tr>
                            <tr>
                              <td className="border border-slate-400 p-2 font-mono">LTC-202605-002</td>
                              <td className="border border-slate-400 p-2 font-bold">刘建国</td>
                              <td className="border border-slate-400 p-2 font-mono text-slate-500">110105****3X</td>
                              <td className="border border-slate-400 p-2">长护险(特级)</td>
                              <td className="border border-slate-400 p-2 font-mono">28</td>
                              <td className="border border-slate-400 p-2 font-mono text-slate-600">¥ 150</td>
                              <td className="border border-slate-400 p-2 font-mono font-bold">4,200.00</td>
                            </tr>
                            <tr className="bg-slate-50">
                              <td colSpan={7} className="border border-slate-400 p-3 font-medium text-slate-500 tracking-wider">... (系统已自动对接余下 40 条数据摘要) ...</td>
                            </tr>
                          </tbody>
                       </table>
                    </div>

                    <div className="flex justify-between items-end mt-24 text-sm font-bold text-slate-700">
                       <div className="space-y-6">
                          <p>经办科室人员复核签章: ________________________</p>
                          <p>打 印 日 期: <span className="font-mono ml-2 border-b border-slate-400 px-2">2026-06-14</span></p>
                       </div>
                       <div className="space-y-6">
                          <p>医保结算专户负责人 (签章确认): ________________________</p>
                          <p>康养机构专用章 (公章): ________________________</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
