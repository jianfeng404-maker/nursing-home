import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useStore } from "../store";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Search, Plus, Filter, FileText, CheckCircle2, AlertCircle, Clock, X, ClipboardList, Activity } from "lucide-react";

const adlItems = [
  { id: 'adl1', title: '进食 (进食动作、使用餐具等)', options: [{ label: '10分 (完全独立)', score: 10 }, { label: '5分 (需部分帮助)', score: 5 }, { label: '0分 (完全依赖)', score: 0 }] },
  { id: 'adl2', title: '洗澡 (盆浴或淋浴)', options: [{ label: '5分 (独立完成)', score: 5 }, { label: '0分 (需他人帮助)', score: 0 }] },
  { id: 'adl3', title: '修饰 (洗脸、刷牙、刮胡、梳头)', options: [{ label: '5分 (独立完成)', score: 5 }, { label: '0分 (需他人帮助)', score: 0 }] },
  { id: 'adl4', title: '穿衣', options: [{ label: '10分 (独立完成)', score: 10 }, { label: '5分 (需一半帮助)', score: 5 }, { label: '0分 (完全依赖)', score: 0 }] },
  { id: 'adl5', title: '大便控制', options: [{ label: '10分 (控制良好)', score: 10 }, { label: '5分 (偶尔失控)', score: 5 }, { label: '0分 (完全失控)', score: 0 }] },
  { id: 'adl6', title: '小便控制', options: [{ label: '10分 (控制良好)', score: 10 }, { label: '5分 (偶尔失控)', score: 5 }, { label: '0分 (完全失控)', score: 0 }] },
  { id: 'adl7', title: '如厕', options: [{ label: '10分 (独立完成)', score: 10 }, { label: '5分 (需部分帮助)', score: 5 }, { label: '0分 (完全依赖)', score: 0 }] },
  { id: 'adl8', title: '床椅转移', options: [{ label: '15分 (独立完成)', score: 15 }, { label: '10分 (需少许帮助)', score: 10 }, { label: '5分 (需大量帮助)', score: 5 }, { label: '0分 (完全依赖)', score: 0 }] },
  { id: 'adl9', title: '平地行走', options: [{ label: '15分 (独立行走45米以上)', score: 15 }, { label: '10分 (需1人搀扶/使用辅具)', score: 10 }, { label: '5分 (轮椅行进)', score: 5 }, { label: '0分 (卧床)', score: 0 }] },
  { id: 'adl10', title: '上下楼梯', options: [{ label: '10分 (独立上下)', score: 10 }, { label: '5分 (需部分帮助)', score: 5 }, { label: '0分 (无法上下楼梯)', score: 0 }] },
];

const mmseItems = [
  { id: 'mmse1', title: '定向力 (时间：年、月、日、周、季)', options: [{ label: '5分 (完全清楚)', score: 5 }, { label: '3分 (部分清楚)', score: 3 }, { label: '0分 (完全混淆)', score: 0 }] },
  { id: 'mmse2', title: '定向力 (地点：省、市、医院、科室、层)', options: [{ label: '5分 (完全清楚)', score: 5 }, { label: '3分 (部分清楚)', score: 3 }, { label: '0分 (完全混淆)', score: 0 }] },
  { id: 'mmse3', title: '记忆力 (瞬时记忆：3个物品)', options: [{ label: '3分 (全部记住)', score: 3 }, { label: '2分 (记住2个)', score: 2 }, { label: '0分 (完全忘记)', score: 0 }] },
  { id: 'mmse4', title: '注意力和计算力 (100连续减7)', options: [{ label: '5分 (对5次)', score: 5 }, { label: '3分 (对3次)', score: 3 }, { label: '0分 (全错/无法计算)', score: 0 }] },
  { id: 'mmse5', title: '回忆力 (延迟回忆前面的3个物品)', options: [{ label: '3分 (全部记住)', score: 3 }, { label: '1分 (记住1个)', score: 1 }, { label: '0分 (完全忘记)', score: 0 }] },
  { id: 'mmse6', title: '语言能力 (命名、复述、理解、书写)', options: [{ label: '9分 (完全正常)', score: 9 }, { label: '5分 (部分障碍)', score: 5 }, { label: '0分 (严重障碍)', score: 0 }] },
];

