import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Plus, Edit, Trash2, Search, Shield, Users, CheckSquare, Square, ChevronRight, ChevronDown } from "lucide-react";
import { useStore, SysUser, SysRole } from "../store";
import { toast } from 'sonner';
import { menuGroups } from "../config/menus";

export function SysRoles() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  
  const { sysUsers: users, sysRoles: roles, addSysUser, updateSysUser, removeSysUser, addSysRole, removeSysRole, updateSysRole } = useStore();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [expandedPermGroups, setExpandedPermGroups] = useState<string[]>([]);
  
  const [editingUser, setEditingUser] = useState<SysUser | null>(null);
  const [editingRole, setEditingRole] = useState<SysRole | null>(null);
  const [loading, setLoading] = useState(false);

  const openUserModal = (user?: SysUser) => {
    setEditingUser(user || null);
    setShowUserModal(true);
  };

  const openRoleModal = (role?: SysRole) => {
    setEditingRole(role || null);
    setSelectedPermissions(role?.permissions || []);
    setExpandedPermGroups(menuGroups.map(g => g.title)); // expand all by default
    setShowRoleModal(true);
  };


  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const account = formData.get('account') as string;
    const name = formData.get('name') as string;
    const selectedRoles = Array.from((e.currentTarget.elements.namedItem('role') as HTMLSelectElement).selectedOptions).map(opt => opt.value);
    
    setLoading(true);
    try {
      if (editingUser) {
        updateSysUser(editingUser.id, { username: account, name, roles: selectedRoles });
        toast.success('此账号修改成功！');
      } else {
        const uid = `U${Date.now()}`;
        addSysUser({
          id: uid,
          username: account,
          name: name,
          roles: selectedRoles,
          status: '正常',
          lastLogin: '-'
        });
        toast.success('此账号已添加成功！默认密码为：123456');
      }
      setShowUserModal(false);
    } catch (err: any) {
      console.error(err);
      toast.error('操作失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const code = formData.get('code') as string;
    const desc = formData.get('desc') as string;

    if (editingRole) {
      updateSysRole(editingRole.id, { name, code, desc, permissions: selectedPermissions });
      toast.success('角色修改成功！');
    } else {
      addSysRole({
        id: `R${Date.now()}`,
        name,
        code,
        desc,
        userCount: 0,
        permissions: selectedPermissions
      });
      toast.success('角色添加成功！');
    }
    setShowRoleModal(false);
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleGroupPermissions = (groupTitle: string, itemIds: string[]) => {
    const hasAll = itemIds.every(id => selectedPermissions.includes(id));
    if (hasAll) {
      setSelectedPermissions(prev => prev.filter(p => !itemIds.includes(p)));
    } else {
      setSelectedPermissions(prev => Array.from(new Set([...prev, ...itemIds])));
    }
  };

  const togglePermGroupExpand = (title: string) => {
    setExpandedPermGroups(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pb-8 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">用户与角色权限</h2>
          <p className="text-slate-500 text-sm mt-1">管理系统登录账户、分配角色以及设定角色权限集</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6 shrink-0">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4 h-4" /> 账号管理
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'roles' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Shield className="w-4 h-4" /> 角色与权限
        </button>
      </div>

      <Card className="flex-1 border-none shadow-sm shadow-slate-200/50 flex flex-col overflow-hidden">
        <CardHeader className="py-4 border-b border-slate-100 flex flex-row items-center justify-between shrink-0 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={activeTab === 'users' ? "搜索账号或姓名..." : "搜索角色名称或编码..."}
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:border-blue-500 w-72 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            onClick={() => activeTab === 'users' ? openUserModal() : openRoleModal()}
          >
            <Plus className="w-4 h-4" /> {activeTab === 'users' ? '新增账号' : '新增角色'}
          </button>
        </CardHeader>
        <CardContent className="p-0 overflow-auto flex-1">
          {activeTab === 'users' ? (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">登录账号</th>
                  <th className="px-6 py-4 font-medium">姓名</th>
                  <th className="px-6 py-4 font-medium">关联角色</th>
                  <th className="px-6 py-4 font-medium">状态</th>
                  <th className="px-6 py-4 font-medium">最后登录</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-slate-800">{u.username}</td>
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                         {u.roles.map(r => (
                           <span key={r} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">{r}</span>
                         ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 flex items-center justify-center w-min whitespace-nowrap rounded text-xs font-medium ${
                        u.status === '正常' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-500">{u.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openUserModal(u)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition">编辑</button>
                        <button onClick={() => removeSysUser(u.id)} className="text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 z-10 shadow-sm">
                <tr className="text-slate-500 text-sm">
                  <th className="px-6 py-4 font-medium">角色名称</th>
                  <th className="px-6 py-4 font-medium">角色编码</th>
                  <th className="px-6 py-4 font-medium">描述</th>
                  <th className="px-6 py-4 font-medium">关联账号数</th>
                  <th className="px-6 py-4 font-medium text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700 bg-white">
                {roles.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{r.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-500">{r.code}</td>
                    <td className="px-6 py-4 text-slate-500 max-w-sm truncate">{r.desc}</td>
                    <td className="px-6 py-4">
                       <span className="w-6 h-6 inline-flex items-center justify-center bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                          {r.userCount}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button onClick={() => openRoleModal(r)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => removeSysRole(r.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">{editingUser ? '编辑账号' : '新增账号'}</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">&times;</button>
            </div>
             <form onSubmit={handleSaveUser}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">账号 (手机号等) *</label>
                  <input name="account" type="text" required defaultValue={editingUser?.username} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: 13800138000" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">系统显示名称 *</label>
                  <input name="name" required defaultValue={editingUser?.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="真实姓名或昵称" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">关联角色 * (可多选)</label>
                  <select name="role" required multiple defaultValue={editingUser?.roles || ['employee']} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white min-h-[100px]">
                    <option value="admin">管理员</option>
                    <option value="employee">普通员工</option>
                    {roles.map(r => (
                       r.code !== 'admin' && r.code !== 'employee' && <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">按住 Ctrl (或 Cmd) 可多选</p>
                </div>

              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowUserModal(false)} disabled={loading} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">取消</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {loading ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">{editingRole ? '编辑角色' : '新增角色'}</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">&times;</button>
            </div>
            <form onSubmit={handleSaveRole} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto hidden-scrollbar flex">
                <div className="w-1/3 border-r border-slate-100 p-6 space-y-4 bg-white/50">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">角色名称 *</label>
                    <input name="name" required defaultValue={editingRole?.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: 护理员" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">角色编码 *</label>
                    <input name="code" required defaultValue={editingRole?.code} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: caregiver" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700">角色描述</label>
                    <textarea name="desc" defaultValue={editingRole?.desc} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="该角色的主要职能范围说明" rows={3}></textarea>
                  </div>
                </div>
                <div className="w-2/3 p-6 bg-slate-50/30 overflow-y-auto hidden-scrollbar">
                  <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    权限配置
                  </h4>
                  <div className="space-y-3">
                    {menuGroups.map((group, idx) => {
                      const isExpanded = expandedPermGroups.includes(group.title);
                      const itemIds = group.items.map(i => i.id);
                      const hasAll = itemIds.every(id => selectedPermissions.includes(id));
                      const hasSome = itemIds.some(id => selectedPermissions.includes(id)) && !hasAll;

                      return (
                        <div key={idx} className="bg-white border text-sm border-slate-200 rounded-lg overflow-hidden flex flex-col transition-shadow hover:shadow-sm">
                          <div className="flex items-center bg-slate-50 px-4 py-3 select-none border-b border-transparent transition-colors hover:bg-slate-100/50">
                            <button 
                              type="button"
                              className="mr-2 text-slate-400 hover:text-slate-600"
                              onClick={() => togglePermGroupExpand(group.title)}
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </button>
                            
                            <button 
                              type="button"
                              className="flex items-center gap-2 flex-1 text-left cursor-pointer group"
                              onClick={() => toggleGroupPermissions(group.title, itemIds)}
                            >
                              <div className={`p-0.5 rounded-md transition-colors ${hasAll ? 'text-blue-600 bg-blue-50' : hasSome ? 'text-blue-500 bg-blue-50' : 'text-slate-400 group-hover:text-slate-500 group-hover:bg-slate-200'}`}>
                                {hasAll ? <CheckSquare className="w-4 h-4" /> : hasSome ? <div className="w-4 h-4 border-2 border-blue-500 rounded-sm flex items-center justify-center"><div className="w-2 h-2 bg-blue-500 rounded-[1px]" /></div> : <Square className="w-4 h-4" />}
                              </div>
                              <span className="font-medium text-slate-700 flex items-center gap-2 group-hover:text-slate-900 transition-colors">
                                 <group.icon className={`w-4 h-4 ${hasAll || hasSome ? 'text-blue-600' : 'text-slate-400'}`} />
                                 {group.title}
                              </span>
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 p-4 border-t border-slate-100 bg-white">
                              {group.items.map(item => {
                                const isChecked = selectedPermissions.includes(item.id);
                                return (
                                  <button
                                    type="button"
                                    key={item.id}
                                    className="flex items-center gap-2 text-left hover:bg-slate-50 px-2 py-1.5 rounded transition-colors group cursor-pointer"
                                    onClick={() => togglePermission(item.id)}
                                  >
                                    <div className={`transition-colors ${isChecked ? 'text-blue-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                    </div>
                                    <span className={`transition-colors ${isChecked ? 'text-slate-800 font-medium' : 'text-slate-600 group-hover:text-slate-800'}`}>
                                      {item.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
                <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">保存角色及权限</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
