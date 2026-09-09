import json, sys, urllib.request

URL = "http://127.0.0.1:19789/mcp"
SESSION = {"id": None}
_n = [0]

def post(payload, notify=False):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(URL, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "application/json, text/event-stream")
    if SESSION["id"]:
        req.add_header("MCP-Session-Id", SESSION["id"])
    with urllib.request.urlopen(req, timeout=300) as r:
        if not SESSION["id"]:
            SESSION["id"] = r.headers.get("MCP-Session-Id")
        if notify:
            return None
        body = r.read().decode("utf-8", "replace")
    for line in body.splitlines():
        if line.startswith("data: ") and line[6:].strip():
            try:
                msg = json.loads(line[6:])
            except Exception:
                continue
            if msg.get("id") == payload.get("id"):
                return msg
    return None

def rpc(method, params=None):
    _n[0] += 1
    return post({"jsonrpc": "2.0", "id": _n[0], "method": method, "params": params or {}})

def call(name, args=None):
    res = rpc("tools/call", {"name": name, "arguments": args or {}})
    if res is None:
        return "<no response>"
    if "error" in res:
        return "ERROR: " + json.dumps(res["error"])
    out = []
    for c in res.get("result", {}).get("content", []):
        out.append(c.get("text", json.dumps(c)))
    return "\n".join(out) or json.dumps(res.get("result"))

rpc("initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                   "clientInfo": {"name": "cc-bridge", "version": "1"}})
post({"jsonrpc": "2.0", "method": "notifications/initialized"}, notify=True)

calls = json.load(open(sys.argv[1])) if len(sys.argv) > 1 else json.load(sys.stdin)
for c in calls:
    print(f"### {c['name']} {json.dumps(c.get('args', {}))[:160]}")
    print(call(c["name"], c.get("args")))
    print()
