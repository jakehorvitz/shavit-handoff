// components.jsx — verbatim port of the shared/atomic components from
// Shared.jsx + Polish.jsx + BlueprintHouse.jsx + IsraeliFlagBand.jsx +
// BrrrrIcon.jsx + HomesRevitalized.jsx (ProgressVision).
//
// Content delta applied:
//   - Btn/TriPaths formType no longer opens a Google-Forms modal; any
//     "Work With Me" / form CTA now navigates to /#reach (react-router).
//   - No Google-Forms references remain.

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useInView, Reveal, LineReveal } from './motion.jsx'
import { CONTACT, BRAND } from './data.js'

const PATH_BY_KEY = {
  home: '/', michigan: '/#michigan', ohio: '/#ohio', indiana: '/#indiana',
  standard: '/#standard', meet: '/meet', reach: '/#reach', accessibility: '/accessibility',
}

/* --- Photo / Video placeholder ----------------------------- */
export function Placeholder({ label, kind = 'photo', portrait = false, src, fallback, style, alt, decorative, filter, fit, objectPosition }) {
  const computedAlt = decorative
    ? ''
    : (alt || (label ? toSentenceCase(label) : ''))
  const fb = fallback === undefined ? '/assets/people/banner.jpg' : fallback
  const onError = fb ? (e) => {
    if (e.currentTarget.dataset.fb === '1') return
    e.currentTarget.dataset.fb = '1'
    e.currentTarget.src = fb
  } : undefined
  if (src) {
    const imgStyle = { filter }
    if (fit) imgStyle.objectFit = fit
    if (objectPosition) imgStyle.objectPosition = objectPosition
    return (
      <div className="ph-img" style={style}>
        <img
          src={src}
          srcSet={src.endsWith('.jpg') ? `${src.slice(0, -4)}-1024.jpg 1024w, ${src} 1600w` : undefined}
          sizes={src.endsWith('.jpg') ? '(max-width: 767px) 340px, 480px' : undefined}
          alt={computedAlt}
          aria-hidden={decorative ? 'true' : undefined}
          referrerPolicy="no-referrer"
          loading="lazy"
          width="480"
          height="715"
          onError={onError}
          style={imgStyle}
        />
      </div>
    )
  }
  return (
    <div
      className={`ph ${kind === 'video' ? 'ph--video' : ''} ${portrait ? 'ph--portrait' : ''}`}
      style={style}
      role="img"
      aria-label={computedAlt || 'Placeholder media'}
    >
      <div className="ph__center" aria-hidden="true">[ {label} ]</div>
      <div className="ph__tag" aria-hidden="true">{kind === 'video' ? 'Placeholder video' : 'Placeholder photo'}</div>
    </div>
  )
}

/* Convert "EXTERIOR — JACKSON COUNTY PROPERTY" -> "Exterior — Jackson County Property" */
function toSentenceCase(s) {
  if (!s) return ''
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m, c) => c.toUpperCase())
    .replace(/\bMi\b/g, 'MI')
    .replace(/\bOh\b/g, 'OH')
    .replace(/\bIn\b/g, 'IN')
    .replace(/\bIdf\b/g, 'IDF')
    .replace(/\bUs\b/g, 'US')
}

/* --- Hexagonal pause button -------------------------------- */
export function HexPauseButton({ onClick, controlled = false, paused: pausedProp = false }) {
  const [internalPaused, setInternalPaused] = useState(false)
  const paused = controlled ? pausedProp : internalPaused
  const handle = () => {
    if (!controlled) setInternalPaused(p => !p)
    onClick && onClick()
  }
  return (
    <button
      className="hex"
      aria-label={paused ? 'Play background video' : 'Pause background video'}
      onClick={handle}
    >
      <svg className="hex__shape" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon points="25,4 75,4 96,50 75,96 25,96 4,50" />
      </svg>
      {paused ? (
        <svg className="hex__glyph" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="6,4 20,12 6,20" />
        </svg>
      ) : (
        <svg className="hex__glyph" width="12" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      )}
    </button>
  )
}

/* --- Buttons / Links ---------------------------------------
   Content delta: a `formType` CTA (e.g. "Work With Me") now navigates
   to /#reach instead of opening a Google-Forms modal. */
