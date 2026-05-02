import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  MapPin,
  Navigation,
  Crosshair,
  AlertOctagon,
  Maximize,
  Clock,
  ShieldAlert,
  X,
  Calendar,
  Map,
  Play,
  Search,
  Minimize
} from "lucide-react";
import { toast } from "sonner";

export function SecurityGeofence() {
  const [activeAlerts, setActiveAlerts] = useState([
    {
      id: "a1",
      name: "李阿姨",
      tag: "TAG-10A",
      location: "中心湖边",
      time: "刚刚",
      type: "进入危险水域边缘",
    },
  ]);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);

  return (
    <div className={`animate-in fade-in duration-500 pb-8 h-full flex flex-col ${isFullScreen ? 'fixed inset-0 z-50 bg-slate-100 p-0' : ''}`}>
      {!isFullScreen && (
        <div className="flex justify-between items-end mb-6 shrink-0">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">
              电子围栏与防走失定位
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              基于长者随身蓝牙胸牌/定位标签实时绘制轨迹，防护非安全区与大门越界。
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPlaybackModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm active:scale-95"
            >
              <Clock className="w-4 h-4" /> 轨迹回放查询
            </button>
            <button
              onClick={() => { setIsFullScreen(true); toast.success("已切换至3D室内全屏定位视图"); }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95"
            >
              <Maximize className="w-4 h-4" /> 全局地图视窗
            </button>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 min-h-0 ${isFullScreen ? 'm-0 h-full gap-0' : ''}`}>
        <div className={`xl:col-span-3 bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col relative group ${isFullScreen ? 'border-none rounded-none' : 'rounded-2xl'}`}>
          {/* Mock Map Area */}
          <div className="absolute inset-0 bg-slate-100 overflow-hidden">
            <div className="w-full h-full opacity-30 select-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-200 via-slate-300 to-slate-400">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-slate-400"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Fake Buildings Layout */}
            <div className="absolute top-[20%] left-[20%] w-[30%] h-[40%] bg-white/60 border-2 border-slate-300 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold text-slate-400">
              一号住宿楼
            </div>
            <div className="absolute top-[30%] left-[60%] w-[25%] h-[30%] bg-white/60 border-2 border-slate-300 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold text-slate-400">
              康复中心
            </div>

            {/* Geofence areas */}
            <div className="absolute top-[10%] right-[10%] w-[15%] h-[15%] bg-rose-500/20 border-2 border-rose-500/50 rounded-full animate-pulse flex items-center justify-center">
              <span className="text-rose-600 font-bold text-xs bg-white/80 px-2 py-1 rounded">
                危险水域
              </span>
            </div>
            <div className="absolute bottom-[10%] left-[10%] w-[80%] h-4 bg-amber-500/20 border-y-2 border-amber-500/50 flex items-center justify-center">
              <span className="text-amber-700 font-bold text-xs bg-white/80 px-2 py-1 rounded">
                院区北大门越界警告区
              </span>
            </div>

            {/* Locator tags */}
            <div className="absolute top-[12%] right-[12%] group cursor-pointer">
              <div className="relative flex items-center justify-center w-6 h-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                李阿姨 (离开安全区)
              </div>
            </div>

            <div className="absolute top-[40%] left-[30%] group cursor-pointer">
              <div className="relative flex items-center justify-center w-6 h-6">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-white"></span>
              </div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                张爷爷 (正常)
              </div>
            </div>
          </div>

          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-2 pointer-events-auto">
              <Crosshair className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-700">实时院内定位</span>
              <span className="ml-2 bg-emerald-100 text-emerald-700 text-xs font-black px-2 py-0.5 rounded-md">
                142 在线标签
              </span>
              {isFullScreen && (
                <button onClick={() => setIsFullScreen(false)} className="ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded-lg hover:bg-slate-700 flex items-center gap-1.5 transition">
                  <Minimize className="w-3.5 h-3.5" /> 退出全屏
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2 pointer-events-auto">
              <button className="w-10 h-10 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <span className="font-black text-xl leading-none">+</span>
              </button>
              <button className="w-10 h-10 bg-white border border-slate-200 shadow-sm rounded-xl flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <span className="font-black text-xl leading-none">-</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`bg-white border-l border-slate-200 shadow-sm flex flex-col h-[500px] xl:h-auto ${isFullScreen ? 'border-none relative z-10 w-80 shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)]' : 'border rounded-2xl'}`}>
          <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-rose-50/50">
            <AlertOctagon className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-slate-800 text-lg">
              越界告警实时监控
            </h3>
            <span className="ml-auto bg-rose-100 text-rose-600 text-xs font-black px-2 py-1 rounded-md">
              {activeAlerts.length}
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {activeAlerts.length > 0 ? (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border border-rose-200 bg-rose-50/50 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-rose-900">
                      {alert.name}{" "}
                      <span className="text-xs font-mono text-rose-400 bg-white px-1.5 py-0.5 rounded ml-1 border border-rose-100">
                        {alert.tag}
                      </span>
                    </h4>
                    <span className="text-xs font-bold text-rose-500">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> {alert.type}
                  </p>
                  <p className="text-xs text-rose-500/80 font-mono flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> 位置: {alert.location}
                  </p>
                  <button
                    onClick={() => {
                      setActiveAlerts(
                        activeAlerts.filter((a) => a.id !== alert.id),
                      );
                      toast.success("已确认消除警告并通知护理员");
                    }}
                    className="mt-2 w-full py-2 bg-white border border-rose-200 text-rose-600 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors shadow-sm"
                  >
                    解除警告并派单
                  </button>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <ShieldAlert className="w-12 h-12 mb-3 text-emerald-300" />
                <p className="font-bold text-slate-600">目前没有任何设备告警</p>
                <p className="text-xs text-slate-400 mt-1">
                  围栏及定位标签运行正常
                </p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setShowRuleModal(true)}
              className="w-full py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
            >
              新建电子围栏规则
            </button>
          </div>
        </div>
      </div>

      {/* Trajectory Playback Modal */}
      {showPlaybackModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-lg tracking-tight">长者活动轨迹回放</h3>
                </div>
              </div>
              <button onClick={() => setShowPlaybackModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[500px]">
               {/* Left Controls */}
               <div className="w-full md:w-72 border-r border-slate-100 bg-slate-50/50 p-5 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">选择查询对象</label>
                     <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" placeholder="输入长者姓名或标签号" className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white" />
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">选择日期与时间段</label>
                     <input type="date" defaultValue="2026-05-01" className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white mb-2" />
                     <select className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white">
                        <option>08:00 - 12:00</option>
                        <option>12:00 - 18:00</option>
                        <option>18:00 - 22:00</option>
                        <option>自定义时间范围</option>
                     </select>
                  </div>
                  
                  <div className="mt-2 space-y-3">
                     <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2">
                        <Search className="w-4 h-4" /> 生成行动轨迹
                     </button>
                     <button className="w-full py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 text-emerald-600" /> 动画回放演示
                     </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                     <h4 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">轨迹数据摘要</h4>
                     <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between"><span>总活动时长</span><span className="font-mono font-bold text-slate-800">3h 45m</span></div>
                        <div className="flex justify-between"><span>总移动距离</span><span className="font-mono font-bold text-slate-800">1.2 km</span></div>
                        <div className="flex justify-between"><span>主要停留区</span><span className="font-bold text-slate-800">小花园(45m)</span></div>
                     </div>
                  </div>
               </div>
               
               {/* Map View */}
               <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  <div className="text-slate-400 flex flex-col items-center">
                     <Map className="w-16 h-16 mb-4 opacity-50" />
                     <p className="font-bold text-slate-600">在此处绘制轨迹路线图</p>
                  </div>
                  {/* Mock drawn line */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M 100 100 Q 200 150 250 300 T 400 350" fill="none" stroke="rgba(99, 102, 241, 0.6)" strokeWidth="4" strokeDasharray="8 4" className="animate-pulse" />
                     <circle cx="100" cy="100" r="6" fill="#6366f1" />
                     <circle cx="400" cy="350" r="6" fill="#ef4444" />
                  </svg>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Geofence Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                <h3 className="font-black text-slate-800 text-xl tracking-tight">新建电子围栏规则</h3>
                <button type="button" onClick={() => setShowRuleModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={(e) => { e.preventDefault(); setShowRuleModal(false); toast.success('已新建电子围栏预警规则'); }}>
               <div className="p-6 space-y-5 bg-slate-50/50">
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">规则名称 <span className="text-rose-500">*</span></label>
                     <input required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white" placeholder="如：后湖危险区域防落水" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">关联地图区域</label>
                     <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white">
                        <option>区域 A - 南大门外围</option>
                        <option>区域 B - 中心景观湖</option>
                        <option>区域 C - 顶楼天台</option>
                        <option>区域 D - 施工改造区</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">告警触发条件</label>
                     <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="trigger" defaultChecked className="text-indigo-600" /> 人员进入该区域时</label>
                        <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="trigger" className="text-indigo-600" /> 人员离开该区域时</label>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">预警级别</label>
                     <select className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white">
                        <option value="high">高危告警 (立即推送移动端并鸣笛)</option>
                        <option value="mid">中度警告 (系统弹窗提示)</option>
                        <option value="low">普通记录 (仅计入日志报表)</option>
                     </select>
                  </div>
               </div>
               <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                  <button type="button" onClick={() => setShowRuleModal(false)} className="px-5 py-2.5 bg-slate-100/80 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition">取消配置</button>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm">部署围栏规则</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
