import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { MessageSquareWarning, Search, Filter, CheckCircle2, Clock, CheckSquare, X, ArrowRight, UserPlus, FileText, Send } from "lucide-react";

export function Complaints() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const [complaints, setComplaints] = useState([
    { id: "C-20231024-01", target: "餐饮部", issue: "午餐荤菜太硬，老人咬不动", complainant: "刘建国(102房)", date: "2023-10-24 12:30", status: "pending", handler: "", feedback: "", logs: [] },
    { id: "C-20231023-02", target: "护理部", issue: "夜班护工没有按时帮忙翻身", complainant: "王淑芬家属", date: "2023-10-23 09:15", status: "processing", handler: "李护士长", feedback: "", logs: [{time: '2023-10-23 10:00', note: '已与涉事护工沟通，进行口头警告，要求增加夜间巡房频率。', operator: '李护士长'}] },
    { id: "C-20231021-01", target: "后勤部", issue: "房间空调制热效果不好", complainant: "赵大爷(305房)", date: "2023-10-21 15:40", status: "resolved", handler: "张工", feedback: "已修好，老人表示效果很满意，态度很好。", logs: [{time: '2023-10-21 16:30', note: '上门清理了空调滤网并加注了氟利昂。', operator: '张工'}, {time: '2023-10-22 09:00', note: '电话回访确认制热正常。', operator: '客服部小王'}] },
    { id: "C-20231020-03", target: "行政部", issue: "家属探视流程过于繁琐", complainant: "陈阿姨女儿", date: "2023-10-20 10:00", status: "resolved", handler: "王主任", feedback: "家属接受了解释，遵守规定。", logs: [{time: '2023-10-20 11:30', note: '向家属解释了流感高发期的临时管控政策并致谢理解。', operator: '王主任'}] },
  ]);

  const handleOpenProcess = (item: any) => {
    setSelectedComplaint(item);
    setShowProcessModal(true);
  };

  const handleOpenDetail = (item: any) => {
    setSelectedComplaint(item);
    setShowDetailModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="mb-6 flex space-x-2 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">投诉记录管理</h2>
          <span className="text-sm text-slate-500">跟踪客户不满与投诉的受理、处理与回访</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
            <MessageSquareWarning className="h-4 w-4" />
            登记新投诉
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <Card className="border-slate-200 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">待处理投诉</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{complaints.filter(c => c.status === 'pending').length}</h3>
                  <span className="text-xs text-red-500 font-medium">需紧迫响应</span>
                </div>
              </div>
            </CardContent>
         </Card>
         <Card className="border-slate-200 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">处理中投诉</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{complaints.filter(c => c.status === 'processing').length}</h3>
                  <span className="text-xs text-amber-600 font-medium">协调解决中</span>
                </div>
              </div>
            </CardContent>
         </Card>
         <Card className="border-slate-200 bg-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月已结案</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{complaints.filter(c => c.status === 'resolved').length}</h3>
                  <span className="text-xs text-emerald-600 font-medium">请关注满意度</span>
                </div>
              </div>
            </CardContent>
         </Card>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">
              投诉单列表
            </CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="单号/投诉人/内容关键字" 
                  className="pl-8 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64 bg-white shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                状态筛选
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">工单号与日期</th>
                  <th className="px-6 py-4 font-medium">投诉人</th>
                  <th className="px-6 py-4 font-medium">被诉部门/对象</th>
                  <th className="px-6 py-4 font-medium">投诉事由</th>
                  <th className="px-6 py-4 font-medium leading-none">处理状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{item.id}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.date}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      {item.complainant}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                        {item.target}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={item.issue}>
                      {item.issue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-1 ${
                        item.status === 'pending' ? 'bg-red-50 text-red-700 border border-red-100' :
                        item.status === 'processing' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }`}>
                        {item.status === 'pending' && "待指派/受理"}
                        {item.status === 'processing' && "处理中"}
                        {item.status === 'resolved' && "已结案"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'pending' || item.status === 'processing' ? (
                        <button onClick={() => handleOpenProcess(item)} className="text-white bg-emerald-600 hover:bg-emerald-700 font-medium text-xs px-3 py-1.5 rounded transition-colors shadow-sm">
                          {item.status === 'pending' ? '立即指派/受理' : '录入处理情况'}
                        </button>
                      ) : (
                        <button onClick={() => handleOpenDetail(item)} className="text-emerald-600 hover:text-emerald-800 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded hover:bg-emerald-50 transition-colors">
                          查看详情/回访
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 登记新投诉 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquareWarning className="w-5 h-5 text-red-500" />
                登记新投诉
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">投诉人/家属 *</label>
                  <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="例如：刘建国(102房)" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">接诉时间 *</label>
                  <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">投诉对象/被诉部门 *</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                    <option>护理部</option>
                    <option>餐饮部</option>
                    <option>后勤保障部</option>
                    <option>行政综合部</option>
                    <option>医疗康复组</option>
                    <option>特定员工</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">投诉渠道</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                    <option>前台现场</option>
                    <option>电话投诉</option>
                    <option>微信公众号/小程序</option>
                    <option>信箱留言</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">详细投诉事由 *</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 min-h-[100px]" 
                    placeholder="请详细描述投诉发生的时间、地点、涉及人员及具体不满的原因..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                取消
              </button>
               <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm">
                生成投诉单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 处理/指派 Modal */}
      {showProcessModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                投诉受理与处理 
                <span className="text-xs px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md font-normal shadow-sm">
                  {selectedComplaint.id}
                </span>
              </h3>
              <button onClick={() => setShowProcessModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto flex">
               {/* 左侧：投诉详情与流转历史 */}
               <div className="w-1/2 p-5 border-r border-slate-100">
                 <div className="mb-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-2">投诉内容记录</h4>
                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4 text-sm">
                       <p className="text-slate-800 mb-3">{selectedComplaint.issue}</p>
                       <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 border-t border-amber-100 pt-3">
                         <div><span className="text-slate-400">投诉人:</span> {selectedComplaint.complainant}</div>
                         <div><span className="text-slate-400">时间:</span> {selectedComplaint.date}</div>
                         <div><span className="text-slate-400">被诉方:</span> {selectedComplaint.target}</div>
                       </div>
                    </div>
                 </div>

                 <div>
                   <h4 className="text-sm font-bold text-slate-700 mb-3">处理轨道</h4>
                   <div className="space-y-4 pr-2">
                     <div className="relative pl-4 border-l-2 border-emerald-500">
                        <div className="absolute -left-[5px] w-2 h-2 bg-emerald-500 rounded-full top-1.5"></div>
                        <div className="text-xs text-emerald-600 font-medium mb-1">{selectedComplaint.date}</div>
                        <div className="text-sm text-slate-700">客服中心已登记，生成投诉工单。</div>
                     </div>
                     {selectedComplaint.logs.map((log: any, idx: number) => (
                       <div key={idx} className="relative pl-4 border-l-2 border-slate-200">
                          <div className="absolute -left-[5px] w-2 h-2 bg-slate-300 rounded-full top-1.5"></div>
                          <div className="text-xs text-slate-400 mb-1">{log.time} - {log.operator}</div>
                          <div className="text-sm text-slate-700">{log.note}</div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>

               {/* 右侧：录入处理动作 */}
               <div className="w-1/2 p-5 bg-slate-50 flex flex-col">
                  {selectedComplaint.status === 'pending' && (
                    <div className="space-y-4 flex-1">
                       <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                         <UserPlus className="w-4 h-4 text-blue-500" />
                         指派处理负责人
                       </h4>
                       <p className="text-xs text-slate-500 mb-4">将此投诉分发给对应部门或人员进行核实与解决。</p>
                       
                       <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 block">选择负责人</label>
                          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                            <option>护理部主管</option>
                            <option>餐饮厨师长</option>
                            <option>后勤维修组</option>
                          </select>
                       </div>
                       <div className="space-y-1.5 pt-2">
                          <label className="text-sm font-medium text-slate-700 block">指派说明/要求时效</label>
                          <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 min-h-[80px]" placeholder="例如：请在24小时内核实情况并给予答复。"></textarea>
                       </div>
                    </div>
                  )}

                  {selectedComplaint.status === 'processing' && (
                    <div className="space-y-4 flex-1">
                       <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                         <FileText className="w-4 h-4 text-emerald-500" />
                         录入处理进展/结果
                       </h4>
                       <p className="text-xs text-slate-500 mb-4">记录当前的协调结果或最终处理方案。</p>
                       
                       <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700 block">处理情况描述 *</label>
                          <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 min-h-[120px]" placeholder="详细记录已采取的解决措施、与家属沟通情况等..."></textarea>
                       </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-slate-200">
                     {selectedComplaint.status === 'pending' ? (
                        <button onClick={() => setShowProcessModal(false)} className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                          确认指派并变更为"处理中"
                        </button>
                     ) : (
                        <div className="flex gap-2">
                          <button onClick={() => setShowProcessModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                            仅保存进展
                          </button>
                          <button onClick={() => setShowProcessModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                            问题已解决, 扭转状态
                          </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 详情及回访反馈 Modal */}
      {showDetailModal && selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 历史投诉卷宗 
                 <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                   已结案
                 </span>
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
               <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                     <div><span className="text-slate-400 block mb-1">工单编号</span> {selectedComplaint.id}</div>
                     <div><span className="text-slate-400 block mb-1">投诉人</span> <span className="font-medium text-slate-800">{selectedComplaint.complainant}</span></div>
                     <div><span className="text-slate-400 block mb-1">被诉方</span> {selectedComplaint.target}</div>
                     <div><span className="text-slate-400 block mb-1">接诉时间</span> {selectedComplaint.date}</div>
                     <div className="col-span-2">
                        <span className="text-slate-400 block mb-1">核心事由</span> 
                        <div className="text-slate-700 bg-red-50/50 p-3 rounded-lg border border-red-100/50 leading-relaxed font-medium">
                           {selectedComplaint.issue}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mb-5">
                  <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">处理全记录</h4>
                  <div className="space-y-4 pl-1">
                     {selectedComplaint.logs.map((log: any, idx: number) => (
                       <div key={idx} className="relative pl-4 border-l-2 border-emerald-200">
                          <div className="absolute -left-[5px] w-2 h-2 bg-emerald-400 rounded-full top-1.5"></div>
                          <div className="text-xs text-slate-500 mb-1 flex items-center justify-between">
                            <span>{log.time}</span>
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{log.operator}</span>
                          </div>
                          <div className="text-sm text-slate-700">{log.note}</div>
                       </div>
                     ))}
                  </div>
               </div>

               <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-200 pb-2">客户回访与满意度</h4>
                  {selectedComplaint.feedback ? (
                     <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
                       <div className="font-bold mb-1 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> 客户已认可解决方案</div>
                       <p className="text-green-700">{selectedComplaint.feedback}</p>
                     </div>
                  ) : (
                     <div className="bg-white border border-slate-200 rounded-lg p-4">
                       <label className="text-xs font-medium text-slate-600 block mb-2">录入回访情况 (如客户已满意)</label>
                       <textarea className="w-full border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="填写电话回访或当面回访的结果，如老人及家属的态度..."></textarea>
                       <div className="flex justify-end mt-3">
                         <button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 px-3 rounded shadow-sm">
                            <Send className="w-3 h-3" /> 保存回访记录
                         </button>
                       </div>
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

