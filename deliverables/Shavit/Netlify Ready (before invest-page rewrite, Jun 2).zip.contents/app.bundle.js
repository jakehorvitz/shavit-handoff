/* Shavit Rootman — pre-compiled bundle (JSX transpiled at build time). */

/* ===== Motion.jsx ===== */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState: useMotionState,
  useEffect: useMotionEffect,
  useRef: useMotionRef
} = React;
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
  return React.createElement(Tag, _extends({
    ref: ref,
    "data-reveal": mode,
    className: `${inView ? 'is-in' : ''} ${className}`,
    style: finalStyle
  }, rest), children);
}
function LineReveal({
  as = 'h1',
  lines,
  className = '',
  triggerOnView = true,
  threshold = 0.3,
  lineDelay = 200,
  baseDelay = 0,
  settleAfter = 1400,
  style = {}
}) {
  const [ref, inViewIO] = useInView({
    threshold
  });
  const [tick, setTick] = useMotionState(0);
  const inView = triggerOnView ? inViewIO : true;
  useMotionEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setTick(1), settleAfter + lineDelay * (lines.length - 1) + baseDelay);
    return () => clearTimeout(t);
  }, [inView, settleAfter, lineDelay, lines.length, baseDelay]);
  const Tag = as;
  return React.createElement(Tag, {
    ref: ref,
    className: className,
    style: style
  }, lines.map((line, i) => React.createElement("span", {
    key: i,
    className: `lr-line ${inView ? 'is-in' : ''} ${tick ? 'is-settled' : ''}`,
    style: {
      '--lr-delay': `${baseDelay + i * lineDelay}ms`,
      transitionDelay: `${baseDelay + i * lineDelay}ms`
    }
  }, React.createElement("span", {
    className: "lr-line__text",
    style: {
      transitionDelay: `${baseDelay + i * lineDelay + 100}ms`
    }
  }, line), React.createElement("span", {
    className: "lr-line__rule",
    style: {
      transitionDelay: `${baseDelay + i * lineDelay}ms`
    }
  }))));
}
function SurfaceSweep() {
  const [ref, inView] = useInView({
    threshold: 0.15
  });
  return React.createElement("span", {
    ref: ref,
    className: `surface-sweep ${inView ? 'is-in' : ''}`,
    "aria-hidden": "true"
  });
}
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
        const start = vh;
        const end = vh * 0.25;
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
  return React.createElement(Tag, _extends({
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
const {
  useState,
  useEffect,
  useRef
} = React;
const URLS = {
  work: 'https://docs.google.com/forms/d/e/1FAIpQLSdr6YaVQqR0QnvWQkbaTFhbN2HY3kYqCeGSIIg2LuWKyKz9yw/viewform',
  invest: 'https://docs.google.com/forms/d/e/1FAIpQLSdbfNjiZegvReucCHrXQLLc21KBEbKYsKHXwjb9WcpSbVq5rQ/viewform'
};
const CONTACT = {
  email: 'info@shavitrootman.com',
  phone: '+1 (805) 364-4415',
  phoneHref: 'tel:+18053644415',
  ig: '@shavitness',
  igHref: 'https://instagram.com/shavitness',
  li: '/in/shavitrootman',
  liHref: 'https://linkedin.com/in/shavitrootman'
};
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
    return React.createElement("div", {
      className: "ph-img",
      style: style
    }, React.createElement("img", {
      src: src,
      alt: computedAlt,
      "aria-hidden": decorative ? 'true' : undefined,
      referrerPolicy: "no-referrer",
      loading: "lazy",
      onError: onError,
      style: imgStyle
    }));
  }
  return React.createElement("div", {
    className: `ph ${kind === 'video' ? 'ph--video' : ''} ${portrait ? 'ph--portrait' : ''}`,
    style: style,
    role: "img",
    "aria-label": computedAlt || 'Placeholder media'
  }, React.createElement("div", {
    className: "ph__center",
    "aria-hidden": "true"
  }, "[ ", label, " ]"), React.createElement("div", {
    className: "ph__tag",
    "aria-hidden": "true"
  }, kind === 'video' ? 'Placeholder video' : 'Placeholder photo'));
}
function toSentenceCase(s) {
  if (!s) return '';
  return s.toLowerCase().replace(/\b([a-z])/g, (m, c) => c.toUpperCase()).replace(/\bMi\b/g, 'MI').replace(/\bOh\b/g, 'OH').replace(/\bIn\b/g, 'IN').replace(/\bIdf\b/g, 'IDF').replace(/\bUs\b/g, 'US');
}
function res(id, url) {
  return typeof window !== 'undefined' && window.__resources && window.__resources[id] || url;
}
const HERO_VIDEO = res('heroVideo', 'uploads/Cinematic Real Estate Videography _ Sony FX3.mp4');
const SHAVIT_PHOTOS = {
  portrait: res('portrait', 'assets/shavit-portrait.png'),
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
  ssHillsdale: 'https://substackcdn.com/image/fetch/$s_!kCIk!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2e4be312-3ea5-46f4-a444-ebc2521711a5_1140x641.jpeg',
  ssOrgChem: 'https://substackcdn.com/image/fetch/$s_!Chj3!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4677fec6-1ca3-4a75-8b4d-bf3116106f37_4032x3024.jpeg',
  ssClubBooth: 'https://substackcdn.com/image/fetch/$s_!OM5O!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F35542f41-1542-4ec1-8f16-8e91ac1ddc7e_938x796.png',
  ssMarketTrends: 'https://substackcdn.com/image/fetch/$s_!EDm0!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff0200da3-c3cb-4560-9267-ad8f4367c8fc_1384x754.png',
  ssThankful: 'https://substackcdn.com/image/fetch/$s_!slQX!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7c2060b2-ae52-499d-a84b-8772790feca5_876x928.png',
  ssTwoGen: 'https://substackcdn.com/image/fetch/$s_!6JhI!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd9ea68d7-185d-4fce-8fff-e2c6decd746c_1536x2048.jpeg',
  ssCampusProtest: 'https://substackcdn.com/image/fetch/$s_!eklj!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc4d5cf25-6a2a-4cfe-b6b9-7db5c78c57ae_1626x452.png',
  ssThreeHomes: 'https://substackcdn.com/image/fetch/$s_!fvyL!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffa41a1d3-844d-4531-a7c5-716eb8ec02f8_1438x350.png',
  banner: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/banner.jpg',
  gary: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/gary.png',
  jef: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/jef.png',
  nicky: 'https://shavitrootman.com/wp-content/themes/shavitrootman/assets/images/pro.png'
};
const U = (id, w = 1600) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;
const STOCK = {
  luxuryDusk: U('photo-1564013799919-ab600027ffc6'),
  modernWhite: U('photo-1568605114967-8130f3a36994'),
  suburbStreet: U('photo-1570129477492-45c003edd2be'),
  craftsmanHome: U('photo-1605146768851-eda79da39897'),
  livingRoom: U('photo-1600585154340-be6161a56a0c'),
  studyDesk: U('photo-1564540586988-aa4e53c3d799'),
  cityDusk: U('photo-1496564203457-11bb12075d90'),
  brickFacade: U('photo-1486325212027-8081e485255e'),
  meeting: U('photo-1521791136064-7986c2920216'),
  deskDocs: U('photo-1554224155-6726b3ff858f'),
  signingDeal: U('photo-1450101499163-c8848c66ca85'),
  deskCalm: U('photo-1454165804606-c3d57bc86b40'),
  desertLand: U('photo-1542621334-a254cf47733d'),
  snowyTown: U('photo-1480497490787-505ec076689f'),
  aerialField: U('photo-1500382017468-9049fed747ef'),
  aerialHouse: U('photo-1582268611958-ebfd161ef9cf')
};
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
  return React.createElement("button", {
    className: "hex",
    "aria-label": paused ? 'Play background video' : 'Pause background video',
    onClick: handle
  }, React.createElement("svg", {
    className: "hex__shape",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none"
  }, React.createElement("polygon", {
    points: "25,4 75,4 96,50 75,96 25,96 4,50"
  })), paused ? React.createElement("svg", {
    className: "hex__glyph",
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, React.createElement("polygon", {
    points: "6,4 20,12 6,20"
  })) : React.createElement("svg", {
    className: "hex__glyph",
    width: "12",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, React.createElement("rect", {
    x: "6",
    y: "4",
    width: "4",
    height: "16"
  }), React.createElement("rect", {
    x: "14",
    y: "4",
    width: "4",
    height: "16"
  })));
}
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
    return React.createElement("a", {
      className: cls,
      href: href,
      onClick: handle,
      target: target || (href.startsWith('http') ? '_blank' : undefined),
      rel: href.startsWith('http') ? 'noopener noreferrer' : undefined,
      "aria-label": ariaLabel
    }, children);
  }
  return React.createElement("button", {
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
  return React.createElement("a", {
    className: `tlink ${gold ? 'tlink--gold' : ''}`,
    href: href || '#',
    onClick: onClick,
    target: target || (href && href.startsWith('http') ? '_blank' : undefined),
    rel: href && href.startsWith('http') ? 'noopener noreferrer' : undefined
  }, React.createElement("span", null, children), React.createElement("span", {
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
  return React.createElement("div", {
    className: cls,
    style: style
  }, children);
}
function GoldRule({
  wide = false,
  thick = false,
  style
}) {
  return React.createElement("hr", {
    className: `gold-rule ${wide ? 'gold-rule--wide' : ''} ${thick ? 'gold-rule--thick' : ''}`,
    style: style
  });
}
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
  return React.createElement("span", {
    ref: ref
  }, prefix, n.toLocaleString(), suffix);
}
function Stat({
  value,
  label,
  placeholder = false,
  i = 0
}) {
  const [ref, inView] = useInView({
    threshold: 0.4
  });
  return React.createElement("div", {
    ref: ref,
    className: `stat ${inView ? 'is-in' : ''}`,
    "data-i": i
  }, React.createElement("span", {
    className: "stat__rule"
  }), React.createElement("div", {
    className: placeholder ? 'stat__placeholder' : 'stat__val'
  }, placeholder ? '[ FILL IN ]' : value), React.createElement("div", {
    className: "stat__lbl stat__lbl-anim"
  }, label));
}
function TriPaths({
  items,
  onNav
}) {
  return React.createElement("section", {
    className: "tri"
  }, items.map((it, i) => React.createElement("a", {
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
  }, React.createElement("div", {
    className: "tri__photo"
  }, React.createElement("div", {
    className: "tri__col__photo-zoom"
  }, React.createElement(Placeholder, {
    label: it.photo,
    src: it.src,
    filter: it.filter,
    kind: "photo"
  }))), React.createElement("div", {
    className: "tri__scrim"
  }), React.createElement("div", {
    className: "tri__body"
  }, React.createElement("div", {
    className: "tri__label"
  }, it.label), React.createElement("h3", {
    className: "tri__h"
  }, it.headline), React.createElement("p", {
    className: "tri__p"
  }, it.body), it.goldCta ? React.createElement("span", {
    className: "btn-base btn-gold",
    style: {
      alignSelf: 'flex-start'
    }
  }, it.cta, " ", React.createElement("span", {
    className: "tri__col__arrow"
  }, "\u2192")) : React.createElement("span", {
    className: "tlink"
  }, React.createElement("span", null, it.cta), React.createElement("span", {
    "aria-hidden": "true",
    className: "tri__col__arrow"
  }, "\u2192"))), React.createElement("span", {
    className: "tri__col__rule",
    "aria-hidden": "true"
  }))));
}
function StatsGrid({
  rows
}) {
  return React.createElement("div", {
    className: "stats"
  }, rows.map((r, i) => React.createElement(Stat, _extends({
    key: i,
    i: i
  }, r))));
}
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
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const mute = () => {
      v.muted = true;
      v.volume = 0;
      v.defaultMuted = true;
      if (v.audioTracks) {
        for (let i = 0; i < v.audioTracks.length; i++) {
          try {
            v.audioTracks[i].enabled = false;
          } catch (e) {}
        }
      }
    };
    mute();
    const events = ['loadedmetadata', 'loadeddata', 'play', 'playing', 'canplay', 'canplaythrough', 'volumechange', 'timeupdate', 'seeked'];
    events.forEach(ev => v.addEventListener(ev, mute));
    const id = setInterval(mute, 2000);
    return () => {
      events.forEach(ev => v.removeEventListener(ev, mute));
      clearInterval(id);
    };
  }, [videoSrc]);
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) {
      setPaused(p => !p);
      return;
    }
    v.muted = true;
    v.volume = 0;
    if (v.paused) {
      v.play();
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };
  return React.createElement("section", {
    className: `hero hero--enter ${blueprint ? 'hero--with-bp' : ''} ${height === '80vh' ? 'hero--80vh' : ''}`
  }, React.createElement("div", {
    className: "hero__media",
    "aria-hidden": "true"
  }, videoSrc ? React.createElement("video", {
    ref: videoRef,
    className: "hero__video",
    src: videoSrc,
    poster: poster,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto",
    onLoadedMetadata: e => {
      e.currentTarget.muted = true;
      e.currentTarget.volume = 0;
    },
    onPlay: e => {
      e.currentTarget.muted = true;
      e.currentTarget.volume = 0;
    },
    "aria-hidden": "true",
    tabIndex: "-1"
  }) : React.createElement(Placeholder, {
    label: videoLabel,
    kind: "video",
    decorative: true
  })), React.createElement("div", {
    className: "hero__scrim"
  }), blueprint && React.createElement(BlueprintHouse, null), React.createElement("div", {
    className: `hero__inner ${align === 'center' ? 'hero__inner--center' : ''}`
  }, eyebrow && React.createElement(Eyebrow, {
    gold: eyebrowGold
  }, eyebrow), subTitle && React.createElement("div", {
    className: "body-md",
    style: {
      color: '#fff',
      marginTop: 8,
      opacity: 0.7
    }
  }, subTitle), h1Lines ? React.createElement(LineReveal, {
    as: "h1",
    className: "h-mega",
    lines: h1Lines,
    triggerOnView: false,
    baseDelay: 600,
    lineDelay: 150,
    style: {
      marginTop: 24
    }
  }) : React.createElement("h1", {
    className: "h-mega",
    style: {
      marginTop: 24
    },
    dangerouslySetInnerHTML: {
      __html: h1
    }
  }), sub && React.createElement("p", {
    className: "body-lg hero__sub"
  }, sub), actions && React.createElement("div", {
    className: "hero__actions"
  }, actions)), showPause && React.createElement(HexPauseButton, {
    onClick: togglePlay,
    controlled: true,
    paused: paused
  }), showProgress && React.createElement("div", {
    className: "hero__progress"
  }));
}
function CtaBand({
  eyebrow,
  h,
  hLines,
  actions,
  videoLabel = 'Cinematic Pan · Dusk Street',
  src,
  filter
}) {
  return React.createElement("section", {
    className: "cta-band hero--enter"
  }, React.createElement("div", {
    className: "cta-band__media"
  }, React.createElement(Placeholder, {
    label: videoLabel,
    kind: "video",
    src: src,
    filter: filter
  })), React.createElement("div", {
    className: "cta-band__scrim"
  }), React.createElement("div", {
    className: "cta-band__inner"
  }, eyebrow && React.createElement(Eyebrow, {
    gold: true
  }, eyebrow), hLines ? React.createElement(LineReveal, {
    as: "h2",
    className: "h-mega",
    lines: hLines,
    triggerOnView: true,
    baseDelay: 0,
    lineDelay: 200,
    style: {
      marginTop: 24
    }
  }) : React.createElement("h2", {
    className: "h-mega",
    style: {
      marginTop: 24
    },
    dangerouslySetInnerHTML: {
      __html: h
    }
  }), actions && React.createElement("div", {
    className: "hero__actions"
  }, actions)));
}
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
const {
  useState: useIntroState,
  useEffect: useIntroEffect
} = React;
function LogoIntro() {
  const [phase, setPhase] = useIntroState('pre');
  useIntroEffect(() => {
    if (phase === 'gone') return;
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
  const splitLetters = (word, baseDelay) => word.split('').map((ch, i) => React.createElement("span", {
    key: i,
    className: "intro__letter",
    style: {
      animationDelay: `${baseDelay + i * 60}ms`
    }
  }, ch));
  return React.createElement("div", {
    className: `intro intro--${phase}`,
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "intro__bg"
  }), React.createElement("div", {
    className: "intro__halo"
  }), React.createElement("div", {
    className: "intro__mark"
  }, React.createElement("svg", {
    className: "intro__house",
    viewBox: "0 0 96 64",
    "aria-hidden": "true"
  }, React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    className: "intro__house-path",
    d: "M8 56 L8 30 L48 8 L88 30 L88 56 L8 56 Z"
  }), React.createElement("path", {
    className: "intro__house-path",
    d: "M40 56 L40 36 L56 36 L56 56"
  }), React.createElement("path", {
    className: "intro__house-path",
    d: "M8 56 L88 56",
    strokeWidth: "2"
  }))), React.createElement("span", {
    className: "intro__rule intro__rule--top"
  }), React.createElement("span", {
    className: "intro__line intro__line--a",
    "aria-label": "Shavit"
  }, splitLetters('SHAVIT', 700)), React.createElement("span", {
    className: "intro__line intro__line--b",
    "aria-label": "Rootman"
  }, splitLetters('ROOTMAN', 1100)), React.createElement("span", {
    className: "intro__rule intro__rule--bottom"
  }), React.createElement("span", {
    className: "intro__caption"
  }, "Real Estate, Operated.")));
}
window.LogoIntro = LogoIntro;

