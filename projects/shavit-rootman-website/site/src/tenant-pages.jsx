import { useState, useEffect, useMemo, useRef, Children, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { Reveal, LineReveal } from './motion.jsx'
import { Btn, Eyebrow, GoldRule, Placeholder } from './components.jsx'
import { CONTACT, SHAVIT_PHOTOS } from './data.js'
import { PROPERTIES, STATES } from './properties.js'

// Q&A split per spec §8 (7/14): same questions, two groups — Tenants and
// Investors — kept low profile. Do NOT invent new questions; real investor
// Q&A copy lands when Shavit sends it.
// 1600px masters decode to ~7MB apiece; a cache-hot reload decodes every one
// at once and jetsam kills Safari's WebContent process on iPhones (~205MB
// measured). Every property jpg has a sips-generated -1024 sibling; srcset
// lets phones pick it (~2.6MB decoded) while desktop keeps the master.
const respImg = (src, sizes) => (src && src.endsWith('.jpg'))
  ? { src, srcSet: `${src.slice(0, -4)}-1024.jpg 1024w, ${src} 1600w`, sizes }
  : { src }

// Real copy from Shavit's 7/21 text (verbatim, source of the MCP-truncated
// snippets seen in chat.db — confirmed against the raw dump before landing here).
const TENANT_FAQS = [
  ['What are your application requirements?', 'Applicants generally need a 560+ credit score, stable verifiable income, and a positive rental history.'],
  ['What are the application steps?', 'Tour the home, apply online, complete screening, sign your lease, and move in.'],
  ['How much is the security deposit?', "Most security deposits equal one month's rent, but requirements vary by property."],
  ['Do you accept pets?', 'Many of our homes are pet-friendly, subject to property-specific policies and fees.'],
  ['Do you accept Housing Choice Vouchers (Section 8)?', 'Most of our properties do not participate in the Housing Choice Voucher (Section 8) program. Please check individual listings for updates.'],
  ['How do I pay rent and my security deposit?', 'Rent and deposits are paid through our secure property management software. In limited circumstances, we may accommodate Venmo or Zelle.'],
  ['Do you offer payment plans?', 'Payment plan requests are considered on a case-by-case basis and are not guaranteed.'],
  ['How do I request maintenance?', 'Residents submit maintenance requests quickly and easily through our online tenant portal.'],
]

// Same source, 7/21 text — Reg D general-solicitation sensitive (target returns +
// investment minimum). Lives in InvestSection, not here. Do not edit without
// re-checking with Jake; see the LEGAL LANDMINES note in the 7/22 walkthrough memory.
const INVESTOR_FAQS = [
  ['What investment opportunities do you offer?', 'We offer both debt investments and equity partnership opportunities, depending on the project and investor objectives.'],
  ['What returns can investors expect?', 'Debt investments have historically targeted 8–12% annual returns, while equity partnerships have higher potential returns.'],
  ['How are investments structured?', 'Every investment is documented through formal legal agreements outlining the investment terms, responsibilities, and exit strategy.'],
  ['How do you keep investors informed?', 'We provide quarterly project updates with progress reports, financial updates, and key milestones.'],
  ['Who will I be investing with?', 'Investments are made through the entity managing the project in the applicable state, with all terms clearly documented before funding.'],
  ['What types of projects do you invest in?', 'We primarily invest in value-add residential real estate, including single-family homes, duplexes, triplexes, and small multifamily properties.'],
  ['What is the minimum investment?', 'Our typical minimum investment is $50,000, although requirements may vary by opportunity.'],
  ['How do I get started?', "Schedule a conversation with us to discuss your goals and determine whether there's an investment opportunity that's a good fit."],
]

const INVESTOR_DISCLAIMER = 'Investment opportunities are offered only when available, are subject to applicable laws and investor qualifications, and are governed by executed legal agreements. Past performance does not guarantee future results.'

// Spelled-out, boutique beds/baths per Shavit 7/14: "let's write three bedrooms,
// the whole thing." Supports half baths ("one and a half" — his own explanation
// on the call). Jake 8/27: join with "and", not the 7/14 "maybe a dot in the
// middle" — "bed and bath combination as opposed to bed bath".
const NUM_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight']
function numWord(n) {
  if (n == null) return null
  if (Number.isInteger(n)) return NUM_WORDS[n] || String(n)
  const whole = Math.floor(n)
  return `${NUM_WORDS[whole] || whole} and a half`
}
function bedsBathsText(property) {
  if (property.beds == null || property.baths == null) return null
  const beds = numWord(property.beds)
  const baths = numWord(property.baths)
  const bedsLabel = property.beds === 1 ? 'bedroom' : 'bedrooms'
  const bathsLabel = property.baths === 1 ? 'bathroom' : 'bathrooms'
  const cap = beds.charAt(0).toUpperCase() + beds.slice(1)
  return `${cap} ${bedsLabel} and ${baths} ${bathsLabel}`
}

// Status is the FIRST thing on the card (spec §4): Available <date> /
// Coming Soon / Leased (heavily bold text, no diagonal stamp).
function statusText(property) {
  if (property.status === 'available') {
    return property.availableDate ? `Available ${property.availableDate}` : 'Available Now'
  }
  // Shavit 9/7: replace every visible "Lease Signed" label with "Leased".
  if (property.status === 'lease-signed') return 'Leased'
  return property.eta ? `Coming Soon · ${property.eta}` : 'Coming Soon'
}

// Full text-format address. Every listing shows its street/city/state (Jake
// 7/14: cards were missing addresses); the ZIP is appended only when known.
function fullAddress(property) {
  // addrState lets a card group under one state while printing its true one
  // (1114 Cedar: grouped under Indiana per Shavit, address is Niles, MI).
  const base = `${property.name}, ${property.locale}, ${property.addrState || property.state}`
  return property.zip ? `${base} ${property.zip}` : base
}

function mailtoFor(property) {
  const unit = property.unit ? `, ${property.unit}` : ''
  const subject = `Inquiry: ${property.name}${unit} (${property.locale}, ${property.stateName})`
  return `${CONTACT.emailHref}?subject=${encodeURIComponent(subject)}`
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 8.5A1.5 1.5 0 0 1 4.5 7h2l1.2-1.8A1 1 0 0 1 8.5 4.8h7a1 1 0 0 1 .8.4L17.5 7h2A1.5 1.5 0 0 1 21 8.5v9A1.5 1.5 0 0 1 19.5 19h-15A1.5 1.5 0 0 1 3 17.5z" />
      <circle cx="12" cy="12.5" r="3.2" />
    </svg>
  )
}

