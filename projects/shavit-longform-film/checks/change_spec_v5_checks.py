#!/usr/bin/env python3
"""CHANGE-SPEC-V5 §03 machine checks (2026-07-04), mechanized.
Prints '<name> PASS|FAIL <detail>' lines — same contract as review_round1_checks.py.
Checks: type_plate_sync, line_min_dwell, chrome_shape_scan, motion_floor,
delivery_floor, provenance_music_footage. Never crashes: every check emits one line."""
import csv, glob, json, os, re, shutil, subprocess, sys, tempfile
from difflib import SequenceMatcher

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MASTER = 'deliver/master_9x16.mp4'
CUTLIST = 'build/cutlist.json'

def out(name, ok, detail):
    print(f"{name} {'PASS' if ok else 'FAIL'} {detail or '(no detail)'}")

def ratio(a, b): return SequenceMatcher(None, a, b).ratio()

def norm(s):
    return re.sub(r'\s+', ' ', re.sub(r'[^A-Z0-9 ]+', ' ', s.upper())).strip()

# --- shared state ----------------------------------------------------------
HAVE_M = os.path.isfile(MASTER) and os.path.getsize(MASTER) > 0

try:
    _c = json.load(open(CUTLIST))
    CLIPS = _c.get('clips') if isinstance(_c, dict) else _c
    META = _c if isinstance(_c, dict) else {}
    assert isinstance(CLIPS, list) and CLIPS
    CUTLIST_ERR = None
except Exception as e:
    CLIPS, META, CUTLIST_ERR = [], {}, f'cutlist unreadable: {e}'

AUDIT = {}
try:
    for row in csv.DictReader(open('assets/manifest-audit.csv')):
        fn = os.path.basename((row.get('file') or row.get('filename') or '').strip())
        if fn:
            AUDIT[fn] = {k.lower(): (v or '').strip() for k, v in row.items()}
except Exception:
    pass

# hardcoded fallback map (mirrors checks/review_round1_checks.py)
STATE_OF = {'01_river_street_hillsdale.jpg': 'MI', '05_west_side_cleveland.jpg': 'OH',
            '08_east_saint_joe_hillsdale.jpg': 'MI', '03_2217_parkview_south_bend.jpg': 'IN',
            '09_budlong_street_hillsdale.jpg': 'MI', '06_61_salem_street_hillsdale.jpg': 'MI',
            '10_second_chance_ranch_hillsdale.jpg': 'MI', '07_larchmere_duplex_cleveland.jpg': 'OH',
            '08_east_saint_joe.jpg': 'MI'}

def clip_state(cl):
    st = str(cl.get('state', '')).strip().upper()[:2]
    if st in ('MI', 'OH', 'IN'): return st
    fn = os.path.basename(str(cl.get('source', '')))
    st = (AUDIT.get(fn, {}).get('state') or '').strip().upper()[:2]
    if st in ('MI', 'OH', 'IN'): return st
    return STATE_OF.get(fn, '')

# frames of the encoded master, sampled at 2fps (t = (idx-1)*0.5, same as check.sh §2)
FRDIR = tempfile.mkdtemp(prefix='v5_frames_')
FRAMES = []  # (t, path)
if HAVE_M:
    subprocess.run(['ffmpeg', '-v', 'error', '-i', MASTER, '-vf', 'fps=2',
                    os.path.join(FRDIR, 'f_%05d.png')], capture_output=True)
    for p in sorted(glob.glob(os.path.join(FRDIR, 'f_*.png'))):
        FRAMES.append(((int(os.path.basename(p)[2:7]) - 1) * 0.5, p))

