# RESUME — rev 6 motion rebuild, Current Projects then the Team

**Date opened:** 2026-07-28
**Rubric:** `docs/reel-specs/current-projects-team-rev6-RUBRIC.html` (serve via `python3 serve.py`, annotatable)
**Work dir:** `docs/reel-specs/current-projects-team-2026-07-27/`

## Decisions locked with Jake this session
1. **Spine:** three addresses, each a moving block, not rev 5's one house.
2. **Credits:** roughly 60 across the hero moves, reserve held back. 1080p costs **10** credits per
   generation, not 7.5. The 7.5 figure from last night was the 720p price. Six moves at 1080p is
   exactly the 60 he authorised.
3. **Aerials:** generated crane ups, capped at 2s, verified frame by frame. No faked overheads.

## Supply constraint discovered this session
- South Norwood: real whole house exterior, 4284x5712. Aerial buildable.
- Barry Street: **zero exteriors exist**, all fourteen frames are interiors.
- Howder Street: only a 768x1024 partial side elevation, already rejected by Jake.
- Substitute agreed in the rubric: Howder opens by craning up through the open roof to sky, Barry
  opens by craning down the chimney breast.

## Progress
| Shot | Status | File |
|---|---|---|
| GEN 1, Norwood establisher | **done, verified, trimmed** | `motion6/N1-norwood-establisher-TRIM24.mp4`, 2.4s, 1080x1920, 30fps |
| GEN 2, Norwood stripped, dolly in | plate ready | `GEN2_norwood_stripped.jpg` |
| GEN 3, Barry chimney, crane down | plate ready | `GEN3_barry_chimney.jpg` |
| GEN 4, Barry joists, crane up | plate ready, 2x upscaled | `GEN4_barry_joists.jpg` |
| GEN 5, Howder rafters, crane up | plate ready, 2x upscaled | `GEN5_howder_rafters.jpg` |
| GEN 6, Howder joists, dolly in | plate ready, 2x upscaled | `GEN6_howder_joists.jpg` |
| N5, Norwood framing | already paid for last night | `motion/A5-norwood-framing-TRIM2s.mp4` |

Plates currently live in the session scratchpad and must be rebuilt if it is wiped. Recipe:
exif_transpose, 9:16 centre crop, Lanczos 2x if under 1080 wide.

## Credit ledger
Opened at 77.5. GEN 1 spent 10. Five more at 1080p spent 50. GEN 7 / 7b / 8 spent 22.5 at 720p.
**5 remaining.** Credits do not roll over; they zero and reset to 1200 on **Sunday 2 Aug, 11:35 PM PDT**.

## The workers question, answered 2026-07-28
Jake asked where the workers were. **There were none, in any source photograph.**
`10_A10-howder-crew.jpg` is named "crew" but contains sawhorses, lumber, a Husky box, a nailer and a
floor opening, and **no person at all**. The rev-4 spec's claim of "a man in a hi-vis vest at the back
of frame, the only human in section A" is **wrong** and should not be trusted anywhere else either.
Across every construction folder the only humans in the project are the eight posed team portraits.

Shavit gave OK (relayed via Jake) to generate workers. Standing constraint applied anyway:
**backs turned, faces never visible.** Generated faces are where "it looks a little AI" lives, and the
face is the only part that touches likeness. Backs, hands and boots read as real.

| Shot | Result |
|---|---|
| GEN 7 first pass | **No worker generated.** Prompt placed him distant and small at the back; the model dropped him. Camera move was clean. Discarded. |
| GEN 7b | **Worker landed.** Carpenter carries a board in from frame right and lays it across the joists. Grey tee, tan work pants, boots. Verified face-free on a 4-frame full-res crop. |
| GEN 8 | **Worker landed.** Carpenter at the sawhorse bench handling lumber, back turned, enters ~frame 48. Verified face-free across frames 54-118. |

**Lesson for future worker generations:** place the person **large, close, entering from a frame edge**.
Distant and small gets silently dropped. That is the only difference between GEN 7 and GEN 7b, same plate.

**Second lesson:** resolution must be pinned explicitly. These three defaulted to **720p** because no
resolution was passed, costing 7.5 each rather than 10, but delivering 720x1280 into a 1080x1920 film.
Both keepers were Lanczos-upscaled with light unsharp on conform. Acceptable on soft documentary
texture; would not be acceptable on the type cards.

## Timeline state after the worker pass, 2026-07-28
Project "Shavit Montage of Current Project Reels", timeline `rev6 BLOCKS` (`2E4A7370`).
**1001 frames = 33.4s.** Zero gaps on the picture track, all 8 dips land exactly on cuts, all 20 notes
aligned. Track ids: pictures `3D1D42DC`, dips `1B81D99E`, text `1ECF9BE2`, notes `59DF6CEC` (hidden).
New media refs: GEN7 `F91FEF60`, GEN8 `56790BA9`.

Howder block, now the only section of the film with humans doing work:
```
438-468   1.00s   HOWDER STREET card
468-543   2.50s   GEN7 joists + carpenter laying a board    ·dip·
543-603   2.00s   GEN5 rafters crane                        ·dip·
603-678   2.50s   GEN8 crew bench + carpenter on lumber
678-683   0.17s   flash out
```
Shifts were done with explicit `move_clips` math, descending by start frame, **not** `ripple_delete_ranges`,
which destroyed every keyframe last time. Team-photo scale keyframes verified intact after the shift.

## Typography + legibility pass, 2026-07-28
Jake: "I want everything to be shavit style font and make sure there is ebough time for all text to be
read legibly." Timeline is now **1163 frames = 38.8s**.

**Legibility standard adopted: Netflix adult subtitle rate, 17 characters/second, plus a 0.5s
recognition lead.** Every one of the 13 text blocks failed it before this pass. Now all 13 clear it.
Name cards are a uniform 42 frames (1.40s) rather than staggered per-string, because uniform reads as
rhythm and staggered reads as a mistake.

**Register:** all type is uppercase Inter, tight tracking (-1), bold, #FFFFFF, per `brand-tokens`.
The sign-off "So thankful for my team" had been mixed-case at 0.80s — both fixed.

**Address cards deleted; addresses are now burned bottom-left tags over the first shot of each block**,
per Jake's note "Have this be bottom left in shavit font in the first clip" and the `address-tag-scale`
rule (tags burn over footage, ~3% cap height). Tags are 76pt with a drop shadow, since they now sit on
photography rather than black. This removed 129 frames of black card.

Four rendering defects caught only by capturing actual frames, not by reading the timeline JSON:
1. **"BARRY STREET" rendered as "ARRY STREET"** — a fixed centerX overflowed the frame on short strings.
   Fixed by anchoring a full-width box and left-aligning inside it, so every tag shares one margin.
2. **"BARRY STREET" then lost "STREET"** — its text box was one line tall while the text wrapped to two.
   Box height is a hard clip, not a hint. Each tag now gets height matching its line count.
3. **The "these are the people" card never rendered the word "POSSIBLE"** — at 100pt it wrapped to seven
   lines inside a six-line box. Dropped to 76pt with explicit line breaks.
4. **`wordReveal` greys un-highlighted words** (karaoke behaviour), which left the hook reading
   "EVER WONDER WHAT WE ARE ~~BUILDING?~~" in grey. Switched to `slideUp`, matching the name cards.

**Lesson: verify type by capturing rendered frames.** The timeline JSON reported all four of these as
healthy clips with correct `textContent`. Only the pixels showed the clipping.

Also: the group photo's 1.16 zoom keyframes were cleared, per "everyone should be in frame".

## Crew reframe + music bed, 2026-07-28
Jake: "the shots of the crew all need to be centered and everyone needs to be in frame and not cutoff."

**Root cause: the 1.16 scale keyframes.** All eight portraits were already exactly 1080x1920, a perfect
9:16 match, so nothing about the sources required cropping. The alternating 1.16 zoom pushed 16% of each
image outside the frame. Cleared on all eight.

That exposed the real problem: at full frame the **people were not centered**. The originals are wide
phone shots with each person small, low, and off to one side under a lot of house and sky. Re-cropped
every portrait from the original, centred on the subject with the head in the upper third:

| Person | Source | Upscale to 1080x1920 |
|---|---|---|
| Allan | 768x1024 | 3.24x |
| Pamela | 810x970 | 3.42x |
| Jon | 768x1024 | 2.69x |
| Darrin | 768x1024 | 3.03x |
| Monte | 768x1024 | 2.72x |
| Riana | 2316x3088 | 0.65x (downscale, sharp) |
| Tito + Jonah | 2003x2402 | 1.25x |

