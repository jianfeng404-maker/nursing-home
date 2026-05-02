import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      fs.appendFileSync('frontend-error.log', body + '\\n---\\n');
      res.end('ok');
    });
  } else {
    res.end('ok');
  }
});
server.listen(3001, () => console.log('Listening on 3001'));
