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

      {/* 5.2 three-path band */}
      <section className="band band--tight" style={{ paddingBottom: 0 }}>
        <div className="band__inner section-head" style={{ marginBottom: 48 }}>
          <Reveal mode="fade"><Eyebrow gold>How To Begin</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Pick a door.']} />
        </div>
      </section>
      <TriPaths
        items={[
          {
            label: 'WORK WITH ME', headline: 'START THE CONVERSATION.',
            body: 'For aspiring investors, buyers, and sellers ready to talk specifics.',
            cta: 'Open Form', formType: "work", goldCta: true,
            photo: 'OFFICE. INVESTOR CONVERSATION',
            src: STOCK.meeting, filter: 'brightness(0.85) saturate(0.95) contrast(1.05)',
          },
          {
            label: 'INVEST WITH ME', headline: 'DEPLOY CAPITAL.',
            body: 'For accredited investors evaluating current opportunities.',
            cta: 'Open Form', formType: "invest", goldCta: true,
            photo: 'PROPERTY. STABILIZED INVESTOR ASSET',
            src: STOCK.luxuryDusk, filter: 'sepia(0.15) saturate(1.1) brightness(0.9)',
          },
          {
            label: 'DIRECT', headline: 'EMAIL OR CALL.',
            body: "When you'd rather skip the form.",
            cta: 'Reveal Contact',
            href: '#direct',
            photo: 'DESK. DIRECT LINE',
            src: STOCK.studyDesk, filter: 'brightness(0.8) saturate(0.9) contrast(1.05)',
          },
          {
            label: 'FOLLOW', headline: 'STAY IN THE LOOP.',
            body: 'Property tours, market notes, and operator commentary on Instagram and LinkedIn.',
            cta: '@SHAVITNESS', href: CONTACT.igHref,
            photo: 'STREETSCAPE. ON LOCATION',
            src: STOCK.brickFacade || STOCK.cityDusk, filter: 'grayscale(0.3) contrast(1.1) brightness(0.85)',
          },
        ]}
      />

      {/* 5.3 contact panel */}
      <section className="band band--iron" id="direct">
        <div className="band__inner">
          <div className="section-head">
            <Reveal mode="fade"><Eyebrow gold>Direct</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['Skip the form.']} />
            <Reveal mode="fade" delay={1000}><GoldRule wide /></Reveal>
          </div>
          <div className="contact-rows">
            {[
              ['Email',     CONTACT.email,        `mailto:${CONTACT.email}`,    false],
              ['Phone',     CONTACT.phone,        CONTACT.phoneHref,            false],
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
            No native contact form. Google Forms are the only intake.
          </p>
        </div>
      </section>
    </div>
  );
}

window.ContactPage = ContactPage;