Five of the seven are phone photos capped at 768px, so centring them costs real sharpness (Lanczos plus
unsharp on conform). **If Shavit can supply full-resolution originals, these five get visibly better.**

**Team photo: it is three people, and the old crop amputated the man on the left.** The group spans more
width than any 9:16 crop can hold, so it is now letterboxed on black at 1.25x — everyone in frame, and
black is on-register per `brand-tokens`. Note `raw/staff/04.jpg` is NOT the team photo (it is a
watermarked screenshot); the real source is `raw/staff-named/04-team-photo.jpg`. The two folders use
different numbering.

**Palmier trap, hit twice now: `trackIndex` is positional and renumbers.** Removing the eight portraits
emptied a track, Palmier auto-deleted it, every index shifted, and the replacement clips landed on the
scrim track — destroying the scrim and flinging one note onto a new track. Repaired via `move_clips`
with `toTrack`, and the scrim was rebuilt on a fresh layer ordered between text and pictures.
**Always resolve a trackId to its current index immediately before calling `add_clips`.**

**Music:** `BED-redlights-38s.m4a`, from Jake's Drive folder (Redlights, Jonny Houlihan — the track he
added the same day he asked). Energy is flat across the whole record (-14.4 to -16.0 dB mean per 20s
window), so the bed starts at 0:00 with a 0.4s fade in and a 2.5s fade out under the outro, normalised
to -14 LUFS / -1.5 TP. The folder also holds "Wildflower" (same artist, easy swap) and a **John Cougar
"Hurts So Good" instrumental — that is a Mellencamp cover and carries real copyright risk on Instagram,
so it was not used.**

`curl` cannot fetch these: the folder is private and Drive returns the virus-scan interstitial. Use the
Drive-scoped token at `~/Personal Jarvis/google_token.json` with an `AuthorizedSession`.

## DELIVERED 2026-07-28
`current-projects-team-2026-07-27/current-projects-team-rev6-2026-07-28.mp4` — 41MB, gitignored.
1080x1920 · 30fps · H.264 High · yuv420p · AAC 48kHz stereo · 38.77s · **-14.3 LUFS** (Instagram spec).

Two pre-flight checks worth repeating on every future export:
1. **Confirm the notes track is `hidden: true` before rendering.** It carries Jake's private working
   notes and this file goes to the client. Verified hidden on this render.
2. **Palmier writes `moov` at the END of the file**, so exports are not progressive-download. Remux with
   `ffmpeg -c copy -movflags +faststart` (lossless) or the file will not preview until fully downloaded.

QC'd by sampling frames from the finished mp4, not from the timeline: no notes burned in, both worker
shots present, all eight crew shots centred with nobody cut off, brand outro intact.

**Still open:** the GEN8 worker is clipped by the right frame edge (needs 7.5 credits, 5 available,
resets Sun 2 Aug), and five crew portraits are upscaled from 768px phone photos and would visibly
improve if Shavit supplies full-resolution originals.

## GEN 1 findings, both need Jake
1. **The model did not crane up.** It delivered a clean push in with rightward drift. A real parallax
   move that passes every gate, but an arrival move rather than an aerial. Recommendation: keep it as
   the Norwood establisher and spend the vertical ambition on GEN 5, the Howder rafters, where the
   composition already points at open sky and a true rise is far more likely to land.
2. **A house number is visible on the porch wall** in the source photograph, reading as "60". It is in
   the original Drive frame, so it is also in rev 5, which used the same plate. Under
   `no-house-numbers` the literal predicate targets digit plus street name, so a bare number is
   arguably outside it, but the threat model behind the rule is exactly findability. Cheap fix is a
   crop or a clone out on the plate before the next generation. **Not yet fixed.**

## Next action
Get Jake's call on finding 1, fix finding 2 on the plate, then run GEN 2 through GEN 6 one at a time,
each through the frame verification gate, showing him every clip before the next one is generated.

---

# rev 7 / rev 8, 2026-07-29 — Shavit's feedback + the drone pass

**Latest delivered:** `current-projects-team-2026-07-27/current-projects-team-rev8-2026-07-29.mp4`
1080x1920 · 30fps · H.264 · **1683 frames = 56.10s** · **-14.2 LUFS / -1.2 dBTP**. Also copied to
`~/Downloads/Shavit-July-2026-Summary.mp4`. A further recut to **1778 frames = 59.27s** was in
progress at session end (see *Open* below). rev6 project backed up to `rev6-project-backup.palmier`
(210MB — gitignore it).

## Where the feedback came from, and the trap in it
Shavit's notes live in **iMessage, [PRIVATE_PHONE_REMOVED], 2026-07-29 08:31–11:24**, not in any file. Two of his
labels are actively misleading:

| He sent | He said | What it actually is |
|---|---|---|
| `IMG_4273.heic` 09:43 | "33 Barry finished picture" | 33 Barry, finished room. Correct. |
| 2 jpegs 09:45 | nothing, then "E Ewing, South Bend" at 09:47 | **115 Oak.** MD5-identical to `drive/oak-new/001` and `/003`. NOT Ewing. |
| `IMG_5251.MOV` 09:47 | "E Ewing, South Bend" | 1902 E Ewing. The caption labels the **video only**. |

**Lesson: MD5 every client-sent asset against the Drive folders.** Reading that caption as covering all
four attachments would have shipped two Oak interiors as an Indiana property.

Blank message bodies in `chat.db` live in **`attributedBody`, not `text`** — decode the blob or you
miss Shavit's most important message (the people order, 11:24, where `text` is NULL).

## Decisions Jake made
1. **Opening = title card only.** "JULY 2026 IN SUMMARY" replaces the rev6 hook outright. Shavit's
   texted alternative "Ever wonder what is in the works" is **deliberately unused** — the title card
   came from their phone call and supersedes the text.
2. **Crew photo kept as a closer**, after Jonah and Tito, carrying the sign-off, no name card.
3. **Eight properties are mandatory:** 33 Barry, 115 Oak, 43 Howder, 15 E Saint Joe, 60 S Norwood,
   1114 Cedar, 1902 E Ewing, 11 Ludlam. rev6 had three.
4. **Saint Joe's "before" frame cut**, and BEFORE/AFTER wording dropped from the tag.
5. **Saint Joe 6s, Ludlam 5s, Cedar 5s** as generated aerials. Ludlam reversed: "Ludham reverse is
   perfect."
6. **Final order:** Norwood → Howder → Barry → Oak → **Saint Joe → Ludlam → Cedar** → Ewing → team.
   Three aerials back to back with alternating direction (climb / descend / climb-and-arc-left) so it
   reads as rhythm, not repetition.

## The drone work — the one lesson that matters
**It is duration, not wording.** The first Saint Joe attempt was 5s at 16:9 and missed badly: the model
compressed a 13-metre climb and a 52-degree swing into a **tilt**. That is the identical failure to
GEN1 in rev6, which delivered an arrival move instead of the crane it was asked for. No amount of
prompt tightening fixed it. **Generating at 10s and cutting the window you want** fixed it completely
on the first try, for all three houses.

Second constraint: **image-to-video starts FROM the photograph.** A blocked START pose that is 30m up
and 54° around does not exist as a frame. Either generate forward from the photo, or generate the
inverse and reverse the clip. Ludlam is the reversed one.

Third: `kling3_0` **pro, 10s, sound off, 9:16 costs 17.5 credits**; 5s costs 8.75; outpaint costs 2.
Cost preflight with `get_cost: true` is free — always use it.

## Cedar: refused twice, then built honestly
Outpainting Cedar to full-frame 9:16 **fabricated property on both attempts** — attempt one invented a
detached garage, a driveway, a sidewalk and a hillside; attempt two invented an **attached wing with
its own roof** plus a driveway, and shrank the real house to make room. That is invented square
footage on a managed asset. **Generation credits were refused on that plate.**

Jake reaffirmed he wanted the shot, so the plate was rebuilt **from Cedar's own pixels**: real photo
anchored at the bottom of the 9:16 frame, sky above extrapolated as a gradient from two real sky rows.
No model touches it, so nothing can be invented. **This is the pattern to reuse for any landscape
exterior that must fill a vertical frame.**

Two defects in the *first* procedural version, both caught on inspection: the stretched sky band
included the roof peak and smeared it into a black spike, and the lawn stretch duplicated the walkway
into a hard stripe with a visible seam. **Anchor the subject at the frame edge and extend only sky.**

By contrast, **vertical** outpainting of Saint Joe was clean — sky above, lawn below, house untouched.
The direction matters: sideways expansion invents buildings, upward rarely does.

