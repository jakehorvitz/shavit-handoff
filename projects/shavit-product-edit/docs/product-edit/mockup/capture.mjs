// Capture the-turn.html as a 30fps frame sequence (desktop 1920x1080) + key stills + phone stills.
// Usage: NODE_PATH=<playwright node_modules> node capture.mjs
import { chromium } from 'playwright';
import { mkdirSync, existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const FPS = 30, W = 1920, H = 1080;
const url = 'file://' + path.join(here, 'the-turn.html');
const framesDir = path.join(here, 'frames'), stillsDir = path.join(here, 'stills');
if (existsSync(framesDir)) rmSync(framesDir, { recursive: true });
mkdirSync(framesDir); mkdirSync(stillsDir, { recursive: true });

const smooth = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

const browser = await chromium.launch({ headless: true, executablePath: EXE });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const tops = await page.evaluate(() => ({
  c1: document.getElementById('c1').offsetTop, c1h: document.getElementById('c1').offsetHeight,
  c2: document.getElementById('c2').offsetTop, c2h: document.getElementById('c2').offsetHeight,
  c3: document.getElementById('c3').offsetTop, c3h: document.getElementById('c3').offsetHeight,
  close: document.getElementById('close').offsetTop, vh: window.innerHeight,
  max: document.documentElement.scrollHeight - window.innerHeight,
}));
const endOf = (top, h) => top + h - tops.vh;   // scrollY where the chapter's stage releases
// (time s, scrollY) keyframes: hold, glide through chapter 1, hold, chapter 2, hold, chapter 3, close.
const K = [
  [0.0, 0],
  [1.2, 0],
  [7.2, endOf(tops.c1, tops.c1h)],
  [8.2, endOf(tops.c1, tops.c1h)],
  [12.2, endOf(tops.c2, tops.c2h)],
  [13.0, endOf(tops.c2, tops.c2h)],
  [17.0, endOf(tops.c3, tops.c3h)],
  [17.8, endOf(tops.c3, tops.c3h)],
  [19.4, Math.min(tops.max, tops.close)],
  [21.0, Math.min(tops.max, tops.close)],
];
const DUR = K[K.length-1][0], N = Math.round(DUR * FPS);
const yAt = t => {
  for (let i = 0; i < K.length - 1; i++) {
    const [t0, y0] = K[i], [t1, y1] = K[i+1];
    if (t >= t0 && t <= t1) { const u = t1 === t0 ? 1 : (t - t0) / (t1 - t0); return y0 + (y1 - y0) * smooth(u); }
  }
  return K[K.length-1][1];
};
const stillAt = new Map([[0.0,'01-open'],[3.6,'02-wipe-mid'],[5.4,'03-wipe-late-numbers'],[7.2,'04-chapter1-settled'],[10.6,'05-kitchen'],[15.2,'06-living'],[20.0,'07-close']]);
console.log(`capturing ${N} frames @${FPS}fps, ${DUR}s; layout`, tops);
for (let i = 0; i < N; i++) {
  const t = i / FPS, y = Math.round(yAt(t));
  await page.evaluate(y => { window.scrollTo(0, y); window.__turnUpdate && window.__turnUpdate(); }, y);
  await page.waitForTimeout(8);
  const f = path.join(framesDir, String(i).padStart(4, '0') + '.jpg');
  await page.screenshot({ path: f, type: 'jpeg', quality: 92 });
  for (const [ts, name] of stillAt) if (Math.abs(ts - t) < 1/(2*FPS)) await page.screenshot({ path: path.join(stillsDir, name + '.png'), type: 'png' });
  if (i % 60 === 0) console.log('frame', i, 't', t.toFixed(2), 'y', y);
}
// phone stills (390x844) — the fallback: no pin, static compares
const phone = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await phone.goto(url, { waitUntil: 'networkidle' });
await phone.screenshot({ path: path.join(stillsDir, 'phone-01-top.png'), type: 'png' });
await phone.evaluate(() => window.scrollTo(0, document.getElementById('c2').offsetTop - 60));
await phone.waitForTimeout(50);
await phone.screenshot({ path: path.join(stillsDir, 'phone-02-kitchen.png'), type: 'png' });
await phone.screenshot({ path: path.join(stillsDir, 'phone-full.png'), type: 'png', fullPage: true });
await browser.close();
console.log('done');
