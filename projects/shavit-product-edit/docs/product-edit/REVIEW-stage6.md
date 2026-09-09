# REVIEW-stage6 — adversarial review of the reel build (Horvitz stage 6)

Lane: **review** · 2026-08-16 00:17–00:40 PT · worktree `/Users/jakehorvitz/projects/shavit-product-edit` @ `73e3f17` + uncommitted changes.
Read: SPEC-reels.html §4/§5/§9/§11 (v1.3, "signed"), `accept-edit.sh`, `reel1/reel1.html`, `reel1/capture-*.mjs`, `reel1/render-frames.mjs`, `mockup/the-turn.html`, `mockup/capture-reel2.mjs`, `mockup/capture.mjs`, `captions/*.md`, `palmier-reel-timelines.json`, plus the two exports, the two base mp4s, the bed, and the frame dirs. I also re-ran the gate's OCR sweep myself (same regexes) on both v1 exports and on the current `reel1-base.mp4`, and probed audio/streams with ffprobe/ffmpeg. Nothing edited; nothing under `site/`, `exports/` or the pipeline audit trail touched.

**Snapshot reviewed (sha1, so the ruling is pinned — files were changing under me during the review):**
`accept-edit.sh d2f5b2fe` (the version that reads `exports/CURRENT`, currently `v1`) · `reel1/reel1.html 0054b651` · `reel1/capture-casestudy.mjs fbb3e7f6` · `capture-reel1.mjs 4d14f5e9` · `capture-scroll.mjs d54b387f` · `capture-site.mjs f71c2959` · `capture-swipe.mjs cc753c00` · `mockup/the-turn.html 7e35021f` · `mockup/capture-reel2.mjs 93371a9d` · `captions/REEL-1.md 15e77b2c` · `captions/REEL-2.md 77a610b2` · `palmier-reel-timelines.json 61a83005` · exports `REEL-1-the-website-v1.mp4` (23:43, 32.6 MB) and `REEL-2-kendall-street-v1.mp4` (23:43, 40.7 MB).

---

## Verdict: **FAIL** (re-export + gate patch required; the path to PASS WITH FIXES is short)

Three things block a stage-6 pass no matter how good the cut looks:

1. **The exports under review are not the signed spec.** `exports/CURRENT` = `v1`, both mp4s are 23:43. The v1.3 sign-off amendments (fast swipes; hero beat = the *live* case-study page on the phone) were implemented in `reel1.html` at 00:14 and `the-turn.html` at 00:07, re-rendered to `reel1-base.mp4` (00:15) and `reel2-base-nonum.mp4` (00:08) — **and never re-exported**. I verified visually: the v1 Reel 1 export at 15–24 s shows the *Reel 2 mockup* full-bleed (v1.2 behaviour, `git diff HEAD -- reel1/reel1.html` shows the old `../mockup/reel2-frames-nonum` beat), not the live page on a phone. Reel 2 v1's exterior swipe is the slow pre-v1.3 wipe. Whatever `accept-edit.sh` says today, it is certifying v1.2 artifacts against a v1.3 spec.
2. **The gate will FAIL the v1.3 render for site-UI hits the spec says should WARN**, and it is blind to overlay violations for most of Reel 1. Proven by running the gate's own OCR on `reel1-base.mp4` (v1.3): `@15.0s [digit-address] "1919 KENDALL STREET SOUTH BEND, INDIANA"` and `@15.5s [$] "$151,250"` — both are the live case-study page inside the phone (site UI, spec §4 hero row: "site copy on the page is site UI → WARN"), both land at t ≥ 15 outside the hard-coded window `(t>=2 && t<15) || (t>=24 && t<29)` (`accept-edit.sh:92`) → FAIL. Conversely, any `$`/address in *our* overlay type between 2–15 s or 24–29 s is downgraded to WARN. Time-window classification cannot do this job; region/pass classification can (patch below).
3. **`accept-edit.sh` passes silently if `tesseract` (or the frame extraction) is missing** — `tesseract … 2>/dev/null` (`:82`), no `command -v` check, no minimum-frame assertion → `txt=""` → zero hits → "OCR sweep done" → exit 0. A gate that can pass with its main check disabled is not a gate.

Everything else below is P2/P3 and fixable in an hour or two. Findings ranked at the end.

---

## 1. Does `accept-edit.sh` enforce every §9 criterion? (criterion → lines → gaps → patch)

