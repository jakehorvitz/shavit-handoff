# Task: 3220 Clarendon — Instagram carousel + Facebook post (agent: clarendon-ig-fb)

Pipeline root: ~/projects/shavit-pipeline (this repo). Read FIRST, in this order: `rules/brand.md`,
`playbook/instagram.md`, `playbook/facebook.md`, `templates/before-process-after.md`,
`docs/reel-specs/_scripts/render_kendall_secondchance.py` (the carousel system you will reuse),
`docs/reel-specs/work-you-never-see-2026-07-24/final-0803/` (what a shipped deck looks like:
01_..10_ jpgs, CAPTION.txt, MASTER.pdf, REVIEW-sheet.jpg), then the existing Clarendon material:
`content/clarendon-deal-story/{post.md,coach.md}`, `content/clarendon-cleveland-team/`, and
`docs/reel-specs/clarendon-ig-2026-08-20.html` (rev 1 spec, 8/20 1:30 PM).

## What changed since rev 1 (why this is a rebuild, not a polish)
Rev 1 assumed (a) zero photography and (b) the "phone call / seller whose sale fell through" story
from Shavit's first memo. Both are now false:
- 8/20 9:08 PM Shavit sent a NEW case-study docx with the words "3220 Clarendon; match the details
  you need from the metrics you used for 1919 Kendall (the other case study). Here it comes:".
  Text is at `~/projects/shavit-rootman-website/docs/tasks/sources/clarendon-docx-2-rd-case-study-0820-9pm.txt`.
  It is the SOURCE OF TRUTH and it supersedes memo 1 (`.../clarendon-docx-1-website-case-study-for-jake.txt`).
  The story is now: acquired late 2025 as a vacant triplex in **Cleveland Heights, Ohio** (not
  "Cleveland"), on **Clarendon Road** (not "Avenue"), near University Circle; comprehensive
  renovation (kitchens, bathrooms, flooring, drywall/paint, lighting, plumbing, portions of
  electrical, mechanical, select windows, common areas, basement moisture treatment + epoxy,
  driveway, landscaping, porch); three units leased, tenants including medical residents relocating
  from out of state; refinanced and KEPT rather than sold. There is no phone-call story in docx 2.
  The website case study (being published in parallel by another agent from docx 2) will say this,
  so the post must not contradict it. Do NOT blend in memo-1 beats.
- 8/20 9:15–9:31 PM Shavit sent ~45 photos, captioned per unit. They are staged at
  `~/projects/shavit-rootman-website/docs/case-studies/clarendon-3220/_drop/` — read `MANIFEST.md`
  there first (file → his caption). `after-exterior/exterior-after.jpeg` is the ONLY finished
  exterior. `after-unit1/` (13), `after-unit2/` (6), `after-unit3/` (7 unique), `after-basement/`
  (2 CleanShot screenshots, low quality). READ-ONLY: never write into that repo.
- **The `before/` photos carry an "MLS Now" watermark — they are old sale-listing photography,
  not Shavit's own shots.** brand.md rule 7 ("No Zillow/portal imagery") bars them from social.
  So: the main deck is built WITHOUT any before photo. Additionally render ONE alternate
  slide-2 before-collage (Kendall-style 3x3, watermark cropped out) as a separate file
  `ALT_02_before-collage.jpg` outside the numbered deck, with a note that it ships only if Shavit
  confirms those photos are his to publish. Do not put it in the MASTER.pdf.

## Hard rules (machine-enforced by lint and by Shavit's own corrections — all apply)
- ZERO dollar figures anywhere (slides, caption, alt text). The numbers are the website's payload;
  the post points at the site. No percentages either.
- Street name only, never the house number: "Clarendon Road". Full state name: "Ohio". City:
  "Cleveland Heights".
- Facts, not emotion. No adjectives beyond literal materials/colors/fixtures. No praise theme.
  No testimonials. No em dashes. No contractions. No engagement bait, no emoji walls.
- Real photographs only. Nothing generated, nothing from a portal (see MLS note). Do not reuse the
  same photo twice in the deck. Avoid frames showing tenants' belongings or people.
- De-identify people: no crew or tenant names. (The "Cleveland team" post stays gated on crew
  photos + names; do not build it.)
- End card and tagline MUST match the last shipped deck exactly: "Live with us. Work with us." +
  the same mark treatment as Kendall slide 10 ("Proudly revitalizing South Bend, Indiana." →
  "Proudly revitalizing Cleveland Heights, Ohio."). Do not invent a new CTA line.
- Fair housing: describe the property and location, never who should live there. "Medical
  residents relocating from out of state" is OK as a statement of who DID lease, phrased as
  fact; never "perfect for", never "walking distance".
- Never post anything anywhere. Drafts only; Jake posts.

