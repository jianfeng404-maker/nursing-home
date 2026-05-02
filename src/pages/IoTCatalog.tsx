import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, Filter, Box as Cube, Activity, Share2, PlusCircle } from "lucide-react";

export function IoTCatalog() {
  const [activeTab, setActiveTab] = useState('models');

  const catalogs = [
    { 
      id: "FallDetection_Radar", 
      name: "毫米波防跌倒雷达", 
      status: "草稿", 
      desc: "利用毫米波雷达技术，非接触式监测长者在室内的活动状态，精准判定跌倒及异常驻留情况。", 
      protocol: "MQTT", 
      nodeType: "标准设备", 
      updatedAt: "2023-10-23 16:45",
      properties: 0, events: 0, services: 0
    },
    { 
      id: "SmartMattress_Monitor", 
      name: "智能体征监测床垫", 
      status: "已发布", 
      desc: "垫于床铺下方，无感采集长者心率、呼吸率、翻身等体征数据及在床离床状态。", 
      protocol: "4G / HTTP", 
      nodeType: "直连设备", 
      updatedAt: "2023-10-22 14:20",
      properties: 4, events: 2, services: 1
    },
    { 
      id: "SOS_Button", 
      name: "一键紧急呼叫器", 
      status: "草稿", 
      desc: "便携式紧急呼叫按钮，支持挂绳或固定安装，低功耗持久续航。", 
      protocol: "Zigbee", 
      nodeType: "网关子设备", 
      updatedAt: "2023-10-20 09:15",
      properties: 1, events: 1, services: 0
    },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">IoT设备接入网关与物模型中台</h2>
          <p className="text-slate-500 text-sm mt-1">统一定义设备能力（属性、事件、服务），并纳管底层接入协议</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            <Plus className="w-4 h-4" /> 新建设备模型
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-6 shrink-0">
        <button 
          onClick={() => setActiveTab('models')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'models' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          抽象物模型中心 (Thing Models)
        </button>
        <button 
          onClick={() => setActiveTab('gateways')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'gateways' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          软网关与边缘服务 (Edge & Gateways)
        </button>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Left Column: Models List */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-100 flex gap-4 shrink-0">
              <div className="relative flex-1">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input
                   type="text"
                   placeholder="搜索模型名称或标识符..."
                   className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
                 />
              </div>
              <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-300 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition">
                 <Filter className="w-4 h-4" /> 筛选类型
              </button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {catalogs.map((catalog, idx) => (
                 <div key={idx} className="border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all bg-white relative">
                    <div className="flex items-start gap-4 mb-3">
                       <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Cube className="w-6 h-6" />
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="text-lg font-bold text-slate-800">{catalog.name}</h3>
                             <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border ${catalog.status === '草稿' ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-emerald-600 border-emerald-200 bg-emerald-50'}`}>
                                {catalog.status}
                             </span>
                          </div>
                          <div className="text-sm font-mono text-slate-500">{catalog.id}</div>
                       </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-4">{catalog.desc}</p>
                    
                    {(catalog.properties > 0 || catalog.events > 0 || catalog.services > 0) && (
                       <div className="flex mb-4 py-3 border-y border-slate-100">
                          <div className="flex-1 text-center border-r border-slate-100">
                             <div className="text-xs text-slate-500 mb-1">遥测属性</div>
                             <div className="font-bold text-blue-600 text-lg">{catalog.properties} <span className="text-xs font-normal text-slate-500">个</span></div>
                          </div>
                          <div className="flex-1 text-center border-r border-slate-100">
                             <div className="text-xs text-slate-500 mb-1">事件(告警/信息)</div>
                             <div className="font-bold text-amber-600 text-lg">{catalog.events} <span className="text-xs font-normal text-slate-500">个</span></div>
                          </div>
                          <div className="flex-1 text-center">
                             <div className="text-xs text-slate-500 mb-1">服务/指令执行</div>
                             <div className="font-bold text-emerald-600 text-lg">{catalog.services} <span className="text-xs font-normal text-slate-500">个</span></div>
                          </div>
                       </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-slate-500">
                       <div className="flex gap-4">
                          <span className="flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5 text-slate-400" /> 访问协议: {catalog.protocol}</span>
                          <span className="flex items-center gap-1.5"><Cube className="w-3.5 h-3.5 text-slate-400" /> 节点类型: {catalog.nodeType}</span>
                       </div>
                       <div className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-slate-400" /> 更新于 {catalog.updatedAt}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* Right Column: Info Panel */}
        <div className="w-96 shrink-0 flex flex-col gap-6">
           <Card className="border border-slate-200 shadow-sm bg-slate-50/50 flex-1">
              <CardContent className="p-6">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-emerald-600" />
                    什么是物模型？
                 </h3>
                 <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    物模型是对物理实体（如电表、摄像头）的数字化抽象映射。它通过标准化的格式定义了设备具备的特征和能力。
                 </p>
                 
                 <div className="space-y-4 mb-6">
                    <div className="pl-4 border-l-2 border-blue-600">
                       <div className="font-bold text-slate-800 text-sm mb-1">属性 (Properties)</div>
                       <div className="text-xs text-slate-600 leading-relaxed">设备运行时的状态变量，如环境温度、电量、开门状态。</div>
                    </div>
                    <div className="pl-4 border-l-2 border-emerald-600">
                       <div className="font-bold text-slate-800 text-sm mb-1">事件 (Events)</div>
                       <div className="text-xs text-slate-600 leading-relaxed">设备主动上报的特定情况，如高温告警、开门超时、烟雾探测。</div>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-600">
                       <div className="font-bold text-slate-800 text-sm mb-1">服务 (Services)</div>
                       <div className="text-xs text-slate-600 leading-relaxed">可由云端向下发起的控制指令，如远程抬杆、拉闸断电、下发人脸。</div>
                    </div>
                 </div>

                 <p className="text-xs text-slate-500 leading-relaxed mb-8">
                    通过物模型，上层业务系统（如大屏、工单）可以对底层设备进行解耦操作，无需关心具体的通信协议细节。
                 </p>

                 <div className="border-t border-slate-200 pt-6">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                       <Share2 className="w-4 h-4 text-blue-600" />
                       标准模型库 (145个)
                    </h4>
                    <div className="space-y-2">
                       <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-300 transition-colors">
                          摄像头标准模型 <PlusCircle className="w-4 h-4 text-slate-400" />
                       </button>
                       <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-300 transition-colors">
                          电表标准模型 <PlusCircle className="w-4 h-4 text-slate-400" />
                       </button>
                       <button className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-blue-300 transition-colors">
                          网关标准模型 <PlusCircle className="w-4 h-4 text-slate-400" />
                       </button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

