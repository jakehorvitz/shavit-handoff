# Creative register: decisions and production lessons

Curated on 2026-09-08 from the Shavit-only section of `video-brain`, its source register, and the July 3 account baseline. This appendix supplies the early creative history and craft detail that the main handoff chronology and `shavit-pipeline/rules/brand.md` do not fully capture. It contains professional project guidance, not raw messages.

## How to interpret the archive

The source register is dated **2026-07-03**. A note marked “active” there means active in that register at that date. It does not automatically override a later project specification or client correction.

Classify each decision as a standing requirement, a note for a particular cut, or an inference adopted during review. Record its date, source, scope, status, and any replacement. The original system used `rule_type`, `status`, `applies_to`, `check`, `pass_example`, and `fail_example` fields, with `superseded_by` for retired rules.

The practical reason is visible in the history: the old navy/orange palette was retired; a ban on pans and zooms softened into a budget for limited use; music selections changed repeatedly; and previously approved financial copy was later removed. Do not promote a one-cut correction into a permanent restriction or treat a cached approval as approval of a later version.

Source: `arms/shavit/register-rule-typing.md`; `_atoms/shavit-register-source.md`.

## Early project direction

| Date | Recorded direction | Useful handoff distinction |
|---|---|---|
| May 22, 2026 | Build a strong operator brand, with a pinned long-form film, consistent website/feed colors, restrained watermarking, and repeatable formats. Evaluate reputation with relevant counterparties, impressions, and engagement. | The video work began as a reputation project. |
| June 18, 2026 | Begin with a light publishing ramp. | The two-to-three-post weekly ceiling was an operating choice, later preserved in pipeline rules; confirm any later schedule changes. |
| July 1, 2026 | Lock graphics to the live website’s black/white/brass/gold system, replacing the earlier proposal palette. Prepare a visible profile-remodel specification before changing the account. | Navy/orange designs are historical proposals. Profile-remodel decisions are not evidence that account changes were actually executed. |
| July 2–3, 2026 | Tighten asset provenance, identify camera-motion limits, simplify the story, improve phone-scale typography, and turn several observed export defects into repeatable checks. | These receipts explain why the render scripts and acceptance checks exist. |
| August 25, 2026 | The current pipeline’s later storytelling doctrine assigns the photograph the visible facts and the copy the reason those facts matter; avoid obvious image descriptions and unsupported competitor comparisons. | This later doctrine is already recorded in `projects/shavit-pipeline/rules/brand.md`; use it when interpreting earlier type-heavy concepts. |

Sources: `_atoms/shavit-register-source.md`; `arms/shavit/brand-tokens.md`; current `shavit-pipeline/rules/brand.md`.

## Craft details worth retaining

### 1. Accent colors have different jobs

The July graphics system used black `#000000`, white `#FFFFFF`, brass `#B08D57`, and gold `#FFC000`. Brass organized the composition through rules and underscores. Gold emphasized the mark and, at most, one important line per chapter. Treating both accents as interchangeable weakens hierarchy.

Palette checks were intended for generated graphic layers before they were composited over photographs. Natural photographic color cannot be expected to obey a four-color palette.

The note also recorded two delivery practices: create warmth with controlled split-toning rather than rotating the hue of the whole image, and use dithering where subtle brass/black gradients would otherwise band in 8-bit delivery. These are recorded craft practices, not newly verified tests of the archived outputs.

Source: `arms/shavit/brand-tokens.md`, as of July 3.

### 2. Camera movement should reveal depth without inventing the property

The settled July long-form rule allowed pans and zooms on stills for **no more than 20% of still-derived runtime**, limited to brief transitions or montage. The hook, chapter opening, and payoff were intended to receive the stronger movement treatment.

The remaining motion direction favored slow image-to-video movement anchored in real photographs, including movement between two real views of the same angle. Moving along a photographed axis is easier to keep faithful than turning around an unseen corner. Extending a crop is still invention if it adds architecture that the source photo does not show.

The original check proposed comparing an affine warp against the moving clip: simple translation/scale indicates a pan or zoom; residual parallax can indicate depth. The note required calibration against known examples before grading. Do not claim this test passed on a particular archive simply because the test is described here.

The 20% threshold belongs to the dated long-form specification. Later projects have their own timing and style instructions; preserve the lesson and scope instead of imposing it retroactively on all carousels and reels.

Sources: `arms/shavit/kenburns-motion-cap.md`; `arms/shavit/no-generated-architecture.md`; July 3 source-register changes.

### 3. The story should survive without reading every caption

The July long-form concept aimed for roughly thirty narrative words, with its own acceptance ceiling of thirty-five unique OCR narrative words. It called for one line per frame, a story that remained understandable with type hidden, and at least three moments of human activity or Midwest texture.

These were constraints for that film, not a universal word budget for September’s status-heavy recap. The useful editorial question is whether each line advances the story or merely labels what the viewer can already see. The August 25 pipeline doctrine later sharpened that distinction.

The reusable chapter was approximately fifteen seconds: establish the condition, show the work or transformation, and finish on the consequence or standard. A builder script and scene map were part of the deliverable, so the next property could reuse the system.

Sources: `_atoms/shavit-register-source.md`; `arms/shavit/templated-formats.md`.

### 4. Typography must work at actual feed size

One July 3 remaster note increased street-name tags by about 2.3 times after the earlier small, letterspaced tags failed on a phone. The register estimated the original cap height near 1.5% of frame height and used roughly 3% or more as a review signal afterward.

