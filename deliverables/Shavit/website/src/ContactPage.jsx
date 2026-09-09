/* global React, VideoHero, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS, CONTACT */

function ContactPage() {
  return (
    <div className="page-fade">
      {/* 5.1 hero */}
      <VideoHero
        height="80vh"
        align="center"
        eyebrow="Partner & Equity"
        h1Lines={['Contact.']}
        sub="Partnerships are discussed privately, one-on-one."
        videoLabel="STILL. STUDY / DESK INTERIOR AT DUSK"
        videoSrc={HERO_VIDEO}
      />

      {/* 5.2 partner & equity statement */}
      <section className="band">
        <div className="band__inner" style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <Reveal mode="fade"><Eyebrow gold>How It Works</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Partner & equity,', 'one-on-one.']} lineDelay={200} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={1000}><GoldRule wide style={{ margin: '32px auto' }} /></Reveal>
          <Reveal mode="rise-sm" delay={1300}>
            <p className="body-lg" style={{ marginBottom: 16 }}>
              The operation grows through operator-led partnerships and equity alongside the portfolio — never through public offerings, and never through forms. Nothing on this site is an offer or a solicitation; every partnership starts and stays a private conversation.
            </p>
          </Reveal>
          <Reveal mode="rise-sm" delay={1700}>
            <p className="body-lg" style={{ color: 'rgba(255,255,255,0.72)' }}>
              Owners who want to sell a property directly — without agents on either side — are handled the same way: directly.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={2100}>
            <p className="body-md" style={{ marginTop: 40, fontSize: 13, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--color-mute-warm, rgba(255,255,255,0.5))' }}>
              * Not currently accepting new inquiries.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5.3 direct contact panel */}
      <section className="band band--iron" id="direct">
        <div className="band__inner">
          <div className="section-head">
            <Reveal mode="fade"><Eyebrow gold>Direct</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['One line in.']} />
            <Reveal mode="fade" delay={1000}><GoldRule wide /></Reveal>
          </div>
          <div className="contact-rows">
            {[
              ['Email',     CONTACT.email,        `mailto:${CONTACT.email}`,    false],
              ['Instagram', CONTACT.ig.toUpperCase(), CONTACT.igHref,           true],
              ['LinkedIn',  '/IN/SHAVITROOTMAN',  CONTACT.liHref,               true],
            ].map(([lbl, val, href, external], i) => (
              <Reveal key={lbl} mode="fade" delay={i * 200} className="contact-row">
                <div className="lbl">{lbl}</div>
                <a className="val" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{val}</a>
              </Reveal>
            ))}
          </div>
          <p className="body-md" style={{ textAlign: 'center', marginTop: 48, color: 'var(--color-mute-warm)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
            Current tenants: see the Tenants page for maintenance and management contact.
          </p>
        </div>
      </section>
    </div>
  );
}

window.ContactPage = ContactPage;
