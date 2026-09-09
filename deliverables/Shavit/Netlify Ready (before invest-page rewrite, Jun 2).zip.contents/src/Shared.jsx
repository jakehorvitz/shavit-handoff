/* global React */
const { useState, useEffect, useRef } = React;

const URLS = {
  work:   'https://docs.google.com/forms/d/e/1FAIpQLSdr6YaVQqR0QnvWQkbaTFhbN2HY3kYqCeGSIIg2LuWKyKz9yw/viewform',
  invest: 'https://docs.google.com/forms/d/e/1FAIpQLSdbfNjiZegvReucCHrXQLLc21KBEbKYsKHXwjb9WcpSbVq5rQ/viewform',
};

const CONTACT = {
  email: 'info@shavitrootman.com',
  phone: '+1 (805) 364-4415',
  phoneHref: 'tel:+18053644415',
  ig: '@shavitness',
  igHref: 'https://instagram.com/shavitness',
  li: '/in/shavitrootman',
  liHref: 'https://linkedin.com/in/shavitrootman',
};

/* --- Photo / Video placeholder ----------------------------- */
function Placeholder({ label, kind = 'photo', portrait = false, src, fallback, style, alt, decorative, filter, fit, objectPosition }) {
  const computedAlt = decorative
    ? ''
    : (alt || (label ? toSentenceCase(label) : ''));
  const fb = fallback === undefined ? 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/banner.jpg' : fallback;
  const onError = fb ? (e) => {
    if (e.currentTarget.dataset.fb === '1') return;
    e.currentTarget.dataset.fb = '1';
    e.currentTarget.src = fb;
  } : undefined;
  if (src) {
    const imgStyle = { filter };
    if (fit) imgStyle.objectFit = fit;
    if (objectPosition) imgStyle.objectPosition = objectPosition;
    return (
      <div className="ph-img" style={style}>
        <img
          src={src}
          alt={computedAlt}
          aria-hidden={decorative ? 'true' : undefined}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={onError}
          style={imgStyle}
        />
      </div>
    );
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
  );
}

/* Convert "EXTERIOR — JACKSON COUNTY PROPERTY" → "Exterior — Jackson County Property" */
function toSentenceCase(s) {
  if (!s) return '';
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (m, c) => c.toUpperCase())
    .replace(/\bMi\b/g, 'MI')
    .replace(/\bOh\b/g, 'OH')
    .replace(/\bIn\b/g, 'IN')
    .replace(/\bIdf\b/g, 'IDF')
    .replace(/\bUs\b/g, 'US');
}

/* --- Real photography (local + remote) ----------------------
   res(id, url) returns a bundled blob URL (window.__resources[id])
   when present (standalone export), else the literal URL (live site). */
function res(id, url) {
  return (typeof window !== 'undefined' && window.__resources && window.__resources[id]) || url;
}

const HERO_VIDEO = res('heroVideo', 'uploads/Cinematic Real Estate Videography _ Sony FX3.mp4');

