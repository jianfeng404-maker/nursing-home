import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Search,
  Plus,
  Wrench,
  Clock,
  CheckCircle2,
  UserCircle,
  X
} from "lucide-react";
import { toast } from "sonner";

export function Maintenance() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");

  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showNewWorkerModal, setShowNewWorkerModal] = useState(false);

  const [tickets, setTickets] = useState([
    {
      id: "REP-20260428-01",
      room: "A-205",
      type: "水电维修",
      item: "卫生间水龙头漏水",
      reporter: "护士张",
      date: "2026-04-28 08:30",
      status: "待派单",
      priority: "普通",
    },
    {
      id: "REP-20260428-02",
      room: "B-102",
      type: "家电维修",
      item: "空调不制冷",
      reporter: "长者李秀兰",
      date: "2026-04-28 09:15",
      status: "维修中",
      worker: "王师傅",
      priority: "紧急",
    },
    {
      id: "REP-20260427-01",
      room: "公共活动区",
      type: "设施损坏",
      item: "扶手松动",
      reporter: "护理员小刘",
      date: "2026-04-27 15:40",
      status: "已完成",
      worker: "赵师傅",
      priority: "紧急",
    },
    {
      id: "REP-20260426-03",
      room: "C-301",
      type: "网络故障",
      item: "电视无法上网",
      reporter: "长者家属",
      date: "2026-04-26 14:00",
      status: "已完成",
      worker: "李网管",
      priority: "普通",
    },
  ]);

  const [workers, setWorkers] = useState([
    {
      id: "WK-001",
      name: "王师傅",
      skill: "水电、家电",
      status: "忙碌",
      phone: "138-0000-0001",
    },
    {
      id: "WK-002",
      name: "赵师傅",
      skill: "木工、泥瓦",
      status: "空闲",
      phone: "139-0000-0002",
    },
    {
      id: "WK-003",
      name: "李网管",
      skill: "弱电、网络",
      status: "空闲",
      phone: "135-0000-0003",
    },
  ]);

  const filteredTickets = tickets.filter((t) => {
    let matchStatus = true;
    if (activeTab === "pending") matchStatus = t.status === "待派单";
    if (activeTab === "processing") matchStatus = t.status === "维修中";
    if (activeTab === "completed") matchStatus = t.status === "已完成";

    // special handling for team tab
    if (activeTab === "team") return false;

    return (
      matchStatus &&
      (t.room.includes(searchQuery) || t.item.includes(searchQuery))
    );
  });

  const filteredWorkers = workers.filter((w) => w.name.includes(searchQuery));

  const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket = {
      id: `REP-${new Date().toISOString().replace(/\D/g,'').slice(0,8)}-${Math.floor(Math.random() * 90 + 10)}`,
      room: formData.get("room") as string,
      type: formData.get("type") as string,
      item: formData.get("item") as string,
      reporter: formData.get("reporter") as string,
      date: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      status: "待派单",
      priority: formData.get("priority") as string,
    };
    setTickets([newTicket, ...tickets]);
    toast.success("新建报修工单成功");
    setShowNewTicketModal(false);
  };

  const handleCreateWorker = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newWorker = {
      id: `WK-00${workers.length + 1}`,
      name: formData.get("name") as string,
      skill: formData.get("skill") as string,
      status: "空闲",
      phone: formData.get("phone") as string,
    };
    setWorkers([newWorker, ...workers]);
    toast.success("录入工人资料成功");
    setShowNewWorkerModal(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            设施报修与维修派单
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            管理各区域设施报修工单，并派发给后勤维修人员
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab !== "team" ? (
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> 记录新报修
            </button>
          ) : (
            <button
              onClick={() => setShowNewWorkerModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> 录入维修工人
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-rose-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-rose-700 mb-1">
                待派单任务
              </p>
              <h3 className="text-2xl font-bold text-rose-700">{tickets.filter(t => t.status === '待派单').length}</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                正在处理中
              </p>
              <h3 className="text-2xl font-bold text-blue-700">{tickets.filter(t => t.status === '维修中').length}</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-emerald-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-1">
                历史已完成
              </p>
              <h3 className="text-2xl font-bold text-emerald-700">{tickets.filter(t => t.status === '已完成').length}</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-500 shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
            {["pending", "processing", "completed", "team"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab === "pending" && "待派单工单"}
                {tab === "processing" && "维修中工单"}
                {tab === "completed" && "历史记录"}
                {tab === "team" && "维修班组"}
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
                placeholder={
                  activeTab === "team" ? "搜索维修人员..." : "搜索位置或内容..."
                }
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {activeTab !== "team" ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">工单编号</th>
                  <th className="px-6 py-4 font-medium">位置/房号</th>
                  <th className="px-6 py-4 font-medium">类型</th>
                  <th className="px-6 py-4 font-medium">报修内容</th>
                  <th className="px-6 py-4 font-medium">优先级</th>
                  <th className="px-6 py-4 font-medium">报修时间</th>
                  <th className="px-6 py-4 font-medium">状态 / 负责人</th>
                  <th className="px-6 py-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredTickets.map((tc) => (
                  <tr key={tc.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {tc.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {tc.room}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                        {tc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{tc.item}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tc.priority === "紧急"
                            ? "bg-rose-100 text-rose-700"
                            : "text-slate-500"
                        }`}
                      >
                        {tc.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{tc.date}</td>
                    <td className="px-6 py-4">
                      {tc.status === "待派单" ? (
                        <span className="text-xs font-medium text-rose-600">
                          待派单
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${tc.status === "维修中" ? "bg-blue-500" : "bg-emerald-500"}`}
                          ></span>
                          <span className="font-medium">{tc.worker}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {tc.status === "待派单" && (
                        <button
                          onClick={() => {
                            setTickets(
                              tickets.map((t) =>
                                t.id === tc.id
                                  ? {
                                      ...t,
                                      status: "维修中",
                                      worker: "测试工人",
                                    }
                                  : t,
                              ),
                            );
                            toast.success("已指派测试工人");
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition w-full"
                        >
                          指派工人
                        </button>
                      )}
                      {tc.status === "维修中" && (
                        <button
                          onClick={() => {
                            setTickets(
                              tickets.map((t) =>
                                t.id === tc.id ? { ...t, status: "已完成" } : t,
                              ),
                            );
                            toast.success("已确认完工");
                          }}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-sm font-medium transition w-full"
                        >
                          确认完工
                        </button>
                      )}
                      {tc.status === "已完成" && (
                        <button
                          onClick={() => toast.info(`报修人: ${tc.reporter} | 完工状态: 正常`)}
                          className="text-slate-500 hover:text-slate-700 font-medium text-sm w-full"
                        >
                          查看详情
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      没有任何符合条件的工单
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((w) => (
                <Card
                  key={w.id}
                  className="border border-slate-200 shadow-sm hover:shadow-md transition bg-white"
                >
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                          <UserCircle className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">
                            {w.name}
                          </h3>
                          <p className="text-sm text-slate-500">{w.id}</p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${w.status === "空闲" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                      >
                        {w.status}
                      </span>
                    </div>
                    <div className="space-y-2 mt-4 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">专业技能</span>
                        <span className="font-medium text-slate-700">
                          {w.skill}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">联系电话</span>
                        <span className="font-mono text-slate-700">
                          {w.phone}
                        </span>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={() => toast.success("资料更新成功")}
                        className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm font-medium transition"
                      >
                        更新状态
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">
                   记录新报修工单
                </h3>
                <button type="button" onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleCreateTicket}>
               <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">发生位置/房号 *</label>
                     <input name="room" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：A-102" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">分类 *</label>
                        <select name="type" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                           <option value="水电维修">水电维修</option>
                           <option value="家电维修">家电维修</option>
                           <option value="设施损坏">设施损坏</option>
                           <option value="网络故障">网络故障</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">优先级</label>
                        <select name="priority" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                           <option value="普通">普通</option>
                           <option value="紧急">紧急</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">报修内容 *</label>
                     <textarea name="item" required rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="简单描述受损情况" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">报修人/联系人</label>
                     <input name="reporter" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="报告问题的员工或家属姓名" />
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowNewTicketModal(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">提交报修</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* New Worker Modal */}
      {showNewWorkerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">
                   录入维修工资料
                </h3>
                <button type="button" onClick={() => setShowNewWorkerModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleCreateWorker}>
               <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">工人姓名 *</label>
                     <input name="name" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="师傅姓名" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">专业技能 *</label>
                     <input name="skill" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：水电、泥瓦、家电维修等" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">联系电话 *</label>
                     <input name="phone" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="手机号" />
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowNewWorkerModal(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm">保存工人资料</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