export function Btn({ href, formType, children, variant = 'gold', onClick, target, ariaLabel }) {
  const navigate = useNavigate()
  const cls = `btn-base ${variant === 'gold' ? 'btn-gold' : 'btn-ghost'}`
  const handle = (e) => {
    if (formType) {
      e.preventDefault()
      navigate('/#reach')
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
    }
    if (onClick) onClick(e)
  }
  if (href) {
    return (
      <a className={cls} href={href} onClick={handle}
         target={target || (href.startsWith('http') ? '_blank' : undefined)}
         rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
         aria-label={ariaLabel}>
        {children}
      </a>
    )
  }
  return <button type="button" className={cls} onClick={handle} aria-label={ariaLabel}>{children}</button>
}

export function TLink({ href, gold, children, onClick, target }) {
  return (
    <a className={`tlink ${gold ? 'tlink--gold' : ''}`} href={href || '#'} onClick={onClick}
       target={target || (href && href.startsWith('http') ? '_blank' : undefined)}
       rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </a>
  )
}

export function Eyebrow({ gold = true, muted, children, style }) {
  const cls = `eyebrow ${muted ? 'eyebrow--muted' : (gold ? 'eyebrow--gold' : '')}`
  return <div className={cls} style={style}>{children}</div>
}

export function GoldRule({ wide = false, thick = false, style }) {
  return <hr className={`gold-rule ${wide ? 'gold-rule--wide' : ''} ${thick ? 'gold-rule--thick' : ''}`} style={style} />
}

/* --- Counter (animated on enter view) ---------------------- */
export function Counter({ to = 0, suffix = '', prefix = '', duration = 2000, delay = 800 }) {
  const ref = useRef(null)
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!ref.current) return
    // Reduced motion: skip the count-up, show the final value immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(to); return }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      const startTime = performance.now() + delay
      const tick = (t) => {
        if (t < startTime) { requestAnimationFrame(tick); return }
        const p = Math.min(1, (t - startTime) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setN(Math.round(to * eased))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
      io.disconnect()
    }, { threshold: 0.45 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to, duration, delay])
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>
}

