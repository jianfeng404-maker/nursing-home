import React, { useState } from 'react';
import { X, CheckCircle2, Clock, Calendar, ChevronRight, User, AlertCircle, FileText, Smartphone } from 'lucide-react';
import { useStore } from '../store';
import { toast } from 'sonner';

export function CareworkerAppPreview({ onClose }: { onClose: () => void }) {
  const { elders, serviceItems, addCareRecord } = useStore();
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');

  // Mock tasks for the caregiver
  const [todayTasks, setTodayTasks] = useState([
    {
      id: 'T-1001',
      elderName: elders[0]?.name || '张奶奶',
      elderId: elders[0]?.id || 'ELD-001',
      room: 'A栋-101号',
      time: '08:00',
      status: 'pending',
      serviceId: serviceItems.find(s => s.name.includes('洗头'))?.id || serviceItems[0]?.id,
    },
    {
      id: 'T-1002',
      elderName: elders[0]?.name || '张奶奶',
      elderId: elders[0]?.id || 'ELD-001',
      room: 'A栋-101号',
      time: '09:30',
      status: 'completed',
      serviceId: serviceItems.find(s => s.name.includes('口腔'))?.id || (serviceItems.length > 2 ? serviceItems[2].id : null),
    },
    {
      id: 'T-1003',
      elderName: elders[1]?.name || '李爷爷',
      elderId: elders[1]?.id || 'ELD-002',
      room: 'A栋-102号',
      time: '11:00',
      status: 'pending',
      serviceId: serviceItems.find(s => s.name.includes('进食'))?.id || (serviceItems.length > 1 ? serviceItems[1].id : null),
    }
  ]);

  const handleStepCheck = (stepIndex: number) => {
    setCheckedSteps(prev => ({
      ...prev,
      [stepIndex]: !prev[stepIndex]
    }));
  };

  const handleCompleteTask = () => {
    if (!selectedTask) return;

    // Remove task from local display list (mock)
    setTodayTasks(prev => prev.filter(t => t.id !== selectedTask.id));

    const service = serviceItems.find(s => s.id === selectedTask.serviceId);
    
    // Add to global store care records
    addCareRecord({
      id: `REC-${Date.now()}`,
      time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      type: 'planned_task',
      content: service ? service.name : '日常护理',
      result: `SOP打卡完成。${notes ? '备注: ' + notes : '无异常情况。'}`,
      elderId: selectedTask.elderId,
      elderName: selectedTask.elderName,
      caregiver: '王阿姨',
    });

    toast.success('工单已完成，护理记录已同步');
    setSelectedTask(null);
    setCheckedSteps({});
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* Dynamic Island / Notch Simulation */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
          <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        </div>

        {/* Top App Bar inside frame */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white pt-12 pb-4 px-4 flex items-center justify-between shadow-sm z-40 relative">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 backdrop-blur-sm">
                <span className="font-bold text-sm">护工</span>
             </div>
             <div>
               <h2 className="font-bold text-lg leading-tight">王阿姨</h2>
               <p className="text-xs text-teal-100 flex items-center gap-1">早班 (08:00 - 16:00)</p>
             </div>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 relative">
          
          {selectedTask ? (
            <div className="animate-in slide-in-from-right-8 duration-200">
                <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-slate-100 flex items-center gap-3">
                  <button onClick={() => setSelectedTask(null)} className="p-1 -ml-1 text-slate-500 hover:text-slate-700">
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </button>
                  <h3 className="font-bold text-slate-800 flex-1">工单详情</h3>
                </div>
                
                <div className="p-4">
                  <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">{selectedTask.elderName}</h4>
                        <p className="text-sm text-slate-500">{selectedTask.room}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md text-xs font-bold font-mono">
                        {selectedTask.time}
                      </span>
                    </div>
                    {/* Render SOP based on serviceId */}
                    {(() => {
                      const service = serviceItems.find(s => s.id === selectedTask.serviceId);
                      if (!service) return <div className="text-sm text-slate-500">找不到对应的服务标准...</div>;
                      
                      const allChecked = service.sopSteps.length > 0 && service.sopSteps.every((_, i) => checkedSteps[i]);

                      return (
                        <>
                          <div className="border-t border-slate-100 pt-3 mt-1">
                            <h5 className="font-bold text-slate-800 mb-1">{service.name}</h5>
                            <p className="text-xs text-slate-500 flex items-center gap-2 mb-3">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded">{service.category}</span>
                              <span>预计时长: {service.duration}</span>
                            </p>
                            
                            <div className="space-y-2 mt-4">
                              <p className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                标准操作程序 (SOP) 打卡
                              </p>
                              {service.sopSteps.map((step, idx) => (
                                <div 
                                  key={idx} 
                                  onClick={() => handleStepCheck(idx)}
                                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    checkedSteps[idx] 
                                      ? 'bg-emerald-50 border-emerald-200' 
                                      : 'bg-white border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                    checkedSteps[idx] 
                                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                                      : 'border-slate-300'
                                  }`}>
                                    {checkedSteps[idx] && <CheckCircle2 className="w-3.5 h-3.5" />}
                                  </div>
                                  <p className={`text-sm leading-snug flex-1 ${checkedSteps[idx] ? 'text-emerald-800' : 'text-slate-700'}`}>
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                      
                          <div className="mt-6">
                            <h5 className="text-xs font-bold text-slate-700 mb-2">服务记录与异常</h5>
                            <textarea 
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="如有异常情况或补充说明请在此填写..."
                              className="w-full text-sm border border-slate-200 rounded-lg p-3 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 min-h-[80px]"
                            />
                          </div>

                          <div className="mt-6">
                            <button 
                              onClick={handleCompleteTask}
                              disabled={!allChecked}
                              className={`w-full py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 ${
                                allChecked 
                                ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <CheckCircle2 className="w-5 h-5" />
                              {allChecked ? '提交工单并结案' : '请先完成所有SOP打卡'}
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-end mb-2 px-1">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">今日工单</h3>
                  <p className="text-xs text-slate-500">待完成 2 / 总计 12</p>
                </div>
                <button className="text-teal-600 text-sm font-medium">查看日历</button>
              </div>

              {todayTasks.map((task) => {
                const service = serviceItems.find(s => s.id === task.serviceId);
                const isCompleted = task.status === 'completed';

                return (
                  <div 
                    key={task.id} 
                    onClick={() => !isCompleted && setSelectedTask(task)}
                    className={`bg-white p-4 rounded-2xl border transition-all ${
                      isCompleted 
                        ? 'border-slate-100 opacity-60' 
                        : 'border-slate-200 hover:border-teal-300 hover:shadow-md cursor-pointer'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isCompleted ? 'text-slate-400' : 'text-teal-600'}`} />
                        <span className="font-bold opacity-90 font-mono text-slate-700">{task.time}</span>
                        {isCompleted && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">已完成</span>}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800 text-sm">{task.elderName}</p>
                        <p className="text-[10px] text-slate-500">{task.room}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between">
                       <div>
                         <p className="text-sm font-bold text-slate-800 leading-tight mb-0.5">
                           {service ? service.name : '未知服务'}
                         </p>
                         <p className="text-[10px] text-slate-500">
                           {service ? service.category : ''}
                         </p>
                       </div>
                       {!isCompleted && <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Nav Bar */}
        <div className="h-16 bg-white border-t border-slate-100 flex justify-around items-center px-2 pb-2 z-40 relative">
           <button className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'tasks' ? 'text-teal-600' : 'text-slate-400'}`} onClick={() => setActiveTab('tasks')}>
             <Calendar className="w-5 h-5"/>
             <span className="text-[10px] font-medium">看护工单</span>
           </button>
           <button className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'elders' ? 'text-teal-600' : 'text-slate-400'}`} onClick={() => setActiveTab('elders')}>
             <User className="w-5 h-5"/>
             <span className="text-[10px] font-medium">长者名册</span>
           </button>
           <button className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'alarms' ? 'text-teal-600' : 'text-slate-400'}`} onClick={() => setActiveTab('alarms')}>
             <AlertCircle className="w-5 h-5"/>
             <span className="text-[10px] font-medium">呼叫报警</span>
           </button>
        </div>

        {/* Close Button overlapping frame */}
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-slate-800 text-white rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors shadow-xl border-2 border-white z-[110]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {/* Click outside to close (Optional, could add to parent div) */}
    </div>
  );
}
