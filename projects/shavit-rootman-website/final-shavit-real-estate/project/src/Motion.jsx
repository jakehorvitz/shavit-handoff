/* global React */
// Motion primitives — IntersectionObserver-driven reveals + line reveals.
// Mounted before page components in load order so they can use these.

const { useState: useMotionState, useEffect: useMotionEffect, useRef: useMotionRef } = React;

/* useInView — fires once when element passes threshold */
function useInView({ threshold = 0.3, rootMargin = '0px 0px -10% 0px' } = {}) {
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
    }, { threshold, rootMargin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold, rootMargin, inView]);
  return [ref, inView];
}

/* Reveal — generic wrapper that applies data-reveal once in view */
function Reveal({ as = 'div', mode = 'rise', delay = 0, duration, threshold = 0.3, className = '', style = {}, children, ...rest }) {
  const [ref, inView] = useInView({ threshold });
  const Tag = as;
  const finalStyle = { transitionDelay: delay ? `${delay}ms` : undefined, ...style };
  if (duration) finalStyle.transitionDuration = duration;
  return (
    <Tag
      ref={ref}
      data-reveal={mode}
      className={`${inView ? 'is-in' : ''} ${className}`}
      style={finalStyle}
      {...rest}
    >
      {children}
    </Tag>
  );
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
  settleAfter = 1400,        // ms — when to fade out the gold rule
  style = {},
}) {
  const [ref, inViewIO] = useInView({ threshold });
  const [tick, setTick] = useMotionState(0);  // re-render to add settled class
  const inView = triggerOnView ? inViewIO : true;

  useMotionEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setTick(1), settleAfter + lineDelay * (lines.length - 1) + baseDelay);
    return () => clearTimeout(t);
  }, [inView, settleAfter, lineDelay, lines.length, baseDelay]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className} style={style}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`lr-line ${inView ? 'is-in' : ''} ${tick ? 'is-settled' : ''}`}
          style={{
            '--lr-delay': `${baseDelay + i * lineDelay}ms`,
            transitionDelay: `${baseDelay + i * lineDelay}ms`,
          }}
        >
          <span
            className="lr-line__text"
            style={{ transitionDelay: `${baseDelay + i * lineDelay + 100}ms` }}
          >
            {line}
          </span>
          <span
            className="lr-line__rule"
            style={{ transitionDelay: `${baseDelay + i * lineDelay}ms` }}
          />
        </span>
      ))}
    </Tag>
  );
}

/* SurfaceSweep — a 1px gold hairline that draws left→right when the parent
   section enters view, then fades. Place at top of any section that lifts
   from #000 to #181818. */
function SurfaceSweep() {
  const [ref, inView] = useInView({ threshold: 0.15 });
  return <span ref={ref} className={`surface-sweep ${inView ? 'is-in' : ''}`} aria-hidden="true" />;
}

/* ScrollLinkedColor — wraps a string; --reveal-progress goes 0→1 as the
   element scrolls from below the fold to fully in view. Pairs with the
   .h-reveal CSS class for color-mix gray→white. */
function ScrollLinkedColor({ as = 'span', className = '', children, ...rest }) {
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
        const start = vh;            // bottom edge of viewport
        const end   = vh * 0.25;     // top quarter
        const t = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
        ref.current.style.setProperty('--reveal-progress', t.toFixed(3));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const Tag = as;
  return <Tag ref={ref} className={`h-reveal ${className}`} {...rest}>{children}</Tag>;
}

Object.assign(window, { useInView, Reveal, LineReveal, SurfaceSweep, ScrollLinkedColor });
