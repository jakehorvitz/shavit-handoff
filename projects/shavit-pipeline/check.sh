#!/usr/bin/env bash
# shavit-pipeline acceptance gate — AUTHORED BY THE ORCHESTRATOR, NOT THE BUILDER.
# The builder implements to this contract; editing check.sh to pass is a fail.
#
# CLI CONTRACT (what the builder must produce):
#   ./shavit.sh new <post-id> -p <ig|fb|li>        scaffold content/<id>/ (state: draft)
#   ./shavit.sh lint <post-id>                     rules/lint.yaml checks; exit!=0 names rule id
#   ./shavit.sh verify <post-id>                   TTY-only per-claim y/n; stamps claims.json
#   ./shavit.sh review <post-id>                   needs coach.md w/ 'rewrite:' block; makes review.html
#   ./shavit.sh ship <post-id> [--date YYYY-MM-DD] TTY confirm; outbox/DATE/<id>.md + timeline event
#   ./shavit.sh posted <post-id>                   append to posted.log
#   ./shavit.sh status                             states overview
#   Env: SHAVIT_ROOT (data root, default repo), SHAVIT_TIMELINE_DIR (default ~/projects/higgs-timeline)
#   States: draft -> linted -> confirmed -> reviewed -> shipped (content/<id>/state)
#   Citation spans: [F:fact.id]{covered text} — marker covers ONLY braced text.
set -u
cd "$(dirname "$0")"
PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ok  - $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  FAIL- $1"; }
# expect <desc> <want_exit:0|1> <needle-in-output-or-''> -- cmd...
expect() {
  local desc="$1" want="$2" needle="$3"; shift 3; shift # consume --
  local out; out="$("$@" 2>&1)"; local rc=$?
  if [ "$want" = 0 ] && [ $rc -ne 0 ]; then bad "$desc (exit $rc): $(echo "$out"|tail -2|tr '\n' ' ')"; return; fi
  if [ "$want" = 1 ] && [ $rc -eq 0 ]; then bad "$desc (expected failure, got exit 0)"; return; fi
  if [ -n "$needle" ] && ! echo "$out" | grep -qi -- "$needle"; then bad "$desc (missing '$needle')"; return; fi
  ok "$desc"
}

[ -x ./shavit.sh ] || { echo "FAIL: ./shavit.sh missing/not executable"; exit 1; }

# ---- sandbox: never touches real data ----
SB="$(mktemp -d)"; trap 'rm -rf "$SB"' EXIT
export SHAVIT_ROOT="$SB/root"; export SHAVIT_TIMELINE_DIR="$SB/timeline"
mkdir -p "$SHAVIT_ROOT/facts/properties" "$SHAVIT_TIMELINE_DIR"
cat > "$SHAVIT_ROOT/facts/identity.yaml" <<'EOF'
- id: identity.phone
  label: "Office phone"
  value: "(555) 010-0000"
  source: "check.sh test seed"
  verified_by: jake
  verified_at: 2026-07-10
EOF
cat > "$SHAVIT_ROOT/facts/properties/maple.yaml" <<'EOF'
- id: prop.street
  label: "Street"
  value: "Maple Street"
  source: "check.sh test seed"
  verified_by: jake
  verified_at: 2026-07-10
- id: prop.beds
  label: "Bedrooms"
  value: "3"
  source: "check.sh test seed"
  verified_by: jake
  verified_at: 2026-07-10
EOF

mkpost() { # mkpost <id> <body>  (scaffold then inject pinned body)
  ./shavit.sh new "$1" -p ig >/dev/null 2>&1 || return 1
  python3 - "$SHAVIT_ROOT/content/$1/post.md" "$2" <<'PY'
import sys,re
p,body=sys.argv[1],sys.argv[2]
t=open(p).read()
m=re.match(r'^(---\n.*?\n---\n)',t,re.S)
open(p,'w').write((m.group(1) if m else '')+body+"\n")
PY
}
# pty helper: pty_run "<answers-pipe-separated>" cmd args...
pty_run() { local ans="$1"; shift; python3 - "$ans" "$@" <<'PY'
import sys,pty,os,time
ans=sys.argv[1]; cmd=sys.argv[2:]
pid,fd=pty.fork()
if pid==0: os.execvp(cmd[0],cmd)
time.sleep(1.0)
for line in (ans.split("|") if ans else []):
    try: os.write(fd,(line+"\n").encode()); time.sleep(0.6)
    except OSError: break
out=b""
while True:
    try:
        d=os.read(fd,4096)
        if not d: break
        out+=d
    except OSError: break
_,st=os.waitpid(pid,0)
sys.stdout.write(out.decode(errors="replace"))
sys.exit(os.waitstatus_to_exitcode(st))
PY
}

