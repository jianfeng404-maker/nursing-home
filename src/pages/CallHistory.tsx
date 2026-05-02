import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Filter, PlayCircle, Download, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, Headphones } from "lucide-react";

export function CallHistory() {
  const [activeTab, setActiveTab] = useState('all');

  const history = [
    { id: "CDR-20260428-0912", time: "10:15:33", type: "in", direction: "呼入", caller: "138-0013-8000", callee: "8001 (客服一部)", duration: "03:45", status: "已接听", record: true, customer: "张建国 (家属)", agent: "李小冉" },
    { id: "CDR-20260428-0850", time: "09:42:10", type: "out", direction: "呼出", caller: "8002 (财务)", callee: "139-1234-5678", duration: "01:20", status: "已接听", record: true, customer: "王阿姨 (长者)", agent: "张会计" },
    { id: "CDR-20260428-0810", time: "08:30:05", type: "missed", direction: "呼入", caller: "135-8888-9999", callee: "主线号码", duration: "00:00", status: "未接来电", record: false, customer: "未知号码", agent: "-" },
    { id: "CDR-20260427-1620", time: "昨天 16:20", type: "in", direction: "呼入", caller: "136-7777-6666", callee: "8001 (客服一部)", duration: "12:30", status: "已接听", record: true, customer: "刘先生 (咨询)", agent: "李小冉" },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">历史呼叫与录音追踪</h2>
          <p className="text-slate-500 text-sm mt-1">查询机构所有的去电和来电记录，支持调取通话录音用于质检和纠纷处理</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm">
            <Download className="w-4 h-4" /> 导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">今日总呼叫量</p>
              <h3 className="text-2xl font-bold text-blue-700">128</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Headphones className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">今日呼入接听率</p>
              <h3 className="text-2xl font-bold text-emerald-700">96.5%</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
              <PhoneIncoming className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">未接来电 (24h)</p>
              <h3 className="text-2xl font-bold text-amber-700">3</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-600 shadow-sm">
              <PhoneMissed className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-indigo-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">平均通话时长</p>
              <h3 className="text-2xl font-bold text-indigo-700">03:12</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
             {['all', 'in', 'out', 'missed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'all' && '全部记录'}
                  {tab === 'in' && '呼入'}
                  {tab === 'out' && '呼出'}
                  {tab === 'missed' && '未接来电'}
                </button>
             ))}
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索号码/客户名/座席..."
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-slate-50 hover:bg-white transition-colors"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                <Filter className="w-4 h-4" /> 高级筛选
             </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">通话时间</th>
                <th className="px-6 py-4 font-medium">方向与状态</th>
                <th className="px-6 py-4 font-medium">主叫号码</th>
                <th className="px-6 py-4 font-medium">被叫号码</th>
                <th className="px-6 py-4 font-medium">客户识别信息</th>
                <th className="px-6 py-4 font-medium">处理座席</th>
                <th className="px-6 py-4 font-medium">通话时长</th>
                <th className="px-6 py-4 font-medium text-right">通话录音</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
               {history.filter(h => activeTab === 'all' || h.type === activeTab).map(h => (
                  <tr key={h.id} className="hover:bg-slate-50/50 transition">
                     <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{h.time}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{h.id}</div>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           {h.type === 'in' && <PhoneIncoming className="w-4 h-4 text-indigo-500" />}
                           {h.type === 'out' && <PhoneOutgoing className="w-4 h-4 text-emerald-500" />}
                           {h.type === 'missed' && <PhoneMissed className="w-4 h-4 text-rose-500" />}
                           <span className={`font-medium ${h.type === 'missed' ? 'text-rose-600' : 'text-slate-700'}`}>{h.status}</span>
                        </div>
                     </td>
                     <td className="px-6 py-4 font-mono">{h.caller}</td>
                     <td className="px-6 py-4 font-mono">{h.callee}</td>
                     <td className="px-6 py-4 font-medium">{h.customer}</td>
                     <td className="px-6 py-4">{h.agent}</td>
                     <td className="px-6 py-4 font-mono text-slate-500">{h.duration}</td>
                     <td className="px-6 py-4 text-right">
                        {h.record ? (
                           <button className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-medium text-sm bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                              <PlayCircle className="w-4 h-4" />
                              收听录音
                           </button>
                        ) : (
                           <span className="text-slate-400 text-xs">-</span>
                        )}
                     </td>
                  </tr>
               ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
