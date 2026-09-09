/* global React, Eyebrow, GoldRule, CONTACT */

function AccessibilityPage() {
  return (
    <div className="page-fade band" style={{ paddingTop: 160 }}>
      <div className="band__inner" style={{ maxWidth: 820, margin: '0 auto' }}>
        <Eyebrow gold>Accessibility</Eyebrow>
        <h1 className="h-xl" style={{ marginTop: 16 }}>Our commitment to accessibility.</h1>
        <GoldRule wide style={{ marginTop: 32, marginBottom: 32 }} />

        <p className="body-lg">
          Charger Property Management is committed to ensuring digital accessibility for everyone, including people with disabilities. We work to continually improve the user experience for all visitors and apply the relevant accessibility standards.
        </p>

        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Standard we follow</h2>
        <p className="body-lg">
          This site is designed to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</strong>, published by the W3C. These guidelines explain how to make web content more accessible to people with a wide array of disabilities. visual, auditory, motor, and cognitive.
        </p>

        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>What we&rsquo;ve built in</h2>
        <ul className="a11y-list">
          <li>Keyboard navigation throughout, with a visible focus indicator on every interactive element.</li>
          <li>A &ldquo;Skip to main content&rdquo; link as the first focusable element on every page.</li>
          <li>Semantic HTML landmarks (<code>header</code>, <code>main</code>, <code>nav</code>, <code>footer</code>) for screen-reader navigation.</li>
          <li>Descriptive alt text on photographs of people, properties, and documents.</li>
          <li>Form fields labeled with persistent text (not just placeholders) and validated with screen-reader-friendly error messages.</li>
          <li>Modals and overlays trap focus, announce themselves to screen readers, and close on the Escape key.</li>
          <li>All hero video is muted and decorative; nothing essential is conveyed by motion alone.</li>
          <li>Color contrast on body copy meets or exceeds WCAG AA (4.5:1).</li>
          <li>Animations respect the operating-system <code>prefers-reduced-motion</code> setting.</li>
          <li>Text scales smoothly when the browser font size is increased.</li>
        </ul>

        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Known limitations</h2>
        <p className="body-lg">
          We are still working on the following items, which we plan to remediate:
        </p>
        <ul className="a11y-list">
          <li>Closed captions and a full transcript for the hero background footage are pending.</li>
          <li>Some third-party embeds (Google Forms, Substack, LinkedIn previews) may have accessibility issues outside our direct control. We provide native alternatives whenever possible.</li>
        </ul>

        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Need assistance? Tell us.</h2>
        <p className="body-lg">
          If you encounter an accessibility barrier on this site, or if you need information presented in an alternative format, we want to hear from you. We respond to every request within <strong>three business days</strong>.
        </p>

        <div className="a11y-contact">
          <div>
            <div className="a11y-contact__lbl">Email</div>
            <a className="a11y-contact__val" href={`mailto:${CONTACT.email}?subject=Accessibility%20Request`}>
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

        <h2 className="h-md" style={{ marginTop: 56, marginBottom: 16 }}>Formal complaint procedure</h2>
        <p className="body-lg">
          If you believe we have not adequately responded to your accessibility request, you may file a complaint with:
        </p>
        <ul className="a11y-list">
          <li>The <strong>U.S. Department of Justice, Civil Rights Division</strong> · <a href="https://civilrights.justice.gov" target="_blank" rel="noopener noreferrer">civilrights.justice.gov</a></li>
          <li>The <strong>U.S. Access Board</strong> · <a href="https://www.access-board.gov" target="_blank" rel="noopener noreferrer">access-board.gov</a></li>
        </ul>

        <p className="body-md" style={{ marginTop: 56, color: 'var(--color-mute-warm)', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>
          Last reviewed: May 2026. Accessibility is an ongoing effort, not a finished one.
        </p>
      </div>
    </div>
  );
}

window.AccessibilityPage = AccessibilityPage;
