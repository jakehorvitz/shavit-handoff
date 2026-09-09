/* Shavit Rootman — pre-compiled bundle (JSX transpiled at build time). */

/* ===== Motion.jsx ===== */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
// Motion primitives — IntersectionObserver-driven reveals + line reveals.
// Mounted before page components in load order so they can use these.

const {
  useState: useMotionState,
  useEffect: useMotionEffect,
  useRef: useMotionRef
} = React;

/* useInView — fires once when element passes threshold */
function useInView({
  threshold = 0.3,
  rootMargin = '0px 0px -10% 0px'
} = {}) {
  const ref = useMotionRef(null);
  const [inView, setInView] = useMotionState(false);
  useMotionEffect(() => {
    if (!ref.current) return;
    if (inView) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, {
      threshold,
      rootMargin
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold, rootMargin, inView]);
  return [ref, inView];
}

/* Reveal — generic wrapper that applies data-reveal once in view */
function Reveal({
  as = 'div',
  mode = 'rise',
  delay = 0,
  duration,
  threshold = 0.3,
  className = '',
  style = {},
  children,
  ...rest
}) {
  const [ref, inView] = useInView({
    threshold
  });
  const Tag = as;
  const finalStyle = {
    transitionDelay: delay ? `${delay}ms` : undefined,
    ...style
  };
  if (duration) finalStyle.transitionDuration = duration;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    "data-reveal": mode,
    className: `${inView ? 'is-in' : ''} ${className}`,
    style: finalStyle
  }, rest), children);
}

/* LineReveal — a heading split into lines, each line gets a gold hairline
   reveal under it and rises into place. Pass `lines` array of strings.
   When `triggerOnView` is true the reveal fires via IntersectionObserver;
   otherwise it fires on mount (used in heroes that animate immediately). */
function LineReveal({
  as = 'h1',
  lines,
  className = '',
  triggerOnView = true,
  threshold = 0.3,
  lineDelay = 200,
  baseDelay = 0,
  settleAfter = 1400,
  // ms — when to fade out the gold rule
  style = {}
}) {
  const [ref, inViewIO] = useInView({
    threshold
  });
  const [tick, setTick] = useMotionState(0); // re-render to add settled class
  const inView = triggerOnView ? inViewIO : true;
  useMotionEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setTick(1), settleAfter + lineDelay * (lines.length - 1) + baseDelay);
    return () => clearTimeout(t);
  }, [inView, settleAfter, lineDelay, lines.length, baseDelay]);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, {
    ref: ref,
    className: className,
    style: style
  }, lines.map((line, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `lr-line ${inView ? 'is-in' : ''} ${tick ? 'is-settled' : ''}`,
    style: {
      '--lr-delay': `${baseDelay + i * lineDelay}ms`,
      transitionDelay: `${baseDelay + i * lineDelay}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "lr-line__text",
    style: {
      transitionDelay: `${baseDelay + i * lineDelay + 100}ms`
    }
  }, line), /*#__PURE__*/React.createElement("span", {
    className: "lr-line__rule",
    style: {
      transitionDelay: `${baseDelay + i * lineDelay}ms`
    }
  }))));
}

/* SurfaceSweep — a 1px gold hairline that draws left→right when the parent
   section enters view, then fades. Place at top of any section that lifts
   from #000 to #181818. */
function SurfaceSweep() {
  const [ref, inView] = useInView({
    threshold: 0.15
  });
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    className: `surface-sweep ${inView ? 'is-in' : ''}`,
    "aria-hidden": "true"
  });
}

/* ScrollLinkedColor — wraps a string; --reveal-progress goes 0→1 as the
   element scrolls from below the fold to fully in view. Pairs with the
   .h-reveal CSS class for color-mix gray→white. */
function ScrollLinkedColor({
  as = 'span',
  className = '',
  children,
  ...rest
}) {
  const ref = useMotionRef(null);
  useMotionEffect(() => {
    if (!ref.current) return;
    let frame = null;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const vh = window.innerHeight;
        // 0 when element is below the fold; 1 when fully visible above fold
        const start = vh; // bottom edge of viewport
        const end = vh * 0.25; // top quarter
        const t = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
        ref.current.style.setProperty('--reveal-progress', t.toFixed(3));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    ref: ref,
    className: `h-reveal ${className}`
  }, rest), children);
}
Object.assign(window, {
  useInView,
  Reveal,
  LineReveal,
  SurfaceSweep,
  ScrollLinkedColor
});

/* ===== Shared.jsx ===== */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* global React */
const {
  useState,
  useEffect,
  useRef
} = React;
const URLS = {}; // intake forms removed — inquiries are closed; contact is by email only

const CONTACT = {
  email: 'info@shavitrootman.com',
  phone: '+1 (805) 364-4415',
  phoneHref: 'tel:+18053644415',
  ig: '@shavitness',
  igHref: 'https://instagram.com/shavitness',
  li: '/in/shavitrootman',
  liHref: 'https://linkedin.com/in/shavitrootman'
};

/* --- Photo / Video placeholder ----------------------------- */
function Placeholder({
  label,
  kind = 'photo',
  portrait = false,
  src,
  fallback,
  style,
  alt,
  decorative,
  filter,
  fit,
  objectPosition
}) {
  const computedAlt = decorative ? '' : alt || (label ? toSentenceCase(label) : '');
  const fb = fallback === undefined ? 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/banner.jpg' : fallback;
  const onError = fb ? e => {
    if (e.currentTarget.dataset.fb === '1') return;
    e.currentTarget.dataset.fb = '1';
    e.currentTarget.src = fb;
  } : undefined;
  if (src) {
    const imgStyle = {
      filter
    };
    if (fit) imgStyle.objectFit = fit;
    if (objectPosition) imgStyle.objectPosition = objectPosition;
    return /*#__PURE__*/React.createElement("div", {
      className: "ph-img",
      style: style
    }, /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: computedAlt,
      "aria-hidden": decorative ? 'true' : undefined,
      referrerPolicy: "no-referrer",
      loading: "lazy",
      onError: onError,
      style: imgStyle
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: `ph ${kind === 'video' ? 'ph--video' : ''} ${portrait ? 'ph--portrait' : ''}`,
    style: style,
    role: "img",
    "aria-label": computedAlt || 'Placeholder media'
  }, /*#__PURE__*/React.createElement("div", {
    className: "ph__center",
    "aria-hidden": "true"
  }, "[ ", label, " ]"), /*#__PURE__*/React.createElement("div", {
    className: "ph__tag",
    "aria-hidden": "true"
  }, kind === 'video' ? 'Placeholder video' : 'Placeholder photo'));
}

/* Convert "EXTERIOR — JACKSON COUNTY PROPERTY" → "Exterior — Jackson County Property" */
function toSentenceCase(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/\b([a-z])/g, (m, c) => c.toUpperCase()).replace(/\bMi\b/g, 'MI').replace(/\bOh\b/g, 'OH').replace(/\bIn\b/g, 'IN').replace(/\bIdf\b/g, 'IDF').replace(/\bUs\b/g, 'US');
}

/* --- Real photography (local + remote) ----------------------
   res(id, url) returns a bundled blob URL (window.__resources[id])
   when present (standalone export), else the literal URL (live site). */
function res(id, url) {
  return typeof window !== 'undefined' && window.__resources && window.__resources[id] || url;
}

/* Stock hero video removed (not his footage). Heroes use a Ken Burns
   slideshow of REAL portfolio photos instead. */
const HERO_VIDEO = null;
const KB_SLIDES = [{
  key: 'loPresto',
  path: 'assets/photos/01_hillsdale_17_lo_presto.jpeg'
}, {
  key: 'secondChance',
  path: 'assets/photos/03_second_chance_house.jpeg'
}];
const SHAVIT_PHOTOS = {
  /* Primary studio portrait (uploaded direct by user) */
  portrait: res('portrait', 'assets/shavit-portrait.png'),
  /* Official LinkedIn photos */
  portraitLI: res('portraitLI', 'assets/photos/06_shavit_portrait.jpeg'),
  loPresto: res('loPresto', 'assets/photos/01_hillsdale_17_lo_presto.jpeg'),
  chargerLogo: res('chargerLogo', 'assets/photos/02_charger_logo.jpeg'),
  secondChance: res('secondChance', 'assets/photos/03_second_chance_house.jpeg'),
  senatorLetter: res('senatorLetter', 'assets/photos/04_senator_roberts_letter.jpeg'),
  israelFlag: res('israelFlag', 'assets/photos/05_israel_flag.jpeg'),
  amEquipment: res('amEquipment', 'assets/photos/07_amequipment_tradeshow.jpeg'),
  birthrightPS: res('birthrightPS', 'assets/photos/10_birthright_palm_springs.jpeg'),
  birthrightLA: res('birthrightLA', 'assets/photos/11_birthright_la_gala.jpeg'),
  architecture: res('architecture', 'assets/photos/12_architecture.jpeg'),
  /* Substack-sourced photography (Jan/Feb/May 2024 posts) */
  ssHillsdale: 'https://substackcdn.com/image/fetch/$s_!kCIk!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2e4be312-3ea5-46f4-a444-ebc2521711a5_1140x641.jpeg',
  ssOrgChem: 'https://substackcdn.com/image/fetch/$s_!Chj3!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4677fec6-1ca3-4a75-8b4d-bf3116106f37_4032x3024.jpeg',
  ssClubBooth: 'https://substackcdn.com/image/fetch/$s_!OM5O!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F35542f41-1542-4ec1-8f16-8e91ac1ddc7e_938x796.png',
  ssMarketTrends: 'https://substackcdn.com/image/fetch/$s_!EDm0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff0200da3-c3cb-4560-9267-ad8f4367c8fc_1384x754.png',
  ssThankful: 'https://substackcdn.com/image/fetch/$s_!slQX!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7c2060b2-ae52-499d-a84b-8772790feca5_876x928.png',
  ssTwoGen: 'https://substackcdn.com/image/fetch/$s_!6JhI!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9ea68d7-185d-4fce-8fff-e2c6decd746c_1536x2048.jpeg',
  ssCampusProtest: 'https://substackcdn.com/image/fetch/$s_!eklj!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc4d5cf25-6a2a-4cfe-b6b9-7db5c78c57ae_1626x452.png',
  ssThreeHomes: 'https://substackcdn.com/image/fetch/$s_!fvyL!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffa41a1d3-844d-4531-a7c5-716eb8ec02f8_1438x350.png',
  /* Existing remote attribution photos */
  banner: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/banner.jpg',
  gary: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/gary.png',
  jef: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/jef.png',
  nicky: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/pro.png'
};

/* --- Stock photography (Unsplash) for variety. Cropped on-the-fly. -- */
const U = (id, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
const STOCK = {
  // Property exteriors
  luxuryDusk: U('photo-1564013799919-ab600027ffc6'),
  modernWhite: U('photo-1568605114967-8130f3a36994'),
  suburbStreet: U('photo-1570129477492-45c003edd2be'),
  craftsmanHome: U('photo-1605146768851-eda79da39897'),
  // Interiors
  livingRoom: U('photo-1600585154340-be6161a56a0c'),
  studyDesk: U('photo-1564540586988-aa4e53c3d799'),
  // City / Cleveland
  cityDusk: U('photo-1496564203457-11bb12075d90'),
  brickFacade: U('photo-1486325212027-8081e485255e'),
  // Operations / office
  meeting: U('photo-1521791136064-7986c2920216'),
  deskDocs: U('photo-1554224155-6726b3ff858f'),
  signingDeal: U('photo-1450101499163-c8848c66ca85'),
  deskCalm: U('photo-1454165804606-c3d57bc86b40'),
  // Meet Shavit — thematic photo bands
  desertLand: U('photo-1542621334-a254cf47733d'),
  snowyTown: U('photo-1480497490787-505ec076689f'),
  aerialField: U('photo-1500382017468-9049fed747ef'),
  // Hero / video stand-ins (kept moody for scrims)
  aerialHouse: U('photo-1582268611958-ebfd161ef9cf')
};

/* --- Hexagonal pause button -------------------------------- */
function HexPauseButton({
  onClick,
  controlled = false,
  paused: pausedProp = false
}) {
  const [internalPaused, setInternalPaused] = useState(false);
  const paused = controlled ? pausedProp : internalPaused;
  const handle = () => {
    if (!controlled) setInternalPaused(p => !p);
    onClick && onClick();
  };
  return /*#__PURE__*/React.createElement("button", {
    className: "hex",
    "aria-label": paused ? 'Play background video' : 'Pause background video',
    onClick: handle
  }, /*#__PURE__*/React.createElement("svg", {
    className: "hex__shape",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "25,4 75,4 96,50 75,96 25,96 4,50"
  })), paused ? /*#__PURE__*/React.createElement("svg", {
    className: "hex__glyph",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("polygon", {
    points: "6,4 20,12 6,20"
  })) : /*#__PURE__*/React.createElement("svg", {
    className: "hex__glyph",
    width: "12",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "4",
    width: "4",
    height: "16"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "4",
    width: "4",
    height: "16"
  })));
}

/* --- Buttons / Links --------------------------------------- */
function Btn({
  href,
  formType,
  children,
  variant = 'gold',
  onClick,
  target,
  ariaLabel
}) {
  const cls = `btn-base ${variant === 'gold' ? 'btn-gold' : 'btn-ghost'}`;
  const handle = e => {
    if (formType) {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-form-modal', {
        detail: {
          type: formType
        }
      }));
    }
    if (onClick) onClick(e);
  };
  if (href) {
    return /*#__PURE__*/React.createElement("a", {
      className: cls,
      href: href,
      onClick: handle,
      target: target || (href.startsWith('http') ? '_blank' : undefined),
      rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
      "aria-label": ariaLabel
    }, children);
  }
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: cls,
    onClick: handle,
    "aria-label": ariaLabel
  }, children);
}
function TLink({
  href,
  gold,
  children,
  onClick,
  target
}) {
  return /*#__PURE__*/React.createElement("a", {
    className: `tlink ${gold ? 'tlink--gold' : ''}`,
    href: href || '#',
    onClick: onClick,
    target: target || (href && href.startsWith('http') ? '_blank' : undefined),
    rel: href && href.startsWith('http') ? 'noopener noreferrer' : undefined
  }, /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"));
}
function Eyebrow({
  gold = true,
  muted,
  children,
  style
}) {
  const cls = `eyebrow ${muted ? 'eyebrow--muted' : gold ? 'eyebrow--gold' : ''}`;
  return /*#__PURE__*/React.createElement("div", {
    className: cls,
    style: style
  }, children);
}
function GoldRule({
  wide = false,
  thick = false,
  style
}) {
  return /*#__PURE__*/React.createElement("hr", {
    className: `gold-rule ${wide ? 'gold-rule--wide' : ''} ${thick ? 'gold-rule--thick' : ''}`,
    style: style
  });
}

/* --- Counter (animated on enter view) ---------------------- */
function Counter({
  to = 0,
  suffix = '',
  prefix = '',
  duration = 2000,
  delay = 800
}) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      const startTime = performance.now() + delay;
      const tick = t => {
        if (t < startTime) {
          requestAnimationFrame(tick);
          return;
        }
        const p = Math.min(1, (t - startTime) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(to * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.disconnect();
    }, {
      threshold: 0.45
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration, delay]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref
  }, prefix, n.toLocaleString(), suffix);
}

/* --- Stat tile ---------------------------------------------- */
function Stat({
  value,
  label,
  placeholder = false,
  i = 0
}) {
  const [ref, inView] = useInView({
    threshold: 0.4
  });
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: `stat ${inView ? 'is-in' : ''}`,
    "data-i": i
  }, /*#__PURE__*/React.createElement("span", {
    className: "stat__rule"
  }), /*#__PURE__*/React.createElement("div", {
    className: placeholder ? 'stat__placeholder' : 'stat__val'
  }, placeholder ? '[ FILL IN ]' : value), /*#__PURE__*/React.createElement("div", {
    className: "stat__lbl stat__lbl-anim"
  }, label));
}

/* --- Three-path self-select ---------------------------------- */
function TriPaths({
  items,
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "tri"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    className: "tri__col",
    href: it.href || (it.formType ? '#' : undefined),
    target: it.href && it.href.startsWith('http') ? '_blank' : undefined,
    rel: it.href && it.href.startsWith('http') ? 'noopener noreferrer' : undefined,
    onClick: e => {
      if (it.formType) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-form-modal', {
          detail: {
            type: it.formType
          }
        }));
        return;
      }
      if (it.page) {
        e.preventDefault();
        onNav && onNav(it.page);
        window.scrollTo({
          top: 0
        });
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tri__photo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tri__col__photo-zoom"
  }, /*#__PURE__*/React.createElement(Placeholder, {
    label: it.photo,
    src: it.src,
    filter: it.filter,
    kind: "photo"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "tri__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "tri__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tri__label"
  }, it.label), /*#__PURE__*/React.createElement("h3", {
    className: "tri__h"
  }, it.headline), /*#__PURE__*/React.createElement("p", {
    className: "tri__p"
  }, it.body), it.goldCta ? /*#__PURE__*/React.createElement("span", {
    className: "btn-base btn-gold",
    style: {
      alignSelf: 'flex-start'
    }
  }, it.cta, " ", /*#__PURE__*/React.createElement("span", {
    className: "tri__col__arrow"
  }, "\u2192")) : /*#__PURE__*/React.createElement("span", {
    className: "tlink"
  }, /*#__PURE__*/React.createElement("span", null, it.cta), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    className: "tri__col__arrow"
  }, "\u2192"))), /*#__PURE__*/React.createElement("span", {
    className: "tri__col__rule",
    "aria-hidden": "true"
  }))));
}

/* --- Stats grid 4-up --------------------------------------- */
function StatsGrid({
  rows
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stats"
  }, rows.map((r, i) => /*#__PURE__*/React.createElement(Stat, _extends({
    key: i,
    i: i
  }, r))));
}

/* --- Full-viewport video hero ------------------------------ */
function VideoHero({
  eyebrow,
  eyebrowGold = false,
  h1,
  h1Lines,
  subTitle,
  sub,
  actions,
  height = 'full',
  align = 'left',
  videoLabel,
  videoSrc,
  poster,
  showProgress = true,
  showPause = true,
  blueprint = false
}) {
  const [paused, setPaused] = useState(false);
  const togglePlay = () => setPaused(p => !p);
  return /*#__PURE__*/React.createElement("section", {
    className: `hero hero--enter ${blueprint ? 'hero--with-bp' : ''} ${height === '80vh' ? 'hero--80vh' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__media",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: `kb ${paused ? 'kb--paused' : ''}`
  }, KB_SLIDES.map((sl, i) => /*#__PURE__*/React.createElement("img", {
    key: sl.key,
    src: sl.path,
    alt: "",
    className: "kb__img",
    loading: "eager",
    style: {
      animationDelay: `${i * 7}s, ${i * 7}s`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "hero__scrim"
  }), blueprint && /*#__PURE__*/React.createElement(BlueprintHouse, null), /*#__PURE__*/React.createElement("div", {
    className: `hero__inner ${align === 'center' ? 'hero__inner--center' : ''}`
  }, eyebrow && /*#__PURE__*/React.createElement(Eyebrow, {
    gold: eyebrowGold
  }, eyebrow), subTitle && /*#__PURE__*/React.createElement("div", {
    className: "body-md",
    style: {
      color: '#fff',
      marginTop: 8,
      opacity: 0.7
    }
  }, subTitle), h1Lines ? /*#__PURE__*/React.createElement(LineReveal, {
    as: "h1",
    className: "h-mega",
    lines: h1Lines,
    triggerOnView: false,
    baseDelay: 600,
    lineDelay: 150,
    style: {
      marginTop: 24
    }
  }) : /*#__PURE__*/React.createElement("h1", {
    className: "h-mega",
    style: {
      marginTop: 24
    },
    dangerouslySetInnerHTML: {
      __html: h1
    }
  }), sub && /*#__PURE__*/React.createElement("p", {
    className: "body-lg hero__sub"
  }, sub), actions && /*#__PURE__*/React.createElement("div", {
    className: "hero__actions"
  }, actions)), showPause && /*#__PURE__*/React.createElement(HexPauseButton, {
    onClick: togglePlay,
    controlled: true,
    paused: paused
  }), showProgress && /*#__PURE__*/React.createElement("div", {
    className: "hero__progress"
  }));
}

/* --- Pre-footer CTA band ----------------------------------- */
function CtaBand({
  eyebrow,
  h,
  hLines,
  actions,
  videoLabel = 'Cinematic Pan · Dusk Street',
  src,
  filter
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "cta-band hero--enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cta-band__media"
  }, src ? /*#__PURE__*/React.createElement(Placeholder, {
    label: videoLabel,
    kind: "video",
    src: src,
    filter: filter
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(80% 120% at 50% 110%, #1b1b1b 0%, #0a0a0a 70%)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "cta-band__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "cta-band__inner"
  }, eyebrow && /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, eyebrow), hLines ? /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-mega",
    lines: hLines,
    triggerOnView: true,
    baseDelay: 0,
    lineDelay: 200,
    style: {
      marginTop: 24
    }
  }) : /*#__PURE__*/React.createElement("h2", {
    className: "h-mega",
    style: {
      marginTop: 24
    },
    dangerouslySetInnerHTML: {
      __html: h
    }
  }), actions && /*#__PURE__*/React.createElement("div", {
    className: "hero__actions"
  }, actions)));
}

