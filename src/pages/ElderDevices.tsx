import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Plus, Wifi, Watch, Activity, AlertCircle, X } from "lucide-react";
import { useStore } from "../store";

export function ElderDevices({ targetElderId, embedded }: { targetElderId?: string | null, embedded?: boolean }) {
  const allDevices = useStore(state => state.iotDevices);
  const elders = useStore(state => state.elders);
  const bindIoTDevice = useStore(state => state.bindIoTDevice);

  const [isBindModalOpen, setIsBindModalOpen] = useState(false);
  const [newDeviceSN, setNewDeviceSN] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceCatalog, setNewDeviceCatalog] = useState("毫米波防跌倒雷达");

  const currentElder = elders.find(e => e.id === targetElderId?.replace('ELD-', '') || e.id === targetElderId);

  // Filter devices that belong to this elder
  const devices = allDevices.filter(d => d.elderId === targetElderId);

  const handleBindDevice = () => {
    if (!newDeviceSN || !newDeviceName) return;
    
    bindIoTDevice({
      id: `DEV-NEW-${Date.now()}`,
      sn: newDeviceSN,
      name: newDeviceName,
      catalog: newDeviceCatalog,
      bindType: "人员绑定",
      bindTarget: currentElder ? `${currentElder.name} (${currentElder.room})` : "未知长者",
      status: "离线",
      lastActive: "-",
      ip: "-",
      elderId: targetElderId || undefined,
    });
    
    setIsBindModalOpen(false);
    setNewDeviceSN("");
    setNewDeviceName("");
    setNewDeviceCatalog("毫米波防跌倒雷达");
  };

  const getDeviceIcon = (catalog: string) => {
    if (catalog.includes("手表") || catalog.includes("腕表")) return <Watch className="w-5 h-5 text-indigo-600" />;
    if (catalog.includes("床垫") || catalog.includes("雷达")) return <Activity className="w-5 h-5 text-blue-600" />;
    if (catalog.includes("呼叫")) return <AlertCircle className="w-5 h-5 text-rose-600" />;
    return <Wifi className="w-5 h-5 text-slate-600" />;
  };

  const getDeviceColor = (catalog: string) => {
    if (catalog.includes("手表") || catalog.includes("腕表")) return "bg-indigo-50";
    if (catalog.includes("床垫") || catalog.includes("雷达")) return "bg-blue-50";
    if (catalog.includes("呼叫")) return "bg-rose-50";
    return "bg-slate-50";
  };

  return (
    <div className="animate-in fade-in pb-8">
      {embedded && (
        <div className="mb-6 border-b border-slate-200 pb-4 flex justify-between items-center px-6 pt-2">
            <div>
               <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                  已绑定的智能设备
               </h3>
               <p className="text-sm text-slate-500 mt-0.5">档案编号: {targetElderId}</p>
            </div>
         </div>
      )}
      
      <div className={embedded ? "px-6" : ""}>
         <Card className="border-slate-200 shadow-sm">
           <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
             <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                智能设备列表
             </CardTitle>
             <button onClick={() => setIsBindModalOpen(true)} className="text-indigo-600 text-sm font-medium hover:underline flex items-center gap-1">
               <Plus className="w-4 h-4"/> 绑定新设备
             </button>
           </CardHeader>
           <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.length > 0 ? devices.map(device => (
                  <div key={device.id} className="border border-slate-200 rounded-lg p-4 bg-white flex items-start gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getDeviceColor(device.catalog)}`}>
                        {getDeviceIcon(device.catalog)}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-slate-800 flex-1 pr-2 line-clamp-1" title={device.name}>{device.name}</h4>
                           {device.status === '在线' ? (
                             <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-medium border border-emerald-100 shrink-0">在线</span>
                           ) : (
                             <span className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-xs font-medium border border-slate-200 shrink-0">离线</span>
                           )}
                        </div>
                        <p className="text-xs text-slate-500 mb-2">型号: <span className="font-medium text-slate-700">{device.catalog}</span></p>
                        <p className="text-xs text-slate-500 mb-2">设备ID: <span className="font-mono">{device.sn}</span></p>
                     </div>
                  </div>
                )) : (
                  <div className="col-span-full py-8 text-center text-slate-500">
                    <Wifi className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p>暂无绑定的智能设备</p>
                  </div>
                )}
              </div>
           </CardContent>
         </Card>
      </div>

      {isBindModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-xl shadow-xl w-[500px] overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg">绑定智能设备</h3>
              <button 
                onClick={() => setIsBindModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">设备类型</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  value={newDeviceCatalog}
                  onChange={(e) => setNewDeviceCatalog(e.target.value)}
                >
                  <option value="毫米波防跌倒雷达">毫米波防跌倒雷达 (位置绑定)</option>
                  <option value="智能体征监测床垫">智能体征监测床垫 (床位绑定)</option>
                  <option value="一键紧急呼叫器">一键紧急呼叫器 (人员绑定)</option>
                  <option value="健康腕表">健康腕表 (人员绑定)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">设备名称 / 位置</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="例如: 李大爷的健康腕表"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">设备 SN / 标识码</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="请输入设备背面的SN码"
                  value={newDeviceSN}
                  onChange={(e) => setNewDeviceSN(e.target.value)}
                />
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setIsBindModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-white transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleBindDevice}
                disabled={!newDeviceSN || !newDeviceName}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认绑定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
