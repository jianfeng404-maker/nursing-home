import React, { useState } from "react";
import { Plus, Search, User, FileText, CheckCircle2, Clock, AlertTriangle, Stethoscope, X, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { ElderLink } from "../components/ElderLink";
import { useStore } from "../store";

export function DoctorRounds() {
  const [activeTab, setActiveTab] = useState("today");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedRound, setSelectedRound] = useState<any>(null);

  const rounds = useStore(state => state.rounds);
  const addRound = useStore(state => state.addRound);
  const updateRoundStatus = useStore(state => state.updateRoundStatus);

  const [newTask, setNewTask] = useState({ elderInfo: "", time: "", type: "例行查房", notes: "" });
  const [reportForm, setReportForm] = useState({ diagnosis: "", treatment: "" });

  const handleAddTask = () => {
    if (!newTask.elderInfo || !newTask.time) {
      toast.error("请填入必填项");
      return;
    }
    const [elder, room] = newTask.elderInfo.split(" ");
    addRound({
      id: `R2026-00${rounds.length + 1}`,
      elder,
      elderId: "E00X",
      room: room.replace("(", "").replace(")", ""),
      time: newTask.time,
      doctor: "自动排班",
      type: newTask.type,
      status: "未开始",
      notes: newTask.notes
    });
    setShowAddModal(false);
    toast.success("查房任务已加入日程");
  };

  const handleStartRound = (r: any) => {
    setSelectedRound(r);
    setShowStartModal(true);
  };

  const submitReport = () => {
    if (!reportForm.diagnosis) {
       toast.error("请输入查房/看诊结果");
       return;
    }
    updateRoundStatus(selectedRound.id, "已完成", reportForm.diagnosis);
    setShowStartModal(false);
    setReportForm({ diagnosis: "", treatment: "" });
    toast.success("查房记录已完成并归档");
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">医师巡查与看诊记录</h1>
          <p className="text-slate-500 mt-1">管理驻院医师的每日查房安排及诊疗记录。</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            新建查房任务
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="flex px-4 border-b border-slate-100 shrink-0">
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "today" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("today")}
          >
            今日巡查任务
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "history" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            onClick={() => setActiveTab("history")}
          >
            历史看诊记录
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {activeTab === "today" ? (
             <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr className="text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">任务编号</th>
                  <th className="px-6 py-4 font-medium">计划时间</th>
                  <th className="px-6 py-4 font-medium">服务对象</th>
                  <th className="px-6 py-4 font-medium">看诊分类</th>
                  <th className="px-6 py-4 font-medium">负责医师</th>
                  <th className="px-6 py-4 font-medium">状态及重点事项</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rounds.map(round => (
                  <tr key={round.id} className="hover:bg-slate-50 transition-colors text-sm">
                     <td className="px-6 py-4 font-mono text-slate-500">{round.id}</td>
                     <td className="px-6 py-4 text-slate-600 font-medium">{round.time}</td>
                     <td className="px-6 py-4 font-bold text-slate-800"><ElderLink text={round.elder} id={round.elderId} className="text-emerald-700 hover:underline" /> <span className="text-xs text-slate-400 font-normal ml-1">({round.room})</span></td>
                     <td className="px-6 py-4 text-slate-600">
                        <span className={`px-2 py-0.5 rounded text-xs ${round.type === '重点观察' ? 'bg-amber-100 text-amber-700 font-bold' : 'bg-slate-100 text-slate-600'}`}>{round.type}</span>
                     </td>
                     <td className="px-6 py-4 text-slate-600">{round.doctor}</td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-1 text-xs font-medium rounded-full ${round.status === '已完成' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{round.status}</span>
                           <span className="text-slate-500 text-xs">{round.notes}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                        {round.status === '已完成' ? (
                           <button onClick={() => {setSelectedRound(round); setShowReportModal(true);}} className="text-slate-500 hover:text-slate-700 font-medium border border-slate-200 px-3 py-1 rounded hover:bg-slate-50">查看报告</button>
                        ) : (
                           <button onClick={() => handleStartRound(round)} className="text-emerald-600 hover:text-emerald-800 font-bold border border-emerald-200 bg-emerald-50 px-3 py-1 rounded hover:bg-emerald-100">开始查房</button>
                        )}
                     </td>
                  </tr>
                ))}
              </tbody>
             </table>
          ) : (
             <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                <tr className="text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">任务编号</th>
                  <th className="px-6 py-4 font-medium">看诊时间</th>
                  <th className="px-6 py-4 font-medium">服务对象</th>
                  <th className="px-6 py-4 font-medium">负责医师</th>
                  <th className="px-6 py-4 font-medium">看诊记录 (节选)</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: "R2026-000", elder: "刘建国", room: "A栋-102", time: "昨天 14:00", doctor: "王主任", notes: "恢复良好，建议继续现有康复计划" },
                  { id: "R2025-999", elder: "王秀兰", room: "B栋-305", time: "昨天 09:30", doctor: "刘医生", notes: "血压正常，情绪稳定" }
                ].map(round => (
                  <tr key={round.id} className="hover:bg-slate-50 transition-colors text-sm">
                     <td className="px-6 py-4 font-mono text-slate-500">{round.id}</td>
                     <td className="px-6 py-4 text-slate-600">{round.time}</td>
                     <td className="px-6 py-4 font-bold text-slate-800">{round.elder} <span className="text-xs text-slate-400 font-normal ml-1">({round.room})</span></td>
                     <td className="px-6 py-4 text-slate-600">{round.doctor}</td>
                     <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{round.notes}</td>
                     <td className="px-6 py-4 text-right">
                        <button onClick={() => {setSelectedRound(round); setShowReportModal(true);}} className="text-slate-500 hover:text-slate-700 font-medium border border-slate-200 px-3 py-1 rounded hover:bg-slate-50">查看报告</button>
                     </td>
                  </tr>
                ))}
              </tbody>
             </table>
          )}
        </div>
      </div>
      
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-lg w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0">
               <h3 className="text-xl font-black text-slate-800">新建查房/看诊任务</h3>
               <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5"/>
               </button>
            </div>
            <div className="p-6 space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">目标长者 <span className="text-red-500">*</span></label>
                  <select 
                    value={newTask.elderInfo} onChange={e => setNewTask({...newTask, elderInfo: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow">
                     <option value="">请选择...</option>
                     <option value="张伟明 (A栋-201)">张伟明 (A栋-201)</option>
                     <option value="李秀兰 (B栋-305)">李秀兰 (B栋-305)</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">计划时间 <span className="text-red-500">*</span></label>
                  <input 
                    type="time" 
                    value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">查房类型</label>
                  <select 
                    value={newTask.type} onChange={e => setNewTask({...newTask, type: e.target.value})}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow">
                     <option>例行查房</option>
                     <option>重点观察</option>
                     <option>突发不适</option>
                     <option>家属预约</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">备注/关注重点</label>
                  <textarea 
                    value={newTask.notes} onChange={e => setNewTask({...newTask, notes: e.target.value})}
                    rows={3} placeholder="例：重点检查血压和呼吸道状况" className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"></textarea>
               </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 shrink-0">
               <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">取消</button>
               <button onClick={handleAddTask} className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm">设定查房</button>
            </div>
          </div>
        </div>
      )}

      {showStartModal && selectedRound && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-2xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-emerald-600" /> 进行看诊记录</h3>
               <button onClick={() => setShowStartModal(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5"/>
               </button>
            </div>
            <div className="p-6 space-y-4">
               <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex gap-4 text-sm mb-4">
                  <div><span className="font-bold text-slate-600">服务对象：</span><span className="font-bold text-emerald-700">{selectedRound.elder}</span></div>
                  <div><span className="font-bold text-slate-600">床位：</span><span className="font-bold text-emerald-700">{selectedRound.room}</span></div>
                  <div><span className="font-bold text-slate-600">类别：</span><span className="font-bold text-emerald-700">{selectedRound.type}</span></div>
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">看诊诊断 / 查房纪要 <span className="text-red-500">*</span></label>
                  <textarea 
                    value={reportForm.diagnosis} onChange={e => setReportForm({...reportForm, diagnosis: e.target.value})}
                    rows={4} placeholder="描述查体结果和各项体征表现... (例如：查体心肺听诊未见明显杂音，血压140/90)" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"></textarea>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">处置建议 / 医嘱 <span className="text-slate-400 font-normal">(选填)</span></label>
                  <textarea 
                    value={reportForm.treatment} onChange={e => setReportForm({...reportForm, treatment: e.target.value})}
                    rows={3} placeholder="需要开具的药物调整或化验建议... (例如：替米沙坦加量至40mg)" className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"></textarea>
               </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 sticky bottom-0 shrink-0">
               <button onClick={() => setShowStartModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">取消</button>
               <button onClick={submitReport} className="px-5 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm">提交并归档医疗档案</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && selectedRound && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-2xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-2"><FileSignature className="w-5 h-5 text-emerald-600" /> 看诊记录报告单</h3>
               <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5"/>
               </button>
            </div>
            <div className="p-6">
               <div className="grid grid-cols-2 gap-4 text-sm mb-6 pb-6 border-b border-slate-100">
                  <div><span className="font-bold text-slate-500">报告单号：</span> <span className="font-mono">{selectedRound.id}</span></div>
                  <div><span className="font-bold text-slate-500">服务对象：</span> {selectedRound.elder} <span className="text-xs">({selectedRound.room})</span></div>
                  <div><span className="font-bold text-slate-500">看诊时间：</span> {selectedRound.time}</div>
                  <div><span className="font-bold text-slate-500">出诊医师：</span> {selectedRound.doctor}</div>
                  <div><span className="font-bold text-slate-500">诊断类别：</span> <span className="bg-slate-100 px-2 py-0.5 rounded">{selectedRound.type}</span></div>
               </div>
               
               <div>
                  <h4 className="font-bold text-slate-800 mb-2">一、 查房纪要评述</h4>
                  <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed border border-slate-200 whitespace-pre-wrap">
                    {selectedRound.notes || "暂无明细"}
                  </div>
               </div>
               
               <div className="mt-8 flex justify-between items-center text-sm border-t border-slate-100 pt-6">
                 <div className="text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 已录入《中心医疗归档系统》</div>
                 <div className="font-bold text-slate-700">签署人: <span className="font-signature text-xl border-b border-slate-300 px-2">{selectedRound.doctor}</span></div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

