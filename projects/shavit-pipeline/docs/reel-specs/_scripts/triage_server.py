#!/usr/bin/env python3
"""Serve the smash-or-pass triage page.

Videos live all over the place (Messages attachment store, Desktop folders, and
five that only exist in Drive), so the page never gets raw paths — it asks for
/media/<sig> and this maps that back to the absolute path from the manifest.
Range requests are honoured so scrubbing works.

    python3 triage_server.py          # http://localhost:8770
"""
import json
import os
import posixpath
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/triage")
MANIFEST = os.path.join(ROOT, "manifest.json")
DECISIONS = os.path.join(ROOT, "decisions.json")
PORT = 8772

TYPES = {".html": "text/html; charset=utf-8", ".json": "application/json",
         ".jpg": "image/jpeg", ".png": "image/png",
         ".mov": "video/quicktime", ".mp4": "video/mp4"}


def media_map():
    items = json.load(open(MANIFEST))["items"]
    return {i["sig"]: i["path"] for i in items if i.get("path")}


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, code, body=b"", ctype="application/json", extra=None):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if body:
            self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/":
            path = "/index.html"

        if path.startswith("/media/"):
            return self.serve_media(path[len("/media/"):])

        if path == "/decisions.json" and not os.path.exists(DECISIONS):
            return self._send(200, b"{}")

        local = os.path.join(ROOT, posixpath.normpath(path).lstrip("/"))
        if not local.startswith(ROOT) or not os.path.isfile(local):
            return self._send(404, b"not found", "text/plain")
        ctype = TYPES.get(os.path.splitext(local)[1], "application/octet-stream")
        with open(local, "rb") as fh:
            self._send(200, fh.read(), ctype)

    def serve_media(self, sig):
        path = media_map().get(sig)
        if not path or not os.path.isfile(path):
            return self._send(404, b"no media", "text/plain")
        size = os.path.getsize(path)
        ctype = TYPES.get(os.path.splitext(path)[1].lower(), "video/quicktime")
        rng = self.headers.get("Range")
        start, end = 0, size - 1
        if rng and rng.startswith("bytes="):
            a, _, b = rng[6:].partition("-")
            if a:
                start = int(a)
            if b:
                end = min(int(b), size - 1)
        end = max(end, start)
        length = end - start + 1
        self.send_response(206 if rng else 200)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(length))
        if rng:
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.end_headers()
        with open(path, "rb") as fh:
            fh.seek(start)
            remaining = length
            while remaining > 0:
                chunk = fh.read(min(1 << 20, remaining))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return
                remaining -= len(chunk)

    def do_POST(self):
        if self.path != "/decide":
            return self._send(404, b"{}")
        n = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(n) or b"{}")
        current = {}
        if os.path.exists(DECISIONS):
            current = json.load(open(DECISIONS))
        current.update(payload)
        json.dump(current, open(DECISIONS, "w"), indent=1)
        self._send(200, json.dumps({"saved": len(current)}).encode())


if __name__ == "__main__":
    print(f"triage:  http://localhost:{PORT}")
    ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
