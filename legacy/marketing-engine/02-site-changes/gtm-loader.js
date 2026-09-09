/* ============================================================
   Shavit Rootman — Google Tag Manager loader (self-hosted, CSP-safe)

   WHY THIS FILE EXISTS:
   The standard GTM install is an INLINE <script> in <head>. This site runs a
   strict Content-Security-Policy ( script-src 'self', NO 'unsafe-inline' ),
   which BLOCKS inline scripts. Serving the exact same GTM bootstrap from this
   same-origin file keeps the policy locked down: this file is 'self', and the
   only third-party it pulls is gtm.js from https://www.googletagmanager.com,
   which the CSP now explicitly allows in script-src.

   ────────────────────────────────────────────────────────────
   >>> JAKE — DO THIS:
   Replace  GTM-XXXXXXX  on the last line with your real GTM container ID.
   Find it at:  tagmanager.google.com → your container → top bar (GTM-XXXXXXX).
   That's the ONLY edit needed in this file.
   ────────────────────────────────────────────────────────────

   NOTE: the usual GTM <noscript> iframe fallback is intentionally OMITTED —
   it loads an iframe from googletagmanager.com, which the site's
   `frame-src 'none'` policy blocks (and the spec says do NOT loosen frame-src).
   The site requires JavaScript to render anyway, so the fallback is moot.
   ============================================================ */
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-XXXXXXX'); // <-- replace GTM-XXXXXXX
