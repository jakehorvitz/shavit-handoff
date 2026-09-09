/* global React */
// Small architectural-style icons for the BRRRR pillars,
// each with a subtle looping animation that re-fires every 4–5s.
// Pure SVG + CSS; no JS animation needed (all GPU).

function BrrrrIcon({ kind }) {
  if (kind === 'key') {
    // A key turning on its bow
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
    );
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
    );
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
    );
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
    );
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
  );
}

window.BrrrrIcon = BrrrrIcon;