This is explicitly a note from one cut. The durable lesson is to review representative frames at phone size and after delivery compression. It is a legibility warning, not a universal measurement that should fail every later design.

A separate remaster correction softened the rebuild beat by retaining the positive rebuilt state without restoring the rejected negative framing. Preserve the intent when writing new copy; the source did not make that exact two-word choice a global law.

Sources: `arms/shavit/address-tag-scale.md`; `arms/shavit/rebuilt-caption-softening.md`.

### 5. Protect the payoff from an oversized ending

The July long-form film originally had too much tail after the final new information and a long black logo card. The revised treatment placed the signature over a dimming warm final image for roughly three seconds.

Its specific acceptance design sampled the final 2.2 seconds for unwanted black frames and independent logo motion. A single slow global push of approximately 4–5% was allowed; oscillating, pulsing, rotating, or breathing the mark independently was not. The watermark’s historic implementation was top-right at approximately 35% white, with one reveal and a static hold.

**Scope boundary:** the later July summary and August recap archive contain their own branded black-card assets. That is a different format history. Keep those designs and their approved specs; do not “fix” them merely to satisfy the older long-form ending prescription. The stable common principle is restrained, deliberate branding.

Sources: `arms/shavit/static-signature.md`; `arms/shavit/no-pulsing-logo.md`. Later-card boundary: main handoff chronology, Claude-Mem #14233.

### 6. Repeated images and mislabeled geography were real failure cases

An early state collage used a photo from one state in slots labeled as other states. The resulting correction required labels to match the actual photographed properties. A repeated property image also triggered a duplicate-image check.

Preserve semantic accuracy when building collages, thumbnail grids, before/after pairs, or state summaries. Similar-looking housing is not interchangeable source material. Duplicate checks are useful, but later explicit exceptions exist: the main handoff records exterior repetition when only one real exterior was available.

Sources: `arms/shavit/full-state-names.md`; `_atoms/shavit-register-source.md`.

### 7. Transition and exposure checks came from observed defects

The vertical remaster’s July 3 fixes included:

- Removing an overly dark late-film property shot.
- Using the intended ending caption once instead of twice.
- Ensuring each dissolve fully resolved before the scene ended.
- Removing abrupt visual snap-backs at boundaries.
- Removing a stray black frame.

Those defects became checks in `build_longform1_vertical.py` and `checks/qa_longform1_vertical.py`. Preserve the scripts and scene map with the media. The historical 29–34-second exposure check makes sense only with that cut’s timing; a later timeline needs corresponding checkpoints.

Source: `_atoms/shavit-register-source.md`, July 3 vertical-remaster notes.

### 8. Sound selection has a dated approval chain

July’s long-form music moved through several rejected or replaced choices before the brief settled on Midwest/Americana warmth with a polished, substantial feel. The register distinguished that direction from generic corporate music or an overt country-radio treatment. A holiday framing was specific to the July version.

A track’s presence in an old export or media library does not prove that it remains the preferred bed, or that its permitted uses were transferred with this handoff. Keep the cue, source, selected time range, version, and rights evidence together. The later Mead teaser’s own country/lo-fi experiments and export receipts remain separate project history.

Source: `_atoms/shavit-register-source.md`, July 3 music revisions.

## Production model and client review

The May–July operating design assumed **no more than about fifteen minutes of Shavit’s time per week**: crews would supply a fixed ten-shot finish-day set, production would work from reusable templates, and review would be consolidated. This explains the emphasis on source manifests, builder scripts, scene maps, and a small number of publication slots.

Hook variants were to be evaluated internally during review. The early plan avoided posting several public test versions because there was one pinned slot, limited posting capacity, and Insights had not yet been enabled. That is historical reasoning, not confirmation of the current account’s tools.

Each source asset was expected to have a provenance row naming the source and rights basis. Crop away desktop UI and incidental private information before a screenshot becomes a production plate. For any anonymous third-party anecdote, retain its generic presentation; do not add identifying places, addresses, employers, or financing details.

Sources: `arms/shavit/templated-formats.md`; `arms/shavit/posting-ceiling.md`; `arms/shavit/no-zillow-photos.md`; `_atoms/shavit-register-source.md`.

## Historical account baseline, not current analytics

The July 3 baseline note recorded approximately **5,054 followers and 57 posts** for `@shavitness`. The sampled recent material was primarily photo carousels with long renovation/deal-story captions. The note recorded roughly 78–116 likes and 26–86 comments for sampled posts, with little recent real-estate video.

Its interpretation was that the renovation stories already attracted detailed responses and could be translated into motion. That is an interpretation of a small historical snapshot. It is neither current performance reporting nor proof that a later reel outperformed a carousel.

Source: `arms/re-video/pattern-shavitness-baseline.md`, as of July 3; it cites `_receipts/shavitness.json`, which was not separately revalidated during this handoff pass.

## Source provenance

Read for this appendix:

- `/Users/jakehorvitz/projects/video-brain/Shavit.md`
- `/Users/jakehorvitz/projects/video-brain/arms/shavit/` — the seventeen linked Shavit notes
- `/Users/jakehorvitz/projects/video-brain/_atoms/shavit-register-source.md`
- `/Users/jakehorvitz/projects/video-brain/arms/re-video/pattern-shavitness-baseline.md`
- `/Users/jakehorvitz/projects/shavit-pipeline/rules/brand.md`

The index was generated and should not be treated as the authoritative source by itself; the dated notes and producing project’s spec/receipts provide the underlying context. No unrelated private Brain content or raw conversation was included.

