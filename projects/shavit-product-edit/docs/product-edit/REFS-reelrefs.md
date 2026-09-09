# REFS — reelrefs lane (reference reels & motion pieces for two 9:16 Shavit Rootman reels)

Researched 2026-08-16 (`reelrefs` lane). Deliverable per BRIEF-reelrefs.md:
**Part 1** = a product-showcase edit *of shavitrootman.com itself* (site inside device frames,
scroll-reveals, kinetic type, the 1919 Kendall before/after wipe as hero beat, ends on the URL).
**Part 2** = the 1919 Kendall rebuild in cinematic-website style (before/after wipes, pinned
chapters, counting numbers), website as end card.

## How this was verified (read before trusting any row)
- **Instagram is login-walled to tooling.** `instagram.com/<studio>/` and `/reels/` return a
  600 KB login shell with no `og:` tags; Instagram oEmbed needs an app token. So **no Instagram
  URL below is marked verified.** Where a studio's reel work is only on IG, I say so and cite
  their Vimeo / Dribbble / Behance / own-site video instead.
- **Vimeo:** direct pulls are blocked (player config 403, yt-dlp OAuth 401), so each Vimeo piece
  was opened in headless Chromium, the `<video>` seeked to 8 evenly spaced timestamps and
  frame-grabbed. Duration/dimensions/title come from the player. Instrument's library is
  *unlisted* — the `vimeo.com/<id>/<hash>` form below is required.
- **YouTube / direct mp4 / HLS:** downloaded at ≤480p with yt-dlp / ffmpeg, then an 8-frame
  contact sheet (hook → middle beats → end card) was made with ffmpeg and looked at. "What
  happens over time" is written from those sheets, not from memory. Upload dates from yt-dlp.
- **Dribbble** shot pages sit behind an AWS WAF challenge for curl; opened in the browser to
  read the description and pull the `large-*.mp4`. Dribbble does not print dates; years are
  estimated from shot-ID ranges and marked "≈".
