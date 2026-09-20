// DEVAGYA — shared behaviour across all pages

document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* Header compacts on scroll */
  const header = document.querySelector('header');
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* Scroll-reveal for content blocks */
  const revealEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => revealObserver.observe(el));

    /* Active nav-link tracking for single-page anchor sections */
    const navAnchors = document.querySelectorAll('.nav-links a[data-nav]');
    if (navAnchors.length) {
      const sections = Array.from(navAnchors)
        .map(a => document.getElementById(a.dataset.nav))
        .filter(Boolean);
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.classList.toggle('active', a.dataset.nav === entry.target.id));
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      sections.forEach(s => navObserver.observe(s));
    }
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* Floating WhatsApp + back-to-top visibility */
  const floatWa = document.getElementById('floatWa');
  const backToTop = document.getElementById('backToTop');
  if (floatWa && backToTop) {
    const toggleFloaters = () => {
      const past = window.scrollY > 320;
      floatWa.classList.toggle('show', past);
      backToTop.classList.toggle('show', past);
    };
    window.addEventListener('scroll', toggleFloaters, { passive: true });
    toggleFloaters();
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Sign-up / lead forms: progressive enhancement.
     Each form works with plain HTML (action="https://api.web3forms.com/submit")
     even if JavaScript fails. This just shows an inline success message
     instead of navigating away, when JS is available. */
  document.querySelectorAll('.signup-form').forEach((leadForm) => {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const successEl = leadForm.querySelector('.form-success');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      try {
        const res = await fetch(leadForm.action, {
          method: 'POST',
          body: new FormData(leadForm),
          headers: { Accept: 'application/json' }
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          leadForm.reset();
          if (successEl) successEl.classList.add('show');
        } else {
          // Fall back to a normal form submit if the API rejects the request
          leadForm.submit();
        }
      } catch (err) {
        leadForm.submit();
      } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
      }
    });
  });
});
