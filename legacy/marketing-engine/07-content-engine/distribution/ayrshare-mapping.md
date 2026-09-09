# Ayrshare distribution mapping

Make Module 8 posts the finished MP4 + per-platform captions to all 7 platforms in
one Ayrshare `/post` call (fires only on approval or 24h no-veto). API key lives in
the Make connection / `SETUP.md` — **never in this repo**.

## The call (one request, all platforms)
`POST https://api.ayrshare.com/api/post`
Header: `Authorization: Bearer {{AYRSHARE_API_KEY}}`

Because each platform needs its own caption, the cleanest pattern is **one `/post`
per platform** in a Make iterator (so each gets its native text), all sharing the
same `mediaUrls`. Body per platform:

```json
{
  "post": "{{caption_for_platform}}",
  "platforms": ["{{platform_key}}"],
  "mediaUrls": ["{{creatomate_mp4_url}}"],
  "isVideo": true
}
```

## Platform key mapping (our name → Ayrshare key)

| Our platform | Ayrshare `platforms` key | Caption source (Prompt 01 JSON) | Notes |
|---|---|---|---|
| TikTok | `tiktok` | `captions.tiktok` | business/creator account required |
| Instagram Reels | `instagram` | `captions.instagram` | IG Business/Creator; posts as Reel for 9:16 video |
| YouTube Shorts | `youtube` | `captions.youtube` | add `youTubeOptions.title`; ≤60s + 9:16 ⇒ Short |
| Facebook Reels | `facebook` | `captions.facebook` | Facebook Page connected |
| LinkedIn | `linkedin` | `captions.linkedin` | personal or org profile |
| X / Twitter | `twitter` | `captions.x` | Ayrshare uses `twitter` for X |
| Threads | `threads` | `captions.threads` | connected via Ayrshare |

## Per-platform options (set in the body when needed)
- YouTube: `"youTubeOptions": { "title": "{{beat_hook}}", "visibility": "public" }`
- Instagram: 9:16 video auto-publishes as a Reel; no extra option needed.
- TikTok: `"tikTokOptions": { "privacyLevel": "PUBLIC_TO_EVERYONE" }`

## Links + UTM
Each caption already contains its UTM link per
[`platform-captions.md`](platform-captions.md) (TikTok/IG/Threads use "in bio";
YouTube uses the description; LinkedIn/X/Facebook inline). Nothing extra to add here.

## After posting (Module 9)
Ayrshare returns a `postIds`/`id` per platform → write each to `posts-log.csv`
(`date,platform,pillar,market,campaign,utm_content,post_url`) and flip the Source
Unit `status` to `used`.

## Failure handling
If a single platform errors (e.g. token expired), Ayrshare returns a per-platform
error — log it and continue; do not block the other 6. Surface repeated failures in
the approval queue as a "reconnect {platform}" notice.
