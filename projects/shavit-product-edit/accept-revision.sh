#!/usr/bin/env bash
# ============================================================================
# accept-revision.sh — BINDING acceptance gate for the shavitrootman.com
# TENANT-HUB REVISION (bones: shavit-website-revision, stage 5).
# Encodes SPEC-REVISION.html §6 + §8. Run from the bones target.
# Exit 0 = every criterion proven. Static/structural checks only; Lighthouse
# perf/a11y and real-device sms: tests happen at stages 6-7 on the served build.
# ============================================================================
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="$ROOT/site"
DIST="$SITE/dist"
FAILS=0
pass(){ printf '  \033[32mPASS\033[0m %s\n' "$1"; }
fail(){ printf '  \033[31mFAIL\033[0m %s\n' "$1"; FAILS=$((FAILS+1)); }

echo "== accept-revision.sh :: tenant-hub revision gate =="

# ---- 0. build --------------------------------------------------------------
if [ ! -d "$SITE/node_modules" ]; then fail "site/node_modules missing (run npm install)"; echo "STOP"; exit 1; fi
echo "-- building (npm run build) --"
if ( cd "$SITE" && npm run build >/tmp/crm-rev-build.log 2>&1 ); then
  pass "npm run build exit 0"
else
  fail "npm run build FAILED — see /tmp/crm-rev-build.log"; tail -25 /tmp/crm-rev-build.log; echo "STOP"; exit 1
fi
[ -d "$DIST" ] && pass "dist/ exists" || { fail "no dist/"; exit 1; }

# ---- 1. route map: surviving routes prerendered, removed routes GONE -------
for r in "index.html" "meet/index.html" "accessibility/index.html" "404.html"; do
  f="$DIST/$r"
  if [ -f "$f" ]; then
    words=$(sed 's/<[^>]*>/ /g' "$f" | tr -s ' \n' ' ' | wc -w | tr -d ' ')
    if [ "${words:-0}" -ge 40 ]; then pass "$r prerendered ($words words)"; else fail "$r looks empty ($words words)"; fi
  else fail "$r MISSING"; fi
done
for gone in companies case-studies contact; do
  [ -e "$DIST/$gone" ] && fail "removed route still prerendered: dist/$gone" || pass "dist/$gone gone"
done

# ---- 2. redirects (T1) ------------------------------------------------------
RD="$DIST/_redirects"
if [ -f "$RD" ]; then
  pass "_redirects present"
  grep -qE '^/companies +/ +301' "$RD" && pass "/companies -> / 301" || fail "_redirects missing /companies 301"
  grep -qE '^/case-studies +/#standard +301' "$RD" && pass "/case-studies -> /#standard 301" || fail "_redirects missing /case-studies 301"
  grep -qE '^/contact +/#reach +301' "$RD" && pass "/contact -> /#reach 301" || fail "_redirects missing /contact 301"
else fail "_redirects MISSING from dist (T1 blocker)"; fi

# ---- 3. forbidden strings — dist-wide INCLUDING _headers (T3/T7) -----------
for bad in "supabase.co" "turnstile" "challenges.cloudflare.com" "info@shavitrootman.com" "substackcdn.com"; do
  if grep -rIiq "$bad" "$DIST"; then
    fail "forbidden string '$bad' in dist:"; grep -rIil "$bad" "$DIST" | head -3
  else pass "zero '$bad' in dist"; fi
done
grep -rIiq "build your portfolio" "$DIST" && fail "investor CTA 'build your portfolio' still in dist" || pass "no 'build your portfolio'"
grep -rIiq "<form" "$DIST"/*.html "$DIST"/*/index.html 2>/dev/null && fail "<form> tag in prerendered HTML" || pass "zero <form> tags"
for ent in "Barootman" "DSR Enterprises" "Charger Property Holdings" "Indiana Charger Holdings"; do
  grep -rIiq "$ent" "$DIST" && fail "entity '$ent' leaked into dist" || pass "no '$ent'"
done
grep -rIiq "Charger Property Management" "$DIST/index.html" && pass "'Managed by Charger Property Management' face present" || fail "CPM management face missing on home"

# ---- 4. state sections + listing cards -------------------------------------
# 'standard' section removed per Shavit 7/8 ("we say too much there") — fabricated
# testimonials pulled; do not re-add without real quotes + his sign-off.
for sec in michigan ohio indiana meet reach; do
  grep -qi "id=\"$sec\"" "$DIST/index.html" && pass "#$sec section present" || fail "#$sec section missing on home"
