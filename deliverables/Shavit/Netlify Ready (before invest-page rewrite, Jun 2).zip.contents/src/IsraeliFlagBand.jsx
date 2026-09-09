/* global React */
// Animated Israeli flag — SVG with waving stripes and a Star of David
// that draws itself. Replaces the static photo band on Meet Shavit
// between Act I and Act II.

const { useRef: useFlagRef, useEffect: useFlagEffect } = React;

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
            {/* Three vertical "ribbons" with slight phase offsets give a wave illusion */}
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

          {/* Top blue stripe (path, not rect, so we can wave it) */}
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
  );
}

window.IsraeliFlagBand = IsraeliFlagBand;
