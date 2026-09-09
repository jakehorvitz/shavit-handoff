import { chromium } from 'playwright'; import path from 'node:path'; import { fileURLToPath } from 'node:url'; import { mkdirSync, rmSync, existsSync } from 'node:fs'; import { execSync } from 'node:child_process';
const here = path.dirname(fileURLToPath(import.meta.url));
const EXE = '/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const FPS=30, smooth = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2, clamp=x=>x<0?0:x>1?1:x;
const b = await chromium.launch({ headless:true, executablePath: EXE });
const p = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:3, isMobile:true, hasTouch:true });
await p.goto('https://shavitrootman.com/case-studies/1919-kendall/',{waitUntil:'networkidle',timeout:60000}); await p.waitForTimeout(900);
await p.addStyleTag({content:`html,body{scroll-behavior:auto!important} .hero img{animation:none!important;transform:none!important} .rv{opacity:1!important;transform:none!important;transition:none!important}
`});
const max = await p.evaluate(()=>document.documentElement.scrollHeight-window.innerHeight); for (let y=0;y<=max;y+=500){ await p.evaluate(v=>window.scrollTo(0,v), y); await p.waitForTimeout(40);} 
const tops = await p.evaluate(()=>{ const vh=innerHeight; return [...document.querySelectorAll('.ba')].map(el=>{const r=el.getBoundingClientRect(); return {top:r.top+scrollY, h:r.height};}).map(o=>Math.max(0, o.top - (vh - o.h)/2 - 20)); });
console.log('ba centers', tops);
await p.evaluate(()=>document.querySelectorAll('.ba').forEach(el=>el.style.setProperty('--pos','100%')));
// timeline (10s): scroll keyframes and swipe windows [start, dur]
const K=[[0,0],[1.1,120],[2.4,tops[0]],[4.0,tops[0]],[5.0,tops[1]],[6.2,tops[1]],[7.0,tops[2]],[8.0,tops[2]],[8.8,tops[3]],[10.0,tops[3]]];
const SW=[[2.55,0.45,0],[5.05,0.45,1],[7.05,0.45,2],[8.85,0.45,3]];
const yAt=t=>{for(let i=0;i<K.length-1;i++){const[t0,y0]=K[i],[t1,y1]=K[i+1]; if(t>=t0&&t<=t1){const u=t1===t0?1:(t-t0)/(t1-t0); return y0+(y1-y0)*smooth(u);}} return K[K.length-1][1];};
const dir=path.join(here,'footage','phone-casestudy-swipes'); if(existsSync(dir)) rmSync(dir,{recursive:true}); mkdirSync(dir);
const N=300;
for(let i=0;i<N;i++){ const t=i/FPS; const y=Math.round(yAt(t)); const pos=SW.map(([s,d,k])=>[k, 100*(1-smooth(clamp((t-s)/d)))]);
  await p.evaluate(({y,pos})=>{ window.scrollTo(0,y); const bas=document.querySelectorAll('.ba'); pos.forEach(([k,v])=>{ if(bas[k]) bas[k].style.setProperty('--pos', v.toFixed(2)+'%'); }); },{y,pos});
  await p.waitForTimeout(6); await p.screenshot({path:path.join(dir,String(i).padStart(4,'0')+'.jpg'),type:'jpeg',quality:92}); }
await b.close();
execSync(`ffmpeg -y -loglevel error -framerate 30 -i "${dir}/%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 17 "${path.join(here,'footage','phone-casestudy-swipes.mp4')}"`);
console.log('done casestudy');