done
# hero one-big-idea (H2)
grep -qi "Every home we have" "$DIST/index.html" && pass "hero carries one-stop-shop headline" || fail "hero headline missing 'Every home we have'"
# status chips
# chips must use Shavit's own words from the 7/8 call: "Coming soon and available now"
grep -qiE 'Available Now' "$DIST/index.html" && pass "'Available Now' chips present" || fail "no Available-Now chips"

# ---- 7b. two buckets only (Shavit 7/8 tax/ownership concern) ----------------
# "I'd like to do coming up and available. What we've done in the past is not
# relevant... I don't need the city to be able to get on my website and go, oh,
# they own all of that." No full-address roster page. No holding-company names.
[ -e "$DIST/homes" ] \
  && fail "/homes roster page exists (Shavit: do not enumerate every home)" \
  || pass "no /homes roster page"
for ent in "Charger Property Holdings" "Charger Realty" "Indiana Charger Holdings" "Triovest" "Barootman" "holding company"; do
  grep -rIiq "$ent" "$DIST" && fail "holding-company name '$ent' shipped in dist" || pass "no '$ent' in dist"
done
grep -rIiqE 'owned by|we own|our portfolio of|properties we own' "$DIST" \
  && fail "ownership language in dist" || pass "no ownership language in dist"
# year-level ETA on coming-soon (H6 as amended by O2): bare 'Coming soon' banned, 'Coming 2026' required
# Bare "Coming Soon" is now ALLOWED for homes with no Shavit-confirmed year
# (Jake 7/9: "for now just put them as coming soon"). Inventing a year would be
# worse than showing none. Homes that DO have a year must still show it.
pass "bare 'Coming Soon' permitted for unknown-ETA homes (Jake 7/9)"
grep -qiE '(Coming|In rebuild[^0-9]*) ?20[0-9]{2}' "$DIST/index.html" \
  && pass "year-level ETA rendered on coming-soon" || fail "no year ETA ('In rebuild · 20XX') text found"
# O1: rent SUSPENDED until Shavit supplies facts — cards must NOT show seeded rent figures
grep -qE '\$1?,?[0-9]{3} ?·|\$[0-9],[0-9]{3}' "$DIST/index.html" && fail "seeded rent figures still on cards (O1: no rents until Shavit confirms)" || pass "no seeded rent figures (O1)"
grep -qiE 'Text for (rent|details)|Ask for details' "$DIST/index.html" && pass "'Text for details' fallback present" || fail "no rent-fallback microcopy on cards"

# ---- 5. sms/tel conversion path (T5) ---------------------------------------
if grep -oE 'href="sms:\+18053644415\?body=[^"]+"' "$DIST/index.html" >/dev/null; then
  pass "sms: links RFC-5724 formed (?body=)"
else fail "no correctly-formed sms:+18053644415?body= links on home"; fi
grep -oE 'href="sms:[^"]*&amp;body' "$DIST" -r >/dev/null 2>&1 && fail "malformed sms link using &body= (breaks Android)" || pass "no malformed &body= sms links"
# body must be URI-encoded (no raw spaces)
if grep -oE 'sms:\+18053644415\?body=[^"]*' "$DIST/index.html" | grep -q ' '; then
  fail "sms body contains raw spaces — must be encodeURIComponent'd"
else pass "sms bodies URI-encoded"; fi
grep -qE 'href="tel:\+1805' "$DIST/index.html" && pass "tel: link present" || fail "no tel: link on home"

# ---- 6. no internal links to removed routes (T8) ---------------------------
if grep -rE 'href="/(companies|case-studies|contact)[/"]' "$DIST" >/dev/null; then
  fail "internal links to removed routes remain:"; grep -rlE 'href="/(companies|case-studies|contact)[/"]' "$DIST" | head -3
else pass "zero internal links to removed routes"; fi

# ---- 7. The Standard: proof without parcels (§3/T6) -------------------------
# Pairs removed per Jake 2026-07-02 ("take out the before and after photos") — must NOT ship.
# Restore-ready assets in site/staging-assets/standard/ if he changes his mind.
if grep -qiE 'standard-[0-9]+-(before|after)' "$DIST/index.html" || [ -d "$DIST/assets/standard" ]; then
  fail "before/after assets in dist (removed per owner 2026-07-02)"
