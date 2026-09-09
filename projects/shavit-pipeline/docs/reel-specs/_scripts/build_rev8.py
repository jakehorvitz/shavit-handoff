#!/usr/bin/env python3
"""Rebuild the Shavit montage: branded title cards, Ludlam opening, a four-room
Oak grid, and a transition vocabulary instead of nine identical white flashes.

WHAT CHANGED, AND ON WHOSE INSTRUCTION

1. Title cards. Jake: "title cards need to have the shavit colors of white and
   black with the shavit logo." Both card slots now use CARD-brand.png from
   make_cards.py -- black canvas, gold stake line, and the SHAVIT ROOTMAN lockup
   lifted pixel-for-pixel out of the shipped outro so the two cannot drift. The
   mark is baked into a still, so it draws once and holds static, which is the
   standing no-pulsing-logo rule from the 5/22/2026 meeting. The plain
   "black-card" asset is still used for the dip-to-black overlay: a logo must
   never flash inside a transition.

2. Oak. Four passes to get here. "a grid of all the photos they fly in then
   out" -> tiles converging. "I can't have blurred bars" -> cells tile the frame
   exactly, no backdrop plate. "the grid looks weird get some movement for each
   picture" -> a camera per photo. And finally the one that works: "Address one
   frame, and then it goes up into a corner. Then another one comes. It takes
   the whole screen, and then goes to a corner." Each photo owns the whole
   screen and then settles into its corner, exposing the next one already full
   screen behind it. Rendered by oak_grid.py.

3. Order. Jake: "I want ludham to be the first house then you can do the order
   after that."

     * LUDLAM opens. It descends and lands on the real photograph of a finished
       house, and Norwood's establisher is the same white siding at the same
       oblique with grass in the lower third -- so they cross-dissolve as a
       genuine match, a finished house becoming one still being gutted.
     * Ewing sits between the interiors and the aerials. It is the only
       live-action motion in the film, so there it is a texture break; behind
       the aerials it was undercutting the biggest shot.
     * Saint Joe closes the property run. It CLIMBS and pulls back to the widest,
       highest frame in the film, which is what should hand into "THESE ARE THE
       PEOPLE" -- pull back to the big picture, then show who did it.

4. Transitions. Jake: "change up some of the transitions they don't all need to
   be white flashes of cuts between each", then "make the transitions fasts".
   Five kinds, each chosen for what it joins, and every soft join shortened:

     cut         inside a property block -- same house, continuous action. The
                 old white dips were interrupting the Norwood dolly and the
                 Howder crane for no reason.
     flash       5f hard white slam. Only where a section genuinely breaks, so
                 it means something again.
     bloom       8f white overlay faded up and down over the cut.
     dissolve    a true cross-dissolve. The outgoing clip's tail moves to its own
                 track over the incoming clip's head, so the overlap costs real
                 runtime, as a dissolve should. Twice: Ludlam into Norwood (12f)
                 and Barry's studs into Barry's finished room (10f).
     black       16f dip to black into the team card. The only chapter break.

   Cedar hands to Saint Joe on a FLASH, not a dissolve: checked in rendered
   frames, Cedar ends on a high oblique and Saint Joe opens on a low straight-on
   elevation, so a dissolve would mismatch framing and camera height both.

Palmier trap being avoided throughout: emptying a track makes the editor delete
it and renumber every trackIndex. So on each track one old clip is parked far
out at PARK_FRAME, the rest are removed, the new clips are added, and only then
is the parked clip removed -- the track is never empty.
"""
import sys
from pathlib import Path

import pmcp

BASE = Path(__file__).resolve().parent.parent / "current-projects-team-2026-07-27"
CONFORM = BASE / "conform-0729"
PARK_FRAME = 9000
FPS = 30

# Track ids are stable; indexes are not. Resolved to live indexes at run time.
T_NOTES = "59DF6CEC"
T_DIPS, T_TEXT, T_SCRIM, T_PIX, T_BED = "1B81D99E", "1ECF9BE2", "C072223E", "3D1D42DC", "5715CE27"
# Cross-dissolve tails live on their own track, created on first run and then
# pinned directly above the picture track and BELOW the text track -- a tail
# rendering over the address tag would veil it for the length of the dissolve.
DISSOLVE_TRACK_FILE = Path(__file__).resolve().parent / ".rev8-dissolve-track"
CITY_TRACK_FILE = Path(__file__).resolve().parent / ".rev8-city-track"

