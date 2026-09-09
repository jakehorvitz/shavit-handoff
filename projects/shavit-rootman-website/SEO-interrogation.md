# Stage 1 — Prompt interrogation: SEO maximization for shavitrootman.com

**Date:** 2026-07-30
**Original prompt (Jake, verbatim):** "ok I want to optimize and maximize seo as much as possible for shavits website use bonespipeline and see if these tools would help https://github.com/topics/seo-tools, keywords I would like shavits website to pop up on is hillsdale michigan, realestate, and etc you decide"

Plus two Instagram reels handed over mid-session as candidate tooling:
`instagram.com/reel/DbXFgd6swBI` (keeran.ai promoting OpenSEO) and
`instagram.com/reel/Dba_V5ISbNa` (borja.obeso, the "Article Trailer Method").

---

## Recon completed before this interrogation

Three parallel research passes ran before any banding, so the bands below reflect measured
state rather than assumption:

1. **Technical SEO audit** of `site/` at HEAD `3f5a04b`, at file:line level.
2. **Tooling evaluation** of `github.com/topics/seo-tools` and `topics/seo`, with star counts
   and last-push dates pulled through the GitHub API rather than page scraping.
3. **Keyword, competitor, and local-pack research** for Hillsdale MI, using the Google
   autocomplete API directly as a free demand proxy.

I then verified the load-bearing defects myself against production rather than trusting the
agents, because a wrong finding here propagates into the spec.

### Verified defects (checked personally against the live site)

| Claim | Verification | Status |
|---|---|---|
| Canonicals point at redirects | `/meet/` serves `rel=canonical → /meet`, which 301s back to `/meet/`. Same for `/accessibility`. Homepage canonical is correct. | **CONFIRMED, 2 of 3** |
| Sitemap lists redirecting URLs | `sitemap.xml` emits `/meet` and `/accessibility` without trailing slashes; both 301. | **CONFIRMED** |
| `/company/` 404s | `curl -I` returns 404 for `/company` and `/company/`. `/companies` correctly 301s to `/`. The gap is singular-versus-plural. | **CONFIRMED (404). Indexation claim NOT verified — needs GSC.** |
| `LocalBusiness` has no `address` | `src/routes.jsx:119-121` carries an explicit TODO deferring `PostalAddress` until Shavit confirms the registered address. | **CONFIRMED, and deliberate** |
| Only 3 indexable URLs | `src/routes.jsx:230-241` defines `/`, `/meet`, `/accessibility` plus a client-only catch-all. All 16 listings are `#home-{id}` fragments on `/`. | **CONFIRMED** |

### Tooling verdict (folds into non-goals below)

Of roughly 28 repos on the `seo-tools` topic, exactly **one** helps a 3-URL local rental
site: `unlighthouse` (4.7k stars, no API key). The rest are wrong-stack
(Laravel/Next/WordPress/ASP.NET), archived, or paid-API wrappers.

Both reels and the topic page converge on **OpenSEO** (`every-app/open-seo`, 9,653 stars).
The reel calls it free; it is not. `DATAFORSEO_API_KEY` is the only required core env var, so
it is inert without a paid DataForSEO account, and Jake already has it cloned at
`~/projects/open-seo` with no key. At Hillsdale search volume, keyword APIs return nulls
anyway and Google Search Console is strictly better and free. The Article Trailer Method is a
B2B SaaS link-building play with no local-rental analogue.

**Decision: skip OpenSEO and the Article Trailer Method; install unlighthouse, GSC, and
Bing/IndexNow; wire linkinator in as a regression guard.** One repo on that topic page,
`lucasveneno/trafficbot`, is a Tor-proxy fake-traffic generator and is an automatic no.

---

## The seven dimensions

### 1. Task specificity (weight 20) — **PARTIAL**

"Maximize SEO as much as possible" names an outcome, not an artifact. The recon collapsed
most of the ambiguity: the binding constraint is information architecture, not tags. The site
is already technically clean (per-route meta, canonicals, OG/Twitter, robots.txt, a
hand-rolled image sitemap, lazy loading, alt text on 20 of 20 images, and a JSON-LD graph
better than most schema generators emit). Very little conventional hygiene remains.

What is missing is **URLs to rank**. Hillsdale, South Bend, Cleveland, and Niles have no
page, no title, no h1, and no canonical. City names appear in **zero** headings site-wide;
"Hillsdale, Michigan" occurs 21 times on the homepage but always inside a
`<div class="eyebrow">`. The `<title>` on the highest-value page reads
`Shavit Rootman | Charger Property Management`, which targets a brand with zero autocomplete
volume and contains no city, state, or service keyword.