/* --- Stat tile ---------------------------------------------- */
export function Stat({ value, label, placeholder = false, i = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  return (
    <div ref={ref} className={`stat ${inView ? 'is-in' : ''}`} data-i={i}>
      <span className="stat__rule" />
      <div className={placeholder ? 'stat__placeholder' : 'stat__val'}>
        {placeholder ? '[ FILL IN ]' : value}
      </div>
      <div className="stat__lbl stat__lbl-anim">{label}</div>
    </div>
  )
}

/* --- Three-path self-select ----------------------------------
   Content delta: formType paths now navigate to /#reach. */
export function TriPaths({ items }) {
  const inner = (it) => (
    <>
      <div className="tri__photo">
        <div className="tri__col__photo-zoom"><Placeholder label={it.photo} src={it.src} filter={it.filter} kind="photo" objectPosition={it.objectPosition || 'center center'} /></div>
      </div>
      <div className="tri__scrim" />
      <div className="tri__body">
        {it.label && <div className="tri__label">{it.label}</div>}
        {it.headline && <h3 className="tri__h">{it.headline}</h3>}
        {it.body && <p className="tri__p">{it.body}</p>}
        {it.cta && (it.goldCta ? (
          <span className="btn-base btn-gold" style={{ alignSelf: 'flex-start' }}>{it.cta} <span className="tri__col__arrow">→</span></span>
        ) : (
          <span className="tlink"><span>{it.cta}</span><span aria-hidden="true" className="tri__col__arrow">→</span></span>
        ))}
      </div>
      <span className="tri__col__rule" aria-hidden="true" />
    </>
  )
  return (
    <section className="tri">
      {items.map((it, i) => {
        // External link → real <a>; internal page or form → crawlable <Link>.
        if (it.href) {
          const external = it.href.startsWith('http')
          return (
            <a key={i} className="tri__col" href={it.href}
               target={external ? '_blank' : undefined}
               rel={external ? 'noopener noreferrer' : undefined}>
              {inner(it)}
            </a>
          )
        }
        const to = it.formType ? '/#reach' : (PATH_BY_KEY[it.page] || '/')
        return (
          <Link key={i} className="tri__col" to={to} onClick={() => window.scrollTo({ top: 0 })}>
            {inner(it)}
          </Link>
        )
      })}
    </section>
  )
}

/* --- Stats grid 4-up --------------------------------------- */
export function StatsGrid({ rows }) {
  return (
    <div className="stats">
      {rows.map((r, i) => <Stat key={i} i={i} {...r} />)}
    </div>
  )
}

/* --- Full-viewport video hero ------------------------------ */
export function VideoHero({
  eyebrow, eyebrowGold = false,
  h1, h1Lines,
  subTitle, sub, actions,
  height = 'full',
  align = 'left',
  videoLabel,
  videoSrc,
  poster,
  showProgress = true,
  showPause = true,
  blueprint = false,
}) {
  const videoRef = useRef(null)
  const [paused, setPaused] = useState(false)
  // Respect prefers-reduced-motion: don't autoplay the hero footage (WCAG 2.2.2 /
  // 2.3.3). The poster frame shows instead; the pause/play control lets users opt in.
  const [reduceMotion, setReduceMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  // Aggressively keep the video silent: re-mute on every event the browser fires
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const mute = () => {
      v.muted = true
      v.volume = 0
      v.defaultMuted = true
      if (v.audioTracks) {
        for (let i = 0; i < v.audioTracks.length; i++) {
          try { v.audioTracks[i].enabled = false } catch (e) {}
        }
      }
    }
    mute()
    const events = ['loadedmetadata', 'loadeddata', 'play', 'playing', 'canplay', 'canplaythrough', 'volumechange', 'timeupdate', 'seeked']
    events.forEach(ev => v.addEventListener(ev, mute))
    // Belt-and-suspenders: re-mute every 2s in case something else flips it
    const id = setInterval(mute, 2000)
    return () => {
      events.forEach(ev => v.removeEventListener(ev, mute))
      clearInterval(id)
    }
  }, [videoSrc])

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) { setPaused(p => !p); return }
    v.muted = true
    v.volume = 0
    if (v.paused) { v.play(); setPaused(false) }
    else { v.pause(); setPaused(true) }
  }

  return (
    <section className={`hero hero--enter ${blueprint ? 'hero--with-bp' : ''} ${height === '80vh' ? 'hero--80vh' : ''}`}>
      <div className="hero__media" aria-hidden="true">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="hero__video"
            src={videoSrc}
            poster={poster}
            autoPlay={!reduceMotion} muted loop playsInline
            preload={reduceMotion ? 'none' : 'metadata'}
            onLoadedMetadata={(e) => { e.currentTarget.muted = true; e.currentTarget.volume = 0 }}
            onPlay={(e) => { e.currentTarget.muted = true; e.currentTarget.volume = 0 }}
            aria-hidden="true"
            tabIndex="-1"
          />
        ) : (
          <Placeholder label={videoLabel} kind="video" decorative />
        )}
      </div>
      <div className="hero__scrim" />
      {blueprint && <BlueprintHouse />}
      <div className={`hero__inner ${align === 'center' ? 'hero__inner--center' : ''}`}>
        {eyebrow && <Eyebrow gold={eyebrowGold}>{eyebrow}</Eyebrow>}
        {subTitle && <div className="body-md" style={{ color: '#fff', marginTop: 8, opacity: 0.7 }}>{subTitle}</div>}
        {h1Lines
          ? <LineReveal as="h1" className="h-mega" lines={h1Lines} triggerOnView={false} baseDelay={600} lineDelay={150} style={{ marginTop: 24 }} />
          : <h1 className="h-mega" style={{ marginTop: 24 }}>{h1}</h1>
        }
        {sub && <p className="body-lg hero__sub">{sub}</p>}
        {actions && <div className="hero__actions">{actions}</div>}
      </div>
      {showPause && (
        <HexPauseButton onClick={togglePlay} controlled paused={paused} />
      )}
      {showProgress && <div className="hero__progress" />}
    </section>
  )
}

