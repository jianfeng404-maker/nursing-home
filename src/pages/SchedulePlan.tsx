import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Calendar as CalendarIcon, Settings, Wand2, ChevronLeft, ChevronRight, X, Clock } from "lucide-react";

export function SchedulePlan() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [activeDept, setActiveDept] = useState("护理一部");

  const depts = ["护理一部", "护理二部", "医疗中心", "后勤部"];

  const weeks = [
    { label: "2026年4月 第4周 (4.27 - 5.03)", startDay: 27 },
    { label: "2026年5月 第1周 (5.04 - 5.10)", startDay: 4 },
  ];
  const currentWeek = weeks[currentWeekIndex].label;

  // State for shifts
  const [schedules, setSchedules] = useState([
    { id: '1', name: "张明宇", role: "主管", dept: "护理一部", shifts: ["白班", "白班", "白班", "夜班", "夜班", "休息", "休息"] },
    { id: '2', name: "李秀兰", role: "护理员", dept: "护理一部", shifts: ["休息", "休息", "白班", "白班", "夜班", "夜班", "白班"] },
    { id: '3', name: "王建国", role: "护理员", dept: "护理一部", shifts: ["夜班", "夜班", "休息", "白班", "白班", "白班", "夜班"] },
    { id: '4', name: "刘梅", role: "护理员", dept: "护理一部", shifts: ["白班", "白班", "白班", "白班", "休息", "休息", "白班"] },
    { id: '5', name: "陈敏", role: "护理员", dept: "护理二部", shifts: ["白班", "夜班", "休息", "白班", "夜班", "休息", "白班"] },
  ]);

  const filteredSchedules = schedules.filter(s => s.dept === activeDept);

  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Edit Shift Modal
  const [editingShift, setEditingShift] = useState<{empId: string, dayIndex: number, currentShift: string, empName: string} | null>(null);

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
    // Demo: randomly shuffle shifts
    const newSchedules = schedules.map(emp => {
      if (emp.dept === activeDept) {
        return {
          ...emp,
          shifts: Array(7).fill(null).map(() => {
            const r = Math.random();
            if (r > 0.6) return "白班";
            if (r > 0.3) return "夜班";
            return "休息";
          })
        };
      }
      return emp;
    });
    setSchedules(newSchedules);
  };

  const handleUpdateShift = (newShift: string) => {
    if (!editingShift) return;
    const newSchedules = schedules.map(emp => {
      if (emp.id === editingShift.empId) {
        const newShifts = [...emp.shifts];
        newShifts[editingShift.dayIndex] = newShift;
        return { ...emp, shifts: newShifts };
      }
      return emp;
    });
    setSchedules(newSchedules);
    setEditingShift(null);
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
             {depts.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDept(d)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    activeDept === d ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
             ))}
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200">
             <button onClick={handlePrevWeek} disabled={currentWeekIndex === 0} className="p-1 hover:bg-white rounded transition text-slate-500 disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
             <span className="text-sm font-bold text-slate-700 min-w-[200px] text-center flex items-center justify-center gap-2">
                <CalendarIcon className="w-4 h-4" /> {currentWeek}
             </span>
             <button onClick={handleNextWeek} disabled={currentWeekIndex === weeks.length - 1} className="p-1 hover:bg-white rounded transition text-slate-500 disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
              <tr className="text-slate-500 text-sm">
                <th className="px-4 py-4 font-medium w-40 border-r border-slate-200 bg-white">员工信息</th>
                {["周一", "周二", "周三", "周四", "周五", "周六", "周日"].map((d, i) => (
                  <th key={d} className={`px-2 py-4 font-medium text-center ${i >= 5 ? 'text-rose-500 bg-rose-50/30' : ''}`}>
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
               {filteredSchedules.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-100 hover:bg-slate-50/30 transition">
                     <td className="px-4 py-4 border-r border-slate-200 bg-white/50">
                        <div className="font-bold text-slate-800">{emp.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{emp.role}</div>
                     </td>
                     {emp.shifts.map((shift, j) => (
                        <td key={j} className={`p-2 text-center ${j >= 5 ? 'bg-rose-50/10' : ''}`}>
                           <div 
                             onClick={() => setEditingShift({ empId: emp.id, dayIndex: j, currentShift: shift, empName: emp.name })}
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
               ))}
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

      {/* Edit Shift Modal */}
      {editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <div>
                   <h3 className="font-bold text-slate-800 text-lg">修改班次</h3>
                   <p className="text-xs text-slate-500 mt-1">{editingShift.empName} - {["周一", "周二", "周三", "周四", "周五", "周六", "周日"][editingShift.dayIndex]}</p>
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
