#!/usr/bin/env python3
"""Put one review note on the hidden notes track for every shot in rev7.

The notes track (59DF6CEC, index 0) is Jake's shot-by-shot review surface: it is
hidden, so nothing here renders, and he reads and edits it in Palmier while
watching. After the rev7 rebuild it still held the 17 rev6 notes, sitting at rev6
frames, describing shots that no longer exist there -- worse than having none.

This clears them and lays one note per shot, aligned to that shot's exact frames,
carrying what the shot is, where the pixels came from, and the open question if
there is one. Flash frames are skipped; they are punctuation, not shots.

Run after build_rev7.py, and re-run after any recut -- the layout is derived from
build_rev7.PICTURE_EDL, so the notes cannot drift out of sync with the picture.

HARD RULE: this track must stay hidden. It carries private working notes and the
export goes to the client. The build/export flow verifies hidden:true before render.
"""
import sys

import pmcp
from build_rev7 import PICTURE_EDL

NOTES_TRACK = "59DF6CEC"
PARK_FRAME = 9000
FPS = 30

# One entry per non-flash shot, in cut order. Kept parallel to PICTURE_EDL and
# asserted against it below, so a recut that adds or drops a shot fails loudly
# here instead of silently mis-labelling every note after the change.
NOTES = [
    ("TITLE", "Title card. 'JULY 2026 IN SUMMARY'. Replaces rev6's 'EVER WONDER WHAT WE ARE "
              "BUILDING?' outright, per Jake's call relay. Shavit's texted alternative 'Ever wonder "
              "what is in the works' is deliberately NOT used -- the call supersedes the text. "
              "Brass rule animates under the type for the first 36 frames. LOCKED."),

    ("NORWOOD 1/3", "60 S Norwood, exterior establisher. GEN1 Higgsfield, 10 credits. The model "
                    "delivered a push-in with rightward drift, not the crane-up that was ordered -- "
                    "kept because it reads as an arrival. OPEN from rev6: a house number reading '60' "
                    "is visible on the porch wall. Under no-house-numbers a bare digit is arguably "
                    "outside the rule, but findability is the actual threat model. Cheap fix is a "
                    "clone-out on the plate."),

    ("NORWOOD 2/3", "60 S Norwood, stripped interior, dolly in. GEN2 Higgsfield, 10 credits. Move "
                    "starts on frame 1 with no ease-in and pulls OUT 1.10 to 1.00, so it lands on the "
                    "full uncropped frame. Trimmed 6 frames off the head."),

    ("NORWOOD 3/3", "60 S Norwood, framing. Real photograph, 05_A5. Paid for on 7/27. Shortest of the "
                    "three at 1.90s -- first candidate to cut if the film needs to come down to 45s."),

    ("HOWDER 1/3", "43 Howder, joists with a carpenter laying a board in from frame right. GEN7 "
                   "Higgsfield, 7.5 credits at 720p, Lanczos-upscaled on conform. Verified face-free "
                   "across a 4-frame full-res crop. Standing constraint: backs turned, faces never "
                   "visible -- generated faces are where 'it looks AI' lives."),

    ("HOWDER 2/3", "43 Howder, rafters, crane up to open sky. GEN5 Higgsfield, 10 credits. The one "
                   "true vertical rise in the film; the composition already pointed at sky, which is "
                   "why the vertical ambition was spent here rather than on Norwood. Head-trimmed 6 "
                   "frames."),

    ("HOWDER 3/3", "43 Howder, crew bench, carpenter handling lumber, back turned. GEN8 Higgsfield, "
                   "7.5 credits at 720p. OPEN, carried from rev6: he walks in ALONG the right edge "
                   "and is clipped for the entire clip -- checked every frame 36-116, no trim window "
                   "exists where his full back is in frame. Only a regeneration with him centred "
                   "fixes it. Needs 7.5 credits against 5 available; resets Sun 2 Aug 11:35 PM PDT."),

    ("BARRY 1/2", "33 Barry, new ceiling joists, crane up. GEN4 Higgsfield, 10 credits. Now the SETUP "
                  "half of the block rather than a standalone beat -- it hands off to the finished "
                  "room, so Barry reads as a before/after in miniature."),

    ("BARRY 2/2", "33 Barry, FINISHED room. Shavit's own photo, iMessage 7/29 09:43, IMG_4273.heic, "
                  "4032x3024. This is the shot he asked for and it REPLACES the rev6 brick chimney "
                  "breast with the pipe. Left-biased 9:16 crop, chosen over centre so both windows "
                  "stay in frame and the worker at bottom-right is excluded -- a half-cropped person "
                  "is the exact defect still open on GEN8. Fresh paint, new trim, new LVP down. MOVE APPLIED 7/29 per Jake: linear keyframed push-in 1.00 -> 1.10 across the clip, zero credits. Not an AI parallax dolly -- that would cost ~10 credits."),

    ("OAK", "115 Oak, in-progress interior. Byte-identical to drive/oak-new/001 -- Shavit sent it at "
            "09:45 with no caption, then captioned 'E Ewing, South Bend' two minutes later, which "
            "labels the VIDEO only. MD5 against the Drive folders is what caught this; reading the "
            "caption as covering all attachments would have shipped two Oak interiors as Indiana. "
            "Flooring boxes stacked and waiting is why this is the in-progress shot he asked for. "
            "Lifted +0.06 brightness / 1.10 contrast; the source is a dark 1541px phone photo. "
            "MOVE APPLIED 7/29 per Jake: linear keyframed push-in 1.00 -> 1.10, zero credits. Already fills the frame edge to edge -- verified zero letterbox rows, so there are no gaps here to fill with AI; Cedar and Saint Joe are the letterboxed ones. OPEN: a second Oak interior is conformed and held back -- he wrote 'photo' singular."),

    ("SAINT JOE", "15 E Saint Joe, 6s generated aerial and the film's closer. Kling 3.0 pro, "
                  "generated 10s at 9:16 then cut to 6 at Jake's call. Plate is the real photo "
                  "outpainted VERTICALLY to full frame: sky added above, lawn below, house untouched "
                  "-- verified against the source. Opens on the real photograph, climbs above the "
                  "roofline, pulls back and orbits to a high three-quarter revealing the roof, the "
                  "street and neighbouring rooftops. Cuts to white out of it. "
                  "LESSON: the first attempt was 5s and 16:9 and MISSED -- the model compressed a "
                  "13m climb and a 52-degree swing into a tilt, exactly like GEN1 in rev6. The fix "
                  "was DURATION, not wording: 10s gives the move room to develop, then cut the "
                  "window you want. Jake's blocked spec came from the 3D drone tool at "
                  "docs/reel-specs/dronepath/index3d.html. "
                  "NOTE: the Saint Joe INTERIORS are still unused and are the best-photographed "
                  "assets in the library -- finished kitchen with the blue range, baths, staircase. "
                  "That is its own reel."),

    ("LUDLAM", "11 Ludlam, 5s generated aerial. Kling 3.0 pro, 10s at 9:16 off a plate that needed "
               "NO outpainting -- the original is portrait 1536x2048, so a plain crop already fills "
               "the frame. Zero invented pixels in the plate. Reversed on conform so it DESCENDS and "
               "pushes in, the deliberate mirror of Saint Joe's climb, and it lands on the real "
               "photograph. Jake: 'Ludham reverse is perfect.' The still it replaced was the weakest "
               "beat in the film: a side elevation with gas meters and a gravel walkway."),

    ("CEDAR", "1114 Cedar, finished exterior. Landscape 1402x1122, so it is letterboxed on black "
              "rather than cropped -- the whole house is the subject and a 9:16 crop cuts it in half. "
              "Black is on-register per brand-tokens and matches the crew-photo treatment. Shavit "
              "texted 7/27 that the lease is signed on this one. STAYS A STILL ON PURPOSE. Outpainting it to full-frame 9:16 was attempted TWICE and fabricated property both times: attempt one invented a detached garage, a driveway, a sidewalk and a hillside; attempt two invented an attached wing with its own roof plus a driveway and sidewalk, and shrank the real house to fit them. That is invented square footage on a managed asset, so it was refused and 17.5 generation credits were not spent. Motion instead comes from a free keyframed push-in 1.00 -> 1.08, real pixels only."),

    ("E EWING (Indiana)", "1902 E Ewing, South Bend. Shavit's video, iMessage 7/29 09:47, "
                          "IMG_5251.MOV, 29.3s. Carries rotation=-90 so it is natively VERTICAL "
                          "720x1280, not landscape -- upscaled 1.5x. Cut from t=3.4s, the cleanest "
                          "diagonal spray arc in the take. Source audio stripped; the film runs on "
                          "its own bed. This answers his 'no Indiana project feature?' and it is the "
                          "only live-action motion in the film, which is why it sits second-to-last "
                          "and hands straight into the team turn. It is also why no Higgsfield "
                          "credits were spent this pass."),

    ("TEAM CARD", "'THESE ARE THE PEOPLE THAT MAKE IT POSSIBLE'. 3.00s. Sized at 76pt with explicit "
                  "line breaks -- at 100pt it wrapped to seven lines inside a six-line box and "
                  "silently dropped the word POSSIBLE in rev6. Do not raise the point size."),

    ("PERSON 1", "Pamela Montez. First per Shavit's texted order, 7/29 11:24. Re-cropped from an "
                 "810x970 original, 3.42x upscale, centred with the head in the upper third."),
    ("PERSON 2", "Jon Rutan. Re-cropped from 768x1024, 2.69x upscale."),
    ("PERSON 3", "Monte Rimer. Re-cropped from 768x1024, 2.72x upscale."),
    ("PERSON 4", "Riana Beardsley. Re-cropped from a 2316x3088 original -- downscaled 0.65x, so this "
                 "is the sharpest portrait in the set. Her name card was clipping to 'RIANA' until "
                 "the text box was switched to auto-fit."),
    ("PERSON 5", "Allan Wiggins. Re-cropped from 768x1024, 3.24x upscale -- softest of the seven."),
    ("PERSON 6", "Darrin Hannibal. Re-cropped from 768x1024, 3.03x upscale. Was clipping to 'DARRIN' "
                 "before the auto-fit fix."),
    ("PERSON 7", "Jonah and Tito, the Indiana pair. Shavit: 'you can put the one photo of both.' "
                 "2003x2402 source, 1.25x. This is the two-man photo, NOT the three-person crew shot."),

    ("CREW CLOSER", "Three-person crew photo, no name card, carrying the sign-off 'BLESSED TO WORK "
                    "WITH THE BEST' -- Shavit's exact replacement for 'thankful'. He did not list "
                    "this photo in his order; Jake's call was to keep it as a closer. Letterboxed at "
                    "1.25x because the group spans wider than any 9:16 crop can hold and the old crop "
                    "amputated the man on the left. Sign-off sits at centreY 0.84, higher than the "
                    "name cards, because it is two lines. Source is raw/staff-named/04-team-photo.jpg "
                    "-- raw/staff/04.jpg is a watermarked screenshot, not this photo."),

    ("OUTRO", "Brand end card. 'BUILT IN MICHIGAN, OHIO & INDIANA / SHAVIT ROOTMAN / REAL ESTATE. "
              "OPERATED.' with 'MADE POSSIBLE BY THE CPM TEAM' footer. 3.00s. Music bed fades out "
              "2.5s underneath. Matches the prior shipped reels' end card -- do not restyle it."),
]


def die(msg):
    print("FAIL:", msg)
    sys.exit(1)


def main():
    # Derive the shot layout from the picture EDL so notes and picture cannot drift.
    shots, t = [], 0
    for name, dur in PICTURE_EDL:
        if name is not None:
            shots.append((name, t, t + dur))
        t += dur

    if len(shots) != len(NOTES):
        die(f"{len(shots)} shots but {len(NOTES)} notes -- PICTURE_EDL changed, update NOTES")

    pmcp.connect()
    tl = pmcp.call("get_timeline", {})

    tr = next((x for x in tl["tracks"]
               if (x.get("trackId") or x.get("id")) == NOTES_TRACK), None)
    if tr is None:
        die("notes track is gone")
    if not tr.get("hidden"):
        die("notes track is NOT hidden -- refusing to write private notes to a visible track")

    entries = []
    for (asset, start, end), (label, body) in zip(shots, NOTES):
        secs = (end - start) / FPS
        entries.append({
            "content": f"[{label}]  {secs:.2f}s  f{start}-{end}\n{body}",
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
    for (label, _), (asset, s, e) in zip(NOTES, shots):
        print(f"  f{s:5d}-{e:5d}  {label}")


if __name__ == "__main__":
    main()
