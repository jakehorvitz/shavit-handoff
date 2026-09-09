#!/usr/bin/env python3
"""v8 of the Mead teaser: the Instagram-post pivot.

Jake 8/29: "instead of showing photos from case study 3 have mini photos of the
instagram post case studies we did ... and when he mentions the website pull
images or footage from that as well", scoped to "only the BEFORE block swaps".

So:
  - the 3 Mead BEFORE photos (292..445) come out, replaced by inserts/minis.mp4
    (the five shipped IG carousel covers as cards)
  - "go check our website, shavitrootman.com" (88..167)  gets inserts/web1.mp4
  - "shavitrootman.com/casestudies"          (427..503)  gets inserts/web2.mp4
  - the 3 Mead AFTER photos (555..846) are left alone

Inserts land on the empty V7 track, then the URL-kicker track is reordered to
index 0 so the gold CTA still renders over web2 (they overlap at 427..503).
"""
import json
import subprocess
import sys

S = '/Users/jakehorvitz/projects/shavit-pipeline/docs/reel-specs/_scripts/pmcp.py'
HERE = '/Users/jakehorvitz/projects/shavit-product-edit/docs/product-edit/mead-teaser'

# the BEFORE block only — fg lanes then bg blur fill (rebuild-v5.py's 292..445)
BEFORE_CLIPS = ['9FBB6A6A', '9F7075B9', '66EB1A0A',
                '877D65AD', 'C908F373', 'BF2BDA3D']
URL_CLIP = 'A9612CE5'
VIDEO_CLIP = '02F8BA35'

INSERTS = [
    # (file, name, startFrame, endFrame)  end is exclusive
    ('inserts/web1.mp4',  'INSERT website home',        88, 168),
    ('inserts/minis.mp4', 'INSERT ig case study minis 135f', 292, 427),
    ('inserts/web2.mp4',  'INSERT website casestudies', 427, 503),
]


def call(tool, args, to=900):
    out = subprocess.run(['python3', S, 'call', tool, json.dumps(args)],
                         capture_output=True, text=True, timeout=to).stdout
    try:
        r = json.loads(out)
    except Exception:
        return {"raw": out[:400]}
    if isinstance(r, dict) and 'result' in r:
        r = r['result']
    if isinstance(r, dict) and 'content' in r:
        for c in r['content']:
            if c.get('type') == 'text':
                try:
                    return json.loads(c['text'])
                except Exception:
                    return {"text": c['text'][:400]}
    return r


def timeline():
    return call('get_timeline', {})


# ---- 0. guard: only run against the v7 state we expect ----
tl = timeline()
ids = {c['id'] for tr in tl['tracks'] for c in tr.get('clips', [])}
still_there = [c for c in BEFORE_CLIPS if c in ids]

video_track = next((tr for tr in tl['tracks']
                    for c in tr.get('clips', []) if c['id'] == VIDEO_CLIP), None)
if video_track is None:
    print('could not find the Shavit video track'); sys.exit(2)
print('Shavit video track idx', video_track['index'], video_track.get('label'))

# ---- 1. pull the Mead BEFORE block ----
if still_there:
    r = call('remove_clips', {"clipIds": still_there})
    print('removed BEFORE:', json.dumps(r)[:160])
else:
    print('BEFORE block already removed')

# ---- 2. import the rendered inserts (reuse if a prior run already did) ----
have = {a.get('name'): a.get('id')
        for a in (call('get_media', {}).get('assets') or [])}
refs = {}
for path, name, a, b in INSERTS:
    if name in have:
        refs[path] = have[name]
        print('reusing', name, '->', refs[path])
        continue
    r = call('import_media', {"source": {"path": f'{HERE}/{path}'},
                              "name": name, "folder": "Inserts"})
    refs[path] = r.get('mediaRef') or (r.get('assets') or [{}])[0].get('id')
    print('imported', name, '->', refs[path], json.dumps(r)[:120])
if any(v is None for v in refs.values()):
    print('import failed'); sys.exit(3)

# ---- 3. lay them on the empty top track ----
# omit trackIndex entirely so this lands on a brand-new top track — every
# existing video track is occupied (V7 holds the caption group, which
# get_timeline collapses out of the clips list)
placed = call('add_clips', {"entries": [
    {"mediaRef": refs[p], "startFrame": a, "endFrame": b}
    for p, _n, a, b in INSERTS]})
pids = [c['id'] for c in placed.get('clips', [])]
print('placed', len(pids), 'inserts:', pids, json.dumps(placed)[:200])
if len(pids) != 3:
    print(json.dumps(placed)[:600]); sys.exit(4)

# full-frame (renders are already 1080x1920) + short dissolves off/onto Shavit
for cid in pids:
    call('set_clip_properties', {"clipIds": [cid],
         "transform": {"centerX": 0.5, "centerY": 0.5, "width": 1.0, "height": 1.0},
         "fadeInFrames": 8, "fadeOutFrames": 8,
         "fadeInInterpolation": "smooth", "fadeOutInterpolation": "smooth"})
print('insert transforms + dissolves set')

# ---- 4. drop the insert track just above the Shavit video, so captions,
#         CASE STUDY #3 and the gold URL kicker all still render on top ----
tl = timeline()
ins_idx = next(tr['index'] for tr in tl['tracks']
               for c in tr.get('clips', []) if c['id'] == pids[0])
vid_idx = next(tr['index'] for tr in tl['tracks']
               for c in tr.get('clips', []) if c['id'] == VIDEO_CLIP)
r = call('manage_tracks', {"reorder": [{"index": ins_idx, "to": vid_idx - 1}]})
print('insert track', ins_idx, '->', vid_idx - 1, ':', json.dumps(r)[:200])

# ---- 5. report ----
tl = timeline()
for tr in tl['tracks']:
    print('TRACK', tr.get('index'), tr.get('label'), tr.get('type'),
          [(c['id'], c.get('mediaType'), c.get('frames')) for c in tr.get('clips', [])])
