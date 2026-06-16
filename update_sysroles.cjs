const fs = require('fs');
let code = fs.readFileSync('src/pages/SysRoles.tsx', 'utf-8');

const roleSelectStr = `
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">系统显示名称 *</label>
                  <input name="name" required defaultValue={editingUser?.name} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" placeholder="真实姓名或昵称" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">关联角色 *</label>
                  <select name="role" required defaultValue={editingUser?.roles?.[0] || 'employee'} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white">
                    <option value="admin">管理员</option>
                    <option value="employee">普通员工</option>
                    {roles.map(r => (
                       r.code !== 'admin' && r.code !== 'employee' && <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                  </select>
                </div>
`;

code = code.replace(/<div className="space-y-1\.5">\s*<label className="text-sm font-medium text-slate-700">系统显示名称 \*[\s\S]*?<\/div>/m, roleSelectStr);

const handleSaveUserUpdate = `
  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const account = formData.get('account') as string;
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    
    setLoading(true);
    try {
      if (editingUser) {
        updateSysUser(editingUser.id, { username: account, name, roles: [role] });
        toast.success('此账号修改成功！');
      } else {
        const uid = \`U\${Date.now()}\`;
        addSysUser({
          id: uid,
          username: account,
          name: name,
          roles: [role],
          status: '正常',
          lastLogin: '-'
        });
        toast.success('此账号已添加成功！默认密码为：123456');
      }
`;

code = code.replace(/const handleSaveUser = async[\s\S]*?toast\.success\('此账号已添加成功！'\);\n      }/m, handleSaveUserUpdate.trim());

fs.writeFileSync('src/pages/SysRoles.tsx', code);
