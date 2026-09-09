/* global React, Counter, Eyebrow, GoldRule, Reveal, LineReveal */
// Unified Progress + 2030 Vision section.
// Replaces the two weak standalone bands with one cinematic moment:
// - Massive "27" counter with a 10×10 house-tile grid that lights up
// - To the right: the 2030 milestones (100 / 200 / 30) as a vertical ladder
// - A single rotating "MICHIGAN · OHIO · INDIANA" tagline
// - Italic sign-off line at the bottom

const { useEffect: useProgEffect, useState: useProgState, useRef: useProgRef } = React;

const HOMES_DONE = 27;
const HOMES_GOAL = 100;
const TAGLINES = ['Michigan', 'Ohio', 'Indiana'];

const MILESTONES = [
  { value: 100, label: 'Homes Revitalized',  sub: 'Hillsdale, MI' },
  { value: 200, label: 'Doors Operated',     sub: 'Across Midwest Markets' },
  { value: 25,  label: 'Jobs Created',       sub: 'Locally, on the ground' },
];

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
      if (reduce) { setActivated(HOMES_DONE); return; }
      const duration = 1800;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setActivated(Math.round(HOMES_DONE * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  useProgEffect(() => {
    const id = setInterval(() => setTaglineIdx(i => (i + 1) % TAGLINES.length), 3000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round((HOMES_DONE / HOMES_GOAL) * 100);

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
  );
}

window.ProgressVision = ProgressVision;
// Legacy export kept as no-op to avoid breaking older references.
window.HomesRevitalized = ProgressVision;
