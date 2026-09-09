#!/usr/bin/env python3
"""
Build the Shavit Rootman — Facebook + Meta Business Suite spec: a single,
portable, self-contained HTML file Jake grills, then shows Shavit. Mirrors the
@shavitness IG remodel spec so the two read as a set. Brand = the live
shavitrootman.com system (black canvas, brass #B08D57, gold #FFC000, Inter),
with an AUTHENTIC light-mode Facebook Page mockup dropped inside it so Shavit
sees the "after," not a plan. Every image embedded once as base64.
"""
import base64, pathlib, sys

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "index.html"
SITE = pathlib.Path.home() / "projects/shavit-rootman-website/site/public/assets/listings"
IG = pathlib.Path.home() / "projects/shavit-instagram/assets"

def datauri(p: pathlib.Path) -> str:
    if not p.exists():
        print(f"WARN missing {p}", file=sys.stderr)
        return ""
    mime = "image/jpeg" if p.suffix.lower() in (".jpg", ".jpeg") else "image/png"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()

IMAGES = {
    "cover":   datauri(SITE / "12-river-street.jpg"),
    "avatar":  datauri(IG / "avatar.jpeg"),
    "t1":      datauri(SITE / "17-lo-presto.jpg"),
    "t2":      datauri(SITE / "15-waldron.jpg"),
    "t3":      datauri(SITE / "46-w-south.jpg"),
    "t4":      datauri(SITE / "34-mead.jpg"),
    "t5":      datauri(SITE / "61-salem.jpg"),
    "t6":      datauri(SITE / "2217-parkview.jpg"),
    "post":    datauri(SITE / "12-river-street.jpg"),
}
CSS_IMG = "\n".join(f".bg-{k}{{background-image:url('{u}')}}" for k, u in IMAGES.items() if u)

# ------- small vector glyphs (Facebook chrome) -------------------------------
FB_F = ('<svg viewBox="0 0 24 24" width="26" height="26"><path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7v-3.5h3.1V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.2h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/></svg>')
CHK = ('<svg viewBox="0 0 24 24" width="17" height="17" style="vertical-align:-3px"><path fill="#1877F2" d="M12 2l2.4 1.8 3 .1 1 2.8 2.4 1.7-.9 2.8.9 2.8-2.4 1.7-1 2.8-3 .1L12 22l-2.4-1.8-3-.1-1-2.8L3.2 15l.9-2.8-.9-2.8 2.4-1.7 1-2.8 3-.1z"/><path fill="#fff" d="M10.6 14.6l-2.2-2.2-1.2 1.2 3.4 3.4 6-6-1.2-1.2z"/></svg>')

def tile(k): return f'<span class="ftile bg-{k}"></span>'

FEED_TILES = "".join(tile(k) for k in ["t1","t2","t3","t4","t5","t6"])