/* ===== Forms.jsx ===== */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  useState: useFormState,
  useEffect: useFormEffect,
  useRef: useFormRef
} = React;
const FORM_CONFIG = {
  work: {
    formId: '1FAIpQLSdr6YaVQqR0QnvWQkbaTFhbN2HY3kYqCeGSIIg2LuWKyKz9yw',
    eyebrow: 'Work With Me',
    headline: 'Start the conversation.',
    subhead: 'I review every inquiry personally. Tell me a bit about you and what you\u2019re after. I\u2019ll be in touch within 48 hours.',
    submitText: 'Send Inquiry',
    sections: [{
      label: 'Who you are',
      fields: [{
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_FIRSTNAME',
        autoComplete: 'given-name',
        half: true
      }, {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_LASTNAME',
        autoComplete: 'family-name',
        half: true
      }, {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_EMAIL',
        autoComplete: 'email'
      }, {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_PHONE',
        autoComplete: 'tel'
      }]
    }, {
      label: 'Your experience',
      fields: [{
        name: 'experience',
        label: 'What is your experience with investing in real estate?',
        type: 'radio',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_EXPERIENCE',
        options: ['No properties', '1\u20135 units', '5+ units']
      }]
    }, {
      label: 'What you\u2019re looking for',
      fields: [{
        name: 'structure',
        label: 'What structure are you interested in?',
        type: 'checkbox',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_STRUCTURE',
        options: ['Debt (fixed percentage return on borrowed money)', 'Equity in Projects (passive ownership)', 'Either']
      }, {
        name: 'amount',
        label: 'How much are you looking to invest?',
        placeholder: 'Minimum is typically ~$50K',
        type: 'text',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_AMOUNT'
      }, {
        name: 'term',
        label: 'Ideal length of term',
        type: 'radio',
        required: true,
        entryId: 'entry.PLACEHOLDER_WORK_TERM',
        options: ['Short Term \u2014 9\u201312 Months', 'Medium Term \u2014 1\u20132 Years', 'Long Term \u2014 2+ Years']
      }]
    }, {
      label: 'A few more details',
      fields: [{
        name: 'accredited',
        label: 'Are you an accredited investor?',
        type: 'radio',
        entryId: 'entry.PLACEHOLDER_WORK_ACCREDITED',
        help: 'An accredited investor either earns >$200K/yr ($300K w/spouse) for the last 2 years, or has net worth >$1M excluding primary residence.',
        options: ['Yes', 'No', 'Not sure']
      }, {
        name: 'notes',
        label: 'Anything else I should know?',
        type: 'textarea',
        entryId: 'entry.PLACEHOLDER_WORK_NOTES'
      }]
    }]
  },
  invest: {
    formId: '1FAIpQLSdbfNjiZegvReucCHrXQLLc21KBEbKYsKHXwjb9WcpSbVq5rQ',
    eyebrow: 'Invest With Me',
    headline: 'Deploy capital.',
    subhead: 'For accredited investors evaluating current opportunities. Share a few details and I\u2019ll follow up with deals fitting your profile.',
    submitText: 'Submit Interest',
    sections: [{
      label: 'Who you are',
      fields: [{
        name: 'fullName',
        label: 'Full Name',
        type: 'text',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_NAME',
        autoComplete: 'name'
      }, {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_EMAIL',
        autoComplete: 'email',
        half: true
      }, {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_PHONE',
        autoComplete: 'tel',
        half: true
      }]
    }, {
      label: 'Your experience',
      fields: [{
        name: 'experience',
        label: 'Real estate investing experience',
        type: 'radio',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_EXPERIENCE',
        options: ['No Experience (No Deals)', 'Beginner (1\u20132 Deals)', 'Intermediate (3\u20139 Deals)', 'Expert (10+ Deals)']
      }]
    }, {
      label: 'What you\u2019re looking for',
      fields: [{
        name: 'option',
        label: 'What investment option interests you?',
        type: 'radio',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_OPTION',
        options: ['Debt Partnership (Fixed return on the money you Borrow)', 'Equity Partnership (Passive project ownership)', 'I am not sure']
      }, {
        name: 'amount',
        label: 'How much do you have available to invest?',
        placeholder: 'Minimum usually $20K',
        type: 'text',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_AMOUNT'
      }, {
        name: 'duration',
        label: 'Expected duration of term',
        type: 'radio',
        required: true,
        entryId: 'entry.PLACEHOLDER_INVEST_DURATION',
        options: ['Short Term (less than 1 year)', 'Medium Term (1\u20133 years)', 'Long Term (more than 3 years)']
      }]
    }, {
      label: 'A few more details',
      fields: [{
        name: 'notes',
        label: 'What else do you want to share?',
        type: 'textarea',
        entryId: 'entry.PLACEHOLDER_INVEST_NOTES'
      }]
    }]
  }
};
function submitToGoogleForm(formId, entries) {
  return new Promise(resolve => {
    const sinkName = 'gform-sink-' + Date.now();
    const iframe = document.createElement('iframe');
    iframe.name = sinkName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const form = document.createElement('form');
    form.action = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
    form.method = 'POST';
    form.target = sinkName;
    form.acceptCharset = 'UTF-8';
    for (const [name, value] of Object.entries(entries)) {
      const values = Array.isArray(value) ? value : [value];
      for (const v of values) {
        if (v === undefined || v === null || v === '') continue;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = String(v);
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve();
    }, 1100);
  });
}
function Field({
  field,
  value,
  onChange,
  error
}) {
  const id = `f-${field.name}`;
  const common = {
    id,
    name: field.name,
    required: field.required,
    autoComplete: field.autoComplete,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': field.help ? `${id}-help` : undefined
  };
  if (field.type === 'textarea') {
    return React.createElement("label", {
      className: `fld ${error ? 'fld--err' : ''}`
    }, React.createElement("span", {
      className: "fld__label"
    }, field.label, field.required && React.createElement("span", {
      className: "fld__req"
    }, "*")), field.help && React.createElement("span", {
      className: "fld__help",
      id: `${id}-help`
    }, field.help), React.createElement("textarea", _extends({}, common, {
      rows: "4",
      placeholder: field.placeholder || '',
      value: value || '',
      onChange: e => onChange(e.target.value)
    })));
  }
  if (field.type === 'radio') {
    return React.createElement("fieldset", {
      className: `fld fld--radio ${error ? 'fld--err' : ''}`
    }, React.createElement("legend", {
      className: "fld__label"
    }, field.label, field.required && React.createElement("span", {
      className: "fld__req"
    }, "*")), field.help && React.createElement("span", {
      className: "fld__help"
    }, field.help), React.createElement("div", {
      className: "opts"
    }, field.options.map(opt => React.createElement("label", {
      key: opt,
      className: `opt ${value === opt ? 'opt--on' : ''}`
    }, React.createElement("input", {
      type: "radio",
      name: field.name,
      value: opt,
      checked: value === opt,
      onChange: () => onChange(opt),
      required: field.required
    }), React.createElement("span", {
      className: "opt__mark",
      "aria-hidden": "true"
    }), React.createElement("span", {
      className: "opt__text"
    }, opt)))));
  }
  if (field.type === 'checkbox') {
    const arr = Array.isArray(value) ? value : [];
    return React.createElement("fieldset", {
      className: `fld fld--radio ${error ? 'fld--err' : ''}`
    }, React.createElement("legend", {
      className: "fld__label"
    }, field.label, field.required && React.createElement("span", {
      className: "fld__req"
    }, "*")), field.help && React.createElement("span", {
      className: "fld__help"
    }, field.help), React.createElement("div", {
      className: "opts"
    }, field.options.map(opt => {
      const on = arr.includes(opt);
      return React.createElement("label", {
        key: opt,
        className: `opt opt--cbx ${on ? 'opt--on' : ''}`
      }, React.createElement("input", {
        type: "checkbox",
        name: field.name,
        value: opt,
        checked: on,
        onChange: e => {
          if (e.target.checked) onChange([...arr, opt]);else onChange(arr.filter(v => v !== opt));
        }
      }), React.createElement("span", {
        className: "opt__mark opt__mark--cbx",
        "aria-hidden": "true"
      }), React.createElement("span", {
        className: "opt__text"
      }, opt));
    })));
  }
  return React.createElement("label", {
    className: `fld ${error ? 'fld--err' : ''} ${field.half ? 'fld--half' : ''}`
  }, React.createElement("span", {
    className: "fld__label"
  }, field.label, field.required && React.createElement("span", {
    className: "fld__req"
  }, "*")), field.help && React.createElement("span", {
    className: "fld__help",
    id: `${id}-help`
  }, field.help), React.createElement("input", _extends({}, common, {
    type: field.type || 'text',
    placeholder: field.placeholder || '',
    value: value || '',
    onChange: e => onChange(e.target.value)
  })));
}
function FormBody({
  kind,
  onClose
}) {
  const cfg = FORM_CONFIG[kind];
  const [values, setValues] = useFormState({});
  const [errors, setErrors] = useFormState({});
  const [phase, setPhase] = useFormState('idle');
  const firstFieldRef = useFormRef(null);
  const handleSubmit = async e => {
    e.preventDefault();
    const errs = {};
    cfg.sections.forEach(s => s.fields.forEach(f => {
      if (!f.required) return;
      const v = values[f.name];
      if (f.type === 'checkbox') {
        if (!Array.isArray(v) || v.length === 0) errs[f.name] = true;
      } else {
        if (!v || typeof v === 'string' && !v.trim()) errs[f.name] = true;
      }
    }));
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstName = Object.keys(errs)[0];
      const el = document.getElementById(`f-${firstName}`);
      if (el && el.focus) el.focus();
      return;
    }
    setPhase('submitting');
    const entries = {};
    cfg.sections.forEach(s => s.fields.forEach(f => {
      const v = values[f.name];
      if (v !== undefined && v !== '' && f.entryId) entries[f.entryId] = v;
    }));
    try {
      await submitToGoogleForm(cfg.formId, entries);
      setPhase('done');
    } catch (err) {
      setPhase('error');
    }
  };
  if (phase === 'done') {
    return React.createElement("div", {
      className: "fmod__done"
    }, React.createElement(Eyebrow, {
      gold: true
    }, "Received"), React.createElement("h2", {
      className: "h-xl",
      style: {
        marginTop: 16
      }
    }, "Inquiry sent."), React.createElement(GoldRule, {
      wide: true,
      style: {
        marginTop: 24,
        marginBottom: 24
      }
    }), React.createElement("p", {
      className: "body-lg",
      style: {
        maxWidth: 480,
        margin: '0 auto'
      }
    }, "I review every inquiry personally and will follow up within 48 hours."), React.createElement("div", {
      style: {
        marginTop: 40
      }
    }, React.createElement(Btn, {
      variant: "ghost",
      onClick: onClose
    }, "Close")));
  }
  return React.createElement("form", {
    className: "fmod__form",
    onSubmit: handleSubmit,
    noValidate: true
  }, React.createElement("header", {
    className: "fmod__head"
  }, React.createElement(Eyebrow, {
    gold: true
  }, cfg.eyebrow), React.createElement("h2", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, cfg.headline), React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 24,
      marginBottom: 24
    }
  }), React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 540
    }
  }, cfg.subhead)), cfg.sections.map((sec, si) => React.createElement("section", {
    key: si,
    className: "fmod__section"
  }, React.createElement("div", {
    className: "fmod__section-label"
  }, sec.label), React.createElement("div", {
    className: "fmod__grid"
  }, sec.fields.map(f => React.createElement(Field, {
    key: f.name,
    field: f,
    value: values[f.name],
    error: errors[f.name],
    onChange: v => setValues({
      ...values,
      [f.name]: v
    })
  }))))), React.createElement("div", {
    className: "fmod__actions"
  }, React.createElement(Btn, {
    variant: "gold",
    onClick: null
  }, phase === 'submitting' ? 'Sending…' : cfg.submitText), React.createElement("a", {
    className: "tlink fmod__alt",
    href: `https://docs.google.com/forms/d/e/${cfg.formId}/viewform`,
    target: "_blank",
    rel: "noopener noreferrer"
  }, React.createElement("span", null, "Open in Google Forms"), React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))), phase === 'error' && React.createElement("p", {
    className: "fmod__error"
  }, "Something went wrong sending your inquiry. Try the link above to submit directly."));
}
function FormModal() {
  const [kind, setKind] = useFormState(null);
  const dialogRef = useFormRef(null);
  const triggerRef = useFormRef(null);
  useFormEffect(() => {
    const onOpen = e => {
      triggerRef.current = document.activeElement;
      setKind(e.detail && e.detail.type ? e.detail.type : null);
    };
    const onKey = e => {
      if (e.key === 'Escape') setKind(null);
    };
    window.addEventListener('open-form-modal', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-form-modal', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);
  useFormEffect(() => {
    document.body.style.overflow = kind ? 'hidden' : '';
  }, [kind]);
  useFormEffect(() => {
    if (!kind || !dialogRef.current) return;
    const root = dialogRef.current;
    const firstFocusable = root.querySelector('input, textarea, button, [href], select, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    const onKey = e => {
      if (e.key !== 'Tab') return;
      const focusables = root.querySelectorAll('input, textarea, button, [href]:not([disabled]), select, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    root.addEventListener('keydown', onKey);
    return () => {
      root.removeEventListener('keydown', onKey);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        triggerRef.current.focus();
      }
    };
  }, [kind]);
  if (!kind) return null;
  return React.createElement("div", {
    className: "fmod",
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "fmod-title",
    ref: dialogRef
  }, React.createElement("button", {
    className: "fmod__close",
    onClick: () => setKind(null),
    "aria-label": "Close form"
  }, React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, React.createElement("line", {
    x1: "4",
    y1: "4",
    x2: "20",
    y2: "20"
  }), React.createElement("line", {
    x1: "20",
    y1: "4",
    x2: "4",
    y2: "20"
  }))), React.createElement("div", {
    className: "fmod__scroll"
  }, React.createElement("div", {
    className: "fmod__inner"
  }, React.createElement(FormBody, {
    kind: kind,
    onClose: () => setKind(null)
  }))));
}
window.FormModal = FormModal;
window.openFormModal = type => window.dispatchEvent(new CustomEvent('open-form-modal', {
  detail: {
    type
  }
}));

/* ===== Polish.jsx ===== */
const {
  useEffect: usePolishEffect,
  useRef: usePolishRef,
  useState: usePolishState
} = React;
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
  return React.createElement("div", {
    ref: ringRef,
    className: "cursor-ring",
    "aria-hidden": "true"
  });
}
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
  return React.createElement("div", {
    className: "scroll-progress",
    "aria-hidden": "true"
  }, React.createElement("span", {
    ref: ref
  }));
}
function FilmGrain() {
  return React.createElement("div", {
    className: "film-grain",
    "aria-hidden": "true"
  }, React.createElement("svg", {
    width: "100%",
    height: "100%"
  }, React.createElement("filter", {
    id: "film-noise"
  }, React.createElement("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.85",
    numOctaves: "2",
    stitchTiles: "stitch"
  }), React.createElement("feColorMatrix", {
    values: "0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"
  })), React.createElement("rect", {
    width: "100%",
    height: "100%",
    filter: "url(#film-noise)"
  })));
}
window.CursorRing = CursorRing;
window.ScrollProgress = ScrollProgress;
window.FilmGrain = FilmGrain;

