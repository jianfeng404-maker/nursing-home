import React, { useState, useEffect } from "react";
import { Search, FileText, Download, Stethoscope, AlertCircle, X, Activity, Thermometer, MapPin } from "lucide-react";
import { toast } from "sonner";
import { ElderLink } from "../components/ElderLink";

export function ClinicalRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [mockRecords, setMockRecords] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/clinical_records', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Map DB columns to UI shape nicely. For now, since table is clinicalRecords
          // Let's use the fetched data. Or map it if needed.
          setMockRecords(data.map((r: any) => ({
             id: r.elderId, 
             name: r.elderName || '未知', 
             age: '--', gender: '--', room: '--', // can join with elders table if needed later
             conditions: r.type ? [r.type] : ["常规随访"], 
             updateTime: r.createdAt ? new Date(r.createdAt).toLocaleString() : '未知',
             notes: r.notes
          })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecords();
  }, []);

  const filtered = mockRecords.filter(r => r.name.includes(searchTerm) || r.room.includes(searchTerm));

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">专业医疗护理方案与病历归档</h1>
          <p className="text-slate-500 mt-1">管理长者在院医疗档案、慢病随访管理、外院检查报告归档等机密医疗数据。</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center text-sm shrink-0">
           <div className="relative">
             <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="搜索长者姓名或房号..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-white"
             />
           </div>
           <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
             <AlertCircle className="w-4 h-4" /> 医疗数据具有高保密机密等级，请妥善访问。
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-0">
           <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr className="text-sm text-slate-500">
                <th className="px-6 py-4 font-medium">长者信息</th>
                <th className="px-6 py-4 font-medium">主要慢病与医疗重点</th>
                <th className="px-6 py-4 font-medium">最近一次更新</th>
                <th className="px-6 py-4 font-medium text-right">方案及病历查阅</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(record => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                   <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                            {record.name[0]}
                         </div>
                         <div>
                            <div className="font-bold text-slate-800 flex items-center gap-2">
                               <ElderLink text={record.name} id={record.id} className="hover:text-indigo-600" />
                               <span className="text-xs font-normal text-slate-500">{record.gender} {record.age}岁</span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{record.room}</div>
                         </div>
                      </div>
                   </td>
                   <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                         {record.conditions.map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-md border border-rose-100">{c}</span>
                         ))}
                      </div>
                   </td>
                   <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                      {record.updateTime}
                   </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 text-sm text-slate-600">
                         <button onClick={() => setSelectedRecord(record)} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded transition font-medium border border-transparent hover:border-indigo-100">
                            <Stethoscope className="w-4 h-4" /> 详情方案
                         </button>
                         <button onClick={() => toast.success("正在打包病历...")} className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 rounded transition font-medium border border-slate-200">
                            <Download className="w-4 h-4" /> 导出副本
                         </button>
                      </div>
                   </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">没有查找到符合条件的长者医疗档案</td>
                 </tr>
              )}
            </tbody>
           </table>
        </div>
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white max-w-4xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max animate-in fade-in zoom-in-95">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white sticky top-0 z-10 shrink-0">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white/20 rounded-lg"><Stethoscope className="w-5 h-5" /></div>
                 <div>
                   <h3 className="text-xl font-bold">{selectedRecord.name} 的医疗护理档案</h3>
                   <div className="text-sm text-indigo-100 mt-0.5 flex items-center gap-2">
                     <span className="font-mono">{selectedRecord.id}</span>
                     <span>|</span>
                     <span>{selectedRecord.gender} {selectedRecord.age}岁</span>
                     <span>|</span>
                     <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5"/> {selectedRecord.room}</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => setSelectedRecord(null)} className="text-indigo-100 hover:bg-indigo-700 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5" />
               </button>
            </div>
            
            <div className="p-6 grid grid-cols-3 gap-6">
               <div className="col-span-1 space-y-6">
                 <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                   <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-500" /> 主要诊断与慢病</h4>
                   <div className="space-y-2">
                     {selectedRecord.conditions.map((c: string, i: number) => (
                       <div key={i} className="px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700">
                         {c}
                       </div>
                     ))}
                   </div>
                 </div>
                 <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                   <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> 禁忌与过敏史</h4>
                   <ul className="list-disc pl-5 text-sm text-orange-700 space-y-1">
                     <li>青霉素类药物过敏</li>
                     <li>重度骨质疏松，防跌倒高危</li>
                   </ul>
                 </div>
                 <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                   <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2"><Thermometer className="w-4 h-4" /> 生命体征基线</h4>
                   <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                     <div>
                       <div className="text-emerald-600/70 mb-1">心率</div>
                       <div className="font-bold text-emerald-900">75 <span className="text-xs font-normal">bpm</span></div>
                     </div>
                     <div>
                       <div className="text-emerald-600/70 mb-1">血压</div>
                       <div className="font-bold text-emerald-900">130/80 <span className="text-xs font-normal">mmHg</span></div>
                     </div>
                     <div>
                       <div className="text-emerald-600/70 mb-1">空腹血糖</div>
                       <div className="font-bold text-emerald-900">5.5 <span className="text-xs font-normal">mmol/L</span></div>
                     </div>
                     <div>
                       <div className="text-emerald-600/70 mb-1">血氧饱和度</div>
                       <div className="font-bold text-emerald-900">98 <span className="text-xs font-normal">%</span></div>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="col-span-2 space-y-6">
                 <div>
                   <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">专业医疗护理方案 (Medical Care Plan)</h4>
                   <div className="space-y-4">
                     <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h5 className="font-bold text-slate-700 text-sm mb-2">1. 日常护理等级与要求</h5>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                          护理评级：介护二级<br/>
                          需重点关注长者夜间起夜情况，提供协助如厕。每日监测血压2次（早晚各一次），记录异常波动。
                        </p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h5 className="font-bold text-slate-700 text-sm mb-2">2. 康复与理疗介入</h5>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                          每周三次肢体被动运动，防止深静脉血栓及关节挛缩。<br/>
                          每两周由主治医生评估一次恢复情况。
                        </p>
                     </div>
                     <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <h5 className="font-bold text-slate-700 text-sm mb-2">3. 紧急预案</h5>
                        <p className="text-sm text-slate-600 leading-relaxed bg-rose-50 border border-rose-100 p-3 rounded-lg text-rose-800">
                          如遇血压骤升收缩压高于180mmHg或出现胸闷，立刻通知驻院医师，并联络家属，必要时呼叫120转诊至第一人民医院。
                        </p>
                     </div>
                   </div>
                 </div>

                 <div>
                   <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex justify-between items-center">
                     <span>近期看诊历史</span>
                     <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">查看完整病历</button>
                   </h4>
                   <div className="space-y-3">
                     {[1, 2].map((i) => (
                       <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                         <div className="bg-slate-100 text-slate-600 text-xs font-mono px-2 py-1 rounded mt-0.5">{selectedRecord.updateTime}</div>
                         <div>
                           <div className="font-bold text-slate-800 text-sm">{selectedRecord.conditions[0] || '例行查房及慢病随访'}</div>
                           <div className="text-sm text-slate-500 mt-1">主诉内容与注意事项记录在案。处理：{selectedRecord.notes || '调整了晚间用药时间，增加了白天活动量。'}</div>
                           <div className="text-xs text-slate-400 mt-1">负责医师：主治医师</div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