# ============================================================================
HTML = f"""<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Shavit Rootman — Facebook + Meta Business Suite</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
:root{{
  --canvas:#000;--soft:#0d0d0d;--card:#141414;--elev:#1e1e1e;
  --hair:#2c2c2c;--hair2:#3c3c3c;--ink:#fff;--body:#cfcfcf;--muted:#8a8a8a;
  --brass:#B08D57;--gold:#FFC000;--fb:#1877F2;
  --font:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
}}
*{{box-sizing:border-box;margin:0;padding:0}}
@page{{size:12in 15in;margin:0}}
@media print{{.page{{min-height:15in;display:flex;flex-direction:column;justify-content:center}}}}
body{{background:#050505;color:var(--body);font-family:var(--font);font-weight:300;line-height:1.55;-webkit-font-smoothing:antialiased;
  background-image:radial-gradient(1200px 600px at 82% -10%,rgba(176,141,87,.10),transparent 60%),radial-gradient(900px 500px at 0% 18%,rgba(255,192,0,.05),transparent 55%);}}
{CSS_IMG}
.page{{width:1100px;margin:0 auto;padding:64px 72px;page-break-after:always;position:relative}}
.page:last-child{{page-break-after:auto}}
.kicker{{font-size:12px;letter-spacing:.42em;text-transform:uppercase;color:var(--brass);font-weight:600}}
h1{{font-size:60px;line-height:1.02;color:var(--ink);font-weight:800;letter-spacing:-.02em;margin:14px 0}}
h2{{font-size:34px;color:var(--ink);font-weight:700;letter-spacing:-.01em;margin:6px 0 4px}}
h3{{font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);font-weight:700}}
.lead{{font-size:19px;color:var(--body);font-weight:300;max-width:760px}}
.muted{{color:var(--muted)}}
.rule{{height:1px;background:linear-gradient(90deg,var(--brass),transparent);margin:22px 0}}
.pagenum{{position:absolute;top:64px;right:72px;font-size:12px;letter-spacing:.3em;color:var(--muted)}}
.foot{{position:absolute;bottom:34px;left:72px;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#5a5a5a}}

/* cover */
.cover{{min-height:900px;display:flex;flex-direction:column;justify-content:center}}
.cover h1{{font-size:78px}}
.badge-row{{display:flex;gap:12px;margin-top:30px;flex-wrap:wrap}}
.badge{{border:1px solid var(--hair2);border-radius:999px;padding:10px 18px;font-size:13px;letter-spacing:.04em;color:var(--body)}}
.badge b{{color:var(--gold);font-weight:600}}
.sig{{margin-top:40px;font-size:15px;color:var(--muted)}}
.sig b{{color:var(--brass);font-weight:600}}

/* two-col */
.cols{{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:26px}}
.cols3{{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:26px}}
.cardbox{{background:linear-gradient(180deg,#141414,#0e0e0e);border:1px solid var(--hair);border-radius:16px;padding:24px 26px}}
.cardbox .n{{font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--brass);font-weight:700}}
.cardbox p{{margin-top:10px;font-size:15px;color:var(--body)}}
.cardbox .big{{font-size:15px;color:var(--ink);font-weight:600;margin-top:10px}}
ul.clean{{list-style:none;margin-top:14px}}
ul.clean li{{position:relative;padding-left:22px;margin:11px 0;font-size:15.5px;color:var(--body)}}
ul.clean li::before{{content:"";position:absolute;left:0;top:9px;width:8px;height:8px;border-radius:2px;background:var(--brass);transform:rotate(45deg)}}
ul.clean li b{{color:var(--ink);font-weight:600}}

/* ===== authentic light Facebook page mockup ===== */
.fb{{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.55);color:#050505;margin-top:8px}}
.fbcover{{height:300px;background-size:cover;background-position:center;position:relative}}
.fbcover::after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.35))}}
.fbhead{{padding:0 28px 18px;display:flex;align-items:flex-end;gap:20px;margin-top:-46px;position:relative;z-index:2}}
.fbpic{{width:168px;height:168px;border-radius:50%;border:5px solid #fff;background-size:cover;background-position:center;flex:0 0 auto;box-shadow:0 6px 18px rgba(0,0,0,.2)}}
.fbid{{padding-bottom:8px;flex:1}}
.fbname{{font-size:32px;font-weight:800;color:#080808;letter-spacing:-.01em}}
.fbmeta{{color:#65676b;font-size:15px;margin-top:3px;font-weight:400}}
.fbmeta .dot{{margin:0 7px}}
.fbcta{{display:flex;gap:10px;padding-bottom:6px}}
.fbbtn{{background:var(--fb);color:#fff;font-weight:700;font-size:15px;border-radius:8px;padding:10px 20px}}
.fbbtn.ghost{{background:#e4e6eb;color:#050505}}
.fbnav{{border-top:1px solid #ced0d4;display:flex;gap:6px;padding:2px 22px 0;color:#65676b;font-weight:600;font-size:15px}}
.fbnav span{{padding:14px 14px}}
.fbnav .on{{color:var(--fb);box-shadow:inset 0 -3px 0 var(--fb)}}
.fbbody{{background:#f0f2f5;padding:20px;display:grid;grid-template-columns:340px 1fr;gap:18px}}
.fbcard{{background:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 1px 3px rgba(0,0,0,.1)}}
.fbcard h4{{font-size:19px;font-weight:800;color:#080808;margin-bottom:8px}}
.fbcard p{{font-size:14.5px;color:#050505;line-height:1.5}}
.fbrow{{display:flex;gap:10px;align-items:center;font-size:14px;color:#050505;margin:9px 0}}
.fbrow i{{color:#65676b;width:18px;text-align:center;font-style:normal}}
.fbgrid{{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:12px}}
.fbgrid .ftile{{aspect-ratio:1;background-size:cover;background-position:center;border-radius:4px;display:block}}
.tag{{display:inline-block;background:#e7f0ff;color:var(--fb);font-size:12px;font-weight:700;border-radius:6px;padding:4px 9px;margin:3px 5px 0 0}}

/* mock post */
.mpost{{background:#fff;border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.12);color:#050505;overflow:hidden;max-width:560px}}
.mphead{{display:flex;gap:12px;align-items:center;padding:16px 16px 10px}}
.mpic{{width:44px;height:44px;border-radius:50%;background-size:cover;background-position:center}}
.mpname{{font-weight:700;font-size:15px;color:#080808}}
.mpsub{{font-size:12.5px;color:#65676b}}
.mptext{{padding:2px 16px 14px;font-size:15px;color:#050505;line-height:1.55;white-space:pre-line}}
.mpimg{{height:300px;background-size:cover;background-position:center}}
.mpbar{{display:flex;justify-content:space-around;padding:10px 0;color:#65676b;font-size:14px;font-weight:600;border-top:1px solid #e4e6eb}}
.callout{{border-left:3px solid var(--gold);padding:6px 0 6px 18px;margin:22px 0 0;font-size:15px;color:var(--body)}}
.callout b{{color:var(--gold);font-weight:600}}

/* cadence table */
.cad{{width:100%;border-collapse:collapse;margin-top:22px;font-size:15px}}
.cad th{{text-align:left;color:var(--brass);text-transform:uppercase;letter-spacing:.1em;font-size:12px;font-weight:700;padding:0 16px 12px;border-bottom:1px solid var(--hair)}}
.cad td{{padding:15px 16px;border-bottom:1px solid var(--hair);color:var(--body);vertical-align:top}}
.cad td b{{color:var(--ink);font-weight:600}}
.pill{{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.05em;padding:4px 10px;border-radius:999px;background:rgba(176,141,87,.14);color:var(--brass);border:1px solid rgba(176,141,87,.3)}}

/* need-from-you */
.steps{{counter-reset:s;margin-top:24px}}
.step{{display:flex;gap:20px;padding:18px 0;border-bottom:1px solid var(--hair)}}
.step .num{{counter-increment:s;flex:0 0 auto;width:44px;height:44px;border-radius:50%;border:1px solid var(--brass);color:var(--gold);font-weight:700;display:flex;align-items:center;justify-content:center;font-size:18px}}
.step .num::before{{content:counter(s)}}
.step .b{{color:var(--ink);font-weight:600;font-size:17px}}
.step .d{{font-size:15px;color:var(--muted);margin-top:3px}}
</style></head><body>

<!-- 1 · COVER -->
<section class="page cover">
  <div class="kicker">Shavit Rootman · Marketing Revamp</div>
  <h1>Facebook,<br>Operated.</h1>
  <p class="lead">Standing up the Facebook side of the house — one page, run out of Meta Business Suite alongside Instagram, built for the people who matter most: your tenants, current and future.</p>
  <div class="badge-row">
    <span class="badge"><b>One cockpit</b> — FB + IG together</span>
    <span class="badge"><b>2–3 posts / week</b> — reputation, not noise</span>
    <span class="badge"><b>Same brand</b> as shavitrootman.com</span>
  </div>
  <div class="sig">A spec to look at, not a plan to read — <b>Jake Horvitz</b>, for Shavit Rootman &amp; Charger Property Management</div>
  <div class="foot">Facebook + Meta Business Suite · Draft spec</div>
</section>

<!-- 2 · WHY META BUSINESS SUITE -->
<section class="page">
  <div class="pagenum">01 / WHY</div>
  <div class="kicker">The tool behind it</div>
  <h2>One place to run Facebook &amp; Instagram — not two jobs.</h2>
  <p class="lead">Meta Business Suite is the free control room Meta gives every business. We connect your Facebook Page and Instagram to it once, and from then on everything runs from a single screen. You never have to touch two apps, and you never have to be the one posting.</p>
  <div class="cols3">
    <div class="cardbox"><div class="n">Post once, land twice</div><p>Write a post or drop a reel a single time and it publishes to both Facebook and Instagram — scheduled ahead to the hours your audience is actually online.</p></div>
    <div class="cardbox"><div class="n">One inbox</div><p>Every comment and message from both platforms lands in one place, so a prospective tenant asking "is this still available?" never gets missed.</p></div>
    <div class="cardbox"><div class="n">Real numbers</div><p>Reach, engagement, follower growth — one dashboard. This is how we prove the reputation work is landing over the 6–12 month window.</p></div>
  </div>
  <div class="callout"><b>What it means for you:</b> you approve, I operate. You get admin on the page, see everything, and never have to learn the tool — that's my job.</div>
  <div class="foot">Facebook + Meta Business Suite · Draft spec</div>
</section>

<!-- 3 · THE PAGE MOCKUP -->
<section class="page">
  <div class="pagenum">02 / THE PAGE</div>
  <div class="kicker">The "after" — this is the page a stranger sees</div>
  <h2 style="margin-bottom:18px">The refreshed Facebook Page.</h2>
  <div class="fb">
    <div class="fbcover bg-cover"></div>
    <div class="fbhead">
      <span class="fbpic bg-avatar"></span>
      <div class="fbid">
        <div class="fbname">Shavit Rootman {CHK}</div>
        <div class="fbmeta">Property Management Company<span class="dot">·</span>Michigan · Ohio · Indiana</div>
      </div>
      <div class="fbcta"><span class="fbbtn">Send message</span><span class="fbbtn ghost">Follow</span></div>
    </div>
    <div class="fbnav"><span class="on">Posts</span><span>About</span><span>Photos</span><span>Reels</span><span>Reviews</span></div>
    <div class="fbbody">
      <div>
        <div class="fbcard">
          <h4>Intro</h4>
          <p>Bringing overlooked houses back to life and handing them to families who need them. Professional, responsive, quality-first property management across the Midwest.</p>
          <div class="fbrow"><i>🏠</i> Charger Property Management</div>
          <div class="fbrow"><i>🔗</i> shavitrootman.com</div>
          <div class="fbrow"><i>📍</i> Serving Michigan · Ohio · Indiana</div>
          <div class="fbrow"><i>✉️</i> Message us about a rental</div>
        </div>
      </div>
      <div>
        <div class="fbcard">
          <h4>Photos</h4>
          <div class="fbgrid">{FEED_TILES}</div>
          <div style="margin-top:12px">
            <span class="tag">Before &amp; After</span><span class="tag">Current projects</span><span class="tag">The team</span><span class="tag">For rent</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="callout">Same system as the website and the Instagram remodel — <b>full state names</b>, no abbreviations; the reels you already have become the Reels tab; cover swaps seasonally to a current project.</div>
  <div class="foot">Facebook + Meta Business Suite · Draft spec</div>
</section>

<!-- 4 · CADENCE / CROSS-POST -->
<section class="page">
  <div class="pagenum">03 / RHYTHM</div>
  <div class="kicker">How it stays alive without becoming a second job</div>
  <h2>What goes up, and when.</h2>
  <p class="lead">Same cadence we agreed on — <b>2–3 posts a week, reputation over virality</b>. Everything is made once and cross-posted, scheduled to the high-traffic window so it lands when people are watching.</p>
  <table class="cad">
    <tr><th>Pillar</th><th>What it is</th><th>Cadence</th></tr>
    <tr><td><b>Before &amp; After</b></td><td>The signature reveal — a house that came back. Your highest-saved format.</td><td><span class="pill">Weekly</span></td></tr>
    <tr><td><b>Current Projects</b></td><td>What's on the bench right now — 15 E Saint Joe, 60 S Norwood, 43 Howder. Proof it's a live operation.</td><td><span class="pill">Bi-weekly</span></td></tr>
    <tr><td><b>The Standard</b></td><td>The brand film / mission — second-chance housing, done right. Reputation, not transaction.</td><td><span class="pill">Monthly</span></td></tr>
    <tr><td><b>For Rent / Info</b></td><td>An available unit or a tenant-useful note, pointed at shavitrootman.com.</td><td><span class="pill">As needed</span></td></tr>
  </table>
  <div class="callout"><b>Timing:</b> posts scheduled for the high window — roughly <b>11am PST / 2pm EST</b> — so they hit peak traffic instead of getting buried.</div>
  <div class="foot">Facebook + Meta Business Suite · Draft spec</div>
</section>

<!-- 5 · THE ANNOUNCEMENT -->
<section class="page">
  <div class="pagenum">04 / LAUNCH</div>
  <div class="kicker">The one post that kicks it off — across every channel</div>
  <h2 style="margin-bottom:6px">The marketing-revamp announcement.</h2>
  <p class="lead muted" style="font-size:16px;margin-bottom:22px">Draft copy — plain-spoken, from you. Same post goes out on Facebook and Instagram the day we relaunch.</p>
  <div class="mpost">
    <div class="mphead"><span class="mpic bg-avatar"></span><div><div class="mpname">Shavit Rootman</div><div class="mpsub">Just now · 🌐</div></div></div>
    <div class="mptext">A little news from our side of the desk.

For years the work spoke for itself — houses nobody else wanted, brought back and handed to families who needed them. We never did much talking about it.

That changes now. We're refreshing how we show up online — same team, same standard, just easier to follow along. Expect real before-and-afters, the homes we're working on right now, and an honest look at how we operate.

Whether you rent from us, might one day, or just like watching a place come back to life — follow along. Glad you're here.

— Shavit &amp; the Charger team</div>
    <div class="mpimg bg-post"></div>
    <div class="mpbar"><span>👍 Like</span><span>💬 Comment</span><span>↗ Share</span></div>
  </div>
  <div class="callout"><b>Your call, not mine:</b> this is a starting draft in your voice — swap a line, cut a line, make it yours. Nothing posts until you say the words.</div>
  <div class="foot">Facebook + Meta Business Suite · Draft spec</div>
</section>

<!-- 6 · WHAT I NEED -->
<section class="page">
  <div class="pagenum">05 / NEXT</div>
  <div class="kicker">To turn this on</div>
  <h2>What I need from you.</h2>
  <p class="lead">Small list. Once I have these I can stand the page up, wire it into Business Suite, and have the announcement staged for your approval.</p>
  <div class="steps">
    <div class="step"><span class="num"></span><div><div class="b">Page access</div><div class="d">If a Facebook Page already exists, add me as admin/editor. If not, I'll create it under your account — you stay the owner.</div></div></div>
    <div class="step"><span class="num"></span><div><div class="b">The name call</div><div class="d">Page as "Shavit Rootman" or "Charger Property Management"? One-line decision — I'll flag my recommendation on the phone.</div></div></div>
    <div class="step"><span class="num"></span><div><div class="b">A few photos</div><div class="d">A clean wide exterior for the cover, and anything from the current projects. Same portal drop as before works great.</div></div></div>
    <div class="step"><span class="num"></span><div><div class="b">Your read on the announcement</div><div class="d">Tell me what sounds like you and what doesn't. I'll lock it and stage it — you approve before it goes live.</div></div></div>
  </div>
  <div class="callout" style="margin-top:30px">Then we're live on both platforms, running from one screen, on the cadence we agreed on. <b>Let's get it right.</b></div>
  <div class="foot">Facebook + Meta Business Suite · Draft spec · Jake Horvitz</div>
</section>

</body></html>"""

OUT.write_text(HTML, encoding="utf-8")
print(f"wrote {OUT}  ({len(HTML)//1024} KB)")
