import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, HeartPulse, Activity, Thermometer, Pill, Search as SearchIcon, FileBarChart, Plus, ChevronRight, X, CheckCircle2, Trash2, Edit2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HealthRecord({ targetElderId, setTargetElderId, embedded }: { targetElderId?: string | null, setTargetElderId?: (id: string | null) => void, embedded?: boolean }) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBpDataModal, setShowBpDataModal] = useState(false);
  const [showEditHealthModal, setShowEditHealthModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showAddMedicationModal, setShowAddMedicationModal] = useState(false);
  const [editingMedication, setEditingMedication] = useState<any>(null);
  const [selectedElder, setSelectedElder] = useState<any>(null);
  const [activeVitalTab, setActiveVitalTab] = useState('bp');
  const [medications, setMedications] = useState([
    { id: 1, name: "苯磺酸氨氯地平片", frequency: "每日一次", dosage: "每次1片 (5mg)", instruction: "饭后口服" },
    { id: 2, name: "二甲双胍肠溶片", frequency: "每日三次", dosage: "每次1片 (0.5g)", instruction: "随餐口服" }
  ]);

  const [records] = useState([
     { id: "ELD-001", name: "张明宇", room: "A栋-101", chronicCount: 2, allergies: "青霉素", lastExam: "2023-11-10", completeness: 95, 
       history: "高血压10年、糖尿病5年", vitalsData: [
         { date: '11/20', sys: 135, dia: 85, hr: 72, bs: 5.8, sleep: 7.2, weight: 65.2 }, 
         { date: '11/21', sys: 138, dia: 88, hr: 75, bs: 6.1, sleep: 6.8, weight: 65.3 }, 
         { date: '11/22', sys: 130, dia: 82, hr: 70, bs: 5.5, sleep: 8.0, weight: 65.1 }, 
         { date: '11/23', sys: 140, dia: 90, hr: 78, bs: 6.4, sleep: 6.5, weight: 65.4 }, 
         { date: '11/24', sys: 135, dia: 85, hr: 74, bs: 5.9, sleep: 7.5, weight: 65.2 }
       ] 
     },
     { id: "ELD-002", name: "李秀红", room: "A栋-105", chronicCount: 1, allergies: "无", lastExam: "2023-10-05", completeness: 80, history: "阿尔茨海默症中期", vitalsData: [] },
     { id: "ELD-003", name: "赵大爷", room: "B栋-201", chronicCount: 3, allergies: "海鲜", lastExam: "2023-09-15", completeness: 100, history: "关节炎、轻度听力障碍", vitalsData: [] },
  ]);

  useEffect(() => {
     if (targetElderId && embedded) {
        const elder = records.find(r => r.id === targetElderId);
        if (elder) {
           setSelectedElder(elder);
        }
     }
  }, [targetElderId, records, embedded]);

  const handleOpenDetail = (record: any) => {
    setSelectedElder(record);
    setShowDetailModal(true);
  };

  const renderDetailContent = () => (
    <div className="flex-1 overflow-y-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm border-l-4 border-l-blue-500 overflow-hidden">
            <CardHeader className="pb-3 bg-blue-50/30">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500 animate-pulse" /> 
                  实时物联网监护数据
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  设备在线采集中
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                 <span className="text-slate-500 text-xs mb-1">实时心率</span>
                 <div className="flex items-baseline gap-1">
                   <strong className="text-2xl font-bold text-rose-600">76</strong>
                   <span className="text-xs text-slate-400">次/分</span>
                 </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                 <span className="text-slate-500 text-xs mb-1">呼吸频率</span>
                 <div className="flex items-baseline gap-1">
                   <strong className="text-2xl font-bold text-blue-600">18</strong>
                   <span className="text-xs text-slate-400">次/分</span>
                 </div>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                 <span className="text-slate-500 text-xs mb-1">血氧饱和</span>
                 <div className="flex items-baseline gap-1">
                   <strong className="text-2xl font-bold text-emerald-600">98</strong>
                   <span className="text-xs text-slate-400">%</span>
                 </div>
               </div>
               <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex flex-col items-center justify-center relative overflow-hidden">
                 <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 font-bold rounded-bl">偏高</span>
                 <span className="text-slate-500 text-xs mb-1">实时血压</span>
                 <div className="flex items-baseline gap-1">
                   <strong className="text-xl font-bold text-rose-600">142/91</strong>
                 </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2"><FileBarChart className="w-4 h-4 text-rose-500" /> 既往病史与过敏记录</CardTitle>
              <button onClick={() => setShowEditHealthModal(true)} className="text-xs text-rose-600 hover:text-rose-800 border border-current px-2 py-1 rounded">编辑信息</button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-lg">
                <span className="block text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">明确诊断与既往史</span>
                <p className="text-slate-800 font-medium">{selectedElder?.history}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-lg">
                  <span className="block text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">过敏史提示</span>
                  <p className="text-slate-800 font-medium">{selectedElder?.allergies !== '无' ? <span className="text-amber-700">{selectedElder?.allergies}</span> : '无已知过敏'}</p>
                </div>
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                  <span className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">家族遗传史</span>
                  <p className="text-slate-800 font-medium">无明显遗传病史记录</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                 <Activity className="w-4 h-4 text-blue-500" /> 生命体征趋势
              </CardTitle>
              <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-auto">
                 <button onClick={() => setActiveVitalTab('bp')} className={`px-3 py-1 text-xs font-medium rounded ${activeVitalTab === 'bp' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>血压</button>
                 <button onClick={() => setActiveVitalTab('hr')} className={`px-3 py-1 text-xs font-medium rounded ${activeVitalTab === 'hr' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>心率</button>
                 <button onClick={() => setActiveVitalTab('bs')} className={`px-3 py-1 text-xs font-medium rounded ${activeVitalTab === 'bs' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>血糖</button>
                 <button onClick={() => setActiveVitalTab('sleep')} className={`px-3 py-1 text-xs font-medium rounded ${activeVitalTab === 'sleep' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>睡眠</button>
                 <button onClick={() => setActiveVitalTab('weight')} className={`px-3 py-1 text-xs font-medium rounded ${activeVitalTab === 'weight' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>体重</button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedElder?.vitalsData && selectedElder.vitalsData.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">{activeVitalTab === 'bp' ? 'mmHg' : activeVitalTab === 'hr' ? 'bpm / 次/分' : activeVitalTab === 'bs' ? 'mmol/L' : activeVitalTab === 'sleep' ? '小时 (h)' : '公斤 (kg)'}</span>
                     <button onClick={() => setShowBpDataModal(true)} className="text-xs text-blue-600 hover:underline">查看历史数据表</button>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedElder.vitalsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        {activeVitalTab === 'bp' && (
                          <>
                            <Line type="monotone" dataKey="sys" name="收缩压(高压)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            <Line type="monotone" dataKey="dia" name="舒张压(低压)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                          </>
                        )}
                        {activeVitalTab === 'hr' && <Line type="monotone" dataKey="hr" name="心率" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                        {activeVitalTab === 'bs' && <Line type="monotone" dataKey="bs" name="空腹血糖" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                        {activeVitalTab === 'sleep' && <Line type="monotone" dataKey="sleep" name="睡眠时长" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                        {activeVitalTab === 'weight' && <Line type="monotone" dataKey="weight" name="体重" stroke="#64748b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="h-32 flex items-center justify-center text-slate-400 text-sm bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                  暂无近期体征测量数据
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm bg-emerald-700 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-emerald-50"><Pill className="w-5 h-5 text-emerald-200" /> 当前常用药记录</h3>
              <div className="space-y-3">
                <div className="bg-emerald-800/50 p-3 rounded-lg border border-emerald-600/50">
                  <div className="font-bold mb-1">苯磺酸氨氯地平片</div>
                  <div className="text-sm text-emerald-100/80">每日一次 / 每次1片 (5mg)</div>
                  <div className="text-xs text-emerald-200/60 mt-1">口服 · 饭后</div>
                </div>
                <div className="bg-emerald-800/50 p-3 rounded-lg border border-emerald-600/50">
                  <div className="font-bold mb-1">二甲双胍肠溶片</div>
                  <div className="text-sm text-emerald-100/80">每日三次 / 每次1片 (0.5g)</div>
                  <div className="text-xs text-emerald-200/60 mt-1">口服 · 随餐</div>
                </div>
              </div>
              <button onClick={() => setShowMedicationModal(true)} className="w-full mt-4 py-2 border border-emerald-500/50 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">管理用药清单</button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    if (!selectedElder) {
       return <div className="h-48 flex items-center justify-center text-slate-500">正在加载健康档案...</div>;
    }
    return (
      <div className="animate-in fade-in pb-8">
        <div className="mb-6 border-b border-slate-200 pb-4">
           <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              {selectedElder.name} <span className="font-normal text-slate-500 text-sm">的健康主页面板</span>
           </h3>
        </div>
        {renderDetailContent()}
        
        {/* Modals needed for embedded view */}
        {showBpDataModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col animate-in zoom-in-95">
               <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg">近期各项体征测量数据 (列表)</h3>
                  <button onClick={() => setShowBpDataModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
               </div>
               <div className="p-5 overflow-y-auto max-h-[60vh]">
                  <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                           <th className="py-3 px-4 rounded-tl-lg">记录时间</th>
                           <th className="py-3 px-4">血压 (收缩/舒张)</th>
                           <th className="py-3 px-4">心率</th>
                           <th className="py-3 px-4">血糖</th>
                           <th className="py-3 px-4">睡眠</th>
                           <th className="py-3 px-4">体重</th>
                           <th className="py-3 px-4 rounded-tr-lg">测量人</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {selectedElder.vitalsData.map((d: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                             <td className="py-3 px-4 text-slate-800">{d.date} 08:30</td>
                             <td className="py-3 px-4 font-medium text-slate-800">{d.sys} / {d.dia}</td>
                             <td className="py-3 px-4 text-slate-600">{d.hr} bpm</td>
                             <td className="py-3 px-4 text-slate-600">{d.bs} mmol/L</td>
                             <td className="py-3 px-4 text-slate-600">{d.sleep} h</td>
                             <td className="py-3 px-4 text-slate-600">{d.weight} kg</td>
                             <td className="py-3 px-4 text-slate-500">张护士</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {showMedicationModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col animate-in zoom-in-95">
               <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-50">
                  <h3 className="font-bold text-emerald-800 text-lg flex items-center gap-2"><Pill className="w-5 h-5" /> 长期用药管理</h3>
                  <button onClick={() => setShowMedicationModal(false)} className="text-emerald-600 hover:text-emerald-800"><X className="w-5 h-5" /></button>
               </div>
               <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                     <span className="text-sm font-medium text-slate-700">当前执行中的医嘱用药：</span>
                     <button onClick={() => { setEditingMedication(null); setShowAddMedicationModal(true); }} className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center gap-1"><Plus className="w-3 h-3" /> 添加新药</button>
                  </div>
                  <table className="w-full text-sm text-left border border-slate-200 rounded-lg overflow-hidden">
                     <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <tr><th className="py-3 px-4">药品名称</th><th className="py-3 px-4">频次</th><th className="py-3 px-4">单次剂量</th><th className="py-3 px-4">服药指导</th><th className="py-3 px-4 text-right">操作</th></tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {medications.map(med => (
                          <tr key={med.id} className="hover:bg-slate-50">
                             <td className="py-3 px-4 font-bold text-slate-800">{med.name}</td>
                             <td className="py-3 px-4 text-slate-600">{med.frequency}</td>
                             <td className="py-3 px-4 text-slate-600">{med.dosage}</td>
                             <td className="py-3 px-4 text-slate-500 text-xs">{med.instruction}</td>
                             <td className="py-3 px-4 text-right">
                               <button onClick={() => { setEditingMedication(med); setShowAddMedicationModal(true); }} className="text-blue-500 hover:text-blue-700 mr-3 text-xs"><Edit2 className="w-3.5 h-3.5" /></button>
                               <button onClick={() => setMedications(medications.filter(m => m.id !== med.id))} className="text-rose-500 hover:text-rose-700 text-xs"><Trash2 className="w-3.5 h-3.5" /></button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          </div>
        )}

        {showAddMedicationModal && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95">
               <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">{editingMedication ? '修改用药记录' : '添加长期用药记录'}</h3>
                  <button onClick={() => setShowAddMedicationModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
               </div>
               <div className="p-5 space-y-4 text-sm">
                 <div>
                   <label className="block text-slate-700 font-medium mb-1">药品名称 <span className="text-rose-500">*</span></label>
                   <input type="text" defaultValue={editingMedication?.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" placeholder="填写药品通用名或商品名" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-slate-700 font-medium mb-1">给药频次 <span className="text-rose-500">*</span></label>
                     <select defaultValue={editingMedication?.frequency} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500">
                       <option>每日一次</option><option>每日两次</option><option>每日三次</option><option>顿服/必要时</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-slate-700 font-medium mb-1">单次剂量 <span className="text-rose-500">*</span></label>
                     <input type="text" defaultValue={editingMedication?.dosage} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" placeholder="如: 1片 (5mg)" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-slate-700 font-medium mb-1">服药指导说明</label>
                   <input type="text" defaultValue={editingMedication?.instruction} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-emerald-500" placeholder="如: 饭后半小时服用" />
                 </div>
               </div>
               <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                 <button onClick={() => setShowAddMedicationModal(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-sm">取消</button>
                 <button onClick={() => {
                   if (!editingMedication) {
                     setMedications([...medications, { id: Date.now(), name: "新增药品", frequency: "每日一次", dosage: "1片", instruction: "遵医嘱" }]);
                   }
                   setShowAddMedicationModal(false);
                 }} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 text-sm">确认保存</button>
               </div>
            </div>
          </div>
        )}

        {showEditHealthModal && selectedElder && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-start">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col animate-in zoom-in-95">
               <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">编辑基础健康信息</h3>
                  <button onClick={() => setShowEditHealthModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
               </div>
               <div className="p-5 space-y-5 text-sm">
                 <div>
                   <label className="block text-slate-700 font-medium mb-2">明确诊断与既往史</label>
                   <div className="flex flex-wrap gap-2 mb-3">
                      {["高血压", "糖尿病", "冠心病", "脑卒中/中风", "慢阻肺", "骨关节炎", "阿尔茨海默病", "帕金森病"].map(disease => (
                         <label key={disease} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" defaultChecked={(selectedElder.history || "").includes(disease)} className="accent-rose-500" />
                            <span className="text-slate-700">{disease}</span>
                         </label>
                      ))}
                   </div>
                   <textarea rows={2} defaultValue={selectedElder.history} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-rose-500 resize-none" placeholder="其他诊断或补充说明..."></textarea>
                 </div>
                 <div>
                   <label className="block text-slate-700 font-medium mb-2">过敏史提示</label>
                   <div className="flex flex-wrap gap-2 mb-3">
                      {["无", "青霉素", "头孢类", "磺胺类", "海鲜", "酒精", "花粉"].map(allergy => (
                         <label key={allergy} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" defaultChecked={(selectedElder.allergies || "").includes(allergy)} className="accent-amber-500" />
                            <span className="text-slate-700">{allergy}</span>
                         </label>
                      ))}
                   </div>
                   <input type="text" defaultValue={selectedElder.allergies === "无" ? "" : selectedElder.allergies} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-rose-500" placeholder="其他过敏史补充..." />
                 </div>
                 <div>
                   <label className="block text-slate-700 font-medium mb-1">家族遗传史</label>
                   <input type="text" defaultValue="无明显遗传病史记录" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-rose-500" placeholder="如：家族性糖尿病等" />
                 </div>
               </div>
               <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                 <button onClick={() => setShowEditHealthModal(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-sm">取消</button>
                 <button onClick={() => setShowEditHealthModal(false)} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 text-sm flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> 确认修改</button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">长者健康档案</h1>
          <span className="text-sm text-slate-500">慢性病史、过敏史追踪及体征监测综合记录视图</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowReportModal(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 border border-rose-700 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            快速登记体检报告
          </button>
        </div>
      </div>

      <Card className="border border-slate-200 shadow-sm mb-6">
        <CardContent className="p-4 flex gap-8 bg-slate-50/50">
           <div>
             <div className="text-slate-500 text-sm font-medium">重点关注对象</div>
             <div className="text-2xl font-bold text-rose-600 mt-1">12 <span className="text-sm font-normal text-slate-400">人</span></div>
           </div>
           <div className="w-px bg-slate-200"></div>
           <div>
             <div className="text-slate-500 text-sm font-medium">今日未测体征</div>
             <div className="text-2xl font-bold text-amber-600 mt-1">45 <span className="text-sm font-normal text-slate-400">人</span></div>
           </div>
           <div className="w-px bg-slate-200"></div>
           <div>
             <div className="text-slate-500 text-sm font-medium">慢病管理覆盖率</div>
             <div className="text-2xl font-bold text-emerald-600 mt-1">98.5 <span className="text-sm font-normal text-slate-400">%</span></div>
           </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">病史筛选:</span>
                <select className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-rose-500 bg-white w-40">
                   <option>全部分类</option>
                   <option>高血压</option>
                   <option>糖尿病</option>
                   <option>心血管疾病</option>
                </select>
             </div>
             <div className="relative">
               <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="搜索长者姓名..." 
                 className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-rose-500 bg-white"
               />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
           <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">长者姓名</th>
                  <th className="px-6 py-4 font-medium">慢病数量</th>
                  <th className="px-6 py-4 font-medium">已知过敏史</th>
                  <th className="px-6 py-4 font-medium">最近体检日</th>
                  <th className="px-6 py-4 font-medium">档案完善度</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{record.name}</div>
                      <div className="text-xs text-slate-500">{record.room}</div>
                    </td>
                    <td className="px-6 py-4">
                      {record.chronicCount > 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-100">{record.chronicCount}种慢病</span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                       {record.allergies !== '无' ? (
                         <span className="text-amber-700 font-medium">{record.allergies}</span>
                       ) : (
                         <span className="text-slate-400">无</span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{record.lastExam}</td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 w-32">
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${record.completeness === 100 ? 'bg-emerald-500' : record.completeness > 80 ? 'bg-indigo-500' : 'bg-amber-500'}`} style={{ width: `${record.completeness}%` }}></div>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">{record.completeness}%</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button onClick={() => handleOpenDetail(record)} className="text-rose-600 hover:text-rose-800 font-medium text-xs border border-rose-200 px-3 py-1.5 rounded hover:bg-rose-50 transition-colors shadow-sm">
                         档案详情
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </CardContent>
      </Card>

      {/* 详细健康档案 Modal */}
      {showDetailModal && selectedElder && !embedded && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-50 rounded-xl shadow-xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-white shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                         {selectedElder.name} <span className="font-normal text-slate-500 text-sm">的健康主页面板</span>
                      </h3>
                   </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 flex">
                {renderDetailContent()}
             </div>
          </div>
        </div>
      )}

      {/* 新建评估 / 录入体检报告 */}
      {showReportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <FileBarChart className="w-5 h-5 text-rose-600" />
                   登记体检报告/体征
                </h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">选择长者 *</label>
                     <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white">
                        <option>张明宇 (A栋-101)</option>
                        <option>李秀红 (A栋-105)</option>
                        <option>赵大爷 (B栋-201)</option>
                     </select>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">报告日期 / 测量日期</label>
                        <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">记录类型</label>
                        <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white">
                           <option>日常体征监测</option>
                           <option>月度例行体检</option>
                           <option>医院外诊报告</option>
                        </select>
                      </div>
                   </div>

                   <h4 className="text-sm font-bold text-rose-800 uppercase tracking-wider mb-2 border-b border-rose-100 pb-1 mt-6">核心体征录入</h4>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">血压 (收缩压/舒张压 mmHg)</label>
                        <div className="flex items-center gap-2">
                           <input type="number" placeholder="高压(收缩)" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white" />
                           <span className="text-slate-400">/</span>
                           <input type="number" placeholder="低压(舒张)" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">血糖 (mmol/L)</label>
                        <input type="number" placeholder="如：5.6" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">心率 (次/分)</label>
                        <input type="number" placeholder="如：75" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">血氧 (%)</label>
                        <input type="number" placeholder="如：98" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white" />
                      </div>
                   </div>
                   
                   <div className="space-y-1.5 mt-4">
                     <label className="text-sm font-medium text-slate-700">医嘱/特别说明</label>
                     <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-500 bg-white resize-none" placeholder="如有医生特别建议或异常情况说明..."></textarea>
                   </div>
                </div>
             </div>

             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowReportModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
                <button onClick={() => setShowReportModal(false)} className="px-5 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 提交记录
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 血压更多数据 Modal */}
      {showBpDataModal && selectedElder && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Activity className="w-5 h-5 text-blue-500" />
                   历史体征数据分析
                </h3>
                <button onClick={() => setShowBpDataModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6">
                 {/* Full chart */}
                 <div className="h-80 w-full mb-8">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedElder.vitalsData} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b' }} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        {activeVitalTab === 'bp' && (
                          <>
                            <Line type="monotone" dataKey="sys" name="收缩压(高压)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="dia" name="舒张压(低压)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                          </>
                        )}
                        {activeVitalTab === 'hr' && <Line type="monotone" dataKey="hr" name="心率" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />}
                        {activeVitalTab === 'bs' && <Line type="monotone" dataKey="bs" name="空腹血糖" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />}
                        {activeVitalTab === 'sleep' && <Line type="monotone" dataKey="sleep" name="睡眠时长" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />}
                        {activeVitalTab === 'weight' && <Line type="monotone" dataKey="weight" name="体重" stroke="#64748b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />}
                      </LineChart>
                   </ResponsiveContainer>
                 </div>

                 {/* Table */}
                 <h4 className="font-bold text-slate-800 mb-4">详细数据记录</h4>
                 <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                        <tr>
                           <th className="px-6 py-3">测量日期</th>
                           <th className="px-6 py-3">血压 (收缩/舒张)</th>
                           <th className="px-6 py-3">心率</th>
                           <th className="px-6 py-3">血糖</th>
                           <th className="px-6 py-3">睡眠</th>
                           <th className="px-6 py-3">体重</th>
                           <th className="px-6 py-3">状态评估</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedElder.vitalsData.map((data: any, idx: number) => (
                           <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-6 py-3 text-slate-600">{data.date} 08:30</td>
                              <td className="px-6 py-3 font-medium text-slate-800">{data.sys} / {data.dia}</td>
                              <td className="px-6 py-3 text-slate-600">{data.hr} bpm</td>
                              <td className="px-6 py-3 text-slate-600">{data.bs} mmol/L</td>
                              <td className="px-6 py-3 text-slate-600">{data.sleep} h</td>
                              <td className="px-6 py-3 text-slate-600">{data.weight} kg</td>
                              <td className="px-6 py-3">
                                 {data.sys >= 140 || data.dia >= 90 ? <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-rose-100 text-rose-700">偏高</span> : <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700">正常</span>}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
             </div>
          </div>
        </div>
      )}

      {/* 管理用药清单 Modal */}
      {showMedicationModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Pill className="w-5 h-5 text-emerald-600" />
                   用药清单管理 - {selectedElder?.name}
                </h3>
                <button onClick={() => setShowMedicationModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-bold text-slate-700">长期服药清单</h4>
                   <button onClick={() => { setEditingMedication(null); setShowAddMedicationModal(true); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-500 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors shadow-sm">
                     <Plus className="w-4 h-4" /> 添加药品
                   </button>
                </div>
                
                <div className="space-y-3">
                   {medications.length > 0 ? medications.map((med) => (
                      <div key={med.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between group flex-wrap md:flex-nowrap gap-4">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                               <Pill className="w-5 h-5" />
                            </div>
                            <div>
                               <div className="font-bold text-slate-800 text-base mb-1">{med.name}</div>
                               <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{med.frequency}</span>
                                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{med.dosage}</span>
                                  <span className="bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">{med.instruction}</span>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 shrink-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingMedication(med); setShowAddMedicationModal(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title="编辑"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setMedications(medications.filter(m => m.id !== med.id))} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors" title="停药/删除"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                   )) : (
                      <div className="text-center py-8 text-slate-500 text-sm bg-white rounded-lg border border-slate-200 border-dashed">
                        暂无长期服药记录
                      </div>
                   )}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6">
                   <h4 className="font-bold text-slate-700 mb-4">用药注意事项提示</h4>
                   <textarea rows={3} className="w-full border border-orange-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500 bg-orange-50/50 resize-none text-orange-800" placeholder="记录特殊的用药提醒..."></textarea>
                   <p className="text-xs text-slate-500 mt-2">这些注意事项将在护理员打卡端重点展示，请谨慎填写。</p>
                </div>
             </div>

             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
                <button onClick={() => setShowMedicationModal(false)} className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> 完成管理
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 添加/编辑药品 Modal */}
      {showAddMedicationModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-emerald-50/50">
                 <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <Pill className="w-4 h-4 text-emerald-600" />
                    {editingMedication ? '编辑药品' : '添加药品'}
                 </h3>
                 <button onClick={() => setShowAddMedicationModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-6 space-y-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">常规药品名称 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：阿司匹林肠溶片" defaultValue={editingMedication?.name} id="med_name" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">用药频率 *</label>
                       <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" defaultValue={editingMedication?.frequency || '每日一次'} id="med_frequency">
                          <option>每日一次</option>
                          <option>每日两次</option>
                          <option>每日三次</option>
                          <option>按需服用</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">单次剂量 *</label>
                       <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：每次1片 (5mg)" defaultValue={editingMedication?.dosage} id="med_dosage" />
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">用药指示说明</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如：饭后口服、温水送服等" defaultValue={editingMedication?.instruction} id="med_instruction" />
                 </div>
              </div>
              <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                 <button onClick={() => setShowAddMedicationModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
                 <button onClick={() => {
                    const name = (document.getElementById('med_name') as HTMLInputElement).value;
                    const frequency = (document.getElementById('med_frequency') as HTMLSelectElement).value;
                    const dosage = (document.getElementById('med_dosage') as HTMLInputElement).value;
                    const instruction = (document.getElementById('med_instruction') as HTMLInputElement).value;
                    
                    if (!name || !dosage) return;

                    if (editingMedication) {
                       setMedications(medications.map(m => m.id === editingMedication.id ? { ...m, name, frequency, dosage, instruction } : m));
                    } else {
                       setMedications([...medications, { id: Date.now(), name, frequency, dosage, instruction }]);
                    }
                    setShowAddMedicationModal(false);
                 }} className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2">
                   <CheckCircle2 className="w-4 h-4" /> 确认保存
                 </button>
              </div>
          </div>
        </div>
      )}

      {showEditHealthModal && selectedElder && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 text-start">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Edit2 className="w-4 h-4 text-rose-500" /> 编辑基础健康信息</h3>
                <button onClick={() => setShowEditHealthModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
             </div>
             <div className="p-5 space-y-5 text-sm">
               <div>
                 <label className="block text-slate-700 font-medium mb-2">明确诊断与既往史</label>
                 <div className="flex flex-wrap gap-2 mb-3">
                    {["高血压", "糖尿病", "冠心病", "脑卒中/中风", "慢阻肺", "骨关节炎", "阿尔茨海默病", "帕金森病"].map(disease => (
                       <label key={disease} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded cursor-pointer hover:bg-slate-100 transition-colors">
                          <input type="checkbox" defaultChecked={(selectedElder.history || "").includes(disease)} className="accent-rose-500" />
                          <span className="text-slate-700">{disease}</span>
                       </label>
                    ))}
                 </div>
                 <textarea rows={2} defaultValue={selectedElder.history} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-rose-500 resize-none" placeholder="其他诊断或补充说明..."></textarea>
               </div>
               <div>
                 <label className="block text-slate-700 font-medium mb-2">过敏史提示</label>
                 <div className="flex flex-wrap gap-2 mb-3">
                    {["无", "青霉素", "头孢类", "磺胺类", "海鲜", "酒精", "花粉"].map(allergy => (
                       <label key={allergy} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded cursor-pointer hover:bg-slate-100 transition-colors">
                          <input type="checkbox" defaultChecked={(selectedElder.allergies || "").includes(allergy)} className="accent-amber-500" />
                          <span className="text-slate-700">{allergy}</span>
                       </label>
                    ))}
                 </div>
                 <input type="text" defaultValue={selectedElder.allergies === "无" ? "" : selectedElder.allergies} className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-rose-500" placeholder="其他过敏史补充..." />
               </div>
               <div>
                 <label className="block text-slate-700 font-medium mb-1">家族遗传史</label>
                 <input type="text" defaultValue="无明显遗传病史记录" className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-rose-500" placeholder="如：家族性糖尿病等" />
               </div>
             </div>
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
               <button onClick={() => setShowEditHealthModal(false)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 text-sm">取消</button>
               <button onClick={() => setShowEditHealthModal(false)} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 text-sm flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4"/> 确认修改</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}
