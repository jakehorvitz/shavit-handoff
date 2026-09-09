/* global React, CONTACT */
function Footer({ onNav }) {
  const go = (e, p) => { e.preventDefault(); onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return (
    <footer className="footer">
      <div className="footer__top">
        <h2 className="footer__wordmark">Shavit Rootman</h2>
      </div>
      <div className="footer__grid">
        <div className="footer__col">
          <h5>Navigate</h5>
          <ul>
            <li><a href="#" onClick={(e) => go(e,'home')}>Home</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>The Operation</a></li>
            <li><a href="#" onClick={(e) => go(e,'case-studies')}>Case Studies</a></li>
            <li><a href="#" onClick={(e) => go(e,'openings')}>Openings</a></li>
            <li><a href="#" onClick={(e) => go(e,'tenants')}>Tenants</a></li>
            <li><a href="#" onClick={(e) => go(e,'meet')}>Meet the Operator</a></li>
            <li><a href="#" onClick={(e) => go(e,'contact')}>Contact</a></li>
            <li><a href="#" onClick={(e) => go(e,'accessibility')}>Accessibility</a></li>
            <li><a href="#" onClick={(e) => go(e,'legal')}>Legal &amp; Privacy</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h5>Where We Operate</h5>
          <ul>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Michigan · Hillsdale &amp; Jackson Co</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Ohio · Cleveland</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Indiana · South Bend</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h5>Connect</h5>
          <ul>
            <li><a href="https://shavitrootman.substack.com" target="_blank" rel="noopener noreferrer">Substack</a></li>
            <li><a href={CONTACT.igHref} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={CONTACT.liHref} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            <li><a href={`mailto:${CONTACT.email}`}>Email</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h5>Contact</h5>
          <ul>
            <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
            <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <div>© 2026 Rootman. All Rights Reserved. · <a href="#" onClick={(e) => go(e,'legal')}>Legal &amp; Privacy</a></div>
        <div>Building communities, profitably · MI · OH · IN</div>
      </div>
      <div className="footer__disclaimer">
        Not an offer to sell or a solicitation to buy any security. Informational only; not investment, legal, or tax advice. Real estate investing carries risk, including loss of principal. Not currently accepting new inquiries. See <a href="#" onClick={(e) => go(e,'legal')}>Legal &amp; Privacy</a>.
      </div>
    </footer>
  );
}

window.Footer = Footer;