## Palmier MCP without the MCP client
The server did not register (app closed at session start). **It speaks plain JSON-RPC over HTTP at
`127.0.0.1:19789/mcp` and is driven by `_scripts/pmcp.py`** — no session restart needed. Launch
`PalmierPro.app` first; a bare GET returning 405 means it is alive. Responses are SSE and one event's
payload can span several `data:` lines that must be rejoined before parsing.

Schema gotchas, one round trip each: `add_texts` style takes **`bold`**, not `isBold`; shadow offset is
**`offset: {x, y}`**, not `offsetY`. Neither matches the on-disk project JSON.

## Three defects only the rendered pixels revealed
1. **`RIANA BEARDSLEY` rendered as `RIANA`, `DARRIN HANNIBAL` as `DARRIN`, sign-off as `BLESSED TO`.**
   A uniform `width: 0.8 / height: 0.115` text box wrapped the long strings and hard-clipped the
   overflow. **Fix: pass `transform` centre only and let Palmier auto-fit.** rev6 used per-string
   widths; copying one of them onto all nine strings is what broke it.
2. **The music bed exported at -30.9 LUFS, ~17dB down, silent after 20s.** The audio track had been
   **muted** — most likely a stray click in Palmier during note review. Nothing in the timeline JSON
   flagged it.
3. Both classes are invisible in the JSON, which reported healthy clips throughout. **Always measure
   loudness and capture frames.** The export flow now asserts notes-hidden AND bed-unmuted before it
   will render.

## Track-emptying trap, avoided by construction
Removing every clip from a track makes Palmier delete the track and renumber every `trackIndex`.
`build_rev7.py` parks one clip at frame 9000, clears the rest, adds the new clips, then removes the
parked clip — the track is never empty. Track ids held stable across eight rebuilds.

## Credits
Topped up mid-session (18 credits per dollar on the auto-refill screen; the one-time packs start at
500 for $26 — **there is no $10 or $200 pack**, which is worth knowing before quoting Jake a price).
Spend: 8.75 on the missed 5s attempt, 17.5 × 3 on the three 10s aerials, 6 on outpaint tests.
**~37.75 remaining**, plus 1200 free on **Sun 2 Aug 11:35 PM PDT**.

## Tools built this session
- `_scripts/pmcp.py` — MCP-over-HTTP bridge to PalmierPro.
- `_scripts/prep_0729.py` — conforms Shavit's four iMessage assets. HEIC needs `sips` (Pillow has no
  decoder here); the Ewing MOV carries `rotation=-90` so it is natively vertical.
- `_scripts/prep_props_0729.py` — conforms Saint Joe / Cedar / Ludlam.
- `_scripts/build_rev7.py` — rebuilds the whole timeline from a declarative EDL. Re-runnable.
- `_scripts/add_notes_rev7.py` — lays one review note per shot on the hidden notes track, with frame
  spans derived from `build_rev7.PICTURE_EDL` so notes cannot drift out of sync. **Refuses to run if
  the notes track is not hidden.**
- **`dronepath/index3d.html`** — three.js drone-blocking tool. Jake positions and aims a camera in 3D
  against a massing proxy with the real photo on the front elevation, drags the drone directly
  (Shift-drag to aim), previews the move, and copies a JSON spec. It also **prices the move live**:
  camera translation means generation credits, lens-only means a free Palmier keyframe. Needs the
  local server — ES modules will not load over `file://`:
  `cd docs/reel-specs/dronepath && python3 -m http.server 8791`
- `dronepath/flat.html` — the earlier 2D crop-path version.
- `dronepath/review.html` — side-by-side clip review page.

## Open
- **The 59.27s recut was mid-flight at session end.** `build_rev7.py` is already reordered and points
  at `CEDAR-drone-5s.mp4` and `BED-redlights-59s.m4a`. Cedar's 10s generation (job
  `32be07e2-727a-457b-9433-23b6460acce9`) needed cutting to 5s, then: run `build_rev7.py`, run
  `add_notes_rev7.py`, export, remux `+faststart`, verify loudness and frames.
- **Runtime is now ~59s**, up from 38.8s at rev6. Flagged to Jake more than once; his call.
- **GEN8's worker is still clipped by the right frame edge** — open since rev6, needs 7.5–8.75
  credits, and the credits now exist.
- **11 Ludlam still has only one usable photo.** Worth asking Shavit for a front elevation.
- **115 Oak has a second conformed interior** held back because Shavit wrote "photo" singular.
- **Five crew portraits are upscaled from 768px phone photos** and would visibly improve with
  full-resolution originals.
- **The Saint Joe interiors are unused** — finished kitchen with the blue range, baths, staircase, in
  `drive/saintjoe`. Best-photographed assets in the whole library. That is its own reel.

---

# rev10 — Oak grid, re-argued order, a real transition vocabulary (2026-07-29, later)

Delivered: `current-projects-team-2026-07-27/current-projects-team-rev10-2026-07-29.mp4`, also copied
to `~/Downloads/Shavit-July-2026-Summary.mp4`. **1080x1920, 30fps, 1749 frames, 58.30s, −14.0 LUFS /
−1.3 dBTP.** Zero Higgsfield credits spent this pass.

Review page: `current-projects-team-2026-07-27/review-rev10/index.html` — rev10, the Oak grid alone,
rev9 for A/B, both order and transition tables, and the rendered transition strips.

## 1. The Oak grid

Jake: *"for oak can you make like an animation of a grid of all the photos they fly in then out
theres four of them so be smart about it."*

`_scripts/oak_grid.py` renders all four `drive/oak-new` photos as one 90-frame 1080x1920 clip.
Pre-rendered rather than built with Palmier's `apply_layout`, which only places a **static** grid —
per-tile easing, stagger, gutters and shadows are cheap in PIL and awkward as four tracks of
hand-baked keyframes.

- All four sources are 3:4 and the cells are 3:4, so **nothing is cropped**.
- Tiles converge from their own outward diagonal, staggered 5f, ease-out-quint with a 0.86→1.00
  settle; hold with a 1.015 group creep; exit staggered 3f, ease-in-cubic, group pushing to 1.075 so
  it reads as the camera going through the grid rather than a slideshow running backwards.

**Two defects caught only in rendered pixels, both worth remembering:**

1. **Inset grids leave dead space this film cannot afford.** The first cut inset the grid on all four
   sides, which left an empty band under the address tag that no other shot has. Running the cells
   edge to edge put the tag over the bottom row exactly where it sits on every other property *and*
   bought 51% more tile area.
2. **The tag lands on white cabinets.** Every other shot in the film happens to be dark where the tag
   sits, so the tag never needed help. The kitchen tile is not, and the type was white on white. Fixed
   with a bottom scrim in the render — a thing the timeline could not have told me.

Photo 003 was a low-contrast copy-of-a-copy and read as a fault in the grid. Contrast is stretched
only on tiles whose 1st–99th percentile range is under 200, so the other three are untouched.

## 2. Order — Ewing up, aerials rebuilt

rev9: Oak → **SaintJoe → Ludlam → Cedar** → Ewing → team.
rev10: Oak → **Ewing** → **Cedar → Ludlam → SaintJoe** → team.

- **Ewing moved up.** It is the only live-action motion in the film, so between the interior stills
  and the generated aerials it is a texture break. Behind them it was a 2.5s handheld clip undercutting
  the biggest shot in the film.
- **Cedar and Ludlam both descend.** Chained through a dissolve they read as one continuous descent
  over two houses instead of two announcements — and the dissolve buries Cedar's weak wide end.
- **Saint Joe climbs** and ends on the widest, highest frame in the film. That is what should hand
  into "THESE ARE THE PEOPLE": pull back to the big picture, then show who did it.

**This reverses Jake's own earlier instruction** ("have E st joe before ludlam and then lead to
cedar"). Built as an argument because he asked for a suggestion and a cut is easier to judge than a
paragraph. Reverting is a three-row swap in `PICTURE_EDL` plus setting Cedar's transition to `flash`.

## 3. Transitions — five kinds instead of nine identical flashes

Jake: *"change up some of the transitions they don't all need to be white flashes of cuts between
each."*

| kind | what it is | where |
|---|---|---|
| `cut` | hard cut | inside Norwood ×2, inside Howder ×2 — same house, continuous move; the old white dips were interrupting a dolly and a crane |
| `flash` | 5f hard white slam, a real clip on the picture track | the open, into Barry, into Indiana, where the aerials reverse |
| `bloom` | 12f white overlay, faded up and down across the cut | Norwood→Howder, Ewing→Cedar |
| `dissolve:N` | true cross-dissolve | Barry studs→finished (14f), Cedar→Ludlam (20f) |
| `black:N` | dip to black | Saint Joe→team card (24f) |

