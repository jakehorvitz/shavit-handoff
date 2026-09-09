# Lane: review → write docs/product-edit/REVIEW-stage6.md, then touch DONE-review
Adversarial review (Horvitz stage 6) of the reel build. Be the skeptic. Read: SPEC-reels.html (sections 4, 5, 9, 11),
accept-edit.sh (repo root), reel1/reel1.html, reel1/capture-*.mjs, mockup/the-turn.html, mockup/capture-reel2.mjs,
captions/*.md, palmier-reel-timelines.json. Then answer, with file:line evidence:
1. Does accept-edit.sh actually enforce every §9 criterion? List each criterion → the lines that check it → gaps
   (false negatives it would miss, e.g. OCR sampling misses a 0.3s flash; regex blind spots; the site-UI WARN window
   2–15s/24–29s vs where site UI really appears in reel1.html; static-signature threshold too loose/tight; audio check
   fooled by a bed with a silent tail). Propose concrete patches (bash) but do not apply them.
2. Register compliance in the renderers: any digit-leading address in OUR overlay type, any $ on picture in Reel 2,
   state abbreviations, "written off" wording, generated/outpainted imagery, logo pulsing, Ken-Burns on stills >20%.
   The capture-casestudy.mjs injects a gold handle color into the live page capture — is that an honest
   representation of the site or a misrepresentation to flag for Jake? Argue both sides, then rule.
3. Determinism + repeatability: can someone re-run the pipeline from scratch and get the same mp4s? Missing
   dependencies (playwright symlink, chromium path, ffmpeg, tesseract), hard-coded paths, race conditions (frames
   dirs rewritten while another render reads them), timing assumptions.
4. Security/privacy: secrets, tokens, absolute personal paths in files that will be committed, anything from
   memory/brain vaults quoted into artifacts, network calls beyond shavitrootman.com/Palmier local.
5. Spec drift candidates for the 5.5 conformance report: anything built that differs from the signed v1.3 spec
   (e.g. Palmier holds base+bed rather than a multi-clip cut; Reel 2 numbers beat; hook timing).
Rank findings (P1/P2/P3), each with a one-line fix. Verdict: PASS / PASS WITH FIXES / FAIL. Do not edit any file;
do not touch site/, .bones/, exports/.