/* ===== BlueprintHouse.jsx ===== */
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
      p.getBoundingClientRect();
      p.style.transition = `stroke-dashoffset 1500ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 90}ms, opacity 800ms ease ${600 + i * 90}ms`;
      p.style.strokeDashoffset = '0';
      p.style.opacity = '1';
    });
  }, []);
  return React.createElement("div", {
    className: "bp",
    "aria-hidden": "true"
  }, React.createElement("div", {
    className: "bp__glow"
  }), React.createElement("div", {
    className: "bp__stage"
  }, React.createElement("svg", {
    ref: ref,
    className: "bp__svg",
    viewBox: "-200 -200 400 400",
    width: size,
    height: size
  }, React.createElement("defs", null, React.createElement("filter", {
    id: "bpGlow",
    x: "-50%",
    y: "-50%",
    width: "200%",
    height: "200%"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: "1.2",
    result: "b"
  }), React.createElement("feMerge", null, React.createElement("feMergeNode", {
    in: "b"
  }), React.createElement("feMergeNode", {
    in: "SourceGraphic"
  })))), React.createElement("g", {
    stroke: "#FFC000",
    strokeWidth: "1",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    filter: "url(#bpGlow)",
    style: {
      opacity: 0.95
    }
  }, React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.25
    },
    d: "M-180 100 L 180 100"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.25
    },
    d: "M-180 100 L -120 130"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.25
    },
    d: "M 180 100 L 120 130"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M-100 100 L 100 100 L 100 -20 L -100 -20 Z"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 100 100 L 160 60 L 160 -60 L 100 -20"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -100 -20 L -40 -60 L 160 -60"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -100 -20 L 0 -90 L 100 -20"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 0 -90 L 60 -130 L 160 -60"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 0 -90 L 60 -130"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -25 100 L -25 30 L 25 30 L 25 100"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.6
    },
    d: "M 0 30 L 0 100"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M -80 20 L -55 20 L -55 -5 L -80 -5 Z"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.5
    },
    d: "M -67.5 20 L -67.5 -5 M -80 7.5 L -55 7.5"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 55 20 L 80 20 L 80 -5 L 55 -5 Z"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.5
    },
    d: "M 67.5 20 L 67.5 -5 M 55 7.5 L 80 7.5"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 120 0 L 140 -10 L 140 -35 L 120 -25 Z"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0
    },
    d: "M 35 -110 L 35 -135 L 55 -145 L 55 -120 Z"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.5
    },
    d: "M 35 -135 L 55 -145"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.45
    },
    d: "M -100 100 L -100 112 L 100 112 L 100 100"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.45
    },
    d: "M 100 112 L 160 72"
  }), React.createElement("path", {
    className: "bp-line",
    style: {
      opacity: 0,
      strokeOpacity: 0.4
    },
    d: "M -100 -20 L -100 100"
  }), React.createElement("path", {
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
  return React.createElement("section", {
    className: "flag-band",
    "aria-label": "Israeli flag \u2014 IDF service"
  }, React.createElement("div", {
    className: "flag-band__bg",
    "aria-hidden": "true"
  }), React.createElement("div", {
    className: "flag-band__stage"
  }, React.createElement("svg", {
    ref: ref,
    className: "flag-svg",
    viewBox: "0 0 1000 600",
    preserveAspectRatio: "xMidYMid meet",
    "aria-hidden": "true"
  }, React.createElement("defs", null, React.createElement("pattern", {
    id: "flagWave",
    x: "0",
    y: "0",
    width: "1000",
    height: "600",
    patternUnits: "userSpaceOnUse"
  }, React.createElement("rect", {
    width: "1000",
    height: "600",
    fill: "rgba(245,239,225,0.04)"
  })), React.createElement("filter", {
    id: "flagGlow",
    x: "-10%",
    y: "-10%",
    width: "120%",
    height: "120%"
  }, React.createElement("feGaussianBlur", {
    stdDeviation: "1.2"
  }))), React.createElement("g", {
    className: "flag-cloth"
  }, React.createElement("path", {
    className: "flag-draw flag-outline",
    d: "M 60 90 L 940 90 L 940 510 L 60 510 Z",
    fill: "rgba(255,255,255,0.02)",
    stroke: "rgba(245,239,225,0.18)",
    strokeWidth: "1",
    style: {
      opacity: 0
    }
  })), React.createElement("g", {
    className: "flag-stripe flag-stripe--top"
  }, React.createElement("path", {
    className: "flag-draw",
    d: "M 60 150 L 940 150 L 940 210 L 60 210 Z",
    fill: "rgba(43, 78, 148, 0.0)",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "1.5",
    style: {
      opacity: 0
    }
  }), React.createElement("path", {
    className: "flag-fill flag-fill--top",
    d: "M 60 150 L 940 150 L 940 210 L 60 210 Z",
    fill: "rgb(50, 100, 200)",
    opacity: "0"
  })), React.createElement("g", {
    className: "flag-stripe flag-stripe--bot"
  }, React.createElement("path", {
    className: "flag-draw",
    d: "M 60 390 L 940 390 L 940 450 L 60 450 Z",
    fill: "rgba(43, 78, 148, 0.0)",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "1.5",
    style: {
      opacity: 0
    }
  }), React.createElement("path", {
    className: "flag-fill flag-fill--bot",
    d: "M 60 390 L 940 390 L 940 450 L 60 450 Z",
    fill: "rgb(50, 100, 200)",
    opacity: "0"
  })), React.createElement("g", {
    className: "flag-star",
    filter: "url(#flagGlow)"
  }, React.createElement("path", {
    className: "flag-draw flag-star-tri flag-star-tri--up",
    d: "M 500 230 L 580 370 L 420 370 Z",
    fill: "none",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "2.5",
    strokeLinejoin: "round",
    style: {
      opacity: 0
    }
  }), React.createElement("path", {
    className: "flag-draw flag-star-tri flag-star-tri--down",
    d: "M 500 370 L 580 230 L 420 230 Z",
    fill: "none",
    stroke: "rgb(80, 130, 220)",
    strokeWidth: "2.5",
    strokeLinejoin: "round",
    style: {
      opacity: 0
    }
  })))), React.createElement("div", {
    className: "flag-band__caption"
  }, React.createElement("span", {
    className: "eyebrow eyebrow--gold"
  }, "Service \xB7 2009\u20132013"), React.createElement("h3", {
    className: "h-md flag-band__title"
  }, "Israeli Defense Forces"), React.createElement("p", {
    className: "flag-band__sub"
  }, "Discipline. Resilience. Execution.")));
}
window.IsraeliFlagBand = IsraeliFlagBand;

/* ===== BrrrrIcon.jsx ===== */
function BrrrrIcon({
  kind
}) {
  if (kind === 'key') {
    return React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--key",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("g", {
      className: "key-spin"
    }, React.createElement("circle", {
      cx: "14",
      cy: "24",
      r: "7"
    }), React.createElement("circle", {
      cx: "14",
      cy: "24",
      r: "2.5",
      fill: "currentColor",
      stroke: "none"
    })), React.createElement("path", {
      d: "M21 24 L40 24"
    }), React.createElement("path", {
      d: "M34 24 L34 30"
    }), React.createElement("path", {
      d: "M30 24 L30 28"
    })));
  }
  if (kind === 'hammer') {
    return React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--hammer",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("g", {
      className: "hammer-tap"
    }, React.createElement("path", {
      d: "M8 12 L20 12 L24 16 L20 20 L8 20 Z"
    }), React.createElement("path", {
      d: "M20 16 L36 32"
    }), React.createElement("path", {
      d: "M34 30 L40 36",
      strokeWidth: "2.5"
    })), React.createElement("path", {
      d: "M30 40 L42 40",
      className: "hammer-anvil"
    })));
  }
  if (kind === 'door') {
    return React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--door",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: "M10 8 L10 40 L38 40"
    }), React.createElement("g", {
      className: "door-swing"
    }, React.createElement("path", {
      d: "M10 8 L30 8 L30 40 L10 40 Z"
    }), React.createElement("circle", {
      cx: "26",
      cy: "24",
      r: "1",
      fill: "currentColor",
      stroke: "none"
    }))));
  }
  if (kind === 'coins') {
    return React.createElement("svg", {
      className: "brrrr__icon brrrr__icon--coins",
      viewBox: "0 0 48 48",
      "aria-hidden": "true"
    }, React.createElement("g", {
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, React.createElement("ellipse", {
      cx: "24",
      cy: "40",
      rx: "14",
      ry: "3.5",
      className: "coin coin--3"
    }), React.createElement("ellipse", {
      cx: "24",
      cy: "30",
      rx: "14",
      ry: "3.5",
      className: "coin coin--2"
    }), React.createElement("ellipse", {
      cx: "24",
      cy: "20",
      rx: "14",
      ry: "3.5",
      className: "coin coin--1"
    }), React.createElement("path", {
      d: "M10 40 L10 20",
      strokeOpacity: "0.5"
    }), React.createElement("path", {
      d: "M38 40 L38 20",
      strokeOpacity: "0.5"
    })));
  }
  return React.createElement("svg", {
    className: "brrrr__icon brrrr__icon--loop",
    viewBox: "0 0 48 48",
    "aria-hidden": "true"
  }, React.createElement("g", {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("g", {
    className: "loop-spin"
  }, React.createElement("path", {
    d: "M10 24 A 14 14 0 1 1 38 24"
  }), React.createElement("path", {
    d: "M34 18 L38 24 L44 22"
  }), React.createElement("path", {
    d: "M38 24 A 14 14 0 1 1 10 24",
    strokeOpacity: "0.35"
  }))));
}
window.BrrrrIcon = BrrrrIcon;

/* ===== HomesRevitalized.jsx ===== */
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
  return React.createElement("section", {
    ref: sectionRef,
    className: "progvis band band--navy"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "progvis__head"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The 2030 Vision")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['27 done.', '73 to go.'],
    lineDelay: 200
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 680,
      marginTop: 16
    }
  }, "The plan: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, and 30 jobs created locally by 2030. We\u2019re ", pct, "% of the way to the first milestone."))), React.createElement("div", {
    className: "progvis__grid"
  }, React.createElement("div", {
    className: "progvis__left"
  }, React.createElement("div", {
    className: "progvis__counter-wrap"
  }, React.createElement("div", {
    className: "progvis__counter",
    "aria-label": `${HOMES_DONE} homes revitalized so far`
  }, React.createElement(Counter, {
    to: HOMES_DONE,
    duration: 1800,
    delay: 0
  })), React.createElement("div", {
    className: "progvis__counter-suffix"
  }, "/ ", HOMES_GOAL)), React.createElement("div", {
    className: "progvis__label"
  }, "Homes Revitalized to Date"), React.createElement("div", {
    className: "progvis__rule"
  }), React.createElement("div", {
    className: "progvis__taglines",
    "aria-live": "polite"
  }, TAGLINES.map((t, i) => React.createElement("span", {
    key: i,
    className: `progvis__tag ${i === taglineIdx ? 'is-on' : ''}`
  }, t))), React.createElement("div", {
    className: "progvis__tile-grid",
    "aria-hidden": "true"
  }, Array.from({
    length: HOMES_GOAL
  }).map((_, i) => React.createElement("span", {
    key: i,
    className: `progvis__tile ${i < activated ? 'is-on' : ''}`
  }, React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "100%",
    height: "100%"
  }, React.createElement("path", {
    d: "M2 12 L12 3 L22 12 L20 12 L20 21 L14 21 L14 14 L10 14 L10 21 L4 21 L4 12 Z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  })))))), React.createElement("div", {
    className: "progvis__right"
  }, React.createElement("div", {
    className: "progvis__milestones-head"
  }, "By 2030"), MILESTONES.map((m, i) => React.createElement(Reveal, {
    key: i,
    as: "div",
    mode: "rise-sm",
    delay: 200 + i * 200,
    className: "progvis__milestone"
  }, React.createElement("div", {
    className: "progvis__milestone-num"
  }, React.createElement(Counter, {
    to: m.value,
    duration: 1600 + i * 200
  })), React.createElement("div", {
    className: "progvis__milestone-body"
  }, React.createElement("div", {
    className: "progvis__milestone-label"
  }, m.label), React.createElement("div", {
    className: "progvis__milestone-sub"
  }, m.sub)))), React.createElement(Reveal, {
    mode: "fade",
    delay: 1400,
    className: "progvis__signoff"
  }, React.createElement("p", null, "\u201CJust getting started.\u201D"))))));
}
window.ProgressVision = ProgressVision;
window.HomesRevitalized = ProgressVision;