**How the cross-dissolve is built,** since Palmier exposes no transition tool: the outgoing clip's
picture-track length is shortened by N, and its last N frames are placed on a dedicated track as a
`fadeOutFrames: N` tail riding over the incoming clip's head. The overlap therefore costs N frames of
real runtime, which is what a dissolve should do.

That track must sit **between the text and picture tracks**. In this project **lower index renders on
top** (text at 4 sits over picture at 6), so a tail on the flash track would veil the address tag for
the whole dissolve. `ensure_dissolve_track()` creates it once, records the id in
`_scripts/.rev8-dissolve-track`, and re-seats it on every run.

## Gotchas found this pass

- **`add_clips` rejects `endFrame` and `source` together.** Dissolve tails carry `source` only; their
  length comes from the source span.
- **A video clip carrying an audio stream drags a LINKED audio sibling onto a new, unmuted audio
  track.** The Barry dissolve tail did exactly this. `build_rev8.py` now mutes every audio track that
  is not the bed, and unmutes the bed.
- **The music bed track was found muted for the second time this session.** Cause still unknown —
  most likely a stray click during review. The build now fixes it and says so out loud.
- Notes inflate `totalFrames` until they are re-laid: after `build_rev8.py` the timeline reported 1778
  (stale rev7 notes) and only fell to 1749 after `add_notes_rev8.py`.

## Scripts

- `_scripts/oak_grid.py` — renders `conform-0729/OAK-grid-3s.mp4`. Standalone, no credits.
- `_scripts/build_rev8.py` — rev8+ EDL. `PICTURE_EDL` rows are now **3-tuples** `(asset, frames,
  transition)`; `layout()` returns `(pix, overlays, dissolves, marks, total)`.
- `_scripts/add_notes_rev8.py` — 24 shot notes. **Keyed by `(asset, occurrence)`, not by position**,
  because rev8 reorders the film and rev7's positional list would have silently relabelled every note
  after Oak. Each note's transition line is derived from `PICTURE_EDL`, not typed.

## Open after rev10

- **Cedar and Ludlam look alike** — two white houses, blue sky, green lawn, similar sun. The chained
  dissolve is deliberate, but for about half a second it could read as one house. Tags carry the
  difference. Undo is a 5f flash between them.
- **GEN8's clipped carpenter** — still the oldest defect in the film. 7.5 credits against ~20
  available. Best remaining spend.
- **11 Ludlam has one usable photo.** Ask Shavit for a front elevation.
- **Cedar's plate, not its prompt, is the real fix.** The flat gradient sky gave the model nothing to
  move through.
- **The Saint Joe interiors are still unused.** Their own reel.
- Runtime 58.30s, down slightly from rev9's 59.28s despite Oak gaining a second.

---

# rev11 — branded cards, Ludlam opening, full-frame Oak grid (2026-07-29, later still)

Delivered: `current-projects-team-2026-07-27/current-projects-team-rev11-2026-07-29.mp4`, copied to
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1080x1920, 30fps, 1761 frames, 58.70s, −14.0 LUFS /
−1.3 dBTP.** Zero credits. Review page: `current-projects-team-2026-07-27/review-rev11/index.html`.

Four notes from Jake, all applied.

## "I can't have blurred bars there should be no blurred bars at all"

rev10's Oak grid used 3:4 cells over a defocused backdrop plate, which left blurred bands top and
bottom. rev11 uses **four 9:16 cells tiling 1080x1920 exactly, with no backdrop at all** — black is
only ever on screen while a tile is physically in flight.

The trade is real and worth remembering: **a 2x2 of equal gutterless cells in a 9:16 frame forces
each cell to 9:16 too**, so a 3:4 source must give up 25% of its width. There is no arrangement of
four 3:4 photos that fills a 9:16 frame without either cropping or filler. Crop anchors were
therefore chosen per photo off a rendered three-way comparison at 0.0 / 0.5 / 1.0, not defaulted to
centre.

**Defect caught mid-build:** filling the canvas white to get gutters put a blank white frame on
screen for the entire entry and exit. The gutter is now a 3px white BORDER carried by each tile, so
seams are white, everything else is black, and outer borders fall off-frame.

## "the grid looks weird get some movement for each picture and but make the transitions fasts"

Every tile now runs **its own camera for the whole clip** — two push in, two pull back, pans
alternating so no two look synchronised. The pans are free resolution rather than a Ken Burns fake:
they spend the same 25% width strip the 9:16 crop discards, so no tile is upscaled past 1:1.

Entry 20f→12f staggered 5→3; exit 12f→7f staggered 3→2. Film-wide: blooms 12f→8f, dip to black
24f→16f, Barry's dissolve 14f→10f.

## "title cards need to have the shavit colors of white and black with the shavit logo"

`_scripts/make_cards.py` writes `conform-0729/CARD-brand.png`: black canvas, gold stake line, and the
SHAVIT ROOTMAN lockup **lifted pixel-for-pixel out of `assets/outro.png`** rather than re-typeset.
Inter is not installed locally — Palmier bundles its own copy, which is why on-screen type can ask
for Inter and a local renderer cannot — so re-setting it would have drifted visibly against the
outro. outro.png is RGBA with its panel at alpha 120, so it is composited over solid black first and
the panel flattens away.

Baked into a still, so the mark draws once and holds perfectly static: the standing
**no-pulsing-logo** rule from the 5/22/2026 meeting. The plain `black-card` asset is deliberately
still used for the dip-to-black overlay — **a logo must never flash inside a transition**.

## "I want ludham to be the first house then you can do the order after that"

Done, and it pays off structurally. Ludlam descends and lands on the real photograph of a finished
white house at a three-quarter angle with grass in the lower third; Norwood's establisher is the same
siding at nearly the same oblique. The two now **cross-dissolve as a genuine match cut** — a finished
house becoming one still being gutted, trailer and debris in the yard. The rough-to-finished arc
closes a loop instead of running one way.

Final order: title → **Ludlam** → Norwood ×3 → Howder ×3 → Barry ×2 → Oak ×4 → Ewing → Cedar →
Saint Joe → team → outro.

## CORRECTION to the rev10 entry above

The rev10 section claims the Cedar→Ludlam dissolve "buries Cedar's weak wide end." **That is wrong.**
Checked against rendered frames (f745 / f805 / f868 of the rev10 export): Cedar *descends*, so its
generated neighbourhood rooftops are at its **head**, not its tail. A dissolve at its tail never
covered them and could not have. What actually covers them is the bloom coming *into* Cedar.

Same check killed the planned Cedar→Saint Joe dissolve: Cedar ends on a **high oblique**, Saint Joe
opens on a **low straight-on elevation**. Dissolving those mismatches framing and camera height both,
so it is a 5f flash instead — which also marks the descend→climb reversal.

Lesson, and it is the same one as GEN1 and Saint Joe: **check the frames before asserting what a
transition does.** Two of the three editorial claims made from memory this session were wrong.

## Scripts

- `_scripts/make_cards.py` — NEW. Renders the branded title card. Standalone, no credits.
- `_scripts/oak_grid.py` — rewritten. Per-tile cameras, 9:16 tiling, white tile borders, no backdrop.
- `_scripts/build_rev8.py` — EDL, transitions, dissolve track, audio hygiene.
- `_scripts/add_notes_rev8.py` — 24 notes keyed by `(asset, occurrence)`.

## Open after rev11

- **GEN8's clipped carpenter.** Oldest defect. 7.5 credits against ~20. Best remaining spend.
- **11 Ludlam now OPENS the film** on its single usable photo, and that frame shows **gas meters** on
  the side elevation. Asking Shavit for a front elevation is now worth more than it was.
- **Cedar's plate, not its prompt, is the real fix.**
- **The Saint Joe interiors are still unused.** Their own reel.
- **The music bed track has now been found muted three times.** Cause unknown; the build auto-fixes
  it and prints a line when it does.

---

# rev13 — Oak takes the screen one at a time (2026-07-29, final pass of the day)

Delivered: `current-projects-team-2026-07-27/current-projects-team-rev13-2026-07-29.mp4`, copied to
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1080x1920, 30fps, 1776 frames, 59.20s, −14.1 LUFS /
−1.3 dBTP.** Zero credits. Review page: `current-projects-team-2026-07-27/review-rev13/index.html`.

Jake, on the grid: *"I'm not a big fan of the grid, but here's how I would like it to be. Address one
frame, and then it goes up into a corner. Then another one comes. It takes the whole screen, and then
goes to a corner, so on and so forth. But it has to look natural, has to be fast."*

