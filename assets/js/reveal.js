/* ============================================
   Reveal + creative UI behaviors
   - IntersectionObserver fade-up
   - Word-stagger reveal
   - Marquee duplication (seamless loop)
   - Scroll progress bar
   - Counter animation
   - Pinned timeline step tracker
   - Mouse-following hero gradient
   - Smooth anchor scroll
   ============================================ */

(function () {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----- 1. Reveal on scroll ----- */
  const targets = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-words');

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

  /* ----- 2. Word-stagger: split [data-words] into per-word spans
     Walks text nodes so inline tags (e.g. <em>) are preserved ----- */
  document.querySelectorAll('[data-words]').forEach((el) => {
    let wordIndex = 0;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;
      const frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.setProperty('--i', wordIndex++);
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  });

  /* ----- 3. Marquee duplication (seamless loop) ----- */
  document.querySelectorAll('.marquee-track').forEach((track) => {
    const items = Array.from(track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  });

  /* ----- 4. Scroll progress bar ----- */
  const progress = document.querySelector('.scroll-progress-fill');
  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (scrolled / max) * 100 : 0;
      progress.style.width = pct + '%';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  /* ----- 5. Counter animation ----- */
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.target);
      const duration = parseInt(el.dataset.duration || '1600', 10);
      const decimals = (el.dataset.decimals || '0') | 0;
      const start = performance.now();
      const easeOut = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const value = easeOut(t) * target;
        el.textContent = value.toFixed(decimals);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };

      if (reduceMotion) {
        el.textContent = target.toFixed(decimals);
      } else {
        requestAnimationFrame(step);
      }
    };

    if ('IntersectionObserver' in window) {
      const cObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animate(entry.target);
              cObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach((c) => cObserver.observe(c));
    } else {
      counters.forEach(animate);
    }
  }

  /* ----- 6. Pinned timeline step tracker ----- */
  const pinnedSteps = document.querySelectorAll('.timeline-pinned [data-step]');
  const pinnedSection = document.querySelector('.timeline-layout');
  if (pinnedSection && pinnedSteps.length) {
    const steps = document.querySelectorAll('.timeline-step[data-step]');
    const counter = document.querySelector('.step-counter .current');
    const name = document.querySelector('.step-name');
    const progressFill = document.querySelector('.step-progress-fill');
    const total = steps.length;

    const stepObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.dataset.step, 10);
            steps.forEach((s) => s.classList.toggle('is-active', s === entry.target));
            if (counter) counter.textContent = String(idx).padStart(2, '0');
            if (name) name.textContent = entry.target.dataset.label || '';
            if (progressFill) progressFill.style.width = (idx / total) * 100 + '%';
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );

    steps.forEach((s) => stepObserver.observe(s));
  }

  /* ----- 7. Mouse-following gradient on every hero ----- */
  if (!reduceMotion) {
    document.querySelectorAll('.hero, .page-hero').forEach((hero) => {
      const media = hero.querySelector('.hero-media, .page-hero-media');
      if (!media) return;
      let raf;
      hero.addEventListener('mousemove', (e) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          media.style.setProperty('--mx', x + '%');
          media.style.setProperty('--my', y + '%');
        });
      });
    });
  }

  /* ----- 8. Smooth-scroll for in-page anchors ----- */
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