/* ===== AccessibilityPage.jsx ===== */
function AccessibilityPage() {
  return React.createElement("div", {
    className: "page-fade band",
    style: {
      paddingTop: 160
    }
  }, React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 820,
      margin: '0 auto'
    }
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Accessibility"), React.createElement("h1", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, "Our commitment to accessibility."), React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  }), React.createElement("p", {
    className: "body-lg"
  }, "Charger Property Management is committed to ensuring digital accessibility for everyone, including people with disabilities. We work to continually improve the user experience for all visitors and apply the relevant accessibility standards."), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Standard we follow"), React.createElement("p", {
    className: "body-lg"
  }, "This site is designed to conform to the ", React.createElement("strong", null, "Web Content Accessibility Guidelines (WCAG) 2.1, Level AA"), ", published by the W3C. These guidelines explain how to make web content more accessible to people with a wide array of disabilities. visual, auditory, motor, and cognitive."), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "What we\u2019ve built in"), React.createElement("ul", {
    className: "a11y-list"
  }, React.createElement("li", null, "Keyboard navigation throughout, with a visible focus indicator on every interactive element."), React.createElement("li", null, "A \u201CSkip to main content\u201D link as the first focusable element on every page."), React.createElement("li", null, "Semantic HTML landmarks (", React.createElement("code", null, "header"), ", ", React.createElement("code", null, "main"), ", ", React.createElement("code", null, "nav"), ", ", React.createElement("code", null, "footer"), ") for screen-reader navigation."), React.createElement("li", null, "Descriptive alt text on photographs of people, properties, and documents."), React.createElement("li", null, "Form fields labeled with persistent text (not just placeholders) and validated with screen-reader-friendly error messages."), React.createElement("li", null, "Modals and overlays trap focus, announce themselves to screen readers, and close on the Escape key."), React.createElement("li", null, "All hero video is muted and decorative; nothing essential is conveyed by motion alone."), React.createElement("li", null, "Color contrast on body copy meets or exceeds WCAG AA (4.5:1)."), React.createElement("li", null, "Animations respect the operating-system ", React.createElement("code", null, "prefers-reduced-motion"), " setting."), React.createElement("li", null, "Text scales smoothly when the browser font size is increased.")), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Known limitations"), React.createElement("p", {
    className: "body-lg"
  }, "We are still working on the following items, which we plan to remediate:"), React.createElement("ul", {
    className: "a11y-list"
  }, React.createElement("li", null, "Closed captions and a full transcript for the hero background footage are pending."), React.createElement("li", null, "Some third-party embeds (Google Forms, Substack, LinkedIn previews) may have accessibility issues outside our direct control. We provide native alternatives whenever possible.")), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Need assistance? Tell us."), React.createElement("p", {
    className: "body-lg"
  }, "If you encounter an accessibility barrier on this site, or if you need information presented in an alternative format, we want to hear from you. We respond to every request within ", React.createElement("strong", null, "three business days"), "."), React.createElement("div", {
    className: "a11y-contact"
  }, React.createElement("div", null, React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Email"), React.createElement("a", {
    className: "a11y-contact__val",
    href: `mailto:${CONTACT.email}?subject=Accessibility%20Request`
  }, CONTACT.email)), React.createElement("div", null, React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Phone"), React.createElement("a", {
    className: "a11y-contact__val",
    href: CONTACT.phoneHref
  }, CONTACT.phone))), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Formal complaint procedure"), React.createElement("p", {
    className: "body-lg"
  }, "If you believe we have not adequately responded to your accessibility request, you may file a complaint with:"), React.createElement("ul", {
    className: "a11y-list"
  }, React.createElement("li", null, "The ", React.createElement("strong", null, "U.S. Department of Justice, Civil Rights Division"), " \xB7 ", React.createElement("a", {
    href: "https://civilrights.justice.gov",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "civilrights.justice.gov")), React.createElement("li", null, "The ", React.createElement("strong", null, "U.S. Access Board"), " \xB7 ", React.createElement("a", {
    href: "https://www.access-board.gov",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "access-board.gov"))), React.createElement("p", {
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
function LegalPage() {
  return React.createElement("div", {
    className: "page-fade band",
    style: {
      paddingTop: 160
    }
  }, React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 820,
      margin: '0 auto'
    }
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Legal & Privacy"), React.createElement("h1", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, "Important disclosures."), React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  }), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 16,
      marginBottom: 16
    }
  }, "Investment disclaimer"), React.createElement("p", {
    className: "body-lg"
  }, "The information on this website is provided for general informational purposes only. It is ", React.createElement("strong", null, "not an offer to sell, or a solicitation of an offer to buy,"), " any security, investment product, or interest in any fund or entity, and it does not constitute investment, financial, legal, accounting, or tax advice. Nothing here should be relied upon as the basis for any investment decision."), React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 20
    }
  }, "Any offering of a securities or investment opportunity would be made only to eligible investors, in the jurisdictions where lawful, and solely through formal offering documents that contain complete information about the terms, conditions, and risks. In the event of any conflict, those formal documents control over anything stated on this website."), React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 20
    }
  }, "Real estate investing involves substantial risk, including the possible loss of principal. ", React.createElement("strong", null, "Past performance is not indicative of future results."), " Any portfolio figures, door counts, valuations, projections, or goals shown on this site (including statements about future plans such as target door counts or homes revitalized) are forward-looking, reflect current intentions only, and are not guarantees of any outcome. Prospective investors should consult their own legal, tax, and financial advisors before making any decision."), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Privacy policy"), React.createElement("p", {
    className: "body-lg"
  }, "We respect your privacy. This policy explains what we collect when you use this site and contact us, and what we do with it."), React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Information we collect"), React.createElement("ul", {
    className: "a11y-list"
  }, React.createElement("li", null, React.createElement("strong", null, "Information you give us."), " When you submit a form on this site, we collect the details you provide. depending on the form, this may include your name, email address, phone number, real estate experience, investment preferences, and the general amount you are considering. Please do not submit bank account numbers, Social Security numbers, or other sensitive identifiers through this site."), React.createElement("li", null, React.createElement("strong", null, "Information collected automatically."), " Our hosting and form providers may log standard technical data such as IP address, browser type, and pages visited, for security and to keep the site running. We do not use advertising trackers.")), React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "How we use it"), React.createElement("ul", {
    className: "a11y-list"
  }, React.createElement("li", null, "To respond to your inquiry and follow up with you about working or investing with us."), React.createElement("li", null, "To operate, secure, and improve the website."), React.createElement("li", null, "To comply with legal obligations.")), React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 12
    }
  }, "We do ", React.createElement("strong", null, "not"), " sell your personal information."), React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Service providers"), React.createElement("p", {
    className: "body-lg"
  }, "Form submissions are processed through Google Forms, and the site is hosted on a third-party hosting provider. These providers process data on our behalf under their own terms and privacy policies. We may also link out to LinkedIn, Substack, and Instagram, which are governed by their own privacy practices."), React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Your choices & rights"), React.createElement("p", {
    className: "body-lg"
  }, "You may request that we access, correct, or delete the personal information you have submitted, or ask us to stop contacting you, at any time. California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we hold and to request its deletion. To make any request, email us at the address below and we will respond as required by law."), React.createElement("h3", {
    className: "h-sm",
    style: {
      marginTop: 32,
      marginBottom: 12
    }
  }, "Children"), React.createElement("p", {
    className: "body-lg"
  }, "This site is intended for adults and is not directed to children. We do not knowingly collect information from anyone under 18."), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Terms of use"), React.createElement("p", {
    className: "body-lg"
  }, "By using this website you agree to these terms. All content. text, images, video, graphics, and design. is owned by or licensed to us and is protected by copyright and other laws; you may not reproduce or redistribute it without permission. The site is provided \u201Cas is,\u201D without warranties of any kind, and to the fullest extent permitted by law we are not liable for any damages arising from your use of it. Third-party links are provided for convenience and we are not responsible for their content. We may update the site and these terms at any time."), React.createElement("h2", {
    className: "h-md",
    style: {
      marginTop: 56,
      marginBottom: 16
    }
  }, "Contact us"), React.createElement("p", {
    className: "body-lg"
  }, "Questions about these disclosures, or a privacy request? Reach out:"), React.createElement("div", {
    className: "a11y-contact"
  }, React.createElement("div", null, React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Email"), React.createElement("a", {
    className: "a11y-contact__val",
    href: `mailto:${CONTACT.email}?subject=Privacy%20Request`
  }, CONTACT.email)), React.createElement("div", null, React.createElement("div", {
    className: "a11y-contact__lbl"
  }, "Phone"), React.createElement("a", {
    className: "a11y-contact__val",
    href: CONTACT.phoneHref
  }, CONTACT.phone))), React.createElement("p", {
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
  return React.createElement("header", {
    className: `nav ${scrolled ? 'nav--scrolled' : ''}`
  }, React.createElement("div", {
    className: "nav__inner"
  }, React.createElement("div", {
    className: "nav__left"
  }, React.createElement("button", {
    className: `nav__menu-btn ${menuOpen ? 'is-open' : ''}`,
    onClick: openMenu,
    "aria-label": "Open menu",
    "aria-expanded": menuOpen ? 'true' : 'false'
  }, React.createElement("span", {
    className: "nav__burger",
    "aria-hidden": "true"
  }, React.createElement("span", {
    className: "nav__burger-bar nav__burger-bar--top"
  }), React.createElement("span", {
    className: "nav__burger-bar nav__burger-bar--bot"
  })), React.createElement("span", null, menuOpen ? 'Close' : 'Menu'))), React.createElement("a", {
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
  }, "Shavit", React.createElement("span", {
    className: "nav__wordmark-gold"
  }, "Rootman")), React.createElement("div", {
    className: "nav__right"
  }, React.createElement("button", {
    className: "nav__icon-btn",
    "aria-label": "Search"
  }, React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), React.createElement("line", {
    x1: "16.5",
    y1: "16.5",
    x2: "21",
    y2: "21",
    strokeLinecap: "round"
  }))), React.createElement("a", {
    className: "nav__cta",
    href: "#",
    onClick: e => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('open-form-modal', {
        detail: {
          type: 'work'
        }
      }));
    }
  }, "Work With Me"))));
}
function MenuOverlay({
  open,
  onClose,
  page,
  onNav
}) {
  const overlayRef = useNavRef(null);
  const triggerRef = useNavRef(null);
  const items = [['home', 'Home'], ['companies', 'Companies'], ['case-studies', 'Case Studies'], ['meet', 'Meet Shavit'], ['contact', 'Contact']];
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
  return React.createElement("div", {
    ref: overlayRef,
    className: `overlay ${open ? 'overlay--open' : ''}`,
    "aria-hidden": !open,
    role: "dialog",
    "aria-modal": open ? 'true' : undefined,
    "aria-label": "Main menu"
  }, React.createElement("button", {
    className: "overlay__close",
    onClick: onClose,
    "aria-label": "Close menu"
  }, React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, React.createElement("line", {
    x1: "4",
    y1: "4",
    x2: "20",
    y2: "20"
  }), React.createElement("line", {
    x1: "20",
    y1: "4",
    x2: "4",
    y2: "20"
  }))), React.createElement("nav", {
    className: "overlay__nav"
  }, items.map(([key, label]) => React.createElement("a", {
    key: key,
    href: "#",
    className: `overlay__link ${page === key ? 'overlay__link--active' : ''}`,
    onClick: e => {
      e.preventDefault();
      go(key);
    }
  }, label))), React.createElement("div", {
    className: "overlay__contact"
  }, React.createElement("a", {
    href: `mailto:${CONTACT.email}`
  }, CONTACT.email), React.createElement("span", null, "\xB7"), React.createElement("a", {
    href: CONTACT.phoneHref
  }, CONTACT.phone), React.createElement("span", null, "\xB7"), React.createElement("a", {
    href: CONTACT.igHref,
    target: "_blank",
    rel: "noopener noreferrer"
  }, CONTACT.ig)));
}
window.Nav = Nav;
window.MenuOverlay = MenuOverlay;

/* ===== Footer.jsx ===== */
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
  return React.createElement("footer", {
    className: "footer"
  }, React.createElement("div", {
    className: "footer__top"
  }, React.createElement("h2", {
    className: "footer__wordmark"
  }, "Shavit Rootman")), React.createElement("div", {
    className: "footer__grid"
  }, React.createElement("div", {
    className: "footer__col"
  }, React.createElement("h5", null, "Navigate"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'home')
  }, "Home")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Companies")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'case-studies')
  }, "Case Studies")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'meet')
  }, "Meet Shavit")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'contact')
  }, "Contact")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'accessibility')
  }, "Accessibility")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'legal')
  }, "Legal & Privacy")))), React.createElement("div", {
    className: "footer__col"
  }, React.createElement("h5", null, "Portfolio"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Charger Property Management")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Long-Term Residential")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Mid-Term Professional")), React.createElement("li", null, React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'companies')
  }, "Overlooked Assets")))), React.createElement("div", {
    className: "footer__col"
  }, React.createElement("h5", null, "Connect"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: "https://shavitrootman.substack.com",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Substack")), React.createElement("li", null, React.createElement("a", {
    href: CONTACT.igHref,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Instagram")), React.createElement("li", null, React.createElement("a", {
    href: CONTACT.liHref,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "LinkedIn")), React.createElement("li", null, React.createElement("a", {
    href: `mailto:${CONTACT.email}`
  }, "Email")))), React.createElement("div", {
    className: "footer__col"
  }, React.createElement("h5", null, "Contact"), React.createElement("ul", null, React.createElement("li", null, React.createElement("a", {
    href: `mailto:${CONTACT.email}`
  }, CONTACT.email)), React.createElement("li", null, React.createElement("a", {
    href: CONTACT.phoneHref
  }, CONTACT.phone))))), React.createElement("div", {
    className: "footer__bottom"
  }, React.createElement("div", null, "\xA9 2026 Rootman. All Rights Reserved. \xB7 ", React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'legal')
  }, "Legal & Privacy")), React.createElement("div", null, "Charger Property Management \xB7 Building 200 doors across MI \xB7 OH \xB7 IN by 2030")), React.createElement("div", {
    className: "footer__disclaimer"
  }, "Not an offer to sell or a solicitation to buy any security. Informational only; not investment, legal, or tax advice. Real estate investing carries risk, including loss of principal. See ", React.createElement("a", {
    href: "#",
    onClick: e => go(e, 'legal')
  }, "Legal & Privacy"), "."));
}
window.Footer = Footer;

