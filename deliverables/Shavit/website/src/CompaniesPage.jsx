/* global React, VideoHero, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */
const { useState: useCompState } = React;

/* =================================================================
   THE OPERATION — organized by state, not by entity.
   Legal entities exist for liability protection only; the public
   site presents one operation across three states.
   ================================================================= */

const PORTFOLIO_STATS = [
  { value: <Counter to={50} suffix="+" />, label: 'Doors Owned & Operated' },
  { value: <><span className="currency">$</span><Counter to={12} suffix="M+" /></>, label: 'Portfolio Value' },
  { value: <Counter to={3} />,             label: 'States · MI · OH · IN' },
  { value: <Counter to={200} />,           label: 'Door Goal · 2030' },
];

const STATES = [
  {
    name: 'Michigan',
    market: 'Hillsdale · Jackson County',
    photo: 'Long-Term Residential',
    src: SHAVIT_PHOTOS.loPresto, filter: 'saturate(0.98) contrast(1.05)',
    body: [
      "The heart of the operation. Single-family and small multi-family homes in Hillsdale and Jackson County, acquired through the BRRRR loop, fully renovated, and stabilized for working families, students, and locals alike.",
      "The 2030 goal is concrete: 100 homes revitalized in Hillsdale, with the housing standard raised in a market long served by absentee owners.",
    ],
    specs: [
      ['Focus',   'Long-term residential & community housing'],
      ['Tenants', 'Working families, students, faculty, locals'],
      ['Markets', 'Hillsdale · Jackson County'],
    ],
  },
  {
    name: 'Ohio',
    market: 'Cleveland',
    photo: 'Cleveland Brick',
    src: STOCK.brickFacade, filter: 'saturate(0.85) brightness(0.92)',
    body: [
      "Furnished mid-term housing in Cleveland submarkets adjacent to the hospital systems and universities. Average stays run 30 to 180 days — the medical corridor, traveling professionals, and graduate students.",
      "The mispricing sits in the gap between hotel inventory and traditional 12-month leases. The operation lives in that gap.",
    ],
    specs: [
      ['Focus',   'Furnished mid-term housing'],
      ['Tenants', 'Medical, traveling pros, grad students'],
      ['Markets', 'Cleveland'],
    ],
  },
  {
    name: 'Indiana',
    market: 'South Bend',
    photo: 'Before Renovation',
    src: SHAVIT_PHOTOS.secondChance, filter: 'saturate(1) contrast(1.05)',
    body: [
      "Not all real estate is sexy. In South Bend the operation acquires distressed and overlooked single-family homes others walk past — bad histories, deferred maintenance, sellers who need an exit before foreclosure.",
      "Then the work happens. Down to the studs if needed, rebuilt to a standard a family wants to live in, re-rented long-term. Second-chance housing that holds.",
    ],
    specs: [
      ['Focus',   'Distressed acquisition & full rehab'],
      ['Tenants', 'Long-term working families'],
      ['Markets', 'South Bend'],
    ],
  },
];

function StateDive({ data, flip }) {
  return (
    <article className={`deep ${flip ? 'deep--flip' : ''}`} style={data.src ? undefined : { gridTemplateColumns: '1fr' }}>
      {data.src && <Reveal mode="zoom-lg" className="deep__media"><Placeholder label={data.photo} src={data.src} filter={data.filter} kind="photo" /></Reveal>}
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
      </div>
    </article>
  );
}

/* BRRRR, done differently — the expanded playbook (photo scroll panels) */
const BRRRR_DIFF = [
  {
    num: '01', title: 'Buy direct.',
    desc: 'Properties are bought directly from owners — including sellers who need an exit before foreclosure. No agents on either side. The fees stay in the deal, and sellers get certainty instead of a listing.',
    photo: 'Acquisition Target · Midwest', src: STOCK.luxuryDusk, filter: 'saturate(1.05) contrast(1.05)',
  },
  {
    num: '02', title: 'Rebuild in-house.',
    desc: 'In-house crews run every renovation top to bottom, tracked weekly on execution sheets across every trade. No general-contractor markup, no waiting on someone else\u2019s schedule.',
    photo: 'Renovation In Progress', src: STOCK.deskDocs, filter: 'grayscale(0.5) contrast(1.1) brightness(0.9)',
  },
  {
    num: '03', title: 'A company per cycle.',
    desc: 'Each completed BRRRR becomes its own operating company — clean books, clean ownership, built to hold. The entities are legal protection; the operation is one.',
    photo: 'Stabilized Operation', src: STOCK.modernWhite, filter: 'sepia(0.15) saturate(1.05) brightness(0.95)',
  },
  {
    num: '04', title: 'Managed in-house.',
    desc: 'Stabilized doors are managed by the operation\u2019s own team — maintenance, tenants, and reporting all under one roof. Tenants mentored by the operator now provide services back across the portfolio.',
    photo: 'Management Walkthrough', src: STOCK.meeting, filter: 'brightness(0.85) saturate(0.95)',
  },
];

