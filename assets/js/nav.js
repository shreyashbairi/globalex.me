/* ============================================
   Navigation — sticky header state + mobile menu
   ============================================ */

(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;

  /* Transparent on hero, solid on scroll. If page has no hero, start solid. */
  const startsTransparent = header?.dataset.transparent === 'true';

  function updateHeaderState() {
    if (!header) return;
    if (!startsTransparent) {
      header.dataset.state = 'solid';
      return;
    }
    const threshold = window.innerHeight * 0.6;
    header.dataset.state = window.scrollY > threshold ? 'solid' : 'transparent';
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState, { passive: true });

  /* Mobile menu toggle */
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      const next = !isOpen;
      toggle.setAttribute('aria-expanded', String(next));
      mobileNav.dataset.open = String(next);
      body.style.overflow = next ? 'hidden' : '';
    });

    /* Close on link click */
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.dataset.open = 'false';
        body.style.overflow = '';
      });
    });

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.dataset.open = 'false';
        body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* Highlight current nav item */
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const fileBase = path.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href === fileBase || (fileBase === 'index.html' && href === '/')) {
      link.setAttribute('aria-current', 'page');
    }
  });
})();
