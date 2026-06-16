import fs from 'fs';

const files = [
  'src/pages/FinanceDashboard.tsx',
  'src/pages/PaymentSettle.tsx',
  'src/pages/Billing.tsx',
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/\.total\.replace/g, ".total.toString().replace");
  code = code.replace(/\(b\.total \|\| "0"\)\.replace/g, "String(b.total || \"0\").replace");
  fs.writeFileSync(file, code);
}
