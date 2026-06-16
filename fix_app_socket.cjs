const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/socket\.connect\(\);/g, `const token = localStorage.getItem('token');
        if (token) {
          socket.auth = { token };
          socket.connect();
        }`);

fs.writeFileSync('src/App.tsx', code);