echo "== lint (AC1-5, AC12, AC18, fp-allowlist) =="
mkpost bad-dollar   'We picked it up for $42,000 and never looked back.'
expect "AC1 no-dollar fails + named"      1 "no-dollar"   -- ./shavit.sh lint bad-dollar
mkpost bad-state    'Another one done in Toledo, OH — MI and IN next.'
expect "AC2 state abbrevs fail"           1 "full-states" -- ./shavit.sh lint bad-state
mkpost good-state   'Michigan winters are brutal on empty houses. This one on [F:prop.street]{Maple Street} is warm again.'
expect "AC2b spelled-out clean passes"    0 ""            -- ./shavit.sh lint good-state
mkpost bad-address  'Swing by 4127 Maple Street to see the finished product.'
expect "AC3 house number fails"           1 "no-house-numbers" -- ./shavit.sh lint bad-address
mkpost bad-phone    'Call us at (330) 555-0147 to talk it through.'
expect "AC4 non-registry phone fails"     1 "phone"       -- ./shavit.sh lint bad-phone
mkpost good-phone   'Call us at [F:identity.phone]{(555) 010-0000} to talk it through.'
expect "AC4b registry phone passes"       0 ""            -- ./shavit.sh lint good-phone
mkpost uncited      'We raised rents 14% while cutting tenant turnover in half.'
expect "AC5 uncited numeral fails"        1 "uncited"     -- ./shavit.sh lint uncited
mkpost unknown-fact 'This [F:prop.nope]{4}-bath is wild.'
expect "AC12 unknown fact id fails w/ add-fact hint" 1 "fact add" -- ./shavit.sh lint unknown-fact
mkpost span-cheat   'This [F:prop.beds]{3}-bed took 6 weeks flat.'
expect "AC18 marker does not cover neighbor numeral" 1 "" -- ./shavit.sh lint span-cheat
mkpost fp-247       "We're on call 24/7 for our tenants."
./shavit.sh lint fp-247 >/dev/null 2>&1 && bad "fp-24/7 should fail before allowlisted" || ok "fp-24/7 fails pre-allowlist"

echo "== ordering (AC15) =="
mkpost fresh 'Plain words only, no numbers at all.'
expect "AC15 verify before lint refuses"  1 "lint"   -- ./shavit.sh verify fresh
expect "AC15 review before verify refuses" 1 "verify" -- ./shavit.sh review fresh
expect "AC15 ship before review refuses"  1 "review"  -- ./shavit.sh ship fresh --date 2026-07-17

echo "== verify (AC6) =="
mkpost vpost 'This one on [F:prop.street]{Maple Street} has [F:prop.beds]{3} beds.'
./shavit.sh lint vpost >/dev/null 2>&1 || bad "vpost should lint clean"
expect "AC6 verify refuses non-TTY"       1 "" -- bash -c 'echo y | ./shavit.sh verify vpost'
pty_run "y|y" ./shavit.sh verify vpost >/dev/null 2>&1
if python3 -c "import json;c=json.load(open('$SHAVIT_ROOT/content/vpost/claims.json'));cl=c['claims'] if isinstance(c,dict) else c;assert all(x['status']=='confirmed' for x in cl);assert any('fact_value_at_confirm' in x for x in cl)" 2>/dev/null; then ok "AC6 pty y/y confirms + stamps values"; else bad "AC6 claims.json not confirmed/stamped after pty y/y"; fi
grep -q "body_sha256" "$SHAVIT_ROOT/content/vpost/claims.json" 2>/dev/null && ok "AC6 body hash stamped" || bad "AC6 no body_sha256 in claims.json"
mkpost npost 'It has [F:prop.beds]{3} beds.'
./shavit.sh lint npost >/dev/null 2>&1
pty_run "n|draft" ./shavit.sh verify npost >/dev/null 2>&1
[ "$(cat "$SHAVIT_ROOT/content/npost/state" 2>/dev/null)" = "draft" ] && ok "AC6 'n' bounces to draft" || bad "AC6 'n' did not bounce state to draft (got: $(cat "$SHAVIT_ROOT/content/npost/state" 2>/dev/null))"

echo "== coach + review (AC14) =="
printf 'nothing useful\n' > "$SHAVIT_ROOT/content/vpost/coach.md"
expect "AC14 stub coach.md refused"       1 "" -- ./shavit.sh review vpost
printf '## Coach report\n- consider: lead with the winter angle\nrewrite: "has 3 beds" -> "three bedrooms, all rebuilt to code"\n' > "$SHAVIT_ROOT/content/vpost/coach.md"
expect "AC14 real coach.md passes review" 0 "" -- ./shavit.sh review vpost
grep -qi "rewrite" "$SHAVIT_ROOT/content/vpost/review.html" 2>/dev/null && ok "AC14 review.html embeds coach" || bad "AC14 review.html missing coach content"

