const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf-8');

const badCode = `  bindIoTDevice: async (device) => {
    try {
      const headers = { 'Authorization': \`Bearer \${localStorage.getItem('token')}\`, 'Content-Type': 'application/json' };
      await fetch('/api/iot_devices', { method: 'POST', headers, body: JSON.stringify(device) });
      
    try {
      const res = await fetch(\`/api/inventory/\${id}\`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ iotDevices: [device, ...state.iotDevices] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },`;

const fixedCode = `  bindIoTDevice: async (device) => {
    try {
      const headers = { 'Authorization': \`Bearer \${localStorage.getItem('token')}\`, 'Content-Type': 'application/json' };
      const res = await fetch('/api/iot_devices', { method: 'POST', headers, body: JSON.stringify(device) });
      if (!res.ok) throw new Error('API Sync Failed');
      set((state) => ({ iotDevices: [device, ...state.iotDevices] }));
    } catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }
  },`;

code = code.replace(badCode, fixedCode);
fs.writeFileSync('src/store/index.ts', code);
