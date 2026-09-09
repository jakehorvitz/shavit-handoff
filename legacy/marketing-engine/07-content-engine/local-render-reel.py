import subprocess, sys, math
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
import imageio_ffmpeg

W,H,FPS = 1080,1920,30
BLACK=(0,0,0); INK=(255,255,255); BODY=(190,190,190)
BRASS=(176,141,87)      # body accent (#B08D57)
GOLD=(255,192,0)        # intro/outro gold (#FFC000)
MUTE=(138,138,138)

def font(sz, bold=True):
    for p,i in [("/System/Library/Fonts/Helvetica.ttc",1 if bold else 0),
                ("/System/Library/Fonts/HelveticaNeue.ttc",0)]:
        try: return ImageFont.truetype(p,sz,index=i)
        except Exception: pass
    return ImageFont.load_default()

def measure(d,t,f):
    b=d.textbbox((0,0),t,font=f); return b[2]-b[0], b[3]-b[1]

def grade(im, bright=0.82, contrast=1.12):
    im=ImageEnhance.Brightness(im).enhance(bright)
    im=ImageEnhance.Contrast(im).enhance(contrast)
    return im.convert("RGB")

def prep(path, target_w=1280):
    im=Image.open(path).convert("RGB")
    s=target_w/im.width
    im=im.resize((int(im.width*s),int(im.height*s)), Image.LANCZOS)
    im=im.filter(ImageFilter.UnsharpMask(radius=2,percent=80))
    return grade(im)

LO=prep("/tmp/shavitdeck_house_hillsdale.jpg")
SC=prep("/tmp/shavitdeck_house_secondchance.jpg")

# bottom scrim for text legibility
scrim=Image.new("RGBA",(W,H),(0,0,0,0))
sd=ImageDraw.Draw(scrim)
for y in range(int(H*0.45),H):
    a=int(225*((y-H*0.45)/(H*0.55)))
    sd.line([(0,y),(W,y)],fill=(0,0,0,min(225,a)))

def kb(src,p,z0=1.05,z1=1.18):
    z=z0+(z1-z0)*p
    bw,bh=src.size
    cover=max(W/bw,H/bh)
    nw,nh=int(bw*cover*z),int(bh*cover*z)
    im=src.resize((nw,nh),Image.LANCZOS)
    x=(nw-W)//2; y=(nh-H)//2
    return im.crop((x,y,x+W,y+H))

def env(t,s,e,fin=0.32,fout=0.28):
    if t<s or t>=e: return 0.0
    if t-s<fin: return (t-s)/fin
    if e-t<fout: return (e-t)/fout
    return 1.0

