/* global React, VideoHero, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */
const { useState: useCompState } = React;

/* Hero showcase — Charger Property Management gold logo + sub-copy.
   Sits ABOVE the standard video hero on the Companies page so the
   official mark is the first thing visitors see. */
function ChargerHero() {
  return (
    <section className="charger-hero">
      <div className="charger-hero__inner">
        <Reveal mode="fade" className="charger-hero__logo">
          <img src={SHAVIT_PHOTOS.chargerLogo} alt="Charger Property Management" />
        </Reveal>
        <Reveal mode="fade" delay={400} className="charger-hero__caption">
          <Eyebrow gold>The Flagship</Eyebrow>
          <p className="body-lg" style={{ maxWidth: 520, marginTop: 12 }}>
            Charger Property Management runs the operating layer beneath every door. The team, the weekly execution sheets, the accountability that holds the portfolio together.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

const PORTFOLIO_STATS = [
  { value: <Counter to={50} suffix="+" />, label: 'Doors Operated' },
  { value: <Counter to={10} suffix="+" />, label: 'Operating Entities' },
  { value: <><span className="currency">$</span><Counter to={12} suffix="M+" /></>, label: 'Portfolio Value' },
  { value: <Counter to={200} />,           label: 'Door Goal · Midwest 2030' },
];

const DEEPDIVES = [
  {
    name: 'Barootman Enterprises',
    market: 'Hillsdale & Jackson Counties, MI',
    photo: '61 Salem Street, Hillsdale MI',
    src: SHAVIT_PHOTOS.pSalem, filter: 'contrast(1.03)',
    body: [
      "Long-term housing solutions across Hillsdale and Jackson counties, Michigan. The early venture, co-founded in 2023, where the operating playbook was first proven.",
      "Barootman acquires, renovates, and holds single-family and small multi-family homes for working families, and built the systems for renovation, tenant placement, and management that the rest of the portfolio now runs on.",
    ],
    specs: [
      ['Focus',         'Long-term residential housing'],
      ['Target Tenant', 'Long-term working families'],
      ['Markets',       'Hillsdale & Jackson Co, MI'],
    ],
  },
  {
    name: 'Charger Realty',
    market: 'Cleveland, OH',
    photo: 'Larchmere Duplex, Cleveland OH',
    src: SHAVIT_PHOTOS.pLarchmere, filter: 'contrast(1.03)',
    body: [
      "Short-term and mid-term housing solutions for students, medical professionals, and young professionals in the Cleveland area.",
      "Furnished, design-forward units adjacent to the city's hospital systems and universities, with stays running 30 to 180 days. Turnkey for the tenant, high-margin for the owner.",
    ],
    specs: [
      ['Focus',         'Short & mid-term housing'],
      ['Target Tenant', 'Students, medical & young professionals'],
      ['Markets',       'Cleveland, OH'],
    ],
  },
  {
    name: 'DSR Enterprises',
    market: 'Hillsdale, MI',
    photo: 'East Saint Joe, Hillsdale MI',
    src: SHAVIT_PHOTOS.pStJoe, filter: 'contrast(1.03)',
    body: [
      "Residential housing across Hillsdale, Michigan. Single-family homes acquired, renovated, and held for long-term local tenants.",
      "Direct relationships, honest management, and an operating standard that lifts the quality of housing in a market long served by absentee owners who did not understand the people they housed.",
    ],
    specs: [
      ['Focus',         'Residential housing'],
      ['Target Tenant', 'Long-term local residents'],
      ['Markets',       'Hillsdale, MI'],
    ],
  },
  {
    name: 'Charger Property Management',
    market: 'Hillsdale, MI',
    photo: '“Second Chance” Ranch, Hillsdale MI',
    src: SHAVIT_PHOTOS.pSecondChance, filter: 'contrast(1.03)',
    body: [
      "Asset and property management in Hillsdale, Michigan. The flagship operating company, founded in 2023, that runs every door in the portfolio.",
      "The team, the curated vendor partnerships, the marketing strategy, and the weekly execution sheets that hold every project accountable, including the Second Chance housing initiative that revives the homes others walk past.",
    ],
    specs: [
      ['Focus',         'Asset & property management'],
      ['Clients',       'The operating portfolio'],
      ['Markets',       'Hillsdale, MI'],
    ],
  },
];

function DeepDive({ data, flip, onNav }) {
  return (
    <article className={`deep ${flip ? 'deep--flip' : ''}`}>
      <Reveal mode="zoom-lg" className="deep__media"><Placeholder label={data.photo} src={data.src} filter={data.filter} kind="photo" objectPosition={data.objectPosition || 'center center'} /></Reveal>
      <div className="deep__panel">
        <Reveal mode="fade"><Eyebrow gold>{data.market}</Eyebrow></Reveal>
        <LineReveal as="h2" className="h-xl" lines={[data.name]} baseDelay={300} />
        <Reveal mode="fade" delay={1100}><GoldRule /></Reveal>
        {data.body.map((p, i) => (
          <Reveal key={i} mode="rise-sm" delay={1300 + i * 250}>
            <p className="body-lg" style={{ maxWidth: 540, marginBottom: 8, color: '#fff' }}>{p}</p>
          </Reveal>
        ))}
        <dl style={{ marginTop: 16 }}>
          {data.specs.map(([k, v], i) => (
            <Reveal key={i} mode="fade" delay={1800 + i * 150} className="deep__spec">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal mode="fade" delay={2300} style={{ marginTop: 24 }}>
          <Btn variant="ghost" onClick={() => { onNav('contact'); window.scrollTo({ top: 0 }); }}>Inquire About This Company →</Btn>
        </Reveal>
      </div>
    </article>
  );
}

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery.',    desc: 'We meet, we listen, we map your capital posture, risk tolerance, and timeline before any deal moves.', photo: 'East Saint Joe, Hillsdale MI', src: SHAVIT_PHOTOS.pStJoe,    filter: 'contrast(1.03)' },
  { num: '02', title: 'Underwriting.', desc: 'Every opportunity is underwritten against conservative assumptions, local comps, and operator-tested cost models.', photo: 'Underwriting', src: STOCK.deskDocs,    filter: 'grayscale(0.5) contrast(1.1) brightness(0.9)' },
  { num: '03', title: 'Acquisition.',  desc: 'Capital is deployed into properties that meet our return thresholds. not to hit volume, not to chase markets.', photo: 'Acquisition Target · Midwest', src: SHAVIT_PHOTOS.pParkview,  filter: 'contrast(1.03)' },
  { num: '04', title: 'Operation.',    desc: 'The asset is operated by our team. You receive transparent reporting, distributions on schedule, and direct line to the operator.', photo: 'Stabilized Operation', src: SHAVIT_PHOTOS.pSalem, filter: 'contrast(1.03)', objectPosition: 'center center' },
];

function Process() {
  // Crossfade step numbers as each panel scrolls in. Each panel observes its own
  // intersection and sets active state.
  const { useState: useS, useEffect: useE, useRef: useR } = React;
  const [active, setActive] = useS(0);
  const panelRefs = useR([]);

  useE(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = Number(e.target.dataset.idx);
          setActive(idx);
        }
      });
    }, { threshold: 0.5 });
    panelRefs.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="process">
      {PROCESS_STEPS.map((s, i) => (
        <div
          key={i}
          ref={(el) => panelRefs.current[i] = el}
          data-idx={i}
          className={`process__panel ${i % 2 === 1 ? 'process__panel--flip' : ''}`}
        >
          <Reveal mode="zoom-lg" className="process__media"><Placeholder label={s.photo} src={s.src} filter={s.filter} kind="photo" objectPosition={s.objectPosition || 'center center'} /></Reveal>
          <div className="process__copy">
            <div className="process__num-stack">
              <div
                key={`num-${i}-${active === i ? 'on' : 'off'}`}
                className={active === i ? 'process__num process__num--enter' : 'process__num'}
                style={{ opacity: active === i ? 1 : 0.25 }}
              >
                {s.num}
              </div>
            </div>
            <Reveal mode="fade"><GoldRule /></Reveal>
            <LineReveal as="h3" className="process__title" lines={[s.title]} threshold={0.4} />
            <Reveal mode="rise-sm" delay={400}>
              <p className="process__desc">{s.desc}</p>
            </Reveal>
            <div className="process__pips">
              {[0,1,2,3].map(j => <span key={j} className={`pip ${j <= active ? 'pip--on' : ''}`} />)}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

const FAQ = [
  { q: "What's the minimum investment?",              a: <>Minimums vary by opportunity. Most current offerings start at <strong style={{ color: '#FFC000', fontWeight: 700 }}>$50,000</strong>, with select acquisitions accepting partners at higher thresholds.</> },
  { q: 'What hold periods should I expect?',          a: 'Hold periods run 5 to 10 years depending on the asset class. Short and mid-term operations have shorter cycles. Long-term Michigan holds are built for compounding.' },
  { q: 'How are distributions handled?',              a: 'Quarterly distributions from operating cash flow once the asset is stabilized, with annual true-ups based on full-year performance.' },
  { q: 'What about tax treatment?',                   a: 'Investors receive K-1 partnership reporting. Depreciation pass-through and 1031 exchange opportunities are available on qualifying exits. Consult your CPA on individual circumstances.' },
  { q: 'How often will I hear from you?',             a: 'Quarterly written reports, annual investor calls, and direct access to the operator between cycles. No black-box reporting.' },
  { q: "What's the exit strategy?",                   a: 'Each opportunity is underwritten to a defined exit. Refinance, sale, or 1031. Disclosed before capital is committed.' },
  { q: 'What fees should I expect?',                  a: 'Standard market structure: a one-time acquisition fee at deal close, an annual asset-management fee on equity under management, and a disposition fee at exit. All disclosed in full per opportunity. No hidden layers.' },
  { q: 'Do I need to be accredited?',                 a: 'Most current opportunities are limited to accredited investors under Reg D. Confirm your status before deploying capital.' },
];

function FaqList() {
  const [open, setOpen] = useCompState(0);
  return (
    <div className="faq">
      {FAQ.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}>
            <button className="faq__q" onClick={() => setOpen(isOpen ? -1 : i)}>
              <span>{it.q}</span>
              <span className="faq__icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {isOpen ? <line x1="5" y1="12" x2="19" y2="12" /> : <><line x1="5" y1="12" x2="19" y2="12" /><line x1="12" y1="5" x2="12" y2="19" /></>}
                </svg>
              </span>
            </button>
            <div className="faq__a"><div className="faq__a-inner"><p>{it.a}</p></div></div>
          </div>
        );
      })}
    </div>
  );
}

