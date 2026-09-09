/* global React, VideoHero, TriPaths, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS, CONTACT */
const { useState: useContactState } = React;

function ContactPage() {
  return (
    <div className="page-fade">
      {/* 5.1 hero */}
      <VideoHero
        height="80vh"
        align="center"
        eyebrow="Get In Touch"
        h1Lines={['Contact.']}
        sub="Three ways in."
        videoLabel="STILL. STUDY / DESK INTERIOR AT DUSK"
        videoSrc={HERO_VIDEO}
      />

      {/* 5.3 contact panel */}
      <section className="band band--iron" id="direct">
        <div className="band__inner">
          <div className="section-head">
            <Reveal mode="fade"><Eyebrow gold>Direct</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['Reach out.']} />
            <Reveal mode="fade" delay={1000}><GoldRule wide /></Reveal>
          </div>
          <div className="contact-rows">
            {[
              ['Email',     CONTACT.email,        `mailto:${CONTACT.email}`,    false],
              ['Phone',     CONTACT.phone,        CONTACT.phoneHref,            false],
            ].map(([lbl, val, href, external], i) => (
              <Reveal key={lbl} mode="fade" delay={i * 200} className="contact-row">
                <div className="lbl">{lbl}</div>
                <a className="val" href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{val}</a>
              </Reveal>
            ))}
          </div>
          <p className="body-md" style={{ textAlign: 'center', marginTop: 48, color: 'var(--color-mute-warm)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
            Reach out directly by email or phone.
          </p>
        </div>
      </section>
    </div>
  );
}

window.ContactPage = ContactPage;