/* --- (legacy duplicate removed — see top of file for active TriPaths/StatsGrid) --- */

Object.assign(window, {
  URLS,
  CONTACT,
  SHAVIT_PHOTOS,
  STOCK,
  HERO_VIDEO,
  Placeholder,
  HexPauseButton,
  Btn,
  TLink,
  Eyebrow,
  GoldRule,
  Counter,
  Stat,
  StatsGrid,
  VideoHero,
  CtaBand,
  TriPaths
});

/* ===== Intro.jsx ===== */
/* global React */
// Logo Intro — first-load curtain that lifts away.
// Cinematic logo reveal: a small architectural house mark draws itself,
// then each letter of SHAVIT ROOTMAN slides up with brass-fill stagger,
// underline rules draw across, caption types in, curtain fades.

const {
  useState: useIntroState,
  useEffect: useIntroEffect
} = React;
function LogoIntro() {
  const [phase, setPhase] = useIntroState('pre');
  useIntroEffect(() => {
    if (phase === 'gone') return;
    // Total sequence: ~4.6s in, then 800ms out
    const t1 = setTimeout(() => setPhase('in'), 60);
    const t2 = setTimeout(() => setPhase('out'), 60 + 4600);
    const t3 = setTimeout(() => setPhase('gone'), 60 + 4600 + 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [phase === 'pre']);
  useIntroEffect(() => {
    if (phase === 'gone') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);
  if (phase === 'gone') return null;

  // Split name into letters for staggered animation
  const splitLetters = (word, baseDelay) => word.split('').map((ch, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: "intro__letter",
    style: {
      animationDelay: `${baseDelay + i * 60}ms`
    }
  }, ch));
  return /*#__PURE__*/React.createElement("div", {
    className: `intro intro--${phase}`,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "intro__bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "intro__halo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "intro__mark"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "intro__house",
    viewBox: "0 0 96 64",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    className: "intro__house-path",
    d: "M8 56 L8 30 L48 8 L88 30 L88 56 L8 56 Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "intro__house-path",
    d: "M40 56 L40 36 L56 36 L56 56"
  }), /*#__PURE__*/React.createElement("path", {
    className: "intro__house-path",
    d: "M8 56 L88 56",
    strokeWidth: "2"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "intro__rule intro__rule--top"
  }), /*#__PURE__*/React.createElement("span", {
    className: "intro__line intro__line--a",
    "aria-label": "Shavit"
  }, splitLetters('SHAVIT', 700)), /*#__PURE__*/React.createElement("span", {
    className: "intro__line intro__line--b",
    "aria-label": "Rootman"
  }, splitLetters('ROOTMAN', 1100)), /*#__PURE__*/React.createElement("span", {
    className: "intro__rule intro__rule--bottom"
  }), /*#__PURE__*/React.createElement("span", {
    className: "intro__caption"
  }, "Real Estate, Operated.")));
}
window.LogoIntro = LogoIntro;

/* ===== Polish.jsx ===== */
/* global React */
// Global polish components: custom cursor (lag-tracking) + top scroll-progress bar.
// Both mount once at app root.

const {
  useEffect: usePolishEffect,
  useRef: usePolishRef,
  useState: usePolishState
} = React;

/* ---------------------------------------------------------------
   CursorRing — small gold ring that follows the mouse with lag.
   Hidden on touch devices and when reduced-motion is set.
--------------------------------------------------------------- */
function CursorRing() {
  const ringRef = usePolishRef(null);
  const stateRef = usePolishRef({
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    hov: false
  });
  usePolishEffect(() => {
    const isTouch = matchMedia('(hover: none)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduce) return;
    document.body.classList.add('has-cursor-ring');
    const s = stateRef.current;
    const onMove = e => {
      s.tx = e.clientX;
      s.ty = e.clientY;
    };
    const onOver = e => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const hov = !!t.closest('a, button, [role="button"], .tri__col, .ccard, .qcard, .opt, .cstudy__media, .deep__media, .endorse');
      if (hov !== s.hov) {
        s.hov = hov;
        ringRef.current && ringRef.current.classList.toggle('cursor-ring--hover', hov);
      }
    };
    window.addEventListener('mousemove', onMove, {
      passive: true
    });
    window.addEventListener('mouseover', onOver, {
      passive: true
    });
    let raf = 0;
    const tick = () => {
      s.x += (s.tx - s.x) * 0.18;
      s.y += (s.ty - s.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${s.x - 16}px, ${s.y - 16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor-ring');
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ringRef,
    className: "cursor-ring",
    "aria-hidden": "true"
  });
}

/* ---------------------------------------------------------------
   ScrollProgress — fixed 2px gold bar at top of page.
--------------------------------------------------------------- */
function ScrollProgress() {
  const ref = usePolishRef(null);
  usePolishEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const t = max <= 0 ? 0 : Math.max(0, Math.min(1, window.scrollY / max));
        if (ref.current) ref.current.style.transform = `scaleX(${t})`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "scroll-progress",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    ref: ref
  }));
}

