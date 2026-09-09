/* global React, CtaBand, Btn, Eyebrow, GoldRule, Placeholder, Reveal, LineReveal, SHAVIT_PHOTOS, STOCK, URLS */

/* =================================================================
   Meet Shavit. expanded narrative integrating Substack content
   Sections (in order):
     1. Hero split (identity statement)
     2. Three Worlds strip (Israel / Hillsdale / Santa Barbara)
     3. Act I. Israel & Service (with two-generations photo)
     4. Pull quote. "The portfolio runs without me when I have to go"
     5. Act II. Arrival at Hillsdale (with campus photo + org chem photo)
     6. Hillsdale market trends sidebar
     7. Carriage House Turning Point (full-bleed moment)
     8. Why Hillsdale. Oct 7 + Tikva mention (with two-gen + campus protest photo)
     9. Act III. Community Impact Made Profitable
    10. Substack Writing strip. 3 posts with photos
    11. Endorsements
    12. Pre-footer CTA
   ================================================================= */

function HeroSplit() {
  return (
    <section className="split hero--enter" style={{ minHeight: '80vh' }}>
      <div className="split__panel" style={{ justifyContent: 'center' }}>
        <Eyebrow gold>The First Israeli at Hillsdale</Eyebrow>
        <LineReveal as="h1" className="h-mega" lines={['Meet Shavit', 'Rootman.']} triggerOnView={false} baseDelay={600} lineDelay={200} style={{ marginTop: 24 }} />
        <Reveal mode="fade" delay={1600}><GoldRule wide style={{ marginTop: 32, marginBottom: 32 }} /></Reveal>
        <Reveal mode="fade" delay={1800}><p className="body-lg" style={{ maxWidth: 480, fontStyle: 'italic' }}>
          &ldquo;Community impact, made profitable.&rdquo;
        </p></Reveal>
        <Reveal mode="fade" delay={2000}><p className="body-md" style={{ maxWidth: 480, marginTop: 12, color: 'rgba(255,255,255,0.65)' }}>
          IDF Special Forces &middot; First Israeli at Hillsdale College, 2016 &middot; Santa Barbara &middot; Hillsdale &middot; Israel
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

/* Three Worlds — a horizontal strip naming the three cities he splits time between */
function ThreeWorlds() {
  const cities = [
    { name: 'Israel',           sub: 'Where it started. Where I return when called.', src: SHAVIT_PHOTOS.ssTwoGen,     filter: 'contrast(1.05) brightness(0.92) saturate(0.95)', alt: 'IDF service in Israel' },
    { name: 'Hillsdale, MI',    sub: 'Where the College is. Where the portfolio lives.', src: SHAVIT_PHOTOS.ssHillsdale, filter: 'contrast(1.04) brightness(0.96)',                  alt: 'Hillsdale College campus' },
    { name: 'Santa Barbara, CA',sub: 'Where the operating layer breathes.',           src: SHAVIT_PHOTOS.architecture, filter: 'contrast(1.05) brightness(0.92) saturate(0.95)', alt: 'Coastal California architecture' },
  ];
  return (
    <section className="three-worlds">
      <div className="band__inner">
        <Reveal mode="fade" className="three-worlds__lead">
          <span className="eyebrow eyebrow--gold">Three Worlds, One Operator</span>
        </Reveal>
        <div className="three-worlds__grid">
          {cities.map((c, i) => (
            <Reveal as="div" key={i} mode="rise-sm" delay={i * 150} className="three-worlds__cell">
              <div className="three-worlds__media">
                <img src={c.src} alt={c.alt} referrerPolicy="no-referrer" loading="lazy" style={{ filter: c.filter }} />
              </div>
              <div className="three-worlds__city">{c.name}</div>
              <div className="three-worlds__sub">{c.sub}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Act({ chapter, h, paragraphs, photo, photoAlt, photoCaption }) {
  const lines = h.split('<br/>');
  return (
    <section className="band act">
      <div className="band__inner act__inner">
        <div className="act__head">
          <Reveal mode="fade" duration="1400ms"><Eyebrow gold>{chapter}</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={lines} lineDelay={200} style={{ marginTop: 16 }} />
          <Reveal mode="fade" delay={lines.length * 200 + 600}><GoldRule wide style={{ marginTop: 32 }} /></Reveal>
          {photo && (
            <Reveal mode="zoom-lg" delay={lines.length * 200 + 800} className="act__photo">
              <figure>
                <img src={photo} alt={photoAlt || ''} referrerPolicy="no-referrer" loading="lazy" />
                {photoCaption && <figcaption>{photoCaption}</figcaption>}
              </figure>
            </Reveal>
          )}
        </div>
        <div className="act__body">
          {paragraphs.map((p, i) => (
            <Reveal key={i} mode="rise-sm" delay={400 + i * 700}>
              <p className="act__p" style={{ marginBottom: i === paragraphs.length - 1 ? 0 : 28 }} dangerouslySetInnerHTML={{ __html: p }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhotoBand({ label, portrait, filter, src, caption, sourceLabel, fit, objectPosition }) {
  return (
    <Reveal as="section" mode="zoom-xl" className="photo-band" style={{ position: 'relative', width: '100%', height: 480, overflow: 'hidden' }}>
      <Placeholder src={src} filter={filter} label={label} portrait={portrait} fit={fit} objectPosition={objectPosition} />
      {(caption || sourceLabel) && (
        <div className="photo-band__cap">
          {caption && <div className="photo-band__cap-line">{caption}</div>}
          {sourceLabel && <div className="photo-band__cap-src">{sourceLabel}</div>}
        </div>
      )}
    </Reveal>
  );
}

/* Pull quote — a standalone Substack pull, centered, with attribution */
function PullQuote({ quote, source, dateLine, bgImage }) {
  return (
    <section className="pullq band" style={bgImage ? { '--pullq-bg': `url(${bgImage})` } : undefined}>
      {bgImage && <div className="pullq__bg" aria-hidden="true" />}
      <div className="band__inner pullq__inner">
        <Reveal mode="fade">
          <svg className="pullq__mark" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M14 28 L14 18 L24 18 L24 28 L18 36 M30 28 L30 18 L40 18 L40 28 L34 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Reveal>
        <LineReveal as="blockquote" className="pullq__quote" lines={quote} lineDelay={200} />
        <Reveal mode="fade" delay={quote.length * 200 + 400} className="pullq__attr">
          <span className="pullq__source">{source}</span>
          {dateLine && <span className="pullq__date">{dateLine}</span>}
        </Reveal>
      </div>
    </section>
  );
}

/* Turning Point — full-bleed cinematic moment about the carriage house */
function TurningPoint() {
  return (
    <section className="turning">
      <div className="turning__bg" aria-hidden="true" />
      <div className="band__inner turning__inner">
        <Reveal mode="fade"><Eyebrow gold>The Turning Point</Eyebrow></Reveal>
        <LineReveal as="h2" className="h-xxl turning__h" lines={['Senior year, 2020.', 'The carriage house.']} lineDelay={250} />
        <Reveal mode="fade" delay={1400}><GoldRule wide style={{ marginTop: 24, marginBottom: 32 }} /></Reveal>
        <div className="turning__grid">
          <Reveal mode="rise-sm" delay={1600}>
            <p className="body-lg">
              I moved out of the dorms and into a newly renovated carriage house. A conversation with my landlord changed the trajectory. Creative housing solutions, designed by and for the community, could transform Hillsdale.
            </p>
          </Reveal>
          <Reveal mode="rise-sm" delay={2200}>
            <p className="body-lg">
              Not just cash flow potential. An opportunity to elevate the standard of housing for students, faculty, and locals alike, in a town long dominated by absentee owners who did not understand the tenants they housed.
            </p>
          </Reveal>
          <Reveal mode="rise-sm" delay={2800}>
            <p className="body-lg">
              <strong>Robert Norton</strong>, a mentor I met that same year, fanned that flame into a mission. The thesis became simple. The same operating discipline that worked in special operations worked in housing. Probably better.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Market trends — Hillsdale 2016–2024 stat callout */
function MarketTrends() {
  return (
    <section className="band band--iron">
      <div className="band__inner">
        <div className="market__grid">
          <div className="market__copy">
            <Reveal mode="fade"><Eyebrow gold>Why Hillsdale, by the numbers</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-xl" lines={['The market saw it.', 'I got there first.']} lineDelay={180} />
            <Reveal mode="fade" delay={900}>
              <p className="body-lg" style={{ marginTop: 24 }}>
                Hillsdale home values have appreciated meaningfully since 2016. The same year I arrived as the College&rsquo;s first Israeli student. By the time the trend was obvious from the outside, the operating layer was already in place from the inside.
              </p>
            </Reveal>
            <Reveal mode="fade" delay={1500} style={{ marginTop: 16 }}>
              <p className="body-md" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, letterSpacing: 0.5 }}>
                Source chart: Hillsdale, MI home value trend, 2016&ndash;2024.
              </p>
            </Reveal>
          </div>
          <Reveal mode="zoom" className="market__chart">
            <img
              src={SHAVIT_PHOTOS.ssMarketTrends}
              alt="Chart of Hillsdale, MI market trends and home values, 2016 through 2024"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* Why Hillsdale — the Oct 7 / Tikva block with imagery */
function WhyHillsdale() {
  return (
    <section className="band whyh">
      <div className="band__inner whyh__inner">
        <div className="whyh__head">
          <Reveal mode="fade"><Eyebrow gold>Why Hillsdale</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['Values aligned.', 'On purpose.']} lineDelay={200} />
        </div>
        <div className="whyh__grid">
          <div className="whyh__copy">
            <Reveal mode="rise-sm" delay={400}>
              <p className="body-lg">
                Hillsdale&rsquo;s core principles echoed the values from my Israeli upbringing and military service. Strength in the face of challenges. The pursuit of the Aristotelian Good. The embodiment of <em>Arete</em>, virtue. The fit was never accidental.
              </p>
            </Reveal>
            <Reveal mode="rise-sm" delay={1100}>
              <p className="body-lg">
                After October 7, the case for Hillsdale sharpened. While campus protests at Harvard, Columbia, and other Ivy League schools turned hostile, Hillsdale remained a haven where conservative-leaning American Jews could think freely. It is a campus that takes ideas seriously rather than treating them as a problem to be managed.
              </p>
            </Reveal>
            <Reveal mode="rise-sm" delay={1800}>
              <p className="body-lg">
                I am helping support <strong>Tikva Hillsdale</strong>. The name <em>Tikva</em> means &ldquo;hope&rdquo; in Hebrew. A new academic institution for the Jewish community at Hillsdale, in ongoing conversation with President Dr. Larry Arnn.
              </p>
            </Reveal>
          </div>
          <div className="whyh__media">
            <Reveal mode="zoom-lg">
              <figure className="whyh__fig">
                <img
                  src={SHAVIT_PHOTOS.ssTwoGen}
                  alt="Shavit standing alongside an older fellow IDF soldier in uniform with the West Bank visible behind them"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <figcaption>Two generations apart, standing side-by-side. Behind: the West Bank.</figcaption>
              </figure>
            </Reveal>
            <Reveal mode="zoom-lg" delay={300}>
              <figure className="whyh__fig">
                <img
                  src={SHAVIT_PHOTOS.ssCampusProtest}
                  alt="Anti-Israel protesters on Ivy League campuses, including a burning American flag near Columbia University"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <figcaption>The Ivy League, after October 7. The reason Hillsdale matters more.</figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Substack Writing strip — 3 posts with photos linking to Substack */
function SubstackStrip() {
  const POSTS = [
    {
      date: 'Jan 30, 2024',
      title: 'From Special Forces in Israel to Pursuing Truth in Hillsdale',
      excerpt: "Out of 12 students in my SAT prep class, only my friend and I went on to bachelor's degrees in America. I chose Hillsdale over the Ivy League. And pushed through Organic Chemistry my first year.",
      src: SHAVIT_PHOTOS.ssOrgChem,
      alt: "Shavit in a Hillsdale College classroom during his first year",
    },
    {
      date: 'Feb 15, 2024',
      title: 'Pursuing Truth in Hillsdale: the Combat Begins',
      excerpt: "International Club booth at orientation week. The Israeli flag, despite the lack of Israeli students. By senior year, the carriage house conversation turned a thesis into a business.",
      src: SHAVIT_PHOTOS.ssClubBooth,
      alt: "International Club orientation booth at Hillsdale with the Israeli flag among other national flags",
    },
    {
      date: 'May 14, 2024',
      title: 'October 7th Revelations: Embracing Israeli Values at Hillsdale College',
      excerpt: "Two return deployments after October 7. A renewed sense of why Hillsdale matters. And why building infrastructure that runs without me is the work.",
      src: SHAVIT_PHOTOS.ssThankful,
      alt: "A note of thanks to Shavit's supporters, hand-written and shared on Substack",
    },
  ];

  return (
    <section className="band substrip" style={{ position: 'relative' }}>
      <div className="band__inner">
        <div className="section-head section-head--left">
          <Reveal mode="fade"><Eyebrow gold>Read In His Own Words</Eyebrow></Reveal>
          <LineReveal as="h2" className="h-xl" lines={['The Substack.']} />
          <Reveal mode="fade" delay={700}>
            <p className="body-lg" style={{ maxWidth: 640, marginTop: 16 }}>
              First-person essays from inside the operating layer. the story, the deals, the field reports. The full archive is on Substack.
            </p>
          </Reveal>
        </div>
        <div className="substrip__grid">
          {POSTS.map((p, i) => (
            <Reveal
              as="a"
              key={i}
              mode="rise"
              delay={i * 150}
              href="https://shavitrootman.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="substrip__card"
              aria-label={`${p.title}. open on Substack`}
            >
              <div className="substrip__media">
                <img src={p.src} alt={p.alt} referrerPolicy="no-referrer" loading="lazy" />
              </div>
              <div className="substrip__body">
                <div className="substrip__date">{p.date}</div>
                <h3 className="substrip__title">{p.title}</h3>
                <p className="substrip__excerpt">{p.excerpt}</p>
                <span className="substrip__cta">Read on Substack →</span>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal mode="fade" delay={800} style={{ textAlign: 'center', marginTop: 48 }}>
          <a
            className="btn-base btn-ghost"
            href="https://shavitrootman.substack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the full Substack →
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function MeetPage() {
  return (
    <div className="page-fade">
      <HeroSplit />

      <ThreeWorlds />

      {/* ============================================================
          ACT I. Israel & Service
          ============================================================ */}
      <Act
        chapter="Act I. Israel."
        h="Service.<br/>Twice over."
        photo={SHAVIT_PHOTOS.israelFlag}
        photoAlt="Israeli flag during IDF service"
        photoCaption="On post. IDF Special Operations."
        paragraphs={[
          "Before the spreadsheets and the closings, there was the desert. I served in Duvdevan, an Israeli Defense Forces special operations unit, running counter-terrorism in Judea and Samaria. Service was not abstract in my family. My mother lost her only brother in the IDF. He was a tank commander.",
          "Three years in Duvdevan taught me three things real estate would later require. How to read a situation under pressure. How to trust the people next to you. How to execute when execution is the only option left. Discipline, resilience, the ability to run a long mission under uncertainty.",
          "After October 7, I returned for two more deployments. One immediately after the attack, and another the following April. In Hebrew we call it <em>miluim</em>: when there is a calling, you show up. The portfolio runs without me when I have to go. <strong>That is the point of building infrastructure.</strong>",
        ]}
      />

      <PullQuote
        quote={['The portfolio runs', 'without me when', 'I have to go.']}
        source="Shavit Rootman"
        dateLine="On returning to the IDF after October 7 · shavitrootman.substack.com"
        bgImage={SHAVIT_PHOTOS.ssTwoGen}
      />

      {/* ============================================================
          ACT II. Arrival at Hillsdale
          ============================================================ */}
      <Act
        chapter="Act II. Hillsdale."
        h="The first Israeli<br/>at Hillsdale College."
        paragraphs={[
          "In 2016 I became the first Israeli student to attend Hillsdale College. A small classical college in southern Michigan, known for taking ideas seriously. I chose it over the Ivy League. Out of 12 students in my SAT prep class back in Israel, only one friend and I went on to bachelor's degrees in America.",
          "I lived in the dorms at 26, my junior year. I financed every semester through grants, scholarships, and merit-based aid, with no burden on my family back home. I studied a major, two minors, and the College's classical core curriculum.",
          "I pushed through Organic Chemistry my first year. I tried to honor the principles the College stood for. Strength in the face of challenges. The pursuit of the Aristotelian Good. The embodiment of <em>Arete</em>. They echoed the values from my Israeli upbringing and military service.",
        ]}
      />

      <PhotoBand
        src={SHAVIT_PHOTOS.ssHillsdale}
        label="HILLSDALE COLLEGE. FIRST TOUCHPOINT IN THE USA"
        filter="contrast(1.04) brightness(0.95)"
        caption="Hillsdale College: my first touchpoint in the USA."
        sourceLabel="From the Substack · Jan 30, 2024"
      />

      <MarketTrends />

      <TurningPoint />

      {/* ============================================================
          WHY HILLSDALE. Oct 7 + Tikva
          ============================================================ */}
      <WhyHillsdale />

      <PullQuote
        quote={['Strength embracing', 'challenges.', 'The pursuit of Arete.']}
        source="On the Hillsdale principles he was drawn to"
        dateLine="shavitrootman.substack.com · May 14, 2024"
        bgImage={SHAVIT_PHOTOS.ssHillsdale}
      />

      {/* ============================================================
          ACT III. Community Impact Made Profitable
          ============================================================ */}
      <Act
        chapter="Act III. Community."
        h="Community impact,<br/>made profitable."
        paragraphs={[
          "The first property was a proof of concept. The second was a system. By the fifth, it was infrastructure. And the infrastructure was the real asset. Today I operate 10+ real estate entities across Michigan, Ohio, and Indiana, running the BRRRR playbook through Charger Property Management.",
          "But the portfolio is only half of it. Families I have mentored are now tenants who provide cleaning, handyman, lawn-mowing, and property management services across the portfolio. I attend city council meetings. I meet with the mayor. I mentor tenants and locals on launching their own businesses.",
          "There is a stark gap in Hillsdale between the academic community and locals struggling beneath the poverty line, with substance abuse alongside it. My mission is to unite those layers under a common sense of pride and purpose. The goal by 2030: 100 homes revitalized in Hillsdale, 200 doors across the Midwest, 30 jobs created locally. <strong>Just getting started.</strong>",
        ]}
      />

      <PhotoBand
        src={SHAVIT_PHOTOS.loPresto}
        label="17 LO PRESTO AVE. HILLSDALE, MI"
        filter="contrast(1.05) brightness(0.96)"
        caption="17 Lo Presto Avenue, Hillsdale. fully renovated, stabilized, holding."
      />

      {/* ============================================================
          PHILOSOPHY (centerpiece)
          ============================================================ */}
      <section className="band">
        <div className="band__inner" style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
          <Reveal mode="fade"><Eyebrow gold>The Philosophy</Eyebrow></Reveal>
          <h2 className="h-mega" style={{ marginTop: 32, marginBottom: 32 }}>
            <LineReveal as="span" lines={['Community impact,']} baseDelay={300} style={{ display: 'block' }} />
            <LineReveal as="span" lines={['made profitable.']} baseDelay={1600} style={{ display: 'block' }} />
          </h2>
          <Reveal mode="fade" delay={3100}><GoldRule wide style={{ margin: '0 auto 32px' }} /></Reveal>
          <Reveal mode="fade" delay={3400}>
            <p className="body-lg" style={{ maxWidth: 620, margin: '0 auto', color: 'rgba(255,255,255,0.72)' }}>
              Hillsdale has a stark gap between the academic community and the locals struggling underneath. Real estate is the bridge. Tenants become operators. Operators become owners. Pride and purpose, compounding on top of cash flow.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================
          SUBSTACK STRIP. the three posts
          ============================================================ */}
      <SubstackStrip />

      {/* ============================================================
          ENDORSEMENTS
          ============================================================ */}
      <section className="band band--iron" style={{ position: 'relative' }}>
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>Endorsements & Community</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['On the record.']} />
          </div>
          <div className="endorse-grid">
            <Reveal as="a" mode="rise-sm" className="endorse endorse--with-photo" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Letter of Endorsement from Senator Dan Roberts. open Shavit's LinkedIn">
              <div className="endorse__photo">
                <img src={SHAVIT_PHOTOS.senatorLetter} alt="Letter from Senator Dan Roberts on Alabama State Senate letterhead" />
              </div>
              <div className="endorse__body-wrap">
                <div className="endorse__lbl">Letter of Endorsement</div>
                <h3 className="endorse__name">Senator Dan Roberts</h3>
                <div className="endorse__role">Alabama State Senate · Hillsdale College alumnus</div>
                <p className="endorse__body">A personal letter on State Senate letterhead, following our meeting at Hillsdale. The kind of relationship the operating discipline earns over time.</p>
                <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
              </div>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={150} className="endorse endorse--with-photo" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Birthright Israel. Speaking and Philanthropy. open Shavit's LinkedIn">
              <div className="endorse__photo">
                <img src={SHAVIT_PHOTOS.birthrightLA} alt="Shavit speaking at the Birthright Israel LA Gala" />
              </div>
              <div className="endorse__body-wrap">
                <div className="endorse__lbl">Speaking &amp; Philanthropy</div>
                <h3 className="endorse__name">Birthright Israel Foundation</h3>
                <div className="endorse__role">LA Gala &middot; $34M raised &middot; Palm Springs community event</div>
                <p className="endorse__body">2013, Mount Herzl. I shared the story of my uncle &mdash; my mother&rsquo;s only brother, a tank commander killed in service. An American on the trip, Antonio, knelt and buried three name tags of brothers-in-arms he lost in the Middle East. He is still a friend. That is what Birthright is: a calling. <em>Miluim</em>. When there is a calling, you show up.</p>
                <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
              </div>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={300} className="endorse endorse--with-photo" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Tikva Hillsdale. community impact. open Shavit's LinkedIn">
              <div className="endorse__photo">
                <img src={SHAVIT_PHOTOS.architecture} alt="Hillsdale College campus architecture" />
              </div>
              <div className="endorse__body-wrap">
                <div className="endorse__lbl">Community Impact</div>
                <h3 className="endorse__name">Tikva Hillsdale</h3>
                <div className="endorse__role">In conversation with President Dr. Larry Arnn</div>
                <p className="endorse__body">A new academic institution for the Jewish community at Hillsdale. <em>Tikva</em> means &ldquo;hope&rdquo; in Hebrew.</p>
                <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
              </div>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={450} className="endorse" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Robert Norton. mentor. open Shavit's LinkedIn">
              <div className="endorse__lbl">Mentor</div>
              <h3 className="endorse__name">Robert Norton</h3>
              <div className="endorse__role">Hillsdale, MI</div>
              <p className="endorse__body">A deep connection formed senior year. Mr. Norton&rsquo;s wisdom and vision ignited the flame for the real estate mission.</p>
              <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={600} className="endorse" href="https://www.linkedin.com/in/shavitrootman/" target="_blank" rel="noopener noreferrer" aria-label="Hillsdale College education. open Shavit's LinkedIn">
              <div className="endorse__lbl">Education</div>
              <h3 className="endorse__name">Hillsdale College</h3>
              <div className="endorse__role">First Israeli student, 2016 &middot; Classical liberal arts</div>
              <p className="endorse__body">Strength in the face of challenges. The pursuit of the Aristotelian Good. <em>Arete</em>. The principles that ground the operating layer.</p>
              <span className="endorse__cta endorse__cta--arrow" aria-hidden="true">Read on LinkedIn →</span>
            </Reveal>
            <Reveal as="a" mode="rise-sm" delay={750} className="endorse" href="https://shavitrootman.substack.com" target="_blank" rel="noopener noreferrer" aria-label="shavitrootman.substack.com. open Shavit's Substack">
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

window.MeetPage = MeetPage;
