# BED-EDM-NOTES — 35 s calm-premium EDM bed for the two 9:16 reels

Deliverable: `docs/product-edit/audio/bed-edm-35s.m4a` (AAC 192 k, 48 kHz stereo, **35.000 s**, −14.1 LUFS integrated, TP ≤ −1.5 dBTP target / −0.5 dBFS sample peak, fade-in 0.4 s, fade-out last 2.5 s).
Lane: music · done 2026-08-16 (Sun) ~00:35 PDT · time-boxed on Jake's instruction ("stop analysing, pick, render").

## What was tried, in the order the brief asked

1. **Palmier Pro AI audio (step 1) — unavailable.** `list_models` works and shows four music models
   (ElevenLabs Music, MiniMax Music 2.6, Lyria 3 Pro, Sonilo). `generate_audio`
   (model `elevenlabs-music`, 35 s, `instrumental:true`, calm melodic-deep-house prompt) returned:
   `"Generation requires signing in to Palmier. Tell the user to sign in."` The timeline info also
   reports `canGenerate: false`. → Noted and moved on, per brief. If Jake signs in to Palmier, the same
   call will produce a bespoke bed (prompt is at the bottom of this file).
2. **Royalty-free with explicit commercial licence (step 2) — used Mixkit.** Mixkit's tag pages expose a
   schema.org `MusicRecording` list per track with `url` (direct MP3), `byArtist`, `duration`,
   `copyrightNotice: "Mixkit Stock Music Free License"` and `license: https://mixkit.co/license/#musicFree`.
   I pulled the Deep House / House / Tech House / Electronic / Chill / Cinematic / Corporate / Futuristic /
   Technology / Ambient tag pages (186 tracks), shortlisted 15 by genre + mood tags, downloaded them
   with `curl`, and ran a local analysis (tempo via onset autocorrelation, per-second RMS envelope,
   mid/side ratio) plus Mixkit's own mood labels. Palmier's on-device `detect_beats` / transcription
   were started as a listening proxy but the long tracks blew the client timeout, so the pick below is
   from metadata + signal analysis, **not** from a human listen. Please give it one listen before it goes
   under a reel.

## SOURCE (chosen)

| Field | Value |
|---|---|
| Title | **House 02** |
| Artist | **Lily J** |
| Site | Mixkit (Envato) — listed under Deep House / House |
| Direct file (exact URL downloaded) | https://assets.mixkit.co/music/744/744.mp3 |
| Listing pages where found | https://mixkit.co/free-stock-music/tag/deep-house/ · https://mixkit.co/free-stock-music/tag/house/ |
| Mixkit moods/tags | Hypnotic · Driving · Melodic · Fashion · Bass · Drums (site tags: corporate, deep-house, futuristic, house, technology) |
| Source file | MP3 320 kbps 44.1 kHz stereo, 1:53 (113.19 s), published 2020-01-28 (JSON-LD `datePublished`) |
| Analysis | ~123 BPM (four-on-the-floor), level steady from bar 1 (−10 dB RMS → −8 dB from ~9 s), no long intro, no big drop; mid/side ratio 3.4 (centred kick/bass, wide pads) |
| Vocals | none indicated by Mixkit metadata; instrumental house per genre. Not machine-verified (see above) |
| Licence | **Mixkit Stock Music Free License** — https://mixkit.co/license/#musicFree (also linked as `license` in the track's JSON-LD). Mixkit's official summary (https://mixkit.co/llm-info/, read 2026-08-16): *"Allows use in commercial projects (YouTube videos, social media marketing, online ads, music videos) and personal projects. No attribution required."* Restrictions: may not *"Sell physical or digital copies of items without first altering them…"* nor *"Rent, license, sublicense, sell, resell or otherwise commercially exploit or make Mixkit or any item available to any third party."* Non-exclusive licence; no ownership transfer. |
| Fit to brief | Instagram reels for a real-estate brand = social-media marketing → permitted, no attribution needed. We are syncing it under original video (creative value added), not redistributing the track. |

## What I did (exact command)

