import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Users, UserCheck, AlertTriangle, Clock, 
  CalendarCheck, Settings2, RefreshCw, Filter, 
  CheckCircle2, AlertCircle, PlusCircle, UserCircle2, UserPlus, FileText, ChevronDown, Check
} from "lucide-react";
import { cn } from "../lib/utils";
import { toast } from "sonner";
import { ElderLink } from "../components/ElderLink";
import { useStore } from "../store";
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function TaskDispatch() {
  const { tasks, staff, elders, updateTaskStaff, autoAssignTasks, addTask } = useStore();

  const [activeTab, setActiveTab] = useState<'unassigned' | 'all'>('unassigned');
  const [showOrderModal, setShowOrderModal] = useState(false);

  const unassignedTasks = useMemo(() => {
    return tasks.filter(t => t.staff === '未指派' || t.staff === '待指派' || t.staff === '自动排程未指派' || !t.staff || t.status === 'pending');
  }, [tasks]);

  const allTasks = useMemo(() => {
    return tasks;
  }, [tasks]);

  const displayTasks = activeTab === 'unassigned' ? unassignedTasks : allTasks;

  const getTaskLevel = (type: string) => {
    if (type === 'medical') return 'critical';
    if (type === 'care') return 'high';
    return 'medium';
  };

  const getTaskNameMap: Record<string, string> = {
    'medical': '医疗护理',
    'care': '生活照料',
    'entertainment': '文化娱乐',
    'cleaning': '卫生保洁',
  };

  const staffStats = useMemo(() => {
    return staff.map(s => {
      const assignedTasks = tasks.filter(t => t.staff === s.name);
      const completed = assignedTasks.filter(t => t.status === 'completed').length;
      const total = assignedTasks.length;
      return {
        ...s,
        tasks: total,
        completed: completed,
        load: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    });
  }, [staff, tasks]);

  const stats = [
    { label: "今日计划总工单", value: tasks.length.toString(), sub: `自动生成 ${tasks.length} / 临时调度 0`, icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "待分配/调度", value: unassignedTasks.length.toString(), sub: "未指派护理员", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "执行中/已排期", value: tasks.filter(t => t.status === 'in_progress' || (t.status === 'pending' && t.staff !== '未指派' && t.staff !== '自动排程未指派' && t.staff !== '待指派')).length.toString(), sub: "正常跟进中", icon: RefreshCw, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "已完成", value: tasks.filter(t => t.status === 'completed').length.toString(), sub: "达成目标", icon: CheckCircle2, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const content = formData.get('content') as string;
    const type = formData.get('type') as 'medical' | 'care' | 'entertainment' | 'cleaning';
    const elderId = formData.get('elder') as string;
    const time = formData.get('time') as string;
    const assignedStaff = formData.get('staff') as string;

    let elderInfo = '公共区域';
    if (elderId) {
      const elder = elders.find(e => e.id === elderId);
      if (elder) elderInfo = `${elder.name} (${elder.room})`;
    }

    addTask({
      id: `T-TMP-${Date.now().toString().slice(-4)}`,
      name: content,
      type: type,
      elder: elderInfo,
      time: time || new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      staff: assignedStaff || '待指派',
      status: 'pending'
    });

    toast.success('临时工单已生成');
    setShowOrderModal(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 relative">
      <div className="mb-6 flex space-x-2 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">任务调度工作台</h2>
          <span className="text-sm text-slate-500">基于照护计划的每日工单调度与派发</span>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            onClick={() => setShowOrderModal(true)}
          >
            <PlusCircle className="h-4 w-4" />
            临时下单
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
            onClick={() => {
              autoAssignTasks();
              toast.success('已自动分派当前待分配工单。');
            }}
          >
            <Settings2 className="h-4 w-4" />
            智能一键排程
          </button>
        </div>
      </div>

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                </div>
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：待调度任务大厅 */}
        <Card className="col-span-1 lg:col-span-2 border-slate-200 flex flex-col">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                工单大厅
                <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">{displayTasks.length}</span>
              </CardTitle>
              <div className="flex gap-2">
                <div className="bg-slate-100 p-1 flex rounded-lg">
                  <button 
                    className={cn("text-xs px-3 py-1.5 rounded-md transition-colors", activeTab === 'unassigned' ? "bg-white shadow-sm font-semibold text-slate-800" : "text-slate-500 hover:text-slate-700")}
                    onClick={() => setActiveTab('unassigned')}
                  >
                    待分配
                  </button>
                  <button 
                    className={cn("text-xs px-3 py-1.5 rounded-md transition-colors", activeTab === 'all' ? "bg-white shadow-sm font-semibold text-slate-800" : "text-slate-500 hover:text-slate-700")}
                    onClick={() => setActiveTab('all')}
                  >
                    全部工单
                  </button>
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-slate-50/50 max-h-[500px] overflow-y-auto">
            {displayTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                当前没有相关工单记录。
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayTasks.map((task) => {
                  const levelType = getTaskLevel(task.type);
                  const isAssigned = task.staff !== '未指派' && task.staff !== '待指派' && task.staff !== '自动排程未指派' && !!task.staff;
                  
                  return (
                  <div key={task.id} className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "mt-1 w-2 h-2 rounded-full shrink-0",
                        levelType === 'critical' ? 'bg-red-500' :
                        levelType === 'high' ? 'bg-amber-500' : 'bg-blue-400'
                      )} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-slate-800">{task.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded bg-slate-50">
                            {getTaskNameMap[task.type] || task.type}
                          </span>
                          {task.status === 'completed' && <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded flex items-center gap-1"><Check className="w-3 h-3" />已完成</span>}
                        </div>
                        <div className="text-xs text-slate-600 mb-1">长者: <span className="font-medium">{task.elder}</span></div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 计划时间: {task.time}</span>
                          <span className="flex items-center gap-1">
                            <UserCircle2 className="w-3 h-3" />
                            承办人: <span className={cn(isAssigned ? "text-emerald-600 font-medium" : "text-amber-500 font-medium")}>{task.staff || "未指派"}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {(!isAssigned || task.status === 'pending') && (
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-emerald-500 text-emerald-600 font-medium rounded hover:bg-emerald-50 transition-colors">
                              <UserPlus className="w-3.5 h-3.5" />
                              {isAssigned ? "重新派单" : "指派人员"}
                              <ChevronDown className="w-3 h-3 ml-1" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content className="z-50 min-w-[160px] bg-white rounded-lg shadow-xl border border-slate-100 p-1 animate-in fade-in zoom-in-95" sideOffset={5}>
                              {staff.filter(s => s.status !== '休息中').map(s => (
                                <DropdownMenu.Item 
                                  key={s.id}
                                  className="text-xs text-slate-700 px-3 py-2 rounded-md hover:bg-slate-50 cursor-pointer outline-none flex items-center justify-between"
                                  onClick={() => {
                                    updateTaskStaff(task.id, s.name);
                                    toast.success(`工单已指派给 ${s.name}`);
                                  }}
                                >
                                  <span>{s.name} ({s.dept})</span>
                                  {s.status === '在线' ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> : <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                                </DropdownMenu.Item>
                              ))}
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
            <div className="p-3 text-center border-t border-slate-100 bg-white sticky bottom-0">
              <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">加载更多 &rarr;</button>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：员工负载及状态分析 */}
        <Card className="col-span-1 border-slate-200 flex flex-col">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-800">
              当值人员负载监控
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 h-[500px] overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {staffStats.map((worker, i) => (
                <div key={i} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       {worker.avatar ? (
                         <img src={worker.avatar} alt={worker.name} className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                       ) : (
                         <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                           {worker.name.charAt(0)}
                         </div>
                       )}
                       <div>
                         <div className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                           {worker.name}
                           <span className={cn(
                             "text-[10px] px-1.5 py-0.25 rounded-full flex items-center gap-1",
                             worker.status === '在线' ? 'bg-emerald-100 text-emerald-700' :
                             worker.status === '忙碌' ? 'bg-amber-100 text-amber-700' :
                             'bg-slate-100 text-slate-500'
                           )}>
                             {worker.status === '在线' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                             {worker.status === '忙碌' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />}
                             {worker.status}
                           </span>
                         </div>
                         <div className="text-[10px] text-slate-500">{worker.dept} | {worker.position}</div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">今日任务进度</span>
                      <span className={cn("font-medium", worker.load > 90 ? "text-red-500" : "text-emerald-600")}>
                        {worker.completed} / {worker.tasks} (完成度 {worker.load}%)
                      </span>
                    </div>
                    {/* Load bar */}
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1 overflow-hidden">
                      <div 
                        className={cn("h-1.5 rounded-full transition-all duration-500", 
                          worker.load > 90 ? "bg-emerald-600" : 
                          worker.load > 60 ? "bg-emerald-500" : "bg-blue-400"
                        )} 
                        style={{ width: `${worker.load}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 底部全宽：异常警告监控槽 */}
        <Card className="col-span-1 lg:col-span-3 border-red-100">
           <CardHeader className="bg-red-50/50 border-b border-red-100 pb-3 top-0">
             <CardTitle className="text-sm font-bold text-red-800 flex items-center gap-2">
               <AlertCircle className="w-4 h-4 text-red-600" />
               调度异常监控看板
             </CardTitle>
           </CardHeader>
           <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex gap-3 items-start border border-red-100 bg-white p-3 rounded-xl shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                   <AlertTriangle className="w-4 h-4" />
                 </div>
                 <div>
                   <div className="font-semibold text-sm text-slate-800">工单超时未接</div>
                   <div className="text-xs text-slate-500 mt-1">
                     工单号: T-015<br/>
                     原因: 派发给"王伟"已超30分钟未确认。<br/>
                     对象: 刘奶奶(输液看护)
                   </div>
                   <button className="mt-2 text-xs text-blue-600 font-medium hover:underline">重新转派此单</button>
                 </div>
              </div>
              <div className="flex gap-3 items-start border border-amber-100 bg-white p-3 rounded-xl shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                   <Clock className="w-4 h-4" />
                 </div>
                 <div>
                   <div className="font-semibold text-sm text-slate-800">服务超时预警</div>
                   <div className="text-xs text-slate-500 mt-1">
                     工单号: T-088<br/>
                     原因: 预计15:00结束，现已超期。<br/>
                     执行人: 李丽
                   </div>
                   <button className="mt-2 text-xs text-blue-600 font-medium hover:underline">联系护理员</button>
                 </div>
              </div>
          </CardContent>
        </Card>
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                发起临时工单
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">&times;</button>
            </div>
            <form onSubmit={handleCreateOrder}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">工单内容 *</label>
                  <input name="content" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: 临时血压测量 / 协助更换衣物" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">工单类型 *</label>
                     <select name="type" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="care">生活照料</option>
                        <option value="medical">医疗护理</option>
                        <option value="cleaning">卫生保洁</option>
                        <option value="entertainment">文化娱乐</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">计划时间</label>
                    <input name="time" type="time" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">关联长者 (可选)</label>
                   <select name="elder" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">-- 无特定长者 / 公共区域 --</option>
                      {elders.map(e => (
                        <option key={e.id} value={e.id}>{e.name} ({e.room})</option>
                      ))}
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">指派承办人 (可选)</label>
                   <select name="staff" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option value="">-- 暂不指派 (放入工单大厅) --</option>
                      {staff.filter(s => s.status !== '休息中').map(s => (
                        <option key={s.id} value={s.name}>{s.name} ({s.position})</option>
                      ))}
                   </select>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowOrderModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">生成并派发工单</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
