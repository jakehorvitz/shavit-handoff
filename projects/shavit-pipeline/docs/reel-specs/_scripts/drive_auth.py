#!/usr/bin/env python3
"""Authorise a second Google account for Drive, stdlib only.

The token already on this Mac belongs to jakehorvitz@ucsb.edu, so anything
living in the personal gmail Drive comes back 404. This runs the standard
loopback OAuth flow against the same desktop client and writes a separate
token file, so both accounts are available and drive_pull.py can use either.

    python3 drive_auth.py [out_token.json]
"""
import json
import os
import sys
import urllib.parse
import urllib.request
import webbrowser
from http.server import BaseHTTPRequestHandler, HTTPServer

CREDS = "/Users/jakehorvitz/Personal Jarvis/google_credentials.json"
SCOPE = "https://www.googleapis.com/auth/drive"
PORT = 8899
OUT = os.path.expanduser(sys.argv[1] if len(sys.argv) > 1
                         else "~/.config/shavit/google_token_personal.json")

code_box = {}


class Catch(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_GET(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        code_box.update({k: v[0] for k, v in q.items()})
        ok = "code" in code_box
        msg = ("Authorised. You can close this tab." if ok
               else f"Failed: {code_box.get('error', 'unknown')}")
        body = f"<html><body style='font:16px system-ui;padding:40px'>{msg}</body></html>"
        self.send_response(200)
        self.send_header("Content-Type", "text/html")
        self.end_headers()
        self.wfile.write(body.encode())


def main():
    c = json.load(open(CREDS))
    c = c.get("installed") or c.get("web") or c
    redirect = f"http://localhost:{PORT}"
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": c["client_id"], "redirect_uri": redirect,
        "response_type": "code", "scope": SCOPE,
        "access_type": "offline", "prompt": "consent select_account",
    })
    print("Approve in the browser as your PERSONAL gmail account:\n")
    print(auth_url + "\n")
    webbrowser.open(auth_url)

    srv = HTTPServer(("127.0.0.1", PORT), Catch)
    srv.timeout = 300
    while "code" not in code_box and "error" not in code_box:
        srv.handle_request()

    if "error" in code_box:
        print("DENIED:", code_box["error"])
        print("If it says access_denied, the OAuth consent screen is in testing")
        print("mode and this account is not on the test-user list.")
        return 1

    body = urllib.parse.urlencode({
        "code": code_box["code"], "client_id": c["client_id"],
        "client_secret": c["client_secret"], "redirect_uri": redirect,
        "grant_type": "authorization_code",
    }).encode()
    with urllib.request.urlopen(
            urllib.request.Request("https://oauth2.googleapis.com/token", data=body),
            timeout=30) as r:
        tok = json.load(r)

    tok["client_id"] = c["client_id"]
    tok["client_secret"] = c["client_secret"]
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as fh:
        json.dump(tok, fh, indent=1)
    os.chmod(OUT, 0o600)

    who = urllib.request.Request(
        "https://www.googleapis.com/drive/v3/about?fields=user",
        headers={"Authorization": "Bearer " + tok["access_token"]})
    with urllib.request.urlopen(who, timeout=30) as r:
        email = json.load(r)["user"]["emailAddress"]
    print(f"\nauthorised: {email}")
    print(f"token saved: {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
