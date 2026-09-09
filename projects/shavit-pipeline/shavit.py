#!/usr/bin/env python3
import argparse
import datetime as dt
import hashlib
import html
import json
import os
import re
import shutil
import sys
import time
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent
ROOT = Path(os.environ.get("SHAVIT_ROOT", REPO_ROOT)).expanduser().resolve()
TIMELINE_DIR = Path(os.environ.get("SHAVIT_TIMELINE_DIR", "~/projects/higgs-timeline")).expanduser()

STATE_ORDER = ["draft", "linted", "confirmed", "reviewed", "shipped"]
MARKER_RE = re.compile(r"\[F:([^\]]+)\]\{([^}]*)\}")
PHONE_RE = re.compile(r"\(\d{3}\)\s*\d{3}-\d{4}")
DIGIT_RE = re.compile(r"\d+")
FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n?", re.S)


def die(message, code=1):
    print(message, file=sys.stderr)
    sys.stderr.flush()
    if sys.stdin.isatty():
        time.sleep(1.15)
    raise SystemExit(code)


def now():
    return dt.datetime.now().replace(microsecond=0).isoformat()


def post_dir(post_id):
    return ROOT / "content" / post_id


def state_path(post_id):
    return post_dir(post_id) / "state"


def read_state(post_id):
    p = state_path(post_id)
    return p.read_text().strip() if p.exists() else "draft"


def write_state(post_id, state):
    p = state_path(post_id)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(state + "\n")


def parse_scalar(value):
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "'\"":
        return value[1:-1]
    return value


def read_facts():
    facts = {}
    facts_dir = ROOT / "facts"
    if not facts_dir.exists():
        return facts
    for path in sorted(facts_dir.rglob("*.yaml")):
        current = None
        for raw in path.read_text().splitlines():
            line = raw.strip()
            if not line or line.startswith("#"):
                continue
            if line.startswith("- "):
                if current and current.get("id"):
                    facts[current["id"]] = current
                current = {}
                line = line[2:].strip()
                if not line:
                    continue
            if ":" in line and current is not None:
                key, value = line.split(":", 1)
                current[key.strip()] = parse_scalar(value)
        if current and current.get("id"):
            facts[current["id"]] = current
    return facts


def rules_path():
    return ROOT / "rules" / "lint.yaml"


def read_rules():
    rules = {"allowlist": [], "bait": []}
    p = rules_path()
    if not p.exists():
        return rules
    section = None
    for raw in p.read_text().splitlines():
        s = raw.strip()
        if not s or s.startswith("#"):
            continue
        if s.endswith(":") and not s.startswith("- "):
            section = s[:-1]
            continue
        if s.startswith("- ") and section in rules:
            rules[section].append(parse_scalar(s[2:]))
    return rules


def read_post(post_id):
    path = post_dir(post_id) / "post.md"
    if not path.exists():
        die(f"post not found: {post_id}")
    text = path.read_text()
    meta = {}
    body = text
    match = FRONTMATTER_RE.match(text)
    if match:
        for line in match.group(1).splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                meta[key.strip()] = parse_scalar(value)
        body = text[match.end():]
    return path, meta, body


def write_post(post_id, meta, body):
    path = post_dir(post_id) / "post.md"
    lines = ["---"]
    for key in sorted(meta):
        value = str(meta[key])
        if re.search(r"[:#\n]", value):
            value = json.dumps(value)
        lines.append(f"{key}: {value}")
    lines.extend(["---", body.rstrip() + "\n"])
    path.write_text("\n".join(lines))


def body_hash(body):
    return hashlib.sha256(body.encode()).hexdigest()


def claims_path(post_id):
    return post_dir(post_id) / "claims.json"


def read_claims(post_id):
    p = claims_path(post_id)
    if not p.exists():
        return {"body_sha256": None, "claims": []}
    data = json.loads(p.read_text())
    if isinstance(data, list):
        return {"body_sha256": None, "claims": data}
    data.setdefault("claims", [])
    return data


def write_claims(post_id, data):
    p = claims_path(post_id)
    tmp = p.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, indent=2, sort_keys=True) + "\n")
    tmp.replace(p)


def covered_spans(body):
    # whole marker token counts as covered: digits in the fact id (identity.phone2)
    # are syntax, not claims — only text OUTSIDE markers needs its own [F:]{...}
    return [(m.start(), m.end()) for m in MARKER_RE.finditer(body)]


def is_covered(start, end, spans):
    return any(start >= a and end <= b for a, b in spans)


