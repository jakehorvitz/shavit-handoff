#!/usr/bin/env python3
"""Put one review note on the hidden notes track for every shot in rev8.

The notes track (59DF6CEC, index 0) is Jake's shot-by-shot review surface: it is
hidden, so nothing here renders, and he reads and edits it in Palmier while
watching.

Two things are derived, not typed, so they cannot drift from the picture:
  * frame spans come from build_rev8.layout()
  * each note's transition line comes from that row's PICTURE_EDL entry

Notes are keyed by (asset, occurrence) rather than by position, because rev8
reorders the properties -- a positional list would have silently relabelled
every note after Oak.

Run after build_rev8.py, and re-run after any recut.

HARD RULE: this track must stay hidden. It carries private working notes and the
export goes to the client. The export flow verifies hidden:true before render.
"""
import sys

import pmcp
from build_rev8 import FPS, PICTURE_EDL, layout, parse_trans

NOTES_TRACK = "59DF6CEC"
PARK_FRAME = 9000

TRANS_LABEL = {
    "cut": "hard cut",
    "flash": "5f hard white flash",
    "bloom": "8f soft white bloom",
    "end": "end of film",
}

NOTES = {
    ("CARD brand", 0): ("TITLE",
        "Title card. 'JULY 2026 IN SUMMARY'. Copy replaces rev6's 'EVER WONDER WHAT WE ARE "
        "BUILDING?' outright, per Jake's call relay; Shavit's texted alternative 'Ever wonder what "
        "is in the works' is deliberately NOT used -- the call supersedes the text. "
        "ART IS NEW per Jake: 'title cards need to have the shavit colors of white and black with "
        "the shavit logo.' Black canvas, white type, gold stake line, and the SHAVIT ROOTMAN lockup "
        "lifted pixel-for-pixel out of assets/outro.png so the title card and the end card can never "
        "drift apart. It is NOT re-typeset -- Inter is not installed locally (Palmier carries its "
        "own copy, which is why the on-screen type can ask for Inter and the card renderer cannot), "
        "and a substitute font would have been visibly wrong next to the outro. Baked into a still, "
        "so the mark draws once and holds perfectly static: the standing no-pulsing-logo rule from "
        "the 5/22/2026 meeting. Built by _scripts/make_cards.py."),

    ("N1 Norwood establisher", 0): ("NORWOOD 1/3",
        "60 S Norwood, exterior establisher. GEN1 Higgsfield, 10 credits. The model delivered a "
        "push-in with rightward drift, not the crane-up that was ordered -- kept because it reads as "
        "an arrival. LENGTHENED 60 -> 75 frames per Jake's note on this track: 'this cut needs to be "
        "a little long like 0.5'. "
        "OPEN from rev6: a house number reading '60' is visible on the porch wall. Under "
        "no-house-numbers a bare digit is arguably outside the rule, but findability is the actual "
        "threat model. Cheap fix is a clone-out on the plate."),

    ("GEN2 Norwood stripped dolly-in", 0): ("NORWOOD 2/3",
        "60 S Norwood, stripped interior, dolly in. GEN2 Higgsfield, 10 credits. Move starts on frame "
        "1 with no ease-in and pulls OUT 1.10 to 1.00, so it lands on the full uncropped frame. "
        "Trimmed 6 frames off the head. LENGTHENED 60 -> 75 frames per Jake's note on this track: "
        "'as well as here'. The white dip that used to sit on this cut is gone -- it was interrupting "
        "a continuous dolly for no reason."),

    ("NORWOOD framing 3s", 0): ("NORWOOD 3/3",
        "60 S Norwood, framing. Jake: 'same shit here' then 'can you have it stick for like 1 more "
        "second'. RE-RENDERED to 3.00s. The old clip was hard-capped at 2.00s -- that was its whole "
        "source length, so no EDL change could extend it. This is a fresh render straight from the "
        "5712x4284 original (raw/norwood/02.jpg, 24MP), so the no-upscale zoom ceiling is 2.23 and "
        "the 1.07 push-in used here is nowhere near it. Slow push in, drifting slightly left; anchorX "
        "0.62 was solved by matching crops against a frame of the previous clip so the framing did "
        "not jump. Its OUT bloom is 16f, up from 8f, for the smoother join he asked for."),

    ("GEN7 howder joists worker", 0): ("HOWDER 1/3",
        "43 Howder, joists with a carpenter laying a board in from frame right. GEN7 Higgsfield, 7.5 "
        "credits at 720p, Lanczos-upscaled on conform. Verified face-free across a 4-frame full-res "
        "crop. Standing constraint: backs turned, faces never visible -- generated faces are where "
        "'it looks AI' lives."),

    ("GEN5 Howder rafters crane-up", 0): ("HOWDER 2/3",
        "43 Howder, rafters, crane up to open sky. GEN5 Higgsfield, 10 credits. The one true vertical "
        "rise in the interior half of the film; the composition already pointed at sky, which is why "
        "the vertical ambition was spent here rather than on Norwood. Head-trimmed 6 frames."),

    ("GEN8 howder crew worker", 0): ("HOWDER 3/3",
        "43 Howder, crew bench, carpenter handling lumber, back turned. GEN8 Higgsfield, 7.5 credits "
        "at 720p. RESTORED to 75 frames per Jake's note on this track: 'needs to be a bit longer'. "
        "FLAGGED, because it cuts against the other reason this clip was short: the carpenter is "
        "clipped by the right frame edge in EVERY frame -- re-verified 7/29 against the export, there "
        "is no clean trim window -- so a longer clip means MORE of the defect on screen, not less. "
        "Jake's call, made with that stated. Only a regeneration with him centred actually fixes it; "
        "7.5 credits against roughly 20 available."),

    ("GEN4 Barry joists crane-up (slow)", 0): ("BARRY 1/2",
        "33 Barry, new ceiling joists, crane up. GEN4 Higgsfield, 10 credits. The SETUP half of the "
        "block: it does not cut to the finished room, it CROSS-DISSOLVES into it over 10 frames, so "
        "Barry reads as a before/after in miniature rather than two adjacent shots. The dissolve eats "
        "10 frames of this clip's picture-track length; the tail lives on its own track above the "
        "picture and below the text, so the address tag is never veiled."),

    ("BARRY finished", 0): ("BARRY 2/2",
        "33 Barry, FINISHED room. Shavit's own photo, iMessage 7/29 09:43, IMG_4273.heic, 4032x3024. "
        "This is the shot he asked for and it REPLACES the rev6 brick chimney breast with the pipe. "
        "Left-biased 9:16 crop, chosen over centre so both windows stay in frame and the worker at "
        "bottom-right is excluded -- a half-cropped person is the exact defect still open on GEN8. "
        "Fresh paint, new trim, new LVP down. Linear keyframed push-in 1.00 -> 1.10 across the clip, "
        "zero credits. Not an AI parallax dolly -- that would cost ~10."),

    ("OAK 1 ladder", 0): ("OAK 1/4",
        "115 Oak, ladder room. Rendered by _scripts/oak_shots.py -- zero credits, no model involved. "
        "Push in 1.00 -> 1.08 while panning right. Anchored LEFT (0.02 -> 0.24) because a centred "
        "9:16 crop cuts the left-hand window off; the pan then travels across the room rather than "
        "sitting still. "
        "THE GRID IS GONE. Five attempts at a four-up treatment were built and rejected -- converging "
        "tiles, edge-to-edge cells, per-tile cameras, a peel-back stack, and a reversed stack -- and "
        "Jake's call was 'nvm cut the grid just make transtions and camera movments between the "
        "photos it just lookds weird.' Oak is now four ordinary shots that behave like every other "
        "shot in the film. oak_grid.py is superseded but kept as the record of that work. "
        "WHY DISSOLVES AND NOT CUTS between the four: they are four rooms of ONE house. A cut reads "
        "as four separate properties; a dissolve reads as moving through a building. Same call as "
        "Barry's studs-into-finished-room. Three 10-frame dissolves, so the block is 4x44 minus 30 "
        "frames of overlap = 146. "
        "WHY PRE-RENDERED rather than keyframed in Palmier: the editor can only push into pixels the "
        "conformed asset already contains, and these are horizontal PANS. A 3:4 source cropped to "
        "9:16 discards 25% of its width and the pan spends exactly that strip, so nothing is upscaled "
        "past 1:1. A Palmier keyframe would have had to fake it by zooming."),

    ("OAK 2 green", 0): ("OAK 2/4",
        "115 Oak, green room. Pull back 1.09 -> 1.00 while panning left, the inverse of shot 1 so two "
        "adjacent shots never move the same way. Anchored right (0.76 -> 0.54) to keep the window and "
        "the stacked flooring boxes -- the boxes are why this reads as in-progress. "
        "PROVENANCE: this file is byte-identical to one of the two jpegs Shavit texted at 09:45. He "
        "captioned 'E Ewing, South Bend' two minutes later, which labels the VIDEO only. MD5 against "
        "the Drive folders is what caught that; reading the caption as covering all attachments would "
        "have shipped an Oak interior as an Indiana property."),

    ("OAK 3 arch", 0): ("OAK 3/4",
        "115 Oak, arch through to the front door. Push in 1.00 -> 1.07 panning left, anchored 0.54 -> "
        "0.30 to hold the arch while losing a folding chair at the bottom left. "
        "This is the weakest source in the set -- a low-contrast copy-of-a-copy that read as a fault "
        "beside the other three. Contrast is stretched on it automatically, gated on the histogram "
        "(1st-99th percentile range under 200), so the other three are untouched. "
        "Also byte-identical to the second jpeg Shavit texted at 09:45."),

    ("OAK 4 kitchen", 0): ("OAK 4/4",
        "115 Oak, kitchenette. Pull back 1.08 -> 1.00 panning right, centred (0.40 -> 0.62) so the "
        "base cabinets, butcher-block counter, sink and faucet all stay in frame. "
        "Deliberately LAST: it is the strongest photo in the set and the most finished-looking, so it "
        "is what the block lands on before the white flash into Indiana. Held 44 frames with no "
        "dissolve out, so it gets the cleanest read of the four."),

    ("EWING southbend", 0): ("E EWING (Indiana)",
        "1902 E Ewing, South Bend. Shavit's video, iMessage 7/29 09:47, IMG_5251.MOV, 29.3s. Carries "
        "rotation=-90 so it is natively VERTICAL 720x1280, not landscape -- upscaled 1.5x. Cut from "
        "t=3.4s, the cleanest diagonal spray arc in the take. Source audio stripped; the film runs on "
        "its own bed. This answers his 'no Indiana project feature?'. "
        "MOVED in rev8: it used to sit second-to-last. It is the only live-action motion in the film, "
        "so it now works as a texture break between the interior stills and the three generated "
        "aerials. Behind them it was a 2.5s handheld clip undercutting the biggest shot in the film."),

    ("CEDAR drone", 0): ("CEDAR",
        "1114 Cedar, 5s generated aerial that DESCENDS. Kling 3.0 pro, generated 10s at 9:16, 17.5 "
        "credits. Shavit texted 7/27 that the lease is signed on this one. "
        "PLATE: not outpainted. Two model attempts fabricated property -- one invented a detached "
        "garage, a driveway, a sidewalk and a hillside; the other invented an attached wing with its "
        "own roof and shrank the real house to fit it. That is invented square footage on a managed "
        "asset, so both were refused and 35 credits were not spent. The 9:16 frame is built from "
        "Cedar's own pixels instead: house anchored at the bottom, sky above extrapolated as a "
        "gradient from two real sky rows. "
        "OPEN, and the weakest thing in the film: the first 5 seconds of the generation are nearly "
        "static -- frame-diff 26 at t=5 against 78 at t=10, because the flat gradient sky gave the "
        "model almost nothing to move through. The clip in the film is therefore t=5-10 REVERSED, "
        "which gets the diff to 77. Fixing it properly means a better plate, not a better prompt. "
        "CORRECTION carried from rev10, checked in rendered frames rather than assumed: the "
        "generated neighbourhood context is at Cedar's HEAD, not its tail. It descends, so it opens "
        "on the invented rooftops and lands clean on the real house. An earlier note claimed a "
        "dissolve at its TAIL buried that context -- it did not, and could not. What actually covers "
        "it is the 8f bloom coming INTO Cedar from Ewing. "
        "Cedar hands to Saint Joe on a FLASH rather than a dissolve, for the same reason: Cedar ends "
        "on a high oblique and Saint Joe opens on a low straight-on elevation, so dissolving them "
        "would mismatch framing and camera height both."),

    ("LUDLAM drone", 0): ("LUDLAM",
        "11 Ludlam, 5s generated aerial, and NOW THE FIRST HOUSE IN THE FILM per Jake: 'I want "
        "ludham to be the first house then you can do the order after that.' Kling 3.0 pro, 10s at "
        "9:16, 17.5 credits, off a plate that needed NO outpainting -- the original is portrait "
        "1536x2048, so a plain crop already fills the frame. Zero invented pixels in the plate. "
        "Reversed on conform so it DESCENDS and pushes in, landing on the real photograph. Jake: "
        "'Ludham reverse is perfect.' "
        "The slot turned out to be better than a compromise. It lands on a finished white house at a "
        "three-quarter angle with grass in the lower third, and Norwood's establisher is the same "
        "siding at nearly the same oblique -- so the two CROSS-DISSOLVE over 12 frames as a genuine "
        "match cut, a finished house becoming one still being gutted. The film's rough-to-finished "
        "arc now closes a loop instead of just running one way. "
        "OPEN: only one usable source photo exists for this property, and the frame it lands on shows "
        "gas meters on the side elevation. Worth asking Shavit for a front elevation."),

    ("SAINTJOE drone 6s", 0): ("SAINT JOE",
        "15 E Saint Joe, 6s generated aerial. Kling 3.0 pro, 10s at 9:16 cut to 6 at Jake's call, "
        "17.5 credits. Plate is the real photo outpainted VERTICALLY to full frame: sky added above, "
        "lawn below, house untouched -- verified against the source. Opens on the real photograph, "
        "CLIMBS above the roofline, pulls back and orbits to a high three-quarter revealing the roof, "
        "the street and neighbouring rooftops. "
        "rev8 moves it to LAST in the property run. It is the inverse of Cedar and Ludlam's descent "
        "and it ends on the widest, highest frame in the film, which is the right thing to hand into "
        "'THESE ARE THE PEOPLE' -- pull back to the big picture, then show who did it. "
        "LESSON worth keeping: the first attempt was 5s and 16:9 and MISSED -- the model compressed a "
        "13m climb and a 52-degree swing into a tilt, exactly like GEN1 in rev6. The fix was "
        "DURATION, not wording. Generate at 10s, then cut the window you want. Jake's blocked spec "
        "came from the 3D drone tool at docs/reel-specs/dronepath/index3d.html. "
        "NOTE: the Saint Joe INTERIORS are still unused and are the best-photographed assets in the "
        "library -- finished kitchen with the blue range, baths, staircase. That is its own reel."),

    ("CARD brand", 1): ("TEAM CARD",
        "'THESE ARE THE PEOPLE THAT MAKE IT POSSIBLE'. 3.00s, on the same branded black card as the "
        "opening title, so the SHAVIT ROOTMAN lockup sits under the type here too. Sized at 76pt with "
        "explicit line breaks -- at 100pt it wrapped to seven lines inside a six-line box and "
        "silently dropped the word POSSIBLE in rev6. Do not raise the point size. Arrives through a "
        "16-frame dip to black rather than a white flash: the picture falls away, black holds, and "
        "the type comes up out of it. It is the only chapter break in the film and it should not "
        "sound like the others."),

    ("CTR 12_C2-pamela-montez", 0): ("PERSON 1",
        "Pamela Montez. First per Shavit's texted order, 7/29 11:24. Re-cropped from an 810x970 "
        "original, 3.42x upscale, centred with the head in the upper third."),
    ("CTR 13_C3-jon-rutan", 0): ("PERSON 2", "Jon Rutan. Re-cropped from 768x1024, 2.69x upscale."),
    ("CTR 15_C5-monte-rimer", 0): ("PERSON 3", "Monte Rimer. Re-cropped from 768x1024, 2.72x upscale."),
    ("CTR 16_C6-riana-beardsley", 0): ("PERSON 4",
        "Riana Beardsley. Re-cropped from a 2316x3088 original -- downscaled 0.65x, so this is the "
        "sharpest portrait in the set. Her name card was clipping to 'RIANA' until the text box was "
        "switched to auto-fit."),
    ("CTR 11_C1-allan-wiggins", 0): ("PERSON 5",
        "Allan Wiggins. Re-cropped from 768x1024, 3.24x upscale -- softest of the seven."),
    ("CTR 14_C4-darrin-hannibal", 0): ("PERSON 6",
        "Darrin Hannibal. Re-cropped from 768x1024, 3.03x upscale. Was clipping to 'DARRIN' before "
        "the auto-fit fix."),
    ("CTR 17_C7-tito-jonah", 0): ("PERSON 7",
        "Jonah and Tito, the Indiana pair. Shavit: 'you can put the one photo of both.' 2003x2402 "
        "source, 1.25x. This is the two-man photo, NOT the three-person crew shot."),

    ("CREW fullframe", 0): ("CREW CLOSER",
        "Three-person crew photo, no name card, carrying the sign-off 'BLESSED TO WORK WITH THE "
        "BEST' -- Shavit's exact replacement for 'thankful'. He did not list this photo in his order; "
        "Jake's call was to keep it as a closer. "
        "NOW FULL FRAME, per Jake: 'No black bars needs to take up full screen', then 'This needs to "
        "take the entire verticle frame please fix the photo should be expanded use higgs if need "
        "be.' "
        "WHY IT NEEDED GENERATION AT ALL: the source is 1024x768 landscape. A 9:16 crop keeps only "
        "42% of the width and amputates two of the three men -- verified against all three anchors. "
        "A zero-credit lawn extension was built first and banded visibly; mirrored grass reads as "
        "smeared texture. So the frame had to be generated. "
        "HOW: upscaled to 1856x2304 (2 credits, an outpaint call that silently just upscaled), then "
        "outpainted to 9:16 (2 credits) -> 1536x2752. The model put ALL 848 new rows ABOVE the real "
        "content and none below. The shipped frame is the widest 9:16 window that still holds all "
        "three men, BOTTOM-ALIGNED to the real content so every invented row sits above: 1250x2222 "
        "at y529-2751, upscaled to 1080x1920. "
        "INVENTED CONTENT: the top 14% of the frame, and it is sky and tree canopy only. The wider "
        "windows were rejected because they pulled in a completed roofline and a neighbouring "
        "structure that exist in no photograph of this property -- the same class of fabrication that "
        "got two Cedar outpaints refused. "
        "STILL WORTH DOING: ask Shavit for a vertical crew photo. It is worth more than any of this."),

    ("19_D1-outro", 0): ("OUTRO",
        "Brand end card. 'BUILT IN MICHIGAN, OHIO & INDIANA / SHAVIT ROOTMAN / REAL ESTATE. "
        "OPERATED.' with 'MADE POSSIBLE BY THE CPM TEAM' footer. 3.00s. Music bed fades out 2.5s "
        "underneath. Matches the prior shipped reels' end card -- do not restyle it."),
}