/* --- Pre-footer CTA band ----------------------------------- */
export function CtaBand({ eyebrow, h, hLines, actions, videoLabel = 'Cinematic Pan · Dusk Street', src, filter }) {
  return (
    <section className="cta-band hero--enter">
      <div className="cta-band__media"><Placeholder label={videoLabel} kind="video" src={src} filter={filter} /></div>
      <div className="cta-band__scrim" />
      <div className="cta-band__inner">
        {eyebrow && <Eyebrow gold>{eyebrow}</Eyebrow>}
        {hLines
          ? <LineReveal as="h2" className="h-mega" lines={hLines} triggerOnView baseDelay={0} lineDelay={200} style={{ marginTop: 24 }} />
          : <h2 className="h-mega" style={{ marginTop: 24 }}>{h}</h2>
        }
        {actions && <div className="hero__actions">{actions}</div>}
      </div>
    </section>
  )
}

/* ===============================================================
   Polish — CursorRing / ScrollProgress / FilmGrain / Watermark
   =============================================================== */

/* CursorRing — small gold ring that follows the mouse with lag. */
export function CursorRing() {
  const ringRef = useRef(null)
  const stateRef = useRef({ tx: 0, ty: 0, x: 0, y: 0, hov: false })

  useEffect(() => {
    const isTouch = matchMedia('(hover: none)').matches
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || reduce) return
    document.body.classList.add('has-cursor-ring')

    const s = stateRef.current
    const onMove = (e) => {
      s.tx = e.clientX
      s.ty = e.clientY
    }
    const onOver = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      const hov = !!t.closest('a, button, [role="button"], .tri__col, .ccard, .qcard, .opt, .cstudy__media, .deep__media, .endorse')
      if (hov !== s.hov) {
        s.hov = hov
        ringRef.current && ringRef.current.classList.toggle('cursor-ring--hover', hov)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })

    let raf = 0
    const tick = () => {
      s.x += (s.tx - s.x) * 0.18
      s.y += (s.ty - s.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.x - 16}px, ${s.y - 16}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-cursor-ring')
    }
  }, [])

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
}

/* ScrollProgress — fixed 2px gold bar at top of page. */
export function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const doc = document.documentElement
        const max = doc.scrollHeight - window.innerHeight
        const t = max <= 0 ? 0 : Math.max(0, Math.min(1, window.scrollY / max))
        if (ref.current) ref.current.style.transform = `scaleX(${t})`
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return <div className="scroll-progress" aria-hidden="true"><span ref={ref} /></div>
}

/* FilmGrain — fullscreen noise at ~3% opacity. Pre-rendered PNG tile, NOT a
   live SVG feTurbulence filter: WebKit software-rasterizes turbulence over the
   whole viewport and re-rasterizes on every Safari toolbar collapse/expand,
   which OOM-kills the WebContent process on real iPhones. */
export function FilmGrain() {
  return <div className="film-grain" aria-hidden="true" />
}

/* Watermark — subtle repeating diagonal brand mark across the page. */
export function Watermark({ text = BRAND.toUpperCase() }) {
  const cell = `${text} · `
  const line = cell.repeat(8)
  return (
    <div className="watermark" aria-hidden="true">
      <div className="watermark__rows">
        {Array.from({ length: 14 }).map((_, i) => (
          <div className="watermark__row" key={i}>{line}</div>
        ))}
      </div>
    </div>
  )
}

/* ===============================================================
   BlueprintHouse — isometric wireframe house drawn in thin gold.
   =============================================================== */
