const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;

let signups = [];
const menu = ['Espresso', 'Latte', 'Cappuccino', 'Mocha', 'Tea', 'Muffin', 'Croissant'];

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.end(data);
  });
}

function handleApi(req, res) {
  if (req.method === 'POST' && req.url === '/api/signup') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        signups.push(data);
        const offer = `Thanks ${data.name}! Here is a 10% off coupon for your next ${data.preference}.`;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: offer}));
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return true;
  }

  if (req.method === 'POST' && req.url === '/api/assistant') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const msg = data.message.toLowerCase();
        let reply = 'Sorry, I did not understand.';
        if (msg.includes('hello') || msg.includes('hi')) {
          reply = 'Hello! How can I help you today?';
        } else if (msg.includes('recommend')) {
          reply = `You should try our special ${menu[Math.floor(Math.random()*menu.length)]}!`;
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({reply}));
      } catch (e) {
        res.writeHead(400);
        res.end('Invalid JSON');
      }
    });
    return true;
  }

  if (req.method === 'GET' && req.url === '/api/recommendations') {
    const items = [];
    for (let i = 0; i < 3; i++) {
      items.push(menu[Math.floor(Math.random()*menu.length)]);
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({items}));
    return true;
  }

  return false;
}

const server = http.createServer((req, res) => {
  if (handleApi(req, res)) return;

  let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
  const ext = path.extname(filePath);
  const map = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript'
  };
  const contentType = map[ext] || 'text/plain';
  sendFile(res, filePath, contentType);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
