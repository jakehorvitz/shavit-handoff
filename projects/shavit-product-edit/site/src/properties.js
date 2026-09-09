// properties.js — unit inventory per the 7/14 revision spec (site/docs/spec-714.html, v6).
// Source of truth: Shavit's 7/13 text (structured coming-soon list) + the 7/14 call,
// verified against both in the bones stage-3/4 audit. Where the call and his texts
// disagreed, the WRITTEN text won (e.g. the Trio is 6 units Coming Soon, not
// "all available" as said verbally).
//
// SCOPE RULE — unchanged from 7/8: only available / coming-soon / lease-signed
// units belong here. No portfolio dumps, no holding-company structure. Shavit 7/14:
// "you have exposed my entire portfolio... How about I just tell you what's available."
//
// FIELD RULES:
// - zip: ONLY zips Shavit confirmed in writing (his 7/13 text). Never invented.
// - sqft: null until Shavit provides ("Don't rely on Zillow too much" — he sends them).
// - availableDate: e.g. 'September 2026' — null until Shavit provides.
// - illustration: true = card shows a previous-project photo + the legal star
//   ("Picture is for illustration only, from our previous projects.")
// - zillow: Apply destination. Address-search URL lands on the listing when live
//   and on a Zillow search otherwise, so Apply never dead-ends (spec §7 fallback).

export const STATES = [
  { code: 'MI', id: 'michigan', label: 'Michigan', kicker: 'Hillsdale, Michigan', emptyCopy: null },
  { code: 'OH', id: 'ohio', label: 'Ohio', kicker: 'Cleveland, Ohio', emptyCopy: 'We currently do not have any available properties in Ohio. Every unit is leased. Keep checking back, and new homes are posted here as they open.' },
  { code: 'IN', id: 'indiana', label: 'Indiana', kicker: 'South Bend, Indiana', emptyCopy: null },
]

// Interior/exterior gallery, files at public/assets/properties/<slug>/01.jpg..NN.jpg
const gallery = (slug, n) =>
  Array.from({ length: n }, (_, i) => `/assets/properties/${slug}/${String(i + 1).padStart(2, '0')}.jpg`)

// Explicit list when Jake faded a middle photo (gallery() only counts 01..n).
const pick = (slug, nums) => nums.map((n) => `/assets/properties/${slug}/${n}.jpg`)

const zillowFor = (addr) =>
  `https://www.zillow.com/homes/${encodeURIComponent(addr.replace(/[.,]/g, '').replace(/\s+/g, '-'))}_rb/`