/* ===== HomePage.jsx ===== */
const HOUSING_CLASSES = [{
  tag: 'HILLSDALE, MI · JACKSON CO · INDIANAPOLIS',
  name: 'LONG-TERM RESIDENTIAL',
  desc: 'Single-family and small multi-family homes for working families across our core Midwest markets.',
  photo: 'EXTERIOR. 17 LO PRESTO AVE, HILLSDALE',
  src: SHAVIT_PHOTOS.loPresto,
  filter: 'saturate(1) contrast(1.05)'
}, {
  tag: 'CLEVELAND, OH',
  name: 'MID-TERM PROFESSIONAL',
  desc: 'Furnished 30 to 180 day units for traveling medical and graduate professionals.',
  photo: 'Cleveland Brick',
  src: STOCK.brickFacade,
  filter: 'sepia(0.12) saturate(1.05) contrast(1.05)'
}, {
  tag: 'SOUTH BEND, IN · CLEVELAND, OH',
  name: 'OVERLOOKED ASSETS',
  desc: 'Distressed and overlooked properties acquired, fully renovated, and stabilized as long-term homes.',
  photo: 'EXTERIOR. SECOND CHANCE TURNAROUND',
  src: SHAVIT_PHOTOS.secondChance,
  filter: 'saturate(1) contrast(1.05)'
}];
const HOME_CASES = [{
  pull: 'REDUCED FEES.\nQUICKER SALE.\nHIGHER PROFITS.',
  quote: 'His honest assessment of local market trends and marketing skills ensured a fair outcome. His flexible marketing strategy allowed me to reduce agent and broker fees, resulting in a quicker sale and significantly higher profits than a traditional Real Estate Agency.',
  attr: 'Gary Pauken · Hillsdale Resident',
  avatar: SHAVIT_PHOTOS.gary
}, {
  pull: 'PROFESSIONAL\nACROSS THE BOARD.',
  quote: "Selling my property, transferring the loan, having Shavit and his team assume my loan. Every step was excellent. Professional across the board, and the kind of operator who makes you feel like family.",
  attr: 'Jeffrey S. Riling · US Veteran',
  avatar: SHAVIT_PHOTOS.jef
}, {
  pull: 'RELIABLE PARTNER.\nTRUSTWORTHY FRIEND.',
  quote: "Extensive knowledge, remarkable attention to detail, a man of his word. Shavit is not only a reliable business partner but also a trustworthy friend. I'm confident in reaching out to him in any predicament.",
  attr: 'Nicky · Cleveland Real Estate Investor',
  avatar: SHAVIT_PHOTOS.nicky
}];
function CompaniesPreview({
  onNav
}) {
  return React.createElement("section", {
    className: "band band__inner",
    style: {
      maxWidth: 1440,
      margin: '0 auto'
    }
  }, React.createElement("div", {
    className: "section-head section-head--left",
    style: {
      alignItems: 'flex-start'
    }
  }, React.createElement(Reveal, {
    as: "div",
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Charger Property Management")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['One operator.', 'Three housing classes.'],
    lineDelay: 200
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 800
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 640,
      marginTop: 16
    }
  }, "Charger Property Management is the flagship. The infrastructure that runs every door in the portfolio. Underneath it, a network of 10+ operating entities organized by housing class."))), React.createElement("div", {
    className: "cards cards-3",
    style: {
      borderTop: '1px solid #202020',
      borderBottom: '1px solid #202020'
    }
  }, HOUSING_CLASSES.map((c, i) => React.createElement(Reveal, {
    key: i,
    as: "div",
    mode: "rise",
    delay: i * 200,
    className: "ccard",
    onClick: () => {
      onNav('companies');
      window.scrollTo({
        top: 0
      });
    },
    style: {
      cursor: 'pointer'
    }
  }, React.createElement("div", {
    className: "ccard__media"
  }, React.createElement("div", {
    className: "ccard__photo-zoom"
  }, React.createElement(Placeholder, {
    label: c.photo,
    src: c.src,
    filter: c.filter,
    kind: "photo"
  }))), React.createElement("div", {
    className: "ccard__body"
  }, React.createElement("div", {
    className: "ccard__tag"
  }, c.tag), React.createElement("h3", {
    className: "ccard__name"
  }, c.name), React.createElement("p", {
    className: "ccard__desc"
  }, c.desc), React.createElement("div", {
    className: "ccard__cta"
  }, "Explore ", React.createElement("span", {
    className: "ccard__arrow"
  }, "\u2192"))), React.createElement("span", {
    className: "ccard__rule",
    "aria-hidden": "true"
  })))));
}
function CasesPreview({
  onNav
}) {
  return React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, React.createElement(SurfaceSweep, null), React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Case Studies")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['The work speaks.']
  })), React.createElement("div", {
    className: "qcards"
  }, HOME_CASES.map((c, i) => React.createElement(Reveal, {
    key: i,
    as: "article",
    className: "qcard",
    mode: "rise",
    delay: i * 300
  }, React.createElement(LineReveal, {
    as: "h3",
    className: "qcard__pull",
    lines: c.pull.split('\n'),
    lineDelay: 150
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 500 + i * 300
  }, React.createElement(GoldRule, null)), React.createElement(Reveal, {
    mode: "fade",
    delay: 900 + i * 300
  }, React.createElement("p", {
    className: "qcard__quote"
  }, c.quote)), React.createElement(Reveal, {
    mode: "fade",
    delay: 1200 + i * 300
  }, React.createElement("div", {
    className: "qcard__attr"
  }, c.avatar && React.createElement("img", {
    src: c.avatar,
    alt: "",
    className: "qcard__avatar",
    referrerPolicy: "no-referrer"
  }), React.createElement("span", null, c.attr)))))), React.createElement("div", {
    style: {
      textAlign: 'center',
      marginTop: 48
    }
  }, React.createElement(Reveal, {
    mode: "fade",
    delay: 400
  }, React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      onNav('case-studies');
      window.scrollTo({
        top: 0
      });
    }
  }, "See All Case Studies \u2192")))));
}
function HomePage({
  onNav
}) {
  return React.createElement("div", {
    className: "page-fade"
  }, React.createElement(VideoHero, {
    blueprint: true,
    eyebrow: "Community Impact, Made Profitable",
    h1Lines: ['Overlooked housing,', 'long-term homes.'],
    sub: "I invest in overlooked housing across Midwest communities and transform it into long-term homes for families. 50 doors today. 200 doors and 30 local jobs by 2030.",
    videoSrc: HERO_VIDEO,
    videoLabel: "Aerial \xB7 Hillsdale / Cleveland / South Bend",
    actions: React.createElement(React.Fragment, null, React.createElement(Btn, {
      formType: "work",
      variant: "gold"
    }, "Work With Me \u2192"), React.createElement(Btn, {
      formType: "invest",
      variant: "ghost"
    }, "Invest With Me \u2192"))
  }), React.createElement("section", {
    className: "band band--tight",
    style: {
      paddingBottom: 0
    }
  }, React.createElement("div", {
    className: "band__inner section-head",
    style: {
      marginBottom: 48
    }
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Four Ways In")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Pick your path.']
  }))), React.createElement(TriPaths, {
    onNav: onNav,
    items: [{
      label: 'INVEST',
      headline: 'DEPLOY CAPITAL.',
      body: 'Passive capital into stabilized cash-flowing housing across Michigan and Ohio. Operator-led, transparently reported.',
      cta: 'Explore Investing',
      page: 'companies',
      photo: 'Property · Stabilized Asset · Golden Hour',
      src: STOCK.luxuryDusk,
      filter: 'saturate(1.05) contrast(1.05)'
    }, {
      label: 'WORK WITH ME',
      headline: 'LEARN THE PLAYBOOK.',
      body: 'Guidance for new and experienced investors entering out-of-state markets. The playbook, not the pitch.',
      cta: 'Start The Conversation',
      formType: "work",
      photo: 'Office · Investor Walkthrough',
      src: STOCK.meeting,
      filter: 'brightness(0.85) saturate(0.95) contrast(1.05)'
    }, {
      label: 'SELL',
      headline: 'A BETTER EXIT.',
      body: 'Lower fees, faster sales, and honest assessments. Backed by a track record of higher net to sellers.',
      cta: 'List With Me',
      page: 'contact',
      photo: 'Closing Table · Hillsdale, MI',
      src: STOCK.signingDeal,
      filter: 'sepia(0.12) saturate(1.1) brightness(0.92)'
    }, {
      label: 'BUY',
      headline: 'A DIFFERENT AGENT.',
      body: 'Local market truth, transparent representation, and a buying process built to protect your downside.',
      cta: 'Start Searching',
      page: 'contact',
      photo: 'Streetscape · Hillsdale & Jackson County',
      src: STOCK.suburbStreet,
      filter: 'saturate(0.95) contrast(1.05) brightness(0.95)'
    }]
  }), React.createElement("section", {
    className: "band"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Numbers Today")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['50 doors. Three states.', '$12M and counting.'],
    lineDelay: 180
  })), React.createElement(StatsGrid, {
    rows: [{
      value: React.createElement(Counter, {
        to: 50,
        suffix: "+"
      }),
      label: 'Doors Operated'
    }, {
      value: React.createElement(Counter, {
        to: 10,
        suffix: "+"
      }),
      label: 'Operating Entities'
    }, {
      value: React.createElement(React.Fragment, null, React.createElement("span", {
        className: "currency"
      }, "$"), React.createElement(Counter, {
        to: 12,
        suffix: "M+"
      })),
      label: 'Portfolio Value'
    }, {
      value: React.createElement(Counter, {
        to: 3
      }),
      label: 'States · MI · OH · IN'
    }]
  }))), React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, React.createElement(SurfaceSweep, null), React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Playbook")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['BRRRR.', 'Run it. Repeat it.'],
    lineDelay: 200
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 680,
      marginTop: 16
    }
  }, "Acquire overlooked Midwest housing. Rehab it to a standard families want to live in. Stabilize a long-term tenant. Refinance the equity back out. Repeat across the portfolio. Not flashy. Disciplined."))), React.createElement("div", {
    className: "brrrr"
  }, [{
    k: 'B',
    label: 'Buy',
    icon: 'key',
    desc: 'Acquire distressed and overlooked single-family homes in Hillsdale, Cleveland, and South Bend.'
  }, {
    k: 'R',
    label: 'Rehab',
    icon: 'hammer',
    desc: 'Full top-to-bottom renovation. Kitchens, baths, mechanicals, exterior. To a standard families want.'
  }, {
    k: 'R',
    label: 'Rent',
    icon: 'door',
    desc: 'Stabilize a long-term tenant. Working families, students, medical professionals.'
  }, {
    k: 'R',
    label: 'Refinance',
    icon: 'coins',
    desc: 'Pull our capital back out at the new appraised value. Conservative leverage, never stretched.'
  }, {
    k: 'R',
    label: 'Repeat',
    icon: 'loop',
    desc: 'Redeploy into the next property. Compound across the portfolio.'
  }].map((s, i) => React.createElement(Reveal, {
    key: i,
    as: "div",
    mode: "rise-sm",
    delay: i * 150,
    className: "brrrr__step"
  }, React.createElement("div", {
    className: "brrrr__letter"
  }, s.k), React.createElement("span", {
    className: "brrrr__rule"
  }), React.createElement(BrrrrIcon, {
    kind: s.icon
  }), React.createElement("div", {
    className: "brrrr__label"
  }, s.label), React.createElement("div", {
    className: "brrrr__desc"
  }, s.desc)))))), React.createElement("section", {
    className: "split"
  }, React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "split__media ph-vignette",
    style: {
      position: 'relative'
    }
  }, React.createElement(Placeholder, {
    src: SHAVIT_PHOTOS.portraitLI,
    alt: "Shavit Rootman",
    filter: "contrast(1.06) saturate(0.95) brightness(0.95)",
    portrait: true
  })), React.createElement("div", {
    className: "split__panel"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Meet The Operator")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['The first Israeli', 'at Hillsdale College.'],
    lineDelay: 200,
    style: {
      marginTop: 16
    }
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 800
  }, React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 24,
      marginBottom: 24
    }
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: 1000
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 520,
      marginBottom: 16
    }
  }, "I served in the Israeli Defense Forces in a special operations unit, with two return deployments after October 7. In 2016 I became the first Israeli student at Hillsdale College. By senior year, a conversation in a renovated carriage house turned into a thesis. Creative housing, designed by and for the community, could transform this town.")), React.createElement(Reveal, {
    mode: "fade",
    delay: 1800
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 520
    }
  }, "Today I run 10+ real estate entities across Michigan, Ohio, and Indiana. Tenants I have mentored now provide cleaning, handyman, and property management services back to the portfolio. Improving homes. Building communities. Community impact, made profitable.")), React.createElement(Reveal, {
    mode: "fade",
    delay: 2400
  }, React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      onNav('meet');
      window.scrollTo({
        top: 0
      });
    }
  }, "Read The Full Story \u2192"))))), React.createElement(CompaniesPreview, {
    onNav: onNav
  }), React.createElement(ProgressVision, null), React.createElement(CasesPreview, {
    onNav: onNav
  }), React.createElement(CtaBand, {
    eyebrow: "Get Started",
    hLines: ['Build your', 'portfolio', 'with me.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: React.createElement(React.Fragment, null, React.createElement(Btn, {
      formType: "work",
      variant: "gold"
    }, "Work With Me \u2192"), React.createElement(Btn, {
      formType: "invest",
      variant: "ghost"
    }, "Invest With Me \u2192"))
  }));
}
window.HomePage = HomePage;

