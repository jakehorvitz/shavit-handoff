/* global React, ReactDOM, Nav, MenuOverlay, Footer, HomePage, CompaniesPage, CaseStudiesPage, MeetPage, ContactPage, OpeningsPage, TenantsPage, AccessibilityPage, LegalPage, LogoIntro, CursorRing, ScrollProgress, FilmGrain */
const { useState: useAppState, useEffect: useAppEffect } = React;

const PAGES = ['home', 'companies', 'case-studies', 'openings', 'tenants', 'meet', 'contact', 'accessibility', 'legal'];

function App() {
  const [page, setPage] = useAppState(() => {
    const h = (window.location.hash || '').replace('#', '');
    return PAGES.includes(h) ? h : 'home';
  });
  const [menuOpen, setMenuOpen] = useAppState(false);

  useAppEffect(() => {
    window.location.hash = page === 'home' ? '' : page;
  }, [page]);

  useAppEffect(() => {
    const onHash = () => {
      const h = (window.location.hash || '').replace('#', '');
      if (PAGES.includes(h)) setPage(h);
      else if (!h) setPage('home');
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useAppEffect(() => {
    // Lock scroll when menu open
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  let PageComp = HomePage;
  if (page === 'companies') PageComp = CompaniesPage;
  else if (page === 'case-studies') PageComp = CaseStudiesPage;
  else if (page === 'openings') PageComp = OpeningsPage;
  else if (page === 'tenants') PageComp = TenantsPage;
  else if (page === 'meet') PageComp = MeetPage;
  else if (page === 'contact') PageComp = ContactPage;
  else if (page === 'accessibility') PageComp = AccessibilityPage;
  else if (page === 'legal') PageComp = LegalPage;

  const labels = { home: '01 Home', companies: '02 The Operation', 'case-studies': '03 Case Studies', openings: '04 Openings', tenants: '05 Tenants', meet: '06 Meet the Operator', contact: '07 Contact', accessibility: '08 Accessibility', legal: '09 Legal & Privacy' };

  return (
    <div className="app-shell" data-screen-label={labels[page]}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <FilmGrain />
      <ScrollProgress />
      <LogoIntro />
      <Nav page={page} onNav={setPage} openMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
      <main id="main-content" key={page} tabIndex="-1">
        <PageComp onNav={setPage} />
      </main>
      <Footer onNav={setPage} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} page={page} onNav={setPage} />
      <CursorRing />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