/* ---------------------------------------------------------------
   FilmGrain — fullscreen SVG noise at ~3% opacity.
--------------------------------------------------------------- */
function FilmGrain() {
  return /*#__PURE__*/React.createElement("div", {
    className: "film-grain",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("filter", {
    id: "film-noise"
  }, /*#__PURE__*/React.createElement("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.85",
    numOctaves: "2",
    stitchTiles: "stitch"
  }), /*#__PURE__*/React.createElement("feColorMatrix", {
    values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
  })), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    filter: "url(#film-noise)"
  })));
}
window.CursorRing = CursorRing;
window.ScrollProgress = ScrollProgress;
window.FilmGrain = FilmGrain;

/* ===== BlueprintHouse.jsx ===== */
/* global React */
// BlueprintHouse — an isometric wireframe house drawn in thin gold,
// each line stroke-drawn on mount, then the whole shape slow-rotates
// on the Y-axis. Decorative overlay; never blocks text legibility.

const {
  useEffect: useBpEffect,
  useRef: useBpRef
} = React;
function BlueprintHouse({
  size = 720
}) {
  const ref = useBpRef(null);
  useBpEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (!ref.current) return;
    const paths = ref.current.querySelectorAll('.bp-line');
    paths.forEach((p, i) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      p.getBoundingClientRect(); // force reflow
      p.style.transition = `stroke-dashoffset 1500ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 90}ms, opacity 800ms ease ${600 + i * 90}ms`;
      p.style.strokeDashoffset = '0';
      p.style.opacity = '1';
    });
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "bp",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bp__glow"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bp__stage"
  }, /*#__PURE__*/React.createElement("svg", {
    ref: ref,
    className: "bp__svg",
    viewBox: "-200 -200 400 400",
    width: size,
    height: size
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("filter", {
    id: "bpGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "1.2",
    result: "b"
  }), /*#__PURE__*/React.createElement("feMerge", null, /*#__PURE__*/React.createElement("feMergeNode", {
    in: "b"
  }), /*#__PURE__*/React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), /*#__PURE__*/React.createElement("g", {
    stroke: "#FFC000",
    strokeWidth: "1",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    filter: "url(#bpGlow)",
    style: {
      opacity: 0.95
    }
  }, /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.25
    },
    d: "M-180 100 L 180 100"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.25
    },
    d: "M-180 100 L -120 130"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.25
    },
    d: "M 180 100 L 120 130"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M-100 100 L 100 100 L 100 -20 L -100 -20 Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 100 100 L 160 60 L 160 -60 L 100 -20"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -100 -20 L -40 -60 L 160 -60"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -100 -20 L 0 -90 L 100 -20"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 0 -90 L 60 -130 L 160 -60"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 0 -90 L 60 -130"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -25 100 L -25 30 L 25 30 L 25 100"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.6
    },
    d: "M 0 30 L 0 100"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -80 20 L -55 20 L -55 -5 L -80 -5 Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.5
    },
    d: "M -67.5 20 L -67.5 -5 M -80 7.5 L -55 7.5"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 55 20 L 80 20 L 80 -5 L 55 -5 Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.5
    },
    d: "M 67.5 20 L 67.5 -5 M 55 7.5 L 80 7.5"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 120 0 L 140 -10 L 140 -35 L 120 -25 Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 35 -110 L 35 -135 L 55 -145 L 55 -120 Z"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.5
    },
    d: "M 35 -135 L 55 -145"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.45
    },
    d: "M -100 100 L -100 112 L 100 112 L 100 100"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.45
    },
    d: "M 100 112 L 160 72"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.4
    },
    d: "M -100 -20 L -100 100"
  }), /*#__PURE__*/React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.4
    },
    d: "M 100 -20 L 100 100"
  })))));
}
window.BlueprintHouse = BlueprintHouse;

/* ===== IsraeliFlagBand.jsx ===== */
/* global React */
// Animated Israeli flag — SVG with waving stripes and a Star of David
// that draws itself. Replaces the static photo band on Meet Shavit
// between Act I and Act II.

const {
  useRef: useFlagRef,
  useEffect: useFlagEffect
} = React;
function IsraeliFlagBand() {
  const ref = useFlagRef(null);
  useFlagEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const paths = ref.current.querySelectorAll('.flag-draw');
    paths.forEach((p, i) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      p.style.strokeDashoffset = String(len);
      p.getBoundingClientRect();
      p.style.transition = `stroke-dashoffset 2000ms cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 120}ms, opacity 600ms ease ${300 + i * 120}ms`;
      p.style.strokeDashoffset = '0';
      p.style.opacity = '1';
    });
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    className: "flag-band",
    "aria-label": "Israeli flag \u2014 IDF service"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flag-band__bg",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flag-band__stage"
  }, /*#__PURE__*/React.createElement("svg", {
    ref: ref,
    className: "flag-svg",
    viewBox: "0 0 1000 600",
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "flagWave",
    x: "0",
    y: "0",
    width: "1000",
    height: "600",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "1000",
    height: "600",
    fill: "rgba(245,239,225,0.04)"
  })), /*#__PURE__*/React.createElement("filter", {
    id: "flagGlow",
    x: "-10%",
    y: "-10%",
    width: "120%",
    height: "120%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "1.2"
  }))), /*#__PURE__*/React.createElement("g", {
    className: "flag-cloth"
  }, /*#__PURE__*/React.createElement("path", {
    className: "flag-draw flag-outline",
    d: "M 60 90 L 940 90 L 940 510 L 60 510 Z",
    fill: "rgba(255,255,255,0.02)",
    stroke: "rgba(245,239,225,0.18)",
    strokeWidth: "1",
    style: {
      opacity: 0
    }
  })), /*#__PURE__*/React.createElement("g", {
    className: "flag-stripe flag-stripe--top"
  }, /*#__PURE__*/React.createElement("path", {
    className: "flag-draw",
    d: "M 60 150 L 940 150 L 940 210 L 60 210 Z",
    fill: "rgba(43, 78, 148, 0.0)",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "1.5",
    style: {
      opacity: 0
    }
  }), /*#__PURE__*/React.createElement("path", {
    className: "flag-fill flag-fill--top",
    d: "M 60 150 L 940 150 L 940 210 L 60 210 Z",
    fill: "rgb(50, 100, 200)",
    opacity: "0"
  })), /*#__PURE__*/React.createElement("g", {
    className: "flag-stripe flag-stripe--bot"
  }, /*#__PURE__*/React.createElement("path", {
    className: "flag-draw",
    d: "M 60 390 L 940 390 L 940 450 L 60 450 Z",
    fill: "rgba(43, 78, 148, 0.0)",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "1.5",
    style: {
      opacity: 0
    }
  }), /*#__PURE__*/React.createElement("path", {
    className: "flag-fill flag-fill--bot",
    d: "M 60 390 L 940 390 L 940 450 L 60 450 Z",
    fill: "rgb(50, 100, 200)",
    opacity: "0"
  })), /*#__PURE__*/React.createElement("g", {
    className: "flag-star",
    filter: "url(#flagGlow)"
  }, /*#__PURE__*/React.createElement("path", {
    className: "flag-draw flag-star-tri flag-star-tri--up",
    d: "M 500 230 L 580 370 L 420 370 Z",
    fill: "none",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "2.5",
    strokeLinejoin: "round",
    style: {
      opacity: 0
    }
  }), /*#__PURE__*/React.createElement("path", {
    className: "flag-draw flag-star-tri flag-star-tri--down",
    d: "M 500 370 L 580 230 L 420 230 Z",
    fill: "none",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "2.5",
    strokeLinejoin: "round",
    style: {
      opacity: 0
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flag-band__caption"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow eyebrow--gold"
  }, "Service \xB7 2009\u20132013"), /*#__PURE__*/React.createElement("h3", {
    className: "h-md flag-band__title"
  }, "Israeli Defense Forces"), /*#__PURE__*/React.createElement("p", {
    className: "flag-band__sub"
  }, "Discipline. Resilience. Execution.")));
}
window.IsraeliFlagBand = IsraeliFlagBand;

/* ===== BrrrrIcon.jsx ===== */
/* global React */
// Small architectural-style icons for the BRRRR pillars,
// each with a subtle looping animation that re-fires every 4–5s.
// Pure SVG + CSS; no JS animation needed (all GPU).

function BrrrrIcon({
  kind
}) {
  if (kind === 'key') {
    // A key turning on its bow
    return /*#__PURE__*/React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--key",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("g", {
      className: "key-spin"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "14",
      cy: "24",
      r: "7"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "14",
      cy: "24",
      r: "2.5",
      fill: "currentColor",
      stroke: "none"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M21 24 L40 24"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M34 24 L34 30"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M30 24 L30 28"
    })));
  }
  if (kind === 'hammer') {
    return /*#__PURE__*/React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--hammer",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("g", {
      className: "hammer-tap"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M8 12 L20 12 L24 16 L20 20 L8 20 Z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M20 16 L36 32"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M34 30 L40 36",
      strokeWidth: "2.5"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M30 40 L42 40",
      className: "hammer-anvil"
    })));
  }
  if (kind === 'door') {
    return /*#__PURE__*/React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--door",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 8 L10 40 L38 40"
    }), /*#__PURE__*/React.createElement("g", {
      className: "door-swing"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M10 8 L30 8 L30 40 L10 40 Z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "26",
      cy: "24",
      r: "1",
      fill: "currentColor",
      stroke: "none"
    }))));
  }
  if (kind === 'coins') {
    return /*#__PURE__*/React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--coins",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: "24",
      cy: "40",
      rx: "14",
      ry: "3.5",
      className: "coin coin--3"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "24",
      cy: "30",
      rx: "14",
      ry: "3.5",
      className: "coin coin--2"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "24",
      cy: "20",
      rx: "14",
      ry: "3.5",
      className: "coin coin--1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 40 L10 20",
      strokeOpacity: "0.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M38 40 L38 20",
      strokeOpacity: "0.5"
    })));
  }
  // loop / repeat — circular arrow
  return /*#__PURE__*/React.createElement("svg", {
    className: "brrrr__icon brrrr__icon--loop",
    viewBox: "0 0 48 48",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("g", {
    className: "loop-spin"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 24 A 14 14 0 1 1 38 24"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M34 18 L38 24 L44 22"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M38 24 A 14 14 0 1 1 10 24",
    strokeOpacity: "0.35"
  }))));
}
window.BrrrrIcon = BrrrrIcon;

/* ===== HomesRevitalized.jsx ===== */
/* global React, Counter, Eyebrow, GoldRule, Reveal, LineReveal */
// Unified Progress + 2030 Vision section.
// Replaces the two weak standalone bands with one cinematic moment:
// - Massive "27" counter with a 10×10 house-tile grid that lights up
// - To the right: the 2030 milestones (100 / 200 / 30) as a vertical ladder
// - A single rotating "MICHIGAN · OHIO · INDIANA" tagline
// - Italic sign-off line at the bottom

