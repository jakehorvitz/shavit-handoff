#!/usr/bin/env python3
"""Render the final East Victoria carousel as Instagram-ready 4:5 slide images
with burned-in captions in the Shavit brand style. Also writes the caption file."""
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23")
A = os.path.join(ROOT, "assets")
OUT = os.path.join(ROOT, "final")
os.makedirs(OUT, exist_ok=True)
W, H = 1080, 1350
BRASS = (176, 141, 87)
GOLD = (255, 192, 0)

def font(sz, bold=True):
    f = ImageFont.truetype("/System/Library/Fonts/SFNS.ttf", sz)
    try:
        axes = f.get_variation_axes()
        vals = []
        for ax in axes:
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            low = nm.lower()
            if low.startswith("weight"):
                vals.append(820 if bold else 400)
            elif low.startswith("optical"):
                vals.append(max(ax["minimum"], min(ax["maximum"], sz)))
            else:
                vals.append(ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f

DMSANS = os.path.join(ROOT, "fonts", "DMSans.ttf")
BRIC = os.path.join(ROOT, "fonts", "Bricolage.ttf")
def bric(sz, wght=800):
    # matches the 43 Howder reel's Disp(): axis order renders Bricolage thin+wide
    f = ImageFont.truetype(BRIC, sz)
    try: f.set_variation_by_axes([sz, 100, wght])
    except Exception:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f
def dmsans(sz):
    f = ImageFont.truetype(DMSANS, sz)
    try:
        vals = []
        for ax in f.get_variation_axes():
            nm = ax["name"].decode() if isinstance(ax["name"], (bytes, bytearray)) else ax["name"]
            low = nm.lower()
            if low.startswith("weight"):
                vals.append(400)
            elif low.startswith("optical"):
                vals.append(max(ax["minimum"], min(ax["maximum"], sz)))
            else:
                vals.append(ax.get("default", ax["minimum"]))
        f.set_variation_by_axes(vals)
    except Exception:
        pass
    return f

def fill(img):
    im = Image.open(os.path.join(A, img)).convert("RGB")
    iw, ih = im.size
    s = max(W/iw, H/ih)
    im = im.resize((int(iw*s), int(ih*s)))
    x = (im.size[0]-W)//2; y = (im.size[1]-H)//2
    return im.crop((x, y, x+W, y+H))

def wrap(dr, text, fnt, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur+" "+w).strip()
        if dr.textlength(t, font=fnt) <= maxw:
            cur = t
        else:
            lines.append(cur); cur = w
    if cur: lines.append(cur)
    return lines

def scrim(base, frac=0.52):
    ov = Image.new("RGBA", (W, H), (0,0,0,0))
    d = ImageDraw.Draw(ov)
    top = int(H*(1-frac))
    for yy in range(top, H):
        a = int(235 * ((yy-top)/(H-top))**1.15)
        d.line([(0,yy),(W,yy)], fill=(0,0,0,a))
    return Image.alpha_composite(base.convert("RGBA"), ov)

def caption(base, kicker, line1, line2=None, center=False, mark=False, cta=None):
    im = scrim(base)
    dr = ImageDraw.Draw(im)
    pad = 72
    maxw = W - pad*2
    f1 = font(58); f2 = dmsans(41); fk = font(26)
    l1 = wrap(dr, line1.upper(), f1, maxw)
    l2 = wrap(dr, line2, f2, maxw) if line2 else []
    lh1, lh2 = 70, 52
    cta_sz = 64; fcta = None
    if cta:
        cta = cta.upper()
        fcta = bric(cta_sz)
        while dr.textlength(cta, font=fcta) > maxw and cta_sz > 24:
            cta_sz -= 2; fcta = bric(cta_sz)
    cta_h = (30 + cta_sz + 8 + 16) if cta else 0
    block = (30 if kicker else 0) + 22 + len(l1)*lh1 + (14+len(l2)*lh2 if l2 else 0) + cta_h + (46 if mark else 0)
    y = H - pad - block
    def cx(t, fnt): return (W - dr.textlength(t, font=fnt))//2 if center else pad
    if kicker:
        kx = (W - dr.textlength(kicker.upper(), font=fk))//2 if center else pad
        dr.text((kx, y), kicker.upper(), font=fk, fill=GOLD); y += 30
    rx = (W-64)//2 if center else pad
    dr.rectangle([rx, y, rx+64, y+4], fill=BRASS); y += 22
    for ln in l1:
        dr.text((cx(ln,f1), y), ln, font=f1, fill=(255,255,255)); y += lh1
    if l2:
        y += 14
        for ln in l2:
            dr.text((cx(ln,f2), y), ln, font=f2, fill=(232,229,220)); y += lh2
    if cta:
        y += 30
        cxx = (W - dr.textlength(cta, font=fcta))//2 if center else pad
        dr.text((cxx, y), cta, font=fcta, fill=GOLD)
        ubb = dr.textbbox((cxx, y), cta, font=fcta)
        uy = ubb[3] + 8
        dr.rectangle([ubb[0], uy, ubb[2], uy + 4], fill=GOLD)
        y += cta_sz + 8 + 16
    if mark:
        y += 12
        m = "SHAVIT ROOTMAN"
        fm = bric(24)
        mx = (W - dr.textlength(m, font=fm))//2 if center else pad
        dr.text((mx, y), m, font=fm, fill=GOLD)
    return im.convert("RGB")

def numbers(base):
    im = Image.alpha_composite(base.convert("RGBA"), Image.new("RGBA",(W,H),(0,0,0,184)))
    dr = ImageDraw.Draw(im)
    ft = font(46); fl = font(30, bold=False); fv = font(40)
    rows = [("Purchase","$82,000",False),("Renovation","$58,000",False),
            ("All in","$140,000",False),("After-repair value","$215,000",True)]
    title = "THE DEAL"; cx = W//2
    dr.rectangle([cx-32, H//2-190, cx+32, H//2-186], fill=BRASS)
    dr.text((cx-dr.textlength(title,font=ft)//2, H//2-168), title, font=ft, fill=(255,255,255))
    y = H//2 - 90; boxw = 520
    for lbl,val,arv in rows:
        dr.text((cx-boxw//2, y), lbl, font=fl, fill=(207,204,196))
        dr.text((cx+boxw//2-dr.textlength(val,font=fv), y-6), val, font=fv, fill=(GOLD if arv else (255,255,255)))
        y += 58
        dr.line([(cx-boxw//2,y-8),(cx+boxw//2,y-8)], fill=(255,255,255,40))
    return im.convert("RGB")

slides = [
 ("01_cover.jpg", lambda: caption(fill("after-front-furnished.jpg"), None, "East Victoria Street, South Bend, Indiana", "A foreclosure auction that became a complete transformation.", center=True, mark=True)),
 ("02_foreclosure.jpg", lambda: caption(fill("before-foreclosure.jpg"), "the story", "It started as a bank-owned property.", "We acquired the home through a foreclosure auction and saw an opportunity that others overlooked.")),
 ("03_wonit.jpg", lambda: caption(fill("during-interior-work.jpg"), "after closing", "The real work started after closing.", "Every renovation begins with a vision, but success comes from execution.")),
 ("04_basement.jpg", lambda: caption(fill("after-bath.jpg"), "the condition", "The house needed far more than cosmetic updates.", "Years of deferred maintenance required a complete rebuild from the inside out.")),
 ("05_family.jpg", lambda: caption(fill("after-exterior-2.jpg"), "people first", "People came first.", "Before construction began, we worked with the occupants and the local community to help them transition respectfully.")),
 ("06_dominion.jpg", lambda: caption(fill("after-room.jpg"), "execution", "Execution made the difference.", "Indiana Charger Holdings led the project with support from Jonah, his family, Tito, and Tito's team. Dominion Financial also helped us move quickly to preserve the opportunity.")),
 ("07_revived.jpg", lambda: caption(fill("after-kitchen-hero.jpg"), "the rebuild", "A complete renovation.", "New electrical, plumbing, HVAC, insulation, and drywall. New kitchen, bathroom, flooring, and paint. A fully modernized home.")),
 ("08_numbers.jpg", lambda: numbers(fill("after-front-furnished.jpg"))),
 ("09_now.jpg", lambda: caption(fill("after-living-fireplace.jpg"), "now", "Today, another local family calls it home.", "That is the goal behind every project we take on.")),
 ("10_close.jpg", lambda: caption(fill("after-front-furnished.jpg"), None, "Revitalizing neighborhoods.", "Creating housing that people are proud to live in.", center=True, mark=True, cta="Live with us. Work with us.")),
]
for name, fn in slides:
    fn().save(os.path.join(OUT, name), quality=90)
    print("rendered", name)

cap = """East Victoria Street, South Bend, Indiana. A foreclosure auction that became a complete transformation.

The home started as a bank-owned property. We acquired it through a foreclosure auction, after it had reverted to the bank, and saw an opportunity that others had overlooked. The real work began after closing. Years of deferred maintenance meant the house needed far more than cosmetic updates. It needed a complete rebuild from the inside out.

People came first. Before construction began, we worked with the occupants and the local community to help them transition respectfully.

This project was executed through Indiana Charger Holdings LLC in South Bend, and it succeeded because of local expertise, execution, and relationships. Indiana Charger Holdings led the work with incredible support from Jonah, his family, Tito, and Tito's entire team. Dominion Financial also helped us move quickly so we could preserve the opportunity.

The house received new electrical, plumbing, HVAC, insulation, and drywall, along with a new kitchen, bathroom, flooring, and paint, plus extensive structural and cosmetic improvements. It is now a fully modernized home.

Today, another local family calls it home. That is the goal behind every project we take on: revitalizing neighborhoods and creating housing that people are proud to live in.

Live with us. Work with us.

.
.
#realestateinvesting #rehab #renovation #indianarealestate #midwestrealestate #propertymanagement #beforeandafter"""
open(os.path.join(OUT, "CAPTION.txt"), "w").write(cap)
print("wrote CAPTION.txt")