Research also surfaced a scope question the prompt could not have anticipated: **every listing
is a fragment, so address-level queries** (`34 Budlong St Hillsdale MI`) **are unwinnable by
construction.** Those are near-zero competition and high intent. That converts per-listing
URLs from a nice-to-have into a named deliverable.

**Remaining gap → Q2 below.**

### 2. Context sufficiency (weight 18) — **COVERED**

Unusually strong, because the repo and project memory carry it. None of this needs
re-deriving:

- **Stack:** Vite 5 + React 18 + react-router-dom 6.30 + `vite-react-ssg` 0.8.7, `dirStyle: 'nested'`. Routes in one file (`src/routes.jsx:230-241`). Meta via a single `Seo` component (`routes.jsx:85-164`) reading `src/data.js:43-64`.
- **Deploy:** Netlify site `flourishing-lokum-8a1ea2`, publish `site/dist`. **Repo has no git remote** — "push" means a Netlify CLI deploy from local dist, and the permission classifier blocks `netlify deploy --prod` for agents every time. I build and verify; Jake runs the deploy.
- **Gate:** `./accept-714.sh` (passed 7/28). `accept-revision.sh` is stale spec-drift; do not use.
- **Content data:** `src/properties.js`, 16 listings. Hillsdale MI 13, South Bend IN 2, Niles MI 1. **Ohio has zero inventory** despite appearing in nav, footer, and `areaServed`.
- **Sitemap generation:** `site/scripts/gen-sitemap.mjs` already emits a Google image-sitemap extension. Any off-the-shelf sitemap plugin would be a downgrade.
- **Known-stale redirect:** `_redirects` sends `/case-studies → /#standard`, but no `#standard` ID exists in the built HTML (the section is `id="case-studies"`).

### 3. Constraints and non-goals (weight 16) — **COVERED** (from standing project rules, not the prompt)

The prompt supplies no don'ts, but the project has a dense standing set that bounds this build
hard. The spec must encode these as gate-checkable assertions:

- **Two buckets only:** "Available Now" / "Coming 2026", Shavit's verbatim framing. **Never enumerate all ~40 managed homes** — he fears tax reassessment. This directly limits how aggressive city pages can be.
- **Gate-banned strings:** holding-company names (CPH, DSR, Barootman, Charger Realty, Indiana Charger Holdings, Triovest) and the phrase "owned by".
- **No rents in visible copy.** Flagging a possible existing violation: `properties.js:140` carries `$1,250/mo` for `barry-a`. Surfacing it, not silently fixing it.
- **ETAs year-level only.**
- **SMS-only card CTAs.** 805-364-4415 is the site's only conversion path, and **there are no on-site forms** (Supabase plumbing is dormant and fails closed). This rules out the lead-capture patterns most local-SEO playbooks assume, and it has a measurement consequence noted under dimension 4.
- **`info@shavitrootman.com` is banned from site copy** (Shavit cannot read that inbox).
- **Never put reject photo sets under `public/`** — that was a live privacy leak fixed 7/28.
- **Do not guess the business address.** NAP must match the Michigan LLC registration exactly.

**Negative constraint that would otherwise cause overreach:** do not build a blog. Every
generic real-estate SEO playbook recommends one, nobody has committed to writing it, and an
abandoned blog is worse than none. Research independently reached the same conclusion:
generic landlord/tenant blogging will not pay back in a market this small.

**Second negative constraint:** do not build Cleveland or Larchmere pages. Ohio has zero
available doors. A city page with no listings is a thin-content liability.

### 4. Verification / success criteria (weight 16) — **MISSING → resolved by construction**

The prompt gives no definition of done, and "maximize as much as possible" is explicitly
unfalsifiable. This is the dimension that would sink the build, and bones stage 5 refuses
self-reports, so it has to become executable.

Resolution: extend the existing `accept-714.sh` pattern into an `accept-seo.sh` that runs
against built `dist/` and asserts checkable facts:

- every `<loc>` in `sitemap.xml` returns 200, never 301
- every `rel=canonical` equals the URL that actually serves it
- each city route exists, is prerendered, and carries a unique non-empty `<title>`, a meta description, and exactly one `<h1>` containing the city name
- each listing route resolves to a real URL and its JSON-LD `@id` is that URL, not a `#fragment`
- JSON-LD parses and validates
- zero gate-banned strings in built HTML
- no image in `dist/assets/listings/` exceeds its declared `srcset` width

