/* global React */
// Logo Intro — first-load curtain that lifts away.
// Cinematic logo reveal: a small architectural house mark draws itself,
// then each letter of SHAVIT ROOTMAN slides up with brass-fill stagger,
// underline rules draw across, caption types in, curtain fades.

const { useState: useIntroState, useEffect: useIntroEffect } = React;

function LogoIntro() {
  const [phase, setPhase] = useIntroState('pre');

  useIntroEffect(() => {
    if (phase === 'gone') return;
    // Total sequence: ~4.6s in, then 800ms out
    const t1 = setTimeout(() => setPhase('in'),   60);
    const t2 = setTimeout(() => setPhase('out'),  60 + 4600);
    const t3 = setTimeout(() => setPhase('gone'), 60 + 4600 + 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase === 'pre']);

  useIntroEffect(() => {
    if (phase === 'gone') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  if (phase === 'gone') return null;

  // Split name into letters for staggered animation
  const splitLetters = (word, baseDelay) =>
    word.split('').map((ch, i) => (
      <span
        key={i}
        className="intro__letter"
        style={{ animationDelay: `${baseDelay + i * 60}ms` }}
      >
        {ch}
      </span>
    ));

  return (
    <div className={`intro intro--${phase}`} aria-hidden="true">
      <div className="intro__bg" />
      <div className="intro__halo" />

      <div className="intro__mark">
        {/* Architectural house mark — draws in first */}
        <svg className="intro__house" viewBox="0 0 96 64" aria-hidden="true">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path className="intro__house-path" d="M8 56 L8 30 L48 8 L88 30 L88 56 L8 56 Z" />
            <path className="intro__house-path" d="M40 56 L40 36 L56 36 L56 56" />
            <path className="intro__house-path" d="M8 56 L88 56" strokeWidth="2" />
          </g>
        </svg>

        {/* Top gold rule */}
        <span className="intro__rule intro__rule--top" />

        {/* SHAVIT */}
        <span className="intro__line intro__line--a" aria-label="Shavit">
          {splitLetters('SHAVIT', 700)}
        </span>

        {/* ROOTMAN — gold */}
        <span className="intro__line intro__line--b" aria-label="Rootman">
          {splitLetters('ROOTMAN', 1100)}
        </span>

        {/* Bottom gold rule */}
        <span className="intro__rule intro__rule--bottom" />

        {/* Caption */}
        <span className="intro__caption">Real Estate, Operated.</span>
      </div>
    </div>
  );
}

window.LogoIntro = LogoIntro;