const SHAVIT_PHOTOS = {
  /* Primary studio portrait (uploaded direct by user) */
  portrait:  res('portrait', 'assets/shavit-portrait.png'),

  /* Official LinkedIn photos */
  portraitLI:    res('portraitLI',    'assets/photos/06_shavit_portrait.jpeg'),
  loPresto:      res('loPresto',      'assets/photos/01_hillsdale_17_lo_presto.jpeg'),
  chargerLogo:   res('chargerLogo',   'assets/photos/02_charger_logo.jpeg'),
  secondChance:  res('secondChance',  'assets/photos/03_second_chance_house.jpeg'),
  senatorLetter: res('senatorLetter', 'assets/photos/04_senator_roberts_letter.jpeg'),
  israelFlag:    res('israelFlag',    'assets/photos/05_israel_flag.jpeg'),
  amEquipment:   res('amEquipment',   'assets/photos/07_amequipment_tradeshow.jpeg'),
  birthrightPS:  res('birthrightPS',  'assets/photos/10_birthright_palm_springs.jpeg'),
  birthrightLA:  res('birthrightLA',  'assets/photos/11_birthright_la_gala.jpeg'),
  architecture:  res('architecture',  'assets/photos/12_architecture.jpeg'),

  /* Substack-sourced photography (Jan/Feb/May 2024 posts) */
  ssHillsdale:    'https://substackcdn.com/image/fetch/$s_!kCIk!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2e4be312-3ea5-46f4-a444-ebc2521711a5_1140x641.jpeg',
  ssOrgChem:      'https://substackcdn.com/image/fetch/$s_!Chj3!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4677fec6-1ca3-4a75-8b4d-bf3116106f37_4032x3024.jpeg',
  ssClubBooth:    'https://substackcdn.com/image/fetch/$s_!OM5O!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F35542f41-1542-4ec1-8f16-8e91ac1ddc7e_938x796.png',
  ssMarketTrends: 'https://substackcdn.com/image/fetch/$s_!EDm0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff0200da3-c3cb-4560-9267-ad8f4367c8fc_1384x754.png',
  ssThankful:     'https://substackcdn.com/image/fetch/$s_!slQX!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7c2060b2-ae52-499d-a84b-8772790feca5_876x928.png',
  ssTwoGen:       'https://substackcdn.com/image/fetch/$s_!6JhI!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9ea68d7-185d-4fce-8fff-e2c6decd746c_1536x2048.jpeg',
  ssCampusProtest:'https://substackcdn.com/image/fetch/$s_!eklj!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc4d5cf25-6a2a-4cfe-b6b9-7db5c78c57ae_1626x452.png',
  ssThreeHomes:   'https://substackcdn.com/image/fetch/$s_!fvyL!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffa41a1d3-844d-4531-a7c5-716eb8ec02f8_1438x350.png',

  /* Existing remote attribution photos */
  banner:    'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/banner.jpg',
  gary:      'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/gary.png',
  jef:       'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/jef.png',
  nicky:     'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/pro.png',
};

/* --- Stock photography (Unsplash) for variety. Cropped on-the-fly. -- */
const U = (id, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
const STOCK = {
  // Property exteriors
  luxuryDusk:    U('photo-1564013799919-ab600027ffc6'),
  modernWhite:   U('photo-1568605114967-8130f3a36994'),
  suburbStreet:  U('photo-1570129477492-45c003edd2be'),
  craftsmanHome: U('photo-1605146768851-eda79da39897'),

  // Interiors
  livingRoom:    U('photo-1600585154340-be6161a56a0c'),
  studyDesk:     U('photo-1564540586988-aa4e53c3d799'),

  // City / Cleveland
  cityDusk:      U('photo-1496564203457-11bb12075d90'),
  brickFacade:   U('photo-1486325212027-8081e485255e'),

  // Operations / office
  meeting:       U('photo-1521791136064-7986c2920216'),
  deskDocs:      U('photo-1554224155-6726b3ff858f'),
  signingDeal:   U('photo-1450101499163-c8848c66ca85'),
  deskCalm:      U('photo-1454165804606-c3d57bc86b40'),

  // Meet Shavit — thematic photo bands
  desertLand:    U('photo-1542621334-a254cf47733d'),
  snowyTown:     U('photo-1480497490787-505ec076689f'),
  aerialField:   U('photo-1500382017468-9049fed747ef'),

  // Hero / video stand-ins (kept moody for scrims)
  aerialHouse:   U('photo-1582268611958-ebfd161ef9cf'),
};

/* --- Hexagonal pause button -------------------------------- */
function HexPauseButton({ onClick, controlled = false, paused: pausedProp = false }) {
  const [internalPaused, setInternalPaused] = useState(false);
  const paused = controlled ? pausedProp : internalPaused;
  const handle = () => {
    if (!controlled) setInternalPaused(p => !p);
    onClick && onClick();
  };
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
  );
}