export function BlueprintHouse({ size = 720 }) {
  const ref = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    if (!ref.current) return
    const paths = ref.current.querySelectorAll('.bp-line')
    paths.forEach((p, i) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = String(len)
      p.style.strokeDashoffset = String(len)
      p.getBoundingClientRect()  // force reflow
      p.style.transition = `stroke-dashoffset 1500ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 90}ms, opacity 800ms ease ${600 + i * 90}ms`
      p.style.strokeDashoffset = '0'
      p.style.opacity = '1'
    })
  }, [])

  return (
    <div className="bp" aria-hidden="true">
      <div className="bp__glow" />
      <div className="bp__stage">
        <svg
          ref={ref}
          className="bp__svg"
          viewBox="-200 -200 400 400"
          width={size}
          height={size}
        >
          <defs>
            <filter id="bpGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            stroke="#FFC000"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#bpGlow)"
            style={{ opacity: 0.95 }}
          >
            {/* Ground plane (faint) */}
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.25 }} d="M-180 100 L 180 100" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.25 }} d="M-180 100 L -120 130" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.25 }} d="M 180 100 L 120 130" />

            {/* Front face (parallelogram) */}
            <path className="bp-line" style={{ opacity: 0 }} d="M-100 100 L 100 100 L 100 -20 L -100 -20 Z" />

            {/* Side face (rear-right) */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 100 100 L 160 60 L 160 -60 L 100 -20" />

            {/* Top of side face line */}
            <path className="bp-line" style={{ opacity: 0 }} d="M -100 -20 L -40 -60 L 160 -60" />

            {/* Front gable roof */}
            <path className="bp-line" style={{ opacity: 0 }} d="M -100 -20 L 0 -90 L 100 -20" />

            {/* Side roof slope */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 0 -90 L 60 -130 L 160 -60" />

            {/* Ridge */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 0 -90 L 60 -130" />

            {/* Door — front face */}
            <path className="bp-line" style={{ opacity: 0 }} d="M -25 100 L -25 30 L 25 30 L 25 100" />

            {/* Door panel detail */}
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.6 }} d="M 0 30 L 0 100" />

            {/* Left window */}
            <path className="bp-line" style={{ opacity: 0 }} d="M -80 20 L -55 20 L -55 -5 L -80 -5 Z" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.5 }} d="M -67.5 20 L -67.5 -5 M -80 7.5 L -55 7.5" />

            {/* Right window */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 55 20 L 80 20 L 80 -5 L 55 -5 Z" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.5 }} d="M 67.5 20 L 67.5 -5 M 55 7.5 L 80 7.5" />

            {/* Side window */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 120 0 L 140 -10 L 140 -35 L 120 -25 Z" />

            {/* Chimney */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 35 -110 L 35 -135 L 55 -145 L 55 -120 Z" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.5 }} d="M 35 -135 L 55 -145" />

            {/* Foundation hash */}
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.45 }} d="M -100 100 L -100 112 L 100 112 L 100 100" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.45 }} d="M 100 112 L 160 72" />

            {/* Reference vertical line at front-left corner */}
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.4 }} d="M -100 -20 L -100 100" />
            <path className="bp-line" style={{ opacity: 0, strokeOpacity: 0.4 }} d="M 100 -20 L 100 100" />
          </g>
        </svg>
      </div>
    </div>
  )
}

/* ===============================================================
   IsraeliFlagBand — animated Israeli flag with drawn Star of David.
   =============================================================== */
