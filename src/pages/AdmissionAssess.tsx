import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Clock, Search, Filter, Plus, FileText, CheckCircle2, XCircle, ChevronRight, UserPlus, FileSignature, X, ClipboardList, Check } from "lucide-react";

import { toast } from "sonner";
import { useStore } from "../store";

const adlItems = [
  { id: "eating", title: "进食", options: [{ label: "完全依赖", score: 0 }, { label: "需部分帮助", score: 5 }, { label: "全面自理", score: 10 }] },
  { id: "bathing", title: "洗澡", options: [{ label: "完全依赖", score: 0 }, { label: "自理", score: 5 }] },
  { id: "grooming", title: "修饰", options: [{ label: "完全依赖", score: 0 }, { label: "自理", score: 5 }] },
  { id: "dressing", title: "穿衣", options: [{ label: "完全依赖", score: 0 }, { label: "需部分帮助", score: 5 }, { label: "自理", score: 10 }] },
  { id: "bowel", title: "控制大便", options: [{ label: "失禁", score: 0 }, { label: "偶尔失禁", score: 5 }, { label: "能控制", score: 10 }] },
  { id: "bladder", title: "控制小便", options: [{ label: "失禁", score: 0 }, { label: "偶尔失禁", score: 5 }, { label: "能控制", score: 10 }] },
  { id: "toilet", title: "如厕", options: [{ label: "完全依赖", score: 0 }, { label: "需部分帮助", score: 5 }, { label: "自理", score: 10 }] },
  { id: "transfer", title: "床椅转移", options: [{ label: "完全依赖", score: 0 }, { label: "需大量帮助", score: 5 }, { label: "需少量帮助", score: 10 }, { label: "自理", score: 15 }] },
  { id: "mobility", title: "平地行走", options: [{ label: "不能行走", score: 0 }, { label: "在轮椅上活动", score: 5 }, { label: "需一人帮助", score: 10 }, { label: "独立行走", score: 15 }] },
  { id: "stairs", title: "上下楼梯", options: [{ label: "完全依赖", score: 0 }, { label: "需部分帮助", score: 5 }, { label: "自理", score: 10 }] },
];