/* ===== CompaniesPage.jsx ===== */
const {
  useState: useCompState
} = React;
function ChargerHero() {
  return React.createElement("section", {
    className: "charger-hero"
  }, React.createElement("div", {
    className: "charger-hero__inner"
  }, React.createElement(Reveal, {
    mode: "fade",
    className: "charger-hero__logo"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.chargerLogo,
    alt: "Charger Property Management"
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: 400,
    className: "charger-hero__caption"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Flagship"), React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 520,
      marginTop: 12
    }
  }, "Charger Property Management runs the operating layer beneath every door. The team, the weekly execution sheets, the accountability that holds the portfolio together."))));
}
const PORTFOLIO_STATS = [{
  value: React.createElement(Counter, {
    to: 50,
    suffix: "+"
  }),
  label: 'Doors Operated'
}, {
  value: React.createElement(Counter, {
    to: 10,
    suffix: "+"
  }),
  label: 'Operating Entities'
}, {
  value: React.createElement(React.Fragment, null, React.createElement("span", {
    className: "currency"
  }, "$"), React.createElement(Counter, {
    to: 12,
    suffix: "M+"
  })),
  label: 'Portfolio Value'
}, {
  value: React.createElement(Counter, {
    to: 200
  }),
  label: 'Door Goal · Midwest 2030'
}];
const DEEPDIVES = [{
  name: 'Long-Term Residential',
  market: 'Hillsdale, MI · Jackson Co · Indianapolis, IN',
  photo: 'Long-Term Residential',
  src: SHAVIT_PHOTOS.loPresto,
  filter: 'saturate(0.98) contrast(1.05)',
  body: ["Single-family and small multi-family homes across our core Midwest markets. Hillsdale, Jackson County, and the Indianapolis metro. Acquired through the BRRRR loop, fully renovated, and stabilized for working families.", "Underwriting is conservative. Tenants are screened with judgment, not just credit scores. The thesis is unglamorous and durable. Well-managed housing in undervalued markets compounds across decades."],
  specs: [['Asset Type', 'Single-family & small multi'], ['Target Tenant', 'Long-term working families'], ['Markets', 'Hillsdale, Jackson Co, MI · Indianapolis, IN']]
}, {
  name: 'Hillsdale Community Housing',
  market: 'Hillsdale, MI',
  photo: 'Hillsdale Community Housing',
  src: SHAVIT_PHOTOS.architecture,
  filter: 'sepia(0.1) saturate(1.05) contrast(1.05)',
  body: ["Housing for the broader Hillsdale community. Students, faculty, and locals alike. The town is shaped by the college around it, and we operate for everyone who lives in its orbit, not just one slice of it.", "We understand the local rhythm, the relationships are direct, and we elevate the standard of housing in a market long served by absentee owners who did not understand the people they housed."],
  specs: [['Asset Type', 'Student & community housing'], ['Target Tenant', 'Hillsdale students, faculty, locals'], ['Markets', 'Hillsdale, MI']]
}, {
  name: 'Mid-Term Professional',
  market: 'Cleveland, OH',
  photo: 'Cleveland Brick',
  src: STOCK.brickFacade,
  filter: 'saturate(0.85) brightness(0.92)',
  body: ["Furnished, design-forward units in Cleveland submarkets adjacent to the city's hospital systems and universities. Average stays run 30 to 180 days. Serving the medical corridor, traveling professionals, and graduate students.", "Operations are turnkey for the tenant and high-margin for the owner. The market mispricing sits in the gap between hotel inventory and traditional 12-month leases. We live in that gap."],
  specs: [['Asset Type', 'Furnished short & mid-term'], ['Target Tenant', 'Medical, traveling pros, grad students'], ['Markets', 'Cleveland, OH']]
}, {
  name: 'Overlooked Assets',
  market: 'South Bend, IN · Cleveland, OH',
  photo: 'Before Renovation',
  src: SHAVIT_PHOTOS.secondChance,
  filter: 'saturate(1) contrast(1.05)',
  body: ["Not all real estate is sexy. We acquire distressed and overlooked single-family homes others walk past. Properties with bad histories, evicted tenants, or deferred maintenance that scares off most operators.", "Then we do the work. Clean it down to the studs if it needs it. Rebuild it to a standard a family wants to live in. Re-rent it. Second-chance housing. The numbers work because we show up and do the work."],
  specs: [['Service', 'Distressed acquisition & full rehab'], ['Approach', 'Eviction · Deep clean · Full rebuild · Re-rent'], ['Markets', 'South Bend, IN · Cleveland, OH']]
}];
function DeepDive({
  data,
  flip,
  onNav
}) {
  return React.createElement("article", {
    className: `deep ${flip ? 'deep--flip' : ''}`
  }, React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "deep__media"
  }, React.createElement(Placeholder, {
    label: data.photo,
    src: data.src,
    filter: data.filter,
    kind: "photo"
  })), React.createElement("div", {
    className: "deep__panel"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, data.market)), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: [data.name],
    baseDelay: 300
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 1100
  }, React.createElement(GoldRule, null)), data.body.map((p, i) => React.createElement(Reveal, {
    key: i,
    mode: "rise-sm",
    delay: 1300 + i * 250
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 540,
      marginBottom: 8,
      color: '#fff'
    }
  }, p))), React.createElement("dl", {
    style: {
      marginTop: 16
    }
  }, data.specs.map(([k, v], i) => React.createElement(Reveal, {
    key: i,
    mode: "fade",
    delay: 1800 + i * 150,
    className: "deep__spec"
  }, React.createElement("dt", null, k), React.createElement("dd", null, v)))), React.createElement(Reveal, {
    mode: "fade",
    delay: 2300,
    style: {
      marginTop: 24
    }
  }, React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      onNav('contact');
      window.scrollTo({
        top: 0
      });
    }
  }, "Inquire About This Company \u2192"))));
}
const PROCESS_STEPS = [{
  num: '01',
  title: 'Discovery.',
  desc: 'We meet, we listen, we map your capital posture, risk tolerance, and timeline before any deal moves.',
  photo: 'Discovery Conversation',
  src: STOCK.meeting,
  filter: 'brightness(0.85) saturate(0.95)'
}, {
  num: '02',
  title: 'Underwriting.',
  desc: 'Every opportunity is underwritten against conservative assumptions, local comps, and operator-tested cost models.',
  photo: 'Underwriting',
  src: STOCK.deskDocs,
  filter: 'grayscale(0.5) contrast(1.1) brightness(0.9)'
}, {
  num: '03',
  title: 'Acquisition.',
  desc: 'Capital is deployed into properties that meet our return thresholds. not to hit volume, not to chase markets.',
  photo: 'Acquisition Target · Midwest',
  src: STOCK.luxuryDusk,
  filter: 'saturate(1.05) contrast(1.05)'
}, {
  num: '04',
  title: 'Operation.',
  desc: 'The asset is operated by our team. You receive transparent reporting, distributions on schedule, and direct line to the operator.',
  photo: 'Stabilized Operation',
  src: STOCK.modernWhite,
  filter: 'sepia(0.15) saturate(1.05) brightness(0.95)'
}];
function Process() {
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
  return React.createElement("section", {
    className: "process"
  }, PROCESS_STEPS.map((s, i) => React.createElement("div", {
    key: i,
    ref: el => panelRefs.current[i] = el,
    "data-idx": i,
    className: `process__panel ${i % 2 === 1 ? 'process__panel--flip' : ''}`
  }, React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "process__media"
  }, React.createElement(Placeholder, {
    label: s.photo,
    src: s.src,
    filter: s.filter,
    kind: "photo"
  })), React.createElement("div", {
    className: "process__copy"
  }, React.createElement("div", {
    className: "process__num-stack"
  }, React.createElement("div", {
    key: `num-${i}-${active === i ? 'on' : 'off'}`,
    className: active === i ? 'process__num process__num--enter' : 'process__num',
    style: {
      opacity: active === i ? 1 : 0.25
    }
  }, s.num)), React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(GoldRule, null)), React.createElement(LineReveal, {
    as: "h3",
    className: "process__title",
    lines: [s.title],
    threshold: 0.4
  }), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 400
  }, React.createElement("p", {
    className: "process__desc"
  }, s.desc)), React.createElement("div", {
    className: "process__pips"
  }, [0, 1, 2, 3].map(j => React.createElement("span", {
    key: j,
    className: `pip ${j <= active ? 'pip--on' : ''}`
  })))))));
}
const FAQ = [{
  q: "What's the minimum investment?",
  a: React.createElement(React.Fragment, null, "Minimums vary by opportunity. Most current offerings start at ", React.createElement("strong", {
    style: {
      color: '#FFC000',
      fontWeight: 700
    }
  }, "$50,000"), ", with select acquisitions accepting partners at higher thresholds.")
}, {
  q: 'What hold periods should I expect?',
  a: 'Hold periods run 5 to 10 years depending on the asset class. Short and mid-term operations have shorter cycles. Long-term Michigan holds are built for compounding.'
}, {
  q: 'How are distributions handled?',
  a: 'Quarterly distributions from operating cash flow once the asset is stabilized, with annual true-ups based on full-year performance.'
}, {
  q: 'What about tax treatment?',
  a: 'Investors receive K-1 partnership reporting. Depreciation pass-through and 1031 exchange opportunities are available on qualifying exits. Consult your CPA on individual circumstances.'
}, {
  q: 'How often will I hear from you?',
  a: 'Quarterly written reports, annual investor calls, and direct access to the operator between cycles. No black-box reporting.'
}, {
  q: "What's the exit strategy?",
  a: 'Each opportunity is underwritten to a defined exit. Refinance, sale, or 1031. Disclosed before capital is committed.'
}, {
  q: 'What fees should I expect?',
  a: 'Standard market structure: a one-time acquisition fee at deal close, an annual asset-management fee on equity under management, and a disposition fee at exit. All disclosed in full per opportunity. No hidden layers.'
}, {
  q: 'Do I need to be accredited?',
  a: 'Most current opportunities are limited to accredited investors under Reg D. Confirm your status before deploying capital.'
}];
function FaqList() {
  const [open, setOpen] = useCompState(0);
  return React.createElement("div", {
    className: "faq"
  }, FAQ.map((it, i) => {
    const isOpen = open === i;
    return React.createElement("div", {
      key: i,
      className: `faq__item ${isOpen ? 'faq__item--open' : ''}`
    }, React.createElement("button", {
      className: "faq__q",
      onClick: () => setOpen(isOpen ? -1 : i)
    }, React.createElement("span", null, it.q), React.createElement("span", {
      className: "faq__icon"
    }, React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, isOpen ? React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }) : React.createElement(React.Fragment, null, React.createElement("line", {
      x1: "5",
      y1: "12",
      x2: "19",
      y2: "12"
    }), React.createElement("line", {
      x1: "12",
      y1: "5",
      x2: "12",
      y2: "19"
    }))))), React.createElement("div", {
      className: "faq__a"
    }, React.createElement("div", {
      className: "faq__a-inner"
    }, React.createElement("p", null, it.a))));
  }));
}
function CompaniesPage({
  onNav
}) {
  return React.createElement("div", {
    className: "page-fade"
  }, React.createElement(VideoHero, {
    height: "80vh",
    eyebrow: "Charger Property Management",
    h1Lines: ['One operator.', 'One company.', 'A network underneath.'],
    sub: "Charger Property Management is the flagship. The infrastructure that runs every door. Beneath it, 10+ operating entities organized by housing class across Michigan, Ohio, and Indiana.",
    videoLabel: "AERIAL. SOUTHERN MICHIGAN / CLEVELAND",
    videoSrc: HERO_VIDEO
  }), React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, React.createElement(SurfaceSweep, null), React.createElement("div", {
    className: "band__inner",
    style: {
      maxWidth: 880,
      textAlign: 'center',
      margin: '0 auto'
    }
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Thesis")), React.createElement("h2", {
    className: "h-xl",
    style: {
      marginTop: 16
    }
  }, React.createElement(Reveal, {
    as: "span",
    mode: "rise",
    duration: "1000ms",
    style: {
      display: 'inline-block'
    }
  }, "Improving homes."), React.createElement("br", null), React.createElement(LineReveal, {
    as: "span",
    lines: ['Building communities.'],
    baseDelay: 800,
    className: "",
    style: {
      display: 'inline-block'
    }
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: 1800
  }, React.createElement(GoldRule, {
    wide: true,
    style: {
      margin: '32px auto'
    }
  })), React.createElement("div", {
    style: {
      textAlign: 'left'
    }
  }, React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 2200
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      marginBottom: 16
    }
  }, "Our playbook is straightforward and disciplined. ", React.createElement("strong", {
    style: {
      color: '#FFC000',
      fontWeight: 700
    }
  }, "BRRRR"), ". Buy. Rehab. Rent. Refinance. Repeat. Acquire overlooked Midwest housing. Fully renovate it. Stabilize a long-term tenant. Refinance the equity back out. Compound across the portfolio.")), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 2700
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      marginBottom: 16
    }
  }, "Our markets are deliberately chosen. Hillsdale, Jackson County, Cleveland, South Bend, and Indianapolis. Large enough to scale, small enough to know personally. They reward operators with infrastructure on the ground and punish those underwriting from a distance.")), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 3200
  }, React.createElement("p", {
    className: "body-lg"
  }, "Charger Property Management is the flagship. The team, the systems, the weekly execution sheets that hold every project accountable. Underneath it, a network of 10+ entities organized by housing class."))))), React.createElement(ChargerHero, null), React.createElement("section", {
    className: "band"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Footprint")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['50 doors. $12M.', 'Three states.'],
    lineDelay: 180
  })), React.createElement(StatsGrid, {
    rows: PORTFOLIO_STATS
  }))), React.createElement("section", {
    className: "band",
    style: {
      paddingBottom: 0
    }
  }, React.createElement("div", {
    className: "band__inner section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Housing Classes")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Three asset types.', 'One operating layer.'],
    lineDelay: 180
  }))), DEEPDIVES.map((d, i) => React.createElement(DeepDive, {
    key: i,
    data: d,
    flip: i % 2 === 1,
    onNav: onNav
  })), React.createElement("section", {
    className: "band",
    style: {
      paddingBottom: 0
    }
  }, React.createElement("div", {
    className: "band__inner section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Process")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['How capital moves.']
  }))), React.createElement(Process, null), React.createElement("section", {
    className: "band"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Questions")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Common questions.']
  })), React.createElement(FaqList, null))), React.createElement(CtaBand, {
    eyebrow: "Ready?",
    hLines: ['Deploy', 'capital.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: React.createElement(Btn, {
      formType: "invest",
      variant: "gold"
    }, "Invest With Me \u2192")
  }));
}
window.CompaniesPage = CompaniesPage;

/* ===== CaseStudiesPage.jsx ===== */
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
  flip: false,
  eyebrow: 'Hillsdale, MI · Residential Sale',
  h: 'Reduced fees.\nQuicker sale.\nHigher profits.',
  photo: "EXTERIOR. GARY PAUKEN'S HILLSDALE PROPERTY",
  src: STOCK.craftsmanHome,
  filter: 'saturate(0.95) contrast(1.05)',
  outcomes: [['Outcome', '22% higher profit vs. traditional agency'], ['Timeline', '28 days to close'], ['Partner', 'Gary Pauken, Hillsdale Resident']],
  body: "When I decided to sell my house, I chose to work with Shavit Rootman and his team. His honest assessment of local market trends and marketing skills ensured a fair outcome for both of us. His flexible marketing strategy allowed me to reduce agent and broker fees, resulting in a quicker sale and significantly higher profits compared to using a traditional Real Estate Agency. I appreciate Shavit's professionalism and would recommend him.",
  panelIron: false,
  avatar: SHAVIT_PHOTOS.gary
}, {
  flip: true,
  eyebrow: 'Jackson County, MI · Loan Assumption',
  h: 'Professional\nacross the board.',
  photo: "EXTERIOR. JACKSON COUNTY PROPERTY",
  src: STOCK.modernWhite,
  filter: 'grayscale(0.3) contrast(1.1) brightness(0.94)',
  outcomes: [['Service', 'Loan transfer & assumption'], ['Duration', 'Closed in 60 days'], ['Partner', 'Jeffrey S. Riling, US Veteran']],
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
}, {
  flip: true,
  eyebrow: 'Santa Barbara, CA · Realtor Engagement',
  h: 'Best in the business.',
  photo: "STREETSCAPE. SANTA BARBARA, CA",
  src: STOCK.luxuryDusk,
  filter: 'saturate(1.05) brightness(0.95)',
  outcomes: [['Verified On', 'Experience.com · October 2025'], ['Rating', '5.0 out of 5'], ['Partner', 'Bar S., Santa Barbara Resident']],
  body: "Best in the business! I really enjoyed Shavit's guidance.",
  panelIron: true,
  avatar: null
}];
function CaseStudy({
  data
}) {
  const lines = data.h.split('\n');
  return React.createElement("article", {
    className: `cstudy ${data.flip ? 'cstudy--flip' : ''}`
  }, React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "cstudy__media"
  }, React.createElement(Placeholder, {
    label: data.photo,
    src: data.src,
    filter: data.filter,
    kind: "photo"
  })), React.createElement("div", {
    className: `cstudy__panel ${data.panelIron ? 'cstudy__panel--iron' : ''}`
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, data.eyebrow)), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: lines,
    lineDelay: 200
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: lines.length * 200 + 700
  }, React.createElement(GoldRule, null)), React.createElement("dl", {
    style: {
      marginTop: 8,
      marginBottom: 8
    }
  }, data.outcomes.map(([k, v], i) => {
    const isPartner = k.toLowerCase() === 'partner';
    return React.createElement(Reveal, {
      key: i,
      mode: "fade",
      delay: lines.length * 200 + 1000 + i * 200,
      className: "cstudy__outcome"
    }, React.createElement("dt", null, k), React.createElement("dd", null, isPartner && data.avatar && React.createElement("img", {
      src: data.avatar,
      alt: "",
      className: "cstudy__avatar",
      referrerPolicy: "no-referrer"
    }), React.createElement("span", null, v)));
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: lines.length * 200 + 1800
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 560,
      marginTop: 16
    }
  }, data.body))));
}
function CaseStudiesPage() {
  return React.createElement("div", {
    className: "page-fade"
  }, React.createElement("section", {
    className: "hero hero--80vh hero--enter"
  }, React.createElement("div", {
    className: "hero__media"
  }, React.createElement(Placeholder, {
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05) contrast(1.05)",
    label: "STILL. PORTFOLIO PROPERTIES MONTAGE",
    kind: "video"
  })), React.createElement("div", {
    className: "hero__scrim"
  }), React.createElement("div", {
    className: "hero__inner hero__inner--center",
    style: {
      textAlign: 'center'
    }
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Case Studies"), React.createElement("h1", {
    className: "h-mega",
    style: {
      marginTop: 24
    }
  }, React.createElement(LineReveal, {
    as: "span",
    lines: ['The work.'],
    triggerOnView: false,
    baseDelay: 600
  }), React.createElement(ScrollLinkedColor, {
    as: "span",
    style: {
      display: 'block'
    }
  }, "In partners' words.")), React.createElement("p", {
    className: "body-lg hero__sub",
    style: {
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }, "Every property has a story. Every partnership has a result. Below, what people who've worked with Shavit say about it.")), React.createElement("div", {
    className: "hero__progress"
  })), CASES.map((c, i) => React.createElement(CaseStudy, {
    key: i,
    data: c
  })), React.createElement("section", {
    className: "band"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Track Record")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['Outcomes, not promises.']
  })), React.createElement(StatsGrid, {
    rows: [{
      value: React.createElement(Counter, {
        to: 42,
        suffix: "+",
        duration: 2400
      }),
      label: 'Properties Transacted'
    }, {
      value: React.createElement(Counter, {
        to: 32,
        duration: 2400
      }),
      label: 'Avg. Days To Close'
    }, {
      value: React.createElement(Counter, {
        to: 14,
        suffix: "+",
        duration: 2400
      }),
      label: 'Investor Partnerships'
    }, {
      value: React.createElement(Counter, {
        to: 5.0,
        duration: 2400,
        suffix: " / 5"
      }),
      label: 'Avg. Client Rating'
    }]
  }))), React.createElement(CtaBand, {
    eyebrow: "Get Started",
    hLines: ['Build your', 'portfolio', 'with me.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: React.createElement(React.Fragment, null, React.createElement(Btn, {
      formType: "work",
      variant: "gold"
    }, "Work With Me \u2192"), React.createElement(Btn, {
      formType: "invest",
      variant: "ghost"
    }, "Invest With Me \u2192"))
  }));
}
window.CaseStudiesPage = CaseStudiesPage;

