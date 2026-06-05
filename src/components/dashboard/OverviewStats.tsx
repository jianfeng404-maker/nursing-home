import { Card, CardContent } from "../ui/card";
import { Users, Bed, ActivitySquare, AlertTriangle, TrendingUp } from "lucide-react";
import { useStore } from "../../store";

interface OverviewStatsProps {
  setActiveTab?: (tab: string) => void;
}

export function OverviewStats({ setActiveTab }: OverviewStatsProps) {
  // Use zustand store
  const elders = useStore(state => state.elders);
  const alerts = useStore(state => state.alerts);
  const tasks = useStore(state => state.tasks);

  const pendingAlertsCount = alerts.filter(a => a.status === 'pending').length;
  const criticalAlertsCount = alerts.filter(a => a.status === 'pending' && a.level === 'critical').length;
  
  const totalBeds = 120;
  const occupiedBeds = elders.length;
  const freeBeds = totalBeds - occupiedBeds;
  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { targetId: "elder_info", label: "在院长者", value: occupiedBeds.toString(), trend: `入住率 ${occupancyRate}%`, icon: Users, color: "text-slate-700", bg: "bg-slate-100", highlight: "bg-slate-50 border-slate-200" },
    { targetId: "bed_board", label: "空闲床位", value: freeBeds.toString(), trend: "昨日减少 2", icon: Bed, color: "text-emerald-700", bg: "bg-emerald-100", highlight: "bg-emerald-50 border-emerald-100" },
    { targetId: "care_tasks", label: "今日护理巡床", value: totalTasks.toString(), trend: `已完成 ${taskCompletionRate}%`, isUp: true, icon: ActivitySquare, color: "text-indigo-700", bg: "bg-indigo-100", highlight: "bg-indigo-50 border-indigo-100" },
    { targetId: "safety", label: "待处理告警", value: pendingAlertsCount.toString(), trend: `含 ${criticalAlertsCount} 起危机`, icon: AlertTriangle, color: "text-rose-700", bg: "bg-rose-100", highlight: "bg-rose-50 border-rose-200 shadow-rose-100" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-8">
      {stats.map((stat, i) => (
        <Card 
           key={i} 
           onClick={() => setActiveTab && setActiveTab(stat.targetId)}
           className={`hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer border-none shadow-sm ${stat.highlight}`}
        >
          <CardContent className="p-5 xl:p-6">
            <div className="flex items-center justify-between mb-4">
               <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} strokeWidth={2.5} />
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                stat.color === 'text-rose-700' ? 'bg-white text-rose-600 shadow-sm' : 'bg-white/60 text-slate-600'
              }`}>
                {stat.isUp && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                {stat.trend}
              </div>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <h3 className={`text-4xl font-bold tracking-tight ${
                  stat.color === 'text-rose-700' ? 'text-rose-700 animate-pulse' : 'text-slate-800'
                }`}>
                  {stat.value}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
