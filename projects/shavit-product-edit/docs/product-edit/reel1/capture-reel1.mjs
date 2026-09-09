import { chromium } from 'playwright'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync, rmSync, existsSync } from 'node:fs'; import { execSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const dir = path.join(here,'reel1-frames'); const A=parseInt(process.argv[2]||'0'), B=parseInt(process.argv[3]||'1050'); if (A===0 && B===1050 && existsSync(dir)) rmSync(dir,{recursive:true}); mkdirSync(dir,{recursive:true});
const b = await chromium.launch({ headless:true, executablePath: EXE }); const p = await b.newPage({ viewport:{width:1080,height:1920}, deviceScaleFactor:1 });
const N=35*30;
for (let i=A;i<Math.min(B,N);i++){ await p.goto('file://'+path.join(here,'reel1.html')+'?t='+(i/30).toFixed(3), {waitUntil:'load'}); await p.evaluate(()=>Promise.all([...document.images].filter(im=>!im.complete).map(im=>new Promise(r=>{im.onload=im.onerror=r;})))); await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.jpg'),type:'jpeg',quality:92}); if(i%150===0) console.log('f',i); }
await b.close();
execSync(`ffmpeg -y -loglevel error -framerate 30 -i "${dir}/%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart "${path.join(here,'reel1-base.mp4')}"`);
console.log('done reel1');
