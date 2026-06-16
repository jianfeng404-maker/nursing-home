import { useState, useEffect } from "react";
import { Search, MapPin, CheckCircle2, Clock, CheckSquare, ListTodo, User, Activity, Siren, X, Camera, ChevronRight, Phone, AlertTriangle, CalendarRange } from "lucide-react";
import { useStore, CareRecord } from "../store";

export function CareLog() {
  const tasks = useStore(state => state.tasks);
  const updateTaskStatus = useStore(state => state.updateTaskStatus);
  const staff = useStore(state => state.staff);
  const staffList = staff.filter(s => s.role === '员工' || (s.position && s.position.includes('护理')));
  
  const [currentUser, setCurrentUser] = useState(staffList[0]?.name || "李雪");
  const [activeTab, setActiveTab] = useState('todo');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [showUserSelect, setShowUserSelect] = useState(false);
  
  const myTasks = tasks.filter(t => t.staff === currentUser).map(t => ({
    ...t,
    title: t.name || '未命名任务',
    room: t.elder && typeof t.elder === 'string' && t.elder.includes('(') ? t.elder.split('(')[1].replace(')', '') : '未知房间',
    elder: t.elder && typeof t.elder === 'string' ? t.elder.split(' ')[0] : '未知',
    desc: (t as any).requirements || t.name || '无记录',
    tags: t.type === 'medical' ? ['医疗护理'] : [],
    status: t.status === 'completed' ? 'done' : 'todo'
  }));

  const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  const handleComplete = (id: string, note?: string) => {
    updateTaskStatus(id, 'completed');
    setSelectedTask(null);
  };

  const pendingTasks = myTasks.filter(t => t.status === 'todo');
  const completedTasks = myTasks.filter(t => t.status === 'done');

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex items-center justify-center bg-slate-100">
      
      {/* Mobile Device Mockup Container */}
      <div className="w-full max-w-[400px] h-[800px] max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl relative overflow-hidden border-[8px] border-slate-800 flex flex-col ring-1 ring-slate-900/10">
        
        {/* Notch/Status Bar Area */}
        <div className="h-7 w-full bg-slate-800 absolute top-0 z-50 flex justify-center rounded-t-2xl">
           <div className="w-32 h-6 bg-black rounded-b-xl"></div>
        </div>

        {/* Header */}
        <div className="bg-indigo-600 pt-10 pb-4 px-5 text-white shrink-0 rounded-b-3xl shadow-md z-10 relative">
          <div className="flex justify-between items-center mb-6 relative">
            <div className="flex items-center gap-3" onClick={() => setShowUserSelect(!showUserSelect)}>
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold overflow-hidden shadow-inner flex-shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div className="cursor-pointer">
                <h2 className="font-bold text-lg leading-tight flex items-center gap-1">{currentUser}，早安 <ChevronRight className="w-4 h-4"/></h2>
                <p className="text-indigo-200 text-xs flex items-center gap-1 font-medium"><MapPin className="w-3 h-3"/> 当前责任护工</p>
              </div>
            </div>
            
            {showUserSelect && (
              <div className="absolute top-12 left-0 w-48 bg-white text-slate-800 rounded-lg shadow-xl z-[60] overflow-hidden">
                {staffList.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => { setCurrentUser(s.name); setShowUserSelect(false); }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-0"
                  >
                    {s.name} ({s.position})
                  </button>
                ))}
              </div>
            )}

            <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 rounded-xl p-3 border border-white/10 text-center">
               <div className="text-2xl font-black">{pendingTasks.length}</div>
               <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">待办任务</div>
            </div>
            <div className="flex-1 bg-white/10 rounded-xl p-3 border border-white/10 text-center">
               <div className="text-2xl font-black">{completedTasks.length}</div>
               <div className="text-[10px] text-indigo-200 uppercase tracking-wider font-bold">已完成</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
          
          <div className="flex bg-white px-2 pt-2 border-b border-slate-200 shrink-0 shadow-sm sticky top-0 z-10">
            <button 
              onClick={() => setActiveTab('todo')}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors relative ${activeTab === 'todo' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}
            >
              当前待办
              {pendingTasks.length > 0 && (
                 <span className="absolute top-0 ml-1 mt-0.5 w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('done')}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'done' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent'}`}
            >
              今日已完成
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar pb-24">
            {(activeTab === 'todo' ? pendingTasks : completedTasks).length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-400 mt-10">
                 <CheckCircle2 className="w-12 h-12 mb-3 text-slate-300 opacity-50" />
                 <p className="text-sm font-medium">太棒了！暂无待办任务</p>
              </div>
            ) : (
              (activeTab === 'todo' ? pendingTasks : completedTasks).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => task.status === 'todo' && setSelectedTask(task)}
                  className={`bg-white rounded-2xl p-4 border transition-all ${
                    task.status === 'done' ? 'border-emerald-100 opacity-60' : 'border-slate-200 shadow-sm active:scale-[0.98]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className={`text-sm font-black font-mono ${
                        task.time < currentTime && task.status === 'todo' ? 'text-rose-600' : 'text-slate-700'
                      }`}>
                        {task.time}
                      </span>
                      {task.time < currentTime && task.status === 'todo' && (
                        <span className="text-[9px] bg-rose-100 text-rose-700 px-1 py-0.5 rounded font-bold uppercase tracking-wider">超时</span>
                      )}
                    </div>
                    {task.status === 'done' ? (
                       <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5"/> 已打卡</span>
                    ) : (
                       <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">待执行</span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-slate-800 text-base mb-1">{task.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-3 font-medium">
                     <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-xs"><User className="w-3 h-3 text-slate-400"/> {task.elder}</span>
                     <span className="text-slate-300">·</span>
                     <span className="text-xs">{task.room}</span>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-2">
                       {task.tags.map(tag => (
                         <span key={tag} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">{tag}</span>
                       ))}
                    </div>
                  )}
                </div>
              ))
            )}
            
            {/* Quick action banners */}
            {activeTab === 'todo' && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                    <Siren className="w-5 h-5 text-rose-600" />
                 </div>
                 <div className="flex-1">
                    <h4 className="font-bold text-rose-900 text-sm">李大爷 (A-108床)</h4>
                    <p className="text-xs text-rose-700">床旁呼叫铃已按下，请立即前往！</p>
                 </div>
                 <button className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg active:bg-rose-700">接单</button>
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex justify-around items-center px-6 pb-2 text-slate-400 z-20">
             <button className="flex flex-col items-center gap-1 text-indigo-600 w-16">
                <ListTodo className="w-6 h-6" />
                <span className="text-[10px] font-bold">任务</span>
             </button>
             <button onClick={() => setShowScanner(true)} className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors w-16 relative">
                <div className="absolute -top-6 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50">
                   <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                </div>
                <span className="text-[10px] font-bold mt-5 text-slate-500">扫床头码</span>
             </button>
             <button className="flex flex-col items-center gap-1 hover:text-indigo-600 transition-colors w-16">
                <User className="w-6 h-6" />
                <span className="text-[10px] font-bold">我的</span>
             </button>
          </div>
        </div>
        
        {/* Task Detail / Execution Modal */}
        {selectedTask && (
          <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm animate-in fade-in flex">
             <div className="w-full bg-white mt-auto rounded-t-3xl min-h-[70%] max-h-[90%] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-center py-3 shrink-0">
                   <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                </div>
                <div className="px-5 pb-3 flex justify-between items-center border-b border-slate-100 shrink-0">
                   <h3 className="font-black text-lg text-slate-800 text-center flex-1">服务执行打卡</h3>
                   <button onClick={() => setSelectedTask(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 absolute pr-4 right-2"><X className="w-5 h-5"/></button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-6">
                   <div className="flex items-center gap-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl font-serif">
                        {(selectedTask.elder || '未')[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-lg mb-0.5">{selectedTask.elder}</h4>
                        <p className="text-slate-500 text-sm font-medium">{selectedTask.room}</p>
                      </div>
                      <button className="ml-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100"><Phone className="w-5 h-5"/></button>
                   </div>
                   
                   <div className="mb-6">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">执行项目</div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedTask.title}</h2>
                      <p className="text-slate-600 bg-amber-50 border border-amber-100 p-3 rounded-lg text-sm font-medium">
                         {selectedTask.desc}
                      </p>
                   </div>

                   <div className="mb-6">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">拍照留档 (选填)</div>
                      <button className="w-full h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors active:scale-95">
                         <Camera className="w-6 h-6 mb-1" />
                         <span className="text-sm font-medium">点击拍照 (可选)</span>
                      </button>
                   </div>

                   <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">补充记录 (选填)</div>
                      <textarea 
                        className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50 resize-none"
                        rows={3}
                        placeholder="有任何突发情况或长者特殊表现请记录..."
                      ></textarea>
                   </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-white shrink-0">
                   <button 
                     onClick={() => handleComplete(selectedTask.id)}
                     className="w-full h-14 bg-indigo-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                   >
                     确认执行完成
                     <CheckCircle2 className="w-6 h-6" />
                   </button>
                </div>
             </div>
          </div>
        )}

        {/* Scanner Simulation Modal */}
        {showScanner && (
           <div className="absolute inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
              <div className="h-20 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10 flex justify-between px-6 pt-10">
                 <button onClick={() => setShowScanner(false)} className="text-white"><X className="w-8 h-8"/></button>
                 <span className="text-white font-bold tracking-widest">扫描床头码</span>
                 <div className="w-8"></div>
              </div>
              <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                 {/* Fake Camera View */}
                 <img src="https://images.unsplash.com/photo-1538356392095-234b6b6dae6c?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm" alt="camera feed" />
                 
                 {/* Scanner target frame */}
                 <div className="w-64 h-64 border-2 border-white/30 rounded-3xl relative z-10">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-xl -translate-x-1 -translate-y-1"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-xl translate-x-1 -translate-y-1"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-xl -translate-x-1 translate-y-1"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-xl translate-x-1 translate-y-1"></div>
                    {/* Scanner laser */}
                    <div className="w-full h-0.5 bg-indigo-500 absolute top-1/2 -translate-y-1/2 shadow-[0_0_15px_rgba(99,102,241,1)] animate-bounce"></div>
                 </div>
                 
                 <div className="absolute bottom-20 w-full text-center z-10">
                    <p className="text-white bg-black/50 px-4 py-2 rounded-full inline-block backdrop-blur-md text-sm font-medium">请将二维码放入框内</p>
                 </div>
              </div>
           </div>
        )}
      </div>
      
      <div className="hidden lg:block ml-10 text-slate-400 max-w-sm">
         <h3 className="font-bold text-slate-700 text-lg mb-2">护理端功能说明</h3>
         <p className="text-sm leading-relaxed mb-4">护工团队人员使用的移动端界面。此处以模拟器形式展现其操作流程。</p>
         <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 清晰待办工作清单</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 扫码快速核对身份防止错助</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 一键拍照打卡留存记录</li>
            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 紧急呼叫铃移动端实时提醒</li>
         </ul>
      </div>
    </div>
  );
}

