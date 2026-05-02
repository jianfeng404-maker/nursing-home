import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, HeartPulse, LocateFixed, Flame } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../store";

const iconMap: Record<string, React.ElementType> = {
  fall: AlertCircle,
  vitals: HeartPulse,
  wander: LocateFixed,
  system: Flame
};

export function AlertsFeed() {
  const alerts = useStore(state => state.alerts);
  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const updateAlertStatus = useStore(state => state.updateAlertStatus);

  return (
    <Card className="col-span-1 border-none shadow-sm flex flex-col h-full bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-amber-400"></div>
      <CardHeader className="py-5 px-6 shrink-0 border-b border-slate-50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
            安全预警中心
          </CardTitle>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 shadow-sm">未处理 ({pendingCount})</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1 overflow-y-auto">
          {alerts.filter(a => a.status === 'pending').map((alert) => {
            const Icon = iconMap[alert.type] || AlertCircle;
            return (
              <div key={alert.id} className={`flex gap-3.5 p-4 rounded-xl border transition-all ${
                alert.level === 'critical' ? 'bg-rose-50/50 border-rose-200/60 shadow-sm' :
                alert.level === 'high' ? 'bg-amber-50/50 border-amber-200/60 shadow-sm' :
                'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  alert.level === 'critical' ? 'bg-rose-100 text-rose-600 border border-rose-200 shadow-inner' :
                  alert.level === 'high' ? 'bg-amber-100 text-amber-600 border border-amber-200 shadow-inner' :
                  'bg-slate-100 text-slate-500 border border-slate-200 shadow-inner'
                }`}>
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start text-xs mb-1">
                    <span className={`font-bold text-sm truncate ${
                      alert.level === 'critical' ? 'text-rose-700' :
                      alert.level === 'high' ? 'text-amber-800' :
                      'text-slate-700'
                    }`}>{alert.title}</span>
                    <span className={`whitespace-nowrap font-medium ${
                      alert.level === 'critical' ? 'text-rose-500' :
                      alert.level === 'high' ? 'text-amber-500' : 'text-slate-400'
                    }`}>{alert.time}</span>
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                    alert.level === 'critical' ? 'text-rose-600/80' :
                    alert.level === 'high' ? 'text-amber-700/70' : 'text-slate-500'
                  }`}>{alert.resident} · {alert.location}</p>
                  {alert.level === 'critical' && (
                    <button 
                      className="mt-3 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm shadow-rose-200 w-full sm:w-auto"
                      onClick={() => {
                        updateAlertStatus(alert.id, 'processing');
                        toast.success(`已接单，请尽快前往处理: ${alert.title}`);
                      }}
                    >
                      立即确认与处理
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button 
          className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all"
          onClick={() => toast.info('进入完整预警日志页')}
        >
          查看历史预警日志
        </button>
      </CardContent>
    </Card>
  );
}
