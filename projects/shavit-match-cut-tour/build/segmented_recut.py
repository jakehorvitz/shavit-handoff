#!/usr/bin/env python3
"""Robust segmented recut of the 98/100 Version A. Each segment is a simple fast render;
no giant filtergraph, no time-offset overlay (which deadlocked). Then concat + original audio.
Segments (original timeline):
  s0 [0,7.5]     untouched
  s1 [7.5,11.7]  REAL kitchen (k23) + NEW KITCHEN text   <- kills AI kitchen
  s2 [11.7,24.2] orig + t2 floors / t3 bath / t4 all-season (testimonials replaced)
  s3 [24.2,30.4] untouched ("THE HOUSE THAT CAME BACK")
  s4 [30.4,35.3] orig + Live/Work CTA (AI-disclosure covered)
"""
import subprocess, sys, os
W,H,FPS="1080","1920","30"
SRC="../delivery/Shavit-River-Street-VersionA.mp4"
OV="recut/ov"; SEG="recut/seg"; os.makedirs(SEG, exist_ok=True)
FINAL="recut/Shavit-River-Street-VersionA-v2.mp4"
ENC=["-c:v","libx264","-preset","veryfast","-crf","20","-pix_fmt","yuv420p","-r",FPS,"-an","-shortest"]

def run(cmd, tag):
    r=subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode: print("ERR",tag,r.stderr[-500:]); sys.exit(1)
    print("ok",tag)

def cut(a, b, out, extra_fc=None, extra_inputs=None):
    """Re-encode orig[a,b]; optional overlay filtergraph (windows relative to a)."""
    cmd=["ffmpeg","-y","-loglevel","error","-ss",str(a),"-t",str(round(b-a,3)),"-i",SRC]
    for p in (extra_inputs or []): cmd+=["-loop","1","-i",p]
    if extra_fc:
        cmd+=["-filter_complex",extra_fc,"-map","[out]"]
    cmd+=ENC+["-t",str(round(b-a,3)),out]   # hard output-duration cap (bulletproof vs infinite image inputs)
    run(cmd, out)

# s0
cut(0.0, 7.5, f"{SEG}/s0.mp4")

# s1: real kitchen clip + NEW KITCHEN plate (kitchen_kb is 4.2s == 7.5..11.7)
run(["ffmpeg","-y","-loglevel","error","-i","recut/kitchen/kitchen_kb.mp4","-loop","1","-i",f"{OV}/t1.png",
     "-filter_complex","[1:v]format=rgba,fade=t=in:st=0.4:d=0.4:alpha=1[t];[0:v][t]overlay=0:0[out]",
     "-map","[out]",*ENC,"-t","4.2",f"{SEG}/s1.mp4"], "s1")

# s2 [11.7,24.2]: t2 (12.1-15.8)->rel(0.4-4.1), t3 (16.6-20.3)->rel(4.9-8.6), t4 (21.0-24.0)->rel(9.3-12.3)
def plate(idx,a,b,fd=0.35):
    return (f"[{idx}:v]format=rgba,fade=t=in:st={a}:d={fd}:alpha=1,fade=t=out:st={round(b-fd,3)}:d={fd}:alpha=1[q{idx}]",
            a,b,f"q{idx}")
fcs=[]; chain="0:v"
specs=[(1,0.4,4.1),(2,4.9,8.6),(3,9.3,12.3)]   # input idx (t2,t3,t4 are inputs 1,2,3), rel windows
for idx,a,b in specs:
    f,_,_,lbl=plate(idx,a,b); fcs.append(f)
    fcs.append(f"[{chain}][{lbl}]overlay=0:0:enable='between(t,{round(a-0.05,3)},{round(b+0.05,3)})'[c{idx}]"); chain=f"c{idx}"
fcs.append(f"[{chain}]null[out]")
cut(11.7,24.2,f"{SEG}/s2.mp4","; ".join(fcs).replace("; ",";"),
    extra_inputs=[f"{OV}/t2.png",f"{OV}/t3.png",f"{OV}/t4.png"])

# s3
cut(24.2,30.4,f"{SEG}/s3.mp4")

# s4 [30.4,35.3]: o_live 30.4-32.6 -> rel(0.0-2.2), o_work 32.4-35.3 -> rel(2.0-4.9)
fcs=[]; chain="0:v"
for idx,a,b in [(1,0.0,2.25),(2,1.95,4.9)]:
    f,_,_,lbl=plate(idx,max(a,0.01),b); fcs.append(f)
    fcs.append(f"[{chain}][{lbl}]overlay=0:0:enable='between(t,{round(a-0.05,3)},{round(b+0.05,3)})'[c{idx}]"); chain=f"c{idx}"
fcs.append(f"[{chain}]null[out]")
cut(30.4,35.3,f"{SEG}/s4.mp4",";".join(fcs),extra_inputs=[f"{OV}/o_live.png",f"{OV}/o_work.png"])

# concat (video) then mux original audio
lst=f"{SEG}/list.txt"
open(lst,"w").write("".join(f"file '{os.path.abspath(f'{SEG}/{s}.mp4')}'\n" for s in ["s0","s1","s2","s3","s4"]))
run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",lst,
     "-i",SRC,"-map","0:v","-map","1:a?","-c:v","copy","-c:a","aac","-b:a","192k","-shortest",FINAL],"concat+audio")
dur=subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",FINAL],capture_output=True,text=True).stdout.strip()
print("STATUS_OK", FINAL, dur)
