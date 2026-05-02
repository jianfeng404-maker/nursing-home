import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Plus, Edit, Trash2, Search, Settings2, X, CheckCircle2, AlertCircle } from "lucide-react";

interface DictCategory {
  id: string;
  name: string;
  code: string;
}

interface DictItem {
  id: string;
  categoryId: string;
  label: string;
  value: string;
  sort: number;
  status: '启用' | '停用';
}

export function SysBasic() {
  const [categories] = useState<DictCategory[]>([
    { id: 'C1', name: '房型设置', code: 'room_type' },
    { id: 'C2', name: '护理等级', code: 'care_level' },
    { id: 'C3', name: '请假类型', code: 'leave_type' },
    { id: 'C4', name: '报修类型', code: 'repair_type' },
    { id: 'C5', name: '长者来源', code: 'elder_source' },
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('C2');
  const [searchQuery, setSearchQuery] = useState('');

  const [items, setItems] = useState<DictItem[]>([
    { id: 'I1', categoryId: 'C2', label: '特级护理', value: 'level_1', sort: 1, status: '启用' },
    { id: 'I2', categoryId: 'C2', label: '一级护理', value: 'level_2', sort: 2, status: '启用' },
    { id: 'I3', categoryId: 'C2', label: '二级护理', value: 'level_3', sort: 3, status: '启用' },
    { id: 'I4', categoryId: 'C2', label: '三级护理', value: 'level_4', sort: 4, status: '启用' },
    { id: 'I5', categoryId: 'C2', label: '专人护理', value: 'level_special', sort: 5, status: '启用' },
  ]);

  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DictItem | null>(null);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const currentItems = items
    .filter(i => i.categoryId === activeCategory)
    .filter(i => i.label.includes(searchQuery) || i.value.includes(searchQuery))
    .sort((a, b) => a.sort - b.sort);

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: DictItem = {
      id: editingItem ? editingItem.id : `I${Date.now()}`,
      categoryId: activeCategory,
      label: formData.get('label') as string,
      value: formData.get('value') as string,
      sort: parseInt(formData.get('sort') as string, 10),
      status: formData.get('status') as '启用' | '停用',
    };

    if (editingItem) {
      setItems(items.map(i => i.id === newItem.id ? newItem : i));
    } else {
      setItems([...items, newItem]);
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = () => {
    if (deletingItemId) {
      setItems(items.filter(i => i.id !== deletingItemId));
      setDeletingItemId(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">基础数据字典</h2>
          <p className="text-slate-500 text-sm mt-1">管理系统中各类下拉选单和分类的数据字典</p>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <Card className="w-64 shrink-0 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-slate-400" />
              字典分类
            </h3>
          </CardHeader>
          <CardContent className="p-2 overflow-y-auto flex-1">
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition ${
                    activeCategory === cat.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
          <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-800 text-lg">
                {categories.find(c => c.id === activeCategory)?.name} - 数据项
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索标签或键值..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 w-64 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm"
              onClick={() => { setEditingItem(null); setShowItemModal(true); }}
            >
              <Plus className="w-4 h-4" /> 添加数据项
            </button>
          </CardHeader>
          <CardContent className="p-0 overflow-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">排序</th>
                  <th className="px-6 py-4 font-medium">标签名 (Label)</th>
                  <th className="px-6 py-4 font-medium">键值 (Value)</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                {currentItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-mono text-slate-500">{item.sort}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.label}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{item.value}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.status === '启用' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          onClick={() => { setEditingItem(item); setShowItemModal(true); }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"
                          onClick={() => {
                            setDeletingItemId(item.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        该分类下暂无数据项
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">
                {editingItem ? '编辑数据项' : '添加数据项'}
              </h3>
              <button onClick={() => setShowItemModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSaveItem} className="flex flex-col">
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">标签名 (Label) *</label>
                  <input name="label" defaultValue={editingItem?.label || ''} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="如：一级护理" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">键值 (Value) *</label>
                  <input name="value" defaultValue={editingItem?.value || ''} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" placeholder="如：level_1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">排序值</label>
                    <input name="sort" type="number" defaultValue={editingItem?.sort || 1} required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">状态</label>
                    <select name="status" defaultValue={editingItem?.status || '启用'} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option value="启用">启用</option>
                      <option value="停用">停用</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowItemModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                  保存数据项
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">确认删除数据项？</h3>
                <p className="text-slate-500 text-sm">删除后不可恢复，如果已经在业务中使用，可能会导致数据异常显示。建议优先使用"停用"状态。</p>
             </div>
             
             <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button onClick={() => {setShowDeleteModal(false); setDeletingItemId(null);}} className="flex-1 py-2 border border-slate-300 bg-white text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 transition">取消</button>
                <button onClick={handleDeleteItem} className="flex-1 py-2 bg-rose-600 text-white rounded-md text-sm font-medium hover:bg-rose-700 transition shadow-sm">确认删除</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
