/* global React */
// Global polish components: custom cursor (lag-tracking) + top scroll-progress bar.
// Both mount once at app root.

const { useEffect: usePolishEffect, useRef: usePolishRef, useState: usePolishState } = React;

/* ---------------------------------------------------------------
   CursorRing — small gold ring that follows the mouse with lag.
   Hidden on touch devices and when reduced-motion is set.
--------------------------------------------------------------- */
function CursorRing() {
  const ringRef = usePolishRef(null);
  const stateRef = usePolishRef({ tx: 0, ty: 0, x: 0, y: 0, hov: false });

  usePolishEffect(() => {
    const isTouch = matchMedia('(hover: none)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || reduce) return;
    document.body.classList.add('has-cursor-ring');

    const s = stateRef.current;
    const onMove = (e) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
    };
    const onOver = (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const hov = !!t.closest('a, button, [role="button"], .tri__col, .ccard, .qcard, .opt, .cstudy__media, .deep__media, .endorse');
      if (hov !== s.hov) {
        s.hov = hov;
        ringRef.current && ringRef.current.classList.toggle('cursor-ring--hover', hov);
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });

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

  return <div ref={ringRef} className="cursor-ring" aria-hidden="true" />;
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
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return <div className="scroll-progress" aria-hidden="true"><span ref={ref} /></div>;
}

/* ---------------------------------------------------------------
   FilmGrain — fullscreen SVG noise at ~3% opacity.
--------------------------------------------------------------- */
function FilmGrain() {
  return (
    <div className="film-grain" aria-hidden="true">
      <svg width="100%" height="100%">
        <filter id="film-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-noise)" />
      </svg>
    </div>
  );
}

window.CursorRing = CursorRing;
window.ScrollProgress = ScrollProgress;
window.FilmGrain = FilmGrain;