## The treatment that finally worked, and why

Each photo owns the whole frame, then settles into its corner, exposing the next one already
full-screen behind it. Beats at 30fps: photo 1 full to f7, settled f19; photo 2 settled f39; photo 3
f59; photo 4 f79; quad holds to f105 (3.50s).

Two properties do all the work, and **both fall out of the geometry rather than being animated in** —
which is exactly why it reads as natural where four previous attempts did not:

1. **It is a pure uniform scale.** The frame is 9:16 and every cell is 9:16, so full-screen → corner
   is the same image getting smaller. No warp, no re-crop, no aspect snap at the end.
2. **Nothing ever enters.** The four start stacked full-screen front-to-back and each shrinks AWAY to
   expose the next. No slide-in, no fade-up, and **not one frame of empty background** — the region a
   shrinking photo vacates is always either a corner already filled or the next photo underneath.

Easing is ease-in-out cubic: at rest to at rest, no overshoot. A bounce reads as a cartoon.

Free optimisation that falls out of (2): a photo still at full screen hides everything behind it, so
only the frontmost full-screen photo plus the already-shrinking ones get drawn. One full-size resize
per frame instead of four.

## Bug that nearly shipped

The first export of this version **went black for the last 15 frames of Oak**. Palmier **caches an
imported asset's frame count**, and the clip file had been overwritten in place while growing from 90
to 105 frames — so the timeline requested frames the editor still believed did not exist. YAVG on the
exported frames caught it; the timeline looked correct throughout.

**Rule: never change a clip's length in place. New length gets a new filename and a new asset name.**
`oak_grid.py` now carries that comment at its OUT constant.

## Design history of this one clip, for the record

Five passes, each one Jake's note:
1. "a grid of all the photos they fly in then out" → tiles converging from off-frame
2. inset grid left a dead band under the address tag → cells run edge to edge
3. "I can't have blurred bars there should be no blurred bars at all" → killed the defocused backdrop
   plate; cells tile 1080x1920 exactly
4. "the grid looks weird get some movement for each picture and but make the transitions fasts" → a
   camera per photo, entry and exit halved
5. "Address one frame, and then it goes up into a corner…" → the peel-back stack above

Standing cost, unchanged and unavoidable: four equal cells in a 9:16 frame forces each cell to 9:16,
so a 3:4 photo gives up 25% of its width in a corner. **There is no arrangement of four 3:4 photos
that fills a vertical frame without cropping or filler.** The full-screen beat before each settle
shows the same crop, so the photo is always seen at full size first.

## Open after rev13

- **GEN8's clipped carpenter.** Oldest defect. 7.5 credits against ~20. Best remaining spend.
- **11 Ludlam opens the film** on its single usable photo, and that frame shows **gas meters** on the
  side elevation. Ask Shavit for a front elevation.
- **Cedar's plate, not its prompt, is the real fix.**
- **The Saint Joe interiors are still unused.** Their own reel.
- Music bed found muted three times this session; the build auto-fixes and prints a line.
- Runtime 59.20s. Bed is 59.40s, so there are **6 frames of headroom** — anything longer needs the
  bed extended or Norwood 3/3 trimmed.

---

# rev14 — Oak stack reversed (2026-07-29)

Delivered: `current-projects-team-2026-07-27/current-projects-team-rev14-2026-07-29.mp4`, copied to
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1080x1920, 30fps, 1776 frames, 59.20s, −14.1 LUFS /
−1.3 dBTP.** Zero credits. Review: `current-projects-team-2026-07-27/review-rev14/index.html`.

Jake: *"kind of but it needs to be reversed the photo is blocking the others when its fullscreen it
should block the grid when its full screen."*

## One rule, flipped

rev13 kept a parked photo ON TOP of the next full-screen one, so a corner thumbnail sat over every
full-screen beat. rev14 drops a photo to the **back** the instant it parks.

Z-order back to front is now: parked corners, then the still-stacked full-screen photos in reverse,
then the active one on top. Walking that list front-to-back and stopping at the first full-screen
photo culls everything it hides, so at most two photos are ever drawn per frame.

Three consequences:
- a full-screen photo owns the entire frame, uninterrupted
- the corners accumulate underneath, hidden
- **all four arrive at once when the last photo settles** — the grid is a reveal rather than something
  assembled in front of the viewer, and it is the best moment in the block

Beats retimed slightly tighter (GAP 8→6) to buy the finished quad a longer hold: photo 1 settled f19,
photo 2 f37, photo 3 f55, photo 4 f73, quad holds f73–105.

What did NOT change, and is still what makes it read as natural: full screen → corner is a pure
uniform scale because frame and cell are both 9:16; nothing ever enters, so there is not one frame of
empty background; easing is ease-in-out cubic, at rest to at rest, no overshoot.

## Oak clip design history — five notes, five passes

1. "a grid of all the photos they fly in then out" → tiles converging from off-frame
2. inset grid left a dead band under the address tag → cells run edge to edge
3. "I can't have blurred bars there should be no blurred bars at all" → killed the defocused backdrop
   plate; cells tile 1080x1920 exactly
4. "the grid looks weird get some movement for each picture and but make the transitions fasts" → a
   camera per photo, entry and exit halved
5. "Address one frame, and then it goes up into a corner…" → the peel-back stack
6. "it needs to be reversed… it should block the grid when its full screen" → z-order flipped

Filename versioned at every length change (`OAK-sequence-v2.mp4`, asset `OAK sequence v2`) because
**Palmier caches an imported asset's frame count** — overwriting in place while changing length makes
the timeline read past the end and render black, and the timeline looks correct while it does it.

## Open after rev14

- **Runtime headroom is nearly gone: 59.20s film against a 59.40s bed = 6 frames.** Anything longer
  needs a longer bed or a trim; Norwood 3/3 at 1.90s is the flagged candidate.
- **GEN8's clipped carpenter.** Oldest defect. 7.5 credits against ~20. Best remaining spend.
- **11 Ludlam opens the film** on its single usable photo, which shows gas meters on the side
  elevation. Ask Shavit for a front elevation.
- **Cedar's plate, not its prompt, is the real fix.**
- **The Saint Joe interiors are still unused.** Their own reel.

---

# rev15 — Oak slowed down (2026-07-29)

Delivered: `current-projects-team-2026-07-27/current-projects-team-rev15-2026-07-29.mp4`, copied to
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1080x1920, 30fps, 1774 frames, 59.13s, −14.1 LUFS /
−1.3 dBTP.** Zero credits. Review: `current-projects-team-2026-07-27/review-rev15/index.html`.

Jake: *"each photo needs to be slower no need to rush."*

## New Oak pacing

| | was | now |
|---|---|---|
| clean full-screen, per photo | 0.20s | 0.53s |
| settle into corner | 0.40s | 0.50s |
| total per photo | 0.60s | ~1.00s |
| quad reveal + hold | 0.73s | 0.90s |
| **Oak block** | **3.50s** | **4.83s** |

`OPEN_HOLD 7→16, SHRINK 12→15, GAP 6→14`. Beats: photo 1 full to f16 settled f31; photo 2 f60;
photo 3 f89; photo 4 f118; quad holds to f145.

## What paid for it, and why there was no alternative

The film was **within six frames of the end of the music bed**, so +40 frames had to come from inside
the film. The bed cannot be re-cut longer: **it is not `_pool/music/wildflower.mp3`.** Cross-correlated
the conformed bed against every 1s offset of that source over 150s — best correlation **0.04**. It is
a different track and its source is not in this repo. Worth remembering before anyone tries to extend
the runtime again.

- **GEN8 howder crew 75 → 50 frames.** Re-verified against the export: the carpenter is clipped by the
  right frame edge in EVERY frame, so there is no clean window and trimming does not fix it — but it
  cuts the defect's screen time by a third, which is the right direction until the regeneration.
- **05_A5 norwood-framing 57 → 40 frames.** The one still photograph in a block whose other two shots
  move; flagged as the first trim candidate since rev6.

Both are one-line reverts in `PICTURE_EDL`.

## Process note that cost a cycle

A multi-line string replace against `oak_grid.py` silently no-opped because one comment differed by
two words ("owns the whole screen" vs "owns the screen"). The render produced the right *length* and
the wrong *beats*, and nothing failed. **Verify a patch by reading back the constants, not by trusting
the exit code** — the script's own start-times printout is what caught it.

Palmier served the fresh decode this time even though the filename was reused within a run at the same
length, but the versioned-filename rule still stands for any length change.

## Open after rev15