```bash
ffmpeg -y -ss 0 -t 35.0 -i 744.mp3 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.4,afade=t=out:st=32.5:d=2.5,atrim=0:35.0,asetpts=PTS-STARTPTS" \
  -ar 48000 -ac 2 -c:a aac -b:a 192k -movflags +faststart \
  docs/product-edit/audio/bed-edm-35s.m4a
```

- Window: **0.000–35.000 s of the source** (the track starts on the groove; at 123 BPM a bar ≈ 1.95 s, so
  35 s ≈ 18 bars — the last bar is under the fade).
- Order matters: `loudnorm` **first**, then fades — the first attempt (fades → loudnorm) let loudnorm's
  dynamic mode partly undo the fade-out; re-rendered.
- Verified with ffprobe: `duration=35.000000`, `aac`, `48000 Hz`, `2 ch`, ~211 kb/s actual.
- Verified with `ebur128`: I = **−14.1 LUFS**, LRA 0.4 LU, sample peak −0.5 dBFS.
- Verified fades from per-second RMS: 0.0 s −152 dB → 0.6 s −16 dB (in); 32.4 s −12.7 dB → 33.5 s −24 dB
  → 34.5 s −36.8 dB → 35.0 s (out). No natural musical resolve at 35 s in the source, so this is the
  "clean fade" option the brief allowed.

## Two alternates (same licence, same site — direct URLs, not rendered)

1. **Autofahren — Mauro Urbina** — https://assets.mixkit.co/music/770/770.mp3 (4:44, 256 kbps).
   Mixkit genre *Deep House*; moods Hypnotic · Futuristic · Cinematic; ~117.5 BPM. The most "Porsche
   film" of the set, but it has a 33 s atmospheric intro before the full groove — for a 35 s reel cut
   from **~64 s or ~96 s** in (after the beat is established) rather than from 0. Best if the reels want a
   darker, more cinematic feel than House 02.
2. **Deep Techno Ambience — Alejandro Magaña (A. M.)** — https://assets.mixkit.co/music/134/134.mp3
   (2:03, 256 kbps). Genre Techno; moods Relaxed · Hypnotic · Fashion; ~126 BPM; steady level from 0 s.
   Calmer/more minimal than House 02 — good if the first pick feels too busy under captions.
   (Runner-ups if neither works: *Hazy After Hours* — A. M., https://assets.mixkit.co/music/132/132.mp3,
   Sexy · Relaxed, ~120 BPM; *Deep Urban* — Eugenio Mininni, https://assets.mixkit.co/music/623/623.mp3,
   Hypnotic · Driving · Corporate, ~123 BPM.)

Both alternates carry the same Mixkit Stock Music Free License (`https://mixkit.co/license/#musicFree`),
verified from their JSON-LD on the tag pages. Same ffmpeg line works — just change the input and pick a
`-ss` that lands on a downbeat.

## Housekeeping / side-effects

- Palmier project "Shavit Website Edit - The Turn (previs)": I imported six candidate MP3s into a temp
  folder **`_zz music candidates (mixkit, temp)`** for on-device beat detection. **The cleanup delete
  did not go through** — the Palmier MCP server stopped answering (two `organize_media` delete calls
  timed out; it was likely still busy with the earlier `detect_beats` job on the 4:44 tracks). Please
  delete that one folder from the media library (or re-run
  `pmcp.py call organize_media '{"deletes":["_zz music candidates (mixkit, temp)"]}'`). Nothing else in
  the project was touched; nothing was exported or posted.
- Nothing under `site/`, `.bones/`, or `docs/product-edit/exports/` was touched. Nothing posted anywhere.
- Scratch files (downloads, analysis venv) live only in the session scratchpad.

## Prompt to reuse if Palmier generation becomes available

> Calm, premium melodic deep house instrumental for a luxury real-estate brand film. 118 BPM,
> four-on-the-floor kick with tight crisp hi-hats, warm rolling side-chained sub bass, lush analog pads,
> a restrained plucked/piano motif, subtle risers. Elegant, confident, cinematic — the mood of a Porsche
> or Apple product film, not a festival drop. Steady groove from the first bar that can carry fast picture
> cuts, a gentle lift around two-thirds through, and a clean musical resolve on the final downbeat.
> No vocals, no voice, no lyrics.  (`generate_audio`, model `elevenlabs-music`, duration 35, instrumental true)
