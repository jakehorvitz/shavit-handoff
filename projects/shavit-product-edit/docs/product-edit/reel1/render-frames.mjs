import { chromium } from 'playwright'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync } from 'node:fs';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
mkdirSync(path.join(here,'storyboard'),{recursive:true});
const b = await chromium.launch({ headless: true, executablePath: EXE });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const s of ['1','2','3','4','5','6','tilt']) {
  await p.goto('file://' + path.join(here, 'frame.html') + '?shot=' + s, { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(here, 'storyboard', `reel1-shot-${s}.png`), type: 'png' });
  console.log('shot', s);
}
await b.close();