const bradenItems = [
  { id: 'braden1', title: '感觉认知', options: [{ label: '4分 (未受损)', score: 4 }, { label: '3分 (轻度受损)', score: 3 }, { label: '2分 (重度受损)', score: 2 }, { label: '1分 (完全受损)', score: 1 }] },
  { id: 'braden2', title: '潮湿程度', options: [{ label: '4分 (很少潮湿)', score: 4 }, { label: '3分 (偶尔潮湿)', score: 3 }, { label: '2分 (经常潮湿)', score: 2 }, { label: '1分 (持续潮湿)', score: 1 }] },
  { id: 'braden3', title: '活动能力', options: [{ label: '4分 (经常步行)', score: 4 }, { label: '3分 (偶尔步行)', score: 3 }, { label: '2分 (局限椅上)', score: 2 }, { label: '1分 (卧床不起)', score: 1 }] },
  { id: 'braden4', title: '移动能力', options: [{ label: '4分 (不受限)', score: 4 }, { label: '3分 (轻微受限)', score: 3 }, { label: '2分 (严重受限)', score: 2 }, { label: '1分 (完全不能移动)', score: 1 }] },
  { id: 'braden5', title: '营养摄取', options: [{ label: '4分 (良好)', score: 4 }, { label: '3分 (充足)', score: 3 }, { label: '2分 (可能不足)', score: 2 }, { label: '1分 (非常差)', score: 1 }] },
  { id: 'braden6', title: '摩擦力和剪切力', options: [{ label: '3分 (无问题)', score: 3 }, { label: '2分 (有潜在问题)', score: 2 }, { label: '1分 (有问题)', score: 1 }] },
];

const morseItems = [
  { id: 'morse1', title: '近3个月内是否有跌倒史', options: [{ label: '0分 (无)', score: 0 }, { label: '25分 (有)', score: 25 }] },
  { id: 'morse2', title: '是否有多于一个的疾病诊断', options: [{ label: '0分 (无)', score: 0 }, { label: '15分 (有)', score: 15 }] },
  { id: 'morse3', title: '行走辅助器具', options: [{ label: '0分 (无/卧床/轮椅/护士搀扶)', score: 0 }, { label: '15分 (拐杖/手杖/助行器)', score: 15 }, { label: '30分 (扶家具行走)', score: 30 }] },
  { id: 'morse4', title: '静脉输液或使用肝素锁', options: [{ label: '0分 (无)', score: 0 }, { label: '20分 (有)', score: 20 }] },
  { id: 'morse5', title: '步态/转移', options: [{ label: '0分 (正常/卧床/轮椅)', score: 0 }, { label: '10分 (虚弱)', score: 10 }, { label: '20分 (障碍/失调)', score: 20 }] },
  { id: 'morse6', title: '精神状态', options: [{ label: '0分 (量力而行，意识清醒)', score: 0 }, { label: '15分 (高估自己能力或忘记限制)', score: 15 }] },
];