/* --- Buttons / Links --------------------------------------- */
function Btn({ href, formType, children, variant = 'gold', onClick, target, ariaLabel }) {
  const cls = `btn-base ${variant === 'gold' ? 'btn-gold' : 'btn-ghost'}`;
  const handle = (e) => {
    if (formType) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-form-modal', { detail: { type: formType } }));
    }
    if (onClick) onClick(e);
  };
  if (href) {
    return (
      <a className={cls} href={href} onClick={handle}
         target={target || (href.startsWith('http') ? '_blank' : undefined)}
         rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
         aria-label={ariaLabel}>
        {children}
      </a>
    );
  }
  return <button type="button" className={cls} onClick={handle} aria-label={ariaLabel}>{children}</button>;
}

function TLink({ href, gold, children, onClick, target }) {
  return (
    <a className={`tlink ${gold ? 'tlink--gold' : ''}`} href={href || '#'} onClick={onClick}
       target={target || (href && href.startsWith('http') ? '_blank' : undefined)}
       rel={href && href.startsWith('http') ? 'noopener noreferrer' : undefined}>
      <span>{children}</span>
      <span aria-hidden="true">→</span>
    </a>
  );
}

function Eyebrow({ gold = true, muted, children, style }) {
  const cls = `eyebrow ${muted ? 'eyebrow--muted' : (gold ? 'eyebrow--gold' : '')}`;
  return <div className={cls} style={style}>{children}</div>;
}

function GoldRule({ wide = false, thick = false, style }) {
  return <hr className={`gold-rule ${wide ? 'gold-rule--wide' : ''} ${thick ? 'gold-rule--thick' : ''}`} style={style} />;
}