def build_claims(body, facts):
    claims = []
    for idx, match in enumerate(MARKER_RE.finditer(body), 1):
        fact_id, span = match.group(1), match.group(2)
        fact = facts.get(fact_id)
        claims.append({
            "marker": match.group(0),
            "fact_id": fact_id,
            "span": span,
            "source": fact.get("source", "") if fact else "",
            "status": "pending",
            "index": idx,
        })
    return claims


def ensure_stage(post_id, required, next_name):
    state = read_state(post_id)
    if STATE_ORDER.index(state) < STATE_ORDER.index(required):
        die(f"{next_name} blocked: run {required if required != 'confirmed' else 'verify'} first")
    return state


def cmd_new(args):
    d = post_dir(args.post_id)
    d.mkdir(parents=True, exist_ok=True)
    post = d / "post.md"
    if not post.exists():
        meta = {
            "platform": args.platform,
            "state": "draft",
            "title": args.post_id,
        }
        write_post(args.post_id, meta, "")
    write_state(args.post_id, "draft")
    print(f"created {args.post_id}")


def cmd_lint(args):
    path, meta, body = read_post(args.post_id)
    existing = read_claims(args.post_id)
    current_hash = body_hash(body)
    if existing.get("body_sha256") and existing["body_sha256"] != current_hash:
        for claim in existing.get("claims", []):
            claim["status"] = "pending"
            claim.pop("confirmed_at", None)
        existing["body_sha256"] = None
        write_claims(args.post_id, existing)
        write_state(args.post_id, "draft")
        die("body hash mismatch: post edited after verify; demoted to draft")

    facts = read_facts()
    if "$" in body:
        die("no-dollar: dollar figures are forbidden")
    if re.search(r"\b(MI|OH|IN)\b", body):
        die("full-states: spell out Michigan, Ohio, and Indiana")
    if re.search(r"\b\d+\s+[A-Z][A-Za-z0-9'.-]*(?:\s+[A-Z][A-Za-z0-9'.-]*)*\s+(Street|St|Road|Rd|Avenue|Ave|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way)\b", body):
        die("no-house-numbers: digit-leading street addresses are forbidden")

    registry_phones = {f.get("value", "") for f in facts.values() if "phone" in f.get("id", "")}
    for match in PHONE_RE.finditer(body):
        if match.group(0) not in registry_phones:
            die("phone-registry: phone-shaped string does not match a registry phone fact")

    claims = build_claims(body, facts)
    for claim in claims:
        if claim["fact_id"].startswith("url:"):
            continue
        if claim["fact_id"] not in facts:
            die(f"unknown-fact: {claim['fact_id']} is not in facts; run shavit.sh fact add")

    rules = read_rules()
    spans = covered_spans(body)
    for literal in rules["allowlist"]:
        start = 0
        while True:
            i = body.find(literal, start)
            if i == -1:
                break
            spans.append((i, i + len(literal)))
            start = i + len(literal)
    for match in DIGIT_RE.finditer(body):
        if not is_covered(match.start(), match.end(), spans):
            die(f"uncited-numeral: '{match.group(0)}' must be inside a [F:id]{{...}} span "
                f"(idiom? shavit.sh allow \"<literal>\")")
    for phrase in rules["bait"]:
        if phrase.lower() in body.lower():
            print(f"warn no-bait: '{phrase}' reads as engagement bait (reputation-not-virality)",
                  file=sys.stderr)

    prior = {c.get("marker"): c for c in existing.get("claims", [])}
    missing_quote = None
    for claim in claims:
        if claim["fact_id"].startswith("url:"):
            claim["quote"] = prior.get(claim["marker"], {}).get("quote", "")
            if not claim["quote"].strip():
                missing_quote = claim["fact_id"]

    write_claims(args.post_id, {"body_sha256": None, "claims": claims})
    if missing_quote:
        die(f"url-quote: {missing_quote[:70]} needs a non-empty quote in claims.json "
            f"(paste the exact supporting line from the source)")
    if read_state(args.post_id) == "draft":
        write_state(args.post_id, "linted")
    print("lint ok")


