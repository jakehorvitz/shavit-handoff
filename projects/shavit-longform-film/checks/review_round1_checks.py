#!/usr/bin/env python3
"""Human-review round 1 (2026-07-03) findings, mechanized. Prints '<name> PASS|FAIL <detail>' lines."""
import json, csv, os, re, sys, subprocess

def out(name, ok, detail): print(f"{name} {'PASS' if ok else 'FAIL'} {detail}")

# load cutlist
try:
    c = json.load(open('build/cutlist.json'))
    clips = c.get('clips', c if isinstance(c, list) else [])
except Exception as e:
    for n in ('beat_windows','hook_after_plate','proof_state_map','ig_dot_scan','real_footage_min'):
        out(n, False, f'cutlist unreadable: {e}')
    sys.exit(0)

# manifest-audit: filename -> (kind, property, state)
audit = {}
try:
    for row in csv.DictReader(open('assets/manifest-audit.csv')):
        fn = os.path.basename(row.get('filename') or row.get('file') or '')
        if fn: audit[fn] = {k.lower(): (v or '').strip() for k, v in row.items()}
except Exception:
    pass

# 11a beat windows (spec v4.3 §01, ±1.5s)
WIN = {'hook': (0.0, 3.0), 'proof': (3.0, 9.0), 'reward': (38.0, 50.0), 'signature': (50.0, 53.0)}
CH = [(9.0, 21.0), (21.0, 31.0), (31.0, 38.0)]
TOL = 1.5
errs = []
by_beat = {}
for cl in clips:
    by_beat.setdefault(str(cl.get('beat', '?')), []).append(cl)
for b, (s, e) in WIN.items():
    cls = [c2 for k, v in by_beat.items() for c2 in v if k.startswith(b)]
    if not cls: errs.append(f'no {b} clip'); continue
    lo = min(float(c2['in']) for c2 in cls); hi = max(float(c2['out']) for c2 in cls)
    if abs(lo - s) > TOL or abs(hi - e) > TOL: errs.append(f'{b} spans {lo:.1f}-{hi:.1f}s vs spec {s:.0f}-{e:.0f}s')
chz = sorted([c2 for k, v in by_beat.items() for c2 in v if 'chapter' in k], key=lambda x: float(x['in']))
if chz:
    lo = float(chz[0]['in']); hi = max(float(c2['out']) for c2 in chz)
    if abs(lo - 9.0) > TOL or abs(hi - 38.0) > TOL: errs.append(f'chapters span {lo:.1f}-{hi:.1f}s vs spec 9-38s')
out('beat_windows', not errs, '; '.join(errs) or 'cutlist matches spec v4.3 timeline (±1.5s)')

# 11b hook must be a finished (after-class) plate, never a before
errs = []
for cl in by_beat.get('hook', []):
    src = str(cl.get('source', ''))
    fn = os.path.basename(src)
    if 'before' in fn.lower(): errs.append(f'hook uses a BEFORE plate: {fn}')
    a = audit.get(fn, {})
    kind = (a.get('kind') or a.get('type') or a.get('class') or '')
    if kind and 'before' in kind.lower(): errs.append(f'hook plate {fn} classed before in manifest-audit')
out('hook_after_plate', not errs, '; '.join(errs) or 'hook rides a finished exterior (spec v4.3 F1)')

# 11c proof clips must map MI -> OH -> IN via manifest-audit state (or declared state)
STATE_OF = {'01_river_street_hillsdale.jpg': 'MI', '05_west_side_cleveland.jpg': 'OH', '08_east_saint_joe_hillsdale.jpg': 'MI',
            '03_2217_parkview_south_bend.jpg': 'IN', '09_budlong_street_hillsdale.jpg': 'MI', '06_61_salem_street_hillsdale.jpg': 'MI',
            '10_second_chance_ranch_hillsdale.jpg': 'MI', '07_larchmere_duplex_cleveland.jpg': 'OH', '08_east_saint_joe.jpg': 'MI'}
seq = []
for cl in sorted(by_beat.get('proof', []), key=lambda x: float(x['in'])):
    fn = os.path.basename(str(cl.get('source', '')))
    st = str(cl.get('state', '')) or (audit.get(fn, {}).get('state', '')) or STATE_OF.get(fn, '?')
    seq.append(st.upper()[:2])
dedup = [s for i, s in enumerate(seq) if i == 0 or s != seq[i-1]]
ok = dedup == ['MI', 'OH', 'IN']
out('proof_state_map', ok, f'proof state sequence {seq} -> {dedup}, spec requires MI,OH,IN in order with correctly-attributed plates')

# 11d IG carousel dot scan on every source plate (bottom 20% band, row of >=4 similar bright circles)
try:
    import cv2, numpy as np
    bad = []
    for cl in clips:
        src = str(cl.get('source', ''))
        if not os.path.exists(src) or not re.search(r'\.(jpe?g|png)$', src, re.I): continue
        img = cv2.imread(src, cv2.IMREAD_GRAYSCALE)
        if img is None: continue
        h, w = img.shape
        band = img[int(h * 0.80):, :]
        band = cv2.GaussianBlur(band, (3, 3), 0)
        _, th = cv2.threshold(band, 200, 255, cv2.THRESH_BINARY)
        n, _, stats, cents = cv2.connectedComponentsWithStats(th, 8)
        dots = [(cents[i][0], cents[i][1], stats[i][4]) for i in range(1, n)
                if 6 <= stats[i][4] <= 400 and abs(stats[i][2] - stats[i][3]) <= max(4, stats[i][2] // 2)]
        rows = {}
        for x, y, a in dots: rows.setdefault(round(y / 14), []).append(x)
        for xs in rows.values():
            xs = sorted(xs)
            if len(xs) >= 4:
                gaps = [xs[i+1] - xs[i] for i in range(len(xs) - 1)]
                if gaps and max(gaps) - min(gaps) <= 8 and 8 <= (sum(gaps) / len(gaps)) <= 80:
                    bad.append(os.path.basename(src)); break
    out('ig_dot_scan', not bad, ('IG carousel dots detected in: ' + ', '.join(sorted(set(bad)))) if bad else 'no carousel-dot rows in any composited plate')
except Exception as e:
    out('ig_dot_scan', False, f'scan error: {e}')

# 11e at least 2 real-footage clips (Ch.2 rehab + texture beats live here)
vids = [cl for cl in clips if re.search(r'assets/(films|reels)/', str(cl.get('source', ''))) or str(cl.get('source_kind', '')) == 'footage']
out('real_footage_min', len(vids) >= 2, f'{len(vids)} real-footage clips in cutlist; spec needs >=2 (Ch.2 rehab footage + texture beats), all stills is a slideshow')
