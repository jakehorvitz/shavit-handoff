# shavitrootman.com — Launch Setup Guide

The site is **built and verified** (Lighthouse 100/100/100). To take it live it needs 4 free
accounts. This guide is click-by-click. Do the steps **in order** — each one produces a value the
next step (or I) will need.

**How keys work here (important):**
- Values marked **🔵 SEND TO JAKE'S AI** are safe to share with me — they're public by design
  (they ship in the browser and are protected by other layers).
- Values marked **🔴 KEEP SECRET** you paste **only** into Supabase/Netlify dashboards. Never send
  these to me, never put them anywhere else. I built the code so these live server-side only.

Total time: ~30–40 minutes. You can stop after any step and resume later.

---

## Step 1 — Supabase (the lead database + form backend)

1. Go to **https://supabase.com** → **Start your project** → sign in with GitHub or email.
2. **New project.** Name it `charger-realty` (or anything). Pick a strong DB password (save it in
   your password manager — you won't need to type it again). Region: **East US** (closest to
   Midwest/East traffic). Click **Create new project** and wait ~2 min for it to provision.
3. **Get the two API values.** Left sidebar → **Project Settings** (gear) → **API**. Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`) → **🔵 SEND TO JAKE'S AI**
   - **`anon` `public` key** (a long string under "Project API keys") → **🔵 SEND TO JAKE'S AI**
   - **`service_role` `secret` key** (same page, click "reveal") → **🔴 KEEP SECRET** (you'll paste
     it in Step 5, into Supabase itself)
4. **Create the leads table.** Left sidebar → **SQL Editor** → **New query**. Open the file
   `site/supabase/schema.sql` from the project, paste its entire contents, click **Run**. You
   should see "Success. No rows returned." (This creates the `leads` table with security locked
   down so nobody can read submissions except the form backend.)

---

## Step 2 — Resend (emails you each new lead)

1. Go to **https://resend.com** → **Sign up** (free tier = 3,000 emails/mo, plenty).
2. **Verify your sending domain.** Dashboard → **Domains** → **Add Domain** → enter
   `shavitrootman.com`. Resend shows you a few **DNS records (TXT/MX for sending)** to add.
   - ⚠️ These go in **Squarespace DNS** and are **email-sending records** — they do NOT affect your
     existing inbound `info@` email. Add them exactly as shown. (If you'd rather not touch DNS yet,
     you can skip domain verification and use Resend's test sender for staging — tell me and I'll
     set that.)
3. **API key.** Dashboard → **API Keys** → **Create API Key** → name it `charger-site`, permission
   "Sending access". Copy the key (starts with `re_`) → **🔴 KEEP SECRET** (paste in Step 5).
4. Decide the **"from" address** — e.g. `leads@shavitrootman.com`. Tell me this address; the site
   emails you (info@shavitrootman.com) from it on each submission.

---

## Step 3 — Cloudflare Turnstile (invisible bot protection on the form)

1. Go to **https://dash.cloudflare.com** → sign up (free). You do **not** need to move your domain
   to Cloudflare — Turnstile is a standalone widget.
2. Left sidebar → **Turnstile** → **Add site**.
   - Site name: `Charger Realty`
   - Domain: `shavitrootman.com` (and add `localhost` too, for testing)
   - Widget mode: **Managed** (default)
3. Click **Create**. You get two keys:
   - **Site Key** (starts `0x4AAA…`) → **🔵 SEND TO JAKE'S AI**
   - **Secret Key** → **🔴 KEEP SECRET** (paste in Step 5)

---

## Step 4 — Netlify (hosting)

1. Go to **https://netlify.com** → **Sign up** (free) with GitHub or email.
2. Easiest path: tell me your Netlify account is created and I'll walk you through connecting this
   project (either a drag-and-drop deploy of the built folder, or connecting a Git repo — your
   call). You don't need to configure anything technical here yet.
3. When we deploy, Netlify gives a free staging URL like `charger-realty.netlify.app` — that's what
   you + Shavit review **before** we touch the real domain.

---

## Step 5 — Deploy the form backend (Supabase Edge Function)

This is where the **🔴 secret** keys go — all into Supabase, never to me.

1. In Supabase → left sidebar → **Edge Functions** → **Create a function** → name it exactly
   `submit-lead`.
2. Paste the entire contents of `site/supabase/functions/submit-lead/index.ts` into the editor →
   **Deploy**.
3. Set its secrets: Edge Functions → **Manage secrets** (or Project Settings → Edge Functions) →
   add these environment variables:
   - `SUPABASE_URL` = your Project URL (from Step 1)
   - `SUPABASE_SERVICE_ROLE_KEY` = 🔴 service_role key (Step 1)
   - `RESEND_API_KEY` = 🔴 Resend key (Step 2)
   - `RESEND_FROM` = your from-address, e.g. `leads@shavitrootman.com` (Step 2)
   - `LEAD_NOTIFY_TO` = `info@shavitrootman.com`
   - `TURNSTILE_SECRET_KEY` = 🔴 Turnstile secret (Step 3)
   - `ALLOWED_ORIGINS` = `https://shavitrootman.com,https://www.shavitrootman.com` (I'll add the
     staging netlify.app URL here too during testing)
4. Copy the function's **URL** (shown after deploy, like
   `https://abcdefgh.supabase.co/functions/v1/submit-lead`) → **🔵 SEND TO JAKE'S AI**

---

## What to send me when you're done

Paste me these **🔵 client-safe** values (a quick list is fine):

```
Supabase Project URL:        https://__________.supabase.co
Supabase anon key:           ey__________
Turnstile Site Key:          0x4AAA__________
Edge Function URL:           https://__________.supabase.co/functions/v1/submit-lead
Resend "from" address:       leads@shavitrootman.com
Netlify:                     "account created" (I'll guide the connect)
```

I plug those into the site's build config, deploy to the staging URL, and we do a **real test
submission** together (a test lead should land in your inbox). Only after staging checks out do we
touch the live domain.

---

## After staging passes — the DNS cutover (I'll hand you exact records)

When you + Shavit approve staging, the go-live is a careful, **email-safe** DNS change in Squarespace.
You'll paste 2 records I give you; **we never touch your MX / email records**, so `info@` keeps
working the whole time. The full checklist (lower TTL first, apex ALIAS → Netlify, 3 email tests
after, keep the old WordPress site up 48h as rollback) is already written in `SPEC.html §7`. I'll
walk you through it live when we get there.

*Questions on any step? Ask me — I'll clarify or adjust (e.g., skip Resend domain verification for
staging).*
