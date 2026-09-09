#!/usr/bin/env python3
"""Minimal MCP-over-HTTP client for PalmierPro (127.0.0.1:19789/mcp).

The Palmier MCP server does not register through the normal Claude Code MCP
client when the app was not running at session start. This talks to it directly
so the rev6 timeline can be edited without restarting anything.

Usage:
    python3 pmcp.py tools                      # list tool names
    python3 pmcp.py schema <tool>              # dump one tool's input schema
    python3 pmcp.py call <tool> '<json args>'  # call a tool
"""
import json
import sys
import urllib.request

URL = "http://127.0.0.1:19789/mcp"
_session = {"id": None}


def _post(payload):
    body = json.dumps(payload).encode()
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
    if _session["id"]:
        headers["MCP-Session-Id"] = _session["id"]
    req = urllib.request.Request(URL, data=body, headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=180) as r:
        sid = r.headers.get("MCP-Session-Id")
        if sid:
            _session["id"] = sid
        raw = r.read().decode()
    # Server replies as SSE. A single event's payload may span several
    # consecutive "data:" lines and must be rejoined before parsing; blank
    # lines separate events. Keep the last event that parses as JSON-RPC.
    out, buf = None, []

    def flush(chunks):
        nonlocal out
        if not chunks:
            return
        try:
            out = json.loads("\n".join(chunks))
        except json.JSONDecodeError:
            pass

    for line in raw.splitlines():
        if line.startswith("data:"):
            buf.append(line[5:].lstrip())
        elif not line.strip():
            flush(buf)
            buf = []
    flush(buf)

    if out is not None:
        return out
    return json.loads(raw) if raw.strip() else None


def _notify(payload):
    body = json.dumps(payload).encode()
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json, text/event-stream",
    }
    if _session["id"]:
        headers["MCP-Session-Id"] = _session["id"]
    req = urllib.request.Request(URL, data=body, headers=headers, method="POST")
    try:
        urllib.request.urlopen(req, timeout=30).read()
    except Exception:
        pass


def connect():
    _post({
        "jsonrpc": "2.0", "id": 1, "method": "initialize",
        "params": {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "cc-bridge", "version": "1"},
        },
    })
    _notify({"jsonrpc": "2.0", "method": "notifications/initialized"})


def list_tools():
    tools, cursor, n = [], None, 2
    while True:
        params = {"cursor": cursor} if cursor else {}
        r = _post({"jsonrpc": "2.0", "id": n, "method": "tools/list", "params": params})
        n += 1
        res = r.get("result", {})
        tools.extend(res.get("tools", []))
        cursor = res.get("nextCursor")
        if not cursor:
            return tools


def call(name, args):
    r = _post({
        "jsonrpc": "2.0", "id": 99, "method": "tools/call",
        "params": {"name": name, "arguments": args},
    })
    if "error" in r:
        return {"__error__": r["error"]}
    res = r.get("result", {})
    chunks = []
    for c in res.get("content", []):
        if c.get("type") == "text":
            try:
                chunks.append(json.loads(c["text"]))
            except Exception:
                chunks.append(c["text"])
    if res.get("isError"):
        return {"__error__": chunks}
    return chunks[0] if len(chunks) == 1 else chunks


if __name__ == "__main__":
    connect()
    cmd = sys.argv[1]
    if cmd == "tools":
        for t in list_tools():
            print(f"{t['name']:28s} {(t.get('description') or '')[:110]}")
    elif cmd == "schema":
        for t in list_tools():
            if t["name"] == sys.argv[2]:
                print(json.dumps(t.get("inputSchema", {}), indent=2))
    elif cmd == "call":
        args = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
        print(json.dumps(call(sys.argv[2], args), indent=2)[:12000])
