import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Filter, AlertTriangle, ShieldCheck, Cctv, BellRing, X, PhoneCall, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useStore } from "../store";
import { toast } from "sonner";

export function SafetyMonitor() {
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const storeAlerts = useStore(state => state.alerts);
  const resolveStoreAlert = useStore(state => state.resolveAlert);
  const addTask = useStore(state => state.addTask);

  const getLevelZh = (level: string) => {
    switch(level) {
      case 'critical': return '紧急';
      case 'high': return '高优';
      case 'warning': return '普通';
      default: return '普通';
    }
  };

  const getStatusZh = (status: string) => {
    switch(status) {
      case 'pending': return '待处理';
      case 'processing': return '处理中';
      case 'resolved': return '已解除';
      default: return '待处理';
    }
  };

  const alerts = storeAlerts.map(a => ({
    id: a.id,
    time: a.time,
    type: a.title,
    level: getLevelZh(a.level),
    location: a.location,
    status: getStatusZh(a.status),
    device: a.device,
    detail: a.notes ? `处理记录: ${a.notes}` : `报警位置: ${a.location} - 关联长者: ${a.resident}`,
    rawStatus: a.status
  }));

  const handleProcess = (alert: any) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">告警与调度中心</h2>
          <p className="text-slate-500 text-sm mt-1">全局监控各类智能硬件触发的安全告警信息并进行工单调度</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-gradient-to-br from-rose-500 to-rose-600 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-rose-100 font-medium mb-1">紧急待处理告警</p>
              <h3 className="text-3xl font-bold">3</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">在线监控设备</p>
              <h3 className="text-2xl font-bold text-slate-800">124</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
              <Cctv className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">今日告警总数</p>
              <h3 className="text-2xl font-bold text-slate-800">18</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <BellRing className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">处理完成率</p>
              <h3 className="text-2xl font-bold text-emerald-600">83%</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/50 relative overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white relative z-10">
          <div className="flex gap-2">
             {['all', 'pending', 'resolved'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'all' && '全部告警'}
                  {tab === 'pending' && '待处理中心'}
                  {tab === 'resolved' && '已处理日志'}
                </button>
             ))}
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索位置/设备..."
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                <Filter className="w-4 h-4" /> 筛选
             </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">告警时间</th>
                <th className="px-6 py-4 font-medium">级别</th>
                <th className="px-6 py-4 font-medium">告警类型</th>
                <th className="px-6 py-4 font-medium">触发位置</th>
                <th className="px-6 py-4 font-medium">来源设备</th>
                <th className="px-6 py-4 font-medium">处理状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
               {alerts.filter(a => activeTab === 'all' || (activeTab === 'pending' && (a.status === '待处理' || a.status === '处理中')) || (activeTab === 'resolved' && a.status === '已解除')).map(alert => (
                  <tr key={alert.id} className="hover:bg-slate-50/50 transition">
                     <td className="px-6 py-4 font-mono text-slate-900">{alert.time}</td>
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${alert.level === '紧急' ? 'bg-rose-100 text-rose-700 border border-rose-200' : alert.level === '高优' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                           {alert.level}
                        </span>
                     </td>
                     <td className="px-6 py-4 font-bold text-slate-800">{alert.type}</td>
                     <td className="px-6 py-4">{alert.location}</td>
                     <td className="px-6 py-4 text-slate-500">{alert.device}</td>
                     <td className="px-6 py-4">
                        {alert.status === '待处理' && <span className="text-rose-600 font-medium flex items-center gap-1.5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>待处理</span>}
                        {alert.status === '处理中' && <span className="text-blue-600 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>处理中</span>}
                        {alert.status === '已解除' && <span className="text-slate-400 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>已解除</span>}
                     </td>
                     <td className="px-6 py-4 text-right">
                        {alert.status !== '已解除' ? (
                           <button onClick={() => handleProcess(alert)} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm">响应调度</button>
                        ) : (
                           <button className="text-slate-500 hover:text-slate-700 font-medium transition-colors">查看记录</button>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Dispatch Modal */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className={`p-5 border-b flex items-center justify-between ${selectedAlert.level === '紧急' ? 'bg-rose-50 border-rose-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAlert.level === '紧急' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                      <AlertTriangle className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="font-bold text-slate-800 text-lg">{selectedAlert.type}</h3>
                      <div className="text-sm font-medium text-slate-500">{selectedAlert.time} | {selectedAlert.location}</div>
                   </div>
                </div>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full bg-white/50"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-2">告警详情</h4>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-700 text-sm leading-relaxed">
                    {selectedAlert.detail}
                    <div className="mt-2 text-xs text-slate-500">关联设备：{selectedAlert.device}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-3">调度动作 (Dispatch Actions)</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                       onClick={() => {
                         const match = selectedAlert.detail?.match(/关联长者: (.*?)$/);
                         const elderName = match ? match[1] : '未知';
                         const roomMatch = selectedAlert.location;
                         
                         addTask({
                           id: `TSK-IOT-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
                           time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                           type: 'care',
                           name: `[告警调度] ${selectedAlert.type}处理`,
                           status: 'pending',
                           elder: `${elderName} (${roomMatch})`,
                           fee: 0,
                           staff: '未指派'
                         } as any);
                         
                         resolveStoreAlert(selectedAlert.id, '已派发工单并推送至护理端', '中台调度员');
                         toast.success('已联动生成护理调度工单，并推送至护工端！');
                         setShowModal(false);
                       }}
                       className="flex flex-col items-center justify-center gap-2 p-4 border border-blue-200 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-blue-700 text-sm font-bold">
                        <ShieldAlert className="w-6 h-6" />
                        派单给就近护理员
                     </button>
                     <button className="flex flex-col items-center justify-center gap-2 p-4 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-indigo-700 text-sm font-bold">
                        <PhoneCall className="w-6 h-6" />
                        联络家属/监护人
                     </button>
                     <button 
                       onClick={() => {
                         resolveStoreAlert(selectedAlert.id, '安全中台标记为误报解除', '总台调度员');
                         setShowModal(false);
                       }}
                       className="flex flex-col items-center justify-center gap-2 p-4 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors text-emerald-700 text-sm font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                        标记为误报解除
                     </button>
                     <button 
                       onClick={() => {
                         resolveStoreAlert(selectedAlert.id, '安全中台已介入处理', '总台调度员');
                         setShowModal(false);
                       }}
                       className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 text-sm font-bold">
                        <ShieldCheck className="w-6 h-6" />
                        已处理并记录摘要
                     </button>
                  </div>
                </div>
             </div>

             <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm">取消操作</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
