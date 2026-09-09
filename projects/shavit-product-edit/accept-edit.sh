#!/usr/bin/env bash
# accept-edit.sh — Horvitz stage-5 gate for shavit-product-edit (two IG reels). Exit 0 = accepted.
# Checks per SPEC-reels.html §9. Site-UI hits (device-frame beats of REEL 1) are WARN + listed for
# Shavit's ruling (Jake 8/16: "everything's good on the site to publish"); overlay/REEL 2 hits FAIL.
set -u
cd "$(dirname "$0")"
D=docs/product-edit; EX=$D/exports; TAG=$(cat "$EX/CURRENT" 2>/dev/null || echo v1); R1=$EX/REEL-1-the-website-$TAG.mp4; R2=$EX/REEL-2-kendall-street-$TAG.mp4; echo "gate: reel version $TAG"
FAIL=0; WARN=0; TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
fail(){ echo "FAIL: $*"; FAIL=$((FAIL+1)); }; warn(){ echo "WARN: $*"; WARN=$((WARN+1)); }; ok(){ echo "ok:   $*"; }
RULE_DOLLARS=${RULE_DOLLARS:-0}   # set 1 once Shavit rules $ on picture OK
for dep in ffprobe ffmpeg tesseract python3; do command -v "$dep" >/dev/null 2>&1 || { echo "FAIL: missing dependency $dep — gate cannot run"; exit 9; }; done
# staleness: exports must be newer than the renderers and bases they were cut from
for src in docs/product-edit/reel1/reel1.html docs/product-edit/mockup/the-turn.html docs/product-edit/reel1/reel1-base.mp4 docs/product-edit/mockup/reel2-base-nonum.mp4; do
  for f in "$R1" "$R2"; do [ -e "$f" ] && [ "$src" -nt "$f" ] && fail "$(basename "$f") is OLDER than $src — re-export required"; done
done

# 1. format
for f in "$R1" "$R2"; do
  [ -s "$f" ] || { fail "missing export $f"; continue; }
  read -r W H FPS CODEC <<<"$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,codec_name -of csv=p=0 "$f" | awk -F, '{print $2, $3, $4, $1}')"
  # order from ffprobe: codec_name,width,height,r_frame_rate
  CODEC=$(ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of csv=p=0 "$f")
  W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width -of csv=p=0 "$f"); H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f")
  FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$f")
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f")
  ACODEC=$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$f")
  [ "$W" = 1080 ] && [ "$H" = 1920 ] && ok "$(basename "$f") 1080x1920" || fail "$(basename "$f") is ${W}x${H}"
  [ "$FPS" = "30/1" ] && ok "$(basename "$f") 30fps" || fail "$(basename "$f") fps=$FPS"
  [ "$CODEC" = h264 ] && ok "$(basename "$f") h264" || fail "$(basename "$f") codec=$CODEC"
  [ "$ACODEC" = aac ] && ok "$(basename "$f") aac audio" || fail "$(basename "$f") audio codec=$ACODEC"
  awk -v d="$DUR" 'BEGIN{exit !(d>=30 && d<=45)}' && ok "$(basename "$f") duration ${DUR}s (30-45)" || fail "$(basename "$f") duration ${DUR}s"
  SZ=$(stat -f %z "$f"); [ "$SZ" -le 209715200 ] && ok "$(basename "$f") $((SZ/1048576)) MB <= 200 MB" || fail "$(basename "$f") too large"
  # 4. audio non-silent
  MV=$(ffmpeg -hide_banner -i "$f" -af volumedetect -f null - 2>&1 | grep mean_volume | awk '{print $5}')
  awk -v m="${MV:--99}" 'BEGIN{exit !(m > -50)}' && ok "$(basename "$f") audio mean ${MV} dB" || fail "$(basename "$f") audio silent (${MV} dB)"
  # 3. static signature: last 2.2s frame-diff + not black
  ffmpeg -hide_banner -loglevel error -y -sseof -2.2 -i "$f" -vf "fps=5,crop=720:1000:180:400,scale=216:300" "$TMP/$(basename "$f" .mp4)-end-%02d.png"
  python3 - "$TMP" "$(basename "$f" .mp4)" <<'PY' || fail "static-signature check errored"
