import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Plus, Filter, Cctv, Wifi, WifiOff, Link, MapPin, HeartPulse, Activity, X, Target, Scan } from "lucide-react";
import { useStore } from "../store";

export function IoTInstances() {
  const [activeTab, setActiveTab] = useState('all');
  const [showBindModal, setShowBindModal] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<any>(null);
  const [bindTargetType, setBindTargetType] = useState('location');

  const instances = useStore(state => state.iotDevices);
  const elders = useStore(state => state.elders);
  const beds = useStore(state => state.beds);

  const handleRebind = (instance: any) => {
    setSelectedInstance(instance);
    if (instance?.bindType === '人员绑定') setBindTargetType('person');
    else if (instance?.bindType === '床位绑定') setBindTargetType('bed');
    else setBindTargetType('location');
    setShowBindModal(true);
  };


  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">设备实例与位置绑定</h2>
          <p className="text-slate-500 text-sm mt-1">管理实际入网的各类智能硬件，并将其绑定至具体的房间、床位或长者</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setSelectedInstance(null); setShowBindModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            <Plus className="w-4 h-4" /> 硬件入网与绑定
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">在线实例数</p>
              <h3 className="text-2xl font-bold text-emerald-600">3</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <Wifi className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">离线实例数</p>
              <h3 className="text-2xl font-bold text-slate-400">1</h3>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
              <WifiOff className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/50">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div className="flex gap-2">
             {['all', 'online', 'offline'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'all' && '全部设备'}
                  {tab === 'online' && '在线设备'}
                  {tab === 'offline' && '离线告警'}
                </button>
             ))}
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索序列号/位置..."
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm w-64 focus:outline-none focus:border-blue-500 bg-white"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition">
                <Filter className="w-4 h-4" /> 筛选
             </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">设备实例</th>
                <th className="px-6 py-4 font-medium">所属产品/类型</th>
                <th className="px-6 py-4 font-medium">绑定目标</th>
                <th className="px-6 py-4 font-medium">通讯状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
               {instances.filter(i => activeTab === 'all' || (activeTab === 'online' && i.status === '在线') || (activeTab === 'offline' && i.status === '离线')).map(instance => (
                  <tr key={instance.id} className="hover:bg-slate-50/50 transition">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${instance.status === '在线' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-400'}`}>
                              <Cctv className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-slate-800">{instance.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5 font-mono">{instance.id} | SN: {instance.sn}</div>
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-slate-800 font-medium">{instance.catalog}</div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">IP/网关: {instance.ip}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                           <span className={`text-[10px] uppercase font-bold tracking-wider w-fit px-1.5 py-0.5 rounded ${
                             instance.bindType === '位置绑定' ? 'bg-amber-100 text-amber-700' :
                             instance.bindType === '人员绑定' ? 'bg-indigo-100 text-indigo-700' :
                             'bg-emerald-100 text-emerald-700'
                           }`}>
                             {instance.bindType}
                           </span>
                           <div className="flex items-center gap-1.5 font-medium text-slate-800">
                              <Target className="w-3.5 h-3.5 text-slate-400" />
                              {instance.bindTarget}
                           </div>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                        {instance.status === '在线' ? (
                           <span className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 在线 ({instance.lastActive})
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1.5 text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200">
                              <WifiOff className="w-3.5 h-3.5 text-slate-400" /> 离线 ({instance.lastActive})
                           </span>
                        )}
                     </td>
                     <td className="px-6 py-4 text-right">
                        <button onClick={() => handleRebind(instance)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">重新绑定</button>
                        <span className="text-slate-300 mx-2">|</span>
                        <button className="text-slate-500 hover:text-slate-700 font-medium text-sm">解绑下线</button>
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Bind Device Modal */}
      {showBindModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Link className="w-5 h-5 text-blue-600" />
                   {selectedInstance ? '重新绑定硬件设备' : '硬件设备入网与绑定'}
                </h3>
                <button onClick={() => setShowBindModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">所属产品模型 *</label>
                     <select defaultValue={selectedInstance?.catalog || ""} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="">选择物模型 (例如: 防跌倒雷达)</option>
                        <option value="毫米波防跌倒雷达">毫米波防跌倒雷达</option>
                        <option value="一键紧急呼叫器">一键紧急呼叫器</option>
                        <option value="智能体征监测床垫">智能体征监测床垫</option>
                        <option value="AI人脸识别门禁">AI人脸识别门禁</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">设备序列号 (SN) / MAC地址 *</label>
                     <div className="relative">
                       <input type="text" defaultValue={selectedInstance?.sn || ""} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 pr-10" placeholder="例如: SN88492011" />
                       <Scan className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-blue-600" />
                     </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">设备实例名称</label>
                   <input type="text" defaultValue={selectedInstance?.name || ""} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="方便识别的别名，例如：101套房主卫防跌倒" />
                </div>

                <div className="border-t border-slate-100 pt-6">
                   <h4 className="font-medium text-slate-800 mb-4 flex items-center gap-2">
                     <Target className="w-4 h-4 text-blue-600" />
                     绑定目标对象
                   </h4>
                   <div className="grid grid-cols-3 gap-3 mb-4">
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${bindTargetType === 'location' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                         <input type="radio" name="bindType" checked={bindTargetType === 'location'} onChange={() => setBindTargetType('location')} className="text-blue-600 focus:ring-blue-500" />
                         <span className={`text-sm font-medium ${bindTargetType === 'location' ? 'text-blue-800' : 'text-slate-700'}`}>位置/房间绑定</span>
                      </label>
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${bindTargetType === 'bed' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                         <input type="radio" name="bindType" checked={bindTargetType === 'bed'} onChange={() => setBindTargetType('bed')} className="text-blue-600 focus:ring-blue-500" />
                         <span className={`text-sm font-medium ${bindTargetType === 'bed' ? 'text-blue-800' : 'text-slate-700'}`}>特定床位绑定</span>
                      </label>
                      <label className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${bindTargetType === 'person' ? 'border-blue-200 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                         <input type="radio" name="bindType" checked={bindTargetType === 'person'} onChange={() => setBindTargetType('person')} className="text-blue-600 focus:ring-blue-500" />
                         <span className={`text-sm font-medium ${bindTargetType === 'person' ? 'text-blue-800' : 'text-slate-700'}`}>特定人员绑定</span>
                      </label>
                   </div>
                   
                   {bindTargetType === 'location' && (
                     <div className="space-y-1.5 animate-in fade-in">
                       <label className="text-sm font-medium text-slate-700">选择位置节点</label>
                       <div className="flex gap-2">
                         <select className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option>A栋</option>
                            <option>B栋</option>
                         </select>
                         <select className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option>1层</option>
                            <option>2层</option>
                         </select>
                         <select className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option>101房</option>
                            <option>102房</option>
                         </select>
                         <select className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option>卫生间</option>
                            <option>卧室</option>
                            <option>客厅</option>
                         </select>
                       </div>
                     </div>
                   )}

                   {bindTargetType === 'bed' && (
                     <div className="space-y-1.5 animate-in fade-in">
                       <label className="text-sm font-medium text-slate-700">选择床位</label>
                       <div className="flex gap-2">
                         <select className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option value="">选择房间</option>
                            {Array.from(new Set(beds.map((b: any) => b.room))).map(room => (
                              <option key={room as string} value={room as string}>{room}房</option>
                            ))}
                         </select>
                         <select className="flex-2 w-2/3 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                            <option value="">选择具体床位</option>
                            {beds.map((b: any) => (
                              <option key={b.id} value={b.id}>{b.building}-{b.room}床{b.elderId ? ' (已入住)' : ' (空床)'}</option>
                            ))}
                         </select>
                       </div>
                     </div>
                   )}

                   {bindTargetType === 'person' && (
                     <div className="space-y-1.5 animate-in fade-in">
                       <label className="text-sm font-medium text-slate-700">选择特定人员</label>
                       <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                           <option value="">请搜索并选择长者</option>
                           {elders.map((elder: any) => (
                             <option key={elder.id} value={elder.id}>{elder.name} ({elder.room}床)</option>
                           ))}
                       </select>
                     </div>
                   )}
                </div>

             </div>

             <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                <button onClick={() => setShowBindModal(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition font-medium text-sm">取消</button>
                <button onClick={() => setShowBindModal(false)} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-medium text-sm">提交并激活设备</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