def cmd_verify(args):
    ensure_stage(args.post_id, "linted", "verify")
    if not sys.stdin.isatty():
        die("verify requires a TTY Jake confirmation")
    _, _, body = read_post(args.post_id)
    facts = read_facts()
    data = read_claims(args.post_id)
    claims = data.get("claims", [])
    for claim in claims:
        fact = facts.get(claim.get("fact_id"), {})
        print()
        print(f"claim: {claim.get('span', '')}")
        print(f"citation: {claim.get('fact_id', '')}")
        print(f"source: {fact.get('source', claim.get('source', ''))}")
        print(f"value: {fact.get('value', '')}")
        answer = input("confirm? [y/n] ").strip().lower()
        if answer != "y":
            input("draft wrong or fact wrong? ")
            for item in claims:
                item["status"] = "pending"
                item.pop("confirmed_at", None)
                item.pop("fact_value_at_confirm", None)
            data["body_sha256"] = None
            write_claims(args.post_id, data)
            write_state(args.post_id, "draft")
            die("verify rejected: confirmations reset and state bounced to draft")
        claim["status"] = "confirmed"
        claim["confirmed_at"] = now()
        claim["fact_value_at_confirm"] = fact.get("value", "")
        claim["source"] = fact.get("source", claim.get("source", ""))
    data["body_sha256"] = body_hash(body)
    data["claims"] = claims
    write_claims(args.post_id, data)
    write_state(args.post_id, "confirmed")
    print("verify ok")


def substantive_coach(path):
    if not path.exists():
        return False
    text = path.read_text().strip()
    return bool(text) and "rewrite:" in text


def cmd_review(args):
    ensure_stage(args.post_id, "confirmed", "review")
    coach = post_dir(args.post_id) / "coach.md"
    if not substantive_coach(coach):
        die("review blocked: coach.md must contain at least one rewrite: block")
    _, meta, body = read_post(args.post_id)
    data = read_claims(args.post_id)
    if not all(c.get("status") == "confirmed" for c in data.get("claims", [])):
        die("review blocked: verify claims first")
    rendered = html.escape(body)
    for claim in sorted(data.get("claims", []), key=lambda c: len(c.get("span", "")), reverse=True):
        span = html.escape(claim.get("span", ""))
        if span:
            rendered = rendered.replace(span, f"<mark>{span}</mark>")
    page = f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Review - {html.escape(args.post_id)}</title></head>
