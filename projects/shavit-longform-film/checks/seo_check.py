#!/usr/bin/env python3
import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self._in_title = False
        self.h1 = 0
        self.h2 = 0
        self.meta = []
        self.links = []
        self.scripts = []
        self._script_type = None
        self._script_text = []
        self.video_sources = []
        self.video_has_controls = False
        self.video_aria = False
        self.video_width = ""
        self.video_height = ""
        self.video_tracks = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self._in_title = True
        if tag == "h1":
            self.h1 += 1
        if tag == "h2":
            self.h2 += 1
        if tag == "meta":
            self.meta.append(attrs)
        if tag == "link":
            self.links.append(attrs)
        if tag == "script":
            self._script_type = attrs.get("type")
            self._script_text = []
        if tag == "video":
            self.video_has_controls = "controls" in attrs
            self.video_aria = bool(attrs.get("aria-label"))
            self.video_width = attrs.get("width", "")
            self.video_height = attrs.get("height", "")
        if tag == "source":
            self.video_sources.append(attrs.get("src", ""))
        if tag == "track":
            self.video_tracks.append(attrs)

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._script_type == "application/ld+json":
            self._script_text.append(data)

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "script" and self._script_type == "application/ld+json":
            self.scripts.append("".join(self._script_text))
            self._script_type = None
            self._script_text = []


def meta_content(parser, **needle):
    for item in parser.meta:
        if all(item.get(k) == v for k, v in needle.items()):
            return item.get("content", "")
    return ""


def has_link(parser, rel):
    return any(item.get("rel") == rel and item.get("href") for item in parser.links)


def link_href(parser, rel):
    for item in parser.links:
        if item.get("rel") == rel and item.get("href"):
            return item.get("href", "")
    return ""


def fail(message):
    print(message, file=sys.stderr)
    sys.exit(1)


def main():
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    parser = PageParser()
    parser.feed(html)

    title = re.sub(r"\s+", " ", parser.title).strip()
    desc = meta_content(parser, name="description")
    if not (1 <= len(title) <= 60):
        fail(f"title length out of range: {len(title)}")
    if not (1 <= len(desc) <= 155):
        fail(f"description length out of range: {len(desc)}")
    if parser.h1 != 1 or parser.h2 < 2:
        fail(f"heading structure failed: h1={parser.h1} h2={parser.h2}")
    if not has_link(parser, "canonical"):
        fail("missing canonical link")
    if 'href="#transcript"' not in html or 'id="transcript"' not in html:
        fail("visible transcript section/nav link missing")
    if link_href(parser, "preload") != "deliver/poster.jpg":
        fail("poster preload missing")
    if "index,follow" not in meta_content(parser, name="robots"):
        fail("robots meta must explicitly allow indexing")
    for prop in [
        "og:type",
        "og:site_name",
        "og:title",
        "og:description",
        "og:image",
        "og:image:width",
        "og:image:height",
        "og:video",
        "og:video:secure_url",
        "og:video:type",
        "og:video:width",
        "og:video:height",
    ]:
        if not meta_content(parser, property=prop):
            fail(f"missing {prop}")
    if meta_content(parser, property="og:video:type") != "video/mp4":
        fail("og:video:type must be video/mp4")
    if meta_content(parser, property="og:image:width") != "1080" or meta_content(parser, property="og:image:height") != "1920":
        fail("og:image dimensions must match poster")
    if meta_content(parser, property="og:video:width") != "1080" or meta_content(parser, property="og:video:height") != "1920":
        fail("og:video dimensions must match master")
    for name in ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]:
        if not meta_content(parser, name=name):
            fail(f"missing {name}")
    if not parser.video_has_controls or not parser.video_aria or "deliver/master_9x16.mp4" not in parser.video_sources:
        fail("accessible local video embed missing")
    if 'aria-describedby="transcript-summary"' not in html:
        fail("video must reference the visible transcript summary")
    if parser.video_width != "1080" or parser.video_height != "1920":
        fail("video width/height attributes must reserve 9:16 layout")
    caption_tracks = [
        item for item in parser.video_tracks
        if item.get("kind") == "captions"
        and item.get("src") == "deliver/captions.vtt"
        and item.get("srclang") == "en"
        and "default" in item
    ]
    if not caption_tracks:
        fail("default English captions track missing")

    if len(parser.scripts) != 1:
        fail("expected one JSON-LD script")
    data = json.loads(parser.scripts[0])
    required = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "The House That Came Back",
        "duration": "PT53S",
        "encodingFormat": "video/mp4",
        "inLanguage": "en-US",
        "width": 1080,
        "height": 1920,
    }
    for key, value in required.items():
        if data.get(key) != value:
            fail(f"JSON-LD {key} mismatch")
    for key in ["description", "thumbnailUrl", "uploadDate", "contentUrl", "embedUrl", "publisher", "transcript"]:
        if key not in data:
            fail(f"JSON-LD missing {key}")
    transcript = re.sub(r"\s+", " ", data["transcript"]).lower()
    for fragment in [
        "made in america, local to the midwest",
        "own. operate. repeat.",
        "midwest grown. midwest kept.",
        "building communities, locally.",
    ]:
        if fragment not in transcript:
            fail(f"JSON-LD transcript missing canonical line: {fragment}")
    visible_text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html)).lower()
    for fragment in [
        "film transcript",
        "fifty doors. three states. one standard.",
        "michigan. ohio. indiana.",
        "made in america, local to the midwest.",
        "a bank manager watched it all. then asked us to buy her house.",
        "one buyer. the whole set. own. operate. repeat.",
        "midwest grown. midwest kept. building communities, locally.",
    ]:
        if fragment not in visible_text:
            fail(f"visible transcript missing canonical line: {fragment}")

    robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
    if "User-agent: *" not in robots or "Sitemap:" not in robots:
        fail("robots.txt missing allow/sitemap directives")
    sitemap = ET.parse(ROOT / "sitemap.xml")
    locs = [node.text for node in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
    if "https://shavitrootman.com/the-house-that-came-back/" not in locs:
        fail("sitemap missing canonical URL")

    for rel in ["deliver/master_9x16.mp4", "deliver/export_16x9.mp4", "deliver/export_4x5.mp4", "deliver/poster.jpg", "deliver/captions.md", "deliver/captions.vtt"]:
        if not (ROOT / rel).is_file():
            fail(f"linked deliverable missing: {rel}")
    vtt = (ROOT / "deliver/captions.vtt").read_text(encoding="utf-8")
    if not vtt.startswith("WEBVTT\n") or len(re.findall(r"\d\d:\d\d:\d\d\.\d{3} --> \d\d:\d\d:\d\d\.\d{3}", vtt)) < 8:
        fail("captions.vtt missing WEBVTT header or timed cues")

    print("SEO_CHECK: PASS")


if __name__ == "__main__":
    main()