IMPORTS = [
    ("BARRY finished", "BARRY-finished.jpg"),
    ("OAK in-progress", "OAK-inprogress.jpg"),
    ("LUDLAM exterior", "LUDLAM-exterior.jpg"),
    ("CEDAR exterior", "CEDAR-exterior.jpg"),
    ("SAINTJOE before", "SAINTJOE-before.jpg"),
    ("SAINTJOE after", "SAINTJOE-after.jpg"),
    ("EWING southbend", "EWING-southbend-25s.mp4"),
    # Re-conformed from the source track (found in ~/Downloads, correlation
    # 0.998 against the old bed) to EXACTLY the film length, with a 2.5s
    # fade out. The 59.4s bed was the reason shots kept getting trimmed.
    # Versioned filename: Palmier caches an asset's frame count, so a
    # re-conform at a new length must arrive as a new file AND a new name.
    ("BED redlights v4", "BED-redlights-64s.m4a"),
    # rev25: regenerated dish-free per Shavit 7/29 ("remove all the antennas").
    # New filename AND new asset name are mandatory -- Palmier caches an asset's
    # frame count, so reusing either renders black or rejects the entry.
    ("SAINTJOE drone 6s nodish", "SAINTJOE-drone-6s-nodish-v2.mp4"),
    ("LUDLAM drone", "LUDLAM-drone-5s.mp4"),
    ("CEDAR drone", "CEDAR-drone-5s.mp4"),
    # All four 115 Oak photos, full frame, each on its own camera.
    # Oak is four ordinary full-screen shots now, not a grid. Jake: "nvm cut the
    # grid just make transtions and camera movments between the photos."
    # Re-rendered from the 5712x4284 original so it can hold 3.00s. Jake asked
    # for one more second and the old 2.00s clip was the ceiling.
    ("NORWOOD framing 3s", "NORWOOD-framing-3s.mp4"),
    # Jake: "This needs to take the entire verticle frame please fix the photo
    # should be expanded use higgs if need be." Higgsfield 9:16 outpaint, then
    # the widest window that holds all three men, bottom-aligned to the real
    # content so the only invented band is sky and tree canopy at the top (14%).
    ("CREW fullframe", "CREW-fullframe.jpg"),
    ("OAK 1 ladder", "OAK-1-ladder.mp4"),
    ("OAK 2 green", "OAK-2-green.mp4"),
    ("OAK 3 arch", "OAK-3-arch.mp4"),
    ("OAK 4 kitchen", "OAK-4-kitchen.mp4"),
    # Black card carrying the SHAVIT ROOTMAN lockup, per Jake. The plain
    # "black-card" asset stays in use for the dip-to-black overlay -- a logo
    # must not flash inside a transition.
    ("CARD brand", "CARD-brand.png"),
]

REV6_REFS = {
    "black-card": "822C6AB7",
    "white flash": "1E39E508",
    "scrim": "72F73E98",
    "N1 Norwood establisher": "FD769A17",
    "GEN2 Norwood stripped dolly-in": "208685A7",
    "05_A5-norwood-framing": "59ECED2F",
    "GEN4 Barry joists crane-up (slow)": "B94326B4",
    "GEN7 howder joists worker": "F91FEF60",
    "GEN5 Howder rafters crane-up": "F129D985",
    "GEN8 howder crew worker": "56790BA9",
    "CTR 11_C1-allan-wiggins": "7D1A1610",
    "CTR 12_C2-pamela-montez": "96BFD06D",
    "CTR 13_C3-jon-rutan": "CCD9B60F",
    "CTR 14_C4-darrin-hannibal": "A8049DB8",
    "CTR 15_C5-monte-rimer": "C69BB862",
    "CTR 16_C6-riana-beardsley": "3A9EE066",
    "CTR 17_C7-tito-jonah": "AD716FCF",
    "CTR 18_C8-team-photo": "DC443E8B",
    "19_D1-outro": "A21A8876",
}

