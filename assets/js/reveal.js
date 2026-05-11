/* ============================================
   Reveal — IntersectionObserver fade-up animations
   + duplicates marquee track for seamless loop
   ============================================ */

(function () {
  /* Reveal on scroll */
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');

  if ('IntersectionObserver' in window && targets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );

    targets.forEach((el) => observer.observe(el));
  } else {
    targets.forEach((el) => el.classList.add('is-visible'));
  }

  /* Marquee — duplicate track contents for seamless loop */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    const items = Array.from(track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* Smooth-scroll for in-page anchors */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
