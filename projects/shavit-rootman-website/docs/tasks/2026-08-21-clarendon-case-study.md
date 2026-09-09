# Task: finish + publish the 3220 Clarendon case study (agent: clarendon-case-study)

Repo: ~/projects/shavit-rootman-website. Draft: `docs/case-studies/clarendon-3220/index.html`
(draft 1, 8/11). Reference: `docs/case-studies/kendall-1919/index.html` and the PUBLISHED
`site/public/case-studies/1919-kendall/index.html` (live at shavitrootman.com/case-studies/1919-kendall/).
Both pages share `../case-study.css` byte for byte — do NOT edit the CSS; Shavit's instruction is
"exact same layout and structure" and the shared stylesheet is how that is enforced.
You CANNOT deploy — Jake runs `netlify deploy --prod --dir site/dist --site b40ffade-386e-426f-a7f3-407eaac51e78`.

## What Shavit sent on 2026-08-20 (iMessage) — everything the page was blocked on
- 1:13 PM: proposed an IG post "the Cleveland team / the story of 3220 Clarendon" (NOT your job).
- 1:25 PM: photos "From me" (so NO Zillow pulls — the 33 Barry "not ours to copy" precedent holds).
- 9:08 PM, verbatim: "3220 Clarendon; match the details you need from the metrics you used for
  1919 Kendall (the other case study). Here it comes:" + the docx "3220 Clarendon Rd Case Study.docx".
- 9:15–9:31 PM: ~45 photos, captioned per unit, before and after, exterior, basement.

## Sources, in priority order
1. `docs/tasks/sources/clarendon-docx-2-rd-case-study-0820-9pm.txt` — the 9:08 PM docx. THIS IS THE
   SOURCE OF TRUTH for every number and every sentence. It already uses Kendall's section names
   ("PROJECT STORY" etc.) and has a dated timeline.
2. `docs/tasks/sources/clarendon-docx-1-website-case-study-for-jake.txt` — the earlier memo draft 1
   was built from. Jake asked "is this accurate" at 1:16 PM; Shavit never confirmed it and instead
   sent docx 2. Where they conflict, docx 2 wins — use it wholesale, do NOT blend the two stories.
   Known conflicts (list every one you resolve in your report so Jake can confirm with Shavit):
   address "3220 Clarendon Road, Cleveland Heights, Ohio" (docx 2) vs "Avenue, Cleveland" (docx 1);
   renovation $140,000 vs $130,000; total $294,000 vs $284,000; value created $256,000 vs $266,000;
   87.1% vs 93.7%; capital returned ~$160,000 vs ~$150,000; acquisition story "acquired late 2025 as
   a vacant triplex" vs the Adam/homeowner relationship story; current monthly cash flow ~$1,000,
   "Capital Recovered: 100%+" and "Current Status: Stabilized" are new in docx 2.
3. Photos: `docs/case-studies/clarendon-3220/_drop/` — read `MANIFEST.md` first; it maps every file
   to Shavit's caption. before/ (per unit + basement), after-unit1/ (13), after-unit2/ (6),
   after-unit3/ (7 unique; the rest were byte-dupes of Unit 2 and were not copied), after-exterior/
   (1 landscape = hero), after-basement/ (2 CleanShot screenshots, lower quality).
   OPEN EVERY IMAGE with the Read tool before choosing. Captions and filenames disagree in places
   (e.g. `unit1-bedroom-before.jpeg` is filenamed "living room") — what the picture shows decides.

## Rules that apply to this page (from the repo's standing rules)
- Banned strings anywhere in the page or its comments: "Charger Realty", CPH, DSR, Barootman,
  "Indiana Charger Holdings", Triovest, "owned by". "Charger Property Management" is the brand and
  is fine. Run `grep -i` for all of them on the finished file.
