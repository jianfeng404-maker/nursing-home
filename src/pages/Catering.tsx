import { useState } from "react";
import { Search, Plus, ShoppingBag, ChefHat, CheckCircle2, Clock, Utensils, AlertTriangle, ArrowRight, User, Sparkles, Loader2, X } from "lucide-react";
import { ElderLink } from "../components/ElderLink";
import { generateWeeklyMenu } from "../services/aiService";
import { toast } from "sonner";

export function Catering() {
  const [activeTab, setActiveTab] = useState('kitchen');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [isGeneratingMenu, setIsGeneratingMenu] = useState(false);
  const [aiMenuReport, setAiMenuReport] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const [menuItems, setMenuItems] = useState([
     { id: 1, name: "清蒸鲈鱼", type: "普通膳食", calories: "180 kcal", strict: "低嘌呤, 低脂", tags: ["高蛋白", "易消化"] },
     { id: 2, name: "杂粮糊(无糖)", type: "流质/半流质", calories: "120 kcal", strict: "糖尿病", tags: ["无糖", "高纤维"] },
     { id: 3, name: "红烧肉", type: "普通膳食", calories: "350 kcal", strict: "高脂血症禁用", tags: ["高脂"] },
     { id: 4, name: "西红柿鸡蛋软面", type: "半流质/软食", calories: "210 kcal", strict: "无", tags: ["少牙特供", "易消化"] },
     { id: 5, name: "无碘盐蔬菜汤", type: "特殊膳食", calories: "50 kcal", strict: "甲亢", tags: ["无碘", "清淡"] },
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

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">适老化餐饮与特膳中心</h2>
          <span className="text-sm font-medium text-slate-500 mt-1.5 block">
            打通护士站医嘱字典，自动识别长者的特殊禁忌，并联动护工端生成送餐工单
          </span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateMenu}
            disabled={isGeneratingMenu}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition shadow-sm active:scale-95 disabled:bg-emerald-400"
          >
             {isGeneratingMenu ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
             AI下周菜谱编制
          </button>
        </div>
      </div>

      {/* 核心指标监控区 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
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

      <div className="flex bg-slate-100/50 p-1 rounded-xl w-max mb-6">
         {['kitchen', 'menu'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'kitchen' && '后厨制作与分发看板 (Kanban)'}
              {tab === 'menu' && '菜品与营养库'}
            </button>
         ))}
      </div>

      {activeTab === 'kitchen' && (
         <div className="flex-1 flex gap-5 overflow-x-auto snap-x custom-scrollbar pb-4 min-h-[500px]">
            {/* Column 1: 待处理订单 */}
            <div className="w-[320px] shrink-0 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden max-h-full">
               <div className="bg-white border-b border-slate-200 p-4 shrink-0">
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                     <Clock className="w-5 h-5 text-slate-400" />
                     待排菜与备餐 ({kitchenOrders.filter(o=>o.status==='pending').length})
                  </h3>
               </div>
               <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {kitchenOrders.filter(o=>o.status==='pending').map(order => (
                     <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200"># {order.id}</span>
                           <span className="text-xs font-bold text-rose-600">{order.time} 前出餐</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-base mb-1">{order.elder} <span className="text-sm font-medium text-slate-500">({order.room})</span></h4>
                        
                        {order.diet !== '常规' && (
                           <div className="bg-amber-50 text-amber-800 text-xs font-bold p-1.5 rounded flex items-center gap-1.5 mb-2">
                              <AlertTriangle className="w-3.5 h-3.5" /> 禁忌: {order.diet}
                           </div>
                        )}
                        
                        <div className="text-sm text-slate-700 mb-4 bg-slate-50 p-2 rounded">
                           {order.items.join(" + ")}
                        </div>
                        <button onClick={() => updateStatus(order.id, 'cooking')} className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1">
                           开始制作 <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                     </div>
                  ))}
               </div>
            </div>

            {/* Column 2: 正在制作 */}
            <div className="w-[320px] shrink-0 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col overflow-hidden max-h-full">
               <div className="bg-white border-b border-blue-100 p-4 shrink-0">
                  <h3 className="font-black text-blue-900 flex items-center gap-2">
                     <ChefHat className="w-5 h-5 text-blue-500" />
                     后厨正在制作 ({kitchenOrders.filter(o=>o.status==='cooking').length})
                  </h3>
               </div>
               <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {kitchenOrders.filter(o=>o.status==='cooking').map(order => (
                     <div key={order.id} className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm shadow-blue-100">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100"># {order.id}</span>
                           <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> 烹调中</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-base mb-1">{order.elder} <span className="text-sm font-medium text-slate-500">({order.room})</span></h4>
                        
                        {order.diet !== '常规' && (
                           <div className="bg-amber-50 text-amber-800 text-xs font-bold p-1.5 rounded flex items-center gap-1.5 mb-2">
                              <AlertTriangle className="w-3.5 h-3.5" /> 禁忌: {order.diet}
                           </div>
                        )}
                        
                        <div className="text-sm text-slate-700 mb-4 bg-slate-50 p-2 rounded">
                           {order.items.join(" + ")}
                        </div>
                        <button onClick={() => updateStatus(order.id, 'delivering')} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-1">
                           制作完成，呼叫护工 <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-[9px] text-slate-400 text-center mt-2">点击将自动创建 "送餐" 工单给当班护工</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Column 3: 护工派送中 */}
            <div className="w-[320px] shrink-0 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col overflow-hidden max-h-full">
               <div className="bg-white border-b border-emerald-100 p-4 shrink-0">
                  <h3 className="font-black text-emerald-900 flex items-center gap-2">
                     <ShoppingBag className="w-5 h-5 text-emerald-500" />
                     护工配送中 ({kitchenOrders.filter(o=>o.status==='delivering').length})
                  </h3>
               </div>
               <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {kitchenOrders.filter(o=>o.status==='delivering').map(order => (
                     <div key={order.id} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm opacity-80">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200"># {order.id}</span>
                           <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> 呼叫成功</span>
                        </div>
                        <h4 className="font-black text-slate-800 text-base mb-1">{order.elder} <span className="text-sm font-medium text-slate-500">({order.room})</span></h4>
                        
                        <div className="mt-4 p-2 bg-slate-50 rounded border border-slate-100 flex items-center gap-2">
                           <User className="w-4 h-4 text-slate-400" />
                           <div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase">接单人</div>
                              <div className="text-xs font-bold text-slate-700">{order.assign}</div>
                           </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">护工在其移动端打卡后将自动完结</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {activeTab === 'menu' && (
         <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
               <h3 className="font-bold text-slate-800">菜品与营养流质库</h3>
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
                     <div key={idx} className="border border-slate-200 rounded-xl p-4 hover:border-emerald-300 hover:shadow-md transition-all bg-white cursor-pointer group">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <h4 className="font-black text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{item.name}</h4>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">{item.type}</span>
                           </div>
                           <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">{item.calories}</span>
                        </div>
                        <div className="space-y-2 mt-4 text-sm">
                           <div className="flex text-slate-600">
                              <span className="w-16 font-bold text-slate-400">禁忌关联</span>
                              <span className={`font-medium ${item.strict !== '无' ? 'text-rose-600' : 'text-slate-600'}`}>{item.strict}</span>
                           </div>
                           <div className="flex text-slate-600">
                              <span className="w-16 font-bold text-slate-400">营养标签</span>
                              <div className="flex gap-1 flex-wrap">
                                 {item.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">{tag}</span>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
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
              <button onClick={() => {toast.success("已应用排产计划"); setShowReportModal(false)}} className="px-5 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm">
                应用排菜并通知后厨
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">菜品名称</label>
                <input id="form-dish-name" type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" placeholder="请输入菜品名" />
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
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
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
                  const tagsArray = tagsStr ? tagsStr.split(',').map(s=>s.trim()) : [];
                  
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
                    tags: tagsArray
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

    </div>
  );
}
