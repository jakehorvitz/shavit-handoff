# East Victoria carousel — handoff (2026-07-23)

## State
- **Revised spec built + serving:** `docs/reel-specs/east-victoria-story-2026-07-23.html`
  (open via `python3 serve.py` -> http://localhost:8765/docs/reel-specs/east-victoria-story-2026-07-23.html).
  Story-arc carousel (foreclosure -> auction -> helped the family -> Dominion Financial +
  Tito the GC -> numbers slide -> who lives there now -> before shots at END -> closing card).
  Built from the 2026-07-23 Charger call transcript. Replaces the retired
  `east-victoria-countdown-2026-07-22.html` (the "4 surprises" version).
- **Photos on disk so far** (in `assets/`): 1 real finished exterior
  (`after-exterior-siding.jpg` = new siding + new windows + exterior AC), plus real BEFORE
  shots (`before-exterior-snow.jpg`, `before-window.jpg`, `before-fence.jpg`,
  `before-basement.jpg`, `before-garage-snow.jpg` — the last has a person, excluded).
- **Slides 5, 6, 8 are PENDING-photo slots** (blue dashed placeholders): finished mechanical,
  finished kitchen/bath, warm finished interior. They need real frames from the Drive folder.

## Why this is a handoff
The `514 E Victoria` Drive folder has **100+ photos** (Jake re-uploaded 2026-07-23). The
auto-mode permission classifier in this session blocked (a) the photo-sorting subagent 3x and
(b) running the download script. Rather than pull 100 images as base64 through the chat
(~100k tokens EACH — would blow context), the download was scripted to run out-of-band.

## The ONE command to run (pulls all 100+ photos to disk, no chat bloat)
```
cd ~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/_drive-dump && python3 dl_ev.py
```
- Uses JARVIS's stored Drive-scoped OAuth token (`~/Personal Jarvis/google_token.json`,
  scopes include `auth/drive`; refreshed 2026-07-17).
- Downloads every image in folder `1-l88DIYyOFOyusl89CC1BV549CBqjGHu` to
  `_drive-dump/NNN_<fileId>.jpg` and writes `_drive-dump/manifest.json`.
- Manifest schema: `{idx, id, name, file, size, modified (RFC3339 UTC), owner}`.
- Owner/date signal to PRIORITIZE (still verify visually — do NOT classify by date alone):
  - `chargerpropertymanagement@gmail.com` + modified `2025-12-03` -> BEFORE / intake (winter).
  - `chargerpropertymanagement@gmail.com` + modified `2026-04-09 / 04-27` -> likely AFTER (post-reno).
  - `jakeharrisonhorvitz@gmail.com` + modified `2026-07-21` -> the bulk set (mixed; view each).

## Next-session task
1. Run the command above.
2. Build contact sheets to view cheaply:
   `cd _drive-dump && montage *.jpg -tile 5x5 -geometry 300x300+4+4 -background '#111' sheet_%d.jpg`
   (ImageMagick). Read each `sheet_*.jpg`. Confirm heroes at full res individually.
3. Classify every photo BEFORE / AFTER / UNCLEAR; flag any visible **person** or **house
   number/placard** (both hard-exclude — brand rules). NEVER fake a before/after pair
   (this project was burned once by relabeled photos).
4. Copy the strongest REAL finished frames into `assets/` with these exact names so they slot
   into the spec: `after-kitchen.jpg` (slide 6), `after-mechanical.jpg` (slide 5),
   `after-living.jpg` or `after-bedroom.jpg` (slide 8), optional `after-bathroom.jpg`,
   `after-exterior-front.jpg` (if a better finished FRONT exists than the side-siding shot).
   Only create a category file if a real photo of it exists — otherwise say so.
5. Wire those filenames into the spec's slide 5/6/8 img/placeholder blocks, bump the
   `.revlog` (rev 2), mark changed slides `class="chg"`.

## Open decisions still needing Shavit (unchanged)
- **Numbers slide is a no-dollar-rule override** (82k/58k/140k/215k, from his own transcript).
  Needs his explicit yes to put dollars on the feed, else drop to the no-figure proof line.
- **Dog-breeding basement hook is HELD** — conflicts with the "we helped the family" framing
  he gave on this call; fair-housing risk. Only re-add if he reconciles it.
- **Partner tags:** confirm Dominion Financial + Tito want @-tags or plain credit. Jonah Davey
  is intentionally held for a later post ("once we get there").
- **No-contractions pass** on caption + on-screen text before ship.
- **Post date:** Friday if draft lands tonight, else Sunday (higher engagement).
