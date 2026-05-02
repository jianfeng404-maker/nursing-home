import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Filter, Download, Activity, Calendar } from "lucide-react";

export function SysLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [logs] = useState([
    { id: 'L001', time: '2026-04-28 11:30:15', user: 'zhangmy (张明宇)', ip: '192.168.1.105', module: '退住办理', action: '提交退住申请', target: '长者: 王文远', status: '成功' },
    { id: 'L002', time: '2026-04-28 10:45:22', user: 'admin (系统管理员)', ip: '10.0.0.12', module: '权限管理', action: '修改角色权限', target: '角色: 护理员', status: '成功' },
    { id: 'L003', time: '2026-04-28 09:12:05', user: 'liuxin (刘欣)', ip: '192.168.1.201', module: '账单报表', action: '导出报表', target: '2026年3月财务报表', status: '成功' },
    { id: 'L004', time: '2026-04-28 08:05:30', user: 'wangjg (王建国)', ip: '192.168.1.154', module: '考勤打卡', action: '上班打卡', target: '-', status: '被拒绝' },
    { id: 'L005', time: '2026-04-27 22:15:45', user: 'SYSTEM', ip: 'localhost', module: '定时任务', action: '每日账单生成', target: '系统自动生成日均费用', status: '成功' },
  ]);

  const filteredLogs = logs.filter(l => 
    l.user.includes(searchQuery) || 
    l.target.includes(searchQuery) || 
    l.action.includes(searchQuery) ||
    l.module.includes(searchQuery)
  );

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">访问与操作日志</h2>
          <p className="text-slate-500 text-sm mt-1">追溯系统的所有关键用户操作，支持审计与故障排查</p>
        </div>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between shrink-0 bg-white space-y-0 text-sm">
          <div className="flex items-center gap-3 w-full">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索操作账号、目标或动作..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 w-full bg-slate-50 focus:bg-white transition-colors"
              />
            </div>
            
            <div className="flex items-center border border-slate-300 rounded-md bg-white px-3 py-2 text-slate-600 gap-2 w-64">
               <Calendar className="w-4 h-4 text-slate-400" />
               <input type="date" className="focus:outline-none bg-transparent w-full text-sm font-medium" defaultValue="2026-04-28" />
            </div>

            <select className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 bg-white text-slate-700 min-w-[120px]">
               <option value="">所有模块</option>
               <option value="权限管理">权限管理</option>
               <option value="财务报表">财务报表</option>
               <option value="入住办理">入住办理</option>
               <option value="系统配置">系统配置</option>
            </select>
          </div>
          
          <div className="flex justify-end ml-4 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md font-medium hover:bg-slate-50 transition shadow-sm">
              <Download className="w-4 h-4" /> 导出日志
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium w-1/6">操作时间</th>
                <th className="px-6 py-4 font-medium w-1/6">操作账号</th>
                <th className="px-6 py-4 font-medium w-[10%]">IP地址</th>
                <th className="px-6 py-4 font-medium w-[10%]">业务模块</th>
                <th className="px-6 py-4 font-medium w-[20%]">具体动作 / 目标对象</th>
                <th className="px-6 py-4 font-medium text-center w-[10%]">执行结果</th>
                <th className="px-6 py-4 font-medium text-right w-[10%]">详情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-mono text-slate-500">{log.time}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                  <td className="px-6 py-4 font-mono text-slate-500">{log.ip}</td>
                  <td className="px-6 py-4">
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{log.module}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{log.action}</span>
                        <span className="text-xs text-slate-500 mt-1">{log.target}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.status === '成功' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition flex items-center justify-end gap-1 w-full">
                       <Activity className="w-3.5 h-3.5" /> 审计
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-slate-100 bg-white text-sm text-slate-500 flex justify-between items-center">
             <span>显示 1 - 5 条，共 1,234 条日志。</span>
             <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">上一页</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50">下一页</button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
