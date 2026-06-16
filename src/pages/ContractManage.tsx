import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Search, Plus, Filter, FileText, Clock, CalendarDays, Calculator, X } from "lucide-react";
import { useStore } from "../store";
import { toast } from "sonner";

export function ContractManage() {
  const [activeTab, setActiveTab] = useState('active');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const addBill = useStore(state => state.addBill);
  const elders = useStore(state => state.elders);

  const [contracts, setContracts] = useState([
    {
      id: "HT-20231015-001",
      elderName: "张明宇",
      bed: "A栋-101床",
      startDate: "2023-10-15",
      endDate: "2024-10-14",
      bedFee: 3500,
      careFee: 2500,
      careLevel: "二级护理",
      mealFee: 1200,
      total: 7200,
      status: "active",
      daysLeft: 169
    },
    {
      id: "HT-20230501-008",
      elderName: "李建国",
      bed: "B栋-205床",
      startDate: "2023-05-01",
      endDate: "2024-04-30",
      bedFee: 3000,
      careFee: 1500,
      careLevel: "一级护理",
      mealFee: 1200,
      total: 5700,
      status: "active",
      daysLeft: 2
    }
  ]);

  const [newContract, setNewContract] = useState({
    elder: "",
    bed: "",
    startDate: "",
    endDate: "",
    bedFee: 3000,
    careFee: 1500,
    mealFee: 1200
  });

  const handleSaveContract = () => {
    if (!newContract.elder || !newContract.startDate || !newContract.endDate) return;

    // Use full list of elders or fallback
    const elderObj = elders.find(e => e.id === newContract.elder) || { name: newContract.elder === "1" ? "新长者A" : "新长者B" };

    const c = {
      id: `HT-${newContract.startDate.replace(/-/g, '')}-00${contracts.length + 1}`,
      elderName: elderObj.name,
      bed: newContract.bed,
      startDate: newContract.startDate,
      endDate: newContract.endDate,
      bedFee: newContract.bedFee,
      careFee: newContract.careFee,
      careLevel: "评估护理",
      mealFee: newContract.mealFee,
      total: newContract.bedFee + newContract.careFee + newContract.mealFee,
      status: "active",
      daysLeft: 365
    };

    setContracts([c, ...contracts]);
    
    // Add bill
    addBill({
      id: `BILL-INT-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${Math.floor(Math.random() * 90 + 10)}`,
      elder: c.elderName,
      room: c.bed,
      period: "合同签约及首期缴费",
      dueDate: newContract.startDate,
      status: "未缴费",
      total: c.total + 5000, // 包含首月费用 + 押金 5000
      items: [
        { name: "首月床位费", amount: c.bedFee.toString(), type: "cycle" },
        { name: "首月护理费", amount: c.careFee.toString(), type: "cycle" },
        { name: "首月餐饮费", amount: c.mealFee.toString(), type: "cycle" },
        { name: "入住医疗保证金（押金）", amount: "5000", type: "deposit" }
      ]
    });
    
    toast.success("入住合同已生成，计费引擎已自动激活，并同步生成押金及首期账单待缴");

    setShowAddModal(false);
  };

  const filteredContracts = contracts.filter(c => 
    c.elderName.includes(searchTerm) || c.id.includes(searchTerm)
  );

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">周期合同与计费引擎</h1>
          <p className="text-slate-500 mt-1">管理长者入住合同、护理级别费用及按月周期性自动扣费计划。</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            新建入住合同
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">生效中合同</p>
              <h3 className="text-2xl font-bold text-slate-800">{contracts.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">本月即将到期</p>
              <h3 className="text-2xl font-bold text-slate-800">{contracts.filter(c => c.daysLeft <= 30).length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">本月预估计费(元)</p>
              <h3 className="text-2xl font-bold text-slate-800">{(contracts.reduce((acc, curr) => acc + curr.total, 0)).toLocaleString()}.00</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="border-b border-slate-200">
          <div className="flex px-4 overflow-x-auto">
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'active' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('active')}
            >
              生效中合同
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'expired' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('expired')}
            >
              已到期/解约
            </button>
            <button 
              className={`whitespace-nowrap px-4 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'billing' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={() => setActiveTab('billing')}
            >
              计费规则执行单
            </button>
          </div>
        </div>
        
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="搜索长者姓名、合同编号..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button className="text-sm flex items-center gap-2 text-slate-600 border border-slate-200 bg-white px-3 py-2 rounded-lg hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            高级筛选
          </button>
        </div>

        <CardContent className="p-0 overflow-x-auto">
          {activeTab === 'active' ? (
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">合同编号/长者</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">床位信息</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">合同周期</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">月度固定收费大纲</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContracts.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{c.elderName}</div>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">{c.id}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{c.bed}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-800">{c.startDate} 至 {c.endDate}</div>
                      <div className={`text-xs flex items-center gap-1 mt-1 ${c.daysLeft <= 30 ? 'text-red-500 font-bold' : 'text-amber-600'}`}>
                        <CalendarDays className="w-3 h-3"/> 还有 {c.daysLeft} 天到期
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">床位费: {c.bedFee}元/月</div>
                      <div className="text-sm">护理费: {c.careFee}元/月 ({c.careLevel})</div>
                      <div className="text-sm">伙食费: {c.mealFee}元/月</div>
                      <div className="text-xs text-slate-500 mt-1 font-bold">合计: {c.total}元/月</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">生效中</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">详情</button>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">变更</button>
                    </td>
                  </tr>
                ))}
                {filteredContracts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      无符合条件的合同
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-slate-500">
              数据加载中...
            </div>
          )}
        </CardContent>
      </Card>

      {/* 新建合同弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col pt-0 animate-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                 <FileText className="w-5 h-5 text-blue-600" />
                 新建长者入住合同
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">关联长者 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                      value={newContract.elder}
                      onChange={e => setNewContract({...newContract, elder: e.target.value})}
                    >
                      <option value="">--选择待签长者--</option>
                      <option value="1">张爷爷</option>
                      <option value="2">李奶奶</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">分配床位 <span className="text-red-500">*</span></label>
                    <select 
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                      value={newContract.bed}
                      onChange={e => setNewContract({...newContract, bed: e.target.value})}
                    >
                      <option value="">--选择空闲床位--</option>
                      <option value="C栋-301床">C栋-301床</option>
                      <option value="C栋-302床">C栋-302床</option>
                    </select>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">合同开始日期 <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" 
                      value={newContract.startDate}
                      onChange={e => setNewContract({...newContract, startDate: e.target.value})}
                    />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">合同结束日期 <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" 
                      value={newContract.endDate}
                      onChange={e => setNewContract({...newContract, endDate: e.target.value})}
                    />
                 </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
                 <h4 className="font-medium text-sm text-slate-800">计费引擎规则设定 (按月生成账单)</h4>
                 
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">床位费基数</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                          <input type="number" value={newContract.bedFee} onChange={e => setNewContract({...newContract, bedFee: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-md pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">护理费基数</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                          <input type="number" value={newContract.careFee} onChange={e => setNewContract({...newContract, careFee: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-md pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                       </div>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-xs font-medium text-slate-600">固定伙食费基数</label>
                       <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">¥</span>
                          <input type="number" value={newContract.mealFee} onChange={e => setNewContract({...newContract, mealFee: parseInt(e.target.value) || 0})} className="w-full border border-slate-300 rounded-md pl-7 pr-3 py-1.5 text-sm focus:outline-none focus:border-blue-500" />
                       </div>
                    </div>
                 </div>

                 <div className="pt-2 flex justify-between items-center border-t border-slate-200 border-dashed">
                    <span className="text-sm font-bold text-slate-700">每月固定生成账单金额</span>
                    <span className="text-xl font-bold text-blue-600">¥{(newContract.bedFee + newContract.careFee + newContract.mealFee).toLocaleString()}</span>
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-sm font-medium text-slate-700">附件合同扫描件</label>
                 <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <p className="text-sm">点击或拖拽上传 PDF/图片 格式的合同扫描件</p>
                 </div>
              </div>

            </div>
            
            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3 sticky bottom-0 z-10">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-white border border-slate-300 rounded-lg transition-colors">
                取消
              </button>
              <button 
                onClick={handleSaveContract}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                disabled={!newContract.elder || !newContract.startDate || !newContract.endDate}
              >
                保存合同并激活计费引擎
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
