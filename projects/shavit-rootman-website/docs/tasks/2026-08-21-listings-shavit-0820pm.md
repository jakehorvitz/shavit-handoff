# Task: wire Shavit's 8/20 evening texts — listings (agent: listings-0820)

Repo: ~/projects/shavit-rootman-website (app in `site/`, Vite + react-router + vite-react-ssg).
Data file: `site/src/properties.js`. Gate: `./accept-714.sh` from repo root (must PASS).
Build: `cd site && npm run build`. You CANNOT deploy (permission classifier blocks it) — Jake runs
`netlify deploy --prod --dir site/dist --site b40ffade-386e-426f-a7f3-407eaac51e78` himself.
Read the comments at the top of properties.js and the existing entries before editing: every past
directive is quoted verbatim in a code comment with its date. Keep that convention.

## Directives (Shavit, iMessage, 2026-08-20, verbatim)

### 1. 8:57 PM — REMOVE 179 State entirely
> "- Jake, please remove the 179 State for lease - it is irrelevant and I don't want the current
> tenants to see that, as they ended up extending the lease."

Context: `state-179` went live as `available` on 8/19, was flipped to `lease-signed` 8/20 1:39 PM
(commit 90db892, LIVE on prod). His 8:19 PM text ("179 State lease signed. Meaning, not available :)")
is superseded by this 8:57 PM one: he wants it GONE, not stamped. The tenants extended; the listing
must not be visible to them anywhere.

- Delete the whole `state-179` object from `site/src/properties.js`.
- Leave a tombstone comment in its place, same style as the `11½ E St Joe (stjoe-half) REMOVED 8/9`
  precedent near line 64: quote the 8:57 PM text + date, and say it was added 8/17, leased 8/20,
  removed 8/20 on his instruction so nobody restores it from the 8/17 notes.
- Check and scrub every other place it could surface: `site/src/properties.staged.js`, any
  MANAGED_HOMES / address list, `site/src/tenant-pages.jsx`, sitemap, JSON-LD, meta. Then prove it:
  `grep -rn "179 State" site/src site/public` → only the tombstone comment;
  after build `grep -ril "179 state" site/dist` → 0.
- Side effect you should mention in the report: this removes the duplicate `cpm-kitchen.jpg`
  placeholder that sat next to 60 S Norwood under matching LEASE SIGNED stamps.

### 2. 8:57 PM — 1902 E Ewing → lease-signed
> "- 1902 E Ewing in Indiana not has a lease signed. Amazing news!"

"not" is a typo for "now" (reading: "now has a lease signed. Amazing news!"). His phrase is "lease
signed" → status `lease-signed` (NOT the separate `rented` status he coined for Kendall 7/27, and do
not invent a "pre-leased" status even though this unit was in the Coming 2026 bucket).

- `ewing-1902`: `status: 'lease-signed'`.
- Per the stjoe-11-2 / 33 Barry A rule, a leased unit advertises neither a rent nor an availability
  date: move `rent: '$2,000/mo'` (Shavit 8/4) and `eta: 'October 2026'` (Shavit 7/17) into a comment
  and set the fields to null, so they are restorable if he ever relists.
- Rewrite `line` so it is true for a leased home (see how the 33 Barry A / 60 S Norwood lines are
  phrased: "...already taken." etc.). Keep beds/baths/sqft/photo as they are. It should drop out of the
  rental JSON-LD automatically — verify in the built HTML.
- Confirm the Indiana inventory still renders (it had 3 units) and that a `lease-signed` card that
  was previously Coming 2026 sorts/stamps correctly (read how `lease-signed` is handled in the
  components: `grep -n "lease-signed" site/src/*.js site/src/*.jsx`).

### 3. Nothing else in the thread is a listings change.
The Clarendon case study is a DIFFERENT agent's job (`clarendon-case-study`) running concurrently in
this same working tree. Do NOT touch `docs/case-studies/`, `site/public/case-studies/`, or
`site/src/tenant-pages.jsx`.

## Process
1. Make the two edits. Build. Run `./accept-714.sh` (PASS). Run the greps above.
2. Stage ONLY the files you changed, by name (`git add site/src/properties.js ...`). NEVER
   `git add -A` or `git add .` — the tree has unrelated dirty files (.bones/, .DS_Store, serve.py,
   spec-annotate.js, SEO-interrogation.md, docs/spec-inbox.jsonl, site/staging-assets/,
   .bones-archive-*, docs/case-studies/clarendon-3220/_drop/) that must not be committed by you.
3. Commit: `feat(site): Shavit 8/20 pm texts — 179 State removed, 1902 E Ewing lease-signed`
   (body: the verbatim quotes). Do not deploy.
4. Time budget ~20 min. If the build fails for a reason unrelated to your edit, report it; do not
   refactor anything.

## Final report (print it as your last message)
- commit hash; gate output (PASS/FAIL + last lines); the three grep proofs
- anything ambiguous you had to decide
- the deploy command for Jake (above)
