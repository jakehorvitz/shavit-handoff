import numpy as np, glob, json
from PIL import Image
files=sorted(glob.glob('r2frames/*.jpg'))
res=[]
for i,f in enumerate(files):
    im=np.asarray(Image.open(f).convert('RGB')).astype(int)
    # band rows 300..1500 excluding circle zone (960 +-60)
    band=np.concatenate([im[300:900],im[1020:1500]],axis=0)
    r,g,b=band[...,0],band[...,1],band[...,2]
    gold=(r>200)&(g>150)&(g<225)&(b<90)
    col=gold.sum(axis=0)
    xs=np.where(col>400)[0]
    x=int(xs.mean()) if len(xs) else -1
    # global mean luminance & mean of a text-safe region for later
    lum=float(im.mean())
    res.append({'i':i,'t':round(i/30,3),'x':x,'ncols':int(len(xs)),'lum':round(lum,1)})
json.dump(res,open('measure.json','w'))
# print transitions
prev=None
for r in res:
    if prev is not None and (r['x']!=prev['x']):
        pass
    prev=r
# summarize handle x per frame in compact runs
runs=[]
for r in res:
    if runs and runs[-1][2]==r['x']: runs[-1][1]=r['i']
    else: runs.append([r['i'],r['i'],r['x']])
for a,b,x in runs: print(f"{a:4d}-{b:4d} ({a/30:6.2f}-{b/30:6.2f}s) x={x}")
