#!/usr/bin/env python3
"""Remove Palmier's nest-splice click from an exported reel.

Palmier emits an audible pop wherever two nested-timeline audio clips butt-splice
mid-timeline (the merge previews: B1+E3, A3+A2, D2+D3). It is a render artifact,
not content: it is injected downstream of clip gain and fades, so it measures the
SAME with the nests at 0 dB and at -2.5 dB, and neither source has it. No fade or
level setting in Palmier can remove it, and it comes back on every re-export.

Detection is by energy, not slew. The B1+E3 click was a one-sample step (slew
10849) but the A3+A2 one ramps in over several samples, so a slew threshold misses
it. Instead: flag any 8ms bucket whose RMS jumps >35 dB above the preceding 40ms
floor while that floor is below -55 dB. Real speech never does that; it rises out
of a much louder floor.

The repair zeroes the artifact window with 2ms cosine ramps. Legitimate signal is
never lost because the artifact only occurs where both sides are already silent
(-55 to -93 dB). Video is stream-copied, so the picture is bit-identical.

    python3 fix_palmier_pop.py "MERGE · A3 + A2 (raw).mp4"
    python3 fix_palmier_pop.py in.mp4 -o out.mp4 --frame 988   # skip detection
    python3 fix_palmier_pop.py in.mp4 --dry-run                # report only
"""
import argparse
import math
import os
import struct
import subprocess
import sys
import tempfile
import wave

BUCKET = 0.008      # 8ms analysis bucket
FLOOR_N = 5         # buckets of history = 40ms floor
JUMP_DB = 35.0      # rise above the floor that marks an artifact
FLOOR_DB = -55.0    # the floor must be this quiet to qualify
PAD = 0.004         # widen the window either side of the burst
RAMP = 0.002        # cosine ramp so the mute adds no new discontinuity


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit(f"ffmpeg failed:\n{r.stderr[-2000:]}")


def read_wav(path):
    with wave.open(path) as w:
        nch, sw, sr, n = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
        return list(struct.unpack(f"<{n*nch}h", w.readframes(n))), nch, sw, sr, n


def find_clicks(d, nch, sr, n):
    """Buckets whose energy explodes out of a quiet floor. Returns [(start_s, end_s, peak)]."""
    hop = int(sr * BUCKET)
    mono = d if nch == 1 else d[0::nch]
    hits, hist = [], []
    for i in range(0, len(mono) - hop, hop):
        ch = mono[i:i + hop]
        rms = math.sqrt(sum(x * x for x in ch) / len(ch)) + 1e-9
        db = 20 * math.log10(rms / 32768)
        if len(hist) >= FLOOR_N:
            floor = sum(hist[-FLOOR_N:]) / FLOOR_N
            if floor < FLOOR_DB and db - floor > JUMP_DB:
                hits.append(i / sr)
        hist.append(db)
    # merge buckets belonging to one burst, then walk forward to its true end
    spans = []
    for t in hits:
        if spans and t - spans[-1][1] < 0.05:
            spans[-1][1] = t
        else:
            spans.append([t, t])
    out = []
    for a, b in spans:
        i = int((b + BUCKET) * sr)
        while i < len(mono) - hop:                      # extend while still loud
            ch = mono[i:i + hop]
            rms = math.sqrt(sum(x * x for x in ch) / len(ch)) + 1e-9
            if 20 * math.log10(rms / 32768) < FLOOR_DB:
                break
            i += hop
        end = i / sr
        pk = max((abs(x) for x in mono[int(a * sr):int(end * sr)]), default=0)
        out.append((a - PAD, end + PAD, pk))
    return out


def mute(d, nch, sr, n, a_s, b_s):
    a, b, r = int(a_s * sr), int(b_s * sr), max(1, int(RAMP * sr))
    for i in range(max(0, a - r), min(n, b + r)):
        if i < a:
            g = 0.5 * (1 + math.cos(math.pi * (i - (a - r)) / r))
        elif i >= b:
            g = 0.5 * (1 - math.cos(math.pi * (i - b) / r))
        else:
            g = 0.0
        for c in range(nch):
            d[i * nch + c] = int(d[i * nch + c] * g)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("-o", "--out")
    ap.add_argument("--frame", type=int, action="append",
                    help="splice frame to repair instead of auto-detecting; repeatable")
    ap.add_argument("--fps", type=float, default=30.0)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    src = args.video
    out = args.out or f"{os.path.splitext(src)[0]} (pop fixed).mp4"
    tmp = tempfile.mkdtemp()
    raw, patched = os.path.join(tmp, "a.wav"), os.path.join(tmp, "b.wav")

    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vn",
         "-c:a", "pcm_s16le", "-ar", "48000", raw])
    d, nch, sw, sr, n = read_wav(raw)

    if args.frame:
        spans = [(f / args.fps - 0.005, f / args.fps + 0.040, None) for f in args.frame]
        print(f"repairing {len(spans)} given splice frame(s): {args.frame}")
    else:
        spans = find_clicks(d, nch, sr, n)
        if not spans:
            print("no nest-splice click found — nothing to do")
            return
        for a, b, pk in spans:
            db = 20 * math.log10(max(pk, 1) / 32768)
            print(f"  click at {a + PAD:8.4f}s (f{(a + PAD) * args.fps:7.1f})  "
                  f"{(b - a) * 1000:5.1f}ms  peak {pk} ({db:+.2f} dBFS)")

    if args.dry_run:
        return

    for a, b, _ in spans:
        mute(d, nch, sr, n, a, b)

    with wave.open(patched, "wb") as w:
        w.setnchannels(nch); w.setsampwidth(sw); w.setframerate(sr)
        w.writeframes(struct.pack(f"<{len(d)}h", *d))

    run(["ffmpeg", "-v", "error", "-y", "-i", src, "-i", patched,
         "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
         "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out])
    print(f"wrote {out}")

    # prove the click is gone in the patched audio
    d2, nch2, _, sr2, n2 = read_wav(patched)
    for a, b, _ in spans:
        seg = (d2 if nch2 == 1 else d2[0::nch2])[int(a * sr2):int(b * sr2)]
        pk = max((abs(x) for x in seg), default=0)
        print(f"  verified {a + PAD:.4f}s: residual peak {pk} "
              f"({20 * math.log10(max(pk, 1) / 32768):+.2f} dBFS)")


if __name__ == "__main__":
    main()
