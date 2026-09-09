/* global React, VideoHero, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, CONTACT */

/* =================================================================
   OPENINGS — current and upcoming availability across the portfolio.
   Deliberately minimal: markets + how to ask. Listings rotate too
   fast for a static site, so the page routes people to one inbox.
   ================================================================= */

const OPENING_MARKETS = [
  { tag: 'MICHIGAN', name: 'Hillsdale & Jackson County', desc: 'Long-term single-family and small multi-family homes. Renovated top to bottom before move-in.', src: SHAVIT_PHOTOS.loPresto, filter: 'saturate(1) contrast(1.05)', photo: 'Hillsdale Home' },
  { tag: 'OHIO',     name: 'Cleveland',                  desc: 'Furnished mid-term units, 30–180 day stays. Near the hospital corridor and universities.',      src: STOCK.brickFacade, filter: 'sepia(0.12) saturate(1.05) contrast(1.05)', photo: 'Cleveland Brick' },
  { tag: 'INDIANA',  name: 'South Bend',                 desc: 'Fully rebuilt long-term homes for working families.',                                            src: SHAVIT_PHOTOS.secondChance, filter: 'saturate(1) contrast(1.05)', photo: 'South Bend Home' },
];

function OpeningsPage() {
  return (
    <div className="page-fade">
      <VideoHero
        height="80vh"
        align="center"
        eyebrow="Openings"
        h1Lines={['Available homes.']}
        sub="Current and upcoming availability across Michigan, Ohio, and Indiana."
        videoLabel="STREETSCAPE. HILLSDALE, MI"
        videoSrc={HERO_VIDEO}
      />

      <section className="band band__inner" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div className="section-head section-head--left" style={{ alignItems: 'flex-start' }}>
          <Reveal mode="fade"><Eyebrow gold>The Markets</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Three states.', 'One standard.']} lineDelay={200} />
          <Reveal mode="fade" delay={800}>
            <p className="body-lg" style={{ maxWidth: 640, marginTop: 16 }}>
              Every home is renovated before it is rented — kitchens, baths, mechanicals — and managed in-house after. Availability moves quickly and is handled by email.
            </p>
          </Reveal>
        </div>
        <div className="cards cards-3" style={{ borderTop: '1px solid #202020', borderBottom: '1px solid #202020' }}>
          {OPENING_MARKETS.map((c, i) => (
            <Reveal key={i} as="div" mode="rise" delay={i * 200} className="ccard">
              <div className="ccard__media">
                <div className="ccard__photo-zoom"><Placeholder label={c.photo} src={c.src} filter={c.filter} kind="photo" /></div>
              </div>
              <div className="ccard__body">
                <div className="ccard__tag">{c.tag}</div>
                <h3 className="ccard__name">{c.name}</h3>
                <p className="ccard__desc">{c.desc}</p>
              </div>
              <span className="ccard__rule" aria-hidden="true" />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band band--iron">
        <div className="band__inner" style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>Ask About Availability</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-lg" lines={['One email. Real answer.']} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={800}>
            <p className="body-lg" style={{ marginTop: 24, color: 'rgba(255,255,255,0.72)' }}>
              Send the market you&rsquo;re interested in, your timeline, and who&rsquo;s moving in. Management replies directly.
            </p>
          </Reveal>
          <Reveal mode="fade" delay={1200} style={{ marginTop: 32 }}>
            <Btn variant="gold" href={`mailto:${CONTACT.email}?subject=Openings%20Inquiry`}>Email About Openings →</Btn>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

window.OpeningsPage = OpeningsPage;
