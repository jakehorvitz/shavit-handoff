/* global React, VideoHero, StatsGrid, CtaBand, Btn, Eyebrow, GoldRule, Placeholder, Counter, Reveal, LineReveal, ScrollLinkedColor, SHAVIT_PHOTOS, STOCK, URLS */

const CASES = [
  {
    flip: false,
    eyebrow: 'Hillsdale, MI · BRRRR Transformation',
    h: '17 Lo Presto Ave.\nFull rebuild.',
    photo: "EXTERIOR. 17 LO PRESTO AVENUE, HILLSDALE",
    src: SHAVIT_PHOTOS.loPresto, filter: 'saturate(1.02) contrast(1.05)',
    outcomes: [
      ['Property',  '17 Lo Presto Avenue, Hillsdale, MI'],
      ['Strategy',  'Acquire · Rehab · Rent · Refinance · Repeat'],
      ['Status',    'Fully renovated · Stabilized · Holding'],
    ],
    body: "This was the flagship. A property two blocks from Hillsdale College, acquired, gutted, and rebuilt top to bottom. Refinished hardwood. Full bath remodel with subway tile. New kitchen and laundry. Fresh exterior. Tracked weekly on the execution sheet across every trade until it was done. Now contributing long-term housing back to the community.",
    panelIron: false,
    avatar: null,
    featured: true,
  },
  {
    flip: true,
    eyebrow: 'Hillsdale, MI · Package Acquisition',
    h: 'Three homes,\nunder $300K, one close.',
    photo: "EXTERIOR. PACKAGE OF THREE HILLSDALE HOMES",
    src: SHAVIT_PHOTOS.ssThreeHomes, filter: 'contrast(1.05) brightness(0.96)',
    outcomes: [
      ['Acquisition', 'Three single-family homes, simultaneously'],
      ['Negotiation', 'Under $300,000. package deal pricing'],
      ['Structure',   'Renovations completed in-house'],
    ],
    body: "One of our entities acquired three single-family homes at once. We negotiated under $300,000 by offering a package deal, closing on more than one property in a single transaction, and proposing to complete all renovations independently. Same operator. Same crew. Three doors added to the portfolio in a single closing. The package-deal lever only works when you have the team and the systems already in place to deliver on the renovation side.",
    panelIron: false,
    avatar: null,
  },
  {
    flip: true,
    eyebrow: 'Michigan · Second Chance Housing',
    h: 'Not all real estate\nis sexy.',
    photo: "EXTERIOR. CREAM-COLORED MI HOME, REHAB",
    src: SHAVIT_PHOTOS.secondChance, filter: 'saturate(1) contrast(1.05)',
    outcomes: [
      ['Asset',    'Cream-colored single-family, Michigan'],
      ['Approach', 'Eviction · Ozone treatment · Full clean · Re-rent'],
      ['Outcome',  'Restored. Re-rented to a working family.'],
    ],
    body: "We acquired the property with a difficult tenant situation and significant deferred maintenance. We worked through the eviction, ran ozone treatment, cleaned it to the studs, and put it back on the market. stabilized with a new long-term tenant. The numbers work because we showed up and did the work. Second-chance housing.",
    panelIron: true,
    avatar: null,
  },
  {
    flip: false,
    eyebrow: 'Hillsdale, MI · Residential Sale',
    h: 'Reduced fees.\nQuicker sale.\nHigher profits.',
    photo: "EXTERIOR. GARY PAUKEN'S HILLSDALE PROPERTY",
    src: STOCK.craftsmanHome, filter: 'saturate(0.95) contrast(1.05)',
    outcomes: [
      ['Outcome',  '22% higher profit vs. traditional agency'],
      ['Timeline', '28 days to close'],
      ['Partner',  'Gary Pauken, Hillsdale Resident'],
    ],
    body: "When I decided to sell my house, I chose to work with Shavit Rootman and his team. His honest assessment of local market trends and marketing skills ensured a fair outcome for both of us. His flexible marketing strategy allowed me to reduce agent and broker fees, resulting in a quicker sale and significantly higher profits compared to using a traditional Real Estate Agency. I appreciate Shavit's professionalism and would recommend him.",
    panelIron: false,
    avatar: SHAVIT_PHOTOS.gary,
  },
  {
    flip: true,
    eyebrow: 'Jackson County, MI · Loan Assumption',
    h: 'Professional\nacross the board.',
    photo: "EXTERIOR. JACKSON COUNTY PROPERTY",
    src: STOCK.modernWhite, filter: 'grayscale(0.3) contrast(1.1) brightness(0.94)',
    outcomes: [
      ['Service',  'Loan transfer & assumption'],
      ['Duration', 'Closed in 60 days'],
      ['Partner',  'Jeffrey S. Riling, US Veteran'],
    ],
    body: "The entire experience of selling my property, transferring my loan, having Shavit and his team assume my loan, and ultimately paying it off has been excellent. Shavit has consistently displayed professionalism across all aspects of his work. What stands out, though, is the kindness and camaraderie he brings to the table, making you feel like part of the family. I would recommend him to anyone considering a partnership.",
    panelIron: true,
    avatar: SHAVIT_PHOTOS.jef,
  },
  {
    flip: false,
    eyebrow: 'Cleveland, OH · Investor Partnership',
    h: 'Reliable partner.\nTrustworthy friend.',
    photo: "STREETSCAPE. CLEVELAND MEDICAL CORRIDOR",
    src: STOCK.cityDusk, filter: 'sepia(0.15) saturate(1.1) brightness(0.95)',
    outcomes: [
      ['Relationship', 'Ongoing investor partnership'],
      ['Markets',      'Cleveland metro'],
      ['Partner',      'Nicky, Real Estate Investor & Landlord'],
    ],
    body: "As a real estate investor, I crossed paths with Shavit by chance, and I'm glad I did. Our lunch meeting quickly revealed his extensive knowledge and his familiarity with the surroundings. Beyond his demeanor, Shavit is a man of his word. Despite language differences, our shared humor fosters understanding. Shavit is both a reliable business partner and a trustworthy friend. I'm confident in reaching out to him in any predicament.",
    panelIron: false,
    avatar: SHAVIT_PHOTOS.nicky,
  },
  {
    flip: true,
    eyebrow: 'Santa Barbara, CA · Realtor Engagement',
    h: 'Best in the business.',
    photo: "STREETSCAPE. SANTA BARBARA, CA",
    src: STOCK.luxuryDusk, filter: 'saturate(1.05) brightness(0.95)',
    outcomes: [
      ['Verified On', 'Experience.com · October 2025'],
      ['Rating',      '5.0 out of 5'],
      ['Partner',     'Bar S., Santa Barbara Resident'],
    ],
    body: "Best in the business! I really enjoyed Shavit's guidance.",
    panelIron: true,
    avatar: null,
  },
];

