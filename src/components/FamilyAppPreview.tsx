import React, { useState, useEffect } from 'react';
import { X, HeartPulse, Activity, Bed, ChevronRight, Phone, MessageCircle, MapPin, Bell, User, Clock, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function FamilyAppPreview({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('home');
  const { elders } = useStore();
  
  // default to first elder
  const elder = elders[0] || { id: 'ELD-001', name: '张云岚', age: 78, gender: '女', avatar: undefined };

  const [healthData, setHealthData] = useState<any[]>([]);

  useEffect(() => {
    const data = [];
    let hr = 72;
    for(let i=0; i<7; i++) {
      data.push({
        time: `10-0${i+1}`,
        hr: Math.round(hr + Math.random() * 10 - 5)
      });
    }
    setHealthData(data);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="w-[375px] h-[812px] bg-white rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* Dynamic Island / Notch Simulation */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
          <div className="w-32 h-6 bg-slate-800 rounded-b-2xl"></div>
        </div>

        {/* Top App Bar inside frame */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pt-12 pb-4 px-4 flex justify-between items-center rounded-b-3xl shadow-sm z-40 relative">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border border-white/30 backdrop-blur-sm">
                {elder.avatar ? <img src={elder.avatar!} className="w-full h-full object-cover"/> : <span className="font-bold text-lg">{elder.name[0]}</span>}
             </div>
             <div>
               <h2 className="font-bold text-lg leading-tight">{elder.name}</h2>
               <p className="text-xs text-blue-100 flex items-center gap-1"><MapPin className="w-3 h-3"/> A栋-101床</p>
             </div>
           </div>
           <button className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-indigo-600"></span>
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 pb-20 relative">
          
          {activeTab === 'home' && (
             <div className="p-4 space-y-4">
                
                {/* Status Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-100 to-transparent rounded-bl-full opacity-50"></div>
                   <div className="relative z-10 flex items-center justify-between">
                     <div>
                       <h3 className="text-sm font-medium text-slate-500 mb-1">当前状态</h3>
                       <p className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                         安全在床 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                       </p>
                     </div>
                     <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                       <Bed className="w-6 h-6 text-emerald-500" />
                     </div>
                   </div>
                   <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                     <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> 最近活动: 10分钟前</span>
                   </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <HeartPulse className="w-6 h-6 text-rose-500 mb-2 relative z-10" />
                     <p className="text-xs text-slate-500 relative z-10">实时心率</p>
                     <p className="text-xl font-bold text-slate-800 relative z-10 mt-0.5">75 <span className="text-xs font-normal text-slate-400">次/分</span></p>
                   </div>
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     <Activity className="w-6 h-6 text-blue-500 mb-2 relative z-10" />
                     <p className="text-xs text-slate-500 relative z-10">实时呼吸</p>
                     <p className="text-xl font-bold text-slate-800 relative z-10 mt-0.5">18 <span className="text-xs font-normal text-slate-400">次/分</span></p>
                   </div>
                </div>

                {/* Mini Chart */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 text-sm">心率趋势</h3>
                    <button className="text-xs text-blue-600 font-medium hover:underline">查看全部</button>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData} margin={{top:5, right:5, left:-20, bottom:0}}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
                        <Tooltip />
                        <Line type="monotone" dataKey="hr" stroke="#3B82F6" strokeWidth={3} dot={{r:3, strokeWidth:2}} activeDot={{r:5}} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Quick Actions */}
                <h3 className="font-bold text-slate-800 text-sm mt-6 mb-3 px-1">与护理机构沟通</h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Phone className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">联系责任护士</p>
                        <p className="text-[10px] text-slate-500">李雪护士 - 138xxxx1234</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><MessageCircle className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">机构客服留言</p>
                        <p className="text-[10px] text-slate-500">2小时内回复</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'care' && (
            <div className="p-4">
               <h3 className="font-bold text-xl text-slate-800 mb-4">今日照护记录</h3>
               
               <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-6">
                 
                 <div className="relative pl-6">
                   <div className="absolute -left-[9px] top-1 w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-slate-50"></div>
                   <div>
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-1">刚刚</span>
                     <p className="text-sm font-bold text-slate-800 mt-1">生命体征检测正常</p>
                     <p className="text-xs text-slate-500 mt-1">测量护士：李雪</p>
                   </div>
                 </div>

                 <div className="relative pl-6">
                   <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-slate-50"></div>
                   <div>
                     <span className="text-xs font-medium text-slate-500 ml-1">11:30</span>
                     <p className="text-sm font-bold text-slate-800 mt-1">午餐(糖尿病专供)</p>
                     <p className="text-xs text-slate-500 mt-1">状态：进食良好 (约80%)</p>
                   </div>
                 </div>

                 <div className="relative pl-6">
                   <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-slate-50"></div>
                   <div>
                     <span className="text-xs font-medium text-slate-500 ml-1">09:00</span>
                     <p className="text-sm font-bold text-slate-800 mt-1">房间清洁打扫</p>
                     <p className="text-xs text-slate-500 mt-1">保洁员：王阿姨</p>
                   </div>
                 </div>
                 
                 <div className="relative pl-6">
                   <div className="absolute -left-[9px] top-1 w-4 h-4 bg-indigo-500 rounded-full ring-4 ring-slate-50"></div>
                   <div>
                     <span className="text-xs font-medium text-slate-500 ml-1">08:00</span>
                     <p className="text-sm font-bold text-slate-800 mt-1">晨间护理与服药</p>
                     <p className="text-xs text-slate-500 mt-1">高血压片1粒，按时服用</p>
                   </div>
                 </div>

               </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="p-4 space-y-4">
               <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-5 rounded-2xl shadow-md">
                 <p className="text-sm text-indigo-100 mb-1">当前账户余额</p>
                 <p className="text-3xl font-black mb-4">¥ 12,450.00</p>
                 <div className="flex gap-3">
                   <button className="flex-1 bg-white text-indigo-700 py-2 rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-transform">立即充值</button>
                   <button className="flex-1 bg-white/20 text-white py-2 rounded-xl text-sm font-bold border border-white/20 active:scale-95 transition-transform">账单明细</button>
                 </div>
               </div>

               <h3 className="font-bold text-slate-800 text-sm mt-6 mb-3 px-1">本月账单概览</h3>
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-4 space-y-4">
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Bed className="w-4 h-4"/></div>
                     <span className="text-sm font-medium text-slate-700">床位费 (5月)</span>
                   </div>
                   <span className="text-sm font-bold text-slate-800">¥3,000.00</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><User className="w-4 h-4"/></div>
                     <span className="text-sm font-medium text-slate-700">护理费 (二级)</span>
                   </div>
                   <span className="text-sm font-bold text-slate-800">¥2,500.00</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Activity className="w-4 h-4"/></div>
                     <span className="text-sm font-medium text-slate-700">医护耗材 (累计)</span>
                   </div>
                   <span className="text-sm font-bold text-slate-800">¥120.00</span>
                 </div>
                 
                 <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                   <span className="text-sm font-bold text-slate-500">本月待出账</span>
                   <span className="text-lg font-black text-rose-600">¥5,620.00</span>
                 </div>
               </div>
            </div>
          )}

        </div>

        {/* Bottom Tab Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-100 flex items-center justify-around pb-6 pt-3 px-2 z-40 rounded-b-[32px]">
           <button 
             onClick={() => setActiveTab('home')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
           >
             <HeartPulse className="w-6 h-6" />
             <span className="text-[10px] font-medium">健康</span>
           </button>
           <button 
             onClick={() => setActiveTab('care')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'care' ? 'text-blue-600' : 'text-slate-400'}`}
           >
             <Activity className="w-6 h-6" />
             <span className="text-[10px] font-medium">照护</span>
           </button>
           <button 
             onClick={() => setActiveTab('billing')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'billing' ? 'text-blue-600' : 'text-slate-400'}`}
           >
             <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center font-bold text-[10px]">&yen;</div>
             <span className="text-[10px] font-medium">费用</span>
           </button>
           <button 
             className={`flex flex-col items-center gap-1 ${activeTab === 'mine' ? 'text-blue-600' : 'text-slate-400'}`}
           >
             <User className="w-6 h-6" />
             <span className="text-[10px] font-medium">我的</span>
           </button>
        </div>
      </div>
      
      {/* Close button outside phone */}
      <button 
        className="absolute top-8 right-8 text-white p-3 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
        <span className="sr-only">关闭</span>
      </button>
    </div>
  );
}
