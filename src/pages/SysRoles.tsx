import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Plus, Edit, Trash2, Search, Shield, Users } from "lucide-react";

export function SysRoles() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  
  const [users, setUsers] = useState([
    { id: 'U1', username: 'admin', name: '系统管理员', roles: ['超级管理员'], status: '正常', lastLogin: '2026-04-28 10:15:33' },
    { id: 'U2', username: 'zhangmy', name: '张明宇', roles: ['部门主管', '护理员'], status: '正常', lastLogin: '2026-04-28 07:55:12' },
    { id: 'U3', username: 'wangjg', name: '王建国', roles: ['护理员'], status: '正常', lastLogin: '2026-04-27 19:30:45' },
    { id: 'U4', username: 'liuxin', name: '刘欣', roles: ['财务专员'], status: '锁定', lastLogin: '2026-04-15 11:20:00' },
  ]);

  const [roles, setRoles] = useState([
    { id: 'R1', name: '超级管理员', code: 'admin', desc: '拥有系统所有权限', userCount: 1 },
    { id: 'R2', name: '部门主管', code: 'dept_manager', desc: '负责部门内人员和排班管理', userCount: 5 },
    { id: 'R3', name: '护理员', code: 'caregiver', desc: '一线护理人员，处理护理任务', userCount: 42 },
    { id: 'R4', name: '财务专员', code: 'finance', desc: '处理收费、结算及发票', userCount: 3 },
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUsers([...users, {
      id: `U${Date.now()}`,
      username: formData.get('username') as string,
      name: formData.get('name') as string,
      roles: ['普通用户'],
      status: '正常',
      lastLogin: '-'
    }]);
    setShowUserModal(false);
  };

  const handleSaveRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setRoles([...roles, {
      id: `R${Date.now()}`,
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      desc: formData.get('desc') as string,
      userCount: 0
    }]);
    setShowRoleModal(false);
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
            onClick={() => activeTab === 'users' ? setShowUserModal(true) : setShowRoleModal(true)}
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
                        <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition">编辑</button>
                        <button onClick={() => setUsers(users.filter(x => x.id !== u.id))} className="text-rose-500 hover:bg-rose-50 px-2 py-1 rounded transition">删除</button>
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
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition" title="分配权限"><Shield className="w-4 h-4" /></button>
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setRoles(roles.filter(x => x.id !== r.id))} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
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
              <h3 className="font-bold text-slate-800">新增账号</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">&times;</button>
            </div>
            <form onSubmit={handleSaveUser}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">登录账号 *</label>
                  <input name="username" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: zhangmy" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">姓名 *</label>
                  <input name="name" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="真实姓名" />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">保存账号</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">新增角色</h3>
              <button onClick={() => setShowRoleModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">&times;</button>
            </div>
            <form onSubmit={handleSaveRole}>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">角色名称 *</label>
                  <input name="name" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: 护理员" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">角色编码 *</label>
                  <input name="code" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="如: caregiver" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">角色描述</label>
                  <textarea name="desc" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="该角色的主要职能范围说明" rows={3}></textarea>
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">保存角色</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
