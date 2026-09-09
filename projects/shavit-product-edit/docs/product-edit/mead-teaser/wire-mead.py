#!/usr/bin/env python3
"""Wire the Mead Street case-study teaser in Palmier.
Shavit talking head (IMG_5158, 30.3s) + before/after B-roll aligned to his VO.
usage: wire-mead.py            # build timeline in a fresh 'Shavit Mead Teaser' project
"""
import json, subprocess, sys, os, time

S = '/Users/jakehorvitz/projects/shavit-pipeline/docs/reel-specs/_scripts/pmcp.py'
D = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(D, 'images')
FPS = 30

def call(tool, args, to=600):
    out = subprocess.run(['python3', S, 'call', tool, json.dumps(args)],
                         capture_output=True, text=True, timeout=to).stdout
    try:
        r = json.loads(out)
    except Exception:
        return {"raw": out[:500]}
    # unwrap MCP content envelope if present
    if isinstance(r, dict) and 'result' in r:
        r = r['result']
    if isinstance(r, dict) and 'content' in r:
        for c in r['content']:
            if c.get('type') == 'text':
                try:
                    return json.loads(c['text'])
                except Exception:
                    return {"text": c['text'][:500]}
    return r

# ---- project ----
p = call('manage_project', {"action": "create", "name": "Shavit Mead Teaser",
                            "aspectRatio": "9:16", "fps": FPS})
print('project:', json.dumps(p)[:300])
print('settings:', json.dumps(call('set_project_settings', {"width": 1080, "height": 1920, "fps": FPS}))[:200])

# ---- import media ----
def imp(path, name, folder):
    r = call('import_media', {"source": {"path": path}, "name": name, "folder": folder})
    ref = r.get('mediaRef')
    print('import', name, '->', ref or json.dumps(r)[:200])
    return ref

video = imp(os.path.join(D, 'video', 'shavit-teaser-2026-08-28.mov'), 'Shavit teaser VO 8-28', 'Mead')

BEFORE = {
    'b_front':   ('CleanShot 2025-12-05 at 11.16.07@2x.png', 792/634),
    'b_rear':    ('CleanShot 2025-12-05 at 11.16.11@2x.png', 774/592),
    'b_attic':   ('CleanShot 2025-12-05 at 11.15.49@2x.png', 668/534),
    'b_ceiling': ('CleanShot 2025-12-05 at 11.15.53@2x.png', 668/526),
    'b_stairs':  ('CleanShot 2025-12-05 at 11.15.58@2x.png', 666/526),
}
AFTER_AR = 1.5
AFTER = {f'a_{n}': f'{n}.jpeg' for n in [2, 5, 14, 22, 23, 24, 26, 30, 31, 37, 38, 39, 40, 50]}

refs = {}
for k, (fn, ar) in BEFORE.items():
    refs[k] = imp(os.path.join(IMG, fn), f'Mead BEFORE {k[2:]}', 'Mead/Before')
for k, fn in AFTER.items():
    refs[k] = imp(os.path.join(IMG, fn), f'Mead AFTER {fn}', 'Mead/After')

ar = {k: BEFORE[k][1] for k in BEFORE}
ar.update({k: (3600/2700 if k == 'a_50' else AFTER_AR) for k in AFTER})

# ---- cut plan (frames @30fps), aligned to whisper segments ----
# 0-7.4 hook | 7.4-14.8 before | 14.8-18.5 Shavit + URL | 18.5-28.2 after | 28.2-end Shavit
CUTS = [
    ('b_front',    222, 278),
    ('b_rear',     278, 334),
    ('b_attic',    334, 390),
    ('b_ceiling',  390, 445),
    ('a_2',        555, 613),   # after exterior front
    ('a_5',        613, 671),   # side entrance
    ('a_26',       671, 729),   # kitchen
    ('a_30',       729, 787),   # kitchen bar + fridge
    ('a_23',       787, 846),   # living
]

# ---- place clips ----
v = call('add_clips', {"entries": [{"mediaRef": video, "startFrame": 0}]})
print('video clip:', json.dumps(v)[:300])

bg = call('add_clips', {"entries": [
    {"mediaRef": refs[k], "startFrame": a, "endFrame": b} for k, a, b in CUTS]})
fg = call('add_clips', {"entries": [
    {"mediaRef": refs[k], "startFrame": a, "endFrame": b} for k, a, b in CUTS]})
bg_ids = [c['id'] for c in bg.get('clips', [])]
fg_ids = [c['id'] for c in fg.get('clips', [])]
print('bg clips:', len(bg_ids), 'fg clips:', len(fg_ids))
if len(bg_ids) != len(CUTS) or len(fg_ids) != len(CUTS):
    print('RAW bg:', json.dumps(bg)[:400]); print('RAW fg:', json.dumps(fg)[:400]); sys.exit(2)

# ---- geometry: bg = cover (blurred), fg = fit width, centered ----
for ids, mode in ((bg_ids, 'cover'), (fg_ids, 'fit')):
    for cid, (k, a, b) in zip(ids, CUTS):
        A = ar[k]
        if mode == 'cover':
            h = 1920; w = round(1920 * A)
        else:
            w = 1080; h = round(1080 / A)
        r = call('set_clip_properties', {"clipIds": [cid], "transform":
                 {"centerX": 540, "centerY": 960, "width": w, "height": h}})
        if r.get('isError') or r.get('error'):
            print('transform ERR', k, mode, json.dumps(r)[:200])

eff = call('apply_effect', {"clipIds": bg_ids, "effects": [
    {"type": "blur.gaussian", "params": {"radius": 40}}]})
print('blur:', json.dumps(eff)[:300])

# ---- URL lower-third during the Shavit URL beat ----
t = call('add_texts', {"entries": [{
    "content": "shavitrootman.com/casestudies",
    "startFrame": 460, "endFrame": 550,
    "transform": {"centerX": 540, "centerY": 1560, "width": 940, "height": 100},
}]})
print('text:', json.dumps(t)[:300])

print(json.dumps(call('get_timeline', {}))[:800])