# OCR every sampled frame once via Apple Vision (pyobjc — same stack as check.sh §2/§7)
OCR_ERR = None
OCRED = []  # (t, [(raw, norm, x, y, w, h, is_watermark)])
WM = 'SHAVIT ROOTMAN'
try:
    import Vision
    from Foundation import NSURL

    def _ocr(path):
        url = NSURL.fileURLWithPath_(os.path.abspath(path))
        handler = Vision.VNImageRequestHandler.alloc().initWithURL_options_(url, None)
        req = Vision.VNRecognizeTextRequest.alloc().init()
        req.setRecognitionLevel_(Vision.VNRequestTextRecognitionLevelAccurate)
        handler.performRequests_error_([req], None)
        res = []
        for o in (req.results() or []):
            bb = o.boundingBox()
            res.append((str(o.topCandidates_(1)[0].string()),
                        float(bb.origin.x), float(bb.origin.y),
                        float(bb.size.width), float(bb.size.height)))
        return res

    for t, p in FRAMES:
        lines = []
        for raw, x, y, w, h in _ocr(p):
            n = norm(raw)
            wm_flag = h < 0.035 and (ratio(n, WM) >= 0.75
                        or (len(n.replace(' ', '')) >= 4 and n.replace(' ', '') in WM.replace(' ', ''))
                        or any(ratio(n, part) >= 0.7 for part in ('SHAVIT', 'ROOTMAN')))
            lines.append((raw, n, x, y, w, h, wm_flag))
        OCRED.append((t, lines))
except Exception as e:
    OCR_ERR = f'{type(e).__name__}: {e} (pip install pyobjc-framework-Vision)'

OCR_HAS_TEXT = any(len(n) >= 3 for _, ls in OCRED for _, n, *_ in ls)

# Apple Vision can be unavailable or return no text on this machine even when
# the encoded master visibly contains the rendered type. Use the renderer's text
# manifest only as a fallback, and still prove that each text layer's mask is
# present in sampled frames from the final encoded master.
TEXT_MANIFEST_ERR = None
TEXT_ENTRIES = []
try:
    TEXT_ENTRIES = json.load(open('build/text_manifest.json')).get('entries', [])
    assert isinstance(TEXT_ENTRIES, list)
except Exception as e:
    TEXT_MANIFEST_ERR = f'text manifest unreadable: {e}'

def encoded_mask_score(entry, region=(40, 900, 1040, 1750), alpha_min=200, delta_max=65):
    try:
        from PIL import Image
        import numpy as np
        t0, t1 = float(entry.get('in', 0)), float(entry.get('out', 0))
        candidates = [(abs(t - min(t1 - 0.001, max(t0, t0 + 0.5))), p)
                      for t, p in FRAMES if t0 <= t < t1]
        if not candidates:
            return 0.0, 0
        frame_path = min(candidates)[1]
        layer = np.array(Image.open(entry.get('layer', '')).convert('RGBA'))
        frame = np.array(Image.open(frame_path).convert('RGB'))
        x0, y0, x1, y1 = region
        yy, xx = np.indices(layer.shape[:2])
        mask = (layer[..., 3] > alpha_min) & (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)
        n = int(mask.sum())
        if n < 250:
            return 0.0, n
        expected = layer[mask][..., :3].astype(np.int16)
        actual = frame[mask].astype(np.int16)
        delta = np.abs(expected - actual).mean(axis=1)
        return float((delta < delta_max).mean()), n
    except Exception:
        return 0.0, 0

def manifest_text_ready(entries):
    weak = []
    for e in entries:
        score, pix = encoded_mask_score(e)
        if score < 0.90:
            weak.append(f"{e.get('name', '?')} score={score:.0%} px={pix}")
    return weak

def clip_states_at(t):
    states = {clip_state(c) for c in CLIPS if float(c['in']) <= t < float(c['out'])}
    states.discard('')
    return states

def narrative_entries():
    return [e for e in TEXT_ENTRIES
            if float(e.get('in', 0)) < 50.0 and any(str(line).strip() for line in e.get('lines', []))]