// Prequalification gate (spec §6): two questions before Contact Us or Apply
// fires. Credit under 560 or no stable income -> polite decline, nothing opens.
// Pass -> the button's own destination (email draft or Zillow). Client-side
// only — nothing is stored or sent anywhere.
function PrequalModal({ property, action, onClose }) {
  const [credit, setCredit] = useState('')
  const [income, setIncome] = useState('')
  const [failed, setFailed] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    // Dialog focus management (mirrors Lightbox/MenuOverlay): focus the credit
    // input first, trap Tab inside the dialog, restore the trigger on close.
    const trigger = document.activeElement
    const root = rootRef.current
    const first = root && (root.querySelector('input[type="number"]') || root.querySelector('input, button'))
    if (first) first.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !root) return
      const list = Array.from(root.querySelectorAll('input, button, [tabindex]:not([tabindex="-1"])'))
        .filter((el) => !el.disabled && el.offsetParent !== null)
      if (!list.length) return
      const firstEl = list[0], lastEl = list[list.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (trigger && typeof trigger.focus === 'function') trigger.focus()
    }
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    const score = parseInt(credit, 10)
    if (Number.isFinite(score) && score >= 560 && income === 'yes') {
      onClose()
      if (action === 'apply') {
        window.open(property.zillow, '_blank', 'noopener')
      } else {
        window.location.href = mailtoFor(property)
      }
    } else {
      setFailed(true)
    }
  }

  const overlay = (
    <div ref={rootRef} className="prequal" role="dialog" aria-modal="true" aria-label={`Prequalification for ${property.name}`} onClick={onClose}>
      <div className="prequal__panel" onClick={(e) => e.stopPropagation()}>
        <button className="prequal__close" type="button" aria-label="Close" onClick={onClose}>&times;</button>
        {failed ? (
          <div className="prequal__result">
            {/* Shavit 7/26: "The language here is too soft/nonformal ... change
                the tone." Declines now state the requirement and the outcome,
                with no apology or softener. The requirement wording is lifted
                from his own 7/21 application-requirements text. */}
            <h3 className="prequal__title">Requirements not met</h3>
            <p className="prequal__msg">
              Based on the information provided, you do not meet the requirements for this property.
              Applicants need a 560+ credit score and stable, verifiable income. Contact us if your
              circumstances change.
            </p>
            <button type="button" className="btn-base btn-ghost" onClick={onClose}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h3 className="prequal__title">Prequalification</h3>
            <p className="prequal__sub">{property.name}{property.unit ? `, ${property.unit}` : ''} · {property.locale}, {property.stateName}</p>
            <label className="prequal__field">
              <span>What is your credit score?</span>
              <input
                type="number"
                inputMode="numeric"
                min="300"
                max="850"
                required
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="e.g. 680"
              />
            </label>
            <fieldset className="prequal__field prequal__radios">
              <legend>Do you have a stable income?</legend>
              <label><input type="radio" name="income" value="yes" checked={income === 'yes'} onChange={() => setIncome('yes')} required /> Yes</label>
              <label><input type="radio" name="income" value="no" checked={income === 'no'} onChange={() => setIncome('no')} /> No</label>
            </fieldset>
            <button type="submit" className="btn-base btn-gold prequal__submit">
              {action === 'apply' ? 'Continue to Apply' : 'Continue to Contact'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
  return createPortal(overlay, document.body)
}

// Full-screen photo gallery: opens when a listing card with photos is clicked.
// Keyboard: Esc closes, ←/→ navigate. Body scroll locks while open.
function Lightbox({ property, onClose }) {
  const [idx, setIdx] = useState(0)
  const rootRef = useRef(null)
  const photos = property.photos || []
  const n = photos.length
  useEffect(() => {
    const trigger = document.activeElement
    const root = rootRef.current
    const firstBtn = root && root.querySelector('button')
    if (firstBtn) firstBtn.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + n) % n)
      else if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % n)
      else if (e.key === 'Tab' && root) {
        const list = Array.from(root.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'))
          .filter((el) => !el.disabled && el.offsetParent !== null)
        if (!list.length) return
        const firstEl = list[0], lastEl = list[list.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (trigger && typeof trigger.focus === 'function') trigger.focus()
    }
  }, [n, onClose])
  const overlay = (
    <div ref={rootRef} className="lightbox" role="dialog" aria-modal="true" aria-label={`${property.name} photos`} onClick={onClose}>
      <button className="lightbox__close" type="button" aria-label="Close photos" onClick={onClose}>&times;</button>
      <div className="lightbox__stage" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous photo" onClick={() => setIdx((i) => (i - 1 + n) % n)}>&lsaquo;</button>
        <figure className="lightbox__figure">
          <img className="lightbox__img" src={photos[idx]} alt={`${property.name} photo ${idx + 1} of ${n}`} />
          <figcaption className="lightbox__cap">
            <span className="lightbox__title">{property.name}<span className="lightbox__locale"> · {property.locale}</span></span>
            <span className="lightbox__count">{idx + 1} / {n}</span>
          </figcaption>
        </figure>
        <button className="lightbox__nav lightbox__nav--next" type="button" aria-label="Next photo" onClick={() => setIdx((i) => (i + 1) % n)}>&rsaquo;</button>
      </div>
      <div className="lightbox__thumbs" onClick={(e) => e.stopPropagation()}>
        {photos.map((src, k) => (
          <button key={k} type="button" className={`lightbox__thumb ${k === idx ? 'is-active' : ''}`} onClick={() => setIdx(k)} aria-label={`Photo ${k + 1}`}>
            <img {...respImg(src, '120px')} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
  return createPortal(overlay, document.body)
}

// Listing card, spec §4 order top-to-bottom: status / address+unit / unit type /
// beds·baths (spelled out) / square footage / description (with confirmed zip) /
// city at the bottom. Buttons: View Photos · Contact Us · Apply.
function ListingCard({ property, buffer }) {
  const [open, setOpen] = useState(false)
  const [gate, setGate] = useState(null) // 'contact' | 'apply' | null
  const hasGallery = Array.isArray(property.photos) && property.photos.length > 0
  const bufferProps = buffer ? { inert: '', 'aria-hidden': 'true' } : {}
  const specs = bedsBathsText(property)
  const addr = fullAddress(property)
  return (
    <article className="ccard listing-card" id={buffer ? undefined : `home-${property.id}`} {...bufferProps}>
      <div className="ccard__media">
        {property.photo ? (
          hasGallery ? (
            <button type="button" className="ccard__media-btn" onClick={() => setOpen(true)} aria-label={`View ${property.photos.length} photos of ${property.name}`}>
              <img
                {...respImg(property.photo, '(max-width: 767px) 340px, 400px')}
                alt={`${property.name} rental home in ${property.locale}`}
                loading="lazy"
                width="1200"
                height="900"
              />
              <span className="ccard__photos-badge"><CameraIcon /> {property.photos.length} photos</span>
            </button>
          ) : (
            <img
              {...respImg(property.photo, '(max-width: 767px) 340px, 400px')}
              alt={`${property.name} rental home in ${property.locale}`}
              loading="lazy"
              width="1200"
              height="900"
            />
          )
        ) : (
          <div className="listing-mark" role="img" aria-label={`${property.name}, photos coming`}>
            <svg viewBox="0 0 96 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M8 56 L8 30 L48 8 L88 30 L88 56 L8 56 Z" />
              <path d="M40 56 L40 36 L56 36 L56 56" />
              <path d="M8 56 L88 56" strokeWidth="2" />
            </svg>
            <span>Photos coming</span>
          </div>
        )}
        {/* Shavit 7/17: "lease signed" burned onto the photo itself, not only the text badge */}
        {property.status === 'lease-signed' && (
          <span className="ccard__stamp">{statusText(property)}</span>
        )}
      </div>
      <div className="ccard__body">
        {/* 1. Status at the very top — Leased heavily bold, no stamp */}
        <div className={`listing-status listing-status--${property.status}`}>{statusText(property)}</div>
        {/* 2. Address + unit */}
        <h3 className="ccard__name">
          {property.name}{property.unit ? `, ${property.unit}` : ''}
        </h3>
        {/* 3. Unit type */}
        <div className="listing-card__unittype">{property.type}</div>
        {/* 4. Beds & baths, prominent, spelled out */}
        {specs && <div className="listing-card__specs">{specs}</div>}
        {/* 5. Square footage — its own field on every unit (Shavit provides) */}
        <div className="listing-card__sqft">
          {/* "coming" only makes sense on a unit you can still rent — on a
              leased/rented home it reads as unfinished, which is exactly what
              Shavit flagged on Kendall 7/27. Blank there instead. */}
          {property.sqft
            ? `${property.sqft.toLocaleString()} sq ft`
            : (property.status === 'available' || property.status === 'coming-soon')
              ? 'Square footage coming'
              : ''}
        </div>
        {/* 5b. Rent — only where Shavit has given a figure (Shavit 7/20: 33 Barry, $1,250/mo) */}
        {property.rent && <div className="listing-card__rent">{property.rent}</div>}
        {/* 6. Description, demoted below the specs; confirmed zip shown in text */}
        <p className="ccard__desc">{property.line}</p>
        {addr && <p className="listing-card__addr">{addr}</p>}
        {/* Illustration disclaimer (legal, spec §4). Rendered ABOVE the actions
            so the button row always anchors to the card bottom — otherwise the
            note pushed illustration-card buttons up and rows misaligned across
            the carousel (Jake 7/14: "buttons still aren't even"). */}
        {property.illustration && (
          <div className="listing-card__star">• Picture is for illustration only, from our previous projects.</div>
        )}
        {/* Every card has the SAME two buttons, identical size. The photo gallery
            opens by clicking the image itself (a button with an "N photos"
            badge), so no standalone View Photos button is needed. margin-top:auto
            pins this row to the bottom on every card. */}
        <div className="listing-card__actions">
          <button type="button" className="btn-base btn-gold" onClick={() => setGate('contact')}>Contact Us</button>
          <button type="button" className="btn-base btn-ghost" onClick={() => setGate('apply')}>Apply</button>
        </div>
        {/* 7. City at the bottom */}
        <div className="listing-card__city">{`${property.locale}, ${property.stateName}`}</div>
      </div>
      <span className="ccard__rule" aria-hidden="true" />
      {open && <Lightbox property={property} onClose={() => setOpen(false)} />}
      {gate && <PrequalModal property={property} action={gate} onClose={() => setGate(null)} />}
    </article>
  )
}

function EmptyState({ state }) {
  return (
    <article className="ccard listing-card listing-card--empty">
      <div className="ccard__body">
        <span className="listing-chip">Nothing available right now</span>
        <h3 className="ccard__name">{state.label}</h3>
        <p className="ccard__desc">{state.emptyCopy || 'Contact us and we will tell you what is opening next in this state.'}</p>
        <div className="listing-card__actions">
          <a className="btn-base btn-gold" href="/#contact">Contact Us</a>
        </div>
      </div>
    </article>
  )
}

// Horizontal, swipeable carousel of listing cards with a TRUE infinite loop
// (Jake 7/9: "360... it loops and it doesn't send me back to the beginning").
function Carousel({ label, children }) {
  const trackRef = useRef(null)
  const items = Children.toArray(children)
  const [loop, setLoop] = useState(false)
  const setW = useRef(0)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const measure = () => {
      const copies = loop ? 3 : 1
      const w = el.scrollWidth / copies
      setW.current = w
      const overflow = w > el.clientWidth + 4 && items.length > 1
      setLoop((prev) => (prev === overflow ? prev : overflow))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [loop, items.length])

  useEffect(() => {
    const el = trackRef.current
    if (el && loop && el.scrollLeft < 4) el.scrollLeft = setW.current
  }, [loop])

  useEffect(() => {
    const el = trackRef.current
    if (!el || !loop) return
    let t
    const recenter = () => {
      const w = setW.current
      if (!w) return
      if (el.scrollLeft >= w * 2) el.scrollLeft -= w
      else if (el.scrollLeft < w) el.scrollLeft += w
    }
    const onScroll = () => { clearTimeout(t); t = setTimeout(recenter, 120) }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); clearTimeout(t) }
  }, [loop])

  const nudge = (dir) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  const sets = loop ? [0, 1, 2] : [1]
  return (
    <div className="carousel">
      {loop && (
        <button type="button" className="carousel__arrow carousel__arrow--prev" aria-label="Previous" onClick={() => nudge(-1)}>&lsaquo;</button>
      )}
      <div className="carousel__track" ref={trackRef} role="group" aria-label={label}>
        {sets.flatMap((s) =>
          items.map((child) => cloneElement(child, { key: `${s}:${child.key}`, buffer: s !== 1 }))
        )}
      </div>
      {loop && (
        <button type="button" className="carousel__arrow carousel__arrow--next" aria-label="Next" onClick={() => nudge(1)}>&rsaquo;</button>
      )}
    </div>
  )
}

function StateSection({ state }) {
  const visible = PROPERTIES.filter((p) => p.state === state.code && p.status !== 'hidden')
  // Jake 7/14: "all the houses with photos should be before any house without
  // photos." Primary sort = has a real photo; secondary = status (available,
  // then coming-soon, then lease-signed).
  const order = { available: 0, 'coming-soon': 1, 'lease-signed': 2 }
  const hasPhoto = (p) => Boolean(p.photo)
  const sorted = [...visible].sort((a, b) => {
    if (hasPhoto(a) !== hasPhoto(b)) return hasPhoto(a) ? -1 : 1
    return (order[a.status] ?? 9) - (order[b.status] ?? 9)
  })
  // Was `sorted.length > 4` per spec §4 (drop the carousel when a state has few
  // units). On a phone that read as two different products: Michigan has 13
  // visible units so it swiped sideways, Indiana has 3 so it scrolled down.
  // Shavit 8/9, over a screen recording: "Look; phone view. In Michigan, it's a
  // toggle right and left. In Indiana, it's scrolling down." Every state now
  // uses the same component, so the gesture is the same everywhere. Carousel
  // already self-degrades: arrows and the infinite loop only switch on when the
  // track actually overflows, so a short state still reads as a plain row on
  // desktop and only becomes swipeable where it has to.
  // FLAG FOR SHAVIT — he named the inconsistency, not which side to keep. This
  // matches Indiana to Michigan. One line to invert if he wanted the reverse.
  const useCarousel = true
  // Shavit 7/22: "Indiana... make it central." Center the header + card grid for
  // the Indiana section only (it runs a single South Bend listing right now).
  // Shavit asked for Indiana centred on 7/22 ("make it central"), then on 8/4
  // said "Titles should be aligned... it just doesn't look good." The newer,
  // page-wide instruction wins: Indiana was one of only two sections breaking
  // the 64px left rail, which is what made the page read as unaligned.
  // FLAG FOR SHAVIT — this reverses his own earlier ask. One line to restore.
  const centered = false
  return (
    <section className={`band inventory-state${centered ? ' inventory-state--center' : ''}`} id={state.id}>
      <div className="band__inner">
        <div className={`section-head${centered ? '' : ' section-head--left'}`}>
          {/* Per-state header, spec §4: "Hillsdale, Michigan" — no "and nearby communities" */}
          <Reveal mode="fade"><Eyebrow gold>{state.kicker}</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={[state.label]} />
          <Reveal mode="fade" delay={500}><GoldRule wide /></Reveal>
        </div>
        {sorted.length > 0 && (
          useCarousel ? (
            <Carousel label={`${state.label} homes`}>
              {sorted.map((property) => <ListingCard key={property.id} property={property} />)}
            </Carousel>
          ) : (
            <div className={`listing-grid${centered ? ' listing-grid--center' : ''}`}>
              {sorted.map((property) => <ListingCard key={property.id} property={property} />)}
            </div>
          )
        )}
        {sorted.length === 0 && <EmptyState state={state} />}
      </div>
    </section>
  )
}

// Deal Case Studies — shell + menu entry only (spec §10). Three per state;
// stories + numbers (ROI / NOI) land later from Shavit. Buckingham is Ohio #1.
function CaseStudiesSection() {
  // All three states are live: 1919 Kendall at /case-studies/1919-kendall/,
  // 3220 Clarendon at /case-studies/3220-clarendon/ (Shavit's 8/20 docx + photos),
  // and 34 Mead at /case-studies/34-mead/ (Shavit's 8/27 3:48pm text, a COMPLETE
  // BRRRR study; photography pending, page carries the .pending treatment).
  // Blurb says "home", not a building type: he never named one (Budlong rule).
  //
  // --- 60 S Norwood Ave REMOVED from Case Studies 8/29 on Jake's instruction.
  //     It shipped 8/24 as the one IN-PROGRESS study (Shavit's 8/24 3:26pm text
  //     + 10 photos, "Drywall in the works. / Exterior siding, windows, doors,
  //     roof, fascia, and soffits done.") with a .pending "numbers publish at
  //     completion" block, because no deal figures exist for it yet. Slot, page
  //     (site/public/case-studies/60-s-norwood/) and both prev/next links are
  //     gone; /case-studies/60-s-norwood 301s to /#case-studies in _redirects
  //     since the URL was live on prod. The full draft is KEPT at
  //     docs/case-studies/norwood-60/ so it can be restored when the reno
  //     finishes and Shavit sends acquisition/reno numbers. Do NOT restore it
  //     from git history without those numbers: incomplete is why it came down.
  //     The norwood-60 RENTAL LISTING in properties.js is untouched and still
  //     ships: this removal is the case study only.
  const slots = [
    { state: 'Michigan', title: 'Mead Street.', blurb: 'A Hillsdale home taken from $57,500 to a $287,000 appraisal, documented start to finish.', href: '/case-studies/34-mead/', cta: 'Read the case study' },
    { state: 'Ohio', title: 'Clarendon Road.', blurb: 'A Cleveland Heights triplex taken from $154,000 to a $550,000 appraisal, documented start to finish.', href: '/case-studies/3220-clarendon/', cta: 'Read the case study' },
    { state: 'Indiana', title: 'Kendall Street.', blurb: 'A South Bend rebuild taken from $68,400 to a $215,000 appraisal, documented start to finish.', href: '/case-studies/1919-kendall/', cta: 'Read the case study' },
  ]
  return (
    <section className="band" id="case-studies">
      <div className="band__inner">
        {/* Shavit 8/4 text, sent against a screenshot of this exact head:
            "Deal Case Studies - larger / Learn more about our numbers." The
            section label is the headline now and the supporting line sits
            under it — the same inversion he flagged everywhere else on the
            8/4 call ("the main title is smaller than the subtitle"). */}
        <div className="section-head section-head--left">
          <LineReveal as="h2" className="h-lg" lines={['Deal Case Studies.']} />
          <Reveal mode="fade" delay={300}><p className="section-head__sub">Learn more about our numbers.</p></Reveal>
          <Reveal mode="fade" delay={500}><GoldRule wide /></Reveal>
        </div>
        {/* Shavit 8/11: every row swipes, on mobile too - the case studies were
            the last block still stacking vertically on a phone while the
            listings toggled sideways. Same Carousel the listings use, so the
            gesture is identical everywhere; it self-degrades to a plain row on
            desktop where three cards do not overflow. */}
        {/* key is the href, not the state — Michigan holds two slots now */}
        <Carousel label="Deal case studies">
          {slots.map((slot) => (
            <article className="qcard case-card" key={slot.href}>
              <Eyebrow gold>{slot.state}</Eyebrow>
              <h3 className="qcard__pull">{slot.title}</h3>
              <p className="qcard__quote">{slot.blurb}</p>
              {slot.href && <Btn href={slot.href} variant="gold">{slot.cta}</Btn>}
            </article>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

// Static "One Stop Shop" band — Shavit 7/22: "Rent with Us, invest with us,
// sell us your home." Three doors in one row. It is a STATIC band, never an
// auto-popup (Jake's 7/22 call). Rent → available units, Invest → the
// Investors section below, Sell → the CPM inbox.
//
// 8/4 call + texts: "Work With Us" over "Three doors, one team" was two
// competing titles that did not relate, and Shavit asked where the phrase came
// from; it was dropped as generic filler. His replacement, texted verbatim at 20:18:
// "ONE STOP SHOP - / Tenants, Investors, Home Sellers". The door blurbs for
// Invest and Sell are his texted copy too (20:21 and 20:23).
function WaysToWork() {
  const doors = [
    { key: 'rent', eyebrow: 'Tenants', title: 'Rent with us.', blurb: 'Homes available now and coming soon across Michigan, Ohio, and Indiana.', cta: 'See Available Units', href: '/#michigan', variant: 'gold' },
    { key: 'invest', eyebrow: 'Investors', title: 'Invest with us.', blurb: 'Have capital to deploy? Interested in project partnership? We occasionally entertain both debt and equity partnerships.', note: 'We currently do not accept private capital.', cta: 'Learn More', href: '/#invest', variant: 'ghost' },
    { key: 'sell', eyebrow: 'Home Sellers', title: 'Sell us your home.', blurb: 'We buy houses in any condition. If you want to save money and headaches, give us a call and see what offer we can make.', cta: 'Contact Us', href: '/#contact', variant: 'ghost' },
  ]
  return (
    <section className="band" id="work-with-us">
      <div className="band__inner">
        <div className="section-head section-head--left">
          <LineReveal as="h2" className="h-lg" lines={['One stop shop.']} />
          <Reveal mode="fade" delay={300}><p className="section-head__sub">Tenants, Investors, Home Sellers.</p></Reveal>
          <Reveal mode="fade" delay={500}><GoldRule wide /></Reveal>
        </div>
        <div className="case-grid doors-grid">
          {doors.map((d) => (
            <article className="qcard door-card" key={d.key}>
              <Eyebrow gold>{d.eyebrow}</Eyebrow>
              <h3 className="qcard__pull">{d.title}</h3>
              <p className="qcard__quote">{d.blurb}</p>
              {/* Shavit's own asterisked disclaimer, kept attached to the
                  claim it qualifies rather than floated to the section foot. */}
              {d.note && <p className="door-card__note">{d.note}</p>}
              <Btn href={d.href} variant={d.variant}>{d.cta}</Btn>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Investors destination (Shavit 7/22): the "Invest with us" door lands here.
// Shavit's own framing — Charger is NOT raising outside money right now. This
// copy DECLINES capital, which is the opposite of a securities offering, so it
// carries no Reg D general-solicitation exposure. Do NOT add target returns,
// deal numbers, an interest list, or "opportunities available" copy here
// without Shavit + counsel (see LEGAL LANDMINES in the 7/22 walkthrough note).
function InvestSection() {
  return (
    <section className="band" id="invest">
      <div className="band__inner">
        {/* 8/4: the tiny "Investors" eyebrow over a big "Invest with us." was
            the exact inversion Shavit called out ("investors small ... I don't
            get why the investor is so small and the subtitle is bigger than the
            main title"). One title now, matching the menu item that lands here. */}
        <div className="section-head section-head--left">
          <LineReveal as="h2" className="h-lg" lines={['Invest with us.']} />
          <Reveal mode="fade" delay={500}><GoldRule wide /></Reveal>
        </div>
        {/* Shavit 8/4, quoting the old sentence back and dictating the
            replacement: "Change text from: [...] to: Charger Property
            Management operates its portfolio in-house currently does not raise
            outside capital. Keep looking, as this may occasionally change."
            Shipped VERBATIM. An earlier pass inserted "and" before "currently"
            to fix the missing conjunction; that was reverted, because he
            reserved language approval ("run it by me for final confirmation")
            and we do not put words in the client's mouth. The conjunction is
            still worth asking for — one text from Jake and it can go in. */}
        <p className="body-lg invest-copy">
          Charger Property Management operates its portfolio in-house currently does not raise outside capital. Keep looking, as this may occasionally change.
        </p>
        {/* Contact button removed 8/4 ("contact button either in both, or
            neither"). The Q&A that used to sit here moved into the tabbed
            Q&A section, so the two groups are now presented identically. */}
      </div>
    </section>
  )
}

// "Meet our Founder" — centered column with a circular portrait (Jake 7/23:
// the left-pinned rectangle read as off-balance — "needs to be centered maybe
// its a circular frame"). Photo stays small per Shavit's spec §9 ask.
function MeetSection() {
  return (
    <section className="band meet-founder" id="meet">
      <div className="band__inner">
        <Reveal mode="zoom-lg" className="meet-founder__avatar-wrap">
          <img
            className="meet-founder__avatar"
            src="/assets/photos/06_shavit_avatar.jpg"
            alt="Shavit Rootman"
            loading="lazy"
            width="200"
            height="200"
          />
        </Reveal>
        <Reveal mode="fade"><Eyebrow gold>Meet our Founder</Eyebrow></Reveal>
        <LineReveal as="h2" className="h-lg" lines={['Shavit Rootman.']} style={{ marginTop: 16 }} />
        <Reveal mode="fade" delay={500}><GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} /></Reveal>
        <p className="body-lg meet-founder__blurb">
          Shavit Rootman operates Midwest rental housing across Michigan, Ohio, and Indiana, managed in-house by Charger Property Management.
        </p>
        <div className="hero__actions">
          <Btn href={CONTACT.liHref} variant="gold">LinkedIn</Btn>
          <Btn href={CONTACT.igHref} variant="ghost">Instagram</Btn>
        </div>
      </div>
    </section>
  )
}

function FaqList({ faqs, idPrefix }) {
  const [open, setOpen] = useState(-1)
  return (
    <div className="faq">
      {faqs.map(([q, a], i) => (
        <div className={`faq__item ${open === i ? 'faq__item--open' : ''}`} key={q}>
          <button className="faq__q" type="button" id={`${idPrefix}-q-${i}`} aria-expanded={open === i} aria-controls={`${idPrefix}-panel-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <span>{q}</span>
            <span className="faq__icon" aria-hidden="true">+</span>
          </button>
          <div className="faq__a" id={`${idPrefix}-panel-${i}`} role="region" aria-labelledby={`${idPrefix}-q-${i}`} hidden={open !== i}>
            <div className="faq__a-inner"><p>{a}</p></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Contact destination (Jake 7/28: "the contact us button top right doesn't
// take us to the contact page"). Every "Contact Us" affordance pointed at
// #reach, which opens on the Tenants Q&A accordion — a FAQ, not a way to reach
// anyone; the phone sat below the whole question list. This section is the
// actual destination: both real channels, above the questions. Reuses the
// existing band/section-head/reach-grid/qcard classes, so no new styling.
function ContactSection() {
  return (
    <section className="band" id="contact">
      <div className="band__inner">
        {/* Left-aligned like every other section head — Shavit 8/4: "Titles
            should be aligned ... it just doesn't look good, Jake." This one and
            the Q&A below were the only two centered heads on the page. */}
        {/* 8/16 rewrite (Shavit texts 09:16–10:37, Jake picked "Option B"):
            he approved the look and rejected the words — "What is 'send a
            note', tho?" and "No need to 'One number. One inbox.' I think that
            is redundant." So: no subline, no pull headings, no CTA copy. Two
            plain rows, label | value, both tap-to-act, on the .contact-row
            pattern that already sat unused in site.css. Do NOT reintroduce
            adjectives or button copy here without his OK. */}
        <div className="section-head section-head--left">
          <LineReveal as="h2" className="h-lg" lines={['Contact us.']} />
          <Reveal mode="fade" delay={300}><GoldRule wide /></Reveal>
        </div>
        <div className="contact-rows contact-rows--left">
          <div className="contact-row">
            <span className="lbl">Call or text</span>
            <a className="val" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
          </div>
          <div className="contact-row">
            <span className="lbl">Email</span>
            {/* <wbr> after "@" and "property": at 390px the address otherwise
                splits mid-word ("…managem / ent.com"). Keep in sync with
                CONTACT.email in data.js. */}
            <a className="val val--email" href={CONTACT.emailHref}>info@<wbr />chargerproperty<wbr />management.com</a>
          </div>
        </div>
      </div>
    </section>
  )
}

// Q&A — ONE section, two tabs (Shavit 8/4): "the whole point of this section is
// Q and A ... I would like this whole section as a tab. I don't want the tenants
// Q and A exposed immediately, and vice versa for the investments ... you press
// investors Q and A, and then all the different questions open up to you, and
// then you can expand on those too."
//
// This is also where the Investors Q&A now lives — it used to sit inside
// InvestSection, which forced two different presentations of the same thing and
// produced the redundant "See Investor Q&A" button he flagged ("when you press
// that, all you do is you go 2 lines up").
//
// Both panels stay in the DOM (the inactive one carries `hidden`) so the
// prerendered HTML keeps every question indexable, and so the accordion state
// of each group survives a tab switch.
const QA_GROUPS = [
  { key: 'tenants', label: 'Tenants Q&A', faqs: TENANT_FAQS, idPrefix: 'tenant-faq', disclaimer: null },
  { key: 'investors', label: 'Investors Q&A', faqs: INVESTOR_FAQS, idPrefix: 'investor-faq', disclaimer: INVESTOR_DISCLAIMER },
]

function QaSection() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])

  // Deep-link the tab (?qa=investors). Web Interface Guidelines: stateful UI —
  // tabs included — belongs in the URL, and it matters here because Shavit
  // texts section links to people; "the investor questions" has to be one
  // shareable link, not "scroll down and click the second tab".
  // Synced in an effect, NOT in useState's initializer: the prerendered HTML
  // always ships tab 0, so reading the URL during render would hydrate to a
  // different tab than the server produced.
  useEffect(() => {
    const want = new URLSearchParams(window.location.search).get('qa')
    const i = QA_GROUPS.findIndex((g) => g.key === want)
    if (i > 0) setActive(i)
  }, [])

  const selectTab = (i) => {
    setActive(i)
    // replaceState, not a router navigate: this must not add a history entry
    // per keystroke of arrow-key browsing, and must not re-trigger the
    // hash-scroll effect in Layout.
    const url = new URL(window.location.href)
    if (i === 0) url.searchParams.delete('qa')
    else url.searchParams.set('qa', QA_GROUPS[i].key)
    window.history.replaceState(null, '', url)
  }

  // Roving focus: ←/→ move between tabs, Home/End jump to the ends (APG tabs).
  const onKeyDown = (e) => {
    const last = QA_GROUPS.length - 1
    let next = null
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = last
    if (next === null) return
    e.preventDefault()
    selectTab(next)
    tabRefs.current[next]?.focus?.()
  }

  return (
    <section className="band" id="reach">
      <div className="band__inner">
        <div className="section-head section-head--left">
          {/* A bare "Q&A" was a label, not a title. Shavit's stated register —
              "formal, informative, approachable" — and the sibling heads are all
              short declaratives ("One stop shop." / "Contact us."), so this
              matches their cadence: plain words, no slang, says what's inside. */}
          <LineReveal as="h2" className="h-lg" lines={['Questions, answered.']} />
          <Reveal mode="fade" delay={300}><p className="section-head__sub">What tenants and investors ask us most, answered in full.</p></Reveal>
          <Reveal mode="fade" delay={500}><GoldRule wide /></Reveal>
        </div>

        <div className="qa-tabs" role="tablist" aria-label="Q&amp;A audience" onKeyDown={onKeyDown}>
          {QA_GROUPS.map((g, i) => (
            <button
              key={g.key}
              ref={(el) => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={`qa-tab-${g.key}`}
              className={`qa-tab ${i === active ? 'qa-tab--active' : ''}`}
              aria-selected={i === active}
              aria-controls={`qa-panel-${g.key}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => selectTab(i)}
            >
              {g.label}
            </button>
          ))}
        </div>

        {QA_GROUPS.map((g, i) => (
          <div
            key={g.key}
            role="tabpanel"
            id={`qa-panel-${g.key}`}
            aria-labelledby={`qa-tab-${g.key}`}
            className="qa-panel"
            hidden={i !== active}
            tabIndex={0}
          >
            <FaqList faqs={g.faqs} idPrefix={g.idPrefix} />
            {g.disclaimer && <p className="body-sm invest-disclaimer">{g.disclaimer}</p>}
          </div>
        ))}

        {/* One contact affordance, identical under either tab — Shavit 8/4:
            "contact button either in both, or neither." */}
        <div className="qa-foot">
          <p className="qa-foot__line">Still have a question? Call or text {CONTACT.phone}.</p>
          <a className="btn-base btn-gold" href={CONTACT.smsHref}>Text Us</a>
        </div>
      </div>
    </section>
  )
}

// Hero montage (7/14 live review): the montage REPLACES the old hero video.
// It is the hero media itself — full bleed, flush to every edge, never a
// click-blocking overlay (that overlay is what made the nav Contact button
// read as dead). Address chip bottom RIGHT (Jake moved it from bottom-left
// on review); clicking it jumps to that listing card. SSR renders the first
// slide so the prerendered page paints a real photo.
//
// MONTAGE_SETS is Jake's EXPLICIT approve/fade verdict from the 7/14 swipe
// deck — NOT "every available home." Only these exact photos appear, and the
// montage is decoupled from each card's gallery, so curating galleries later
// never disturbs the hero. He approved photos across statuses (incl. leased
// showcase homes) and faded all of Cedar. Slides round-robin across addresses
// for variety, capped at HERO_MAX_SLIDES.
const HERO_SLIDE_MS = 4200
const HERO_MAX_SLIDES = 12

const MONTAGE_SETS = [
  {
    id: 'budlong-a',
    // Jake pulled the front-porch/sidewalk exterior from the montage (7/14):
    // that shot is listings/budlong-street.jpg and its twin 01.jpg, so the
    // montage starts at 02 (the interiors + tree-street exterior). The porch
    // shot still serves as the Budlong CARD hero.
    srcs: Array.from({ length: 9 }, (_, i) => `/assets/properties/budlong-street/${String(i + 2).padStart(2, '0')}.jpg`),
  },
  {
    id: 'howder-a',
    // Jake faded howder 02; approved 01,03,04,05,06,07,08.
    srcs: ['01', '03', '04', '05', '06', '07', '08'].map((n) => `/assets/properties/howder-street/${n}.jpg`),
  },
  {
    id: 'stjoe-a',
    // Jake faded saint-joe 08; approved 01–07.
    srcs: ['01', '02', '03', '04', '05', '06', '07'].map((n) => `/assets/properties/saint-joe/${n}.jpg`),
  },
]

function montageSlides() {
  const byId = Object.fromEntries(PROPERTIES.map((p) => [p.id, p]))
  const cursors = MONTAGE_SETS.map(() => 0)
  const slides = []
  let added = true
  while (added && slides.length < HERO_MAX_SLIDES) {
    added = false
    for (let i = 0; i < MONTAGE_SETS.length; i++) {
      if (slides.length >= HERO_MAX_SLIDES) break
      const set = MONTAGE_SETS[i]
      const src = set.srcs[cursors[i]]
      if (!src) continue
      cursors[i] += 1
      added = true
      const p = byId[set.id]
      if (!p) continue
      slides.push({
        src,
        id: p.id,
        name: p.name,
        unit: p.unit,
        locale: p.locale,
        stateName: p.stateName,
        stateAbbr: p.addrState || p.state,
        status: statusText(p),
      })
    }
  }
  return slides
}

export function MontageHero() {
  const slides = useMemo(montageSlides, [])
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), HERO_SLIDE_MS)
    return () => clearInterval(id)
  }, [slides])

  const current = slides[idx]
  return (
    <section className="hero hero--enter hero--montage">
      <div className="hero__media" aria-hidden="true">
        {/* 7/21 crash fix (Shavit's brother + friend, "A problem repeatedly
            occurred" on iPhone Safari): mounting all 12 full-res slides at
            once decoded ~80MB of pixels + 12 full-screen GPU layers on page
            open, which kills the WebContent process on lower-RAM iPhones.
            Only 3 slides live in the DOM now — previous (fading out),
            current (fading in), next (decoding ahead of its turn) — so the
            crossfade looks identical at ~1/4 the memory. loading="lazy" was
            a no-op here: stacked hero slides are always "in viewport". */}
        {slides.map((s, i) => {
          const n = slides.length
          const prev = (idx - 1 + n) % n
          const next = (idx + 1) % n
          if (i !== idx && i !== prev && i !== next) return null
          return (
            <img
              key={`${s.id}-${i}`}
              className={`hero__slide ${i === idx ? 'is-active' : ''}`}
              {...respImg(s.src, '(max-width: 767px) 341px, 100vw')}
              alt=""
              decoding="async"
            />
          )
        })}
      </div>
      <div className="hero__scrim" />
      <div className="hero__inner">
        <LineReveal as="h1" className="h-mega" lines={['Live with us.', 'Learn about us.']} triggerOnView={false} baseDelay={600} lineDelay={150} style={{ marginTop: 24 }} />
        <p className="body-lg hero__sub">Available now and coming soon across Michigan, Ohio, and Indiana.</p>
        <div className="hero__actions"><Btn href="/#michigan" variant="gold">See Available Units</Btn></div>
      </div>
      {current && (
        <Link
          className="hero__addr"
          to={`/#home-${current.id}`}
          aria-label={`See available listings in ${current.locale}, ${current.stateAbbr}`}
        >
          {/* Shavit 7/17: keep the exact street address OFF the montage — city
              only ("Just put Hillsdale, MI"). Exact addresses stay on the cards. */}
          <strong>{`${current.locale}, ${current.stateAbbr}`}</strong>
        </Link>
      )}
    </section>
  )
}

export function HomePage() {
  // Crash bisect: /meet/ (no montage, no card grids) never crashes iOS Safari
  // while / does — these switches isolate which homepage-only block is fatal.
  const { search } = useLocation()
  const kills = new Set((search.match(/[?&]kill=([^&]*)/)?.[1] || '').split(',').filter(Boolean))
  const kill = (k) => kills.has('all') || kills.has(k)
  return (
    <div className="page-fade tenant-home">
      {/* Hero per spec §3 + 7/14 live review: NO eyebrow, headline
          "Live with us. Learn about us.", montage replaces the video. */}
      {kill('hero') ? (
        <section className="hero" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 className="h-mega">Live with us.</h1>
        </section>
      ) : (
        <MontageHero />
      )}
      {!kill('sections') && (
        <>
          {STATES.map((state) => <StateSection key={state.code} state={state} />)}
          <CaseStudiesSection />
        </>
      )}
      {/* Static three-door band + Investors destination live OUTSIDE the crash
          bisect wrapper — they carry no images, so they are not iOS-jetsam risks.
          Page order is unchanged; the 8/4 "the order is wrong" note was about
          the MENU labels under Investors, fixed in nav.jsx to match this flow. */}
      <WaysToWork />
      <MeetSection />
      <InvestSection />
      <ContactSection />
      <QaSection />
    </div>
  )
}

export function MeetPage() {
  return (
    <div className="page-fade">
      <section className="split">
        <Reveal mode="zoom-lg" className="split__media ph-vignette">
          <Placeholder src={SHAVIT_PHOTOS.portraitLI} alt="Shavit Rootman" portrait />
        </Reveal>
        <div className="split__panel">
          <Eyebrow gold>Meet our Founder</Eyebrow>
          <h1 className="h-mega" style={{ marginTop: 24 }}>Real estate, operated.</h1>
          <GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} />
          <p className="body-lg">
            Shavit Rootman buys and operates overlooked Midwest housing, then turns it into rental homes people can actually find, ask about, and move into.
          </p>
          <div className="hero__actions">
            <Btn href={CONTACT.liHref} variant="gold">LinkedIn</Btn>
            <Btn href={CONTACT.igHref} variant="ghost">Instagram</Btn>
          </div>
        </div>
      </section>
    </div>
  )
}

// NO full-address roster page. Shavit, 7/8 call, verbatim: "I'd like to do
// coming up and available. What we've done in the past is not relevant... I
// don't need the city to be able to get on my website and go, oh, they own all
// of that... they can charge me more taxes." Do not re-add a page that
// enumerates every home he manages.

export function AccessibilityPage() {
  return (
    <div className="page-fade">
      <section className="band" style={{ minHeight: '70vh' }}>
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Eyebrow gold>Accessibility</Eyebrow>
            <h1 className="h-mega" style={{ marginTop: 24 }}>Access matters.</h1>
            <GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} />
          </div>
          <div className="access-copy">
            <p className="body-lg">
              We aim to keep shavitrootman.com usable for tenants, sellers, and partners. We test core pages for readable structure, keyboard access, reduced motion behavior, and clear labels.
            </p>
            <p className="body-lg">
              If something on the site is difficult to use, call <a href={CONTACT.phoneHref}>{CONTACT.phone}</a> or email <a href={CONTACT.emailHref}>{CONTACT.email}</a>.
            </p>
            <a className="btn-base btn-gold" href={CONTACT.emailHref}>Contact Us</a>
          </div>
        </div>
      </section>
    </div>
  )
}
