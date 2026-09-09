/* global React, CtaBand, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS */

/* =================================================================
   MEET THE OPERATOR — intentionally short, and the ONE page written
   in first person. The company pages speak in third person; here
   Shavit speaks for himself. Personal life stays on Substack.
   Sections:
     1. Hero split (identity)
     2. Owner statement — why I do what I do
     3. Philosophy centerpiece
     4. Photo band (the work)
     5. Substack pointer (one line — the longer story lives there)
     6. Pre-footer CTA
   ================================================================= */

function HeroSplit() {
  return (
    <section className="split hero--enter" style={{ minHeight: '80vh' }}>
      <div className="split__panel" style={{ justifyContent: 'center' }}>
        <Eyebrow gold>The Operator</Eyebrow>
        <LineReveal as="h1" className="h-mega" lines={['Meet the', 'operator.']} triggerOnView={false} baseDelay={600} lineDelay={200} style={{ marginTop: 24 }} />
        <Reveal mode="fade" delay={1600}><GoldRule wide style={{ marginTop: 32, marginBottom: 32 }} /></Reveal>
        <Reveal mode="fade" delay={1800}><p className="body-lg" style={{ maxWidth: 480, fontStyle: 'italic' }}>
          &ldquo;Building communities, profitably.&rdquo;
        </p></Reveal>
        <Reveal mode="fade" delay={2000}><p className="body-md" style={{ maxWidth: 480, marginTop: 12, color: 'rgba(255,255,255,0.65)' }}>
          Shavit Rootman &middot; IDF Special Operations &middot; Hillsdale College &middot; Operator
        </p></Reveal>
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

/* Owner statement — first person, why I do what I do */
function OwnerStatement() {
  const paragraphs = [
    "I served in an Israeli special operations unit before I ever touched a spreadsheet. Service taught me the three things this work requires: read the situation under pressure, trust the people next to you, and execute when execution is the only option left.",
    "In 2016 I came to Hillsdale College. Senior year, a conversation in a renovated carriage house became a thesis: housing, done with discipline and designed around the community, could transform a town like this one. I never left the idea.",
    "Today I own and operate housing across Michigan, Ohio, and Indiana. I buy overlooked properties directly from their owners, rebuild them with my own crews, and hold them for the long term. Tenants I have mentored now run cleaning, handyman, and maintenance services back across the portfolio. Some are on their way to owning homes of their own.",
    "I do this because I am passionate about the communities I operate in. There is a gap in towns like Hillsdale between the people doing well and the people struggling underneath, and housing is the bridge. The goal by 2030 is concrete: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, 25 local jobs. Profit and community are not opposites. Run right, each one funds the other.",
  ];
  return (
    <section className="band act">
      <div className="band__inner act__inner">
        <div className="act__head">
          <Reveal mode="fade" duration="1400ms"><Eyebrow gold>Owner Statement</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Why I do', 'what I do.']} lineDelay={200} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={1000}><GoldRule wide style={{ marginTop: 32 }} /></Reveal>
        </div>
        <div className="act__body">
          {paragraphs.map((p, i) => (
            <Reveal key={i} mode="rise-sm" delay={400 + i * 500}>
              <p className="act__p" style={{ marginBottom: i === paragraphs.length - 1 ? 0 : 28 }}>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeetPage({ onNav }) {
  return (
    <div className="page-fade">
      <HeroSplit />

      <OwnerStatement />

      {/* Philosophy centerpiece */}
      <section className="band">
        <div className="band__inner" style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Philosophy</Eyebrow></Reveal>
          <h2 className="h-mega" style={{ marginTop: 32, marginBottom: 32 }}>
            <LineReveal as="span" lines={['Building communities,']} baseDelay={300} style={{ display: 'block' }} />
            <LineReveal as="span" lines={['profitably.']} baseDelay={1600} style={{ display: 'block' }} />
          </h2>
          <Reveal mode="fade" delay={3100}><GoldRule wide style={{ margin: '0 auto 32px' }} /></Reveal>
          <Reveal mode="fade" delay={3400}>
            <p className="body-lg" style={{ maxWidth: 620, margin: '0 auto', color: 'rgba(255,255,255,0.72)' }}>
              Tenants become operators. Operators become owners. Pride and purpose, compounding on top of cash flow.
            </p>
          </Reveal>
        </div>
      </section>

      <Reveal as="section" mode="zoom-xl" className="photo-band" style={{ position: 'relative', width: '100%', height: 480, overflow: 'hidden' }}>
        <Placeholder
          src={SHAVIT_PHOTOS.loPresto}
          label="17 LO PRESTO AVE. HILLSDALE, MI"
          filter="contrast(1.05) brightness(0.96)"
        />
        <div className="photo-band__cap">
          <div className="photo-band__cap-line">17 Lo Presto Avenue, Hillsdale. Fully renovated, stabilized, holding.</div>
        </div>
      </Reveal>

      {/* Substack pointer — the longer story lives there, separate from the site */}
      <section className="band band--iron">
        <div className="band__inner" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Longer Story</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={['In my own words,', 'on Substack.']} lineDelay={180} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={900}>
            <p className="body-lg" style={{ marginTop: 24, color: 'rgba(255,255,255,0.72)' }}>
              The personal story — Israel, Hillsdale, the deals, the field notes — is written separately, in first person, on Substack.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={1300} style={{ marginTop: 32 }}>
            <Btn variant="ghost" href="https://shavitrootman.substack.com">Read the Substack →</Btn>
          </Reveal>
        </div>
      </section>

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

window.MeetPage = MeetPage;
