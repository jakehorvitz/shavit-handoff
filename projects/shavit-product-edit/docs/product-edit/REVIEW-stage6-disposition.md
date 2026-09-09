# Stage 6 disposition — response to REVIEW-stage6.md (verdict there: FAIL → after fixes)
P1-1 stale exports: FIXED — v2 exported 00:45 from the v1.3 renders; exports/CURRENT=v2; gate has a staleness assertion (export must be newer than renderers and bases).
P1-2 time-window WARN classification: FIXED — region-based OCR (top/bottom overlay bands FAIL, device screen band WARN); Reel 2 all-overlay FAIL. Overlay bands clean in v2.
P1-3 silent pass without tesseract: FIXED — `command -v` guard for ffprobe/ffmpeg/tesseract/python3; minimum-crop assertion (≥60) per reel.
P2 #6 gold-handle injection: FIXED — removed; live page captured as-is (white handle). Offer to Jake: 2-line CSS change on the site's case-study slider to gold (a site change → his call, out of this run's scope).
P2 #7 "Every home, every rent, no forms": FIXED — "Available now. Coming soon. One number to text." + caption reworded.
P2 #4 frames dir patchwork: FIXED — full clean re-render of Reel 1 (1050 frames, single renderer version) before v2 export.
P2 #5 static-signature: PARTIAL — cropped to the mark/URL block, threshold 1.5, `$?` shape fixed; first-vs-last drift not added.
P2 #8 end card: PARTIAL — Reel 2 has an end card now; both use a stand-in "SR" mark; shared slate end card = MISSING (conformance).
P2 #10 bed provenance: FIXED — audio/BED-EDM-NOTES.md (Mixkit license).
P2 #12 Mac beat starts on rents: PARTIAL — offset +1.5s into the scroll; still WARN-class site UI.
P2 #13/#15 OCR density/regex: PARTIAL — known-address regex added; 2 fps kept (crops upscaled 1.5×).
P2 #9/#11/#14, P3 items: OPEN — carried to the operate/learn list (repro packaging, LFS/ignore policy for frames, Palmier source-hash check, curly-apostrophe regex added, dead code).
Security/privacy (§4 of the review): no secrets; absolute personal paths in scripts (local tooling, private repo, no remote); brain content not quoted into artifacts.
