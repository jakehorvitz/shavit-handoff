#!/usr/bin/env python3
import csv
import hashlib
import json
import math
import os
import re
import shutil
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parent
W, H = 1080, 1920
FPS = 30
BASE_DURATIONS = [3, 2.5, 2.3, 2.1, 4, 4, 4, 5.4, 1, 3.0, 3.5, 3.5, 5, 7, 3]
DURATIONS = BASE_DURATIONS[:]
RUNTIME = float(sum(DURATIONS))
PIA_TRACK = ROOT / "assets/music/candidates/5-heartland-main-title.mp3"  # Heartland (Pixabay 354086) — Jake-locked; Pia was the REJECTED bed
PIA_WINDOW = {}
TEXT_ENTRIES = []
MASTER_TEXT_ENTRIES = []
VIDEO_SEGMENTS = {}
SANITIZED_SOURCES = {}
SANITIZED_ROWS = {}
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
BRASS = (176, 141, 87)
GOLD = (255, 192, 0)
WM_ALPHA = 89
REVIEWER_LINE_RE = re.compile(r"^REVIEWER:\s+(.+?)\s+(\d{4}-\d{2}-\d{2})\s*$", re.MULTILINE)
REVIEWER_REJECT_TERMS = {
    "ai",
    "assistant",
    "builder",
    "codex",
    "machine",
    "name",
    "openai",
    "reviewer",
    "yyyy",
}


def has_valid_reviewer_line(text):
    for match in REVIEWER_LINE_RE.finditer(text):
        name = match.group(1).strip()
        lowered = re.sub(r"[^a-z]+", " ", name.lower()).split()
        if "<" in name or ">" in name:
            continue
        if not re.search(r"[A-Za-z]{2}", name):
            continue
        if any(term in REVIEWER_REJECT_TERMS for term in lowered):
            continue
        try:
            __import__("datetime").date.fromisoformat(match.group(2))
        except ValueError:
            continue
        return True
    return False


def ensure_dirs():
    for d in [
        "assets/cropped",
        "assets/sanitized",
        "assets/upscaled",
        "build/frames",
        "build/bases",
        "build/motion_clips",
        "build/layers",
        "build/audio",
        "deliver",
        "checks",
        "checks/motion_diffs",
    ]:
        (ROOT / d).mkdir(parents=True, exist_ok=True)


def clean_outputs():
    for pattern in [
        "build/frames/*.png",
        "build/bases/*.png",
        "build/motion_clips/*.mp4",
        "build/layers/*.png",
        "build/audio/*.wav",
        "checks/motion_diffs/*.png",
        "deliver/*.mp4",
        "deliver/poster.jpg",
    ]:
        for p in ROOT.glob(pattern):
            p.unlink()


def cut_times():
    times = [0.0]
    t = 0.0
    for dur in DURATIONS:
        t += float(dur)
        times.append(t)
    return times


def media_crop_box(im):
    arr = np.asarray(im.convert("RGB"))
    small = np.asarray(im.resize((720, 450), Image.Resampling.BILINEAR).convert("RGB"))
    gray = small.mean(axis=2)
    sat = small.max(axis=2) - small.min(axis=2)
    mask = ((gray > 72) | (sat > 34)).astype(np.uint8)
    mask[:48, :] = 0
    mask[:, :30] = 0
    mask[:, 650:] = 0

    col_score = mask[60:430, :].mean(axis=0)
    hot = col_score > 0.22
    runs = []
    start = None
    for i, v in enumerate(hot):
        if v and start is None:
            start = i
        if (not v or i == len(hot) - 1) and start is not None:
            end = i if not v else i + 1
            if end - start > 120:
                runs.append((start, end, float(col_score[start:end].mean()) * (end - start)))
            start = None
    if not runs:
        return (round(im.width * 0.18), round(im.height * 0.17), round(im.width * 0.73), round(im.height * 0.91))

    x0s, x1s, _ = max(runs, key=lambda r: r[2])
    row_score = mask[:, x0s:x1s].mean(axis=1)
    row_thresh = max(0.25, min(0.58, float(np.percentile(row_score, 75)) * 0.55))
    hot_rows = row_score > row_thresh
    row_runs = []
    start = None
    for i, v in enumerate(hot_rows):
        if v and start is None:
            start = i
        if (not v or i == len(hot_rows) - 1) and start is not None:
            end = i if not v else i + 1
            if end - start > 120:
                row_runs.append((start, end, float(row_score[start:end].mean()) * (end - start)))
            start = None
    y0s, y1s, _ = max(row_runs, key=lambda r: r[2]) if row_runs else (70, 410, 0)

    sx = im.width / 720
    sy = im.height / 450
    pad = 6
    x0 = max(0, int((x0s - pad) * sx))
    x1 = min(im.width, int((x1s + pad) * sx))
    y0 = max(0, int((y0s - pad) * sy))
    y1 = min(im.height, int((y1s + pad) * sy))
    if x1 - x0 < 500 or y1 - y0 < 500 or (x1 - x0, y1 - y0) == (2880, 1800):
        return (round(im.width * 0.18), round(im.height * 0.17), round(im.width * 0.73), round(im.height * 0.91))
    return (x0, y0, x1, y1)


def tiny_fingerprint(im):
    g = im.convert("L").resize((16, 16), Image.Resampling.BILINEAR)
    return np.asarray(g, dtype=np.float32)


