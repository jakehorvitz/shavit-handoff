#!/usr/bin/env python3
"""shavit-pipeline dev server — serves the repo + spec annotation endpoint.

Run: python3 serve.py [port]      (default 8765)

Endpoints:
  GET  /...            static files from repo root (docs/spec.html is the spec)
  POST /annotate       append {"at","section","comment"} to docs/spec-inbox.jsonl
  GET  /annotations    current annotations as JSON array (spec page shows them)
"""
import html
import json
import os
import sys
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DATA_ROOT = Path(os.environ.get("SHAVIT_ROOT", ROOT)).expanduser()
INBOX = ROOT / "docs" / "spec-inbox.jsonl"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self):
        if self.path != "/annotate":
            self.send_error(404)
            return
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length))
            entry = {
                "at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "section": str(body["section"])[:200],
                "comment": str(body["comment"])[:5000],
            }
        except (KeyError, ValueError, json.JSONDecodeError):
            self.send_error(400, "expected JSON {section, comment}")
            return
        INBOX.parent.mkdir(parents=True, exist_ok=True)
        with INBOX.open("a") as f:
            f.write(json.dumps(entry) + "\n")
        self._json(201, {"ok": True})

    def do_GET(self):
        if self.path == "/annotations":
            entries = []
            if INBOX.exists():
                entries = [json.loads(l) for l in INBOX.read_text().splitlines() if l.strip()]
            self._json(200, entries)
            return
        if self.path in ("/", "/hub"):
            self._html(200, render_hub())
            return
        super().do_GET()

    def _json(self, code, obj):
        payload = json.dumps(obj).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _html(self, code, text):
        payload = text.encode()
        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, fmt, *args):
        sys.stderr.write("serve: " + fmt % args + "\n")


def parse_frontmatter(path):
    meta = {}
    text = path.read_text() if path.exists() else ""
    if not text.startswith("---\n"):
        return meta
    end = text.find("\n---\n", 4)
    if end == -1:
        return meta
    for line in text[4:end].splitlines():
        if ":" in line:
            key, value = line.split(":", 1)
            meta[key.strip()] = value.strip().strip("'\"")
    return meta


def render_hub():
    content = DATA_ROOT / "content"
    posts = []
    if content.exists():
        for d in sorted(p for p in content.iterdir() if p.is_dir()):
            state_file = d / "state"
            state = state_file.read_text().strip() if state_file.exists() else "draft"
            meta = parse_frontmatter(d / "post.md")
            posts.append({
                "id": d.name,
                "state": state,
                "platform": meta.get("platform", ""),
                "target_date": meta.get("target_date", ""),
            })
    queued = sorted(
        [p for p in posts if p["target_date"] and p["state"] in {"reviewed", "shipped"}],
        key=lambda p: (p["target_date"], p["id"]),
    )
    draft_rows = "\n".join(
        f"<tr><td>{html.escape(p['id'])}</td><td>{html.escape(p['state'])}</td>"
        f"<td>{html.escape(p['platform'])}</td><td>{html.escape(p['target_date'])}</td></tr>"
        for p in posts
    ) or "<tr><td colspan='4'>No drafts yet.</td></tr>"
    queue_rows = "\n".join(
        f"<li><time>{html.escape(p['target_date'])}</time> - {html.escape(p['id'])}</li>"
        for p in queued
    ) or "<li>No posts queued for Friday.</li>"
    return f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>shavit-pipeline hub</title></head>
<body>
<h1>shavit-pipeline hub</h1>
<h2>Drafts</h2>
<table><thead><tr><th>Post</th><th>State</th><th>Platform</th><th>Target date</th></tr></thead>
<tbody>{draft_rows}</tbody></table>
<h2>Queued for Friday</h2>
<ul>{queue_rows}</ul>
<p><a href="http://localhost:8766">higgs-timeline video UI</a></p>
</body>
</html>
"""


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"shavit-pipeline server -> http://localhost:{port}/hub")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
