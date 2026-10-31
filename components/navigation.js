const contactLinks = {
  whatsapp: 'https://wa.me/919467496725',
  phone: 'tel:+919467496725',
  email: 'mailto:devagyavastu@gmail.com'
};
const isRootHostedPage = (document.body && document.body.dataset.rootPage === 'true') || window.location.pathname === '/' || window.location.pathname === '/index.html';
const relativeRoot = isRootHostedPage ? './' : '../';
const sitePage = (page) => `${relativeRoot}${page ? `${page}/` : ''}`;
const siteAsset = (path) => `${relativeRoot}${path}`;
window.devagyaStorage = Object.freeze({
  get: (key) => {
    try { return window.localStorage.getItem(key); }
    catch (error) {
      if (error instanceof DOMException && error.name === 'SecurityError') {
        console.warn('Browser storage is unavailable; saved site preferences will not persist.');
        return null;
      }
      throw error;
    }
  },
  set: (key, value) => {
    try { window.localStorage.setItem(key, value); return true; }
    catch (error) {
      if (error instanceof DOMException && (error.name === 'SecurityError' || error.name === 'QuotaExceededError')) {
        console.warn('Browser storage is unavailable or full; this site preference was not saved.');
        return false;
      }
      throw error;
    }
  },
  remove: (key) => {
    try { window.localStorage.removeItem(key); return true; }
    catch (error) {
      if (error instanceof DOMException && error.name === 'SecurityError') {
        console.warn('Browser storage is unavailable; saved site data could not be cleared.');
        return false;
      }
      throw error;
    }
  }
});

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
  <div class="reading-progress" id="readingProgress" aria-hidden="true"><span></span></div>
  <header class="site-header" id="siteHeader">
    <div class="site-header-inner">
      <a class="brand-lockup" href="${sitePage('')}" aria-label="Devagya Vastu home">
        <img src="${siteAsset('assets/logo-mark.png')}" alt="" width="42" height="42">
        <span><strong>DEVAGYA</strong><small>VASTU &amp; SIGNATURE SPACES</small></span>
      </a>
      <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="primaryNav" aria-label="Open navigation"><span></span><span></span></button>
      <nav class="primary-nav" id="primaryNav" aria-label="Primary navigation">
        <a href="${sitePage('services')}">Services</a>
        <a href="${sitePage('methodology')}">Methodology</a>
        <div class="nav-tools">
          <button class="nav-tools-toggle" id="toolsToggle" type="button" aria-expanded="false" aria-controls="toolsMenu">Explore <span aria-hidden="true">⌄</span></button>
          <div class="nav-dropdown" id="toolsMenu" hidden>
            <a href="${sitePage('projects')}">Projects <small>Case-study framework and work in progress</small></a>
            <a href="${sitePage('insights')}">Insights <small>Notes on Vastu and spatial design</small></a>
            <a href="${sitePage('tools')}">Planning tools <small>Practical, non-certified planning aids</small></a>
            <a href="${sitePage('about')}">About Devagya <small>Our philosophy and approach</small></a>
            <a href="${sitePage('faq')}">FAQ <small>Answers about the process</small></a>
          </div>
        </div>
        <a href="${sitePage('book')}">Book</a>
        <a href="${sitePage('contact')}">Contact</a>
        <button class="language-toggle" type="button" data-language-toggle aria-label="Switch language to Hindi">हिन्दी</button>
        <a class="nav-cta" href="${sitePage('book')}">Request a consultation <span aria-hidden="true">↗</span></a>
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
      <a class="brand-lockup footer-brand" href="${sitePage('')}" aria-label="Devagya Vastu home">
        <img src="${siteAsset('assets/logo-mark.png')}" alt="" width="42" height="42">
        <span><strong>DEVAGYA</strong><small>VASTU &amp; SIGNATURE SPACES</small></span>
      </a>
      <div>
        <p data-i18n="footerIntro">Devagya Vastu offers spatial planning shaped by traditional principles, site conditions and contemporary architectural practice.</p>
        <nav class="footer-links" aria-label="Explore Devagya">
          <a href="${sitePage('services')}">Services</a>
          <a href="${sitePage('methodology')}">Methodology</a>
          <a href="${sitePage('projects')}">Projects</a>
          <a href="${sitePage('insights')}">Insights</a>
          <a href="${sitePage('tools')}">Planning tools</a>
          <a href="${sitePage('about')}">About</a>
          <a href="${sitePage('faq')}">FAQ</a>
          <a href="${sitePage('privacy')}">Privacy</a>
        </nav>
      </div>
      <div class="footer-contact">
        <a href="${contactLinks.whatsapp}" aria-label="WhatsApp Devagya Vastu">WhatsApp</a>
        <a href="${contactLinks.phone}">+91 94674 96725</a>
        <a href="${contactLinks.email}">devagyavastu@gmail.com</a>
      </div>
    </div>
    <div class="footer-bottom"><span>© <span data-current-year></span> Devagya Vastu</span><span>Traditional spatial guidance considered alongside architecture; no guaranteed outcomes are promised.</span></div>
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

