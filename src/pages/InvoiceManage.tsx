import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Printer, FileText } from "lucide-react";

export function InvoiceManage() {
  const [activeTab, setActiveTab] = useState('invoiced');

  const invoices = [
    { id: "INV-2604001", elder: "张明宇", amount: "8,500.00", date: "2026-04-06", type: "增值税普通发票", title: "个人", status: "已开票" },
    { id: "INV-2604005", elder: "王建国", amount: "15,800.00", date: "2026-04-08", type: "增值税专用发票", title: "建国商贸有限公司", status: "已开票" },
  ];

  const unbilled = [
    { id: "UB-001", elder: "李秀兰", totalPaid: "18,600.00", unbilledAmount: "18,600.00", lastPayDate: "2026-04-05" },
    { id: "UB-002", elder: "赵桂芳", totalPaid: "14,000.00", unbilledAmount: "7,000.00", lastPayDate: "2026-03-05" },
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">发票及挂账查询</h2>
          <p className="text-slate-500 text-sm mt-1">处理发票开具、冲红操作，并查看客户未开票金额</p>
        </div>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
             {['invoiced', 'unbilled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'invoiced' && '已开发票记录'}
                  {tab === 'unbilled' && '未开票明细(可结算额度)'}
                </button>
             ))}
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索..."
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors"
                />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {activeTab === 'invoiced' ? (
             <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                 <tr className="text-slate-500 text-sm">
                   <th className="px-6 py-4 font-medium">发票号码</th>
                   <th className="px-6 py-4 font-medium">开票日期</th>
                   <th className="px-6 py-4 font-medium">长者姓名</th>
                   <th className="px-6 py-4 font-medium">发票类型</th>
                   <th className="px-6 py-4 font-medium">发票抬头</th>
                   <th className="px-6 py-4 font-medium text-right">价税合计</th>
                   <th className="px-6 py-4 font-medium">状态</th>
                   <th className="px-6 py-4 font-medium text-center">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {invoices.map((inv) => (
                     <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono text-slate-500">{inv.id}</td>
                        <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{inv.elder}</td>
                        <td className="px-6 py-4">{inv.type}</td>
                        <td className="px-6 py-4">{inv.title}</td>
                        <td className="px-6 py-4 text-right font-bold text-slate-800">¥ {inv.amount}</td>
                        <td className="px-6 py-4">
                           <span className="bg-emerald-100 text-emerald-700 px-2 py-1 text-xs rounded-full font-medium">{inv.status}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex items-center justify-center gap-3">
                              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"><Printer className="w-4 h-4" /> 打印</button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
             </table>
          ) : (
             <table className="w-full text-left border-collapse">
               <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                 <tr className="text-slate-500 text-sm">
                   <th className="px-6 py-4 font-medium">账号ID</th>
                   <th className="px-6 py-4 font-medium">长者姓名</th>
                   <th className="px-6 py-4 font-medium text-right">历史已缴费合计</th>
                   <th className="px-6 py-4 font-medium text-right">可开票挂账余额</th>
                   <th className="px-6 py-4 font-medium">最后缴费日期</th>
                   <th className="px-6 py-4 font-medium text-center">操作</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {unbilled.map((ub) => (
                     <tr key={ub.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono text-slate-500">{ub.id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{ub.elder}</td>
                        <td className="px-6 py-4 text-right text-slate-500">¥ {ub.totalPaid}</td>
                        <td className="px-6 py-4 text-right font-bold text-blue-600">¥ {ub.unbilledAmount}</td>
                        <td className="px-6 py-4 text-slate-500">{ub.lastPayDate}</td>
                        <td className="px-6 py-4 text-center">
                           <button className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-sm rounded transition flex items-center gap-1 mx-auto">
                              <FileText className="w-4 h-4" /> 申请开票
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
             </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