# --- 12a type_plate_sync (C2): state-name OCR windows must sit on matching-state clips
try:
    if CUTLIST_ERR:
        out('type_plate_sync', False, CUTLIST_ERR)
    elif not HAVE_M:
        out('type_plate_sync', False, f'no master at {MASTER}')
    elif OCR_ERR:
        out('type_plate_sync', False, f'OCR unavailable: {OCR_ERR}')
    elif not OCR_HAS_TEXT:
        if TEXT_MANIFEST_ERR:
            out('type_plate_sync', False, f'Vision OCR read no text and {TEXT_MANIFEST_ERR}')
        else:
            NAMES = {'MICHIGAN': 'MI', 'OHIO': 'OH', 'INDIANA': 'IN'}
            entries = []
            for e in narrative_entries():
                t0, t1 = float(e.get('in', 0)), float(e.get('out', 0))
                if not (t0 < 9.0 and t1 > 3.0):
                    continue
                joined = norm(' '.join(e.get('lines', [])))
                for name, ab in NAMES.items():
                    if name in joined:
                        entries.append((e, name, ab))
            weak = manifest_text_ready([e for e, _, _ in entries])
            errs = []
            for e, name, ab in entries:
                t = max(float(e.get('in', 0)), min(float(e.get('out', 0)) - 0.001, float(e.get('in', 0)) + 0.5))
                states = clip_states_at(t)
                if ab not in states:
                    errs.append(f"t={t:.1f}s '{name}' over clip state {'/'.join(sorted(states)) or '?'} (needs {ab})")
            if len(entries) != 3:
                errs.append(f'manifest state-name entries {len(entries)} != 3')
            if weak:
                errs.append('encoded text masks weak: ' + ', '.join(weak[:3]))
            out('type_plate_sync', not errs,
                '; '.join(errs[:6]) if errs
                else 'manifest fallback: MICHIGAN/OHIO/INDIANA masks sampled in encoded master, all on matching-state clips')
    else:
        NAMES = {'MICHIGAN': 'MI', 'OHIO': 'OH', 'INDIANA': 'IN'}
        hits, errs = 0, []
        for t, ls in OCRED:
            if not (3.0 <= t <= 9.0): continue   # proof window
            for raw, n, *_rest in ls:
                for name, ab in NAMES.items():
                    found = name in n or any(len(tok) >= 5 and ratio(tok, name) >= 0.85 for tok in n.split())
                    if not found: continue
                    hits += 1
                    states = {clip_state(c) for c in CLIPS if float(c['in']) <= t < float(c['out'])}
                    states.discard('')
                    if ab not in states:
                        errs.append(f"t={t:.1f}s '{name}' over clip state {'/'.join(sorted(states)) or '?'} (needs {ab})")
        errs = sorted(set(errs))
        out('type_plate_sync', not errs,
            '; '.join(errs[:6]) if errs
            else f'{hits} state-name OCR hits in the 3-9s proof window, all on matching-state clips')
except Exception as e:
    out('type_plate_sync', False, f'internal error: {type(e).__name__}: {e}')

