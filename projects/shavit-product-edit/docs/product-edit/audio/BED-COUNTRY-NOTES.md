# BED NOTES — music bed for the Mead Street teaser

> **CURRENT BED (v14): lo-fi, `bed-lofi-29.4s.m4a` — see "v14 re-render" at the bottom.** Jake 2026-08-29, after hearing the country cut:
> *"make the music more lofi electronic"*. See **LO-FI BED** at the bottom.
> The country section below is the superseded v11 bed, kept for the method and licence trail.

# (superseded) 33.8 s country bed

Deliverable: `docs/product-edit/audio/bed-country-33.8s.m4a` (AAC 192k, 48 kHz stereo, **33.800 s**,
−26 LUFS target before the end-card lift, fade-in 0.6 s, fade-out last 1.3 s).
Brief: Jake 2026-08-29 — *"add some music in the back inspired by zach brown"*.

## How this was interpreted

Zac Brown Band = warm acoustic country / southern, laid-back but grooving. I sourced a
**genre-matched licensed instrumental**, not an imitation of any specific ZBB song, artist or
recording. Nothing here is AI-generated in an artist's style, and no ZBB material was used.

Palmier's own AI music (step 1 of the BED-EDM-NOTES ladder) is still unavailable —
`canGenerate: false`, "Generation requires signing in to Palmier." Same as 8/16.

## SOURCE (chosen)

| Field | Value |
|---|---|
| Title | **Down the Hill** |
| Artist | **Michael Ramir C.** |
| Site | Mixkit (Envato) — listed under Country |
| Direct file | https://assets.mixkit.co/music/844/844.mp3 |
| Listing page | https://mixkit.co/free-stock-music/tag/country/ |
| Source | MP3, 1:45 |
| Licence | **Mixkit Stock Music Free License** — https://mixkit.co/license/#musicFree. Commercial use incl. social-media marketing permitted, no attribution required. Same licence and reasoning as the EDM bed (see BED-EDM-NOTES.md). |

## Why this one, out of six

All six candidates were downloaded and screened. Two hard requirements: **no vocals**
(there is a VO over the whole reel) and **no intro ramp** (the VO starts at frame 0).

Vocal check — `whisper-cli` (ggml-small.en) over the first 45 s of each. All six returned
only `(upbeat music)` with no lyrics, so all six are instrumental.

| id | Title | start 3 s | mean 40 s | LRA |
|---|---|---|---|---|
| **844** | **Down the Hill** | **−15.8 dB** | **−16.0 dB** | **1.1 LU** |
| 789 | At the Barn | −15.4 | −14.8 | 2.2 |
| 859 | Under the Sun | −25.5 | −18.4 | 4.2 |
| 848 | Let's Win the Race | −27.1 | −19.0 | 7.3 |
| 1063 | Fun at the Farm | −30.0 | −22.0 | 5.3 |
| 1053 | Bigger than Texas | −29.9 | −23.3 | 4.2 |

844 wins on both: it is already at full level in the first 3 s (no 7–8 dB intro ramp to fight
the opening line) and LRA 1.1 LU means it sits flat under speech instead of pumping.

## Render (exact command)

```bash
ffmpeg -y -ss 0 -t 33.8 -i 844.mp3 \
  -af "loudnorm=I=-26:TP=-2:LRA=7,volume='if(lt(t,29.8),1.0,min(1.9,1.0+0.9*(t-29.8)))':eval=frame,afade=t=in:st=0:d=0.6,afade=t=out:st=32.5:d=1.3,atrim=0:33.8,asetpts=PTS-STARTPTS" \
  -ar 48000 -ac 2 -c:a aac -b:a 192k -movflags +faststart bed-country-33.8s.m4a
```

`loudnorm` **first**, then automation and fades — same ordering lesson as the EDM bed.

The `volume` expression is the **end-card lift**: flat under the VO, then +5.6 dB from 29.8 s so
the music opens up under the Shavit end card once he stops talking, before the final fade.

## Verified on the exported mix (v11)

- VO transcribes cleanly through the bed (`whisper-cli` on the final mix returns every line;
  its "shavidritten" / "ministry project" mishears are the same ones it makes on the raw VO, so
  they are the mic, not the mix).
