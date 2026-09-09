/* global React, VideoHero, TriPaths, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */

/* Housing classes operated under Charger Property Management.
   Per brief: Charger is the flagship company; 10+ supporting entities
   organize portfolio by housing class. */
const HOUSING_CLASSES = [
  { tag: 'HILLSDALE, MI · JACKSON CO · INDIANAPOLIS', name: 'LONG-TERM RESIDENTIAL', desc: 'Single-family and small multi-family homes for working families across our core Midwest markets.', photo: 'EXTERIOR. 17 LO PRESTO AVE, HILLSDALE', src: SHAVIT_PHOTOS.loPresto, filter: 'saturate(1) contrast(1.05)' },
  { tag: 'CLEVELAND, OH',                            name: 'MID-TERM PROFESSIONAL',     desc: 'Furnished 30 to 180 day units for traveling medical and graduate professionals.',                  photo: 'Cleveland Brick',         src: STOCK.brickFacade,   filter: 'sepia(0.12) saturate(1.05) contrast(1.05)' },
  { tag: 'SOUTH BEND, IN · CLEVELAND, OH',           name: 'OVERLOOKED ASSETS',         desc: 'Distressed and overlooked properties acquired, fully renovated, and stabilized as long-term homes.', photo: 'EXTERIOR. SECOND CHANCE TURNAROUND', src: SHAVIT_PHOTOS.secondChance, filter: 'saturate(1) contrast(1.05)' },
];

const HOME_CASES = [
  {
    pull: 'REDUCED FEES.\nQUICKER SALE.\nHIGHER PROFITS.',
    quote: 'His honest assessment of local market trends and marketing skills ensured a fair outcome. His flexible marketing strategy allowed me to reduce agent and broker fees, resulting in a quicker sale and significantly higher profits than a traditional Real Estate Agency.',
    attr: 'Gary Pauken · Hillsdale Resident',
    avatar: SHAVIT_PHOTOS.gary,
  },
  {
    pull: 'PROFESSIONAL\nACROSS THE BOARD.',
    quote: "Selling my property, transferring the loan, having Shavit and his team assume my loan. Every step was excellent. Professional across the board, and the kind of operator who makes you feel like family.",
    attr: 'Jeffrey S. Riling · US Veteran',
    avatar: SHAVIT_PHOTOS.jef,
  },
  {
    pull: 'RELIABLE PARTNER.\nTRUSTWORTHY FRIEND.',
    quote: "Extensive knowledge, remarkable attention to detail, a man of his word. Shavit is not only a reliable business partner but also a trustworthy friend. I'm confident in reaching out to him in any predicament.",
    attr: 'Nicky · Cleveland Real Estate Investor',
    avatar: SHAVIT_PHOTOS.nicky,
  },
];