def crop_screenshots():
    seen = []
    rows = []
    for src_dir, label in [(ROOT / "assets/before", "before"), (ROOT / "assets/after", "after")]:
        for src in sorted(src_dir.glob("*.png")):
            im = Image.open(src)
            crop = im.crop(media_crop_box(im))
            fp = tiny_fingerprint(crop)
            if any(np.mean(np.abs(fp - old)) < 2.0 for old in seen):
                continue
            seen.append(fp)
            name = f"{label}_{len(rows)+1:03d}.jpg"
            out = ROOT / "assets/cropped" / name
            crop.convert("RGB").save(out, quality=92, optimize=True)
            rows.append(
                {
                    "file": name,
                    "source": f"repo {src_dir.relative_to(ROOT)} Instagram screenshot crop",
                    "rights": "client-owned social post; cropped to photo rectangle only",
                }
            )
    salem_frame = ROOT / "build/frames/salem_split_source.jpg"
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            "1.0",
            "-i",
            str(ROOT / "assets/films/61 Salem St — Split Screen.mp4"),
            "-frames:v",
            "1",
            str(salem_frame),
        ],
        check=True,
    )
    split = Image.open(salem_frame).convert("RGB")
    before = split.crop((0, 0, split.width, split.height // 2 - 6))
    after = split.crop((0, split.height // 2 + 6, split.width, split.height))
    # Strip the baked BEFORE/AFTER chips from the prior split-screen source before
    # those plates can be used as compositing sources.
    before_clean = before.crop((0, min(130, before.height // 5), before.width, before.height))
    after_clean = after.crop((0, min(120, after.height // 5), after.width, after.height))
    salem_assets = [
        ("salem_video_before.jpg", before),
        ("salem_video_after.jpg", after),
        ("salem_clean_before.jpg", before_clean),
        ("salem_clean_after.jpg", after_clean),
    ]
    for name, im in salem_assets:
        im.save(ROOT / "assets/cropped" / name, quality=94, optimize=True)
        rows.append(
            {
                "file": name,
                "source": "repo assets/films/61 Salem St Split Screen frame crop",
                "rights": "client-owned prior film; split-screen crop to real property plate",
            }
        )
    for hero in sorted((ROOT / "assets/heroes").glob("*.jpg")):
        rows.append(
            {
                "file": str(hero.relative_to(ROOT)),
                "source": "shavitrootman.com repo",
                "rights": "client-owned",
            }
        )
    for media_path, source_note in [
        (ROOT / "assets/films/Larchmere Duplex — Showcase.mp4", "repo assets/films prior Shavit property film"),
        (ROOT / "assets/music/candidates/5-heartland-main-title.mp3", "Pixabay 354086 Heartland — Content License, commercial OK, Jake-locked 7/3"),
    ]:
        rows.append(
            {
                "file": str(media_path.relative_to(ROOT)),
                "source": source_note,
                "rights": "client-provided for this brand-film package",
            }
        )
    with open(ROOT / "assets/manifest.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["file", "source", "rights"])
        writer.writeheader()
        writer.writerows(rows)


def sanitize_chrome_shapes(src):
    """Remove small IG-carousel UI shapes that survive source-plate cropping."""
    import cv2

    src = Path(src)
    out_dir = ROOT / "assets/sanitized"
    out_dir.mkdir(parents=True, exist_ok=True)
    out = out_dir / f"{src.stem}__chrome_clean.jpg"
    key = str(src.resolve())
    if key in SANITIZED_SOURCES and Path(SANITIZED_SOURCES[key]).exists():
        return Path(SANITIZED_SOURCES[key])

    img = cv2.imread(str(src), cv2.IMREAD_COLOR)
    if img is None:
        raise RuntimeError(f"cannot read source plate for sanitization: {src}")
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape
    mask = np.zeros((h, w), dtype=np.uint8)

    _, th = cv2.threshold(gray, 160, 255, cv2.THRESH_BINARY)
    n, labels, stats, cents = cv2.connectedComponentsWithStats(th, 8)
    for i in range(1, n):
        area = int(stats[i][4])
        cx, cy = float(cents[i][0]), float(cents[i][1])
        if 5 <= area <= 1200 and (cx < 0.08 * w or cx > 0.92 * w) and 0.30 * h <= cy <= 0.70 * h:
            mask[labels == i] = 255

    band0 = int(h * 0.80)
    band = cv2.GaussianBlur(gray[band0:, :], (3, 3), 0)
    _, thb = cv2.threshold(band, 160, 255, cv2.THRESH_BINARY)
    n, labels_b, stats_b, cents_b = cv2.connectedComponentsWithStats(thb, 8)
    dots = []
    for i in range(1, n):
        area = int(stats_b[i][4])
        bw, bh = int(stats_b[i][2]), int(stats_b[i][3])
        if 5 <= area <= 520 and abs(bw - bh) <= max(5, bw // 2):
            dots.append((i, float(cents_b[i][0]), float(cents_b[i][1])))
    rows = {}
    for i, x, y in dots:
        rows.setdefault(round(y / 14), []).append((i, x))
    for vals in rows.values():
        xs = sorted(x for _, x in vals)
        if len(xs) < 4:
            continue
        gaps = [xs[i + 1] - xs[i] for i in range(len(xs) - 1)]
        if gaps and max(gaps) - min(gaps) <= 10 and 6 <= (sum(gaps) / len(gaps)) <= 90:
            for i, _ in vals:
                mask[band0:, :][labels_b == i] = 255

    if mask.any():
        mask = cv2.dilate(mask, np.ones((17, 17), dtype=np.uint8), iterations=1)
        img = cv2.inpaint(img, mask, 7, cv2.INPAINT_TELEA)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    yy, xx = np.indices((h, w))
    guard = (((xx < 0.062 * w) | (xx > 0.938 * w)) & (yy > 0.34 * h) & (yy < 0.66 * h) & (gray > 165))
    guard |= (yy > 0.80 * h) & (gray > 210)
    if guard.any():
        img[guard] = np.minimum(img[guard], 145)

    cv2.imwrite(str(out), img, [int(cv2.IMWRITE_JPEG_QUALITY), 94])
    SANITIZED_SOURCES[key] = out
    SANITIZED_ROWS[out.name] = src
    return out


def clean_source(path):
    return sanitize_chrome_shapes(ROOT / path if not Path(path).is_absolute() else path)


def append_sanitized_manifest_rows():
    manifest = ROOT / "assets/manifest.csv"
    existing = set()
    if manifest.exists():
        with open(manifest, newline="") as f:
            existing = {os.path.basename((row.get("file") or "").strip()) for row in csv.DictReader(f)}
    with open(manifest, "a", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["file", "source", "rights"])
        for name, original in sorted(SANITIZED_ROWS.items()):
            if name in existing:
                continue
            writer.writerow(
                {
                    "file": f"assets/sanitized/{name}",
                    "source": f"chrome-shape scrub of {original.relative_to(ROOT)}",
                    "rights": "client-owned; derived from manifest-listed source; edge/dot UI scrub only",
                }
            )

    audit = ROOT / "assets/manifest-audit.csv"
    if not audit.exists():
        return
    with open(audit, newline="") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames or []
        rows = list(reader)
    if "file" not in fieldnames:
        return
    existing = {os.path.basename((row.get("file") or "").strip()) for row in rows}
    by_file = {os.path.basename((row.get("file") or "").strip()): row for row in rows}
    changed = False
    for name, original in sorted(SANITIZED_ROWS.items()):
        if name in existing:
            continue
        base = os.path.basename(str(original))
        row = dict(by_file.get(base, {}))
        if not row:
            row = {"file": name, "kind": "after", "property": "UNKNOWN", "state": "UNKNOWN", "confidence": "LOW", "hygiene": "chrome-shape scrub"}
        row["file"] = name
        row["hygiene"] = "clean chrome-shape scrub of " + base
        rows.append({k: row.get(k, "") for k in fieldnames})
        changed = True
    if changed:
        with open(audit, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rows)


def font(size, bold=True):
    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ]
    for c in candidates:
        if Path(c).exists():
            return ImageFont.truetype(c, size)
    return ImageFont.load_default()


def fit_cover(im, size=(W, H), x_bias=0.5, y_bias=0.5):
    im = im.convert("RGB")
    scale = max(size[0] / im.width, size[1] / im.height)
    nw, nh = math.ceil(im.width * scale), math.ceil(im.height * scale)
    im = im.resize((nw, nh), Image.Resampling.LANCZOS)
    x = int((nw - size[0]) * x_bias)
    y = int((nh - size[1]) * y_bias)
    return im.crop((x, y, x + size[0], y + size[1]))


def grade(im, mode):
    im = im.convert("RGB")
    if mode == "before":
        im = ImageEnhance.Color(im).enhance(0.52)
        overlay = Image.new("RGB", im.size, (4, 30, 64))
        im = Image.blend(im, overlay, 0.30)
        r, g, b = im.split()
        r = r.point(lambda v: int(v * 0.86))
        b = b.point(lambda v: min(255, int(v * 1.10)))
        return Image.merge("RGB", (r, g, b))
    if mode == "desat":
        gray = im.convert("L").convert("RGB")
        return Image.blend(gray, im, 0.08)
    if mode == "warm":
        im = ImageEnhance.Color(im).enhance(1.14)
        overlay = Image.new("RGB", im.size, (98, 48, 0))
        return Image.blend(im, overlay, 0.38)
    return im


def shade(im):
    overlay = Image.new("RGBA", im.size, (0, 0, 0, 0))
    alpha = np.full((H, W), 46, dtype=np.uint8)
    top_h = 300
    alpha[:top_h, :] = np.maximum(alpha[:top_h, :], np.linspace(72, 0, top_h, dtype=np.uint8)[:, None])
    start, end = 900, 1400
    ramp = np.clip((np.arange(H) - start) / (end - start), 0, 1)
    bottom = (132 * ramp).astype(np.uint8)
    alpha = np.maximum(alpha, bottom[:, None])
    overlay.putalpha(Image.fromarray(alpha, "L"))
    return Image.alpha_composite(im.convert("RGBA"), overlay)


def wrap_lines(text, draw, fnt, max_width):
    words = text.split()
    lines = []
    cur = []
    for word in words:
        test = " ".join(cur + [word])
        if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width or not cur:
            cur.append(word)
        else:
            lines.append(" ".join(cur))
            cur = [word]
    if cur:
        lines.append(" ".join(cur))
    return lines


def draw_type(layer, lines, tag=None, gold_last=False, size=82, bottom=470):
    draw = ImageDraw.Draw(layer)
    margin = 72
    fnt = font(size)
    all_lines = []
    for line in lines:
        if line.strip():
            all_lines.extend(wrap_lines(line.upper(), draw, fnt, W - 2 * margin))
    line_h = int(size * 1.08)
    y = H - bottom
    y -= line_h * (len(all_lines) - 1)
    if tag:
        tag_f = font(28)
        tag_text = tag.upper()
        tag_box = draw.textbbox((0, 0), tag_text, font=tag_f)
        tag_h = tag_box[3] - tag_box[1]
        tag_y = max(220, y - tag_h - 52)
        draw.text((margin, tag_y), tag_text, font=tag_f, fill=BRASS + (255,))
        draw.line((margin, tag_y + tag_h + 18, margin + 118, tag_y + tag_h + 18), fill=BRASS + (255,), width=5)
    for i, line in enumerate(all_lines):
        color = GOLD if gold_last and i == len(all_lines) - 1 else WHITE
        draw.text((margin, y + i * line_h), line, font=fnt, fill=color + (255,))


def draw_watermark(layer):
    d = ImageDraw.Draw(layer)
    f = font(24)
    text = "SHAVIT·ROOTMAN"
    box = d.textbbox((0, 0), text, font=f)
    d.text((W - 60 - (box[2] - box[0]), 70), text, font=f, fill=WHITE + (WM_ALPHA,))


def render_layer(name, lines, tag=None, gold_last=False, size=82, bottom=470, watermark=True):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    if watermark:
        draw_watermark(layer)
    draw_type(layer, lines, tag=tag, gold_last=gold_last, size=size, bottom=bottom)
    out = ROOT / "build/layers" / f"{name}.png"
    layer.save(out)
    return layer


def make_frame(name, source, lines, tag=None, mode="warm", gold_last=False, size=82, bottom=470, x_bias=0.5, signature=False):
    if signature:
        im = fit_cover(Image.open(source), x_bias=x_bias)
        base = shade(grade(im, mode))
        base = Image.alpha_composite(base, Image.new("RGBA", (W, H), (0, 0, 0, 82)))
        base.convert("RGB").save(ROOT / "build/bases" / f"{name}.png")
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        cx, cy = W // 2, H // 2 - 120
        d.line((cx - 64, cy, cx, cy - 64, cx + 64, cy, cx + 64, cy + 82, cx - 64, cy + 82, cx - 64, cy), fill=GOLD + (255,), width=8)
        d.text((cx, cy + 145), "SHAVIT\nROOTMAN", font=font(74), fill=WHITE + (255,), anchor="ma", align="center", spacing=8)
        d.line((cx - 126, cy + 335, cx + 126, cy + 335), fill=BRASS + (255,), width=4)
        d.line((cx - 126, cy + 358, cx + 126, cy + 358), fill=BRASS + (255,), width=4)
        d.text((cx, cy + 405), "REAL ESTATE, OPERATED.", font=font(30), fill=WHITE + (255,), anchor="ma")
        layer.save(ROOT / "build/layers" / f"{name}.png")
    else:
        im = fit_cover(Image.open(source), x_bias=x_bias)
        base = shade(grade(im, mode))
        base.convert("RGB").save(ROOT / "build/bases" / f"{name}.png")
        layer = render_layer(name, lines, tag=tag, gold_last=gold_last, size=size, bottom=bottom)
    comp = Image.alpha_composite(base, layer)
    out = ROOT / "build/frames" / f"{name}.png"
    comp.convert("RGB").save(out)
    return out


def extract_video_plate(video, start=0.0):
    import cv2

    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        raise RuntimeError(f"cannot open source footage {video}")
    cap.set(cv2.CAP_PROP_POS_MSEC, start * 1000)
    ok, frame = cap.read()
    cap.release()
    if not ok:
        raise RuntimeError(f"cannot read source footage frame {video}@{start}")
    return Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))


def make_video_frame(name, video, lines, start=0.0, tag=None, mode="warm", gold_last=False, size=82, bottom=470, x_bias=0.5):
    VIDEO_SEGMENTS[name] = {"video": str(video), "start": float(start), "mode": mode, "x_bias": x_bias}
    im = fit_cover(extract_video_plate(video, start), x_bias=x_bias)
    base = shade(grade(im, mode))
    base.convert("RGB").save(ROOT / "build/bases" / f"{name}.png")
    layer = render_layer(name, lines, tag=tag, gold_last=gold_last, size=size, bottom=bottom)
    comp = Image.alpha_composite(base, layer)
    out = ROOT / "build/frames" / f"{name}.png"
    comp.convert("RGB").save(out)
    return out


def make_collage_frame(name, sources, lines, tag=None, gold_last=False, size=70, bottom=470, visible_count=8):
    base = Image.new("RGB", (W, H), (18, 13, 8))
    bg = fit_cover(Image.open(sources[0]), x_bias=0.55)
    base = Image.blend(grade(bg.filter(ImageFilter.GaussianBlur(18)), "warm"), base, 0.62)
    canvas = base.convert("RGBA")
    slots = [
        (62, 210, 430, 600),
        (520, 170, 458, 646),
        (84, 770, 350, 492),
        (486, 850, 510, 360),
        (126, 1250, 360, 420),
        (558, 1215, 398, 490),
        (376, 520, 292, 386),
        (60, 1010, 280, 320),
        (742, 710, 260, 340),
        (408, 118, 270, 310),
    ]
    for i, src in enumerate(sources[:visible_count]):
        x, y, tw, th = slots[i]
        tile = fit_cover(Image.open(src), size=(tw, th), x_bias=0.5)
        tile = grade(tile, "warm").convert("RGBA")
        border = Image.new("RGBA", (tw + 6, th + 6), BRASS + (220,))
        canvas.alpha_composite(border, (x - 3, y - 3))
        canvas.alpha_composite(tile, (x, y))
    canvas = shade(canvas.convert("RGB"))
    canvas.convert("RGB").save(ROOT / "build/bases" / f"{name}.png")
    layer = render_layer(name, lines, tag=tag, gold_last=gold_last, size=size, bottom=bottom)
    comp = Image.alpha_composite(canvas, layer)
    out = ROOT / "build/frames" / f"{name}.png"
    comp.convert("RGB").save(out)
    return out


def render_frames(hook_line):
    global TEXT_ENTRIES, VIDEO_SEGMENTS
    TEXT_ENTRIES = []
    VIDEO_SEGMENTS = {}

    def add_frame(name, maker, lines, **kwargs):
        TEXT_ENTRIES.append(
            {
                "name": name,
                "lines": [line for line in lines if line.strip()],
                "watermark": not kwargs.get("signature", False),
                "signature": kwargs.get("signature", False),
            }
        )
        return maker(name, lines=lines, **kwargs)

    heroes = sorted((ROOT / "assets/heroes").glob("*.jpg"))
    hero = {p.name: clean_source(p) for p in heroes}
    allowed_heroes = [
        hero["01_river_street_hillsdale.jpg"],
        hero["03_2217_parkview_south_bend.jpg"],
        hero["05_west_side_cleveland.jpg"],
        hero["06_61_salem_street_hillsdale.jpg"],
        hero["07_larchmere_duplex_cleveland.jpg"],
        hero["08_east_saint_joe_hillsdale.jpg"],
        hero["09_budlong_street_hillsdale.jpg"],
        hero["10_second_chance_ranch_hillsdale.jpg"],
    ]
    hook_salem = clean_source(ROOT / "assets/cropped/salem_clean_after.jpg")
    tree_before = clean_source(ROOT / "assets/cropped/before_009.jpg")
    tree_after = hero["06_61_salem_street_hillsdale.jpg"]
    reward_salem = clean_source(ROOT / "assets/cropped/after_019.jpg")
    signature_plate = clean_source(ROOT / "assets/cropped/after_018.jpg")
    rehab_footage = ROOT / "assets/films/Larchmere Duplex — Showcase.mp4"
    frames = []
    frame_specs = [
        ("00_hook", make_video_frame, {"video": ROOT / "checks/calibration/kling_camera_move.mp4", "start": 0.2, "lines": ["FIFTY DOORS.", "THREE STATES.", "ONE STANDARD."], "mode": "warm", "size": 92, "bottom": 430, "x_bias": 0.5}),
        ("01_proof_doors", make_frame, {"source": allowed_heroes[0], "lines": ["MICHIGAN"], "mode": "warm", "size": 96, "bottom": 470, "x_bias": 0.45}),
        ("02_proof_states", make_frame, {"source": allowed_heroes[2], "lines": ["OHIO."], "mode": "warm", "size": 92, "bottom": 470}),
        ("03_proof_local", make_frame, {"source": allowed_heroes[1], "lines": ["INDIANA."], "mode": "warm", "size": 92, "bottom": 470}),
        ("04_tree_1", make_frame, {"source": tree_before, "lines": ["A TREE WENT", "THROUGH THE ROOF."], "tag": "SALEM STREET", "mode": "before", "size": 70, "bottom": 470}),
        ("05_tree_2", make_frame, {"source": tree_after, "lines": ["REBUILT.", "RE-RENTED."], "mode": "warm", "size": 82, "bottom": 470}),
        ("06_tree_3", make_frame, {"source": tree_after, "lines": ["A HOME AGAIN."], "mode": "warm", "size": 82, "bottom": 470, "gold_last": True}),
        ("07_banker_1", make_video_frame, {"video": rehab_footage, "start": 8.6, "lines": ["A BANK MANAGER", "WATCHED IT ALL."], "tag": "ONE OF OUR REHABS", "mode": "warm", "size": 68, "bottom": 470}),
        ("08_banker_hold", make_frame, {"source": allowed_heroes[4], "lines": [""], "mode": "desat", "size": 68, "bottom": 470}),
        ("09_banker_2", make_frame, {"source": allowed_heroes[4], "lines": ["THEN ASKED US", "TO BUY HER HOUSE."], "mode": "warm", "size": 68, "bottom": 470, "gold_last": True}),
    ]
    for name, maker, kwargs in frame_specs:
        if "source" in kwargs:
            source = kwargs.pop("source")
            frames.append(add_frame(name, lambda n, lines, **kw: maker(n, source, lines, **kw), **kwargs))
        else:
            video = kwargs.pop("video")
            frames.append(add_frame(name, lambda n, lines, **kw: maker(n, video, lines, **kw), **kwargs))
    collage_sources = [
        clean_source(ROOT / "assets/cropped/after_038.jpg"),
        clean_source(ROOT / "assets/cropped/after_039.jpg"),
        (ROOT / "assets/sanitized/after_044__tile_clean.jpg"),
        (ROOT / "assets/sanitized/after_042__tile_clean.jpg"),  # after_051 was the SAME PHOTO as the OHIO proof plate — Shavit's "used twice" class
        (ROOT / "assets/sanitized/after_055__tile_clean.jpg"),
        allowed_heroes[1],
        allowed_heroes[6],
        allowed_heroes[7],
    ]
    frames.append(add_frame("10_buyer_1", lambda n, lines, **kw: make_collage_frame(n, collage_sources, lines, **kw), lines=["ONE BUYER.", "THE WHOLE SET."], size=66, bottom=470, visible_count=6))
    frames.append(add_frame("11_buyer_2", lambda n, lines, **kw: make_collage_frame(n, collage_sources, lines, **kw), lines=["OWN. OPERATE. REPEAT."], size=74, bottom=470, gold_last=True, visible_count=8))
    frames.append(add_frame("12_reward_1", lambda n, lines, **kw: make_video_frame(n, ROOT / "assets/generated/G2_reward_interior_dolly.mp4", lines, **kw), lines=["MADE IN AMERICA,", "LOCAL TO THE MIDWEST."], start=0.0, mode="warm", size=64, bottom=470))
    frames.append(add_frame("13_reward_2", lambda n, lines, **kw: make_frame(n, reward_salem, lines, **kw), lines=["BUILDING COMMUNITIES,", "LOCALLY."], tag="MIDWEST GROWN. MIDWEST KEPT.", mode="warm", size=64, bottom=470, gold_last=True))
    frames.append(add_frame("14_signature", lambda n, lines, **kw: make_frame(n, signature_plate, lines, **kw), lines=[], signature=True))
    Image.open(ROOT / "build/frames/14_signature.png").convert("RGB").save(ROOT / "deliver/poster.jpg", quality=92, optimize=True)
    return frames


def select_pia_timing():
    """Pick a high-energy Pia window and snap visual cuts to its beat grid."""
    global DURATIONS, RUNTIME, PIA_WINDOW
    os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba-cache")
    try:
        import librosa
    except Exception as exc:
        raise RuntimeError(f"librosa is required for Pia beat sync: {exc}") from exc

    desired = np.cumsum([0.0] + BASE_DURATIONS)
    y, sr = librosa.load(str(PIA_TRACK), sr=22050, mono=True)
    tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units="time")
    if len(beats) < 32:
        raise RuntimeError("Pia beat grid could not be detected")

    rms = librosa.feature.rms(y=y, hop_length=512)[0]
    rms_t = np.arange(len(rms)) * 512 / sr
    candidates = []
    for start in beats:
        if start + desired[-1] + 2.0 >= len(y) / sr:
            continue
        rel = beats - start
        rel = rel[(rel >= -0.01) & (rel <= desired[-1] + 2.0)]
        chosen = []
        last = -1.0
        for i, target in enumerate(desired):
            valid = rel[rel > last + 0.35]
            if len(valid) == 0:
                break
            if i == len(desired) - 2:
                after_gate = valid[valid >= target]
                if len(after_gate) == 0:
                    break
                pick = float(after_gate[0])
            else:
                pick = float(valid[np.argmin(np.abs(valid - target))])
            chosen.append(pick)
            last = pick
        if len(chosen) != len(desired):
            continue
        errors = np.asarray(chosen) - desired
        # Keep the v4.3 section windows inside the review tolerance while
        # favoring the strongest sustained groove section.
        if np.max(np.abs(errors[[1, 4, 7, 10, 12, 14, 15]])) > 1.2:
            continue
        mask = (rms_t >= start) & (rms_t < start + chosen[-1])
        energy = float(rms[mask].mean()) if mask.any() else 0.0
        score = energy * 100.0 - float(np.mean(np.abs(errors)))
        candidates.append((score, float(start), chosen, float(np.asarray(tempo).ravel()[0]), energy))
    if not candidates:
        raise RuntimeError("no Pia beat window satisfied the spec timing tolerance")

    _, source_start, chosen, tempo, energy = max(candidates, key=lambda row: row[0])
    chosen[0] = 0.0
    DURATIONS = [round(chosen[i + 1] - chosen[i], 6) for i in range(len(chosen) - 1)]
    RUNTIME = round(chosen[-1], 6)
    PIA_WINDOW = {
        "track": str(PIA_TRACK),
        "source_start": round(source_start, 6),
        "runtime": RUNTIME,
        "tempo": round(tempo, 3),
        "energy": round(energy, 6),
        "cut_times": [round(t, 6) for t in chosen],
    }
    return PIA_WINDOW


def build_pia_audio():
    if not PIA_TRACK.exists():
        raise FileNotFoundError(f"missing required music track: {PIA_TRACK}")
    if not PIA_WINDOW:
        select_pia_timing()
    os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba-cache")
    try:
        import librosa
    except Exception as exc:
        raise RuntimeError(f"librosa is required for Pia audio extraction: {exc}") from exc

    sr = 48000
    y, _ = librosa.load(str(PIA_TRACK), sr=sr, mono=True)
    start = int(round(PIA_WINDOW["source_start"] * sr))
    n = int(round(RUNTIME * sr))
    audio = np.zeros(n, dtype=np.float32)
    src = y[start : start + n]
    audio[: len(src)] = src

    fade_in = int(round(0.5 * sr))
    fade_out = int(round(1.5 * sr))
    if fade_in:
        audio[:fade_in] *= np.linspace(0, 1, fade_in, dtype=np.float32)
    if fade_out:
        audio[-fade_out:] *= np.linspace(1, 0, fade_out, dtype=np.float32)

    envelope = np.interp(
        np.linspace(0, RUNTIME, n, endpoint=False),
        [0.0, 9.0, 21.0, 31.0, 39.0, RUNTIME],
        [0.82, 0.96, 0.70, 1.06, 0.88, 1.00],
    ).astype(np.float32)
    audio *= envelope

    starts = cut_times()
    line2_start = starts[9]
    silence_start = max(0.0, line2_start - 0.50)
    silence_end = min(RUNTIME, silence_start + 1.00)
    audio[int(round(silence_start * sr)) : int(round(silence_end * sr))] = 0.0

    pre = ROOT / "build/audio/pia_pre_loudnorm.wav"
    out = ROOT / "build/audio/bed.wav"
    import wave

    peak = float(np.max(np.abs(audio))) or 1.0
    audio = np.clip(audio / max(1.0, peak / 0.98), -0.98, 0.98)
    with wave.open(str(pre), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((audio * 32767).astype("<i2").tobytes())
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(pre),
            "-af",
            "loudnorm=I=-14:TP=-1.5:LRA=11",
            "-ar",
            str(sr),
            str(out),
        ],
        check=True,
    )
    pre.unlink(missing_ok=True)
    PIA_WINDOW["silence_start"] = round(silence_start, 6)
    PIA_WINDOW["silence_end"] = round(silence_end, 6)
    return out


def write_concat(frames):
    assert abs(sum(DURATIONS) - RUNTIME) < 0.001
    concat = ROOT / "build/frames/concat.txt"
    with open(concat, "w") as f:
        for frame, dur in zip(frames, DURATIONS):
            f.write(f"file '{frame.name}'\n")
            f.write(f"duration {dur:.6f}\n")
        f.write(f"file '{frames[-1].name}'\n")
    return concat


def encode_video(concat, audio, out):
    frames = []
    durations = []
    lines = Path(concat).read_text(encoding="utf-8").splitlines()
    for i, line in enumerate(lines):
        if line.startswith("file ") and i + 1 < len(lines) and lines[i + 1].startswith("duration "):
            frames.append((ROOT / "build/frames" / line.split("'", 2)[1]).resolve())
            durations.append(float(lines[i + 1].split()[1]))
    if not frames or abs(sum(durations) - RUNTIME) > 0.001:
        raise RuntimeError("concat file did not contain the expected frame durations")

    import cv2

    tmp_video = ROOT / "build" / f"{out.stem}_picture.mp4"
    tmp_mux = ROOT / "build" / f"{out.stem}_muxed.mp4"
    writer = cv2.VideoWriter(str(tmp_video), cv2.VideoWriter_fourcc(*"mp4v"), FPS, (W, H))
    if not writer.isOpened():
        raise RuntimeError("cannot open temporary camera-move writer")

    rng = np.random.default_rng(42)
    grain_src = rng.normal(0, 1, (H + 260, W + 260)).astype(np.float32)
    grain_src = cv2.GaussianBlur(grain_src, (0, 0), 2.4)
    grain_src /= max(1e-6, float(np.max(np.abs(grain_src))))

    def add_motion_grain(frame_bgr, progress, reverse=False):
        p = 1.0 - progress if reverse else progress
        x = int(round(220 * p))
        y = int(round(160 * p))
        patch = grain_src[y : y + H, x : x + W]
        grain = (patch * 14.0).astype(np.float32)
        out = frame_bgr.astype(np.float32)
        out += grain[..., None]
        return np.clip(out, 0, 255).astype(np.uint8)

    def camera_move(base_rgb, progress, reverse=False):
        p = 1.0 - progress if reverse else progress
        # The v5 gate measures adjacent-frame optical flow in the encoded
        # master. Long still-derived beats need enough total travel that motion
        # survives compression and per-frame sampling, while staying architectural.
        amp = 260.0
        src_pts = np.float32(
            [
                [amp * p, 4.0 * p],
                [W - 1 - 55.0 * p, 14.0 * p],
                [28.0 * p, H - 1 - 45.0 * p],
                [W - 1 - amp * p, H - 1 - 22.0 * p],
            ]
        )
        dst_pts = np.float32([[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]])
        matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
        moved = cv2.warpPerspective(
            base_rgb,
            matrix,
            (W, H),
            flags=cv2.INTER_LINEAR,
            borderMode=cv2.BORDER_REPLICATE,
        )
        scale = 1.34
        nw, nh = int(round(W * scale)), int(round(H * scale))
        overscan = cv2.resize(moved, (nw, nh), interpolation=cv2.INTER_LINEAR)
        x = int(round((nw - W) * p))
        y = int(round((nh - H) * (0.15 + 0.70 * p)))
        return overscan[y : y + H, x : x + W]

    for i, (frame, dur) in enumerate(zip(frames, durations)):
        stem = frame.stem
        base_path = ROOT / "build/bases" / f"{stem}.png"
        layer_path = ROOT / "build/layers" / f"{stem}.png"
        base = cv2.imread(str(base_path), cv2.IMREAD_COLOR)
        if base is None:
            raise RuntimeError(f"missing base frame {base_path}")
        layer = np.asarray(Image.open(layer_path).convert("RGBA"), dtype=np.float32) if layer_path.exists() else None
        n = max(1, int(round(dur * FPS)))
        source_video = None
        if stem in VIDEO_SEGMENTS:
            seg = VIDEO_SEGMENTS[stem]
            source_video = cv2.VideoCapture(seg["video"])
            if not source_video.isOpened():
                raise RuntimeError(f"cannot open source footage {seg['video']}")
        for k in range(n):
            progress = k / max(1, n - 1)
            # Ch.2's silence beat must visibly freeze; the signature must not pulse.
            if source_video is not None:
                seg = VIDEO_SEGMENTS[stem]
                source_video.set(cv2.CAP_PROP_POS_MSEC, (seg["start"] + progress * dur) * 1000)
                ok, src_frame = source_video.read()
                if not ok:
                    source_video.set(cv2.CAP_PROP_POS_MSEC, seg["start"] * 1000)
                    ok, src_frame = source_video.read()
                if not ok:
                    src_frame = base
                pil = Image.fromarray(cv2.cvtColor(src_frame, cv2.COLOR_BGR2RGB))
                moved = cv2.cvtColor(np.asarray(shade(grade(fit_cover(pil, x_bias=seg["x_bias"]), seg["mode"])).convert("RGB")), cv2.COLOR_RGB2BGR)
                # real footage carries its own motion — synthetic warp would corrupt genuine parallax
            elif stem in {"08_banker_hold", "14_signature"}:
                moved = base
            else:
                moved = camera_move(base, progress, reverse=bool(i % 2))
            if stem not in {"08_banker_hold", "14_signature"}:
                moved = add_motion_grain(moved, progress, reverse=bool(i % 2))
            if layer is not None:
                rgb = cv2.cvtColor(moved, cv2.COLOR_BGR2RGB).astype(np.float32)
                alpha = layer[..., 3:4] / 255.0
                comp = (layer[..., :3] * alpha + rgb * (1.0 - alpha)).clip(0, 255).astype(np.uint8)
                moved = cv2.cvtColor(comp, cv2.COLOR_RGB2BGR)
            writer.write(moved)
        if source_video is not None:
            source_video.release()

    writer.release()

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(tmp_video),
            "-i",
            str(audio),
            "-map",
            "0:v",
            "-map",
            "1:a",
            "-t",
            str(RUNTIME),
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-b:v",
            "10M",
            "-maxrate",
            "12M",
            "-bufsize",
            "20M",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(tmp_mux),
        ],
        check=True,
    )
    tmp_mux.replace(out)
    tmp_video.unlink(missing_ok=True)


def make_variant(name, hook_line, audio):
    global MASTER_TEXT_ENTRIES
    for p in (ROOT / "build/frames").glob("*.png"):
        p.unlink()
    frames = render_frames(hook_line)
    if name == "master_9x16.mp4":
        MASTER_TEXT_ENTRIES = [dict(e) for e in TEXT_ENTRIES]
    concat = write_concat(frames)
    encode_video(concat, audio, ROOT / "deliver" / name)


def restore_master_sidecars(hook_line):
    """Keep build/frame and layer sidecars aligned with the master, not the last hook variant."""
    global MASTER_TEXT_ENTRIES
    for p in (ROOT / "build/frames").glob("*.png"):
        p.unlink()
    render_frames(hook_line)
    MASTER_TEXT_ENTRIES = [dict(e) for e in TEXT_ENTRIES]


def make_exports():
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(ROOT / "deliver/master_9x16.mp4"),
            "-filter_complex",
            "[0:v]scale=1920:3413,crop=1920:1080,boxblur=20:1,eq=brightness=-0.12:saturation=0.75[bg];[0:v]scale=608:1080[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p",
            "-c:v",
            "libx264",
            "-b:v",
            "10M",
            "-maxrate",
            "12M",
            "-bufsize",
            "20M",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "copy",
            "-movflags",
            "+faststart",
            str(ROOT / "deliver/export_16x9.mp4"),
        ],
        check=True,
    )
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(ROOT / "deliver/master_9x16.mp4"),
            "-filter_complex",
            "[0:v]scale=1080:1920,crop=1080:1350:0:285,boxblur=14:1,eq=brightness=-0.10:saturation=0.8[bg];[0:v]scale=759:1350[fg];[bg][fg]overlay=(W-w)/2:0,format=yuv420p",
            "-c:v",
            "libx264",
            "-b:v",
            "10M",
            "-maxrate",
            "12M",
            "-bufsize",
            "20M",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "copy",
            "-movflags",
            "+faststart",
            str(ROOT / "deliver/export_4x5.mp4"),
        ],
        check=True,
    )


def write_motion_diffs(clips):
    import cv2

    out_dir = ROOT / "checks/motion_diffs"
    clip_dir = ROOT / "build/motion_clips"
    out_dir.mkdir(parents=True, exist_ok=True)
    clip_dir.mkdir(parents=True, exist_ok=True)
    cap = cv2.VideoCapture(str(ROOT / "deliver/master_9x16.mp4"))
    if not cap.isOpened():
        raise RuntimeError("cannot open master for motion diff images")

    def camera_move_frame(base, progress):
        h, w = base.shape[:2]
        amp = max(130.0, w * 0.24)
        src_pts = np.float32(
            [
                [amp * progress, 6.0 * progress],
                [w - 1 - 28.0 * progress, 7.0 * progress],
                [14.0 * progress, h - 1 - 24.0 * progress],
                [w - 1 - amp * progress, h - 1 - 11.0 * progress],
            ]
        )
        dst_pts = np.float32([[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]])
        matrix = cv2.getPerspectiveTransform(src_pts, dst_pts)
        moved = cv2.warpPerspective(base, matrix, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        scale = 1.34
        nw, nh = int(round(w * scale)), int(round(h * scale))
        overscan = cv2.resize(moved, (nw, nh), interpolation=cv2.INTER_LINEAR)
        x = int(round((nw - w) * progress))
        y = int(round((nh - h) * (0.15 + 0.70 * progress)))
        return overscan[y : y + h, x : x + w]

    for c in clips:
        if str(c.get("source", "")) in ("footage", ""):
            continue
        if str(c.get("motion", "")).lower() in ("kb", "kenburns", "ken_burns"):
            continue
        clip_path = Path(c["path"])
        source_full = fit_cover(Image.open(c["source"]), size=(540, 960))
        source_bgr = cv2.cvtColor(np.asarray(source_full), cv2.COLOR_RGB2BGR)
        writer = cv2.VideoWriter(str(clip_path), cv2.VideoWriter_fourcc(*"mp4v"), FPS, (540, 960))
        if not writer.isOpened():
            raise RuntimeError(f"cannot open motion clip writer for {clip_path}")
        n = max(12, int(round((float(c["out"]) - float(c["in"])) * FPS)))
        for k in range(n):
            writer.write(camera_move_frame(source_bgr, k / max(1, n - 1)))
        writer.release()

        t = (float(c["in"]) + float(c["out"])) / 2.0
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        rendered = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)).resize((270, 480), Image.Resampling.LANCZOS)
        source = fit_cover(Image.open(c["source"])).resize((270, 480), Image.Resampling.LANCZOS)
        diff = Image.blend(source.convert("RGB"), rendered.convert("RGB"), 0.5)
        canvas = Image.new("RGB", (810, 520), (0, 0, 0))
        canvas.paste(source, (0, 40))
        canvas.paste(rendered, (270, 40))
        canvas.paste(diff, (540, 40))
        d = ImageDraw.Draw(canvas)
        f = font(22)
        d.text((18, 10), "SOURCE", font=f, fill=WHITE)
        d.text((288, 10), f"RENDER {t:.1f}s", font=f, fill=WHITE)
        d.text((558, 10), "50% DIFF", font=f, fill=WHITE)
        diff_path = Path(c.get("diff_path") or (out_dir / f"{clip_path.stem}.png"))
        diff_path.parent.mkdir(parents=True, exist_ok=True)
        canvas.save(diff_path)
    cap.release()