export const PROPERTIES = [
  // ---------- MICHIGAN · Hillsdale ----------
  {
    id: 'budlong-a',
    state: 'MI',
    status: 'available',
    name: '34 Budlong St',
    unit: 'Unit A',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP (Jake 7/14: fill missing zips)
    type: 'Apartment', // Shavit 7/14: "it's not a single family, it's apartment"
    beds: 3,
    baths: 1,
    // Shavit 8/4 text headed "Corrections:" — "34 Budlong 1,300 sqft,
    // $1,600/month". Supersedes the 850 sq ft from his 7/16 email §2.
    sqft: 1300,
    availableDate: 'September 2026', // Shavit 7/17 text: "34 Budlong St, Unit A ... (September 2026)"
    rent: '$1,600/mo', // Shavit 8/4 "Corrections:" text
    line: 'Near downtown Hillsdale, everything new inside.',
    photo: '/assets/listings/budlong-street.jpg',
    photos: gallery('budlong-street', 10),
    illustration: false,
    // Jake confirmed 7/23 via the Zillow-links tracking sheet: real listing URL,
    // overrides the address-search fallback (same pattern as barry-a/oak-b).
    zillow: 'https://www.zillow.com/homedetails/34-Budlong-St-Hillsdale-MI-49242/222367430_zpid/',
    manager: 'Managed by Charger Property Management',
  },
  // --- 11½ E St Joe St (id stjoe-half) REMOVED 8/9 on Shavit's instruction, in
  //     the same text that leased Unit 2: "Unit 1/2 you can remove." It had been
  //     a coming-soon one-bed from his 7/22 walkthrough ("we do have 11 and a
  //     half, East Saint Joe ... October 2026"). Do NOT restore it from those
  //     walkthrough notes — the 8/9 text supersedes them. ---
  // --- 11 E Saint Joe St, Unit 2: NEW available unit from Shavit's 8/4 texts
  //     ("Another Hillsdale available unit. 11 E Saint Joe, unit 2 - 2 bedroom" /
  //     "2 bedroom, one bath / Available September 1st") plus the real
  //     homedetails link he sent in the same thread. A DIFFERENT building from
  //     15 E St Joe (stjoe-a/b) and from 11½ E St Joe (stjoe-half).
  //     CONFIRM: sq ft, and the listing photos — Shavit asked for the Zillow
  //     photos to be used so the illustration star could come off; those images
  //     are not ours to copy, so the star stays until he sends the originals. ---
  {
    id: 'stjoe-11-2',
    state: 'MI',
    // Shavit 8/9 text: "11 E Saint Joe - lease signed on unit two." Leased four
    // days after he sent it over as available, so availableDate and rent below
    // are retired with it — a leased unit advertises neither.
    status: 'lease-signed',
    name: '11 E St Joe St',
    unit: 'Unit 2',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP — confirmed by the Zillow URL slug he sent
    type: 'Apartment',
    beds: 2, // Shavit 8/4: "2 bedroom, one bath"
    baths: 1,
    // 700 per his live Zillow listing — the SAME unit-specific rental page that
    // supplied the rent below, and it matched his texted 2bd/1ba exactly.
    // Trusting that page for rent but not for size would be inconsistent.
    // This is the ONE place Zillow is authoritative: a live listing for THIS
    // unit. His other Zillow pages are whole-building or public-record.
    sqft: 700,
    availableDate: null, // was 'September 1, 2026'; leased 8/9 before that date
    // rent removed 8/9 — leased. ($1,200/mo came off his live Zillow listing,
    // per the 8/4 call: "Prices, do you want me to put the Zillow price?" — "Yes.")
    line: 'Two-bedroom in downtown Hillsdale.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen until Shavit sends the real set
    photos: null,
    illustration: true,
    zillow: 'https://www.zillow.com/homedetails/11-E-Saint-Joe-St-2-Hillsdale-MI-49242/460072026_zpid/?view=public',
    manager: 'Managed by Charger Property Management',
  },
  // --- The Trio: 115 Oak / 33 Barry / 11 Ludlam, Unit A+B each, ALL Coming Soon.
  //     Per Shavit's 7/13 TEXT (verbatim, incl. beds/baths + Oak A's August finish).
  //     The call's "the Trio, all available" was loose phrasing — text wins. ---
  {
    id: 'oak-a',
    state: 'MI',
    status: 'lease-signed', // Shavit 7/16 email §5 "115 Oak St, Unit A: lease signed" (+§1 "taken")
    name: '115 Oak St',
    unit: 'Unit A',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // confirmed in Shavit's 7/13 text
    type: 'Apartment',
    beds: 2,
    baths: 1,
    sqft: 981, // Shavit 7/16 email §2
    availableDate: null,
    eta: null, // was 'August 2026' when coming-soon; now leased
    line: 'Open floor concept, recessed lighting, mini-splits throughout.',
    // Shavit's real "Hall, 115 Oak" interior, AI-cleaned of the table-saw/debris (email §1).
    photo: '/assets/listings/oak-a-hall.jpg',
    photos: null,
    illustration: false, // real photo of this unit — no disclaimer star
    zillow: zillowFor('115 Oak St Hillsdale MI 49242'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'oak-b',
    state: 'MI',
    status: 'lease-signed', // Shavit via Jake 8/7: "115 oak unit b is now signed, so it's unavailable"
    name: '115 Oak St',
    unit: 'Unit B',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 450, // Shavit 7/16 email §2
    availableDate: null,
    eta: null, // was 'Mid August 2026' when coming-soon; now leased
    // rent removed 8/7 — leased. ($1,200/mo was Shavit's 8/4 "Corrections:" text.)
    line: 'Full rebuild finishing now in downtown Hillsdale.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until shot
    photos: null,
    illustration: true, // generic kitchen, not this unit — keep the disclaimer star
    // Shavit 7/21 text: "115 Oak unit #2" + specific Zillow listing (overrides
    // address-search fallback — matches Shavit's ask that Apply lands on the
    // real listing, not a generic search).
    zillow: 'https://www.zillow.com/homedetails/115-Oak-St-2-Hillsdale-MI-49242/464036363_zpid/?view=public',
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'barry-a',
    state: 'MI',
    status: 'coming-soon',
    name: '33 Barry St',
    unit: 'Unit A',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 800, // Shavit 7/22 walkthrough: "it's 800 square foot" (33 Barry, Unit A)
    availableDate: null,
    eta: 'Mid August 2026', // Shavit 7/17 text: "33 Barry Street, Unit A ... (Mid August, 2026)"
    rent: '$1,250/mo', // Shavit 7/20 text: "feel free to add $1,250 a month" (33 Barry, Unit 1)
    line: 'Hillsdale rebuild opening soon, finished to a new standard.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until the shoot
    photos: null,
    illustration: true, // generic kitchen + star until the real shoot (spec §4)
    // Shavit 7/20 text: specific Zillow listing for 33 Barry, Unit 1 (overrides address-search fallback)
    zillow: 'https://www.zillow.com/homedetails/33-Barry-St-1-Hillsdale-MI-49242/461097551_zpid/',
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'barry-b',
    state: 'MI',
    status: 'coming-soon',
    name: '33 Barry St',
    unit: 'Unit B',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 450, // Shavit 7/22 walkthrough: "this one is also 450" (33 Barry, Unit B)
    availableDate: null,
    eta: 'October 2026', // Shavit 7/17 text: "33 Barry Street, Unit B ... (October, 2026)"
    rent: '$1,200/mo', // Shavit 8/4 "Corrections:" text — "33 Barry, Unit B - $1,200"
    line: 'Hillsdale rebuild opening soon, finished to a new standard.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until the shoot
    photos: null,
    illustration: true,
    zillow: zillowFor('33 Barry St Hillsdale MI 49242'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'ludlam-a',
    state: 'MI',
    status: 'coming-soon',
    name: '11 Ludlam St',
    unit: 'Unit A',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 800, // Shavit 7/16 email §2
    availableDate: null,
    eta: 'Mid September 2026', // Shavit 7/17 text: "11 Ludlam Street, Unit A ... (Mid September, 2026)"
    rent: '$1,000/mo', // Shavit 8/4 "Corrections:" text — "11 Ludlam Unit A - $1,000"
    line: 'Hillsdale rebuild opening soon, finished to a new standard.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until the shoot
    photos: null,
    illustration: true,
    zillow: zillowFor('11 Ludlam St Hillsdale MI 49242'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'ludlam-b',
    state: 'MI',
    status: 'coming-soon',
    name: '11 Ludlam St',
    unit: 'Unit B',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242',
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 800, // Shavit 7/16 email §2
    availableDate: null,
    eta: 'October 2026', // Shavit 7/17 text: "11 Ludlam Street, Unit B ... (October, 2026)"
    rent: '$1,300/mo', // Shavit 8/4 "Corrections:" text — "11 Ludlam Unit B - $1,300"
    line: 'Hillsdale rebuild opening soon, finished to a new standard.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until the shoot
    photos: null,
    illustration: true,
    zillow: zillowFor('11 Ludlam St Hillsdale MI 49242'),
    manager: 'Managed by Charger Property Management',
  },
  // --- 1114 Cedar: Shavit's 7/14 text says "1114 Cedar, Niles, MI" — Michigan,
  //     overriding the call's "Indiana" grouping. Jake 7/14: "wire it up as
  //     michigan and I'll confirm it." Flip state to IN only if Shavit corrects. ---
  {
    id: 'cedar-1114',
    // Shavit 7/15 TEXT: "Michigan Niles falls under Indiana." He groups Niles
    // under his Indiana operation, so the CARD lists under Indiana while the
    // printed address stays factually Niles, MI (addrState) — Niles is in MI.
    state: 'IN',
    addrState: 'MI',
    // Shavit 7/27, replying to a screenshot of this exact Indiana section:
    // "Lease signed for Cedar." It was still reading Coming Soon.
    status: 'lease-signed',
    name: '1114 Cedar St',
    unit: null,
    locale: 'Niles',
    stateName: 'Michigan',
    zip: '49120', // Niles, MI city ZIP
    type: 'Single Family',
    beds: 4, // Shavit 7/16 email §3
    baths: 2, // Shavit 7/16 email §3
    sqft: 1844, // Shavit 7/16 email §2
    availableDate: null,
    eta: null,
    line: 'Single-family rebuild finishing now in Niles.',
    // Jake faded the Cedar gallery but chose ONE exterior (7/14): shot 06, the
    // front three-quarter view. Plain photo, NO blurred side bars (Jake 7/15).
    // The 1:1 card crops center; the whole house stays in frame. No gallery.
    photo: '/assets/properties/cedar-street/06.jpg',
    photos: null,
    illustration: false,
    zillow: zillowFor('1114 Cedar St Niles MI'),
    manager: 'Managed by Charger Property Management',
  },
  // --- Lease Signed (still shown, clearly unavailable — bold status, no stamp) ---
  {
    id: 'howder-a',
    state: 'MI',
    status: 'lease-signed',
    name: '43 Howder St',
    unit: 'Unit A',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP
    type: 'Apartment', // per Shavit: unit A + unit B, "instead of writing duplex"
    beds: 3,
    baths: 2, // Shavit's own 7/15 Howder write-up: \"3-bedroom, 2-bath unit\"
    sqft: 1100, // Shavit 7/16 email §2
    availableDate: null,
    line: 'Two homes, one rebuild. This one is spoken for.',
    // Professional finished-renovation shoot from Shavit's Drive (June 3);
    // both Howder units share the building gallery. Verified 7/14.
    photo: '/assets/properties/howder-street/01.jpg', // front exterior (Jake's front-facing pick can change this)
    photos: pick('howder-street', ['01', '03', '04', '05', '06', '07', '08']),
    illustration: false,
    zillow: zillowFor('43 Howder St Hillsdale MI'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'howder-b',
    state: 'MI',
    status: 'lease-signed',
    name: '43 Howder St',
    unit: 'Unit B',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP
    type: 'Apartment',
    beds: 1,
    baths: 1,
    sqft: 500, // Shavit 7/16 email §2
    availableDate: null,
    line: 'Two homes, one rebuild. This one is spoken for.',
    photo: '/assets/properties/howder-street/01.jpg', // front exterior (Jake's front-facing pick can change this)
    photos: pick('howder-street', ['01', '03', '04', '05', '06', '07', '08']),
    illustration: false,
    zillow: zillowFor('43 Howder St Hillsdale MI'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'stjoe-a',
    state: 'MI',
    status: 'lease-signed',
    name: '15 E St Joe St',
    unit: 'Unit A',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP
    type: 'Apartment',
    beds: 2, // Shavit 7/16 email §3
    baths: 1.5, // Shavit 7/16 email §3
    sqft: 910, // Shavit 7/16 email §2
    availableDate: null,
    line: 'Hillsdale rebuild, leased before it hit the market.',
    // "After" set from Shavit's Drive (white duplex, twin doors); both St Joe
    // units share the building gallery. Verified 7/14.
    photo: '/assets/properties/saint-joe/03.jpg', // interior lead: the wide exterior cannot fit a square without crop or blur bars (Jake bans both); outpaint pending approval. Exterior stays first in the gallery.
    photos: gallery('saint-joe', 7),
    illustration: false,
    zillow: zillowFor('15 E St Joe St Hillsdale MI'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'stjoe-b',
    state: 'MI',
    status: 'lease-signed',
    name: '15 E St Joe St',
    unit: 'Unit B',
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP
    type: 'Apartment',
    beds: 2, // Shavit 7/16 email §3
    baths: 1, // Shavit 7/16 email §3 (Unit B: 2bd / 1.0ba)
    sqft: 910, // Shavit 7/16 email §2
    availableDate: null,
    line: 'Hillsdale rebuild, leased before it hit the market.',
    photo: '/assets/properties/saint-joe/03.jpg', // interior lead: the wide exterior cannot fit a square without crop or blur bars (Jake bans both); outpaint pending approval. Exterior stays first in the gallery.
    photos: gallery('saint-joe', 7),
    illustration: false,
    zillow: zillowFor('15 E St Joe St Hillsdale MI'),
    manager: 'Managed by Charger Property Management',
  },
  {
    id: 'norwood-60',
    state: 'MI',
    status: 'lease-signed',
    name: '60 S Norwood Ave',
    unit: null,
    locale: 'Hillsdale',
    stateName: 'Michigan',
    zip: '49242', // Hillsdale, MI city ZIP
    type: 'Single Family',
    beds: 3,
    baths: 2,
    sqft: 1046, // Shavit 7/16 email §2
    availableDate: null,
    line: 'A Hillsdale house finished to a new standard, already taken.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until shot
    photos: null,
    illustration: true, // generic kitchen, not this unit — keep the disclaimer star
    zillow: zillowFor('60 S Norwood Ave Hillsdale MI'),
    manager: 'Managed by Charger Property Management',
  },

  // ---------- OHIO: OUT OF STOCK. Shavit 7/13 text, verbatim: "Nothing available /
  //            Nothing coming soon." Section renders STATES[ohio].emptyCopy.
  //            No OH listings, no OH photos. Buckingham -> Deal Case Study #1. ----------

  // ---------- INDIANA · South Bend ----------
  {
    id: 'ewing-1902',
    state: 'IN',
    status: 'coming-soon',
    name: '1902 East Ewing Ave',
    unit: null,
    locale: 'South Bend',
    stateName: 'Indiana',
    zip: '46613', // confirmed in Shavit's 7/13 text
    type: 'Single Family',
    beds: 4, // Shavit 7/17 text: "1902 Ewing Ave, South Bend - 4 bedroom 2 bath" (corrects the 3bd public-record guess)
    baths: 2, // Shavit 7/17 text: "4 bedroom 2 bath"
    sqft: 1704, // Shavit 7/16 email §2
    availableDate: null,
    eta: 'October 2026', // Shavit 7/17 text: "1902 Ewing Ave, South Bend ... (October 2026)"
    rent: '$2,000/mo', // Shavit 8/4 text: "IN / 1902 EAST EWING AVE - $2000"
    line: 'South Bend house in rebuild now.',
    photo: '/assets/listings/cpm-kitchen.jpg', // CPM standard kitchen (Shavit 7/16 §1) until shot
    photos: null,
    illustration: true, // generic kitchen + star until a real IN shoot
    zillow: zillowFor('1902 East Ewing Ave South Bend IN 46613'),
    manager: 'Managed by Charger Property Management',
  },
  // --- 1919 Kendall St: NEW, from Shavit's 7/21 text (address + photo) + Jake's
  //     real Zillow link 7/23. Bare stub per Jake's explicit 7/23 call — beds,
  //     baths, type, sqft, eta all unknown, CONFIRM before filling in (never
  //     inferred from Zillow). Zip 46613 read off the Zillow URL slug itself. ---
  {
    id: 'kendall-1919',
    state: 'IN',
    // Shavit 7/27, on a screenshot of this card: "Kendall we finished months
    // ago and it is rented." It was reading Coming Soon + "full details coming
    // soon" for a house that has been occupied for months.
    // Jake 7/31: standardize the "rented" label to "Lease Signed" sitewide —
    // no property should show a separate "Rented" status.
    status: 'lease-signed',
    name: '1919 Kendall St',
    unit: null,
    locale: 'South Bend',
    stateName: 'Indiana',
    zip: '46613',
    type: null,
    beds: null,
    baths: null,
    sqft: null,
    availableDate: null,
    eta: null,
    line: 'South Bend rebuild, finished top to bottom and occupied.',
    // Real photo set from Shavit's Drive (7/23, 99-photo upload, curated to 9):
    // post-reno exterior hero + finished interiors. NOTE: the folder has NO
    // furnished/staged shots — these are finished-empty. Six raw photos were
    // flagged NEVER-SHIP (people visible / personal photo on a mantel /
    // screenshots) — do not pull more from the folder without re-checking.
    photo: '/assets/properties/kendall-street/01.jpg',
    photos: gallery('kendall-street', 9),
    illustration: false,
    zillow: 'https://www.zillow.com/homedetails/1919-Kendall-St-South-Bend-IN-46613/77036677_zpid/',
    manager: 'Managed by Charger Property Management',
  },

  // --- REMOVED per spec §5: 34 Mead, 61 Salem, 46 W South, 12 River, 15 Waldron,
  //     17 Lo Presto, 2217 Parkview (all in git history — do NOT re-add without
  //     Shavit's written word; everything not listed by him is taken). ---
]