# Motion clips keep their rev6/rev7 trim points; trimStart is in frames.
MOTION_TRIM = {
    "N1 Norwood establisher": 0,
    "GEN2 Norwood stripped dolly-in": 6,
    "05_A5-norwood-framing": 0,
    "GEN4 Barry joists crane-up (slow)": 0,
    "GEN7 howder joists worker": 0,
    "GEN5 Howder rafters crane-up": 6,
    "GEN8 howder crew worker": 0,
    "EWING southbend": 0,
    "SAINTJOE drone 6s nodish": 0,
    "LUDLAM drone": 0,
    "CEDAR drone": 0,
    "NORWOOD framing 3s": 0,
    "OAK 1 ladder": 0,
    "OAK 2 green": 0,
    "OAK 3 arch": 0,
    "OAK 4 kitchen": 0,
}

FLASH = 5        # hard white slam, a real clip on the picture track
BLOOM = 8        # soft white, an overlay straddling the cut. Jake: "make the
                 # transitions fasts" -- every soft join came down from rev10.

# (asset, duration in frames, transition OUT of this clip)
PICTURE_EDL = [
    ("CARD brand", 54, "flash"),                        # JULY 2026 IN SUMMARY
    # Jake: "I want ludham to be the first house then you can do the order after
    # that." It earns the slot: Ludlam DESCENDS and lands on the real photograph
    # of a finished house, and Norwood's establisher is the same white siding at
    # the same oblique with grass in the lower third -- so the two cross-dissolve
    # as a genuine match, finished house becoming the one still being gutted.
    # The film's rough-to-finished arc now closes a loop instead of just running.
    ("LUDLAM drone", 150, "dissolve:12"),
    # Jake, on the notes track: "this cut needs to be a little long like 0.5"
    # Capped at 72: the source is only 2.4s, and 75 was holding the last
    # frame for 3 frames. Palmier does not error on this, it just freezes.
    ("N1 Norwood establisher", 72, "cut"),              # -- SOUTH NORWOOD
    # Jake, on the notes track: "as well as here"
    # Jake: "this needs to be longer and the transtion needs to be smoother".
    # 75 -> 95 frames, and the hard cut out becomes a 12f cross-dissolve.
    ("GEN2 Norwood stripped dolly-in", 95, "dissolve:12"),
    # Restored to 57. It was only ever trimmed to buy frames for Oak, and the
    # bed can now be conformed longer, so the constraint is gone.
    # Jake: "same shit here". Its OUT bloom goes 8f -> 16f, which is the
    # smoother half. LENGTH IS BLOCKED: the source clip is exactly 2.0s, so
    # 60 frames is the ceiling -- a real extension needs a re-render from
    # the original photograph with a longer camera move.
    ("NORWOOD framing 3s", 90, "bloom:16"),
    ("GEN7 howder joists worker", 75, "cut"),           # -- HOWDER
    ("GEN5 Howder rafters crane-up", 60, "cut"),
    # Jake, on the notes track: "needs to be a bit longer". Restored to its
    # original 75. Note this puts MORE of the clipped carpenter on screen --
    # his call, made with that flagged.
    ("GEN8 howder crew worker", 75, "flash"),
    ("GEN4 Barry joists crane-up (slow)", 75, "dissolve:10"),   # -- BARRY, studs
    ("BARRY finished", 60, "cut"),                      #    ...into the finished room
    # -- OAK. Four rooms of ONE house, so they cross-dissolve rather than cut:
    # a cut here would read as four separate properties. Camera moves alternate
    # push-in with pull-back and the pans alternate direction, so no two shots
    # in a row feel the same. 4x44 minus 3x10 of overlap = 146 frames.
    ("OAK 1 ladder", 44, "dissolve:10"),
    ("OAK 2 green", 44, "dissolve:10"),
    ("OAK 3 arch", 44, "dissolve:10"),
    ("OAK 4 kitchen", 44, "flash"),
    ("EWING southbend", 75, "bloom"),                   # -- E EWING, the one live-action shot
    # The bloom above lands on Cedar's HEAD, which is where its generated
    # neighbourhood context lives -- checked in rendered frames, not assumed.
    ("CEDAR drone", 150, "flash"),                      # -- CEDAR, descends
    # Flash, not a dissolve: Cedar ends on a high oblique and Saint Joe opens on
    # a low straight-on elevation. Dissolving those two mismatches framing AND
    # camera height. The flash marks the reversal instead.
    ("SAINTJOE drone 6s nodish", 180, "black:16"),             # -- SAINT JOE, climbs and pulls back
    ("CARD brand", 90, "cut"),                          # THESE ARE THE PEOPLE
    ("CTR 12_C2-pamela-montez", 42, "cut"),             # Shavit's exact order
    ("CTR 13_C3-jon-rutan", 42, "cut"),
    ("CTR 15_C5-monte-rimer", 42, "cut"),
    ("CTR 16_C6-riana-beardsley", 42, "cut"),
    ("CTR 11_C1-allan-wiggins", 42, "cut"),
    ("CTR 14_C4-darrin-hannibal", 42, "cut"),
    ("CTR 17_C7-tito-jonah", 42, "cut"),
    ("CREW fullframe", 68, "cut"),                # closer, carries the sign-off
    ("19_D1-outro", 90, None),
]

