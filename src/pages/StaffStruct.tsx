import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Search, Plus, Filter, Edit, Trash2, Users, Building2, UserCircle, X, AlertCircle, Phone, Briefcase, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useStore, StaffMember } from "../store";

interface Department {
  id: string;
  name: string;
  head: string;
  count: number;
  phone: string;
}

export function StaffStruct() {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  const staff = useStore(state => state.staff);
  const addStaff = useStore(state => state.addStaff);
  const updateStaff = useStore(state => state.updateStaff);
  const removeStaff = useStore(state => state.removeStaff);

  const [depts, setDepts] = useState<Department[]>([
    { id: 'D-001', name: '护理一部', head: '张明宇', count: 12, phone: '8011' },
    { id: 'D-002', name: '护理二部', head: '李建国', count: 15, phone: '8012' },
    { id: 'D-003', name: '医疗中心', head: '王大卫', count: 8, phone: '8020' },
    { id: 'D-004', name: '后勤部', head: '赵红', count: 6, phone: '8030' },
    { id: 'D-005', name: '人事部', head: '刘敏', count: 3, phone: '8040' },
  ]);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const filteredStaff = staff.filter(s => s.name.includes(searchQuery) || s.dept.includes(searchQuery) || s.id.includes(searchQuery));
  const activeStaffCount = staff.filter(s => s.status === '在职').length;

  const handleSaveDept = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDept: Department = {
      id: editingDept ? editingDept.id : `D-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      name: formData.get('name') as string,
      head: formData.get('head') as string,
      count: editingDept ? editingDept.count : 0,
      phone: formData.get('phone') as string,
    };

    if (editingDept) {
      setDepts(depts.map(d => d.id === editingDept.id ? newDept : d));
      toast.success('部门信息已更新');
    } else {
      setDepts([newDept, ...depts]);
      toast.success('新部门添加成功');
    }
    setShowDeptForm(false);
  };

  const deleteDept = (id: string) => {
    if (confirm("确定要删除该部门吗？")) {
      setDepts(depts.filter(d => d.id !== id));
      toast.success('部门已删除');
    }
  };

  const openDeptEdit = (dept: Department) => {
    setEditingDept(dept);
    setShowDeptForm(true);
  };

  const openDeptNew = () => {
    setEditingDept(null);
    setShowDeptForm(true);
  };

  const handleSaveStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStaff: StaffMember = {
      id: editingStaff ? editingStaff.id : `EMP-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      name: formData.get('name') as string,
      dept: formData.get('dept') as string,
      position: formData.get('position') as string,
      phone: formData.get('phone') as string,
      status: formData.get('status') as string,
      role: formData.get('role') as string,
      avatar: formData.get('avatar') as string || undefined,
    };

    if (editingStaff) {
      updateStaff(editingStaff.id, newStaff);
      toast.success('员工信息已保存');
    } else {
      addStaff(newStaff);
      toast.success('员工入职登记成功');
    }
    setShowStaffModal(false);
  };

  const openEditModal = (emp: StaffMember) => {
    setEditingStaff(emp);
    setShowStaffModal(true);
  };

  const openNewModal = () => {
    setEditingStaff(null);
    setShowStaffModal(true);
  };

  const openDeleteModal = (id: string) => {
    setStaffToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (staffToDelete) {
      removeStaff(staffToDelete);
      setShowDeleteModal(false);
      setStaffToDelete(null);
      toast.success('员工已移除');
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">组织架构与人员库</h2>
          <p className="text-slate-500 text-sm mt-1">管理各部门员工信息、职位及在职状态，维护核心组织框架</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowDeptModal(true)} className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 bg-white rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm active:scale-95">
            <Building2 className="w-4 h-4" /> 架构管理
          </button>
          <button onClick={openNewModal} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm active:scale-95">
            <Plus className="w-4 h-4" /> 办理员工入职
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 shrink-0">
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50 to-indigo-100/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-indigo-800/70 mb-1">系统在职人数</p>
              <h3 className="text-3xl font-black text-indigo-900">{activeStaffCount} <span className="text-base font-bold text-indigo-800/60">人</span></h3>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
               <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white border border-slate-100">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 mb-1">组织部门总数</p>
              <h3 className="text-3xl font-black text-slate-800">{depts.length} <span className="text-base font-bold text-slate-500">部门</span></h3>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
               <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden rounded-2xl">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between bg-white z-10 shrink-0 px-6 py-5">
          <div className="flex gap-2">
             {['list', 'card'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab === 'list' && '列表模式'}
                  {tab === 'card' && '卡片模式'}
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
                  placeholder="搜索员工姓名或工号..."
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 hover:border-slate-300 transition-all bg-slate-50/50 focus:bg-white"
                />
             </div>
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm bg-white">
                <Filter className="w-4 h-4" /> 深度筛选
             </button>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto flex-1 bg-slate-50/30 custom-scrollbar">
          {activeTab === 'list' ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-10">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-bold">工号</th>
                  <th className="px-6 py-4 font-bold">姓名</th>
                  <th className="px-6 py-4 font-bold">所在部门</th>
                  <th className="px-6 py-4 font-bold">职位</th>
                  <th className="px-6 py-4 font-bold">联系电话</th>
                  <th className="px-6 py-4 font-bold">状态/角色</th>
                  <th className="px-6 py-4 font-bold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                 {filteredStaff.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                       <td className="px-6 py-4 font-mono text-slate-400 text-xs">{emp.id}</td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm overflow-hidden border border-indigo-200 shrink-0">
                               {emp.avatar ? <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" /> : emp.name.charAt(0)}
                             </div>
                             <span className="font-bold text-slate-800">{emp.name}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                           <Building2 className="w-3 h-3 text-slate-400" />
                           {emp.dept}
                         </span>
                       </td>
                       <td className="px-6 py-4 font-medium text-slate-700">{emp.position}</td>
                       <td className="px-6 py-4 font-mono text-slate-600">{emp.phone}</td>
                       <td className="px-6 py-4 flex gap-2">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                            emp.status === '在职' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            emp.status === '休假' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {emp.status}
                          </span>
                          {emp.role === '主管' && (
                             <span className="px-2.5 py-1 rounded-md text-xs font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">主管</span>
                          )}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(emp)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="编辑资料"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => openDeleteModal(emp.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="系统除名"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
                 {filteredStaff.length === 0 && (
                   <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">没有任何符合条件的员工</td></tr>
                 )}
              </tbody>
            </table>
          ) : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStaff.map(emp => (
                <Card key={emp.id} className="border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all rounded-2xl group overflow-hidden bg-white">
                  <div className="h-16 bg-gradient-to-r from-indigo-50 to-slate-50 border-b border-slate-100 px-5 pt-4">
                     <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider ${
                         emp.status === '在职' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                         emp.status === '休假' ? 'text-amber-700 bg-amber-50 border-amber-200' : 'text-slate-500 bg-slate-100 border-slate-200'
                       }`}>
                        {emp.status}
                     </span>
                  </div>
                  <CardContent className="px-5 pb-5 -mt-6">
                     <div className="flex flex-col mb-4">
                        <div className="w-16 h-16 bg-white border-4 border-white shadow-sm rounded-full flex items-center justify-center text-indigo-600 bg-indigo-50 font-black text-xl mb-3 overflow-hidden shrink-0">
                           {emp.avatar ? <img src={emp.avatar} alt={emp.name} className="w-full h-full object-cover" /> : emp.name.charAt(0)}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h3 className="font-black text-slate-900 text-lg leading-tight">{emp.name}</h3>
                              {emp.role === '主管' && (
                                 <span className="w-4 h-4 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center" title="部门主管"><UserCheck className="w-3 h-3" /></span>
                              )}
                           </div>
                           <p className="text-[11px] text-slate-400 font-mono tracking-wider mt-0.5">{emp.id}</p>
                        </div>
                     </div>
                     <div className="space-y-3 text-sm mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-slate-600">
                           <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                           <span className="truncate">{emp.dept} · {emp.position}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                           <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                           <span className="font-mono text-sm">{emp.phone}</span>
                        </div>
                     </div>
                     <div className="mt-5 pt-3 border-t border-slate-50 flex justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openEditModal(emp)} className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-bold transition">
                           <Edit className="w-3 h-3" /> 编辑
                         </button>
                         <button onClick={() => openDeleteModal(emp.id)} className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg text-xs font-bold transition">
                           <Trash2 className="w-3 h-3" /> 除名
                         </button>
                     </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staff Form Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                     <UserCheck className="w-5 h-5 text-indigo-600" />
                   </div>
                   <h3 className="font-black text-slate-800 text-xl tracking-tight">
                      {editingStaff ? '更新员工内部档案' : '员工入职登记办理'}
                   </h3>
                </div>
                <button type="button" onClick={() => setShowStaffModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <form onSubmit={handleSaveStaff}>
               <div className="px-6 py-6 space-y-5 bg-slate-50/50">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                       <label className="text-sm font-bold text-slate-700">姓名 <span className="text-rose-500">*</span></label>
                       <input name="name" defaultValue={editingStaff?.name || ""} required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white" placeholder="如：张三" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-bold text-slate-700">联系电话 <span className="text-rose-500">*</span></label>
                       <input name="phone" defaultValue={editingStaff?.phone || ""} required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white" placeholder="138-xxxx-xxxx" />
                    </div>
                  </div>
                  <div className="space-y-1.5 flex flex-col">
                     <label className="text-sm font-bold text-slate-700">照片 (可选)</label>
                     <div className="flex items-center gap-3">
                       <label className="relative w-12 h-12 rounded-full border border-slate-300 overflow-hidden bg-slate-50 flex items-center justify-center cursor-pointer group shadow-sm shrink-0">
                          <input type="file" className="hidden" accept="image/*" onChange={(e)=>{
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const targetInput = document.getElementsByName('avatar')[0] as HTMLInputElement;
                                if(targetInput) { targetInput.value = ev.target?.result as string; }
                                const img = document.getElementById('edit-staff-avatar-preview') as HTMLImageElement;
                                if (img) { img.src = ev.target?.result as string; img.classList.remove('hidden'); document.getElementById('edit-staff-avatar-placeholder')?.classList.add('hidden'); }
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                          <img id="edit-staff-avatar-preview" src={editingStaff?.avatar || undefined} className={`w-full h-full object-cover ${!editingStaff?.avatar ? 'hidden' : ''}`} />
                          <div id="edit-staff-avatar-placeholder" className={`text-slate-400 font-bold ${editingStaff?.avatar ? 'hidden' : ''}`}>
                             {editingStaff?.name?.[0] || <UserCircle className="w-5 h-5"/>}
                          </div>
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Edit className="w-4 h-4 text-white" />
                          </div>
                       </label>
                       <input name="avatar" type="text" defaultValue={editingStaff?.avatar || ""} className="hidden" />
                       <span className="text-xs text-slate-400">点击左侧更改照片</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                       <label className="text-sm font-bold text-slate-700">配置归属部门 <span className="text-rose-500">*</span></label>
                       <select name="dept" defaultValue={editingStaff?.dept || (depts.length > 0 ? depts[0].name : "")} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white">
                          {depts.map(d => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                          ))}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-bold text-slate-700">内部职位/岗级 <span className="text-rose-500">*</span></label>
                       <input name="position" defaultValue={editingStaff?.position || ""} required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white" placeholder="如：驻场护理员" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                       <label className="text-sm font-bold text-slate-700">系统权限角色 <span className="text-rose-500">*</span></label>
                       <select name="role" defaultValue={editingStaff?.role || "员工"} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white">
                          <option value="员工">普通员工 (限制只读/录入)</option>
                          <option value="主管">部门主管 (审批权限)</option>
                          <option value="管理员">系统管理员 (上帝权限)</option>
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-sm font-bold text-slate-700">初始在职状态 <span className="text-rose-500">*</span></label>
                       <select name="status" defaultValue={editingStaff?.status || "在职"} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white">
                          <option value="在职">🟢 正式在职</option>
                          <option value="休假">🟡 挂起/休假/长调</option>
                          <option value="离职">⚪️ 办理离职沉淀</option>
                       </select>
                    </div>
                  </div>
               </div>
               
               <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                  <button type="button" onClick={() => setShowStaffModal(false)} className="px-5 py-2.5 bg-slate-100/80 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition">取消办理</button>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm">提交保存进档案</button>
               </div>
             </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-8 text-center pt-10">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="font-black text-slate-900 text-xl mb-3">确认将其系统除名？</h3>
                <p className="text-slate-500 text-sm leading-relaxed">删除后该员工的系统访问权限将被撤销，且操作不可逆。若为暂离或调岗，建议修改「在职状态」或所属部门。</p>
             </div>
             
             <div className="p-5 border-t border-slate-50 bg-slate-50/50 flex gap-3">
                <button onClick={() => {setShowDeleteModal(false); setStaffToDelete(null);}} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition shadow-sm">暂不除名</button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition shadow-sm">确认移除</button>
             </div>
          </div>
        </div>
      )}

      {/* Department Management Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 h-[85vh] flex flex-col">
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                     <Building2 className="w-5 h-5 text-indigo-600" />
                   </div>
                   <div>
                     <h3 className="font-black text-slate-800 text-xl tracking-tight">
                        全院组织架构管理
                     </h3>
                     <p className="text-xs text-slate-500 font-medium mt-0.5">配置全院部门及部门负责人字典</p>
                   </div>
                </div>
                <button type="button" onClick={() => setShowDeptModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0 flex justify-between items-center">
                <div className="text-sm text-slate-600 font-medium">
                   系统目前共设立了 <b className="text-indigo-600 font-mono text-lg">{depts.length}</b> 个一级/二级部门
                </div>
                <button onClick={openDeptNew} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-200 transition shadow-sm">
                   <Plus className="w-4 h-4" /> 新增部门架构
                </button>
             </div>

             <div className="overflow-y-auto flex-1 p-0 bg-slate-50/30 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                   <thead className="sticky top-0 bg-white border-b border-slate-200 z-10 shadow-sm">
                      <tr className="text-slate-500 text-sm">
                         <th className="px-6 py-4 font-bold w-[120px]">部门编码</th>
                         <th className="px-6 py-4 font-bold">部门名称</th>
                         <th className="px-6 py-4 font-bold">部门编制人数</th>
                         <th className="px-6 py-4 font-bold">部门负责人</th>
                         <th className="px-6 py-4 font-bold">分机号/短号</th>
                         <th className="px-6 py-4 font-bold text-right">管理操作</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                      {depts.map(dept => (
                         <tr key={dept.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-6 py-4 font-mono text-slate-400 text-xs">{dept.id}</td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-slate-800 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                {dept.name}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-1 bg-slate-100/80 text-slate-600 rounded-md text-xs font-mono font-bold">
                                {dept.count} 人
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 font-bold text-slate-700">
                                <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                                {dept.head || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">{dept.phone || '-'}</td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button onClick={() => openDeptEdit(dept)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="编辑部门"><Edit className="w-4 h-4" /></button>
                                 <button onClick={() => deleteDept(dept.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="撤销部门"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            </td>
                         </tr>
                      ))}
                      {depts.length === 0 && (
                         <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400 flex flex-col items-center">
                           <Building2 className="w-12 h-12 mb-3 text-slate-200" />
                           <p>系统组织架构为空，请添加部门</p>
                         </td></tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>
      )}

      {/* Dept Form Modal */}
      {showDeptForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
                <h3 className="font-black text-slate-800 text-xl tracking-tight">
                   {editingDept ? '调整部门设立' : '设立新部门'}
                </h3>
                <button type="button" onClick={() => setShowDeptForm(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
             </div>
             <form onSubmit={handleSaveDept}>
               <div className="p-6 space-y-5 bg-slate-50/50">
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">部门名称 <span className="text-rose-500">*</span></label>
                     <input name="name" defaultValue={editingDept?.name || ""} required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white" placeholder="如：系统研发部" />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">配置部门负责人</label>
                     <select name="head" defaultValue={editingDept?.head || ""} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white">
                        <option value="">-- 系统暂不指定负责人 --</option>
                        {staff.filter(s => s.status === '在职').map(s => (
                          <option key={s.id} value={s.name}>{s.name} ({s.position})</option>
                        ))}
                     </select>
                     <p className="text-xs text-slate-500 mt-1 pl-1">仅可从目前在职员工中拉取关联负责人</p>
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-sm font-bold text-slate-700">分配分机号 / 业务专线</label>
                     <input name="phone" defaultValue={editingDept?.phone || ""} className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-white" placeholder="如：8011" />
                  </div>
               </div>
               <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
                  <button type="button" onClick={() => setShowDeptForm(false)} className="px-5 py-2.5 bg-slate-100/80 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition">放弃更改</button>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm">提交部门数据</button>
               </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