document.querySelectorAll('#floatWa, #backToTop').forEach((element) => element.remove());

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
  const mobileNavQuery = window.matchMedia('(max-width: 820px)');
  const setMenuOpen = (open) => {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    primaryNav.classList.toggle('is-open', open);
    primaryNav.inert = mobileNavQuery.matches && !open;
    document.body.classList.toggle('menu-open', open);
    document.documentElement.classList.toggle('menu-open', open);
  };

  if (mobileNavQuery.matches) primaryNav.inert = true;

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenuOpen(!isOpen);
  });
  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  const handleNavigationBreakpoint = (event) => {
    if (event.matches) {
      primaryNav.inert = menuToggle.getAttribute('aria-expanded') !== 'true';
    } else {
      setMenuOpen(false);
    }
  };
  if (typeof mobileNavQuery.addEventListener === 'function') {
    mobileNavQuery.addEventListener('change', handleNavigationBreakpoint);
  } else if (typeof mobileNavQuery.addListener === 'function') {
    mobileNavQuery.addListener(handleNavigationBreakpoint);
  }
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

const progressBar = document.querySelector('#readingProgress span');
if (progressBar) {
  const updateProgress = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

const translations = {
  en: {
    footerIntro: 'Devagya Vastu offers spatial planning shaped by traditional principles, site conditions and contemporary architectural practice.',
    toolsTitle: 'Vastu tools for clearer design conversations.',
    toolsIntro: 'Devagya Vastu offers traditional Vastu consultation alongside architectural spatial planning and interior design. These interactive tools help organise questions and project information; they do not measure Vastu compliance or replace site surveys, professional design or code review.',
    roomPlannerTitle: 'Explore a room through two lenses.',
    readinessTitle: 'Prepare the information you have.'
  },
  hi: {
    footerIntro: 'देवग्या वास्तु पारंपरिक सिद्धांतों, स्थल की परिस्थितियों और समकालीन वास्तुकला के आधार पर स्थानिक योजना प्रदान करता है।',
    toolsTitle: 'बेहतर डिज़ाइन बातचीत के लिए वास्तु उपकरण।',
    toolsIntro: 'देवग्या वास्तु पारंपरिक वास्तु परामर्श को वास्तु-योजना और इंटीरियर डिज़ाइन के साथ देखता है। ये उपकरण प्रश्नों और परियोजना की जानकारी व्यवस्थित करने में मदद करते हैं; ये वास्तु अनुपालन का मापन नहीं करते और साइट सर्वेक्षण, पेशेवर डिज़ाइन या भवन नियमों की समीक्षा का विकल्प नहीं हैं।',
    roomPlannerTitle: 'एक कमरे को दो दृष्टिकोणों से देखें।',
    readinessTitle: 'उपलब्ध जानकारी तैयार करें।'
  }
};
// This client-side toggle helps visitors only; real Hindi SEO needs separate /hi/ pages with hreflang.
const languageButtons = document.querySelectorAll('[data-language-toggle]');
let language = window.devagyaStorage.get('devagya-language') === 'hi' ? 'hi' : 'en';
const setLanguage = (nextLanguage) => {
  language = nextLanguage;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const translation = translations[language][element.dataset.i18n];
    if (translation) {
      element.textContent = translation;
      element.lang = language;
    }
  });
  languageButtons.forEach((button) => {
    button.textContent = language === 'hi' ? 'English' : 'हिन्दी';
    button.setAttribute('aria-label', language === 'hi' ? 'Switch language to English' : 'Switch language to Hindi');
  });
};
languageButtons.forEach((button) => button.addEventListener('click', () => {
  const nextLanguage = language === 'en' ? 'hi' : 'en';
  window.devagyaStorage.set('devagya-language', nextLanguage);
  setLanguage(nextLanguage);
}));
setLanguage(language);

if (document.body) {
  window.requestAnimationFrame(() => document.body.classList.add('is-ready'));
}

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  navigator.serviceWorker.register(siteAsset('service-worker.js'), { scope: relativeRoot })
    .catch((error) => console.warn('The optional offline tools service worker could not be registered.', error));
}

// Privacy-friendly analytics hooks emit event names only; no analytics provider or personal data is sent.
const emitAnalytics = (name, detail = {}) => {
  window.dispatchEvent(new CustomEvent('devagya:analytics', { detail: Object.assign({ name }, detail) }));
};
document.addEventListener('click', (event) => {
  if (event.target.closest('a.nav-cta, a.button, button.button')) emitAnalytics('cta_click');
});
document.addEventListener('submit', (event) => {
  if (event.target instanceof HTMLFormElement) emitAnalytics('form_submit', { form: event.target.id || 'unnamed' });
});
window.addEventListener('devagya:tool-complete', (event) => emitAnalytics('tool_completion', { tool: (event.detail && event.detail.tool) || 'unnamed' }));
