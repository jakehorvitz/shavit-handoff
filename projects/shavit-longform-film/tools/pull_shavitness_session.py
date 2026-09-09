#!/usr/bin/env python3
"""
pull_shavitness_session.py — full @shavitness photo archive via Jake's logged-in
                             Playwright IG session (instagram_research.py), with a
                             provenance manifest the preflight/check skills can read.

Anonymous instaloader is dead (IG 403s it). This rides the SAME authorized session
JarvisInstagram already uses — no credential scanning, no fresh login. It pages the
feed endpoint to the end, downloads every image (skips videos), and logs provenance.

GUARDRAILS
  * Gentle by design: --delay between feed pages (default 2.5s). Run the full archive
    ONCE, then only incrementals. Standing rule: don't get the account flagged.
  * Images only. Videos are skipped; carousels are expanded to their image frames.
  * Rights logged as "client-owned social post; reuse pending Shavit sign-off".

USAGE
  python3 tools/pull_shavitness_session.py            # dry-run: count the archive
  python3 tools/pull_shavitness_session.py --pull      # download everything
  python3 tools/pull_shavitness_session.py --pull --limit 5   # test on 5 posts
"""
from __future__ import annotations

import argparse
import asyncio
import csv
import sys
from datetime import datetime, timezone
from pathlib import Path

import requests

JARVIS = Path.home() / "Personal Jarvis"
sys.path.insert(0, str(JARVIS))
try:
    from instagram_research import JarvisInstagram  # noqa: E402
except Exception as e:  # pragma: no cover
    sys.exit(f"Could not import JarvisInstagram from {JARVIS}: {e}")

PROFILE = "shavitness"
REPO = Path(__file__).resolve().parents[1]
DEST = REPO / "assets" / "ig_shavitness"
MANIFEST = DEST / "manifest.csv"
RIGHTS = "client-owned social post (@shavitness); reuse pending Shavit written sign-off"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36")


def largest(node: dict) -> str | None:
    cands = ((node.get("image_versions2") or {}).get("candidates")) or []
    if not cands:
        return None
    return max(cands, key=lambda c: (c.get("width", 0) * c.get("height", 0))).get("url")


def image_urls(item: dict) -> list[str]:
    """All still-image URLs in a feed item (skips video frames)."""
    mt = item.get("media_type")
    if mt == 1:                       # single image
        u = largest(item)
        return [u] if u else []
    if mt == 8:                       # carousel — take image children only
        urls = []
        for child in (item.get("carousel_media") or []):
            if child.get("media_type") == 1:
                u = largest(child)
                if u:
                    urls.append(u)
        return urls
    return []                         # mt == 2 video → nothing


def write_manifest(rows: list[dict]):
    DEST.mkdir(parents=True, exist_ok=True)
    existing: dict[str, dict] = {}
    if MANIFEST.exists():
        with MANIFEST.open() as f:
            for r in csv.DictReader(f):
                existing[r["file"]] = r
    for r in rows:
        existing[r["file"]] = r
    with MANIFEST.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["file", "source", "rights", "shortcode", "date"])
        w.writeheader()
        for r in sorted(existing.values(), key=lambda x: x["file"]):
            w.writerow(r)
    print(f"[manifest] {len(existing)} rows -> {MANIFEST.relative_to(REPO)}")


async def crawl(pull: bool, limit: int | None, delay: float):
    ig = JarvisInstagram(headless=True)
    prof = await ig.profile(PROFILE)
    if not prof.get("ok"):
        sys.exit(f"profile fetch failed: {prof}")
    uid = prof.get("id")
    if not uid:
        sys.exit("no user id resolved — is the session logged in? (instagram_research.py login)")
    print(f"[profile] @{prof.get('username')} id={uid} followers={prof.get('followers')}")

    if pull:
        DEST.mkdir(parents=True, exist_ok=True)
    sess = requests.Session()
    sess.headers["User-Agent"] = UA

    rows: list[dict] = []
    posts = images = skipped_videos = 0
    max_id = None
    while True:
        path = f"/api/v1/feed/user/{uid}/?count=33"
        if max_id:
            path += f"&max_id={max_id}"
        res = await ig._api(path)
        if res.get("status") != 200:
            print(f"[stop] feed status {res.get('status')}")
            break
        body = res.get("body") or {}
        items = body.get("items") or []
        for item in items:
            posts += 1
            code = item.get("code")
            date = datetime.fromtimestamp(item.get("taken_at", 0), tz=timezone.utc).strftime("%Y-%m-%d")
            urls = image_urls(item)
            if not urls:
                skipped_videos += 1
            for i, url in enumerate(urls):
                fname = f"{date}_{code}_{i}.jpg" if len(urls) > 1 else f"{date}_{code}.jpg"
                if pull:
                    try:
                        r = sess.get(url, timeout=30)
                        r.raise_for_status()
                        (DEST / fname).write_bytes(r.content)
                    except Exception as ex:
                        print(f"   ! {fname} download failed: {ex}")
                        continue
                images += 1
                rows.append({
                    "file": fname,
                    "source": f"instagram.com/@{PROFILE} post {code}",
                    "rights": RIGHTS,
                    "shortcode": code,
                    "date": date,
                })
            print(f"  [{posts}] {code} {date} — {len(urls)} img{' (video-skip)' if not urls else ''}")
            if limit and posts >= limit:
                break
        if limit and posts >= limit:
            break
        if not body.get("more_available"):
            break
        max_id = body.get("next_max_id")
        if not max_id:
            break
        await asyncio.sleep(delay)

    print(f"\n[summary] {posts} posts · {images} images · {skipped_videos} video/none posts")
    if pull:
        write_manifest(rows)
        print(f"[done] images in {DEST.relative_to(REPO)}")
        print("[next] preflight 2.2: upscale any sub-2K still before i2v motion.")
    else:
        print("\nDRY-RUN — nothing downloaded. Re-run with --pull.")

    try:
        await ig.close()
    except Exception:
        pass


def main():
    ap = argparse.ArgumentParser(description="Pull full @shavitness image archive via logged-in session.")
    ap.add_argument("--pull", action="store_true", help="download (default: dry-run count)")
    ap.add_argument("--limit", type=int, help="cap posts (testing)")
    ap.add_argument("--delay", type=float, default=2.5, help="seconds between feed pages")
    args = ap.parse_args()
    asyncio.run(crawl(args.pull, args.limit, args.delay))


if __name__ == "__main__":
    main()