function CompaniesPage({ onNav }) {
  const CARDS = [
    { name: '61 Salem Street, Hillsdale MI', market: 'Hillsdale & Jackson Co, MI', src: SHAVIT_PHOTOS.pSalem },
    { name: 'Larchmere Duplex, Cleveland OH', market: 'Cleveland, OH', src: SHAVIT_PHOTOS.pLarchmere },
    { name: 'East Saint Joe, Hillsdale MI', market: 'Hillsdale, MI', src: SHAVIT_PHOTOS.pStJoe },
    { name: '“Second Chance” Ranch, Hillsdale MI', market: 'Hillsdale, MI', src: SHAVIT_PHOTOS.pSecondChance },
  ];
  return (
    <div className="page-fade">
      <VideoHero
        height="80vh"
        eyebrow="The Portfolio"
        h1Lines={['The', 'portfolio.']}
        sub="Homes acquired, renovated, and held across Michigan, Ohio, and Indiana."
        videoLabel="AERIAL. SOUTHERN MICHIGAN / CLEVELAND"
        videoSrc={HERO_VIDEO}
      />

      <section className="band">
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>The Markets</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['Where we operate.']} />
          </div>
          <div className="cards cards-4" style={{ borderTop: '1px solid #202020', borderBottom: '1px solid #202020' }}>
            {CARDS.map((c, i) => (
              <Reveal key={i} as="div" mode="rise" delay={i * 150} className="ccard">
                <div className="ccard__media">
                  <div className="ccard__photo-zoom"><Placeholder label={c.name} src={c.src} filter="contrast(1.03)" kind="photo" objectPosition="center center" /></div>
                </div>
                <div className="ccard__body">
                  <div className="ccard__tag">{c.market}</div>
                  <h3 className="ccard__name">{c.name}</h3>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>Footprint</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['50 doors. $12M.', 'Three states.']} lineDelay={180} />
          </div>
          <StatsGrid rows={PORTFOLIO_STATS} />
        </div>
      </section>

      <CtaBand
        eyebrow="Ready?"
        hLines={['Deploy', 'capital.']}
        src={SHAVIT_PHOTOS.pParkview}
        filter="brightness(0.5) saturate(1.05)"
        actions={<Btn formType="invest" variant="gold">Invest With Me →</Btn>}
      />
    </div>
  );
}

window.CompaniesPage = CompaniesPage;