**Rankings are explicitly not an acceptance criterion.** They lag deploys by weeks and depend
on a Google Business Profile that is blocked on Shavit. Conflating the two makes the gate
unpassable for reasons outside the build.

**Measurement caveat that must be stated in the spec:** with SMS/tel-only CTAs and no forms,
there is currently no conversion tracking at all. Every recommendation here is unmeasurable
until click-to-text and click-to-call events are instrumented and GBP calls are read from the
GBP dashboard. Instrumenting that is arguably a prerequisite, not a follow-up.

### 5. Output contract (weight 12) — **PARTIAL**

The prompt implies code changes but does not say what else. Assuming, unless told otherwise,
four deliverables: (a) the code changes, (b) `accept-seo.sh` as the binding gate, (c) an
annotatable HTML spec per the standing spec rule, and (d) a short plain-language list of the
actions **only Shavit or Jake can take**, since several of the highest-value levers are not
code at all.

### 6. Role / framing (weight 10) — **PARTIAL**

No persona given. Adopting: **local-SEO practitioner working on a client property with a
skittish owner.** Priority when criteria conflict: **safety of the client relationship >
durability of the ranking gain > breadth of coverage.** A page that risks tripping Shavit's
tax-reassessment fear does not ship even if it would rank, and a slower structural fix beats a
fast tactic that could earn a manual action.

### 7. Examples (weight 8) — **COVERED** (was missing; the research pass closed it)

Jake gave "hillsdale michigan, realestate, and etc you decide", which is a direction, not a
target list. The keyword pass replaced that with a ranked, evidence-backed set:

| Query family | Verdict | Score |
|---|---|---|
| `charger property management hillsdale mi` (brand defense) | Win trivially | 10/10 |
| `property management hillsdale mi` | Win — local-pack game | 9/10 |
| `hillsdale college off campus housing` | Win — nobody has built the page | 8/10 |
| `houses for rent hillsdale mi` + `by owner` / `craigslist` modifiers | Local pack and long tail only | 5/10 |
| `homes for sale hillsdale mi` | **No** — no IDX, six entrenched brokerages plus every portal | 2/10 |
| `sell my house fast hillsdale mi` | **No** — zero autocomplete across three phrasings; the query does not exist | 1/10 |

The sharpest wedge is the **`by owner` / `craigslist` modifier set**: users explicitly routing
around portals to reach an actual landlord, which is exactly what Charger is. Supporting that:
Zillow lists only 4 to 5 rentals in all of Hillsdale, while Charger holds ~13 Michigan doors,
so a complete inventory page is genuinely a better resource than the portal page it would rank
beneath.

---

## Gap questions for Jake (ordered by leverage)

**Q1 — Shavit's registered business address.** Unblocks the two highest-value levers at once:
the Google Business Profile (32% of local-pack weight per Whitespark 2026, currently
unclaimed) and the `PostalAddress` on the `LocalBusiness` node. Must match the "Charger
Property Management LLC" Michigan registration exactly and must not be guessed. Two research
findings raise the stakes: Google will not verify a PO Box or virtual office, and 2026
verification is video-first (live capture, unedited, single take, 30 seconds or more, showing
permanent signage and proof of access). So this needs a **real, staffed, signed Hillsdale
address**, not a mailbox. Has Shavit provided it, or does it go on the next ask-list?

**Q2 — Per-listing pages: in or out?** Per-city pages are clearly in. Giving each of the 16
listings its own URL is the change that unlocks address-level queries and lets the existing
`Apartment` schema carry a real canonical instead of a `#home-{id}` fragment. The
tax-reassessment rule was about not enumerating all ~40 managed homes, and these 16 are
already public on the homepage, so I read this as permitted. Confirming before building.

**Q3 — Hillsdale College student housing.** Memory records this as needing Shavit's explicit
OK. Research says it is the best content opportunity available: ~1,649 undergrads with roughly
30% (about 495 students) off campus in a town of ~8,000, all four query variants autocomplete,
and what ranks today is a stack of thin aggregator shells. **Timing is hard:** off-campus
applications are due February 1, so search peaks December through February and the page must
be live and indexed by November. Charger already has a 6-bed in inventory, which is a student
house whether or not it is marketed as one. Approved, or still parked?

