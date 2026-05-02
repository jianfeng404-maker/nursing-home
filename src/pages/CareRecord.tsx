import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { CheckCircle2, Search, FileText, Calendar, Share2, Download, Filter, Activity, HeartPulse } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../store';

export function CareRecord({ embedded, elderId: initialElderId }: { embedded?: boolean; initialElderId?: string | null }) {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedElderId, setSelectedElderId] = useState<string | null>(initialElderId || null);
  const { careRecords, elders } = useStore();

  const reports = [
    { 
      id: "REP-2023-11", 
      title: "2023年11月服务报告", 
      coverage: "2023-11-01 至 2023-11-30", 
      date: "2023-12-01",
      healthSummary: "长者本月整体健康状况平稳，血压控制理想。中旬有轻微感冒症状，已由院内医生开具药物并按时监督服用，现已痊愈。睡眠情况良好。",
      careSummary: "本月共计提供各项照护服务，计划内的照护均按时完成，达标率100%。长者对护理员服务表示满意。",
      serviceStats: [
        { name: "起居照护", count: 90 },
        { name: "餐饮辅助", count: 90 },
        { name: "健康监测", count: 60 },
        { name: "康复训练", count: 12 },
        { name: "心理慰藉", count: 4 },
      ],
      vitalData: [
        { date: '11-01', sys: 135, dia: 85, hr: 72 },
        { date: '11-05', sys: 138, dia: 88, hr: 75 },
        { date: '11-10', sys: 130, dia: 82, hr: 70 },
        { date: '11-15', sys: 140, dia: 90, hr: 78 },
        { date: '11-20', sys: 135, dia: 85, hr: 74 },
        { date: '11-25', sys: 132, dia: 83, hr: 71 },
        { date: '11-30', sys: 136, dia: 86, hr: 73 },
      ],
      activitySummary: "共计参与院内文娱活动12次，尤其对书法班表现出极高热情。情绪状态积极向上，与院内其他长者相处融洽。",
      recommendation: "下个月建议增加下肢力量的康复训练频次，以进一步改善步行稳定性。饮食上可继续保持低盐低脂。"
    },
    { 
      id: "REP-2023-10", 
      title: "2023年10月服务报告", 
      coverage: "2023-10-01 至 2023-10-31", 
      date: "2023-11-01",
      healthSummary: "长者本月健康状况良好，无突发疾病。血压在正常范围内波动。月底检查空腹血糖略偏高，已通知家属并调整饮食方案。",
      careSummary: "本月按计划执行照护服务，包括日常起居协助、个人卫生打理等，长者配合度高。",
      serviceStats: [
        { name: "起居照护", count: 93 },
        { name: "餐饮辅助", count: 93 },
        { name: "健康监测", count: 62 },
        { name: "康复训练", count: 10 },
        { name: "心理慰藉", count: 3 },
      ],
      vitalData: [
        { date: '10-01', sys: 130, dia: 80, hr: 70 },
        { date: '10-05', sys: 132, dia: 82, hr: 72 },
        { date: '10-10', sys: 135, dia: 85, hr: 74 },
        { date: '10-15', sys: 133, dia: 83, hr: 71 },
        { date: '10-20', sys: 138, dia: 86, hr: 75 },
        { date: '10-25', sys: 136, dia: 84, hr: 73 },
        { date: '10-31', sys: 134, dia: 82, hr: 72 },
      ],
      activitySummary: "参与早间的八段锦及合唱团活动，精神面貌佳。",
      recommendation: "持续关注血糖变化，建议家属探望时避免带来过多甜食。"
    }
  ];

  return (
    <div className={`space-y-6 flex flex-col h-full ${embedded ? '' : 'p-6 bg-slate-50'}`}>
      {!embedded && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 gap-4 shrink-0">
           <div>
             <h2 className="text-xl font-bold text-slate-800">服务记录与报告</h2>
             <p className="text-sm text-slate-500 mt-1">记录日常照护明细，自动生成结构化月度报告发送家属。</p>
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative w-full md:w-64">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <select 
                 className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white appearance-none"
                 value={selectedElderId || ''}
                 onChange={(e) => setSelectedElderId(e.target.value === '' ? null : e.target.value)}
               >
                 <option value="">所有长者</option>
                 {elders.map(elder => (
                   <option key={elder.id} value={elder.id}>{elder.name} ({elder.room})</option>
                 ))}
               </select>
             </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button 
            onClick={() => setActiveTab('daily')} 
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'daily' ? 'bg-white text-indigo-600 border-indigo-600' : 'text-slate-600 border-transparent hover:bg-slate-100'}`}
          >
            日常服务记录
          </button>
          <button 
            onClick={() => setActiveTab('report')} 
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'report' ? 'bg-white text-indigo-600 border-indigo-600' : 'text-slate-600 border-transparent hover:bg-slate-100'}`}
          >
            服务周期报告
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {activeTab === 'daily' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="flex items-center gap-2 w-full md:w-auto">
                   <div className="relative flex-1 md:w-64">
                     <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                     <input type="text" placeholder="搜索服务内容、执行人..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white" />
                   </div>
                   <button className="p-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 bg-white">
                      <Filter className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                   <input type="date" className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white" />
                </div>
              </div>

              <div className="relative border-l border-slate-200 ml-4 lg:ml-6 space-y-8 pb-4">
                {careRecords.filter(r => !selectedElderId || r.elderId === selectedElderId).map((record) => (
                  <div key={record.id} className="relative pl-6 lg:pl-8">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-white" />
                    <div className="bg-white border text-sm border-slate-200 rounded-xl p-4 shadow-sm hover:border-indigo-200 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{record.content}</span>
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{record.time}</span>
                        </div>
                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> 已执行</span>
                      </div>
                      <p className="text-slate-600 mb-2">{record.result || '已按标准SOP流程完成各项护理操作，长者状态良好。'}</p>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-slate-500">执行人: {record.caregiver} | 服务对象: {record.elderName}</span>
                         <button className="text-indigo-600 font-medium hover:underline">查看影像确认</button>
                      </div>
                    </div>
                  </div>
                ))}
                {careRecords.filter(r => !selectedElderId || r.elderId === selectedElderId).length === 0 && (
                  <div className="text-center text-sm text-slate-500 py-10">暂无照护服务记录</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <p className="text-slate-600 text-sm">系统每月1号自动生成上月的完整服务情况汇总，可一键发送给绑定的家属微信。</p>
                 <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-medium text-xs rounded hover:bg-indigo-100 border border-indigo-200">手动生成本月简报</button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reports.map((report) => (
                    <Card key={report.id} className="border-slate-200 hover:border-indigo-300 transition-colors shadow-sm cursor-pointer" onClick={() => setSelectedReport(report)}>
                       <CardContent className="p-5">
                          <div className="flex justify-between items-start mb-3">
                             <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex flex-col items-center justify-center">
                               <FileText className="w-5 h-5 mb-0.5" />
                               <span className="text-[10px] font-bold">月报</span>
                             </div>
                             <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded">已送达家属微信</span>
                          </div>
                          <h3 className="font-bold text-slate-800 mb-1">{report.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                            <Calendar className="w-3.5 h-3.5" /> 周期: {report.coverage}
                          </div>
                          <div className="text-sm text-slate-600 line-clamp-2">
                             {report.healthSummary}
                          </div>
                       </CardContent>
                    </Card>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95">
             <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
                <h2 className="font-bold text-lg text-slate-800">服务报告详情</h2>
                <div className="flex items-center gap-2">
                   <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full" title="分享给家属">
                     <Share2 className="w-5 h-5" />
                   </button>
                   <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full" title="下载PDF">
                     <Download className="w-5 h-5" />
                   </button>
                   <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full ml-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                   </button>
                </div>
             </div>
             <div className="p-6 overflow-y-auto w-full">
                <div className="bg-white mx-auto shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl px-8 py-10 w-full relative">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <svg width="120" height="120" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="5" /><text x="50" y="55" fontFamily="monospace" fontSize="20" fill="#4f46e5" textAnchor="middle" fontWeight="bold">智慧养老</text></svg>
                   </div>
                   
                   <div className="text-center mb-8 border-b-2 border-indigo-900 pb-4">
                      <h1 className="text-2xl font-black text-slate-800 tracking-wider font-serif">{selectedReport.title}</h1>
                      <div className="text-sm font-medium text-slate-500 mt-2 space-x-4">
                         <span>编号: {selectedReport.id}</span>
                         <span>生成日期: {selectedReport.date}</span>
                      </div>
                   </div>

                   <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
                      <div className="bg-slate-50 p-4 rounded-lg flex flex-wrap gap-x-8 gap-y-2 border border-slate-100">
                         <div className="font-medium">长者姓名: <span className="font-bold text-slate-900">{selectedElderId?.includes('002') ? '李秀红' : '张明宇'}</span></div>
                         <div className="font-medium">房间号: <span className="font-bold text-slate-900">{selectedElderId?.includes('002') ? 'A栋-105床' : 'A栋-101床'}</span></div>
                         <div className="font-medium">护理等级: <span className="font-bold text-slate-900">二级护理</span></div>
                         <div className="font-medium text-indigo-700">统计周期: {selectedReport.coverage}</div>
                      </div>

                      <section>
                        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> 一、 照护执行汇总</h3>
                        <div className="bg-white rounded border border-slate-100 p-4">
                          <p className="text-justify mb-4">{selectedReport.careSummary}</p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                             {selectedReport.serviceStats?.map((stat: any, i: number) => (
                               <div key={i} className="bg-indigo-50/50 rounded-lg p-3 text-center border border-indigo-100">
                                  <div className="text-2xl font-black text-indigo-600 mb-1 font-mono">{stat.count}</div>
                                  <div className="text-xs font-medium text-slate-600">{stat.name}</div>
                               </div>
                             ))}
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><Activity className="w-5 h-5"/> 二、 健康与生命体征数据监测</h3>
                        <div className="bg-white rounded border border-slate-100 p-4">
                          <p className="text-justify mb-4">{selectedReport.healthSummary}</p>
                          <div className="h-64 w-full mt-4">
                            <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">本月血压连续监测图</h4>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={selectedReport.vitalData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={['auto', 'auto']} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Line type="monotone" dataKey="sys" name="收缩压(高压)" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="dia" name="舒张压(低压)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><HeartPulse className="w-5 h-5"/> 三、 文娱与心理状态</h3>
                        <div className="pl-7 text-justify bg-white rounded border border-slate-100 p-4">
                          {selectedReport.activitySummary}
                        </div>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2"><FileText className="w-5 h-5"/> 四、 评估建议</h3>
                        <div className="pl-7 text-justify bg-indigo-50 border border-indigo-100 rounded p-4 text-indigo-900 font-medium whitespace-pre-wrap">
                          {selectedReport.recommendation}
                        </div>
                      </section>

                      <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-4">
                         <div className="text-center">
                            <div className="text-slate-500 mb-1">主责护理员/责任护士:</div>
                            <div className="font-bold text-slate-800 font-serif border-b border-slate-400 inline-block w-32">&nbsp;李翠华&nbsp;</div>
                         </div>
                         <div className="text-center">
                            <div className="text-slate-500 mb-1">机构盖章/负责人签字:</div>
                            <div className="font-bold text-slate-800 font-serif border-b border-slate-400 inline-block w-32">&nbsp;系统合规确认&nbsp;</div>
                         </div>
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
