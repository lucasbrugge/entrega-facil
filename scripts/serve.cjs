const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};
function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const file = path.resolve(
      root,
      '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname),
    );
    const relative = path.relative(root, file);
    if (
      relative.startsWith('..') ||
      relative.split(path.sep).some((part) => part.startsWith('.') || part === 'node_modules')
    ) {
      res.writeHead(403).end();
      return;
    }
    fs.readFile(file, (error, body) => {
      if (error) {
        res.writeHead(404).end('Não encontrado');
        return;
      }
      res
        .writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
        .end(body);
    });
  });
}
module.exports = { createServer };
if (require.main === module)
  createServer().listen(8080, '127.0.0.1', () => console.log('Frontend: http://localhost:8080'));