- Full state names ("Ohio", never "OH"). Dollar figures ARE shown on case studies (Kendall shows them).
- The seller stays unnamed. Fair-housing wording describes the property, not who lives in it
  (docx 2's "medical residents and other professionals" as a market description is fine; do not
  write about the current tenants' identities).
- HTML and CSS comments SHIP to prod — no notes-to-self in the published copy, no unannounced
  addresses. (This publish makes 3220 Clarendon an intentionally public address, which RETIRES the
  old pre-deploy check `grep -ril clarendon site/dist → 0`; say so in your report.)
- Never put unused/rejected photos under `site/public/`. Only wired images go in `img/`.

## Steps
1. Rewrite the copy from docx 2 into the draft, keeping the 12-section order and Kendall's markup:
   Hero · name + location · one-sentence summary · Investment Snapshot · BRRRR Performance ·
   Project Story · The BRRRR Process/Strategy (match Kendall's heading) · Before & After slider ·
   Lessons Learned · Community Impact · Project Timeline · Previous/Next nav.
   Numbers must reconcile (154,000+140,000=294,000; 550,000−294,000=256,000; 256,000/294,000=87.1%;
   75%×550,000=412,500). Timeline from docx 2 verbatim: Acquired Late 2025 · Renovation Completed
   May 2026 · Refinanced May 2026 · Leased/Stabilized June 2026 · Current Status fully leased,
   refinanced, professionally managed by Charger Property Management. (His refi date precedes his
   lease-up date — reproduce as given and flag it in the report.) Address line:
   "3220 Clarendon Road — Cleveland Heights, Ohio". Slug stays `clarendon-3220` in docs/.
2. Hero = `after-exterior/exterior-after.jpeg`, cropped to whatever Kendall's hero dimensions are
   (inspect Kendall's img/ with `sips -g pixelWidth -g pixelHeight`) using sips.
3. Before & After. docx 2 names six categories: Exterior, Kitchens, Bathrooms, Living Areas,
   Common Areas, Basement & Mechanical. Build as many honest matched pairs as the photos support
   with `./wire-pair.sh <before> <after> <slug> "<Label>"` (run from the clarendon-3220 dir; it
   crops both to 1400x933 and prints the HTML block). Candidate pairs: Basement · Unit 1 Kitchen ·
   Unit 1 Living · Unit 2 · Unit 3. There is NO exterior "before" and NO bathroom "before" — cover
   those categories in copy or with after-only imagery if Kendall's markup has a pattern for it;
   never fake a before. Pairs do not need the same camera angle (his photos are not), but they must
   be the same room type and orientation so the wipe reads. Write real captions (replace every
   "TODO caption.") — short, factual, in the docx 2 voice. If Kendall has an after-gallery
   (after-01..09), build one from the best remaining afters. Keep published jpgs ≲350KB like Kendall's
   (check with `ls -la site/public/case-studies/1919-kendall/img`).
4. Delete the DRAFT BANNER `<aside>` and every "pending" placeholder. Title/meta/OG mirror Kendall.
5. Review locally: `python3 serve.py 8770` → http://localhost:8770/docs/case-studies/clarendon-3220/
   Screenshot at 390px (device emulation) and 1280px if a browser tool is available; fix overflow.
6. COMMIT 1 (docs only): `git add docs/case-studies/clarendon-3220/index.html
   docs/case-studies/clarendon-3220/img docs/case-studies/clarendon-3220/NOTES.md
   docs/tasks/2026-08-21-clarendon-case-study.md docs/tasks/sources/` — do NOT commit `_drop/`
   (91MB of raw photos). Update NOTES.md: which open questions are now closed and how, plus the
   docx1→docx2 conflicts list. Message: `feat(case-studies): 3220 Clarendon from Shavit's 8/20 docx + photos`.
7. PUBLISH, mirroring the Kendall commits (`git show --stat a1f078d` and `git show 767f3d8`):
   - copy index.html + img/ to `site/public/case-studies/3220-clarendon/` (number-first like
     `1919-kendall`; `site/public/case-studies/case-study.css` already exists — link it as
     `../case-study.css`). Fix every internal href for the new path.
   - Restore Kendall's Prev/Next nav in `site/public/case-studies/1919-kendall/index.html` (it was
     withheld behind a comment in f8df029 until a second case study published): Next → Clarendon;
     Clarendon's Previous → Kendall; for Clarendon's Next, follow whatever Kendall's markup does
     for a missing neighbor (no `href="#"` no-ops — that was a live bug fixed 8/20).
   - Surface Clarendon next to Kendall in the Deal Case Studies row in `site/src/tenant-pages.jsx`
     (read `git show 767f3d8` for exactly how Kendall was added; card image = the hero).
8. Build + gate: `cd site && npm run build && cd .. && ./accept-714.sh` (PASS);
   `grep -ril "charger realty\|barootman\|triovest\|owned by" site/dist` → 0;
   `test -f site/dist/case-studies/3220-clarendon/index.html`; confirm every nav href resolves to a
   file in site/dist (no `#`, no 404 paths).
9. COMMIT 2 (publish): stage by name only — `site/public/case-studies/3220-clarendon/`,
   `site/public/case-studies/1919-kendall/index.html`, `site/src/tenant-pages.jsx`. NEVER
   `git add -A` / `git add .` — the tree has unrelated dirty files (.bones/, .DS_Store, serve.py,
   spec-annotate.js, SEO-interrogation.md, docs/spec-inbox.jsonl, site/staging-assets/,
   .bones-archive-*, `_drop/`). Message: `feat(site): publish 3220 Clarendon case study, restore Kendall prev/next`.

## Coordination — another agent is in this same working tree
`listings-0820` is editing `site/src/properties.js` during roughly the first 20 minutes. Do not
touch properties.js. Before your FIRST `npm run build` (step 8), run
`git status --short site/src/properties.js`; if it is still modified-and-uncommitted, sleep 120
and re-check (up to 20 min) so your build/gate does not race theirs. Steps 1–6 do not touch
`site/` at all, so start immediately.

## Final report (print it as your last message)
- both commit hashes + gate output
- the docx1→docx2 conflicts you resolved (for Jake to confirm with Shavit)
- pairs built (before file ↔ after file per slug), photos rejected and why
- the review URL and the deploy command for Jake (above)
- Do NOT deploy. Do NOT build Instagram assets.
