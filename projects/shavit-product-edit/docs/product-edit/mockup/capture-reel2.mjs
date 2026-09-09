import { chromium } from 'playwright'; import { mkdirSync, existsSync, rmSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import path from 'node:path'; import { execSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const FPS=30, W=1080, H=1920, smooth = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;
const variant = process.argv[2] || 'nonum'; const url = 'file://' + path.join(here,'the-turn.html') + (variant==='nonum' ? '?nonum=1' : '?num=1');
const dir = path.join(here, 'reel2-frames-'+variant); if (existsSync(dir)) rmSync(dir,{recursive:true}); mkdirSync(dir);
const b = await chromium.launch({ headless:true, executablePath: EXE }); const p = await b.newPage({ viewport:{width:W,height:H}, deviceScaleFactor:1 });
await p.goto(url,{waitUntil:'networkidle'}); await p.evaluate(()=>document.fonts.ready);
const L = await p.evaluate(()=>({c1:document.getElementById('c1').offsetTop,c1h:document.getElementById('c1').offsetHeight,c2:document.getElementById('c2').offsetTop,c2h:document.getElementById('c2').offsetHeight,c3:document.getElementById('c3').offsetTop,c3h:document.getElementById('c3').offsetHeight,close:document.getElementById('close').offsetTop,endcard:document.getElementById('endcard').offsetTop,vh:innerHeight,max:document.documentElement.scrollHeight-innerHeight}));
const e=(t,h)=>t+h-L.vh;
const w=(id,a)=>L[id]+a*(L[id+'h']-L.vh);
const K=[[0,0],[2.2,0],
 [4.0,w('c1',.30)],[4.5,w('c1',.42),'lin'],[5.6,e(L.c1,L.c1h)],[9.0,e(L.c1,L.c1h)],
 [10.6,L.c2],[12.0,w('c2',.30)],[12.5,w('c2',.42),'lin'],[13.4,e(L.c2,L.c2h)],[17.4,e(L.c2,L.c2h)],
 [19.0,L.c3],[20.4,w('c3',.30)],[20.9,w('c3',.42),'lin'],[21.8,e(L.c3,L.c3h)],[25.8,e(L.c3,L.c3h)],
 [27.4,L.close],[30.6,L.close],[31.4,Math.min(L.max,L.endcard)],[35.0,Math.min(L.max,L.endcard)]];
const yAt=t=>{for(let i=0;i<K.length-1;i++){const[t0,y0]=K[i],[t1,y1]=K[i+1]; if(t>=t0&&t<=t1){const u=t1===t0?1:(t-t0)/(t1-t0); const f=K[i+1][2]==='lin'?u:smooth(u); return y0+(y1-y0)*f;}} return K[K.length-1][1];};
const N=35*FPS; for(let i=0;i<N;i++){ const y=Math.round(yAt(i/FPS)); await p.evaluate(v=>{scrollTo(0,v); window.__turnUpdate&&window.__turnUpdate();},y); await p.waitForTimeout(6); await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.jpg'),type:'jpeg',quality:92}); if(i%300===0) console.log('f',i); }
await b.close();
{ const { copyFileSync } = await import('node:fs'); const ec = path.join(here,'..','reel1','footage','endcard'); for (let i=918;i<N;i++){ const k=Math.min(135, i-918+1); copyFileSync(path.join(ec, String(k).padStart(4,'0')+'.jpg'), path.join(dir, String(i).padStart(4,'0')+'.jpg')); } console.log('end card baked from frame 918'); }
execSync(`ffmpeg -y -loglevel error -framerate 30 -i "${dir}/%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart "${path.join(here,'reel2-base-'+variant+'.mp4')}"`);
console.log('done', variant);