/* ===== MeetPage.jsx ===== */
function HeroSplit() {
  return React.createElement("section", {
    className: "split hero--enter",
    style: {
      minHeight: '80vh'
    }
  }, React.createElement("div", {
    className: "split__panel",
    style: {
      justifyContent: 'center'
    }
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The First Israeli at Hillsdale"), React.createElement(LineReveal, {
    as: "h1",
    className: "h-mega",
    lines: ['Meet Shavit', 'Rootman.'],
    triggerOnView: false,
    baseDelay: 600,
    lineDelay: 200,
    style: {
      marginTop: 24
    }
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 1600
  }, React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: 1800
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 480,
      fontStyle: 'italic'
    }
  }, "\u201CCommunity impact, made profitable.\u201D")), React.createElement(Reveal, {
    mode: "fade",
    delay: 2000
  }, React.createElement("p", {
    className: "body-md",
    style: {
      maxWidth: 480,
      marginTop: 12,
      color: 'rgba(255,255,255,0.65)'
    }
  }, "IDF Special Forces \xB7 First Israeli at Hillsdale College, 2016 \xB7 Santa Barbara \xB7 Hillsdale \xB7 Israel")), React.createElement(Reveal, {
    mode: "fade",
    delay: 2200,
    style: {
      marginTop: 32
    }
  }, React.createElement(Btn, {
    formType: "work",
    variant: "ghost"
  }, "Work With Me \u2192"))), React.createElement(Reveal, {
    mode: "zoom-lg",
    className: "split__media ph-vignette",
    style: {
      minHeight: 640,
      position: 'relative'
    }
  }, React.createElement(Placeholder, {
    src: SHAVIT_PHOTOS.portraitLI,
    alt: "Shavit Rootman",
    filter: "contrast(1.06) saturate(0.95) brightness(0.95)",
    portrait: true
  })));
}
function ThreeWorlds() {
  const cities = [{
    name: 'Israel',
    sub: 'Where it started. Where I return when called.',
    src: SHAVIT_PHOTOS.ssTwoGen,
    filter: 'contrast(1.05) brightness(0.92) saturate(0.95)',
    alt: 'IDF service in Israel'
  }, {
    name: 'Hillsdale, MI',
    sub: 'Where the College is. Where the portfolio lives.',
    src: SHAVIT_PHOTOS.ssHillsdale,
    filter: 'contrast(1.04) brightness(0.96)',
    alt: 'Hillsdale College campus'
  }, {
    name: 'Santa Barbara, CA',
    sub: 'Where the operating layer breathes.',
    src: SHAVIT_PHOTOS.architecture,
    filter: 'contrast(1.05) brightness(0.92) saturate(0.95)',
    alt: 'Coastal California architecture'
  }];
  return React.createElement("section", {
    className: "three-worlds"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement(Reveal, {
    mode: "fade",
    className: "three-worlds__lead"
  }, React.createElement("span", {
    className: "eyebrow eyebrow--gold"
  }, "Three Worlds, One Operator")), React.createElement("div", {
    className: "three-worlds__grid"
  }, cities.map((c, i) => React.createElement(Reveal, {
    as: "div",
    key: i,
    mode: "rise-sm",
    delay: i * 150,
    className: "three-worlds__cell"
  }, React.createElement("div", {
    className: "three-worlds__media"
  }, React.createElement("img", {
    src: c.src,
    alt: c.alt,
    referrerPolicy: "no-referrer",
    loading: "lazy",
    style: {
      filter: c.filter
    }
  })), React.createElement("div", {
    className: "three-worlds__city"
  }, c.name), React.createElement("div", {
    className: "three-worlds__sub"
  }, c.sub))))));
}
function Act({
  chapter,
  h,
  paragraphs,
  photo,
  photoAlt,
  photoCaption
}) {
  const lines = h.split('<br/>');
  return React.createElement("section", {
    className: "band act"
  }, React.createElement("div", {
    className: "band__inner act__inner"
  }, React.createElement("div", {
    className: "act__head"
  }, React.createElement(Reveal, {
    mode: "fade",
    duration: "1400ms"
  }, React.createElement(Eyebrow, {
    gold: true
  }, chapter)), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: lines,
    lineDelay: 200,
    style: {
      marginTop: 16
    }
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: lines.length * 200 + 600
  }, React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 32
    }
  })), photo && React.createElement(Reveal, {
    mode: "zoom-lg",
    delay: lines.length * 200 + 800,
    className: "act__photo"
  }, React.createElement("figure", null, React.createElement("img", {
    src: photo,
    alt: photoAlt || '',
    referrerPolicy: "no-referrer",
    loading: "lazy"
  }), photoCaption && React.createElement("figcaption", null, photoCaption)))), React.createElement("div", {
    className: "act__body"
  }, paragraphs.map((p, i) => React.createElement(Reveal, {
    key: i,
    mode: "rise-sm",
    delay: 400 + i * 700
  }, React.createElement("p", {
    className: "act__p",
    style: {
      marginBottom: i === paragraphs.length - 1 ? 0 : 28
    },
    dangerouslySetInnerHTML: {
      __html: p
    }
  }))))));
}
function PhotoBand({
  label,
  portrait,
  filter,
  src,
  caption,
  sourceLabel,
  fit,
  objectPosition
}) {
  return React.createElement(Reveal, {
    as: "section",
    mode: "zoom-xl",
    className: "photo-band",
    style: {
      position: 'relative',
      width: '100%',
      height: 480,
      overflow: 'hidden'
    }
  }, React.createElement(Placeholder, {
    src: src,
    filter: filter,
    label: label,
    portrait: portrait,
    fit: fit,
    objectPosition: objectPosition
  }), (caption || sourceLabel) && React.createElement("div", {
    className: "photo-band__cap"
  }, caption && React.createElement("div", {
    className: "photo-band__cap-line"
  }, caption), sourceLabel && React.createElement("div", {
    className: "photo-band__cap-src"
  }, sourceLabel)));
}
function PullQuote({
  quote,
  source,
  dateLine,
  bgImage
}) {
  return React.createElement("section", {
    className: "pullq band",
    style: bgImage ? {
      '--pullq-bg': `url(${bgImage})`
    } : undefined
  }, bgImage && React.createElement("div", {
    className: "pullq__bg",
    "aria-hidden": "true"
  }), React.createElement("div", {
    className: "band__inner pullq__inner"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement("svg", {
    className: "pullq__mark",
    viewBox: "0 0 48 48",
    "aria-hidden": "true"
  }, React.createElement("path", {
    d: "M14 28 L14 18 L24 18 L24 28 L18 36 M30 28 L30 18 L40 18 L40 28 L34 36",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), React.createElement(LineReveal, {
    as: "blockquote",
    className: "pullq__quote",
    lines: quote,
    lineDelay: 200
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: quote.length * 200 + 400,
    className: "pullq__attr"
  }, React.createElement("span", {
    className: "pullq__source"
  }, source), dateLine && React.createElement("span", {
    className: "pullq__date"
  }, dateLine))));
}
function TurningPoint() {
  return React.createElement("section", {
    className: "turning"
  }, React.createElement("div", {
    className: "turning__bg",
    "aria-hidden": "true"
  }), React.createElement("div", {
    className: "band__inner turning__inner"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Turning Point")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xxl turning__h",
    lines: ['Senior year, 2020.', 'The carriage house.'],
    lineDelay: 250
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 1400
  }, React.createElement(GoldRule, {
    wide: true,
    style: {
      marginTop: 24,
      marginBottom: 32
    }
  })), React.createElement("div", {
    className: "turning__grid"
  }, React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 1600
  }, React.createElement("p", {
    className: "body-lg"
  }, "I moved out of the dorms and into a newly renovated carriage house. A conversation with my landlord changed the trajectory. Creative housing solutions, designed by and for the community, could transform Hillsdale.")), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 2200
  }, React.createElement("p", {
    className: "body-lg"
  }, "Not just cash flow potential. An opportunity to elevate the standard of housing for students, faculty, and locals alike, in a town long dominated by absentee owners who did not understand the tenants they housed.")), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 2800
  }, React.createElement("p", {
    className: "body-lg"
  }, React.createElement("strong", null, "Robert Norton"), ", a mentor I met that same year, fanned that flame into a mission. The thesis became simple. The same operating discipline that worked in special operations worked in housing. Probably better.")))));
}
function MarketTrends() {
  return React.createElement("section", {
    className: "band band--iron"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "market__grid"
  }, React.createElement("div", {
    className: "market__copy"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Why Hillsdale, by the numbers")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['The market saw it.', 'I got there first.'],
    lineDelay: 180
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 900
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      marginTop: 24
    }
  }, "Hillsdale home values have appreciated meaningfully since 2016. The same year I arrived as the College\u2019s first Israeli student. By the time the trend was obvious from the outside, the operating layer was already in place from the inside.")), React.createElement(Reveal, {
    mode: "fade",
    delay: 1500,
    style: {
      marginTop: 16
    }
  }, React.createElement("p", {
    className: "body-md",
    style: {
      color: 'rgba(255,255,255,0.55)',
      fontSize: 14,
      letterSpacing: 0.5
    }
  }, "Source chart: Hillsdale, MI home value trend, 2016\u20132024."))), React.createElement(Reveal, {
    mode: "zoom",
    className: "market__chart"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.ssMarketTrends,
    alt: "Chart of Hillsdale, MI market trends and home values, 2016 through 2024",
    referrerPolicy: "no-referrer",
    loading: "lazy"
  })))));
}
function WhyHillsdale() {
  return React.createElement("section", {
    className: "band whyh"
  }, React.createElement("div", {
    className: "band__inner whyh__inner"
  }, React.createElement("div", {
    className: "whyh__head"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Why Hillsdale")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Values aligned.', 'On purpose.'],
    lineDelay: 200
  })), React.createElement("div", {
    className: "whyh__grid"
  }, React.createElement("div", {
    className: "whyh__copy"
  }, React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 400
  }, React.createElement("p", {
    className: "body-lg"
  }, "Hillsdale\u2019s core principles echoed the values from my Israeli upbringing and military service. Strength in the face of challenges. The pursuit of the Aristotelian Good. The embodiment of ", React.createElement("em", null, "Arete"), ", virtue. The fit was never accidental.")), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 1100
  }, React.createElement("p", {
    className: "body-lg"
  }, "After October 7, the case for Hillsdale sharpened. While campus protests at Harvard, Columbia, and other Ivy League schools turned hostile, Hillsdale remained a haven where conservative-leaning American Jews could think freely. It is a campus that takes ideas seriously rather than treating them as a problem to be managed.")), React.createElement(Reveal, {
    mode: "rise-sm",
    delay: 1800
  }, React.createElement("p", {
    className: "body-lg"
  }, "I am helping support ", React.createElement("strong", null, "Tikva Hillsdale"), ". The name ", React.createElement("em", null, "Tikva"), " means \u201Chope\u201D in Hebrew. A new academic institution for the Jewish community at Hillsdale, in ongoing conversation with President Dr. Larry Arnn."))), React.createElement("div", {
    className: "whyh__media"
  }, React.createElement(Reveal, {
    mode: "zoom-lg"
  }, React.createElement("figure", {
    className: "whyh__fig"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.ssTwoGen,
    alt: "Shavit standing alongside an older fellow IDF soldier in uniform with the West Bank visible behind them",
    referrerPolicy: "no-referrer",
    loading: "lazy"
  }), React.createElement("figcaption", null, "Two generations apart, standing side-by-side. Behind: the West Bank."))), React.createElement(Reveal, {
    mode: "zoom-lg",
    delay: 300
  }, React.createElement("figure", {
    className: "whyh__fig"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.ssCampusProtest,
    alt: "Anti-Israel protesters on Ivy League campuses, including a burning American flag near Columbia University",
    referrerPolicy: "no-referrer",
    loading: "lazy"
  }), React.createElement("figcaption", null, "The Ivy League, after October 7. The reason Hillsdale matters more.")))))));
}
function SubstackStrip() {
  const POSTS = [{
    date: 'Jan 30, 2024',
    title: 'From Special Forces in Israel to Pursuing Truth in Hillsdale',
    excerpt: "Out of 12 students in my SAT prep class, only my friend and I went on to bachelor's degrees in America. I chose Hillsdale over the Ivy League. And pushed through Organic Chemistry my first year.",
    src: SHAVIT_PHOTOS.ssOrgChem,
    alt: "Shavit in a Hillsdale College classroom during his first year"
  }, {
    date: 'Feb 15, 2024',
    title: 'Pursuing Truth in Hillsdale: the Combat Begins',
    excerpt: "International Club booth at orientation week. The Israeli flag, despite the lack of Israeli students. By senior year, the carriage house conversation turned a thesis into a business.",
    src: SHAVIT_PHOTOS.ssClubBooth,
    alt: "International Club orientation booth at Hillsdale with the Israeli flag among other national flags"
  }, {
    date: 'May 14, 2024',
    title: 'October 7th Revelations: Embracing Israeli Values at Hillsdale College',
    excerpt: "Two return deployments after October 7. A renewed sense of why Hillsdale matters. And why building infrastructure that runs without me is the work.",
    src: SHAVIT_PHOTOS.ssThankful,
    alt: "A note of thanks to Shavit's supporters, hand-written and shared on Substack"
  }];
  return React.createElement("section", {
    className: "band substrip",
    style: {
      position: 'relative'
    }
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Read In His Own Words")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['The Substack.']
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 700
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 640,
      marginTop: 16
    }
  }, "First-person essays from inside the operating layer. the story, the deals, the field reports. The full archive is on Substack."))), React.createElement("div", {
    className: "substrip__grid"
  }, POSTS.map((p, i) => React.createElement(Reveal, {
    as: "a",
    key: i,
    mode: "rise",
    delay: i * 150,
    href: "https://shavitrootman.substack.com",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "substrip__card",
    "aria-label": `${p.title}. open on Substack`
  }, React.createElement("div", {
    className: "substrip__media"
  }, React.createElement("img", {
    src: p.src,
    alt: p.alt,
    referrerPolicy: "no-referrer",
    loading: "lazy"
  })), React.createElement("div", {
    className: "substrip__body"
  }, React.createElement("div", {
    className: "substrip__date"
  }, p.date), React.createElement("h3", {
    className: "substrip__title"
  }, p.title), React.createElement("p", {
    className: "substrip__excerpt"
  }, p.excerpt), React.createElement("span", {
    className: "substrip__cta"
  }, "Read on Substack \u2192"))))), React.createElement(Reveal, {
    mode: "fade",
    delay: 800,
    style: {
      textAlign: 'center',
      marginTop: 48
    }
  }, React.createElement("a", {
    className: "btn-base btn-ghost",
    href: "https://shavitrootman.substack.com",
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Read the full Substack \u2192"))));
}
function MeetPage() {
  return React.createElement("div", {
    className: "page-fade"
  }, React.createElement(HeroSplit, null), React.createElement(ThreeWorlds, null), React.createElement(Act, {
    chapter: "Act I. Israel.",
    h: "Service.<br/>Twice over.",
    photo: SHAVIT_PHOTOS.israelFlag,
    photoAlt: "Israeli flag during IDF service",
    photoCaption: "On post. IDF Special Operations.",
    paragraphs: ["Before the spreadsheets and the closings, there was the desert. I served in Duvdevan, an Israeli Defense Forces special operations unit, running counter-terrorism in Judea and Samaria. Service was not abstract in my family. My mother lost her only brother in the IDF. He was a tank commander.", "Three years in Duvdevan taught me three things real estate would later require. How to read a situation under pressure. How to trust the people next to you. How to execute when execution is the only option left. Discipline, resilience, the ability to run a long mission under uncertainty.", "After October 7, I returned for two more deployments. One immediately after the attack, and another the following April. In Hebrew we call it <em>miluim</em>: when there is a calling, you show up. The portfolio runs without me when I have to go. <strong>That is the point of building infrastructure.</strong>"]
  }), React.createElement(PullQuote, {
    quote: ['The portfolio runs', 'without me when', 'I have to go.'],
    source: "Shavit Rootman",
    dateLine: "On returning to the IDF after October 7 \xB7 shavitrootman.substack.com",
    bgImage: SHAVIT_PHOTOS.ssTwoGen
  }), React.createElement(Act, {
    chapter: "Act II. Hillsdale.",
    h: "The first Israeli<br/>at Hillsdale College.",
    paragraphs: ["In 2016 I became the first Israeli student to attend Hillsdale College. A small classical college in southern Michigan, known for taking ideas seriously. I chose it over the Ivy League. Out of 12 students in my SAT prep class back in Israel, only one friend and I went on to bachelor's degrees in America.", "I lived in the dorms at 26, my junior year. I financed every semester through grants, scholarships, and merit-based aid, with no burden on my family back home. I studied a major, two minors, and the College's classical core curriculum.", "I pushed through Organic Chemistry my first year. I tried to honor the principles the College stood for. Strength in the face of challenges. The pursuit of the Aristotelian Good. The embodiment of <em>Arete</em>. They echoed the values from my Israeli upbringing and military service."]
  }), React.createElement(PhotoBand, {
    src: SHAVIT_PHOTOS.ssHillsdale,
    label: "HILLSDALE COLLEGE. FIRST TOUCHPOINT IN THE USA",
    filter: "contrast(1.04) brightness(0.95)",
    caption: "Hillsdale College: my first touchpoint in the USA.",
    sourceLabel: "From the Substack \xB7 Jan 30, 2024"
  }), React.createElement(MarketTrends, null), React.createElement(TurningPoint, null), React.createElement(WhyHillsdale, null), React.createElement(PullQuote, {
    quote: ['Strength embracing', 'challenges.', 'The pursuit of Arete.'],
    source: "On the Hillsdale principles he was drawn to",
    dateLine: "shavitrootman.substack.com \xB7 May 14, 2024",
    bgImage: SHAVIT_PHOTOS.ssHillsdale
  }), React.createElement(Act, {
    chapter: "Act III. Community.",
    h: "Community impact,<br/>made profitable.",
    paragraphs: ["The first property was a proof of concept. The second was a system. By the fifth, it was infrastructure. And the infrastructure was the real asset. Today I operate 10+ real estate entities across Michigan, Ohio, and Indiana, running the BRRRR playbook through Charger Property Management.", "But the portfolio is only half of it. Families I have mentored are now tenants who provide cleaning, handyman, lawn-mowing, and property management services across the portfolio. I attend city council meetings. I meet with the mayor. I mentor tenants and locals on launching their own businesses.", "There is a stark gap in Hillsdale between the academic community and locals struggling beneath the poverty line, with substance abuse alongside it. My mission is to unite those layers under a common sense of pride and purpose. The goal by 2030: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, 30 jobs created locally. <strong>Just getting started.</strong>"]
  }), React.createElement(PhotoBand, {
    src: SHAVIT_PHOTOS.loPresto,
    label: "17 LO PRESTO AVE. HILLSDALE, MI",
    filter: "contrast(1.05) brightness(0.96)",
    caption: "17 Lo Presto Avenue, Hillsdale. fully renovated, stabilized, holding."
  }), React.createElement("section", {
    className: "band"
  }, React.createElement("div", {
    className: "band__inner",
    style: {
      textAlign: 'center',
      maxWidth: 1100,
      margin: '0 auto'
    }
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "The Philosophy")), React.createElement("h2", {
    className: "h-mega",
    style: {
      marginTop: 32,
      marginBottom: 32
    }
  }, React.createElement(LineReveal, {
    as: "span",
    lines: ['Community impact,'],
    baseDelay: 300,
    style: {
      display: 'block'
    }
  }), React.createElement(LineReveal, {
    as: "span",
    lines: ['made profitable.'],
    baseDelay: 1600,
    style: {
      display: 'block'
    }
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: 3100
  }, React.createElement(GoldRule, {
    wide: true,
    style: {
      margin: '0 auto 32px'
    }
  })), React.createElement(Reveal, {
    mode: "fade",
    delay: 3400
  }, React.createElement("p", {
    className: "body-lg",
    style: {
      maxWidth: 620,
      margin: '0 auto',
      color: 'rgba(255,255,255,0.72)'
    }
  }, "Hillsdale has a stark gap between the academic community and the locals struggling underneath. Real estate is the bridge. Tenants become operators. Operators become owners. Pride and purpose, compounding on top of cash flow.")))), React.createElement(SubstackStrip, null), React.createElement("section", {
    className: "band band--iron",
    style: {
      position: 'relative'
    }
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head section-head--left"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Endorsements & Community")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['On the record.']
  })), React.createElement("div", {
    className: "endorse-grid"
  }, React.createElement(Reveal, {
    as: "a",
    mode: "rise-sm",
    className: "endorse endorse--with-photo",
    href: "https://www.linkedin.com/in/shavitrootman/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Letter of Endorsement from Senator Dan Roberts. open Shavit's LinkedIn"
  }, React.createElement("div", {
    className: "endorse__photo"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.senatorLetter,
    alt: "Letter from Senator Dan Roberts on Alabama State Senate letterhead"
  })), React.createElement("div", {
    className: "endorse__body-wrap"
  }, React.createElement("div", {
    className: "endorse__lbl"
  }, "Letter of Endorsement"), React.createElement("h3", {
    className: "endorse__name"
  }, "Senator Dan Roberts"), React.createElement("div", {
    className: "endorse__role"
  }, "Alabama State Senate \xB7 Hillsdale College alumnus"), React.createElement("p", {
    className: "endorse__body"
  }, "A personal letter on State Senate letterhead, following our meeting at Hillsdale. The kind of relationship the operating discipline earns over time."), React.createElement("span", {
    className: "endorse__cta endorse__cta--arrow",
    "aria-hidden": "true"
  }, "Read on LinkedIn \u2192"))), React.createElement(Reveal, {
    as: "a",
    mode: "rise-sm",
    delay: 150,
    className: "endorse endorse--with-photo",
    href: "https://www.linkedin.com/in/shavitrootman/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Birthright Israel. Speaking and Philanthropy. open Shavit's LinkedIn"
  }, React.createElement("div", {
    className: "endorse__photo"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.birthrightLA,
    alt: "Shavit speaking at the Birthright Israel LA Gala"
  })), React.createElement("div", {
    className: "endorse__body-wrap"
  }, React.createElement("div", {
    className: "endorse__lbl"
  }, "Speaking & Philanthropy"), React.createElement("h3", {
    className: "endorse__name"
  }, "Birthright Israel Foundation"), React.createElement("div", {
    className: "endorse__role"
  }, "LA Gala \xB7 $34M raised \xB7 Palm Springs community event"), React.createElement("p", {
    className: "endorse__body"
  }, "2013, Mount Herzl. I shared the story of my uncle \u2014 my mother\u2019s only brother, a tank commander killed in service. An American on the trip, Antonio, knelt and buried three name tags of brothers-in-arms he lost in the Middle East. He is still a friend. That is what Birthright is: a calling. ", React.createElement("em", null, "Miluim"), ". When there is a calling, you show up."), React.createElement("span", {
    className: "endorse__cta endorse__cta--arrow",
    "aria-hidden": "true"
  }, "Read on LinkedIn \u2192"))), React.createElement(Reveal, {
    as: "a",
    mode: "rise-sm",
    delay: 300,
    className: "endorse endorse--with-photo",
    href: "https://www.linkedin.com/in/shavitrootman/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Tikva Hillsdale. community impact. open Shavit's LinkedIn"
  }, React.createElement("div", {
    className: "endorse__photo"
  }, React.createElement("img", {
    src: SHAVIT_PHOTOS.architecture,
    alt: "Hillsdale College campus architecture"
  })), React.createElement("div", {
    className: "endorse__body-wrap"
  }, React.createElement("div", {
    className: "endorse__lbl"
  }, "Community Impact"), React.createElement("h3", {
    className: "endorse__name"
  }, "Tikva Hillsdale"), React.createElement("div", {
    className: "endorse__role"
  }, "In conversation with President Dr. Larry Arnn"), React.createElement("p", {
    className: "endorse__body"
  }, "A new academic institution for the Jewish community at Hillsdale. ", React.createElement("em", null, "Tikva"), " means \u201Chope\u201D in Hebrew."), React.createElement("span", {
    className: "endorse__cta endorse__cta--arrow",
    "aria-hidden": "true"
  }, "Read on LinkedIn \u2192"))), React.createElement(Reveal, {
    as: "a",
    mode: "rise-sm",
    delay: 450,
    className: "endorse",
    href: "https://www.linkedin.com/in/shavitrootman/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Robert Norton. mentor. open Shavit's LinkedIn"
  }, React.createElement("div", {
    className: "endorse__lbl"
  }, "Mentor"), React.createElement("h3", {
    className: "endorse__name"
  }, "Robert Norton"), React.createElement("div", {
    className: "endorse__role"
  }, "Hillsdale, MI"), React.createElement("p", {
    className: "endorse__body"
  }, "A deep connection formed senior year. Mr. Norton\u2019s wisdom and vision ignited the flame for the real estate mission."), React.createElement("span", {
    className: "endorse__cta endorse__cta--arrow",
    "aria-hidden": "true"
  }, "Read on LinkedIn \u2192")), React.createElement(Reveal, {
    as: "a",
    mode: "rise-sm",
    delay: 600,
    className: "endorse",
    href: "https://www.linkedin.com/in/shavitrootman/",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "Hillsdale College education. open Shavit's LinkedIn"
  }, React.createElement("div", {
    className: "endorse__lbl"
  }, "Education"), React.createElement("h3", {
    className: "endorse__name"
  }, "Hillsdale College"), React.createElement("div", {
    className: "endorse__role"
  }, "First Israeli student, 2016 \xB7 Classical liberal arts"), React.createElement("p", {
    className: "endorse__body"
  }, "Strength in the face of challenges. The pursuit of the Aristotelian Good. ", React.createElement("em", null, "Arete"), ". The principles that ground the operating layer."), React.createElement("span", {
    className: "endorse__cta endorse__cta--arrow",
    "aria-hidden": "true"
  }, "Read on LinkedIn \u2192")), React.createElement(Reveal, {
    as: "a",
    mode: "rise-sm",
    delay: 750,
    className: "endorse",
    href: "https://shavitrootman.substack.com",
    target: "_blank",
    rel: "noopener noreferrer",
    "aria-label": "shavitrootman.substack.com. open Shavit's Substack"
  }, React.createElement("div", {
    className: "endorse__lbl"
  }, "Writing"), React.createElement("h3", {
    className: "endorse__name"
  }, "shavitrootman.substack.com"), React.createElement("div", {
    className: "endorse__role"
  }, "Operator notes \xB7 deals \xB7 the field"), React.createElement("p", {
    className: "endorse__body"
  }, "First-person writing from inside the operating layer. Deal mechanics, what worked, what didn\u2019t, and what the next move is."), React.createElement("span", {
    className: "endorse__cta",
    "aria-hidden": "true"
  }, "Read the Substack \u2192"))))), React.createElement(CtaBand, {
    eyebrow: "Get Started",
    hLines: ['Build your', 'portfolio', 'with me.'],
    src: STOCK.aerialHouse,
    filter: "brightness(0.55) saturate(1.05)",
    actions: React.createElement(React.Fragment, null, React.createElement(Btn, {
      formType: "work",
      variant: "gold"
    }, "Work With Me \u2192"), React.createElement(Btn, {
      formType: "invest",
      variant: "ghost"
    }, "Invest With Me \u2192"))
  }));
}
window.MeetPage = MeetPage;

