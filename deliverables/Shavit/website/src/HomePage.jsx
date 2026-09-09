/* global React, VideoHero, StatsGrid, CtaBand, Btn, TLink, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, SurfaceSweep, SHAVIT_PHOTOS, STOCK, URLS */

/* =================================================================
   HOME — deliberately short. Authentic imagery only: the Ken Burns
   hero (real portfolio photos), Shavit's portrait, nothing staged.
   Routing cards are text-only by design — no stock photography.
   ================================================================= */

const HOME_CASES = [
  {
    pull: 'PROFESSIONAL\nACROSS THE BOARD.',
    quote: "Selling my property, transferring the loan, having Shavit and his team assume my loan. Every step was excellent. Professional across the board, and the kind of operator who makes you feel like family.",
    attr: 'Jeffrey S. Riling · Sold direct to the operator',
    avatar: SHAVIT_PHOTOS.jef,
  },
  {
    pull: 'RELIABLE PARTNER.\nTRUSTWORTHY FRIEND.',
    quote: "Extensive knowledge, remarkable attention to detail, a man of his word. Shavit is not only a reliable business partner but also a trustworthy friend. I'm confident in reaching out to him in any predicament.",
    attr: 'Nicky · Cleveland Real Estate Investor',
    avatar: SHAVIT_PHOTOS.nicky,
  },
];

function HomePage({ onNav }) {
  return (
    <div className="page-fade">
      {/* 1.1 — hero: Ken Burns over real portfolio photos */}
      <VideoHero
        blueprint
        eyebrow="Building Communities, Profitably"
        h1Lines={['Overlooked housing,', 'long-term homes.']}
        sub="Shavit Rootman acquires overlooked housing across Midwest communities and transforms it into long-term homes for families. 50 doors today. 200 by 2030."
        videoSrc={HERO_VIDEO}
        videoLabel="Portfolio · Hillsdale / Cleveland / South Bend"
        actions={(
          <>
            <Btn variant="gold" onClick={() => { onNav('companies'); window.scrollTo({ top: 0 }); }}>See The Operation →</Btn>
            <Btn variant="ghost" onClick={() => { onNav('meet'); window.scrollTo({ top: 0 }); }}>Meet The Operator →</Btn>
          </>
        )}
      />

      {/* 1.2 — four-path routing (photo cards) */}
      <section className="band band--tight" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head" style={{ marginBottom: 48 }}>
          <Reveal mode="fade"><Eyebrow gold>Four Ways In</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Where do we go.']} />
        </div>
      </section>
      <TriPaths
        onNav={onNav}
        items={[
          {
            label: 'THE OPERATION', headline: 'THREE STATES. ONE PLAYBOOK.',
            body: 'How the portfolio runs across Michigan, Ohio, and Indiana — BRRRR, done differently.',
            cta: 'See The Operation', page: 'companies',
            photo: 'Property · Stabilized Asset · Golden Hour',
            src: STOCK.luxuryDusk, filter: 'saturate(1.05) contrast(1.05)',
          },
          {
            label: 'PARTNER & EQUITY', headline: 'OPERATOR-LED PARTNERSHIPS.',
            body: 'Partnerships and equity are discussed privately, one-on-one.*',
            cta: 'Learn More', page: 'contact',
            photo: 'Office · Partnership Conversation',
            src: STOCK.meeting, filter: 'brightness(0.85) saturate(0.95) contrast(1.05)',
          },
          {
            label: 'OPENINGS', headline: 'AVAILABLE HOMES.',
            body: 'Current and upcoming availability across the portfolio.',
            cta: 'View Openings', page: 'openings',
            photo: 'Streetscape · Hillsdale & Jackson County',
            src: STOCK.suburbStreet, filter: 'saturate(0.95) contrast(1.05) brightness(0.95)',
          },
          {
            label: 'TENANTS', headline: 'ALREADY HOME WITH US.',
            body: 'Maintenance, rent, and a direct line to management.',
            cta: 'Tenant Resources', page: 'tenants',
            photo: 'Closing Table · Hillsdale, MI',
            src: STOCK.signingDeal, filter: 'sepia(0.12) saturate(1.1) brightness(0.92)',
          },
        ]}
      />

      {/* 1.3 — numbers + the playbook in one breath */}
      <section className="band band--iron" style={{ position: 'relative' }}>
        <SurfaceSweep />
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>The Numbers Today</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['50 doors. Three states.', '$12M and counting.']} lineDelay={180} />
          </div>
          <StatsGrid rows={[
            { value: <Counter to={50} suffix="+" />, label: 'Doors Owned & Operated' },
            { value: <><span className="currency">$</span><Counter to={12} suffix="M+" /></>, label: 'Portfolio Value' },
            { value: <Counter to={3} />,             label: 'States · MI · OH · IN' },
            { value: <Counter to={200} />,           label: 'Door Goal · 2030' },
          ]} />
          <Reveal mode="fade" delay={600}>
            <p className="body-lg" style={{ maxWidth: 720, marginTop: 48 }}>
              The playbook is <strong style={{ color: '#FFC000', fontWeight: 700 }}>BRRRR</strong> — Buy → Rehab → Rent → Refinance → Repeat — run differently: bought direct from owners with no agents on either side, rebuilt by in-house crews, held under in-house management. Each completed cycle becomes its own company.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 1.4 — operator preview (his real portrait) */}
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
          <Reveal mode="fade"><Eyebrow gold>The Operator</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={['Discipline first.', 'Communities always.']} lineDelay={200} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={800}><GoldRule wide style={{ marginTop: 24, marginBottom: 24 }} /></Reveal>
          <Reveal mode="fade" delay={1000}>
            <p className="body-lg" style={{ maxWidth: 520 }}>
              Israeli special operations, then Hillsdale College, then 50 doors. The discipline carried over — and the communities he operates in are the point. Tenants he has mentored now run services across the portfolio.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={1600}>
            <div style={{ marginTop: 32 }}>
              <Btn variant="ghost" onClick={() => { onNav('meet'); window.scrollTo({ top: 0 }); }}>Meet The Operator →</Btn>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 1.5 — two real testimonials */}
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

      {/* 1.6 — pre-footer CTA */}
      <CtaBand
        eyebrow="Partner & Equity"
        hLines={['Building', 'communities,', 'profitably.']}
        src={STOCK.aerialHouse}
        filter="brightness(0.55) saturate(1.05)"
        actions={(
          <>
            <Btn variant="gold" onClick={() => { onNav('contact'); window.scrollTo({ top: 0 }); }}>Partner & Equity →</Btn>
            <p className="body-md" style={{ marginTop: 16, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>
              * Not currently accepting new inquiries.
            </p>
          </>
        )}
      />
    </div>
  );
}

window.HomePage = HomePage;
