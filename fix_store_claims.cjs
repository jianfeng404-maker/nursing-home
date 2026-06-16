const fs = require('fs');
let code = fs.readFileSync('src/store/index.ts', 'utf-8');

if (!code.includes('insuranceClaims: InsuranceClaim[];')) {
  // Add it to StoreState interface
  code = code.replace(/bills: Bill\[\];\n/, 'bills: Bill[];\n  insuranceClaims: any[];\n');
}

fs.writeFileSync('src/store/index.ts', code);
