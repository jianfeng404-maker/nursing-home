import { Database, FileJson, Network, Braces } from "lucide-react";

export function DevApis() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 w-full max-w-6xl mx-auto">
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl text-white shadow-md">
         <h2 className="text-3xl font-black tracking-tight mb-2">API 接口与数据字典</h2>
         <p className="text-blue-100/80 font-medium">后端微服务接口规范、核心领域模型及数据流转约定</p>
      </div>

      <div className="space-y-6">
         {/* Database Models */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
               <Database className="w-5 h-5 text-indigo-600" />
               <h3 className="font-black text-slate-800 text-lg">核心领域实体模型 (Entity Model)</h3>
            </div>
            <div className="p-5 overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                     <tr className="border-b border-slate-200 text-slate-500 text-sm">
                        <th className="pb-3 px-4 font-bold">表名(实体)</th>
                        <th className="pb-3 px-4 font-bold">业务含义</th>
                        <th className="pb-3 px-4 font-bold">核心字段/关联</th>
                        <th className="pb-3 px-4 font-bold">读写频率</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_elder</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">长者基础档案</td>
                        <td className="py-4 px-4 text-slate-500">id, name, room, careLevel, status</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">低写高读</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_staff</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">员工及架构信息</td>
                        <td className="py-4 px-4 text-slate-500">id, name, role, department, position</td>
                        <td className="py-4 px-4 text-blue-600 font-medium text-xs">维护读多</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_nursing_station</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">护理站设置</td>
                        <td className="py-4 px-4 text-slate-500">id, name, buildings, floors, manager, assignedStaff</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">低写高读</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_admission_record</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">入住与试住全周期</td>
                        <td className="py-4 px-4 text-slate-500">id, name, stage, tasks, deposit, fee</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">周期写跟进多</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_task</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">全局日常任务及护理工单</td>
                        <td className="py-4 px-4 text-slate-500">id, name, elder, type, status, time, fee</td>
                        <td className="py-4 px-4 text-rose-600 font-medium text-xs">高频写与并发推单</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_bill_record</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">核心账单与费用核算</td>
                        <td className="py-4 px-4 text-slate-500">id, elder, period, total, items(JSON), deductions</td>
                        <td className="py-4 px-4 text-amber-600 font-medium text-xs">月结计算/事件扣费</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_clinical_record</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">看诊及查房医疗档案</td>
                        <td className="py-4 px-4 text-slate-500">id, elder, time, doctor, type, notes</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">跟进诊断后写入</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_rehab_plan</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">康复理疗方案及进度</td>
                        <td className="py-4 px-4 text-slate-500">id, elder, desc, therapist, progress</td>
                        <td className="py-4 px-4 text-blue-600 font-medium text-xs">康复期高频跟进</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_inventory</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">物资库存与消耗</td>
                        <td className="py-4 px-4 text-slate-500">id, name, warehouse, stock, unit, safeStock</td>
                        <td className="py-4 px-4 text-amber-600 font-medium text-xs">出入库/领用结转</td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>

         {/* API Standard */}
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
               <Network className="w-5 h-5 text-emerald-600" />
               <h3 className="font-black text-slate-800 text-lg">RESTful 接口规范</h3>
            </div>
            <div className="p-5 md:p-8 flex flex-col lg:flex-row gap-8">
               <div className="flex-1 space-y-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                     <div className="flex gap-2 items-center mb-3">
                        <span className="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-xs">GET</span>
                        <code className="text-sm font-bold text-slate-700">/api/v1/elders</code>
                     </div>
                     <p className="text-slate-500 text-sm">查询长者列表（支持按楼层、护理等级、状态的复合筛选和分页）。</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                     <div className="flex gap-2 items-center mb-3">
                        <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs">POST</span>
                        <code className="text-sm font-bold text-slate-700">/api/v1/tasks/dispatch</code>
                     </div>
                     <p className="text-slate-500 text-sm">分发护理工单、代理服药单（含代收费生成账单的事务操作）。</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                     <div className="flex gap-2 items-center mb-3">
                        <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded text-xs">POST</span>
                        <code className="text-sm font-bold text-slate-700">/api/v1/bills/charge</code>
                     </div>
                     <p className="text-slate-500 text-sm">自动记录账单流水，接受退费或消耗性消费(如材料零购，投诉补偿金，请假退费)。</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
                     <div className="flex gap-2 items-center mb-3">
                        <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-xs">WS</span>
                        <code className="text-sm font-bold text-slate-700">wss://api/v1/stream/alerts</code>
                     </div>
                     <p className="text-slate-500 text-sm">WebSocket 长连接监听，用于下发 IoT 设备的紧急报警及护士站大屏推送。</p>
                  </div>
               </div>

               <div className="flex-1 bg-slate-900 rounded-xl p-5 shadow-inner text-slate-300 font-mono text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-3 text-slate-400 border-b border-slate-700 pb-2">
                     <Braces className="w-4 h-4" /> <span>全局统一响应体</span>
                  </div>
                  <pre className="mt-2 text-[13px] leading-relaxed">
{`{
  "code": 200,      // 业务状态码
  "message": "ok",  // 错误消息
  "data": {         // 业务承载体
    "list": [...],
    "pagination": {
      "total": 128,
      "page": 1,
      "size": 20
    }
  },
  "traceId": "t_9a8b7c6d5e4f" // 链路追踪
}`}
                  </pre>
               </div>
            </div>
         </div>
         <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
               <FileJson className="w-5 h-5 text-fuchsia-600" />
               <h3 className="font-black text-slate-800 text-lg">Open API 与大模型 (LLM) 接入规范</h3>
            </div>
            <div className="p-5 md:p-8">
               <div className="mb-6">
                  <h4 className="text-md font-bold text-slate-800 mb-2">系统 Open API 开放能力</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                     当前系统设计已支持通过标准化 RESTful / GraphQL 接口对外提供 Open API，供第三方应用、物联网中台或大模型（Agent）调用。
                     核心模块如 "老人档案查询"、"护理工单分发"、"报警流订阅" 的接口均为无状态设计（Stateless），并采用标准的 OAuth 2.0 / JWT 鉴权鉴权机制，只需提供对应用程序进行细粒度授权的 Access Token 即可直接作为工具接口或 Function Calling 的 Target Endpoint 被使用。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                        <div className="font-bold text-slate-700 text-sm mb-1">接口规范性 (Standardization)</div>
                        <p className="text-slate-500 text-xs">通过 OpenAPI Specification (OAS 3.0) 可一键导出接口定义，无需额外适配即可被大模型 Tool 使用。</p>
                     </div>
                     <div className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                        <div className="font-bold text-slate-700 text-sm mb-1">数据内聚性 (Data Cohesion)</div>
                        <p className="text-slate-500 text-xs">长者档案、工单流转、账单费用具有清晰的层级结构（嵌套 JSON），大模型易于理解并抽取实体信息。</p>
                     </div>
                  </div>
               </div>

               <div className="border-t border-slate-100 pt-6">
                  <h4 className="text-md font-bold text-slate-800 mb-2">大模型 (LLM) 应用要求匹配度</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                     本代码库及其前端架构为构建大模型驱动的 AI Native 康养系统铺平了道路，满足了以下关键大模型场景要求：
                  </p>
                  <ul className="space-y-3 text-sm text-slate-600">
                     <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0" />
                        <div><strong className="text-slate-800">Function Calling 及 Agent 化接入：</strong>所有业务动作（如 <code>dispatchTask()</code>，<code>chargeBill()</code>）在逻辑上已经过解耦。可以将这些核心服务暴露给 AI Copilot，让 AI 依据指令直接在系统中创单。</div>
                     </li>
                     <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0" />
                        <div><strong className="text-slate-800">语义检索与总结支撑：</strong>Store 中的全局状态采用扁平及强类型描述，日志流及老人生活记录（护理记录、用药记录、物联网报警）提供了极其丰富的 Context 供基于 RAG（检索增强生成）技术的总结分析。当前系统内嵌的 <code>AI 异常分析</code> 模块已经验证了此数据范式被用于大模型的有效性。</div>
                     </li>
                     <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 mt-1.5 shrink-0" />
                        <div><strong className="text-slate-800">多模态流媒体可拓展性：</strong>通过开放的文件接口与 WebSocket 事件总线，可随时接入语音大模型的实时陪伴、或者是基于摄像头 RTSP 视频流的具身多模态看护大模型监控。</div>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
