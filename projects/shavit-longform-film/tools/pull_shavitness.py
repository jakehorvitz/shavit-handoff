#!/usr/bin/env python3
"""
pull_shavitness.py — pull the @shavitness Instagram photo archive into the film repo
                     with a provenance manifest the preflight/check skills can read.

WHY THIS EXISTS
  video-brain-preflight item 2.6 (Shavit = HARD) requires every reference still to
  carry a `file,source,rights` provenance row. Screenshot crops fail the rights floor
  ([[no-zillow-photos]] logic). Pulling the client's OWN posts, logged as client-owned,
  is the clean source of real anchors for the sanctioned i2v push-in / match-cut tour.

GUARDRAILS (read before running)
  * DRY-RUN BY DEFAULT. This script downloads NOTHING unless you pass --pull.
    The default run just resolves the profile and reports counts.
  * Be gentle. Instagram flags aggressive pulls. Do a full archive pull ONCE, then
    only incremental. Jake's standing rule: do not get an account flagged/banned.
  * It is Shavit's own account and Jake has the relationship — prefer a heads-up to
    Shavit over silent bulk scraping. Rights below are marked "reuse pending sign-off".
  * Anonymous pulls only see public posts and rate-limit hard. For the full history,
    pass --login <your_ig_user> after `python3 -m instaloader --login <user>` once.

USAGE
  # 1. Safe check — reachable? how many posts? (downloads nothing)
  python3 tools/pull_shavitness.py

  # 2. Real pull, images only, into assets/ig_shavitness/ + manifest
  python3 tools/pull_shavitness.py --pull

  # 3. Logged-in full-history pull, politely throttled, capped for a test
  python3 tools/pull_shavitness.py --pull --login jakehorvitz --limit 20
"""
from __future__ import annotations

import argparse
import csv
import sys
import time
from pathlib import Path

PROFILE = "shavitness"
REPO = Path(__file__).resolve().parents[1]
DEST = REPO / "assets" / "ig_shavitness"
MANIFEST = DEST / "manifest.csv"
RIGHTS = "client-owned social post (@shavitness); reuse pending Shavit written sign-off"

try:
    import instaloader
except ImportError:
    sys.exit("instaloader not installed. Run: python3 -m pip install --user instaloader")


def build_loader(delay: float) -> "instaloader.Instaloader":
    # images only: no videos, no video thumbs, no metadata json sidecars, no comments.
    L = instaloader.Instaloader(
        dirname_pattern=str(DEST),
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        post_metadata_txt_pattern="",  # no per-post .txt dumps
    )
    # Politeness: instaloader self-throttles, but add a floor between posts.
    L.context.sleep = True
    L._between_posts_delay = max(0.0, delay)
    return L


def resolve(L, login: str | None):
    if login:
        try:
            L.load_session_from_file(login)
            print(f"[auth] loaded session for {login}")
        except FileNotFoundError:
            sys.exit(f"No saved session for {login}. Run once:\n"
                     f"  python3 -m instaloader --login {login}")
    prof = instaloader.Profile.from_username(L.context, PROFILE)
    print(f"[profile] @{prof.username}  private={prof.is_private}  "
          f"posts={prof.mediacount}  followers={prof.followers}")
    if prof.is_private and not login:
        print("[warn] account is private and you are anonymous — pass --login to see posts.")
    return prof


def write_manifest_rows(rows: list[dict]):
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


def pull(L, prof, limit: int | None):
    DEST.mkdir(parents=True, exist_ok=True)
    rows, n = [], 0
    for post in prof.get_posts():
        if limit and n >= limit:
            break
        L.download_post(post, target=PROFILE)
        # image posts land as <date>_UTC.jpg; sidecars append _1, _2, ...
        date = post.date_utc.strftime("%Y-%m-%d")
        for img in sorted(DEST.glob(f"{post.date_utc.strftime('%Y-%m-%d_%H-%M-%S')}_UTC*.jpg")):
            rel = img.name
            if not any(r["file"] == rel for r in rows):
                rows.append({
                    "file": rel,
                    "source": f"instagram.com/@{PROFILE} post {post.shortcode}",
                    "rights": RIGHTS,
                    "shortcode": post.shortcode,
                    "date": date,
                })
        n += 1
        print(f"  [{n}] {post.shortcode} {date} ({'video-skipped' if post.is_video else 'image'})")
    write_manifest_rows(rows)
    print(f"[done] processed {n} posts; images in {DEST.relative_to(REPO)}")
    print("[next] preflight item 2.2: upscale any sub-2K still before i2v motion.")


def main():
    ap = argparse.ArgumentParser(description="Pull @shavitness photos + provenance manifest.")
    ap.add_argument("--pull", action="store_true", help="actually download (default: dry-run)")
    ap.add_argument("--login", metavar="IG_USER", help="use a saved instaloader session")
    ap.add_argument("--limit", type=int, help="cap number of posts (testing)")
    ap.add_argument("--delay", type=float, default=2.0, help="seconds between posts (politeness)")
    args = ap.parse_args()

    L = build_loader(args.delay)
    prof = resolve(L, args.login)

    if not args.pull:
        print("\nDRY-RUN — nothing downloaded. Re-run with --pull when ready.")
        print("Sunday note: leave Shavit be; the pull hits his public posts, not him,")
        print("but do the archive pull once, gently, then only incrementals.")
        return
    pull(L, prof, args.limit)


if __name__ == "__main__":
    main()
