const fs = require('fs');
console.log(fs.readFileSync('src/store/index.ts', 'utf-8').split('\n').slice(1870, 1890).join('\n'));