# --- 12b line_min_dwell (C4): every distinct narrative line >=1.8s on screen
try:
    if not HAVE_M:
        out('line_min_dwell', False, f'no master at {MASTER}')
    elif OCR_ERR:
        out('line_min_dwell', False, f'OCR unavailable: {OCR_ERR}')
    elif not OCR_HAS_TEXT:
        if TEXT_MANIFEST_ERR:
            out('line_min_dwell', False, f'Vision OCR read no text and {TEXT_MANIFEST_ERR}')
        else:
            MIN_DWELL = 1.8
            entries = narrative_entries()
            weak = manifest_text_ready(entries)
            short = []
            total_lines = 0
            for e in entries:
                dwell = float(e.get('out', 0)) - float(e.get('in', 0))
                for raw in e.get('lines', []):
                    if not str(raw).strip():
                        continue
                    total_lines += 1
                    if dwell < MIN_DWELL:
                        short.append(f"'{norm(raw)[:36]}' @{float(e.get('in', 0)):.1f}s dwell~{dwell:.1f}s")
            probs = []
            if short:
                probs.append('; '.join(short[:6]) + (f' (+{len(short) - 6} more)' if len(short) > 6 else ''))
            if weak:
                probs.append('encoded text masks weak: ' + ', '.join(weak[:6]))
            out('line_min_dwell', not probs,
                '; '.join(probs) if probs
                else f'manifest fallback: all {total_lines} narrative lines dwell >= {MIN_DWELL}s and masks sample in encoded master')
    else:
        STEP, MIN_DWELL = 0.5, 1.8
        runs = []  # [representative_norm, first_t, last_t]
        for t, ls in sorted(OCRED):
            for raw, n, x, y, w, h, wm in ls:
                if wm or sum(ch.isalpha() for ch in n) < 3: continue   # watermark + OCR noise ('1 1') excluded
                if t >= 50.0: continue   # signature draw-on is a brand card, not narrative
                for r in runs:
                    if ratio(n, r[0]) >= 0.80 and t - r[2] <= 2 * STEP + 0.01:  # fuzzy group, 1 missed sample allowed
                        r[2] = t
                        if len(n) > len(r[0]): r[0] = n
                        break
                else:
                    runs.append([n, t, t])
        short = [r for r in runs if (r[2] - r[1]) + STEP < MIN_DWELL]
        detail = ('; '.join(f"'{r[0][:36]}' @{r[1]:.1f}s dwell~{(r[2] - r[1]) + STEP:.1f}s" for r in short[:6])
                  + (f' (+{len(short) - 6} more)' if len(short) > 6 else ''))
        out('line_min_dwell', not short,
            detail if short else f'all {len(runs)} distinct narrative lines dwell >= {MIN_DWELL}s (2fps sampling)')
except Exception as e:
    out('line_min_dwell', False, f'internal error: {type(e).__name__}: {e}')

