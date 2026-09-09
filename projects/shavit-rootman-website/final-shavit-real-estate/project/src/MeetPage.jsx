/* global React, CtaBand, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS */

/* =================================================================
   Meet Shavit — concise operator profile.
   Agency first. Brief background. Endorsements. CTA.
   ================================================================= */

function HeroSplit() {
  return (
    <section className="split hero--enter" style={{ minHeight: '80vh' }}>
      <div className="split__panel" style={{ justifyContent: 'center' }}>
        <Eyebrow gold>The Operator</Eyebrow>
        <LineReveal as="h1" className="h-mega" lines={['Meet Shavit', 'Rootman.']} triggerOnView={false} baseDelay={600} lineDelay={200} style={{ marginTop: 24 }} />
        <Reveal mode="fade" delay={1600}><GoldRule wide style={{ marginTop: 32, marginBottom: 32 }} /></Reveal>
        <Reveal mode="fade" delay={1800}><p className="body-lg" style={{ maxWidth: 480, fontStyle: 'italic' }}>
          &ldquo;Community impact, made profitable.&rdquo;
        </p></Reveal>
        <Reveal mode="fade" delay={2000}><p className="body-md" style={{ maxWidth: 480, marginTop: 12, color: 'rgba(255,255,255,0.65)' }}>
          50 doors across MI, OH &amp; IN &middot; Founder, Charger Property Management
        </p></Reveal>
        <Reveal mode="fade" delay={2200} style={{ marginTop: 32 }}>
          <Btn formType="work" variant="ghost">Work With Me →</Btn>
        </Reveal>
      </div>
      <Reveal mode="zoom-lg" className="split__media ph-vignette" style={{ minHeight: 640, position: 'relative' }}>
        <Placeholder
          src={SHAVIT_PHOTOS.portraitLI}
          alt="Shavit Rootman"
          filter="contrast(1.06) saturate(0.95) brightness(0.95)"
          portrait
        />
      </Reveal>
    </section>
  );
}

function Bio() {
  return (
    <section className="band act">
      <div className="band__inner act__inner">
        <div className="act__head">
          <Reveal mode="fade" duration="1400ms"><Eyebrow gold>The Background</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Operator first.']} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={600}><GoldRule wide style={{ marginTop: 32 }} /></Reveal>
        </div>
        <div className="act__body">
          <Reveal mode="rise-sm" delay={400}>
            <p className="act__p" style={{ marginBottom: 28 }}>
              I invest in overlooked housing across Midwest communities and turn it into long-term homes for families. Through Charger Property Management and a network of real estate entities, I acquire, renovate, and stabilize properties using the BRRRR strategy. Today the portfolio runs 50 doors across Michigan, Ohio, and Indiana.
            </p>
          </Reveal>
          <Reveal mode="rise-sm" delay={1100}>
            <p className="act__p">
              Originally from Israel, I served in the Israeli Defense Forces before studying at Hillsdale College. That background shaped how I operate today: discipline, resilience, and the ability to execute long-term missions under pressure. <strong>The work is about more than property. It is about building communities and creating opportunity where others see challenges.</strong>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function MeetPage() {
  return (
    <div className="page-fade">
      <HeroSplit />

      <Bio />

      {/* Philosophy centerpiece — the brand line */}
      <section className="band band--iron">
        <div className="band__inner" style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Philosophy</Eyebrow></Reveal>
          <h2 className="h-mega" style={{ marginTop: 32, marginBottom: 32 }}>
            <LineReveal as="span" lines={['Community impact,']} baseDelay={300} style={{ display: 'block' }} />
            <LineReveal as="span" lines={['made profitable.']} baseDelay={1600} style={{ display: 'block' }} />
          </h2>
          <Reveal mode="fade" delay={3100}><GoldRule wide style={{ margin: '0 auto 32px' }} /></Reveal>
          <Reveal mode="fade" delay={3400}>
            <p className="body-lg" style={{ maxWidth: 620, margin: '0 auto', color: 'rgba(255,255,255,0.72)' }}>
              Improving homes. Building communities. Real estate is the bridge. Tenants become operators. Operators become owners. Pride and purpose, compounding on top of cash flow.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Endorsements — operator-relevant only */}
      <section className="band" style={{ position: 'relative' }}>
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>On The Record</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['Endorsements.']} />
          </div>
          <div className="endorse-grid">
            <Reveal as="a" mode="rise-sm" className="endorse endorse--with-photo" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Letter of Endorsement from Senator Dan Roberts. open Shavit's LinkedIn">
              <div className="endorse__photo">
                <img src={SHAVIT_PHOTOS.senatorLetter} alt="Letter from Senator Dan Roberts on Alabama State Senate letterhead" />
              </div>
              <div className="endorse__body-wrap">
                <div className="endorse__lbl">Letter of Endorsement</div>
                <h3 className="endorse__name">Senator Dan Roberts</h3>
                <div className="endorse__role">Alabama State Senate</div>
                <p className="endorse__body">A personal letter on State Senate letterhead. The kind of relationship the operating discipline earns over time.</p>
                <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
              </div>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={150} className="endorse" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Robert Norton. mentor. open Shavit's LinkedIn">
              <div className="endorse__lbl">Mentor</div>
              <h3 className="endorse__name">Robert Norton</h3>
              <div className="endorse__role">Hillsdale, MI</div>
              <p className="endorse__body">A deep connection formed early on. Mr. Norton&rsquo;s wisdom and vision ignited the flame for the real estate mission.</p>
              <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={300} className="endorse" href="https://shavitrootman.substack.com" target="_blank" rel="noopener noreferrer" aria-label="shavitrootman.substack.com. open Shavit's Substack">
              <div className="endorse__lbl">Writing</div>
              <h3 className="endorse__name">shavitrootman.substack.com</h3>
              <div className="endorse__role">Operator notes &middot; deals &middot; the field</div>
              <p className="endorse__body">First-person writing from inside the operating layer. Deal mechanics, what worked, what didn&rsquo;t, and what the next move is.</p>
              <span className="endorse__cta" aria-hidden="true">Read the Substack →</span>
            </Reveal>
          </div>
        </div>
      </section>

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

window.MeetPage = MeetPage;