const {
  useEffect: useProgEffect,
  useState: useProgState,
  useRef: useProgRef
} = React;
const HOMES_DONE = 27;
const HOMES_GOAL = 100;
const TAGLINES = ['Michigan', 'Ohio', 'Indiana'];
const MILESTONES = [{
  value: 100,
  label: 'Homes Revitalized',
  sub: 'Hillsdale, MI'
}, {
  value: 200,
  label: 'Doors Operated',
  sub: 'Across Midwest Markets'
}, {
  value: 30,
  label: 'Jobs Created',
  sub: 'Locally, on the ground'
}];
function ProgressVision() {
  const sectionRef = useProgRef(null);
  const [activated, setActivated] = useProgState(0);
  const [taglineIdx, setTaglineIdx] = useProgState(0);
  useProgEffect(() => {
    if (!sectionRef.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) {
        setActivated(HOMES_DONE);
        return;
      }
      const duration = 1800;
      const start = performance.now();
      const tick = t => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setActivated(Math.round(HOMES_DONE * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, {
      threshold: 0.3
    });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  useProgEffect(() => {
    const id = setInterval(() => setTaglineIdx(i => (i + 1) % TAGLINES.length), 3000);
    return () => clearInterval(id);
  }, []);
  const pct = Math.round(HOMES_DONE / HOMES_GOAL * 100);
  return /*#__PURE__*/React.createElement("section", {
    ref: sectionRef,
    className: "progvis band band--navy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The 2030 Vision")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['27 done.', '73 to go.'],
    lineDelay: 200
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 680,
      marginTop: 16
    }
  }, "The plan: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, and 30 jobs created locally by 2030. We\u2019re ", pct, "% of the way to the first milestone."))), /*#__PURE__*/React.createElement("div", {
    className: "progvis__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__counter-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__counter",
    "aria-label": `${HOMES_DONE} homes revitalized so far`
  }, /*#__PURE__*/React.createElement(Counter, {
    to: HOMES_DONE,
    duration: 1800,
    delay: 0
  })), /*#__PURE__*/React.createElement("div", {
    className: "progvis__counter-suffix"
  }, "/ ", HOMES_GOAL)), /*#__PURE__*/React.createElement("div", {
    className: "progvis__label"
  }, "Homes Revitalized to Date"), /*#__PURE__*/React.createElement("div", {
    className: "progvis__rule"
  }), /*#__PURE__*/React.createElement("div", {
    className: "progvis__taglines",
    "aria-live": "polite"
  }, TAGLINES.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `progvis__tag ${i === taglineIdx ? 'is-on' : ''}`
  }, t))), /*#__PURE__*/React.createElement("div", {
    className: "progvis__tile-grid",
    "aria-hidden": "true"
  }, Array.from({
    length: HOMES_GOAL
  }).map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    className: `progvis__tile ${i < activated ? 'is-on' : ''}`
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 12 L12 3 L22 12 L20 12 L20 21 L14 21 L14 14 L10 14 L10 21 L4 21 L4 12 Z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "progvis__right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__milestones-head"
  }, "By 2030"), MILESTONES.map((m, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    as: "div",
    mode: "rise-sm",
    delay: 200 + i * 200,
    className: "progvis__milestone"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__milestone-num"
  }, /*#__PURE__*/React.createElement(Counter, {
    to: m.value,
    duration: 1600 + i * 200
  })), /*#__PURE__*/React.createElement("div", {
    className: "progvis__milestone-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progvis__milestone-label"
  }, m.label), /*#__PURE__*/React.createElement("div", {
    className: "progvis__milestone-sub"
  }, m.sub)))), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1400,
    className: "progvis__signoff"
  }, /*#__PURE__*/React.createElement("p", null, "\u201CJust getting started.\u201D"))))));
}
window.ProgressVision = ProgressVision;
// Legacy export kept as no-op to avoid breaking older references.
window.HomesRevitalized = ProgressVision;

/* ===== AccessibilityPage.jsx ===== */
/* global React, Eyebrow, GoldRule, CONTACT */

function AccessibilityPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade band",
    style: {
      paddingTop: 160
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 820,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Accessibility"), /*#__PURE__*/React.createElement("h1", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, "Our commitment to accessibility."), /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "Charger Property Management is committed to ensuring digital accessibility for everyone, including people with disabilities. We work to continually improve the user experience for all visitors and apply the relevant accessibility standards."), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Standard we follow"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "This site is designed to conform to the ", /*#__PURE__*/React.createElement("strong", null, "Web Content Accessibility Guidelines (WCAG) 2.1, Level AA"), ", published by the W3C. These guidelines explain how to make web content more accessible to people with a wide array of disabilities. visual, auditory, motor, and cognitive."), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "What we\u2019ve built in"), /*#__PURE__*/React.createElement("ul", {
    className: "a11y-list"
  }, /*#__PURE__*/React.createElement("li", null, "Keyboard navigation throughout, with a visible focus indicator on every interactive element."), /*#__PURE__*/React.createElement("li", null, "A \u201CSkip to main content\u201D link as the first focusable element on every page."), /*#__PURE__*/React.createElement("li", null, "Semantic HTML landmarks (", /*#__PURE__*/React.createElement("code", null, "header"), ", ", /*#__PURE__*/React.createElement("code", null, "main"), ", ", /*#__PURE__*/React.createElement("code", null, "nav"), ", ", /*#__PURE__*/React.createElement("code", null, "footer"), ") for screen-reader navigation."), /*#__PURE__*/React.createElement("li", null, "Descriptive alt text on photographs of people, properties, and documents."), /*#__PURE__*/React.createElement("li", null, "Form fields labeled with persistent text (not just placeholders) and validated with screen-reader-friendly error messages."), /*#__PURE__*/React.createElement("li", null, "Modals and overlays trap focus, announce themselves to screen readers, and close on the Escape key."), /*#__PURE__*/React.createElement("li", null, "All hero video is muted and decorative; nothing essential is conveyed by motion alone."), /*#__PURE__*/React.createElement("li", null, "Color contrast on body copy meets or exceeds WCAG AA (4.5:1)."), /*#__PURE__*/React.createElement("li", null, "Animations respect the operating-system ", /*#__PURE__*/React.createElement("code", null, "prefers-reduced-motion"), " setting."), /*#__PURE__*/React.createElement("li", null, "Text scales smoothly when the browser font size is increased.")), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Known limitations"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "We are still working on the following items, which we plan to remediate:"), /*#__PURE__*/React.createElement("ul", {
    className: "a11y-list"
  }, /*#__PURE__*/React.createElement("li", null, "Closed captions and a full transcript for the hero background footage are pending."), /*#__PURE__*/React.createElement("li", null, "Some third-party embeds (Google Forms, Substack, LinkedIn previews) may have accessibility issues outside our direct control. We provide native alternatives whenever possible.")), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Need assistance? Tell us."), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "If you encounter an accessibility barrier on this site, or if you need information presented in an alternative format, we want to hear from you. We respond to every request within ", /*#__PURE__*/React.createElement("strong", null, "three business days"), "."), /*#__PURE__*/React.createElement("div", {
    className: "a11y-contact"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Email"), /*#__PURE__*/React.createElement("a", {
    className: "a11y-contact__val",
    href: `mailto:${CONTACT.email}?subject=Accessibility%20Request`
  }, CONTACT.email)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Phone"), /*#__PURE__*/React.createElement("a", {
    className: "a11y-contact__val",
    href: CONTACT.phoneHref
  }, CONTACT.phone))), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Formal complaint procedure"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "If you believe we have not adequately responded to your accessibility request, you may file a complaint with:"), /*#__PURE__*/React.createElement("ul", {
    className: "a11y-list"
  }, /*#__PURE__*/React.createElement("li", null, "The ", /*#__PURE__*/React.createElement("strong", null, "U.S. Department of Justice, Civil Rights Division"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "https://civilrights.justice.gov",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "civilrights.justice.gov")), /*#__PURE__*/React.createElement("li", null, "The ", /*#__PURE__*/React.createElement("strong", null, "U.S. Access Board"), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.access-board.gov",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "access-board.gov"))), /*#__PURE__*/React.createElement("p", {
    className: "body-md",
    style: {
      marginTop: 56,
      color: 'var(--color-mute-warm)',
      fontSize: 13,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }
  }, "Last reviewed: May 2026. Accessibility is an ongoing effort, not a finished one.")));
}
window.AccessibilityPage = AccessibilityPage;

/* ===== LegalPage.jsx ===== */
/* global React, Eyebrow, GoldRule, CONTACT */

function LegalPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade band",
    style: {
      paddingTop: 160
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 820,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Legal & Privacy"), /*#__PURE__*/React.createElement("h1", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, "Important disclosures."), /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  }), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 16,
      marginBottom: 16
    }
  }, "Investment disclaimer"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "The information on this website is provided for general informational purposes only. It is ", /*#__PURE__*/React.createElement("strong", null, "not an offer to sell, or a solicitation of an offer to buy,"), " any security, investment product, or interest in any fund or entity, and it does not constitute investment, financial, legal, accounting, or tax advice. Nothing here should be relied upon as the basis for any investment decision."), /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 20
    }
  }, "Any offering of a securities or investment opportunity would be made only to eligible investors, in the jurisdictions where lawful, and solely through formal offering documents that contain complete information about the terms, conditions, and risks. In the event of any conflict, those formal documents control over anything stated on this website."), /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 20
    }
  }, "Real estate investing involves substantial risk, including the possible loss of principal. ", /*#__PURE__*/React.createElement("strong", null, "Past performance is not indicative of future results."), " Any portfolio figures, door counts, valuations, projections, or goals shown on this site (including statements about future plans such as target door counts or homes revitalized) are forward-looking, reflect current intentions only, and are not guarantees of any outcome. Prospective investors should consult their own legal, tax, and financial advisors before making any decision."), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Privacy policy"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "We respect your privacy. This policy explains what we collect when you use this site and contact us, and what we do with it."), /*#__PURE__*/React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Information we collect"), /*#__PURE__*/React.createElement("ul", {
    className: "a11y-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Information you give us."), " This site has no forms and collects no information through the website itself. If you choose to email or call us, we receive what you send \u2014 typically your name, contact details, and your message. Please do not send bank account numbers, Social Security numbers, or other sensitive identifiers."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Information collected automatically."), " Our hosting provider may log standard technical data such as IP address, browser type, and pages visited, for security and to keep the site running. We do not use advertising trackers.")), /*#__PURE__*/React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "How we use it"), /*#__PURE__*/React.createElement("ul", {
    className: "a11y-list"
  }, /*#__PURE__*/React.createElement("li", null, "To respond to your inquiry and follow up with you about working or investing with us."), /*#__PURE__*/React.createElement("li", null, "To operate, secure, and improve the website."), /*#__PURE__*/React.createElement("li", null, "To comply with legal obligations.")), /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 12
    }
  }, "We do ", /*#__PURE__*/React.createElement("strong", null, "not"), " sell your personal information."), /*#__PURE__*/React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Service providers"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "The site is hosted on a third-party hosting provider, which processes technical data under its own terms and privacy policy. We link out to LinkedIn, Substack, and Instagram, which are governed by their own privacy practices."), /*#__PURE__*/React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Your choices & rights"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "You may request that we access, correct, or delete the personal information you have submitted, or ask us to stop contacting you, at any time. California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we hold and to request its deletion. To make any request, email us at the address below and we will respond as required by law."), /*#__PURE__*/React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Children"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "This site is intended for adults and is not directed to children. We do not knowingly collect information from anyone under 18."), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Terms of use"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "By using this website you agree to these terms. All content. text, images, video, graphics, and design. is owned by or licensed to us and is protected by copyright and other laws; you may not reproduce or redistribute it without permission. The site is provided \u201Cas is,\u201D without warranties of any kind, and to the fullest extent permitted by law we are not liable for any damages arising from your use of it. Third-party links are provided for convenience and we are not responsible for their content. We may update the site and these terms at any time."), /*#__PURE__*/React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Contact us"), /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "Questions about these disclosures, or a privacy request? Reach out:"), /*#__PURE__*/React.createElement("div", {
    className: "a11y-contact"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Email"), /*#__PURE__*/React.createElement("a", {
    className: "a11y-contact__val",
    href: `mailto:${CONTACT.email}?subject=Privacy%20Request`
  }, CONTACT.email)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Phone"), /*#__PURE__*/React.createElement("a", {
    className: "a11y-contact__val",
    href: CONTACT.phoneHref
  }, CONTACT.phone))), /*#__PURE__*/React.createElement("p", {
    className: "body-md",
    style: {
      marginTop: 56,
      color: 'var(--color-mute-warm)',
      fontSize: 13,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }
  }, "Last updated: May 2026.")));
}
window.LegalPage = LegalPage;

