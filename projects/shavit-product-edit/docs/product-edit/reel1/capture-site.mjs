// Capture the LIVE shavitrootman.com at desktop + phone, section by section, intro skipped (?kill=intro).
import { chromium } from 'playwright';
import path from 'node:path'; import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const out = path.join(here, 'site-captures');
const browser = await chromium.launch({ headless: true, executablePath: EXE });
const shots = [
  ['home-hero', 'https://shavitrootman.com/?kill=intro', null],
  ['michigan', 'https://shavitrootman.com/?kill=intro#michigan', '#michigan'],
  ['case-studies', 'https://shavitrootman.com/?kill=intro#case-studies', '#case-studies'],
  ['work-with-us', 'https://shavitrootman.com/?kill=intro#work-with-us', '#work-with-us'],
  ['reach', 'https://shavitrootman.com/?kill=intro#reach', '#reach'],
  ['kendall-top', 'https://shavitrootman.com/case-studies/1919-kendall/', null],
  ['kendall-ba', 'https://shavitrootman.com/case-studies/1919-kendall/', '.ba'],
];
for (const [vp, w, h, dpr] of [['desktop', 1600, 1000, 1], ['phone', 390, 844, 3]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: vp==='phone', hasTouch: vp==='phone' });
  for (const [name, url, sel] of shots) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(900);
      await page.evaluate(() => { const c = document.getElementById('boot-cover'); if (c) c.remove(); document.querySelectorAll('.intro').forEach(e => e.remove()); document.body.style.overflow='auto'; });
      await page.waitForTimeout(300);
      if (sel) { await page.evaluate(s => { const el = document.querySelector(s); if (el) el.scrollIntoView({ block: 'start' }); }, sel); await page.waitForTimeout(700); }
      // reveal everything in view (IO reveals) by nudging scroll
      await page.evaluate(() => window.scrollBy(0, 1)); await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(out, `${vp}-${name}.png`), type: 'png' });
      console.log('ok', vp, name);
    } catch (e) { console.log('FAIL', vp, name, e.message.split('\n')[0]); }
  }
  // full-page phone scroll for the tour footage
  if (vp === 'phone') { await page.goto('https://shavitrootman.com/?kill=intro', { waitUntil: 'networkidle' }); await page.waitForTimeout(800); await page.evaluate(() => { const c = document.getElementById('boot-cover'); if (c) c.remove(); document.querySelectorAll('.intro').forEach(e => e.remove()); document.body.style.overflow='auto'; }); for (let y=0;y<9000;y+=600){ await page.evaluate(v=>window.scrollTo(0,v), y); await page.waitForTimeout(120);} await page.evaluate(()=>window.scrollTo(0,0)); await page.waitForTimeout(400); await page.screenshot({ path: path.join(out, 'phone-full.png'), fullPage: true }); }
  await page.close();
}
await browser.close();
