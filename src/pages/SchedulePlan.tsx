import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Calendar as CalendarIcon, Settings, Wand2, ChevronLeft, ChevronRight, X, Clock, Plus, UserPlus } from "lucide-react";
import { useStore } from "../store";

export function SchedulePlan() {
  const { staff, nursingStations, schedules, saveSchedule } = useStore();
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeStationId, setActiveStationId] = useState(nursingStations[0]?.id || "");
  const activeStation = nursingStations.find(s => s.id === activeStationId) || nursingStations[0];

  const weeks = [
    { label: "2026年4月 第4周 (4.27 - 5.03)", id: "2026-04-27" },
    { label: "2026年5月 第1周 (5.04 - 5.10)", id: "2026-05-04" },
  ];
  
  const currentWeek = weeks[currentWeekIndex];
  const scheduleId = `${activeStationId}-${currentWeek.id}`;
  
  // Find or initialize the schedule for the current week AND station
  let currentSchedule = schedules.find(s => s.id === scheduleId);
  if (!currentSchedule && activeStation) {
     currentSchedule = {
       id: scheduleId,
       stationId: activeStation.id,
       weekStart: currentWeek.id,
       shifts: (activeStation.assignedStaff || []).map(staffId => {
          const emp = staff.find(s => s.id === staffId);
          return {
             staffId,
             staffName: emp?.name || '未知',
             isBorrowed: false,
             days: ["休息", "休息", "休息", "休息", "休息", "休息", "休息"]
          };
       })
     };
  }

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  // Edit Shift Modal
  const [editingShift, setEditingShift] = useState<{staffId: string, dayIndex: number, currentShift: string, staffName: string} | null>(null);

  const getShiftBadge = (shift: string) => {
    switch(shift) {
      case "白班": return "bg-blue-50 text-blue-700 border-blue-200";
      case "夜班": return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "休息": return "bg-slate-50 text-slate-500 border-slate-200";
      default: return "";
    }
  };

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) setCurrentWeekIndex(currentWeekIndex - 1);
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) setCurrentWeekIndex(currentWeekIndex + 1);
  };

  const handleSmartSchedule = () => {
    if (!currentSchedule) return;
    const updated = {
      ...currentSchedule,
      shifts: currentSchedule.shifts.map(sh => ({
        ...sh,
        days: Array(7).fill(null).map(() => {
          const r = Math.random();
          if (r > 0.6) return "白班";
          if (r > 0.3) return "夜班";
          return "休息";
        })
      }))
    };
    saveSchedule(updated);
  };

  const handleUpdateShift = (newShift: string) => {
    if (!editingShift || !currentSchedule) return;
    const updated = {
       ...currentSchedule,
       shifts: currentSchedule.shifts.map(sh => {
         if (sh.staffId === editingShift.staffId) {
            const newDays = [...sh.days];
            newDays[editingShift.dayIndex] = newShift;
            return { ...sh, days: newDays };
         }
         return sh;
       })
    };
    saveSchedule(updated);
    setEditingShift(null);
  };
  
  const handleBorrowStaff = (staffId: string) => {
     if (!currentSchedule) return;
     if (currentSchedule.shifts.find(s => s.staffId === staffId)) return;
     const emp = staff.find(s => s.id === staffId);
     if (!emp) return;
     
     const updated = {
        ...currentSchedule,
        shifts: [
           ...currentSchedule.shifts,
           {
              staffId: emp.id,
              staffName: emp.name,
              isBorrowed: true,
              days: ["休息", "休息", "休息", "休息", "休息", "休息", "休息"]
           }
        ]
     };
     saveSchedule(updated);
     setShowBorrowModal(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">排班规则与智能排班</h2>
          <p className="text-slate-500 text-sm mt-1">设置排班规则，智能生成排班表，并可通过日历视图进行调整</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSettingsModal(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 transition shadow-sm">
            <Settings className="w-4 h-4" /> 排班规则设置
          </button>
          <button onClick={handleSmartSchedule} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
            <Wand2 className="w-4 h-4" /> 智能一键排班
          </button>
        </div>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between bg-white z-10 shrink-0 gap-4">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
             {nursingStations.map((station) => (
                <button
                  key={station.id}
                  onClick={() => setActiveStationId(station.id)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeStationId === station.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {station.name}
                </button>
             ))}
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200">
             <button onClick={handlePrevWeek} disabled={currentWeekIndex === 0} className="p-1 hover:bg-white rounded transition text-slate-500 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
             <span className="text-sm font-bold text-slate-700 min-w-[200px] text-center flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> {currentWeek.label}
             </span>
             <button onClick={handleNextWeek} disabled={currentWeekIndex === weeks.length - 1} className="p-1 hover:bg-white rounded transition text-slate-500 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1 relative">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
             <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
               <tr className="text-slate-500 text-sm">
                 <th className="px-4 py-4 font-medium w-48 border-r border-slate-200 bg-white shadow-sm flex items-center justify-between">
                    员工信息
                    <button onClick={() => setShowBorrowModal(true)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition" title="临时借调人员">
                       <UserPlus className="w-4 h-4" />
                    </button>
                 </th>
                 {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((d, i) => (
                   <th key={d} className={`px-2 py-4 font-medium text-center ${i >= 5 ? 'text-rose-500 bg-rose-50/30' : ''}`}>
                     {d}
                   </th>
                 ))}
               </tr>
             </thead>
             <tbody className="text-sm text-slate-700">
                {currentSchedule?.shifts.map((shiftInfo) => {
                   const staffMember = staff.find(s => s.id === shiftInfo.staffId);
                   return (
                   <tr key={shiftInfo.staffId} className="border-b border-slate-100 hover:bg-slate-50/30 transition">
                      <td className="px-4 py-4 border-r border-slate-200 bg-white/50">
                         <div className="font-bold text-slate-800 flex items-center gap-2">
                            {shiftInfo.staffName}
                            {shiftInfo.isBorrowed && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded">临调</span>}
                         </div>
                         <div className="text-xs text-slate-500 mt-0.5">{staffMember?.role || '护理员'}</div>
                      </td>
                      {shiftInfo.days.map((shift, j) => (
                         <td key={j} className={`p-2 text-center ${j >= 5 ? 'bg-rose-50/10' : ''}`}>
                            <div 
                              onClick={() => setEditingShift({ staffId: shiftInfo.staffId, dayIndex: j, currentShift: shift, staffName: shiftInfo.staffName })}
                              className={`py-2 px-1 border rounded-md text-xs font-bold w-full cursor-pointer hover:opacity-80 transition ${getShiftBadge(shift)}`}
                            >
                              {shift}
                              <div className="text-[10px] font-normal opacity-70 mt-0.5 whitespace-nowrap">
                                 {shift === "白班" ? "08:00 - 18:00" : shift === "夜班" ? "18:00 - 08:00" : "-"}
                              </div>
                            </div>
                         </td>
                      ))}
                   </tr>
                )})}
                {currentSchedule?.shifts.length === 0 && (
                   <tr>
                     <td colSpan={8} className="p-8 text-center text-slate-400 font-bold">该站点尚未分配人员排班，请配置护理站人员或借调临时人员</td>
                   </tr>
                )}
                <tr>
                  <td colSpan={8} className="p-4 bg-slate-50/50">
                     <div className="flex gap-4 items-center justify-center text-xs text-slate-500">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded-sm"></div> 白班 (08:00-18:00)</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-50 border border-indigo-200 rounded-sm"></div> 夜班 (18:00-08:00)</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-50 border border-slate-200 rounded-sm"></div> 休息</span>
                     </div>
                  </td>
                </tr>
             </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Settings className="w-5 h-5 text-indigo-600" /> 排班规则设置
                </h3>
                <button onClick={() => setShowSettingsModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 text-left space-y-6">
                <div>
                   <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" />班次时间定义</h4>
                   <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-300 transition">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                            <span className="font-medium text-slate-700">常规白班</span>
                         </div>
                         <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">08:00 - 18:00</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-indigo-300 transition">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-sm"></div>
                            <span className="font-medium text-slate-700">常规夜班</span>
                         </div>
                         <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">18:00 - 08:00</span>
                      </div>
                   </div>
                   <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mt-3">+ 添加新班次</button>
                </div>

                <div>
                   <h4 className="text-sm font-bold text-slate-800 mb-3">排班约束规则</h4>
                   <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                         <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                         <span className="text-sm text-slate-700">夜班后必须连续休息至少 <input type="number" defaultValue={24} className="w-12 border border-slate-300 rounded px-1 py-0.5 mx-1 text-center" /> 小时</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg cursor-pointer hover:bg-slate-100 transition">
                         <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                         <span className="text-sm text-slate-700">每周最大工作时长不超过 <input type="number" defaultValue={48} className="w-12 border border-slate-300 rounded px-1 py-0.5 mx-1 text-center" /> 小时</span>
                      </label>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowSettingsModal(false)} className="px-5 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                <button onClick={() => setShowSettingsModal(false)} className="px-5 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow-sm">保存设置</button>
             </div>
          </div>
        </div>
      )}

      {/* Borrow Staff Modal */}
      {showBorrowModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 text-indigo-700">
                     <UserPlus className="w-5 h-5" /> 借调临时人员
                   </h3>
                   <p className="text-xs text-slate-500 mt-1">从全院人员库中添加护理人员至当前站点（{activeStation?.name}）本周排班表</p>
                </div>
                <button onClick={() => setShowBorrowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-4 overflow-y-auto max-h-[50vh] space-y-2">
                {staff
                   .filter(emp => !currentSchedule?.shifts.find(sh => sh.staffId === emp.id))
                   .map(emp => (
                      <div key={emp.id} className="flex items-center justify-between border border-slate-100 p-3 rounded-lg hover:border-indigo-300 hover:bg-slate-50 transition cursor-pointer" onClick={() => handleBorrowStaff(emp.id)}>
                         <div>
                            <div className="font-bold text-slate-800 text-sm">{emp.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{emp.role}</div>
                         </div>
                         <button className="px-3 py-1.5 bg-white border border-slate-200 text-indigo-600 font-medium text-xs rounded shadow-sm">加入排班表</button>
                      </div>
                   ))
                }
                {staff.filter(emp => !currentSchedule?.shifts.find(sh => sh.staffId === emp.id)).length === 0 && (
                   <div className="p-6 text-center text-slate-500 text-sm">所有人员均已在本排班表中</div>
                )}
             </div>
           </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg">修改班次</h3>
                   <p className="text-xs text-slate-500 mt-1">{editingShift.staffName} - {["周一", "周二", "周三", "周四", "周五", "周六", "周日"][editingShift.dayIndex]}</p>
                </div>
                <button onClick={() => setEditingShift(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 text-left grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleUpdateShift("白班")}
                  className={`py-3 border rounded-lg text-sm font-bold flex flex-col items-center gap-1 transition ${getShiftBadge("白班")} hover:ring-2 hover:ring-blue-300 ${editingShift.currentShift === "白班" ? "ring-2 ring-blue-500 border-blue-500" : ""}`}
                >
                  <span>白班</span>
                </button>
                <button 
                  onClick={() => handleUpdateShift("夜班")}
                  className={`py-3 border rounded-lg text-sm font-bold flex flex-col items-center gap-1 transition ${getShiftBadge("夜班")} hover:ring-2 hover:ring-indigo-300 ${editingShift.currentShift === "夜班" ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`}
                >
                  <span>夜班</span>
                </button>
                <button 
                  onClick={() => handleUpdateShift("休息")}
                  className={`py-3 border rounded-lg text-sm font-bold flex flex-col items-center gap-1 transition ${getShiftBadge("休息")} hover:ring-2 hover:ring-slate-300 ${editingShift.currentShift === "休息" ? "ring-2 ring-slate-500 border-slate-500" : ""}`}
                >
                  <span>休息</span>
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
