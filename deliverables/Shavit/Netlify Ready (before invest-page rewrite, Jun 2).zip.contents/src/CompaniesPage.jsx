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
    name: 'Long-Term Residential',
    market: 'Hillsdale, MI · Jackson Co · Indianapolis, IN',
    photo: 'Long-Term Residential',
    src: SHAVIT_PHOTOS.loPresto, filter: 'saturate(0.98) contrast(1.05)',
    body: [
      "Single-family and small multi-family homes across our core Midwest markets. Hillsdale, Jackson County, and the Indianapolis metro. Acquired through the BRRRR loop, fully renovated, and stabilized for working families.",
      "Underwriting is conservative. Tenants are screened with judgment, not just credit scores. The thesis is unglamorous and durable. Well-managed housing in undervalued markets compounds across decades.",
    ],
    specs: [
      ['Asset Type',    'Single-family & small multi'],
      ['Target Tenant', 'Long-term working families'],
      ['Markets',       'Hillsdale, Jackson Co, MI · Indianapolis, IN'],
    ],
  },
  {
    name: 'Hillsdale Community Housing',
    market: 'Hillsdale, MI',
    photo: 'Hillsdale Community Housing',
    src: SHAVIT_PHOTOS.architecture, filter: 'sepia(0.1) saturate(1.05) contrast(1.05)',
    body: [
      "Housing for the broader Hillsdale community. Students, faculty, and locals alike. The town is shaped by the college around it, and we operate for everyone who lives in its orbit, not just one slice of it.",
      "We understand the local rhythm, the relationships are direct, and we elevate the standard of housing in a market long served by absentee owners who did not understand the people they housed.",
    ],
    specs: [
      ['Asset Type',    'Student & community housing'],
      ['Target Tenant', 'Hillsdale students, faculty, locals'],
      ['Markets',       'Hillsdale, MI'],
    ],
  },
  {
    name: 'Mid-Term Professional',
    market: 'Cleveland, OH',
    photo: 'Cleveland Brick',
    src: STOCK.brickFacade, filter: 'saturate(0.85) brightness(0.92)',
    body: [
      "Furnished, design-forward units in Cleveland submarkets adjacent to the city's hospital systems and universities. Average stays run 30 to 180 days. Serving the medical corridor, traveling professionals, and graduate students.",
      "Operations are turnkey for the tenant and high-margin for the owner. The market mispricing sits in the gap between hotel inventory and traditional 12-month leases. We live in that gap.",
    ],
    specs: [
      ['Asset Type',    'Furnished short & mid-term'],
      ['Target Tenant', 'Medical, traveling pros, grad students'],
      ['Markets',       'Cleveland, OH'],
    ],
  },
  {
    name: 'Overlooked Assets',
    market: 'South Bend, IN · Cleveland, OH',
    photo: 'Before Renovation',
    src: SHAVIT_PHOTOS.secondChance, filter: 'saturate(1) contrast(1.05)',
    body: [
      "Not all real estate is sexy. We acquire distressed and overlooked single-family homes others walk past. Properties with bad histories, evicted tenants, or deferred maintenance that scares off most operators.",
      "Then we do the work. Clean it down to the studs if it needs it. Rebuild it to a standard a family wants to live in. Re-rent it. Second-chance housing. The numbers work because we show up and do the work.",
    ],
    specs: [
      ['Service',       'Distressed acquisition & full rehab'],
      ['Approach',      'Eviction · Deep clean · Full rebuild · Re-rent'],
      ['Markets',       'South Bend, IN · Cleveland, OH'],
    ],
  },
];

