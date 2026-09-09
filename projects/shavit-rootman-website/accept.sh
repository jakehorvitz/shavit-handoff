#!/usr/bin/env bash
# ============================================================================
# accept.sh — BINDING acceptance gate for the shavitrootman.com migration.
# Encodes SPEC.html §9. Run from the bones target (~/projects/shavit-rootman-website).
# Exit 0 = every criterion proven. Any failure -> non-zero, gate stays closed.
# Static/structural checks only (build correctness, content, SEO, security,
# structural a11y). Full Lighthouse a11y>=95 is verified at Stage 6 on the served
# build — NOT faked here.
# ============================================================================
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="$ROOT/site"
DIST="$SITE/dist"
FAILS=0
pass(){ printf '  \033[32mPASS\033[0m %s\n' "$1"; }
fail(){ printf '  \033[31mFAIL\033[0m %s\n' "$1"; FAILS=$((FAILS+1)); }
have(){ command -v "$1" >/dev/null 2>&1; }

echo "== accept.sh :: shavitrootman.com migration gate =="

# ---- 0. build -------------------------------------------------------------
if [ ! -d "$SITE/node_modules" ]; then fail "site/node_modules missing (run npm install)"; echo "STOP"; exit 1; fi
echo "-- building (npm run build) --"
if ( cd "$SITE" && npm run build >/tmp/crm-build.log 2>&1 ); then
  pass "npm run build exit 0"
else
  fail "npm run build FAILED — see /tmp/crm-build.log"; tail -25 /tmp/crm-build.log; echo "STOP"; exit 1
fi
[ -d "$DIST" ] && pass "dist/ exists" || { fail "no dist/"; exit 1; }

# ---- 1. per-route prerendered HTML with real content ----------------------
routes=( "index.html" "companies/index.html" "case-studies/index.html" "meet/index.html" "contact/index.html" "accessibility/index.html" )
for r in "${routes[@]}"; do
  f="$DIST/$r"
  if [ -f "$f" ]; then
    # real prerendered content, not an empty root div
    bytes=$(grep -o '<div id="root">[^<]*</div>' "$f" | wc -c | tr -d ' ')
    words=$(sed 's/<[^>]*>/ /g' "$f" | tr -s ' \n' ' ' | wc -w | tr -d ' ')
    if [ "${words:-0}" -ge 40 ]; then pass "$r prerendered ($words words of text)"; else fail "$r looks empty ($words words) — not prerendered"; fi
  else
    fail "$r MISSING"
  fi
done

