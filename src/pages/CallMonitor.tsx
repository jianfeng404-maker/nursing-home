import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Phone, Users, Clock, History, UserPlus, PhoneCall, PhoneOff, Mic, MicOff, User, PhoneIncoming, FileText, PauseCircle, PhoneForwarded, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

export function CallMonitor() {
  const [status, setStatus] = useState<'idle' | 'ringing' | 'connected' | 'wrapup'>('idle');
  const [caller, setCaller] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Simulate an incoming call
  const triggerIncomingCall = () => {
    setStatus('ringing');
    setCaller({
      phone: "138-0013-8000",
      type: "家属来电",
      name: "张建国",
      relation: "长者 张明宇(A101) 之子",
      history: 12,
      lastCall: "2天前"
    });
  };

  useEffect(() => {
    let timer: any;
    if (status === 'connected') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">来电弹屏与座席接入</h2>
          <p className="text-slate-500 text-sm mt-1">处理客户咨询、投诉、报警等各个渠道接入的统一呼叫中心任务</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1.5 shadow-sm mr-2">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-sm font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                在线 (空闲)
             </div>
             <button className="px-3 py-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium transition">小休</button>
             <button className="px-3 py-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md text-sm font-medium transition">离线</button>
          </div>
          <button onClick={triggerIncomingCall} disabled={status !== 'idle'} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            <PhoneIncoming className="w-4 h-4" /> 模拟外部来电
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Left Col: CTI Panel */}
        <div className="w-80 shrink-0 flex flex-col gap-6">
           {/* Dialer / State Card */}
           <Card className={`border shadow-sm flex-1 max-h-[500px] flex flex-col transition-all duration-300 ${status === 'ringing' ? 'border-amber-400 shadow-amber-200/50' : status === 'connected' ? 'border-emerald-400 shadow-emerald-200/50' : 'border-slate-200'}`}>
              <CardContent className="p-6 flex-1 flex flex-col">
                 <div className="text-center mb-6">
                    <h3 className="font-bold text-slate-800 text-lg mb-1">座席终端 (001)</h3>
                    <div className="text-sm font-mono text-slate-500">Ext: 8001</div>
                 </div>

                 {status === 'idle' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                       <Phone className="w-16 h-16 mb-4 opacity-20" strokeWidth={1} />
                       <p className="text-sm">等待来电...</p>
                    </div>
                 )}

                 {status === 'ringing' && caller && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 zoom-in-95">
                       <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 relative">
                          <span className="absolute w-full h-full rounded-full bg-amber-400 opacity-20 animate-ping"></span>
                          <PhoneIncoming className="w-10 h-10 text-amber-600 animate-pulse" />
                       </div>
                       <h3 className="text-2xl font-bold tracking-wider text-slate-800 mb-1 font-mono">{caller.phone}</h3>
                       <p className="text-sm font-medium text-amber-600">{caller.type}</p>
                       <p className="text-xs text-slate-500 mt-1">来电振铃中...</p>
                    </div>
                 )}

                 {status === 'connected' && caller && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 zoom-in-95">
                       <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 relative drop-shadow-sm">
                          <PhoneCall className="w-8 h-8 text-emerald-600" />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                             <Mic className="w-3 h-3 text-white" />
                          </div>
                       </div>
                       <h3 className="text-2xl font-bold tracking-wider text-emerald-700 mb-1 font-mono">{caller.phone}</h3>
                       <p className="text-3xl font-mono font-bold text-slate-800 tracking-widest">{formatTime(callDuration)}</p>
                    </div>
                 )}

                 {status === 'wrapup' && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in slide-in-from-bottom-4 zoom-in-95">
                       <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-8 h-8 text-blue-500" />
                       </div>
                       <h3 className="text-lg font-bold text-slate-800 mb-1">正在处理话后工作</h3>
                       <p className="text-sm text-slate-500 mb-4">请填写服务小结</p>
                    </div>
                 )}

                 {/* CTI Controls */}
                 <div className="pt-6 border-t border-slate-100 mt-auto">
                    {status === 'idle' && (
                       <div className="relative">
                          <input type="text" className="w-full text-center text-lg tracking-wider font-mono border-b border-slate-200 py-2 focus:outline-none focus:border-indigo-500" placeholder="拨号..." />
                          <button className="mt-4 w-full py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-sm shadow-emerald-200 hover:bg-emerald-600 transition flex items-center justify-center gap-2">
                             <Phone className="w-5 h-5" /> 呼出
                          </button>
                       </div>
                    )}

                    {status === 'ringing' && (
                       <div className="flex gap-4">
                          <button onClick={() => setStatus('idle')} className="flex-1 py-3 bg-rose-100 text-rose-600 rounded-xl font-bold hover:bg-rose-200 transition">拒接</button>
                          <button onClick={() => setStatus('connected')} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-sm hover:bg-emerald-600 transition flex items-center justify-center gap-2">接听</button>
                       </div>
                    )}

                    {status === 'connected' && (
                       <div className="space-y-4">
                         <div className="grid grid-cols-3 gap-2">
                            <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition">
                               <MicOff className="w-5 h-5" />
                               <span className="text-[10px] font-medium">静音</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition">
                               <PauseCircle className="w-5 h-5" />
                               <span className="text-[10px] font-medium">保持</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition">
                               <PhoneForwarded className="w-5 h-5" />
                               <span className="text-[10px] font-medium">转接</span>
                            </button>
                         </div>
                         <button onClick={() => setStatus('wrapup')} className="w-full py-3 bg-rose-500 text-white rounded-xl font-bold shadow-sm shadow-rose-200 hover:bg-rose-600 transition flex items-center justify-center gap-2">
                            <PhoneOff className="w-5 h-5" /> 挂断呼叫
                         </button>
                       </div>
                    )}

                    {status === 'wrapup' && (
                       <button onClick={() => {setStatus('idle'); setCaller(null);}} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-sm shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5" /> 完成小结并就绪
                       </button>
                    )}
                 </div>
              </CardContent>
           </Card>

           {/* Queue info */}
           <Card className="border-none shadow-sm bg-slate-50/50">
             <CardContent className="p-4">
                <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-slate-400" /> 排队与座席状态</h4>
                <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">当前排队人数</span>
                      <span className="font-bold text-amber-600">0</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">今日已接听</span>
                      <span className="font-bold text-slate-800">45</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">平均通话时长</span>
                      <span className="font-bold text-slate-800">02:30</span>
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>

        {/* Right Col: CRM Screen Pop */}
        <Card className="flex-1 border border-slate-200 shadow-sm overflow-hidden flex flex-col bg-slate-50">
           {status !== 'idle' && caller ? (
             <div className="flex-1 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
               {/* 弹屏顶导: 客户识别信息 */}
               <div className="bg-white p-6 border-b border-slate-200">
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                          <User className="w-8 h-8" />
                       </div>
                       <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-slate-800">{caller.name}</h2>
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-medium">{caller.type}</span>
                            <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded font-medium">{caller.relation}</span>
                          </div>
                          <div className="text-slate-500 text-sm font-mono flex items-center gap-4 mt-2">
                             <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {caller.phone}</div>
                             <div className="flex items-center gap-1.5"><History className="w-4 h-4" /> 历史来电: {caller.history}次</div>
                             <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 上次来电: {caller.lastCall}</div>
                          </div>
                       </div>
                     </div>
                     <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition border border-slate-200">
                        查看完整长者档案
                     </button>
                  </div>
               </div>

               {/* 业务操作区 & AI实录多栏 */}
               <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 p-6 overflow-y-auto border-r border-slate-200">
                     <h3 className="font-bold text-slate-800 mb-4 text-lg">快速业务办理</h3>
                     <div className="flex flex-col gap-3 mb-8">
                       <button className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-blue-400 hover:shadow-md transition group">
                          <h4 className="font-bold text-blue-700 mb-1 group-hover:text-blue-800">创建工单 / 投诉报修</h4>
                          <p className="text-xs text-slate-500">为客户建立追踪工单，派发至相关部门</p>
                       </button>
                       <button className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-indigo-400 hover:shadow-md transition group">
                          <h4 className="font-bold text-indigo-700 mb-1 group-hover:text-indigo-800">转接照护员 / 护士台</h4>
                          <p className="text-xs text-slate-500">将电话移交给具体执行人员</p>
                       </button>
                       <button className="bg-white p-3 rounded-xl border border-slate-200 text-left hover:border-emerald-400 hover:shadow-md transition group">
                          <h4 className="font-bold text-emerald-700 mb-1 group-hover:text-emerald-800">查询健康数据 / 报表</h4>
                          <p className="text-xs text-slate-500">回答家属关于长者近况的咨询</p>
                       </button>
                     </div>

                     <h3 className="font-bold text-slate-800 mb-4 text-lg">呼叫小结 (服务工单)</h3>
                     <div className="bg-white p-4 rounded-xl border border-slate-200">
                       <div className="grid grid-cols-2 gap-4 mb-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">呼叫类型 *</label>
                            <select className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                               <option>日常咨询</option>
                               <option>投诉建议</option>
                               <option>紧急报警</option>
                               <option>请假/退住</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">关联长者</label>
                            <input type="text" disabled value="张明宇(A101)" className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-md px-3 py-2 text-sm" />
                         </div>
                       </div>
                       <div>
                          <div className="flex justify-between items-center mb-1">
                             <label className="block text-sm font-medium text-slate-700">沟通纪要 *</label>
                             <button className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1">
                               <Sparkles className="w-3 h-3" /> 一键提取总结
                             </button>
                          </div>
                          <textarea rows={4} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="点击右上角使用AI从实时通话中提取纪要，或手动输入..."></textarea>
                       </div>
                     </div>
                  </div>

                  {/* 中间区：AI实时语音转写及质检 */}
                  <div className="w-[320px] bg-[#f8fafc] border-r border-slate-200 flex flex-col pt-1">
                     <div className="px-5 py-3 border-b border-indigo-100 flex items-center justify-between bg-indigo-50/50">
                        <h3 className="font-bold text-indigo-800 flex items-center gap-2">
                           <Mic className="w-4 h-4" /> AI 实时旁听与品控
                        </h3>
                        {status === 'connected' ? (
                           <span className="flex h-2 w-2 relative">
                             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                           </span>
                        ) : (
                           <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                        )}
                     </div>
                     <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs">
                        {status === 'idle' || status === 'ringing' ? (
                           <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 opacity-60">
                              <MicOff className="w-8 h-8" />
                              <p>等待通话接通注入语音流...</p>
                           </div>
                        ) : (
                           <>
                             <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm self-start max-w-[90%]">
                                <span className="font-bold text-amber-600 block mb-1">客户:</span>
                                <p className="text-slate-600 leading-relaxed">喂你好，那个张明宇老人的被子感觉有点薄了，昨天他说晚上有点凉。</p>
                             </div>
                             <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 shadow-sm self-end max-w-[90%]">
                                <span className="font-bold text-indigo-700 block mb-1">座席 (您):</span>
                                <p className="text-slate-700 leading-relaxed">张先生您好，我是本站客服。给您添麻烦了，这几天寒流降温，我们记录下来马上安排本楼栋护工去给老爷子加一床冬被。</p>
                             </div>
                             <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm self-start max-w-[90%]">
                                <span className="font-bold text-amber-600 block mb-1">客户:</span>
                                <p className="text-slate-600 leading-relaxed">好的好的，另外就是下个月的账单你们出了没有？</p>
                             </div>
                             <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 shadow-sm self-end max-w-[90%]">
                                <span className="font-bold text-indigo-700 block mb-1">座席 (您):</span>
                                <p className="text-slate-700 leading-relaxed">已经出了，稍后系统会给您微信和短信发送推送，您可以直接在小程序里面支付的。</p>
                             </div>
                             <div className="flex items-center gap-2 mt-2 ml-1">
                                <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                                <span className="text-slate-400">正在实时转译...</span>
                             </div>
                           </>
                        )}
                     </div>
                     <div className="p-4 border-t border-slate-100 bg-white">
                        <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> AI 服务规范质检
                        </h4>
                        <div className="space-y-1.5">
                           <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded text-xs font-medium">
                              <span>开场尊称及情绪安抚</span>
                              <span className="text-emerald-500 font-black">✓ PASS</span>
                           </div>
                           <div className="flex justify-between items-center bg-slate-100 text-slate-600 px-3 py-1.5 rounded text-xs font-medium">
                              <span>主动询问其他需求</span>
                              <span className="text-slate-400">待检测...</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  
                  {/* 右侧互动历史 */}
                  <div className="w-72 bg-white border-l border-slate-200 flex flex-col">
                     <h3 className="font-bold text-slate-800 p-4 border-b border-slate-100 flex items-center gap-2">
                        <History className="w-4 h-4 text-slate-400" /> 近期互动记录
                     </h3>
                     <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <div className="relative pl-4 border-l-2 border-slate-200 pb-4">
                           <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-1.5 ring-4 ring-white"></div>
                           <div className="text-xs text-slate-500 mb-1">2026-04-26 14:20</div>
                           <div className="font-medium text-sm text-slate-800">呼入电话：询问饮食情况</div>
                           <div className="text-xs text-slate-500 mt-1 truncate">告知长者今日食欲不错，正常就餐。</div>
                        </div>
                        <div className="relative pl-4 border-l-2 border-slate-200 pb-4">
                           <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[5px] top-1.5 ring-4 ring-white"></div>
                           <div className="text-xs text-slate-500 mb-1">2026-04-20 09:15</div>
                           <div className="font-medium text-sm text-slate-800">院内看望</div>
                           <div className="text-xs text-slate-500 mt-1 truncate">登记探访记录，共停留2小时。</div>
                        </div>
                        <div className="relative pl-4 border-l-2 border-slate-200">
                           <div className="absolute w-2 h-2 bg-slate-300 rounded-full -left-[5px] top-1.5 ring-4 ring-white"></div>
                           <div className="text-xs text-slate-500 mb-1">2026-04-10 11:30</div>
                           <div className="font-medium text-sm text-slate-800">呼出电话：续费提醒</div>
                           <div className="text-xs text-slate-500 mt-1 truncate">下月床位费账单已出，提醒家属缴费。</div>
                        </div>
                     </div>
                  </div>
               </div>
             </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
                   <PhoneIncoming className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">等待外部来电</h3>
                <p className="text-slate-500 mt-1 max-w-sm text-center text-sm">当有电话呼入时，此处将自动弹出来电者的基本信息及过往互动记录，帮助您提供个性化服务。</p>
             </div>
           )}
        </Card>
      </div>

    </div>
  );
}