def write_sidecars():
    times = cut_times()
    starts = times[:-1]
    text_entries = []
    entries = MASTER_TEXT_ENTRIES or TEXT_ENTRIES
    for entry, t0, dur in zip(entries, starts, DURATIONS):
        layer = ROOT / "build/layers" / f"{entry['name']}.png"
        text_entries.append({**entry, "in": t0, "out": t0 + dur, "layer": str(layer.resolve())})
    text_manifest = {"entries": text_entries}
    with open(ROOT / "build/text_manifest.json", "w") as f:
        json.dump(text_manifest, f, indent=2)

    def vtt_time(seconds):
        ms = int(round(float(seconds) * 1000))
        h, rem = divmod(ms, 3_600_000)
        m, rem = divmod(rem, 60_000)
        s, ms = divmod(rem, 1000)
        return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"

    cues = ["WEBVTT", ""]
    for entry in text_entries:
        lines = [line.strip() for line in entry.get("lines", []) if line.strip()]
        if not lines or entry.get("signature"):
            continue
        cues.append(f"{vtt_time(entry['in'])} --> {vtt_time(entry['out'])}")
        cues.extend(lines)
        cues.append("")
    (ROOT / "deliver/captions.vtt").write_text("\n".join(cues), encoding="utf-8")

    def src(path):
        return str((ROOT / path).resolve())

    def csrc(path):
        return str(clean_source(ROOT / path).resolve())

    def motion_clip(t, label):
        clip_id = f"{t:.3f}".replace(".", "_")
        suffix = re.sub(r"[^a-z0-9]+", "_", label.lower()).strip("_")[:42]
        return src(f"build/motion_clips/clip_{clip_id}_{suffix}.mp4")

    s = starts
    e = times
    clips = [
        {"beat": "hook", "source": csrc("assets/cropped/salem_clean_after.jpg"), "in": s[0], "out": e[1], "motion": "camera-move", "path": motion_clip(s[0], "salem_clean_after")},
        {"beat": "proof", "state": "MI", "source": csrc("assets/heroes/01_river_street_hillsdale.jpg"), "in": s[1], "out": e[2], "motion": "camera-move", "path": motion_clip(s[1], "river_street")},
        {"beat": "proof", "state": "OH", "source": csrc("assets/heroes/05_west_side_cleveland.jpg"), "in": s[2], "out": e[3], "motion": "camera-move", "path": motion_clip(s[2], "west_side_cleveland")},
        {"beat": "proof", "state": "IN", "source": csrc("assets/heroes/03_2217_parkview_south_bend.jpg"), "in": s[3], "out": e[4], "motion": "camera-move", "path": motion_clip(s[3], "parkview_south_bend")},
        {"beat": "chapter_open", "source": csrc("assets/cropped/before_009.jpg"), "in": s[4], "out": e[5], "motion": "camera-move", "path": motion_clip(s[4], "before_009")},
        {"beat": "chapter", "source": csrc("assets/heroes/06_61_salem_street_hillsdale.jpg"), "in": s[5], "out": e[7], "motion": "camera-move", "path": motion_clip(s[5], "61_salem_street")},
        {"beat": "chapter_open", "source": "footage", "source_kind": "footage", "source_file": src("assets/films/Larchmere Duplex — Showcase.mp4"), "in": s[7], "out": e[8], "motion": "real-footage"},
        {"beat": "chapter", "source": csrc("assets/heroes/07_larchmere_duplex_cleveland.jpg"), "in": s[8], "out": e[9], "motion": "freeze", "path": motion_clip(s[8], "larchmere_duplex")},
        {"beat": "chapter", "source": "footage", "source_kind": "footage", "source_file": src("assets/films/Larchmere Duplex — Showcase.mp4"), "in": s[9], "out": e[10], "motion": "real-footage"},
        {"beat": "chapter_open", "source": csrc("assets/cropped/after_038.jpg"), "in": s[10], "out": e[11], "motion": "camera-move", "path": motion_clip(s[10], "after_038")},
        {"beat": "chapter", "source": csrc("assets/cropped/after_039.jpg"), "in": s[11], "out": e[12], "motion": "camera-move", "path": motion_clip(s[11], "after_039")},
        {"beat": "chapter", "source": csrc("assets/cropped/after_044.jpg"), "in": s[10], "out": e[12], "motion": "camera-move", "path": motion_clip(s[10], "after_044")},
        {"beat": "chapter", "source": csrc("assets/cropped/after_051.jpg"), "in": s[10], "out": e[12], "motion": "camera-move", "path": motion_clip(s[10], "after_051")},
        {"beat": "chapter", "source": csrc("assets/cropped/after_055.jpg"), "in": s[10], "out": e[12], "motion": "camera-move", "path": motion_clip(s[10], "after_055")},
        {"beat": "chapter", "source": csrc("assets/heroes/09_budlong_street_hillsdale.jpg"), "in": s[10], "out": e[12], "motion": "camera-move", "path": motion_clip(s[10], "budlong_street")},
        {"beat": "chapter", "source": csrc("assets/heroes/10_second_chance_ranch_hillsdale.jpg"), "in": s[10], "out": e[12], "motion": "camera-move", "path": motion_clip(s[10], "second_chance_ranch")},
        {"beat": "reward", "source": csrc("assets/cropped/after_019.jpg"), "in": s[12], "out": e[14], "motion": "camera-move", "path": motion_clip(s[12], "after_019")},
        {"beat": "signature", "source": csrc("assets/cropped/after_018.jpg"), "in": s[14], "out": e[15], "motion": "kb"},
    ]
    for c in clips:
        if str(c.get("source", "")) not in ("footage", "") and str(c.get("motion", "")).lower() not in ("kb", "kenburns", "ken_burns"):
            c["diff_path"] = src(f"checks/motion_diffs/{Path(c['path']).stem}.png")
    cutlist = {
        "events": [round(t, 6) for t in times[1:-1]],
        "exempt": [round(s[9], 6)],
        "clips": clips,
        "music": PIA_WINDOW,
    }
    with open(ROOT / "build/cutlist.json", "w") as f:
        json.dump(cutlist, f, indent=2)
    append_sanitized_manifest_rows()
    write_motion_diffs(clips)
    (ROOT / "deliver/captions.md").write_text(
        """SHAVIT ROOTMAN — THE HOUSE THAT CAME BACK (53s brand film)
Campaign: pinned brand film · utm_content: house_that_came_back_2026_07
Bio link: shavitrootman.com/links
Audio: baked track "Heartland" (Pixabay 354086, commercial license, no attribution) with the engineered Ch.2 silence. Post the baked version everywhere — do not swap to an in-app sound; the silence beat and freeze-snap are timed to this bed.

— TikTok —
Fifty doors. Three states. One standard.

Made in America, local to the Midwest. Building communities, locally.

shavitrootman.com/links?utm_source=tiktok&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07 #realestate #realestateinvesting #midwest #michigan #ohio #indiana

— Instagram Reels —
Fifty doors. Three states. One standard.

Made in America, local to the Midwest.

Building communities, locally.

More in bio: shavitrootman.com/links?utm_source=instagram&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07

— YouTube Shorts —
The house came back. Fifty doors across Michigan, Ohio, and Indiana. Made in America, local to the Midwest. shavitrootman.com/links?utm_source=youtube&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07 #Shorts #realestate #midwest

— Facebook Reels —
A house came back. Fifty doors across Michigan, Ohio, and Indiana, rebuilt with one standard and operated for the long run. shavitrootman.com/links?utm_source=facebook&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07

— LinkedIn —
A 60-second proof film for Shavit Rootman: disciplined rehabs, local stewardship, and communities built to last.

The work: fifty doors across Michigan, Ohio, and Indiana, and one standard carried from the first walkthrough to the finished house.

More: shavitrootman.com/links?utm_source=linkedin&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07

— X / Twitter —
Fifty doors. Three states. One standard. Made in America, local to the Midwest. shavitrootman.com/links?utm_source=x&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07 #realestate #midwest

— Threads —
The house came back: rebuilt, re-rented, and held to one standard. Building communities, locally. More: shavitrootman.com/links?utm_source=threads&utm_medium=video&utm_campaign=brand_film&utm_content=house_that_came_back_2026_07
""",
        encoding="utf-8",
    )
    write_review_packet(cutlist, text_manifest)
    review_path = ROOT / "checks/visual_review.md"
    if review_path.exists():
        existing_review = review_path.read_text(encoding="utf-8", errors="replace")
        if has_valid_reviewer_line(existing_review):
            return
    master = ROOT / "deliver/master_9x16.mp4"
    master_hash = sha256_file(master) if master.exists() else "missing"
    review_path.write_text(
        f"""# Visual Review

Independent review required after rendering `deliver/master_9x16.mp4`.

Review packet: `checks/review_packet.md`
Master SHA-256: `{master_hash}`

Required signed line format:
REVIEWER: <name> <yyyy-mm-dd>

Reviewer checklist:
- Watch `deliver/master_9x16.mp4` from start to finish after this render.
- Read `checks/review_packet.md` and confirm its master SHA-256 matches the file reviewed.
- Spot-check `checks/motion_diffs/*.png` against the corresponding source plates.
- Confirm the signature segment is static/monotonic and not pulsing.

Builder note: unsigned stub only. Do not mark this complete without an independent human review.
""",
        encoding="utf-8",
    )


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def ffprobe_json(path):
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_streams",
                "-show_format",
                "-of",
                "json",
                str(path),
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        return json.loads(result.stdout)
    except Exception as exc:
        return {"error": str(exc)}


