/* global React */
// BlueprintHouse — an isometric wireframe house drawn in thin gold,
// each line stroke-drawn on mount, then the whole shape slow-rotates
// on the Y-axis. Decorative overlay; never blocks text legibility.

const { useEffect: useBpEffect, useRef: useBpRef } = React;

function BlueprintHouse({ size = 720 }) {
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
      p.getBoundingClientRect();  // force reflow
      p.style.transition = `stroke-dashoffset 1500ms cubic-bezier(0.16, 1, 0.3, 1) ${600 + i * 90}ms, opacity 800ms ease ${600 + i * 90}ms`;
      p.style.strokeDashoffset = '0';
      p.style.opacity = '1';
    });
  }, []);

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

            {/* Front face (parallelogram) — isometric projection of the front wall */}
            <path className="bp-line" style={{ opacity: 0 }} d="M-100 100 L 100 100 L 100 -20 L -100 -20 Z" />

            {/* Side face (rear-right) */}
            <path className="bp-line" style={{ opacity: 0 }} d="M 100 100 L 160 60 L 160 -60 L 100 -20" />

            {/* Top of side face line */}
            <path className="bp-line" style={{ opacity: 0 }} d="M -100 -20 L -40 -60 L 160 -60" />

            {/* Front gable roof — peak above front face */}
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
  );
}

window.BlueprintHouse = BlueprintHouse;
