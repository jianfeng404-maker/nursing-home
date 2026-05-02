import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Clock, CheckCircle2, AlertTriangle, Filter, Coffee, X } from "lucide-react";
import { toast } from "sonner";

export function Attendance() {
  const [activeTab, setActiveTab] = useState('daily');
  const [searchQuery, setSearchQuery] = useState('');

  const [records, setRecords] = useState([
    { id: "A-001", name: "张明宇", dept: "护理一部", date: "2026-04-28", shift: "白班", in: "07:55", out: "-", status: "正常", type: "打卡" },
    { id: "A-002", name: "李秀兰", dept: "护理一部", date: "2026-04-28", shift: "白班", in: "08:15", out: "-", status: "迟到", type: "打卡" },
    { id: "A-003", name: "王建国", dept: "护理一部", date: "2026-04-28", shift: "夜班", in: "-", out: "-", status: "未打卡", type: "打卡" },
  ]);

  const [leaves, setLeaves] = useState([
    { id: "L-001", name: "陈敏", dept: "护理二部", type: "病假", startTime: "2026-04-28 08:00", endTime: "2026-04-30 18:00", duration: "3天", status: "已审批", reason: "重感冒发烧，需居家隔离休息" },
    { id: "L-002", name: "赵红", dept: "后勤部", type: "年假", startTime: "2026-05-01 08:00", endTime: "2026-05-05 18:00", duration: "5天", status: "待审批", reason: "回老家探亲" },
  ]);

  const filteredRecords = records.filter(r => r.name.includes(searchQuery));
  const filteredLeaves = leaves.filter(l => l.name.includes(searchQuery));

  const [approvingLeave, setApprovingLeave] = useState<any>(null);
  const [fixingRecord, setFixingRecord] = useState<any>(null);

  const handleApproveLeave = (id: string, newStatus: string) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
    let name = leaves.find(l => l.id === id)?.name || '';
    setApprovingLeave(null);
    if (newStatus === '已审批') {
      toast.success(`已同意 ${name} 的请假申请`);
    } else {
      toast.info(`已驳回 ${name} 的请假申请`);
    }
  };

  const handleFixRecord = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newIn = formData.get('inTime') as string;
    const newOut = formData.get('outTime') as string;
    const status = formData.get('status') as string;

    if (fixingRecord) {
      setRecords(records.map(r => r.id === fixingRecord.id ? { ...r, in: newIn, out: newOut, status: status } : r));
      toast.success(`已核准 ${fixingRecord.name} 的异常打卡记录`);
    }
    setFixingRecord(null);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">考勤打卡与假期计算</h2>
          <p className="text-slate-500 text-sm mt-1">查看每日出勤记录，处理请假申请并自动计算假期薪资抵扣状况</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-md text-sm font-medium hover:bg-slate-50 transition shadow-sm">
            <Filter className="w-4 h-4" /> 导出考勤报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                   <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">今日全勤</p>
                   <h3 className="text-xl font-bold text-slate-800">42 人</h3>
                </div>
             </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                   <Clock className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">今日迟到/早退</p>
                   <h3 className="text-xl font-bold text-slate-800">2 人</h3>
                </div>
             </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                   <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">旷工异常</p>
                   <h3 className="text-xl font-bold text-slate-800">1 人</h3>
                </div>
             </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-white">
          <CardContent className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                   <Coffee className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-sm font-medium text-slate-500 mb-1">今日休假</p>
                   <h3 className="text-xl font-bold text-slate-800">5 人</h3>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
             {['daily', 'leaves'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'daily' && '每日打卡记录'}
                  {tab === 'leaves' && '请假审批台'}
                </button>
             ))}
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索员工姓名..."
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-slate-50 hover:bg-white transition-colors"
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {activeTab === 'daily' ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">员工姓名</th>
                  <th className="px-6 py-4 font-medium">部门</th>
                  <th className="px-6 py-4 font-medium">打卡日期</th>
                  <th className="px-6 py-4 font-medium">班次</th>
                  <th className="px-6 py-4 font-medium font-mono">上班打卡</th>
                  <th className="px-6 py-4 font-medium font-mono">下班打卡</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                 {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition">
                       <td className="px-6 py-4 font-bold text-slate-800">{r.name}</td>
                       <td className="px-6 py-4 text-slate-600">{r.dept}</td>
                       <td className="px-6 py-4 text-slate-600">{r.date}</td>
                       <td className="px-6 py-4">{r.shift}</td>
                       <td className="px-6 py-4 font-mono font-medium">{r.in}</td>
                       <td className="px-6 py-4 font-mono font-medium">{r.out}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            r.status === '正常' ? 'bg-emerald-100 text-emerald-700' :
                            r.status === '迟到' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                          }`}>
                            {r.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-center flex justify-center gap-2">
                          <button onClick={() => setFixingRecord(r)} className="text-blue-600 hover:underline font-medium text-sm">补卡核准</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">申请人</th>
                  <th className="px-6 py-4 font-medium">部门</th>
                  <th className="px-6 py-4 font-medium">假期类型</th>
                  <th className="px-6 py-4 font-medium">开始时间</th>
                  <th className="px-6 py-4 font-medium">结束时间</th>
                  <th className="px-6 py-4 font-medium">时长</th>
                  <th className="px-6 py-4 font-medium">审批状态</th>
                  <th className="px-6 py-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                 {filteredLeaves.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition">
                       <td className="px-6 py-4 font-bold text-slate-800">{l.name}</td>
                       <td className="px-6 py-4 text-slate-600">{l.dept}</td>
                       <td className="px-6 py-4 font-medium">{l.type}</td>
                       <td className="px-6 py-4 font-mono text-slate-500">{l.startTime}</td>
                       <td className="px-6 py-4 font-mono text-slate-500">{l.endTime}</td>
                       <td className="px-6 py-4">{l.duration}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            l.status === '待审批' ? 'bg-blue-100 text-blue-700' : 
                            l.status === '已审批' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {l.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-center flex justify-center gap-2">
                          {l.status === '待审批' ? (
                             <button onClick={() => setApprovingLeave(l)} className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition">
                                审核处理
                             </button>
                          ) : (
                             <button onClick={() => setApprovingLeave(l)} className="text-slate-500 hover:text-slate-700 font-medium text-sm">
                                查看详情
                             </button>
                          )}
                       </td>
                    </tr>
                 ))}
                 {filteredLeaves.length === 0 && (
                   <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">没有查找到请假记录</td></tr>
                 )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Leave Approval Modal */}
      {approvingLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">
                   {approvingLeave.status === '待审批' ? '请假审批' : '请假详情'}
                </h3>
                <button type="button" onClick={() => setApprovingLeave(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xl">
                      {approvingLeave.name[0]}
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-800 text-lg">{approvingLeave.name}</h4>
                      <p className="text-sm text-slate-500">{approvingLeave.dept}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                      <span className="block text-slate-500 mb-1">休假类型</span>
                      <span className="font-medium text-slate-800">{approvingLeave.type}</span>
                   </div>
                   <div>
                      <span className="block text-slate-500 mb-1">请假时长</span>
                      <span className="font-medium text-slate-800">{approvingLeave.duration}</span>
                   </div>
                   <div className="col-span-2">
                      <span className="block text-slate-500 mb-1">时间围度</span>
                      <span className="font-medium font-mono text-slate-800">{approvingLeave.startTime} 至 {approvingLeave.endTime}</span>
                   </div>
                   <div className="col-span-2">
                      <span className="block text-slate-500 mb-1">请假事由</span>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-md text-slate-700">
                         {approvingLeave.reason || '无特殊说明'}
                      </div>
                   </div>
                </div>
             </div>
             
             {approvingLeave.status === '待审批' ? (
               <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button onClick={() => handleApproveLeave(approvingLeave.id, '已驳回')} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">驳回申请</button>
                  <button onClick={() => handleApproveLeave(approvingLeave.id, '已审批')} className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm">同意请假</button>
               </div>
             ) : (
               <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                  <button onClick={() => setApprovingLeave(null)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">关闭</button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Fix Record Modal */}
      {fixingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">
                   核准打卡记录
                </h3>
                <button type="button" onClick={() => setFixingRecord(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <form onSubmit={handleFixRecord}>
               <div className="p-6 space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mb-2">
                     正在为 <strong>{fixingRecord.name}</strong> 补登 <strong>{fixingRecord.date} ({fixingRecord.shift})</strong> 的考勤异常。
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">上班打卡时间</label>
                        <input name="inTime" defaultValue={fixingRecord.in === '-' ? '08:00' : fixingRecord.in} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">下班打卡时间</label>
                        <input name="outTime" defaultValue={fixingRecord.out === '-' ? '18:00' : fixingRecord.out} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono" />
                     </div>
                  </div>
                  
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">修正后异常状态</label>
                     <select name="status" defaultValue="正常" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="正常">修正为: 正常打卡</option>
                        <option value="迟到">保留为: 迟到</option>
                        <option value="早退">保留为: 早退</option>
                     </select>
                  </div>
               </div>
               
               <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setFixingRecord(null)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">提交核准</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
