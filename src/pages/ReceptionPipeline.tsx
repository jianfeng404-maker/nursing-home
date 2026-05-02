import { useState } from "react";
import { UserPlus, ArrowRight, ClipboardCheck, BedDouble, LogOut, CheckCircle2, MoreHorizontal, Calendar, User, PhoneCall, FileText } from "lucide-react";
import { useStore } from "../store";

export function ReceptionPipeline({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  // Placeholder data for pipeline
  const pipelineConfig = [
    { id: 'marketing', label: '接待与意向', num: '01', desc: '初次接待、意向跟进、回访', icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'admission_assess', label: '健康评估', num: '02', desc: '入院前健康评估、自评/他评', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'admission_record', label: '试住与入住', num: '03', desc: '选定床位、签订合同、缴费', icon: BedDouble, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'elder_info', label: '在住长者', num: '04', desc: '日常在住档案、变更床位等', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'discharge_record', label: '退住办理', num: '05', desc: '退还物资、费用结算、解约', icon: LogOut, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
  ];

  // Dummy Kanban cards
  const mockCards: Record<string, any[]> = {
    marketing: [
      { id: 'M-001', name: '李老先生家属', type: '电话咨询', date: '今天 10:30', tag: 'A级意向', tagColor: 'bg-rose-100 text-rose-700' },
      { id: 'M-002', name: '王阿姨', type: '现场到访', date: '昨天 14:00', tag: 'B级意向', tagColor: 'bg-amber-100 text-amber-700' },
      { id: 'M-003', name: '赵先生', type: '微信咨询', date: '11/02', tag: 'C级意向', tagColor: 'bg-slate-100 text-slate-700' },
    ],
    admission_assess: [
      { id: 'A-012', name: '张建国', age: 78, type: '首次评估', date: '预约明早 09:00', status: '待评估', tagColor: 'bg-emerald-100 text-emerald-700' },
      { id: 'A-011', name: '刘秀兰', age: 82, type: '复评', date: '今天', status: '进行中', tagColor: 'bg-blue-100 text-blue-700' },
    ],
    admission_record: [
      { id: 'R-055', name: '李阿姨', action: '准备签订合同', date: '处理中', tag: '待签约', tagColor: 'bg-blue-100 text-blue-700' },
      { id: 'R-054', name: '陈伯伯', action: '等待家属缴费', date: '等待中', tag: '待缴费', tagColor: 'bg-amber-100 text-amber-700' },
    ],
    elder_info: [
      { id: 'E-120', name: '许阿姨', action: '常规巡房跟进', room: 'A栋-302', tag: '日常照护', tagColor: 'bg-emerald-100 text-emerald-700' },
      { id: 'E-119', name: '赵大爷', action: '家属探视登记', room: 'B栋-105', tag: '探视记录', tagColor: 'bg-indigo-100 text-indigo-700' },
      { id: 'E-118', name: '林老太', action: '用药计划调整', room: 'A栋-201', tag: '医疗变更', tagColor: 'bg-rose-100 text-rose-700' },
    ],
    discharge_record: [
      { id: 'D-008', name: '钱老先生', action: '费用结算中', date: '预计明天离院', tag: '财务核算', tagColor: 'bg-rose-100 text-rose-700' },
    ]
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="mb-6 flex space-x-2 items-end justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">接退住全生命周期工作台</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">从初次接待到退住离院的全流程阶段管控</span>
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
           <button className="px-4 py-1.5 text-sm font-bold bg-slate-100 text-slate-800 rounded-md">面板视图</button>
           <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-800">列表视图</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-x-auto pb-4 gap-5 snap-x">
        {pipelineConfig.map((stage, index) => {
          const cards = mockCards[stage.id] || [];
          return (
            <div key={stage.id} className="flex flex-col min-w-[300px] max-w-[340px] flex-1 shrink-0 snap-start bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Stage Header */}
              <div 
                className={`p-5 border-b border-slate-200 bg-white relative cursor-pointer group hover:bg-slate-50 transition-colors`}
                onClick={() => setActiveTab && setActiveTab(stage.id)}
              >
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className={`p-2 rounded-xl border ${stage.border} ${stage.color} ${stage.bg}`}>
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <button className="text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                     <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Large decorative number */}
                <div className="absolute top-2 right-4 text-6xl font-black text-slate-50 select-none z-0 tracking-tighter pointer-events-none group-hover:text-slate-100 transition-colors">
                  {stage.num}
                </div>

                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-1">
                     <h4 className={`font-black text-lg text-slate-800`}>{stage.label}</h4>
                     <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">{cards.length}</span>
                   </div>
                   <p className="text-xs font-medium text-slate-500 leading-snug">{stage.desc}</p>
                </div>
              </div>

              {/* Kanban Column Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                 {cards.length > 0 ? (
                   cards.map((card, i) => (
                     <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                       <div className="flex justify-between items-start mb-3">
                         <span className="text-[11px] font-mono text-slate-400 font-bold tracking-wider">{card.id}</span>
                         <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${card.tagColor}`}>
                           {card.tag || card.status}
                         </span>
                       </div>
                       <h5 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                         {card.name} 
                         {card.age && <span className="text-xs font-normal text-slate-500">{card.age}岁</span>}
                       </h5>
                       
                       <p className="text-sm text-slate-600 font-medium mb-3">
                         {card.type || card.action}
                       </p>
                       
                       <div className="flex items-center justify-between text-xs text-slate-400">
                         <div className="flex items-center gap-1.5 font-medium">
                           {card.date ? <Calendar className="w-3.5 h-3.5" /> : (card.room ? <BedDouble className="w-3.5 h-3.5"/> : <FileText className="w-3.5 h-3.5"/>)}
                           {card.date || card.room || '待跟进'}
                         </div>
                         <button className="text-slate-300 hover:text-slate-600">
                            <MoreHorizontal className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   ))
                 ) : (
                   <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-sm font-bold text-slate-400">
                      暂无待办事项
                   </div>
                 )}
              </div>

              {/* Column Footer */}
              <div className="p-3 bg-white border-t border-slate-200">
                 <button 
                   onClick={() => setActiveTab && setActiveTab(stage.id)}
                   className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2"
                 >
                   进入完整面板
                 </button>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