/* ===== ContactPage.jsx ===== */
const {
  useState: useContactState
} = React;
function ContactPage() {
  return React.createElement("div", {
    className: "page-fade"
  }, React.createElement(VideoHero, {
    height: "80vh",
    align: "center",
    eyebrow: "Get In Touch",
    h1Lines: ['Contact.'],
    sub: "Three ways in.",
    videoLabel: "STILL. STUDY / DESK INTERIOR AT DUSK",
    videoSrc: HERO_VIDEO
  }), React.createElement("section", {
    className: "band band--tight",
    style: {
      paddingBottom: 0
    }
  }, React.createElement("div", {
    className: "band__inner section-head",
    style: {
      marginBottom: 48
    }
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "How To Begin")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-xl",
    lines: ['Pick a door.']
  }))), React.createElement(TriPaths, {
    items: [{
      label: 'WORK WITH ME',
      headline: 'START THE CONVERSATION.',
      body: 'For aspiring investors, buyers, and sellers ready to talk specifics.',
      cta: 'Open Form',
      formType: "work",
      goldCta: true,
      photo: 'OFFICE. INVESTOR CONVERSATION',
      src: STOCK.meeting,
      filter: 'brightness(0.85) saturate(0.95) contrast(1.05)'
    }, {
      label: 'INVEST WITH ME',
      headline: 'DEPLOY CAPITAL.',
      body: 'For accredited investors evaluating current opportunities.',
      cta: 'Open Form',
      formType: "invest",
      goldCta: true,
      photo: 'PROPERTY. STABILIZED INVESTOR ASSET',
      src: STOCK.luxuryDusk,
      filter: 'sepia(0.15) saturate(1.1) brightness(0.9)'
    }, {
      label: 'DIRECT',
      headline: 'EMAIL OR CALL.',
      body: "When you'd rather skip the form.",
      cta: 'Reveal Contact',
      href: '#direct',
      photo: 'DESK. DIRECT LINE',
      src: STOCK.studyDesk,
      filter: 'brightness(0.8) saturate(0.9) contrast(1.05)'
    }, {
      label: 'FOLLOW',
      headline: 'STAY IN THE LOOP.',
      body: 'Property tours, market notes, and operator commentary on Instagram and LinkedIn.',
      cta: '@SHAVITNESS',
      href: CONTACT.igHref,
      photo: 'STREETSCAPE. ON LOCATION',
      src: STOCK.brickFacade || STOCK.cityDusk,
      filter: 'grayscale(0.3) contrast(1.1) brightness(0.85)'
    }]
  }), React.createElement("section", {
    className: "band band--iron",
    id: "direct"
  }, React.createElement("div", {
    className: "band__inner"
  }, React.createElement("div", {
    className: "section-head"
  }, React.createElement(Reveal, {
    mode: "fade"
  }, React.createElement(Eyebrow, {
    gold: true
  }, "Direct")), React.createElement(LineReveal, {
    as: "h2",
    className: "h-lg",
    lines: ['Skip the form.']
  }), React.createElement(Reveal, {
    mode: "fade",
    delay: 1000
  }, React.createElement(GoldRule, {
    wide: true
  }))), React.createElement("div", {
    className: "contact-rows"
  }, [['Email', CONTACT.email, `mailto:${CONTACT.email}`, false], ['Phone', CONTACT.phone, CONTACT.phoneHref, false], ['Instagram', CONTACT.ig.toUpperCase(), CONTACT.igHref, true], ['LinkedIn', '/IN/SHAVITROOTMAN', CONTACT.liHref, true]].map(([lbl, val, href, external], i) => React.createElement(Reveal, {
    key: lbl,
    mode: "fade",
    delay: i * 200,
    className: "contact-row"
  }, React.createElement("div", {
    className: "lbl"
  }, lbl), React.createElement("a", {
    className: "val",
    href: href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined
  }, val)))), React.createElement("p", {
    className: "body-md",
    style: {
      textAlign: 'center',
      marginTop: 48,
      color: 'var(--color-mute-warm)',
      fontSize: 13,
      letterSpacing: 1,
      textTransform: 'uppercase'
    }
  }, "No native contact form. Google Forms are the only intake."))));
}
window.ContactPage = ContactPage;

/* ===== App.jsx ===== */
const {
  useState: useAppState,
  useEffect: useAppEffect
} = React;
const PAGES = ['home', 'companies', 'case-studies', 'meet', 'contact', 'accessibility', 'legal'];
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
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);
  let PageComp = HomePage;
  if (page === 'companies') PageComp = CompaniesPage;else if (page === 'case-studies') PageComp = CaseStudiesPage;else if (page === 'meet') PageComp = MeetPage;else if (page === 'contact') PageComp = ContactPage;else if (page === 'accessibility') PageComp = AccessibilityPage;else if (page === 'legal') PageComp = LegalPage;
  const labels = {
    home: '01 Home',
    companies: '02 Companies',
    'case-studies': '03 Case Studies',
    meet: '04 Meet Shavit',
    contact: '05 Contact',
    accessibility: '06 Accessibility',
    legal: '07 Legal & Privacy'
  };
  return React.createElement("div", {
    className: "app-shell",
    "data-screen-label": labels[page]
  }, React.createElement("a", {
    href: "#main-content",
    className: "skip-link"
  }, "Skip to main content"), React.createElement(FilmGrain, null), React.createElement(ScrollProgress, null), React.createElement(LogoIntro, null), React.createElement(Nav, {
    page: page,
    onNav: setPage,
    openMenu: () => setMenuOpen(true),
    menuOpen: menuOpen
  }), React.createElement("main", {
    id: "main-content",
    key: page,
    tabIndex: "-1"
  }, React.createElement(PageComp, {
    onNav: setPage
  })), React.createElement(Footer, {
    onNav: setPage
  }), React.createElement(MenuOverlay, {
    open: menuOpen,
    onClose: () => setMenuOpen(false),
    page: page,
    onNav: setPage
  }), React.createElement(FormModal, null), React.createElement(CursorRing, null));
}
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
