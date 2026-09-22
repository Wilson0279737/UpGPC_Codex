import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const port = Number(process.env.PORT || 4173);
const redirects = (await readFile(path.join(root, '_redirects'), 'utf8')).split(/\r?\n/)
  .map(line => line.trim().split(/\s+/)).filter(parts => parts.length === 3 && parts[2] === '301');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const redirect = redirects.find(([from]) => from === pathname);
    if (redirect) { res.writeHead(301, { Location: redirect[1] }).end(); return; }
    let filename = path.resolve(root, '.' + pathname);
    if (filename !== root.replace(/[\\/]$/, '') && !filename.startsWith(root)) { res.writeHead(400).end(); return; }
    let status = 200;
    try {
      if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
      await stat(filename);
    } catch {
      filename = path.join(root, '404.html');
      status = 404;
    }
    const contentType = types[path.extname(filename)] || 'application/octet-stream';
    let body = await readFile(filename);
    // Match the original Vite preview's text compression for meaningful local comparisons.
    const compress = /text\/|javascript|json|xml|svg/.test(contentType) && /\bgzip\b/.test(req.headers['accept-encoding'] || '');
    if (compress) body = gzipSync(body);
    res.writeHead(status, { 'Content-Type': contentType, 'Content-Length': body.length, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache', Vary: 'Accept-Encoding', ...(compress ? { 'Content-Encoding': 'gzip' } : {}) });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(400).end('Bad request');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local production preview: http://127.0.0.1:${port}/`));
