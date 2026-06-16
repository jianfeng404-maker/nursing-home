const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');

const cleaner = `
function cleanNumericFields(body: any) {
  if (!body || typeof body !== 'object') return body;
  const fields = ['total', 'amount', 'price', 'refundAmount'];
  const res = { ...body };
  for (const f of fields) {
    if (typeof res[f] === 'string') {
      res[f] = res[f].replace(/,/g, '');
    }
  }
  return res;
}
`;

if (!code.includes('cleanNumericFields')) {
  code = code.replace(/const PORT = 3000;/, "const PORT = 3000;\n" + cleaner);
  
  code = code.replace(/\.values\(req\.body\)/g, ".values(cleanNumericFields(req.body))");
  code = code.replace(/\.set\(req\.body\)/g, ".set(cleanNumericFields(req.body))");
  code = code.replace(/dataToInsert = {\s*\.\.\.req\.body/g, "dataToInsert = { ...cleanNumericFields(req.body)");

  code = code.replace(/id: req.body.id \|\| \`ADM-\${crypto.randomUUID\(\)}\`,\n\s*\.\.\.req\.body/, "id: req.body.id || `ADM-${crypto.randomUUID()}`,\n         ...cleanNumericFields(req.body)");
  code = code.replace(/id: req.body.id \|\| \`DIS-\${crypto.randomUUID\(\)}\`,\n\s*\.\.\.req\.body/, "id: req.body.id || `DIS-${crypto.randomUUID()}`,\n         ...cleanNumericFields(req.body)");
  code = code.replace(/id: req.body.id \|\| \`B-\${crypto.randomUUID\(\)}\`,\n\s*\.\.\.req\.body/, "id: req.body.id || `B-${crypto.randomUUID()}`,\n         ...cleanNumericFields(req.body)");
  code = code.replace(/id: req.body.id \|\| \`INS-\${crypto.randomUUID\(\)}\`,\n\s*\.\.\.req\.body/, "id: req.body.id || `INS-${crypto.randomUUID()}`,\n         ...cleanNumericFields(req.body)");
  
  code = code.replace(/id: req.body.id \|\| \`T-\${crypto.randomUUID\(\)}\`,\n\s*\.\.\.req\.body/, "id: req.body.id || `T-${crypto.randomUUID()}`,\n        ...cleanNumericFields(req.body)");

  fs.writeFileSync('server.ts', code);
}