export function IsraeliFlagBand() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const paths = ref.current.querySelectorAll('.flag-draw')
    paths.forEach((p, i) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = String(len)
      p.style.strokeDashoffset = String(len)
      p.getBoundingClientRect()
      p.style.transition = `stroke-dashoffset 2000ms cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 120}ms, opacity 600ms ease ${300 + i * 120}ms`
      p.style.strokeDashoffset = '0'
      p.style.opacity = '1'
    })
  }, [])

  return (
    <section className="flag-band" aria-label="Israeli flag — IDF service">
      <div className="flag-band__bg" aria-hidden="true" />
      <div className="flag-band__stage">
        <svg
          ref={ref}
          className="flag-svg"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <pattern id="flagWave" x="0" y="0" width="1000" height="600" patternUnits="userSpaceOnUse">
              <rect width="1000" height="600" fill="rgba(245,239,225,0.04)" />
            </pattern>

            <filter id="flagGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.2" />
            </filter>
          </defs>

          {/* Faint flag-shape outline */}
          <g className="flag-cloth">
            <path
              className="flag-draw flag-outline"
              d="M 60 90 L 940 90 L 940 510 L 60 510 Z"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(245,239,225,0.18)"
              strokeWidth="1"
              style={{ opacity: 0 }}
            />
          </g>

          {/* Top blue stripe */}
          <g className="flag-stripe flag-stripe--top">
            <path
              className="flag-draw"
              d="M 60 150 L 940 150 L 940 210 L 60 210 Z"
              fill="rgba(43, 78, 148, 0.0)"
              stroke="rgb(80, 130, 220)"
              strokeWidth="1.5"
              style={{ opacity: 0 }}
            />
            <path
              className="flag-fill flag-fill--top"
              d="M 60 150 L 940 150 L 940 210 L 60 210 Z"
              fill="rgb(50, 100, 200)"
              opacity="0"
            />
          </g>

          {/* Bottom blue stripe */}
          <g className="flag-stripe flag-stripe--bot">
            <path
              className="flag-draw"
              d="M 60 390 L 940 390 L 940 450 L 60 450 Z"
              fill="rgba(43, 78, 148, 0.0)"
              stroke="rgb(80, 130, 220)"
              strokeWidth="1.5"
              style={{ opacity: 0 }}
            />
            <path
              className="flag-fill flag-fill--bot"
              d="M 60 390 L 940 390 L 940 450 L 60 450 Z"
              fill="rgb(50, 100, 200)"
              opacity="0"
            />
          </g>

          {/* Star of David — two overlapping triangles */}
          <g className="flag-star" filter="url(#flagGlow)">
            <path
              className="flag-draw flag-star-tri flag-star-tri--up"
              d="M 500 230 L 580 370 L 420 370 Z"
              fill="none"
              stroke="rgb(80, 130, 220)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
            <path
              className="flag-draw flag-star-tri flag-star-tri--down"
              d="M 500 370 L 580 230 L 420 230 Z"
              fill="none"
              stroke="rgb(80, 130, 220)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
          </g>
        </svg>
      </div>

      {/* Caption — small label inside the band */}
      <div className="flag-band__caption">
        <span className="eyebrow eyebrow--gold">Service · 2009&ndash;2013</span>
        <h3 className="h-md flag-band__title">Israeli Defense Forces</h3>
        <p className="flag-band__sub">Discipline. Resilience. Execution.</p>
      </div>
    </section>
  )
}

/* ===============================================================
   BrrrrIcon — small architectural SVG icons for BRRRR pillars.
   =============================================================== */
export function BrrrrIcon({ kind }) {
  if (kind === 'key') {
    return (
      <svg className="brrrr__icon brrrr__icon--key" viewBox="0 0 48 48" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="key-spin">
            <circle cx="14" cy="24" r="7" />
            <circle cx="14" cy="24" r="2.5" fill="currentColor" stroke="none" />
          </g>
          <path d="M21 24 L40 24" />
          <path d="M34 24 L34 30" />
          <path d="M30 24 L30 28" />
        </g>
      </svg>
    )
  }
  if (kind === 'hammer') {
    return (
      <svg className="brrrr__icon brrrr__icon--hammer" viewBox="0 0 48 48" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <g className="hammer-tap">
            <path d="M8 12 L20 12 L24 16 L20 20 L8 20 Z" />
            <path d="M20 16 L36 32" />
            <path d="M34 30 L40 36" strokeWidth="2.5" />
          </g>
          <path d="M30 40 L42 40" className="hammer-anvil" />
        </g>
      </svg>
    )
  }
  if (kind === 'door') {
    return (
      <svg className="brrrr__icon brrrr__icon--door" viewBox="0 0 48 48" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 8 L10 40 L38 40" />
          <g className="door-swing">
            <path d="M10 8 L30 8 L30 40 L10 40 Z" />
            <circle cx="26" cy="24" r="1" fill="currentColor" stroke="none" />
          </g>
        </g>
      </svg>
    )
  }
  if (kind === 'coins') {
    return (
      <svg className="brrrr__icon brrrr__icon--coins" viewBox="0 0 48 48" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="24" cy="40" rx="14" ry="3.5" className="coin coin--3" />
          <ellipse cx="24" cy="30" rx="14" ry="3.5" className="coin coin--2" />
          <ellipse cx="24" cy="20" rx="14" ry="3.5" className="coin coin--1" />
          <path d="M10 40 L10 20" strokeOpacity="0.5" />
          <path d="M38 40 L38 20" strokeOpacity="0.5" />
        </g>
      </svg>
    )
  }
  // loop / repeat — circular arrow
  return (
    <svg className="brrrr__icon brrrr__icon--loop" viewBox="0 0 48 48" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g className="loop-spin">
          <path d="M10 24 A 14 14 0 1 1 38 24" />
          <path d="M34 18 L38 24 L44 22" />
          <path d="M38 24 A 14 14 0 1 1 10 24" strokeOpacity="0.35" />
        </g>
      </g>
    </svg>
  )
}

