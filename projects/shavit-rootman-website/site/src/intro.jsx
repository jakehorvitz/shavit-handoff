// intro.jsx — brand-mark splash only (7/14 revision v2, after Jake's live review).
//
// The montage no longer lives here. It REPLACES the hero video as the hero
// media itself — see MontageHero in tenant-pages.jsx. Lesson from the live
// review: while this overlay is up it eats every click, which is exactly how
// the top-right Contact button read as "dead" when the old 7-second montage
// overlay played on every load. So this splash is SHORT, and ANY key or
// pointer press skips it instantly.
//
// Plays every page load / new tab by design (no session gate — Jake 7/14).
// Client-only: returns null during SSR; the static #boot-cover in index.html
// holds first paint so no listing photo flashes before this mounts.

import { useState, useEffect } from 'react'
import { BRAND, SUBLINE } from './data.js'

const BRAND_MS = 1800   // brand mark hold (short — this overlay blocks clicks)
const OUT_MS = 600      // lift-away

export function LogoIntro() {
  // 'idle' until the mount effect decides; SSR renders null.
  const [phase, setPhase] = useState('idle') // idle | brand | out | gone

  // Remove the static first-paint cover the moment the real intro takes over
  // (or the moment we decide not to play at all).
  const dropBootCover = () => {
    const cover = document.getElementById('boot-cover')
    if (cover) cover.remove()
  }

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || window.location.hash) {
      dropBootCover()
      setPhase('gone')
      return
    }
    dropBootCover()
    setPhase('brand')
    const timers = [
      setTimeout(() => setPhase('out'), BRAND_MS),
      setTimeout(() => setPhase('gone'), BRAND_MS + OUT_MS),
    ]
    // WCAG 2.2.1 + the dead-button lesson: ANY key or pointer press skips the
    // splash, so nothing the user aims at can ever feel unresponsive.
    const skip = () => { timers.forEach(clearTimeout); setPhase('gone') }
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [])

  useEffect(() => {
    if (phase === 'idle' || phase === 'gone') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [phase])

  if (phase === 'idle' || phase === 'gone') return null

  const splitLetters = (word, baseDelay) =>
    word.split('').map((ch, i) => (
      <span key={i} className="intro__letter" style={{ animationDelay: `${baseDelay + i * 60}ms` }}>
        {ch}
      </span>
    ))

  return (
    <div className={`intro intro--${phase === 'out' ? 'out' : 'in'}`}>
      <div className="intro__bg" />
      <div className="intro__halo" />
      <div className="intro__mark" aria-hidden="true">
        <svg className="intro__house" viewBox="0 0 96 64" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path className="intro__house-path" d="M8 56 L8 30 L48 8 L88 30 L88 56 L8 56 Z" />
            <path className="intro__house-path" d="M40 56 L40 36 L56 36 L56 56" />
            <path className="intro__house-path" d="M8 56 L88 56" strokeWidth="2" />
          </g>
        </svg>
        <span className="intro__rule intro__rule--top" />
        <span className="intro__line intro__line--a" aria-label={BRAND.split(' ')[0]}>
          {splitLetters(BRAND.split(' ')[0].toUpperCase(), 400)}
        </span>
        <span className="intro__line intro__line--b" aria-label={BRAND.split(' ').slice(1).join(' ')} style={{ fontSize: 'clamp(18px, 3vw, 38px)', letterSpacing: '0.28em' }}>
          {splitLetters(BRAND.split(' ').slice(1).join(' ').toUpperCase(), 700)}
        </span>
        <span className="intro__rule intro__rule--bottom" />
        <span className="intro__caption">{SUBLINE}</span>
      </div>
    </div>
  )
}
