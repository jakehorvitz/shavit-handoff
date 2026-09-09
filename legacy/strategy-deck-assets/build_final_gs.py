#!/usr/bin/env python3
"""Embed real hero images (base64) into deck_gen.gs -> deck_gen_final.gs."""
import base64, pathlib, re

here = pathlib.Path(__file__).parent
opt = here / "opt"
src = (here / "deck_gen.gs").read_text()

# Sanitize non-ASCII typography -> ASCII (paste pipeline corrupts multibyte UTF-8)
SANITIZE = {
    "’": "\\'", "‘": "\\'", "“": '"', "”": '"',
    "—": "-", "–": "-", "→": "->", "·": "|", "×": "x",
    "…": "...", " ": " ",
}
for k, v in SANITIZE.items():
    src = src.replace(k, v)
non_ascii = sorted(set(c for c in src if ord(c) > 127))
assert not non_ascii, "remaining non-ASCII: %r" % non_ascii

images = {
    "portrait":  "shavitdeck_portrait.jpg",
    "charger":   "shavitdeck_charger_logo.jpg",
    "hillsdale": "shavitdeck_house_hillsdale.jpg",
}

def b64(name):
    return base64.b64encode((opt / name).read_bytes()).decode("ascii")

# Build IMG declaration
img_lines = ["var IMG={"]
for k, fn in images.items():
    img_lines.append("  %s:'%s'," % (k, b64(fn)))
img_lines.append("};")
img_decl = "\n".join(img_lines)

# img() helper: insert blob, fit+center within target box preserving aspect
img_helper = """
function img(sl,bx,by,bw,bh,key){
  var blob=Utilities.newBlob(Utilities.base64Decode(IMG[key]),'image/jpeg',key+'.jpg');
  var im=sl.insertImage(blob);
  var iw=im.getWidth(), ih=im.getHeight();
  var sc=Math.min(bw/iw, bh/ih);
  var w=iw*sc, h=ih*sc;
  im.setWidth(w).setHeight(h);
  im.setLeft(bx+(bw-w)/2).setTop(by+(bh-h)/2);
  return im;
}
"""

# Insert IMG decl after the HEAD/BODY var line
src = src.replace("var HEAD='Lora', BODY='Roboto';",
                  "var HEAD='Lora', BODY='Roboto';\n" + img_decl)

# Replace placeholder ph() calls with real img() calls
repls = [
    (r"ph\(s\[0\],510,60,156,285,'PORTRAIT',PHD,GOLD\);",
     "img(s[0],510,60,156,285,'portrait');"),
    (r"ph\(s\[1\],520,54,146,297,'PORTRAIT',PHL,NAVY\);",
     "img(s[1],520,54,146,297,'portrait');"),
    (r"ph\(s\[5\],520,90,146,225,'CHARGER LOGO',PHL,NAVY\);",
     "img(s[5],520,90,146,225,'charger');"),
    (r"ph\(s\[9\],500,150,166,165,'FLAGSHIP HOUSE',PHL,NAVY\);",
     "img(s[9],500,150,166,165,'hillsdale');"),
    (r"ph\(s\[15\],540,90,126,180,'CHARGER LOGO',PHL,NAVY\);",
     "img(s[15],540,90,126,180,'charger');"),
]
for pat, rep in repls:
    src, n = re.subn(pat, rep, src)
    assert n == 1, "pattern not replaced once (%d): %s" % (n, pat)

# Append img helper at end
src = src.rstrip() + "\n" + img_helper

out = here / "deck_gen_final.gs"
out.write_text(src)
print("wrote", out, len(src), "chars")