function CompaniesPreview({ onNav }) {
  return (
    <section className="band band__inner" style={{ maxWidth: 1440, margin: '0 auto' }}>
      <div className="section-head section-head--left" style={{ alignItems: 'flex-start' }}>
        <Reveal as="div" mode="fade"><Eyebrow gold>Charger Property Management</Eyebrow></Reveal>
        <LineReveal as="h2" className="h-xl" lines={['One operator.', 'Three housing classes.']} lineDelay={200} />
        <Reveal mode="fade" delay={800}>
          <p className="body-lg" style={{ maxWidth: 640, marginTop: 16 }}>
            Charger Property Management is the flagship. The infrastructure that runs every door in the portfolio. Underneath it, a network of 10+ operating entities organized by housing class.
          </p>
        </Reveal>
      </div>
      <div className="cards cards-3" style={{ borderTop: '1px solid #202020', borderBottom: '1px solid #202020' }}>
        {HOUSING_CLASSES.map((c, i) => (
          <Reveal
            key={i}
            as="div"
            mode="rise"
            delay={i * 200}
            className="ccard"
            onClick={() => { onNav('companies'); window.scrollTo({ top: 0 }); }}
            style={{ cursor: 'pointer' }}
          >
            <div className="ccard__media">
              <div className="ccard__photo-zoom"><Placeholder label={c.photo} src={c.src} filter={c.filter} kind="photo" /></div>
            </div>
            <div className="ccard__body">
              <div className="ccard__tag">{c.tag}</div>
              <h3 className="ccard__name">{c.name}</h3>
              <p className="ccard__desc">{c.desc}</p>
              <div className="ccard__cta">Explore <span className="ccard__arrow">→</span></div>
            </div>
            <span className="ccard__rule" aria-hidden="true" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CasesPreview({ onNav }) {
  return (
    <section className="band band--iron" style={{ position: 'relative' }}>
      <SurfaceSweep />
      <div className="band__inner">
        <div className="section-head section-head--left">
          <Reveal mode="fade"><Eyebrow gold>Case Studies</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={['The work speaks.']} />
        </div>
        <div className="qcards">
          {HOME_CASES.map((c, i) => (
            <Reveal key={i} as="article" className="qcard" mode="rise" delay={i * 300}>
              <LineReveal as="h3" className="qcard__pull" lines={c.pull.split('\n')} lineDelay={150} />
              <Reveal mode="fade" delay={500 + i * 300}><GoldRule /></Reveal>
              <Reveal mode="fade" delay={900 + i * 300}><p className="qcard__quote">{c.quote}</p></Reveal>
              <Reveal mode="fade" delay={1200 + i * 300}>
                <div className="qcard__attr">
                  {c.avatar && <img src={c.avatar} alt="" className="qcard__avatar" referrerPolicy="no-referrer" />}
                  <span>{c.attr}</span>
                </div>
              </Reveal>
            </Reveal>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Reveal mode="fade" delay={400}>
            <Btn variant="ghost" onClick={() => { onNav('case-studies'); window.scrollTo({ top: 0 }); }}>See All Case Studies →</Btn>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HomePage({ onNav }) {
  return (
    <div className="page-fade">
      {/* 1.1 — full-viewport video hero */}
      <VideoHero
        blueprint
        eyebrow="Community Impact, Made Profitable"
        h1Lines={['Overlooked housing,', 'long-term homes.']}
        sub="I invest in overlooked housing across Midwest communities and transform it into long-term homes for families. 50 doors today. 200 doors and 30 local jobs by 2030."
        videoSrc={HERO_VIDEO}
        videoLabel="Aerial · Hillsdale / Cleveland / South Bend"
        actions={(
          <>
            <Btn formType="work" variant="gold">Work With Me →</Btn>
            <Btn formType="invest" variant="ghost">Invest With Me →</Btn>
          </>
        )}
      />

      {/* 1.2 — three-path self-select */}
      <section className="band band--tight" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head" style={{ marginBottom: 48 }}>
          <Reveal mode="fade"><Eyebrow gold>Four Ways In</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Pick your path.']} />
        </div>
      </section>
      <TriPaths
        onNav={onNav}
        items={[
          {
            label: 'INVEST', headline: 'DEPLOY CAPITAL.',
            body: 'Passive capital into stabilized cash-flowing housing across Michigan and Ohio. Operator-led, transparently reported.',
            cta: 'Explore Investing', page: 'companies',
            photo: 'Property · Stabilized Asset · Golden Hour',
            src: STOCK.luxuryDusk, filter: 'saturate(1.05) contrast(1.05)',
          },
          {
            label: 'WORK WITH ME', headline: 'LEARN THE PLAYBOOK.',
            body: 'Guidance for new and experienced investors entering out-of-state markets. The playbook, not the pitch.',
            cta: 'Start The Conversation', formType: "work",
            photo: 'Office · Investor Walkthrough',
            src: STOCK.meeting, filter: 'brightness(0.85) saturate(0.95) contrast(1.05)',
          },
          {
            label: 'SELL', headline: 'A BETTER EXIT.',
            body: 'Lower fees, faster sales, and honest assessments. Backed by a track record of higher net to sellers.',
            cta: 'List With Me', page: 'contact',
            photo: 'Closing Table · Hillsdale, MI',
            src: STOCK.signingDeal, filter: 'sepia(0.12) saturate(1.1) brightness(0.92)',
          },
          {
            label: 'BUY', headline: 'A DIFFERENT AGENT.',
            body: 'Local market truth, transparent representation, and a buying process built to protect your downside.',
            cta: 'Start Searching', page: 'contact',
            photo: 'Streetscape · Hillsdale & Jackson County',
            src: STOCK.suburbStreet, filter: 'saturate(0.95) contrast(1.05) brightness(0.95)',
          },
        ]}
      />

      {/* 1.3 — portfolio numbers */}
      <section className="band">
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>The Numbers Today</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['50 doors. Three states.', '$12M and counting.']} lineDelay={180} />
          </div>
          <StatsGrid rows={[
            { value: <Counter to={50} suffix="+" />, label: 'Doors Operated' },
            { value: <Counter to={10} suffix="+" />, label: 'Operating Entities' },
            { value: <><span className="currency">$</span><Counter to={12} suffix="M+" /></>, label: 'Portfolio Value' },
            { value: <Counter to={3} />,             label: 'States · MI · OH · IN' },
          ]} />
        </div>
      </section>

      {/* 1.3b — BRRRR explainer */}
      <section className="band band--iron" style={{ position: 'relative' }}>
        <SurfaceSweep />
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>The Playbook</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-xl" lines={['BRRRR.', 'Run it. Repeat it.']} lineDelay={200} />
            <Reveal mode="fade" delay={900}>
              <p className="body-lg" style={{ maxWidth: 680, marginTop: 16 }}>
                Acquire overlooked Midwest housing. Rehab it to a standard families want to live in. Stabilize a long-term tenant. Refinance the equity back out. Repeat across the portfolio. Not flashy. Disciplined.
              </p>
            </Reveal>
          </div>
          <div className="brrrr">
            {[
              { k: 'B', label: 'Buy',       icon: 'key',    desc: 'Acquire distressed and overlooked single-family homes in Hillsdale, Cleveland, and South Bend.' },
              { k: 'R', label: 'Rehab',     icon: 'hammer', desc: 'Full top-to-bottom renovation. Kitchens, baths, mechanicals, exterior. To a standard families want.' },
              { k: 'R', label: 'Rent',      icon: 'door',   desc: 'Stabilize a long-term tenant. Working families, students, medical professionals.' },
              { k: 'R', label: 'Refinance', icon: 'coins',  desc: 'Pull our capital back out at the new appraised value. Conservative leverage, never stretched.' },
              { k: 'R', label: 'Repeat',    icon: 'loop',   desc: 'Redeploy into the next property. Compound across the portfolio.' },
            ].map((s, i) => (
              <Reveal key={i} as="div" mode="rise-sm" delay={i * 150} className="brrrr__step">
                <div className="brrrr__letter">{s.k}</div>
                <span className="brrrr__rule" />
                <BrrrrIcon kind={s.icon} />
                <div className="brrrr__label">{s.label}</div>
                <div className="brrrr__desc">{s.desc}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 1.4 — founder story preview (full-bleed split) */}
      <section className="split">
        <Reveal mode="zoom-lg" className="split__media ph-vignette" style={{ position: 'relative' }}>
          <Placeholder
            src={SHAVIT_PHOTOS.portraitLI}
            alt="Shavit Rootman"
            filter="contrast(1.06) saturate(0.95) brightness(0.95)"
            portrait
          />
        </Reveal>
        <div className="split__panel">
          <Reveal mode="fade"><Eyebrow gold>Meet The Operator</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={['The first Israeli', 'at Hillsdale College.']} lineDelay={200} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={800}><GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} /></Reveal>
          <Reveal mode="fade" delay={1000}>
            <p className="body-lg" style={{ maxWidth: 520, marginBottom: 16 }}>
              I served in the Israeli Defense Forces in a special operations unit, with two return deployments after October 7. In 2016 I became the first Israeli student at Hillsdale College. By senior year, a conversation in a renovated carriage house turned into a thesis. Creative housing, designed by and for the community, could transform this town.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={1800}>
            <p className="body-lg" style={{ maxWidth: 520 }}>
              Today I run 10+ real estate entities across Michigan, Ohio, and Indiana. Tenants I have mentored now provide cleaning, handyman, and property management services back to the portfolio. Improving homes. Building communities. Community impact, made profitable.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={2400}>
            <div style={{ marginTop: 32 }}>
              <Btn variant="ghost" onClick={() => { onNav('meet'); window.scrollTo({ top: 0 }); }}>Read The Full Story →</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.5 — companies 4-up preview */}
      <CompaniesPreview onNav={onNav} />

      {/* 1.5a — UNIFIED: Progress + 2030 Vision */}
      <ProgressVision />

      {/* 1.6 — case studies preview */}
      <CasesPreview onNav={onNav} />

      {/* 1.7 — pre-footer CTA */}
      <CtaBand
        eyebrow="Get Started"
        hLines={['Build your', 'portfolio', 'with me.']}
        src={STOCK.aerialHouse}
        filter="brightness(0.55) saturate(1.05)"
        actions={(
          <>
            <Btn formType="work" variant="gold">Work With Me →</Btn>
            <Btn formType="invest" variant="ghost">Invest With Me →</Btn>
          </>
        )}
      />
    </div>
  );
}

window.HomePage = HomePage;
