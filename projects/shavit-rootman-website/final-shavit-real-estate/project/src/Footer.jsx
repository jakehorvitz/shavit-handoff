/* global React, CONTACT */
function Footer({ onNav }) {
  const go = (e, p) => { e.preventDefault(); onNav(p); window.scrollTo({ top: 0, behavior: 'instant' }); };
  return (
    <footer className="footer">
      <div className="footer__top">
        <h2 className="footer__wordmark">Charger Realty Management</h2>
        <div style={{ marginTop: 8, fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-mute-warm)' }}>by Shavit Rootman</div>
      </div>
      <div className="footer__grid">
        <div className="footer__col">
          <h5>Navigate</h5>
          <ul>
            <li><a href="#" onClick={(e) => go(e,'home')}>Home</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Companies</a></li>
            <li><a href="#" onClick={(e) => go(e,'case-studies')}>Case Studies</a></li>
            <li><a href="#" onClick={(e) => go(e,'meet')}>Meet Shavit</a></li>
            <li><a href="#" onClick={(e) => go(e,'contact')}>Contact</a></li>
            <li><a href="#" onClick={(e) => go(e,'accessibility')}>Accessibility</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h5>Portfolio</h5>
          <ul>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Barootman Enterprises</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Charger Realty</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>DSR Enterprises</a></li>
            <li><a href="#" onClick={(e) => go(e,'companies')}>Charger Property Management</a></li>
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
        <div>© 2026 Rootman. All Rights Reserved.</div>
        <div>Charger Property Management · Building 200 doors across MI · OH · IN by 2030</div>
      </div>
    </footer>
  );
}

window.Footer = Footer;
