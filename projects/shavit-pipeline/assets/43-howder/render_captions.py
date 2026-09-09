#!/usr/bin/env python3
"""43 Howder caption plates, rev 6 copy (Shavit's Jul 13 notes), 12 River text system (Bricolage + Manrope)."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H=1080,1920
GOLD=(255,192,0); IVORY=(245,239,225)
A="/Users/jakehorvitz/projects/shavit-pipeline/assets/43-howder"
OUT=f"{A}/plates"
os.makedirs(OUT,exist_ok=True)
BRIC=f"{A}/fonts/Bricolage.ttf"; MAN=f"{A}/fonts/Manrope.ttf"
_dd=ImageDraw.Draw(Image.new("RGB",(10,10)))

def Disp(s,wght=800):
    f=ImageFont.truetype(BRIC,s)
    try: f.set_variation_by_axes([s,100,wght])
    except Exception:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f
def Man(s,wght=600):
    f=ImageFont.truetype(MAN,s)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f
def w_of(t,f,tr=0): return sum(_dd.textlength(c,font=f) for c in t)+tr*(len(t)-1)
def fit(t,target,maxw,wght=800,tr=0):
    s=target
    while s>20 and w_of(t,Disp(s,wght),tr)>maxw: s-=2
    return Disp(s,wght)
def scrim(img,top=0.50,peak=180):
    d=ImageDraw.Draw(img); t=int(H*top)
    for i in range(H-t): a=int(peak*(i/(H-t))**1.4); d.line([(0,t+i),(W,t+i)],fill=(0,0,0,a))
def draw_tracked(d,x,y,t,f,fill,tr=0):
    for c in t: d.text((x,y),c,font=f,fill=fill); x+=d.textlength(c,font=f)+tr
def soft_layer(drawfn):
    sl=Image.new("RGBA",(W,H),(0,0,0,0)); drawfn(ImageDraw.Draw(sl),(0,0,0,205))
    return sl.filter(ImageFilter.GaussianBlur(6))
def centered(img,y,t,f,fill,tr=0):
    tot=w_of(t,f,tr); x0=(W-tot)/2
    img.alpha_composite(soft_layer(lambda d,c: draw_tracked(d,x0,y+3,t,f,c,tr)))
    draw_tracked(ImageDraw.Draw(img),x0,y,t,f,fill,tr)
def hstroke(d,x,y,t,f,fill):
    d.text((x,y),t,font=f,fill=fill,stroke_width=1,stroke_fill=fill)
def wrap(t,f,mw):
    out=[]; cur=""
    for wd in t.split():
        s=(cur+" "+wd).strip()
        if w_of(s,f)<=mw: cur=s
        else: out.append(cur); cur=wd
    if cur: out.append(cur)
    return out

def new(): return Image.new("RGBA",(W,H),(0,0,0,0))
# rev 7: caption type bumped for phone legibility (Jake 7/13). head 84->104, body 33->40, line 44->54, block raised 0.665->0.635
X0=int(W*0.08); YH=int(H*0.635)
HEAD_SZ=104; SUB_SZ=40; SUB_LN=54

def room_head(name,head,with_scrim=True):
    img=new()
    if with_scrim: scrim(img)
    d=ImageDraw.Draw(img); fh=fit(head,HEAD_SZ,int(W*0.84))
    hstroke(d,X0,YH,head,fh,(255,255,255,255))
    y=YH+int(fh.size*1.12)
    d.rectangle([X0,y+2,X0+68,y+6],fill=GOLD+(255,))
    img.save(f"{OUT}/{name}.png"); return y+30
def room_sub(name,sub,ysub):
    img=new(); d=ImageDraw.Draw(img); fs=Man(SUB_SZ,600); y=ysub
    for ln in wrap(sub,fs,int(W*0.86)): hstroke(d,X0,y,ln,fs,(255,255,255,255)); y+=SUB_LN
    img.save(f"{OUT}/{name}.png")

# 2 address plate — rev 8: Howder Street restored (Jake 7/14, overrides Shavit's 7/13 no-address note)
img=new()
f=fit("HOWDER STREET",100,int(W*0.86)); ytop=int(H*0.44)
centered(img,ytop,"HOWDER STREET",f,(255,255,255,255))
rw=70; ry=ytop+int(f.size*0.86)+12
ImageDraw.Draw(img).rectangle([(W-rw)//2,ry,(W+rw)//2,ry+4],fill=GOLD+(255,))
centered(img,ry+24,"HILLSDALE, MICHIGAN",Man(30,700),IVORY+(255,),6)
img.save(f"{OUT}/addr.png")

# 3 living: single plate (head+sub together)
img=new(); scrim(img); d=ImageDraw.Draw(img)
fh=fit("LIVING ROOM",HEAD_SZ,int(W*0.84)); hstroke(d,X0,YH,"LIVING ROOM",fh,(255,255,255,255))
y=YH+int(fh.size*1.12); d.rectangle([X0,y+2,X0+68,y+6],fill=GOLD+(255,)); y+=30
fs=Man(SUB_SZ,600)
for ln in wrap("Open floor concept, recessed lighting, mini splits throughout.",fs,int(W*0.86)):
    hstroke(d,X0,y,ln,fs,(255,255,255,255)); y+=SUB_LN
img.save(f"{OUT}/living.png")

# 4 kitchen: persistent head + two swap subs
ys=room_head("khead","KITCHEN")
room_sub("ksubA","White cabinetry, butcher block counter tops.",ys)
room_sub("ksubB","Stainless steel appliances, large tile backsplash.",ys)

# 5+6 bathroom: persistent head + two swap subs
ys=room_head("bhead","BATHROOM")
room_sub("bsubA","Floating vanity, new black fixtures throughout.",ys)
room_sub("bsubB","Tub to ceiling tile design.",ys)

# before_tag — rev 9 (Jake 7/14): small corner tag over the opening before-photo montage (t=0-2.05s in v22), per Shavit's ask to label the raw shots
# rev 10 (Jake 7/15): moved top-left -> bottom-left; ty keeps the tag's bottom edge ~1556, above IG Reels' ~320px bottom chrome (safe-zones-per-platform)
# rev 11 (Jake 7/15): tighter into the corner — left margin 86->48, bottom edge lands at y~1600, the edge of the Reels bottom-chrome zone
img=new()
tagf=Man(46,800); tag="BEFORE"
tx=int(W*0.045); ty=int(H*0.80)
d=ImageDraw.Draw(img)
img.alpha_composite(soft_layer(lambda dd,c: draw_tracked(dd,tx+2,ty+3,tag,tagf,c,8)))
draw_tracked(ImageDraw.Draw(img),tx,ty,tag,tagf,(255,255,255,255),8)
tw=w_of(tag,tagf,8)
ImageDraw.Draw(img).rectangle([tx,ty+int(tagf.size*1.25),tx+min(tw,54),ty+int(tagf.size*1.25)+4],fill=GOLD+(255,))
img.save(f"{OUT}/before_tag.png")

# 7 close — rev 6: HOWDER STREET removed from the end (Shavit 7/13), CTA pair only
img=new()
centered(img,int(H*0.44),"LIVE WITH US",fit("LIVE WITH US",110,int(W*0.86)),(255,255,255,255))
img.save(f"{OUT}/close1.png")
img=new()
centered(img,int(H*0.53),"WORK WITH US",fit("WORK WITH US",110,int(W*0.86)),GOLD+(255,))
img.save(f"{OUT}/close2.png")

print("plates:",sorted(os.listdir(OUT)))
