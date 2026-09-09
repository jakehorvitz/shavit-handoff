# Lane: music → deliver docs/product-edit/audio/bed-edm-35s.m4a + audio/BED-EDM-NOTES.md, then touch DONE-music
Jake (8/16): "use electronic dance music, maybe even use [AI]." We need a 35-second EDM music bed for two
9:16 Instagram reels for a real-estate brand (black/white/gold, premium, "Porsche / AirPods" bar). Calm-
premium EDM (melodic house / deep house / cinematic electronic), NOT hard festival drops; no vocals; a
clear beat that can carry fast swipes; a natural resolve at ~33–35s or a clean fade.
Try in this order, stop at the first that yields a usable file:
1. Palmier Pro's own AI audio: `python3 /Users/jakehorvitz/projects/shavit-pipeline/docs/reel-specs/_scripts/pmcp.py call list_models '{}'`
   then `generate_audio` (read `pmcp.py schema generate_audio`). The project open in Palmier is
   "Shavit Website Edit - The Turn (previs)". If the tool says generation is unavailable / no credits, note it and move on.
2. Royalty-free with an explicit license that permits commercial use on Instagram without attribution
   requirements we cannot meet (Pixabay Music license, Mixkit license, or CC0). Download with curl, record
   the exact URL, title, artist, license text/URL in BED-EDM-NOTES.md. No YouTube rips, no "no copyright"
   channels of unknown provenance.
Then: trim/fit to 35.0s with ffmpeg (fade in 0.4s, fade out over the last 2.5s, -14 LUFS-ish; `-af loudnorm=I=-14:TP=-1.5:LRA=11`),
export AAC 192k `.m4a`, verify with ffprobe (duration 35.0), and write BED-EDM-NOTES.md (source, license, what you did,
2 alternates if you found them). Do not touch site/, .bones/, exports/. Do not post anything anywhere.
