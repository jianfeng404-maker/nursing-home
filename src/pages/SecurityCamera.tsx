import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  MonitorPlay,
  AlertTriangle,
  Search,
  Video,
  Maximize2,
  Activity,
  Play,
  AlertCircle,
  X,
  Minimize2,
  Calendar,
  Mic,
  Volume2
} from "lucide-react";
import { toast } from "sonner";

export function SecurityCamera() {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);
  const [intercomCamera, setIntercomCamera] = useState<string | null>(null);
  const [playbackTime, setPlaybackTime] = useState(50);

  const activeFeeds = [
    {
      id: "cam1",
      name: "大厅入口",
      status: "在线",
      aiStatus: "正常",
      alert: null,
    },
    {
      id: "cam2",
      name: "活动室",
      status: "在线",
      aiStatus: "异常",
      alert: "检测到人员疑似跌倒！",
    },
    {
      id: "cam3",
      name: "二楼走道",
      status: "在线",
      aiStatus: "正常",
      alert: null,
    },
    {
      id: "cam4",
      name: "南门围墙",
      status: "在线",
      aiStatus: "警告",
      alert: "人员靠近危险区域",
    },
    {
      id: "cam5",
      name: "食堂后厨",
      status: "在线",
      aiStatus: "正常",
      alert: null,
    },
    {
      id: "cam6",
      name: "停车场",
      status: "在线",
      aiStatus: "正常",
      alert: null,
    },
  ];

  return (
    <div className={`animate-in fade-in duration-500 pb-8 h-full flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-900 p-6 overflow-y-auto' : ''}`}>
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${isFullScreen ? 'text-white' : 'text-slate-800'}`}>
            AI视频监控系统
          </h2>
          <p className={`text-sm mt-1 ${isFullScreen ? 'text-slate-400' : 'text-slate-500'}`}>
            集成院内各区域监控，利用AI行为分析实现跌倒检测与区域徘徊报警。
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-bold transition shadow-sm active:scale-95 ${isFullScreen ? 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700' : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'}`}
          >
            {isFullScreen ? <><Minimize2 className="w-4 h-4" /> 退出大屏</> : <><Maximize2 className="w-4 h-4" /> 投射大屏</>}
          </button>
          <button
            onClick={() => setShowPlaybackModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm active:scale-95"
          >
            <Search className="w-4 h-4" /> 录像回放
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {activeFeeds.map((feed) => (
          <Card
            key={feed.id}
            className={`border overflow-hidden shadow-sm hover:shadow-md transition-all group ${feed.aiStatus === "异常" ? "border-rose-300 ring-1 ring-rose-200" : "border-slate-200"}`}
          >
            {/* Fake Video Feed Area */}
            <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
              {feed.aiStatus === "异常" && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-600/90 text-white text-xs font-bold rounded flex items-center gap-1.5 animate-pulse backdrop-blur-sm z-10">
                  <AlertCircle className="w-3.5 h-3.5" /> {feed.alert}
                </div>
              )}
              {feed.aiStatus === "警告" && (
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500/90 text-white text-xs font-bold rounded flex items-center gap-1.5 backdrop-blur-sm z-10">
                  <AlertTriangle className="w-3.5 h-3.5" /> {feed.alert}
                </div>
              )}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white/80 text-xs font-mono drop-shadow-md bg-black/40 px-1.5 py-0.5 rounded">
                  REC 1080P
                </span>
              </div>

              <div className="text-white/20 group-hover:text-white/40 transition-colors flex flex-col items-center">
                <Video className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium tracking-wide">
                  RTSP FLV STREAM
                </span>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-100 mix-blend-multiply pointer-events-none"></div>
            </div>
            <CardContent className={`p-4 flex justify-between items-center ${isFullScreen ? 'bg-slate-800 text-white border-t border-slate-700' : 'bg-white'}`}>
              <div>
                <h3 className={`font-bold tracking-tight ${isFullScreen ? 'text-white' : 'text-slate-800'}`}>
                  {feed.name}
                </h3>
                <div className="flex gap-3 text-xs mt-1">
                  <span className={isFullScreen ? 'text-slate-400' : 'text-slate-500'}>
                    算法:{" "}
                    <span className="text-blue-500 font-medium">
                      跌倒/离床/闯入
                    </span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIntercomCamera(feed.name)}
                className={`p-2 rounded-lg transition-colors ${isFullScreen ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-700' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                title="双向语音对讲"
              >
                <Activity className="w-5 h-5" />
              </button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Playback Modal */}
      {showPlaybackModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight">历史录像回放检索</h3>
                </div>
              </div>
              <button onClick={() => setShowPlaybackModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-col md:flex-row h-[600px]">
               {/* Fixed left sidebar for filters */}
               <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/50 p-5 flex flex-col gap-6 shrink-0">
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">选择监控节点</label>
                     <select className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-medium focus:outline-none focus:border-blue-500 bg-white">
                        {activeFeeds.map(f => <option key={f.id}>{f.name}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">选择回放日期</label>
                     <div className="relative">
                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="date" defaultValue="2026-05-01" className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 bg-white" />
                     </div>
                  </div>
                  <div className="mt-auto">
                     <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm">
                        检索录像片段
                     </button>
                  </div>
               </div>
               
               {/* Video player area */}
               <div className="flex-1 flex flex-col bg-black relative">
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                     <div className="text-white/20 flex flex-col items-center">
                        <Play className="w-16 h-16 mb-4" />
                        <span className="text-sm font-medium tracking-widest uppercase">Select timeframe to play</span>
                     </div>
                  </div>
                  {/* Timeline controller */}
                  <div className="h-32 bg-slate-900 border-t border-slate-800 p-4 flex flex-col justify-end">
                     <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                        <span>00:00:00</span>
                        <span>12:00:00</span>
                        <span>24:00:00</span>
                     </div>
                     <div className="relative w-full h-12 bg-slate-800 rounded-md overflow-hidden flex items-end">
                        {/* Fake recorded blocks */}
                        <div className="absolute left-[10%] w-[30%] h-8 bg-blue-500/40 border-t-2 border-blue-500"></div>
                        <div className="absolute left-[50%] w-[20%] h-8 bg-blue-500/40 border-t-2 border-blue-500"></div>
                        <div className="absolute left-[80%] w-[5%] h-8 bg-amber-500/60 border-t-2 border-amber-500"></div> {/* Event */}
                        
                        {/* Scrubber */}
                        <input 
                           type="range" 
                           min="0" 
                           max="100" 
                           value={playbackTime} 
                           onChange={(e) => setPlaybackTime(Number(e.target.value))}
                           className="absolute inset-0 w-full opacity-0 cursor-pointer z-10" 
                        />
                        <div 
                           className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-0 pointer-events-none"
                           style={{ left: `${playbackTime}%` }}
                        >
                           <div className="absolute -top-1 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-500"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Intercom Modal */}
      {intercomCamera && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 text-center bg-gradient-to-b from-blue-50 to-white">
                 <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white">
                       <Mic className="w-10 h-10" />
                    </div>
                 </div>
                 <h3 className="font-black text-slate-800 text-2xl mb-1">正在对讲</h3>
                 <p className="text-slate-500 font-medium">目标通道：{intercomCamera}</p>
                 
                 <div className="flex items-center justify-center gap-1 mt-6 h-8">
                    {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((bar, i) => (
                       <div key={i} className="w-1.5 bg-blue-500 rounded-full animate-pulse" style={{ height: `${bar * 6}px`, animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                 </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                 <button onClick={() => setIntercomCamera(null)} className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition shadow-[0_4px_14px_0_rgba(244,63,94,0.39)]">挂断结束</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
