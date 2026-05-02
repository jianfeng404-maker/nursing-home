import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { UserPlus, Search, ClipboardList, Bed, FileText, CreditCard, CheckCircle2, User, X, ArrowRight, ShieldAlert, PiggyBank, ReceiptText } from "lucide-react";

export function AdmissionRecord() {
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedAdmit, setSelectedAdmit] = useState<any>(null);
  const [activeStepId, setActiveStepId] = useState<string>('info');

  const [admissions, setAdmissions] = useState([
    { id: "ADM-20231102-01", name: "张明宇", assessmentLevel: "二级护理", family: "张小强", phone: "13800138000", idCard: "1101051945XXXXXXXX", status: "processing", progress: { info: true, bed: true, contract: false, payment: false } },
    { id: "ADM-20231030-01", name: "李秀红", assessmentLevel: "认知症专护", family: "王芳", phone: "13900139000", idCard: "1101081950XXXXXXXX", status: "pending", progress: { info: false, bed: false, contract: false, payment: false } },
    { id: "ADM-20231028-02", name: "王大山", assessmentLevel: "自理", family: "王建国", phone: "13700137000", idCard: "1101011940XXXXXXXX", status: "completed", progress: { info: true, bed: true, contract: true, payment: true }, roombed: "B栋-302-01" },
  ]);

  const stepsList = [
    { id: 'info', label: '基础信息核对', icon: User },
    { id: 'bed', label: '分配床位', icon: Bed },
    { id: 'contract', label: '电子合同签署', icon: FileText },
    { id: 'payment', label: '初始费用缴纳', icon: CreditCard }
  ];

  const handleOpenProcess = (record: any) => {
    setSelectedAdmit({...record});
    const nextStep = stepsList.find(s => !record.progress[s.id])?.id || 'payment';
    // If all true, we shouldn't show the wizard usually or we can show 'completed' state.
    // Assuming status === 'completed', we handle it in render.
    setActiveStepId(nextStep);
    setShowProcessModal(true);
  };

  const getProgressPercentage = (progress: any) => {
    const total = Object.keys(progress).length || 4;
    const completed = Object.values(progress).filter(Boolean).length;
    return (completed / total) * 100;
  };

  const handleCompleteStep = (stepId: string) => {
    const updatedProgress = { ...selectedAdmit.progress, [stepId]: true };
    const updatedStatus = stepsList.every(s => updatedProgress[s.id]) ? 'completed' : 'processing';
    
    const updatedAdmit = {
        ...selectedAdmit,
        progress: updatedProgress,
        status: updatedStatus
    };
    
    setSelectedAdmit(updatedAdmit);
    setAdmissions(prev => prev.map(a => a.id === updatedAdmit.id ? updatedAdmit : a));

    const idx = stepsList.findIndex(s => s.id === stepId);
    if (idx < stepsList.length - 1) {
        setActiveStepId(stepsList[idx + 1].id);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">入院初评与办理</h1>
          <span className="text-sm font-medium text-slate-500">串联长者入院前的信息录入、床位分配、合同签订与初始缴费</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 shrink-0">
        <Card className="border-slate-200 bg-blue-50/50 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
               <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">待办理入院</p>
              <h3 className="text-2xl font-black text-slate-800">{admissions.filter(a => a.status === 'pending').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-amber-50/50 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
               <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">办理中</p>
              <h3 className="text-2xl font-black text-slate-800">{admissions.filter(a => a.status === 'processing').length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-emerald-50/50 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">已入驻(本月)</p>
              <h3 className="text-2xl font-black text-slate-800">{admissions.filter(a => a.status === 'completed').length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-slate-800">
            办理工作台账
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="搜索长者姓名..." 
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow bg-white"
            />
          </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 z-10">
              <tr className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                <th className="px-6 py-4">长者姓名</th>
                <th className="px-6 py-4">评估评级</th>
                <th className="px-6 py-4">入院办理进度</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {admissions.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold shrink-0">
                        {item.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">家属: {item.family}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{item.assessmentLevel}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="flex-1 max-w-[120px] bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                           <div 
                              className={`h-full rounded-full transition-all duration-500 ${getProgressPercentage(item.progress) === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                              style={{ width: `${getProgressPercentage(item.progress)}%` }}
                           ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500 w-8">{Math.round(getProgressPercentage(item.progress))}%</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap ${
                      item.status === 'pending' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      item.status === 'processing' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                      'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {item.status === 'pending' && "等待办理"}
                      {item.status === 'processing' && "办理中"}
                      {item.status === 'completed' && "入驻成功"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'completed' ? (
                       <button className="text-slate-600 font-bold text-xs border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm whitespace-nowrap">
                        查看入驻单
                      </button>
                    ) : (
                      <button onClick={() => handleOpenProcess(item)} className="text-white bg-blue-600 hover:bg-blue-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-sm whitespace-nowrap">
                        继续办理
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 办理流程 Modal */}
      {showProcessModal && selectedAdmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white shrink-0">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                 新长者入院办理 
                 <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">长者：{selectedAdmit.name}</span>
              </h3>
              <button onClick={() => setShowProcessModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-1 overflow-hidden bg-slate-50/50">
               {/* 左侧向导导航 */}
               <div className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col gap-1 shrink-0 overflow-y-auto">
                  {stepsList.map((step, idx) => {
                     const isComplete = selectedAdmit.progress[step.id];
                     const isActive = activeStepId === step.id && selectedAdmit.status !== 'completed';
                     return (
                      <div key={step.id} className="relative py-1">
                        {idx !== stepsList.length - 1 && (
                            <div className={`absolute left-[1.35rem] top-10 w-0.5 h-6 z-0 ${isComplete ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                        )}
                        <button 
                            disabled={!isComplete && !isActive && (idx > 0 && !selectedAdmit.progress[stepsList[idx-1].id])}
                            onClick={() => setActiveStepId(step.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left relative z-10 transition-all ${
                                isActive ? 'bg-blue-50 border border-blue-200 shadow-sm' : 
                                isComplete ? 'hover:bg-slate-50' : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                              isComplete ? 'bg-emerald-500 text-white' : 
                              isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}>
                             {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                          </div>
                          <span className={`text-sm font-bold ${isActive ? 'text-blue-900' : isComplete ? 'text-slate-700' : 'text-slate-400'}`}>{step.label}</span>
                        </button>
                      </div>
                     );
                  })}
               </div>
               
               {/* 右侧办理内容区域 */}
               <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
                 {selectedAdmit.status === 'completed' ? (
                    <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto animate-in slide-in-from-bottom-4 duration-500 fade-in">
                       <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                           <CheckCircle2 className="w-10 h-10" />
                       </div>
                       <h3 className="text-2xl font-black text-slate-800 mb-3">长者入驻办理已完成</h3>
                       <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">入住流程全部结束。系统已自动同步该订单产生的账单流水至财务中心，请相关财务人员核对。并向护理、后勤等部门分发了待办工作。</p>
                       <button onClick={() => setShowProcessModal(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-md">
                         完成并关闭窗口
                       </button>
                    </div>
                 ) : (
                    <div className="max-w-2xl mx-auto animate-in slide-in-from-right-4 duration-300 fade-in">
                       {/* Step 1: Info */}
                       {activeStepId === 'info' && (
                           <div className="space-y-6">
                               <div>
                                 <h2 className="text-2xl font-black text-slate-800 mb-2">核对长者基础资料</h2>
                                 <p className="text-sm font-medium text-slate-500">请核实系统带入的评估信息及长者基本情况，如有错漏请在评估系统中修改。</p>
                               </div>
                               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                   <div className="grid grid-cols-2 gap-y-6 flex-wrap">
                                      <div>
                                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">长者姓名</div>
                                          <div className="font-bold text-slate-800 text-base">{selectedAdmit.name}</div>
                                      </div>
                                      <div>
                                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">身份证号</div>
                                          <div className="font-bold font-mono text-slate-800 text-base">{selectedAdmit.idCard}</div>
                                      </div>
                                      <div>
                                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">照护评估级别</div>
                                          <div className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block text-sm">{selectedAdmit.assessmentLevel}</div>
                                      </div>
                                      <div>
                                          <div className="text-xs font-bold text-slate-400 uppercase mb-1">既往病史标记</div>
                                          <div className="font-bold text-slate-800 text-sm">高血压(二级)、陈旧性骨折</div>
                                      </div>
                                      <div className="col-span-2 pt-4 border-t border-slate-100">
                                          <div className="text-xs font-bold text-slate-400 uppercase mb-2">主要紧急联系人 (家属)</div>
                                          <div className="flex items-center gap-6">
                                              <div>
                                                  <span className="text-slate-500 text-sm mr-2">姓名:</span>
                                                  <span className="font-bold text-slate-800">{selectedAdmit.family}</span>
                                              </div>
                                              <div>
                                                  <span className="text-slate-500 text-sm mr-2">电话:</span>
                                                  <span className="font-bold font-mono text-slate-800">{selectedAdmit.phone}</span>
                                              </div>
                                          </div>
                                      </div>
                                   </div>
                               </div>
                               <div className="flex justify-end gap-3 pt-4">
                                  <button onClick={() => handleCompleteStep('info')} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95">
                                    核对无误，前往分配床位 <ArrowRight className="w-4 h-4" />
                                  </button>
                               </div>
                           </div>
                       )}

                       {/* Step 2: Bed */}
                       {activeStepId === 'bed' && (
                           <div className="space-y-6">
                               <div>
                                 <h2 className="text-2xl font-black text-slate-800 mb-2">为长者分配床位</h2>
                                 <p className="text-sm font-medium text-slate-500">基于长者的【{selectedAdmit.assessmentLevel}】评估结果，我们为您推荐以下可用床位区域。</p>
                               </div>
                               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                                   <div>
                                       <label className="text-xs font-bold text-slate-800 uppercase block mb-2">楼栋及护理区划选择</label>
                                       <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm">
                                           <option>A栋 - 常规护理区 (空余: 12床)</option>
                                           <option>B栋 - 康复专区 (空余: 3床)</option>
                                           <option>C栋 - 认知症专区 (空余: 5床)</option>
                                       </select>
                                   </div>
                                   <div>
                                       <label className="text-xs font-bold text-slate-800 uppercase block mb-2">具体房间及床位</label>
                                       <div className="grid grid-cols-2 gap-3">
                                           <label className="border border-blue-500 bg-blue-50/50 rounded-xl p-4 cursor-pointer relative overflow-hidden">
                                               <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500 text-white rounded-bl-xl flex items-center justify-center shrink-0">
                                                   <CheckCircle2 className="w-4 h-4" />
                                               </div>
                                               <div className="font-black text-slate-800 text-lg mb-1">A栋203-1床</div>
                                               <div className="text-xs text-slate-500 font-medium">朝南 / 双人间</div>
                                               <div className="mt-3 text-sm font-bold text-blue-700">￥3,000 / 月</div>
                                           </label>
                                           <label className="border border-slate-200 hover:border-slate-300 bg-white rounded-xl p-4 cursor-pointer relative transition-colors">
                                               <div className="font-black text-slate-800 text-lg mb-1">A栋203-2床</div>
                                               <div className="text-xs text-slate-500 font-medium">朝北 / 双人间</div>
                                               <div className="mt-3 text-sm font-bold text-slate-600">￥2,800 / 月</div>
                                           </label>
                                       </div>
                                   </div>
                               </div>
                               <div className="flex justify-end gap-3 pt-4">
                                  <button onClick={() => handleCompleteStep('bed')} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95">
                                    确认分配，前往签署合同 <ArrowRight className="w-4 h-4" />
                                  </button>
                               </div>
                           </div>
                       )}

                       {/* Step 3: Contract */}
                       {activeStepId === 'contract' && (
                           <div className="space-y-6">
                               <div>
                                 <h2 className="text-2xl font-black text-slate-800 mb-2">生成服务合同</h2>
                                 <p className="text-sm font-medium text-slate-500">根据评估级别和选定床位，自动生成标准养老服务合同及附属协议。</p>
                               </div>
                               <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                                 <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 border border-slate-100 p-4 rounded-xl">
                                    <div><span className="text-slate-500 font-medium">长者：</span> <span className="font-bold">{selectedAdmit.name}</span></div>
                                    <div><span className="text-slate-500 font-medium">身份证号：</span> <span className="font-bold font-mono">{selectedAdmit.idCard}</span></div>
                                    <div><span className="text-slate-500 font-medium">选定床位：</span> <span className="font-bold text-blue-700">A栋203-1床</span></div>
                                    <div><span className="text-slate-500 font-medium">照护级别：</span> <span className="font-bold text-emerald-700">{selectedAdmit.assessmentLevel}</span></div>
                                 </div>
                                 <div>
                                   <label className="text-sm font-bold text-slate-800 block mb-3">选择并确认必须签订的协议文档</label>
                                   <div className="space-y-3">
                                      <label className="flex items-center p-4 border-2 border-emerald-500 bg-emerald-50/20 rounded-xl cursor-pointer shadow-sm">
                                         <input type="checkbox" className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" defaultChecked disabled />
                                         <span className="ml-3 font-bold text-slate-800">标准机构养老服务合同 (主合同)</span>
                                      </label>
                                      <label className="flex items-center p-4 border-2 border-emerald-500 bg-emerald-50/20 rounded-xl cursor-pointer shadow-sm">
                                         <input type="checkbox" className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" defaultChecked disabled />
                                         <span className="ml-3 font-bold text-slate-800">医疗与意外免责及授权协议书</span>
                                      </label>
                                      <label className="flex items-center p-4 border-2 border-slate-200 hover:border-slate-300 bg-white rounded-xl cursor-pointer transition-colors">
                                         <input type="checkbox" className="w-5 h-5 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
                                         <span className="ml-3 font-bold text-slate-700">认知症专护服务特殊管理告知书 (可选)</span>
                                      </label>
                                   </div>
                                 </div>
                               </div>

                               <div className="flex justify-end gap-3 pt-4">
                                  <button onClick={() => handleCompleteStep('contract')} className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95">
                                     验证指纹并电子签名 <ArrowRight className="w-4 h-4" />
                                  </button>
                               </div>
                           </div>
                       )}

                       {/* Step 4: Payment */}
                       {activeStepId === 'payment' && (
                           <div className="space-y-6">
                               <div>
                                 <h2 className="text-2xl font-black text-slate-800 mb-2">收缴初始费用</h2>
                                 <p className="text-sm font-medium text-slate-500">入住前需一次性缴纳押金及首月预收费用，<span className="text-rose-600 font-bold">缴费记录将自动同步至财务台账</span>。</p>
                               </div>
                               <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                 <div className="bg-slate-50 border-b border-slate-100 p-4 shrink-0 flex items-center gap-2 text-slate-700 font-bold">
                                    <ReceiptText className="w-5 h-5 text-slate-400" /> 入账费用预估清单
                                 </div>
                                 <div className="p-0">
                                   <table className="w-full text-sm text-left">
                                      <thead className="bg-slate-100/50 text-xs text-slate-500 uppercase">
                                         <tr>
                                             <th className="px-5 py-3 font-bold">缴费项目名目</th>
                                             <th className="px-5 py-3 font-bold">费用类型</th>
                                             <th className="px-5 py-3 text-right font-bold">应缴金额</th>
                                         </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                         <tr>
                                             <td className="px-5 py-4 font-bold text-slate-800">医疗及突发事件紧急备用金</td>
                                             <td className="px-5 py-4"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">资金池</span></td>
                                             <td className="px-5 py-4 text-right font-mono font-bold text-slate-700">¥ 10,000.00</td>
                                         </tr>
                                         <tr>
                                             <td className="px-5 py-4 font-bold text-slate-800">入住设施损毁押金</td>
                                             <td className="px-5 py-4"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">资金池</span></td>
                                             <td className="px-5 py-4 text-right font-mono font-bold text-slate-700">¥ 50,000.00</td>
                                         </tr>
                                         <tr>
                                             <td className="px-5 py-4 font-bold text-slate-800">首月基础床位费 (含水电设备)</td>
                                             <td className="px-5 py-4"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">服务营收</span></td>
                                             <td className="px-5 py-4 text-right font-mono font-bold text-slate-700">¥ 3,000.00</td>
                                         </tr>
                                         <tr>
                                             <td className="px-5 py-4 font-bold text-slate-800">首月专业照护费 ({selectedAdmit.assessmentLevel})</td>
                                             <td className="px-5 py-4"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">服务营收</span></td>
                                             <td className="px-5 py-4 text-right font-mono font-bold text-slate-700">¥ 2,500.00</td>
                                         </tr>
                                         <tr className="bg-slate-50/80">
                                             <td className="px-5 py-4 font-bold text-slate-800" colSpan={2}>
                                                 总计应收
                                                 <div className="text-[10px] font-normal text-slate-500 mt-1 flex items-center gap-1">
                                                     <ShieldAlert className="w-3 h-3 text-amber-500" />
                                                     资金池流水将自动触发【押金/备用金台账】新建档案
                                                 </div>
                                             </td>
                                             <td className="px-5 py-4 text-right font-mono font-black text-rose-600 text-xl">
                                                 ¥ 65,500.00
                                             </td>
                                         </tr>
                                      </tbody>
                                   </table>
                                 </div>
                               </div>

                               <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 p-4 rounded-xl mt-4">
                                   <div className="text-sm font-bold text-blue-800 flex items-center gap-2">
                                       支付方式
                                   </div>
                                   <div className="flex gap-2">
                                       <label className="flex items-center justify-center p-2 border-2 border-emerald-500 bg-white rounded-lg cursor-pointer w-24">
                                           <span className="text-xs font-bold text-emerald-700">微信/支付宝</span>
                                       </label>
                                       <label className="flex items-center justify-center p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg cursor-pointer w-24">
                                           <span className="text-xs font-bold text-slate-600">银联刷卡</span>
                                       </label>
                                   </div>
                               </div>

                               <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                                  <button onClick={() => handleCompleteStep('payment')} className="px-8 py-3 text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95">
                                     代签收首笔款项并建账 <CheckCircle2 className="w-5 h-5" />
                                  </button>
                               </div>
                           </div>
                       )}
                    </div>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