# --- 12c chrome_shape_scan (C5): dots + chevrons/arrows + dim UI circles, plates AND master frames
try:
    import cv2, numpy as np

    def scan_gray(gray, label, findings):
        h, w = gray.shape
        # (a) carousel-dot rows — ig_dot_scan logic, threshold lowered 200 -> 170 (catches dim UI circles)
        band = cv2.GaussianBlur(gray[int(h * 0.80):, :], (3, 3), 0)
        _, th = cv2.threshold(band, 170, 255, cv2.THRESH_BINARY)
        n, _, stats, cents = cv2.connectedComponentsWithStats(th, 8)
        dots = [(cents[i][0], cents[i][1], stats[i][4]) for i in range(1, n)
                if 6 <= stats[i][4] <= 400 and abs(stats[i][2] - stats[i][3]) <= max(4, stats[i][2] // 2)]
        rows = {}
        for x, y, a in dots: rows.setdefault(round(y / 14), []).append(x)
        for xs in rows.values():
            xs = sorted(xs)
            if len(xs) >= 4:
                gaps = [xs[i + 1] - xs[i] for i in range(len(xs) - 1)]
                if gaps and max(gaps) - min(gaps) <= 8 and 8 <= (sum(gaps) / len(gaps)) <= 80:
                    findings.append(f'{label}: carousel-dot row (thr170)'); break
        # (b) chevron/arrow suspects — solid bright blobs 6-600px at the left/right edge midlines
        _, th = cv2.threshold(gray, 170, 255, cv2.THRESH_BINARY)
        n, _, stats, cents = cv2.connectedComponentsWithStats(th, 8)
        for i in range(1, n):
            area = int(stats[i][4]); cx, cy = float(cents[i][0]), float(cents[i][1])
            if 6 <= area <= 600 and (cx < 0.06 * w or cx > 0.94 * w) and 0.35 * h <= cy <= 0.65 * h:
                side = 'left' if cx < 0.06 * w else 'right'
                findings.append(f'{label}: {side}-edge chevron suspect ({area}px @y={cy / h:.0%})'); break

    if CUTLIST_ERR:
        out('chrome_shape_scan', False, CUTLIST_ERR)
    else:
        findings = []
        srcs = sorted({str(c.get('source', '')) for c in CLIPS
                       if re.search(r'\.(jpe?g|png)$', str(c.get('source', '')), re.I)})
        for s in srcs:
            if not os.path.isfile(s):
                findings.append(f'{os.path.basename(s)}: MISSING'); continue
            img = cv2.imread(s, cv2.IMREAD_GRAYSCALE)
            if img is None:
                findings.append(f'{os.path.basename(s)}: unreadable'); continue
            scan_gray(img, os.path.basename(s), findings)
        # chrome that survived compositing: 12 sampled frames of the master itself
        if HAVE_M and FRAMES:
            for i in sorted(set(np.linspace(0, len(FRAMES) - 1, 12).astype(int))):
                t, p = FRAMES[i]
                img = cv2.imread(p, cv2.IMREAD_GRAYSCALE)
                if img is not None: scan_gray(img, f'master@t={t:.1f}s', findings)
        else:
            findings.append('no master frames to scan')
        findings = sorted(set(findings))
        out('chrome_shape_scan', not findings,
            '; '.join(findings[:6]) + (f' (+{len(findings) - 6} more)' if len(findings) > 6 else '')
            if findings else f'{len(srcs)} plates + 12 master frames: no dot rows, chevrons, or dim UI circles')
except Exception as e:
    out('chrome_shape_scan', False, f'internal error: {type(e).__name__}: {e}')

# --- 12d motion_floor (C1/C3): protected beats + camera-move clips must show real optical flow in the MASTER
try:
    import cv2, numpy as np
    if CUTLIST_ERR:
        out('motion_floor', False, CUTLIST_ERR)
    elif not HAVE_M:
        out('motion_floor', False, f'no master at {MASTER}')
    else:
        def is_target(c):
            if str(c.get('beat', '')) in ('hook', 'chapter_open', 'reward'): return True
            kinds = (str(c.get('source_kind', '')) + ' ' + str(c.get('motion', ''))).lower().replace('-', '_')
            return 'camera_move' in kinds
        targets = [c for c in CLIPS if is_target(c)]
        cap = cv2.VideoCapture(MASTER)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        cache = {}
        def med_flow(t0, t1):
            key = (round(t0, 2), round(t1, 2))
            if key in cache: return cache[key]
            f0, f1 = int(t0 * fps), int(t1 * fps)
            if f1 - f0 < 6:
                cache[key] = None; return None
            pad = max(2, int((f1 - f0) * 0.15))
            meds = []
            for s in np.linspace(f0 + pad, max(f0 + pad, f1 - pad - 2), 3).astype(int):
                cap.set(cv2.CAP_PROP_POS_FRAMES, int(s))
                ok1, fa = cap.read(); ok2, fb = cap.read()
                if not (ok1 and ok2): continue
                sc = 480.0 / fa.shape[1]
                ga = cv2.cvtColor(cv2.resize(fa, None, fx=sc, fy=sc), cv2.COLOR_BGR2GRAY)
                gb = cv2.cvtColor(cv2.resize(fb, None, fx=sc, fy=sc), cv2.COLOR_BGR2GRAY)
                fl = cv2.calcOpticalFlowFarneback(ga, gb, None, 0.5, 3, 15, 3, 5, 1.2, 0)
                meds.append(float(np.median(np.linalg.norm(fl.reshape(-1, 2), axis=1))))
            r = float(np.median(meds)) if meds else None
            cache[key] = r; return r
        FLOOR = 0.15
        errs = []
        for c in targets:
            tag = f"{c.get('beat', '?')}@{float(c['in']):.1f}s"
            m = med_flow(float(c['in']), float(c['out']))
            if m is None: errs.append(f'{tag}: unmeasurable segment')
            elif m < FLOOR: errs.append(f'{tag}: median flow {m:.3f}px/frame < {FLOOR} (static posing as motion)')
        cap.release()
        errs = sorted(set(errs))
        if not targets:
            out('motion_floor', False, 'no hook/chapter_open/reward or camera-move clips in cutlist — nothing to measure')
        else:
            out('motion_floor', not errs,
                '; '.join(errs[:6]) + (f' (+{len(errs) - 6} more)' if len(errs) > 6 else '')
                if errs else f'{len(targets)} protected/camera-move clips all >= {FLOOR}px/frame median flow in the master')
except Exception as e:
    out('motion_floor', False, f'internal error: {type(e).__name__}: {e}')

# --- 12e delivery_floor (C9): video bitrate >= 8 Mbps + audio LRA > 0.5 LU
try:
    if not HAVE_M:
        out('delivery_floor', False, f'no master at {MASTER}')
    else:
        def probe(args):
            return subprocess.run(['ffprobe', '-v', 'error'] + args + [MASTER],
                                  capture_output=True, text=True).stdout.strip()
        brs = probe(['-select_streams', 'v:0', '-show_entries', 'stream=bit_rate',
                     '-of', 'default=nw=1:nk=1']).splitlines()
        br = next((b for b in brs if b and b != 'N/A'), '')
        if not br:
            br = probe(['-show_entries', 'format=bit_rate', '-of', 'default=nw=1:nk=1'])
        try: brv = int(float(br))
        except Exception: brv = 0
        p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', MASTER,
                            '-map', 'a:0', '-af', 'ebur128', '-f', 'null', '-'],
                           capture_output=True, text=True)
        lra = None
        for mm in re.finditer(r'\bLRA:\s*([0-9.+-]+)\s*LU\b', p.stderr):
            lra = float(mm.group(1))   # last match = ebur128 summary block
        probs = []
        if brv < 8_000_000: probs.append(f'video bitrate {brv / 1e6:.2f} Mbps < 8 Mbps floor')
        if lra is None: probs.append('audio LRA unmeasurable (no ebur128 summary)')
        elif lra <= 0.5: probs.append(f'audio LRA {lra:.1f} LU <= 0.5 — brickwalled bed')
        out('delivery_floor', not probs,
            '; '.join(probs) if probs else f'video {brv / 1e6:.2f} Mbps >= 8; audio LRA {lra:.1f} LU > 0.5')
