// Render the Mead-teaser inserts to silent 1080x1920 mp4s.
//   node render-inserts.mjs <scene> <frames> [onlyFrame]
// Mirrors reel1/capture-reel1.mjs, but points at the headless shell — the full
// "Google Chrome for Testing" build is no longer in the ms-playwright cache.
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, rmSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';

const scene = process.argv[2] || 'minis';
const N = parseInt(process.argv[3] || '153');
const only = process.argv[4] !== undefined ? parseInt(process.argv[4]) : null;

const dir = path.join(here, `frames-${scene}`);
if (only === null && existsSync(dir)) rmSync(dir, { recursive: true });
mkdirSync(dir, { recursive: true });

const b = await chromium.launch({ headless: true, executablePath: EXE });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });

const frames = only === null ? [...Array(N).keys()] : [only];
for (const i of frames) {
  await p.goto(`file://${path.join(here, 'inserts.html')}?scene=${scene}&f=${i}`, { waitUntil: 'load' });
  await p.evaluate(() => Promise.all(
    [...document.images].filter(im => !im.complete)
      .map(im => new Promise(r => { im.onload = im.onerror = r; }))));
  await p.screenshot({ path: path.join(dir, String(i).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 94 });
  if (i % 40 === 0) console.log('f', i);
}
await b.close();

if (only === null) {
  const out = path.join(here, `${scene}.mp4`);
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i "${dir}/%04d.jpg" -an -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart "${out}"`);
  console.log('wrote', out);
}
