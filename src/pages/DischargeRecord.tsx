import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DoorOpen, Search, Filter, Key, Pill, Coffee, CreditCard, LogOut, CheckCircle2, FileText, ArrowRight, X } from "lucide-react";
import { useStore, DischargeRecordType } from "../store";

export function DischargeRecord() {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DischargeRecordType | null>(null);

  const records = useStore(state => state.discharges);
  // Optional: const updateDischarge = useStore(state => state.updateDischarge); if we need to modify it

  const handleOpenCheckout = (record: any) => {
    setSelectedRecord(record);
    setShowCheckoutModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">出院申请与结算</h1>
          <span className="text-sm text-slate-500">办理长者退住、转院、结账及相关物资与医疗事项的交接核对</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 border border-rose-700 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm">
            <LogOut className="h-4 w-4" />
            发起退住申请
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">正在办理退住</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{records.filter(r => r.status === 'processing').length}</h3>
                  <span className="text-xs text-rose-500 font-medium">注意清退时效</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <DoorOpen className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月已退住结案</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{records.filter(r => r.status === 'completed').length}</h3>
                  <span className="text-xs text-slate-500 font-medium">空余床位已释放</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
               <p className="text-sm font-medium text-slate-500">本月退住原因分析</p>
               <div className="space-y-2 text-xs font-medium text-slate-600">
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-rose-500"></div>家属接回</div><span>60%</span></div>
                  <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-indigo-500"></div>医疗转院</div><span>40%</span></div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-base font-bold text-slate-800">退住办理台账</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜索退住长者、单号..." 
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                全部状态
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-100 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">退住单号</th>
                  <th className="px-6 py-4 font-medium">长者姓名 (床位)</th>
                  <th className="px-6 py-4 font-medium">退住类型及原因</th>
                  <th className="px-6 py-4 font-medium">拟离院日期</th>
                  <th className="px-6 py-4 font-medium">清退进度</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.room}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{item.type}</div>
                      <div className="text-xs text-slate-500">{item.reason}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                       {item.leaveDate}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5">
                          <span title="物资交接" className={`p-1 rounded-md ${item.checks.items ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Key className="w-3.5 h-3.5" /></span>
                          <span title="药品停发" className={`p-1 rounded-md ${item.checks.medical ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><Pill className="w-3.5 h-3.5" /></span>
                          <span title="财务结清" className={`p-1 rounded-md ${item.checks.fee ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}><CreditCard className="w-3.5 h-3.5" /></span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'processing' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.status === 'processing' ? "清退中" : "已结账离院"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'processing' ? (
                        <button onClick={() => handleOpenCheckout(item)} className="text-white bg-rose-600 hover:bg-rose-700 font-medium text-xs px-3 py-1.5 rounded transition-colors shadow-sm">
                          继续清退
                        </button>
                      ) : (
                        <button className="text-slate-600 hover:text-slate-800 font-medium text-xs border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">
                          结账单与凭证
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 退住清点与结算 Modal */}
      {showCheckoutModal && selectedRecord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-rose-100 bg-rose-50/50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 办理退住清退 
                 <span className="text-sm font-normal text-slate-500 px-2">| {selectedRecord.name} ({selectedRecord.room})</span>
              </h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex gap-6 bg-slate-50/50">
                {/* 左侧清点项 */}
                <div className="w-2/3 space-y-6 flex flex-col h-full">
                   <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="font-bold text-slate-800 flex items-center gap-2"><Key className="w-4 h-4 text-amber-500" /> 后勤物资清点交接</h4>
                         {selectedRecord.checks.items ? <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">已完成确认</span> : <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium">待确认</span>}
                      </div>
                      <div className="space-y-3">
                         <label className="flex items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-slate-300" defaultChecked={selectedRecord.checks.items} />
                            <span className="ml-3 text-sm flex-1">房卡/钥匙收回登记</span>
                            <span className="text-xs text-slate-400">房卡x2把</span>
                         </label>
                         <label className="flex items-center p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded border-slate-300" defaultChecked={selectedRecord.checks.items} />
                            <span className="ml-3 text-sm flex-1">借用设备及医疗器具归还</span>
                            <span className="text-xs text-slate-400">无借用</span>
                         </label>
                      </div>
                   </div>

                   <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="font-bold text-slate-800 flex items-center gap-2"><Pill className="w-4 h-4 text-blue-500" /> 医疗与护理终结单</h4>
                         {selectedRecord.checks.medical ? <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded font-medium">已完成确认</span> : <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded font-medium">待药房/护士站操作</span>}
                      </div>
                      <div className="text-center py-6 text-sm text-slate-500 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                         <p>需要药房和护士站通过终端确认"停止发药"及"余药退还"。</p>
                         <button className="mt-3 text-xs bg-white border border-slate-300 font-medium px-3 py-1.5 rounded text-blue-600 hover:bg-blue-50">催促确认</button>
                      </div>
                   </div>

                   <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                         <h4 className="font-bold text-slate-800 flex items-center gap-2"><DoorOpen className="w-4 h-4 text-rose-500" /> 通行权限自动收回</h4>
                         <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded font-medium">即将执行</span>
                      </div>
                      <div className="text-sm text-slate-500 bg-rose-50/50 p-3 rounded-lg border border-rose-100 mt-3">
                         <p className="mb-2">当完成财务结账操作退住后，系统将自动对长者以下权限进行收回销毁：</p>
                         <ul className="list-disc pl-5 space-y-1 text-slate-600 font-medium font-sm">
                             <li>吊销长者的园区大门、闸机及活动室的门禁通行权限</li>
                             <li>注销长者人脸识别白名单特征与指纹库记录</li>
                             <li>解绑对应床位的物联设备（雷达、床垫、呼叫铃），并重置为待分配状态</li>
                         </ul>
                      </div>
                   </div>
                </div>

                {/* 右侧财务结算 */}
                <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                   <div className="p-5 border-b border-slate-100">
                      <h4 className="font-bold text-slate-800 flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-600" /> 财务结账算单</h4>
                   </div>
                   <div className="p-5 flex-1 overflow-y-auto">
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">入住押金退还</span>
                            <span className="font-medium text-slate-800">+ ¥50,000.00</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">不足月床位费核减</span>
                            <span className="font-medium text-rose-600">- ¥1,200.00</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">当月已产生餐费</span>
                            <span className="font-medium text-rose-600">- ¥350.00</span>
                         </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">医疗备用金退还</span>
                            <span className="font-medium text-slate-800">+ ¥5,000.00</span>
                         </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-slate-200">
                         <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-800">应退总计</span>
                            <span className="text-2xl font-bold text-emerald-600">¥ 53,450.00</span>
                         </div>
                         <p className="text-[10px] text-slate-400 mt-2 text-right">结算日期至 2023-11-05</p>
                      </div>
                   </div>
                   <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <button 
                         onClick={() => {
                            // Update discharge status
                            const storeState = useStore.getState();
                            storeState.updateDischarge(selectedRecord.id, {
                               status: 'completed',
                               checks: { items: true, medical: true, fee: true }
                            });
                            
                            const matchedElder = storeState.elders.find(e => e.name === selectedRecord.name);
                            if (matchedElder) {
                               storeState.removeElder(matchedElder.id);
                               const matchedBed = storeState.beds.find(b => b.elderId === matchedElder.id);
                               if (matchedBed) {
                                  storeState.updateBed(matchedBed.id, { status: 'empty', elderId: undefined });
                               }
                            } else {
                               // Fallback clear by room string loosely
                               const matchedBed = storeState.beds.find(b => b.status === 'occupied' && selectedRecord.room.includes(b.room));
                               if (matchedBed) {
                                  storeState.updateBed(matchedBed.id, { status: 'empty', elderId: undefined });
                               }
                            }

                            // Create a refund bill
                            storeState.addBill({
                               id: `BILL-OUT-${new Date().toISOString().replace(/\D/g,'').slice(0,8)}-${Math.floor(Math.random() * 900 + 100)}`,
                               elder: selectedRecord.name,
                               room: selectedRecord.room,
                               period: "退住清算及押金退还",
                               dueDate: new Date().toISOString().split('T')[0],
                               status: "已核发 (待缴款)",
                               total: "-53,450.00",
                               items: [
                                  { name: "入住押金退还", amount: "-50,000.00", type: "fixed" },
                                  { name: "医疗备用金退还", amount: "-5,000.00", type: "fixed" }
                               ],
                               deductions: [
                                  { name: "不足月床位费核减", amount: "1,200.00" },
                                  { name: "当月已产生餐费", amount: "350.00" }
                               ]
                            });
                            setShowCheckoutModal(false);
                         }}
                         className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2">
                        确认结清并流转财务打印单 <ArrowRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
