import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { mkdirSync, watch } from 'node:fs';
import { join, extname, resolve } from 'node:path';

const PORT = 3000;
const ROOT = resolve('public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

const SSE_SCRIPT = '<script>new EventSource("/__sse").addEventListener("reload",()=>location.reload())</script>';

const clients = new Set();

const server = createServer(async (req, res) => {
  if (req.url === '/__sse') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  let pathname = req.url.split('?')[0];
  try { pathname = decodeURIComponent(pathname); } catch {}
  if (pathname.endsWith('/')) pathname += 'index.html';

  const filePath = join(ROOT, pathname);
  if (!filePath.startsWith(ROOT + '/') && filePath !== ROOT) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) {
      res.writeHead(301, { Location: req.url + '/' });
      return res.end();
    }

    let body = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();

    if (ext === '.html') {
      body = Buffer.from(body.toString().replace('</body>', `${SSE_SCRIPT}\n</body>`));
    }

    res.writeHead(200, { 'Content-Type': MIME[ext] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

mkdirSync(ROOT, { recursive: true });

let reloadTimer;
watch(ROOT, { recursive: true }, () => {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    for (const client of clients) client.write('event: reload\ndata:\n\n');
  }, 100);
});

server.listen(PORT, () => console.log(`  http://localhost:${PORT}`));
