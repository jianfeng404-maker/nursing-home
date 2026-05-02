import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Users, PhoneCall, CalendarPlus, UserCheck, PlusCircle, Search, Clock, FileText, X, Check, Calendar, ArrowRight, UserPlus, User, ClipboardList } from "lucide-react";

export function MarketingReception() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReception, setSelectedReception] = useState<any>(null);
  const [showAddFollowUp, setShowAddFollowUp] = useState(false);
  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [showAddContract, setShowAddContract] = useState(false);
  const [showAddTracking, setShowAddTracking] = useState(false);
  
  const stats = [
    { label: "今日累计接待", value: "12", sub: "较昨日 +3", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "待回访任务", value: "8", sub: "含 2 个超期未回访", icon: PhoneCall, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "本月新增意向", value: "45", sub: "转化率 15%", icon: CalendarPlus, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "已签约长者", value: "6", sub: "本月累计", icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const [receptions, setReceptions] = useState([
    { id: "R001", client: "张先生", relation: "子女", phone: "138****8888", source: "微信公众号", intent: "高", time: "上午 10:30", consultant: "李娜", notes: "老人78岁，轻度失智，需全护。" },
    { id: "R002", client: "刘奶奶", relation: "本人", phone: "139****1234", source: "上门咨询", intent: "中", time: "上午 11:15", consultant: "王强", notes: "老人自理，看中环境，觉得价格偏高。" },
    { id: "R003", client: "赵先生", relation: "子女", phone: "137****5678", source: "朋友介绍", intent: "低", time: "下午 14:00", consultant: "李娜", notes: "暂无强烈需求，先了解下。" },
    { id: "R004", client: "陈阿姨", relation: "本人", phone: "136****9999", source: "社区宣传", intent: "高", time: "下午 15:30", consultant: "陈洁", notes: "急需入住，明天带家属来看房。" },
  ]);

  const [followUps, setFollowUps] = useState([
    { id: "F001", client: "周老先生(家属)", date: "今天 16:00", type: "电话回访", status: "pending", notes: "询问护理级别评定结果", phone: "13811112222" },
    { id: "F002", client: "吴阿姨", date: "明天 10:00", type: "邀约参观", status: "upcoming", notes: "已发送位置信息", phone: "13933334444" },
    { id: "F003", client: "郑先生", date: "昨天 14:00", type: "合同跟进", status: "overdue", notes: "准备签订入住协议", phone: "13755556666" },
  ]);

  const handleCompleteFollowUp = (id: string) => {
    setFollowUps(followUps.filter(f => f.id !== id));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8">
      <div className="mb-6 flex space-x-2 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">营销接待与回访</h2>
          <span className="text-sm text-slate-500">客户咨询、现场接待及跟进回访全流程管理</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 border border-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            新增接待记录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                </div>
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧：今日接待记录 */}
        <Card className="col-span-1 lg:col-span-2 border-slate-200">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                接待记录列表
              </CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="搜客户姓名/电话..." 
                    className="pl-8 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 w-48 bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-100 uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">客户信息</th>
                    <th className="px-6 py-3 font-medium">来源属性</th>
                    <th className="px-6 py-3 font-medium">意向度</th>
                    <th className="px-6 py-3 font-medium">接待时间/顾问</th>
                    <th className="px-6 py-3 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {receptions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors bg-white">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{item.client} <span className="text-xs font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded ml-1">{item.relation}</span></div>
                        <div className="text-xs text-slate-500 mt-1">{item.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {item.source}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          item.intent === '高' ? 'bg-emerald-100 text-emerald-700' :
                          item.intent === '中' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.intent}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-800">{item.time}</div>
                        <div className="text-xs text-slate-500">{item.consultant}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedReception(item)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded hover:bg-emerald-50 transition-colors"
                        >
                          详情及流转
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：回访跟进任务 */}
        <Card className="col-span-1 border-slate-200 flex flex-col">
          <CardHeader className="border-b border-slate-100 pb-4">
            <CardTitle className="text-lg font-bold text-slate-800">
              待办回访任务
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-slate-100">
              {followUps.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Check className="mx-auto h-8 w-8 text-emerald-400 mb-2" />
                  <p className="text-sm">太棒了，所有回访已完成</p>
                </div>
              ) : followUps.map((task) => (
                <div key={task.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                       {task.status === 'overdue' ? (
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                      ) : task.type === '电话回访' ? (
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          <PhoneCall className="w-4 h-4" />
                        </div>
                      ) : (
                         <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                          <Calendar className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-slate-800">{task.client}</div>
                        <div className={`text-xs mt-0.5 flex flex-col ${task.status === 'overdue' ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                          <span>计划时间: {task.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs bg-slate-50 p-2 rounded text-slate-600 border border-slate-100">
                    <span className="font-medium inline-block mr-2">{task.type}</span>
                    {task.notes}
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => handleCompleteFollowUp(task.id)}
                      className="flex-1 text-xs py-1.5 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition"
                    >
                      记录并完成
                    </button>
                    <button className="flex-1 text-xs py-1.5 bg-white border border-slate-200 text-slate-600 rounded font-medium hover:bg-slate-50 transition">
                      延期
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 新增接待记录 Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                新增接待与咨询记录
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              {/* 咨询人信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  咨询人信息
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">咨询人姓名 *</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="请输入姓名" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">联系电话 *</label>
                    <input type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="请输入手机号" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">与长者关系</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                      <option>本人</option>
                      <option>配偶</option>
                      <option>子女</option>
                      <option>亲属</option>
                      <option>朋友/其他</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 拟入住长者信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <User className="w-4 h-4 text-slate-500" />
                  拟入住长者信息 (选填)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">长者姓名</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="选填" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">长者性别</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                      <option value="">-- 请选择 --</option>
                      <option>男</option>
                      <option>女</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">大概年龄</label>
                    <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors" placeholder="岁" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">自理能力预估</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                      <option value="">-- 请选择 --</option>
                      <option>自理</option>
                      <option>半失能 / 介助</option>
                      <option>失能 / 介护</option>
                      <option>失智 (认知症)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 咨询接待情况 */}
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  咨询与接待情况
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">咨询方式</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                      <option>电话咨询</option>
                      <option>现场到访</option>
                      <option>线上客服 (微信/网站)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">了解渠道</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                      <option>自然到访</option>
                      <option>网络搜索</option>
                      <option>微信公众号</option>
                      <option>朋友/熟人介绍</option>
                      <option>社区宣传</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">入住意向度</label>
                    <select className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors">
                      <option>A级 (1个月内急需)</option>
                      <option>B级 (1-3个月内)</option>
                      <option>C级 (半年内考虑)</option>
                      <option>D级 (随便看看/暂无计划)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">沟通纪要与长者需求备注</label>
                  <textarea 
                    className="w-full border border-slate-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-colors min-h-[100px] resize-none" 
                    placeholder="请记录本次咨询的重点内容：如老人当前病史、家属关心的重点（医疗、伙食、价格）、对房型的偏好等..."
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="text-sm text-slate-500 flex items-center gap-2">
                接待顾问: <span className="font-bold text-slate-700">当前登录用户</span>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                 <button 
                  onClick={() => {
                    /* fake save */ 
                    setShowAddModal(false); 
                  }}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  保存接待记录
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 详情与流转 Modal */}
      {selectedReception && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                客户详情 
                <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-normal">
                  {selectedReception.id}
                </span>
              </h3>
              <button 
                onClick={() => setSelectedReception(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto flex">
               {/* 左侧详情 */}
               <div className="w-2/3 p-5 border-r border-slate-100">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-slate-800">{selectedReception.client}</h4>
                      <p className="text-sm text-slate-500 mt-1">{selectedReception.relation} · {selectedReception.phone}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          selectedReception.intent === '高' ? 'bg-emerald-100 text-emerald-700' :
                          selectedReception.intent === '中' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                      意向度: {selectedReception.intent}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-slate-700 mb-2">基本需求与沟通记录</h5>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {selectedReception.notes}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <span className="text-slate-400 block mb-1">初次接待时间</span>
                         <span className="font-medium text-slate-800">{selectedReception.time}</span>
                       </div>
                       <div>
                         <span className="text-slate-400 block mb-1">渠道来源</span>
                         <span className="font-medium text-slate-800">{selectedReception.source}</span>
                       </div>
                       <div>
                         <span className="text-slate-400 block mb-1">专属顾问</span>
                         <span className="font-medium text-slate-800">{selectedReception.consultant}</span>
                       </div>
                    </div>
                  </div>

                  <div>
                     <div className="flex items-center justify-between mb-3">
                       <h5 className="text-sm font-bold text-slate-800">跟进历史</h5>
                       <button onClick={() => setShowAddTracking(true)} className="text-xs text-emerald-600 font-medium hover:underline flex items-center gap-1">
                         <PlusCircle className="w-3 h-3" /> 添加跟踪记录
                       </button>
                     </div>
                     <div className="border-l-2 border-slate-100 ml-2 pl-4 py-1 space-y-4">
                        <div className="relative">
                          <div className="absolute -left-[23px] bg-white p-1 rounded-full border border-slate-200">
                             <PhoneCall className="w-3 h-3 text-emerald-500" />
                          </div>
                          <div className="text-xs text-slate-400 mb-1">今天 10:00 - {selectedReception.consultant}</div>
                          <div className="text-sm text-slate-700 bg-white border border-slate-100 shadow-sm p-3 rounded-lg">
                            电话回访了家属，解答了关于长护险申请的具体流程。家属表示周末会带老人再过来看看环境。
                          </div>
                        </div>
                        <div className="relative">
                           <div className="absolute -left-[23px] bg-white p-1 rounded-full border border-slate-200">
                             <Users className="w-3 h-3 text-blue-500" />
                          </div>
                          <div className="text-xs text-slate-400 mb-1">前天 14:30 - {selectedReception.consultant}</div>
                          <div className="text-sm text-slate-700 bg-white border border-slate-100 shadow-sm p-3 rounded-lg">
                            首次接待介绍，带领参观了2楼自理区和3楼护理区，发送了宣传册和收费标准。
                          </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* 右侧业务流转动作 */}
               <div className="w-1/3 bg-slate-50 p-5 p-r flex flex-col">
                 <h5 className="text-sm font-bold text-slate-800 mb-4">下一步计划</h5>
                 
                 <div className="space-y-2 mb-6">
                   <button onClick={() => setShowAddFollowUp(true)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition shadow-sm group">
                     <span className="font-medium flex items-center gap-2">
                       <Calendar className="w-4 h-4 text-amber-500" />
                       新建回访任务
                     </span>
                     <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                   </button>
                   <button onClick={() => setShowAddAssessment(true)} className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition shadow-sm group">
                     <span className="font-medium flex items-center gap-2">
                       <FileText className="w-4 h-4 text-blue-500" />
                       申请入院评估
                     </span>
                     <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                   </button>
                 </div>

                 <div className="mt-auto">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
                      <h6 className="text-xs font-bold text-emerald-800 mb-1">快速录入合同</h6>
                      <p className="text-xs text-emerald-600 mb-3">当客户确认意向后，可直接转化并生成正式的客户长者档案库。</p>
                      <button onClick={() => setShowAddContract(true)} className="w-full py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 shadow-sm">
                        转为入住签约
                      </button>
                    </div>
                 </div>
               </div>
            </div>
            
          </div>
        </div>
      )}

      {/* 新建回访任务 Modal */}
      {showAddFollowUp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">新建回访任务</h3>
              <button onClick={() => setShowAddFollowUp(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">计划回访时间</label>
                <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">回访方式</label>
                <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                  <option>电话回访</option>
                  <option>微信沟通</option>
                  <option>邀约参观</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">任务备注说明</label>
                <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 min-h-[80px]" placeholder="例如：询问护理评估结果进度"></textarea>
              </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setShowAddFollowUp(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
               <button 
                onClick={() => setShowAddFollowUp(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                保存任务
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 申请入院评估 Modal */}
      {showAddAssessment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">申请入院评估</h3>
              <button onClick={() => setShowAddAssessment(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
               <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm p-3 rounded-lg flex items-start gap-2">
                 <CalendarPlus className="w-5 h-5 shrink-0" />
                 <p>提交评估申请后，将自动流转至评估组/医生主页。请填写初步期望的入住园区信息。</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">意向评估时间</label>
                    <input type="datetime-local" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">预计入住日期</label>
                    <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-1.5 block">意向区域/房型</label>
                    <div className="flex gap-2">
                      <select className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        <option>A栋 自理区</option>
                        <option>B栋 介护区</option>
                        <option>C栋 认知症专区</option>
                      </select>
                      <select className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white">
                        <option>不限</option>
                        <option>双人间</option>
                        <option>三人间</option>
                      </select>
                    </div>
                  </div>
               </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setShowAddAssessment(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
               <button 
                onClick={() => setShowAddAssessment(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" /> 提交评估申请
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 转为入住签约 Modal */}
      {showAddContract && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">确认办理签约</h3>
              <button onClick={() => setShowAddContract(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-center">
               <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <UserCheck className="w-8 h-8" />
               </div>
               <h4 className="text-lg font-semibold text-slate-800 mb-2">即将生成正式长者档案</h4>
               <p className="text-sm text-slate-500 mb-1">系统将把当前咨询客户<strong className="text-slate-800">{selectedReception?.client}</strong>转化为正式在院长者档案。</p>
               <p className="text-xs text-slate-400">并在【长者档案与协议】模块中开启协议管理流程。</p>
            </div>
            <div className="p-5 border-t border-slate-100 flex flex-col gap-3 bg-slate-50/50">
               <button 
                onClick={() => setShowAddContract(false)}
                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                确认并跳转签约页面
              </button>
              <button 
                onClick={() => setShowAddContract(false)}
                className="w-full px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                暂不处理
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 添加跟踪记录 Modal */}
      {showAddTracking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">添加跟踪记录</h3>
              <button onClick={() => setShowAddTracking(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
               <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">更新意向度 (可修改)</label>
                  <select className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 bg-white" defaultValue={selectedReception?.intent}>
                    <option value="高">高 (1个月内)</option>
                    <option value="中">中 (1-3个月)</option>
                    <option value="低">低 (随便看看)</option>
                  </select>
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-700 mb-1.5 block">沟通内容详情记录</label>
                 <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 min-h-[120px]" placeholder="记录当前沟通的核心内容、客户顾虑及重点关注事项..."></textarea>
               </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setShowAddTracking(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
               <button 
                onClick={() => setShowAddTracking(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
              >
                添加记录
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