TAG_STYLE = {
    "fontName": "Inter", "fontSize": 76, "fontCase": "uppercase", "bold": True,
    "tracking": -1, "alignment": "left", "color": "#FFFFFF",
    "shadow": {"enabled": True, "color": "#000000", "opacity": 0.9, "blur": 24, "offset": {"x": 0, "y": 3}},
}
CARD_STYLE = {
    "fontName": "Inter", "fontSize": 76, "fontCase": "uppercase", "bold": True,
    "tracking": -1, "alignment": "center", "color": "#FFFFFF", "lineSpacing": -8,
    "shadow": {"enabled": True, "color": "#000000", "opacity": 0.6, "blur": 6, "offset": {"x": 0, "y": -2}},
}
NAME_STYLE = {
    "fontName": "Inter", "fontSize": 58, "fontCase": "uppercase", "bold": True,
    "tracking": -1, "alignment": "center", "color": "#FFFFFF",
    "shadow": {"enabled": True, "color": "#000000", "opacity": 0.9, "blur": 22, "offset": {"x": 0, "y": 3}},
}

TAG_XF = {"centerX": 0.5, "centerY": 0.7695, "width": 0.86, "height": 0.28}
CARD_XF = {"centerX": 0.5, "centerY": 0.5, "width": 0.9, "height": 0.5}

# City labels (rev22, Jake 7/29 evening): small, bottom right, gold — one per
# property, spanning the same frames as its address tag. Gold #FFC000 is
# sampled off the outro's ROOTMAN lockup (make_cards.py), not guessed.
CITY_STYLE = {
    "fontName": "Inter", "fontSize": 36, "fontCase": "uppercase", "bold": True,
    "tracking": 2, "alignment": "right", "color": "#FFC000",
    "shadow": {"enabled": True, "color": "#000000", "opacity": 0.9, "blur": 14,
               "offset": {"x": 0, "y": 2}},
}
# Right edge at 0.95, bottom ~0.93 — inside the address tags' own footprint.
CITY_XF = {"centerX": 0.70, "centerY": 0.905, "width": 0.5, "height": 0.05}


def die(msg):
    print("FAIL:", msg)
    sys.exit(1)


def parse_trans(t):
    if not t:
        return "end", 0
    if ":" in t:
        kind, n = t.split(":")
        return kind, int(n)
    return t, {"flash": FLASH, "bloom": BLOOM}.get(t, 0)


