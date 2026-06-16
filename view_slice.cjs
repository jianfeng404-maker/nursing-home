const fs = require('fs');
console.log(fs.readFileSync('src/store/index.ts', 'utf-8').split('\n').slice(1440, 1470).join('\n'));
