#!/usr/bin/env python3
"""Download Drive files straight to disk using Jake's existing Drive token.

The Drive MCP tool returns files as base64 into the model's context, which is
useless for video. This uses the OAuth refresh token already sitting in
Personal Jarvis (full drive scope) and streams files/{id}?alt=media to disk,
so a 300 MB clip costs nothing but bandwidth.

    python3 drive_pull.py <dest_dir> <fileId>:<name> [<fileId>:<name> ...]
"""
import json
import os
import sys
import urllib.parse
import urllib.request

# Two accounts are live: the school one that ships with Personal Jarvis, and
# the personal gmail that actually owns the Shavit folders. Try personal first.
TOKENS = [
    os.path.expanduser("~/.config/shavit/google_token_personal.json"),
    "/Users/jakehorvitz/Personal Jarvis/google_token.json",
]
CREDS = "/Users/jakehorvitz/Personal Jarvis/google_credentials.json"


def access_token(path=None):
    tok = json.load(open(path or next(p for p in TOKENS if os.path.exists(p))))
    if tok.get("token") and not tok.get("expiry", "") < "2000":
        pass  # fall through and just refresh; cheaper than parsing expiry
    cid = tok.get("client_id")
    secret = tok.get("client_secret")
    if not cid:
        c = json.load(open(CREDS))
        c = c.get("installed") or c.get("web") or c
        cid, secret = c["client_id"], c["client_secret"]
    body = urllib.parse.urlencode({
        "client_id": cid, "client_secret": secret,
        "refresh_token": tok["refresh_token"], "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request("https://oauth2.googleapis.com/token", data=body)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)["access_token"]


def pull(tok, file_id, dest):
    url = f"https://www.googleapis.com/drive/v3/files/{file_id}?alt=media&supportsAllDrives=true"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {tok}"})
    tmp = dest + ".part"
    with urllib.request.urlopen(req, timeout=600) as r, open(tmp, "wb") as fh:
        while True:
            chunk = r.read(1 << 20)
            if not chunk:
                break
            fh.write(chunk)
    os.replace(tmp, dest)
    return os.path.getsize(dest)


def main():
    dest_dir = os.path.expanduser(sys.argv[1])
    os.makedirs(dest_dir, exist_ok=True)
    tok = access_token()
    for spec in sys.argv[2:]:
        file_id, _, name = spec.partition(":")
        dest = os.path.join(dest_dir, name)
        if os.path.exists(dest):
            print(f"  have  {name}")
            continue
        try:
            n = pull(tok, file_id, dest)
            print(f"  got   {name}  {n/1048576:.1f} MB")
        except Exception as e:
            print(f"  FAIL  {name}: {e}")


if __name__ == "__main__":
    main()
