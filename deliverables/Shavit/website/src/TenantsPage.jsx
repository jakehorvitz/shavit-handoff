/* global React, VideoHero, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, CONTACT */

/* =================================================================
   TENANTS — resources for current tenants. Minimal by design:
   who to contact, for what, and how fast to expect an answer.
   ================================================================= */

const TENANT_ROWS = [
  { lbl: 'Maintenance & repairs', desc: 'Something broken, leaking, or not working? Email with your address and a photo if you can. Urgent issues are triaged first.', cta: 'Email Maintenance', subject: 'Maintenance%20Request' },
  { lbl: 'Rent & payments',       desc: 'Questions about rent, payment methods, or your lease terms.', cta: 'Email About Rent', subject: 'Rent%20Question' },
  { lbl: 'Everything else',       desc: 'Lease renewals, move-out, or anything that does not fit a category.', cta: 'Email Management', subject: 'Tenant%20Question' },
];

function TenantsPage() {
  return (
    <div className="page-fade">
      <VideoHero
        height="80vh"
        align="center"
        eyebrow="Tenants"
        h1Lines={['Already home', 'with us.']}
        sub="Resources and a direct line for current tenants."
        videoLabel="INTERIOR. RENOVATED KITCHEN"
        videoSrc={HERO_VIDEO}
      />

      <section className="band">
        <div className="band__inner" style={{ maxWidth: 880, margin: '0 auto' }}>
          <div className="section-head">
            <Reveal mode="fade"><Eyebrow gold>How To Reach Management</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['Direct, and answered.']} />
            <Reveal mode="fade" delay={900}><GoldRule wide /></Reveal>
          </div>
          <div className="contact-rows" style={{ marginTop: 24 }}>
            {TENANT_ROWS.map((r, i) => (
              <Reveal key={i} mode="fade" delay={i * 200} className="contact-row" style={{ alignItems: 'flex-start' }}>
                <div className="lbl">{r.lbl}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
                  <p className="body-lg" style={{ margin: 0 }}>{r.desc}</p>
                  <a className="tlink tlink--gold" href={`mailto:${CONTACT.email}?subject=${r.subject}`}>{r.cta} →</a>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="body-md" style={{ textAlign: 'center', marginTop: 48, color: 'var(--color-mute-warm)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
            Phone for urgent matters: <a href={CONTACT.phoneHref} style={{ color: 'inherit' }}>{CONTACT.phone}</a>
          </p>
        </div>
      </section>

      <section className="band band--iron">
        <div className="band__inner" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Standard</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={['Managed in-house.', 'On purpose.']} lineDelay={180} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={900}>
            <p className="body-lg" style={{ marginTop: 24, color: 'rgba(255,255,255,0.72)' }}>
              Every home in the portfolio is managed by the operation&rsquo;s own team — no third-party call centers. Several of the people maintaining these homes started as tenants here.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

window.TenantsPage = TenantsPage;
