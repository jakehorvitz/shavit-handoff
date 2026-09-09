/* Local verification server: serves the site with the production CSP
   (minus upgrade-insecure-requests, which breaks plain-http localhost). */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const CSP = "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https://shavitrootman.com https://substackcdn.com https://*.substackcdn.com; media-src 'self'; connect-src 'self' https://*.google-analytics.com; form-action 'self' https://docs.google.com; frame-src https://docs.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'";
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (p === '/') p = '/index.html';
  let file = path.normalize(path.join(ROOT, p));
  // Directory-index resolution so /links and /links/ serve links/index.html
  // (matches Netlify's pretty-URL behavior for the IG bio target).
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, 'index.html');
  }
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, {
    'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
    'Content-Security-Policy': CSP,
    'X-Content-Type-Options': 'nosniff',
  });
  fs.createReadStream(file).pipe(res);
}).listen(8803, () => console.log('serving on http://127.0.0.1:8803'));
