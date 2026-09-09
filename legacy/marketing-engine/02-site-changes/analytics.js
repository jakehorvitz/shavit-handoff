/* ============================================================
   Shavit Rootman — funnel event tracking (self-hosted, CSP-safe)

   Pushes the marketing spec's named events into the GTM dataLayer so GTM can
   forward them to GA4. No inline JS and no third-party origins, so it complies
   with script-src 'self'. It works purely by delegated click-listening +
   hash-route detection, so it needs ZERO changes to the React app bundle.

   Events (per 2026-06-11 marketing spec):
     • email_click      — any mailto: click (THE key event / conversion).
                          email_alias distinguishes funnels:
                          rentals+hillsdale@ → tenant, owners@ → seller, etc.
     • openings_click   — visitor lands on the Openings route (#openings)
     • owners_page_view — visitor lands on the seller funnel
                          (#contact with utm_campaign=owners, or #owners)
     • substack_click   — any link to *.substack.com
     • youtube_click    — any link to youtube.com / youtu.be

   GTM turns these dataLayer events into GA4 events of the same name via a
   "Custom Event" trigger per name (see analytics/GTM-GA4-setup-guide.md).
   ============================================================ */
(function () {
  window.dataLayer = window.dataLayer || [];

  function track(event, params) {
    var payload = { event: event };
    if (params) {
      for (var k in params) {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          payload[k] = params[k];
        }
      }
    }
    window.dataLayer.push(payload);
  }
  // Exposed so the /links hub page (and any future page) can fire events directly.
  window.srTrack = track;

  function closestAnchor(el) {
    while (el && el.nodeType === 1) {
      if (el.tagName === 'A') return el;
      el = el.parentNode;
    }
    return null;
  }

  /* ---- delegated click tracking (capture phase, fires before navigation) ---- */
  document.addEventListener('click', function (e) {
    // 1) explicit opt-in via data-ga-event="..." wins and short-circuits,
    //    so a tagged button never double-fires through the href patterns below.
    var node = e.target;
    var explicit = null;
    while (node && node.nodeType === 1) {
      if (node.getAttribute && node.getAttribute('data-ga-event')) { explicit = node; break; }
      node = node.parentNode;
    }
    if (explicit) {
      track(explicit.getAttribute('data-ga-event'), {
        link_campaign: explicit.getAttribute('data-ga-campaign'),
        link_market:   explicit.getAttribute('data-ga-market'),
        link_url:      explicit.getAttribute('href'),
      });
      return;
    }

    // 2) automatic patterns
    var a = closestAnchor(e.target);
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href.indexOf('mailto:') === 0) {
      var addr = href.slice(7).split('?')[0];
      track('email_click', { email_to: addr, email_alias: addr.split('@')[0] || '' });
    } else if (/substack\.com/i.test(href)) {
      track('substack_click', { link_url: href });
    } else if (/youtube\.com|youtu\.be/i.test(href)) {
      track('youtube_click', { link_url: href });
    } else if (/linkedin\.com/i.test(href)) {
      track('linkedin_click', { link_url: href });
    }
  }, true);

  /* ---- hash-route events for the single-page React app ---- */
  function routeEvent() {
    var route = (window.location.hash || '').replace('#', '').split('?')[0];
    var search = window.location.search || '';
    if (route === 'openings') {
      track('openings_click', { route: 'openings' });
    }
    if (route === 'owners' || (route === 'contact' && /utm_campaign=owners/i.test(search))) {
      track('owners_page_view', { route: route });
    }
  }
  window.addEventListener('hashchange', routeEvent);
  if (document.readyState !== 'loading') routeEvent();
  else document.addEventListener('DOMContentLoaded', routeEvent);
})();
