/* global React, VideoHero, TriPaths, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */

/* The four companies (official, per shavitrootman.com), previewed on Home. */
const HOUSING_CLASSES = [
  { tag: 'HILLSDALE & JACKSON CO, MI', name: 'BAROOTMAN ENTERPRISES',  desc: 'Long-term housing solutions across Hillsdale and Jackson counties, Michigan.', photo: 'River Street, Hillsdale MI', src: SHAVIT_PHOTOS.pRiver, filter: 'contrast(1.03)' },
  { tag: 'CLEVELAND, OH',              name: 'CHARGER REALTY',         desc: 'Short and mid-term housing for students, medical, and young professionals in Cleveland.', photo: 'Larchmere Duplex, Cleveland OH', src: SHAVIT_PHOTOS.pLarchmere, filter: 'contrast(1.03)', objectPosition: 'center center' },
  { tag: 'HILLSDALE, MI',              name: 'DSR ENTERPRISES',        desc: 'Residential housing across Hillsdale, Michigan, held for long-term local tenants.', photo: 'East Saint Joe, Hillsdale MI', src: SHAVIT_PHOTOS.pStJoe, filter: 'contrast(1.03)' },
  { tag: 'HILLSDALE, MI',              name: 'CHARGER PROPERTY MGMT',  desc: 'Asset and property management. The flagship that runs every door in the portfolio.', photo: '“Second Chance” Ranch, Hillsdale MI', src: SHAVIT_PHOTOS.pSecondChance, filter: 'contrast(1.03)' },
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
        <Reveal as="div" mode="fade"><Eyebrow gold>The Portfolio</Eyebrow></Reveal>
        <LineReveal as="h2" className="h-xl" lines={['Where we', 'operate.']} lineDelay={200} />
        <Reveal mode="fade" delay={800}>
          <p className="body-lg" style={{ maxWidth: 640, marginTop: 16 }}>
            Homes acquired, renovated, and held across Michigan, Ohio, and Indiana.
          </p>
        </Reveal>
      </div>
      <div className="cards cards-4" style={{ borderTop: '1px solid #202020', borderBottom: '1px solid #202020' }}>
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
              <div className="ccard__photo-zoom"><Placeholder label={c.photo} src={c.src} filter={c.filter} kind="photo" objectPosition={c.objectPosition || 'center center'} /></div>
            </div>
            <div className="ccard__body">
              <h3 className="ccard__name">{c.photo}</h3>
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
        sub="I invest in overlooked housing across Midwest communities and transform it into long-term homes for families. 50 doors today. 200 doors and 25 local jobs by 2030."
        videoSrc={HERO_VIDEO}
        videoLabel="Aerial · Hillsdale / Cleveland / South Bend"
        actions={(
          <>
            <Btn formType="work" variant="gold">Work With Me →</Btn>
            <Btn formType="invest" variant="ghost">Invest With Me →</Btn>
          </>
        )}
      />

      {/* 1.2 — house showcase */}
      <section className="band band--tight" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head" style={{ marginBottom: 48 }}>
          <Reveal mode="fade"><Eyebrow gold>The Portfolio</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['The houses.']} />
        </div>
      </section>
      <TriPaths
        onNav={onNav}
        items={[
          {
            label: 'River Street, Hillsdale MI',
            page: 'companies',
            photo: 'River Street, Hillsdale MI',
            src: SHAVIT_PHOTOS.pRiver, filter: 'contrast(1.03)',
          },
          {
            label: 'Budlong Street, Hillsdale MI',
            page: 'companies',
            photo: 'Budlong Street, Hillsdale MI',
            src: SHAVIT_PHOTOS.pBudlong, filter: 'contrast(1.03)',
          },
          {
            label: '34 Mead Street, Hillsdale MI',
            page: 'companies',
            photo: '34 Mead Street, Hillsdale MI',
            src: SHAVIT_PHOTOS.pMead, filter: 'contrast(1.03)',
          },
          {
            label: 'East Saint Joe, Hillsdale MI',
            page: 'companies',
            photo: 'East Saint Joe, Hillsdale MI',
            src: SHAVIT_PHOTOS.pStJoe, filter: 'contrast(1.03)',
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

      {/* 1.3b — BRRRR explainer removed for simplicity */}

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
          <LineReveal as="h2" className="h-lg" lines={['Operator first.']} lineDelay={200} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={800}><GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} /></Reveal>
          <Reveal mode="fade" delay={1000}>
            <p className="body-lg" style={{ maxWidth: 520 }}>
              I buy overlooked Midwest housing and turn it into long-term homes for families. 50 doors across Michigan, Ohio, and Indiana, run through Charger Property Management. Improving homes. Building communities.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={1800}>
            <div style={{ marginTop: 32 }}>
              <Btn variant="ghost" onClick={() => { onNav('meet'); window.scrollTo({ top: 0 }); }}>Read The Full Story →</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.5 — companies 4-up preview */}
      <CompaniesPreview onNav={onNav} />

      {/* 1.6 — case studies preview */}
      <CasesPreview onNav={onNav} />

      {/* 1.7 — pre-footer CTA */}
      <CtaBand
        eyebrow="Get Started"
        hLines={['Build your', 'portfolio', 'with me.']}
        src={SHAVIT_PHOTOS.pParkview}
        filter="brightness(0.5) saturate(1.05)"
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
