import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, FileText, Search, PlusCircle, Filter, Edit3, Eye, FileSignature, X, Upload, Calendar, ArrowRight, ShieldCheck, Phone, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { generateCareReport } from "../services/aiService";
import { toast } from "sonner";
import { useStore } from "../store";

export function CustomerArchives() {
  const { customerArchives: archives, agreements } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signType, setSignType] = useState<'new' | 'renew'>('new');
  const [showOriginalModal, setShowOriginalModal] = useState(false);
  const [selectedArchive, setSelectedArchive] = useState<any>(null);
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState('');

  const handleGenerateReport = async () => {
    if (!selectedArchive) return;
    setIsGeneratingReport(true);
    setReportResult('');
    try {
      const mockCareRecords = [
        "今天 10:30 电话沟通，家属表示对A栋单间比较感兴趣，但还在对比价格。",
        "昨天 14:00 首次来访参观，对环境满意，长者需坐轮椅。"
      ];
      const mockHealthData = [
        "意向房型: 单间/双人包间",
        "关注点: 医疗配套、康复设施",
        "长者状态: 偏瘫康复期，意识清醒"
      ];
      const res = await generateCareReport(selectedArchive.name, mockCareRecords, mockHealthData);
      setReportResult(res);
      toast.success('客户意向跟进简报生成成功');
    } catch (e: any) {
      toast.error(e.message || '生成报告失败');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleOpenView = (archive: any) => {
    setSelectedArchive(archive);
    setReportResult('');
    setShowViewModal(true);
  };

  const handleOpenAgreement = (archive: any) => {
    setSelectedArchive(archive);
    setShowAgreementModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="mb-6 flex space-x-2 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">客户档案与协议</h2>
          <span className="text-sm text-slate-500">统一维护长者基本资料、协议签署及健康基础状态</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm">
            <PlusCircle className="h-4 w-4" />
            新建客户档案
          </button>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">
              档案库查询
            </CardTitle>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="姓名/身份证号/家属电话" 
                  className="pl-8 pr-4 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 w-64 bg-white shadow-sm"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-md text-sm hover:bg-slate-50">
                <Filter className="h-4 w-4" />
                高级筛选
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">长者信息</th>
                  <th className="px-6 py-4 font-medium">状态 / 护理级</th>
                  <th className="px-6 py-4 font-medium">主要联系人</th>
                  <th className="px-6 py-4 font-medium">建档时间</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {archives.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 flex items-center gap-2">
                            {item.name} 
                            <span className="text-xs font-normal text-slate-500">{item.gender} · {item.age}岁</span>
                            {item.agreementStatus === 'expiring' && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded">协议将到期</span>}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">档案号: {item.id} | {item.bedInfo}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          item.status === '已交定金' || item.status === '预定床位' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === '意向强烈' || item.status === '初次咨询' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{item.careLevel}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800">{item.familyContact}</div>
                      <div className="text-xs text-slate-500 mt-1">{item.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button onClick={() => handleOpenView(item)} className="text-slate-400 hover:text-emerald-600 p-1.5 transition-colors" title="查看主页">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="text-slate-400 hover:text-blue-600 p-1.5 transition-colors" title="编辑资料">
                        <Edit3 className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleOpenAgreement(item)} className="text-slate-400 hover:text-indigo-600 p-1.5 transition-colors" title="协议管理">
                        <FileSignature className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>共查询到 {archives?.length || 0} 条记录</div>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">上一页</button>
              <button className="px-3 py-1 border border-slate-200 bg-emerald-50 text-emerald-600 font-medium rounded">1</button>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
              <span className="px-2 py-1">...</span>
              <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">下一页</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新建/编辑客户档案 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">新建长者档案</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-6">
              {/* 基本资料 */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span> 基础信息
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">姓名 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="长者姓名" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">性别</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                      <option>男</option>
                      <option>女</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">出生日期 *</label>
                    <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">身份证号 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" placeholder="身份证等有效证件" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">医保类型</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                      <option>城镇职工医保</option>
                      <option>城乡居民医保</option>
                      <option>公费医疗</option>
                      <option>无</option>
                    </select>
                  </div>
                </div>
              </div>

               {/* 联系人信息 */}
               <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> 主要联系人
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">联系人姓名 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">关系</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                      <option>子女</option>
                      <option>配偶</option>
                      <option>亲属</option>
                      <option>其他</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">联系电话 *</label>
                    <input type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>
              </div>

               {/* 文件上传 */}
               <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span> 证件附件
                  </h4>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 group-hover:text-emerald-600 text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">点击或拖拽上传身份证、医保卡扫描件</p>
                    <p className="text-xs text-slate-500">支持 PDF, JPG, PNG 格式，单个最大 5MB</p>
                  </div>
               </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                取消
              </button>
               <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                保存档案
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 协议管理 Modal */}
      {showAgreementModal && selectedArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  协议与合同管理 
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{selectedArchive.name}</span>
                </h3>
              </div>
              <button onClick={() => setShowAgreementModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-5">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-slate-800">已签署协议列表</h4>
                <button 
                  onClick={() => { setSignType('new'); setShowSignModal(true); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-emerald-500 text-emerald-600 rounded text-sm font-medium hover:bg-emerald-50 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  新签协议
                </button>
              </div>

              <div className="space-y-4">
                {agreements.filter((a: any) => a.archiveId === selectedArchive?.id).map((agr: any) => (
                  <div key={agr.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                            {agr.title}
                            {agr.status === 'active' && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded font-medium">生效中</span>}
                          </div>
                          <div className="text-xs text-slate-500 mt-1">协议编号: {agr.id}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => { setSelectedAgreement(agr); setShowOriginalModal(true); }}
                          className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-50 font-medium"
                        >
                          查看原件
                        </button>
                        <button 
                          onClick={() => { setSelectedAgreement(agr); setSignType('renew'); setShowSignModal(true); }}
                          className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded hover:bg-slate-50 font-medium tracking-wide flex items-center gap-1"
                        >
                          续签 <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-3 mt-3">
                      <div>
                        <div className="text-[11px] text-slate-400 mb-0.5">生效日期</div>
                        <div className="text-sm font-medium text-slate-700">{agr.startDate}</div>
                      </div>
                      <div>
                         <div className="text-[11px] text-slate-400 mb-0.5">到期日期</div>
                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          {agr.endDate} 
                          <span className="text-[10px] text-amber-500 bg-amber-50 px-1 rounded">余 14 天</span>
                        </div>
                      </div>
                      <div>
                         <div className="text-[11px] text-slate-400 mb-0.5">担保人及负责家属</div>
                        <div className="text-sm font-medium text-slate-700">{agr.guarantor}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-white">
               <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 text-sm text-blue-800">
                 <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                 <div>
                   <span className="font-bold">电子签约功能已开通</span>
                   <p className="text-blue-600/80 mt-1 text-xs">家属可通过关联的小程序直接进行线上协议审阅与电子人脸识别签约，协议效力等同纸质。</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 长者主页 Modal (查看) */}
       {showViewModal && selectedArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-sm">
                   {selectedArchive.name.charAt(0)}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                     {selectedArchive.name}
                     <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selectedArchive.status === '已交定金' || selectedArchive.status === '预定床位' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                       {selectedArchive.status}
                     </span>
                   </h3>
                   <div className="text-sm text-slate-500 mt-1">
                     {selectedArchive.gender} · {selectedArchive.age}岁 · 建档于 {selectedArchive.date}
                   </div>
                 </div>
              </div>
              <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* 基本情况 */}
                  <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">居住与护理</div>
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">当前床位</span>
                        <span className="font-medium text-slate-800">{selectedArchive.bedInfo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">评估护理级</span>
                        <span className="font-medium text-blue-600 bg-blue-50 px-2 rounded-sm">{selectedArchive.careLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">餐饮偏好</span>
                        <span className="font-medium text-slate-800">低糖低盐普食</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 家属与微信绑定 */}
                  <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
                      家属及小程序绑定
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-slate-800 flex items-center gap-2">
                            {selectedArchive.familyContact.split(' ')[0]} 
                            <span className="text-xs text-slate-500 bg-slate-100 px-1.5 rounded">{selectedArchive.familyContact.split(' ')[1]?.replace(/[\(\)]/g, '')}</span>
                          </div>
                          <div className="text-slate-500 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedArchive.phone}</div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" /> 微信已绑定
                        </div>
                      </div>
                      <button className="w-full py-1.5 text-xs text-blue-600 bg-blue-50 font-medium rounded hover:bg-blue-100 transition">管理关联家属</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* 近期记录 */}
                  <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex justify-between items-center">
                      线索沟通与跟进记录摘要
                      <button 
                        onClick={handleGenerateReport}
                        disabled={isGeneratingReport}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded text-xs transition-colors font-medium border border-indigo-200"
                      >
                        {isGeneratingReport ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-indigo-500" />}
                        AI提炼潜在客户意向简报
                      </button>
                    </div>
                    <div className="p-4">
                       <div className="relative border-l-2 border-emerald-100 pl-4 py-1 space-y-4">
                         <div className="relative">
                            <div className="absolute -left-[21px] w-2 h-2 bg-emerald-500 rounded-full top-1.5"></div>
                            <div className="text-xs text-slate-400 mb-0.5">今天 10:30</div>
                            <div className="text-slate-700 font-medium">电话沟通，家属表示对A栋单间比较感兴趣，但还在对比价格。</div>
                         </div>
                         <div className="relative">
                            <div className="absolute -left-[21px] w-2 h-2 bg-emerald-500 rounded-full top-1.5"></div>
                            <div className="text-xs text-slate-400 mb-0.5">昨天 14:00</div>
                            <div className="text-slate-700 font-medium">首次来访参观，对环境满意，长者需坐轮椅。</div>
                         </div>
                       </div>
                       
                       {reportResult && (
                         <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg">
                           <h5 className="text-xs font-bold text-indigo-800 mb-2 flex items-center gap-1">
                             <Sparkles className="w-3 h-3 text-indigo-600" />
                             客户跟进与促单建议 (AI 生成)
                           </h5>
                           <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                             {reportResult}
                           </div>
                           <div className="mt-3 flex justify-end">
                             <button className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition">
                               保存至跟进档案
                             </button>
                           </div>
                         </div>
                       )}

                       <button className="mt-4 text-xs font-medium text-slate-500 hover:text-emerald-600 flex items-center gap-1">查看完整沟通流转台账 <ArrowRight className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 新签/续签协议 Modal */}
      {showSignModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {signType === 'new' ? '新签协议' : '续签协议'}
              </h3>
              <button onClick={() => setShowSignModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
               {signType === 'renew' && selectedAgreement && (
                  <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-2">
                    正在为协议 <span className="font-bold">{selectedAgreement.title}</span> ({selectedAgreement.id}) 进行续签操作。
                  </div>
               )}
               
               <div className="grid grid-cols-2 gap-5">
                 <div className="space-y-1.5">
                   <label className="text-sm font-medium text-slate-700">协议类型 *</label>
                   <select 
                     className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                     defaultValue={signType === 'renew' ? selectedAgreement?.title : ''}
                     disabled={signType === 'renew'}
                   >
                     <option value="">请选择协议类型</option>
                     <option value="机构养老服务合同">机构养老服务合同</option>
                     <option value="补充医疗照护协议">补充医疗照护协议</option>
                     <option value="膳食服务协议">膳食服务协议</option>
                     <option value="试住协议">试住协议</option>
                     <option value="安全告知书与免责协议">安全告知书与免责协议</option>
                   </select>
                 </div>
                 
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">签署方式 *</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white">
                      <option value="paper">纸质签约 (需上传附件)</option>
                      <option value="electronic">电子签约 (发送至家属小程序)</option>
                    </select>
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">生效日期 *</label>
                    <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">到期日期 *</label>
                    <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                 </div>

                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">担保人姓名</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" defaultValue={selectedArchive?.familyContact?.split(' ')[0]} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">担保人联系电话</label>
                    <input type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" defaultValue={selectedArchive?.phone} />
                 </div>
               </div>

               <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">协议原件附件 (纸质签约必须上传)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-emerald-500 hover:bg-emerald-50/50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-100 group-hover:text-emerald-600 text-slate-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mt-2">点击或拖拽上传协议扫描件/照片</p>
                    <p className="text-xs text-slate-500 mt-1">支持 PDF, JPG, PNG 格式，可上传多个文件</p>
                  </div>
               </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setShowSignModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                取消
              </button>
               <button onClick={() => setShowSignModal(false)} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">
                确定提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 查看原件 Modal */}
      {showOriginalModal && selectedAgreement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                 <FileText className="w-5 h-5 text-indigo-500" />
                 {selectedAgreement.title} 
                 <span className="text-xs font-normal text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">编号: {selectedAgreement.id}</span>
              </h3>
              <div className="flex gap-2">
                <button className="text-sm flex items-center gap-1 text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm transition"><Upload className="w-4 h-4" />重新上传</button>
                <button onClick={() => setShowOriginalModal(false)} className="text-slate-400 hover:text-slate-800 p-1.5 rounded-md hover:bg-slate-200 bg-white border border-slate-200 shadow-sm"><X className="w-5 h-5" /></button>
              </div>
            </div>
            <div className="flex-1 bg-slate-200 flex items-center justify-center relative p-8 h-full overflow-y-auto">
               {/* Dummy document preview */}
               <div className="bg-white shadow-lg w-full max-w-2xl min-h-[800px] border border-slate-300 p-12 text-sm text-slate-800 flex flex-col items-center">
                  <h1 className="text-2xl font-bold mb-8 text-center border-b border-slate-300 pb-4 w-full">养老机构服务合同</h1>
                  <div className="space-y-6 w-full leading-relaxed">
                    <p className="flex gap-2 w-full"><span className="font-semibold w-24">甲方 (长者):</span> <span className="border-b border-slate-400 flex-1 px-2">{selectedArchive?.name}</span></p>
                    <p className="flex gap-2 w-full"><span className="font-semibold w-24">乙方 (机构):</span> <span className="border-b border-slate-400 flex-1 px-2">珠江健康旗下星光老年服务中心</span></p>
                    <p className="flex gap-2 w-full"><span className="font-semibold w-24">丙方 (担保人):</span> <span className="border-b border-slate-400 flex-1 px-2">{selectedAgreement.guarantor}</span></p>
                    
                    <div className="pt-6 font-medium text-slate-700">根据《中华人民共和国民法典》及相关法律法规...</div>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-md mt-10 text-center text-slate-400 py-20 flex flex-col items-center justify-center border-dashed">
                       <FileText className="w-12 h-12 mb-4 text-slate-300" />
                       <p>[此处为合同扫描件原件预览区域，支持滚轮缩放、分页查看]</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

