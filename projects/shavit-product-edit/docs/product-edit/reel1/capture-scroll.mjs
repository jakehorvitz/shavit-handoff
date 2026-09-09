// Frame-by-frame scroll captures of the LIVE site → 30fps mp4s (phone 390x844@3x = 1170x2532; desktop 1600x1000@2x).
import { chromium } from 'playwright'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync, rmSync, existsSync } from 'node:fs'; import { execSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const FPS = 30; const smooth = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const clean = async p => { await p.evaluate(() => { const c = document.getElementById('boot-cover'); if (c) c.remove(); document.querySelectorAll('.intro').forEach(e => e.remove()); document.body.style.overflow='auto'; document.documentElement.classList.add('kill-anims'); }); };
const jobs = [
  // name, viewport, dpr, url, [ [t, selectorOrY], ... ]  (scroll keyframes; selectors resolve to offsetTop)
  ['phone-home-to-michigan', {w:390,h:844,dpr:3,mobile:true}, 'https://shavitrootman.com/?kill=intro,anims', [[0,0],[0.8,0],[4.0,'#michigan'],[5.0,'#michigan']]],
  ['phone-michigan-swipe', {w:390,h:844,dpr:3,mobile:true}, 'https://shavitrootman.com/?kill=intro,anims#michigan', [[0,'#michigan'],[3.0,'#michigan']]],
  // 8/16: target #contact explicitly (the reel holds frame 64 = the Contact Us
  // section under the nav; the old '#reach' scroll only landed there by luck,
  // and the 8/16 contact rewrite shortened the section so it would not again).
  ['phone-to-reach', {w:390,h:844,dpr:3,mobile:true}, 'https://shavitrootman.com/?kill=intro,anims#work-with-us', [[0,'#work-with-us'],[0.6,'#work-with-us'],[2.3,'#contact'],[4.0,'#contact']]],
  ['desktop-hero-push', {w:1600,h:1000,dpr:2,mobile:false}, 'https://shavitrootman.com/?kill=intro,anims', [[0,0],[3.0,0]]],
  ['desktop-to-case-studies', {w:1600,h:1000,dpr:2,mobile:false}, 'https://shavitrootman.com/?kill=intro,anims#michigan', [[0,'#michigan'],[0.6,'#michigan'],[3.6,'#case-studies'],[5.0,'#case-studies']]],
];
const b = await chromium.launch({ headless: true, executablePath: EXE });
mkdirSync(path.join(here,'footage'),{recursive:true});
const only = process.argv[2]; // optional: re-capture a single job by name
for (const [name, vp, url, K] of jobs) {
  if (only && name !== only) continue;
  const p = await b.newPage({ viewport:{width:vp.w,height:vp.h}, deviceScaleFactor: vp.dpr, isMobile: vp.mobile, hasTouch: vp.mobile });
  await p.goto(url, { waitUntil:'networkidle', timeout:60000 }); await p.waitForTimeout(800); await clean(p); await p.waitForTimeout(300);
  // pre-scroll through the page once so IntersectionObserver reveals are all "in"
  const max = await p.evaluate(()=>document.documentElement.scrollHeight-window.innerHeight);
  for (let y=0;y<=max;y+=400){ await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(40);} 
  const kf = [];
  for (const [t, y] of K) kf.push([t, typeof y === 'string' ? await p.evaluate(s=>{const el=document.querySelector(s); return el? el.getBoundingClientRect().top + window.scrollY : 0;}, y) : y]);
  const dir = path.join(here,'footage',name); if (existsSync(dir)) rmSync(dir,{recursive:true}); mkdirSync(dir);
  const DUR = kf[kf.length-1][0], N = Math.round(DUR*FPS);
  const yAt = t => { for (let i=0;i<kf.length-1;i++){ const [t0,y0]=kf[i],[t1,y1]=kf[i+1]; if (t>=t0&&t<=t1){ const u=t1===t0?1:(t-t0)/(t1-t0); return y0+(y1-y0)*smooth(u);} } return kf[kf.length-1][1]; };
  for (let i=0;i<N;i++){ const y=Math.round(yAt(i/FPS)); await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(6); await p.screenshot({ path: path.join(dir, String(i).padStart(4,'0')+'.jpg'), type:'jpeg', quality:92 }); }
  await p.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${dir}/%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium "${path.join(here,'footage',name+'.mp4')}"`);
  console.log('done', name, N, 'frames');
}
await b.close();
