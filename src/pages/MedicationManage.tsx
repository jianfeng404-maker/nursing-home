import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, Filter, Pill, CheckCircle2, AlertCircle, Clock, X, Check, FileText } from "lucide-react";
import { useStore } from "../store";
import { toast } from "sonner";

export function MedicationManage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('');

  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrderElder, setNewOrderElder] = useState('张明宇 (A栋-101床)');
  const [newOrderMedications, setNewOrderMedications] = useState([{ name: '', frequency: '', dose: '' }]);
  const [newOrderTimes, setNewOrderTimes] = useState<string[]>(['12:00']);
  const [newOrderRequirements, setNewOrderRequirements] = useState('');

  // Connect to global store tasks
  const globalTasks = useStore(state => state.tasks);
  const updateTaskStatus = useStore(state => state.updateTaskStatus);
  const addTask = useStore(state => state.addTask);
  const addBill = useStore(state => state.addBill);

  // Map global medical tasks to the format MedicationManage expects
  // We identify medical tasks by type === 'medical'
  const tasks = globalTasks
    .filter(t => t.type === 'medical')
    .map(t => {
      // Determine time period roughly
      const hour = parseInt(t.time.split(':')[0]);
      let timePeriod = "morning";
      if (hour >= 11 && hour <= 14) timePeriod = "noon";
      else if (hour >= 15 && hour <= 19) timePeriod = "evening";
      else if (hour >= 20) timePeriod = "night";

      // Parse elder and bed from "Name (Bed)" format
      const elderName = t.elder ? t.elder.split(' (')[0] || t.elder : '未知';
      const bed = t.elder && t.elder.includes('(') ? t.elder.split('(')[1].replace(')', '') : '未知床位';

      return {
        id: t.id,
        elderName,
        bed,
        time: t.time,
        timePeriod,
        medications: t.medications && t.medications.length > 0 ? t.medications : [t.name.replace('辅助服药: ', '').replace('辅助服药 (降压药)', '降压药')], // rough parse for mock or fallback
        requirements: t.requirements || "遵医嘱定时服用",
        status: t.status === 'completed' ? 'executed' : 'pending',
        executor: t.staff,
        executeTime: t.status === 'completed' ? t.time : undefined
      };
    });

  const [orders] = useState([
    {
      id: "ORD-001",
      elderName: "张阿姨",
      doctor: "李医生",
      diagnosis: "高血压",
      medications: [
        { name: "降压药", dose: "1片", freq: "每日一次(早晨)" }
      ],
      startDate: "2023-11-01",
      endDate: "长效"
    }
  ]);

  const handleExecute = (task: any) => {
    setSelectedTask(task);
    setShowExecuteModal(true);
  };

  const confirmExecute = () => {
    updateTaskStatus(selectedTask.id, 'completed');
    setShowExecuteModal(false);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter(t => {
    const matchTab = activeTab === 'upcoming' ? t.status === 'pending' : (activeTab === 'executed' ? t.status === 'executed' : true);
    const matchSearch = t.elderName.includes(searchTerm) || t.bed.includes(searchTerm);
    const matchTime = timeFilter ? t.timePeriod === timeFilter : true;
    return matchTab && matchSearch && matchTime;
  });

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const executedCount = tasks.filter(t => t.status === 'executed').length;
  const totalCount = tasks.length;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">医嘱与用药执行台账</h1>
          <p className="text-slate-500 mt-1">管理长者医嘱、分药计划与每日发药登记执行。</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowNewOrderModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            新增医嘱计划
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">今日用药总计划</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalCount}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">已发药/执行</p>
              <h3 className="text-2xl font-bold text-slate-800">{executedCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">待发药/执行</p>
              <h3 className="text-2xl font-bold text-slate-800">{pendingCount}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-rose-50 border-rose-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">漏服/异常用药</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-200">
          <div className="flex px-4 overflow-x-auto">
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              待执行发药计划
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'executed' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('executed')}
            >
              已执行记录
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('orders')}
            >
              长者在管医嘱大纲
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="搜索长者姓名、床位号..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            {activeTab !== 'orders' && (
              <select 
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-blue-500 text-slate-600"
                value={timeFilter}
                onChange={e => setTimeFilter(e.target.value)}
              >
                 <option value="">全部时段</option>
                 <option value="morning">早晨 (07:00-09:00)</option>
                 <option value="noon">中午 (11:00-13:00)</option>
                 <option value="evening">晚上 (17:00-19:00)</option>
                 <option value="night">睡前 (20:00-22:00)</option>
              </select>
            )}
          </div>
          <button className="text-sm flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            高级筛选
          </button>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {activeTab === 'orders' ? (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">单号/长者</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">诊断</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">相关药品与频率</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">有效期</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">开单医生</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{order.elderName}</div>
                        <div className="text-xs text-slate-500 font-mono mt-1">{order.id}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{order.diagnosis}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.medications.map((m, i) => (
                            <div key={i} className="text-sm flex items-center gap-2">
                              <span className="font-medium text-slate-800">{m.name}</span>
                              <span className="text-slate-500">{m.dose}</span>
                              <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{m.freq}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.startDate} 至 {order.endDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{order.doctor}</td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">详情与变更</button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        暂无医嘱记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">长者及床位</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">用药计划时段</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">药品清单</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">用药要求</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{task.elderName}</div>
                        <div className="text-xs text-slate-500">{task.bed}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <Clock className={`w-4 h-4 ${task.status === 'executed' ? 'text-slate-400' : 'text-amber-500'}`} /> 
                          {task.timePeriod === 'morning' && '早晨'}
                          {task.timePeriod === 'noon' && '中午'}
                          {task.timePeriod === 'evening' && '晚上'}
                          {task.timePeriod === 'night' && '睡前'}
                           ({task.time})
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {task.medications.map((m, i) => (
                            <div key={i} className="text-sm font-medium text-slate-700">{m}</div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {task.requirements ? (
                          <span className={`text-xs px-2 py-1 rounded inline-block ${task.status === 'executed' ? 'text-slate-600 bg-slate-100 border border-slate-200' : 'text-amber-700 bg-amber-50 border border-amber-200'}`}>
                            {task.requirements}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">无特殊</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {task.status === 'pending' ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">待执行</span>
                        ) : (
                          <div>
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
                              已执行
                            </span>
                            <div className="text-xs text-slate-500 mt-1">{task.executor} {task.executeTime}</div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         {task.status === 'pending' ? (
                           <button 
                             onClick={() => handleExecute(task)}
                             className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                           >
                             打卡确认执行
                           </button>
                         ) : (
                           <button className="text-slate-600 hover:text-slate-800 text-sm font-medium">查看记录</button>
                         )}
                      </td>
                    </tr>
                  ))}
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        当前条件下没有用药计划
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 执行打卡弹窗 */}
      {showExecuteModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                用药执行打卡
              </h3>
              <button 
                onClick={() => setShowExecuteModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">{selectedTask.elderName}</span>
                  <span className="text-sm text-slate-600 bg-white px-2 py-0.5 rounded border border-blue-100">{selectedTask.bed}</span>
                </div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 计划时间: {selectedTask.time}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-bold text-slate-700 block mb-2">需服药品核对:</label>
                <div className="space-y-2">
                  {selectedTask.medications.map((med: string, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-800 text-sm">{med}</span>
                      <Check className="w-5 h-5 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              {selectedTask.requirements && (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mb-4">
                  <span className="text-xs font-bold text-amber-800 block mb-1">用药要求</span>
                  <span className="text-sm text-amber-700">{selectedTask.requirements}</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">执行情况备注 (选填)</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 justify-start h-20 resize-none"
                    placeholder="如遇长者拒服、漏服等特殊情况请备注..."
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                   <input type="checkbox" id="confirm" className="rounded text-blue-600 w-4 h-4" defaultChecked />
                   <label htmlFor="confirm" className="text-sm text-slate-700">本人已完成"三查七对"并确认发药</label>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowExecuteModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-white border border-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={confirmExecute}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                确认提交打卡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新增医嘱弹窗 */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col pt-0 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <FileText className="w-5 h-5 text-blue-600" />
                 新增长期/临时医嘱
              </h3>
              <button onClick={() => setShowNewOrderModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">选择长者 <span className="text-red-500">*</span></label>
                    <select 
                      value={newOrderElder}
                      onChange={(e) => setNewOrderElder(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="">--搜索或选择长者--</option>
                      <option value="张明宇 (A栋-101床)">张明宇 (A-101)</option>
                      <option value="李建国 (B栋-205床)">李建国 (B-205)</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">诊断情况的关联记录</label>
                    <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400" placeholder="例如：高血压" />
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <label className="text-sm font-medium text-slate-700">添加药品清单 <span className="text-red-500">*</span></label>
                   <button 
                     onClick={() => setNewOrderMedications([...newOrderMedications, { name: '', frequency: '', dose: '' }])}
                     className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center gap-1"
                   >
                     <Plus className="w-4 h-4" /> 增加药品
                   </button>
                 </div>
                 <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-3">
                    {newOrderMedications.map((med, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                         <div className="col-span-5">
                            <input 
                              type="text" 
                              value={med.name}
                              onChange={(e) => {
                                const nw = [...newOrderMedications];
                                nw[index].name = e.target.value;
                                setNewOrderMedications(nw);
                              }}
                              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500" placeholder="药品名称/规格" 
                            />
                         </div>
                         <div className="col-span-3">
                            <input 
                              type="text" 
                              value={med.frequency}
                              onChange={(e) => {
                                const nw = [...newOrderMedications];
                                nw[index].frequency = e.target.value;
                                setNewOrderMedications(nw);
                              }}
                              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500" placeholder="频次 (如每日一次)" 
                            />
                         </div>
                         <div className="col-span-3">
                            <input 
                              type="text" 
                              value={med.dose}
                              onChange={(e) => {
                                const nw = [...newOrderMedications];
                                nw[index].dose = e.target.value;
                                setNewOrderMedications(nw);
                              }}
                              className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500" placeholder="剂量 (如1片)" 
                            />
                         </div>
                         <div className="col-span-1 text-center">
                            <button 
                              onClick={() => setNewOrderMedications(newOrderMedications.filter((_, i) => i !== index))}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4 mx-auto" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">分派执行时间点 <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2 pt-1">
                       {['08:00', '12:00', '18:00', '21:00'].map(t => (
                         <label key={t} className="flex items-center gap-1.5 text-sm border border-slate-200 px-3 py-1.5 rounded bg-slate-50 hover:bg-slate-100 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={newOrderTimes.includes(t)}
                              onChange={(e) => {
                                if (e.target.checked) setNewOrderTimes([...newOrderTimes, t]);
                                else setNewOrderTimes(newOrderTimes.filter(time => time !== t));
                              }}
                              className="rounded text-blue-600" 
                            /> 
                            {t === '08:00' ? '早晨' : t === '12:00' ? '中午' : t === '18:00' ? '晚上' : '睡前'}({t})
                         </label>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">特殊的服药要求及禁忌</label>
                    <input 
                      type="text" 
                      value={newOrderRequirements}
                      onChange={(e) => setNewOrderRequirements(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400" 
                      placeholder="例如：必须饭后服用、不可嚼碎" 
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">医嘱开始日期</label>
                    <input type="date" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">医嘱结束日期</label>
                    <div className="flex items-center gap-3">
                       <input type="date" disabled className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-slate-50 text-slate-400" />
                       <label className="flex items-center gap-1.5 text-sm whitespace-nowrap text-slate-600 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-blue-600" /> 长期有效
                       </label>
                    </div>
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">开单医生记录</label>
                 <input type="text" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400" placeholder="来源医院及开单医师记录" />
              </div>

            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3 sticky bottom-0 z-10">
              <button 
                onClick={() => {
                  setShowNewOrderModal(false);
                  setNewOrderMedications([{ name: '', frequency: '', dose: '' }]);
                  setNewOrderTimes(['12:00']);
                  setNewOrderRequirements('');
                }} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-white border border-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                disabled={!newOrderElder || newOrderMedications.length === 0 || !newOrderMedications[0].name || newOrderTimes.length === 0}
                onClick={() => {
                  newOrderTimes.forEach(time => {
                    addTask({
                      id: `MED-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                      name: `辅助服药: 排程生成`,
                      elder: newOrderElder,
                      time: time,
                      staff: "待指派",
                      status: "pending",
                      type: "medical",
                      medications: newOrderMedications.filter(m => m.name).map(m => `${m.name} ${m.dose}`),
                      requirements: newOrderRequirements || "遵医嘱定时服用"
                    });
                  });
                  
                  // Optionally charge a dispensing agency fee or medical service fee
                  addBill({
                     id: `BILL-MED-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
                     elder: newOrderElder.split(' (')[0] || '未知',
                     room: newOrderElder.split('(')[1]?.replace(')', '') || '未知',
                     period: "代理配药与服药管理服务",
                     dueDate: new Date().toISOString().split('T')[0],
                     status: "未缴费",
                     total: "60", // Mock fee
                     items: [
                       { name: "单次/周期代为配发医药服务费", amount: "60", type: "service" }
                     ]
                  });
                  toast.success(`医嘱保存成功！已产生对应服药任务 ${newOrderTimes.length} 条，并自动生成药品管理服务费 ￥60。`);

                  setShowNewOrderModal(false);
                  setNewOrderMedications([{ name: '', frequency: '', dose: '' }]);
                  setNewOrderTimes(['12:00']);
                  setNewOrderRequirements('');
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                保存医嘱并生成任务
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