else pass "no before/after pairs in dist (per owner)"; fi
# banned past-project identifiers — contents AND filenames
# Lo Presto / Waldron / W South promoted to CURRENT listings per Shavit's 7/8
# call (his Drive photos, his go) — removed from the ban list.
# Per Jake 7/9 every org-chart address ships as a coming-soon card, so the old
# non-listable ban is retired. Only the LinkedIn-era "senator" copy stays banned.
for addr in "senator"; do
  if grep -rIiq "$addr" "$DIST"; then
    fail "banned identifier '$addr' present in dist"
  else pass "no '$addr' in dist"; fi
done
# All 42 org-chart addresses must actually render on the home page.
missing=0
for addr in "68 S West St" "13 W South St" "46 W South St" "17 Lo Presto Ave" "34 Budlong St" "34 Mead St" "19 E Saint Joe St" "11 E St Joe St" "43 Howder St" "166 Griswold St" "12 River St" "15 Waldron St" "115 Oak St" "33 Barry St" "11 Ludlam St" "24 N Norwood" "31 Rippon" "100 N West St" "59 Oak St" "179 State St" "101 Oak St" "388 Hillsdale St" "16 Marion St" "107 W Bacon St" "40 W Bacon St" "60 S Norwood" "15 E St Joe" "13087 Cedar Rd" "3461 W 129th St" "12112 Buckingham Ave" "3220 Clarendon Rd" "2677 E 126th St" "2189 Arey" "2236 Murray Hill" "2217 Parkview Ave" "1919 Kendall St" "514 E Victoria St" "1114 Cedar St" "1902 E Ewing"; do
  grep -Iq "$addr" "$DIST/index.html" || { fail "org-chart address '$addr' MISSING from home page"; missing=$((missing+1)); }
done
[ "$missing" -eq 0 ] && pass "all 39 org-chart addresses render (Trio = 1 card, 3 addresses)"
# counters removed with The Standard (Shavit 7/3 killed portfolio $; 7/8 killed
# the section) — assert the praise content stays OUT instead.
if grep -qiE 'What Renters Say|testimonial' "$DIST/index.html"; then
  fail "testimonial/praise content back on home (removed per Shavit 7/8)"
else pass "no testimonial/praise content on home (per Shavit 7/8)"; fi
grep -qi '2030' "$DIST/index.html" && fail "'2030' promise still on home (belongs on /meet)" || pass "no 2030 promise on home"
grep -qi '2030' "$DIST/meet/index.html" && pass "'200 by 2030' ambition on /meet" || fail "'2030' ambition missing from /meet"
# tenant quotes: DROPPED by owner (spec §9 O3) — seeded quotes must be GONE
grep -qiE 'tenant since 20[0-9]{2}' "$DIST" -r && fail "seeded tenant quotes still in dist (O3: dropped)" || pass "no seeded tenant quotes (O3)"

# ---- 8. FAQ in #reach (H4) ---------------------------------------------------
faq=$(grep -oiE 'aria-expanded' "$DIST/index.html" | wc -l | tr -d ' ')
[ "${faq:-0}" -ge 5 ] && pass "FAQ accordion present ($faq toggles)" || fail "FAQ accordion missing/too small ($faq aria-expanded)"

# ---- 9. staged listings never ship (T2) --------------------------------------
if grep -rE "properties\.staged" "$SITE/src" --include='*.jsx' --include='*.js' | grep -vE '^\s*//' | grep -q "import"; then
  fail "properties.staged.js is IMPORTED — staged listings would ship"
else pass "properties.staged.js not imported"; fi
[ -d "$DIST/staging-assets" ] && fail "staging-assets shipped in dist" || pass "no staging-assets in dist"

# ---- 10. sitemap + SEO (T11) --------------------------------------------------
SM="$DIST/sitemap.xml"
if [ -f "$SM" ]; then
  pass "sitemap.xml present"
  grep -qE '/(companies|case-studies|contact)' "$SM" && fail "sitemap still lists removed routes" || pass "sitemap free of removed routes"
  grep -q '/meet' "$SM" && pass "sitemap has /meet" || fail "sitemap missing /meet"
else fail "sitemap.xml missing"; fi
[ -f "$DIST/robots.txt" ] && pass "robots.txt present" || fail "robots.txt missing"
grep -rIiq '"@type"[[:space:]]*:[[:space:]]*"Organization"' "$DIST" && pass "Organization JSON-LD" || fail "Organization JSON-LD missing"
grep -rIiq 'LocalBusiness' "$DIST" && pass "LocalBusiness JSON-LD" || fail "LocalBusiness JSON-LD missing"
grep -rIiq '"email"' "$DIST/index.html" && fail "JSON-LD still carries email" || pass "no email in JSON-LD"
for r in "index.html" "meet/index.html" "accessibility/index.html"; do
  grep -qi '<meta[^>]*name="description"' "$DIST/$r" || fail "$r missing meta description"
  grep -qi 'rel="canonical"' "$DIST/$r" || fail "$r missing canonical"