def die(msg):
    print("FAIL:", msg)
    sys.exit(1)


def transition_line(trans, nxt):
    kind, n = parse_trans(trans)
    if kind == "dissolve":
        return f"{n}f cross-dissolve into {nxt}"
    if kind == "black":
        return f"{n}f dip to black"
    return TRANS_LABEL.get(kind, kind)


def main():
    _, _, _, marks, total = layout()

    # Rebuild the shot list in cut order, tracking each asset's occurrence index
    # so the two black cards get their own notes.
    seen, shots = {}, []
    for i, (name, dur, trans) in enumerate(PICTURE_EDL):
        nth = seen.get(name, 0)
        seen[name] = nth + 1
        start, body = marks[name][nth]
        nxt = PICTURE_EDL[i + 1][0] if i + 1 < len(PICTURE_EDL) else "-"
        shots.append((name, nth, start, start + body, transition_line(trans, nxt)))

    missing = [(n, k) for n, k, *_ in shots if (n, k) not in NOTES]
    if missing:
        die(f"no note written for {missing} -- update NOTES in this file")

    pmcp.connect()
    tl = pmcp.call("get_timeline", {})
    tr = next((x for x in tl["tracks"]
               if (x.get("trackId") or x.get("id")) == NOTES_TRACK), None)
    if tr is None:
        die("notes track is gone")
    if not tr.get("hidden"):
        die("notes track is NOT hidden -- refusing to write private notes to a visible track")

    entries = []
    for name, nth, start, end, trans in shots:
        label, body = NOTES[(name, nth)]
        entries.append({
            "content": (f"[{label}]  {(end - start) / FPS:.2f}s  f{start}-{end}"
                        f"\nOUT: {trans}\n{body}"),
            "startFrame": start, "endFrame": end,
            "animation": "off",
            "style": {"fontName": "Inter", "fontSize": 30, "color": "#FFFFFF"},
            "transform": {"centerX": 0.5, "centerY": 0.5, "width": 0.92, "height": 0.5},
        })

    # Park one stale note, clear the rest, add the new ones, then drop the parked
    # one -- an emptied track gets deleted by Palmier and renumbers every index.
    old = tr.get("clips", [])
    keeper = old[0]["id"]
    if len(old) > 1:
        r = pmcp.call("move_clips", {"moves": [{"clipId": keeper, "toFrame": PARK_FRAME}]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"park: {r['__error__']}")
        r = pmcp.call("remove_clips", {"clipIds": [c["id"] for c in old[1:]]})
        if isinstance(r, dict) and r.get("__error__"):
            die(f"clear stale notes: {r['__error__']}")

    idx = next(x["index"] for x in pmcp.call("get_timeline", {})["tracks"]
               if (x.get("trackId") or x.get("id")) == NOTES_TRACK)
    r = pmcp.call("add_texts", {"entries": [dict(e, trackIndex=idx) for e in entries]})
    if isinstance(r, dict) and r.get("__error__"):
        die(f"add notes: {r['__error__']}")

    r = pmcp.call("remove_clips", {"clipIds": [keeper]})
    if isinstance(r, dict) and r.get("__error__"):
        die(f"unpark: {r['__error__']}")

    tl = pmcp.call("get_timeline", {})
    tr = next(x for x in tl["tracks"] if (x.get("trackId") or x.get("id")) == NOTES_TRACK)
    print(f"notes track: {len(tr.get('clips', []))} notes, hidden={tr.get('hidden')}")
    print(f"timeline: {tl['totalFrames']} frames (layout says {total})")
    for name, nth, s, e, trans in shots:
        print(f"  f{s:5d}-{e:<5d} {NOTES[(name, nth)][0]:20s} OUT: {trans}")


if __name__ == "__main__":
    main()
