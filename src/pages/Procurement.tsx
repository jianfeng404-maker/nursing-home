import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Search,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";

export function Procurement() {
  const [activeTab, setActiveTab] = useState("orders");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReqModal, setShowReqModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "PO-20260428-001",
      date: "2026-04-28",
      supplier: "粮油专供超市",
      totalAmount: "1,250.00",
      status: "待收货",
      creator: "张采购",
      items: 3,
    },
    {
      id: "PO-20260425-002",
      date: "2026-04-25",
      supplier: "稳健医疗",
      totalAmount: "5,600.00",
      status: "已入库",
      creator: "李护士长",
      items: 5,
    },
    {
      id: "PO-20260420-001",
      date: "2026-04-20",
      supplier: "康复之家",
      totalAmount: "12,000.00",
      status: "已入库",
      creator: "王主管",
      items: 12,
    },
  ]);

  const [requisitions, setRequisitions] = useState([
    {
      id: "REQ-20260428-081",
      date: "2026-04-28 09:30",
      department: "护理A区",
      applicant: "陈护士",
      reason: "日常更换",
      status: "待审批",
      items: 2,
    },
    {
      id: "REQ-20260428-022",
      date: "2026-04-28 08:15",
      department: "餐饮部",
      applicant: "刘大厨",
      reason: "食堂领料",
      status: "待出库",
      items: 4,
    },
    {
      id: "REQ-20260427-015",
      date: "2026-04-27 14:00",
      department: "保洁部",
      applicant: "王阿姨",
      reason: "清洁剂补充",
      status: "已出库",
      items: 1,
    },
  ]);

  const handleCreateOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newOrder = {
      id: `PO-${new Date().toISOString().replace(/\D/g,'').slice(0,8)}-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toISOString().split('T')[0],
      supplier: formData.get("supplier") as string,
      totalAmount: formData.get("amount") as string,
      status: "待收货",
      creator: "当前用户",
      items: Number(formData.get("items")),
    };
    setPurchaseOrders([newOrder, ...purchaseOrders]);
    toast.success("新建采购单成功");
    setShowOrderModal(false);
  };

  const handleCreateReq = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newReq = {
      id: `REQ-${new Date().toISOString().replace(/\D/g,'').slice(0,8)}-${Math.floor(Math.random() * 900 + 100)}`,
      date: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      department: formData.get("department") as string,
      applicant: "当前用户",
      reason: formData.get("reason") as string,
      status: "待审批",
      items: Number(formData.get("items")),
    };
    setRequisitions([newReq, ...requisitions]);
    toast.success("发起领用申请成功");
    setShowReqModal(false);
  };

  const filteredOrders = purchaseOrders.filter(
    (po) => po.id.includes(searchQuery) || po.supplier.includes(searchQuery)
  );

  const filteredRequisitions = requisitions.filter(
    (req) => req.id.includes(searchQuery) || req.department.includes(searchQuery)
  );

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            采购收货与领用申请
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            处理外部采购单的入库流程，以及内部各部门物料领用的审批和出库
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === "orders" ? (
            <button
              onClick={() => setShowOrderModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" /> 新建采购单
            </button>
          ) : (
            <button
              onClick={() => setShowReqModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              <Send className="w-4 h-4" /> 发起领用申请
            </button>
          )}
        </div>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
            {["orders", "requisitions"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab === "orders" && "采购收货入库"}
                {tab === "requisitions" && "内部领用出库"}
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
                placeholder="搜索单号或供应商..."
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {activeTab === "orders" ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">采购单号</th>
                  <th className="px-6 py-4 font-medium">下单日期</th>
                  <th className="px-6 py-4 font-medium">供应商</th>
                  <th className="px-6 py-4 font-medium">包含物资种类</th>
                  <th className="px-6 py-4 font-medium text-right">总金额</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium">制单人</th>
                  <th className="px-6 py-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {po.id}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{po.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {po.supplier}
                    </td>
                    <td className="px-6 py-4">{po.items} 种</td>
                    <td className="px-6 py-4 text-right font-medium">
                      ¥ {po.totalAmount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`flex items-center gap-1.5 w-max px-2 py-1 rounded text-xs font-medium ${
                          po.status === "已入库"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {po.status === "待收货" && (
                          <Clock className="w-3 h-3" />
                        )}
                        {po.status === "已入库" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {po.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{po.creator}</td>
                    <td className="px-6 py-4 text-center">
                      {po.status === "待收货" ? (
                        <button
                          onClick={() => {
                            setPurchaseOrders(
                              purchaseOrders.map((p) =>
                                p.id === po.id ? { ...p, status: "已入库" } : p,
                              ),
                            );
                            toast.success("验收入库成功");
                          }}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-sm font-medium transition"
                        >
                          验收入库
                        </button>
                      ) : (
                        <button
                          onClick={() => toast.info(`正在查看单据详情：${po.id}`)}
                          className="text-slate-500 hover:text-slate-700 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
                        >
                          <FileText className="w-4 h-4" /> 查看单据
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">申请单号</th>
                  <th className="px-6 py-4 font-medium">申请时间</th>
                  <th className="px-6 py-4 font-medium">领用部门</th>
                  <th className="px-6 py-4 font-medium">申请人</th>
                  <th className="px-6 py-4 font-medium">包含物资种类</th>
                  <th className="px-6 py-4 font-medium">领用原因</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredRequisitions.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {req.id}
                    </td>
                    <td className="px-6 py-4 text-slate-500">{req.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {req.department}
                    </td>
                    <td className="px-6 py-4">{req.applicant}</td>
                    <td className="px-6 py-4">{req.items} 种</td>
                    <td className="px-6 py-4 text-slate-500">{req.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === "待审批"
                            ? "bg-amber-100 text-amber-700"
                            : req.status === "待出库"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center flex justify-center gap-2">
                      {req.status === "待审批" && (
                        <button
                          onClick={() => {
                            setRequisitions(
                              requisitions.map((r) =>
                                r.id === req.id
                                  ? { ...r, status: "待出库" }
                                  : r,
                              ),
                            );
                            toast.success("审批已通过");
                          }}
                          className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded text-sm font-medium transition"
                        >
                          审核
                        </button>
                      )}
                      {req.status === "待出库" && (
                        <button
                          onClick={() => {
                            setRequisitions(
                              requisitions.map((r) =>
                                r.id === req.id
                                  ? { ...r, status: "已出库" }
                                  : r,
                              ),
                            );
                            toast.success("资产已出库");
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition"
                        >
                          确认出库
                        </button>
                      )}
                      <button
                        onClick={() => toast.info(`正在查看申请明细：${req.id}`)}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition"
                        title="查看明细"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* New Purchase Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">新建采购单</h3>
                <button type="button" onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleCreateOrder}>
               <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">供应商 *</label>
                     <input name="supplier" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：稳健医疗" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">物资种类数量 *</label>
                     <input name="items" type="number" min="1" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：5" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">预估总金额 (¥) *</label>
                     <input name="amount" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：1200.00" />
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowOrderModal(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                  <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition shadow-sm">提交并生成入库单</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* New Requisition Modal */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">发起领用申请</h3>
                <button type="button" onClick={() => setShowReqModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleCreateReq}>
               <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">领用部门 *</label>
                     <select name="department" className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                        <option value="护理A区">护理A区</option>
                        <option value="护理B区">护理B区</option>
                        <option value="餐饮部">餐饮部</option>
                        <option value="保洁部">保洁部</option>
                        <option value="行政部">行政部</option>
                     </select>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">物资种类数量 *</label>
                     <input name="items" type="number" min="1" required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：3" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">领用原因 *</label>
                     <textarea name="reason" rows={3} required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="简单说明领用的目的" />
                  </div>
               </div>
               <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowReqModal(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">提交申请</button>
               </div>
             </form>
          </div>
        </div>
      )}

    </div>
  );
}