- Levels: 0–29 s (VO + bed) −21.3 dB · 30.5 s+ (end card, bed only) −24.6 dB.
- The bed lives on its own audio track **A2**. Do NOT place it on A1 — A1 carries the Shavit
  video's linked audio, and `add_clips` with `trackIndex` pointing at A1 silently evicts the VO
  (get_timeline collapses that clip out of the track's `clips` list, so A1 looks empty when it is not).


---

# LO-FI BED (v13 length — superseded by the v14 re-render below)

Deliverable: `docs/product-edit/audio/bed-lofi-31.0s.m4a` — 31.000 s.
(`bed-lofi-33.8s.m4a` was the v12 length, superseded when the "Happy Friday" opener
was cut on 8/29: the reel dropped 85 frames to 929 / 30.97 s, so the bed was re-rendered
with the end-card lift moved from 29.8 s to **27.2 s** to stay under the card.
Whenever the cut length changes, the bed must be re-rendered — the lift is baked in.)

| Field | Value |
|---|---|
| Title | **Sleepy Cat** |
| Site | Mixkit (Envato) — tagged **lo-fi** + chill |
| Direct file | https://assets.mixkit.co/music/135/135.mp3 |
| Listing page | https://mixkit.co/free-stock-music/tag/lo-fi/ |
| Source | MP3, 1:59 |
| Licence | Mixkit Stock Music Free License — https://mixkit.co/license/#musicFree (commercial / social marketing OK, no attribution) |

Six lo-fi / chill / electronic candidates screened on the same two hard requirements.
All six instrumental per `whisper-cli` (no lyrics returned).

| id | Title | start 3 s | mean 40 s | LRA |
|---|---|---|---|---|
| **135** | **Sleepy Cat** (lo-fi) | **−11.4** | **−11.6** | **1.6** |
| 175 | Digital Clouds | −14.5 | −14.3 | 3.5 |
| 27 | Serene Moments | −11.1 | −12.1 | 4.5 |
| 282 | Sweet September (lo-fi, hip-hop) | −20.9 | −15.0 | 8.1 |
| 988 | Day Dreamin' with U | −21.6 | −23.2 | 4.2 |
| 234 | Thinking About You | −38.7 | −21.5 | 19.5 |

135 wins: lo-fi tagged, at full level from bar one, and the flattest dynamics in the set
(LRA 1.6) so it sits invisibly under speech. 282 had the best tags but ramps 6 dB over the
opening line and swings 8 LU.

**Alternate if this reads too mellow:** `175` Digital Clouds (chill + electronic, LRA 3.5,
also immediate) — same render command, swap the input id.

Render command identical to the country bed, input `135.mp3`.

Verified on v12: VO transcribes cleanly through the bed; 0–29 s mix at −20.8 dB.

---

# v14 re-render — 29.433 s (current)

Deliverable: `bed-lofi-29.4s.m4a` — **29.433 s**. Same source (Mixkit 135 *Sleepy Cat*),
same licence, same chain. Re-rendered because Shavit asked for the **"I think"** hedge to be
cut on 8/29: 46 frames came out of the VO, so the reel went 929 -> **883 frames / 29.433 s**
and the baked-in end-card lift had to move with it.

| anchor | v13 (31.0 s) | v14 (29.433 s) |
|---|---|---|
| total length | 31.000 | **29.433** |
| end card starts | f824 / 27.467 s | f778 / **25.933 s** |
| lift starts | 27.200 s | **25.667 s** (end card − 0.267 s) |
| fade-out starts | 29.700 s | **28.133 s** (length − 1.3 s) |

```bash
ffmpeg -y -ss 0 -t 29.433 -i 135.mp3 \
  -af "loudnorm=I=-26:TP=-2:LRA=7,volume='if(lt(t,25.667),1.0,min(1.9,1.0+0.9*(t-25.667)))':eval=frame,afade=t=in:st=0:d=0.6,afade=t=out:st=28.133:d=1.3,atrim=0:29.433,asetpts=PTS-STARTPTS" \
  -ar 48000 -ac 2 -c:a aac -b:a 192k -movflags +faststart bed-lofi-29.4s.m4a
```

Verified on the render: body under the VO **−26.1 dB**, end-card lift **−21.3 dB** (+4.8 dB), as designed.

---

# SEND-BY-TEXT ENCODE (new 8/29) — `-text.mp4`

Shavit's second note was that quality degrades **when Jake sends it over text**. Messaging apps
re-encode video on send, and they hit a 35 MB / 9.6 Mbps master hardest. Fix is to hand the
messenger a file it barely has to touch.

Recipe (this is `mead-teaser-v14-text.mp4`, 16.3 MB):

```bash
ffmpeg -y -i mead-teaser-v14.mp4 \
  -vf "hqdn3d=1.5:1.2:6:6,unsharp=5:5:0.4:5:5:0.0" \
  -c:v libx264 -preset slow -profile:v high -b:v 5500k -maxrate 7000k -bufsize 14000k \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart mead-teaser-v14-text.mp4
```

**The denoise is the active ingredient, not the smaller size.** Shavit's talking-head is 720p
upscaled to 1080 and grainy; that grain burns bitrate and turns to blocking after the messenger
re-encodes. Measured with libvmaf against the master, after simulating a messenger transcode
(720p / veryfast / 1.7 Mbps):

| candidate | size | VMAF if compressed | VMAF if it arrives intact |
|---|---|---|---|
| master, as sent today | 35.2 MB | 83.26 | — (reference) |
| 3.3 Mbps, **no** filter | 10.2 MB | **81.65** (worse than master) | — |
| 3.3 Mbps + filter | 12.2 MB | 86.13 | 99.49 |
| **5.5 Mbps + filter  <- shipped** | **16.3 MB** | **86.52** | **99.79** |
| HEVC 2.6 Mbps + filter | 8.6 MB | 85.56 | 98.94 |
| clean 720p lanczos | 7.5 MB | 86.32 | 93.52 |

Shrinking the file alone makes it *worse* (81.65). Filter + moderate bitrate wins in both
scenarios, which is why 5.5 Mbps shipped over the smaller 720p cut: the 720p file looks fine
after compression but caps out at 93.5 if the message ever goes through untouched.