- **GEN8's clipped carpenter.** 7.5 credits against ~20. Still the single best remaining spend.
- **Bed headroom: 8 frames** (59.13s film, 59.40s bed). The bed's source track is not in the repo.
- **11 Ludlam opens the film** on its single usable photo, which shows gas meters on the side
  elevation. Ask Shavit for a front elevation.
- **Cedar's plate, not its prompt, is the real fix.**
- **The Saint Joe interiors are still unused.** Their own reel.

---

# rev16 — the grid is cut (2026-07-29)

Delivered: `current-projects-team-2026-07-27/current-projects-team-rev16-2026-07-29.mp4`, copied to
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1080x1920, 30fps, 1775 frames, 59.17s, −14.1 LUFS /
−1.3 dBTP.** Zero credits. Review: `current-projects-team-2026-07-27/review-rev16/index.html`.

Jake: *"nvm cut the grid just make transtions and camera movments between the photos it just lookds
weird."*

## Oak is now four ordinary shots

`_scripts/oak_shots.py` renders four 44-frame full-screen clips, one camera move each:

| shot | move | anchor pan | why |
|---|---|---|---|
| 1 ladder room | push in 1.00→1.08 | 0.02 → 0.24 | anchored left or the left-hand window is cut |
| 2 green room | pull back 1.09→1.00 | 0.76 → 0.54 | inverse of shot 1; keeps window + flooring boxes |
| 3 arch | push in 1.00→1.07 | 0.54 → 0.30 | holds the arch, drops a folding chair |
| 4 kitchen | pull back 1.08→1.00 | 0.40 → 0.62 | cabinets, counter, sink, faucet all survive |

Joined by **three 10-frame cross-dissolves**, declared in `PICTURE_EDL` using the same machinery
Ludlam and Barry already use. Block = 4×44 − 30 = 146 frames = 4.87s.

**Dissolves, not cuts, on purpose:** four rooms of ONE house. A cut reads as four separate properties;
a dissolve reads as moving through a building. Same call as Barry's studs-into-finished-room.

**Pre-rendered, not keyframed:** these are horizontal PANS. Palmier can only push into pixels the
conformed asset already contains, and the pan spends the 25% width strip a static 9:16 crop would have
discarded — so nothing is upscaled past 1:1. A keyframe would have had to fake it with a zoom.

`add_notes_rev8.py` now carries 27 notes (four for Oak). `tag()` gained a `through=` argument so one
OAK STREET tag holds across all four clips.

## The five rejected treatments, for the record

`oak_grid.py` is superseded but kept, because it is the record of this:

1. "a grid of all the photos they fly in then out" → tiles converging from off-frame
2. inset grid left a dead band under the address tag → cells edge to edge
3. "I can't have blurred bars" → killed the backdrop plate, cells tile the frame exactly
4. "the grid looks weird get some movement for each picture" → a camera per tile
5. "Address one frame, and then it goes up into a corner" → peel-back stack
6. "it needs to be reversed… it should block the grid" → z-order flipped
7. "each photo needs to be slower" → retimed to ~1s per photo
8. **"nvm cut the grid"** → four plain shots

Lesson worth keeping: when a treatment needs this many corrective notes, the treatment is the problem,
not the parameters. The plain version was reachable at step 1.

## Trims still in place from rev15

- GEN8 howder crew 75 → 50 frames. **Keep regardless of Oak** — the carpenter is clipped in every
  frame, so less screen time is strictly better until it is regenerated.
- 05_A5 norwood-framing 57 → 40 frames. Purely bought frames; revert if the length is wanted back.

Both are one-line reverts in `PICTURE_EDL`.

## Open after rev16

- **GEN8's clipped carpenter.** 7.5 credits against ~20. Still the single best remaining spend.
- **Bed headroom: 7 frames** (59.17s film, 59.40s bed). The bed's source track is NOT in this repo —
  cross-correlated against `_pool/music/wildflower.mp3` at every offset over 150s, best score 0.04.
- **11 Ludlam opens the film** on its single usable photo, which shows gas meters on the side
  elevation. Ask Shavit for a front elevation.
- **Cedar's plate, not its prompt, is the real fix.**
- **The Saint Joe interiors are still unused.** Their own reel.

---

# rev17 — Jake's notes-track feedback + Oak quality pass (2026-07-29)

Delivered: `current-projects-team-rev17-2026-07-29.mp4` → `~/Downloads/Shavit-July-2026-Summary.mp4`.
**1080x1920, 30fps, 1847 frames, 61.57s, −14.1 LUFS / −1.0 dBTP.** Zero credits.
A/B of the Oak grade: `current-projects-team-2026-07-27/review-rev17-oak-ab.jpg`.

## THE MUSIC BED CONSTRAINT IS GONE — read this before trimming anything again

The source is **`~/Downloads/Redlights - Jonny Houlihan  música instrumental relajante.mp3`**, 216.9s.
Verified by cross-correlation against the old conformed bed: **offset 0s, correlation 0.998.**

An earlier pass concluded the source "is not in this repo" after testing only
`_pool/music/wildflower.mp3` (correlation 0.04) — true but useless, because the search never left the
repo. Two shots were trimmed on the strength of that. Both are now restored.

The bed is conformed to the film length plus a tail, with a 2.5s fade ending exactly at the last
frame: `ffmpeg -t <len> -af "afade=t=out:st=<len-2.5>:d=2.5,loudnorm=I=-14.1:TP=-1.1:LRA=2"`.

**Two Palmier caching traps hit in one pass**, both the same root cause: the editor caches an imported
asset's frame count, so re-conforming at a new length under the same filename makes `add_clips` reject
the entry ("source is only 1846") or silently render black. **A new length needs a new filename AND a
new asset name.** Cost two failed builds here; the second left a parked clip at frame 9000 and the
timeline reading 10775 frames until the rebuild cleared it.

## Jake's notes, read off the hidden track

`get_timeline` returns note text under **`textContent`**, not `content` — a first diff attempt read the
wrong key and reported all 27 notes as edited. Three real notes:

| frame | note | applied |
|---|---|---|
| f197 NORWOOD 1/3 | "this cut needs to be a little long like 0.5" | 60 → 75 frames |
| f257 NORWOOD 2/3 | "as well as here" | 60 → 75 frames |
| f492 HOWDER 3/3 | "needs to be a bit longer" | 50 → 75 frames |

Norwood 3/3 also restored 40 → 57, since it was only ever trimmed for the bed constraint.

**Flagged against the Howder note:** restoring GEN8 to 75 puts MORE of the clipped carpenter on
screen, not less. He is cut by the right frame edge in every frame of that clip. Jake's call, made
with that stated; only a regeneration fixes it.

## Oak quality pass

Jake: *"remove any shadows on the oak street photos and make sure that all photos are of the highest
quality."*

- **Shadows.** There were no synthetic drop shadows left — those died with the grid treatment. So this
  is a shadow LIFT on the real room shadows: a LUT that adds up to 34 at black and decays to zero by
  value 140, so highlights and the blown windows are untouched.
- **Full-resolution sources.** The 2100px working-height downscale is gone. 000 is 4032px tall and
  supersampling straight to 1920 is sharper than going through an intermediate.
- **No upscaling, ever.** Zoom is now clamped per photo to `source_height / 1920`. Three of the four
  sources are only 2048px and the moves peaked at 1.09, which had been quietly upscaling them ~2%.
  Clamped to 1.067; the script prints when it clamps.
- **CRF 12, preset slower** (was CRF 16).

## Open after rev17

- **GEN8's clipped carpenter.** 7.5 credits against ~20, and now 2.5s of screen time. Best spend.
- **Runtime is 61.57s**, up from 59.17s. The bed follows the film now, so length is a creative choice
  rather than a constraint — but 61.5s is long for the format.
- **11 Ludlam opens the film** on its single usable photo, showing gas meters on the side elevation.
- **Cedar's plate, not its prompt, is the real fix.**
- **The Saint Joe interiors are still unused.**

---

# rev18–rev20 — notes-track round 2 (2026-07-29)

Delivered: `current-projects-team-rev20-2026-07-29.mp4` → `~/Downloads/Shavit-July-2026-Summary.mp4`.
**1080x1920, 30fps, 1885 frames, 62.83s, −14.1 LUFS / −1.0 dBTP.** 4 credits spent, 33.75 left.

Notes read off hidden track 59DF6CEC (field is `textContent`, not `content`):

