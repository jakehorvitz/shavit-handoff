#!/usr/bin/env python3
"""Rebuild the Shavit montage timeline as rev7, from Shavit's 2026-07-29 notes.

What changed from rev6 and why:

  * Opening is now a "JULY 2026 IN SUMMARY" title card (Jake's call relay).
  * All eight of Jake's must-feature properties appear, not three.
  * 33 Barry's chimney plate is replaced by the finished room Shavit texted.
  * People run in the exact order Shavit sent, with the crew photo as a closer.
  * Sign-off reads "BLESSED TO WORK WITH THE BEST", not "So thankful".

Property blocks are ordered rough -> finished so the film builds instead of
staying flat: studs at Norwood, structure and workers at Howder, then the first
finished room at Barry, then progressively completed houses, closing on the
Saint Joe before/after. Ewing's video sits second-to-last so its motion carries
into the team turn, and so the two similar white-exterior stills (Cedar, Saint
Joe after) are never adjacent.

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
T_DIPS, T_TEXT, T_SCRIM, T_PIX, T_BED = "1B81D99E", "1ECF9BE2", "C072223E", "3D1D42DC", "5715CE27"

# New assets conformed by prep_0729.py / prep_props_0729.py.
IMPORTS = [
    ("BARRY finished", "BARRY-finished.jpg"),
    ("OAK in-progress", "OAK-inprogress.jpg"),
    ("LUDLAM exterior", "LUDLAM-exterior.jpg"),
    ("CEDAR exterior", "CEDAR-exterior.jpg"),
    ("SAINTJOE before", "SAINTJOE-before.jpg"),
    ("SAINTJOE after", "SAINTJOE-after.jpg"),
    ("EWING southbend", "EWING-southbend-25s.mp4"),
    ("BED redlights 59s", "BED-redlights-59s.m4a"),
    # Kling 10s aerial off the vertically outpainted plate, cut to 5s per Jake.
    # Replaces the letterboxed Saint Joe still: full frame 1080x1920, no bars.
    ("SAINTJOE drone 6s", "SAINTJOE-drone-6s.mp4"),
    # Same 10s recipe, reversed so it descends and pushes in -- the mirror of
    # Saint Joe. Its plate needed no outpainting: the original is portrait, so a
    # plain crop already fills 9:16. Zero invented pixels.
    ("LUDLAM drone", "LUDLAM-drone-5s.mp4"),
    # Cedar's plate is NOT outpainted. Two model attempts fabricated property
    # (a detached garage, then an attached wing), so the 9:16 frame is built from
    # Cedar's own pixels: house anchored at the bottom, sky above extrapolated as
    # a gradient from two real sky rows. Nothing invented.
    ("CEDAR drone", "CEDAR-drone-5s.mp4"),
]

# rev6 assets, pinned by id. Their library display names carry parenthetical
# suffixes that do not survive a name lookup cleanly, and ids are stable anyway.
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

# Motion clips keep their rev6 trim points; trimStart is in frames.
MOTION_TRIM = {
    "N1 Norwood establisher": 0,
    "GEN2 Norwood stripped dolly-in": 6,
    "05_A5-norwood-framing": 0,
    "GEN4 Barry joists crane-up (slow)": 0,
    "GEN7 howder joists worker": 0,
    "GEN5 Howder rafters crane-up": 6,
    "GEN8 howder crew worker": 0,
    "EWING southbend": 0,
    "SAINTJOE drone 6s": 0,
    "LUDLAM drone": 0,
    "CEDAR drone": 0,
}

FLASH = 5

# (asset name, duration in frames). None = a between-block white flash.
PICTURE_EDL = [
    ("black-card", 54),                       # JULY 2026 IN SUMMARY
    (None, FLASH),
    ("N1 Norwood establisher", 60),           # -- SOUTH NORWOOD
    ("GEN2 Norwood stripped dolly-in", 60),
    ("05_A5-norwood-framing", 57),
    (None, FLASH),
    ("GEN7 howder joists worker", 75),        # -- HOWDER
    ("GEN5 Howder rafters crane-up", 60),
    ("GEN8 howder crew worker", 75),
    (None, FLASH),
    ("GEN4 Barry joists crane-up (slow)", 75),  # -- BARRY
    ("BARRY finished", 60),
    (None, FLASH),
    ("OAK in-progress", 60),                  # -- OAK
    (None, FLASH),
    # -- SAINT JOE now sits here, ahead of Ludlam, and hands off into it.
    # 6s aerial: opens on the real photograph, climbs, orbits to a high
    # three-quarter. Cuts to white.
    ("SAINTJOE drone 6s", 180),
    (None, FLASH),
    ("LUDLAM drone", 150),                    # -- LUDLAM, descends and pushes in
    (None, FLASH),
    ("CEDAR drone", 150),                     # -- CEDAR, climbs and arcs left
    (None, FLASH),
    ("EWING southbend", 75),                  # -- E EWING, Indiana
    (None, FLASH),
    ("black-card", 90),                       # THESE ARE THE PEOPLE
    ("CTR 12_C2-pamela-montez", 42),          # Shavit's exact order
    ("CTR 13_C3-jon-rutan", 42),
    ("CTR 15_C5-monte-rimer", 42),
    ("CTR 16_C6-riana-beardsley", 42),
    ("CTR 11_C1-allan-wiggins", 42),
    ("CTR 14_C4-darrin-hannibal", 42),
    ("CTR 17_C7-tito-jonah", 42),
    ("CTR 18_C8-team-photo", 68),             # closer, carries the sign-off
    ("19_D1-outro", 90),
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
NAME_XF = {"centerX": 0.5, "centerY": 0.87, "width": 0.8, "height": 0.115}


def die(msg):
    print("FAIL:", msg)
    sys.exit(1)


def track_index(tl, tid):
    for tr in tl["tracks"]:
        if (tr.get("trackId") or tr.get("id")) == tid:
            return tr["index"]
    die(f"track {tid} not found")


def track_clips(tl, tid):
    for tr in tl["tracks"]:
        if (tr.get("trackId") or tr.get("id")) == tid:
            return tr.get("clips", [])
    return []


def main():
    pmcp.connect()

    # --- import the new assets, reusing anything already in the library
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
                                       "folder": "rev7-0729"})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"import {name}: {r['__error__']}")
        index_media(r)
        if name not in by_name:
            media = pmcp.call("get_media", {})
            index_media(media)
        if name not in by_name:
            die(f"imported {name} but cannot resolve its id")
        print("imported", name, "->", by_name[name])

    def ref(name):
        if name in REV6_REFS:
            return REV6_REFS[name]
        if name not in by_name:
            die(f"asset '{name}' not in library")
        return by_name[name]

    # --- lay out the picture track, collecting block starts for the tags
    entries, marks, t = [], {}, 0
    for name, dur in PICTURE_EDL:
        asset = "white flash" if name is None else name
        e = {"mediaRef": ref(asset), "startFrame": t}
        trim = MOTION_TRIM.get(asset)
        if trim is None:
            e["endFrame"] = t + dur
        else:
            e["source"] = [trim / FPS, (trim + dur) / FPS]
        entries.append(e)
        marks.setdefault(asset, []).append((t, dur))
        t += dur
    total = t
    print(f"rev7 length: {total} frames = {total / FPS:.2f}s")

    def at(asset, nth=0):
        return marks[asset][nth][0]

    def span(asset, nth=0):
        s, d = marks[asset][nth]
        return s, s + d

    # --- text: title, address tags, the team card, names, sign-off
    def tag(content, asset, nth=0):
        s, e = span(asset, nth)
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(TAG_STYLE), "transform": dict(TAG_XF)}

    def card(content, asset, nth=0):
        s, e = span(asset, nth)
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(CARD_STYLE), "transform": dict(CARD_XF)}

    def name_card(content, asset, centerY=0.87):
        # Pass centre only, never width/height. A fixed box is a hard clip, not a
        # hint: a uniform 0.8-wide box silently ate the second word of the two
        # longest names and all but the first line of the sign-off. Centre-only
        # makes Palmier auto-fit the box to whatever the string actually needs.
        s, e = span(asset)
        return {"content": content, "startFrame": s, "endFrame": e,
                "animation": "slideUp", "style": dict(NAME_STYLE),
                "transform": {"centerX": 0.5, "centerY": centerY}}

    texts = [
        card("JULY 2026\nIN SUMMARY", "black-card", 0),
        tag("SOUTH NORWOOD STREET", "N1 Norwood establisher"),
        tag("HOWDER STREET", "GEN7 howder joists worker"),
        tag("BARRY STREET", "GEN4 Barry joists crane-up (slow)"),
        tag("OAK STREET", "OAK in-progress"),
        tag("LUDLAM STREET", "LUDLAM drone"),
        tag("CEDAR STREET", "CEDAR drone"),
        tag("E EWING STREET\nSOUTH BEND", "EWING southbend"),
        tag("E SAINT JOE STREET", "SAINTJOE drone 6s"),
        card("THESE ARE\nTHE PEOPLE\nTHAT MAKE\nIT POSSIBLE", "black-card", 1),
        name_card("Pamela Montez", "CTR 12_C2-pamela-montez"),
        name_card("Jon Rutan", "CTR 13_C3-jon-rutan"),
        name_card("Monte Rimer", "CTR 15_C5-monte-rimer"),
        name_card("Riana Beardsley", "CTR 16_C6-riana-beardsley"),
        name_card("Allan Wiggins", "CTR 11_C1-allan-wiggins"),
        name_card("Darrin Hannibal", "CTR 14_C4-darrin-hannibal"),
        name_card("Tito and Jonah", "CTR 17_C7-tito-jonah"),
        # two lines, so it sits slightly higher to keep the lower line off the edge
        name_card("BLESSED TO WORK\nWITH THE BEST", "CTR 18_C8-team-photo", centerY=0.84),
    ]

    # --- dips: a 6-frame white flash straddling each cut inside a block
    # Saint Joe no longer has an internal cut to dip across -- the before frame is gone.
    dip_cuts = [
        at("GEN2 Norwood stripped dolly-in"), at("05_A5-norwood-framing"),
        at("GEN5 Howder rafters crane-up"), at("GEN8 howder crew worker"),
        at("BARRY finished"),
    ]
    dips = [{"mediaRef": ref("white flash"), "startFrame": c - 3, "endFrame": c + 3}
            for c in dip_cuts]

    scrim_start = at("CTR 12_C2-pamela-montez")
    scrim_end = span("19_D1-outro")[0]

    # --- apply. Park-then-remove keeps every track alive through the swap.
    tl = pmcp.call("get_timeline", {})
    plan = [
        (T_PIX, entries, "clips"),
        (T_TEXT, texts, "texts"),
        (T_DIPS, dips, "clips"),
        (T_SCRIM, [{"mediaRef": ref("scrim"), "startFrame": scrim_start, "endFrame": scrim_end}], "clips"),
        (T_BED, [{"mediaRef": ref("BED redlights 59s"), "startFrame": 0, "endFrame": total}], "clips"),
    ]

    for tid, new_entries, kind in plan:
        tl = pmcp.call("get_timeline", {})
        old = list(track_clips(tl, tid))
        if not old:
            die(f"track {tid} unexpectedly empty")
        idx = track_index(tl, tid)
        keeper = old[0]["id"]

        r = pmcp.call("move_clips", {"moves": [{"clipId": keeper, "toFrame": PARK_FRAME}]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"park {tid}: {r['__error__']}")
        if len(old) > 1:
            r = pmcp.call("remove_clips", {"clipIds": [c["id"] for c in old[1:]]})
            if isinstance(r, dict) and r.get("__error__"):
                die(f"clear {tid}: {r['__error__']}")

        idx = track_index(pmcp.call("get_timeline", {}), tid)
        payload = [dict(e, trackIndex=idx) for e in new_entries]
        tool = "add_texts" if kind == "texts" else "add_clips"
        r = pmcp.call(tool, {"entries": payload})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"{tool} on {tid}: {r['__error__']}")

        r = pmcp.call("remove_clips", {"clipIds": [keeper]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"unpark {tid}: {r['__error__']}")
        print(f"rebuilt {tid}: {len(new_entries)} {kind}")

    # --- free camera moves on the two stills Jake flagged as "can't be still".
    # Keyframed inside Palmier, so these cost zero Higgsfield credits.
    # scale rows are [frame, width, height] in canvas units where 1.0 fills the
    # axis, and position rows are [frame, topLeftX, topLeftY] -- so holding a
    # push-in centred means driving top-left to -(zoom-1)/2 on both axes.
    # Interp is linear, not smooth: an eased zoom reads as a zoom effect, a
    # linear one reads as a camera. Same call rev6 made on the Norwood dolly.
    MOVES = {"BARRY finished": 1.10, "OAK in-progress": 1.10}

    tl = pmcp.call("get_timeline", {})
    pix = track_clips(tl, T_PIX)
    for asset, zoom in MOVES.items():
        start = at(asset)
        clip = next((c for c in pix if c["frames"][0] == start), None)
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

    tl = pmcp.call("get_timeline", {})
    print(f"\nDONE. timeline is {tl['totalFrames']} frames = {tl['durationSeconds']:.2f}s")


if __name__ == "__main__":
    main()
