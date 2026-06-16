import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar as CalendarIcon, CheckSquare, Clock, Filter, Plus, Search, User, X, ClipboardType, ArrowRightLeft, Smartphone, RefreshCw, ConciergeBell, Info } from "lucide-react";
import { useStore } from "../store";
import { toast } from "sonner";

export function CareTasks() {
  const [activeDate, setActiveDate] = useState('today');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', elder: '无需关联', time: '12:00', date: '', assignTo: 'pool', fee: 0 });

  const tasks = useStore(state => state.tasks);
  const addBill = useStore(state => state.addBill);
  const staff = useStore(state => state.staff);
  const updateTaskStaff = useStore(state => state.updateTaskStaff);
  const addTask = useStore(state => state.addTask);
  const updateTaskStatus = useStore(state => state.updateTaskStatus);

  // Grouped tasks by department
  const departmentGroups = useMemo(() => {
    const relevantStaff = staff.filter(s => s.position.includes('护理') || s.position.includes('护工') || s.position.includes('康复') || s.position.includes('医'));
    
    type GroupInfo = { dept: string, staffList: any[] };
    const groups: Record<string, GroupInfo> = {};
    
    relevantStaff.forEach(s => {
      if (!groups[s.dept]) {
        groups[s.dept] = { dept: s.dept, staffList: [] };
      }
      
      const assignedTasks = tasks.filter(t => t.staff === s.name);
      groups[s.dept].staffList.push({
        staff: s.name,
        status: s.status,
        syncTime: s.status === '在线' ? '刚刚同步' : '未同步',
        tasks: assignedTasks
      });
    });
    
    return Object.values(groups);
  }, [staff, tasks]);

  const unassignedTasks = useMemo(() => {
    return tasks.filter(t => !t.staff || t.staff === '未指派' || t.staff === '待指派' || t.staff === '自动排程未指派');
  }, [tasks]);

  const [taskToAssign, setTaskToAssign] = useState<any>(null);
  const [assignTarget, setAssignTarget] = useState<string>('');

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="mb-6 flex space-x-2 items-end justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">全局全局计划与派单排班</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            将长者的《个人照护计划》智能拆解为每日工单，并实时同步至护工移动工作台
          </span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowNewTaskModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> 下发临时派单
          </button>
        </div>
      </div>

      {/* 排程原理解释面板 (教育型UI) */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-6 border border-indigo-100 flex items-center justify-between shadow-sm">
         <div className="flex items-center gap-6 flex-1">
            <div className="flex flex-col items-center gap-2 w-40 shrink-0">
               <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-100 text-indigo-600">
                  <ClipboardType className="w-8 h-8" />
               </div>
               <span className="text-sm font-bold text-slate-700 text-center">系统照护计划引擎</span>
               <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">引擎每日0点自动演算</span>
            </div>
            
            <div className="flex flex-1 items-center justify-center relative">
               <div className="h-0.5 w-full bg-indigo-200 absolute top-1/2 -translate-y-1/2"></div>
               <div className="z-10 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                  拆解为 428 条系统工单
               </div>
            </div>

            <div className="flex flex-col items-center gap-2 w-40 shrink-0">
               <div className="bg-white p-3 rounded-xl shadow-sm border border-emerald-100 text-emerald-600 relative">
                  <Smartphone className="w-8 h-8" />
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">新</span>
               </div>
               <span className="text-sm font-bold text-slate-700 text-center">护工移动端工作台</span>
               <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" /> 实时同步接收
               </span>
            </div>
         </div>
         <div className="w-px h-16 bg-indigo-200 mx-8"></div>
         <div className="w-64">
            <div className="text-sm font-bold text-slate-800 mb-2">执行监控准则：</div>
            <ul className="text-xs text-slate-600 space-y-1.5 font-medium">
               <li className="flex items-center gap-1.5"><StatusDot color="bg-emerald-500"/> 准时执行打卡为绿色</li>
               <li className="flex items-center gap-1.5"><StatusDot color="bg-amber-500"/> 临近超时预警为黄色</li>
               <li className="flex items-center gap-1.5"><StatusDot color="bg-rose-500"/> 超时未处理升级报警给主管</li>
            </ul>
         </div>
      </div>

      {/* 看板区域 */}
      <div className="flex gap-6 h-full min-h-[500px] overflow-hidden">
         {/* 左侧：未派发/临时呼叫池 */}
         <div className="w-80 flex flex-col bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shrink-0">
            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
               <div className="flex flex-col gap-0.5">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <ConciergeBell className="w-5 h-5 text-amber-500" />
                   待分派与临时需求池
                 </h3>
                 <p className="text-[11px] text-slate-500 flex items-center gap-1"><Info className="w-3 h-3"/> 来源: 家属端 / IoT告警 / 手动创建</p>
               </div>
               <span className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">{unassignedTasks.length}</span>
            </div>
            <div className="p-4 overflow-y-auto space-y-3 custom-scrollbar flex-1">
               {unassignedTasks.map(task => (
                  <div key={task.id} className="bg-white border text-sm border-amber-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">临时工单</span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1"><Clock className="w-3 h-3"/> {task.time}</span>
                     </div>
                     <h4 className="font-bold text-slate-800 mb-1">{task.name}</h4>
                     <p className="text-xs text-slate-500 flex items-center gap-1.5 mb-3 bg-slate-50 p-1.5 rounded">
                        <User className="w-3 h-3 text-slate-400" /> {task.elder}
                     </p>
                     <button onClick={() => setTaskToAssign(task)} className="w-full py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors">
                        点击指派
                     </button>
                  </div>
               ))}
            </div>
         </div>

         {/* 右侧：护工分工看板 */}
         <div className="flex-1 flex overflow-x-auto gap-5 pb-4 snap-x custom-scrollbar">
            {departmentGroups.map((group, idx) => (
               <div key={idx} className="min-w-[340px] max-w-[380px] bg-slate-50 border border-slate-200 rounded-2xl flex flex-col shrink-0 snap-start">
                  <div className="p-4 bg-white border-b border-slate-200 rounded-t-2xl shrink-0">
                     <h3 className="font-black text-slate-800 flex items-center justify-between">{group.dept} <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{group.staffList.length} 名在岗</span></h3>
                  </div>
                  
                  <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-4">
                     {group.staffList.map((member: any, sIdx: number) => (
                        <div key={sIdx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                           <div className="flex items-center justify-between p-2.5 bg-slate-50 border-b border-slate-100 shrink-0">
                              <div className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                 <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs">{member.staff[0]}</div>
                                 {member.staff}
                              </div>
                              <div className="flex items-center gap-1.5">
                                 <span className={`w-2 h-2 rounded-full ${member.status === '在线' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                 <span className="text-[10px] font-bold text-slate-400">{member.syncTime}</span>
                              </div>
                           </div>
                           <div className="p-2.5 space-y-2.5 flex-1 bg-white">
                              {member.tasks.length === 0 ? (
                                 <div className="text-xs text-slate-400 text-center py-2">暂无派发工单</div>
                              ) : member.tasks.map((task: any) => (
                                 <div key={task.id} className={`rounded-xl p-3 border transition-all ${task.status === 'completed' ? 'border-emerald-100 bg-emerald-50/30 opacity-70' : 'border-slate-200 bg-white shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                       <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                          task.type === 'medical' ? 'bg-sky-50 text-sky-600 border-sky-100' : 
                                          task.type === 'care' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                                          'bg-slate-50 text-slate-600 border-slate-200'
                                       }`}>
                                          {task.type}
                                       </span>
                                       <div className="flex items-center gap-1.5">
                                          {task.status === 'completed' && <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />}
                                          <span className={`text-xs font-mono font-bold ${task.status === 'completed' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                             {task.time}
                                          </span>
                                       </div>
                                    </div>
                                    <h4 className={`font-bold text-sm mb-1 ${task.status === 'completed' ? 'text-slate-600 line-through' : 'text-slate-800'}`}>{task.name}</h4>
                                    <div className="text-xs text-slate-500 flex items-center justify-between">
                                       <span className="flex items-center gap-1 line-clamp-1"><User className="w-3 h-3" /> {task.elder}</span>
                                    </div>
                                    
                                    {task.status !== 'completed' && (
                                       <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between">
                                          <button className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors">
                                             <ArrowRightLeft className="w-3 h-3" /> 换人
                                          </button>
                                          <button 
                                           onClick={() => {
                                                updateTaskStatus(task.id, 'completed');
                                                if ((task as any).fee > 0) {
                                                    addBill({
                                                        id: `BILL-TSK-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
                                                        elder: task.elder ? task.elder.split(' (')[0] || task.elder : '未知',
                                                        room: task.elder && task.elder.includes(' (') ? task.elder.split(' (')[1]?.replace(')', '') : '未知',
                                                        period: "护理临时服务项",
                                                        dueDate: new Date().toISOString().split('T')[0],
                                                        status: "未缴费",
                                                        total: (task as any).fee,
                                                        items: [
                                                            { name: task.name, amount: (task as any).fee.toString(), type: "service" }
                                                        ]
                                                    });
                                                    toast.success(`工单已完成！员工 ${task.staff} 绩效已记录，并向长者生成 ￥${(task as any).fee} 账单`);
                                                } else {
                                                    toast.success(`工单已完成！系统已记录员工 ${task.staff} 绩效。`);
                                                }
                                           }}
                                           className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-2 py-1 rounded">
                                           标记完成
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* 侧边弹出：新增临时派单 */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <ClipboardType className="w-5 h-5 text-indigo-600" />
                   创建并派发临时工单
                </h3>
                <button onClick={() => setShowNewTaskModal(false)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">任务内容 *</label>
                  <input type="text" value={newTask.name} onChange={e => setNewTask({...newTask, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="如：送餐到房间、协助换洗衣物" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">关联长者 / 地点</label>
                  <select value={newTask.elder} onChange={e => setNewTask({...newTask, elder: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                     <option value="无需关联特定长者 (公共区域任务)">无需关联特定长者 (公共区域任务)</option>
                     <option value="张明宇 (A栋-101)">张明宇 (A栋-101)</option>
                     <option value="李秀红 (A栋-105)">李秀红 (A栋-105)</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">要求执行日期 *</label>
                     <input type="date" value={newTask.date} onChange={e => setNewTask({...newTask, date: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">时间节点 *</label>
                     <input type="time" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" />
                   </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">附加收费金额 (元)可选</label>
                  <input type="number" value={newTask.fee} onChange={e => setNewTask({...newTask, fee: parseFloat(e.target.value) || 0})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="无需收费填0" />
                  <p className="text-xs text-slate-500 mt-1">如输入金额，完成工单时系统将自动生成财务应收账单项并计入人员绩效金库。</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">指派给谁执行 *</label>
                  <select value={newTask.assignTo} onChange={e => setNewTask({...newTask, assignTo: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                     <option value="pool">放入待分派池 (抢单/主管后续指派)</option>
                     {departmentGroups.map((g, i) => (
                        <optgroup key={i} label={g.dept}>
                           {g.staffList.map((m: any, j: number) => (
                              <option key={j} value={m.staff}>{m.staff}</option>
                           ))}
                        </optgroup>
                     ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">选择具体人员后，工单将立刻通过推送通知下发到其移动设备。</p>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowNewTaskModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors">取消</button>
                <button 
                  disabled={!newTask.name}
                  onClick={() => {
                     const task = {
                        id: `T-${Math.floor(Math.random() * 1000) + 900}`,
                        elder: newTask.elder,
                        time: newTask.time || '随时',
                        type: 'care',
                        name: newTask.name,
                        status: 'pending',
                        fee: newTask.fee || 0,
                        staff: newTask.assignTo === 'pool' ? '未指派' : newTask.assignTo,
                     };
                     addTask(task as any);
                     setShowNewTaskModal(false);
                     setNewTask({ name: '', elder: '无需关联特定长者 (公共区域任务)', time: '12:00', date: '', assignTo: 'pool', fee: 0 });
                  }} 
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm gap-2 flex items-center disabled:opacity-50"
                >
                  确认并派发至设备
                  <Smartphone className="w-4 h-4 ml-1" />
                </button>
             </div>
          </div>
        </div>
      )}
      {/* 指派工单弹窗 */}
      {taskToAssign && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                   指派临时工单
                </h3>
                <button onClick={() => setTaskToAssign(null)} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200 transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-5">
                <div className="text-sm text-slate-600 mb-4 bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <div className="font-bold text-slate-800 mb-1">{taskToAssign.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500"><User className="w-3.5 h-3.5"/> {taskToAssign.elder}</div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">选择执行人</label>
                  <select value={assignTarget} onChange={e => setAssignTarget(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                     <option value="" disabled>请选择...</option>
                     {departmentGroups.map((g, i) => (
                        <optgroup key={i} label={g.dept}>
                           {g.staffList.map((m: any, j: number) => (
                              <option key={j} value={m.staff}>{m.staff}</option>
                           ))}
                        </optgroup>
                     ))}
                  </select>
                </div>
             </div>
             
             <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setTaskToAssign(null)} className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors">取消</button>
                <button 
                  disabled={!assignTarget}
                  onClick={() => {
                     updateTaskStaff(taskToAssign.id, assignTarget);
                     setTaskToAssign(null);
                     setAssignTarget('');
                  }} 
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4"/>
                  确认指派
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

const StatusDot = ({ color }: { color: string }) => (
  <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
);