echo "== ship + queue + timeline (AC7, AC8, AC13, AC16) =="
out="$(pty_run "y" ./shavit.sh ship vpost 2>&1)"; rc=$?
if [ $rc -ne 0 ] && echo "$out" | grep -qi "date"; then ok "AC13 dateless ship refuses"; else bad "AC13 dateless ship allowed (rc=$rc)"; fi
pty_run "y" ./shavit.sh ship vpost --date 2026-07-17 >/dev/null 2>&1
[ -f "$SHAVIT_ROOT/outbox/2026-07-17/vpost.md" ] && ok "AC7 outbox/DATE/id.md written" || bad "AC7 outbox file missing"
out="$(pty_run "y" ./shavit.sh ship vpost --date 2026-07-17 2>&1)"; rc=$?
[ $rc -ne 0 ] && ok "AC7 re-ship refuses" || bad "AC7 re-ship overwrote"
python3 -c "
import json
lines=[json.loads(l) for l in open('$SHAVIT_TIMELINE_DIR/inbox.jsonl') if l.strip()]
e=[l for l in lines if l.get('kind')=='shavit_post']
assert e and e[0].get('platform') and e[0].get('date')" 2>/dev/null && ok "AC8 timeline event appended" || bad "AC8 no valid shavit_post event in timeline inbox"
# AC16 ceiling: 3 events already in target week -> next ship blocks
for i in 1 2 3; do echo '{"kind":"reel_posted","platform":"ig","date":"2026-07-16"}' >> "$SHAVIT_TIMELINE_DIR/inbox.jsonl"; done
mkpost cpost 'Plain words, no numerals here at all.'
./shavit.sh lint cpost >/dev/null 2>&1; pty_run "" ./shavit.sh verify cpost >/dev/null 2>&1
printf 'rewrite: "x" -> "y"\n' > "$SHAVIT_ROOT/content/cpost/coach.md"; ./shavit.sh review cpost >/dev/null 2>&1
out="$(pty_run "y" ./shavit.sh ship cpost --date 2026-07-17 2>&1)"; rc=$?
if [ $rc -ne 0 ] && echo "$out" | grep -qi ceiling; then ok "AC16 ceiling hard-blocks ship"; else bad "AC16 ceiling did not block (rc=$rc)"; fi

echo "== invalidation (AC17) =="
mkpost ipost 'It has [F:prop.beds]{3} beds.'
./shavit.sh lint ipost >/dev/null 2>&1; pty_run "y" ./shavit.sh verify ipost >/dev/null 2>&1
echo "It has [F:prop.beds]{3} beds. Edited after verify." >> "$SHAVIT_ROOT/content/ipost/post.md"
./shavit.sh lint ipost >/dev/null 2>&1
[ "$(cat "$SHAVIT_ROOT/content/ipost/state")" = "draft" ] && ok "AC17 post-verify edit demotes to draft" || bad "AC17 edit did not demote (state=$(cat "$SHAVIT_ROOT/content/ipost/state" 2>/dev/null))"
mkpost rpost 'It has [F:prop.beds]{3} beds.'
./shavit.sh lint rpost >/dev/null 2>&1; pty_run "y" ./shavit.sh verify rpost >/dev/null 2>&1
printf 'rewrite: "a" -> "b"\n' > "$SHAVIT_ROOT/content/rpost/coach.md"; ./shavit.sh review rpost >/dev/null 2>&1
sed -i '' 's/value: "3"/value: "4"/' "$SHAVIT_ROOT/facts/properties/maple.yaml"
out="$(pty_run "y" ./shavit.sh ship rpost --date 2026-07-18 2>&1)"; rc=$?
if [ $rc -ne 0 ] && echo "$out" | grep -qi "registry value mismatch"; then ok "AC17 registry drift blocks ship + named"; else bad "AC17 registry drift not caught/named (rc=$rc)"; fi
[ "$(cat "$SHAVIT_ROOT/content/rpost/state")" = "draft" ] && ok "AC17 registry drift demotes to draft" || bad "AC17 drift did not demote"
sed -i '' 's/value: "4"/value: "3"/' "$SHAVIT_ROOT/facts/properties/maple.yaml"

