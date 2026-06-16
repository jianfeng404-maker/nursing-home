import { useState } from "react";
import { Search, Plus, ShoppingBag, ChefHat, CheckCircle2, Clock, Utensils, AlertTriangle, ArrowRight, User, Sparkles, Loader2, X, Printer } from "lucide-react";
import { ElderLink } from "../components/ElderLink";
import { generateWeeklyMenu } from "../services/aiService";
import { toast } from "sonner";
import { useStore } from "../store";

export function Catering() {
  const [activeTab, setActiveTab] = useState('menu_library');

  // simulated states
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [dailySchedule, setDailySchedule] = useState<Record<string, number[]>>({
    '早餐 (07:00)': [2],
    '午餐 (11:30)': [1, 5],
    '晚餐 (17:30)': [4],
    '夜宵加餐 (20:30)': []
  });
  const [selectingMeal, setSelectingMeal] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<Record<string, Record<string, number[]>>>({
     '周一': { '早': [], '午': [], '晚': [] },
     '周二': { '早': [], '午': [], '晚': [] },
     '周三': { '早': [], '午': [], '晚': [] },
     '周四': { '早': [], '午': [], '晚': [] },
     '周五': { '早': [], '午': [], '晚': [] },
     '周六': { '早': [], '午': [], '晚': [] },
     '周日': { '早': [], '午': [], '晚': [] }
  });
  const [selectingWeekly, setSelectingWeekly] = useState<{day: string, meal: string} | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [aiMenuReport, setAiMenuReport] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const addBill = useStore(state => state.addBill);
  const elders = useStore(state => state.elders);

  const [menuItems, setMenuItems] = useState([
     { id: 1, name: "清蒸鲈鱼", type: "普通膳食", calories: "180 kcal", strict: "低嘌呤, 低脂", tags: ["高蛋白", "易消化"], price: 38, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
     { id: 2, name: "杂粮糊(无糖)", type: "流质/半流质", calories: "120 kcal", strict: "糖尿病", tags: ["无糖", "高纤维"], price: 15, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&q=80" },
     { id: 3, name: "红烧肉", type: "普通膳食", calories: "350 kcal", strict: "高脂血症禁用", tags: ["高脂"], price: 42, image: "https://images.unsplash.com/photo-1627308595229-7830f5c9c66e?w=500&q=80" },
     { id: 4, name: "西红柿鸡蛋软面", type: "半流质/软食", calories: "210 kcal", strict: "无", tags: ["少牙特供", "易消化"], price: 22, image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80" },
     { id: 5, name: "无碘盐蔬菜汤", type: "特殊膳食", calories: "50 kcal", strict: "甲亢", tags: ["无碘", "清淡"], price: 12, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
  ]);

  const handleGenerateMenu = async () => {
    setIsGeneratingMenu(true);
    setAiMenuReport('');
    try {
      const mockEldersData = [
        "15位普通膳食", "糖尿病长者8名", "高尿酸禁止高嘌呤3名", "咀嚼困难/吞咽功能障碍软食流质10名"
      ];
      const res = await generateWeeklyMenu(mockEldersData, menuItems.map(m => m.name));
      setAiMenuReport(res);
      setShowReportModal(true);
      toast.success('AI下周适老化菜谱编制成功');
    } catch (e: any) {
      toast.error(e.message || '编制失败');
    } finally {
      setIsGeneratingMenu(false);
    }
  };

  // Simulated orders with states for kanban
  const [kitchenOrders, setKitchenOrders] = useState([
     { id: "O-01", elder: "张明宇", room: "A-101", items: ["清蒸鱼饭", "无糖银耳汤"], diet: "糖尿病餐 (低糖)", status: "cooking", time: "11:30" },
     { id: "O-02", elder: "李秀兰", room: "A-102", items: ["红烧肉套餐", "紫菜蛋花汤"], diet: "常规", status: "pending", time: "11:45" },
     { id: "O-03", elder: "王建国", room: "B-201", items: ["白粥", "流质配方粉"], diet: "流质饮食", status: "pending", time: "11:45" },
     { id: "O-04", elder: "赵桂芳", room: "C-302", items: ["西红柿鸡蛋面"], diet: "软烂 (少牙)", status: "delivering", time: "11:15", assign: "张阿姨 (护工)" },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
     setKitchenOrders(orders => orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const [orderState, setOrderState] = useState<{elderId: string, items: number[]}>({ elderId: '', items: [] });

  const handlePlaceOrder = () => {
    if (!orderState.elderId || orderState.items.length === 0) {
      toast.error("请选择长者和菜品");
      return;
    }
    const elder = elders.find(e => e.id === orderState.elderId);
    if (!elder) return;

    const selectedItems = orderState.items.map(id => menuItems.find(m => m.id === id)!);
    const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const itemNames = selectedItems.map(i => i.name);

    if (totalAmount > 0) {
      addBill({
        id: `BILL-CAT-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
        elder: elder.name,
        room: '未知', // Ideally from bed assignment, but simple for now
        period: "餐饮点餐(单点加餐)",
        dueDate: new Date().toISOString().split('T')[0],
        status: "未缴费",
        total: totalAmount,
        items: selectedItems.map(item => ({
          name: item.name,
          amount: (item.price || 0).toString(),
          type: "service"
        }))
      });
    }

    setKitchenOrders(prev => [
      {
        id: `O-NEW-${Math.floor(Math.random() * 1000)}`,
        elder: elder.name,
        room: '房间',
        items: itemNames,
        diet: '按点单要求',
        status: 'pending',
        time: new Date(Date.now() + 30 * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    toast.success(`点餐成功！后厨将从食材库存中扣减相关消耗。已为长者 ${elder.name} 生成消费账单 ￥${totalAmount}`);
    setOrderState({ elderId: '', items: [] });
    setActiveTab('kitchen');
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">适老化餐饮与特膳中心</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            打通护士站医嘱字典，自动识别长者的特殊禁忌，并联动护工端生成送餐工单
          </span>
        </div>
      </div>

      <div className="flex flex-wrap bg-slate-100/50 p-1 rounded-xl mb-6">
         {['menu_library', 'daily_menu', 'weekly_menu', 'special_diet'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'menu_library' && '1. 总菜谱库 (字典)'}
              {tab === 'daily_menu' && '2. 每天菜谱排期'}
              {tab === 'weekly_menu' && '3. 一周菜谱计划'}
              {tab === 'special_diet' && '4. 特殊膳食与后厨'}
            </button>
         ))}
      </div>

      {/* Tab: menu_library */}
      {activeTab === 'menu_library' && (
         <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
               <h3 className="font-bold text-slate-800">总菜谱与特膳项目库</h3>
               <div className="flex gap-2">
                  <div className="relative">
                     <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                     <input 
                       type="text" 
                       placeholder="搜索菜品名称或禁忌..." 
                       className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow bg-white"
                     />
                  </div>
                  <button 
                    onClick={() => setShowAddMenuModal(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-900 transition shadow-sm"
                  >
                     <Plus className="w-4 h-4" /> 新增菜品/配方
                  </button>
               </div>
            </div>
            <div className="overflow-x-auto flex-1 p-4">
               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {menuItems.map((item, idx) => (
                     <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all bg-white cursor-pointer group flex flex-col justify-between">
                        <div>
                           {item.image && (
                              <div className="w-full h-32 mb-4 bg-slate-100 rounded-lg overflow-hidden relative">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              </div>
                           )}
                           <div className="flex justify-between items-start mb-3">
                              <div>
                                 <h4 className="font-black text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{item.type}</span>
                              </div>
                              <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">{item.calories}</span>
                           </div>
                           <div className="space-y-2 mt-4 text-sm">
                              <div className="flex text-slate-600 items-start">
                                 <span className="w-16 font-bold text-slate-400 shrink-0">禁忌关联</span>
                                 <span className={`font-medium ${item.strict !== '无' ? 'text-rose-600' : 'text-slate-600'}`}>{item.strict}</span>
                              </div>
                              <div className="flex text-slate-600 items-start">
                                 <span className="w-16 font-bold text-slate-400 shrink-0">营养标签</span>
                                 <div className="flex gap-1 flex-wrap">
                                    {item.tags.map(tag => (
                                       <span key={tag} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">{tag}</span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 -mx-4 -mb-4 px-4 py-3 rounded-b-xl">
                           <span className="text-xl font-black text-emerald-600">￥{item.price}</span>
                           <button className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 shadow-sm">
                              配方详情
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* Tab: daily_menu */}
      {activeTab === 'daily_menu' && (
         <div className="flex-1 overflow-y-auto min-h-[500px]">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 mb-6 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Utensils className="w-5 h-5 text-emerald-600"/> 每日适老化菜谱排期</h3>
                   <p className="text-sm text-slate-500 mt-1">为当天早、中、晚、夜宵配置普通饮食的菜品清单，供全院通用</p>
                 </div>
                 <div className="text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
                    排期日期: {new Date().toISOString().split('T')[0]}
                 </div>
               </div>
               
               <div className="space-y-4">
                  {['早餐 (07:00)', '午餐 (11:30)', '晚餐 (17:30)', '夜宵加餐 (20:30)'].map((meal, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50/50 items-start">
                       <div className="w-32 font-bold text-slate-700">{meal}</div>
                       <div className="flex-1 flex flex-wrap gap-2 min-h-10">
                           {dailySchedule[meal].length === 0 ? (
                             <div className="text-sm text-slate-400 flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 border-dashed rounded text-center cursor-pointer hover:bg-slate-50 w-full md:w-auto" onClick={() => setSelectingMeal(meal)}>
                               点击右侧按钮添加菜品...
                             </div>
                           ) : (
                             dailySchedule[meal].map(dishId => {
                               const dish = menuItems.find(m => m.id === dishId);
                               return dish ? (
                                 <div key={dishId} className="bg-white p-1 pr-3 rounded-lg border border-slate-200 text-sm flex items-center gap-2 shadow-sm">
                                   {dish.image && <img src={dish.image} alt={dish.name} className="w-6 h-6 rounded object-cover shrink-0" />}
                                   <span className="font-bold text-slate-700">{dish.name}</span>
                                   <button 
                                     onClick={() => setDailySchedule(prev => ({ ...prev, [meal]: prev[meal].filter(id => id !== dishId) }))}
                                     className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded px-1 transition-colors ml-1"
                                   >
                                     <X className="w-3 h-3" />
                                   </button>
                                 </div>
                               ) : null;
                             })
                           )}
                       </div>
                       <button onClick={() => setSelectingMeal(meal)} className="text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1.5 rounded hover:bg-emerald-100 transition whitespace-nowrap border-emerald-200 border">
                          + 选择菜品
                       </button>
                    </div>
                  ))}
               </div>
               <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
                  <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition" onClick={() => {toast.success("已下发今日排单至后厨");}}>
                     下发今日排单至后厨大屏
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Tab: weekly_menu */}
      {activeTab === 'weekly_menu' && (
         <div className="flex-1 overflow-y-auto min-h-[500px]">
           <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center mb-6">
              <div className="mb-4 md:mb-0">
                 <h3 className="font-black text-emerald-900 text-lg mb-1 flex items-center gap-2"><Sparkles className="w-5 h-5 text-emerald-600"/> AI 适老化排期与特膳推荐</h3>
                 <p className="text-sm text-emerald-700 max-w-2xl">聚合计算当前在院长者的体检指标、医嘱要求及吞咽能力，一键生成下周满足集体特膳需求的安全营养排期建议，拦截风险饮食冲突。</p>
              </div>
              <button 
                onClick={handleGenerateMenu}
                disabled={isGeneratingMenu}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95 disabled:bg-emerald-400 shrink-0 w-full md:w-auto"
              >
                 {isGeneratingMenu ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                 AI 生成下周计划
              </button>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex items-center gap-3">
                   <h3 className="font-bold text-slate-800">下周统一排单预演</h3>
                   <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">2026 第22周</span>
                 </div>
                 <button onClick={() => setShowPrintModal(true)} className="flex items-center gap-2 text-sm font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                   <Printer className="w-4 h-4" /> 导出 / 打印分发菜单
                 </button>
              </div>
              <div className="min-w-[800px] grid grid-cols-7 gap-3">
                 {['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => (
                    <div key={day} className="bg-slate-50/50 border border-slate-200 rounded-xl p-3">
                       <div className="font-black text-slate-700 border-b border-slate-200 pb-2 mb-3 text-center">{day}</div>
                       <div className="text-xs text-slate-600 space-y-3">
                          <div onClick={() => setSelectingWeekly({day, meal: '早'})} className="bg-white p-2 rounded-lg border border-slate-200 hover:border-emerald-400 shadow-sm flex flex-col items-center text-center cursor-pointer group transition-colors min-h-20">
                             <div className="font-bold text-orange-600 mb-1 w-full flex justify-center items-center gap-1">早</div>
                             {weeklyPlan[day]?.['早']?.length > 0 ? (
                               <div className="space-y-1 w-full text-center">
                                 {weeklyPlan[day]['早'].map((dishId, i) => {
                                   const d = menuItems.find(m => m.id === dishId);
                                   return d ? <div key={i} className="truncate px-1 text-slate-700 font-bold bg-slate-50 border border-slate-100 py-0.5 rounded shadow-sm text-[10px]">{d.name}</div> : null;
                                 })}
                               </div>
                             ) : <div className="text-slate-400 text-xs mt-2 group-hover:text-emerald-500 font-bold">+ 点击排程</div>}
                          </div>
                          <div onClick={() => setSelectingWeekly({day, meal: '午'})} className="bg-white p-2 rounded-lg border border-slate-200 hover:border-emerald-400 shadow-sm flex flex-col items-center text-center cursor-pointer group transition-colors min-h-20">
                             <div className="font-bold text-sky-600 mb-1 w-full flex justify-center items-center gap-1">午</div>
                             {weeklyPlan[day]?.['午']?.length > 0 ? (
                               <div className="space-y-1 w-full text-center">
                                 {weeklyPlan[day]['午'].map((dishId, i) => {
                                   const d = menuItems.find(m => m.id === dishId);
                                   return d ? <div key={i} className="truncate px-1 text-slate-700 font-bold bg-slate-50 border border-slate-100 py-0.5 rounded shadow-sm text-[10px]">{d.name}</div> : null;
                                 })}
                               </div>
                             ) : <div className="text-slate-400 text-xs mt-2 group-hover:text-emerald-500 font-bold">+ 点击排程</div>}
                          </div>
                          <div onClick={() => setSelectingWeekly({day, meal: '晚'})} className="bg-white p-2 rounded-lg border border-slate-200 hover:border-emerald-400 shadow-sm flex flex-col items-center text-center cursor-pointer group transition-colors min-h-20">
                             <div className="font-bold text-indigo-600 mb-1 w-full flex justify-center items-center gap-1">晚</div>
                             {weeklyPlan[day]?.['晚']?.length > 0 ? (
                               <div className="space-y-1 w-full text-center">
                                 {weeklyPlan[day]['晚'].map((dishId, i) => {
                                   const d = menuItems.find(m => m.id === dishId);
                                   return d ? <div key={i} className="truncate px-1 text-slate-700 font-bold bg-slate-50 border border-slate-100 py-0.5 rounded shadow-sm text-[10px]">{d.name}</div> : null;
                                 })}
                               </div>
                             ) : <div className="text-slate-400 text-xs mt-2 group-hover:text-emerald-500 font-bold">+ 点击排程</div>}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
         </div>
      )}

      {activeTab === 'special_diet' && (
         <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-4 min-h-[600px]">
           {/* 核心指标监控区 - moved here for clarity */}
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">今日午餐饮食禁忌</p>
                   <h3 className="text-xl font-black text-amber-900">12 位需过敏/特膳处理</h3>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-400 opacity-50" />
             </div>
             <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">鼻饲/流质配餐</p>
                   <h3 className="text-xl font-black text-rose-900">4 份专属配方</h3>
                </div>
                <Utensils className="w-8 h-8 text-rose-400 opacity-50" />
             </div>
             <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">后厨正在制作</p>
                   <h3 className="text-xl font-black text-blue-900">{kitchenOrders.filter(o=>o.status==='cooking').length} 单</h3>
                </div>
                <ChefHat className="w-8 h-8 text-blue-400 opacity-50" />
             </div>
             <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-1">护工正在派送</p>
                   <h3 className="text-xl font-black text-emerald-900">{kitchenOrders.filter(o=>o.status==='delivering').length} 单</h3>
                </div>
                <ShoppingBag className="w-8 h-8 text-emerald-400 opacity-50" />
             </div>
           </div>

           {/* Section 1: Ordering Area */}
           <div className="bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden shadow-sm shrink-0">
             <div className="p-5 md:w-[380px] border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50 flex flex-col">
               <h3 className="font-black text-slate-800 text-lg mb-3 flex items-center gap-2"><Utensils className="w-5 h-5 text-emerald-600"/> 特膳与单点配置台</h3>
               <p className="text-xs text-slate-500 mb-4">针对患有糖尿病、需流质食物、或临时有单点需求的长者，生成专属饮食工单并同步计费。</p>
               
               <div className="space-y-4 mb-4">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">服务长者</label>
                     <select 
                       value={orderState.elderId} 
                       onChange={(e) => setOrderState(o => ({...o, elderId: e.target.value}))}
                       className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 bg-white"
                     >
                       <option value="">选取长者...</option>
                       {elders.map(e => (
                         <option key={e.id} value={e.id}>{e.name}</option>
                       ))}
                     </select>
                  </div>
               </div>

               <div className="flex-1 border-t border-slate-200 pt-3 overflow-y-auto custom-scrollbar pr-1 max-h-40 space-y-2">
                 {orderState.items.length === 0 ? (
                   <p className="text-slate-400 text-xs text-center mt-2 border border-dashed border-slate-300 rounded p-4 bg-slate-50/50">右侧库点击添加项目</p>
                 ) : (
                   orderState.items.map((id, idx) => {
                     const item = menuItems.find(m => m.id === id);
                     if (!item) return null;
                     return (
                       <div key={`${id}-${idx}`} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-700 text-xs">{item.name}</span>
                           <span className="text-[9px] text-amber-600 font-mono mt-0.5">{item.calories}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="font-mono font-bold text-emerald-600 text-xs">￥{item.price}</span>
                           <button 
                             onClick={() => {
                               const newItems = [...orderState.items];
                               newItems.splice(idx, 1);
                               setOrderState(o => ({...o, items: newItems}));
                             }}
                             className="text-rose-400 hover:text-rose-600 p-0.5 bg-rose-50 hover:bg-rose-100 rounded transition"
                           >
                             <X className="w-3 h-3" />
                           </button>
                         </div>
                       </div>
                     );
                   })
                 )}
               </div>

               <div className="pt-3 border-t border-slate-200 mt-2">
                 <button 
                   onClick={handlePlaceOrder}
                   disabled={!orderState.elderId || orderState.items.length === 0}
                   className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow hover:bg-slate-800 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                 >
                   <CheckCircle2 className="w-4 h-4"/> 提交后厨并计账
                 </button>
               </div>
             </div>
             
             <div className="flex-1 p-5 overflow-y-auto bg-slate-100/30 max-h-[350px] custom-scrollbar">
                 <h4 className="font-black text-slate-800 mb-3 text-sm">快速勾选特殊菜品库</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {menuItems.map((item, idx) => (
                       <div 
                         key={idx} 
                         onClick={() => setOrderState(o => ({...o, items: [...o.items, item.id]}))}
                         className="border border-slate-200 rounded-xl p-3 hover:border-emerald-400 hover:shadow shadow-sm transition-all bg-white cursor-pointer group flex flex-col justify-between"
                       >
                          <div className="flex gap-3">
                             {item.image && (
                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0" />
                             )}
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-black text-slate-800 text-xs group-hover:text-emerald-700">{item.name}</h4>
                                  <span className="text-[9px] bg-slate-100 px-1 py-0.5 rounded text-slate-600 font-bold">{item.type}</span>
                                </div>
                                {item.strict !== '无' && (
                                   <p className="text-[9px] text-rose-600 mb-1 truncate bg-rose-50 px-1.5 py-0.5 flex w-max rounded items-center gap-1"><AlertTriangle className="w-2.5 h-2.5"/> {item.strict}</p>
                                )}
                             </div>
                          </div>
                          <div className="flex justify-between items-end mt-2 pt-2 border-t border-slate-50">
                             <span className="font-bold text-slate-800 text-sm">￥{item.price}</span>
                             <span className="text-emerald-600 text-[10px] bg-emerald-50 px-2 py-0.5 rounded font-bold hover:bg-emerald-100 transition-colors">添加入单</span>
                          </div>
                       </div>
                    ))}
                 </div>
             </div>
           </div>

           {/* Section 2: Kanban Area */}
           <div className="flex gap-5 overflow-x-auto snap-x custom-scrollbar min-h-[350px]">
             {/* Column 1: 待处理订单 */}
             <div className="w-[300px] shrink-0 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
                <div className="bg-white border-b border-slate-200 p-3 shrink-0">
                   <h3 className="font-black text-slate-800 text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      后厨待处理特膳单 ({kitchenOrders.filter(o=>o.status==='pending').length})
                   </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                   {kitchenOrders.filter(o=>o.status==='pending').map(order => (
                      <div key={order.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"># {order.id}</span>
                            <span className="text-[10px] font-bold text-rose-600">{order.time} 需出餐</span>
                         </div>
                         <h4 className="font-black text-slate-800 text-sm mb-1">{order.elder} <span className="text-xs font-medium text-slate-500">({order.room})</span></h4>
                         
                         {order.diet !== '常规' && order.diet !== '按点单要求' && (
                            <div className="bg-amber-50 text-amber-800 text-[10px] font-bold p-1 rounded flex items-center gap-1 mb-2">
                               <AlertTriangle className="w-3 h-3" /> 禁忌: {order.diet}
                            </div>
                         )}
                         
                         <div className="text-xs text-slate-700 mb-3 bg-slate-50 p-2 rounded line-clamp-2">
                            {order.items.join(" + ")}
                         </div>
                         <button onClick={() => updateStatus(order.id, 'cooking')} className="w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-1">
                            后厨接单 <ArrowRight className="w-3 h-3" />
                         </button>
                      </div>
                   ))}
                </div>
             </div>

             {/* Column 2: 正在制作 */}
             <div className="w-[300px] shrink-0 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col overflow-hidden">
                <div className="bg-white border-b border-blue-100 p-3 shrink-0">
                   <h3 className="font-black text-blue-900 text-sm flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-blue-500" />
                      后厨烹调中 ({kitchenOrders.filter(o=>o.status==='cooking').length})
                   </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                   {kitchenOrders.filter(o=>o.status==='cooking').map(order => (
                      <div key={order.id} className="bg-white p-3 rounded-xl border border-blue-200 shadow-sm shadow-blue-100">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700"># {order.id}</span>
                            <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1 animate-pulse">烹调中</span>
                         </div>
                         <h4 className="font-black text-slate-800 text-sm mb-1">{order.elder} <span className="text-xs font-medium text-slate-500">({order.room})</span></h4>
                         <div className="text-xs text-slate-700 mb-3 bg-slate-50 p-2 rounded line-clamp-2">
                            {order.items.join(" + ")}
                         </div>
                         <button onClick={() => updateStatus(order.id, 'delivering')} className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-sm transition-colors flex items-center justify-center gap-1">
                            出餐呼叫配送 <ArrowRight className="w-3 h-3" />
                         </button>
                      </div>
                   ))}
                </div>
             </div>

             {/* Column 3: 护工派送中 */}
             <div className="w-[300px] shrink-0 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col overflow-hidden">
                <div className="bg-white border-b border-emerald-100 p-3 shrink-0">
                   <h3 className="font-black text-emerald-900 text-sm flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      护工配送中 ({kitchenOrders.filter(o=>o.status==='delivering').length})
                   </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                   {kitchenOrders.filter(o=>o.status==='delivering').map(order => (
                      <div key={order.id} className="bg-white p-3 rounded-xl border border-emerald-200 shadow-sm opacity-80">
                         <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700"># {order.id}</span>
                            <span className="text-[10px] font-bold text-emerald-600">已调度</span>
                         </div>
                         <h4 className="font-black text-slate-800 text-sm mb-1">{order.elder} <span className="text-xs font-medium text-slate-500">({order.room})</span></h4>
                         <div className="mt-2 p-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <div>
                               <div className="text-[9px] text-slate-400 font-bold uppercase">接单配送员</div>
                               <div className="text-xs font-bold text-slate-700">{order.assign || "平台分配中..."}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           </div>
         </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
              <h3 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> AI 下周适老化菜谱推荐编制结果
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
                title="关闭"
              ><X className="w-5 h-5 text-indigo-600" /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                {aiMenuReport}
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowReportModal(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                关闭
              </button>
              <button onClick={() => {
                const mockPlan: Record<string, Record<string, number[]>> = {
                   '周一': { '早': [2], '午': [1], '晚': [4] },
                   '周二': { '早': [2], '午': [3], '晚': [5] },
                   '周三': { '早': [2], '午': [1], '晚': [4] },
                   '周四': { '早': [2], '午': [3], '晚': [5] },
                   '周五': { '早': [2], '午': [1], '晚': [4] },
                   '周六': { '早': [2], '午': [1], '晚': [4] },
                   '周日': { '早': [2], '午': [3], '晚': [5] }
                };
                setWeeklyPlan(mockPlan);
                toast.success("已应用排产计划"); 
                setShowReportModal(false);
              }} className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm">
                应用排菜并通知后厨
              </button>
            </div>
          </div>
        </div>
      )}

      {selectingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                为 {selectingMeal} 选择菜品
              </h3>
              <button 
                onClick={() => setSelectingMeal(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                title="关闭"
              ><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {menuItems.map(item => {
                  const isSelected = dailySchedule[selectingMeal].includes(item.id);
                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setDailySchedule(prev => {
                          const currentList = prev[selectingMeal];
                          if (currentList.includes(item.id)) {
                            return { ...prev, [selectingMeal]: currentList.filter(id => id !== item.id) };
                          } else {
                            return { ...prev, [selectingMeal]: [...currentList, item.id] };
                          }
                        });
                      }}
                      className={`border rounded-xl p-3 cursor-pointer transition-all flex justify-between items-center gap-3 ${
                        isSelected ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {item.image && (
                         <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                      )}
                      <div className="flex flex-col flex-1">
                        <span className={`font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.type} | {item.calories}</span>
                      </div>
                      <div className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectingMeal(null)} className="px-6 py-2.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-sm">
                完成选择
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800">新增菜品与配方</h3>
              <button 
                onClick={() => setShowAddMenuModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              ><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">菜品名称</label>
                  <input id="form-dish-name" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="请输入菜品名" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">价格 (元)</label>
                  <input id="form-dish-price" type="number" min="0" step="0.5" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="18" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">菜品类型</label>
                  <select id="form-dish-type" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                    <option value="普通膳食">普通膳食</option>
                    <option value="特殊膳食">特殊膳食</option>
                    <option value="半流质">半流质</option>
                    <option value="流质">流质</option>
                    <option value="匀浆膳">匀浆膳（鼻饲）</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">热量标签</label>
                  <input id="form-dish-cal" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="如: 180 kcal" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">禁忌关联 (重要)</label>
                <input id="form-dish-strict" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white placeholder:text-rose-300 border-rose-200 focus:border-rose-500" placeholder="哪些病症禁食或禁忌 (例如：高脂血症禁用、糖尿病换糖)" />
                <p className="text-xs text-rose-500 mt-1">此关联将与医嘱接轨拦截危险配餐</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">自定义标签 (逗号分隔)</label>
                <input id="form-dish-tags" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="无需咀嚼, 营养补充" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">配图 (选填)</label>
                <div className="flex gap-3 items-center">
                  <input 
                    id="form-dish-image-file" 
                    type="file" 
                    accept="image/*"
                    className="flex-1 border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                  />
                  <span className="text-slate-400 text-sm font-bold">或</span>
                  <input id="form-dish-image-url" type="text" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white placeholder:text-slate-300" placeholder="输入图片 URL..." />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowAddMenuModal(false)} className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                取消
              </button>
              <button 
                onClick={() => {
                  const nameStr = (document.getElementById('form-dish-name') as HTMLInputElement).value;
                  const typeStr = (document.getElementById('form-dish-type') as HTMLSelectElement).value;
                  const calStr = (document.getElementById('form-dish-cal') as HTMLInputElement).value || '未知';
                  const strictStr = (document.getElementById('form-dish-strict') as HTMLInputElement).value || '无';
                  const tagsStr = (document.getElementById('form-dish-tags') as HTMLInputElement).value;
                  const priceStr = (document.getElementById('form-dish-price') as HTMLInputElement).value;
                  const priceVal = priceStr ? parseFloat(priceStr) : 20;
                  const tagsArray = tagsStr ? tagsStr.split(',').map(s=>s.trim()) : [];
                  
                  const fileInput = document.getElementById('form-dish-image-file') as HTMLInputElement;
                  const urlInput = document.getElementById('form-dish-image-url') as HTMLInputElement;
                  let finalImgUrl: string | undefined = undefined;
                  if (fileInput?.files?.length) {
                    finalImgUrl = URL.createObjectURL(fileInput.files[0]);
                  } else if (urlInput?.value) {
                    finalImgUrl = urlInput.value;
                  }
                  
                  if (!nameStr) {
                    toast.error("必须填写菜品名称");
                    return;
                  }
                  
                  setMenuItems([...menuItems, {
                    id: Date.now(),
                    name: nameStr,
                    type: typeStr,
                    calories: calStr,
                    strict: strictStr,
                    tags: tagsArray,
                    price: priceVal,
                    image: finalImgUrl
                  }]);
                  
                  toast.success('菜谱 / 配方添加成功');
                  setShowAddMenuModal(false);
                }}
                className="px-5 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors shadow-sm"
              >
                保存菜品数据
              </button>
            </div>
          </div>
        </div>
      )}

      {selectingWeekly && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                排程 {selectingWeekly.day} {selectingWeekly.meal}餐
              </h3>
              <button 
                onClick={() => setSelectingWeekly(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                title="关闭"
              ><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {menuItems.map(item => {
                  const dayPlan = weeklyPlan[selectingWeekly.day];
                  const currentList = dayPlan ? dayPlan[selectingWeekly.meal] : [];
                  const isSelected = currentList ? currentList.includes(item.id) : false;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => {
                        setWeeklyPlan(prev => {
                          const currentArr = prev[selectingWeekly.day]?.[selectingWeekly.meal] || [];
                          let newArr;
                          if (currentArr.includes(item.id)) {
                             newArr = currentArr.filter(id => id !== item.id);
                          } else {
                             newArr = [...currentArr, item.id];
                          }
                          return {
                             ...prev,
                             [selectingWeekly.day]: {
                                ...(prev[selectingWeekly.day] || {}),
                                [selectingWeekly.meal]: newArr
                             }
                          };
                        });
                      }}
                      className={`border rounded-xl p-3 cursor-pointer transition-all flex justify-between items-center gap-3 ${
                        isSelected ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      {item.image && (
                         <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                      )}
                      <div className="flex flex-col flex-1">
                        <span className={`font-bold text-sm ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>{item.name}</span>
                        <span className="text-[10px] text-slate-500">{item.type} | {item.calories}</span>
                      </div>
                      <div className={`w-5 h-5 shrink-0 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectingWeekly(null)} className="px-6 py-2.5 text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-sm">
                完成选择
              </button>
            </div>
          </div>
        </div>
      )}

      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex py-8 px-4 justify-center bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
           <div className="bg-white max-w-4xl w-full mx-auto rounded-3xl shadow-2xl overflow-hidden flex flex-col h-max">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10 shrink-0 print:hidden">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Printer className="w-5 h-5 text-indigo-600" />
                    导出 / 打印大字版菜单
                 </h3>
                 <div className="flex items-center gap-3">
                    <button onClick={() => {toast.success("正在调用打印..."); setTimeout(() => window.print(), 500);}} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-sm transition-colors shadow-sm">
                       打印此单
                    </button>
                    <button onClick={() => setShowPrintModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500"/></button>
                 </div>
              </div>
              <div className="p-10 bg-white" id="printable-area">
                 <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
                    <h1 className="text-3xl font-black text-slate-900 tracking-wider mb-2">康养中心本周食谱 (2026 第22周)</h1>
                    <p className="text-slate-600 font-bold text-lg">大字报版 / 适合张贴于各楼层护理站及公共活动区</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {['周一','周二','周三','周四','周五','周六','周日'].map(day => (
                       <div key={day} className="border-2 border-slate-200 rounded-2xl p-5 break-inside-avoid">
                          <h2 className="text-2xl font-black text-emerald-800 mb-4 pb-2 border-b-2 border-emerald-100 flex items-center gap-3">
                             <Clock className="w-6 h-6" /> {day}
                          </h2>
                          <div className="space-y-4">
                             <div className="flex gap-4 items-start">
                                <div className="w-16 font-black text-xl text-orange-600 mt-1">早餐</div>
                                <div className="flex-1 text-lg font-bold text-slate-800">
                                   {weeklyPlan[day]?.['早']?.length > 0 
                                      ? weeklyPlan[day]['早'].map(id => menuItems.find(m => m.id === id)?.name).filter(Boolean).join("、")
                                      : <span className="text-slate-400">待定</span>}
                                </div>
                             </div>
                             <div className="flex gap-4 items-start border-t border-slate-100 pt-3">
                                <div className="w-16 font-black text-xl text-sky-600 mt-1">午餐</div>
                                <div className="flex-1 text-lg font-bold text-slate-800">
                                   {weeklyPlan[day]?.['午']?.length > 0 
                                      ? weeklyPlan[day]['午'].map(id => menuItems.find(m => m.id === id)?.name).filter(Boolean).join("、")
                                      : <span className="text-slate-400">待定</span>}
                                </div>
                             </div>
                             <div className="flex gap-4 items-start border-t border-slate-100 pt-3">
                                <div className="w-16 font-black text-xl text-indigo-600 mt-1">晚餐</div>
                                <div className="flex-1 text-lg font-bold text-slate-800">
                                   {weeklyPlan[day]?.['晚']?.length > 0 
                                      ? weeklyPlan[day]['晚'].map(id => menuItems.find(m => m.id === id)?.name).filter(Boolean).join("、")
                                      : <span className="text-slate-400">待定</span>}
                                </div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="mt-8 pt-4 border-t-2 border-slate-800 text-center text-slate-600 font-bold text-lg">
                    如有特殊膳食需求（如无糖、低脂、流食），请致电餐饮部或联系楼层护士。
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
