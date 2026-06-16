import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, Filter, PackageOpen, CheckCircle2, ClipboardCopy, X, Info } from "lucide-react";

import { useStore } from "../store";
import { toast } from "sonner";

export function MaterialConsume() {
  const [activeTab, setActiveTab] = useState('record');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addBill = useStore(state => state.addBill);

  const [records, setRecords] = useState([
    {
      id: "REC001",
      time: "2023-11-20 14:30",
      elderName: "李建国",
      bed: "B栋-205床",
      materialName: "成人纸尿裤 (L码)",
      quantity: 1,
      unit: "包 (10片)",
      amount: "45.00",
      recorder: "王护士",
      status: "billed"
    },
    {
      id: "REC002",
      time: "2023-11-20 10:15",
      elderName: "张明宇",
      bed: "A栋-101床",
      materialName: "护理垫 (大号)",
      quantity: 2,
      unit: "包",
      amount: "70.00",
      recorder: "赵护工",
      status: "pending"
    }
  ]);

  const [inventory] = useState([
    { id: "MAT001", name: "成人纸尿裤 (L码)", category: "护理耗材", price: "45.00", unit: "包", stock: 156 },
    { id: "MAT002", name: "成人纸尿裤 (XL码)", category: "护理耗材", price: "50.00", unit: "包", stock: 89 },
    { id: "MAT003", name: "护理垫 (大号)", category: "护理耗材", price: "35.00", unit: "包", stock: 230 },
    { id: "MAT004", name: "专用营养粉", category: "营养膳食", price: "128.00", unit: "罐", stock: 45 },
  ]);

  const filteredInventory = inventory.filter(i => i.name.includes(searchTerm) || i.id.includes(searchTerm) || i.category.includes(searchTerm));

  const [newRecord, setNewRecord] = useState({
    elder: "",
    material: "",
    quantity: 1
  });

  const handleSaveRecord = () => {
    if (!newRecord.elder || !newRecord.material || newRecord.quantity <= 0) return;
    
    const mat = inventory.find(i => i.id === newRecord.material);
    if (!mat) return;

    const r = {
      id: `REC00${records.length + 1}`,
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      elderName: newRecord.elder === "1" ? "张明宇" : "李建国",
      bed: newRecord.elder === "1" ? "A栋-101床" : "B栋-205床",
      materialName: mat.name,
      quantity: newRecord.quantity,
      unit: mat.unit,
      amount: (parseFloat(mat.price) * newRecord.quantity).toFixed(2),
      recorder: "当前登录用户",
      status: "pending"
    };

    setRecords([r, ...records]);
    setShowAddModal(false);
    setNewRecord({ elder: "", material: "", quantity: 1 });

    addBill({
      id: `BILL-MAT-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
      elder: r.elderName,
      room: r.bed,
      period: "零星物资记账扣费",
      dueDate: new Date().toISOString().split('T')[0],
      status: "未缴费",
      total: r.amount,
      items: [
        { name: `${r.materialName} x${r.quantity}${r.unit}`, amount: r.amount, type: "usage" }
      ]
    });
    toast.success(`已记录消耗，并生成账单扣费项：￥${r.amount}`);
  };

  const filteredRecords = records.filter(r => 
    r.elderName.includes(searchTerm) || r.materialName.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">全院长者物资消耗扣费</h1>
          <p className="text-slate-500 mt-1">记录长者使用的纸尿裤、护理垫等物资，并自动生成账单扣费项。</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            新建消耗冲减单
          </button>
        </div>
      </div>

      <Card>
        <div className="border-b border-slate-200">
          <div className="flex px-4 overflow-x-auto">
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'record' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setActiveTab('record'); setSearchTerm(''); }}
            >
              消耗登记流水
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'stock' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setActiveTab('stock'); setSearchTerm(''); }}
            >
              库存与扣费项目库
            </button>
          </div>
        </div>
        
        {activeTab === 'record' && (
          <>
            <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="搜索长者姓名、物资名称..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <button className="text-sm flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50">
                <Filter className="w-4 h-4" />
                高级筛选
              </button>
            </div>

            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">申请时间</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">长者姓名</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">消耗物资信息</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">计费金额(扣费)</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">登记人</th>
                    <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500">{r.time}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{r.elderName}</div>
                        <div className="text-xs text-slate-500">{r.bed}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <PackageOpen className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-medium text-slate-800">{r.materialName}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">数量: {r.quantity} {r.unit}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">¥{r.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{r.recorder}</td>
                      <td className="px-6 py-4">
                        {r.status === 'billed' ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            已计入账单
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">待复核扣费</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        暂无消耗记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </>
        )}

        {activeTab === 'stock' && (
          <>
            <div className="p-4 border-b border-slate-100 flex gap-3 items-center text-sm">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="搜索包含物资名称、编码..." 
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
            </div>
            <CardContent className="p-0 overflow-x-auto">
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-sm text-slate-600">
                  <span className="flex items-center gap-2"><Info className="w-4 h-4 text-blue-500"/> 列出可供长者单独记账扣费的物资及单价</span>
                  <button className="text-blue-600 font-medium hover:underline">管理扣费项目库</button>
               </div>
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">物资编码</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">物资名称</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">分类</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">记账单价</th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">当前库存</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredInventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">¥{item.price} <span className="text-xs font-normal text-slate-500">/{item.unit}</span></td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded inline-block ${item.stock > 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {item.stock} {item.unit}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">没有任何符合条件的物资</td>
                     </tr>
                  )}
                </tbody>
             </table>
          </CardContent>
          </>
        )}
      </Card>

      {/* 新增记录弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <ClipboardCopy className="w-5 h-5 text-blue-600" />
                登记长者物资消耗
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">相关长者 <span className="text-red-500">*</span></label>
                  <select 
                    value={newRecord.elder}
                    onChange={e => setNewRecord({...newRecord, elder: e.target.value})}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">--搜索或选择长者--</option>
                    <option value="1">张明宇 (A-101)</option>
                    <option value="2">李建国 (B-205)</option>
                  </select>
               </div>
               
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">使用物资/扣费项目 <span className="text-red-500">*</span></label>
                  <select 
                    value={newRecord.material}
                    onChange={e => setNewRecord({...newRecord, material: e.target.value})}
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="">--请选择扣费物资--</option>
                    {inventory.map(i => (
                      <option key={i.id} value={i.id}>{i.name} (¥{i.price}/{i.unit})</option>
                    ))}
                  </select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">消耗数量 <span className="text-red-500">*</span></label>
                    <input 
                      type="number" 
                      min="1"
                      value={newRecord.quantity}
                      onChange={e => setNewRecord({...newRecord, quantity: parseInt(e.target.value) || 0})}
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
                    />
                 </div>
                 <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="pb-2 text-sm">
                      预估计费: <span className="font-bold text-blue-600 text-lg ml-1">¥
                        {newRecord.material ? 
                          (parseFloat(inventory.find(i => i.id === newRecord.material)?.price || "0") * newRecord.quantity).toFixed(2) 
                          : "0.00"
                        }
                      </span>
                    </div>
                 </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">备注说明(选填)</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none h-20 placeholder-slate-400"
                    placeholder="例如：长者家属要求更换品牌..."
                  ></textarea>
               </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-white border border-slate-300 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSaveRecord}
                className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                disabled={!newRecord.elder || !newRecord.material || newRecord.quantity <= 0}
              >
                保存并生成账单记录
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
