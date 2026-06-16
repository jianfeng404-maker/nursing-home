import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Search,
  PackageSearch,
  AlertTriangle,
  ArrowDownToLine,
  RefreshCw,
  X
} from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../store";

export function InventoryManage() {
  const { inventory: inventoryListRaw, inventoryAudits } = useStore();
  const [activeWarehouse, setActiveWarehouse] = useState("all");
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const inventoryList = inventoryListRaw.map((r: any) => ({
    id: r.id.toString(),
    name: r.name,
    warehouse: r.warehouse,
    stock: r.stock,
    unit: r.unit,
    safeStock: r.safeStock,
    val: (r.stock * 50).toFixed(2), // dummy stable multiplier
    lastUpdate: r.lastUpdate || '未知'
  }));

  const filteredInventory = inventoryList.filter(
    (item) => (activeWarehouse === "all" || item.warehouse === activeWarehouse) && 
              (item.name.includes(searchQuery) || item.id.includes(searchQuery))
  );
  const lowStockCount = inventoryList.filter(
    (item) => item.stock < item.safeStock,
  ).length;

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            库存查询与安全预警
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            实时监控各库房物资数量，对于低于安全库存的物资及时预警
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAuditModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> 库存盘点记录
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-blue-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                当前库存总价值
              </p>
              <h3 className="text-2xl font-bold text-blue-700">¥ 17,772.00</h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm">
              <PackageSearch className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm shadow-slate-200/50 bg-amber-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700 mb-1">
                低于安全库存物资数量
              </p>
              <h3 className="text-2xl font-bold text-amber-700">
                {lowStockCount} 项
              </h3>
            </div>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-amber-500 shadow-sm">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
            {["all", "医疗库", "食品库", "后勤库", "清洁库"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveWarehouse(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeWarehouse === tab
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab === "all" && "全部库房"}
                {tab !== "all" && tab}
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
                placeholder="搜索物料或编码..."
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-indigo-500 bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">物料编码</th>
                <th className="px-6 py-4 font-medium">名称规格</th>
                <th className="px-6 py-4 font-medium">所属库房</th>
                <th className="px-6 py-4 font-medium text-right">可用库存量</th>
                <th className="px-6 py-4 font-medium text-right">安全库存线</th>
                <th className="px-6 py-4 font-medium">预警状态</th>
                <th className="px-6 py-4 font-medium text-right">库存总值</th>
                <th className="px-6 py-4 font-medium">最后变动时间</th>
                <th className="px-6 py-4 font-medium text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filteredInventory.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-slate-50/50 transition ${item.stock < item.safeStock ? "bg-rose-50/20" : ""}`}
                >
                  <td className="px-6 py-4 font-mono text-slate-500">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{item.warehouse}</td>
                  <td
                    className={`px-6 py-4 text-right font-bold text-lg ${item.stock < item.safeStock ? "text-rose-600" : "text-slate-800"}`}
                  >
                    {item.stock}{" "}
                    <span className="text-xs text-slate-500 font-normal ml-1">
                      {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {item.safeStock}{" "}
                    <span className="text-xs ml-1">{item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    {item.stock < item.safeStock ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-rose-700 px-2 py-1 bg-rose-100 rounded-full w-max">
                        <AlertTriangle className="w-3 h-3" /> 库存不足
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-emerald-600 px-2 py-1 bg-emerald-50 rounded-full w-max">
                        充足
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    ¥ {item.val}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {item.lastUpdate}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        toast.success(`已生成 ${item.name} 补充采购单`)
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-1 mx-auto"
                    >
                      <ArrowDownToLine className="w-4 h-4" /> 快速采购
                    </button>
                  </td>
                </tr>
              ))}
              {filteredInventory.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    没有任何符合条件的库存记录
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Inventory Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-600" />
                系统库存盘点
              </h3>
              <button onClick={() => setShowAuditModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4 p-4 border rounded-lg bg-indigo-50 border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2">新建盘点计划</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">选择盘点仓库</label>
                    <select className="w-full border-slate-300 rounded text-sm p-2 outline-none">
                      <option>所有仓库</option>
                      <option>医疗库</option>
                      <option>食品库</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">盘点负责人</label>
                    <input className="w-full border border-slate-300 rounded text-sm p-2 outline-none" placeholder="输入姓名" defaultValue="系统管理员" />
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button 
                    onClick={() => {
                       toast.success("盘点计划已生成并派发");
                       setShowAuditModal(false);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                  >
                    生成盘点表
                  </button>
                </div>
              </div>

              <h4 className="font-bold text-slate-800 mb-3 text-sm">最近盘点记录</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-2 font-medium">盘点单号</th>
                      <th className="px-4 py-2 font-medium">仓库</th>
                      <th className="px-4 py-2 font-medium">状态</th>
                      <th className="px-4 py-2 font-medium">时间</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {inventoryAudits.map((audit) => (
                      <tr key={audit.id}>
                         <td className="px-4 py-3 font-mono text-xs">{audit.id}</td>
                         <td className="px-4 py-3">{audit.title}</td>
                         <td className="px-4 py-3">
                           <span className={`px-2 py-1 rounded text-xs ${audit.status === '已完成' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                             {audit.status}
                           </span>
                         </td>
                         <td className="px-4 py-3 text-slate-500 text-xs">{audit.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