function CaseStudy({ data }) {
  const lines = data.h.split('\n');
  return (
    <article className={`cstudy ${data.flip ? 'cstudy--flip' : ''}`}>
      <Reveal mode="zoom-lg" className="cstudy__media"><Placeholder label={data.photo} src={data.src} filter={data.filter} kind="photo" /></Reveal>
      <div className={`cstudy__panel ${data.panelIron ? 'cstudy__panel--iron' : ''}`}>
        <Reveal mode="fade"><Eyebrow gold>{data.eyebrow}</Eyebrow></Reveal>
        <LineReveal as="h2" className="h-xl" lines={lines} lineDelay={200} />
        <Reveal mode="fade" delay={lines.length * 200 + 700}><GoldRule /></Reveal>
        <dl style={{ marginTop: 8, marginBottom: 8 }}>
          {data.outcomes.map(([k, v], i) => {
            const isPartner = k.toLowerCase() === 'partner';
            return (
              <Reveal key={i} mode="fade" delay={lines.length * 200 + 1000 + i * 200} className="cstudy__outcome">
                <dt>{k}</dt>
                <dd>
                  {isPartner && data.avatar && <img src={data.avatar} alt="" className="cstudy__avatar" referrerPolicy="no-referrer" />}
                  <span>{v}</span>
                </dd>
              </Reveal>
            );
          })}
        </dl>
        <Reveal mode="fade" delay={lines.length * 200 + 1800}>
          <p className="body-lg" style={{ maxWidth: 560, marginTop: 16 }}>
            {data.body}
          </p>
        </Reveal>
      </div>
    </article>
  );
}

function CaseStudiesPage() {
  return (
    <div className="page-fade">
      {/* 3.1 hero — line 2 scroll-linked color */}
      <section className="hero hero--80vh hero--enter">
        <div className="hero__media">
          <Placeholder src={STOCK.aerialHouse} filter="brightness(0.55) saturate(1.05) contrast(1.05)" label="STILL. PORTFOLIO PROPERTIES MONTAGE" kind="video" />
        </div>
        <div className="hero__scrim" />
        <div className="hero__inner hero__inner--center" style={{ textAlign: 'center' }}>
          <Eyebrow gold>Case Studies</Eyebrow>
          <h1 className="h-mega" style={{ marginTop: 24 }}>
            <LineReveal as="span" lines={['The work.']} triggerOnView={false} baseDelay={600} />
            <ScrollLinkedColor as="span" style={{ display: 'block' }}>In partners' words.</ScrollLinkedColor>
          </h1>
          <p className="body-lg hero__sub" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Every property has a story. Every partnership has a result. Below, what people who've worked with Shavit say about it.
          </p>
        </div>
        <div className="hero__progress" />
      </section>

      {CASES.map((c, i) => <CaseStudy key={i} data={c} />)}

      {/* 3.5 outcomes by the numbers — slower counter */}
      <section className="band">
        <div className="band__inner">
          <div className="section-head section-head--left">
            <Reveal mode="fade"><Eyebrow gold>The Track Record</Eyebrow></Reveal>
            <LineReveal as="h2" className="h-lg" lines={['Outcomes, not promises.']} />
          </div>
          <StatsGrid rows={[
            { value: <Counter to={42} suffix="+" duration={2400} />,  label: 'Properties Transacted' },
            { value: <Counter to={32} duration={2400} />,             label: 'Avg. Days To Close' },
            { value: <Counter to={14} suffix="+" duration={2400} />,  label: 'Investor Partnerships' },
            { value: <Counter to={5.0} duration={2400} suffix=" / 5" />, label: 'Avg. Client Rating' },
          ]} />
        </div>
      </section>

      {/* 3.6 pre-footer CTA */}
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

window.CaseStudiesPage = CaseStudiesPage;
