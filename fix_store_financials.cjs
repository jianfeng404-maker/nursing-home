const fs = require('fs');

let code = fs.readFileSync('src/store/index.ts', 'utf-8');

// For addBill
code = code.replace(/if \(res\.ok\) \{\s*set\(state => \(\{ bills: \[bill, \.\.\.state\.bills\] \}\)\);\s*\}/, `if (res.ok) {\n        const created = await res.json();\n        set(state => ({ bills: [created, ...state.bills] }));\n      } else {\n        throw new Error('API Sync Failed');\n      }`);

// Same for addAdmission
code = code.replace(/if \(res\.ok\) \{\s*set\(state => \(\{ admissions: \[record, \.\.\.state\.admissions\] \}\)\);\s*\}/, `if (res.ok) {\n        const created = await res.json();\n        set(state => ({ admissions: [created, ...state.admissions] }));\n      } else {\n        throw new Error('API Sync Failed');\n      }`);

// Same for addTransaction
code = code.replace(/if \(res\.ok\) \{\s*set\(state => \(\{ transactions: \[tx, \.\.\.state\.transactions\] \}\)\);\s*\}/, `if (res.ok) {\n        const created = await res.json();\n        set(state => ({ transactions: [created, ...state.transactions] }));\n      } else {\n        throw new Error('API Sync Failed');\n      }`);

// Same for addInsuranceClaim
code = code.replace(/if \(res\.ok\) \{\s*set\(state => \(\{ insuranceClaims: \[claim, \.\.\.state\.insuranceClaims\] \}\)\);\s*\}/, `if (res.ok) {\n        const created = await res.json();\n        set(state => ({ insuranceClaims: [created, ...state.insuranceClaims] }));\n      } else {\n        throw new Error('API Sync Failed');\n      }`);

// Same for addDischarge
code = code.replace(/if \(res\.ok\) \{\s*set\(state => \(\{ discharges: \[record, \.\.\.state\.discharges\] \}\)\);\s*\}/, `if (res.ok) {\n        const created = await res.json();\n        set(state => ({ discharges: [created, ...state.discharges] }));\n      } else {\n        throw new Error('API Sync Failed');\n      }`);

// Add toast to these try-catch if they don't have it
const catchRegex = /\} catch\(e\) \{ console\.error\(e\) \}/g;
code = code.replace(catchRegex, `} catch(e) { toast.error('操作失败: ' + e.message); console.error(e); }`);

fs.writeFileSync('src/store/index.ts', code);