**Q4 — The brand collision, and whether to lead with "Shavit Rootman" in Hillsdale.**
Charger Properties of Flushing MI (~4,000 units, unrelated) sits at 2.3 stars across 86
reviews, and `charger properties reviews` already autocompletes. A prospective Hillsdale
tenant who hears "Charger" and searches it lands on a different company with a reputation
problem. `shavit rootman` returns zero autocomplete suggestions, meaning a clean slate. Does
Shavit want the consumer-facing Hillsdale brand to be "Charger Property Management — Hillsdale"
or "Shavit Rootman"? This is a positioning call, not a technical one.

**Q5 — The 805 phone number.** The site's only conversion path is a California area code on a
Michigan local business. That is an NAP consistency and trust liability for GBP and for
tenants. Is a Michigan number obtainable, or is 805 fixed?

**Q6 — Who owns the Google Search Console property?** The only free source of real query data,
and the only way to confirm the `/company/` indexation claim.

---

## Deferred (recorded as non-goals, not gaps)

- Blog / content programme — out. No committed author, and the market is too small to repay it.
- Cleveland OH and Larchmere pages — out until Shavit confirms which of the 7 Ohio addresses
  are listable and there is available inventory. The term `larchmere` does have real
  autocomplete volume, so this is a timing call, not a permanent no.
- `sell my house fast` / `we buy houses` — out. Zero search demand, verified across three
  phrasings. Build it for direct or paid conversion if wanted, but not as an SEO target.
- `homes for sale` / brokerage queries — out. No IDX feed, no brokerage licence, no leverage.
- Rank-tracking and keyword-research tooling — out. Volume is too low for the APIs to return
  meaningful data; GSC covers it free.
- OpenSEO / DataForSEO — out unless Jake wants to fund a key for other projects.

---

## Tightened prompt (hand-off to stage 3)

> Raise organic visibility for shavitrootman.com in Hillsdale, Michigan first and South Bend,
> Indiana second, by fixing the site's information architecture rather than by adding tooling.
>
> The site exposes three indexable URLs and zero city pages, so there is nothing for a local
> query to rank, and every listing is a `#fragment` so address-level queries are unwinnable by
> construction. Build per-city routes (Hillsdale MI, then South Bend IN; Cleveland is excluded
> until inventory exists) and one URL per listing, each prerendered by `vite-react-ssg` with a
> unique title, meta description, canonical, and a single `<h1>` carrying the city or address.
> Rewrite the homepage `<title>` so it targets the market rather than the brand. Repair the
> canonical-versus-trailing-slash mismatch so `/meet/` and `/accessibility/` declare the URLs
> that actually serve them, correct `gen-sitemap.mjs` to match, and add a `/company` redirect.
> Point the existing `Apartment` schema entities at their new real URLs, add `FAQPage` over the
> 16 existing Q&A pairs and `BreadcrumbList` on city routes, and add `PostalAddress` to the
> `LocalBusiness` node as soon as Shavit confirms the registered address. Cut homepage image
> weight (3.27 MB of JPEG, zero WebP/AVIF) and drop the 2.9 MB unreferenced `hero.mp4` and
> 972 KB unreferenced portrait PNG still shipping in `dist/`. Instrument click-to-text and
> click-to-call events, because with no forms there is currently no conversion tracking at all.
>
> Target the query families research scored as winnable: brand defense, `property management
> hillsdale mi`, `hillsdale college off campus housing`, and the `houses for rent hillsdale mi
> by owner` long tail. Do not target `homes for sale` or `sell my house fast`; both were
> measured and rejected.
>
> Honor every standing content rule as a hard gate: two buckets only, never enumerate all ~40
> managed homes, no rents in visible copy, year-level ETAs, SMS-only CTAs, no forms, no
> gate-banned holding-company strings, and no guessed NAP.
>
> Install `unlighthouse` for per-route Lighthouse measurement and wire `linkinator` into the
> build as a link-regression guard. Install nothing else from the GitHub SEO ecosystem;
> specifically not OpenSEO (requires a paid DataForSEO key and returns nulls at this search
> volume) and no traffic generator under any circumstances.
>
> Done is defined by `accept-seo.sh` exiting 0 against built `dist/`, asserting: no sitemap URL
> redirects, every canonical self-consistent, each city and listing route prerendered with
> unique metadata and one correct `<h1>`, every schema `@id` a real URL rather than a fragment,
> JSON-LD parsing and validating, zero gate-banned strings, and no oversized listing images.
> Rankings are explicitly not an acceptance criterion. Deliver the code changes, the acceptance
> script, an annotatable HTML spec, and a separate short list of the non-code actions only
> Shavit or Jake can take — of which claiming the Google Business Profile is the single highest
> ROI item in the entire engagement.