| note | applied |
|---|---|
| NORWOOD 2/3 "this needs to be longer and the transtion needs to be smoother" | 75 → 95f, hard cut out becomes a 12f cross-dissolve |
| NORWOOD 3/3 "same shit here" → then "can you have it stick for like 1 more second" | **re-rendered to 3.00s**, OUT bloom 8f → 16f |
| CEDAR "get the camera tigther… put it in a spec" | spec written, awaiting approval |
| CREW "No black bars… should be expanded use higgs if need be" | full frame, Higgsfield outpaint |

## Norwood 3/3 could not be extended by EDL — it needed a re-render

Its source clip was **exactly 2.0s**, so 60 frames was a hard ceiling no EDL change could beat.
Re-rendered from `raw/norwood/02.jpg`, the **5712x4284** original (24MP), at 90 frames. anchorX 0.62 was
solved by matching candidate crops against a frame of the old clip so the framing did not jump.
No-upscale ceiling is 2.23; the 1.07 push-in is nowhere near it.

Also found: **N1 was set to 75 frames against a 2.4s source** and had been freezing on its last frame
for 3 frames. Palmier does not error on this. Capped at 72.

## Crew closer — why generation was unavoidable

Source is 1024x768 landscape. A 9:16 crop keeps **42% of the width and amputates two of the three
men** (verified at anchors 0.0 / 0.5 / 1.0). A zero-credit mirrored-lawn extension was built first and
**banded visibly**. So the frame had to be generated.

- 2 credits: an outpaint call that **silently just upscaled** (1856x2304, +0.2% height) — useful, not
  what was asked for.
- 2 credits: outpaint to 9:16 → 1536x2752. The model put **all 848 new rows ABOVE** the real content
  and **none below**, which is the opposite of what was needed.

Shipped frame is the widest 9:16 window that still holds all three men, **bottom-aligned to the real
content** so every invented row sits above: 1250x2222 at y529–2751 → 1080x1920. **Invented content is
the top 14%, sky and tree canopy only.** Wider windows were rejected because they pulled in a
completed roofline and a neighbouring structure that exist in no photograph of this property.

## The black bar was the SCRIM, not the photo

First export still showed a hard black band across the bottom 22%. The asset was clean. The cause was
`T_SCRIM`, the bottom-weighted darkener that makes the white name cards readable — it ran to the outro.
That was harmless while the crew photo was letterboxed (black bars there anyway) but reads as exactly
the bar Jake rejected over a full-frame photo. **`scrim_end` now stops at the crew closer**; the
sign-off carries its own text shadow and reads fine over the lawn. Verified: zero rows below luma 12.

## Bed

Re-conformed twice more (v3 → v4, 63.6s) as the film grew. Source is
`~/Downloads/Redlights - Jonny Houlihan  música instrumental relajante.mp3`. **Every length change
needs a new filename AND asset name** — Palmier caches frame counts and `add_clips` rejects the entry.

## Open

- **Cedar spec awaiting approval** — `docs/reel-specs/cedar-drone-spec-2026-07-29.html`, annotatable,
  served by `python3 serve.py 8765`. Needs a plate (A/B/C), a move (1/2/3), and a yes on 17.5 credits.
  The unlock: a tight front-only 9:16 crop uses the full source height and invents nothing.
- **Ask Shavit for a vertical crew photo.** Worth more than the outpaint.
- **GEN8's clipped carpenter** — restored to 2.5s on Jake's instruction, so there is now MORE of the
  defect on screen. 7.5 credits fixes it.
- **Runtime 62.83s** and climbing. Long for the format.

---

# rev21 — city labels under every address (2026-07-29, evening)

Delivered: `current-projects-team-rev21-2026-07-29.mp4` → `FINAL-Shavit-July-2026-Summary.mp4` and
`~/Downloads/Shavit-July-2026-Summary.mp4`. Same length as rev20: **1885 frames, 62.83s**, audio
untouched (max −1.0 dBTP verified on the export).

Shavit's note, iMessage 7/29 19:34, sent 8 minutes after Jake shared rev20: *"A few more tweaks! We
have to say Hillsdale below all the hillsdale addresses. South Bend under all south bend properties."*

Applied via `update_text` on the live timeline — no media imports, no length change, so the
frame-count caching trap cannot fire. `build_rev8.py` tag() lines updated to match, so a from-scratch
rebuild reproduces rev21.

| tag | city line | source of truth |
|---|---|---|
| LUDLAM / NORWOOD / HOWDER / BARRY / OAK / SAINT JOE | HILLSDALE | website `properties.js`, each grounded in Shavit's own texts (Hillsdale MI 49242) |
| E EWING | SOUTH BEND | already present since rev8 |
| CEDAR | **NILES** | Shavit 7/14 text: "1114 Cedar, Niles, MI" — it is neither a Hillsdale nor a South Bend address |

**Cedar is the one judgment call.** His note only names Hillsdale and South Bend; Cedar is factually
Niles, MI (he groups it under his Indiana operation, but the printed address on the website stays
Niles for the same reason). If Shavit wants it to read SOUTH BEND anyway, it is one `update_text`
call on clip `31ED73B8` and a re-export.

All 8 tags verified on the export by frame sampling (2s interval, both contact sheets) — two-line
rendering clean, no clipping, people section untouched.

---

# rev22–rev23 — gold city labels + two dissolve notes (2026-07-29, late evening)

Delivered: `current-projects-team-rev23-2026-07-29.mp4` → `FINAL-Shavit-July-2026-Summary.mp4` and
`~/Downloads/Shavit-July-2026-Summary.mp4`. Still **1885 frames / 62.83s**, bed untouched (−1.0 dBTP).

## rev22 — Jake: "small bottom right and gold instead"

City lines came OUT of the address tags (including E EWING's SOUTH BEND, which predated tonight —
one consistent treatment) and became their own clips: Inter 36 bold uppercase, tracking 2,
right-aligned, **#FFC000** (sampled off the outro's ROOTMAN, per make_cards.py — not guessed),
right edge at 0.95 / bottom ~0.93. They live on a NEW top track **BC4010CB**, one label per
property, spanning exactly its address tag's frames. Track id persisted to
`_scripts/.rev8-city-track`; `build_rev8.py` now has `CITY_STYLE`/`CITY_XF`, a `city()` helper,
`ensure_city_track()` (same sidecar pattern as the dissolve track — its id is added to `known`
BEFORE `ensure_dissolve_track` runs, which otherwise dies on "expected exactly one new track"),
and a `(t_city, cities, "texts")` plan entry, so a rebuild reproduces this.

## rev23 — notes-track round 3

Two new notes, read off 59DF6CEC (textContent, as always). Jake overwrote the baseline annotation
text of the clips he was flagging, so NORWOOD 1/3's and HOWDER 1/3's shot documentation is gone
from the track (it survives in add_notes_rev8.py):

| note (on clip) | applied |
|---|---|
| NORWOOD 1/3 "there needs to be a better transition between this scen and the next" | 12f frozen-tail cross-dissolve at f269 |
| HOWDER 1/3 "same issue here" | 12f frozen-tail cross-dissolve at f517 |

**Frozen-tail, not source-tail, on both.** N1's source is exhausted at its cut (72f cap on a 2.4s
source — no tail exists). Rather than mix mechanisms, both cuts use `capture_frame` of the last
outgoing frame (assets `norwood1-tail` C6910FF5, `howder1-tail` 7DEA669D), placed on dissolve
track 77C2581F at [269,281] / [517,529], fadeOut 12 smooth. Side effect worth keeping: the
capture bakes in the address tag + gold city label, so the titles dissolve out WITH the shot
instead of hard-vanishing at the cut — verified on export at f266/273/279/284 and f514/521/527/532.

**These two dissolves are manual patches** — they are NOT in build_rev8.py's layout(). A from-scratch
rebuild loses them and they must be re-applied (capture_frame → add_clips on the dissolve track →
fadeOut 12), or layout() taught about them first.

---

# rev24 — website cross-check caught two wrong street types (2026-07-29, night)

Delivered: `current-projects-team-rev24-2026-07-29.mp4` → `FINAL-Shavit-July-2026-Summary.mp4` and
`~/Downloads/Shavit-July-2026-Summary.mp4`. Still 1885 frames / 62.83s, −1.0 dBTP.

Jake asked for a check against the website before sending. **Two of the eight addresses were wrong on
screen, and had been since rev8:**

| film said | correct | evidence |
|---|---|---|
| SOUTH NORWOOD **STREET** | SOUTH NORWOOD **AVENUE** | `properties.js` name `60 S Norwood Ave`; Jake's 7/16 email listed it as Ave and Shavit's inline reply gave its sqft/status without correcting the street type |
| E EWING **STREET** | E EWING **AVENUE** | `properties.js` name `1902 East Ewing Ave`; same 7/16 email thread, plus Shavit's 7/17 text quoted in properties.js: "1902 Ewing Ave, South Bend - 4 bedroom 2 bath" |

