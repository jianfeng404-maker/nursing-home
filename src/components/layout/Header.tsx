import { Bell, Search, User, Settings, LogOut, Info, Menu, Smartphone, BriefcaseMedical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FamilyAppPreview } from "../FamilyAppPreview";
import { CareworkerAppPreview } from "../CareworkerAppPreview";
import { useFirebase } from "../../hooks/useFirebase";
import { useStore } from "../../store";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFamilyApp, setShowFamilyApp] = useState(false);
  const [showCareworkerApp, setShowCareworkerApp] = useState(false);

  const displayName = '系统管理员';
  const roleName = 'Super Admin';
  const initial = '管';

  const handleLogout = async () => {
    toast.info('试用模式下无法退出该测试账户');
  };

  const notifications = [
    { id: 1, title: '床位告警', desc: 'A区102床呼叫未响应超时', time: '10分钟前', type: 'urgent' },
    { id: 2, title: '库存不足', desc: '医用手套(L)库存低于预警线', time: '1小时前', type: 'warning' },
    { id: 3, title: '待办审批', desc: '赵红提交了5天年假申请', time: '2小时前', type: 'info' },
  ];

  return (
    <header className="h-16 lg:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 sticky top-0 shadow-sm shadow-slate-100">
      <div className="flex-1 flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md focus:outline-none transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent hidden sm:block w-48 lg:hidden">
          智能颐养平台
        </div>
        <div className="relative w-full max-w-md hidden md:block lg:ml-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="全局搜索 (长者 / 员工 / 物资 / 订单号)..." 
            className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Careworker App Preview Toggle */}
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-full text-sm font-bold transition-colors border border-teal-100"
          onClick={() => setShowCareworkerApp(true)}
        >
          <BriefcaseMedical className="w-4 h-4" />
          <span className="hidden sm:inline">护工端预览</span>
        </button>

        {/* Family App Preview Toggle */}
        <button 
          className="flex items-center gap-1.5 px-3 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full text-sm font-bold transition-colors border border-indigo-100"
          onClick={() => setShowFamilyApp(true)}
        >
          <Smartphone className="w-4 h-4" />
          <span className="hidden sm:inline">家属端预览</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="font-bold text-slate-800">消息通知</span>
                <button 
                  className="text-xs text-emerald-600 hover:underline"
                  onClick={() => toast.success('已全部标记为已读')}
                >
                  全部标记为已读
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(note => (
                  <div key={note.id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${note.type === 'urgent' ? 'bg-rose-500 shadow-sm shadow-rose-200' : note.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{note.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{note.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{note.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center border-t border-slate-100 bg-slate-50">
                <button className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">查看全部系统通知</button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-0.5 sm:mx-1 hidden sm:block"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            className="flex items-center gap-2 sm:gap-3 hover:bg-slate-50 p-1.5 sm:pr-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-100"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-slate-100 text-indigo-700 rounded-full flex items-center justify-center font-bold shadow-sm border border-indigo-200 shrink-0">
              {initial}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-slate-700 leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-500">{roleName}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right z-50">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-sm font-bold text-slate-800">{displayName}</p>
                <p className="text-xs text-slate-500 truncate">admin@smart-care.com</p>
              </div>
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> 个人资料
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 transition-colors">
                  <Settings className="w-4 h-4" /> 账号设置
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2 transition-colors">
                  <Info className="w-4 h-4" /> 关于系统
                </button>
              </div>
              <div className="border-t border-slate-100 py-1 bg-slate-50/50">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> 退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCareworkerApp && <CareworkerAppPreview onClose={() => setShowCareworkerApp(false)} />}
      {showFamilyApp && <FamilyAppPreview onClose={() => setShowFamilyApp(false)} />}
    </header>
  );
}
