// submit-lead — Supabase Edge Function behind the Charger Realty Management contact form.
// Flow: CORS preflight -> honeypot -> validate -> Turnstile verify -> per-IP rate limit
//       -> insert (service_role) -> notify via Resend. Fails closed; never leaks internals.

const ALLOWED_ORIGINS = (Deno.env.get('ALLOWED_ORIGINS') || 'https://shavitrootman.com,https://www.shavitrootman.com')
  .split(',').map((o) => o.trim()).filter(Boolean)

function corsHeaders(origin: string | null) {
  // Reflect the request origin only if it's allow-listed; otherwise fall back to the
  // canonical production origin (so a disallowed cross-origin browser call is blocked by CORS).
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

type LeadPayload = {
  name?: string
  email?: string
  phone?: string
  message?: string
  company?: string
  turnstileToken?: string
}

// Strip angle brackets AND control chars (newlines/tabs) so nothing can pad/spoof the
// email subject or inject into logs; trim + cap length.
const clean = (value: unknown, max = 2000) =>
  String(value ?? '').replace(/[<>]/g, '').replace(/[\r\n\t\f\v]+/g, ' ').trim().slice(0, max)

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

async function verifyTurnstile(token: string, ip: string | null) {
  const secret = Deno.env.get('TURNSTILE_SECRET_KEY')
  if (!secret) return false // fail closed
  const body = new FormData()
  body.set('secret', secret)
  body.set('response', token)
  if (ip) body.set('remoteip', ip)
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  })
  const result = await response.json().catch(() => ({ success: false }))
  return Boolean(result.success)
}

const SB_URL = () => Deno.env.get('SUPABASE_URL')
const SB_KEY = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Per-IP throttle: count recent inserts from this IP; block if over the window limit.
// Uses the leads table itself (no extra table); index on (ip, created_at) keeps it cheap.
async function overRateLimit(ip: string | null, maxPerWindow = 5, windowSeconds = 60) {
  if (!ip) return false
  const url = SB_URL(), key = SB_KEY()
  if (!url || !key) throw new Error('supabase-not-configured')
  const since = new Date(Date.now() - windowSeconds * 1000).toISOString()
  const q = `${url}/rest/v1/leads?select=id&ip=eq.${encodeURIComponent(ip)}&created_at=gte.${encodeURIComponent(since)}`
  const res = await fetch(q, {
    headers: { apikey: key, authorization: `Bearer ${key}`, Prefer: 'count=exact' },
  })
  if (!res.ok) throw new Error('rate-check-failed')
  // PostgREST returns the count in Content-Range: e.g. "0-4/5"
  const range = res.headers.get('content-range') || ''
  const total = Number(range.split('/')[1] || '0')
  return total >= maxPerWindow
}

async function insertLead(p: { name: string; email: string; phone: string; message: string }, ip: string | null, userAgent: string | null) {
  const url = SB_URL(), key = SB_KEY()
  if (!url || !key) throw new Error('supabase-not-configured')
  const response = await fetch(`${url}/rest/v1/leads`, {
    method: 'POST',
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      name: p.name,
      email: p.email,
      phone: p.phone || null,
      message: p.message,
      ip,
      user_agent: userAgent,
    }),
  })
  if (!response.ok) throw new Error(`insert-failed:${response.status}`)
}

async function sendEmail(p: { name: string; email: string; phone: string; message: string }) {
  const key = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('RESEND_FROM')
  // LEAD_NOTIFY_TO may be a comma-separated list; Resend accepts an array of recipients.
  const to = (Deno.env.get('LEAD_NOTIFY_TO') || 'info@shavitrootman.com')
    .split(',').map((s) => s.trim()).filter(Boolean)
  if (!key || !from) throw new Error('resend-not-configured')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to,
      reply_to: p.email,
      subject: `New Charger Realty Management inquiry from ${p.name}`,
      text: [
        `Name: ${p.name}`,
        `Email: ${p.email}`,
        `Phone: ${p.phone || 'Not provided'}`,
        '',
        p.message,
      ].join('\n'),
    }),
  })
  if (!response.ok) throw new Error(`resend-failed:${response.status}`)
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin')
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, origin)

  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
  const userAgent = request.headers.get('user-agent')

  try {
    const raw = (await request.json().catch(() => ({}))) as LeadPayload

    // Honeypot: silently accept (don't tip off bots) but do nothing.
    if (clean(raw.company, 200)) return json({ ok: true }, 200, origin)

    const payload = {
      name: clean(raw.name, 120),
      email: clean(raw.email, 254).toLowerCase(),
      phone: clean(raw.phone, 80),
      message: clean(raw.message, 3000),
      turnstileToken: clean(raw.turnstileToken, 2048),
    }

    if (!payload.name || !payload.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return json({ error: 'Please provide a valid name, email, and message.' }, 400, origin)
    }
    if (!(await verifyTurnstile(payload.turnstileToken, ip))) {
      return json({ error: 'Verification failed. Please try again.' }, 400, origin)
    }
    if (await overRateLimit(ip)) {
      return json({ error: 'Too many submissions. Please try again in a minute.' }, 429, origin)
    }

    // Saving the lead is the source of truth. If the notification email fails,
    // the lead is still captured — treat it as success and log the email failure.
    await insertLead(payload, ip, userAgent)
    try {
      await sendEmail(payload)
    } catch (mailErr) {
      console.error('lead saved but email notification failed:', String(mailErr))
    }

    return json({ ok: true }, 200, origin)
  } catch (err) {
    // Never leak internal/provider error text to the client.
    console.error('submit-lead error:', String(err))
    return json({ error: 'Unable to submit right now. Please email info@shavitrootman.com.' }, 500, origin)
  }
})
