// Devagya Vastu — shared behaviour across all pages

document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }));
  }

  /* Scroll-reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* Service tabs (Residential / Corporate / Developers) */
  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const buttons = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.setAttribute('aria-selected', 'false'));
        panels.forEach((p) => p.classList.remove('active'));
        btn.setAttribute('aria-selected', 'true');
        const target = group.querySelector('#' + btn.dataset.tabTarget);
        if (target) target.classList.add('active');
      });
    });
  });

  /* Accordion (FAQ / methodology deep-dive) */
  document.querySelectorAll('.acc-item').forEach((item) => {
    const btn = item.querySelector('.acc-trigger');
    const panel = item.querySelector('.acc-panel');
    if (!btn || !panel) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      const accordion = item.closest('[data-accordion]');
      if (accordion) accordion.querySelectorAll('.acc-item.open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.acc-panel').style.maxHeight = null;
          openItem.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Floating WhatsApp + back-to-top visibility */
  const floatWa = document.getElementById('floatWa');
  const backToTop = document.getElementById('backToTop');
  if (floatWa || backToTop) {
    const toggleFloaters = () => {
      const past = window.scrollY > 320;
      if (floatWa) floatWa.classList.toggle('opacity-0', !past);
      if (floatWa) floatWa.classList.toggle('pointer-events-none', !past);
      if (backToTop) backToTop.classList.toggle('opacity-0', !past);
      if (backToTop) backToTop.classList.toggle('pointer-events-none', !past);
    };
    window.addEventListener('scroll', toggleFloaters, { passive: true });
    toggleFloaters();
    if (backToTop) backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

});
