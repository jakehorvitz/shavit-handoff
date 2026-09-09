// routes.jsx — vite-react-ssg route config.
// Layout renders the ported chrome (Nav, LogoIntro, FilmGrain, ScrollProgress,
// CursorRing, Footer) with the SEO <Head> (per-route title/description/canonical/
// OG + Organization & LocalBusiness JSON-LD), and an <Outlet/> for the 6 pages.

import { useEffect } from 'react'
import { Head } from 'vite-react-ssg'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { BRAND, CONTACT, SITE_URL, pages } from './data.js'
import { PROPERTIES } from './properties.js'
import { Nav } from './nav.jsx'
import { Footer } from './footer.jsx'
import { LogoIntro } from './intro.jsx'
import { FilmGrain, ScrollProgress, CursorRing } from './components.jsx'
import { HomePage, MeetPage, AccessibilityPage } from './tenant-pages.jsx'

function canonicalPath(pathname) {
  return pathname === '/' ? '/' : pathname.replace(/\/$/, '')
}

function propertyUrl(property) {
  return `${SITE_URL}/#home-${property.id}`
}

function listingName(property) {
  return `${property.name}${property.unit ? `, ${property.unit}` : ''}`
}

function listingAddress(property) {
  const address = {
    '@type': 'PostalAddress',
    streetAddress: property.name,
    addressLocality: property.locale,
    // addrState, not state: `state` is the section a card groups under, which is
    // not always where the house is (1114 Cedar groups under Indiana per Shavit
    // but sits in Niles, MI). Structured data must carry the true state or it
    // publishes a false address to Google.
    addressRegion: property.addrState || property.state,
    addressCountry: 'US',
  }
  if (property.zip) address.postalCode = property.zip
  return address
}

function rentalListingSchema() {
  const listings = PROPERTIES
    .filter((property) => property.status === 'available' || property.status === 'coming-soon')
    .map((property, index) => {
      const residence = {
        '@type': property.type === 'Single Family' ? 'SingleFamilyResidence' : 'Apartment',
        '@id': propertyUrl(property),
        name: listingName(property),
        url: propertyUrl(property),
        address: listingAddress(property),
        containedInPlace: {
          '@type': 'City',
          name: `${property.locale}, ${property.stateName}`,
        },
      }
      if (property.beds != null) residence.numberOfBedrooms = property.beds
      if (property.baths != null) {
        residence.numberOfBathroomsTotal = property.baths
      }
      if (property.line) residence.description = property.line
      if (property.photo) residence.image = `${SITE_URL}${property.photo}`
      return {
        '@type': 'ListItem',
        position: index + 1,
        url: propertyUrl(property),
        name: listingName(property),
        item: residence,
      }
    })

  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#available-rentals`,
    name: 'Available and coming-soon rental homes',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: listings.length,
    itemListElement: listings,
  }
}

function Seo({ path }) {
  const cleanPath = canonicalPath(path)
  const page = pages[cleanPath] || pages['/']
  // The share card is what Shavit actually sees when he texts the link, so it
  // carries its own copy and falls back to the SEO pair on pages without one.
  const shareTitle = page.shareTitle || page.title
  const shareDescription = page.shareDescription || page.description
  // Home canonical keeps the trailing slash so it matches sitemap.xml exactly.
  const url = `${SITE_URL}${cleanPath === '/' ? '/' : cleanPath}`
  const image = `${SITE_URL}/og-image.png`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: BRAND,
        alternateName: 'Charger Property Management',
        url: SITE_URL,
        logo: image,
        founder: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#shavit-rootman`,
          name: 'Shavit Rootman',
          sameAs: [CONTACT.linkedIn, CONTACT.instagram],
        },
        subOrganization: { '@id': `${SITE_URL}/#localbusiness` },
        telephone: CONTACT.phone,
        sameAs: [CONTACT.linkedIn, CONTACT.instagram],
      },
      {
        // RealEstateAgent is the specific schema.org subtype for property
        // managers; LocalBusiness stays explicit for SEO tools that only check
        // the parent type string.
        // TODO: add PostalAddress once Shavit confirms the registered business
        // address (do not guess it — NAP must match the MI LLC registration).
        // "CPM" alternateName: real shorthand (it's the business's own email
        // handle), machine-readable here only — never in visible copy.
        '@type': ['LocalBusiness', 'RealEstateAgent'],
        '@id': `${SITE_URL}/#localbusiness`,
        name: 'Charger Property Management',
        alternateName: [BRAND, 'CPM'],
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
        url: SITE_URL,
        telephone: CONTACT.phone,
        image,
        sameAs: [CONTACT.linkedIn, CONTACT.instagram],
        areaServed: ['Hillsdale MI', 'Cleveland OH', 'South Bend IN'],
      },
      // Rental ItemList only where listings actually render — keeps /meet and
      // /accessibility schema page-relevant instead of carrying all 10 homes.
      ...(cleanPath === '/' ? [rentalListingSchema()] : []),
    ],
  }

  return (
    <Head>
      <title>{page.title}</title>
      <meta name="description" content={page.description} />
      {page.noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      {/* NOT the BRAND string. iMessage and Facebook strip a leading
          og:site_name from og:title to avoid "Shavit Rootman · Shavit Rootman
          | ...", which swallowed the prefix Shavit asked for and rendered the
          card as bare "Investing in Midwest Communities". Naming the managing
          entity here keeps the full title intact. */}
      <meta property="og:site_name" content="Charger Property Management" />
      <meta property="og:title" content={shareTitle} />
      <meta property="og:description" content={shareDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={shareTitle} />
      <meta name="twitter:description" content={shareDescription} />
      <meta name="twitter:image" content={image} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  )
}

const PAGE_LABELS = {
  '/': '01 Home',
  '/meet': '02 Meet Shavit',
  '/accessibility': '03 Accessibility',
}

function Layout() {
  const location = useLocation()
  const clean = canonicalPath(location.pathname)
  const label = PAGE_LABELS[clean] || '01 Home'

  useEffect(() => {
    if (!location.hash) return
    const id = decodeURIComponent(location.hash.slice(1))
    window.requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (target) target.scrollIntoView({ block: 'start' })
    })
  }, [location.pathname, location.hash])

  // Remote bisect switches: ?kill=grain,intro,anims (or ?kill=all) strips
  // GPU-heavy features so a crashing phone can binary-search the culprit.
  const kills = new Set((location.search.match(/[?&]kill=([^&]*)/)?.[1] || '').split(',').filter(Boolean))
  const kill = (k) => kills.has('all') || kills.has(k)

  useEffect(() => {
    for (const t of ['anims', 'filters', 'animonly', 'transitions', 'heroanim', 'reveal']) {
      document.documentElement.classList.toggle(`kill-${t}`, kill(t))
    }
  }, [location.search])

  return (
    <div className="app-shell" data-screen-label={label}>
      <Seo path={location.pathname} />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {!kill('grain') && <FilmGrain />}
      <ScrollProgress />
      {!kill('intro') && <LogoIntro />}
      <Nav />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
      <CursorRing />
    </div>
  )
}

function NotFound() {
  return (
    <section className="band" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="band__inner">
        <div className="eyebrow eyebrow--gold">Error 404</div>
        <h1 className="h-mega" style={{ marginTop: 16 }}>Page not found.</h1>
        <hr className="gold-rule gold-rule--wide" style={{ margin: '24px auto' }} />
        <p className="body-lg" style={{ maxWidth: 520, margin: '0 auto 32px' }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link className="btn-base btn-gold" to="/">Back to Home →</Link>
      </div>
    </section>
  )
}

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'meet', element: <MeetPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
