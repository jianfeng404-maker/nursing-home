const fs = require('fs');

let code = fs.readFileSync('src/store/index.ts', 'utf-8');

const badCode = `  updateInventory: async (id, updates) => {
    set((state) => ({
      inventory: state.inventory.map(m => m.id === id ? { ...m, ...updates, lastUpdate: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } : m)
    }));
    
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync bindIoTDevice', e);
    }
  },`;

const fixedCode = `  updateInventory: async (id, updates) => {
    try {
      const res = await fetch(\`/api/inventory/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({
        inventory: state.inventory.map(m => m.id === id ? { ...m, ...updates, lastUpdate: new Date().toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } : m)
      }));
    } catch(e) {
      toast.error('操作失败: ' + e.message);
      console.error('Failed to sync updateInventory', e);
    }
  },`;

code = code.replace(badCode, fixedCode);
fs.writeFileSync('src/store/index.ts', code);
