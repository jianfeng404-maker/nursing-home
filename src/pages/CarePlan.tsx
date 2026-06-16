import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, Filter, Users, Target, Activity, Settings2, Calendar, X, FileSignature, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../store";
import { ElderLink } from "../components/ElderLink";

interface CarePlanProps {
  setActiveTab?: (tab: string) => void;
  embedded?: boolean;
  elderId?: string | null;
}

export function CarePlan({ setActiveTab: setAppTab, embedded, elderId }: CarePlanProps) {
  const { addTask, elders, careLevels, serviceItems, carePlans: allPlans, addCarePlan } = useStore();
  const [activeTab, setActiveTab] = useState('active');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const plans = embedded && elderId 
    ? allPlans.filter(p => p.elderId === elderId)
    : allPlans;

  const [newPlan, setNewPlan] = useState({
    elderId: elders[0]?.id || '',
    careLevelId: careLevels[0]?.id || '',
    goal: '',
    nextReview: '',
    manager: '当前登录用户',
  });

  const [currentTasks, setCurrentTasks] = useState<{ id: string; name: string; time: string; type: any }[]>([]);

  useEffect(() => {
    if (!newPlan.careLevelId) return;
    const servicesForLevel = serviceItems.filter(s => s.includedIn.includes(newPlan.careLevelId));
    
    // Auto-generate some scheduled times based on frequency string
    const generatedTasks = servicesForLevel.map((svc, i) => {
      let type = 'care';
      if (svc.category.includes('医疗') || svc.category.includes('监测')) type = 'medical';
      if (svc.category.includes('文娱')) type = 'entertainment';
      
      let times = ['08:00'];
      if (svc.frequency.includes('2次')) times = ['08:00', '18:00'];
      if (svc.frequency.includes('3次')) times = ['08:00', '12:00', '18:00'];
      
      return times.map((time, j) => ({
        id: `tpl-${i}-${j}`,
        name: svc.name,
        time: time,
        type: type,
      }));
    }).flat();
    
    setCurrentTasks(generatedTasks);
  }, [newPlan.careLevelId, serviceItems]);

  const handleCreatePlan = () => {
    if (!newPlan.goal) return;
    const elder = elders.find(e => e.id === newPlan.elderId);
    if (!elder) return;
    
    const careLevel = careLevels.find(c => c.id === newPlan.careLevelId);

    const plan = {
      id: `PLN-00${allPlans.length + 1}`,
      elderId: elder.id,
      elderName: elder.name,
      room: elder.room,
      careLevel: careLevel?.name || '常规护理',
      goal: newPlan.goal,
      nextReview: newPlan.nextReview || '2026-10-01',
      manager: newPlan.manager,
      status: '执行中',
      tasks: currentTasks
    };
    addCarePlan(plan);

    // Push these scheduled tasks to the global state so they appear on Nurse Station
    currentTasks.forEach(task => {
      addTask({
        id: `TASK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: task.name,
        elder: `${elder.name} (${elder.room})`,
        time: task.time,
        staff: "自动排程未指派", // It will appear on the nurse station pending execution
        status: "pending",
        type: task.type
      });
    });

    setShowNewModal(false);
    toast.success(`已为长者 ${elder.name} 制定个人照护计划，关联了 ${currentTasks.length} 项 SOP 任务！`);
    setNewPlan({
      elderId: elders[0]?.id || '',
      careLevelId: careLevels[0]?.id || '',
      goal: '',
      nextReview: '',
      manager: '当前登录用户',
    });
  };

  const handleAddTask = () => {
    setCurrentTasks([...currentTasks, { id: Date.now().toString(), name: '新服务项', time: '10:00', type: 'care' }]);
  };

  const updateTask = (id: string, field: string, value: string) => {
    setCurrentTasks(currentTasks.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTask = (id: string) => {
    setCurrentTasks(currentTasks.filter(t => t.id !== id));
  };

  const filteredPlans = plans.filter(plan => {
    const matchesTab = activeTab === 'active' ? plan.status === '执行中' : plan.status === '待审核';
    const searchString = searchQuery.toLowerCase();
    const matchesSearch = plan.elderName.toLowerCase().includes(searchString) || 
                          plan.manager.toLowerCase().includes(searchString);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">个人照顾计划与目标</h2>
          <p className="text-slate-500 text-sm mt-1">基于评估结果，为每位长者制定个性化的护理目标与照护计划</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
            <Plus className="w-4 h-4" /> 制定新计划
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5 flex items-center gap-6 shadow-sm">
           <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600 border border-emerald-100 shrink-0">
             <FileSignature className="w-8 h-8" />
           </div>
           <div className="flex-1">
             <h3 className="text-lg font-bold text-slate-800 mb-1">智能化评估到排程流转</h3>
             <p className="text-sm text-slate-600">在此处建立长者照护计划时，系统会默认读取该长者的核心护理级别，并<strong className="text-emerald-700">自动从内置 SOP 标准服务库中抽出对应的（如洗浴、口腔清洁等）照护项目与频次</strong>，直接预生成每日看护工单，实现零录入成本。</p>
           </div>
        </div>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-1">{allPlans.filter(p => p.status === '执行中').length}</h3>
            <p className="text-indigo-100 text-sm font-medium">在执行照护计划总量</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">本月需复审计划</p>
              <h3 className="text-2xl font-bold text-slate-800">15</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">待审批计划</p>
              <h3 className="text-2xl font-bold text-slate-800">3</h3>
            </div>
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
              <Settings2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/50">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex gap-2">
            {['active', 'reviewing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab === 'active' && '执行中的计划'}
                {tab === 'reviewing' && '待审核/变更单'}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索长者/护理员..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1 border border-slate-300 rounded-md text-sm w-56 focus:outline-none focus:border-indigo-500 bg-slate-50"
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">长者信息</th>
                <th className="px-6 py-4 font-medium w-1/3">阶段性评估目标</th>
                <th className="px-6 py-4 font-medium">负责主管</th>
                <th className="px-6 py-4 font-medium">下次评估日</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
                        {plan.elderName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800"><ElderLink id={plan.elderId || 'ELD-001'} text={plan.elderName} /></div>
                        <div className="text-xs text-slate-500 mt-0.5">{plan.room} · {plan.careLevel}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <p className="text-slate-600 line-clamp-2">{plan.goal}</p>
                  </td>
                  <td className="px-6 py-4">{plan.manager}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{plan.nextReview}</td>
                  <td className="px-6 py-4">
                     {plan.status === '执行中' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100">
                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 执行中
                        </span>
                     ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100">
                           <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 待审核
                        </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedPlan(plan); setShowDetailModal(true); }} className="text-indigo-600 hover:text-indigo-800 font-medium">详情</button>
                    <span className="text-slate-300 mx-2">|</span>
                    <button onClick={() => setAppTab && setAppTab('care_tasks')} className="text-slate-500 hover:text-slate-700 font-medium">排程</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 制定新计划 Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <FileSignature className="w-5 h-5 text-indigo-600" />
                   制定个人照护计划
                </h3>
                <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">选择适用长者 *</label>
                     <select 
                       value={embedded && elderId ? elderId : newPlan.elderId}
                       onChange={(e) => setNewPlan({...newPlan, elderId: e.target.value})}
                       disabled={!!(embedded && elderId)}
                       className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${embedded && elderId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                     >
                        {elders.map(elder => (
                           <option key={elder.id} value={elder.id}>{elder.name} ({elder.room})</option>
                        ))}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">照护等级 / SOP 模板 *</label>
                     <select 
                       value={newPlan.careLevelId}
                       onChange={(e) => setNewPlan({...newPlan, careLevelId: e.target.value})}
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                     >
                        {careLevels.map(level => (
                           <option key={level.id} value={level.id}>{level.name}</option>
                        ))}
                     </select>
                   </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">整体健康与照护目标 *</label>
                   <textarea rows={3} value={newPlan.goal} onChange={(e) => setNewPlan({...newPlan, goal: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 resize-none" placeholder="描述阶段性照护的主要目标，例如：恢复行动能力、控制血糖等..."></textarea>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center justify-between border-b pb-2">
                     <h4 className="font-bold text-slate-800">具体排程服务生成</h4>
                     <button 
                       onClick={handleAddTask}
                       className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1"
                     >
                       <Plus className="w-4 h-4"/> 新添项
                     </button>
                   </div>
                   
                   <div className="flex flex-col gap-3">
                     {currentTasks.length > 0 ? currentTasks.map((t, idx) => (
                       <div key={t.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <select 
                            value={t.type}
                            onChange={(e) => updateTask(t.id, 'type', e.target.value)}
                            className="bg-white border border-slate-300 rounded px-2 py-1.5 text-sm w-28 focus:outline-none focus:border-indigo-500"
                          >
                            <option value="care">生活照护</option>
                            <option value="medical">医疗服务</option>
                            <option value="entertainment">文娱干预</option>
                            <option value="cleaning">保洁维护</option>
                          </select>
                          <input 
                            type="text" 
                            value={t.name}
                            onChange={(e) => updateTask(t.id, 'name', e.target.value)}
                            className="bg-white border border-slate-300 rounded px-3 py-1.5 text-sm flex-1 focus:outline-none focus:border-indigo-500"
                            placeholder="例如：协助服药"
                          />
                          <div className="relative">
                            <Clock className="w-4 h-4 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                            <input 
                              type="time" 
                              value={t.time}
                              onChange={(e) => updateTask(t.id, 'time', e.target.value)}
                              className="bg-white border border-slate-300 rounded pl-8 pr-2 py-1.5 text-sm w-28 focus:outline-none focus:border-indigo-500"
                            />
                          </div>
                          <button onClick={() => removeTask(t.id)} className="text-slate-400 hover:text-rose-500 p-1.5 rounded transition bg-white border border-transparent hover:border-rose-100 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                     )) : (
                       <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                         暂无排程服务项，请添加每天需要生成的系统任务
                       </div>
                     )}
                   </div>
                   
                   <p className="text-xs text-slate-500 mt-2">提示：配置完整的排程服务项并点击保存后，将在系统及护士站自动建立每日的待办任务下发。</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">计划复核日期</label>
                     <input type="date" value={newPlan.nextReview} onChange={(e) => setNewPlan({...newPlan, nextReview: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">负责主管</label>
                     <select value={newPlan.manager} onChange={(e) => setNewPlan({...newPlan, manager: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                        <option>当前登录用户</option>
                        <option>李护士长</option>
                        <option>王医生</option>
                     </select>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowNewModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
                <button onClick={handleCreatePlan} disabled={!newPlan.goal} className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  建立护照计划
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 计划详情 Modal */}
      {showDetailModal && selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   照护计划详情 · {selectedPlan.id}
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 space-y-6">
                <div>
                   <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">长者基础信息</h4>
                   <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                         {selectedPlan.elderName[0]}
                      </div>
                      <div>
                         <div className="font-bold text-slate-800 text-lg">{selectedPlan.elderName}</div>
                         <div className="text-sm text-slate-500 mt-1">{selectedPlan.room} · {selectedPlan.careLevel}</div>
                      </div>
                   </div>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">阶段性评估目标</h4>
                   <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg text-slate-700 leading-relaxed text-sm">
                      {selectedPlan.goal}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">计划跟进与复核</h4>
                      <ul className="space-y-3">
                         <li className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500">负责主管</span>
                            <span className="font-medium text-slate-800">{selectedPlan.manager}</span>
                         </li>
                         <li className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500">计划状态</span>
                            {selectedPlan.status === '执行中' ? (
                                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded text-xs">执行中</span>
                            ) : (
                                <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded text-xs">待审核</span>
                            )}
                         </li>
                         <li className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                            <span className="text-slate-500">下次评估日期</span>
                            <span className="font-medium text-slate-800">{selectedPlan.nextReview}</span>
                         </li>
                      </ul>
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wider">每日排程服务列表</h4>
                      <div className="space-y-2 text-sm max-h-[150px] overflow-y-auto pr-2">
                         {selectedPlan.tasks && selectedPlan.tasks.length > 0 ? selectedPlan.tasks.map((task: any, index: number) => (
                           <div key={index} className="flex items-center justify-between text-slate-700 bg-slate-50 px-3 py-2 border border-slate-100 rounded-md">
                              <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span> {task.name}
                              </span>
                              <span className="text-xs font-mono font-medium text-slate-500 bg-white px-2 py-0.5 border border-slate-200 rounded">{task.time}</span>
                           </div>
                         )) : (
                           <div className="text-slate-400 italic bg-slate-50 px-3 py-3 rounded-md border border-dashed border-slate-200">未配置具体的排程服务项目</div>
                         )}
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowDetailModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">关闭</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
