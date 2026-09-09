#!/usr/bin/env bash
# accept-714.sh — Stage 5 acceptance gate for the 7/14 revision (spec-714 v6).
# Exit 0 only when the site builds AND the prerendered output matches the spec.
set -uo pipefail
cd "$(dirname "$0")/site"

fail=0
say() { printf '%s\n' "$*"; }
ok()  { say "  ✓ $*"; }
bad() { say "  ✗ $*"; fail=1; }

say "== 1. Production build =="
if npm run build >/tmp/accept-714-build.log 2>&1; then
  ok "vite-react-ssg build green"
else
  bad "build FAILED — tail of log:"
  tail -20 /tmp/accept-714-build.log
  exit 1
fi

HOME_HTML="dist/index.html"
[ -f "$HOME_HTML" ] || { bad "dist/index.html missing"; exit 1; }

say "== 2. Must-HAVE content (prerendered home page) =="
must_have=(
  "chargerpropertymanagement@gmail.com"
  "Live with us."
  "Lease Signed"
  "Coming Soon"
  "115 Oak St"
  "33 Barry St"
  "11 Ludlam St"
  "34 Budlong St"
  "43 Howder St"
  "60 S Norwood"
  "1114 Cedar St"
  "Niles, Michigan"
  "1902 East Ewing Ave"
  "Deal Case Studies"
  "Tenants Q&amp;A"
  "Investors Q&amp;A"
  "Meet our Founder"
  "boot-cover"
  # "Square footage" was here, but it is content-dependent, not behavioural: the
  # string only renders on a card with sqft:null AND status available/coming-soon.
  # 11½ E St Joe was the last such listing and Shavit deleted it on 8/9 ("Unit 1/2
  # you can remove"), so this assertion started failing on a build with no defect
  # in it. The behaviour it was guarding is now checked at source level in §4.
  "Hillsdale, Michigan"
  "hero--montage"
  "hero__addr"
  "/assets/properties/budlong-street/02.jpg"
)
for s in "${must_have[@]}"; do
  if grep -qF "$s" "$HOME_HTML"; then ok "has: $s"; else bad "MISSING: $s"; fi
done

say "== 3. Must-NOT-have content (portfolio prune + removed UI) =="
must_not=(
  "34 Mead"
  "61 Salem"
  "46 W South"
  "12 River St"
  "15 Waldron"
  "17 Lo Presto"
  "2217 Parkview"
  "Text for rent"
  "Text About This Home"
  "Available Now / Coming Up"
  "Every home we have"
  "and nearby communities"
  "hero.mp4"
)
for s in "${must_not[@]}"; do
  if grep -qF "$s" "$HOME_HTML"; then bad "STILL PRESENT: $s"; else ok "gone: $s"; fi
done

say "== 4. Source-level checks =="
# Square-footage fallback: a rentable unit with no sqft yet must still say so,
# and a leased one must stay blank (Shavit 7/27 on Kendall: "coming" reads as
# unfinished). Checked here rather than in the HTML string list because whether
# any listing currently exercises it depends on Shavit's inventory that week.
if grep -q "Square footage coming" src/tenant-pages.jsx; then ok "sqft-coming fallback intact"; else bad "sqft-coming fallback removed"; fi
if grep -q "status === 'available' || property.status === 'coming-soon'" src/tenant-pages.jsx; then ok "sqft fallback still gated to rentable units"; else bad "sqft fallback no longer gated — may say 'coming' on a leased home"; fi
# Every state renders through the same component, so the phone gesture matches
# across Michigan/Indiana (Shavit 8/9: "In Michigan, it's a toggle right and
# left. In Indiana, it's scrolling down.").
if grep -q "const useCarousel = true" src/tenant-pages.jsx; then ok "one inventory layout for every state"; else bad "state sections diverged again (carousel is conditional)"; fi
# Two-dots bug: the wordmark pseudo-element squares must stay dead.
if grep -q 'nav__wordmark::before' src/site.css; then bad "wordmark dot pseudo-elements re-appeared"; else ok "wordmark dots removed"; fi
# Intro must replay every load — no session gating.
if grep -q "sr:intro-seen" src/intro.jsx; then bad "intro still session-gated"; else ok "intro replays every load"; fi
# 7/14 v2: montage lives in the HERO, never in the click-blocking intro overlay.
if grep -q "intro__montage" src/intro.jsx; then bad "montage still inside the blocking intro overlay"; else ok "intro overlay is brand-only (montage moved to hero)"; fi
if grep -q "VideoHero" src/tenant-pages.jsx; then bad "home hero still uses the video"; else ok "hero video replaced by montage"; fi
# The splash must skip on any pointer press (the dead-Contact-button lesson).
if grep -q "pointerdown" src/intro.jsx; then ok "splash skips on any click"; else bad "splash does not skip on click"; fi
# Prequal threshold per Shavit: credit under 560 fails.
if grep -q "score >= 560" src/tenant-pages.jsx; then ok "prequal 560 threshold wired"; else bad "prequal threshold missing"; fi
# Zillow apply wiring present.
if grep -q "zillow.com/homes" src/properties.js; then ok "Zillow apply URLs present"; else bad "Zillow URLs missing"; fi
# No invented zips: only Shavit-confirmed 49242 + 46613 allowed in data.
extra_zips=$(grep -oE "zip: '[0-9]{5}'" src/properties.js | grep -vE "49242|46613|49120" || true)
if [ -n "$extra_zips" ]; then bad "unconfirmed zip in data: $extra_zips"; else ok "only real city zips (Hillsdale 49242, South Bend 46613, Niles 49120)"; fi

say "== RESULT =="
if [ "$fail" -eq 0 ]; then say "ACCEPTANCE: PASS"; exit 0; else say "ACCEPTANCE: FAIL"; exit 1; fi