| §9 criterion | Lines | What it actually checks | Gaps (false negatives / blind spots) |
|---|---|---|---|
| Both exports exist; ffprobe 1080×1920, 30/1 fps, h264 + aac, 30–45 s | `:13-27` | `[ -s ]`, `width/height`, `r_frame_rate == "30/1"`, video codec, first audio stream codec, `duration` 30–45, size ≤ 200 MB. (`:15-16` is dead code — the `read -r … <<<` line is immediately overwritten by `:17-19`.) | No `nb_frames == 1050` / `avg_frame_rate` check → a VFR or dropped-frame export with `r_frame_rate 30/1` and 35.0 s passes (spec §9 says "no dropped frames"). Duration accepted 30–45 while the timelines are pinned at 1050 frames = 35.000 s → should be 35 ± 0.05. Audio stream duration (34.967 s here) not compared to video. |
| OCR sweep, 2 fps; overlay hits FAIL, Reel 1 device beats WARN; money/address/state/holding regexes; every hit printed with timestamp | `:76-97` | `fps=2` extraction, `tesseract --psm 11`, four regexes, ctx string, WARN if `REEL-1-*` and t in `[2,15)∪[24,29)`, else FAIL | **(a) Sampling**: 0.5 s grid; the case-study stats scroll past the phone in ~0.7 s (`capture-casestudy.mjs:15` K: 1.1 s→y120, 2.4 s→first slider) — only one sample caught `$151,250`; `$68,400`/`$215,000` were between samples. The 0.45 s swipes (`:16`) and any 0.3 s flash are invisible. **(b) Classification is by time, not by region**: overlays and screens coexist in every beat, so an overlay `$` at 6 s is WARN and a site-UI `$` at 15.5 s is FAIL. **(c) Window ≠ renderer**: site UI is on screen 0–29 s in `reel1.html` (`:43-72`): Mac hero 0–2 (hero chip "Hillsdale, MI" present but too small for OCR at Mac scale — a resolution false negative; the same chip on the phone at 2.0–4.0 s *is* caught), phone case-study page 14–24 (FAIL from 15.0 s, proven above). **(d) Address regex** `\b[0-9]{2,5} +[a-z]+ +(street|st|…)\b` needs the suffix on the same OCR line: at 13.5–14.5 s tesseract reads `1919 KENDALL … STREET.` (line-wrapped card title) → no hit, though a digit-leading address is fully legible; also misses "34 Budlong, Unit A" (no suffix) and OCR variants ("1919 RENDALD"). **(e) State-abbr** needs `Hillsdale, MI`-style pairs (`:86`); a bare `MI · OH · IN` (the site footer) or `Ml` OCR confusion passes — acceptable by design, but say so in the spec. **(f) `$` regex** needs ≥3 digits or comma groups (good against `$5` noise) but `67.4%`, `68,400` without `$`, `$68K` all pass — the unruled figures are "dollar figures", so `%`-form figures are arguably in scope. **(g) `RULE_DOLLARS=1` disables the `$` check globally** (`:84`), including for Reel 2 overlays — the ruling is about *site UI* on picture; a global flag over-relaxes. **(h) Missing tesseract → silent pass** (`:82`, no dependency check, no `n ≥ 60` assertion). **(i) Resolution**: frames OCR'd at 1080×1920; the Mac screen shows a 1600 px page in ~1000 px → 12 px card copy → ~7 px → unreadable, so Mac-beat site UI (rents at 11.5–12.5 s were caught only because the type is 22 px+) is under-detected. |
| Static signature: mark-region pixel diff over last 2.2 s < threshold; no black ending | `:31-73` | last 2.2 s at 5 fps, 270×480, **whole-frame** mean abs diff (every 5th px) `< 4.0`; last-frame luma `> 5` | **Not the mark region, and too loose for it**: 25,920 samples/frame; a 120 px mark → 30×30 at 270 → ~180 samples (0.69 %). Full gold↔black flip of the mark ≈ 149 × 0.0069 ≈ **1.0 mean diff → passes**. (A whole-title flash would be caught: ~12.) A slow 2 s pulse gives even smaller per-frame diffs. Reel 1's `.progress` bar (`reel1.html:34,42`) *does* move through the end card to 35 s (small; passes) — the spec's "holds static" intent should say whether a progress bar counts. `luma > 5` is a very low "not black" bar and could false-FAIL a legitimately dark end card with small type. **Misreporting**: `python … \|\| fail "…errored"` (`:33`) then `[ $? -eq 0 ] && ok …` (`:73`) — `$?` is `fail()`'s status (0), so a moving signature prints **both** "FAIL: static-signature check errored" and "ok: … static signature + not black" (still counts as FAIL, but the message lies). Same pattern at `:100/:116` — "ok: Palmier: both reel timelines present" prints even when the check failed. |
| Audio: non-silent audio stream present | `:28-30` | whole-file `mean_volume > -50 dB` | A bed with a silent last 10 s passes; a bed at −49 dB passes; no channel/duration check. (Current bed fades to −28.7 dB mean in its last second — fine; the check just wouldn't notice if it didn't.) |
| Palmier conformance: timelines hold base + bed spanning 1050 frames, video + audio track; SPEC 1–3 alongside; frame-by-frame deterministic, no dropped frames | `:99-116` | `set_active_timeline` + `get_timeline` via a script in **another repo** (`/Users/jakehorvitz/projects/shavit-pipeline/…/pmcp.py`, `:102`); passes iff `totalFrames==1050` and `len(tracks)>=2` | Track *types* not checked; **the base clip's source is not checked against the current base mp4** (stale-base risk — real right now); export ↔ timeline linkage not checked; SPEC 1–3 not checked; "no dropped frames" not checked (could assert `nb_frames==1050` on base and export and 1050 contiguous files in the frames dir); Palmier down → `sys.exit(2)` → FAIL, not "skipped" — so an offline re-run of the gate cannot pass. |
| Register: renderer CSS has no generated-image refs; no Higgsfield calls in the journal | `:118-120` | greps two files for `higgsfield\|generate_image\|generate_video`; greps the pipeline journal | Trivially satisfiable; doesn't verify footage provenance (I did: all 10 `mockup/img/*.jpg` are byte-identical to `site/public/case-studies/1919-kendall/img/` ✔; Reel 1 footage = live captures ✔). No source-level overlay checks (a free, deterministic complement to OCR: grep the renderers' text nodes for `\b(MI\|OH\|IN)\b`, `\b\d{2,5} [A-Z][a-z]+ (St\|Street\|Ave)`, `written off`, holding-co names). `generate_audio` is not in the grep — fine given Jake's 8/16 EDM ask, but §5 "Nothing generated" should be amended to except music. |
| Files ≤ 200 MB; captions exist, no em dashes/contractions | `:27`, `:122-127` | size; `—`; finite straight-apostrophe contraction list | Curly `’` contractions pass; `we've/I've/you've/I'd/he's/she's/who's/here's/wasn't/weren't/hasn't/haven't/couldn't/shouldn't/wouldn't` pass; en dash unchecked; captions not checked for the same banned strings as the picture ("written off", holding-co, digit-leading address). |
| (implicit) The thing being gated is the current build | — | reads `exports/CURRENT` (`:7`) | Nothing ties `exports/*` to `reel1-base.mp4` / `reel2-base-nonum.mp4` / the renderers / the footage. Today: exports 23:43 < base 00:08/00:15 < renderers 00:07/00:14 → the gate certifies stale artifacts. |

