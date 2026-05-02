import { useState } from "react";
import { ClipboardCheck, CalendarClock, Activity, Pill, ShieldAlert, Heart, FileText, ArrowRight, UserCheck, Stethoscope, HeartPulse } from "lucide-react";
import { useStore } from "../store";

export function CareDashboard({ setActiveTab }: { setActiveTab?: (tab: string) => void }) {
  const workflowSteps = [
    { id: 'care_assess', title: '1. 需求评估', desc: 'ADL评定、健康建档', icon: ClipboardCheck, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { id: 'care_plan', title: '2. 计划拟定', desc: '护理等级、专属方案', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: 'care_tasks', title: '3. 任务派发', desc: '工单生成、排班派单', icon: CalendarClock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'care_log', title: '4. 查房执行', desc: '移动端打卡、床旁服务', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'care_record', title: '5. 质检与报表', desc: '执行记录核查与分析', icon: ShieldAlert, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="mb-6 flex space-x-2 items-end justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">照护指挥调度中心</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">统筹全院照护资源，规范「评估-计划-排班-执行-质检」全闭环流程</span>
        </div>
      </div>

      {/* 核心工作流 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
         <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2 pb-3 border-b border-slate-100">
           <Heart className="w-5 h-5 text-rose-500" />
           标准照护工作流导航 (PDCA)
         </h3>
         <div className="grid grid-cols-5 gap-3">
            {workflowSteps.map((step, idx) => (
              <div key={step.id} className="relative group">
                 {idx < workflowSteps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-slate-300 group-hover:text-amber-500 transition-colors">
                       <ArrowRight className="w-6 h-6" />
                    </div>
                 )}
                 <div 
                   onClick={() => setActiveTab && setActiveTab(step.id)}
                   className={`h-full p-4 rounded-xl border ${step.border} ${step.bg} cursor-pointer hover:shadow-md transition-all group-hover:-translate-y-1`}
                 >
                    <div className={`p-2.5 rounded-lg bg-white border ${step.border} ${step.color} inline-flex mb-3 shadow-sm`}>
                       <step.icon className="w-5 h-5" />
                    </div>
                    <h4 className={`font-bold text-base mb-1 ${step.color}`}>{step.title}</h4>
                    <p className="text-xs font-medium text-slate-500">{step.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
         {/* 今日数据大盘 */}
         <div className="col-span-2 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-indigo-100 font-medium text-sm mb-1">今日应执行照护任务</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-4xl font-black">2,480</h4>
                      <span className="text-indigo-200 text-sm">项</span>
                    </div>
                  </div>
                  <CalendarClock className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/30 font-bold" />
               </div>
               <div className="bg-emerald-600 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-emerald-100 font-medium text-sm mb-1">已完成记录打卡</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-4xl font-black">1,829</h4>
                      <span className="text-emerald-200 text-sm">项</span>
                    </div>
                  </div>
                  <UserCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/30 font-bold" />
               </div>
               <div className="bg-rose-50 rounded-2xl p-5 text-rose-900 border border-rose-100 shadow-sm relative overflow-hidden cursor-pointer hover:bg-rose-100 transition-colors">
                  <div className="relative z-10">
                    <p className="text-rose-600 font-bold text-sm mb-1">异常情况告警</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-4xl font-black">3</h4>
                      <span className="text-rose-400 font-bold text-xs uppercase tracking-wider">件待处理</span>
                    </div>
                  </div>
                  <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-rose-200/50 font-bold" />
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 mb-6">
               <div className="flex justify-between items-center mb-4">
                 <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                   <HeartPulse className="w-5 h-5 text-rose-500" />
                   异常告警体征实时监看
                 </h3>
                 <button 
                   onClick={() => setActiveTab && setActiveTab('iot_dashboard')}
                   className="text-sm text-blue-600 hover:underline font-medium"
                 >
                   进入完整大屏
                 </button>
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div className="border border-rose-200 bg-rose-50 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:-translate-y-0.5 transition-transform" onClick={() => setActiveTab && setActiveTab('iot_dashboard')}>
                   <div>
                     <div className="font-bold text-slate-800 flex items-center gap-2">
                       赵阿姨 <span className="text-xs font-normal text-slate-500">B栋-206</span>
                     </div>
                     <div className="text-xs font-medium text-rose-600 mt-0.5">心率过低 45bpm</div>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-black text-rose-600">45</div>
                   </div>
                 </div>
                 
                 <div className="border border-amber-200 bg-amber-50 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:-translate-y-0.5 transition-transform" onClick={() => setActiveTab && setActiveTab('iot_dashboard')}>
                   <div>
                     <div className="font-bold text-slate-800 flex items-center gap-2">
                       李建国 <span className="text-xs font-normal text-slate-500">A栋-102</span>
                     </div>
                     <div className="text-xs font-medium text-amber-600 mt-0.5">心率偏高 / 血压高</div>
                   </div>
                   <div className="text-right">
                     <div className="flex items-baseline justify-end gap-1">
                       <div className="text-2xl font-black text-amber-600">115</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1">
               <h3 className="text-base font-bold text-slate-800 mb-4">实时在岗护理组执行进度总览</h3>
               <div className="space-y-3">
                 {[
                   { name: 'A栋-1层 护理组', total: 450, done: 380, staff: '张小丽、陈刚等3人', status: '正常' },
                   { name: 'A栋-2层 护理组', total: 520, done: 400, staff: '王阿姨、林建等4人', status: '正常' },
                   { name: 'B栋-失智专区', total: 800, done: 512, staff: '李护士长、赵六等6人', status: '预警' },
                 ].map((area, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1.5">
                           <span className="font-bold text-slate-700 text-sm">{area.name}</span>
                           <span className="text-xs text-slate-500 font-bold">已执行: {Math.round(area.done / area.total * 100)}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                           <div className={`h-full ${area.status === '预警' ? 'bg-amber-500' : 'bg-emerald-500'} rounded-full`} style={{ width: `${(area.done / area.total) * 100}%` }}></div>
                        </div>
                        <div className="mt-2 flex justify-between items-center text-xs">
                           <span className="text-slate-500 font-medium">{area.staff}</span>
                           <span className={`px-2 py-0.5 rounded font-bold ${area.status === '预警' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                             {area.status}
                           </span>
                        </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>

         {/* 专项管理入口 (医疗与用药) */}
         <div className="flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">医康养专项协同模块</h3>
            <div 
              onClick={() => setActiveTab && setActiveTab('medication_manage')}
              className="bg-sky-50 border border-sky-100 p-5 rounded-2xl cursor-pointer hover:bg-sky-100 transition-colors group"
            >
               <div className="flex justify-between items-start mb-3">
                 <div className="p-3 rounded-xl bg-white text-sky-600 shadow-sm border border-sky-100">
                   <Pill className="w-6 h-6" />
                 </div>
                 <span className="px-2 py-1 bg-white text-[10px] font-bold text-slate-500 rounded border border-sky-100 uppercase tracking-wider">药房协同</span>
               </div>
               <h4 className="font-black text-lg text-slate-800 mb-2 group-hover:text-sky-700">医嘱与用药执行清单</h4>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">根据医嘱自动生成每日发药清单与扫码核对记录，防止漏服错服，保障长者用药安全。</p>
            </div>

            <div 
              onClick={() => setActiveTab && setActiveTab('iot_dashboard')}
              className="bg-teal-50 border border-teal-100 p-5 rounded-2xl cursor-pointer hover:bg-teal-100 transition-colors group"
            >
               <div className="flex justify-between items-start mb-3">
                 <div className="p-3 rounded-xl bg-white text-teal-600 shadow-sm border border-teal-100">
                   <Stethoscope className="w-6 h-6" />
                 </div>
                 <span className="px-2 py-1 bg-white text-[10px] font-bold text-slate-500 rounded border border-teal-100 uppercase tracking-wider">医疗站协同</span>
               </div>
               <h4 className="font-black text-lg text-slate-800 mb-2 group-hover:text-teal-700">巡诊与体征监测大屏</h4>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">日常血压、血糖、心率等体征数据录入与异常趋势预警分析，生成长者个人健康简报。</p>
            </div>
         </div>
      </div>
    </div>
  );
}