/* ===== Nav.jsx ===== */
/* global React, CONTACT, URLS */
const {
  useState: useNavState,
  useEffect: useNavEffect,
  useRef: useNavRef
} = React;
function Nav({
  page,
  onNav,
  openMenu,
  menuOpen
}) {
  const [scrolled, setScrolled] = useNavState(false);
  useNavEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return /*#__PURE__*/React.createElement("header", {
    className: `nav ${scrolled ? 'nav--scrolled' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav__left"
  }, /*#__PURE__*/React.createElement("button", {
    className: `nav__menu-btn ${menuOpen ? 'is-open' : ''}`,
    onClick: openMenu,
    "aria-label": "Open menu",
    "aria-expanded": menuOpen ? 'true' : 'false'
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav__burger",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav__burger-bar nav__burger-bar--top"
  }), /*#__PURE__*/React.createElement("span", {
    className: "nav__burger-bar nav__burger-bar--bot"
  })), /*#__PURE__*/React.createElement("span", null, menuOpen ? 'Close' : 'Menu'))), /*#__PURE__*/React.createElement("a", {
    className: "nav__wordmark nav__center",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('home');
      window.scrollTo({
        top: 0
      });
    },
    "aria-label": "Shavit Rootman. Home"
  }, "Shavit", /*#__PURE__*/React.createElement("span", {
    className: "nav__wordmark-gold"
  }, "Rootman")), /*#__PURE__*/React.createElement("div", {
    className: "nav__right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav__icon-btn",
    "aria-label": "Search"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "16.5",
    y1: "16.5",
    x2: "21",
    y2: "21",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("a", {
    className: "nav__cta",
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNav('contact');
      window.scrollTo({
        top: 0
      });
    }
  }, "Partner & Equity"))));
}
function MenuOverlay({
  open,
  onClose,
  page,
  onNav
}) {
  const overlayRef = useNavRef(null);
  const triggerRef = useNavRef(null);
  const items = [['home', 'Home'], ['companies', 'The Operation'], ['case-studies', 'Case Studies'], ['openings', 'Openings'], ['tenants', 'Tenants'], ['meet', 'Meet the Operator'], ['contact', 'Contact']];
  const go = key => {
    onNav(key);
    onClose();
    window.scrollTo({
      top: 0
    });
  };
  useNavEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    // Focus first overlay link
    const first = overlayRef.current && overlayRef.current.querySelector('a, button');
    if (first) first.focus();
    const onKey = e => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = overlayRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const firstEl = list[0],
        lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') triggerRef.current.focus();
    };
  }, [open, onClose]);
  return /*#__PURE__*/React.createElement("div", {
    ref: overlayRef,
    className: `overlay ${open ? 'overlay--open' : ''}`,
    "aria-hidden": !open,
    role: "dialog",
    "aria-modal": open ? 'true' : undefined,
    "aria-label": "Main menu"
  }, /*#__PURE__*/React.createElement("button", {
    className: "overlay__close",
    onClick: onClose,
    "aria-label": "Close menu"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "4",
    x2: "20",
    y2: "20"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "4",
    x2: "4",
    y2: "20"
  }))), /*#__PURE__*/React.createElement("nav", {
    className: "overlay__nav"
  }, items.map(([key, label]) => /*#__PURE__*/React.createElement("a", {
    key: key,
    href: "#",
    className: `overlay__link ${page === key ? 'overlay__link--active' : ''}`,
    onClick: e => {
      e.preventDefault();
      go(key);
    }
  }, label))), /*#__PURE__*/React.createElement("div", {
    className: "overlay__contact"
  }, /*#__PURE__*/React.createElement("a", {
    href: `mailto:${CONTACT.email}`
  }, CONTACT.email), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    href: CONTACT.phoneHref
  }, CONTACT.phone), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("a", {
    href: CONTACT.igHref,
    target: "_blank",
    rel: "noopener noreferrer"
  }, CONTACT.ig)));
}
window.Nav = Nav;
window.MenuOverlay = MenuOverlay;

/* ===== Footer.jsx ===== */
/* global React, CONTACT */
function Footer({
  onNav
}) {
  const go = (e, p) => {
    e.preventDefault();
    onNav(p);
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  };
  return /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__top"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "footer__wordmark"
  }, "Shavit Rootman")), /*#__PURE__*/React.createElement("div", {
    className: "footer__grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "Navigate"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'home')
  }, "Home")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "The Operation")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'case-studies')
  }, "Case Studies")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'openings')
  }, "Openings")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'tenants')
  }, "Tenants")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'meet')
  }, "Meet the Operator")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'contact')
  }, "Contact")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'accessibility')
  }, "Accessibility")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'legal')
  }, "Legal & Privacy")))), /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "Where We Operate"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Michigan \xB7 Hillsdale & Jackson Co")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Ohio \xB7 Cleveland")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Indiana \xB7 South Bend")))), /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "Connect"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "https://shavitrootman.substack.com",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Substack")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: CONTACT.igHref,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Instagram")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: CONTACT.liHref,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "LinkedIn")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: `mailto:${CONTACT.email}`
  }, "Email")))), /*#__PURE__*/React.createElement("div", {
    className: "footer__col"
  }, /*#__PURE__*/React.createElement("h5", null, "Contact"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: `mailto:${CONTACT.email}`
  }, CONTACT.email)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: CONTACT.phoneHref
  }, CONTACT.phone))))), /*#__PURE__*/React.createElement("div", {
    className: "footer__bottom"
  }, /*#__PURE__*/React.createElement("div", null, "\xA9 2026 Rootman. All Rights Reserved. \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'legal')
  }, "Legal & Privacy")), /*#__PURE__*/React.createElement("div", null, "Building communities, profitably \xB7 MI \xB7 OH \xB7 IN")), /*#__PURE__*/React.createElement("div", {
    className: "footer__disclaimer"
  }, "Not an offer to sell or a solicitation to buy any security. Informational only; not investment, legal, or tax advice. Real estate investing carries risk, including loss of principal. Not currently accepting new inquiries. See ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'legal')
  }, "Legal & Privacy"), "."));
}
window.Footer = Footer;

/* ===== HomePage.jsx ===== */
/* global React, VideoHero, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */

/* =================================================================
   HOME — deliberately short. Authentic imagery only: the Ken Burns
   hero (real portfolio photos), Shavit's portrait, nothing staged.
   Routing cards are text-only by design — no stock photography.
   ================================================================= */

const HOME_CASES = [{
  pull: 'PROFESSIONAL\nACROSS THE BOARD.',
  quote: "Selling my property, transferring the loan, having Shavit and his team assume my loan. Every step was excellent. Professional across the board, and the kind of operator who makes you feel like family.",
  attr: 'Jeffrey S. Riling · Sold direct to the operator',
  avatar: SHAVIT_PHOTOS.jef
}, {
  pull: 'RELIABLE PARTNER.\nTRUSTWORTHY FRIEND.',
  quote: "Extensive knowledge, remarkable attention to detail, a man of his word. Shavit is not only a reliable business partner but also a trustworthy friend. I'm confident in reaching out to him in any predicament.",
  attr: 'Nicky · Cleveland Real Estate Investor',
  avatar: SHAVIT_PHOTOS.nicky
}];
function HomePage({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement(VideoHero, {
    blueprint: true,
    eyebrow: "Building Communities, Profitably",
    h1Lines: ['Overlooked housing,', 'long-term homes.'],
    sub: "Shavit Rootman acquires overlooked housing across Midwest communities and transforms it into long-term homes for families. 50 doors today. 200 by 2030.",
    videoSrc: HERO_VIDEO,
    videoLabel: "Portfolio \xB7 Hillsdale / Cleveland / South Bend",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "gold",
      onClick: () => {
        onNav('companies');
        window.scrollTo({
          top: 0
        });
      }
    }, "See The Operation \u2192"), /*#__PURE__*/React.createElement(Btn, {
      variant: "ghost",
      onClick: () => {
        onNav('meet');
        window.scrollTo({
          top: 0
        });
      }
    }, "Meet The Operator \u2192"))
  }), /*#__PURE__*/React.createElement("section", {
    className: "band band--tight",
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner section-head",
    style: {
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Four Ways In")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Where do we go.']
  }))), /*#__PURE__*/React.createElement(TriPaths, {
    onNav: onNav,
    items: [{
      label: 'THE OPERATION',
      headline: 'THREE STATES. ONE PLAYBOOK.',
      body: 'How the portfolio runs across Michigan, Ohio, and Indiana — BRRRR, done differently.',
      cta: 'See The Operation',
      page: 'companies',
      photo: 'Property · Stabilized Asset · Golden Hour',
      src: STOCK.luxuryDusk,
      filter: 'saturate(1.05) contrast(1.05)'
    }, {
      label: 'PARTNER & EQUITY',
      headline: 'OPERATOR-LED PARTNERSHIPS.',
      body: 'Partnerships and equity are discussed privately, one-on-one.*',
      cta: 'Learn More',
      page: 'contact',
      photo: 'Office · Partnership Conversation',
      src: STOCK.meeting,
      filter: 'brightness(0.85) saturate(0.95) contrast(1.05)'
    }, {
      label: 'OPENINGS',
      headline: 'AVAILABLE HOMES.',
      body: 'Current and upcoming availability across the portfolio.',
      cta: 'View Openings',
      page: 'openings',
      photo: 'Streetscape · Hillsdale & Jackson County',
      src: STOCK.suburbStreet,
      filter: 'saturate(0.95) contrast(1.05) brightness(0.95)'
    }, {
      label: 'TENANTS',
      headline: 'ALREADY HOME WITH US.',
      body: 'Maintenance, rent, and a direct line to management.',
      cta: 'Tenant Resources',
      page: 'tenants',
      photo: 'Closing Table · Hillsdale, MI',
      src: STOCK.signingDeal,
      filter: 'sepia(0.12) saturate(1.1) brightness(0.92)'
    }]
  }), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SurfaceSweep, null), /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head section-head--left"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Numbers Today")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['50 doors. Three states.', '$12M and counting.'],
    lineDelay: 180
  })), /*#__PURE__*/React.createElement(StatsGrid, {
    rows: [{
      value: /*#__PURE__*/React.createElement(Counter, {
        to: 50,
        suffix: "+"
      }),
      label: 'Doors Owned & Operated'
    }, {
      value: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "currency"
      }, "$"), /*#__PURE__*/React.createElement(Counter, {
        to: 12,
        suffix: "M+"
      })),
      label: 'Portfolio Value'
    }, {
      value: /*#__PURE__*/React.createElement(Counter, {
        to: 3
      }),
      label: 'States · MI · OH · IN'
    }, {
      value: /*#__PURE__*/React.createElement(Counter, {
        to: 200
      }),
      label: 'Door Goal · 2030'
    }]
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 600
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 720,
      marginTop: 48
    }
  }, "The playbook is ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#FFC000',
      fontWeight: 700
    }
  }, "BRRRR"), " \u2014 Buy \u2192 Rehab \u2192 Rent \u2192 Refinance \u2192 Repeat \u2014 run differently: bought direct from owners with no agents on either side, rebuilt by in-house crews, held under in-house management. Each completed cycle becomes its own company.")))), /*#__PURE__*/React.createElement("section", {
    className: "split"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "split__media ph-vignette",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Placeholder, {
    src: SHAVIT_PHOTOS.portraitLI,
    alt: "Shavit Rootman",
    filter: "contrast(1.06) saturate(0.95) brightness(0.95)",
    portrait: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "split__panel"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Operator")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['Discipline first.', 'Communities always.'],
    lineDelay: 200,
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 800
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 24,
      marginBottom: 24
    }
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1000
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 520
    }
  }, "Israeli special operations, then Hillsdale College, then 50 doors. The discipline carried over \u2014 and the communities he operates in are the point. Tenants he has mentored now run services across the portfolio.")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1600
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      onNav('meet');
      window.scrollTo({
        top: 0
      });
    }
  }, "Meet The Operator \u2192"))))), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SurfaceSweep, null), /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head section-head--left"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Case Studies")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['The work speaks.']
  })), /*#__PURE__*/React.createElement("div", {
    className: "qcards"
  }, HOME_CASES.map((c, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    as: "article",
    className: "qcard",
    mode: "rise",
    delay: i * 300
  }, /*#__PURE__*/React.createElement(LineReveal, {
    as: "h3",
    className: "qcard__pull",
    lines: c.pull.split('\n'),
    lineDelay: 150
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 500 + i * 300
  }, /*#__PURE__*/React.createElement(GoldRule, null)), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 900 + i * 300
  }, /*#__PURE__*/React.createElement("p", {
    className: "qcard__quote"
  }, c.quote)), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1200 + i * 300
  }, /*#__PURE__*/React.createElement("div", {
    className: "qcard__attr"
  }, c.avatar && /*#__PURE__*/React.createElement("img", {
    src: c.avatar,
    alt: "",
    className: "qcard__avatar",
    referrerPolicy: "no-referrer"
  }), /*#__PURE__*/React.createElement("span", null, c.attr)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 48
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 400
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      onNav('case-studies');
      window.scrollTo({
        top: 0
      });
    }
  }, "See All Case Studies \u2192"))))), /*#__PURE__*/React.createElement(CtaBand, {
    eyebrow: "Partner & Equity",
    hLines: ['Building', 'communities,', 'profitably.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "gold",
      onClick: () => {
        onNav('contact');
        window.scrollTo({
          top: 0
        });
      }
    }, "Partner & Equity \u2192"), /*#__PURE__*/React.createElement("p", {
      className: "body-md",
      style: {
        marginTop: 16,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)'
      }
    }, "* Not currently accepting new inquiries."))
  }));
}
window.HomePage = HomePage;

/* ===== CompaniesPage.jsx ===== */
/* global React, VideoHero, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */
const {
  useState: useCompState
} = React;

/* =================================================================
   THE OPERATION — organized by state, not by entity.
   Legal entities exist for liability protection only; the public
   site presents one operation across three states.
   ================================================================= */

const PORTFOLIO_STATS = [{
  value: /*#__PURE__*/React.createElement(Counter, {
    to: 50,
    suffix: "+"
  }),
  label: 'Doors Owned & Operated'
}, {
  value: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "currency"
  }, "$"), /*#__PURE__*/React.createElement(Counter, {
    to: 12,
    suffix: "M+"
  })),
  label: 'Portfolio Value'
}, {
  value: /*#__PURE__*/React.createElement(Counter, {
    to: 3
  }),
  label: 'States · MI · OH · IN'
}, {
  value: /*#__PURE__*/React.createElement(Counter, {
    to: 200
  }),
  label: 'Door Goal · 2030'
}];
const STATES = [{
  name: 'Michigan',
  market: 'Hillsdale · Jackson County',
  photo: 'Long-Term Residential',
  src: SHAVIT_PHOTOS.loPresto,
  filter: 'saturate(0.98) contrast(1.05)',
  body: ["The heart of the operation. Single-family and small multi-family homes in Hillsdale and Jackson County, acquired through the BRRRR loop, fully renovated, and stabilized for working families, students, and locals alike.", "The 2030 goal is concrete: 100 homes revitalized in Hillsdale, with the housing standard raised in a market long served by absentee owners."],
  specs: [['Focus', 'Long-term residential & community housing'], ['Tenants', 'Working families, students, faculty, locals'], ['Markets', 'Hillsdale · Jackson County']]
}, {
  name: 'Ohio',
  market: 'Cleveland',
  photo: 'Cleveland Brick',
  src: STOCK.brickFacade,
  filter: 'saturate(0.85) brightness(0.92)',
  body: ["Furnished mid-term housing in Cleveland submarkets adjacent to the hospital systems and universities. Average stays run 30 to 180 days — the medical corridor, traveling professionals, and graduate students.", "The mispricing sits in the gap between hotel inventory and traditional 12-month leases. The operation lives in that gap."],
  specs: [['Focus', 'Furnished mid-term housing'], ['Tenants', 'Medical, traveling pros, grad students'], ['Markets', 'Cleveland']]
}, {
  name: 'Indiana',
  market: 'South Bend',
  photo: 'Before Renovation',
  src: SHAVIT_PHOTOS.secondChance,
  filter: 'saturate(1) contrast(1.05)',
  body: ["Not all real estate is sexy. In South Bend the operation acquires distressed and overlooked single-family homes others walk past — bad histories, deferred maintenance, sellers who need an exit before foreclosure.", "Then the work happens. Down to the studs if needed, rebuilt to a standard a family wants to live in, re-rented long-term. Second-chance housing that holds."],
  specs: [['Focus', 'Distressed acquisition & full rehab'], ['Tenants', 'Long-term working families'], ['Markets', 'South Bend']]
}];
function StateDive({
  data,
  flip
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: `deep ${flip ? 'deep--flip' : ''}`,
    style: data.src ? undefined : {
      gridTemplateColumns: '1fr'
    }
  }, data.src && /*#__PURE__*/React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "deep__media"
  }, /*#__PURE__*/React.createElement(Placeholder, {
    label: data.photo,
    src: data.src,
    filter: data.filter,
    kind: "photo"
  })), /*#__PURE__*/React.createElement("div", {
    className: "deep__panel"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, data.market)), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: [data.name],
    baseDelay: 300
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1100
  }, /*#__PURE__*/React.createElement(GoldRule, null)), data.body.map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    mode: "rise-sm",
    delay: 1300 + i * 250
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 540,
      marginBottom: 8,
      color: '#fff'
    }
  }, p))), /*#__PURE__*/React.createElement("dl", {
    style: {
      marginTop: 16
    }
  }, data.specs.map(([k, v], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    mode: "fade",
    delay: 1800 + i * 150,
    className: "deep__spec"
  }, /*#__PURE__*/React.createElement("dt", null, k), /*#__PURE__*/React.createElement("dd", null, v))))));
}

/* BRRRR, done differently — the expanded playbook (photo scroll panels) */
const BRRRR_DIFF = [{
  num: '01',
  title: 'Buy direct.',
  desc: 'Properties are bought directly from owners — including sellers who need an exit before foreclosure. No agents on either side. The fees stay in the deal, and sellers get certainty instead of a listing.',
  photo: 'Acquisition Target · Midwest',
  src: STOCK.luxuryDusk,
  filter: 'saturate(1.05) contrast(1.05)'
}, {
  num: '02',
  title: 'Rebuild in-house.',
  desc: 'In-house crews run every renovation top to bottom, tracked weekly on execution sheets across every trade. No general-contractor markup, no waiting on someone else\u2019s schedule.',
  photo: 'Renovation In Progress',
  src: STOCK.deskDocs,
  filter: 'grayscale(0.5) contrast(1.1) brightness(0.9)'
}, {
  num: '03',
  title: 'A company per cycle.',
  desc: 'Each completed BRRRR becomes its own operating company — clean books, clean ownership, built to hold. The entities are legal protection; the operation is one.',
  photo: 'Stabilized Operation',
  src: STOCK.modernWhite,
  filter: 'sepia(0.15) saturate(1.05) brightness(0.95)'
}, {
  num: '04',
  title: 'Managed in-house.',
  desc: 'Stabilized doors are managed by the operation\u2019s own team — maintenance, tenants, and reporting all under one roof. Tenants mentored by the operator now provide services back across the portfolio.',
  photo: 'Management Walkthrough',
  src: STOCK.meeting,
  filter: 'brightness(0.85) saturate(0.95)'
}];
function BrrrrDiff() {
  const {
    useState: useS,
    useEffect: useE,
    useRef: useR
  } = React;
  const [active, setActive] = useS(0);
  const panelRefs = useR([]);
  useE(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = Number(e.target.dataset.idx);
          setActive(idx);
        }
      });
    }, {
      threshold: 0.5
    });
    panelRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("section", {
    className: "process"
  }, BRRRR_DIFF.map((st, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    ref: el => panelRefs.current[i] = el,
    "data-idx": i,
    className: `process__panel ${i % 2 === 1 ? 'process__panel--flip' : ''}`
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "process__media"
  }, /*#__PURE__*/React.createElement(Placeholder, {
    label: st.photo,
    src: st.src,
    filter: st.filter,
    kind: "photo"
  })), /*#__PURE__*/React.createElement("div", {
    className: "process__copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "process__num-stack"
  }, /*#__PURE__*/React.createElement("div", {
    key: `num-${i}-${active === i ? 'on' : 'off'}`,
    className: active === i ? 'process__num process__num--enter' : 'process__num',
    style: {
      opacity: active === i ? 1 : 0.25
    }
  }, st.num)), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(GoldRule, null)), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h3",
    className: "process__title",
    lines: [st.title],
    threshold: 0.4
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 400
  }, /*#__PURE__*/React.createElement("p", {
    className: "process__desc"
  }, st.desc)), /*#__PURE__*/React.createElement("div", {
    className: "process__pips"
  }, [0, 1, 2, 3].map(j => /*#__PURE__*/React.createElement("span", {
    key: j,
    className: `pip ${j <= active ? 'pip--on' : ''}`
  })))))));
}
const FAQ = [{
  q: 'How do partnerships start?',
  a: 'With a conversation, not a form. Nothing on this site is an offer — partnership and equity specifics are discussed privately, one-on-one. New inquiries are not currently being accepted.'
}, {
  q: 'What does the BRRRR cycle look like?',
  a: 'Buy direct from the owner, rehab fully in-house, place a long-term tenant, refinance the equity back out, repeat — with each stabilized cycle structured as its own company.'
}, {
  q: 'Why are there multiple legal entities?',
  a: 'Legal protection only. Each completed project is held in its own entity for clean ownership and liability separation. Operationally, it is one portfolio, one team, one playbook.'
}, {
  q: 'Does the operation work as an agent for buyers or sellers?',
  a: 'No. The operation represents its own portfolio only — no brokerage, no agency services, no client representation. Owners who want to sell directly can reach out when inquiries reopen.'
}, {
  q: "What's the exit strategy?",
  a: 'Every project is underwritten to a defined exit — refinance, sale, or 1031 — and that plan is set in writing before anything moves forward.'
}];
function FaqList() {
  const [open, setOpen] = useCompState(0);
  return /*#__PURE__*/React.createElement("div", {
    className: "faq"
  }, FAQ.map((it, i) => {
    const isOpen = open === i;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `faq__item ${isOpen ? 'faq__item--open' : ''}`
    }, /*#__PURE__*/React.createElement("button", {
      className: "faq__q",
      onClick: () => setOpen(isOpen ? -1 : i)
    }, /*#__PURE__*/React.createElement("span", null, it.q), /*#__PURE__*/React.createElement("span", {
      className: "faq__icon"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, isOpen ? /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "faq__a"
    }, /*#__PURE__*/React.createElement("div", {
      className: "faq__a-inner"
    }, /*#__PURE__*/React.createElement("p", null, it.a))));
  }));
}
function CompaniesPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement(VideoHero, {
    height: "80vh",
    eyebrow: "The Operation",
    h1Lines: ['One operation.', 'Three states.'],
    sub: "Every door owned and operated in-house across Michigan, Ohio, and Indiana. The legal entities are protection; the operation is one.",
    videoLabel: "AERIAL. SOUTHERN MICHIGAN / CLEVELAND",
    videoSrc: HERO_VIDEO
  }), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(SurfaceSweep, null), /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 880,
      textAlign: 'center',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Thesis")), /*#__PURE__*/React.createElement("h2", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    as: "span",
    mode: "rise",
    duration: "1000ms",
    style: {
      display: 'inline-block'
    }
  }, "Building communities,"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(LineReveal, {
    as: "span",
    lines: ['profitably.'],
    baseDelay: 800,
    className: "",
    style: {
      display: 'inline-block'
    }
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1800
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      margin: '32px auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 2200
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginBottom: 16
    }
  }, "The playbook is ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#FFC000',
      fontWeight: 700
    }
  }, "BRRRR"), " \u2014 Buy, Rehab, Rent, Refinance, Repeat \u2014 run differently. Bought direct from owners with no agents on either side. Rebuilt by in-house crews. Held and managed in-house, with each completed cycle structured as its own company.")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 2700
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg"
  }, "The markets are deliberate: Hillsdale, Jackson County, Cleveland, and South Bend. Large enough to scale, small enough to know personally. They reward operators with infrastructure on the ground and punish those underwriting from a distance."))))), /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head section-head--left"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Footprint")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['50 doors. $12M.', 'Three states.'],
    lineDelay: 180
  })), /*#__PURE__*/React.createElement(StatsGrid, {
    rows: PORTFOLIO_STATS
  }))), /*#__PURE__*/React.createElement("section", {
    className: "band",
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner section-head section-head--left"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Where We Operate")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Three states.', 'One standard.'],
    lineDelay: 180
  }))), STATES.map((d, i) => /*#__PURE__*/React.createElement(StateDive, {
    key: i,
    data: d,
    flip: i % 2 === 1
  })), /*#__PURE__*/React.createElement("section", {
    className: "band",
    style: {
      paddingBottom: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner section-head section-head--left"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Playbook, Expanded")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['BRRRR, done differently.']
  }))), /*#__PURE__*/React.createElement(BrrrrDiff, null), /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Questions")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Common questions.']
  })), /*#__PURE__*/React.createElement(FaqList, null))), /*#__PURE__*/React.createElement(CtaBand, {
    eyebrow: "Partner & Equity",
    hLines: ['Building', 'communities,', 'profitably.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "gold",
      onClick: () => {
        onNav && onNav('contact');
        window.scrollTo({
          top: 0
        });
      }
    }, "Partner & Equity \u2192"), /*#__PURE__*/React.createElement("p", {
      className: "body-md",
      style: {
        marginTop: 16,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)'
      }
    }, "* Not currently accepting new inquiries."))
  }));
}
window.CompaniesPage = CompaniesPage;

/* ===== CaseStudiesPage.jsx ===== */
/* global React, VideoHero, StatsGrid, CtaBand, Btn, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, ScrollLinkedColor, SHAVIT_PHOTOS, STOCK, URLS */

const CASES = [{
  flip: false,
  eyebrow: 'Hillsdale, MI · BRRRR Transformation',
  h: '17 Lo Presto Ave.\nFull rebuild.',
  photo: "EXTERIOR. 17 LO PRESTO AVENUE, HILLSDALE",
  src: SHAVIT_PHOTOS.loPresto,
  filter: 'saturate(1.02) contrast(1.05)',
  outcomes: [['Property', '17 Lo Presto Avenue, Hillsdale, MI'], ['Strategy', 'Acquire · Rehab · Rent · Refinance · Repeat'], ['Status', 'Fully renovated · Stabilized · Holding']],
  body: "This was the flagship. A property two blocks from Hillsdale College, acquired, gutted, and rebuilt top to bottom. Refinished hardwood. Full bath remodel with subway tile. New kitchen and laundry. Fresh exterior. Tracked weekly on the execution sheet across every trade until it was done. Now contributing long-term housing back to the community.",
  panelIron: false,
  avatar: null,
  featured: true
}, {
  flip: true,
  eyebrow: 'Hillsdale, MI · Package Acquisition',
  h: 'Three homes,\nunder $300K, one close.',
  photo: "EXTERIOR. PACKAGE OF THREE HILLSDALE HOMES",
  src: SHAVIT_PHOTOS.ssThreeHomes,
  filter: 'contrast(1.05) brightness(0.96)',
  outcomes: [['Acquisition', 'Three single-family homes, simultaneously'], ['Negotiation', 'Under $300,000. package deal pricing'], ['Structure', 'Renovations completed in-house']],
  body: "One of our entities acquired three single-family homes at once. We negotiated under $300,000 by offering a package deal, closing on more than one property in a single transaction, and proposing to complete all renovations independently. Same operator. Same crew. Three doors added to the portfolio in a single closing. The package-deal lever only works when you have the team and the systems already in place to deliver on the renovation side.",
  panelIron: false,
  avatar: null
}, {
  flip: true,
  eyebrow: 'Michigan · Second Chance Housing',
  h: 'Not all real estate\nis sexy.',
  photo: "EXTERIOR. CREAM-COLORED MI HOME, REHAB",
  src: SHAVIT_PHOTOS.secondChance,
  filter: 'saturate(1) contrast(1.05)',
  outcomes: [['Asset', 'Cream-colored single-family, Michigan'], ['Approach', 'Eviction · Ozone treatment · Full clean · Re-rent'], ['Outcome', 'Restored. Re-rented to a working family.']],
  body: "We acquired the property with a difficult tenant situation and significant deferred maintenance. We worked through the eviction, ran ozone treatment, cleaned it to the studs, and put it back on the market. stabilized with a new long-term tenant. The numbers work because we showed up and did the work. Second-chance housing.",
  panelIron: true,
  avatar: null
}, {
  flip: true,
  eyebrow: 'Jackson County, MI · Direct Purchase',
  h: 'Professional\nacross the board.',
  photo: "EXTERIOR. JACKSON COUNTY PROPERTY",
  src: STOCK.modernWhite,
  filter: 'grayscale(0.3) contrast(1.1) brightness(0.94)',
  outcomes: [['Structure', 'Bought direct · loan assumption · no agents'], ['Duration', 'Closed in 60 days'], ['Seller', 'Jeffrey S. Riling, US Veteran']],
  body: "The entire experience of selling my property, transferring my loan, having Shavit and his team assume my loan, and ultimately paying it off has been excellent. Shavit has consistently displayed professionalism across all aspects of his work. What stands out, though, is the kindness and camaraderie he brings to the table, making you feel like part of the family. I would recommend him to anyone considering a partnership.",
  panelIron: true,
  avatar: SHAVIT_PHOTOS.jef
}, {
  flip: false,
  eyebrow: 'Cleveland, OH · Investor Partnership',
  h: 'Reliable partner.\nTrustworthy friend.',
  photo: "STREETSCAPE. CLEVELAND MEDICAL CORRIDOR",
  src: STOCK.cityDusk,
  filter: 'sepia(0.15) saturate(1.1) brightness(0.95)',
  outcomes: [['Relationship', 'Ongoing investor partnership'], ['Markets', 'Cleveland metro'], ['Partner', 'Nicky, Real Estate Investor & Landlord']],
  body: "As a real estate investor, I crossed paths with Shavit by chance, and I'm glad I did. Our lunch meeting quickly revealed his extensive knowledge and his familiarity with the surroundings. Beyond his demeanor, Shavit is a man of his word. Despite language differences, our shared humor fosters understanding. Shavit is both a reliable business partner and a trustworthy friend. I'm confident in reaching out to him in any predicament.",
  panelIron: false,
  avatar: SHAVIT_PHOTOS.nicky
}];
function CaseStudy({
  data
}) {
  const lines = data.h.split('\n');
  return /*#__PURE__*/React.createElement("article", {
    className: `cstudy ${data.flip ? 'cstudy--flip' : ''}`,
    style: data.src ? undefined : {
      gridTemplateColumns: '1fr'
    }
  }, data.src && /*#__PURE__*/React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "cstudy__media"
  }, /*#__PURE__*/React.createElement(Placeholder, {
    label: data.photo,
    src: data.src,
    filter: data.filter,
    kind: "photo"
  })), /*#__PURE__*/React.createElement("div", {
    className: `cstudy__panel ${data.panelIron ? 'cstudy__panel--iron' : ''}`
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, data.eyebrow)), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: lines,
    lineDelay: 200
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: lines.length * 200 + 700
  }, /*#__PURE__*/React.createElement(GoldRule, null)), /*#__PURE__*/React.createElement("dl", {
    style: {
      marginTop: 8,
      marginBottom: 8
    }
  }, data.outcomes.map(([k, v], i) => {
    const isPartner = k.toLowerCase() === 'partner';
    return /*#__PURE__*/React.createElement(Reveal, {
      key: i,
      mode: "fade",
      delay: lines.length * 200 + 1000 + i * 200,
      className: "cstudy__outcome"
    }, /*#__PURE__*/React.createElement("dt", null, k), /*#__PURE__*/React.createElement("dd", null, isPartner && data.avatar && /*#__PURE__*/React.createElement("img", {
      src: data.avatar,
      alt: "",
      className: "cstudy__avatar",
      referrerPolicy: "no-referrer"
    }), /*#__PURE__*/React.createElement("span", null, v)));
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: lines.length * 200 + 1800
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 560,
      marginTop: 16
    }
  }, data.body))));
}
function CaseStudiesPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement("section", {
    className: "hero hero--80vh hero--enter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__media"
  }, /*#__PURE__*/React.createElement(Placeholder, {
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05) contrast(1.05)",
    label: "STILL. PORTFOLIO PROPERTIES MONTAGE",
    kind: "video"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero__scrim"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero__inner hero__inner--center",
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Case Studies"), /*#__PURE__*/React.createElement("h1", {
    className: "h-mega",
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(LineReveal, {
    as: "span",
    lines: ['The work.'],
    triggerOnView: false,
    baseDelay: 600
  }), /*#__PURE__*/React.createElement(ScrollLinkedColor, {
    as: "span",
    style: {
      display: 'block'
    }
  }, "In partners' words.")), /*#__PURE__*/React.createElement("p", {
    className: "body-lg hero__sub",
    style: {
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, "Every property has a story. Every partnership has a result. Below, what people who've worked with Shavit say about it.")), /*#__PURE__*/React.createElement("div", {
    className: "hero__progress"
  })), CASES.map((c, i) => /*#__PURE__*/React.createElement(CaseStudy, {
    key: i,
    data: c
  })), /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head section-head--left"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Track Record")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['Outcomes, not promises.']
  })), /*#__PURE__*/React.createElement(StatsGrid, {
    rows: [{
      value: /*#__PURE__*/React.createElement(Counter, {
        to: 50,
        suffix: "+",
        duration: 2400
      }),
      label: 'Doors Owned & Operated'
    }, {
      value: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        className: "currency"
      }, "$"), /*#__PURE__*/React.createElement(Counter, {
        to: 12,
        suffix: "M+",
        duration: 2400
      })),
      label: 'Portfolio Value'
    }, {
      value: /*#__PURE__*/React.createElement(Counter, {
        to: 3,
        duration: 2400
      }),
      label: 'States · MI · OH · IN'
    }, {
      value: /*#__PURE__*/React.createElement(Counter, {
        to: 200,
        duration: 2400
      }),
      label: 'Door Goal · 2030'
    }]
  }))), /*#__PURE__*/React.createElement(CtaBand, {
    eyebrow: "Partner & Equity",
    hLines: ['Building', 'communities,', 'profitably.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "gold",
      href: "#contact"
    }, "Partner & Equity \u2192"), /*#__PURE__*/React.createElement("p", {
      className: "body-md",
      style: {
        marginTop: 16,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)'
      }
    }, "* Not currently accepting new inquiries."))
  }));
}
window.CaseStudiesPage = CaseStudiesPage;

/* ===== OpeningsPage.jsx ===== */
/* global React, VideoHero, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, CONTACT */

/* =================================================================
   OPENINGS — current and upcoming availability across the portfolio.
   Deliberately minimal: markets + how to ask. Listings rotate too
   fast for a static site, so the page routes people to one inbox.
   ================================================================= */

const OPENING_MARKETS = [{
  tag: 'MICHIGAN',
  name: 'Hillsdale & Jackson County',
  desc: 'Long-term single-family and small multi-family homes. Renovated top to bottom before move-in.',
  src: SHAVIT_PHOTOS.loPresto,
  filter: 'saturate(1) contrast(1.05)',
  photo: 'Hillsdale Home'
}, {
  tag: 'OHIO',
  name: 'Cleveland',
  desc: 'Furnished mid-term units, 30–180 day stays. Near the hospital corridor and universities.',
  src: STOCK.brickFacade,
  filter: 'sepia(0.12) saturate(1.05) contrast(1.05)',
  photo: 'Cleveland Brick'
}, {
  tag: 'INDIANA',
  name: 'South Bend',
  desc: 'Fully rebuilt long-term homes for working families.',
  src: SHAVIT_PHOTOS.secondChance,
  filter: 'saturate(1) contrast(1.05)',
  photo: 'South Bend Home'
}];
function OpeningsPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement(VideoHero, {
    height: "80vh",
    align: "center",
    eyebrow: "Openings",
    h1Lines: ['Available homes.'],
    sub: "Current and upcoming availability across Michigan, Ohio, and Indiana.",
    videoLabel: "STREETSCAPE. HILLSDALE, MI",
    videoSrc: HERO_VIDEO
  }), /*#__PURE__*/React.createElement("section", {
    className: "band band__inner",
    style: {
      maxWidth: 1440,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head section-head--left",
    style: {
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Markets")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Three states.', 'One standard.'],
    lineDelay: 200
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 800
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 640,
      marginTop: 16
    }
  }, "Every home is renovated before it is rented \u2014 kitchens, baths, mechanicals \u2014 and managed in-house after. Availability moves quickly and is handled by email."))), /*#__PURE__*/React.createElement("div", {
    className: "cards cards-3",
    style: {
      borderTop: '1px solid #202020',
      borderBottom: '1px solid #202020'
    }
  }, OPENING_MARKETS.map((c, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    as: "div",
    mode: "rise",
    delay: i * 200,
    className: "ccard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccard__media"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccard__photo-zoom"
  }, /*#__PURE__*/React.createElement(Placeholder, {
    label: c.photo,
    src: c.src,
    filter: c.filter,
    kind: "photo"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ccard__body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ccard__tag"
  }, c.tag), /*#__PURE__*/React.createElement("h3", {
    className: "ccard__name"
  }, c.name), /*#__PURE__*/React.createElement("p", {
    className: "ccard__desc"
  }, c.desc)), /*#__PURE__*/React.createElement("span", {
    className: "ccard__rule",
    "aria-hidden": "true"
  }))))), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      textAlign: 'center',
      maxWidth: 720,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Ask About Availability")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['One email. Real answer.'],
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 800
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 24,
      color: 'rgba(255,255,255,0.72)'
    }
  }, "Send the market you\u2019re interested in, your timeline, and who\u2019s moving in. Management replies directly.")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1200,
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "gold",
    href: `mailto:${CONTACT.email}?subject=Openings%20Inquiry`
  }, "Email About Openings \u2192")))));
}
window.OpeningsPage = OpeningsPage;

/* ===== TenantsPage.jsx ===== */
/* global React, VideoHero, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, CONTACT */

/* =================================================================
   TENANTS — resources for current tenants. Minimal by design:
   who to contact, for what, and how fast to expect an answer.
   ================================================================= */

const TENANT_ROWS = [{
  lbl: 'Maintenance & repairs',
  desc: 'Something broken, leaking, or not working? Email with your address and a photo if you can. Urgent issues are triaged first.',
  cta: 'Email Maintenance',
  subject: 'Maintenance%20Request'
}, {
  lbl: 'Rent & payments',
  desc: 'Questions about rent, payment methods, or your lease terms.',
  cta: 'Email About Rent',
  subject: 'Rent%20Question'
}, {
  lbl: 'Everything else',
  desc: 'Lease renewals, move-out, or anything that does not fit a category.',
  cta: 'Email Management',
  subject: 'Tenant%20Question'
}];
function TenantsPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement(VideoHero, {
    height: "80vh",
    align: "center",
    eyebrow: "Tenants",
    h1Lines: ['Already home', 'with us.'],
    sub: "Resources and a direct line for current tenants.",
    videoLabel: "INTERIOR. RENOVATED KITCHEN",
    videoSrc: HERO_VIDEO
  }), /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 880,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "How To Reach Management")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['Direct, and answered.']
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "contact-rows",
    style: {
      marginTop: 24
    }
  }, TENANT_ROWS.map((r, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    mode: "fade",
    delay: i * 200,
    className: "contact-row",
    style: {
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, r.lbl), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      margin: 0
    }
  }, r.desc), /*#__PURE__*/React.createElement("a", {
    className: "tlink tlink--gold",
    href: `mailto:${CONTACT.email}?subject=${r.subject}`
  }, r.cta, " \u2192"))))), /*#__PURE__*/React.createElement("p", {
    className: "body-md",
    style: {
      textAlign: 'center',
      marginTop: 48,
      color: 'var(--color-mute-warm)',
      fontSize: 13,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }
  }, "Phone for urgent matters: ", /*#__PURE__*/React.createElement("a", {
    href: CONTACT.phoneHref,
    style: {
      color: 'inherit'
    }
  }, CONTACT.phone)))), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      textAlign: 'center',
      maxWidth: 720,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Standard")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['Managed in-house.', 'On purpose.'],
    lineDelay: 180,
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 24,
      color: 'rgba(255,255,255,0.72)'
    }
  }, "Every home in the portfolio is managed by the operation\u2019s own team \u2014 no third-party call centers. Several of the people maintaining these homes started as tenants here.")))));
}
window.TenantsPage = TenantsPage;

/* ===== MeetPage.jsx ===== */
/* global React, CtaBand, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS */

/* =================================================================
   MEET THE OPERATOR — intentionally short, and the ONE page written
   in first person. The company pages speak in third person; here
   Shavit speaks for himself. Personal life stays on Substack.
   Sections:
     1. Hero split (identity)
     2. Owner statement — why I do what I do
     3. Philosophy centerpiece
     4. Photo band (the work)
     5. Substack pointer (one line — the longer story lives there)
     6. Pre-footer CTA
   ================================================================= */

function HeroSplit() {
  return /*#__PURE__*/React.createElement("section", {
    className: "split hero--enter",
    style: {
      minHeight: '80vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "split__panel",
    style: {
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Operator"), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h1",
    className: "h-mega",
    lines: ['Meet the', 'operator.'],
    triggerOnView: false,
    baseDelay: 600,
    lineDelay: 200,
    style: {
      marginTop: 24
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1600
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1800
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 480,
      fontStyle: 'italic'
    }
  }, "\u201CBuilding communities, profitably.\u201D")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 2000
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-md",
    style: {
      maxWidth: 480,
      marginTop: 12,
      color: 'rgba(255,255,255,0.65)'
    }
  }, "Shavit Rootman \xB7 IDF Special Operations \xB7 Hillsdale College \xB7 Operator"))), /*#__PURE__*/React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "split__media ph-vignette",
    style: {
      minHeight: 640,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Placeholder, {
    src: SHAVIT_PHOTOS.portraitLI,
    alt: "Shavit Rootman",
    filter: "contrast(1.06) saturate(0.95) brightness(0.95)",
    portrait: true
  })));
}

/* Owner statement — first person, why I do what I do */
function OwnerStatement() {
  const paragraphs = ["I served in an Israeli special operations unit before I ever touched a spreadsheet. Service taught me the three things this work requires: read the situation under pressure, trust the people next to you, and execute when execution is the only option left.", "In 2016 I came to Hillsdale College. Senior year, a conversation in a renovated carriage house became a thesis: housing, done with discipline and designed around the community, could transform a town like this one. I never left the idea.", "Today I own and operate housing across Michigan, Ohio, and Indiana. I buy overlooked properties directly from their owners, rebuild them with my own crews, and hold them for the long term. Tenants I have mentored now run cleaning, handyman, and maintenance services back across the portfolio. Some are on their way to owning homes of their own.", "I do this because I am passionate about the communities I operate in. There is a gap in towns like Hillsdale between the people doing well and the people struggling underneath, and housing is the bridge. The goal by 2030 is concrete: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, 25 local jobs. Profit and community are not opposites. Run right, each one funds the other."];
  return /*#__PURE__*/React.createElement("section", {
    className: "band act"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner act__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "act__head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    duration: "1400ms"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Owner Statement")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Why I do', 'what I do.'],
    lineDelay: 200,
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1000
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "act__body"
  }, paragraphs.map((p, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    mode: "rise-sm",
    delay: 400 + i * 500
  }, /*#__PURE__*/React.createElement("p", {
    className: "act__p",
    style: {
      marginBottom: i === paragraphs.length - 1 ? 0 : 28
    }
  }, p))))));
}
function MeetPage({
  onNav
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement(HeroSplit, null), /*#__PURE__*/React.createElement(OwnerStatement, null), /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      textAlign: 'center',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Philosophy")), /*#__PURE__*/React.createElement("h2", {
    className: "h-mega",
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement(LineReveal, {
    as: "span",
    lines: ['Building communities,'],
    baseDelay: 300,
    style: {
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement(LineReveal, {
    as: "span",
    lines: ['profitably.'],
    baseDelay: 1600,
    style: {
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 3100
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      margin: '0 auto 32px'
    }
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 3400
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 620,
      margin: '0 auto',
      color: 'rgba(255,255,255,0.72)'
    }
  }, "Tenants become operators. Operators become owners. Pride and purpose, compounding on top of cash flow.")))), /*#__PURE__*/React.createElement(Reveal, {
    as: "section",
    mode: "zoom-xl",
    className: "photo-band",
    style: {
      position: 'relative',
      width: '100%',
      height: 480,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Placeholder, {
    src: SHAVIT_PHOTOS.loPresto,
    label: "17 LO PRESTO AVE. HILLSDALE, MI",
    filter: "contrast(1.05) brightness(0.96)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "photo-band__cap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "photo-band__cap-line"
  }, "17 Lo Presto Avenue, Hillsdale. Fully renovated, stabilized, holding."))), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      textAlign: 'center',
      maxWidth: 720,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "The Longer Story")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['In my own words,', 'on Substack.'],
    lineDelay: 180,
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 24,
      color: 'rgba(255,255,255,0.72)'
    }
  }, "The personal story \u2014 Israel, Hillsdale, the deals, the field notes \u2014 is written separately, in first person, on Substack.")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1300,
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    variant: "ghost",
    href: "https://shavitrootman.substack.com"
  }, "Read the Substack \u2192")))), /*#__PURE__*/React.createElement(CtaBand, {
    eyebrow: "Partner & Equity",
    hLines: ['Building', 'communities,', 'profitably.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Btn, {
      variant: "gold",
      onClick: () => {
        onNav && onNav('contact');
        window.scrollTo({
          top: 0
        });
      }
    }, "Partner & Equity \u2192"), /*#__PURE__*/React.createElement("p", {
      className: "body-md",
      style: {
        marginTop: 16,
        fontSize: 12,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.55)'
      }
    }, "* Not currently accepting new inquiries."))
  }));
}
window.MeetPage = MeetPage;

/* ===== ContactPage.jsx ===== */
/* global React, VideoHero, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS, CONTACT */

function ContactPage() {
  return /*#__PURE__*/React.createElement("div", {
    className: "page-fade"
  }, /*#__PURE__*/React.createElement(VideoHero, {
    height: "80vh",
    align: "center",
    eyebrow: "Partner & Equity",
    h1Lines: ['Contact.'],
    sub: "Partnerships are discussed privately, one-on-one.",
    videoLabel: "STILL. STUDY / DESK INTERIOR AT DUSK",
    videoSrc: HERO_VIDEO
  }), /*#__PURE__*/React.createElement("section", {
    className: "band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 820,
      margin: '0 auto',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "How It Works")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Partner & equity,', 'one-on-one.'],
    lineDelay: 200,
    style: {
      marginTop: 16
    }
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1000
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true,
    style: {
      margin: '32px auto'
    }
  })), /*#__PURE__*/React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 1300
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      marginBottom: 16
    }
  }, "The operation grows through operator-led partnerships and equity alongside the portfolio \u2014 never through public offerings, and never through forms. Nothing on this site is an offer or a solicitation; every partnership starts and stays a private conversation.")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 1700
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-lg",
    style: {
      color: 'rgba(255,255,255,0.72)'
    }
  }, "Owners who want to sell a property directly \u2014 without agents on either side \u2014 are handled the same way: directly.")), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 2100
  }, /*#__PURE__*/React.createElement("p", {
    className: "body-md",
    style: {
      marginTop: 40,
      fontSize: 13,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: 'var(--color-mute-warm, rgba(255,255,255,0.5))'
    }
  }, "* Not currently accepting new inquiries.")))), /*#__PURE__*/React.createElement("section", {
    className: "band band--iron",
    id: "direct"
  }, /*#__PURE__*/React.createElement("div", {
    className: "band__inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, "Direct")), /*#__PURE__*/React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['One line in.']
  }), /*#__PURE__*/React.createElement(Reveal, {
    mode: "fade",
    delay: 1000
  }, /*#__PURE__*/React.createElement(GoldRule, {
    wide: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "contact-rows"
  }, [['Email', CONTACT.email, `mailto:${CONTACT.email}`, false], ['Instagram', CONTACT.ig.toUpperCase(), CONTACT.igHref, true], ['LinkedIn', '/IN/SHAVITROOTMAN', CONTACT.liHref, true]].map(([lbl, val, href, external], i) => /*#__PURE__*/React.createElement(Reveal, {
    key: lbl,
    mode: "fade",
    delay: i * 200,
    className: "contact-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, lbl), /*#__PURE__*/React.createElement("a", {
    className: "val",
    href: href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined
  }, val)))), /*#__PURE__*/React.createElement("p", {
    className: "body-md",
    style: {
      textAlign: 'center',
      marginTop: 48,
      color: 'var(--color-mute-warm)',
      fontSize: 13,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }
  }, "Current tenants: see the Tenants page for maintenance and management contact."))));
}
window.ContactPage = ContactPage;

/* ===== App.jsx ===== */
/* global React, ReactDOM, Nav, MenuOverlay, Footer, HomePage, CompaniesPage, CaseStudiesPage, MeetPage, ContactPage, OpeningsPage, TenantsPage, AccessibilityPage, LegalPage, LogoIntro, CursorRing, ScrollProgress, FilmGrain */
const {
  useState: useAppState,
  useEffect: useAppEffect
} = React;
const PAGES = ['home', 'companies', 'case-studies', 'openings', 'tenants', 'meet', 'contact', 'accessibility', 'legal'];
function App() {
  const [page, setPage] = useAppState(() => {
    const h = (window.location.hash || '').replace('#', '');
    return PAGES.includes(h) ? h : 'home';
  });
  const [menuOpen, setMenuOpen] = useAppState(false);
  useAppEffect(() => {
    window.location.hash = page === 'home' ? '' : page;
  }, [page]);
  useAppEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || '').replace('#', '');
      if (PAGES.includes(h)) setPage(h);else if (!h) setPage('home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useAppEffect(() => {
    // Lock scroll when menu open
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  let PageComp = HomePage;
  if (page === 'companies') PageComp = CompaniesPage;else if (page === 'case-studies') PageComp = CaseStudiesPage;else if (page === 'openings') PageComp = OpeningsPage;else if (page === 'tenants') PageComp = TenantsPage;else if (page === 'meet') PageComp = MeetPage;else if (page === 'contact') PageComp = ContactPage;else if (page === 'accessibility') PageComp = AccessibilityPage;else if (page === 'legal') PageComp = LegalPage;
  const labels = {
    home: '01 Home',
    companies: '02 The Operation',
    'case-studies': '03 Case Studies',
    openings: '04 Openings',
    tenants: '05 Tenants',
    meet: '06 Meet the Operator',
    contact: '07 Contact',
    accessibility: '08 Accessibility',
    legal: '09 Legal & Privacy'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app-shell",
    "data-screen-label": labels[page]
  }, /*#__PURE__*/React.createElement("a", {
    href: "#main-content",
    className: "skip-link"
  }, "Skip to main content"), /*#__PURE__*/React.createElement(FilmGrain, null), /*#__PURE__*/React.createElement(ScrollProgress, null), /*#__PURE__*/React.createElement(LogoIntro, null), /*#__PURE__*/React.createElement(Nav, {
    page: page,
    onNav: setPage,
    openMenu: () => setMenuOpen(true),
    menuOpen: menuOpen
  }), /*#__PURE__*/React.createElement("main", {
    id: "main-content",
    key: page,
    tabIndex: "-1"
  }, /*#__PURE__*/React.createElement(PageComp, {
    onNav: setPage
  })), /*#__PURE__*/React.createElement(Footer, {
    onNav: setPage
  }), /*#__PURE__*/React.createElement(MenuOverlay, {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    page: page,
    onNav: setPage
  }), /*#__PURE__*/React.createElement(CursorRing, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