- **Not reachable / not mined:** FWA (JS-only, `/awards/*` → 500), Awwwards "Motion"/"Video"
  showcase (not attempted — Awwwards 502'd for most of the previous lane), OFF+BRAND
  (itsoffbrand.io — TLS/connection failure both bare and www; their reels are IG-only),
  Buzzworthy (site + Behance/Dribbble/IG links open, but their Dribbble motion is 2018–21 and
  Behance is JS-rendered), TFTL (tftl.co is a JS shell, IG-only for reels), Outpost
  (outpost.studio resolves to a 2 KB "Web Developer" page — likely not the studio the brief
  meant; could not identify a canonical domain).

Register key used in the "Fit" column: black canvas · white uppercase Inter · gold #FFC000
rules · real photos only · no generated property imagery · no digit-leading addresses on
screen · no pulsing logo · calm not viral.

---

## A. Website / product "site-as-video" pieces (Part 1 references)

### 1. Instrument — "Oura Ring Website Case Study | Hero Video" (20 s, 1920×1080, 2025-01)
- **URL:** https://vimeo.com/1043751061/bddb44ead9 (unlisted; embedded at https://www.instrument.com/) · **Maker:** Instrument (Portland) · **Where found:** instrument.com case-study embeds → Vimeo oEmbed · **Verified:** yes — browser frame-grab.
- **Over time:** 0–3 s a single centred browser frame of the ring on cream; then it pulls back to reveal a **wall of ~20 site modules** laid out as a mosaic (hero, "Made for you", membership cards, "Built for accuracy", spec table); the camera pans/pushes between tiles ("your body a zone", the dark checkout card) and settles. No end card in the clip (it's a case-study hero loop).
- **Technique:** flat 2D "mosaic wall" of screen captures with camera moves (no device frames), soft shadows between tiles, colour-matched backdrop. Silent.
- **Why it works:** shows *breadth* of a site in 20 s without a single scroll capture; every module reads as a designed object.
- **Fit:** high for Part 1 mid-section (our modules on black with gold hairlines instead of cream). Calm by construction.

### 2. Instrument — "Shutterfly_Mobile_Scroll" (32 s, 1920×1080, 2025-06)
- **URL:** https://vimeo.com/1097625886/589f7dc0d2 (unlisted) · **Maker:** Instrument · **Where found:** instrument.com embeds · **Verified:** yes — browser frame-grab. Sibling: "Shutterfly_ tablet_scroll" https://vimeo.com/1097608043/4444d639be (9 s).
- **Over time:** an upright **3D iPhone standing on a warm wooden table**, sunlit doorway bokeh behind; the site scrolls slowly on the screen while the phone drifts/rotates a few degrees; ~30 s later it lands back on the hero (loopable). No type, no end card.
- **Technique:** Rotato/Blender-style device render composited over a real lifestyle plate; screen = long scroll capture; shallow DOF.
- **Why it works:** the "phone in a real room" makes a website feel like a physical product; the loop is patient.
- **Fit:** medium — needs a black-canvas variant (device on black, no lifestyle plate) to match register; the slow-scroll pace is right.

### 3. Instrument — "Blackspace – Laptop Mockup" (12 s, 2160×1440, 2023-01)
- **URL:** https://vimeo.com/792063502/2879ece700 (unlisted) · **Maker:** Instrument · **Verified:** yes — browser frame-grab. Same family: "Nike-com Desktop – Landing – Scroll" https://vimeo.com/824235671/db1ef0da91 (7.7 s, 2023-05).
- **Over time:** static 3D laptop on a wooden desk, plain wall; site sections **cut** (not scroll) every ~2 s — colour-blocked pages (dark red → green → yellow → FAQ → dark red).
- **Technique:** static device frame + hard cuts between full-page states. Cheapest device-frame move there is.
- **Fit:** high for a 3-second Part 1 beat ("the site has range"): laptop on black, four hard cuts.

### 4. basement.studio — Daylight showcase hero (34 s, 1916×952, 2024)
- **URL:** https://cdn.sanity.io/files/9syto90m/production/524af718bd3823aa61b6d7c37b076a7781b39771.mp4 (hero video on https://basement.studio/showcase/daylight-simplicity-in-motion) · **Maker:** basement.studio · **Verified:** yes — direct mp4, ffmpeg contact sheet.
- **Over time:** 0–3 s "Magic. Paper. Computer." hero with the device on a desk; then a **plain full-frame browser capture** scrolling the whole page at a steady pace (Founders Edition card, "Super-fast — like E-Ink, but better", outdoor photos, "Intentional simplicity" trio, "Display / Software / Device" wordmarks) and ends on the **spec table**. Silent, no device frame, no overlays.
- **Technique:** raw screen capture, browser chrome cropped, constant scroll velocity.
- **Why it works:** proof that a top studio presents an award site as *nothing but the site*; the site does the talking.
- **Fit:** high for Part 1's spine (our own scroll capture, cropped, on black). Note it's 16:9 — we'd letterbox inside 9:16 or re-capture at phone width.

### 5. Unseen Studio — "Crosswire Launch Video" (24 s, ≈2023)
- **URL:** https://dribbble.com/shots/21677281-Crosswire-Launch-Video (large mp4: https://cdn.dribbble.com/userupload/7644665/file/large-937f1eaf0fa4228a7a87572fb9de3cbe.mp4) · **Maker:** Unseen Studio (Bristol) · **Where found:** dribbble.com/unseenstudio · **Verified:** yes — shot page opened in browser ("A little video we put together to promote the launch of Crosswire's new website"), mp4 stripped.
- **Over time:** 0–3 s laptop on a purple/orange **3D block set** with the hero ("The next generation identity OS") on screen; site scrolls; the set's blocks slide; **hard cut to a full-black card "UPDATES 07"** inside the laptop; then two phones float in the same 3D world showing mobile pages; camera orbits; out.
- **Technique:** C4D/Blender device renders inside a brand-coloured abstract set, screen-capture textures, one interstitial type card.
- **Fit:** medium — production is heavier than we need; the "type card inside the device" beat is stealable.

### 6. Unseen Studio — "Organimo Showcase" (16 s, ≈2025, with audio)
- **URL:** https://dribbble.com/shots/25224217-Organimo-Showcase (large mp4: https://cdn.dribbble.com/userupload/17676667/file/large-b8a757823b05185943c79b49179d2ae4.mp4) · **Maker:** Unseen · **Verified:** yes — browser + strip. Related: "Unseen Studio Website Showcase" https://dribbble.com/shots/20408624-Unseen-Studio-Website-Showcase (21.5 s, ≈2023, audio) and "Knucks 24 Screens" https://dribbble.com/shots/23467260-Knucks-24-Screens (6.8 s, ≈2024).
- **Over time:** 0–3 s laptop in an underwater/coral 3D set → **cut to flat browser frames floating on a dark violet field**, sliding/tilting slightly ("The only natural multivitamin…", "Bladderwrack" product page, "You are limitless") → fades to underwater.
- **Technique:** device open → flat floating frames on dark field (no device) → atmospheric close. Sound-designed.
- **Fit:** high for the *flat frames on dark* portion (that's our register almost exactly: dark field, white type, frames sliding).

### 7. Vide Infra — "VI Short Showreel" (12 s, 1920×1080, 2022-08)
- **URL:** https://vimeo.com/736806402 (embedded on https://videinfra.com/) · **Maker:** Vide Infra (real-estate-heavy web studio) · **Verified:** yes — oEmbed + browser frame-grab. Newer, same idea: "AVA Group Corporate Website" https://dribbble.com/shots/26643343-AVA-Group-Corporate-Website (two ≈9–11 s mp4s, ≈2025–26; flat laptop on navy, wireframe-building hero loading in; developer/holding client).
- **Over time:** **black field, one 3D laptop tumbling slowly in space**; a new site loads on the screen every ~1.5 s (light-streak hero, "6-7-8" residences, "Wellness", "500" counter, "Azure Projects", "SERVICES", orange "FOLLOW ART") — 8 sites in 12 s.
- **Technique:** single rotating device on black, hard cuts of screen content, no type outside the device.
- **Fit:** very high on register (black, restrained) — but 2022 and 16:9. The pattern is the point.

### 8. Linear — "Introducing Linear Releases" (30 s, 2026-04-30)
- **URL:** https://www.youtube.com/watch?v=6dIwFoQ0eVg · **Maker:** Linear (in-house) · **Where found:** youtube.com/@linear uploads · **Verified:** yes — yt-dlp + strip. Sibling: "Announcing Linear Reviews" https://www.youtube.com/watch?v=4r8YmQ6lfLo (26 s; macro tilted code diff with CRT glow → serif "Think diff" → "Code reviews / Available soon in Linear" → logo).
- **Over time:** 0–3 s black canvas, thin white **branch-lines with issue IDs (MOB-9124, ENG-9833)** as data-graphics; 3–15 s the lines resolve into three tilted UI panels ("Mobile app / Production") in shallow DOF; 15–25 s single monospaced word typing with a block cursor "REL▌"; **end card "AVAILABLE NOW▌"** on black. Sound-designed clicks.
- **Technique:** UI panels as 3D cards, monospaced uppercase kinetic type with cursor, black field, no device frame, no faces.
- **Why it works:** the closest thing to Shavit's register in the wild — black, white uppercase, calm, data as texture.
- **Fit:** highest of all for Part 1 type beats and the end card ("SHAVITROOTMAN.COM▌").

### 9. The Browser Company — "Introducing Live Folders in Arc" (30 s, 2024-04-11)
- **URL:** https://www.youtube.com/watch?v=x1TV6rBi_jM · **Maker:** The Browser Company · **Verified:** yes — yt-dlp + strip.
- **Over time:** talking-head open (skip for us) → **macro-lens shots of a real screen** ("Create pull request", "Submit review") with tilt and moiré → **full-frame single-word card "AUTOMATICALLY"** in white uppercase on solid blue → hands typing → end card "THANK YOU TO ALL WHO HELPED BETA TEST" over the keyboard.
- **Technique:** filmed screen (macro), full-frame single-word uppercase cards, physical device close-ups.
- **Fit:** the *word-card* beat is a direct fit (white uppercase on black, gold rule instead of blue). Talking head and faces are out.

### 10. Apple — "The all-new MacBook Neo" (36 s, 2026) / "Introducing AirPods Pro 3" (48 s, 2025-09-09)
- **URLs:** https://www.youtube.com/watch?v=bg3iEHHTGtQ · https://www.youtube.com/watch?v=EMmKs8vMKhU · **Maker:** Apple · **Verified:** yes — yt-dlp + strip.
- **Over time (Neo):** white studio, hands slide the laptop in, lid opens to **screen-filling type "Hello Neo"** on a gradient, then Messages/Photos UI mirrored on iPhone, stickers, hands close it. AirPods = product film, no UI.
- **Technique:** real hardware handled by hands; **type as screen content**; product cuts to a beat.
- **Fit:** low on register (white, playful, people) — kept as the canonical "device with type on screen" benchmark only.

### 11. Framer — "Ship websites with enterprise needs, at startup speeds" (33 s, 2026-03-05)
- **URL:** https://www.youtube.com/watch?v=ji8VijpvrBA · **Verified:** yes — strip. **Verdict:** brand film (city, giant "Publish" button, Earth, light streaks) — *not* a UI-on-screen edit. Listed so it isn't re-chased. Same for Vercel (@VercelHQ is conference talks) and Notion (nothing under 100 s in the last 40 uploads).

## B. Real-estate / architecture / renovation reels (Part 2 references)

### 12. The Local Project — "How incredible is this warehouse transformation?!" (32 s, 9:16, 2024-10-28)
- **URL:** https://www.youtube.com/shorts/4_9MoKvq1uE · **Maker:** The Local Project (AU) · **Where found:** youtube.com/@thelocalproject/shorts · **Verified:** yes — yt-dlp + strip.
- **Over time:** brick façade detail → timber cladding macro → street tree/street front → person entering → interior model tables → lit stair void → meeting rooms; **centred white sans captions** ("There'd been no love", "And we demolished", "that is seven meters") carry the architect's voice-over; ends on the interior, no card.
- **Technique:** slow gimbal, 2–3 s shots, centred captions at ~40 % height, no wipes, no music stings.
- **Fit:** very high on *tone* for Part 2 (real footage, calm, uppercase-able captions). It's a "transformation" told by voice + captions, not by wipe — pairs with #16 for the wipe.

### 13. NEVER TOO SMALL — "Small Paris Apartment Transformation With Hidden Home Office" (44 s, 9:16, 2026-07-03) & "Former Shopfront Transformed Into Home…" (46 s, 2026-07-10)
- **URLs:** https://www.youtube.com/shorts/NQDhfw_sD4g · https://www.youtube.com/shorts/v1CVcpzy8FU · **Maker:** Never Too Small · **Verified:** yes — strips.
- **Over time (Paris):** entry hall → dark stained-ply joinery reveal → person opening the glass office door → shelf detail → **process inserts** (sanding a sample board, swatches on the floor) → back to the finished wall; lower-third white captions ("We use a cerusing process to add the paint").
- **Technique:** finished-space first, then process inserts, then finished; captions bottom-third; natural sound + light music.
- **Fit:** high for Part 2 structure (result → how → result). People appear (their format), we'd cut them.

### 14. Brownstone Boys — restoration short (28 s, 9:16, 2026-05-01)
- **URL:** https://www.youtube.com/shorts/WXw-3GJNtZA · **Maker:** Brownstone Boys (Brooklyn) · **Verified:** yes — strip.
- **Over time:** **opens on the finished restored shutters**, then heat-gun paint stripping close-ups, gloved hands, the bare wood, ends back on the shutters with the owner admiring; small serif caption ("remembering these were never meant to be painted").
- **Technique:** reveal-first, process-middle, reveal-end; handheld; caption in serif.
- **Fit:** medium — structure is right for Kendall; the handheld/vlog texture is warmer than our register.

### 15. Studio McGee — "You'd Never Guess This Reveal Is in Just Three Weeks" (53 s, 9:16, 2026-06-09)
- **URL:** https://www.youtube.com/shorts/iaBhkr2P0tY · **Verified:** yes — strip. Reveal-format short from a high-end reno brand; talking-to-camera + room reveals. Included as the mainstream "reveal" baseline; register too bright/social for us.

### 16. Neoscape — Aviator House film clip (10.7 s, 2026-05)
- **URL:** https://neoscape.com/wp-content/uploads/2026/05/aviatorhouse_film_clip_1.mp4 (on https://neoscape.com/) · **Maker:** Neoscape (real-estate visualisation/film) · **Verified:** yes — direct mp4, strip.
- **Over time:** low-angle façade → top-down corner → **hard cut to a solid orange card** → the card irises/wipes open onto the street elevation → café terrace.
- **Technique:** **solid-colour card wipe / iris** between chapters. (Imagery is CGI — technique carries, imagery does not.)
- **Fit:** the wipe itself is a direct fit if the card is black or a gold #FFC000 rule sweeping, not an orange slab.

### 17. DBOX — homepage reel #1 (60 s sampled, 1920×1080, silent)
- **URL:** HLS https://vz-d35dcbec-7c1.b-cdn.net/55edc32c-22e6-4a97-9d08-90647d303368/playlist.m3u8 (autoplaying on https://dbox.com/) · **Maker:** DBOX (NYC/London real-estate branding) · **Verified:** yes — ffmpeg pull + strip.
- **Over time:** a camera flies over a **tilted wall of tiles** — luxury development brands and their sites/brochures (Grosvenor Square, 200 East 83rd, 432 Park Avenue, One Thousand Museum, Park Avenue Armory) — tiles slide as it moves; no type outside tiles.
- **Technique:** mosaic wall (same as #1) applied to real-estate brand work.
- **Fit:** medium — proves the mosaic reads as premium *in property*; ours would be a 3×N wall of Shavit pages/photos on black. (Their reel #2 is sales-gallery footage — irrelevant.)

### 18. Sandega Project — "Before – After Cinematic Home Video" (59 s, 2022-12)
- **URL:** https://www.youtube.com/watch?v=kLSUaD_P_Xs · **Verified:** yes — strip. Linear before→during→after real footage of a small house (roof gone → block walls → plastered → white rooms), warm grade, no wipe. Modest; the honest low-budget baseline. Everything else in this search bucket ("before after wipe reel") was template spam — see gap note.

## C. Kinetic type / counting-number references
- **Regent University — "By the Numbers"** (15 s, 2019-08) https://www.youtube.com/watch?v=aKE3V2jRBfQ — verified strip; count-up numerals with unit labels, one stat per 2 s. Old, but the cleanest short "stat reel" the search returned. Our version: "1919 · 3 BED · 2 BATH · 2025" counting up on black in Inter, gold rule under each.
- Linear #8 and Arc #9 above are the kinetic-type references proper.

## D. How it's made (5 sources, all opened)
1. **Screen Studio** — https://screen.studio/ (macOS; auto-zoom, smooth cursor, device frames, 9:16 export). Official 45 s promo https://www.youtube.com/watch?v=7AnqbpeJoHc (2026-02-01, verified strip: "Smooth cursor animations, automatically", "Record and edit in the same app"). Use for: capturing shavitrootman.com scroll passes at phone width with a smoothed cursor.
2. **Rotato** — https://rotato.app/ · features https://rotato.app/features (3D device mockup animator; drop a screen recording onto an iPhone/MacBook, keyframe camera, export video). Use for: the Instrument-style device beats (#2, #3, #7) — set the scene to black.
3. **Jitter** — https://jitter.video/ · templates https://jitter.video/templates (browser motion tool; text reveals, 9:16 presets, exports mp4). Use for: kinetic uppercase type + gold-rule wipes + count-ups without After Effects.
4. **Remotion** — https://www.remotion.dev/ · docs https://www.remotion.dev/docs/ · Recorder https://www.remotion.dev/docs/recorder (React → video; programmatic count-ups, wipes, exact Inter typography, deterministic 9:16 render). Use if we want the reels generated from the same design tokens as the site.
5. **Scroll capture with a headless browser** — Playwright video recording https://playwright.dev/docs/videos and https://github.com/prasanaworld/puppeteer-screen-recorder (record a scripted `scrollTo` at fixed velocity → mp4 → ffmpeg). Use for: perfectly even scroll passes at 390×844 with no cursor, no chrome — then frame in Rotato/Jitter.
   - Editing tutorials found (verified metadata): "BEFORE And AFTER Wipe Transition Tutorial In Premiere Pro" https://www.youtube.com/watch?v=G-aj6Bj9HQw (45 s, 2023, 105 k views — strip verified: linear wipe with a soft edge); "How to Make Before & After Sliders in CapCut (FREE)" https://www.youtube.com/watch?v=eV7QmDITJYM (72 s, 2025-01); "EASY Animated Counting Number After Effects Tutorial" https://www.youtube.com/watch?v=RcQuyzCZxGk (60 s, 2024-03, 197 k views); "How To Create A Scroll Effect In After Effects" https://www.youtube.com/watch?v=IlyPkbsvW0c (39 s, 2025-08); template-genre example "Website Presentation Mockup Video – After Effects Template" https://www.youtube.com/watch?v=k2maqlyUuVw (27 s, 2020, 134 k views — the look to *avoid*: glossy, fast, generic).

---

## Top 3 for Part 1 (the site as product)
1. **Linear — "Introducing Linear Releases"** (#8) — the register match: black, white uppercase, monospaced cursor type, UI panels tilted in shallow depth, "AVAILABLE NOW▌" end card. Steal the structure: 0–3 s a hairline-gold grid drawing itself on black → three tilted frames of shavitrootman.com (home / listing / case study) → single-word cards ("MANAGED." "RESPONSIVE." "MIDWEST.") → end card "SHAVITROOTMAN.COM▌".
2. **basement.studio — Daylight showcase hero** (#4) — the spine: a clean, cropped, constant-velocity scroll capture of our own site (phone width for 9:16), letting the case-study before/after wipe on the page *be* the hero beat at ~12–18 s. No device chrome needed.
3. **Instrument — Oura hero mosaic** (#1) (with Vide Infra #7 as the black-canvas variant) — the breadth beat: pull back to a wall of our pages/photos on black, then push into the case study. Use Rotato only if we want one device shot; otherwise flat frames on black (Unseen #6's middle section).

## Top 3 for Part 2 (1919 Kendall, cinematic-website style)
1. **The Local Project — warehouse transformation** (#12) — tone and caption system: 2–3 s real shots, centred white captions, no music stings; tell Kendall as chapters ("BEFORE" / "DURING" / "AFTER" / "AVAILABLE") in uppercase Inter with a gold rule.
2. **Neoscape — Aviator House card wipe** (#16) + the Premiere wipe tutorial (D) — the before→after mechanic: a black card (or a gold hairline) sweeps across the *same-framed* before and after photo of each room; hold 1 s each side. Never a slab of colour bigger than a rule.
3. **Never Too Small — Paris transformation** (#13) with Brownstone Boys (#14) — the structure: open on the finished room, cut to 3–4 process inserts (real rehab photos), return to the finished room, count-up numerals (Regent, C) for the stats beat, website as end card.

## Gaps / assumptions (honest)
- No Instagram URL is verified (login wall). If Jake wants IG-native comps, the accounts most worth opening by hand are the studios' own: @basementdotstudio, @itsoffbrand, @buzzworthy.studio, @videinfra_com, @uns__nstudio, @lusionltd, @locomotivemtl (all links harvested from their sites) — unverified pointers only.
- The "before/after wipe" search on YouTube surfaced templates and low-quality flips; the *technique* references (Neoscape card wipe, Premiere/CapCut tutorials) are solid, a great real-photo wipe *reel* was not found on an open platform this session.
- Dribbble years are estimates from shot IDs (Crosswire ≈2023, Knucks ≈2024, Organimo ≈2025, AVA ≈2025–26).
- Contact sheets and ≤480p working copies live in this session's scratchpad (`strips/`, `vid/`), not the repo. No files under `site/` or `.bones/` were touched; nothing committed.