<body>
<h1>{html.escape(meta.get('title', args.post_id))}</h1>
<pre>{rendered}</pre>
<h2>Coach</h2>
<pre>{html.escape(coach.read_text())}</pre>
</body>
</html>
"""
    (post_dir(args.post_id) / "review.html").write_text(page)
    write_state(args.post_id, "reviewed")
    print("review ok")


def parse_date(value):
    try:
        return dt.date.fromisoformat(value)
    except ValueError:
        die(f"invalid date: {value}")


def timeline_events():
    inbox = TIMELINE_DIR / "inbox.jsonl"
    if not inbox.exists():
        return []
    events = []
    for line_no, line in enumerate(inbox.read_text().splitlines(), 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
            if {"kind", "platform", "date"} <= set(obj):
                events.append(obj)
            else:
                print(f"warn timeline-skip: {inbox}:{line_no} missing kind/platform/date",
                      file=sys.stderr)
        except json.JSONDecodeError:
            print(f"warn timeline-skip: {inbox}:{line_no} is not valid JSON", file=sys.stderr)
            continue
    return events


def ceiling_count(target):
    start = target - dt.timedelta(days=6)
    count = 0
    for event in timeline_events():
        try:
            day = dt.date.fromisoformat(str(event.get("date")))
        except ValueError:
            print(f"warn timeline-skip: unparseable date in event {json.dumps(event)}",
                  file=sys.stderr)
            continue
        if start <= day <= target:
            count += 1
    return count


def assert_ship_integrity(post_id):
    _, _, body = read_post(post_id)
    data = read_claims(post_id)
    claims = data.get("claims", [])
    if not all(c.get("status") == "confirmed" for c in claims):
        die("ship blocked: claims pending or rejected; run verify")
    if data.get("body_sha256") != body_hash(body):
        write_state(post_id, "draft")
        die("ship blocked: body hash mismatch; demoted to draft")
    facts = read_facts()
    for claim in claims:
        fact_id = claim.get("fact_id")
        if fact_id and not fact_id.startswith("url:"):
            current = facts.get(fact_id, {}).get("value")
            if current != claim.get("fact_value_at_confirm"):
                write_state(post_id, "draft")
                die(f"ship blocked: registry value mismatch for {fact_id}")


def cmd_ship(args):
    date_value = args.date
    if not date_value:
        _, meta, _ = read_post(args.post_id)
        date_value = meta.get("target_date")
    if not date_value:
        die("ship blocked: target date required")
    target = parse_date(date_value)
    ensure_stage(args.post_id, "reviewed", "ship")
    assert_ship_integrity(args.post_id)
    out = ROOT / "outbox" / date_value / f"{args.post_id}.md"
    if out.exists():
        die("ship blocked: re-ship refuses to overwrite existing outbox file")
    if ceiling_count(target) >= 3:
        if not args.override:
            die("ceiling: more than 3 text/video posts in the trailing 7-day window")
        journal = ROOT / "journal.log"
        with journal.open("a") as f:
            f.write(f"{now()} ceiling OVERRIDE on {args.post_id} for {date_value}\n")
    if not sys.stdin.isatty():
        die("ship requires a TTY confirmation")
    answer = input(f"ship {args.post_id} to outbox/{date_value}? [y/n] ").strip().lower()
    if answer != "y":
        die("ship cancelled")
    path, meta, body = read_post(args.post_id)
    meta["target_date"] = date_value
    meta["state"] = "reviewed"
    write_post(args.post_id, meta, body)
    out.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(post_dir(args.post_id) / "post.md", out)
    event = {
        "kind": "shavit_post",
        "platform": meta.get("platform", ""),
        "date": date_value,
        "post_id": args.post_id,
        "at": now(),
    }
    if TIMELINE_DIR.exists():
        with (TIMELINE_DIR / "inbox.jsonl").open("a") as f:
            f.write(json.dumps(event, sort_keys=True) + "\n")
    else:
        warning = (
            f"{now()} timeline-skip: {TIMELINE_DIR} missing; "
            f"shipped {args.post_id} to outbox/{date_value} without higgs-timeline event"
        )
        print(f"warn {warning}", file=sys.stderr)
        with (ROOT / "journal.log").open("a") as f:
            f.write(warning + "\n")
    write_state(args.post_id, "shipped")
    print("ship ok")


def cmd_posted(args):
    log = ROOT / "posted.log"
    log.parent.mkdir(parents=True, exist_ok=True)
    log.write_text(log.read_text() + f"{now()} {args.post_id}\n" if log.exists() else f"{now()} {args.post_id}\n")
    print("posted logged")


def cmd_status(args):
    content = ROOT / "content"
    if not content.exists():
        print("no posts")
        return
    for d in sorted(p for p in content.iterdir() if p.is_dir()):
        print(f"{d.name}: {read_state(d.name)}")


def require_tty(what):
    if not sys.stdin.isatty():
        die(f"{what} is TTY-gated: Jake runs this interactively")


def read_fact_queue(path):
    """Parse a queued-facts file: blank-line-separated id/label/value/source.

    Added 2026-09-01. The Mead post needs eleven facts and each one was four
    hand-typed prompts, so forty-four keystrokes stood between a finished deck
    and shipping it. This pre-fills the four fields from a file Shavit's verbatim
    text was transcribed into — but it does NOT pre-answer the confirmation.
    Jake still sees every value and still types y for each, because the registry
    stamps `verified_by: jake` and that stamp has to mean he actually looked.
    """
    queued, current = [], {}
    for raw in Path(path).read_text().splitlines():
        line = raw.rstrip()
        if not line.strip():
            if current.get("id"):
                queued.append(current)
            current = {}
            continue
        if line.strip().startswith("#"):
            continue
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        if key in ("id", "label", "value", "source"):
            current[key] = value.strip()
    if current.get("id"):
        queued.append(current)
    return queued


def _write_fact(fact_id, label, value, source):
    path = ROOT / "facts" / "added.yaml"
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a") as f:
        f.write(
            f"- id: {fact_id}\n"
            f'  label: "{label}"\n'
            f'  value: "{value}"\n'
            f'  source: "{source}"\n'
            f"  verified_by: jake\n"
            f"  verified_at: {dt.date.today().isoformat()}\n"
        )


def cmd_fact_from(path):
    """Confirm a queued batch, one explicit y per fact. Never bulk-accepts."""
    require_tty("fact add --from")
    queued = read_fact_queue(path)
    if not queued:
        die(f"fact add --from: nothing queued in {path}")
    existing = read_facts()
    added, skipped = 0, 0
    for i, q in enumerate(queued, 1):
        missing = [k for k in ("id", "label", "value", "source") if not q.get(k)]
        if missing:
            die(f"fact add --from: entry {i} is missing {', '.join(missing)}")
        if q["id"] in existing:
            print(f"[{i}/{len(queued)}] {q['id']} already in the registry — skipping")
            skipped += 1
            continue
        print(f"\n[{i}/{len(queued)}] {q['id']}  ({q['label']})")
        print(f"  value : {q['value']}")
        print(f"  source: {q['source']}")
        answer = input("  correct, and you have checked it against the source? [y/n/q] ").strip().lower()
        if answer == "q":
            print(f"stopped at your request — {added} added, {len(queued) - i + 1} left")
            return
        if answer != "y":
            print("  skipped")
            skipped += 1
            continue
        _write_fact(q["id"], q["label"], q["value"], q["source"])
        added += 1
        print(f"  fact added: {q['id']}")
    print(f"\ndone: {added} added, {skipped} skipped")


def cmd_fact(args):
    if not args.rest or args.rest[0] != "add":
        die("usage: shavit.sh fact add [--from <queue-file>]")
    if len(args.rest) >= 2 and args.rest[1] == "--from":
        if len(args.rest) < 3:
            die("usage: shavit.sh fact add --from <queue-file>")
        return cmd_fact_from(args.rest[2])
    require_tty("fact add")
    fact_id = input("fact id (e.g. identity.phone2): ").strip()
    if not re.fullmatch(r"[a-z0-9_.]+(\.[a-z0-9_]+)*", fact_id):
        die("fact add: id must be dotted lowercase (e.g. identity.phone2)")
    if fact_id in read_facts():
        die(f"fact add: {fact_id} already exists in the registry")
    label = input("label: ").strip()
    value = input("value (exact text as it will appear in posts): ").strip()
    source = input("source (where this comes from): ").strip()
    if not (label and value and source):
        die("fact add: label, value, and source are all required")
    if input(f'confirm {fact_id} = "{value}" (source: {source})? [y/n] ').strip().lower() != "y":
        die("fact add cancelled")
    path = ROOT / "facts" / "added.yaml"
    path.parent.mkdir(parents=True, exist_ok=True)
    entry = (
        f"- id: {fact_id}\n"
        f'  label: "{label}"\n'
        f'  value: "{value}"\n'
        f'  source: "{source}"\n'
        f"  verified_by: jake\n"
        f"  verified_at: {dt.date.today().isoformat()}\n"
    )
    with path.open("a") as f:
        f.write(entry)
    print(f"fact added: {fact_id}")


def cmd_allow(args):
    require_tty("allow")
    literal = args.literal
    if literal in read_rules()["allowlist"]:
        die(f'allow: "{literal}" already allowlisted')
    if input(f'allowlist literal "{literal}" (uncited-numeral will treat it as covered)? [y/n] ').strip().lower() != "y":
        die("allow cancelled")
    p = rules_path()
    p.parent.mkdir(parents=True, exist_ok=True)
    text = p.read_text() if p.exists() else ""
    if "allowlist:" not in text:
        text = ("allowlist:\n" + text) if not text else (text.rstrip() + "\nallowlist:\n")
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if line.strip() == "allowlist:":
            lines.insert(i + 1, f'  - "{literal}"')
            break
    p.write_text("\n".join(lines) + "\n")
    print(f"allowlisted: {literal}")


def main(argv=None):
    parser = argparse.ArgumentParser(prog="shavit.sh")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("new")
    p.add_argument("post_id")
    p.add_argument("-p", "--platform", default="ig")
    p.set_defaults(func=cmd_new)

    p = sub.add_parser("lint")
    p.add_argument("post_id")
    p.set_defaults(func=cmd_lint)

    p = sub.add_parser("verify")
    p.add_argument("post_id")
    p.set_defaults(func=cmd_verify)

    p = sub.add_parser("review")
    p.add_argument("post_id")
    p.set_defaults(func=cmd_review)

    p = sub.add_parser("ship")
    p.add_argument("post_id")
    p.add_argument("--date")
    p.add_argument("--override", action="store_true")
    p.set_defaults(func=cmd_ship)

    p = sub.add_parser("posted")
    p.add_argument("post_id")
    p.set_defaults(func=cmd_posted)

    p = sub.add_parser("status")
    p.set_defaults(func=cmd_status)

    p = sub.add_parser("fact")
    # REMAINDER, not "*": argparse otherwise claims `--from` as an unknown
    # optional and errors out before cmd_fact ever sees it.
    p.add_argument("rest", nargs=argparse.REMAINDER)
    p.set_defaults(func=cmd_fact)

    p = sub.add_parser("allow")
    p.add_argument("literal")
    p.set_defaults(func=cmd_allow)

    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":
    main()
