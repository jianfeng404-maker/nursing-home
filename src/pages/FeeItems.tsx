import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Plus, Filter, Edit, Trash2, X, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

interface FeeItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  price: string;
  status: string;
  description: string;
}

export function FeeItems() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FeeItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const initialItems: FeeItem[] = [
    { id: "FI-1001", name: "标准单人房床位费", category: "床位费", unit: "元/月", price: "4,500.00", status: "启用", description: "A栋、B栋标准单人房" },
    { id: "FI-1002", name: "双人房床位费", category: "床位费", unit: "元/月", price: "2,800.00", status: "启用", description: "B栋双人合用床位" },
    { id: "FI-2001", name: "基础餐饮费", category: "餐饮费", unit: "元/月", price: "1,200.00", status: "启用", description: "每日三餐，标准配餐" },
    { id: "FI-2002", name: "高配营养餐饮费", category: "餐饮费", unit: "元/月", price: "1,800.00", status: "启用", description: "每日三餐加两顿小吃，定制配餐" },
    { id: "FI-3001", name: "一级护理费", category: "护理费", unit: "元/月", price: "2,000.00", status: "启用", description: "针对自理老人" },
    { id: "FI-3002", name: "二级护理费", category: "护理费", unit: "元/月", price: "3,500.00", status: "启用", description: "针对半失能老人" },
    { id: "FI-3003", name: "三级护理费", category: "护理费", unit: "元/月", price: "5,500.00", status: "启用", description: "针对全失能老人" },
    { id: "FI-4001", name: "基础医疗服务费", category: "医疗费", unit: "元/月", price: "500.00", status: "停用", description: "常规测量、巡诊" },
  ];

  const [items, setItems] = useState<FeeItem[]>(initialItems);

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    const matchesSearch = item.name.includes(searchQuery) || item.id.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: FeeItem = {
      id: editingItem ? editingItem.id : `FI-${Math.floor(Math.random() * 10000)}`,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      unit: formData.get('unit') as string,
      price: formData.get('price') as string,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setItems([newItem, ...items]);
    }
    setShowItemModal(false);
  };

  const openEditModal = (item: FeeItem) => {
    setEditingItem(item);
    setShowItemModal(true);
  };

  const openNewModal = () => {
    setEditingItem(null);
    setShowItemModal(true);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      setItems(items.filter(item => item.id !== itemToDelete));
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const toggleStatus = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === '启用' ? '停用' : '启用' };
      }
      return item;
    }));
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">费用项目及标准设置</h2>
          <p className="text-slate-500 text-sm mt-1">管理机构的各项收费项目，设定计费单元及收费标准</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openNewModal} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            <Plus className="w-4 h-4" /> 新增费用项目
          </button>
        </div>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0">
          <div className="flex gap-2">
             {['all', '床位费', '餐饮费', '护理费', '医疗费'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'all' && '全部费用'}
                  {tab !== 'all' && tab}
                </button>
             ))}
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索项目名称/编码..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-sm w-64 focus:outline-none focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors"
                />
             </div>
             <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                <Filter className="w-4 h-4" /> 筛选
             </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 shadow-sm z-10">
              <tr className="text-slate-500 text-sm">
                <th className="px-6 py-4 font-medium">项目编码</th>
                <th className="px-6 py-4 font-medium">项目名称</th>
                <th className="px-6 py-4 font-medium">费用类别</th>
                <th className="px-6 py-4 font-medium">计费单位</th>
                <th className="px-6 py-4 font-medium">标准单价</th>
                <th className="px-6 py-4 font-medium">状态</th>
                <th className="px-6 py-4 font-medium">备注说明</th>
                <th className="px-6 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
               {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                     <td className="px-6 py-4 font-mono text-slate-500">{item.id}</td>
                     <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                     <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium">{item.category}</span>
                     </td>
                     <td className="px-6 py-4">{item.unit}</td>
                     <td className="px-6 py-4 text-emerald-600 font-bold">{item.price}</td>
                     <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === '启用' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {item.status}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-slate-500">{item.description}</td>
                     <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => toggleStatus(item.id)} className={`p-1.5 rounded transition ${item.status === '启用' ? 'text-amber-500 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`} title={item.status === '启用' ? '停用' : '启用'}>
                           {item.status === '启用' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button onClick={() => openEditModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => { setItemToDelete(item.id); setShowDeleteModal(true); }} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                     </td>
                  </tr>
               ))}
               {filteredItems.length === 0 && (
                 <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">没有任何符合条件的项目</td></tr>
               )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Item Form Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-lg">
                   {editingItem ? '编辑费用项目' : '新增费用项目'}
                </h3>
                <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
             </div>
             
             <form onSubmit={handleSaveItem}>
               <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">项目名称 *</label>
                     <input name="name" defaultValue={editingItem?.name || ""} required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400" placeholder="如：一级护理费" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">费用类别 *</label>
                       <select name="category" defaultValue={editingItem?.category || "床位费"} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                          <option value="床位费">床位费</option>
                          <option value="餐饮费">餐饮费</option>
                          <option value="护理费">护理费</option>
                          <option value="医疗费">医疗费</option>
                          <option value="活动费">活动费</option>
                          <option value="其它">其它</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">计费单位 *</label>
                       <input name="unit" defaultValue={editingItem?.unit || "元/月"} required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：元/月" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">标准单价 *</label>
                       <input name="price" defaultValue={editingItem?.price || ""} required className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如：1500.00" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-medium text-slate-700">状态 *</label>
                       <select name="status" defaultValue={editingItem?.status || "启用"} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                          <option value="启用">启用</option>
                          <option value="停用">停用</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-medium text-slate-700">备注说明</label>
                     <textarea name="description" rows={3} defaultValue={editingItem?.description || ""} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500 placeholder-slate-400" placeholder="填写收费适用的人群或场景描述..."></textarea>
                  </div>
               </div>
               
               <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowItemModal(false)} className="px-4 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm">保存</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">确认删除项目？</h3>
                <p className="text-slate-500 text-sm">删除后将无法恢复。如果您还需要保留相关记录但不使用，建议将其状态设为"停用"。</p>
             </div>
             
             <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button onClick={() => {setShowDeleteModal(false); setItemToDelete(null);}} className="flex-1 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                <button onClick={handleDelete} className="flex-1 py-2 bg-rose-600 text-white rounded-md text-sm font-medium hover:bg-rose-700 transition shadow-sm">确认删除</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