function DeepDive({ data, flip, onNav }) {
  return (
    <article className={`deep ${flip ? 'deep--flip' : ''}`}>
      <Reveal mode="zoom-lg" className="deep__media"><Placeholder label={data.photo} src={data.src} filter={data.filter} kind="photo" /></Reveal>
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
  { num: '01', title: 'Discovery.',    desc: 'We meet, we listen, we map your capital posture, risk tolerance, and timeline before any deal moves.', photo: 'Discovery Conversation', src: STOCK.meeting,    filter: 'brightness(0.85) saturate(0.95)' },
  { num: '02', title: 'Underwriting.', desc: 'Every opportunity is underwritten against conservative assumptions, local comps, and operator-tested cost models.', photo: 'Underwriting', src: STOCK.deskDocs,    filter: 'grayscale(0.5) contrast(1.1) brightness(0.9)' },
  { num: '03', title: 'Acquisition.',  desc: 'Capital is deployed into properties that meet our return thresholds. not to hit volume, not to chase markets.', photo: 'Acquisition Target · Midwest', src: STOCK.luxuryDusk,  filter: 'saturate(1.05) contrast(1.05)' },
  { num: '04', title: 'Operation.',    desc: 'The asset is operated by our team. You receive transparent reporting, distributions on schedule, and direct line to the operator.', photo: 'Stabilized Operation', src: STOCK.modernWhite, filter: 'sepia(0.15) saturate(1.05) brightness(0.95)' },
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
          <Reveal mode="zoom-lg" className="process__media"><Placeholder label={s.photo} src={s.src} filter={s.filter} kind="photo" /></Reveal>
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
  return (
    <div className="page-fade">
      {/* 2.1 hero */}
      <VideoHero
        height="80vh"
        eyebrow="Charger Property Management"
        h1Lines={['One operator.', 'One company.', 'A network underneath.']}
        sub="Charger Property Management is the flagship. The infrastructure that runs every door. Beneath it, 10+ operating entities organized by housing class across Michigan, Ohio, and Indiana."
        videoLabel="AERIAL. SOUTHERN MICHIGAN / CLEVELAND"
        videoSrc={HERO_VIDEO}
      />

      {/* 2.2 thesis */}
      <section className="band band--iron" style={{ position: 'relative' }}>
        <SurfaceSweep />
        <div className="band__inner" style={{ maxWidth: 880, textAlign: 'center', margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Thesis</Eyebrow></Reveal>
          {/* line 1 simple rise; line 2 luxury reveal 800ms later */}
          <h2 className="h-xl" style={{ marginTop: 16 }}>
            <Reveal as="span" mode="rise" duration="1000ms" style={{ display: 'inline-block' }}>Improving homes.</Reveal>
            <br/>
            <LineReveal as="span" lines={['Building communities.']} baseDelay={800} className="" style={{ display: 'inline-block' }} />
          </h2>
          <Reveal mode="fade" delay={1800}><GoldRule wide style={{ margin: '32px auto' }} /></Reveal>
          <div style={{ textAlign: 'left' }}>
            <Reveal mode="rise-sm" delay={2200}>
              <p className="body-lg" style={{ marginBottom: 16 }}>
                Our playbook is straightforward and disciplined. <strong style={{ color: '#FFC000', fontWeight: 700 }}>BRRRR</strong>. Buy. Rehab. Rent. Refinance. Repeat. Acquire overlooked Midwest housing. Fully renovate it. Stabilize a long-term tenant. Refinance the equity back out. Compound across the portfolio.
              </p>
            </Reveal>
            <Reveal mode="rise-sm" delay={2700}>
              <p className="body-lg" style={{ marginBottom: 16 }}>
                Our markets are deliberately chosen. Hillsdale, Jackson County, Cleveland, South Bend, and Indianapolis. Large enough to scale, small enough to know personally. They reward operators with infrastructure on the ground and punish those underwriting from a distance.
              </p>
            </Reveal>
            <Reveal mode="rise-sm" delay={3200}>
              <p className="body-lg">
                Charger Property Management is the flagship. The team, the systems, the weekly execution sheets that hold every project accountable. Underneath it, a network of 10+ entities organized by housing class.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2.3 portfolio numbers */}
      <ChargerHero />
      <section className="band">
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>Footprint</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['50 doors. $12M.', 'Three states.']} lineDelay={180} />
          </div>
          <StatsGrid rows={PORTFOLIO_STATS} />
        </div>
      </section>

      {/* 2.4 housing classes */}
      <section className="band" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head section-head--left">
          <Reveal mode="fade"><Eyebrow gold>The Housing Classes</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Three asset types.', 'One operating layer.']} lineDelay={180} />
        </div>
      </section>
      {DEEPDIVES.map((d, i) => <DeepDive key={i} data={d} flip={i % 2 === 1} onNav={onNav} />)}

      {/* 2.5 process */}
      <section className="band" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head section-head--left">
          <Reveal mode="fade"><Eyebrow gold>The Process</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['How capital moves.']} />
        </div>
      </section>
      <Process />

      {/* 2.6 FAQ */}
      <section className="band">
        <div className="band__inner">
          <div className="section-head">
            <Reveal mode="fade"><Eyebrow gold>Questions</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-xl" lines={['Common questions.']} />
          </div>
          <FaqList />
        </div>
      </section>

      {/* 2.7 pre-footer CTA — single gold action */}
      <CtaBand
        eyebrow="Ready?"
        hLines={['Deploy', 'capital.']}
        src={STOCK.aerialHouse}
        filter="brightness(0.55) saturate(1.05)"
        actions={<Btn formType="invest" variant="gold">Invest With Me →</Btn>}
      />
    </div>
  );
}

window.CompaniesPage = CompaniesPage;
