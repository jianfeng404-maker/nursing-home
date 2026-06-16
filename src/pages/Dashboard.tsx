import { OverviewStats } from "../components/dashboard/OverviewStats";
import { ActivityStatusChart } from "../components/dashboard/ActivityStatusChart";
import { AlertsFeed } from "../components/dashboard/AlertsFeed";
import { DeviceStatus } from "../components/dashboard/DeviceStatus";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { History, CheckCircle2, Pill, ShieldCheck, Activity, Users, ShieldAlert, BadgeDollarSign, Heart, ThermometerSun, Droplets, Wind, Zap } from "lucide-react";

interface DashboardProps {
  setActiveTab?: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="animate-in fade-in duration-500 h-full flex flex-col p-4 sm:p-6 md:p-8 bg-slate-50/50">
      <div className="mb-6 shrink-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
           <h2 className="text-3xl font-black text-slate-800 tracking-tight">星愿管理驾驶舱</h2>
           <span className="text-sm font-medium text-slate-500 hidden sm:inline-block border-l border-slate-300 pl-2">全局运营与安全总览</span>
        </div>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
           <button className="px-4 py-1.5 text-sm font-bold bg-white text-indigo-700 shadow-sm rounded-md transition-all">今日</button>
           <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-md transition-all">本周</button>
           <button className="px-4 py-1.5 text-sm font-bold text-slate-500 hover:text-slate-700 rounded-md transition-all">本月</button>
        </div>
      </div>

      <div className="shrink-0 mb-6">
        <OverviewStats setActiveTab={setActiveTab} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6">
        {/* Row 2: Charts and Alerts */}
        <div className="flex-[4] min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6 min-h-0">
             {/* Chart */}
             <div className="flex-1 min-h-0">
                <ActivityStatusChart />
             </div>

             {/* Quick Stats Bento */}
             <div className="shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Financial mini card */}
              <div 
                 onClick={() => setActiveTab && setActiveTab('finance_dashboard')}
                 className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg shadow-slate-900/20 cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden group"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <BadgeDollarSign className="w-24 h-24" strokeWidth={1} />
                 </div>
                 <h4 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1 relative z-10">今日预期营收</h4>
                 <div className="text-2xl font-black font-mono relative z-10">¥ 12,450</div>
                 <div className="mt-4 flex justify-between text-xs font-medium text-slate-300 relative z-10 border-t border-white/10 pt-3">
                    <span>新增缴费: 3笔</span>
                    <span className="text-emerald-400">+1.2%</span>
                 </div>
              </div>

              {/* Service mini card */}
              <div 
                 onClick={() => setActiveTab && setActiveTab('care_log')}
                 className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                 <div className="flex justify-between items-start mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Heart className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">服务力</span>
                 </div>
                 <h4 className="text-slate-800 font-black text-2xl mt-1 tracking-tight">142<span className="text-sm text-slate-500 font-semibold ml-1">项</span></h4>
                 <div className="text-xs text-slate-500 font-medium mt-1">今日已执行标准照护任务</div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }}></div>
                 </div>
              </div>

              {/* Environment mini card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">院区环境实况</h4>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"><ThermometerSun className="w-3.5 h-3.5 text-rose-400"/> 温度</div>
                       <div className="font-bold text-slate-700 font-mono">24.5 °C</div>
                    </div>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"><Droplets className="w-3.5 h-3.5 text-blue-400"/> 湿度</div>
                       <div className="font-bold text-slate-700 font-mono">45 %</div>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                       <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"><Wind className="w-3.5 h-3.5 text-emerald-400"/> 空气质量</div>
                       <div className="font-bold text-emerald-600 font-mono text-sm">优 (AQI 24)</div>
                    </div>
                    <div className="flex flex-col gap-1 mt-1">
                       <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium"><Zap className="w-3.5 h-3.5 text-amber-400"/> 设施能耗</div>
                       <div className="font-bold text-slate-700 font-mono text-sm">正常</div>
                    </div>
                 </div>
              </div>
           </div>
          </div>

          <div className="lg:col-span-4 min-h-0">
             <AlertsFeed />
          </div>
        </div>

        {/* Row 3: Devices & Timeline */}
        <div className="flex-[3] min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 min-h-0">
             <DeviceStatus />
          </div>
          
          <Card className="col-span-1 lg:col-span-2 border-none shadow-sm shadow-slate-200/50 bg-white flex flex-col min-h-0">
            <CardHeader className="py-5 px-6 border-b border-slate-50 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" /> 全局实时动态事件流
              </CardTitle>
              <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">查看完整日志</button>
            </CardHeader>
            <CardContent className="p-6 flex-1 min-h-0 overflow-y-auto hidden-scrollbar">
             <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
               
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-100 text-indigo-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 group-hover:scale-110 group-hover:bg-indigo-200 transition-all">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-indigo-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        前台接待: 参观与入住咨询
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">刚刚</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      家属 <span className="font-medium text-slate-700 text-indigo-700">刘先生</span> 一行3人正在参观 A 栋，由客服主管接待，意向登记了一套双人套房。
                    </div>
                  </div>
               </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-100 text-purple-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 group-hover:scale-110 group-hover:bg-purple-200 transition-all">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-purple-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        医护工单: 专项用药照护
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">10:30 AM</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      高级护理员 <span className="font-medium text-slate-700">张莉</span> 为 <span className="font-bold text-slate-700">赵大爷(205室)</span> 完成了降压药辅助服用，生命体征各项数据已同步至健康档案。
                    </div>
                  </div>
               </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-100 text-emerald-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 group-hover:scale-110 group-hover:bg-emerald-200 transition-all">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-emerald-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        后勤工单: 环境消杀闭环
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">09:15 AM</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      保洁一组已完成2号楼公共区域臭氧及紫外线环境联合消杀任务，视频抽检合格。
                    </div>
                  </div>
               </div>

               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-amber-100 text-amber-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 group-hover:scale-110 group-hover:bg-amber-200 transition-all">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/50 shadow-sm transition-all hover:bg-white hover:border-amber-100 hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        文娱活动: 早间康复训练
                      </div>
                      <time className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-100 shadow-sm">08:30 AM</time>
                    </div>
                    <div className="text-xs text-slate-600 leading-relaxed">
                      早间音乐疗法和八段锦课程已在多功能厅圆满结束，共有 <span className="font-bold text-amber-600">45</span> 名在院长者参与，照片墙已发布入家属群。
                    </div>
                  </div>
               </div>
               
             </div>
          </CardContent>
        </Card>

      </div>
    </div>
    </div>
  );
}

