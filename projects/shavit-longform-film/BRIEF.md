# Shavit Rootman — The Definitive 60-Second Brand Film
## Stage 1 — Brainstorm + Interrogation Brief · 2026-07-02

**Mission:** Produce THE long-form (~60s) brand film for @shavitness — the pinned
brand video Shavit asked for — at the highest possible design/branding quality,
honoring every request he's made across the 5/22 and 7/2 meetings. Jake posts;
this pipeline designs, builds, and stages it.

---

## 1 · What Shavit has actually asked for (his requests, on record)

From the 5/22/26 meeting notes (Google Doc) + memory:
- **Pinned long-form brand video** on the profile — "preferred pinned brand video" (28:50)
- **Strong brand message** — reputation, not lead-gen; impressions + engagement
- **Uniform colors matching the website** (36:34) — live site system = black canvas,
  white type, BRASS #B08D57, GOLD #FFC000, uppercase Inter
- **Watermark OK · NO pulsing logo** (36:34)
- **Templated / scalable formats** — multiple posts must be producible from the same system
- **Soft ramp** — 2–3 posts/week ceiling; this film is the anchor, not a virality play

From the 7/2/26 meeting (Website Notes doc) — three real stories with stakes:
- **17 Lo Presto:** full revamp, off-market referral, replaced everything, fully
  rented — *revived the street; neighbors now want to get involved*
- **46 W South (Airbnb):** the bank manager two houses across the street watched
  the rehab and asked him to buy HER house too — seller-financed
- **The Trio:** a buyer found the portfolio online and wanted all four at once

## 2 · New material state (verified 7/2)

- Shavit built a **property library in the shared Drive** this morning:
  Michigan / Ohio / Indiana → "Ongoing/New" + "Past Projects" → ~18 named property
  folders (43 Howder, The TRIO, 60 S Norwood "local luxury", 15 E Saint Joe,
  17 Lo Presto, 46 W South, 34 Budlong, 13 W South, 68 S West, 1114 Cedar,
  1902 E Ewing, 2217 Parkview, 514 E Victoria, 1919 Kendall, 3461 W 129th,
  3220 Clarendon, 13087 Cedar, 12112 Buckingham, 2677 E 126th).
- **⚠ The leaf folders are currently EMPTY** — structure only; media not yet
  uploaded (or not yet shared through). Cannot count on new footage today.
- **Existing local assets:** both prior films (`Shavit — Long Form 1 (Collage).mp4`,
  `Shavit — Long Form 2 (Captions).mp4`), all reels, and raw imagery in
  `~/Desktop/Shavit*` folders (iCloud hazard — copy into this project first).
- The original Python/PIL/ffmpeg generator scripts were **not preserved** — the
  render pipeline gets rebuilt (cleanly, versioned, in this repo — so it becomes
  the reusable template system Shavit asked for).

## 3 · Hormozi-brain findings applied (consulted 7/2)

| Principle | Application to this film |
|---|---|
| Hook = highest leverage; 80% decide in 3s | Cold-open on the most brutal "before" (boarded-up Lo Presto/E Saint Joe frame) + open loop line. NO logo intro. Spend disproportionate iteration on the first 5 seconds; cut 3–5 hook variants and test. |
| Hook–Retain–Reward; "too boring, not too long" | Open loop in second 1 ("Everybody drove past this street."), resolve it at ~50s (the street revived, neighbors asking in). Retention via story chapters + beat-synced reveals. |
| Proof · Promise · Plan in the opening | Proof flashes early: 50 DOORS · 3 STATES · $12M+ (animated counters). |
| Stakes + specificity beat generic | Use the three REAL 7/2 stories — the banker asking him to buy her house is the single strongest social-proof beat we have. Specific addresses, specific outcomes. |
| Content IS the targeting; niche converts | Audience = lenders, partners, sellers, tenants — not entertainment. Validates the agreed "reputation, not virality" posture. Measure by profile taps/DMs, not views. |
| "How I" > "how to"; lived experience | The film documents what Shavit DID (down to the studs, in-house crews), not real-estate platitudes. |
| Systematize social proof | The neighbor/banker beats are lifecycle proof — bake them in as on-screen text, and design the template so every future finished property can become a 15s "chapter" (scalability Shavit asked for). |

## 4 · Proposed creative direction (v3 — "The Street That Came Back")

A ~60s story-led hybrid of the two prior films: Collage's beat-synced full-bleed
imagery + Captions' kinetic typography. No voiceover. Structure:

| Time | Beat | Content |
|---|---|---|
| 0–3s | HOOK | Hard cut to worst "before" frame. Type: "EVERYBODY DROVE PAST THIS STREET." |
| 3–12s | PROOF | Rapid before→after ghost-dissolves + counters: 50 DOORS · MI OH IN · $12M+ |
| 12–45s | RETAIN | 3 chapters, ~10s each: Lo Presto (street revival) → 46 W South (the banker across the street) → The Trio (buyer wanted all four). Each: before → transformation → one line of type with the stake. |
| 45–54s | REWARD | Loop closes: the street today, fully rented. "SAME HOUSES. NEW STANDARD." → "Building communities, profitably." |
| 54–60s | SIGNATURE | Gold house-mark draw-on, SHAVIT / ROOTMAN wordmark, twin brass rules, "REAL ESTATE, OPERATED." Slow push-in. Static mark — no pulse. |

**Brand tokens (locked):** #000 canvas · #FFF type · BRASS #B08D57 rules/underscores ·
GOLD #FFC000 mark accent · uppercase Inter, tight tracking · watermark corner mark.

**Deliverables:** master + per-platform exports (9:16 IG reel/pinned, 16:9
YouTube/site/LinkedIn, 1:1 or 4:5 feed as needed) rendered from ONE versioned
template system — the scalable format Shavit requested.

**Render stack:** rebuilt Python/PIL/ffmpeg pipeline (proven approach from v1/v2)
with librosa beat-sync; assets copied out of iCloud into `assets/` here.

## 5 · Risks / open decisions

1. **Footage gap:** Shavit's folders are empty. Build now from existing assets and
   re-slot new footage when he uploads? Or wait? (→ Jake, stage-2 question)
2. **Story rights:** the banker story is told publicly — confirm Shavit is
   comfortable with it on-screen (keep it anonymous: "the bank manager across
   the street," no name). Flag at spec review.
3. **Format priority:** vertical-first vs horizontal-first master. (→ Jake)
4. **Music:** RF/AI bed (safe everywhere, like Reel 2) vs trending in-app sound
   (IG reach, can't bake in). Recommend RF bed baked into master + posting note.