# ---- 2. unique per-route <title> + meta description + canonical -----------
titles="$(for r in "${routes[@]}"; do [ -f "$DIST/$r" ] && grep -oiE '<title>[^<]*</title>' "$DIST/$r" | head -1; done)"
uniq_titles=$(printf '%s\n' "$titles" | sort -u | grep -c .)
n_routes=${#routes[@]}
[ "$uniq_titles" -ge "$n_routes" ] && pass "each route has a unique <title> ($uniq_titles)" || fail "titles not unique per route ($uniq_titles/$n_routes)"
for r in "${routes[@]}"; do
  f="$DIST/$r"; [ -f "$f" ] || continue
  grep -qi '<meta[^>]*name="description"' "$f" || fail "$r missing meta description"
  grep -qi '<link[^>]*rel="canonical"' "$f" || fail "$r missing canonical"
done
grep -rqi '<meta[^>]*property="og:' "$DIST" && pass "Open Graph tags present" || fail "no Open Graph tags"

# ---- 3. NO Invest-With-Me / accredited / investor-solicitation footprint --
if grep -rIiE 'invest with me|accredited|deploy capital' "$DIST" >/dev/null; then
  fail "investor-solicitation copy still in dist:"; grep -rIiE 'invest with me|accredited|deploy capital' "$DIST" | head -5
else pass "no Invest-With-Me / accredited / deploy-capital copy"; fi

# ---- 4. NO Google Forms footprint (dist AND site/src) ---------------------
if grep -rIiE 'docs.google.com/forms|PLACEHOLDER_|open in google forms' "$DIST" "$SITE/src" >/dev/null 2>&1; then
  fail "Google Forms footprint remains:"; grep -rIiE 'docs.google.com/forms|PLACEHOLDER_|open in google forms' "$DIST" "$SITE/src" 2>/dev/null | head -5
else pass "zero Google Forms footprint"; fi
[ -f "$SITE/src/Forms.jsx" ] && fail "Forms.jsx still present" || pass "Forms.jsx removed"

# ---- 5. NO dev bundles (unpkg / babel-standalone / react.development) ------
if grep -rIiE 'unpkg\.com|@babel/standalone|react\.development' "$DIST" >/dev/null; then
  fail "dev-mode bundles referenced in dist"; else pass "no unpkg / babel-standalone / react.development in dist"; fi

# ---- 6. uploads/ must not ship --------------------------------------------
[ -d "$DIST/uploads" ] && fail "uploads/ shipped in dist" || pass "no uploads/ in dist"

# ---- 7. brand = Charger Realty Management + subsidiary names kept ----------
grep -rIiq 'Charger Realty Management' "$DIST/index.html" && pass "brand 'Charger Realty Management' present" || fail "brand name missing on home"
# subsidiary company names must remain in the footer (locked decision — don't generic-ize)
subs_missing=""; for s in "Barootman" "Charger Realty" "DSR" "Charger Property Management"; do grep -rIiq "$s" "$DIST/index.html" || subs_missing="$subs_missing '$s'"; done
[ -z "$subs_missing" ] && pass "subsidiary company names present (footer)" || fail "footer lost subsidiary company names:$subs_missing"

# ---- 8. SEO files ---------------------------------------------------------
[ -f "$DIST/sitemap.xml" ] && pass "sitemap.xml present" || fail "sitemap.xml missing"
[ -f "$DIST/robots.txt" ] && pass "robots.txt present" || fail "robots.txt missing"
grep -rIiq '"@type"[[:space:]]*:[[:space:]]*"Organization"' "$DIST" && pass "Organization JSON-LD present" || fail "Organization JSON-LD missing"
grep -rIiq 'LocalBusiness' "$DIST" && pass "LocalBusiness JSON-LD present" || fail "LocalBusiness JSON-LD missing"

# ---- 9. security headers ---------------------------------------------------
H="$DIST/_headers"
if [ -f "$H" ]; then
  grep -qi 'Content-Security-Policy' "$H" && pass "_headers has CSP" || fail "_headers missing CSP"
  grep -qi 'X-Content-Type-Options' "$H" && pass "_headers has nosniff" || fail "_headers missing X-Content-Type-Options"
  grep -qi 'Referrer-Policy' "$H" && pass "_headers has Referrer-Policy" || fail "_headers missing Referrer-Policy"
  grep -qiE 'X-Frame-Options|frame-ancestors' "$H" && pass "_headers has frame protection" || fail "_headers missing frame protection"
else fail "_headers missing from dist"; fi

# ---- 10. no server-side secrets in the shipped bundle ---------------------
if grep -rIiE 'service_role|SUPABASE_SERVICE|RESEND_API_KEY|re_[A-Za-z0-9]{16,}|0x[0-9A-Za-z]{20,}.*secret' "$DIST" >/dev/null; then
  fail "possible secret leaked into dist:"; grep -rIiE 'service_role|RESEND_API_KEY|re_[A-Za-z0-9]{16,}' "$DIST" | head -3
else pass "no service_role / Resend / Turnstile-secret strings in dist"; fi

# ---- 11. structural accessibility -----------------------------------------
grep -qi '<html[^>]*lang=' "$DIST/index.html" && pass "html lang attribute set" || fail "html missing lang attr"
# every <img> in dist has an alt attribute
imgs_no_alt=$(grep -rohiE '<img [^>]*>' "$DIST" | grep -viE 'alt=' | wc -l | tr -d ' ')
[ "${imgs_no_alt:-0}" -eq 0 ] && pass "all <img> have alt" || fail "$imgs_no_alt <img> without alt"
grep -rIiq 'skip to main content' "$DIST" && pass "skip-link present" || fail "skip-to-content link missing"
# contact form fields have labels or aria-label
if [ -f "$DIST/contact/index.html" ]; then
  grep -qiE '<label|aria-label' "$DIST/contact/index.html" && pass "contact form has labels/aria-label" || fail "contact form fields unlabeled"
fi

# ---- 12. contact form posts to a config-driven endpoint, form present -----
if [ -f "$DIST/contact/index.html" ]; then
  grep -qiE 'name=("|\x27)?(name|email|phone|message)' "$DIST/contact/index.html" && pass "contact form fields present" || fail "contact form fields missing"
fi

# ---- 13. DESIGN FIDELITY (must be a faithful port, not a skeleton) --------
echo "-- design fidelity --"
# 13a. real CSS weight — original design is ~110KB; a skeleton is ~8KB
css_bytes=$(cat "$DIST"/assets/*.css 2>/dev/null | wc -c | tr -d ' ')
if [ "${css_bytes:-0}" -ge 80000 ]; then pass "design CSS shipped ($css_bytes bytes)"; else fail "design CSS too small ($css_bytes bytes; expected >=80000) — looks like a stripped rewrite, not a port"; fi
# 13b. hero video present + referenced
if ls "$DIST"/assets/*.mp4 >/dev/null 2>&1; then pass "hero video mp4 in dist/assets"; else fail "hero video mp4 missing from dist"; fi
grep -rIiq '<video' "$DIST"/index.html && pass "home page has <video> hero" || fail "home page missing <video> hero"
# 13c. signature design classes must actually be USED in the prerendered MARKUP
# (grep dist HTML, NOT the css file — importing the CSS alone must not pass).
sig=(hero__scrim cstudy "deep__panel" brrrr progvis endorse "tri__col" ccard "band--iron" gold-rule "split__" "band__inner" "h-mega" eyebrow)
hits=0; used=""
for c in "${sig[@]}"; do
  if grep -rIohF "$c" "$DIST"/index.html "$DIST"/*/index.html 2>/dev/null | grep -q .; then hits=$((hits+1)); else used="$used $c"; fi
done
if [ "$hits" -ge 10 ]; then pass "signature design classes USED in rendered markup ($hits/${#sig[@]})"; else fail "only $hits/${#sig[@]} signature classes used in markup — missing:$used — pages are a skeleton, not the ported design"; fi
# 13c-2: rich section markup must appear across pages (case study + company deep-dive + BRRRR + endorsements)
grep -rIiq 'cstudy' "$DIST/case-studies/index.html" && pass "case-studies uses cstudy layout" || fail "case-studies not using original cstudy markup"
grep -rIiq 'deep__panel\|deep ' "$DIST/companies/index.html" && pass "companies uses deep-dive layout" || fail "companies not using original deep-dive markup"
# 13d. signature CONTENT must survive across the built pages
content=("Gary Pauken" "Nicky" "Senator Dan Roberts" "Barootman" "DSR" "2030")
missing=""; for s in "${content[@]}"; do grep -rIiq "$s" "$DIST" || missing="$missing '$s'"; done
[ -z "$missing" ] && pass "signature content preserved (case studies, companies, endorsements, 2030 vision)" || fail "missing original content:$missing"
grep -rIiqE 'BRRRR|Refinance' "$DIST" && pass "BRRRR playbook content present" || fail "BRRRR playbook content missing"
# 13e. LogoIntro must be CLIENT-ONLY (curtain not baked into prerendered HTML)
if grep -rIiqE 'class="intro |intro__mark|intro--pre' "$DIST"/index.html; then fail "LogoIntro curtain baked into prerendered HTML — must be client-only"; else pass "LogoIntro not baked into prerendered HTML (client-only)"; fi

echo ""
if [ "$FAILS" -eq 0 ]; then
  echo -e "\033[32m== GATE GREEN: all acceptance + fidelity criteria proven ==\033[0m"; exit 0
else
  echo -e "\033[31m== GATE RED: $FAILS failing criteria ==\033[0m"; exit 1
fi
