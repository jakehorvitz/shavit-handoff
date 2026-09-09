# Lane: qc-reel1 → write docs/product-edit/QC-reel1.md, then touch DONE-qc-reel1
QC the current Reel 1 render: docs/product-edit/reel1/reel1-base.mp4 (1080x1920, 35s, 30fps), rendered by
reel1/reel1.html (deterministic per-frame; open it to understand beats: 0–2 Mac hook, 2–4 phone rise, 4–11 Available
now scroll+swipe, 11–15 Mac case studies, 15–24 live case-study page on the phone with fast slider swipes, 24–29 Text us,
29–35 end card). Read docs/product-edit/SPEC-reels.html section 4 + 5 for the contract and register.
Method: `ffmpeg -i reel1-base.mp4 -vf fps=2 qc/f-%03d.png` then build contact sheets (ffmpeg tile or hstack) and LOOK
at them (Read the images). Flag with timestamps: text overlapping the device or clipped; screens too dim/soft to read;
type too small for a phone (anything under ~28px at 1080 wide); jarring cuts; beats that hold too long or too short;
device angles that read cheap; the site's own "Hillsdale, MI" chip / addresses / rents visible (list them, do not fix —
they are for Shavit's ruling); anything that would make Jake say "looks shitty" against the Porsche/AirPods bar.
For each finding give the exact fix in reel1.html (selector/line, new value). End with a ranked top-5 and an overall
verdict SHIP / SHIP AFTER FIXES / RECUT. Do not edit reel1.html yourself; do not touch site/, .bones/, exports/.