echo "== server + hub (AC9, AC10) =="
PORT=8971; python3 serve.py $PORT >/dev/null 2>&1 & SPID=$!; sleep 1
curl -s -X POST localhost:$PORT/annotate -H 'Content-Type: application/json' -d '{"section":"cktest","comment":"c"}' | grep -q '"ok"' && ok "AC9 annotate POST" || bad "AC9 annotate POST failed"
curl -s localhost:$PORT/annotations | grep -q '"section": "cktest"' && ok "AC9 annotations GET" || bad "AC9 annotations GET failed"
hub="$(curl -s localhost:$PORT/hub)"
echo "$hub" | grep -q "vpost" && echo "$hub" | grep -qi "friday\|queue" && ok "AC10 hub shows drafts + queue" || bad "AC10 hub missing drafts/queue"
kill $SPID 2>/dev/null
# remove check.sh's own test annotation so the real inbox stays clean
python3 - <<'PY'
from pathlib import Path
p=Path("docs/spec-inbox.jsonl")
if p.exists():
    p.write_text("".join(l for l in p.read_text().splitlines(keepends=True) if '"cktest"' not in l))
PY

echo "== remediation round (AC19-AC22) =="
# AC19: allowlist is a real mechanism, not a hardcoded literal
expect "AC19 allow refuses non-TTY"       1 "" -- bash -c 'echo y | ./shavit.sh allow "24/7"'
pty_run "y" ./shavit.sh allow "24/7" >/dev/null 2>&1
expect "AC19 24/7 passes after allowlist" 0 "" -- ./shavit.sh lint fp-247
mkpost fp2 'Still 9 windows uncited here.'
expect "AC19 other numerals still fail"   1 "uncited" -- ./shavit.sh lint fp2
grep -q '"24/7"' "$SHAVIT_ROOT/rules/lint.yaml" 2>/dev/null && ok "AC19 allowlist persisted to rules file" || bad "AC19 allowlist not in sandbox rules/lint.yaml"
# AC21: url claims need a real quote
mkpost upost 'Rents rose [F:url:https://example.com/report]{about 3 percent} region-wide.'
expect "AC21 url claim without quote fails" 1 "url-quote" -- ./shavit.sh lint upost
python3 - "$SHAVIT_ROOT/content/upost/claims.json" <<'PY'
import json,sys
p=sys.argv[1]
d=json.load(open(p))
for c in (d["claims"] if isinstance(d,dict) else d):
    c["quote"]="Regional rents increased about 3 percent year over year."
json.dump(d,open(p,"w"))
PY
expect "AC21 url claim with quote passes" 0 "" -- ./shavit.sh lint upost
# AC22: fact add is the working TTY-gated registry write path
expect "AC22 fact add refuses non-TTY"    1 "" -- bash -c 'printf "id\n" | ./shavit.sh fact add'
pty_run "identity.phone2|Secondary phone|(555) 010-0002|jake seed test|y" ./shavit.sh fact add >/dev/null 2>&1
grep -q "identity.phone2" "$SHAVIT_ROOT/facts/added.yaml" 2>/dev/null && ok "AC22 fact add appended to registry" || bad "AC22 fact add wrote nothing"
mkpost p2post 'Text us at [F:identity.phone2]{(555) 010-0002} anytime.'
expect "AC22 added fact usable by lint"   0 "" -- ./shavit.sh lint p2post
# AC20: marketing/brand deliverables exist with substance
AC20=0
for f in playbook/instagram.md playbook/facebook.md playbook/linkedin.md rules/brand.md templates/before-process-after.md templates/property-spotlight.md; do
  [ -s "$f" ] && [ "$(wc -c < "$f")" -gt 400 ] || { bad "AC20 $f missing/thin"; AC20=1; }
done
grep -q "^allowlist:" rules/lint.yaml 2>/dev/null && grep -q "^bait:" rules/lint.yaml 2>/dev/null || { bad "AC20 rules/lint.yaml missing sections"; AC20=1; }
[ $AC20 -eq 0 ] && ok "AC20 playbook + templates + rules present with substance"

echo "== imports (AC7b) + skill (AC11) =="
if grep -rlE "urllib\.request|import requests|http\.client" --include='*.py' . | grep -v check.sh | grep -q .; then bad "AC7b outbound-http import found"; else ok "AC7b no outbound-http imports"; fi
if grep -rlE "http\.server|socketserver" --include='*.py' . | grep -v check.sh | grep -v './serve.py' | grep -q .; then bad "AC7b server modules outside serve.py"; else ok "AC7b server modules only in serve.py"; fi
[ -f skill/SKILL.md ] && grep -q "shavit.sh" skill/SKILL.md && ok "AC11 skill present + wired" || bad "AC11 skill/SKILL.md missing or unwired"

echo; echo "== RESULT: $PASS pass / $FAIL fail =="
[ $FAIL -eq 0 ]
