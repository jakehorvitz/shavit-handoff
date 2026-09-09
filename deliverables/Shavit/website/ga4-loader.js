/* ============================================================
   Shavit Rootman — DIRECT GA4 loader (self-hosted, CSP-safe)  [OPTIONAL]

   ⚠️  USE EITHER GTM OR THIS — NOT BOTH.
   Recommended path = GTM (gtm-loader.js), with GA4 configured INSIDE GTM as a
   "Google Tag" (GA4 Configuration). That keeps one container and avoids
   double-counting. This file is the fallback if Jake ever wants GA4 alone with
   no GTM. If you enable this, do NOT also load gtm-loader.js, or every pageview
   and event will be counted twice.

   Like gtm-loader.js, this exists as a same-origin file because the strict CSP
   (script-src 'self', no 'unsafe-inline') blocks the inline gtag snippet. The
   gtag.js it injects comes from https://www.googletagmanager.com, already
   allowed in script-src.

   ────────────────────────────────────────────────────────────
   >>> JAKE — IF you use this file instead of GTM:
   1. In index.html, comment out  <script src="gtm-loader.js"></script>
      and uncomment  <script src="ga4-loader.js"></script>.
   2. Replace  G-XXXXXXXXXX  below with your real GA4 Measurement ID.
      Find it at: analytics.google.com → Admin → Data streams → your web
      stream → "Measurement ID" (format G-XXXXXXXXXX).
   3. analytics.js still works as-is: it pushes the same named events, and
      gtag() picks them up off the shared dataLayer.
   ────────────────────────────────────────────────────────────
   ============================================================ */
(function (d, id) {
  var s = d.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  d.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id);
})(document, 'G-XXXXXXXXXX'); // <-- replace G-XXXXXXXXXX (GA4 Measurement ID)
