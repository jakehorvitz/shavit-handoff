#!/usr/bin/env python3
"""Bulk-download the 514 E Victoria Drive folder to disk using JARVIS's stored
Drive-scoped OAuth token. No bytes pass through the chat context."""
import sys, os, io, json
sys.path.insert(0, os.path.expanduser("~/Personal Jarvis"))
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

BASE = os.path.expanduser("~/Personal Jarvis")
SCOPES = [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
]
TOKEN = os.path.join(BASE, "data", "google_token.json")
if not os.path.exists(TOKEN):
    TOKEN = os.path.join(BASE, "google_token.json")
OUT = os.path.expanduser("~/projects/shavit-pipeline/docs/reel-specs/east-victoria-story-2026-07-23/_drive-dump")
FOLDER_ID = "1-l88DIYyOFOyusl89CC1BV549CBqjGHu"
os.makedirs(OUT, exist_ok=True)

creds = Credentials.from_authorized_user_file(TOKEN, SCOPES)
if not creds.valid:
    creds.refresh(Request())
    open(TOKEN, "w").write(creds.to_json())

svc = build("drive", "v3", credentials=creds)

files, tok = [], None
while True:
    resp = svc.files().list(
        q=f"'{FOLDER_ID}' in parents and mimeType contains 'image/' and trashed=false",
        fields="nextPageToken, files(id,name,size,mimeType,modifiedTime,owners(emailAddress))",
        pageSize=1000, pageToken=tok,
    ).execute()
    files.extend(resp.get("files", []))
    tok = resp.get("nextPageToken")
    if not tok:
        break

print(f"TOTAL_FILES={len(files)}")
manifest = []
for i, f in enumerate(files):
    fid, name = f["id"], f["name"]
    dest = os.path.join(OUT, f"{i:03d}_{fid}.jpg")
    try:
        req = svc.files().get_media(fileId=fid)
        buf = io.FileIO(dest, "wb")
        dl = MediaIoBaseDownload(buf, req)
        done = False
        while not done:
            _, done = dl.next_chunk()
        buf.close()
        owner = (f.get("owners") or [{}])[0].get("emailAddress", "?")
        manifest.append({"idx": i, "id": fid, "name": name, "file": os.path.basename(dest),
                         "size": f.get("size"), "modified": f.get("modifiedTime"), "owner": owner})
    except Exception as e:
        print(f"FAIL {fid} {name}: {e}")

json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=2)
print(f"DOWNLOADED={len(manifest)} -> {OUT}")
