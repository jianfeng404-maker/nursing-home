const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf-8');

if (!code.includes('insuranceClaims: any[];')) {
  code = code.replace(/bills: BillRecordType\[\];\n/, 'bills: BillRecordType[];\n  insuranceClaims: any[];\n');
}

fs.writeFileSync('src/store/index.ts', code);