def layout():
    """Walk the EDL into picture clips, overlays and dissolve tails.

    Returns (pix, overlays, dissolves, marks, total). Shared with
    add_notes_rev8 so notes can never drift from the picture.
    """
    pix, overlays, dissolves, marks, t = [], [], [], {}, 0
    for name, dur, trans in PICTURE_EDL:
        kind, n = parse_trans(trans)
        # A dissolve's overlap comes out of THIS clip's picture-track length;
        # the frames it gives up reappear as the tail riding over the next clip.
        body = dur - n if kind == "dissolve" else dur
        if body <= 0:
            die(f"{name}: dissolve {n} is longer than the clip")

        trim = MOTION_TRIM.get(name)
        e = {"__asset__": name, "startFrame": t}
        if trim is None:
            e["endFrame"] = t + body
        else:
            e["source"] = [trim / FPS, (trim + body) / FPS]
        pix.append(e)
        marks.setdefault(name, []).append((t, body))
        t += body

        if kind == "dissolve":
            if trim is None:
                die(f"{name}: dissolve needs a video source, not a still")
            dissolves.append({"__asset__": name, "startFrame": t, "n": n,
                              "source": [(trim + body) / FPS, (trim + dur) / FPS]})
        elif kind == "flash":
            pix.append({"__asset__": "white flash", "startFrame": t, "endFrame": t + n})
            t += n
        elif kind in ("bloom", "black"):
            asset = "white flash" if kind == "bloom" else "black-card"
            overlays.append({"__asset__": asset, "startFrame": t - n // 2, "n": n})
    return pix, overlays, dissolves, marks, t


def track_by_id(tl, tid):
    for tr in tl["tracks"]:
        if (tr.get("trackId") or tr.get("id")) == tid:
            return tr
    return None


def ensure_city_track(known_ids):
    """Create the gold city-label track on first run. Top of the stack is fine:
    text must render over everything, and add_texts with no trackIndex puts it
    there. Seeded with a parked clip so the empty track is not auto-deleted."""
    tid = None
    if CITY_TRACK_FILE.exists():
        cand = CITY_TRACK_FILE.read_text().strip()
        if track_by_id(pmcp.call("get_timeline", {}), cand):
            tid = cand

    if tid is None:
        r = pmcp.call("add_texts", {"entries": [{"content": "CITY SEED",
                                                 "startFrame": PARK_FRAME,
                                                 "endFrame": PARK_FRAME + 10}]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"create city track: {r['__error__']}")
        tl = pmcp.call("get_timeline", {})
        new = [tr for tr in tl["tracks"]
               if (tr.get("trackId") or tr.get("id")) not in known_ids]
        if len(new) != 1:
            die(f"expected exactly one new track, got {[t.get('trackId') for t in new]}")
        tid = new[0].get("trackId") or new[0].get("id")
        CITY_TRACK_FILE.write_text(tid)
        print("created city track", tid)
    return tid


def ensure_dissolve_track(known_ids, ref, dissolves):
    """Create the dissolve track on first run and pin it above PIX, below TEXT."""
    tid = None
    if DISSOLVE_TRACK_FILE.exists():
        cand = DISSOLVE_TRACK_FILE.read_text().strip()
        if track_by_id(pmcp.call("get_timeline", {}), cand):
            tid = cand

    if tid is None:
        # Omitting trackIndex makes Palmier create one new video track. Seed it
        # with the first tail so it is never empty (an empty track gets deleted).
        d = dissolves[0]
        r = pmcp.call("add_clips", {"entries": [{"mediaRef": ref(d["__asset__"]),
                                                 "startFrame": PARK_FRAME,
                                                 "source": d["source"]}]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"create dissolve track: {r['__error__']}")
        tl = pmcp.call("get_timeline", {})
        new = [tr for tr in tl["tracks"]
               if (tr.get("trackId") or tr.get("id")) not in known_ids]
        if len(new) != 1:
            die(f"expected exactly one new track, got {[t.get('trackId') for t in new]}")
        tid = new[0].get("trackId") or new[0].get("id")
        DISSOLVE_TRACK_FILE.write_text(tid)
        print("created dissolve track", tid)

    # Lower index renders on top in this project (text at 4 sits over picture at
    # 6), so the tail must land between TEXT and PIX.
    for _ in range(4):
        tl = pmcp.call("get_timeline", {})
        cur = track_by_id(tl, tid)["index"]
        pix_i = track_by_id(tl, T_PIX)["index"]
        txt_i = track_by_id(tl, T_TEXT)["index"]
        if txt_i < cur < pix_i:
            return tid
        want = pix_i if cur > pix_i else pix_i - 1
        r = pmcp.call("manage_tracks", {"reorder": [{"trackId": tid, "to": want}]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"reorder dissolve track: {r['__error__']}")
    die("could not seat the dissolve track between the text and picture tracks")


def main():
    pmcp.connect()

    media = pmcp.call("get_media", {})
    by_name = {}

    def index_media(o):
        if isinstance(o, dict):
            if o.get("id") and o.get("name"):
                by_name.setdefault(o["name"], o["id"])
            for v in o.values():
                index_media(v)
        elif isinstance(o, list):
            for v in o:
                index_media(v)

    index_media(media)

    for name, fn in IMPORTS:
        if name in by_name:
            continue
        path = CONFORM / fn
        if not path.exists():
            die(f"missing conformed asset {path}")
        r = pmcp.call("import_media", {"name": name, "source": {"path": str(path)},
                                       "folder": "rev8-0729"})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"import {name}: {r['__error__']}")
        index_media(r)
        if name not in by_name:
            index_media(pmcp.call("get_media", {}))
        if name not in by_name:
            die(f"imported {name} but cannot resolve its id")
        print("imported", name, "->", by_name[name])

    def ref(name):
        if name in REV6_REFS:
            return REV6_REFS[name]
        if name not in by_name:
            die(f"asset '{name}' not in library")
        return by_name[name]

    pix, overlays, dissolves, marks, total = layout()
    print(f"rev8 length: {total} frames = {total / FPS:.2f}s")

    def span(asset, nth=0):
        s, d = marks[asset][nth]
        return s, s + d

    def tag(content, asset, nth=0, through=None):
        # `through` holds one address tag across several shots of the same
        # property -- Oak is four separate clips but one house.
        s = span(asset, nth)[0]
        e = span(through if through else asset, 0 if through else nth)[1]
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(TAG_STYLE), "transform": dict(TAG_XF)}

    def card(content, asset, nth=0):
        s, e = span(asset, nth)
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(CARD_STYLE), "transform": dict(CARD_XF)}

    def name_card(content, asset, centerY=0.87):
        # Centre only, never width/height. A fixed box is a hard clip, not a
        # hint: a uniform 0.8-wide box silently ate the second word of the two
        # longest names and all but the first line of the sign-off.
        s, e = span(asset)
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(NAME_STYLE),
                "transform": {"centerX": 0.5, "centerY": centerY}}

    texts = [
        card("JULY 2026\nIN SUMMARY", "CARD brand", 0),
        tag("LUDLAM STREET", "LUDLAM drone"),
        # Norwood and Ewing are AVENUES, not Streets -- caught cross-checking
        # the film against the website 7/29. Jake's 7/16 email listed both as
        # Ave and Shavit answered it address-by-address without correcting
        # either, so his own reply is the source of truth. Do not "fix" these
        # back to STREET.
        tag("SOUTH NORWOOD AVENUE", "N1 Norwood establisher"),
        tag("HOWDER STREET", "GEN7 howder joists worker"),
        tag("BARRY STREET", "GEN4 Barry joists crane-up (slow)"),
        tag("OAK STREET", "OAK 1 ladder", through="OAK 4 kitchen"),
        tag("E EWING AVENUE", "EWING southbend"),
        tag("CEDAR STREET", "CEDAR drone"),
        tag("E SAINT JOE STREET", "SAINTJOE drone 6s nodish"),
        card("THESE ARE\nTHE PEOPLE\nTHAT MAKE\nIT POSSIBLE", "CARD brand", 1),
        name_card("Pamela Montez", "CTR 12_C2-pamela-montez"),
        name_card("Jon Rutan", "CTR 13_C3-jon-rutan"),
        name_card("Monte Rimer", "CTR 15_C5-monte-rimer"),
        name_card("Riana Beardsley", "CTR 16_C6-riana-beardsley"),
        name_card("Allan Wiggins", "CTR 11_C1-allan-wiggins"),
        name_card("Darrin Hannibal", "CTR 14_C4-darrin-hannibal"),
        name_card("Tito and Jonah", "CTR 17_C7-tito-jonah"),
        name_card("BLESSED TO WORK\nWITH THE BEST", "CREW fullframe", centerY=0.84),
    ]

    def city(content, asset, nth=0, through=None):
        # Same span logic as tag(): the label rides with its address.
        s = span(asset, nth)[0]
        e = span(through if through else asset, 0 if through else nth)[1]
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(CITY_STYLE),
                "transform": dict(CITY_XF)}

    # Cedar is NILES: 1114 Cedar is Niles MI (Shavit's 7/14 text) — neither a
    # Hillsdale nor a South Bend address, whatever his note's two buckets say.
    cities = [
        city("HILLSDALE", "LUDLAM drone"),
        city("HILLSDALE", "N1 Norwood establisher"),
        city("HILLSDALE", "GEN7 howder joists worker"),
        city("HILLSDALE", "GEN4 Barry joists crane-up (slow)"),
        city("HILLSDALE", "OAK 1 ladder", through="OAK 4 kitchen"),
        city("SOUTH BEND", "EWING southbend"),
        city("NILES", "CEDAR drone"),
        city("HILLSDALE", "SAINTJOE drone 6s nodish"),
    ]

    scrim_start = span("CTR 12_C2-pamela-montez")[0]
    # The scrim is a bottom-weighted darkener that lets the white name cards read
    # over the portraits. It used to run to the outro, which was harmless while the
    # crew photo was letterboxed -- there were black bars there anyway. Now that the
    # crew photo fills the frame it reads as exactly the black bar Jake rejected, so
    # the scrim stops when the portraits do. The sign-off carries its own shadow.
    scrim_end = span("CREW fullframe")[0]

    known = {T_NOTES, T_DIPS, T_TEXT, T_SCRIM, T_PIX, T_BED, "DC134072", "02A758EF",
             "34E3B508"}
    t_city = ensure_city_track(known)
    known = known | {t_city}
    t_dis = ensure_dissolve_track(known, ref, dissolves)

    def resolve(items):
        return [{k: v for k, v in dict(it, mediaRef=ref(it["__asset__"])).items()
                 if k != "__asset__"} for it in items]

    plan = [
        (T_PIX, resolve(pix), "clips"),
        (T_TEXT, texts, "texts"),
        (t_city, cities, "texts"),
        (T_DIPS, [dict(o, endFrame=o["startFrame"] + o["n"]) for o in resolve(overlays)],
         "clips"),
        # No endFrame here: add_clips treats endFrame and source as mutually
        # exclusive, and the tail's length is already fixed by its source span.
        (t_dis, resolve(dissolves), "clips"),
        (T_SCRIM, [{"mediaRef": ref("scrim"), "startFrame": scrim_start, "endFrame": scrim_end}],
         "clips"),
        (T_BED, [{"mediaRef": ref("BED redlights v4"), "startFrame": 0, "endFrame": total}],
         "clips"),
    ]

    for tid, new_entries, kind in plan:
        payload = [{k: v for k, v in e.items() if k != "n"} for e in new_entries]
        tl = pmcp.call("get_timeline", {})
        tr = track_by_id(tl, tid)
        old = list(tr.get("clips", []))
        if not old:
            die(f"track {tid} unexpectedly empty")
        keeper = old[0]["id"]

        r = pmcp.call("move_clips", {"moves": [{"clipId": keeper, "toFrame": PARK_FRAME}]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"park {tid}: {r['__error__']}")
        if len(old) > 1:
            r = pmcp.call("remove_clips", {"clipIds": [c["id"] for c in old[1:]]})
            if isinstance(r, dict) and r.get("__error__"):
                die(f"clear {tid}: {r['__error__']}")

        idx = track_by_id(pmcp.call("get_timeline", {}), tid)["index"]
        tool = "add_texts" if kind == "texts" else "add_clips"
        r = pmcp.call(tool, {"entries": [dict(e, trackIndex=idx) for e in payload]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"{tool} on {tid}: {r['__error__']}")

        r = pmcp.call("remove_clips", {"clipIds": [keeper]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"unpark {tid}: {r['__error__']}")
        print(f"rebuilt {tid}: {len(payload)} {kind}")

    # --- fades. Blooms and the black dip ramp up and back down across their cut;
    # dissolve tails ride from full to zero over the incoming clip's head.
    tl = pmcp.call("get_timeline", {})
    for tid, specs, both in ((T_DIPS, overlays, True), (t_dis, dissolves, False)):
        clips = {c["frames"][0]: c["id"] for c in track_by_id(tl, tid).get("clips", [])}
        for s in specs:
            cid = clips.get(s["startFrame"])
            if cid is None:
                die(f"no clip at frame {s['startFrame']} on {tid}")
            n = s["n"]
            props = {"clipIds": [cid], "fadeOutFrames": n - n // 2 if both else n,
                     "fadeOutInterpolation": "smooth"}
            if both:
                props["fadeInFrames"] = n // 2
                props["fadeInInterpolation"] = "smooth"
            r = pmcp.call("set_clip_properties", props)
            if isinstance(r, dict) and r.get("__error__"):
                die(f"fade {s['__asset__']} @{s['startFrame']}: {r['__error__']}")
    print(f"faded {len(overlays)} overlays, {len(dissolves)} dissolve tails")

    # --- free camera move on the one still Jake flagged as "can't be still".
    # Oak's push-in is gone: the grid clip carries its own motion now.
    # scale rows are [frame, width, height] in canvas units; position rows are
    # [frame, topLeftX, topLeftY], so a centred push-in drives top-left to
    # -(zoom-1)/2 on both axes. Interp is linear: an eased zoom reads as a zoom
    # effect, a linear one reads as a camera.
    MOVES = {"BARRY finished": 1.10}
    tl = pmcp.call("get_timeline", {})
    pix_clips = track_by_id(tl, T_PIX).get("clips", [])
    for asset, zoom in MOVES.items():
        start = span(asset)[0]
        clip = next((c for c in pix_clips if c["frames"][0] == start), None)
        if clip is None:
            die(f"no clip found for {asset} at frame {start}")
        last = clip["frames"][1] - clip["frames"][0] - 1
        off = -(zoom - 1) / 2
        for prop, rows in (
            ("scale", [[0, 1.0, 1.0, "linear"], [last, zoom, zoom, "linear"]]),
            ("position", [[0, 0.0, 0.0, "linear"], [last, off, off, "linear"]]),
        ):
            r = pmcp.call("set_keyframes",
                          {"clipId": clip["id"], "property": prop, "keyframes": rows})
            if isinstance(r, dict) and r.get("__error__"):
                die(f"keyframe {prop} on {asset}: {r['__error__']}")
        print(f"camera move: {asset} push-in 1.00 -> {zoom} over {last + 1} frames")

    # Audio hygiene, both directions.
    #   * The bed track has now been found muted twice mid-session, so unmute it.
    #   * A video clip carrying an audio stream drags a LINKED audio sibling onto
    #     a freshly created, unmuted audio track -- the Barry dissolve tail does
    #     exactly this. Nothing but the bed should be audible.
    tl = pmcp.call("get_timeline", {})
    fixes = []
    if track_by_id(tl, T_BED).get("muted"):
        fixes.append({"trackId": T_BED, "muted": False})
        print("music bed was MUTED -- unmuting")
    for tr in tl["tracks"]:
        tid = tr.get("trackId") or tr.get("id")
        if tr.get("type") == "audio" and tid != T_BED and not tr.get("muted"):
            fixes.append({"trackId": tid, "muted": True})
            print(f"stray audio track {tid} -- muting")
    if fixes:
        r = pmcp.call("manage_tracks", {"set": fixes})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"audio hygiene: {r['__error__']}")

    tl = pmcp.call("get_timeline", {})
    print(f"\nDONE. timeline is {tl['totalFrames']} frames = {tl['durationSeconds']:.2f}s")


if __name__ == "__main__":
    main()
