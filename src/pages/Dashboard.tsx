import { OverviewStats } from "../components/dashboard/OverviewStats";
import { ActivityStatusChart } from "../components/dashboard/ActivityStatusChart";
import { AlertsFeed } from "../components/dashboard/AlertsFeed";
import { DeviceStatus } from "../components/dashboard/DeviceStatus";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { History, CheckCircle2, Pill, ShieldCheck, Activity } from "lucide-react";

interface DashboardProps {
  setActiveTab?: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline gap-2">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">机构运行总览</h2>
        <span className="text-sm font-medium text-slate-500">今日概况与实时监控</span>
      </div>

      <OverviewStats setActiveTab={setActiveTab} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ActivityStatusChart />
        <AlertsFeed />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DeviceStatus />
        
        <Card className="col-span-1 lg:col-span-2 border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardHeader className="py-5 px-6 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" /> 最新照护动态
            </CardTitle>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">查看全部</button>
          </CardHeader>
          <CardContent className="p-6">
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
               
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-blue-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        日常护理: 用药辅助
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">10:30 AM</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      <span className="font-medium text-slate-700">张莉</span> 为 <span className="font-medium text-slate-700">赵大爷(205室)</span> 完成了降压药辅助服用，当前血压正常。
                    </div>
                  </div>
               </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-emerald-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        环境消杀
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">09:15 AM</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      保洁组已完成2号楼公共区域臭氧紫外线环境联合消杀。
                    </div>
                  </div>
               </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-100 text-amber-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-amber-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        康复娱乐
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100">08:30 AM</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      早间音乐疗法和八段锦课程已在多功能厅进行，参与人数45人。
                    </div>
                  </div>
               </div>
               
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