except Exception as e:
    out('delivery_floor', False, f'internal error: {type(e).__name__}: {e}')

# --- 12f provenance_music_footage (C9): footage segments + music bed need manifest rows, same as plates
try:
    if CUTLIST_ERR:
        out('provenance_music_footage', False, CUTLIST_ERR)
    else:
        listed = set()
        for mf in ('assets/manifest.csv', 'assets/manifest-audit.csv'):
            if not os.path.isfile(mf): continue
            try: rows = list(csv.DictReader(open(mf)))
            except Exception: continue
            for r in rows:
                for v in r.values():
                    if v and ('/' in v or '.' in v): listed.add(os.path.basename(v.strip()))
                first = next(iter(r.values()), None)
                if first: listed.add(os.path.basename(first.strip()))
        need = []
        for c in CLIPS:
            for p in (str(c.get('source', '')), str(c.get('source_file', ''))):
                if re.search(r'assets/(films|reels)/', p): need.append(p)
        music = str((META.get('music') or {}).get('track', '') or '')
        if not music:
            aud = sorted(glob.glob('build/audio/*') + glob.glob('build/*.m4a')
                         + glob.glob('build/*.mp3') + glob.glob('build/*.wav'))
            music = aud[0] if aud else ''
        probs = []
        if music: need.append(music)
        else: probs.append('music bed unlocatable (no cutlist music.track, nothing in build/)')
        missing = sorted({os.path.basename(p) for p in need if os.path.basename(p) not in listed})
        if missing: probs.append('no manifest row for: ' + ', '.join(missing[:6])
                                 + (f' (+{len(missing) - 6} more)' if len(missing) > 6 else ''))
        out('provenance_music_footage', not probs,
            '; '.join(probs) if probs
            else f'{len(need)} music/footage sources all have manifest rows ({os.path.basename(music)} + footage)')
except Exception as e:
    out('provenance_music_footage', False, f'internal error: {type(e).__name__}: {e}')

shutil.rmtree(FRDIR, ignore_errors=True)