def draw_lines(layer,lines,cy,size,alpha,color=INK,rise=0):
    d=ImageDraw.Draw(layer); f=font(size,True); lh=int(size*1.1)
    y=cy-(len(lines)*lh)//2+rise
    # brass tick above
    d.rectangle([(W-110)//2,y-46,(W+110)//2,y-42],fill=BRASS+(alpha,))
    for ln in lines:
        w,h=measure(d,ln,f)
        d.text(((W-w)//2,y),ln,font=f,fill=color+(alpha,)); y+=lh

def eyebrow(layer,text,alpha):
    d=ImageDraw.Draw(layer); f=font(34,True); w,h=measure(d,text,f)
    d.text(((W-w)//2,H-150),text,font=f,fill=BRASS+(alpha,))

# ---------- OUTRO: recreate the website intro ----------
HOUSE=[[(8,56),(8,30),(48,8),(88,30),(88,56),(8,56)],
       [(40,56),(40,36),(56,36),(56,56)],
       [(8,56),(88,56)]]
def house_scaled(cx,cy,scale):
    out=[]
    for path in HOUSE:
        out.append([(cx+(x-48)*scale, cy+(y-32)*scale) for (x,y) in path])
    return out

def draw_house(layer,frac,alpha,cx,cy,scale=3.2):
    # progressive stroke draw across all paths by overall fraction
    paths=house_scaled(cx,cy,scale)
    seglens=[]; total=0
    for path in paths:
        for i in range(len(path)-1):
            l=math.dist(path[i],path[i+1]); seglens.append((path[i],path[i+1],l)); total+=l
    glow=Image.new("RGBA",layer.size,(0,0,0,0)); gd=ImageDraw.Draw(glow)
    d=ImageDraw.Draw(layer)
    drawn=0; target=frac*total
    for a,b,l in seglens:
        if drawn>=target: break
        if drawn+l<=target: pa,pb=a,b
        else:
            r=(target-drawn)/l; pb=(a[0]+(b[0]-a[0])*r, a[1]+(b[1]-a[1])*r); pa=a
        for dd,wd,col in [(gd,9,GOLD),(d,4,GOLD)]:
            dd.line([pa,pb],fill=col+(alpha,),width=wd)
        drawn+=l
    glow=glow.filter(ImageFilter.GaussianBlur(6))
    layer.alpha_composite(glow)

def letters(layer,text,cx,cy,size,base_t,color,glow=False):
    f=font(size,True); d=ImageDraw.Draw(layer)
    widths=[measure(d,c,f)[0] for c in text]
    total=sum(widths); x=cx-total//2
    for i,c in enumerate(text):
        lt=base_t-i*0.05  # i*50ms stagger; lt is local progress driver
        a=max(0,min(1,lt/0.5)); alpha=int(a*255)
        rise=int((1-a)*size*0.7)
        if alpha>0:
            if glow:
                gl=Image.new("RGBA",layer.size,(0,0,0,0)); gd=ImageDraw.Draw(gl)
                gd.text((x,cy+rise),c,font=f,fill=color+(alpha,))
                layer.alpha_composite(gl.filter(ImageFilter.GaussianBlur(8)))
            d.text((x,cy+rise),c,font=f,fill=color+(alpha,))
        x+=widths[i]

def rule(layer,cy,frac,alpha):
    maxw=300; w=int(maxw*frac)
    d=ImageDraw.Draw(layer)
    d.rectangle([(W-w)//2,cy-1,(W+w)//2,cy+1],fill=GOLD+(alpha,))

def caption(layer,text,cy,frac,alpha):
    f=font(30,False); d=ImageDraw.Draw(layer)
    spaced=" ".join(list(text))
    w,h=measure(d,spaced,f)
    tmp=Image.new("RGBA",(w+10,h+20),(0,0,0,0))
    ImageDraw.Draw(tmp).text((0,0),spaced,font=f,fill=MUTE+(alpha,))
    cw=int(tmp.width*frac)
    layer.alpha_composite(tmp.crop((0,0,max(1,cw),tmp.height)),((W-w)//2,cy))

def render_outro(layer,t):
    # t = seconds into outro (0..3.6)
    draw_house(layer,max(0,min(1,t/0.9)),int(min(1,t/0.5)*255),W//2,640,3.4)
    letters(layer,"SHAVIT",W//2,820,118,t-0.5,INK)
    letters(layer,"ROOTMAN",W//2,960,118,t-0.9,GOLD,glow=True)
    rule(layer,795,max(0,min(1,(t-0.4)/0.9)),int(min(1,max(0,(t-0.4))/0.4)*255))
    rule(layer,1110,max(0,min(1,(t-1.6)/0.9)),int(min(1,max(0,(t-1.6))/0.4)*255))
    caption(layer,"REAL ESTATE, OPERATED.",1150,max(0,min(1,(t-2.0)/1.0)),int(min(1,max(0,(t-2.0))/0.4)*255))

# ---------- timeline ----------
S1e=3.4; S2e=6.7; S3e=9.6; S4e=11.1; OUTRO=11.1; DUR=14.7
TEXT=[  # (start,end,lines,size,color,scene_cy)
 (0.3,1.85,["EVERYONE CHASES","THE BIG CITY."],80,INK,1180),
 (1.95,3.4,["IT BUYS WHERE","THEY DON'T."],88,INK,1180),
 (3.6,5.05,["TWO HOUSES.","TWO MARKETS."],84,INK,1180),
 (5.15,6.7,["ONE STANDARD."],104,INK,1230),
 (6.95,9.6,["BOUGHT DIRECT.","REHABBED IN-HOUSE.","HELD LONG-TERM."],62,INK,960),
 (9.7,11.1,["BUILDING COMMUNITIES,","PROFITABLY."],72,GOLD,960),
]

ff=imageio_ffmpeg.get_ffmpeg_exe()
proc=subprocess.Popen([ff,"-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),
 "-i","-","-an","-c:v","libx264","-pix_fmt","yuv420p","-movflags","+faststart",sys.argv[1]],
 stdin=subprocess.PIPE,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

prev={int(0.9*FPS):"/tmp/r1.png",int(2.6*FPS):"/tmp/r2.png",int(4.3*FPS):"/tmp/r3.png",
      int(8.2*FPS):"/tmp/r4.png",int(10.3*FPS):"/tmp/r5.png",int(13.2*FPS):"/tmp/r6.png"}
N=int(DUR*FPS)
for fr in range(N):
    t=fr/FPS
    if t<S1e: base=kb(LO,t/S1e).convert("RGBA"); photo=True
    elif t<S2e: base=kb(SC,(t-S1e)/(S2e-S1e)).convert("RGBA"); photo=True
    else: base=Image.new("RGBA",(W,H),BLACK+(255,)); photo=False
    if photo: base.alpha_composite(scrim)
    layer=Image.new("RGBA",(W,H),(0,0,0,0))
    if t<OUTRO:
        for (s,e,lines,size,color,cy) in TEXT:
            a=env(t,s,e)
            if a>0:
                rise=int((1-min(1,(t-s)/0.32))*18) if t-s<0.32 else 0
                draw_lines(layer,lines,cy,size,int(a*255),color,rise)
        if 2.3<t<3.4:
            eyebrow(layer,"17 LO PRESTO AVE  ·  HILLSDALE, MI",int(env(t,2.3,3.4)*255))
    else:
        render_outro(layer,t-OUTRO)
    base.alpha_composite(layer)
    rgb=base.convert("RGB")
    if fr in prev: rgb.save(prev[fr])
    proc.stdin.write(rgb.tobytes())
proc.stdin.close(); proc.wait()
print("done",sys.argv[1],"frames",N)