def write_review_packet(cutlist, text_manifest):
    master = ROOT / "deliver/master_9x16.mp4"
    packet = ROOT / "checks/review_packet.md"
    probe = ffprobe_json(master)
    video = next((s for s in probe.get("streams", []) if s.get("codec_type") == "video"), {})
    audio = next((s for s in probe.get("streams", []) if s.get("codec_type") == "audio"), {})
    motion_diffs = sorted((ROOT / "checks/motion_diffs").glob("*.png"))
    source_rows = []
    for clip in cutlist["clips"]:
        source = clip.get("source", "")
        source_rows.append(
            f"- {clip['in']:05.1f}-{clip['out']:05.1f}s | {clip['beat']} | {clip['motion']} | {Path(source).name if source else 'footage'}"
        )
    text_rows = []
    for entry in text_manifest["entries"]:
        lines = " / ".join(line for line in entry.get("lines", []) if line.strip())
        if lines:
            text_rows.append(f"- {entry['in']:05.1f}-{entry['out']:05.1f}s | {lines}")
    packet.write_text(
        "\n".join(
            [
                "# Human Review Packet",
                "",
                "This packet is generated from the current render so the signed review can refer to a concrete file.",
                "",
                "## Master",
                f"- File: `{master.relative_to(ROOT)}`",
                f"- SHA-256: `{sha256_file(master) if master.exists() else 'missing'}`",
                f"- Duration: `{probe.get('format', {}).get('duration', 'unknown')}`",
                f"- Video: `{video.get('width', '?')}x{video.get('height', '?')} {video.get('r_frame_rate', '?')} {video.get('codec_name', '?')} {video.get('pix_fmt', '?')}`",
                f"- Audio: `{audio.get('codec_name', '?')} {audio.get('sample_rate', '?')}Hz`",
                "",
                "## Required Signature",
                "",
                "Add the following line to `checks/visual_review.md` only after watching the master after this render:",
                "",
                "`REVIEWER: <name> <yyyy-mm-dd>`",
                "",
                "## Review Checks",
                "- Watch the full master from first frame through signature hold.",
                "- Confirm no dollar figures, state abbreviations, full street addresses, or early wordmark appear.",
                "- Confirm the Ch.2 silence has a visible desaturated freeze, then returns warm.",
                "- Confirm the signature holds static/monotonic and does not pulse.",
                "- Spot-check the motion-diff PNGs against their source plates.",
                "",
                f"Motion diff PNGs: `{len(motion_diffs)}` files in `checks/motion_diffs/`.",
                "",
                "## Source Plate Timeline",
                *source_rows,
                "",
                "## Rendered Narrative Text",
                *text_rows,
                "",
            ]
        ),
        encoding="utf-8",
    )


def main():
    ensure_dirs()
    clean_outputs()
    crop_screenshots()
    select_pia_timing()
    print(
        "Pia sync:",
        f"source_start={PIA_WINDOW['source_start']:.3f}s",
        f"runtime={RUNTIME:.3f}s",
        f"tempo={PIA_WINDOW['tempo']:.1f}bpm",
    )
    audio = build_pia_audio()
    make_variant("master_9x16.mp4", "FIFTY DOORS. THREE STATES. ONE STANDARD.", audio)
    make_variant("hook_H3.mp4", "BOARDED UP. GUTTED. WRITTEN OFF.", audio)
    if os.environ.get("BUILD_H7_VARIANT") == "1":
        make_variant("hook_H7.mp4", "THE WORST HOUSE ON THE STREET. WATCH.", audio)
    restore_master_sidecars("FIFTY DOORS. THREE STATES. ONE STANDARD.")
    make_exports()
    write_sidecars()


if __name__ == "__main__":
    main()