### Proposed patches (bash; NOT applied)

```bash
# P1-a: hard dependency + minimum-frame guards (top of file, after set -u)
for t in ffprobe ffmpeg tesseract python3; do command -v "$t" >/dev/null || { echo "FAIL: missing $t"; exit 2; }; done
# ...and after the OCR loop for each reel:
[ "$n" -ge 60 ] || fail "$b OCR saw only $n frames (extraction broken?)"

# P1-b: classify by PASS not by TIME. Render an overlay-only pass of reel1 (device screens blacked out) and
# OCR that with FAIL semantics; OCR the full frames only to LIST site-UI hits for Shavit (WARN).
#   reel1.html: add  if(q.get('overlay')) document.documentElement.classList.add('ov')  and CSS  .ov .screen img{visibility:hidden}
#   capture-reel1.mjs: accept OUT dir + extra query, e.g.  node capture-reel1.mjs 0 1050 reel1-frames-overlay overlay=1
# gate:
OV=docs/product-edit/reel1/reel1-frames-overlay
for img in "$OV"/*.jpg; do case "${img##*/}" in *[05].jpg|*[05]0.jpg) ;; *) continue;; esac  # ~every 15th frame ≈ 2 fps
  txt=$(tesseract "$img" - --psm 11 2>/dev/null | tr '\n' ' ')
  echo "$txt" | grep -qE '\$ ?[0-9]' && fail "REEL-1 overlay \$ in ${img##*/}"
  echo "$txt" | grep -qiE '\b[0-9]{2,5} +[a-z]+ +(street|st|ave|avenue|rd|road|dr|drive|ln|lane|ct|court)\b' && fail "REEL-1 overlay digit-address in ${img##*/}"
  echo "$txt" | grep -qE '(,|\s)(MI|OH|IN)\b[^A-Za-z]' && fail "REEL-1 overlay state-abbr in ${img##*/}"
done
# full-frame sweep of the export stays, but for REEL-1 every hit is WARN (site UI list for the ruling); REEL-2 stays FAIL.
# Also drop the site-UI window at :92 entirely.

# P1-c: source-level register check (deterministic, free) on the renderers' visible text
python3 - <<'PY' || fail "renderer text register"
import re,sys
bad=0
for f in ['docs/product-edit/reel1/reel1.html','docs/product-edit/mockup/the-turn.html']:
    s=open(f).read(); txt=re.sub(r'<style>.*?</style>|<script>.*?</script>','',s,flags=re.S); txt=re.sub(r'<[^>]+>',' ',txt)
    for pat,label in [(r'\b\d{2,5} +[A-Z][a-z]+ +(St|Street|Ave|Avenue|Rd|Road)\b','digit-address'),(r'(,|\s)(MI|OH|IN)\b','state-abbr'),(r'written off','written-off'),(r'\$ ?\d','dollar')]:
        for m in re.finditer(pat,txt): print('FAIL',f,label,txt[max(0,m.start()-30):m.end()+20].strip()); bad+=1
sys.exit(1 if bad else 0)
PY
# (the-turn.html will hit 'dollar' on its data-prefix="$" count-ups; whitelist the [data-numbers] block or run with ?nonum in mind)

# P2: sample faster where it matters, and upscale device beats before OCR
ffmpeg -hide_banner -loglevel error -y -i "$f" -vf "fps=4,scale=1620:2880:flags=lanczos" "$TMP/$b/f-%04d.png"   # 4 fps, 1.5x

# P2: static signature = mark region + tighter threshold + first-vs-last drift
ffmpeg -hide_banner -loglevel error -y -sseof -2.2 -i "$f" -vf "fps=5,crop=360:360:360:660,scale=180:180" "$TMP/$b-mark-%02d.png"   # box around the SR mark / URL block
# ...python: thr 1.0 on consecutive diffs AND |luma(first)-luma(last)| < 1.0

# P2: audio — no silence ≥1.5 s anywhere, tail not silent, stream lengths match
ffmpeg -hide_banner -i "$f" -af "silencedetect=n=-45dB:d=1.5" -f null - 2>&1 | grep -q silence_start && fail "$(basename "$f") has ≥1.5 s silence"
TAIL=$(ffmpeg -hide_banner -sseof -3 -i "$f" -af volumedetect -f null - 2>&1 | grep mean_volume | awk '{print $5}'); awk -v m="${TAIL:--99}" 'BEGIN{exit !(m > -45)}' || fail "$(basename "$f") silent tail"
AD=$(ffprobe -v error -select_streams a:0 -show_entries stream=duration -of csv=p=0 "$f"); awk -v a="$AD" -v v="$DUR" 'BEGIN{exit !(v-a < 0.2)}' || fail "audio shorter than video"

# P2: frame count + exact length
NF=$(ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 "$f"); [ "$NF" = 1050 ] || fail "$(basename "$f") has $NF frames, not 1050"

# P2: staleness — the export must be newer than its base, the base newer than renderer + footage
for pair in "$R1:docs/product-edit/reel1/reel1-base.mp4:docs/product-edit/reel1/reel1.html" "$R2:docs/product-edit/mockup/reel2-base-nonum.mp4:docs/product-edit/mockup/the-turn.html"; do
  IFS=: read -r ex base src <<<"$pair"
  [ "$ex" -nt "$base" ] || fail "$(basename "$ex") is older than $(basename "$base") — re-export"
  [ "$base" -nt "$src" ] || fail "$(basename "$base") is older than $(basename "$src") — re-render"
done
find docs/product-edit/reel1/reel1-frames -name '*.jpg' ! -newer docs/product-edit/reel1/reel1.html | grep -q . && fail "reel1-frames contains frames older than reel1.html (partial re-render)"

# P2: fix the $? misreporting (:33/:73 and :100/:116)
if python3 - "$TMP" "$base" <<'PY'; then ok "static signature"; else fail "signature moves or ends black"; fi
# (and drop the trailing `[ $? -eq 0 ] && ok …` lines)

# P3: captions — curly apostrophes + fuller list + banned strings
grep -qE "[’']" "$c" && grep -qiE "\b\w+[’'](t|s|re|ve|ll|d|m)\b" "$c" && fail "$c has a contraction"
grep -qiE "written off|CPH|DSR|Barootman|Charger Realty|Indiana Charger|Triovest" "$c" && fail "$c banned string"
```

