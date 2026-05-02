import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, Settings2, FileText, CheckCircle2, ListChecks, ArrowRight, UserCog, X, Link, ArrowRightCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore, CareLevel, ServiceItem } from '../store';

const colorOptions = [
  { label: '红色系 (高警惕)', value: 'bg-red-50 text-red-600 border-red-200' },
  { label: '橙色系 (中高)', value: 'bg-orange-50 text-orange-600 border-orange-200' },
  { label: '黄色系 (中度)', value: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
  { label: '绿色系 (轻度/自理)', value: 'bg-green-50 text-green-600 border-green-200' },
  { label: '蓝色系 (常规)', value: 'bg-blue-50 text-blue-600 border-blue-200' },
  { label: '紫色系 (特殊)', value: 'bg-purple-50 text-purple-600 border-purple-200' },
];

const CareSOPManage = () => {
  const { careLevels, serviceItems, setCareLevels, setServiceItems } = useStore();
  
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  
  // Set default selection when data loads
  useEffect(() => {
    if (careLevels.length > 0 && !selectedLevelId) {
      setSelectedLevelId(careLevels[0].id);
    }
  }, [careLevels, selectedLevelId]);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Modals state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<any>(null);
  const [levelForm, setLevelForm] = useState({ name: '', desc: '', price: 0, color: colorOptions[0].value });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [serviceForm, setServiceForm] = useState({
    name: '', category: '', frequency: '', duration: '', sopSteps: [] as string[]
  });

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Derived state
  const selectedLevel = careLevels.find(l => l.id === selectedLevelId);
  const levelServices = selectedLevel ? serviceItems.filter(s => s.includedIn.includes(selectedLevel.id)) : [];
  
  // Choose the currently active service
  // Either the explicitly selected one (if it belongs to current level), or the first one in the list
  let activeService = levelServices.find(s => s.id === selectedServiceId);
  if (!activeService && levelServices.length > 0) {
    activeService = levelServices[0];
  }

  // --- Handlers for Care Levels ---
  const handleOpenLevelModal = (level?: any) => {
    if (level) {
      setEditingLevel(level);
      setLevelForm({ ...level });
    } else {
      setEditingLevel(null);
      setLevelForm({ name: '', desc: '', price: 0, color: colorOptions[0].value });
    }
    setIsLevelModalOpen(true);
  };

  const handleSaveLevel = () => {
    if (!levelForm.name) return alert('请输入护理等级名称');
    if (editingLevel) {
      setCareLevels(careLevels.map(l => l.id === editingLevel.id ? { ...l, ...levelForm } : l));
    } else {
      const newId = `lvl-${Date.now()}`;
      const newLevel = { ...levelForm, id: newId };
      setCareLevels([...careLevels, newLevel]);
      setSelectedLevelId(newId);
    }
    setIsLevelModalOpen(false);
  };

  const handleDeleteLevel = (id: string) => {
    if (window.confirm('确定要删除此护理等级吗？')) {
      setCareLevels(careLevels.filter(l => l.id !== id));
      if (selectedLevelId === id) setSelectedLevelId(careLevels[0]?.id || null);
      setServiceItems(serviceItems.map(svc => ({
        ...svc,
        includedIn: svc.includedIn.filter(lvlId => lvlId !== id)
      })));
    }
  };

  // --- Handlers for Service SOP ---
  const handleOpenServiceModal = (service?: any) => {
    if (service) {
      setEditingService(service);
      setServiceForm({ ...service, sopSteps: [...service.sopSteps] });
    } else {
      setEditingService(null);
      setServiceForm({ name: '', category: '常规服务', frequency: '', duration: '', sopSteps: [''] });
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceForm.name) return alert('请输入服务名称');
    const cleanedForm = { ...serviceForm, sopSteps: serviceForm.sopSteps.filter(step => step.trim() !== '') };
    
    if (editingService) {
      setServiceItems(serviceItems.map(s => s.id === editingService.id ? { ...s, ...cleanedForm } : s));
    } else {
      const newService = { ...cleanedForm, id: `svc-${Date.now()}`, includedIn: selectedLevelId ? [selectedLevelId] : [] };
      setServiceItems([...serviceItems, newService]);
      setSelectedServiceId(newService.id);
      setIsLinkModalOpen(false); // Close link modal if it was opened from there
    }
    setIsServiceModalOpen(false);
  };
  
  const handleDeleteService = (id: string) => {
    if (window.confirm('确定要在全局删除此服务及SOP吗？该操作将影响所有关联的护理等级。')) {
      setServiceItems(serviceItems.filter(s => s.id !== id));
      setIsLinkModalOpen(false);
    }
  };

  // Group services for the Link modal
  const groupedServices = serviceItems.reduce((acc, svc) => {
    if (!acc[svc.category]) acc[svc.category] = [];
    acc[svc.category].push(svc);
    return acc;
  }, {} as Record<string, typeof serviceItems>);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 h-screen flex flex-col overflow-hidden bg-slate-50/50">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-shrink-0 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center">
             <Shield className="w-6 h-6 mr-2 text-indigo-600" />
             照护标准与 SOP
          </h1>
          <p className="text-sm text-slate-500 mt-1">清晰配置“护理等级”到“服务项”再到“SOP标准”的级联逻辑</p>
        </div>
      </div>

      <div className="flex flex-1 gap-5 min-h-0 pb-4">
        {/* Col 1: Care Levels */}
        <div className="w-[28%] bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm mr-2">1</span>
              选择护理等级
            </h3>
            <button onClick={() => handleOpenLevelModal()} className="p-1.5 hover:bg-slate-200 hover:text-indigo-600 rounded-md transition-colors text-slate-500" title="添加护理等级">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto p-3 space-y-3 flex-1">
            {careLevels.map(lvl => (
              <div 
                key={lvl.id} 
                onClick={() => setSelectedLevelId(lvl.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative group ${
                  selectedLevelId === lvl.id 
                    ? 'bg-indigo-50/50 border-indigo-400 shadow-sm' 
                    : 'bg-white border-transparent shadow-sm hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${lvl.color.split(' ')[0]}`}></div>
                  <div className={`font-bold ${selectedLevelId === lvl.id ? 'text-indigo-900' : 'text-slate-800'}`}>{lvl.name}</div>
                </div>
                <div className="text-sm text-slate-500 line-clamp-2 mt-2 leading-relaxed">{lvl.desc}</div>
                
                <div className={`absolute right-3 top-3 hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-0.5 rounded-lg shadow-sm backdrop-blur-sm`}>
                  <button onClick={(e) => { e.stopPropagation(); handleOpenLevelModal(lvl); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteLevel(lvl.id); }} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Services for Level */}
        <div className="w-[30%] bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <h3 className="font-bold text-slate-900 flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm mr-2">2</span>
              包含服务项
            </h3>
            {selectedLevel && (
              <button onClick={() => setIsLinkModalOpen(true)} className="text-xs text-blue-700 font-medium hover:bg-blue-100 transition-colors flex items-center bg-blue-50 px-2.5 py-1.5 rounded-md border border-blue-100">
                <Link className="w-3.5 h-3.5 mr-1" /> 管理关联项
              </button>
            )}
          </div>
          <div className="overflow-y-auto p-3 space-y-2 flex-1 relative">
            {!selectedLevel ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center text-sm">
                <Shield className="w-8 h-8 mb-3 text-slate-200" />
                请在左侧选择一个护理等级
              </div>
            ) : levelServices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center text-sm">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <ListChecks className="w-6 h-6 text-slate-300" />
                </div>
                该等级暂未关联任何服务项目
                <button onClick={() => setIsLinkModalOpen(true)} className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">
                   立即关联服务
                </button>
              </div>
            ) : (
              levelServices.map(svc => (
                <div 
                  key={svc.id} 
                  onClick={() => setSelectedServiceId(svc.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    activeService?.id === svc.id 
                      ? 'bg-blue-50/50 border-blue-400 shadow-sm' 
                      : 'bg-white border-transparent shadow-sm hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`font-bold text-sm ${activeService?.id === svc.id ? 'text-blue-900' : 'text-slate-800'}`}>{svc.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">{svc.category}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> {svc.frequency}</span>
                    <span className="flex items-center gap-1 text-slate-400">{svc.duration}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Col 3: SOP Details */}
        <div className="w-[42%] bg-white border border-slate-200 rounded-2xl flex flex-col shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
            <h3 className="font-bold text-slate-900 flex items-center">
               <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm mr-2">3</span>
               执行 SOP 详情
            </h3>
            {activeService && (
              <div className="flex gap-2">
                <button onClick={() => handleOpenServiceModal(activeService)} className="text-xs text-slate-600 font-medium hover:text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center px-2.5 py-1.5 bg-white border border-slate-200 rounded-md">
                  <Edit2 className="w-3 h-3 mr-1" /> 编辑任务库 SOP
                </button>
              </div>
            )}
          </div>
          <div className="overflow-y-auto flex-1 bg-slate-50/30 p-6">
            {activeService ? (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-4 mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{activeService.name}</h2>
                    <p className="text-xs text-slate-400 mt-1">此为全局服务标准。修改此项将影响所有包含该服务的等级。</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                      <span className="bg-slate-50 px-2 py-1 rounded">耗时: <strong className="text-slate-800">{activeService.duration}</strong></span>
                      <span className="bg-slate-50 px-2 py-1 rounded">默认频次: <strong className="text-slate-800">{activeService.frequency}</strong></span>
                    </div>
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 mb-5 flex items-center px-2">
                  <ArrowRightCircle className="w-4 h-4 mr-2 text-emerald-500" /> 行动指令检查单 (SOP)
                </h4>
                
                {activeService.sopSteps.length > 0 ? (
                  <div className="space-y-4 px-2 relative before:absolute before:inset-0 before:ml-[1.625rem] before:w-0.5 before:bg-slate-200">
                    {activeService.sopSteps.map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-4">
                        <div className="w-9 h-9 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 shadow-sm flex items-center justify-center font-bold flex-shrink-0 z-10 text-sm">
                          {idx + 1}
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-xl flex-1 shadow-sm leading-relaxed text-sm text-slate-700 hover:border-emerald-200 transition-colors">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="m-2 p-8 text-center text-slate-500 border border-dashed border-slate-300 rounded-xl bg-white">
                    暂无标准操作步骤，请点击上方编辑按钮添加。
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                <FileText className="w-12 h-12 mb-4 text-slate-200" />
                <p>{selectedLevel ? "请在第二栏选择具体服务项查看 SOP" : "请先选择护理等级"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- LEVEL MODAL (Unchanged) --- */}
      {isLevelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{editingLevel ? '编辑护理等级' : '新增护理等级'}</h3>
              <button onClick={() => setIsLevelModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">护理等级名称 *</label>
                <input type="text" value={levelForm.name} onChange={e => setLevelForm({...levelForm, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="如: 一级护理 (专护)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">说明与适用人群</label>
                <textarea rows={3} value={levelForm.desc} onChange={e => setLevelForm({...levelForm, desc: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="简要描述..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">指导价 (元/月)</label>
                  <input type="number" value={levelForm.price} onChange={e => setLevelForm({...levelForm, price: Number(e.target.value)})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">主题色彩配置</label>
                  <select value={levelForm.color} onChange={e => setLevelForm({...levelForm, color: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => setIsLevelModalOpen(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">取消</button>
              <button onClick={handleSaveLevel} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">保存护理等级</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- LINK SERVICES TO LEVEL MODAL --- */}
      {isLinkModalOpen && selectedLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0 bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">配置 {selectedLevel.name} 的服务项</h3>
                <p className="text-xs text-slate-500 mt-1">勾选以关联系统服务库中的项目，或创建全新服务项目。</p>
              </div>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {Object.keys(groupedServices).length === 0 && (
                <div className="text-center text-slate-400 py-8">系统库中暂无服务项目</div>
              )}
              {Object.entries(groupedServices).map(([category, svcs]) => (
                <div key={category}>
                  <h4 className="font-bold text-slate-800 mb-3 border-l-4 border-blue-500 pl-2">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {svcs.map(svc => {
                      const isLinked = svc.includedIn.includes(selectedLevel.id);
                      return (
                        <div key={svc.id} className={`flex items-start p-3 border rounded-xl hover:bg-slate-50 transition-colors ${isLinked ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200'}`}>
                          <input 
                            type="checkbox" 
                            id={`link-${svc.id}`}
                            className="w-4 h-4 text-blue-600 mt-1 cursor-pointer"
                            checked={isLinked}
                            onChange={(e) => {
                               setServiceItems(serviceItems.map(s => {
                                  if (s.id === svc.id) {
                                     const included = e.target.checked 
                                        ? [...s.includedIn, selectedLevel.id]
                                        : s.includedIn.filter(id => id !== selectedLevel.id);
                                     return { ...s, includedIn: included };
                                  }
                                  return s;
                               }));
                            }}
                          />
                          <label htmlFor={`link-${svc.id}`} className="ml-3 cursor-pointer flex-1 user-select-none">
                            <div className="font-medium text-slate-900 text-sm">{svc.name}</div>
                            <div className="text-xs text-slate-500 mt-1 flex gap-3">
                              <span>频次: {svc.frequency}</span>
                              <button onClick={(e) => { e.preventDefault(); handleOpenServiceModal(svc); }} className="text-blue-600 hover:underline">编辑SOP详情</button>
                            </div>
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              <button 
                onClick={() => {
                  handleOpenServiceModal();
                }} 
                className="text-blue-600 font-medium text-sm flex items-center hover:text-blue-800 transition-colors"
                title="创建一个全局新的护理动作"
              >
                <Plus className="w-4 h-4 mr-1" /> 创建全局新服务
              </button>
              <button onClick={() => setIsLinkModalOpen(false)} className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">完成配置</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- SERVICE SOP MODAL --- */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 flex-shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{editingService ? '编辑任务库 SOP' : '新增任务库服务项目'}</h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">服务名称 *</label>
                  <input type="text" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="如: 协助进食" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">服务分类</label>
                  <input type="text" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="如: 生活照料" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">执行频次</label>
                  <input type="text" value={serviceForm.frequency} onChange={e => setServiceForm({...serviceForm, frequency: e.target.value})} className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="如: 3次/天" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">标准耗时</label>
                  <input type="text" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} className="w-full p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="如: 30分钟" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-700">服务标准与执行规程 (SOP)</label>
                  <button onClick={() => setServiceForm(prev => ({...prev, sopSteps: [...prev.sopSteps, '']}))} className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center">
                    <Plus className="w-3 h-3 mr-1" /> 添加操作步骤
                  </button>
                </div>
                <div className="space-y-3">
                  {serviceForm.sopSteps.map((step, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-bold flex-shrink-0 mt-0.5">{idx + 1}</div>
                      <textarea rows={2} value={step} onChange={(e) => {
                          const newSteps = [...serviceForm.sopSteps];
                          newSteps[idx] = e.target.value;
                          setServiceForm({...serviceForm, sopSteps: newSteps});
                        }} className="flex-1 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="请输入操作步骤细节..." />
                      <button onClick={() => {
                          const newSteps = serviceForm.sopSteps.filter((_, i) => i !== idx);
                          setServiceForm({...serviceForm, sopSteps: newSteps});
                        }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0">
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {serviceForm.sopSteps.length === 0 && <div className="text-sm text-slate-500 italic p-4 text-center border border-dashed rounded-lg">暂无步骤，点击上方添加</div>}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 flex-shrink-0">
              {editingService ? (
                 <button onClick={() => handleDeleteService(editingService.id)} className="text-red-600 text-sm flex items-center font-medium hover:text-red-700"><Trash2 className="w-4 h-4 mr-1"/> 从库中删除</button>
              ) : <div></div>}
              <div className="flex gap-3">
                 <button onClick={() => setIsServiceModalOpen(false)} className="px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">取消</button>
                 <button onClick={handleSaveService} className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 font-medium">保存 SOP</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export { CareSOPManage };
