// footer.jsx — ported verbatim from Footer.jsx.
// Footer nav links use react-router navigation to the real paths.

import { Link } from 'react-router-dom'
import { BRAND, CONTACT, SUBLINE } from './data.js'

const toTop = () => window.scrollTo({ top: 0, behavior: 'instant' })

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <h2 className="footer__wordmark">{BRAND}</h2>
        <div style={{ marginTop: 8, fontSize: 13, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--color-mute-warm)' }}>{SUBLINE}</div>
      </div>
      <div className="footer__grid">
        <div className="footer__col">
          <h3>Navigate</h3>
          <ul>
            <li><Link to="/" onClick={toTop}>Home</Link></li>
            <li><Link to="/#michigan">Michigan</Link></li>
            <li><Link to="/#ohio">Ohio</Link></li>
            <li><Link to="/#indiana">Indiana</Link></li>
            <li><Link to="/case-studies">Deal Case Studies</Link></li>
            <li><Link to="/meet" onClick={toTop}>Live with us. Learn about us.</Link></li>
            {/* Was a bare mailto that silently no-ops without a mail client.
                Points at the contact section; the email is still one line down. */}
            <li><a href="/#contact">Contact Us</a></li>
            <li><Link to="/accessibility" onClick={toTop}>Accessibility</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h3>Inventory</h3>
          <ul>
            <li><Link to="/#michigan">Michigan rentals</Link></li>
            <li><Link to="/#ohio">Ohio rentals</Link></li>
            <li><Link to="/#indiana">Indiana rentals</Link></li>
          </ul>
        </div>
        <div className="footer__col">
          <h3>Connect</h3>
          <ul>
            <li><a href={CONTACT.igHref} target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={CONTACT.liHref} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <h3>Contact</h3>
          <ul>
            <li><a href={CONTACT.emailHref}>{CONTACT.email}</a></li>
            <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <div>© 2026 {BRAND}. All Rights Reserved.</div>
        <div>Charger Property Management · MI · OH · IN</div>
      </div>
    </footer>
  )
}