/* --- Counter (animated on enter view) ---------------------- */
function Counter({ to = 0, suffix = '', prefix = '', duration = 2000, delay = 800 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const startTime = performance.now() + delay;
      const tick = (t) => {
        if (t < startTime) { requestAnimationFrame(tick); return; }
        const p = Math.min(1, (t - startTime) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, { threshold: 0.45 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration, delay]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

/* --- Stat tile ---------------------------------------------- */
function Stat({ value, label, placeholder = false, i = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <div ref={ref} className={`stat ${inView ? 'is-in' : ''}`} data-i={i}>
      <span className="stat__rule" />
      <div className={placeholder ? 'stat__placeholder' : 'stat__val'}>
        {placeholder ? '[ FILL IN ]' : value}
      </div>
      <div className="stat__lbl stat__lbl-anim">{label}</div>
    </div>
  );
}

/* --- Three-path self-select ---------------------------------- */
function TriPaths({ items, onNav }) {
  return (
    <section className="tri">
      {items.map((it, i) => (
        <a
          key={i}
          className="tri__col"
          href={it.href || (it.formType ? '#' : undefined)}
          target={it.href && it.href.startsWith('http') ? '_blank' : undefined}
          rel={it.href && it.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          onClick={(e) => {
            if (it.formType) {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-form-modal', { detail: { type: it.formType } }));
              return;
            }
            if (it.page) { e.preventDefault(); onNav && onNav(it.page); window.scrollTo({ top: 0 }); }
          }}
        >
          <div className="tri__photo">
            <div className="tri__col__photo-zoom"><Placeholder label={it.photo} src={it.src} filter={it.filter} kind="photo" /></div>
          </div>
          <div className="tri__scrim" />
          <div className="tri__body">
            <div className="tri__label">{it.label}</div>
            <h3 className="tri__h">{it.headline}</h3>
            <p className="tri__p">{it.body}</p>
            {it.goldCta ? (
              <span className="btn-base btn-gold" style={{ alignSelf: 'flex-start' }}>{it.cta} <span className="tri__col__arrow">→</span></span>
            ) : (
              <span className="tlink"><span>{it.cta}</span><span aria-hidden="true" className="tri__col__arrow">→</span></span>
            )}
          </div>
          <span className="tri__col__rule" aria-hidden="true" />
        </a>
      ))}
    </section>
  );
}

/* --- Stats grid 4-up --------------------------------------- */
function StatsGrid({ rows }) {
  return (
    <div className="stats">
      {rows.map((r, i) => <Stat key={i} i={i} {...r} />)}
    </div>
  );
}

/* --- Full-viewport video hero ------------------------------ */
function VideoHero({
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
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Aggressively keep the video silent: re-mute on every event the browser fires
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const mute = () => {
      v.muted = true;
      v.volume = 0;
      v.defaultMuted = true;
      if (v.audioTracks) {
        for (let i = 0; i < v.audioTracks.length; i++) {
          try { v.audioTracks[i].enabled = false; } catch (e) {}
        }
      }
    };
    mute();
    const events = ['loadedmetadata', 'loadeddata', 'play', 'playing', 'canplay', 'canplaythrough', 'volumechange', 'timeupdate', 'seeked'];
    events.forEach(ev => v.addEventListener(ev, mute));
    // Belt-and-suspenders: re-mute every 2s in case something else flips it
    const id = setInterval(mute, 2000);
    return () => {
      events.forEach(ev => v.removeEventListener(ev, mute));
      clearInterval(id);
    };
  }, [videoSrc]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) { setPaused(p => !p); return; }
    v.muted = true;
    v.volume = 0;
    if (v.paused) { v.play(); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  return (
    <section className={`hero hero--enter ${blueprint ? 'hero--with-bp' : ''} ${height === '80vh' ? 'hero--80vh' : ''}`}>
      <div className="hero__media" aria-hidden="true">
        {videoSrc ? (
          <video
            ref={videoRef}
            className="hero__video"
            src={videoSrc}
            poster={poster}
            autoPlay muted loop playsInline preload="auto"
            onLoadedMetadata={(e) => { e.currentTarget.muted = true; e.currentTarget.volume = 0; }}
            onPlay={(e) => { e.currentTarget.muted = true; e.currentTarget.volume = 0; }}
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
          : <h1 className="h-mega" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: h1 }} />
        }
        {sub && <p className="body-lg hero__sub">{sub}</p>}
        {actions && <div className="hero__actions">{actions}</div>}
      </div>
      {showPause && (
        <HexPauseButton onClick={togglePlay} controlled paused={paused} />
      )}
      {showProgress && <div className="hero__progress" />}
    </section>
  );
}

/* --- Pre-footer CTA band ----------------------------------- */
function CtaBand({ eyebrow, h, hLines, actions, videoLabel = 'Cinematic Pan · Dusk Street', src, filter }) {
  return (
    <section className="cta-band hero--enter">
      <div className="cta-band__media"><Placeholder label={videoLabel} kind="video" src={src} filter={filter} /></div>
      <div className="cta-band__scrim" />
      <div className="cta-band__inner">
        {eyebrow && <Eyebrow gold>{eyebrow}</Eyebrow>}
        {hLines
          ? <LineReveal as="h2" className="h-mega" lines={hLines} triggerOnView baseDelay={0} lineDelay={200} style={{ marginTop: 24 }} />
          : <h2 className="h-mega" style={{ marginTop: 24 }} dangerouslySetInnerHTML={{ __html: h }} />
        }
        {actions && <div className="hero__actions">{actions}</div>}
      </div>
    </section>
  );
}

/* --- (legacy duplicate removed — see top of file for active TriPaths/StatsGrid) --- */

Object.assign(window, {
  URLS, CONTACT, SHAVIT_PHOTOS, STOCK, HERO_VIDEO,
  Placeholder, HexPauseButton, Btn, TLink, Eyebrow, GoldRule,
  Counter, Stat, StatsGrid, VideoHero, CtaBand, TriPaths,
});
