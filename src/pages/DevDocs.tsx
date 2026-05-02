import { Layers, Cuboid, Settings2, LayoutTemplate, Database, Server, Smartphone, MonitorSmartphone, Code2, Component, Box, Cloud, Shield, Activity } from "lucide-react";

export function DevDocs() {
  return (
    <div className="animate-in fade-in duration-500 pb-12 w-full max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-2">
         <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">开发者手册与架构说明</h2>
            <span className="text-sm font-medium text-slate-500 mt-1 block">系统架构图、功能全视图与组件目录库</span>
         </div>
         <div className="ml-auto flex gap-2">
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-1.5 shadow-sm">
               <Code2 className="w-4 h-4" /> v1.0.0 (开发版)
            </span>
         </div>
      </div>

      <div className="space-y-8">
         {/* System Architecture */}
         <section>
            <div className="flex items-center gap-2 mb-4">
               <Server className="w-6 h-6 text-indigo-600" />
               <h3 className="text-xl font-black text-slate-800">1. 技术系统架构图 (详细版)</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
               
               <div className="flex flex-col lg:flex-row gap-6 relative">
                  {/* Presentation Layer */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100 relative z-10 shadow-sm flex flex-col items-center">
                     <div className="w-full font-bold text-slate-700 text-sm mb-4 pb-2 border-b border-slate-200 flex items-center justify-center gap-2 uppercase tracking-wide">
                        <MonitorSmartphone className="w-4 h-4" /> 客户端层 (Presentation)
                     </div>
                     <div className="space-y-4 w-full">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3">
                           <div className="font-bold text-slate-800 text-sm flex justify-between items-center">
                              <span>Web 管理端后台</span>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">React 18</span>
                           </div>
                           <div className="text-[11px] text-slate-500 mt-1">护士站排班 / 财务报表 / 房间床位管理 / 全局SOP规程管理</div>
                           <div className="flex gap-1 mt-2 text-[10px] text-indigo-500 font-mono">
                              <span className="bg-indigo-50 px-1 rounded">Zustand</span>
                              <span className="bg-indigo-50 px-1 rounded">Tailwind</span>
                           </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3">
                           <div className="font-bold text-slate-800 text-sm flex justify-between items-center">
                              <span>移动端 (小程序/H5)</span>
                              <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Mobile</span>
                           </div>
                           <div className="text-[11px] text-slate-500 mt-1">护工日常扫码打卡 / 异常事件快反 / 家属端探视跟进</div>
                        </div>

                        <div className="bg-white border text-emerald-900 border-emerald-200 shadow-sm rounded-lg p-3 bg-emerald-50/30">
                           <div className="font-bold text-emerald-800 text-sm flex justify-between items-center">
                              <span>安防物联大屏端</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded">TV/Web</span>
                           </div>
                           <div className="text-[11px] text-emerald-600 mt-1">机构实时全景可视化大屏 / 离床防跌倒告警红转地图</div>
                        </div>
                     </div>
                  </div>

                  {/* Connecting Arrows hidden on mobile */}
                  <div className="hidden lg:flex flex-col justify-center items-center px-1">
                     <div className="text-[10px] text-slate-400 font-bold mb-1 text-center w-full">REST / GQL</div>
                     <div className="w-12 h-6 flex justify-between px-1 bg-slate-100 rounded-sm items-center">
                       <span className="text-slate-400">&larr;</span><span className="text-slate-400">&rarr;</span>
                     </div>
                     <div className="text-[10px] text-emerald-500 font-bold mt-1 text-center w-full">WSS (实时)</div>
                  </div>

                  {/* Business Logic Layer */}
                  <div className="flex-[1.5] bg-indigo-50/50 rounded-xl p-5 border border-indigo-100 relative z-10 shadow-sm flex flex-col items-center">
                     <div className="w-full font-bold text-indigo-800 text-sm mb-4 pb-2 border-b border-indigo-200 flex items-center justify-center gap-2 uppercase tracking-wide">
                        <Layers className="w-4 h-4" /> 业务与应用服务层 (Microservices / BFF)
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                        {/* API Gateway */}
                        <div className="col-span-1 md:col-span-2 bg-indigo-100 outline-dashed outline-2 outline-indigo-200 rounded-lg p-2 text-center text-[11px] font-bold text-indigo-700 flex items-center justify-center gap-2 mb-1">
                           <Shield className="w-3.5 h-3.5" /> API 网关 / 路由及鉴权
                        </div>

                        <div className="bg-white border border-indigo-200 shadow-sm rounded-lg p-3">
                           <div className="font-bold text-indigo-900 text-sm">护理执行与SOP引擎</div>
                           <div className="text-[10px] text-indigo-600 mt-1 leading-relaxed">
                              • 等级定义关联服务矩阵 <br/>
                              • 个案照护长期计划生成 <br/>
                              • 定时生成工单推送到人
                           </div>
                        </div>

                        <div className="bg-white border border-indigo-200 shadow-sm rounded-lg p-3">
                           <div className="font-bold text-indigo-900 text-sm">计费与财务系统</div>
                           <div className="text-[10px] text-indigo-600 mt-1 leading-relaxed">
                              • 押金/入住预交款台账 <br/>
                              • 周期性杂费自动化出账 <br/>
                              • 水电气接口自动化抄表计费
                           </div>
                        </div>

                        <div className="bg-white border border-emerald-200 shadow-sm rounded-lg p-3 bg-emerald-50/50">
                           <div className="font-bold text-emerald-900 text-sm">IoT 与事件预警总线</div>
                           <div className="text-[10px] text-emerald-600 mt-1 leading-relaxed">
                              • 硬件TCP/MQTT长连接解析 <br/>
                              • 规则引擎触发预警(越界等) <br/>
                              • 消息推送到大屏及移动端
                           </div>
                        </div>

                        <div className="bg-white border border-indigo-200 shadow-sm rounded-lg p-3">
                           <div className="font-bold text-indigo-900 text-sm">机构基础运营支撑</div>
                           <div className="text-[10px] text-indigo-600 mt-1 leading-relaxed">
                              • 床位空间拓扑管理 <br/>
                              • 长者及家属CRM档案库 <br/>
                              • 库房耗材进销存(ERP)
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Connecting Arrows hidden on mobile */}
                  <div className="hidden lg:flex flex-col justify-center items-center px-1">
                     <div className="text-[10px] text-slate-400 font-bold mb-1 text-center w-full">ORM</div>
                     <div className="w-12 h-6 flex justify-between px-1 bg-slate-100 rounded-sm items-center">
                       <span className="text-slate-400">&larr;</span><span className="text-slate-400">&rarr;</span>
                     </div>
                  </div>

                  {/* Data Layer */}
                  <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-100 relative z-10 shadow-sm flex flex-col items-center">
                     <div className="w-full font-bold text-slate-700 text-sm mb-4 pb-2 border-b border-slate-200 flex items-center justify-center gap-2 uppercase tracking-wide">
                        <Database className="w-4 h-4" /> 混合数据底座 (Data Layer)
                     </div>
                     <div className="space-y-4 w-full">
                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 flex gap-3 items-center">
                           <div className="w-10 h-10 rounded bg-blue-50 text-blue-500 flex justify-center items-center flex-shrink-0">
                              <Database className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-slate-800 text-sm">关系型核心库</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">MySQL / PostgreSQL<br/>账单, 档案, 权限, 核心订单</div>
                           </div>
                        </div>
                        
                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 flex gap-3 items-center">
                           <div className="w-10 h-10 rounded bg-purple-50 text-purple-500 flex justify-center items-center flex-shrink-0">
                              <Activity className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-slate-800 text-sm">时序及文档数据库</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">InfluxDB / MongoDB<br/>硬件连续生理体征数据记录</div>
                           </div>
                        </div>

                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg p-3 flex gap-3 items-center">
                           <div className="w-10 h-10 rounded bg-rose-50 text-rose-500 flex justify-center items-center flex-shrink-0">
                              <Cuboid className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-slate-800 text-sm">分布式缓存/队列</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">Redis + Kafka / RabbitMQ<br/>高速派单队列, 高频状态查询</div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Business Functional Modules */}
         <section>
            <div className="flex items-center gap-2 mb-4">
               <LayoutTemplate className="w-6 h-6 text-emerald-600" />
               <h3 className="text-xl font-black text-slate-800">2. 全业务板块与功能矩阵</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 border-b border-slate-100">
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 block"></span> 客户与合同中心</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li>• 营销接待与跟进管线 (CRM)</li>
                        <li>• 试住/正式入住评估体系</li>
                        <li>• 周期合同与计费引擎管理</li>
                        <li>• 长者个人综合档案 / 家属绑定</li>
                     </ul>
                  </div>
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 block"></span> 个案照护系统 (核心)</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li>• 定义看护全局级别与服务标准 (SOP管理)</li>
                        <li>• 根据护理等级模板自生成个人照护计划与执行日历</li>
                        <li>• 护士站全景排班及护工移动端扫码打卡确认</li>
                        <li>• 长案风险评估与能力动态降级/升级建议</li>
                     </ul>
                  </div>
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500 block"></span> 设施安防与物联中台</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li>• AI监控/智能床垫/毫米波雷达设备接入</li>
                        <li>• 呼叫器事件中心与响应超时升级机制</li>
                        <li>• 全院安防大屏告警联动</li>
                     </ul>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500 block"></span> 智能财务与结算流水</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li>• 财务大盘中台与收支分析</li>
                        <li>• 费用标准与自定义项目库</li>
                        <li>• 长者月度大账单自动化出账核对</li>
                        <li>• 押金备用金流水记录</li>
                     </ul>
                  </div>
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-500 block"></span> 后勤库房与物资网络</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li>• 长者餐饮与流质/特殊配方饮食库</li>
                        <li>• 医药物资及日常耗材进销存记录</li>
                        <li>• 即时水电气按量抄表收费</li>
                        <li>• 维修巡检工作流</li>
                     </ul>
                  </div>
                  <div className="p-6">
                     <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500 block"></span> 核心运营数据罗盘</h4>
                     <ul className="space-y-2 text-sm text-slate-600">
                        <li>• 入住率/转化率漏斗报表</li>
                        <li>• 各部门人效/服务满意度排行分析</li>
                        <li>• 异常事件趋势回溯</li>
                     </ul>
                  </div>
               </div>
            </div>
         </section>

         {/* UI Components Library */}
         <section>
            <div className="flex items-center gap-2 mb-4">
               <Component className="w-6 h-6 text-fuchsia-600" />
               <h3 className="text-xl font-black text-slate-800">3. 沉淀及复用基础前端组件库</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
               <p className="text-slate-500 text-sm mb-6">系统基于 Tailwind 提取了一系列高频使用、高度封装的业务无关层组件用于快速搭建前端页面。</p>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                     { name: "Button", desc: "主按钮/次按钮/幽灵按钮", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Card", desc: "带阴影、边框的卡片容器", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Input & Select", desc: "统一样式的表单输入控件簇", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Dialog & Modal", desc: "操作确认及侧边拉出弹窗", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Table & DataGrid", desc: "基础数据二维表呈现及分页", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Tabs", desc: "平滑切换的头部导航选项卡", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Badge & Tag", desc: "状态强调及短文本分类标签", icon: <Box className="w-4 h-4 text-slate-400" /> },
                     { name: "Avatars", desc: "老人、员工圆形头像缩略位", icon: <Box className="w-4 h-4 text-slate-400" /> }
                  ].map(c => (
                     <div key={c.name} className="border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl p-4 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-1.5">
                           {c.icon}
                           <span className="font-bold text-slate-700 text-sm font-mono">{c.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 leading-relaxed">{c.desc}</span>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
