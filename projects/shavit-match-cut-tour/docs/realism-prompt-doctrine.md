# Realism prompt doctrine (from Jake's walkthrough prompt set, 2026-07-05)
Two-stage pipeline: photoreal STILLS first (chained reference images for identity),
THEN animate each approved still (i2v camera move only). Image models carry realism;
video models only move the camera. Re-roll stills at 1-2cr, not videos at 10-14cr.

Key realism levers from the doc:
- "Using the uploaded reference image, preserve the exact same..." (identity chain)
- Ground objects in the scene: "base grounded in existing grass, foreground blades
  partially overlapping the lower walls"
- Fix camera/lighting/horizon explicitly: "same field, sky, horizon, lighting,
  perspective throughout"
- Name materials precisely (travertine, walnut, black-framed glass)
- "no lines, markings, or overlays visible" / no text/logo/watermark
- Negative prompts (traditional house, warped windows, CGI look...) — the Higgsfield
  MCP exposes no negative_prompt field, so fold these into affirmative phrasing
  (video-brain: [[positive-phrasing-rule]], [[no-negative-prompt-mcp]])

Full 10-image chained walkthrough prompt set saved by Jake (fictional Swiss/Florida
luxury home) — reusable for concept-home content and the empty-lot visualization
play. NOT for real Shavit properties (register: no-generated-architecture) except
inside the Version-A override lane.
