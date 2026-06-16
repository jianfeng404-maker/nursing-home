import React, { useState, useEffect } from "react";
import { Activity, Plus, Search, Calendar, User, FileText, CheckCircle2, UserPlus, Clock, X, Dumbbell } from "lucide-react";
import { toast } from "sonner";
import { ElderLink } from "../components/ElderLink";
import { useStore } from "../store";

export function RehabPlan() {
  const [activeTab, setActiveTab] = useState("plans");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showAssessModal, setShowAssessModal] = useState(false);
  const [globalPlans, setGlobalPlans] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/rehab_plans', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setGlobalPlans(data.map((r: any) => ({
            id: r.id.toString(),
            elder: r.elderName || '未知',
            room: '--',
            desc: r.description,
            therapist: r.therapist,
            progress: r.progress,
            status: r.progress === 100 ? '已完成' : '进行中'
          })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlans();
  }, []);

  const globalTasks = useStore(state => state.tasks);
  const addTask = useStore(state => state.addTask);
  const updateTaskStatus = useStore(state => state.updateTaskStatus);

  const tasks = globalTasks.filter(t => t.type === 'rehab').map(t => ({
    id: t.id,
    time: t.time,
    plan: "RP2026-" + t.id.padStart(3, '0'), // mock back if needed, or simply empty
    elder: t.elder,
    type: "理疗",
    content: t.name,
    status: t.status === 'pending' ? '待执行' : t.status === 'in_progress' ? '进行中' : '已完成'
  }));

  const startTask = (id: string) => {
    updateTaskStatus(id, "in_progress");
    toast.success("任务已开始执行");
  };

  const completeTask = (id: string) => {
    updateTaskStatus(id, "completed");
    toast.success("任务已完成");
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">康复理疗计划与执行</h1>
          <p className="text-slate-500 mt-1">为长者制定个性化康复方案，跟踪理疗项目进度。</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            新建康复计划
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex px-4 border-b border-slate-100 shrink-0 justify-between items-center">
          <div>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "plans" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              onClick={() => setActiveTab("plans")}
            >
              康复方案管理
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "tasks" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
              onClick={() => setActiveTab("tasks")}
            >
              理疗任务看板
            </button>
          </div>
          {activeTab === "tasks" && (
            <button 
              onClick={() => {
                const newTasks: any[] = [
                  { id: `${Date.now()}-1`, name: "髋关节超声波治疗", elder: "刘建国 (A栋-102)", time: "10:30", staff: '李医师', status: "pending", type: "rehab" },
                  { id: `${Date.now()}-2`, name: "记忆力与认知沙盘", elder: "王秀兰 (B栋-305)", time: "15:30", staff: '王康复', status: "pending", type: "rehab" }
                ];
                newTasks.forEach(t => addTask(t));
                toast.success("已根据在途康复方案的频次规则，自动排程今日新增任务！");
              }}
              className="text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              智能生成今日排程
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {activeTab === "plans" ? (
             <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr className="text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">方案编号</th>
                  <th className="px-6 py-4 font-medium">服务对象</th>
                  <th className="px-6 py-4 font-medium">方案目标</th>
                  <th className="px-6 py-4 font-medium">主理人</th>
                  <th className="px-6 py-4 font-medium">进度</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {globalPlans.map(plan => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition-colors text-sm">
                     <td className="px-6 py-4 font-mono text-slate-500">{plan.id}</td>
                     <td className="px-6 py-4 font-bold text-slate-800"><ElderLink text={plan.elder} id="E001" className="text-blue-600 hover:underline" /> <span className="text-xs text-slate-400 font-normal ml-1">({plan.room})</span></td>
                     <td className="px-6 py-4 text-slate-600">{plan.desc}</td>
                     <td className="px-6 py-4 text-slate-600">{plan.therapist}</td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${plan.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${plan.progress}%` }}></div>
                           </div>
                           <span className="text-xs text-slate-500 font-medium">{plan.progress}%</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${plan.status === '进行中' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{plan.status}</span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedPlan(plan)} className="text-indigo-600 hover:text-indigo-800 font-medium">详情与评估</button>
                     </td>
                  </tr>
                ))}
              </tbody>
             </table>
          ) : (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
               <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> 待执行 ({tasks.filter(t => t.status === '待执行').length})</h3>
                  <div className="space-y-3">
                     {tasks.filter(t => t.status === '待执行').map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{task.time}</span>
                              <span className="text-xs text-slate-400 font-mono">{task.plan}</span>
                           </div>
                           <div className="font-bold text-slate-800 flex items-center gap-2 mb-1"><User className="w-4 h-4 text-indigo-500"/> {task.elder}</div>
                           <div className="text-sm text-slate-600 mb-3"><span className="font-medium text-slate-700">{task.type}:</span> {task.content}</div>
                           <div className="flex justify-end gap-2">
                              <button onClick={() => startTask(task.id)} className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-3 py-1.5 rounded transition">开始执行</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-sky-500"/> 执行中 ({tasks.filter(t => t.status === '进行中').length})</h3>
                  <div className="space-y-3">
                     {tasks.filter(t => t.status === '进行中').map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-lg border border-sky-200 shadow-sm relative overflow-hidden">
                           <div className="absolute top-0 left-0 w-1 h-full bg-sky-400"></div>
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded animate-pulse">{task.time}</span>
                              <span className="text-xs text-slate-400 font-mono">{task.plan}</span>
                           </div>
                           <div className="font-bold text-slate-800 flex items-center gap-2 mb-1"><User className="w-4 h-4 text-sky-600"/> {task.elder}</div>
                           <div className="text-sm text-slate-600 mb-3"><span className="font-medium text-slate-700">{task.type}:</span> {task.content}</div>
                           <div className="flex justify-end gap-2">
                              <button onClick={() => completeTask(task.id)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded transition flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> 完成</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-200 h-full">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 已完成/归档 ({tasks.filter(t => t.status === '已完成').length})</h3>
                  <div className="space-y-3">
                     {tasks.filter(t => t.status === '已完成').map(task => (
                        <div key={task.id} className="bg-slate-100 p-4 rounded-lg border border-slate-200 shadow-sm opacity-70">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold bg-slate-200 text-slate-500 px-2 py-0.5 rounded line-through">{task.time}</span>
                              <span className="text-xs text-slate-400 font-mono">{task.plan}</span>
                           </div>
                           <div className="font-bold text-slate-600 flex items-center gap-2 mb-1"><User className="w-4 h-4 text-slate-400"/> {task.elder}</div>
                           <div className="text-sm text-slate-500"><span className="font-medium text-slate-600">{task.type}:</span> {task.content}</div>
                        </div>
                     ))}
                     {tasks.filter(t => t.status === '已完成').length === 0 && (
                       <div className="text-center text-slate-400 text-sm py-8">暂无已完成的任务</div>
                     )}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-2xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0">
               <h3 className="text-xl font-black text-slate-800">新建康复方案</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
                 x 
               </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">目标长者 <span className="text-red-500">*</span></label>
                    <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow">
                       <option>请选择...</option>
                       <option>张伟明 (A栋-201)</option>
                       <option>刘建国 (A栋-102)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">主要康复目标 <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="例如：恢复右下肢行走功能" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">理疗师与执行人</label>
                       <input type="text" placeholder="医师姓名" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 mb-1">预计周期</label>
                       <input type="text" placeholder="包含时长，如：3个月" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>
                 </div>
                 <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                       <Activity className="w-4 h-4 text-indigo-500"/>
                       理疗项目与执行频次规则
                    </h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                       <div className="grid grid-cols-12 gap-3">
                          <div className="col-span-12 md:col-span-6">
                             <label className="block text-xs font-bold text-slate-500 mb-1">项目名称</label>
                             <input type="text" placeholder="例如：平衡步态训练" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500" />
                          </div>
                          <div className="col-span-6 md:col-span-3">
                             <label className="block text-xs font-bold text-slate-500 mb-1">执行频次</label>
                             <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500">
                                <option>每天一次</option>
                                <option>每天两次</option>
                                <option>每周三次</option>
                                <option>每周两次</option>
                                <option>每周一次</option>
                                <option>工作日执行</option>
                             </select>
                          </div>
                          <div className="col-span-6 md:col-span-3">
                             <label className="block text-xs font-bold text-slate-500 mb-1">每次时长(分钟)</label>
                             <input type="number" defaultValue="30" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-indigo-500" />
                          </div>
                       </div>
                       <div className="flex justify-end">
                           <button className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">
                              + 添加项目
                           </button>
                       </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">系统将根据此处设定的频次规则，自动排程每日的理疗任务并发送至工作看板。</p>
                 </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 shrink-0">
               <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">取消</button>
               <button onClick={() => {toast.success("康复方案已创建并开启派单"); setShowAddModal(false)}} className="px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm">提交并生成任务</button>
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-3xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white sticky top-0 z-10 shrink-0">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg"><Activity className="w-5 h-5" /></div>
                 <div>
                   <h3 className="text-xl font-bold">{selectedPlan.id} 康复评定方案</h3>
                   <div className="text-sm text-indigo-100 mt-0.5 flex items-center gap-2">
                     <span className="font-bold">{selectedPlan.elder}</span>
                     <span>|</span>
                     <span>{selectedPlan.room}</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setSelectedPlan(null)} className="text-indigo-100 hover:bg-indigo-700 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 grid grid-cols-4 gap-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">主要目标</div>
                  <div className="font-bold text-slate-800 text-sm">{selectedPlan.desc}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">理疗师</div>
                  <div className="font-bold text-slate-800 text-sm">{selectedPlan.therapist}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">执行状态</div>
                  <div className={`font-bold text-sm ${selectedPlan.status === '进行中' ? 'text-amber-600' : 'text-emerald-600'}`}>{selectedPlan.status}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">完成进度</div>
                  <div className="flex items-center gap-2">
                     <div className="w-full bg-slate-200 rounded-full h-2">
                       <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${selectedPlan.progress}%` }}></div>
                     </div>
                     <span className="text-sm font-bold text-indigo-700">{selectedPlan.progress}%</span>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">理疗项目清单</h4>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Dumbbell className="w-5 h-5"/></div>
                    <div>
                       <div className="font-bold text-slate-700 text-sm">下肢肌力训练</div>
                       <div className="text-xs text-slate-500 mt-0.5">每周3次 / 每次30分钟 / 共12周</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">18 / 36 次</div>
                    <div className="text-xs text-amber-500 mt-0.5">进行中</div>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 border border-slate-200 rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Activity className="w-5 h-5"/></div>
                    <div>
                       <div className="font-bold text-slate-700 text-sm">平衡步态训练</div>
                       <div className="text-xs text-slate-500 mt-0.5">每周2次 / 每次20分钟 / 共12周</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-slate-700">12 / 24 次</div>
                    <div className="text-xs text-amber-500 mt-0.5">进行中</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3 text-sm">阶段性评估意见 (中期)</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  长者配合度较高，右下肢肌力已从2级恢复至3级，能够独立完成床边站立。建议下周开始引入平行杠内平地步行训练，继续加强心肺耐力。
                </p>
                <div className="mt-3 text-xs text-slate-400">理疗师：{selectedPlan.therapist} / 评估时间：2026-06-05</div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 shrink-0">
               <button onClick={() => setShowAssessModal(true)} className="px-5 py-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors">填写新评估</button>
               <button onClick={() => setSelectedPlan(null)} className="px-5 py-2 text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">关闭</button>
            </div>
          </div>
        </div>
      )}

      {showAssessModal && selectedPlan && (
        <div className="fixed inset-0 z-[60] flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-2xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0">
               <h3 className="text-xl font-black text-slate-800">填写随访与阶段评估</h3>
               <button onClick={() => setShowAssessModal(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5"/> 
               </button>
            </div>
            <div className="p-6 space-y-5">
               <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex gap-3 items-center">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <div>
                    <div className="text-sm font-bold text-slate-800">{selectedPlan.id} | {selectedPlan.elder} 的康复评估</div>
                    <div className="text-xs text-slate-500">{selectedPlan.desc}</div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">评估类型</label>
                     <select className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                        <option>中期阶段评估</option>
                        <option>日常康复随访</option>
                        <option>结案/终期评估</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">评估时间</label>
                     <input type="date" defaultValue="2026-06-09" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                  </div>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">评估情况详述</label>
                  <textarea rows={4} placeholder="描述长者的肌力、平衡、关节活动度及配合情况等" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"></textarea>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">下一步建议与方案调整</label>
                  <textarea rows={3} placeholder="例：建议下周开始平行杠内起步训练..." className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"></textarea>
               </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 shrink-0">
               <button onClick={() => setShowAssessModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">取消</button>
               <button onClick={() => {toast.success("评估记录已保存并归档至健康档案"); setShowAssessModal(false);}} className="px-5 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm">提交评估</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
