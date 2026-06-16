const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf-8');

const oldAddUser = `
  addSysUser: async (user) => {
    try {
      const headers = { 'Authorization': \`Bearer \${localStorage.getItem('token')}\`, 'Content-Type': 'application/json' };
      await fetch('/api/sys_users', { method: 'POST', headers, body: JSON.stringify(user) });
      set((state) => ({ sysUsers: [...state.sysUsers, user] }));
    } catch(e) { console.error(e) }
  },`;

const newAddUser = `
  addSysUser: async (user) => {
    try {
      const headers = { 'Authorization': \`Bearer \${localStorage.getItem('token')}\`, 'Content-Type': 'application/json' };
      const res = await fetch('/api/sys_users', { method: 'POST', headers, body: JSON.stringify(user) });
      if (res.ok) {
        const created = await res.json();
        set((state) => ({ sysUsers: [...state.sysUsers, created] }));
      }
    } catch(e) { console.error(e) }
  },`;

code = code.replace(oldAddUser.trim(), newAddUser.trim());

fs.writeFileSync('src/store/index.ts', code);