function BrrrrDiff() {
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
      {BRRRR_DIFF.map((st, i) => (
        <div
          key={i}
          ref={(el) => panelRefs.current[i] = el}
          data-idx={i}
          className={`process__panel ${i % 2 === 1 ? 'process__panel--flip' : ''}`}
        >
          <Reveal mode="zoom-lg" className="process__media"><Placeholder label={st.photo} src={st.src} filter={st.filter} kind="photo" /></Reveal>
          <div className="process__copy">
            <div className="process__num-stack">
              <div
                key={`num-${i}-${active === i ? 'on' : 'off'}`}
                className={active === i ? 'process__num process__num--enter' : 'process__num'}
                style={{ opacity: active === i ? 1 : 0.25 }}
              >
                {st.num}
              </div>
            </div>
            <Reveal mode="fade"><GoldRule /></Reveal>
            <LineReveal as="h3" className="process__title" lines={[st.title]} threshold={0.4} />
            <Reveal mode="rise-sm" delay={400}>
              <p className="process__desc">{st.desc}</p>
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
  { q: 'How do partnerships start?',                  a: 'With a conversation, not a form. Nothing on this site is an offer — partnership and equity specifics are discussed privately, one-on-one. New inquiries are not currently being accepted.' },
  { q: 'What does the BRRRR cycle look like?',        a: 'Buy direct from the owner, rehab fully in-house, place a long-term tenant, refinance the equity back out, repeat — with each stabilized cycle structured as its own company.' },
  { q: 'Why are there multiple legal entities?',      a: 'Legal protection only. Each completed project is held in its own entity for clean ownership and liability separation. Operationally, it is one portfolio, one team, one playbook.' },
  { q: 'Does the operation work as an agent for buyers or sellers?', a: 'No. The operation represents its own portfolio only — no brokerage, no agency services, no client representation. Owners who want to sell directly can reach out when inquiries reopen.' },
  { q: "What's the exit strategy?",                   a: 'Every project is underwritten to a defined exit — refinance, sale, or 1031 — and that plan is set in writing before anything moves forward.' },
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
        eyebrow="The Operation"
        h1Lines={['One operation.', 'Three states.']}
        sub="Every door owned and operated in-house across Michigan, Ohio, and Indiana. The legal entities are protection; the operation is one."
        videoLabel="AERIAL. SOUTHERN MICHIGAN / CLEVELAND"
        videoSrc={HERO_VIDEO}
      />

      {/* 2.2 thesis */}
      <section className="band band--iron" style={{ position: 'relative' }}>
        <SurfaceSweep />
        <div className="band__inner" style={{ maxWidth: 880, textAlign: 'center', margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Thesis</Eyebrow></Reveal>
          <h2 className="h-xl" style={{ marginTop: 16 }}>
            <Reveal as="span" mode="rise" duration="1000ms" style={{ display: 'inline-block' }}>Building communities,</Reveal>
            <br/>
            <LineReveal as="span" lines={['profitably.']} baseDelay={800} className="" style={{ display: 'inline-block' }} />
          </h2>
          <Reveal mode="fade" delay={1800}><GoldRule wide style={{ margin: '32px auto' }} /></Reveal>
          <div style={{ textAlign: 'left' }}>
            <Reveal mode="rise-sm" delay={2200}>
              <p className="body-lg" style={{ marginBottom: 16 }}>
                The playbook is <strong style={{ color: '#FFC000', fontWeight: 700 }}>BRRRR</strong> — Buy, Rehab, Rent, Refinance, Repeat — run differently. Bought direct from owners with no agents on either side. Rebuilt by in-house crews. Held and managed in-house, with each completed cycle structured as its own company.
              </p>
            </Reveal>
            <Reveal mode="rise-sm" delay={2700}>
              <p className="body-lg">
                The markets are deliberate: Hillsdale, Jackson County, Cleveland, and South Bend. Large enough to scale, small enough to know personally. They reward operators with infrastructure on the ground and punish those underwriting from a distance.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 2.3 portfolio numbers */}
      <section className="band">
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>Footprint</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['50 doors. $12M.', 'Three states.']} lineDelay={180} />
          </div>
          <StatsGrid rows={PORTFOLIO_STATS} />
        </div>
      </section>

      {/* 2.4 states */}
      <section className="band" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head section-head--left">
          <Reveal mode="fade"><Eyebrow gold>Where We Operate</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Three states.', 'One standard.']} lineDelay={180} />
        </div>
      </section>
      {STATES.map((d, i) => <StateDive key={i} data={d} flip={i % 2 === 1} />)}

      {/* 2.5 BRRRR done differently */}
      <section className="band" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head section-head--left">
          <Reveal mode="fade"><Eyebrow gold>The Playbook, Expanded</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['BRRRR, done differently.']} />
        </div>
      </section>
      <BrrrrDiff />

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

      {/* 2.7 pre-footer CTA */}
      <CtaBand
        eyebrow="Partner & Equity"
        hLines={['Building', 'communities,', 'profitably.']}
        src={STOCK.aerialHouse}
        filter="brightness(0.55) saturate(1.05)"
        actions={(
          <>
            <Btn variant="gold" onClick={() => { onNav && onNav('contact'); window.scrollTo({ top: 0 }); }}>Partner & Equity →</Btn>
            <p className="body-md" style={{ marginTop: 16, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
              * Not currently accepting new inquiries.
            </p>
          </>
        )}
      />
    </div>
  );
}

window.CompaniesPage = CompaniesPage;
