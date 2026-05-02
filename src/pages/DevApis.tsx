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
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_elder_profile</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">长者基础档案</td>
                        <td className="py-4 px-4 text-slate-500">name, id_card, bed_id, care_level_id, status</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">低写高读</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_care_level_def</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">全局护理等级及范围定义</td>
                        <td className="py-4 px-4 text-slate-500">level_id, name, desc, base_price, color</td>
                        <td className="py-4 px-4 text-blue-600 font-medium text-xs">初始化后只读</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_care_service_sop</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">服务项目体系与SOP规程库</td>
                        <td className="py-4 px-4 text-slate-500">svc_id, act_name, category, default_freq, <br/>included_levels(JSON), sop_steps(JSON)</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">低频维护读多</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_care_plan</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">个案照护长线干预拆解计划</td>
                        <td className="py-4 px-4 text-slate-500">plan_id, elder_id, base_level_id, goal, next_review</td>
                        <td className="py-4 px-4 text-emerald-600 font-medium text-xs">低写高读</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_care_task</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">日常护理工单 (每日派发实例)</td>
                        <td className="py-4 px-4 text-slate-500">task_id, elder_id, ref_svc_id, plan_time, status</td>
                        <td className="py-4 px-4 text-rose-600 font-medium text-xs">高频写/并发争抢</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_finance_bill</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">财务月度账单</td>
                        <td className="py-4 px-4 text-slate-500">elder_id, month, base_fee, extra_fee, is_paid</td>
                        <td className="py-4 px-4 text-amber-600 font-medium text-xs">月度批量写</td>
                     </tr>
                     <tr className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-4 px-4 font-mono font-bold text-indigo-600">t_iot_alert</td>
                        <td className="py-4 px-4 text-slate-700 font-medium">物联网安全告警</td>
                        <td className="py-4 px-4 text-slate-500">device_id, type(sos/fall), risk_level, handle_state</td>
                        <td className="py-4 px-4 text-rose-600 font-medium text-xs">极高扫频</td>
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
                        <code className="text-sm font-bold text-slate-700">/api/v1/elders/&lbrace;id&rbrace;/care-tasks</code>
                     </div>
                     <p className="text-slate-500 text-sm">生成新的护理工单（结合基础照护计划中的日历自动分解）。</p>
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
      </div>
    </div>
  );
}