export function AdmissionAssess() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showADLModal, setShowADLModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [adlScores, setAdlScores] = useState<Record<string, number>>({});
  const [assessmentForm, setAssessmentForm] = useState({ careLevel: '', totalScore: '' });

  const calculateTotal = (): number => {
    return Object.values(adlScores).reduce((a: number, b: number) => a + b, 0) as number;
  };

  const handleSaveADL = () => {
    setShowADLModal(false);
    const total = calculateTotal();
    
    let suggestedLevel = "";
    if (total === 100) suggestedLevel = "自理";
    else if (total > 60) suggestedLevel = "三级护理";
    else if (total > 40) suggestedLevel = "二级护理";
    else suggestedLevel = "一级护理";

    setAssessmentForm({ ...assessmentForm, totalScore: total.toString(), careLevel: suggestedLevel });
  };

  const [records, setRecords] = useState([
    { id: "ASM-20231101-01", name: "张明宇", age: 82, gender: "男", contact: "张小强 (儿子)", phone: "13800138000", scheduledDate: "2023-11-05 10:00", status: "pending", careLevel: "", assessor: "", remarks: "心脑血管疾病史，行动不便需要轮椅" },
    { id: "ASM-20231028-04", name: "李秀红", age: 76, gender: "女", contact: "王芳 (女儿)", phone: "13912345678", scheduledDate: "2023-10-30 14:00", status: "completed", careLevel: "二级护理", assessor: "刘医生, 张护张士长", remarks: "老年痴呆早期，生活基本自理但有走失风险，系统评定二级" },
    { id: "ASM-20231025-02", name: "赵建国", age: 88, gender: "男", contact: "赵建军 (儿子)", phone: "13700001111", scheduledDate: "2023-10-26 09:30", status: "cancelled", careLevel: "", assessor: "", remarks: "家属临时取消，考虑转去其他机构" },
  ]);

  const addAdmission = useStore(state => state.addAdmission);

  const handleOpenDetail = (record: any) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">预约评估登记</h1>
          <span className="text-sm text-slate-500">管理长者入住前的综合需求与健康能力评估预约</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
            <Plus className="h-4 w-4" />
            新建预约
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">待评估（未来七天）</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{records.filter(r => r.status === 'pending').length}</h3>
                  <span className="text-xs text-rose-500 font-medium">+1项加急</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">本月已完成评估</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{records.filter(r => r.status === 'completed').length}</h3>
                  <span className="text-xs text-emerald-600 font-medium">转换率 85%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <FileSignature className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">评估中心排班状态</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">正常</h3>
                  <span className="text-xs text-slate-500 font-medium">3名评估员在线</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-white pb-4 pt-5 px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-500" />
              预约评估台账
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="搜索长者姓名、电话、单号..." 
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-emerald-500 bg-white"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                <Filter className="w-4 h-4" />
                筛选状态
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50/80 border-b border-slate-100 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">评估单号</th>
                  <th className="px-6 py-4 font-medium">长者姓名 / 年龄</th>
                  <th className="px-6 py-4 font-medium">家属及联系方式</th>
                  <th className="px-6 py-4 font-medium">预约评估时间</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{item.name}</span>
                        <span className="text-xs text-slate-400">({item.gender}, {item.age}岁)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800">{item.contact}</div>
                      <div className="text-xs text-slate-500">{item.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.scheduledDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.status === 'pending' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {item.status === 'pending' && "待评估"}
                        {item.status === 'completed' && "已完成"}
                        {item.status === 'cancelled' && "已取消"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status === 'pending' ? (
                        <button onClick={() => handleOpenDetail(item)} className="text-white bg-indigo-600 hover:bg-indigo-700 font-medium text-xs px-3 py-1.5 rounded transition-colors shadow-sm">
                          开始评估
                        </button>
                      ) : (
                        <button onClick={() => handleOpenDetail(item)} className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors">
                          查看结果
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

      {/* 新建评估 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                新建预约评估
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">长者信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">姓名 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="例如：刘建国" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">年龄 *</label>
                    <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">性别</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
                      <option>男</option>
                      <option>女</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">家属联系人</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">姓名及关系 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="例如：刘小明 (儿子)" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">联系电话 *</label>
                    <input type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" placeholder="138xxxx..." />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">评估安排</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">预约时间 *</label>
                    <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">特别备注/病史概要</label>
                    <textarea 
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 min-h-[80px]" 
                      placeholder="例如：心脑血管病史、骨折恢复期等，帮助评估人员提前准备..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                取消
              </button>
               <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                创建预约单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 评估结果及详情 Modal */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 评估工单详情 
                 <span className="text-xs px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md font-normal shadow-sm">
                   {selectedRecord.id}
                 </span>
              </h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
               <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm">
                  <div className="grid grid-cols-3 gap-y-4 text-sm">
                     <div><span className="text-slate-400 block mb-1">长者姓名</span> <span className="font-medium text-slate-800">{selectedRecord.name} ({selectedRecord.gender}, {selectedRecord.age}岁)</span></div>
                     <div><span className="text-slate-400 block mb-1">家属及电话</span> {selectedRecord.contact}</div>
                     <div><span className="text-slate-400 block mb-1">预约评估时间</span> {selectedRecord.scheduledDate}</div>
                     <div className="col-span-3">
                        <span className="text-slate-400 block mb-1">病史及备注</span> 
                        <div className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed font-medium">
                           {selectedRecord.remarks}
                        </div>
                     </div>
                  </div>
               </div>

               {selectedRecord.status === 'pending' ? (
                  <div className="border border-indigo-100 bg-indigo-50/30 rounded-xl p-6">
                    <h4 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
                      <FileSignature className="w-5 h-5 text-indigo-500" />
                      录入评估结果
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">参与评估人员 *</label>
                          <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white" placeholder="医生、护士长等姓名" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">建议护理评级 *</label>
                          <select 
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white"
                            value={assessmentForm.careLevel}
                            onChange={(e) => setAssessmentForm({...assessmentForm, careLevel: e.target.value})}
                          >
                            <option value="">请选择评定护理级别</option>
                            <option value="特级护理">特级护理</option>
                            <option value="一级护理">一级护理</option>
                            <option value="二级护理">二级护理</option>
                            <option value="三级护理">三级护理</option>
                            <option value="专护/认知症护理">专护/认知症护理</option>
                            <option value="自理">自理</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">常规ADL评估得分</label>
                          <div className="flex gap-2">
                             <input 
                               type="number" 
                               readOnly
                               value={assessmentForm.totalScore}
                               className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 cursor-not-allowed text-indigo-700 font-bold" 
                               placeholder="自动计算" 
                             />
                             <button onClick={() => setShowADLModal(true)} className="px-3 py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap shadow-sm">
                               <ClipboardList className="w-4 h-4" />
                               在线评估量表
                             </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-700">附件上传 (体检单/病历等)</label>
                          <input type="file" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 bg-white" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">综合评估意见 *</label>
                        <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 min-h-[100px] bg-white" placeholder="记录主要评估结论，以及对入住后照护建议的重点..."></textarea>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-end gap-3">
                       <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        仅归档
                      </button>
                       <button 
                          onClick={() => {
                              addAdmission({
                                id: `ADM-${new Date().toISOString().replace(/\D/g, '').slice(0,8)}-${Math.floor(Math.random()*90+10)}`,
                                name: selectedRecord.name,
                                assessmentLevel: assessmentForm.careLevel || "二级护理",
                                family: selectedRecord.contact.split(' ')[0],
                                phone: selectedRecord.phone,
                                idCard: "110105194001011234",
                                status: "pending",
                                progress: { info: false, bed: false, contract: false, payment: false }
                              });
                              setRecords(records.map(r => r.id === selectedRecord.id ? { ...r, status: 'completed', careLevel: assessmentForm.careLevel || "二级护理" } : r));
                              setShowDetailModal(false);
                              toast.success("评估已归档，并成功流转至【入住办理】");
                          }}
                          className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap">
                        提交评估并流转入住办理
                      </button>
                    </div>
                  </div>
               ) : selectedRecord.status === 'completed' ? (
                  <div className="border border-emerald-100 bg-emerald-50/20 rounded-xl p-6">
                    <h4 className="text-base font-bold text-emerald-800 flex items-center gap-2 mb-4 border-b border-emerald-100 pb-2">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                       评估综合结果
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4 text-sm mt-4">
                       <div><span className="text-slate-400 block mb-1">建议护理评级</span> <span className="font-bold text-emerald-700 text-lg px-3 py-1 bg-emerald-100 rounded-md">{selectedRecord.careLevel}</span></div>
                       <div><span className="text-slate-400 block mb-1">评估专员组成</span> <span className="font-medium text-slate-800">{selectedRecord.assessor}</span></div>
                       <div><span className="text-slate-400 block mb-1">总计得分</span> <span className="font-medium text-slate-800">75 / 100</span></div>
                       <div><span className="text-slate-400 block mb-1">相关附件</span> <a href="#" className="text-indigo-600 hover:underline">ADL量表扫描件.pdf</a></div>
                       <div className="col-span-2">
                          <span className="text-slate-400 block mb-1">详细评估意见总结</span> 
                          <div className="text-slate-700 leading-relaxed font-medium bg-white p-3 border border-emerald-200 rounded-lg">
                            同意以上建议护理评级。该老人日常生活部分需要协助，主要存在阿尔茨海默症初期症状。请注意防范走失，房间分配时建议安排在一楼或接近护士站便于看护的位置。
                          </div>
                       </div>
                    </div>
                    
                    <div className="mt-6 border-t border-emerald-100 pt-5 flex justify-end">
                       <button onClick={() => setShowDetailModal(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors">
                        关闭窗口
                      </button>
                    </div>
                  </div>
               ) : (
                  <div className="border border-slate-200 bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 min-h-[200px]">
                     <XCircle className="w-10 h-10 mb-3 text-slate-300" />
                     <p>该评估单已被取消。</p>
                  </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* ADL 量表在线评估 Modal */}
      {showADLModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-indigo-100 bg-indigo-50/50">
              <div>
                 <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-indigo-500" />
                    Barthel (ADL) 日常生活能力评定量表
                 </h3>
                 <p className="text-sm text-slate-500 mt-1">请根据长者实际生活能力独立完成情况进行客观勾选，系统将自动计算分数及护理评级建议。</p>
              </div>
              <button onClick={() => setShowADLModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
               <div className="space-y-6">
                 {adlItems.map((item, idx) => (
                   <div key={item.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm">{idx + 1}</span>
                        {item.title}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                         {item.options.map(option => {
                           const isSelected = adlScores[item.id] === option.score;
                           return (
                             <button
                               key={`${item.id}-${option.score}`}
                               onClick={() => setAdlScores({ ...adlScores, [item.id]: option.score })}
                               className={`flex-1 min-w-[120px] p-3 rounded-lg border-2 text-left transition-all relative overflow-hidden ${
                                 isSelected 
                                 ? 'border-indigo-500 bg-indigo-50' 
                                 : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50'
                               }`}
                             >
                               {isSelected && (
                                 <div className="absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] border-t-indigo-500 border-r-transparent">
                                   <Check className="absolute -top-[22px] right-1 w-3 h-3 text-white" />
                                 </div>
                               )}
                               <div className={`font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>{option.label}</div>
                               <div className={`text-xs mt-1 ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>{option.score} 分</div>
                             </button>
                           );
                         })}
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="p-5 border-t border-slate-100 flex items-center justify-between bg-white">
               <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500">当前总得分：</div>
                  <div className="text-3xl font-bold text-indigo-600">{calculateTotal()} <span className="text-sm text-slate-400 font-normal">/ 100</span></div>
                  {Object.keys(adlScores).length < adlItems.length && (
                    <div className="text-sm text-amber-500 bg-amber-50 px-2 py-1 rounded">还有 {adlItems.length - Object.keys(adlScores).length} 项未评估</div>
                  )}
               </div>
               <div className="flex gap-3">
                 <button onClick={() => setShowADLModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                   暂存并关闭
                 </button>
                 <button 
                   onClick={handleSaveADL} 
                   disabled={Object.keys(adlScores).length < adlItems.length}
                   className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
                     Object.keys(adlScores).length < adlItems.length 
                     ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                     : 'bg-indigo-600 text-white hover:bg-indigo-700'
                   }`}
                 >
                   <CheckCircle2 className="w-4 h-4" />确认提交评估结果
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
