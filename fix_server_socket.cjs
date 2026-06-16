const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf-8');

const ioUseStr = `
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      next(new Error('Authentication error'));
    }
  });

  io.on("connection", (socket) => {`;

code = code.replace(/io\.on\("connection", \(socket\) => \{/, ioUseStr);

fs.writeFileSync('server.ts', code);
