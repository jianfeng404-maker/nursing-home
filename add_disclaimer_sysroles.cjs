const fs = require('fs');
let code = fs.readFileSync('src/pages/SysRoles.tsx', 'utf-8');

code = code.replace(/<p className="text-slate-500 text-sm mt-1">管理系统角色及其权限范围<\/p>/, 
  '<p className="text-slate-500 text-sm mt-1">管理系统角色及其权限范围（注：目前动态权限配置仅供界面显示预留，实际拦截依赖内置角色编码 admin/employee）</p>');

fs.writeFileSync('src/pages/SysRoles.tsx', code);