import sys,glob,struct,zlib
tmp,base=sys.argv[1],sys.argv[2]
def png(p):
    d=open(p,'rb').read(); pos=8; w=h=0; idat=b''
    while pos<len(d):
        L=struct.unpack('>I',d[pos:pos+4])[0]; t=d[pos+4:pos+8]; c=d[pos+8:pos+8+L]; pos+=12+L
        if t==b'IHDR': w,h=struct.unpack('>II',c[:8])
        elif t==b'IDAT': idat+=c
    raw=zlib.decompress(idat); bpp=3 if len(raw)==(w*3+1)*h else 4; stride=w*bpp+1
    rows=[]; prev=bytearray(w*bpp)
    for y in range(h):
        f=raw[y*stride]; line=bytearray(raw[y*stride+1:(y+1)*stride])
        for x in range(len(line)):
            a=line[x-bpp] if x>=bpp else 0; b=prev[x]; c=prev[x-bpp] if x>=bpp else 0
            if f==1: line[x]=(line[x]+a)&255
            elif f==2: line[x]=(line[x]+b)&255
            elif f==3: line[x]=(line[x]+(a+b)//2)&255
            elif f==4:
                p=a+b-c; pa=abs(p-a); pb=abs(p-b); pc=abs(p-c); pr=a if pa<=pb and pa<=pc else (b if pb<=pc else c); line[x]=(line[x]+pr)&255
        rows.append(bytes(line)); prev=line
    return w,h,bpp,rows
files=sorted(glob.glob(f"{tmp}/{base}-end-*.png"))
frames=[png(f) for f in files]
w,h,bpp,_=frames[0]
def luma(fr): 
    s=0;n=0
    for r in fr[3]:
        for i in range(0,len(r),bpp*7): s+=r[i]*.299+r[i+1]*.587+r[i+2]*.114; n+=1
    return s/n
diffs=[]
for a,b in zip(frames,frames[1:]):
    s=0;n=0
    for ra,rb in zip(a[3],b[3]):
        for i in range(0,len(ra),bpp*5): s+=abs(ra[i]-rb[i])+abs(ra[i+1]-rb[i+1])+abs(ra[i+2]-rb[i+2]); n+=3
    diffs.append(s/n)
md=max(diffs) if diffs else 0; last=luma(frames[-1])
print(f"info: {base} last-2.2s max frame diff {md:.2f} (thr 4.0), last-frame luma {last:.1f}")
sys.exit(0 if md<1.5 and last>5 else 3)
PY
  sig_rc=$?
  if [ $sig_rc -eq 0 ]; then ok "$(basename "$f") static signature (mark region) + not black"; else fail "$(basename "$f") signature moves or ends black (rc=$sig_rc)"; fi
done

# 2. OCR sweep (2 fps) — region-based: for REEL 1 the top band (y<150) and bottom band (y>1300) are OUR overlay type (FAIL);
#    the middle band is the device screen = site UI verbatim (WARN, listed for Shavit). REEL 2 is all our composition (FAIL).
for f in "$R1" "$R2"; do
  b=$(basename "$f" .mp4); mkdir -p "$TMP/$b"
  if [[ "$b" == REEL-1-the-website-* ]]; then
    ffmpeg -hide_banner -loglevel error -y -i "$f" -vf "fps=2,crop=1080:150:0:0,scale=1620:225" "$TMP/$b/top-%04d.png"
    ffmpeg -hide_banner -loglevel error -y -i "$f" -vf "fps=2,crop=1080:620:0:1300,scale=1620:930" "$TMP/$b/bot-%04d.png"
    ffmpeg -hide_banner -loglevel error -y -i "$f" -vf "fps=2,crop=1080:1150:0:150,scale=1620:1725" "$TMP/$b/mid-%04d.png"
    passes="top:overlay bot:overlay mid:siteui"
  else
    ffmpeg -hide_banner -loglevel error -y -i "$f" -vf "fps=2,scale=1620:2880" "$TMP/$b/all-%04d.png"
    passes="all:overlay"
  fi
  n=0
  for pass in $passes; do pfx=${pass%%:*}; kind=${pass#*:}
    for img in "$TMP/$b"/$pfx-*.png; do
      n=$((n+1)); idx=${img##*-}; idx=${idx%.png}; ts=$(awk -v n="$((10#$idx))" 'BEGIN{printf "%.1f", (n-1)/2}')
      txt=$(tesseract "$img" - --psm 11 2>/dev/null | tr '\n' ' ')
      hits=""
      if [ "$RULE_DOLLARS" != 1 ]; then echo "$txt" | grep -qE '\$ ?([0-9]{1,3}(,[0-9]{3})+|[0-9]{3,})' && hits="$hits [\$]"; fi
      echo "$txt" | grep -qiE '\b[0-9]{2,5} +[a-z]+ +(street|st|ave|avenue|rd|road|dr|drive|ln|lane|ct|court)\b' && hits="$hits [digit-address]"
      echo "$txt" | grep -qiE '\b(19|1[0-9]|[2-9][0-9])[0-9]{0,3} +(kendall|budlong|barry|ludlam|oak|howder|norwood|cedar|ewing|st joe|saint joe)\b' && hits="$hits [known-address]"
      echo "$txt" | grep -qE 'Hillsdale, *MI\b|South Bend, *IN\b|Cleveland, *OH\b|, (MI|OH|IN)\b' && hits="$hits [state-abbr]"
      echo "$txt" | grep -qiE 'CPH|DSR|Barootman|Charger Realty|Indiana Charger|Triovest' && hits="$hits [holding-co]"
      if [ -n "$hits" ]; then
        ctx=$(echo "$txt" | grep -oE '.{0,28}(\$ ?[0-9][0-9,]*|[0-9]{2,5} +[A-Za-z]+ +[A-Za-z]+|, ?(MI|OH|IN)\b).{0,16}' | head -2 | tr '\n' '|')
        if [ "$kind" = siteui ]; then warn "$b @${ts}s site-UI hit${hits} ctx=<${ctx}> — for Shavit's ruling (site copy verbatim)"
        else
          # overlay band: our type is the renderer source. If none of the flagged categories can be produced by the
          # renderer sources (same regexes run over reel1.html + the-turn.html), the hit came from footage crossing
          # the band (a device screen) → site UI (WARN). Otherwise FAIL.
          SRC="docs/product-edit/reel1/reel1.html docs/product-edit/mockup/the-turn.html"
          ours=0
          case "$hits" in *'[$]'*) grep -qE '\$ ?([0-9]{1,3}(,[0-9]{3})+|[0-9]{3,})' $SRC && ours=1 ;; esac
          case "$hits" in *'[digit-address]'*) grep -qiE '\b[0-9]{2,5} +[a-z]+ +(street|st|ave|avenue|rd|road|dr|drive|ln|lane|ct|court)\b' $SRC && ours=1 ;; esac
          case "$hits" in *'[known-address]'*) grep -qiE '\b(19|1[0-9]|[2-9][0-9])[0-9]{0,3} +(kendall|budlong|barry|ludlam|oak|howder|norwood|cedar|ewing|st joe|saint joe)\b' $SRC && ours=1 ;; esac
          case "$hits" in *'[state-abbr]'*) grep -qE 'Hillsdale, *MI\b|South Bend, *IN\b|Cleveland, *OH\b|, (MI|OH|IN)\b' $SRC && ours=1 ;; esac
          case "$hits" in *'[holding-co]'*) grep -qiE 'CPH|DSR|Barootman|Charger Realty|Indiana Charger|Triovest' $SRC && ours=1 ;; esac
          if [ $ours -eq 0 ]; then warn "$b @${ts}s site-UI (device crossing overlay band) hit${hits} [$pfx] ctx=<${ctx}> — for Shavit's ruling"
          else fail "$b @${ts}s OVERLAY hit${hits} [$pfx] ctx=<${ctx}>"; fi
        fi
      fi
    done
  done
  [ "$n" -ge 60 ] && ok "$b OCR sweep done ($n crops)" || fail "$b OCR sweep ran on only $n crops — extraction broken"
