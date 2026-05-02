import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, Filter, CalendarClock, Ban, MapPin, CheckCircle2, Navigation, AlertTriangle, X, FileText, Info } from "lucide-react";
import { useStore } from "../store";

export function LeaveManage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [selectedElderForLeave, setSelectedElderForLeave] = useState<string>('');

  const { elders, targetElderId, targetAction, setTargetElderId, setTargetAction } = useStore();

  useEffect(() => {
     if (targetAction === 'create_leave' && targetElderId) {
        setSelectedElderForLeave(targetElderId);
        setShowCreateModal(true);
        setTargetAction(null);
     }
  }, [targetElderId, targetAction, setTargetAction]);

  const leaves = [
    { id: "LV-20231105-01", name: "张明宇", room: "A栋-101", type: "家属接回", reason: "回家过周末", outTime: "2023-11-05 09:30", expectedInTime: "2023-11-07 18:00", actualInTime: "-", status: "out", companion: "张小强 (儿子)", phone: "13800138000" },
    { id: "LV-20231103-02", name: "李秀红", room: "A栋-105", type: "外出就医", reason: "协和医院眼科复查", outTime: "2023-11-03 08:00", expectedInTime: "2023-11-03 16:00", actualInTime: "2023-11-03 15:30", status: "returned", companion: "王芳 (女儿)", phone: "13912345678" }
  ];

  const handleReturn = (record: any) => {
    setSelectedRecord(record);
    setShowReturnModal(true);
  };

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">长者请销假管理</h1>
          <span className="text-sm text-slate-500">管理长者离院、归院登记，自动联动餐饮与用药暂停</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 border border-indigo-700 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            新建请假登记
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
               <Navigation className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-medium text-slate-500 mb-0.5">当前院外长者</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">12<span className="text-sm font-normal text-slate-500 ml-1">人</span></h3>
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="border-rose-200 bg-rose-50/50">
          <CardContent className="p-4 flex items-center gap-4">
             <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
               <AlertTriangle className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-medium text-rose-600 mb-0.5">逾期未归告警</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-rose-700">1<span className="text-sm font-normal text-rose-500 ml-1">人</span></h3>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
              <button 
                onClick={() => setActiveTab('active')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >请假离院中 (12)</button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >历史请假记录</button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜索长者姓名..." 
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                筛选
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">长者姓名 (床位)</th>
                <th className="px-6 py-4 font-medium">陪同人及联系方式</th>
                <th className="px-6 py-4 font-medium">离院缘由</th>
                <th className="px-6 py-4 font-medium">离院与拟归日期</th>
                <th className="px-6 py-4 font-medium">当前状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.filter(l => activeTab === 'active' ? l.status === 'out' : l.status === 'returned').map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.room}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{item.companion}</div>
                    <div className="text-xs text-slate-500">{item.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-700">{item.type}</div>
                    <div className="text-xs text-slate-500">{item.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="text-slate-600 font-medium">出：{item.outTime}</div>
                     {item.status === 'out' ? (
                       <div className="text-slate-500 text-xs">拟：{item.expectedInTime}</div>
                     ) : (
                       <div className="text-emerald-600 text-xs font-medium">归：{item.actualInTime}</div>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      item.status === 'out' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                      'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {item.status === 'out' ? "请假离院外" : "已销假归院"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status === 'out' ? (
                      <button 
                        onClick={() => handleReturn(item)}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-xs px-3 py-1.5 rounded transition-colors shadow-sm"
                      >
                        办理销假
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleView(item)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors"
                      >
                        查看记录
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {leaves.filter(l => activeTab === 'active' ? l.status === 'out' : l.status === 'returned').length === 0 && (
            <div className="p-8 text-center text-slate-500">
               暂无数据。
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新建请假登记 Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <CalendarClock className="w-5 h-5 text-indigo-600" />
                 新建离院请假登记
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 bg-slate-50/50 flex-1 overflow-y-auto">
               <div className="space-y-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">选择请假长者 *</label>
                       <select 
                         className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                         value={selectedElderForLeave}
                         onChange={(e) => setSelectedElderForLeave(e.target.value)}
                       >
                         <option value="">请选择</option>
                         {elders.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                         <option value="ELD-001">张明宇</option>
                         <option value="ELD-004">刘建国</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">请假类型 *</label>
                       <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                         <option>家属接回</option>
                         <option>外出就医</option>
                         <option>其他原因</option>
                       </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">实际离院时间 *</label>
                       <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-white" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">预计归院时间 *</label>
                       <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-white" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">离院原因及去向说明 *</label>
                    <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white resize-none" placeholder="请详细记录..."></textarea>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg space-y-4 text-sm mt-2">
                     <h4 className="font-bold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-600" /> 接送人信息</h4>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-500">陪同人姓名</label>
                          <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white" placeholder="如：张小强" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-slate-500">与长者关系</label>
                          <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                             <option>子女</option>
                             <option>配偶</option>
                             <option>其他亲属</option>
                             <option>护理员陪同</option>
                          </select>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mt-4 p-4 bg-amber-50 border border-amber-200 border-dashed rounded-xl flex gap-3 text-sm text-amber-800">
                  <Info className="w-5 h-5 shrink-0 text-amber-600" />
                  <div>
                    <p className="font-bold mb-1">系统联动提示</p>
                    <p className="text-amber-700/80">提交请假后，系统将自动向餐厅发送<strong>暂停餐饮</strong>通知，并向药房发送<strong>暂停发药</strong>通知，按实际请假天数自动核算退费。</p>
                  </div>
               </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> 确认生成请假单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 办理销假 Modal */}
      {showReturnModal && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-emerald-100 bg-emerald-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 办理长者销假 (归院)
              </h3>
              <button onClick={() => setShowReturnModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg mb-6 flex gap-4 text-sm">
                 <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                   {selectedRecord.name[0]}
                 </div>
                 <div>
                   <p className="font-bold text-slate-800 text-base mb-1">{selectedRecord.name} <span className="text-xs font-normal text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 ml-2">{selectedRecord.room}</span></p>
                   <p className="text-slate-600">离院时间: <span className="font-medium text-slate-800">{selectedRecord.outTime}</span></p>
                   <p className="text-slate-600 mt-0.5">请假事由: {selectedRecord.reason} ({selectedRecord.type})</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">实际归院时间 *</label>
                   <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 bg-white" />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">归院时身体及物品状况记录</label>
                   <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white resize-none" placeholder="正常归院，携带外院药品..."></textarea>
                 </div>
                 <div className="space-y-1.5 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-3 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100/50 transition">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600" defaultChecked />
                      <span className="text-sm font-medium text-emerald-800">同步恢复餐饮及护理排班计划</span>
                    </label>
                 </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setShowReturnModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
              <button 
                onClick={() => setShowReturnModal(false)} 
                className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> 确认销假
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看记录 Modal */}
      {showViewModal && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 请假记录详情
              </h3>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 text-sm text-slate-600">
               <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">长者信息</label>
                  <p className="font-medium text-slate-800 text-base">{selectedRecord.name} <span className="text-slate-500 font-normal">({selectedRecord.room})</span></p>
               </div>
               <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">请假类型</label>
                    <p className="font-medium text-slate-800">{selectedRecord.type}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">陪同人</label>
                    <p className="font-medium text-slate-800">{selectedRecord.companion}</p>
                    <p className="text-xs">{selectedRecord.phone}</p>
                  </div>
               </div>
               <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">请假缘由</label>
                  <p className="p-3 bg-slate-50 rounded-lg border border-slate-100">{selectedRecord.reason}</p>
               </div>
               <div className="pt-2 space-y-2">
                 <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                    <span className="text-slate-500">离院时间</span>
                    <span className="font-medium text-slate-800">{selectedRecord.outTime}</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                    <span className="text-slate-500">预计归院</span>
                    <span className="font-medium text-slate-800">{selectedRecord.expectedInTime}</span>
                 </div>
                 <div className="flex justify-between items-center py-2">
                    <span className="text-slate-500">实际归院</span>
                    <span className="font-medium text-emerald-600">{selectedRecord.actualInTime}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
