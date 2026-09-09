// data.js — shared brand, contact, media, and SEO constants for the
// tenant-facing inventory hub.

export const SITE_URL = 'https://shavitrootman.com'
export const BRAND = 'Shavit Rootman'
export const SUBLINE = 'Managed by Charger Property Management'

export const CONTACT = {
  phone: '+1 (805) 364-4415',
  phoneHref: 'tel:+18053644415',
  smsHref: 'sms:+18053644415',
  // Single inbox per Shavit 7/14 — per-person business emails explicitly
  // deferred to a future meeting ("let's pause with this").
  // 8/16 text: "Can we get info@chargerpropertymanagement.com?" — swapped from
  // chargerpropertymanagement@gmail.com on Jake's go. Jake owns the domain;
  // the mailbox/forwarder is his to stand up (whois showed no registration
  // on 8/16 11:05, so verify a test email round-trips).
  email: 'info@chargerpropertymanagement.com',
  emailHref: 'mailto:info@chargerpropertymanagement.com',
  ig: '@shavitness',
  igHref: 'https://instagram.com/shavitness',
  li: '/in/shavitrootman',
  liHref: 'https://linkedin.com/in/shavitrootman',
  linkedIn: 'https://linkedin.com/in/shavitrootman',
  instagram: 'https://instagram.com/shavitness',
}

export function res(id, url) {
  return (typeof window !== 'undefined' && window.__resources && window.__resources[id]) || url
}

export const HERO_VIDEO = '/assets/hero.mp4'

export const SHAVIT_PHOTOS = {
  portrait: res('portrait', '/assets/shavit-portrait.png'),
  portraitLI: res('portraitLI', '/assets/photos/06_shavit_portrait.jpeg'),
  banner: '/assets/people/banner.jpg',
}

// `title`/`description` are the SEO pair Google reads. `shareTitle`/
// `shareDescription` are what a person sees when the link is pasted into a
// text or a DM; they fall back to the SEO pair when unset. The two are split
// because Shavit's 7/19 and 7/26 texts are both about the *share card* ("when
// I share Shavitrootman.com ... it shows available midwest rentals", "was it
// changed again to CPM?") while the 7/23 branded-SEO pass needs the exact-match
// "Charger Property Management" string to stay in <title>.
export const pages = {
  '/': {
    // Branded-SEO audit 7/23: lead with both exact-match brand strings — the
    // home title is the strongest signal for the "charger property management"
    // query. Mirrors the footer's existing brand pattern.
    title: 'Shavit Rootman | Charger Property Management',
    description: 'Every Shavit Rootman rental in one place: available now and coming soon across Michigan, Ohio, and Indiana, managed by Charger Property Management.',
    // Shavit 7/19: the shared link should lead with the mission, not the
    // inventory ("Maybe instead, Building Communities in the Midwest"). He
    // signed off on the "investing" phrasing in that same thread.
    shareTitle: 'Shavit Rootman | Investing in Midwest Communities',
    shareDescription: 'Investing in Midwest communities. Rental homes revitalized and operated across Michigan, Ohio, and Indiana.',
  },
  '/meet': {
    title: 'Meet Shavit Rootman | Real Estate, Operated',
    description: 'Meet Shavit Rootman, the operator behind a growing Midwest rental portfolio managed by Charger Property Management.',
  },
  '/accessibility': {
    title: 'Accessibility | Shavit Rootman',
    description: 'Accessibility commitment and contact options for shavitrootman.com visitors.',
  },
  // Shavit 8/31: "Can you remove the # from the name on URL?" — he screenshotted
  // shavitrootman.com/#case-studies. This is the real path that replaces it, and
  // it is the URL the approved teaser reel says out loud (ShavitRootman.com/casestudies).
  // canonical points at '/' on purpose: the route renders the SAME homepage
  // markup, so a self-canonical would publish a duplicate home page and split
  // ranking signal. Consolidating on '/' keeps the shareable URL working for
  // humans with zero duplicate-content cost. Kept OUT of sitemap.xml for the
  // same reason — a sitemap should list canonical URLs only.
  '/case-studies': {
    title: 'Deal Case Studies | Shavit Rootman',
    description: 'Full-cycle deal case studies: acquisition, renovation, appraisal, and lessons learned on Shavit Rootman projects in Michigan, Ohio, and Indiana.',
    shareTitle: 'Deal Case Studies | Shavit Rootman',
    shareDescription: 'How each project actually went: what it cost, what it appraised for, and what we learned.',
    canonical: '/',
  },
}

// Homepage sections that also answer on a clean path instead of a #hash.
// path -> id of the section element to scroll to. Adding an entry here wires
// the route, the nav highlight, and the scroll behaviour in one place.
export const SECTION_ROUTES = {
  '/case-studies': 'case-studies',
}
