import { chromium } from 'playwright'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync, rmSync, existsSync } from 'node:fs'; import { execSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const FPS=30, smooth = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const b = await chromium.launch({ headless: true, executablePath: EXE });
const p = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true });
await p.goto('https://shavitrootman.com/?kill=intro,anims#michigan',{waitUntil:'networkidle',timeout:60000}); await p.waitForTimeout(800);
await p.evaluate(()=>{const c=document.getElementById('boot-cover'); if(c)c.remove(); document.querySelectorAll('.intro').forEach(e=>e.remove()); document.body.style.overflow='auto';});
const max = await p.evaluate(()=>document.documentElement.scrollHeight-window.innerHeight); for (let y=0;y<=max;y+=400){ await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(40);} 
await p.evaluate(()=>{const el=document.querySelector('#michigan'); window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY - 8);}); await p.waitForTimeout(400);
const info = await p.evaluate(()=>{const t=document.querySelector('#michigan .carousel__track'); t.style.scrollSnapType='none'; t.style.scrollBehavior='auto'; t.style.overflow='visible'; t.scrollLeft=0; t.style.willChange='transform'; return {w:t.clientWidth, sw:t.scrollWidth, card:(t.firstElementChild||{}).offsetWidth||320};});
console.log(info);
const dir=path.join(here,'footage','phone-michigan-swipe'); if(existsSync(dir)) rmSync(dir,{recursive:true}); mkdirSync(dir);
// 4.0s: hold .6, swipe one card (.9s), hold .5, swipe another (.9s), hold 1.1
const step = info.card + 12; const K=[[0,0],[0.6,0],[1.5,step],[2.0,step],[2.9,step*2],[4.0,step*2]];
const xAt = t => { for (let i=0;i<K.length-1;i++){ const [t0,x0]=K[i],[t1,x1]=K[i+1]; if(t>=t0&&t<=t1){const u=t1===t0?1:(t-t0)/(t1-t0); return x0+(x1-x0)*smooth(u);} } return K[K.length-1][1]; };
const N=120; for (let i=0;i<N;i++){ const x=xAt(i/FPS); await p.evaluate(v=>{const t=document.querySelector('#michigan .carousel__track'); t.style.transform='translateX('+(-v).toFixed(2)+'px)';}, x); await p.waitForTimeout(6); await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.jpg'),type:'jpeg',quality:92}); }
await b.close();
execSync(`ffmpeg -y -loglevel error -framerate 30 -i "${dir}/%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 17 "${path.join(here,'footage','phone-michigan-swipe.mp4')}"`);
console.log('done swipe');
