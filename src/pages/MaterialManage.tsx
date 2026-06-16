import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Plus, Filter, Edit, Trash2, X, Download } from "lucide-react";
import { toast } from "sonner";

export function MaterialManage() {
  const [activeTab, setActiveTab] = useState("material");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [matForm, setMatForm] = useState({ name: "", category: "", unit: "", price: "", supplier: "", status: "启用" });
  const [supForm, setSupForm] = useState({ name: "", contact: "", phone: "", type: "", credit: "良好" });

  const [materials, setMaterials] = useState([
    {
      id: "MAT-1001",
      name: "医用外科口罩",
      category: "医疗耗材",
      unit: "个",
      price: "0.50",
      supplier: "国药控股集团",
      status: "启用",
    },
    {
      id: "MAT-1002",
      name: "无菌纱布块",
      category: "医疗耗材",
      unit: "包",
      price: "2.50",
      supplier: "稳健医疗",
      status: "启用",
    },
    {
      id: "MAT-2001",
      name: "大米(东北珍宝岛)",
      category: "餐饮物资",
      unit: "kg",
      price: "8.50",
      supplier: "粮油专供超市",
      status: "启用",
    },
    {
      id: "MAT-2002",
      name: "食用油(金龙鱼5L)",
      category: "餐饮物资",
      unit: "桶",
      price: "69.00",
      supplier: "粮油专供超市",
      status: "启用",
    },
    {
      id: "MAT-3001",
      name: "成人纸尿裤(L号)",
      category: "日用耗材",
      unit: "包",
      price: "45.00",
      supplier: "康复之家",
      status: "启用",
    },
    {
      id: "MAT-4001",
      name: "消毒液(84/500ml)",
      category: "清洁用品",
      unit: "瓶",
      price: "6.00",
      supplier: "某日化厂",
      status: "停用",
    },
  ]);

  const [suppliers, setSuppliers] = useState([
    {
      id: "SUP-001",
      name: "国药控股集团",
      contact: "王经理",
      phone: "138-0000-0001",
      type: "医疗耗材",
      credit: "良好",
    },
    {
      id: "SUP-002",
      name: "稳健医疗",
      contact: "李经理",
      phone: "139-0000-0002",
      type: "医疗耗材",
      credit: "良好",
    },
    {
      id: "SUP-003",
      name: "粮油专供超市",
      contact: "张老板",
      phone: "135-0000-0003",
      type: "餐饮物资",
      credit: "一般",
    },
    {
      id: "SUP-004",
      name: "康复之家",
      contact: "赵总",
      phone: "137-0000-0004",
      type: "日用/康复",
      credit: "优秀",
    },
  ]);

  const filteredMaterials = materials.filter(
    (m) => m.name.includes(searchQuery) || m.id.includes(searchQuery),
  );
  const filteredSuppliers = suppliers.filter(
    (s) => s.name.includes(searchQuery) || s.id.includes(searchQuery),
  );

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            物料档案与供应商
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            管理物资名录、耗材类别及供应商信誉和联系方式
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => toast.success(`已导出 ${activeTab === 'material' ? '物料' : '供应商'} 数据记录`)}
            className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-slate-600 rounded-md text-sm font-medium hover:bg-slate-50 transition"
          >
            <Download className="w-4 h-4" /> 导出数据
          </button>
          <button
            onClick={() => {
              setEditingItem(null);
              if (activeTab === "material") {
                 setMatForm({ name: "", category: "", unit: "", price: "", supplier: "", status: "启用" });
              } else {
                 setSupForm({ name: "", contact: "", phone: "", type: "", credit: "良好" });
              }
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {activeTab === "material" ? "新增物料" : "新增供应商"}
          </button>
        </div>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
            {["material", "supplier"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSearchQuery("");
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab === "material" && "物料名录"}
                {tab === "supplier" && "供应商名录"}
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
                placeholder="搜索名称或编码..."
                className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
              <Filter className="w-4 h-4" /> 筛选
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          {activeTab === "material" ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">物料编码</th>
                  <th className="px-6 py-4 font-medium">名称规格</th>
                  <th className="px-6 py-4 font-medium">类别</th>
                  <th className="px-6 py-4 font-medium">单位</th>
                  <th className="px-6 py-4 font-medium text-right">参考单价</th>
                  <th className="px-6 py-4 font-medium">绑定供应商</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredMaterials.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{item.unit}</td>
                    <td className="px-6 py-4 text-right font-medium">
                      ¥ {item.price}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === "启用"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setMatForm({ name: item.name, category: item.category, unit: item.unit, price: item.price, supplier: item.supplier, status: item.status });
                          setShowAddModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`确定要删除物料 [${item.name}] 吗？`)) {
                            setMaterials(materials.filter(m => m.id !== item.id));
                            toast.success("已删除物料");
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredMaterials.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      没有任何符合条件的物料
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">供应商ID</th>
                  <th className="px-6 py-4 font-medium">企业名称</th>
                  <th className="px-6 py-4 font-medium">主营业务</th>
                  <th className="px-6 py-4 font-medium">联系人</th>
                  <th className="px-6 py-4 font-medium font-mono">联系电话</th>
                  <th className="px-6 py-4 font-medium">信誉评价</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">
                      {sup.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {sup.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{sup.type}</td>
                    <td className="px-6 py-4">{sup.contact}</td>
                    <td className="px-6 py-4 font-mono">{sup.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          sup.credit === "优秀"
                            ? "bg-indigo-100 text-indigo-700"
                            : sup.credit === "良好"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {sup.credit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => {
                          setEditingItem(sup);
                          setSupForm({ name: sup.name, contact: sup.contact, phone: sup.phone, type: sup.type, credit: sup.credit });
                          setShowAddModal(true);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`确定要删除供应商 [${sup.name}] 吗？`)) {
                            setSuppliers(suppliers.filter(s => s.id !== sup.id));
                            toast.success("已删除供应商");
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      没有任何符合条件的供应商
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {activeTab === "material" ? "新增物料" : "新增供应商"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              {activeTab === "material" ? (
                <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">名称规格 <span className="text-rose-500">*</span></label>
                    <input type="text" value={matForm.name} onChange={e => setMatForm({...matForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="如：一次性医用手套" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">类别 <span className="text-rose-500">*</span></label>
                      <input type="text" value={matForm.category} onChange={e => setMatForm({...matForm, category: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="如：医疗耗材" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">单位 <span className="text-rose-500">*</span></label>
                      <input type="text" value={matForm.unit} onChange={e => setMatForm({...matForm, unit: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="如：盒" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">参考单价</label>
                      <input type="number" step="0.01" value={matForm.price} onChange={e => setMatForm({...matForm, price: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">状态</label>
                      <select value={matForm.status} onChange={e => setMatForm({...matForm, status: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                        <option value="启用">启用</option>
                        <option value="停用">停用</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">绑定供应商</label>
                    <select value={matForm.supplier} onChange={e => setMatForm({...matForm, supplier: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-600">
                       <option value="">--未绑定--</option>
                       {suppliers.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                 <div className="space-y-4 text-sm">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">企业名称 <span className="text-rose-500">*</span></label>
                    <input type="text" value={supForm.name} onChange={e => setSupForm({...supForm, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="如：某某医疗器械公司" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">主营业务</label>
                      <input type="text" value={supForm.type} onChange={e => setSupForm({...supForm, type: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="如：医疗耗材" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">信誉评价</label>
                      <select value={supForm.credit} onChange={e => setSupForm({...supForm, credit: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                        <option value="优秀">优秀</option>
                        <option value="良好">良好</option>
                        <option value="一般">一般</option>
                        <option value="差">差</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">联系人</label>
                      <input type="text" value={supForm.contact} onChange={e => setSupForm({...supForm, contact: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="如：张经理" />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">联系电话</label>
                      <input type="text" value={supForm.phone} onChange={e => setSupForm({...supForm, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg px-3 py-2" placeholder="电话..." />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (activeTab === "material") {
                     if (!matForm.name || !matForm.category || !matForm.unit) {
                        toast.error("请填写物料必填项"); return;
                     }
                     if (editingItem) {
                        setMaterials(materials.map(m => m.id === editingItem.id ? { ...m, ...matForm } : m));
                        toast.success("物料修改成功");
                     } else {
                        const newId = `MAT-${Date.now().toString().slice(-4)}`;
                        setMaterials([{ id: newId, ...matForm }, ...materials]);
                        toast.success("物料添加成功");
                     }
                  } else {
                     if (!supForm.name) {
                        toast.error("请输入企业名称"); return;
                     }
                     if (editingItem) {
                        setSuppliers(suppliers.map(s => s.id === editingItem.id ? { ...s, ...supForm } : s));
                        toast.success("供应商修改成功");
                     } else {
                        const newId = `SUP-${Date.now().toString().slice(-3)}`;
                        setSuppliers([{ id: newId, ...supForm }, ...suppliers]);
                        toast.success("供应商添加成功");
                     }
                  }
                  setShowAddModal(false);
                }}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors shadow-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
