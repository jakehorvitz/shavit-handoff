# Hero-gen brief — video-brain-informed (Sat 7/4)
Source: ~/projects/video-brain (Higgsfield arm, 29 notes). Rules applied:

**Prompt doctrine (all gens):**
- Terse, direct sentences (Kling rewards short commands, not Veo-style prose) [[short-command-prompts]]
- Camera move FIRST, named from the controlled vocabulary (slow dolly-in, lateral track, push-in) — "cinematic" maps to nothing [[camera-motion-vocabulary]] [[prompt-order-formula]]
- POSITIVE phrasing only — "empty quiet street, natural daylight," never "no people" [[positive-phrasing-rule]] (no negative_prompt field exists on any MCP model [[no-negative-prompt-mcp]])
- ONE move per shot, 4–8s [[one-move-per-shot]]
- Restate setting/light/tone fully in every prompt — zero carry-over between gens [[restate-every-prompt]]
- Never ask the model for on-screen text — type composites in the edit [[never-prompt-onscreen-text]]

**Pipeline (all gens):**
1. upscale_image the source still to 2K FIRST — soft sources make i2v invent geometry [[upscale-before-motion]]
2. Generate at 9:16; expect 24fps back → ffmpeg conform to 30fps is a MANDATORY step [[fps-24-default]]
3. Frame-diff vs source still; warped siding/bent lines = reject-re-roll (auto-refund on false NSFW flags) [[frame-diff-vs-source]] [[nsfw-false-positive-refund]]
4. Budget: expect rejects — pros run ~4% keeper rates; 10cr/roll × 726cr = ~70 rolls available [[keeper-rate-budgeting]]

**The gens (in order):**
- G1 HOOK — DONE (smoke gen doubles as hook plate): checks/calibration/kling_camera_move.mp4. Needs 30fps conform + 1080x1920 mount.
- G2 REWARD INTERIOR (mandatory spectacle, ~43–48s): warmest real Salem interior crop → upscale → kling3_0 i2v, "Slow dolly-in along the room's axis. Warm afternoon light through the windows. Furniture and walls rigid and steady." Push along the photo's own axis ONLY [[walkthrough-no-corners]].
- G3 RIVER ST CONSTRUCTION EFFECT (candidate, twice-gated): frames-mode start=real before (t≈2.0s frame) end=real after (t≈3.7s frame) from the River St Before-After film, crop chips y125–200 first [[burned-in-tag-crop]] [[frames-mode-real-anchors]]. Prompt: "Timelapse of the house being renovated, motion blur." Ships ONLY with Shavit's isolated-clip approval.
- G4 (spare) second exterior move for Ch.1 or proof MI dissolve-after if G1-style quality holds.

**MANDATORY (added after brain access confirmed):** run `~/projects/video-brain/skills/video-brain-preflight/` (GO/NO-GO + citation + remedy) before EVERY generate call — no credits without it. Post-build: `video-brain-analyze` joins stage-6 review; `video-brain-check` (Shavit register QA) runs before staging. Brain's standing findings on the old master to verify fixed in round 2: carousel dots 35–50s, KB-cap violation (despite my check passing — investigate classification), outpaint-look plates, H3 "WRITTEN OFF" wording, §03 tag scale vs remaster size.
