import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, HeartPulse, LocateFixed, Flame, X, ShieldAlert, PhoneCall, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../store";

const iconMap: Record<string, React.ElementType> = {
  fall: AlertCircle,
  vitals: HeartPulse,
  wander: LocateFixed,
  system: Flame,
  sos: AlertCircle // Added for SOS
};

export function AlertsFeed() {
  const alerts = useStore(state => state.alerts);
  const pendingCount = alerts.filter(a => a.status === 'pending').length;
  const updateAlertStatus = useStore(state => state.updateAlertStatus);
  const resolveStoreAlert = useStore(state => state.resolveAlert);
  const addTask = useStore(state => state.addTask);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

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
      <CardContent className="p-6 pt-4 flex-1 flex flex-col min-h-0">
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {alerts.filter(a => a.status === 'pending' || a.status === 'processing').map((alert) => {
            const Icon = iconMap[alert.type] || AlertCircle;
            // Also show 'processing' ones so they don't disappear right away
            const isProcessing = alert.status === 'processing';
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
                    <span className={`font-bold text-sm truncate flex items-center gap-1.5 ${
                      alert.level === 'critical' ? 'text-rose-700' :
                      alert.level === 'high' ? 'text-amber-800' :
                      'text-slate-700'
                    }`}>
                      {isProcessing && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                      {alert.title}
                    </span>
                    <span className={`whitespace-nowrap font-medium ${
                      alert.level === 'critical' ? 'text-rose-500' :
                      alert.level === 'high' ? 'text-amber-500' : 'text-slate-400'
                    }`}>{alert.time}</span>
                  </div>
                  <p className={`text-xs mt-1 font-medium ${
                     alert.level === 'critical' ? 'text-rose-600/80' :
                     alert.level === 'high' ? 'text-amber-700/70' : 'text-slate-500'
                  }`}>{alert.resident} · {alert.location}</p>
                  
                  {!isProcessing && (
                    <button 
                      className={`mt-3 px-4 py-1.5 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm w-full sm:w-auto ${
                        alert.level === 'critical' ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 
                        'bg-slate-800 hover:bg-slate-900 shadow-slate-200'
                      }`}
                      onClick={() => {
                        updateAlertStatus(alert.id, 'processing');
                        setSelectedAlert(alert);
                      }}
                    >
                      立即确认与调度处理
                    </button>
                  )}
                  {isProcessing && (
                     <button
                        className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm w-full sm:w-auto"
                        onClick={() => setSelectedAlert(alert)}
                     >
                       跟进调度详情
                     </button>
                  )}
                </div>
              </div>
            );
          })}
          {alerts.filter(a => a.status === 'pending' || a.status === 'processing').length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-slate-200 rounded-xl">
               <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2"/>
               <p className="text-slate-600 font-bold text-sm">目前无待处理的安全预警</p>
               <p className="text-slate-400 text-xs mt-1">各项系统监控运转正常</p>
            </div>
          )}
        </div>
        <button 
          className="w-full mt-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all"
          onClick={() => setShowLogs(true)}
        >
          查看历史预警日志
        </button>
      </CardContent>

      {/* Dispatch Modal inside Dashboard */}
      {selectedAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
                <div className={`p-5 border-b flex items-center justify-between ${selectedAlert.level === 'critical' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                   <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAlert.level === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                         <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                         <h3 className="font-bold text-slate-800 text-lg">{selectedAlert.title}</h3>
                         <div className="text-sm font-medium text-slate-500">{selectedAlert.time} | {selectedAlert.location}</div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="p-6 space-y-6">
                   <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-2">报警详情与位置</h4>
                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-700 text-sm leading-relaxed">
                         检测到来自于 <span className="font-bold">{selectedAlert.resident}</span> 的异常告警触发。<br/>
                         触发位置: {selectedAlert.location}
                         <div className="mt-2 text-xs text-slate-500">来源源设备：{selectedAlert.device}</div>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-sm font-medium text-slate-500 mb-3">立即调度并下发任务</h4>
                      <div className="grid grid-cols-2 gap-3">
                         <button 
                             onClick={() => {
                               addTask({
                                 id: `TSK-SOS-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
                                 time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                                 type: 'care',
                                 name: `[紧急告警] ${selectedAlert.title}`,
                                 status: 'pending',
                                 elder: `${selectedAlert.resident} (${selectedAlert.location})`,
                                 fee: 0,
                                 staff: '未指派'
                               } as any);
                               
                               resolveStoreAlert(selectedAlert.id, '已派发工单并推送至护理端，等待一线人员抵达。', '监控中心值班员');
                               toast.success('已联动生成护理调度工单，并推送至一线护工端。');
                               setSelectedAlert(null);
                             }}
                             className="flex flex-col items-center justify-center gap-2 p-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-blue-700 text-sm font-bold shadow-sm"
                         >
                            <ShieldAlert className="w-6 h-6" />
                            派单给就近护理员
                         </button>
                         <button 
                             onClick={() => {
                               resolveStoreAlert(selectedAlert.id, '已紧急联络家属，家属表示会自行处理或已知悉。', '监控中心值班员');
                               toast.success('已完成家属联络并记录在案。');
                               setSelectedAlert(null);
                             }}
                             className="flex flex-col items-center justify-center gap-2 p-4 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-indigo-700 text-sm font-bold shadow-sm"
                         >
                            <PhoneCall className="w-6 h-6" />
                            联络家属/监护人
                         </button>
                         <button 
                             onClick={() => {
                               resolveStoreAlert(selectedAlert.id, '风控中心确认为误报/测试，已解除警报状态。', '监控中心值班员');
                               setSelectedAlert(null);
                             }}
                             className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 text-sm font-bold shadow-sm"
                         >
                            <CheckCircle2 className="w-6 h-6" />
                            标记为误报/测试
                         </button>
                         <button 
                             onClick={() => {
                               resolveStoreAlert(selectedAlert.id, '值班员亲自介入，问题已妥善解决。', '监控中心值班员');
                               setSelectedAlert(null);
                             }}
                             className="flex flex-col items-center justify-center gap-2 p-4 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-700 text-sm font-bold shadow-sm"
                         >
                            <ShieldCheck className="w-6 h-6" />
                            内部介入已处理
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      )}

      {/* History Logs Modal */}
      {showLogs && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
                 <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-500" /> 告警与处理日志记录
                    </h3>
                    <button onClick={() => setShowLogs(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
                 </div>
                 <div className="p-0 overflow-y-auto flex-1 bg-slate-50 border-b border-slate-100">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                       <thead className="bg-slate-100 text-slate-500 sticky top-0">
                          <tr>
                             <th className="px-4 py-3 font-bold">时间</th>
                             <th className="px-4 py-3 font-bold">预警类型</th>
                             <th className="px-4 py-3 font-bold">关联人/位置</th>
                             <th className="px-4 py-3 font-bold">处理摘要</th>
                             <th className="px-4 py-3 font-bold">状态</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200 bg-white">
                          {alerts.filter(a => a.status === 'resolved').map(alert => (
                             <tr key={alert.id} className="hover:bg-slate-50 transition">
                                <td className="px-4 py-4 font-mono text-slate-500 text-xs">{alert.time}</td>
                                <td className="px-4 py-4 text-slate-700 font-bold flex items-center gap-1.5">
                                   {alert.title}
                                </td>
                                <td className="px-4 py-4 text-slate-500 text-xs">{alert.resident} ({alert.location})</td>
                                <td className="px-4 py-4 text-slate-600 text-xs w-full max-w-xs truncate whitespace-normal" title={alert.notes}>{alert.notes || '已处理'}</td>
                                <td className="px-4 py-4">
                                  <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 box-border rounded-md border border-emerald-100 text-[10px]">已解除</span>
                                </td>
                             </tr>
                          ))}
                          {alerts.filter(a => a.status === 'resolved').length === 0 && (
                            <tr><td colSpan={5} className="text-center py-10 text-slate-400 font-bold">目前暂无已处理的历史预警</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
             </div>
         </div>
      )}
    </Card>
  );
}
