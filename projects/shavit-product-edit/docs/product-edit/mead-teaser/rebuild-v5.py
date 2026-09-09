#!/usr/bin/env python3
"""v5 rebuild of the Mead teaser timeline in Palmier.
Jake 8/28: captions, brand fonts (Avenir Next), animate spoken numbers,
fewer photos with real crossfades.
Keeps: video clip 02F8BA35, URL pill A9612CE5 (restyled + moved).
Rebuilds: image B-roll (9 -> 6 photos, alternating-track crossfades, Ken Burns),
adds "CASE STUDY #3" pop + auto captions (text corrected after generation).
"""
import json, subprocess, sys, time

S = '/Users/jakehorvitz/projects/shavit-pipeline/docs/reel-specs/_scripts/pmcp.py'
GOLD = '#D4AF37'

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

# ---- 1. clear old image clips ----
tl = timeline()
old = [c['id'] for tr in tl['tracks'] for c in tr.get('clips', [])
       if c.get('mediaType') == 'image']
print('removing', len(old), 'image clips:',
      json.dumps(call('remove_clips', {"clipIds": old}))[:120])

# ---- 2. new cut: 3 before + 3 after, 12-frame crossfades ----
AR = {'69CFE157': 792/634, '1180016D': 668/534, '9A46DD26': 668/526,
      'E38A454A': 1.5, 'F9D0B96A': 1.5, 'B9C8EEFE': 1.5}
# (ref, fgStart, fgEnd)  A/B alternate for overlap
FG = [
    ('69CFE157', 292, 351, 'A'),   # before: front
    ('1180016D', 339, 398, 'B'),   # before: attic junk
    ('9A46DD26', 386, 445, 'A'),   # before: ceiling collapse
    ('E38A454A', 555, 660, 'A'),   # after: exterior
    ('F9D0B96A', 648, 753, 'B'),   # after: kitchen
    ('B9C8EEFE', 741, 846, 'A'),   # after: living
]
# bg (blur fill): hard cuts at crossfade midpoints, one track
BG = [
    ('69CFE157', 292, 345), ('1180016D', 345, 392), ('9A46DD26', 392, 445),
    ('E38A454A', 555, 654), ('F9D0B96A', 654, 747), ('B9C8EEFE', 747, 846),
]

tl = timeline()
print('tracks now:', [(tr['label'], tr['index'],
      [(c['id'], c.get('mediaType')) for c in tr.get('clips', [])])
      for tr in tl['tracks']])

# each add_clips call with trackIndex omitted creates one new TOP track,
# so creation order builds the stack: bg -> fgA -> fgB (bottom to top)
bg = call('add_clips', {"entries": [
    {"mediaRef": r, "startFrame": a, "endFrame": b}
    for r, a, b in BG]})
bg_ids = [c['id'] for c in bg.get('clips', [])]
fgA = call('add_clips', {"entries": [
    {"mediaRef": r, "startFrame": a, "endFrame": b}
    for r, a, b, lane in FG if lane == 'A']})
fgB = call('add_clips', {"entries": [
    {"mediaRef": r, "startFrame": a, "endFrame": b}
    for r, a, b, lane in FG if lane == 'B']})
fgA_ids = [c['id'] for c in fgA.get('clips', [])]
fgB_ids = [c['id'] for c in fgB.get('clips', [])]
print('bg', len(bg_ids), 'fgA', len(fgA_ids), 'fgB', len(fgB_ids))
if len(bg_ids) != 6 or len(fgA_ids) != 4 or len(fgB_ids) != 2:
    print(json.dumps(bg)[:300], json.dumps(fgA)[:300], json.dumps(fgB)[:300])
    sys.exit(2)

fg_all = list(zip(fgA_ids, [f for f in FG if f[3] == 'A'])) + \
         list(zip(fgB_ids, [f for f in FG if f[3] == 'B']))

# ---- 3. transforms + fades + Ken Burns ----
for cid, (ref, a, b, _lane) in fg_all:
    ar = AR[ref]
    call('set_clip_properties', {"clipIds": [cid], "transform":
         {"centerX": 0.5, "centerY": 0.5, "width": 1.0,
          "height": round(1080/ar/1920, 4)},
         "fadeInFrames": 12, "fadeOutFrames": 12,
         "fadeInInterpolation": "smooth", "fadeOutInterpolation": "smooth"})
    kb = call('set_keyframes', {"clipId": cid, "property": "scale",
              "keyframes": [[a, 1.0], [b, 1.08]]})
    if kb.get('__error__'):
        kb2 = call('set_keyframes', {"clipId": cid, "property": "scale",
                   "keyframes": [[0, 1.0], [b - a, 1.08]]})
        print('KB retry', cid, json.dumps(kb2)[:120])
for cid, (r, a, b) in zip(bg_ids, BG):
    ar = AR[r]
    call('set_clip_properties', {"clipIds": [cid], "transform":
         {"centerX": 0.5, "centerY": 0.5,
          "width": round(1920*ar/1080, 4), "height": 1.0}})
print('transforms + fades + KB done')

# ---- 4. number pop: "CASE STUDY #3" while he says "our third case study" ----
n = call('add_texts', {"entries": [{
    "content": "CASE STUDY #3",
    "startFrame": 228, "endFrame": 292,
    "animation": "popIn",
    "transform": {"centerX": 0.5, "centerY": 0.12, "width": 0.8, "height": 0.07},
}]})
pop_id = (n.get('clips') or [{}])[0].get('id')
print('pop:', pop_id, json.dumps(n)[:200])
call('update_text', {"clipIds": [pop_id], "style": {
    "fontName": "AvenirNext-Bold", "fontSize": 72, "color": GOLD,
    "bold": True, "alignment": "center",
    "shadow": {"enabled": True, "color": "#000000", "opacity": 0.55, "blur": 8}}})

# ---- 5. URL pill: Avenir + move down clear of captions ----
call('update_text', {"clipIds": ["A9612CE5"], "style": {
    "fontName": "AvenirNext-DemiBold", "fontSize": 42}})
call('set_clip_properties', {"clipIds": ["A9612CE5"], "transform":
     {"centerX": 0.5, "centerY": 0.875, "width": 0.87, "height": 0.052}})
print('url pill restyled')

# ---- 6. captions ----
cap = call('add_captions', {
    "language": "en-US", "maxWords": 4,
    "animation": "highlightPop", "highlightColor": GOLD,
    "style": {"fontName": "AvenirNext-Bold", "fontSize": 46, "color": "#FFFFFF",
              "shadow": {"enabled": True, "color": "#000000",
                         "opacity": 0.6, "blur": 8}},
    "transform": {"centerX": 0.5, "centerY": 0.72}})
print('captions:', json.dumps(cap)[:300])

# ---- 7. list caption clips for the correction pass ----
tl = timeline()
for tr in tl['tracks']:
    for c in tr.get('clips', []):
        if c.get('mediaType') == 'text' and c['id'] not in ('A9612CE5', pop_id):
            print('CAP', c['id'], c['frames'], json.dumps(c.get('textContent')))
