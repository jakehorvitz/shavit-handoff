# Shavit Rootman — Long-Form Brand Films · Reference Notes

Two horizontal (1920×1080, 30fps) brand films built entirely from existing local assets
(no AI/Higgsfield generation). Research conducted June 2026.

## Reference patterns drawn on (current best practice)

1. **Hook in the first 3 seconds.** The opening 3 seconds decide whether a viewer stays.
   Both films open on a single high-contrast hero beat (cold "before" or a hard wordmark
   stinger) instead of a logo-then-slideshow ramp. *(Luxury Presence; Placester)*

2. **Cinematic, story-driven pacing — not a slideshow.** Dynamic pacing, professional
   transitions and a film-like feel. We use beat-synced cuts (librosa downbeat detection),
   Ken-Burns push/pan on every still, micro-zoom "bumps" on the beat, and a variety of
   shot scales (full-frame hero ↔ collage grid ↔ split) so no image sits static.
   *(Bright-Shot; Fotober "Real Estate Cinematic Video Editing 2026")*

3. **Color grading sets emotional tone.** Warm tones for the finished, lived-in homes
   (comfort/luxury); cool, desaturated grade for the "before"/gutted footage. The
   before→after ghost-dissolve is the emotional payload of the whole brand. *(Fotober; Hitech)*

4. **Transition vocabulary that simulates motion.** Crossfades, match/whip cuts, slides,
   speed-ramps and beat-synced transitions; combined with pans/tilts/dolly to feel like
   you're moving through the property. Video 1 uses xfade/slide/zoom/punch + grid reveals;
   Video 2 uses wipes, masked card reveals and type-driven cuts. *(Bright-Shot; Reel-E)*

5. **Kinetic typography = pacing mechanism, not decoration (no-voice piece).** Animate the
   key word, not everything; phrases over paragraphs; one or two typefaces; high contrast;
   motion must *resolve quickly* and clarify hierarchy rather than delay meaning. Video 2 is
   built on this: bold uppercase Inter/Helvetica, word-by-word rise-ins, brass underscores,
   counters that tick to the numbers. *(Digital Silk; IK Agency; Wyzowl — kinetic typography 2026)*

6. **Intro/outro conventions + manifesto framing.** Manifesto films set tone fast with
   restrained type and land on a clean brand wordmark. Both films close on the same
   signature: the gold house-mark drawing on, "SHAVIT / ROOTMAN" wordmark, twin brass
   rules, "REAL ESTATE, OPERATED." caption, slow push-in. *(Genesis Motion; Digital Silk)*

## How each film applies them

### Video 1 — THE COLLAGE (music-led, minimal text)
Energetic portfolio montage. Mixes full-frame hero shots of the 10 portfolio properties
with collage/grid moments (2-up, 3-up, 4-up tiles that pop in on the beat) and rapid
before→after reveals from the four transformation sets. Beat-synced motion throughout;
text is minimal — just light property tags and the recurring brand line. Three-state
geography (MI/OH/IN) and the portfolio scale ($12M+, 50 doors) appear as quick flashes.
Ends on the Shavit outro.

### Video 2 — CAPTIONS + ANIMATION (no voice)
Editorial brand manifesto. No voiceover — the story is told through bold animated
typography over the imagery. Structure: cold open → the thesis ("Most people see a
write-off. We see a home.") → the playbook (BRRRR, three states, one crew) → the proof
(animated counters: 50 DOORS / $12M+ / 200 BY 2030) → the mission ("Building communities,
profitably." / second-chance housing) → Shavit outro. Slower, designed, wipe/mask
transitions, brass underscores, kinetic word-by-word reveals synced to the bed.

## Brand tokens honored (from design-system/colors_and_type.css + HomePage/CaseStudies)
- Canvas **black** #000000; text **white** #FFFFFF; **BRASS** #B08D57 (rules/underscores only);
  **GOLD** #FFC000 used as the wordmark/house-mark accent in motion.
- Bold **uppercase Inter/Helvetica**, tight tracking; thin brass divider as the signature.
- Claims: *Building Communities, Profitably* · 50 doors today, 200 by 2030 · $12M+ portfolio ·
  Michigan / Ohio / Indiana · BRRRR done differently · acquires overlooked housing,
  transforms it into long-term homes · second-chance housing.

## Tech
Python + PIL piped raw RGB to bundled ffmpeg (`imageio_ffmpeg`), libx264, crf 20, yuv420p,
+faststart, 1920×1080@30. Audio bed built by sequencing/crossfading the four ~20-24s music
clips (acrossfade) into a ~150s bed; librosa 0.11 beat-tracking drives the beat-sync.

## Sources
- Luxury Presence — Everything You Should Know About Real Estate Videography in 2026
- Placester — 21 Best Real Estate Videos Every Agent Should Watch in 2026
- Bright-Shot — Master Real Estate Video Editing in 2026
- Fotober — Real Estate Cinematic Video Editing Tips and Guide 2026
- Hitech Digital — Real Estate Video Editing Trends
- Reel-E — Best Real Estate Video Editors / Makers 2026
- Digital Silk — Kinetic Typography in 2026: Examples, Patterns & UX Risk
- IK Agency — Kinetic Typography: Complete Guide to Motion Text Design 2026
- Wyzowl — Kinetic Typography: 50+ Video Examples
- Genesis Motion Design — What Is Kinetic Typography? A Practical Guide for Brands
