/* global React, CONTACT, URLS */
const { useState: useNavState, useEffect: useNavEffect, useRef: useNavRef } = React;

function Nav({ page, onNav, openMenu, menuOpen }) {
  const [scrolled, setScrolled] = useNavState(false);
  useNavEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="nav__inner">
        <div className="nav__left">
          <button className={`nav__menu-btn ${menuOpen ? 'is-open' : ''}`} onClick={openMenu} aria-label="Open menu" aria-expanded={menuOpen ? 'true' : 'false'}>
            <span className="nav__burger" aria-hidden="true">
              <span className="nav__burger-bar nav__burger-bar--top" />
              <span className="nav__burger-bar nav__burger-bar--bot" />
            </span>
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
        <a
          className="nav__wordmark nav__center"
          href="#"
          onClick={(e) => { e.preventDefault(); onNav('home'); window.scrollTo({ top: 0 }); }}
          aria-label="Shavit Rootman. Home"
        >
          Shavit<span className="nav__wordmark-gold">Rootman</span>
        </a>
        <div className="nav__right">
          <button className="nav__icon-btn" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
            </svg>
          </button>
          <a
            className="nav__cta"
            href="#"
            onClick={(e) => { e.preventDefault(); onNav('contact'); window.scrollTo({ top: 0 }); }}
          >
            Partner &amp; Equity
          </a>
        </div>
      </div>
    </header>
  );
}

function MenuOverlay({ open, onClose, page, onNav }) {
  const overlayRef = useNavRef(null);
  const triggerRef = useNavRef(null);

  const items = [
    ['home', 'Home'],
    ['companies', 'The Operation'],
    ['case-studies', 'Case Studies'],
    ['openings', 'Openings'],
    ['tenants', 'Tenants'],
    ['meet', 'Meet the Operator'],
    ['contact', 'Contact'],
  ];
  const go = (key) => { onNav(key); onClose(); window.scrollTo({ top: 0 }); };

  useNavEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    // Focus first overlay link
    const first = overlayRef.current && overlayRef.current.querySelector('a, button');
    if (first) first.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return;
      const root = overlayRef.current;
      if (!root) return;
      const focusables = root.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      const list = Array.from(focusables).filter(el => !el.disabled && el.offsetParent !== null);
      if (!list.length) return;
      const firstEl = list[0], lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') triggerRef.current.focus();
    };
  }, [open, onClose]);

  return (
    <div ref={overlayRef} className={`overlay ${open ? 'overlay--open' : ''}`} aria-hidden={!open} role="dialog" aria-modal={open ? 'true' : undefined} aria-label="Main menu">
      <button className="overlay__close" onClick={onClose} aria-label="Close menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <line x1="4" y1="4" x2="20" y2="20" />
          <line x1="20" y1="4" x2="4" y2="20" />
        </svg>
      </button>
      <nav className="overlay__nav">
        {items.map(([key, label]) => (
          <a
            key={key}
            href="#"
            className={`overlay__link ${page === key ? 'overlay__link--active' : ''}`}
            onClick={(e) => { e.preventDefault(); go(key); }}
          >
            {label}
          </a>
        ))}
      </nav>
      <div className="overlay__contact">
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <span>·</span>
        <a href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        <span>·</span>
        <a href={CONTACT.igHref} target="_blank" rel="noopener noreferrer">{CONTACT.ig}</a>
      </div>
    </div>
  );
}

window.Nav = Nav;
window.MenuOverlay = MenuOverlay;
