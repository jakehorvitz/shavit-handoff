/* global React, ReactDOM, Nav, MenuOverlay, Footer, HomePage, CompaniesPage, CaseStudiesPage, MeetPage, ContactPage, AccessibilityPage, LogoIntro, FormModal, CursorRing, ScrollProgress, FilmGrain, Watermark */
const { useState: useAppState, useEffect: useAppEffect } = React;

const PAGES = ['home', 'companies', 'case-studies', 'meet', 'contact', 'accessibility'];

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
    // Former form triggers now route straight to the contact page.
    const onFormTrigger = () => { setPage('contact'); window.scrollTo({ top: 0 }); };
    window.addEventListener('open-form-modal', onFormTrigger);
    return () => window.removeEventListener('open-form-modal', onFormTrigger);
  }, []);

  useAppEffect(() => {
    // Lock scroll when menu open
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  let PageComp = HomePage;
  if (page === 'companies') PageComp = CompaniesPage;
  else if (page === 'case-studies') PageComp = CaseStudiesPage;
  else if (page === 'meet') PageComp = MeetPage;
  else if (page === 'contact') PageComp = ContactPage;
  else if (page === 'accessibility') PageComp = AccessibilityPage;

  const labels = { home: '01 Home', companies: '02 Companies', 'case-studies': '03 Case Studies', meet: '04 Meet Shavit', contact: '05 Contact', accessibility: '06 Accessibility' };

  return (
    <div className="app-shell" data-screen-label={labels[page]}>
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