/* ===============================================================
   ProgressVision — unified Progress + 2030 Vision section.
   =============================================================== */
const HOMES_DONE = 27
const HOMES_GOAL = 100
const TAGLINES = ['Michigan', 'Ohio', 'Indiana']

const MILESTONES = [
  { value: 100, label: 'Homes Revitalized',  sub: 'Hillsdale, MI' },
  { value: 200, label: 'Doors Operated',     sub: 'Across Midwest Markets' },
  { value: 25,  label: 'Jobs Created',       sub: 'Locally, on the ground' },
]

export function ProgressVision() {
  const sectionRef = useRef(null)
  const [activated, setActivated] = useState(0)
  const [taglineIdx, setTaglineIdx] = useState(0)

  useEffect(() => {
    if (!sectionRef.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      if (reduce) { setActivated(HOMES_DONE); return }
      const duration = 1800
      const start = performance.now()
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration)
        const eased = 1 - Math.pow(1 - p, 3)
        setActivated(Math.round(HOMES_DONE * eased))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.3 })
    io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = setInterval(() => setTaglineIdx(i => (i + 1) % TAGLINES.length), 3000)
    return () => clearInterval(id)
  }, [])

  const pct = Math.round((HOMES_DONE / HOMES_GOAL) * 100)

  return (
    <section ref={sectionRef} className="progvis band band--navy">
      <div className="band__inner">
        <div className="progvis__head">
          <Reveal mode="fade"><Eyebrow gold>The 2030 Vision</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['27 done.', '73 to go.']} lineDelay={200} />
          <Reveal mode="fade" delay={900}>
            <p className="body-lg" style={{ maxWidth: 680, marginTop: 16 }}>
              The plan: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, and 25 jobs created locally by 2030. We&rsquo;re {pct}% of the way to the first milestone.
            </p>
          </Reveal>
        </div>

        <div className="progvis__grid">
          {/* LEFT — big counter + tile grid */}
          <div className="progvis__left">
            <div className="progvis__counter-wrap">
              <div className="progvis__counter" aria-label={`${HOMES_DONE} homes revitalized so far`}>
                <Counter to={HOMES_DONE} duration={1800} delay={0} />
              </div>
              <div className="progvis__counter-suffix">/ {HOMES_GOAL}</div>
            </div>
            <div className="progvis__label">Homes Revitalized to Date</div>
            <div className="progvis__rule" />
            <div className="progvis__taglines" aria-live="polite">
              {TAGLINES.map((t, i) => (
                <span key={i} className={`progvis__tag ${i === taglineIdx ? 'is-on' : ''}`}>{t}</span>
              ))}
            </div>
            <div className="progvis__tile-grid" aria-hidden="true">
              {Array.from({ length: HOMES_GOAL }).map((_, i) => (
                <span key={i} className={`progvis__tile ${i < activated ? 'is-on' : ''}`}>
                  <svg viewBox="0 0 24 24" width="100%" height="100%">
                    <path d="M2 12 L12 3 L22 12 L20 12 L20 21 L14 21 L14 14 L10 14 L10 21 L4 21 L4 12 Z"
                          fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — milestones ladder */}
          <div className="progvis__right">
            <div className="progvis__milestones-head">By 2030</div>
            {MILESTONES.map((m, i) => (
              <Reveal key={i} as="div" mode="rise-sm" delay={200 + i * 200} className="progvis__milestone">
                <div className="progvis__milestone-num">
                  <Counter to={m.value} duration={1600 + i * 200} />
                </div>
                <div className="progvis__milestone-body">
                  <div className="progvis__milestone-label">{m.label}</div>
                  <div className="progvis__milestone-sub">{m.sub}</div>
                </div>
              </Reveal>
            ))}
            <Reveal mode="fade" delay={1400} className="progvis__signoff">
              <p>&ldquo;Just getting started.&rdquo;</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
