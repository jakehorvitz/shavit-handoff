# GTM + GA4 setup guide — Shavit Rootman

**The gist:**
- **Do this once** — ~30–40 minutes, start to finish.
- **Everything is free** — no paid tiers, no credit card.
- **The site code is already done** — you're only filling in IDs and building the container.
- **What you'll do:** create a GA4 property → create a GTM container → add the GA4 tag → wire 5 events → test → publish.
- **What you need handy:** a Google account, and ~5 min of clicking through Google's setup wizards.

> **Why GTM at all?** The site's strict Content-Security-Policy blocks inline
> scripts, and GTM lets you add/adjust tags later without ever editing site code
> again. GA4 lives *inside* GTM as one tag. (If you ever want GA4 with no GTM, use
> `ga4-loader.js` instead — see its header. Don't run both.)

---

## Step 1 — Create the GA4 property (~5 min)

1. Go to **analytics.google.com** → **Admin** (gear, bottom-left).
2. **Create Property** → name it `Shavit Rootman`. Set timezone/currency → US.
3. Under the new property → **Data Streams** → **Add stream** → **Web**.
   - Website URL: `https://shavitrootman.com`
   - Stream name: `Shavit Rootman — Web`
4. Copy the **Measurement ID** — looks like `G-XXXXXXXXXX`. **Save it.**

---

## Step 2 — Create the GTM container (~3 min)

1. Go to **tagmanager.google.com** → **Create Account**.
   - Account name: `Shavit Rootman`. Container name: `shavitrootman.com`. Type: **Web**.
2. Copy the **Container ID** — looks like `GTM-XXXXXXX`. **Save it.**
3. Ignore the install snippet GTM shows you — the site already loads GTM via
   `gtm-loader.js`.

### Put the GTM ID into the site
Open `~/Desktop/Shavit/website/gtm-loader.js`, replace `GTM-XXXXXXX` on the last
line with your real ID, save. That's the only site edit.

---

## Step 3 — Add the GA4 Configuration tag inside GTM (~3 min)

1. In GTM → **Tags** → **New** → **Tag Configuration** → **Google Tag**.
2. **Tag ID** = your GA4 Measurement ID (`G-XXXXXXXXXX`).
3. **Triggering** → **All Pages** (Initialization - All Pages).
4. Name it `GA4 — Config`. **Save.**

This sends automatic `page_view`s (with UTM attribution) to GA4. Pageview-based
metrics (sessions, openings page views via UTM) work off this alone.

---

## Step 4 — Wire the 5 custom events (~15 min)

The site's `analytics.js` already pushes these to the dataLayer:
`email_click`, `openings_click`, `owners_page_view`, `substack_click`, `youtube_click`.

For **each** of the 5, create one **trigger** + one **tag**.

### 4a. Create a trigger (do this 5×, once per event name)
1. GTM → **Triggers** → **New** → **Custom Event**.
2. **Event name** = the exact event string (e.g. `email_click`).
3. Fires on **All Custom Events**. Name it `CE — email_click`. **Save.**
4. Repeat for `openings_click`, `owners_page_view`, `substack_click`, `youtube_click`.

### 4b. (Optional but recommended) Capture the event params as Variables
`analytics.js` sends extra fields you'll want in GA4: `email_alias`, `link_url`,
`route`, `link_campaign`, `link_market`.
1. GTM → **Variables** → **User-Defined Variables** → **New** → **Data Layer Variable**.
2. Variable name field = `email_alias` (name the variable `DLV - email_alias`). Save.
3. Repeat for `link_url` (`DLV - link_url`) — that's enough to start.

### 4c. Create a GA4 event tag (do this 5×)
1. GTM → **Tags** → **New** → **Google Analytics: GA4 Event**.
2. **Measurement ID / Configuration**: select your `GA4 — Config` (or paste `G-XXXXXXXXXX`).
3. **Event Name** = the same event string (e.g. `email_click`).
4. **Event Parameters** (for `email_click` only): add
   - parameter `email_alias` = `{{DLV - email_alias}}`
   - parameter `link_url` = `{{DLV - link_url}}`
5. **Triggering** = the matching `CE — …` trigger.
6. Name it `GA4 — email_click`. **Save.**
7. Repeat for the other four (params optional for those; `link_url` is handy).

---

## Step 5 — Test in Preview mode (~5 min)

1. GTM → **Preview** (top right). Enter `https://shavitrootman.com/links` → **Connect**.
   (Or test locally: `node serve.js` then `http://127.0.0.1:8803/links/` — but
   localhost won't send to GA4 unless GTM Preview is attached.)
2. Click each button. In the **Tag Assistant** panel you should see the
   corresponding tag fire: e.g. clicking **Substack** fires `GA4 — substack_click`.
3. Visit `…/?utm_campaign=owners#contact` → `GA4 — owners_page_view` fires.
4. In GA4 → **Admin → DebugView**, confirm the events arrive in real time.

---

## Step 6 — Mark the key events (conversions) (~2 min)

In **GA4 → Admin → Events** (or **Key events**), toggle **`email_click`** as a
**Key event**. That makes rental + seller email clicks your headline conversion in
both GA4 and Looker Studio. (Optional: also mark `owners_page_view`.)

---

## Step 7 — Publish

GTM → **Submit** (top right) → version name `Initial analytics — 5 funnel events`
→ **Publish.** Done. Data starts flowing within minutes.

---

## What you end up with

```
Visitor → site (UTM from IG/YT/Substack)
        → GA4 page_view (auto, attributed by UTM)
        → analytics.js pushes named event to dataLayer
        → GTM trigger fires GA4 event
        → GA4 + Looker Studio
        → Lead Log (you log the off-site outcome by hand)
```

| Event | GA4 use | Dashboard section |
|-------|---------|-------------------|
| `email_click` (key event) | conversions | Tenant + Seller demand |
| `openings_click` | tenant interest | Tenant demand |
| `owners_page_view` | seller interest | Seller demand |
| `substack_click` | newsletter pull | Awareness strip |
| `youtube_click` | proof-library pull | Awareness strip |

Next: build the dashboard → [`../04-looker-studio/looker-studio-setup-guide.md`](../04-looker-studio/looker-studio-setup-guide.md).