The 7/16 thread is the strong evidence: Jake's mail listed both as "Ave" in four separate sections and
Shavit replied address-by-address supplying square footage, bed/bath and lease status for each without
touching either street type. He accepted both forms.

Both replacements are the **same character count** as what they replaced, so the two-line tag layout
could not reflow — confirmed on export.

## The frozen-tail trap this exposed

rev23's dissolve tails are `capture_frame` stills, so **they bake in the title text that was on screen
when captured.** Fixing Norwood's tag would have left the f269 dissolve melting into a stale "SOUTH
NORWOOD STREET". The tail was removed, re-captured from frame 268 after the text fix
(`norwood1-tail-ave`, 07589738), re-placed at [269,281] with the same 12f smooth fadeOut. Howder's
tail needed nothing — Howder St is correct. **Any future title edit on a shot that owns a frozen tail
must re-capture that tail.**

## Everything else checked clean

Ludlam St, Howder St, Barry St, Oak St, Cedar St, 15 E Saint Joe St all match `properties.js`. Cities
match every `locale` (Cedar = Niles, as decided in rev22). Crew name spellings match Shavit's 7/27
text exactly; the website has no team section, so his texts are the only source. The film makes no
availability or status claims, so nothing can conflict with the lease-signed / coming-soon states on
the site. Outro's "BUILT IN MICHIGAN, OHIO & INDIANA" holds — Ohio is out of stock for rentals but
Buckingham is the Ohio deal case study.

---

# rev25 — antennas removed (2026-07-29, night)

Delivered: `current-projects-team-rev25-2026-07-29.mp4` → `FINAL-Shavit-July-2026-Summary.mp4` and
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1885 frames / 62.83s, −1.0 dBTP** — unchanged.
**17.5 + ~2 credits spent. Balance 14.25.**

Shavit 7/29: *"Okay! Can you remove all the antennas from the properties? I am pretty sure we did
it."* Jake authorised the credit spend.

## Survey first: only ONE antenna exists in the film

Checked every exterior at full resolution before touching anything. **Saint Joe was the only shot
with an antenna** — a satellite dish on the porch roof, left of the second-storey window, visible
from frame 0. Ludlam, Norwood, Cedar and Ewing are all clean (Ewing's wall box is a cable junction,
not an antenna); Howder, Barry and Oak are interiors. Do not re-hunt these.

## Why the moving shot could not be patched in post

Three free approaches were tried and all looked WORSE than the dish:

- **cv2.inpaint** against tree canopy gives an obvious radial smear (`inpaint_test.jpg`).
- **Template tracking** drifted: re-seeding the template each frame let scale compound until the box
  was 4x too big by frame 179 — while still scoring 0.96, because a bigger box on foliage still
  matches foliage. High match score is not a valid track check; verify the box size.
- **Homography to frame 0** collapsed from 6000 inliers to single digits by frame 150. The clip is
  Kling-generated, so it *invents* content as the camera climbs — there is nothing stable to register
  against. This kills any track-and-patch plan on generated footage.

So the shot had to be regenerated from a dish-free plate.

## The plate: AI as a donor, not as the output

`generate_image` (nano_banana_2) removed the dish cleanly but **re-rendered 42% of the frame**,
changing the porch light fixture and reshaping both neighbouring buildings — fabricated architecture
on a real listing, the same failure as the Cedar outpaint. **The AI output was therefore used only as
a donor:** SIFT+RANSAC registers it to the real plate, and only a 116x104 canopy window over the dish
is transplanted, feathered, tone-matched off a clean ring. **0.3% of the frame changed**; every other
pixel is the photographer's. Output: `SAINTJOE-plate-916-nodish.jpg`.

Two bugs worth remembering, both of which produced a bright elliptical ghost:
- **Tone-matching against a window that contains the object** brightens the patch to match the bright
  dish. Measure tone from a clean ring outside the patch.
- **Feathering into the object** leaves its rim half-covered. The patch must be bigger than the object
  on all sides so the whole ramp lands on clean background. First attempt also stopped at y724 while
  the dish rim runs to ~730, leaving a bright crescent.

## The regeneration confirmed the duration lesson, in a new way

Kling 3.0 pro, 10s, 9:16, `mode: pro`, `sound: off`, 17.5 credits — same recipe as the original.
The first 6 seconds were nearly **static**: the model front-loads almost no movement. Rather than
re-roll (and there were not enough credits to), **the window was moved instead of the prompt** —
`-ss 4.04 -t 6`, the LAST six seconds, where the full 13m climb and the swing to a high three-quarter
actually happen. It now opens near the elevation, climbs, and ends on the roof-street-rooftops reveal
that hands into "THESE ARE THE PEOPLE" — the shot's original job. Extends the standing lesson:
generate at 10s and **cut the window**, and do not assume the window is at the head.

Swapped in as a new file AND new asset name (`SAINTJOE drone 6s nodish` / B2527760) on the identical
span f1163–1343, per the frame-count caching trap. `build_rev8.py` updated at all five references.

---

# rev26 — Shavit's "then, DONE" pass + gold word treatment (2026-07-29, 22:48)

Delivered: `current-projects-team-rev26-2026-07-29.mp4` → `FINAL-Shavit-July-2026-Summary.mp4` and
`~/Downloads/Shavit-July-2026-Summary.mp4`. **1885 frames / 62.83s, −1.0 dBTP.** Zero credits.

Shavit 7/29 21:14: *"Let's get it finished. Publish Friday?"* Then 22:32: *"More spacing. / Replace
with: 'Meet the people who make it possible' / TITO MARTINEZ & JONAH DAVEY / Then, DONE!"*

| note | applied |
|---|---|
| "Replace with: Meet the people who make it possible" | team card recopied, 3 explicit lines: MEET THE PEOPLE / WHO MAKE IT / POSSIBLE |
| "More spacing" | team card `lineSpacing` −8 → **+14**. Point size stays 76 — raising it is what silently ate POSSIBLE in rev6 |
| "TITO MARTINEZ & JONAH DAVEY" | name card was "Tito and Jonah"; auto-wraps to two lines and reads clean, no clipping |

## Every-other-word gold — why it is a baked PNG, not text clips

Jake: *"maybe put every other word in yellow or gold."*

**Palmier applies one colour per text clip.** The obvious approach — one clip per word — fails by
construction: all seven words share frames 1343–1433, a track cannot hold overlapping clips, and only
the last word survived (`POSSIBLE` alone on a new track). Seven simultaneous words would need seven
tracks.

So the headline is baked to `conform-0729/CARD-meet-gold.png` (1080x1920 RGBA) and placed as one still
on its own top track (B7EA9FE8) — the same pattern `make_cards.py` already uses for the brand lockup.
Rendered with **Palmier's own Inter binary**
(`/Applications/PalmierPro.app/Contents/Resources/Fonts/Inter/Inter[opsz,wght].ttf`, opsz 14 / wght
700) at the card's real 76pt and −1 tracking, so weight and metrics match every other card. PIL needs
`libraqm` for the `features=` argument and does not have it here — drop the arg, it is not needed.

**Gold lands on the meaning-carrying words** (MEET, PEOPLE, MAKE, POSSIBLE), white on the connectives
(THE, WHO, IT). Alternating strictly from the first word would gold the connectives instead and reads
as random. The gold is #FFC000, the same value sampled off the outro ROOTMAN, so the card and the
lockup beneath it agree.

The original single-clip card `ACF1C0AD` is **blanked, not deleted** — one `update_text` restores the
all-white version if the look is rejected.

**Not yet applied to the opening "JULY 2026 IN SUMMARY" card.** Doing both would make the motif
deliberate rather than a one-off; it is the same bake-and-place recipe if Jake wants it.

## Open (carried)

- Cedar drone spec still awaiting Shavit's plate/move approval + 17.5 credits — **balance is now
  14.25, so Cedar no longer fits.** Needs a top-up before it can run.
- **Ask Shavit whether the dish is physically gone.** He said "I am pretty sure," not that it is. If
  it is still on the house, this retouch misrepresents the property; if it is gone, a current photo
  from him beats any retouch and would also fix the plate's slightly soft patch for free.
- GEN8's clipped carpenter (7.5 credits).
- Vertical crew photo ask.
- Jake's overwritten baseline notes on NORWOOD 1/3 / HOWDER 1/3 could be restored from
  add_notes_rev8.py definitions now that both are resolved.