## Deliverable 1 — Instagram carousel (1080x1350, 10 slides, Kendall system)
Copy `render_kendall_secondchance.py` → `docs/reel-specs/_scripts/render_clarendon.py`; keep the
bone treatment, fonts, colors, band/rule metrics, index chips, collage code. Swap CARDS and frames.
Slide plan (adapt, but keep Kendall's arc — hook exterior → what it was → process → the after →
proof + mark):
 01 finished exterior (`exterior-after.jpeg`, only use of it) + headline. Propose TWO headlines
    in the Kendall register (Kendall was "EVERY HOME HAS A SECOND CHANCE."); render slide 01 both
    ways as `01a_/01b_` and let Jake pick; the MASTER uses option a.
 02 what it was: vacant triplex, three units under one roof, Cleveland Heights (TYPE-led since no
    usable before photo; a real after frame may sit behind a darker band as Kendall does, or the
    slide is a full-bleed type slide in the bone system).
 03–07 process and rooms, one beat each, each on a different real after photo: kitchens, bathrooms,
    living areas, common hallways/stairs, basement + mechanical (basement afters are CleanShot
    screenshots: use one only if it reads clean at 1080 wide; otherwise cover basement in type over
    another frame). Name room, material, fixture. Lists with periods like Kendall slide 3/6
    ("Cabinets. Trim. Tile. Paint.").
 08 the after: three homes, leased; tenants relocating from out of state (fact, plainly).
 09 the hold: refinanced and kept, capital recycled into the next project (no figures).
 10 close: "Proudly revitalizing Cleveland Heights, Ohio." + "Live with us. Work with us." + mark,
    exactly as Kendall 10.
Open every candidate photo with the Read tool before choosing. Keep a `FRAMES.md` listing slide →
source file → why. Output dir: `docs/reel-specs/clarendon-ig-2026-08-20/final/` with
`01_…10_*.jpg`, `01b_*.jpg`, `ALT_02_before-collage.jpg`, `CAPTION.txt`, `Clarendon-Carousel-MASTER.pdf`,
`REVIEW-sheet.jpg` (contact sheet), `FRAMES.md`, `NOTES.txt`. Then copy a send-ready set to
`~/Desktop/Shavit - Clarendon Carousel/` (same precedent as Kendall/East Victoria).
Caption: Kendall's CAPTION.txt is the register — hook line, "Clarendon Road. Cleveland Heights,
Ohio.", 3–4 short paragraphs (what it was → behind the walls → the rebuild → what it is now),
"Live with us. Work with us.", then 10–14 niche+geo hashtags (#clevelandheights #universitycircle
#ohiorealestate #brrrr #rehab #renovation #propertymanagement #realestateinvesting
#midwestrealestate #beforeandafter only if a before actually ships, etc.). Under 2,200 chars;
first 125 chars carry it. Suggested post day: Sunday 8/23 (Shavit's "gold" day).

## Deliverable 2 — Facebook post
Per `playbook/facebook.md`: 150–300 words, one property's story start to finish, open on the human
beat (a vacant triplex near University Circle, what the block got back), praise the street /
community (the house can be the villain, the community never is), CTA "Know a house like this near
you? Send it our way.", tag the Cleveland Heights city page (no address), spelled-out Ohio, no
dollar figures, no house number. 4–5 real photos in order exterior → rooms (no MLS befores),
exported landscape ≤2048px wide to `docs/reel-specs/clarendon-ig-2026-08-20/fb/` as `01_…05_*.jpg`
+ `CAPTION.txt`. Stagger note: post FB the day after IG and lead with a different beat.

## Deliverable 3 — pipeline records (so Jake can lint/verify/ship)
- Rewrite `content/clarendon-deal-story/post.md` for IG from docx 2 with inline claim spans
  `[F:<id>]{text}` on every factual claim (ids like `prop.clarendon.street`, `clarendon.units`,
  `clarendon.acquired`, `clarendon.scope`, `clarendon.tenants`, `clarendon.hold`). Update its
  frontmatter title. Create the FB post with `./shavit.sh new -p facebook clarendon-triplex-fb`
  (inspect `shavit.sh new -h`; if the platform flag wants another spelling, follow the tool) and
  write its post.md the same way.
- The facts registry (`facts/*.yaml`) does not exist yet and is TTY-only (Jake types `./shavit.sh
  fact add`). You cannot add facts. Instead write `content/clarendon-deal-story/FACTS-TO-ADD.md`:
  one line per fact id with the exact value and the source line from docx 2 (quote it), so Jake can
  run `fact add` in a TTY, then `lint`, `verify`, `review`, `ship`.
- Prove the prose passes every machine rule NOW by running `./shavit.sh lint <post-id>` on a copy
  with the `[F:...]{...}` markers stripped to their text (rev 1 did exactly this) — paste the
  output in your report. Fix every named rule failure in the real post.md.
- Rewrite both `coach.md` files substantively against the playbooks (strategy + at least one
  `rewrite:` block each), noting that docx 2 superseded the phone-call story.
- Update the spec `docs/reel-specs/clarendon-ig-2026-08-20.html` to rev 2: keep
  `<body data-spec="…">` + `spec-annotate.js`, add a dated `.revlog` entry (newest first) and wrap
  every changed section in `class="chg"`; embed the rendered slides (relative paths) so Jake can
  annotate each slide at `http://localhost:8765/docs/reel-specs/clarendon-ig-2026-08-20.html`
  (`python3 serve.py`). Fold in the two headline options and the ALT before-collage decision.
- If this directory is a git repo, commit by name (`git add <paths>`; never `-A`/`.`); otherwise skip.

## Report (last message)
Slide → frame table, both headline options, lint output, the FACTS-TO-ADD list, the three things
Jake must confirm with Shavit (MLS befores; Road/Cleveland Heights naming; that the post may
describe tenants as relocating medical residents), the spec URL, the Desktop folder path.
Do NOT post. Do NOT build the Cleveland-team post. Do NOT write into the website repo.
