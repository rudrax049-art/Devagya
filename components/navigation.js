const contactLinks = {
  whatsapp: 'https://wa.me/',
  phone: 'tel:YOUR_PHONE_NUMBER',
  email: 'mailto:devagyavastu@gmail.com'
};

const icon = (name) => {
  const paths = {
    whatsapp: '<path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7A8.5 8.5 0 1 1 20.5 11.8Z"/><path d="M8.5 8.3c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4 0 .6.3.6 1.2 1.6 2.5 2.1.3.1.5.1.7-.1l.8-.9c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.3-.9 1.8-.6.5-1.4.6-2.3.3-1-.3-2.3-.8-3.9-2.2-1.3-1.2-2.2-2.6-2.4-3.5-.3-.9 0-1.7.5-2.2Z"/>',
    phone: '<path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.7 2 2 0 0 1 3.1 1.5h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7 9.5a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2.1Z"/>',
    email: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const headerMarkup = `
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" id="siteHeader">
    <div class="site-header-inner">
      <a class="brand-lockup" href="index.html" aria-label="Devagya Vastu home">
        <img src="assets/logo-mark.png" alt="" width="42" height="42">
        <span><strong>DEVAGYA</strong><small>VASTU &amp; SIGNATURE SPACES</small></span>
      </a>
      <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="primaryNav" aria-label="Open navigation"><span></span><span></span></button>
      <nav class="primary-nav" id="primaryNav" aria-label="Primary navigation">
        <a href="approach.html">Approach</a>
          <div class="nav-tools">
            <button class="nav-tools-toggle" id="toolsToggle" type="button" aria-expanded="false" aria-controls="toolsMenu">Spatial tools <span aria-hidden="true">⌄</span></button>
            <div class="nav-dropdown" id="toolsMenu" hidden>
              <a href="audit-hub.html">Digital spatial dial <small>Explore directional sectors</small></a>
              <a href="audit-hub.html#panel-audit">Structural audit <small>Answer four planning questions</small></a>
            </div>
          </div>
        <a href="calendar.html">Project calendar</a>
        <a href="contact.html">Contact</a>
        <a class="nav-cta" href="contact.html#intake">Start a project <span aria-hidden="true">↗</span></a>
      </nav>
    </div>
  </header>
  <div class="contact-dock" aria-label="Contact Devagya">
    <a class="dock-link dock-whatsapp" href="${contactLinks.whatsapp}" aria-label="Open WhatsApp" title="WhatsApp">${icon('whatsapp')}<span>WhatsApp</span></a>
    <a class="dock-link dock-phone" href="${contactLinks.phone}" aria-label="Call Devagya" title="Call">${icon('phone')}<span>Call</span></a>
    <a class="dock-link dock-email" href="${contactLinks.email}" aria-label="Email Devagya" title="Email">${icon('email')}<span>Email</span></a>
  </div>`;

const footerMarkup = `
  <footer class="site-footer">
    <div class="footer-main">
      <a class="brand-lockup footer-brand" href="index.html" aria-label="Devagya Vastu home">
        <img src="assets/logo-mark.png" alt="" width="42" height="42">
        <span><strong>DEVAGYA</strong><small>VASTU &amp; SIGNATURE SPACES</small></span>
      </a>
      <p>Spatial planning shaped by classical principles, site conditions and contemporary architectural practice.</p>
      <div class="footer-contact">
        <a href="${contactLinks.whatsapp}">WhatsApp</a>
        <a href="${contactLinks.phone}">Voice call</a>
        <a href="${contactLinks.email}">Email</a>
      </div>
    </div>
    <div class="footer-bottom"><span>© <span data-current-year></span> Devagya Vastu</span><span>Design guidance is project-specific and does not replace engineering or code review.</span></div>
  </footer>`;

const mountPoint = document.querySelector('[data-site-header]');
if (mountPoint) {
  mountPoint.innerHTML = headerMarkup;
} else {
  const legacyHeader = document.querySelector('body > header');
  if (legacyHeader) {
    legacyHeader.insertAdjacentHTML('beforebegin', headerMarkup);
    legacyHeader.remove();
  }
}
const footerPoint = document.querySelector('[data-site-footer]');
if (footerPoint) {
  footerPoint.innerHTML = footerMarkup;
} else {
  const legacyFooter = document.querySelector('body > footer');
  if (legacyFooter) legacyFooter.outerHTML = footerMarkup;
}

const mainContent = document.getElementById('main-content') || document.querySelector('main');
if (mainContent && !mainContent.id) mainContent.id = 'main-content';

document.querySelectorAll('[data-current-year]').forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const siteHeader = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const toolsToggle = document.getElementById('toolsToggle');
const toolsMenu = document.getElementById('toolsMenu');

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

if (menuToggle && primaryNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });
  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      primaryNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      primaryNav.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      menuToggle.focus();
    }
  });
}

if (primaryNav) {
  primaryNav.querySelectorAll('a[href]').forEach((link) => {
    const linkUrl = new URL(link.href, window.location.href);
    if (linkUrl.pathname === window.location.pathname && !linkUrl.hash) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

if (toolsToggle && toolsMenu) {
  toolsToggle.addEventListener('click', () => {
    const open = toolsToggle.getAttribute('aria-expanded') === 'true';
    toolsToggle.setAttribute('aria-expanded', String(!open));
    toolsMenu.hidden = open;
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-tools')) {
      toolsToggle.setAttribute('aria-expanded', 'false');
      toolsMenu.hidden = true;
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !toolsMenu.hidden) {
      toolsMenu.hidden = true;
      toolsToggle.setAttribute('aria-expanded', 'false');
      toolsToggle.focus();
    }
  });
}