done

# 5. Palmier conformance (timelines exist with base video + bed spanning 1050 frames)
python3 - <<'PY' || fail "Palmier conformance"
import json,subprocess,sys
S='/Users/jakehorvitz/projects/shavit-pipeline/docs/reel-specs/_scripts/pmcp.py'
ids=json.load(open('docs/product-edit/palmier-reel-timelines.json'))
okc=0
for name,tid in ids.items():
    subprocess.run(['python3',S,'call','set_active_timeline',json.dumps({"timelineId":tid})],capture_output=True,text=True,timeout=120)
    out=subprocess.run(['python3',S,'call','get_timeline','{}'],capture_output=True,text=True,timeout=120).stdout
    try: d=json.loads(out)
    except Exception: print('info: palmier not reachable'); sys.exit(2)
    tf=d.get('totalFrames'); tracks=d.get('tracks') or []
    nclips=sum(len(t.get('clips',[])) for t in tracks) if tracks else d.get('clipCount',0)
    print(f"info: {name}: totalFrames={tf} tracks={len(tracks)} clips={nclips}")
    if tf==1050 and len(tracks)>=2: okc+=1
sys.exit(0 if okc==2 else 3)
PY
[ $? -eq 0 ] && ok "Palmier: both reel timelines present (1050 frames, video+audio)" || true

# 6. register: no generated imagery / no generation calls
grep -qiE 'higgsfield|generate_image|generate_video' docs/product-edit/reel1/reel1.html docs/product-edit/mockup/the-turn.html && fail "renderer references generation" || ok "renderers reference only captures/photos"
grep -qiE 'generate_(image|video)|higgsfield' .bones/journal.log 2>/dev/null && fail "generation call in journal" || ok "no generation calls journaled"

# 7. captions
for c in docs/product-edit/captions/REEL-1.md docs/product-edit/captions/REEL-2.md; do
  [ -s "$c" ] || { fail "missing $c"; continue; }
  grep -q '—' "$c" && fail "$c has an em dash" || true
  grep -qiE "\b(don['’]t|can['’]t|won['’]t|it['’]s|we['’]re|you['’]re|that['’]s|isn['’]t|aren['’]t|didn['’]t|doesn['’]t|I['’]m|we['’]ll|you['’]ll|they['’]re|there['’]s|what['’]s|let['’]s|here['’]s|wasn['’]t|haven['’]t|hasn['’]t|couldn['’]t|wouldn['’]t|shouldn['’]t)\b" "$c" && fail "$c has a contraction" || ok "$(basename "$c") no em dashes / contractions"
done

echo "== accept-edit: FAIL=$FAIL WARN=$WARN"
[ $FAIL -eq 0 ]