const gdsItems = [
  { id: 'gds1', title: '1. 你对生活基本满意吗？', options: [{ label: '0分 (是)', score: 0 }, { label: '1分 (否)', score: 1 }] },
  { id: 'gds2', title: '2. 你是否放弃了许多活动和兴趣？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds3', title: '3. 你是否觉得生活空虚？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds4', title: '4. 你是否常感到厌倦？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds5', title: '5. 你是否常常心境良好？', options: [{ label: '0分 (是)', score: 0 }, { label: '1分 (否)', score: 1 }] },
  { id: 'gds6', title: '6. 你是否害怕有不好的事情发生？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds7', title: '7. 你是否大部分时间感到快乐？', options: [{ label: '0分 (是)', score: 0 }, { label: '1分 (否)', score: 1 }] },
  { id: 'gds8', title: '8. 你是否常感到无助？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds9', title: '9. 你是否宁愿留在家里，而不愿去做些新鲜事？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds10', title: '10. 你是否觉得记忆力比大多数人差？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds11', title: '11. 你是否认为现在活着很棒？', options: [{ label: '0分 (是)', score: 0 }, { label: '1分 (否)', score: 1 }] },
  { id: 'gds12', title: '12. 你是否感到现在毫无价值？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds13', title: '13. 你是否感到精力充沛？', options: [{ label: '0分 (是)', score: 0 }, { label: '1分 (否)', score: 1 }] },
  { id: 'gds14', title: '14. 你是否感到处境无望？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
  { id: 'gds15', title: '15. 你是否觉得大多数人比你强？', options: [{ label: '0分 (否)', score: 0 }, { label: '1分 (是)', score: 1 }] },
];

const mnaItems = [
  { id: 'mna1', title: 'A. 过去三个月内是否由于食欲减退、消化问题、咀嚼或吞咽困难而减少食量？', options: [{ label: '0分 (严重减少)', score: 0 }, { label: '1分 (中度减少)', score: 1 }, { label: '2分 (食量未减少)', score: 2 }] },
  { id: 'mna2', title: 'B. 过去三个月内体重下降情况？', options: [{ label: '0分 (体重下降>3kg)', score: 0 }, { label: '1分 (不知道)', score: 1 }, { label: '2分 (体重下降1-3kg)', score: 2 }, { label: '3分 (无体重下降)', score: 3 }] },
  { id: 'mna3', title: 'C. 活动能力？', options: [{ label: '0分 (需卧床或长期坐着)', score: 0 }, { label: '1分 (能下床但不能外出)', score: 1 }, { label: '2分 (能独立外出)', score: 2 }] },
  { id: 'mna4', title: 'D. 过去三个月内有没有受过重大压力或急性疾病？', options: [{ label: '0分 (有)', score: 0 }, { label: '2分 (无)', score: 2 }] },
  { id: 'mna5', title: 'E. 神经精神疾病？', options: [{ label: '0分 (严重痴呆或抑郁)', score: 0 }, { label: '1分 (轻度痴呆)', score: 1 }, { label: '2分 (无精神心理问题)', score: 2 }] },
  { id: 'mna6', title: 'F. BMI体质指数？(BMI=体重kg/身高m²)', options: [{ label: '0分 (BMI<19)', score: 0 }, { label: '1分 (19≤BMI<21)', score: 1 }, { label: '2分 (21≤BMI<23)', score: 2 }, { label: '3分 (BMI≥23)', score: 3 }] },
];

export function CareAssess({ embedded, elderId }: { embedded?: boolean, elderId?: string | null }) {
  const [activeTab, setActiveTab] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  
  const [newFormElderId, setNewFormElderId] = useState<string>('');
  const [newFormType, setNewFormType] = useState<string>('');
  const [newFormDate, setNewFormDate] = useState<string>('');
  const [newFormAssessor, setNewFormAssessor] = useState<string>('');
  
  const { assessments, addAssessment, updateAssessment, elders, staff } = useStore();

  const displayAssessments = embedded && elderId 
    ? assessments.filter(a => a.elderId === elderId)
    : assessments;

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">综合评估管理</h2>
          <p className="text-slate-500 text-sm mt-1">管理长者的各项专业评估问卷、评分与风险等级</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowNewModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
            <Plus className="w-4 h-4" /> 新建评估单
          </button>
        </div>
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/50 mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['all', 'pending', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'all' && '全部评估任务'}
                  {tab === 'pending' && '待评估'}
                  {tab === 'completed' && '已完成'}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索长者姓名..."
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                <Filter className="w-4 h-4" /> 筛选
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">评估单号</th>
                <th className="px-6 py-4 font-medium">长者姓名</th>
                <th className="px-6 py-4 font-medium">评估类型</th>
                <th className="px-6 py-4 font-medium">评估结果/得分</th>
                <th className="px-6 py-4 font-medium">评估人</th>
                <th className="px-6 py-4 font-medium">评估日期</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {displayAssessments.filter(a => activeTab === 'all' || (activeTab === 'pending' && a.status === '待评估') || (activeTab === 'completed' && a.status === '已完成')).map((assessment) => (
                <tr key={assessment.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{assessment.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{assessment.elderName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{assessment.room}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-medium">
                      {assessment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{assessment.status === '待评估' ? '-' : assessment.score}</td>
                  <td className="px-6 py-4">{assessment.assessor}</td>
                  <td className="px-6 py-4">{assessment.date}</td>
                  <td className="px-6 py-4">
                    {assessment.status === '已完成' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3" /> 已完成
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-medium">
                        <Clock className="w-3 h-3" /> 待评估
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { 
                      setSelectedAssessment(assessment); 
                      if (assessment.status === '待评估') {
                        setAssessmentAnswers({});
                        setShowEvalModal(true);
                      } else {
                        setShowReportModal(true);
                      }
                    }} className="text-indigo-600 hover:text-indigo-800 font-medium">
                      {assessment.status === '待评估' ? '去评估' : '查看报告'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 新建评估单 Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <Plus className="w-5 h-5 text-indigo-600" />
                   新建评估单
                </h3>
                <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6">
                <div className="space-y-4">
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">选择长者 *</label>
                     <select 
                        disabled={!!(embedded && elderId)} 
                        value={embedded && elderId ? elderId : newFormElderId}
                        onChange={(e) => setNewFormElderId(e.target.value)}
                        className={`w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 ${embedded && elderId ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white'}`}
                     >
                        <option value="">请选择长者</option>
                        {elders.map(e => (
                           <option key={e.id} value={e.id}>{e.name} ({e.room})</option>
                        ))}
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">评估类型 *</label>
                     <select value={newFormType} onChange={(e) => setNewFormType(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                        <option value="">请选择评估量表</option>
                        <option value="日常生活能力评定 (ADL / Barthel)">日常生活能力评定 (ADL / Barthel)</option>
                        <option value="精神状态评估 (MMSE)">精神状态评估 (MMSE)</option>
                        <option value="压疮风险评估 (Braden)">压疮风险评估 (Braden)</option>
                        <option value="跌倒坠床风险评估 (Morse)">跌倒坠床风险评估 (Morse)</option>
                        <option value="老年抑郁量表 (GDS-15)">老年抑郁量表 (GDS-15)</option>
                        <option value="微型营养状态评估 (MNA-SF)">微型营养状态评估 (MNA-SF)</option>
                     </select>
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">计划评估日期</label>
                     <input type="date" value={newFormDate} onChange={(e) => setNewFormDate(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white" />
                   </div>
                   <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">指派评估人员</label>
                     <select value={newFormAssessor} onChange={(e) => setNewFormAssessor(e.target.value)} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 bg-white">
                        <option value="">请选择评估人</option>
                        {staff.filter(s => s.role === '主管' || s.dept.includes('医疗') || s.dept.includes('评估')).map(s => (
                           <option key={s.id} value={s.name}>{s.name} ({s.position})</option>
                        ))}
                     </select>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowNewModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
                <button 
                  onClick={() => {
                     if (!newFormType || (!newFormElderId && !(embedded && elderId))) return toast.error('请填写必填项');
                     const targetElderId = embedded && elderId ? elderId : newFormElderId;
                     const elder = elders.find(e => e.id === targetElderId);
                     if (!elder) return;

                     addAssessment({
                        id: `ASM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                        elderId: targetElderId,
                        elderName: elder.name,
                        room: elder.room,
                        type: newFormType,
                        score: '-',
                        assessor: newFormAssessor || '系统排程',
                        date: newFormDate || new Date().toISOString().split('T')[0],
                        status: '待评估',
                     });
                     toast.success("评估任务已创建");
                     setShowNewModal(false);
                     setNewFormType('');
                     setNewFormElderId('');
                   }} 
                   className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  确认下发
                </button>
             </div>
          </div>
        </div>
      )}

      {/* 填写评估单 Modal (去评估) */}
      {showEvalModal && selectedAssessment && (() => {
        const getScaleData = () => {
          if (!selectedAssessment) return { items: [], name: '', maxScore: 0 };
          if (selectedAssessment.type.includes('MMSE')) return { items: mmseItems, name: '精神状态评估 (MMSE)', maxScore: 30 };
          if (selectedAssessment.type.includes('跌倒')) return { items: morseItems, name: '跌倒坠床风险评估 (Morse)', maxScore: 125 };
          if (selectedAssessment.type.includes('压疮')) return { items: bradenItems, name: '压疮风险评估 (Braden)', maxScore: 23 };
          if (selectedAssessment.type.includes('抑郁') || selectedAssessment.type.includes('GDS')) return { items: gdsItems, name: '老年抑郁量表 (GDS-15)', maxScore: 15 };
          if (selectedAssessment.type.includes('营养') || selectedAssessment.type.includes('MNA')) return { items: mnaItems, name: '微型营养状态评估 (MNA-SF)', maxScore: 14 };
          return { items: adlItems, name: '日常生活能力评定 (ADL / Barthel)', maxScore: 100 };
        };
        const scaleData = getScaleData();
        const currentScore = (Object.values(assessmentAnswers) as number[]).reduce((a, b) => a + b, 0);
        const isScaleComplete = scaleData.items.length > 0 && Object.keys(assessmentAnswers).length === scaleData.items.length;
        
        const getScoreLabel = () => {
          if (scaleData.name.includes('ADL')) {
            return currentScore > 60 ? '生活自理' : currentScore > 40 ? '中度依赖' : '重度依赖';
          }
          if (scaleData.name.includes('MMSE')) {
            return currentScore >= 27 ? '认知正常' : currentScore >= 21 ? '轻度认知障碍' : currentScore >= 10 ? '中度痴呆' : '重度痴呆';
          }
          if (scaleData.name.includes('Morse')) {
            return currentScore >= 45 ? '高风险' : currentScore >= 25 ? '中风险' : '低风险';
          }
          if (scaleData.name.includes('Braden')) {
            return currentScore >= 18 ? '无风险' : currentScore >= 15 ? '低度风险' : currentScore >= 13 ? '中度风险' : '高度风险';
          }
          if (scaleData.name.includes('GDS')) {
            return currentScore >= 11 ? '重度抑郁' : currentScore >= 5 ? '轻度抑郁' : '正常';
          }
          if (scaleData.name.includes('MNA')) {
            return currentScore >= 12 ? '营养正常' : currentScore >= 8 ? '营养不良风险' : '营养不良';
          }
          return currentScore >= scaleData.maxScore * 0.8 ? '良好' : '异常';
        };

        return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <ClipboardList className="w-5 h-5 text-indigo-600" />
                   {selectedAssessment.type} - 填写问卷
                </h3>
                <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-6 flex gap-4">
                   <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 shrink-0 text-xl border border-white shadow-sm">{selectedAssessment.elderName[0]}</div>
                   <div>
                     <p className="font-bold text-slate-800 mb-1">{selectedAssessment.elderName} ({selectedAssessment.room})</p>
                     <p className="text-sm text-slate-500">评估人员: {selectedAssessment.assessor} · {selectedAssessment.date}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-5 py-3 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                         <div>
                           <h4 className="font-bold text-slate-800">{scaleData.name}</h4>
                           {!isScaleComplete && (
                             <p className="text-xs text-amber-600 mt-1">
                               还有 {scaleData.items.length - Object.keys(assessmentAnswers).length} 项未评估
                             </p>
                           )}
                         </div>
                         <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded">
                           当前得分: {currentScore} / {scaleData.maxScore}
                         </span>
                      </div>
                      
                      <div className="p-0 divide-y divide-slate-100">
                         {scaleData.items.map((item, index) => (
                           <div key={item.id} className="p-5 hover:bg-slate-50 transition-colors">
                              <p className="text-sm font-bold text-slate-800 mb-3">
                                <span className="text-indigo-500 mr-2">{index + 1}.</span>
                                {item.title}
                              </p>
                              <div className="space-y-2 pl-5">
                                {item.options.map((opt, optIndex) => {
                                  const isSelected = assessmentAnswers[item.id] === opt.score;
                                  return (
                                    <label key={optIndex} className={`flex items-center gap-3 text-sm p-2 rounded cursor-pointer transition-colors border ${
                                      isSelected ? 'bg-indigo-50 border-indigo-200' : 'text-slate-600 hover:bg-slate-100 border-transparent hover:border-slate-200'
                                    }`}>
                                      <input 
                                        type="radio" 
                                        name={`eval_${item.id}`} 
                                        className="text-indigo-600 w-4 h-4 focus:ring-indigo-500"
                                        checked={isSelected}
                                        onChange={() => setAssessmentAnswers(prev => ({ ...prev, [item.id]: opt.score }))}
                                      />
                                      <span className={`flex-1 ${isSelected ? 'font-medium text-indigo-900' : ''}`}>{opt.label}</span>
                                    </label>
                                  );
                                })}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   
                   <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                      <div className="flex items-start gap-3">
                         <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                         <div>
                            <p className="text-sm text-amber-900 font-bold mb-1">系统智能提示</p>
                            <p className="text-xs text-amber-800 leading-relaxed">系统检测到该长者前序得分为 {Math.round(scaleData.maxScore * 0.8)}分，请结合本次 {currentScore} 分客观评判是否存在显著变化趋势。</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
                <button onClick={() => setShowEvalModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">暂存草稿</button>
                <button 
                  onClick={() => {
                    updateAssessment(selectedAssessment.id, {
                        score: `${currentScore}分 (${getScoreLabel()})`,
                        status: '已完成'
                    });
                    toast.success("评估报告已生成");
                    setShowEvalModal(false);
                  }} 
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
                    isScaleComplete ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'
                  }`}
                  disabled={!isScaleComplete}
                >
                  <CheckCircle2 className="w-4 h-4" /> 提交评估
                </button>
             </div>
          </div>
        </div>
        );
      })()}

      {/* 查看评估报告 Modal */}
      {showReportModal && selectedAssessment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95 max-h-[90vh]">
             <div className="flex items-center justify-between p-5 border-b border-indigo-100 bg-indigo-50/50">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <FileText className="w-5 h-5 text-indigo-600" />
                   评估报告详情
                </h3>
                <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-8">
                <div className="text-center mb-8 border-b pb-6">
                   <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedAssessment.type} 报告</h2>
                   <p className="text-slate-500">报告单号: {selectedAssessment.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm mb-8">
                   <div><span className="text-slate-500">长者姓名:</span> <strong className="text-slate-800 ml-1">{selectedAssessment.elderName}</strong></div>
                   <div><span className="text-slate-500">所在床位:</span> <strong className="text-slate-800 ml-1">{selectedAssessment.room}</strong></div>
                   <div><span className="text-slate-500">评估人员:</span> <strong className="text-slate-800 ml-1">{selectedAssessment.assessor}</strong></div>
                   <div><span className="text-slate-500">评估时间:</span> <strong className="text-slate-800 ml-1">{selectedAssessment.date}</strong></div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 mx-auto w-full md:w-3/4 shadow-inner relative overflow-hidden">
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-100 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
                   <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-2xl pointer-events-none"></div>
                   
                   <div className="text-center relative z-10">
                     <p className="text-slate-500 font-bold mb-3 tracking-widest text-xs uppercase">综合得分与评定等级</p>
                     <div className="inline-flex items-baseline justify-center gap-2 mb-2">
                        <span className="text-5xl font-black text-indigo-700 font-mono tracking-tighter">{selectedAssessment.score.split('分')[0]}</span>
                        <span className="text-xl font-bold text-slate-400">/ 100</span>
                     </div>
                     <div className="inline-flex items-center justify-center mt-2 px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-black tracking-widest border border-amber-200 shadow-sm">
                        {selectedAssessment.score.split(' (')[1]?.replace(')', '') || '需分级照护'}
                     </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="bg-white border text-sm border-slate-200 rounded-xl p-5 shadow-sm">
                      <h4 className="font-black text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 各维度得分细项</h4>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                            <span className="text-slate-600 font-medium">进食</span><span className="font-bold text-indigo-700">5 / 10</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                            <span className="text-slate-600 font-medium">洗澡</span><span className="font-bold text-indigo-700">0 / 5</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                            <span className="text-slate-600 font-medium">平地行走</span><span className="font-bold text-indigo-700">10 / 15</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                            <span className="text-slate-600 font-medium">穿衣</span><span className="font-bold text-indigo-700">5 / 10</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                            <span className="text-slate-600 font-medium">大便控制</span><span className="font-bold text-indigo-700">10 / 10</span>
                         </div>
                         <div className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded">
                            <span className="text-slate-600 font-medium">小便控制</span><span className="font-bold text-indigo-700">10 / 10</span>
                         </div>
                      </div>
                   </div>

                   <div className="bg-white border text-sm border-indigo-100 rounded-xl p-5 shadow-sm">
                      <h4 className="font-black text-indigo-900 border-b border-indigo-50 pb-3 mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-indigo-500" /> 评定结论与建议摘要</h4>
                      <p className="text-slate-700 leading-relaxed font-medium">
                         根据本次评估结果，长者在【洗澡】、【穿衣】和【日常短距行走】中表现出显著依赖加深。对比上期报告得分下降10分，存在肌力减退风险。<br/><br/>
                         <strong>干预建议：</strong><br/>
                         1. 照护等级建议由 三级 调整为 <strong>二级</strong>（即日起生效）。<br/>
                         2. 安排康复科介入，制定下肢力量维持计划（每周不少于2次）。<br/>
                         3. 护理员交接班予以“谨防浴室滑倒”重点标注。
                      </p>
                   </div>
                </div>
             </div>
             
             <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button onClick={() => setShowReportModal(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">关闭</button>
                <button className="px-5 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm">
                  打印/导出PDF
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
