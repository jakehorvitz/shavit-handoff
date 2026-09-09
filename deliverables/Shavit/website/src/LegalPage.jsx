/* global React, Eyebrow, GoldRule, CONTACT */

function LegalPage() {
  return (
    <div className="page-fade band" style={{ paddingTop: 160 }}>
      <div className="band__inner" style={{ maxWidth: 820, margin: '0 auto' }}>
        <Eyebrow gold>Legal &amp; Privacy</Eyebrow>
        <h1 className="h-xl" style={{ marginTop: 16 }}>Important disclosures.</h1>
        <GoldRule wide style={{ marginTop: 32, marginBottom: 32 }} />

        {/* ============ INVESTMENT DISCLAIMER ============ */}
        <h2 className="h-md" style={{ marginTop: 16, marginBottom: 16 }}>Investment disclaimer</h2>
        <p className="body-lg">
          The information on this website is provided for general informational purposes only. It is <strong>not an offer to sell, or a solicitation of an offer to buy,</strong> any security, investment product, or interest in any fund or entity, and it does not constitute investment, financial, legal, accounting, or tax advice. Nothing here should be relied upon as the basis for any investment decision.
        </p>
        <p className="body-lg" style={{ marginTop: 20 }}>
          Any offering of a securities or investment opportunity would be made only to eligible investors, in the jurisdictions where lawful, and solely through formal offering documents that contain complete information about the terms, conditions, and risks. In the event of any conflict, those formal documents control over anything stated on this website.
        </p>
        <p className="body-lg" style={{ marginTop: 20 }}>
          Real estate investing involves substantial risk, including the possible loss of principal. <strong>Past performance is not indicative of future results.</strong> Any portfolio figures, door counts, valuations, projections, or goals shown on this site (including statements about future plans such as target door counts or homes revitalized) are forward-looking, reflect current intentions only, and are not guarantees of any outcome. Prospective investors should consult their own legal, tax, and financial advisors before making any decision.
        </p>

        {/* ============ PRIVACY POLICY ============ */}
        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Privacy policy</h2>
        <p className="body-lg">
          We respect your privacy. This policy explains what we collect when you use this site and contact us, and what we do with it.
        </p>

        <h3 className="h-sm" style={{ marginTop: 32, marginBottom: 12 }}>Information we collect</h3>
        <ul className="a11y-list">
          <li><strong>Information you give us.</strong> This site has no forms and collects no information through the website itself. If you choose to email or call us, we receive what you send — typically your name, contact details, and your message. Please do not send bank account numbers, Social Security numbers, or other sensitive identifiers.</li>
          <li><strong>Information collected automatically.</strong> Our hosting provider may log standard technical data such as IP address, browser type, and pages visited, for security and to keep the site running. We do not use advertising trackers.</li>
        </ul>

        <h3 className="h-sm" style={{ marginTop: 32, marginBottom: 12 }}>How we use it</h3>
        <ul className="a11y-list">
          <li>To respond to your inquiry and follow up with you about working or investing with us.</li>
          <li>To operate, secure, and improve the website.</li>
          <li>To comply with legal obligations.</li>
        </ul>
        <p className="body-lg" style={{ marginTop: 12 }}>
          We do <strong>not</strong> sell your personal information.
        </p>

        <h3 className="h-sm" style={{ marginTop: 32, marginBottom: 12 }}>Service providers</h3>
        <p className="body-lg">
          The site is hosted on a third-party hosting provider, which processes technical data under its own terms and privacy policy. We link out to LinkedIn, Substack, and Instagram, which are governed by their own privacy practices.
        </p>

        <h3 className="h-sm" style={{ marginTop: 32, marginBottom: 12 }}>Your choices &amp; rights</h3>
        <p className="body-lg">
          You may request that we access, correct, or delete the personal information you have submitted, or ask us to stop contacting you, at any time. California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we hold and to request its deletion. To make any request, email us at the address below and we will respond as required by law.
        </p>

        <h3 className="h-sm" style={{ marginTop: 32, marginBottom: 12 }}>Children</h3>
        <p className="body-lg">
          This site is intended for adults and is not directed to children. We do not knowingly collect information from anyone under 18.
        </p>

        {/* ============ TERMS OF USE ============ */}
        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Terms of use</h2>
        <p className="body-lg">
          By using this website you agree to these terms. All content. text, images, video, graphics, and design. is owned by or licensed to us and is protected by copyright and other laws; you may not reproduce or redistribute it without permission. The site is provided &ldquo;as is,&rdquo; without warranties of any kind, and to the fullest extent permitted by law we are not liable for any damages arising from your use of it. Third-party links are provided for convenience and we are not responsible for their content. We may update the site and these terms at any time.
        </p>

        {/* ============ CONTACT ============ */}
        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Contact us</h2>
        <p className="body-lg">
          Questions about these disclosures, or a privacy request? Reach out:
        </p>
        <div className="a11y-contact">
          <div>
            <div className="a11y-contact__lbl">Email</div>
            <a className="a11y-contact__val" href={`mailto:${CONTACT.email}?subject=Privacy%20Request`}>
              {CONTACT.email}
            </a>
          </div>
          <div>
            <div className="a11y-contact__lbl">Phone</div>
            <a className="a11y-contact__val" href={CONTACT.phoneHref}>
              {CONTACT.phone}
            </a>
          </div>
        </div>

        <p className="body-md" style={{ marginTop: 56, color: 'var(--color-mute-warm)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
          Last updated: May 2026.
        </p>
      </div>
    </div>
  );
}

window.LegalPage = LegalPage;