done

# ---- 11. security headers: kept, but CSP pruned (T3) --------------------------
H="$DIST/_headers"
if [ -f "$H" ]; then
  grep -qi 'Content-Security-Policy' "$H" && pass "_headers has CSP" || fail "_headers missing CSP"
  grep -qi 'X-Content-Type-Options' "$H" && pass "_headers nosniff" || fail "_headers missing nosniff"
  grep -qiE 'X-Frame-Options|frame-ancestors' "$H" && pass "_headers frame protection" || fail "_headers missing frame protection"
else fail "_headers missing from dist"; fi

# ---- 12. secrets ---------------------------------------------------------------
if grep -rIiE 'service_role|SUPABASE_SERVICE|RESEND_API_KEY|re_[A-Za-z0-9]{16,}' "$DIST" >/dev/null; then
  fail "possible secret in dist"; else pass "no secrets in dist"; fi

# ---- 13. DESIGN FIDELITY (T4 — the anti-skeleton gate) -------------------------
echo "-- design fidelity --"
css_bytes=$(cat "$DIST"/assets/*.css 2>/dev/null | wc -c | tr -d ' ')
if [ "${css_bytes:-0}" -ge 86000 ]; then pass "design CSS shipped ($css_bytes bytes >= 86000 baseline)"; else fail "CSS shrank ($css_bytes < 86000) — skeleton-rewrite signature"; fi
if ls "$DIST"/assets/*.mp4 >/dev/null 2>&1 || grep -rIiq 'hero\.mp4' "$DIST/index.html"; then pass "hero video preserved"; else fail "hero video gone (spec: hero unchanged)"; fi
grep -rIiq '<video' "$DIST/index.html" && pass "home has <video> hero" || fail "home missing <video> hero"
sig=(band__inner "h-mega" eyebrow gold-rule ccard "band--iron" "split__")
hits=0; missing=""
for c in "${sig[@]}"; do
  if grep -rIohF "$c" "$DIST/index.html" "$DIST"/*/index.html 2>/dev/null | grep -q .; then hits=$((hits+1)); else missing="$missing $c"; fi
done
[ "$hits" -ge 6 ] && pass "signature classes used in markup ($hits/${#sig[@]})" || fail "only $hits/${#sig[@]} signature classes used —$missing — skeleton risk"
if grep -rIiqE 'class="intro |intro__mark|intro--pre' "$DIST/index.html"; then fail "LogoIntro baked into prerendered HTML"; else pass "LogoIntro client-only"; fi

# ---- 14. images: lazy, sized, budgeted (T13) -----------------------------------
if [ -d "$DIST/assets/listings" ]; then
  big=$(find "$DIST/assets/listings" -type f -size +250k | wc -l | tr -d ' ')
  [ "${big:-0}" -eq 0 ] && pass "all listing photos <=250KB" || fail "$big listing photos over 250KB"
else fail "dist/assets/listings missing"; fi
grep -qi 'loading="lazy"' "$DIST/index.html" && pass "lazy loading used" || fail "no loading=lazy on home imgs"
imgs_no_alt=$(grep -rohiE '<img [^>]*>' "$DIST" | grep -viE 'alt=' | wc -l | tr -d ' ')
[ "${imgs_no_alt:-0}" -eq 0 ] && pass "all <img> have alt" || fail "$imgs_no_alt <img> without alt"

# ---- 15. structural a11y + anchors (T10) ----------------------------------------
grep -qi '<html[^>]*lang=' "$DIST/index.html" && pass "html lang set" || fail "html missing lang"
grep -rIiq 'skip to main content' "$DIST/index.html" && pass "skip-link present" || fail "skip-link missing"
grep -qi 'scroll-margin' "$DIST"/assets/*.css && pass "scroll-margin-top set for anchors" || fail "no scroll-margin for anchor sections"
grep -qE 'href="/#(michigan|ohio|indiana)"' "$DIST/meet/index.html" && pass "cross-page anchors absolute (/#state)" || fail "nav anchors not absolute on /meet"

echo ""
if [ "$FAILS" -eq 0 ]; then
  echo -e "\033[32m== GATE GREEN: revision acceptance proven ==\033[0m"; exit 0
else
  echo -e "\033[31m== GATE RED: $FAILS failing criteria ==\033[0m"; exit 1
fi
