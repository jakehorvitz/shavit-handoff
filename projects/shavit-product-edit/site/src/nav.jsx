// nav.jsx — Nav + MenuOverlay ported verbatim from Nav.jsx.
// Converted to react-router: wordmark + menu items + "Work With Me" CTA
// navigate via useNavigate(). Menu open/close state is held internally.

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { BRAND, CONTACT, SUBLINE } from './data.js'

const PATH_BY_KEY = {
  michigan: '/#michigan',
  ohio: '/#ohio',
  indiana: '/#indiana',
  invest: '/#invest',
  'case-studies': '/#case-studies',
  meet: '/meet',
  accessibility: '/accessibility',
}

function keyForPath(pathname) {
  const clean = pathname.replace(/\/$/, '') || '/'
  if (clean === '/') return 'michigan'
  const found = Object.entries(PATH_BY_KEY).find(([, p]) => p === clean)
  return found ? found[0] : 'michigan'
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const page = keyForPath(location.pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Lock scroll when menu open
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const onNav = (key) => { navigate(PATH_BY_KEY[key] || '/'); if (!PATH_BY_KEY[key]?.includes('#')) window.scrollTo({ top: 0 }) }

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <div className="nav__left">
            <button className={`nav__menu-btn ${menuOpen ? 'is-open' : ''}`} onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-expanded={menuOpen ? 'true' : 'false'}>
              <span className="nav__burger" aria-hidden="true">
                <span className="nav__burger-bar nav__burger-bar--top" />
                <span className="nav__burger-bar nav__burger-bar--bot" />
              </span>
              <span>{menuOpen ? 'Close' : 'Menu'}</span>
            </button>
          </div>
          <Link
            className="nav__wordmark nav__center"
            to="/"
            onClick={() => window.scrollTo({ top: 0 })}
            aria-label={`${BRAND}, ${SUBLINE}. Home`}
          >
            {BRAND.split(' ')[0]}<span className="nav__wordmark-gold">{BRAND.split(' ').slice(1).join(' ')}</span>
          </Link>
          <div className="nav__right">
            {/* Contact Us lands on #contact — phone + email, both live links.
                A bare mailto silently no-ops without a mail client (Jake 7/23:
                "contact us doesn't work"); #reach was no better, it opens on the
                Q&A accordion (Jake 7/28: "doesn't take us to the contact page"). */}
            <a className="nav__cta" href="/#contact">
              Contact Us
            </a>
          </div>
        </div>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} page={page} onNav={onNav} />
    </>
  )
}

function MenuOverlay({ open, onClose, page, onNav }) {
  const overlayRef = useRef(null)
  const triggerRef = useRef(null)
  // Apply the route-dependent active class only AFTER mount. During SSR and the
  // first hydration render, react-router's useLocation() hasn't synced, so the
  // server (correct page) and client (fallback) disagree — gating on mount makes
  // both render no active class, eliminating the #418/#425 hydration mismatch.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Spec §2 menu, trimmed per Shavit 7/22 ("the menu is a little busy... take
  // out the explanations"): four entries, NO description lines. Shavit's IA
  // (7/22): Available Units · Investors · Learn About Us · Contact Us. Available
  // Units opens to sub-choices by state ("Units" unifies apartments + houses);
  // Investors is a new top-level door and Deal Case Studies now nests under it
  // (Shavit: "case studies move under Investors").
  const groups = [
    {
      key: 'available-units',
      label: 'Available Units',
      children: [
        ['michigan', 'Michigan'],
        ['ohio', 'Ohio'],
        ['indiana', 'Indiana'],
      ],
    },
    {
      key: 'investors',
      label: 'Investors',
      // Shavit 8/4: "the order is wrong." Deal Case Studies sits ABOVE Invest
      // With Us on the page, so listing Invest first made walking down the menu
      // walk you up the page. Menu now reads in page order.
      children: [
        ['case-studies', 'Deal Case Studies'],
        ['invest', 'Invest With Us'],
      ],
    },
    {
      key: 'meet',
      label: 'Learn About Us',
    },
    {
      key: 'contact',
      label: 'Contact Us',
      href: '/#contact',
    },
  ]

  useEffect(() => {
    if (!open) return
    triggerRef.current = document.activeElement
    // Focus first overlay link
    const first = overlayRef.current && overlayRef.current.querySelector('a, button')
    if (first) first.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab') return
      const root = overlayRef.current
      if (!root) return
      const focusables = root.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null)
      if (!list.length) return
      const firstEl = list[0], lastEl = list[list.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') triggerRef.current.focus()
    }
  }, [open, onClose])

  return (
    // inert removes the hidden overlay's links from the tab order (CSS only
    // hides it visually); React 18 needs the empty-string form, not a boolean.
    <div ref={overlayRef} className={`overlay ${open ? 'overlay--open' : ''}`} aria-hidden={!open} inert={open ? undefined : ''} role="dialog" aria-modal={open ? 'true' : undefined} aria-label="Main menu">
      <button className="overlay__close" onClick={onClose} aria-label="Close menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>
      <nav className="overlay__nav">
        {groups.map((group) => (
          <div className="overlay__group" key={group.key}>
            {group.href ? (
              <a className="overlay__link" href={group.href} onClick={onClose}>
                {group.label}
              </a>
            ) : group.children ? (
              <span className="overlay__link overlay__link--static">{group.label}</span>
            ) : (
              <Link
                to={PATH_BY_KEY[group.key] || '/'}
                className={`overlay__link ${mounted && page === group.key ? 'overlay__link--active' : ''}`}
                aria-current={mounted && page === group.key ? 'page' : undefined}
                onClick={() => { onClose(); if (!PATH_BY_KEY[group.key]?.includes('#')) window.scrollTo({ top: 0 }) }}
              >
                {group.label}
              </Link>
            )}
            {group.desc && <span className="overlay__desc">{group.desc}</span>}
            {group.children && (
              <div className="overlay__sub">
                {group.children.map(([key, label]) => (
                  <Link
                    key={key}
                    to={PATH_BY_KEY[key] || '/'}
                    className={`overlay__sublink ${mounted && page === key ? 'overlay__link--active' : ''}`}
                    aria-current={mounted && page === key ? 'page' : undefined}
                    onClick={onClose}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="overlay__contact">
        <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        <span>·</span>
        <a href={CONTACT.igHref} target="_blank" rel="noopener noreferrer">{CONTACT.ig}</a>
      </div>
    </div>
  )
}