---

## 2. Register compliance in the renderers

| Rule (§5 / §11) | reel1.html | the-turn.html (Reel 2) | Verdict |
|---|---|---|---|
| No digit-leading street address in **our** overlay type | None. Overlay strings: "A new home for the homes we manage." / "Michigan · Ohio · Indiana" / "Every home, every rent, no forms." / "Hillsdale, Michigan. Swipe the row, text to see it." / "Learn more about our numbers." / "Rebuilt." / "Kendall Street · South Bend, Indiana. Every room, before and after." / "Questions? Text us." / "805-364-4415 · a person answers." (`:47,52,57,62,67,72,75`) | "Kendall Street" (`:135`), eyebrow "Deal Case Study · Indiana" (`:134`), sub "South Bend, Indiana…" (`:137`), button "Text 805-364-4415" (`:195`) — a phone number, not an address | ✔ (the 805 number is a phone number by construction; both regexes ignore it) |
| No `$` on picture in Reel 2 (default) | n/a | Default markup **does** carry `$` count-ups (`data-prefix="$"`, `:140-141`); they are only replaced when the page is loaded with `?nonum` (`:256-259`), and `capture-reel2.mjs:5` defaults to `nonum` (any other argv → `?num=1`). Rendered/exported variant is `nonum` (`reel2-frames-nonum`, no `-num` dir exists) | ✔ by capture default; ⚠ the renderer's *default* is the unruled variant — invert it (`?num=1` opts in) so a bare load can never produce `$` |
| States spelled out | "Michigan · Ohio · Indiana", "Hillsdale, Michigan", "South Bend, Indiana" | "Indiana", "South Bend, Indiana" | ✔ (site UI on the phone shows "Hillsdale, MI" at 2–4 s — WARN class, Shavit's ruling) |
| No "written off" | absent | absent ("Rebuilt", "One house, rebuilt.") | ✔ |
| No generated / outpainted imagery | all `<img>` are `footage/*` live captures (`:46,51,54,61,66,71`) | all `img/*.jpg` byte-identical to the site's Kendall files (verified sha1, 10/10) | ✔ |
| Logo draws once, holds; no pulsing/looping | End card fades in 29→29.8 s then static (`:73-75`); but the top `.progress` bar keeps growing to 35 s (`:34,42`) — a moving element on the "static" card | **No end card, no mark at all** — Reel 2 ends on the mockup's `.close` section (`:189-205`): "One house, rebuilt." + Text/See-homes buttons + section-name list; no URL, no mark | Reel 1 ✔ (flag the bar) · Reel 2 ✗ — spec §4 27–35 "end card · 'Read the case study' → URL · static mark" is unmet (drift #2) |
| Ken-Burns ≤ 20 % of still-derived runtime, never on the hook | No stills. Device frames scale 0.90→1.00 (0–2 s, hook), 0.94→1.00 (11–15), 1.02→1.14 (14–24) — device moves over *scroll video*, not stills | None (0 %) — wipes only | ✔ on the letter; ⚠ the 10 % Mac push-in during the hook is the kind of move the rule targets ("never on the hook") — Jake to rule |
| Council: hook sequential, never two devices in one frame | Mac `t<2`, phone `2≤t<4` (`:43,48`) | — | ✔ |
| Council: Mac beat lands on the section heading and cuts before card body copy is legible | The Mac beat's footage (`capture-scroll.mjs:13`) starts **on the Michigan cards** for 0.6 s then glides; OCR reads `$1,600/mo $1,250/mo $1,200/mo $1,000/mo` on the Mac at 12.0–12.5 s in both v1 export and v1.3 base | — | ✗ minor drift vs §11 bullet 2 (start the desktop capture at `#case-studies` − 400 px) |
| Council: address string exactly "Kendall Street · South Bend, Indiana" | ✔ (`:67`) | "Deal Case Study · Indiana" / "KENDALL STREET" / "South Bend, Indiana. …" — same facts, not the exact string | ≈ |
| Copy is factually safe | "Every home, every rent, no forms." (`:57`) — the site deliberately does **not** list every home (Shavit 7/8: never enumerate the portfolio), rent is shown on 6 of 15 cards, and the site has a prequalification dialog with inputs | "Same finish you will find in every home we manage." (`:163`) — an absolute | ⚠ P2 — the reel that announces the site must not claim the one thing the site was built not to do; suggest "Available now. Coming soon. One number to text." |
| Reel 2 chrome | — | A **mock site nav** ("Shavit Rootman / Managed by…", "Menu", "Contact Us", `:116-120`) is burned into every Reel 2 frame — a page that does not exist on the live site (§5: no site changes) | ⚠ P3 — hide `.nav` for the reel capture or accept that Reel 2 depicts a proposed page |

### The gold-handle injection in `capture-casestudy.mjs:8-9` — honest or misrepresentation?

What it does: on the **live** `/case-studies/1919-kendall/` it injects CSS that (a) disables the page's hero zoom and reveal transitions (`.hero img{animation:none}`, `.rv{opacity:1}`) — capture hygiene, no visual claim; (b) hides a `.draftbar` — currently a no-op (the live page has no such element; checked); (c) **recolours the slider handle and grip from the site's white (`case-study.css:148-152`) to brand gold `#FFC000`**; and (d) sets every slider to `--pos:100%` (full *before*) and then scripts the swipe to 0 % (`:13,16,20-21`), whereas the live page loads at 50/50 and waits for the user.

*For "honest":* Reel 1 is a produced piece, not a screen recording; every device-frame beat is already choreographed (scripted scrolls, scripted carousel swipes, tilted phones). The gold handle is the exact thing Jake asked for on 8/16 ("a swipe and a little golden thing"), gold is the site's own accent token, and the spec's hero row literally says "the gold-handled swipe fires fast". A viewer will not perceive a white-vs-gold handle as a claim about the product; they will perceive "the case study has before/after sliders", which is true. Starting from full-before is a legitimate storytelling choice about a control the user drives anyway.

*For "misrepresentation":* Reel 1 is titled and captioned as *the website* — "We rebuilt the Shavit Rootman website" — and the spec's own pipeline line says the footage is "headless-Chromium captures of the LIVE site" (§4 Pipeline) with a hard "No site changes" (§5). Injecting styles into the page under capture *is* a site change in the footage: the reel shows a UI (gold handle, before-first default) that a tenant who taps through will not find. Once you allow "just a colour", the next capture allows "just a caption", and the "verbatim site UI" premise that the whole WARN/ruling framework rests on is gone. It also blurs the OCR ruling: Shavit is being asked to bless "site copy verbatim", and the frames he sees are not verbatim.

*Ruling:* **mild misrepresentation — disclose to Jake, and resolve it in one of two clean ways before posting.** Recommended: **make the site match the reel** — change `.ba__handle`/`.ba__grip` to gold in `site/public/case-studies/case-study.css:148-152` (a two-line, on-brand change; it also improves the live page) and re-capture; then the footage is verbatim again and the "gold-handled swipe" survives. Alternative: keep the site white, remove lines 8–9's colour overrides, re-capture, and let the reel's own hairline/type carry the gold. Either way delete the dead `.draftbar` rule and keep the animation-disabling lines (those are hygiene, not content). Do **not** ship the reel with a handle colour the site does not have while the caption says "we rebuilt the website".

---

## 3. Determinism and repeatability

Can someone re-run the pipeline from scratch and get the same mp4s? **No — not the exports, and not the base mp4s byte-for-byte; the frame sequences yes, if the environment matches.**

- **Toolchain is not pinned or declared.** No `package.json`/lockfile in `mockup/` or `reel1/`; `mockup/node_modules/playwright` → symlink into `~/.npm-cache-fresh/_npx/9833c18b…/` (an npx cache — pruned without notice) at **playwright 1.63.0-alpha-2026-08-05**; `reel1/node_modules` → `../mockup/node_modules` (a symlink committed to git pointing at a gitignored dir → dangling on clone). Chromium executable hard-coded to `/Users/jakehorvitz/Library/Caches/ms-playwright/chromium-1234/…` in **7 scripts** (`capture-site.mjs:5`, `capture-scroll.mjs:4`, `capture-swipe.mjs:3`, `capture-casestudy.mjs:3`, `capture-reel1.mjs:3`, `render-frames.mjs:3`, `mockup/capture.mjs:9`, `capture-reel2.mjs:3`). Fix: `mockup/package.json` with `"playwright": "1.63.0-alpha-2026-08-05"` + lockfile, `npx playwright install chromium`, and `chromium.executablePath()` / env `CHROME_EXE` instead of the literal path.
- **The footage is a function of a live website that changes weekly** (`capture-scroll.mjs:9-13`, `capture-swipe.mjs:7`, `capture-casestudy.mjs:7`, `capture-site.mjs:9-15`). A re-run after a lease/price change yields different frames (that is presumably why 2,735 JPEG frames were committed — see §4). Acceptable *if* the committed frames are treated as the pinned inputs; then `capture-*` are one-shot tools, not the pipeline. Say so in a README.
- **Font/OS dependence.** Renderers use `-apple-system,"SF Pro Display",…` (`reel1.html:3`, `the-turn.html:15`) → identical only on macOS with the same SF build. OCR results depend on tesseract 5.5.3 + its eng traineddata → the gate's WARN list changes with the tesseract build.
- **Partial re-render mixes vintages (proven).** `capture-reel1.mjs:4` only wipes `reel1-frames/` when run as the full range; a range run keeps old frames and `:9` then encodes the **whole** dir. State right now: 300 frames (`0420–0719`) are newer than `reel1.html` (00:14); **750 frames are older**, in five mtime clusters (00:10 ×190, 00:11 ×350, 00:12 ×210, 00:14 ×132, 00:15 ×168) → `reel1-base.mp4` (00:15) is a stitch of ≥4 render passes of ≥2 renderer versions. Two range runs in parallel would also race on the same dir and both re-encode `reel1-base.mp4`. Fix: write range runs to `reel1-frames.<A>-<B>/`, encode only on an explicit `--encode` after a contiguity check (`ls | wc -l == 1050`, names `0000..1049`), or stamp each frame's source hash into a sidecar and refuse to encode mixed hashes.
- **Timing assumptions.** `waitForTimeout(6)` between `scrollTo` and `screenshot` (`capture-scroll.mjs:28`, `capture-swipe.mjs:17`, `capture-casestudy.mjs:22`, `capture-reel2.mjs:13`) — fine for a static page, but the site's card images are `loading="lazy"`; the 400 px pre-scroll (`capture-scroll.mjs:22`) is what saves it. `capture-reel1.mjs:7` waits for `document.images` to complete — good; nothing waits for fonts (`document.fonts.ready` is used in the mockup captures only). `networkidle` on the live site can hang on Netlify long-polls (60 s timeout).
- **The Palmier stage is not in the repo at all.** Import base → add bed → set 1050 → `export_project` happened as live MCP calls; the only artefact is `palmier-reel-timelines.json` (two timeline IDs valid for one local project on this Mac). `pmcp.py` lives at an absolute path in a different repo (`accept-edit.sh:102`). Nobody can regenerate `exports/*.mp4` from this tree. Fix: `docs/product-edit/scripts/palmier-assemble.py` that (re)imports the base + bed by path and exports by name; check it in.
- **Lossy chain.** JPEG q92 frames → x264 crf 17 base → Palmier re-encode → IG re-encode: three lossy hops before Instagram's own. Consider PNG frames + `-crf 12` (or ProRes/`-qp 0`) for the base handed to Palmier.
- **Music.** `audio/bed-35s-american-landscape.m4a` — no provenance/licence note anywhere in the tree (grep: 0 hits outside `audio/`), and the music lane is now producing an EDM bed per Jake's 8/16 note → both reels will be re-exported anyway. Record source + licence before anything posts.
- The gate itself: needs Palmier running (`sys.exit(2)` → FAIL, `:109`), needs tesseract (silently), needs the sibling repo — a cold machine cannot reproduce "exit 0".

---

## 4. Security / privacy

- **No secrets or tokens** in the reviewed files (grep for `sk-`, `api[_-]?key`, `bearer`, `token`, `password`, `supabase`, `ghp_`, `xox` across `accept-edit.sh`, the renderers, capture scripts, captions, timelines JSON, spec — only word-hits like "sk-management" in REFS-awards). The spec quotes a truncated Palmier `MCP-Session-Id: E0134AE5-…` — harmless (local, unauthenticated, ephemeral).
- **Absolute personal paths** (`/Users/jakehorvitz/…`) in 8 committed scripts + `accept-edit.sh:102` (+ this lane's earlier docs). Not a secret, but it is a name and a home-directory layout in files that will be pushed; and it is the portability problem above. Env-var them.
- **Repo bloat / accidental publication surface**: **1,052.9 MB** tracked under `docs/product-edit/` — `reel1/reel1-frames` (1050 JPEGs), `mockup/reel2-frames-nonum` (1050), `reel1/footage` (635 JPEGs + mp4s), both exports (73 MB), `reel1-base.mp4`, previs mp4s, a 10 MB `phone-full.png`. Only `mockup/frames/` and `node_modules/` are ignored (`mockup/.gitignore`, `reel1/.gitignore`). Nothing here is >100 MB (largest 40.7 MB) so GitHub will accept it, but the history is now permanent and slow. Decide deliberately: keep the frames as the pinned inputs (then add a README + maybe LFS) or ignore `*-frames*/` + `footage/*/` and keep only the mp4s.
- **Personal/verbatim content**: SPEC-reels.html carries Jake's verbatim voice-note quotes incl. profanity ("super fucking cool…") and Shavit's texted copy; the dossier is an HTML meant to be served (`python3 serve.py`). Fine internally; strip before anything is shared outside.
- **Memory / brain-vault leakage**: the spec paraphrases the "video-brain" register rules (§5) but does not quote vault text; renderers/captions contain none. ✔
- **Network**: capture scripts talk only to `https://shavitrootman.com` (14 URLs) and the gate to Palmier on `127.0.0.1:19789` + ffmpeg/tesseract locally. The live case-study page itself requests Google Fonts during capture (its own `<link>`, CSP-blocked) — third-party traffic from the page, not from us. No IG/Higgsfield calls anywhere. ✔
- **PII on picture**: the site's public business phone/email (footage at 24–29 s), public listing addresses/rents (4–15 s) — all already public on the site; no people visible in any frame I sampled. ✔ Shavit's ruling on the site-UI list stands.

---

## 5. Spec-drift candidates for the 5.5 conformance report (built ≠ signed v1.3)

1. **Exports are v1.2, not v1.3** (P1). Reel 1 v1 export 15–24 s = Reel 2 mockup full-bleed; Reel 2 v1 = slow wipe. Renderers/base are v1.3; nothing re-exported; `exports/CURRENT=v1`.
2. **Reel 2 has no end card / URL / mark** (`the-turn.html:189-205`) — spec §4 27–35 "Close + end card; 'Read the case study' → URL; static mark"; §4 Pipeline "shared end card duplicated from the master project". Reel 1 uses an ad-hoc **"SR" box monogram** (`reel1.html:75`) rather than the shared end card or the site's own house mark (§4: "Shared end card from the slate (or the mark + URL as rendered)").
3. **Palmier holds base + bed only** — conformant with the v1.2 §9 wording ("timelines hold base + music bed"), but §4 Pipeline still promises "text layers in the register style … shared end card" *in Palmier*; text is baked into the base. Reconcile the two sentences.
4. **Reel 2 numbers beat**: `nonum` = "Rebuilt · Rented · The numbers are in the case study" ✔ default; the "second cut" with the count-up that `captions/REEL-2.md:7` promises **does not exist** (no `reel2-frames-num`, no `-num` mp4).
5. **Reel 1 beat timing vs shot list**: Available now runs 4–11 s (spec 4–9), Mac case studies 11–15 (spec 9–14), Text us 24–29 (24–30), end card 29–35 (30–35). Hero beat 14–24 ✔; hook 0–2/2–4 ✔; case-study swipes 0.45 s ✔ ("~0.4 s"). Swipe order follows the page (exterior → bathroom → kitchen → living) vs spec text "exterior → kitchen → bathroom → living" — page order should win; fix the spec line.
6. **Reel 2 wipe timing** (v1.3 renderer): wipe at 30–42 % of the chapter pin ≈ 0.65 s (spec "~0.5 s") after ~4.2 s on *before* (spec "hold ~1.5 s") — close; the long before-hold is a choice worth confirming with Jake.
7. **Mac beat shows card body copy (rents)** at 11.5–12.5 s — §11 bullet 2 said it would land on the heading and cut before body copy is legible.
8. **"Nothing generated" (§5) vs Jake's 8/16 "use EDM, maybe even AI"** — the music brief now allows AI audio; amend §5 to except music, and add `generate_audio` handling to the register grep deliberately (allow-listed with provenance) rather than by omission.
9. **Music bed** unrecorded provenance/licence; and about to change (EDM lane) → re-export both.
10. **Reel 2's mock site chrome** (nav/menu/Contact Us) is not in the shot list; the reel implies a page that does not exist (§5 no site changes).
11. **Copy claims** ("Every home, every rent, no forms." overlay; "Every home we manage…" caption) collide with the standing scope rule (never enumerate all managed homes) — not in the spec's banned list, but it is the one thing Shavit has been explicit about since 7/8.
12. Gate `RULE_DOLLARS` semantics: §9 says the flag lifts the `$` FAIL for the *ruled* case; the script lifts it everywhere.

---

## Findings, ranked (each with a one-line fix)

| # | Sev | Finding | Evidence | One-line fix |
|---|---|---|---|---|
| 1 | **P1** | Exports under gate are v1.2; renderers/base are v1.3; nothing re-exported | `exports/*-v1.mp4` 23:43 < `reel2-base-nonum.mp4` 00:08 < `reel1-base.mp4` 00:15; `git diff HEAD -- reel1/reel1.html`; sheet of Reel 1 v1 @16–22 s shows the mockup | Re-import both bases into Palmier, export `-v2`, write `exports/CURRENT=v2`, add the staleness assertions (§1 patch) so this cannot recur |
| 2 | **P1** | Site-UI WARN window (`accept-edit.sh:92`) contradicts the v1.3 hero beat; time-window classification is blind to overlay violations 2–15/24–29 s | my OCR of `reel1-base.mp4`: `@15.0s [digit-address] 1919 KENDALL STREET…`, `@15.5s [$] $151,250` → FAIL under current gate | Classify by pass, not time: OCR an overlay-only render (screens blacked) with FAIL semantics; full-frame sweep = WARN list for Shavit; delete the window |
| 3 | **P1** | Gate passes with OCR silently disabled (no tesseract/ffmpeg check, `2>/dev/null`, no min-frame count) | `accept-edit.sh:79-82,96` | `command -v` guard + `[ $n -ge 60 ] || fail` |
| 4 | P2 | `reel1-frames/` is a mix of ≥4 partial renders / ≥2 renderer versions; encode races on the shared dir | 750 frames older than `reel1.html`, five mtime clusters; `capture-reel1.mjs:4,9` | Range runs write to their own dir; encode only after a 1050-contiguous check; or always full re-render (35 s × 30 fps ≈ 5 min) |
| 5 | P2 | Static-signature check cannot catch a pulsing mark (whole-frame mean, thr 4.0; a full mark flip ≈ 1.0) and misreports (`$?`) | `accept-edit.sh:31-73` math in §1 | Crop to the mark/URL block, thr 1.0, add first-vs-last drift; fix the `if python…; then ok; else fail; fi` shape (also `:100/:116`) |
| 6 | P2 | Gold handle injected into the live-page capture (+ before-first default) → footage ≠ live UI while the caption says "we rebuilt the website" | `capture-casestudy.mjs:8-9,13` vs `case-study.css:148-152` | Ship gold handles on the live case-study page (2 CSS lines) and re-capture — or drop the override; keep the animation-off lines |
| 7 | P2 | Overlay + caption claim "Every home / every rent / no forms" contradicts the site's scope rule and facts (6/15 rents; prequal dialog) | `reel1.html:57`, `captions/REEL-1.md:3` | "Available now. Coming soon. One number to text." / caption: "what is available now and what is coming" |
| 8 | P2 | Reel 2 has no end card/URL/mark; Reel 1's "SR" box is not the shared end card nor the site mark | `the-turn.html:189-205`, `reel1.html:75`; spec §4 27–35 | Append the shared end card (or the house mark + `shavitrootman.com`) to `the-turn.html` close, or as a Palmier clip on both timelines |
| 9 | P2 | Pipeline not reproducible: alpha playwright via npx-cache symlinks, hard-coded Chromium path ×7, Palmier assembly unscripted, `pmcp.py` in another repo | §3 | `package.json` + lockfile, `CHROME_EXE` env, `scripts/palmier-assemble.py`, vendor or path-var `pmcp.py` |
| 10 | P2 | Music bed has no recorded source/licence; will change with the EDM lane | `audio/`, grep = 0 provenance hits | `audio/BED-NOTES.md` with URL/licence before posting; re-export after the bed swap |
| 11 | P2 | 1.05 GB of frames/footage committed; `reel1/node_modules` symlink committed and dangling on clone | `git ls-files` totals | Decide: pinned inputs (README + LFS) or ignore `*-frames*/`, `footage/*/`, `node_modules` |
| 12 | P2 | Mac case-studies beat starts on Michigan cards with rents legible (council §11 said cut before body copy) | OCR @12.0–12.5 s both builds; `capture-scroll.mjs:13` | Start `desktop-to-case-studies` keyframes at `#ohio`/`#case-studies − 400 px` |
| 13 | P2 | OCR at 2 fps misses the fast swipes and most of the stats scroll; Mac-beat text below OCR resolution | §1 (a)(i) | 4 fps + 1.5× upscale for OCR frames; or OCR the source footage dirs once for the site-UI list |
| 14 | P2 | Palmier check verifies neither track types nor that the base clip is the *current* base; offline = FAIL not skip | `accept-edit.sh:110-113` | Assert one video + one audio track, clip source hash == base sha, `nb_frames==1050`; treat unreachable as `WARN skipped` only when `ALLOW_OFFLINE=1` |
| 15 | P2 | Address regex misses line-wrapped / suffix-less addresses; `RULE_DOLLARS` relaxes globally | OCR @13.5–14.5 s "1919 KENDALL … STREET." no hit; `:84` | Add `\b(19|1[0-9]|[2-9][0-9])[0-9]{0,3}\s+(Kendall|Budlong|Barry|Ludlam|Oak|Howder|Norwood|Cedar|Ewing|St Joe)\b` (known-address list) and scope the flag to WARN-class hits |
| 16 | P3 | `.progress` bar keeps moving through Reel 1's "static" end card | `reel1.html:34,42` | Freeze it at 100 % after 29 s or drop it on the end card |
| 17 | P3 | Reel 2 burns a mock site nav (Menu / Contact Us) into every frame; Reel 1 hook has a montage hard-cut inside the Mac at ~1 s | `the-turn.html:116-120`; `desktop-hero-push` frames | Hide `.nav` for reel capture; start the hero capture right after a slide change (or on a single slide via `kill=hero`-style pin) |
| 18 | P3 | Caption gate misses curly-apostrophe and many contractions; captions not checked for banned strings | `accept-edit.sh:125-126` | Regex in §1 patch |
| 19 | P3 | Reel 2 default markup shows `$` unless `?nonum`; the ruled-no variant should be the default | `the-turn.html:140-142,256`; `capture-reel2.mjs:5` | Invert: `?num=1` opts in |
| 20 | P3 | 10 % Mac push-in during the hook — arguably "Ken-Burns on the hook" | `reel1.html:46` | Jake rules; or hold scale, move only rotation |
| 21 | P3 | Personal absolute paths in 9 committed files; verbatim profanity quotes in the served spec | §4 | Env vars; scrub before external share |
| 22 | P3 | Dead code / misleading messages in the gate (`:15-16`, `:73`, `:116`), `.draftbar` no-op in capture | — | Tidy |

**Bottom line for stage 6:** the cut itself is close and on-register (no digit addresses, no `$` in our type, states spelled out, real photos only, "Rebuilt"), and the renderers are deterministic in construction. But the artifacts in `exports/` are a spec version behind, the gate would reject the correct build and accept a broken environment, and the frame dir under it is a patchwork. **FAIL** until: (1) full clean re-render of both bases, (2) re-export as v2 with `CURRENT=v2`, (3) gate patched for pass-based OCR classification + dependency/staleness guards, (4) the gold-handle decision made and captured accordingly, (5) the "every home" copy fixed. After that this is a PASS WITH FIXES (P2/P3 list above), pending Shavit's site-UI ruling and the music-bed swap.
