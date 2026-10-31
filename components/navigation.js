const contactLinks = {
  whatsapp: 'https://wa.me/919467496725',
  phone: 'tel:+919467496725',
  email: 'mailto:devagyavastu@gmail.com',
  instagram: 'https://www.instagram.com/devagyavastu/'
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
            <a href="${sitePage('projects')}">Projects <small>Project stories, shared with permission</small></a>
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
        <a href="${contactLinks.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram @devagyavastu">@devagyavastu on Instagram</a>
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

const hindiTranslations = {
  'Skip to content': 'मुख्य सामग्री पर जाएँ',
  'Open navigation': 'नेविगेशन खोलें',
  'Close navigation': 'नेविगेशन बंद करें',
  'Primary navigation': 'मुख्य नेविगेशन',
  'Explore Devagya': 'देवग्या के बारे में जानें',
  'Services': 'सेवाएँ',
  'Methodology': 'कार्य-पद्धति',
  'Explore': 'जानें',
  'Projects': 'परियोजनाएँ',
  'Project stories, shared with permission': 'अनुमति से साझा की गई परियोजना-कथाएँ',
  'Insights': 'विचार',
  'Notes on Vastu and spatial design': 'वास्तु और स्थानिक डिज़ाइन पर विचार',
  'Planning tools': 'योजना उपकरण',
  'Practical, non-certified planning aids': 'व्यावहारिक योजना सहायता',
  'About Devagya': 'देवग्या के बारे में',
  'Our philosophy and approach': 'हमारा दृष्टिकोण और विचार',
  'FAQ': 'अक्सर पूछे जाने वाले प्रश्न',
  'Answers about the process': 'प्रक्रिया से जुड़े उत्तर',
  'Book': 'बुक करें',
  'Contact': 'संपर्क',
  'Privacy': 'गोपनीयता',
  'Request a consultation': 'परामर्श का अनुरोध करें',
  'Switch language to Hindi': 'हिंदी में बदलें',
  'Switch language to English': 'अंग्रेज़ी में बदलें',
  'Call': 'कॉल करें',
  'Email': 'ईमेल',
  'WhatsApp': 'व्हाट्सऐप',
  'VASTU & SIGNATURE SPACES': 'वास्तु और विशिष्ट स्थान',
  'Open WhatsApp': 'व्हाट्सऐप खोलें',
  'Call Devagya': 'देवग्या को कॉल करें',
  'Email Devagya': 'देवग्या को ईमेल करें',
  'WhatsApp Devagya Vastu': 'देवग्या वास्तु को व्हाट्सऐप करें',
  '© ': '© ',
  'Traditional spatial guidance considered alongside architecture; no guaranteed outcomes are promised.': 'पारंपरिक स्थानिक मार्गदर्शन को वास्तुकला के साथ देखा जाता है; किसी परिणाम की गारंटी नहीं दी जाती।',
  'Devagya Vastu offers spatial planning shaped by traditional principles, site conditions and contemporary architectural practice.': 'देवग्या वास्तु पारंपरिक सिद्धांतों, स्थल की परिस्थितियों और समकालीन वास्तुकला के आधार पर स्थानिक योजना प्रदान करता है।',
  'Devagya Vastu': 'देवग्या वास्तु',
  'Spatial design, considered': 'सोच-समझकर किया गया स्थानिक डिज़ाइन',
  'Devagya Vastu for thoughtful spatial design.': 'विचारपूर्ण स्थानिक डिज़ाइन के लिए देवग्या वास्तु।',
  'Devagya Vastu for thoughtful': 'देवग्या वास्तु के लिए विचारपूर्ण',
  'spatial design.': 'स्थानिक डिज़ाइन।',
  'Devagya Vastu provides traditional Vastu consultation alongside architectural spatial planning and interior design for homes, workplaces and developments. Recommendations consider site conditions, orientation, daylight, ventilation and the needs of the people using each space.': 'देवग्या वास्तु घरों, कार्यस्थलों और विकास परियोजनाओं के लिए पारंपरिक वास्तु परामर्श के साथ वास्तु-योजना और इंटीरियर डिज़ाइन प्रदान करता है। सुझावों में स्थल की परिस्थितियों, दिशा, प्राकृतिक रोशनी, हवा के आवागमन और स्थान का उपयोग करने वाले लोगों की ज़रूरतों को ध्यान में रखा जाता है।',
  'Thoughtful guidance for homes, interiors and workplaces': 'घरों, इंटीरियर और कार्यस्थलों के लिए विचारपूर्ण मार्गदर्शन',
  'Useful tools.': 'उपयोगी उपकरण।',
  'Clearer next steps.': 'अगले कदम स्पष्ट।',
  'Explore the toolkit': 'योजना उपकरण देखें',
  'Explore planning tools': 'योजना उपकरण देखें',
  'SPATIAL STUDY': 'स्थानिक अध्ययन',
  'ORIENTATION': 'दिशा',
  'LIGHT · FLOW · USE': 'रोशनी · आवाजाही · उपयोग',
  '01 / ORIENTATION': '01 / दिशा',
  '02 / SELF-ASSESSMENT': '02 / तैयारी',
  '03 / LAYOUT STUDY': '03 / लेआउट अध्ययन',
  'Explore a direction, review a floor plan or compare layout approaches. Each tool is a practical starting point for a more informed design conversation.': 'दिशा जानें, फ़्लोर प्लान की समीक्षा करें या लेआउट के विकल्पों की तुलना करें। हर उपकरण बेहतर डिज़ाइन चर्चा की एक व्यावहारिक शुरुआत है।',
  'Room-by-room planner': 'कमरे के अनुसार योजना',
  'Compare traditional Vastu considerations with practical light, ventilation and interior-design questions.': 'पारंपरिक वास्तु विचारों की तुलना रोशनी, हवा और इंटीरियर डिज़ाइन से जुड़े व्यावहारिक प्रश्नों से करें।',
  'Explore room considerations': 'कमरे से जुड़े विचार देखें',
  'Readiness checklist': 'तैयारी सूची',
  'Track which planning information is ready to share and return to your saved progress later.': 'साझा करने के लिए तैयार योजना-संबंधी जानकारी दर्ज करें और बाद में अपनी सेव की गई प्रगति पर लौटें।',
  'Review the checklist': 'तैयारी सूची देखें',
  'Layout comparison': 'लेआउट की तुलना',
  'Use an illustrative slider to compare a schematic before-and-after plan and its design rationale.': 'एक उदाहरणात्मक स्लाइडर से योजनाबद्ध पहले और बाद के लेआउट तथा उनके डिज़ाइन कारणों की तुलना करें।',
  'Compare the schematic plans': 'योजनाबद्ध लेआउट की तुलना करें',
  'A considered process': 'सोच-समझकर अपनाई गई प्रक्रिया',
  'From first plan': 'पहली योजना से',
  'to practical direction.': 'व्यावहारिक दिशा तक।',
  'Every recommendation is grounded in the project brief, site conditions and the decisions still open to you.': 'हर सुझाव परियोजना की जानकारी, स्थल की परिस्थितियों और आपके सामने मौजूद विकल्पों पर आधारित होता है।',
  'How we work': 'हम कैसे काम करते हैं',
  'Share the brief': 'परियोजना की जानकारी साझा करें',
  'Tell us what you are planning and share the drawings you have.': 'आप क्या योजना बना रहे हैं, हमें बताएँ और उपलब्ध नक्शे साझा करें।',
  'Read the space': 'स्थान को समझें',
  'Review orientation, movement, light and how each room needs to work.': 'दिशा, आवाजाही, रोशनी और हर कमरे के उपयोग की समीक्षा करें।',
  'Plan the next move': 'अगला कदम तय करें',
  'Receive practical observations for your next design conversation.': 'अगली डिज़ाइन चर्चा के लिए व्यावहारिक सुझाव पाएँ।',
  'Interior design consultation': 'इंटीरियर डिज़ाइन परामर्श',
  'Interiors shaped around how you live.': 'आपकी जीवनशैली के अनुरूप इंटीरियर।',
  'Our spatial and interior design consultancy considers proportion, materials, light and circulation alongside traditional Vastu preferences. Recommendations stay grounded in your brief, site conditions and the wider architectural plan.': 'हमारी स्थानिक और इंटीरियर डिज़ाइन परामर्श सेवा पारंपरिक वास्तु प्राथमिकताओं के साथ अनुपात, सामग्री, रोशनी और आवाजाही पर विचार करती है। सुझाव आपकी परियोजना की जानकारी, स्थल की परिस्थितियों और समग्र वास्तु-योजना पर आधारित होते हैं।',
  'Explore interior planning': 'इंटीरियर योजना देखें',
  'A connected design process': 'एक जुड़ी हुई डिज़ाइन प्रक्रिया',
  'Architectural spatial planning sets the relationships between rooms; interior design consultation develops the material, lighting and furniture choices that make those spaces work in daily use.': 'वास्तु-योजना कमरों के बीच संबंध तय करती है; इंटीरियर परामर्श सामग्री, रोशनी और फ़र्नीचर के ऐसे विकल्प विकसित करता है जो रोज़मर्रा में उपयोगी हों।',
  'Explore interior design': 'इंटीरियर डिज़ाइन देखें',
  'Make the next design decision with clarity.': 'अगला डिज़ाइन निर्णय स्पष्टता से लें।',
  'PRACTICAL PLANNING AIDS': 'व्यावहारिक योजना सहायता',
  'Vastu tools for clearer design conversations.': 'बेहतर डिज़ाइन चर्चा के लिए वास्तु उपकरण।',
  'Devagya Vastu offers traditional Vastu consultation alongside architectural spatial planning and interior design. These interactive tools help organise questions and project information; they do not measure Vastu compliance or replace site surveys, professional design or code review.': 'देवग्या वास्तु पारंपरिक वास्तु परामर्श के साथ वास्तु-योजना और इंटीरियर डिज़ाइन प्रदान करता है। ये इंटरैक्टिव उपकरण प्रश्नों और परियोजना की जानकारी व्यवस्थित करने में मदद करते हैं; ये वास्तु-अनुपालन नहीं मापते और स्थल सर्वेक्षण, पेशेवर डिज़ाइन या भवन नियमों की समीक्षा का विकल्प नहीं हैं।',
  '01 / Room-by-room planner': '01 / कमरे के अनुसार योजना',
  'Explore a room through two lenses.': 'कमरे को दो दृष्टिकोणों से देखें।',
  'Select a room in the schematic plan. Traditional Vastu considerations are shown separately from architectural and interior-design questions. The diagram is illustrative, not a recommended layout.': 'योजनाबद्ध नक्शे में एक कमरा चुनें। पारंपरिक वास्तु विचारों को वास्तुकला और इंटीरियर से जुड़े प्रश्नों से अलग दिखाया गया है। यह चित्र केवल उदाहरण है, सुझाया गया लेआउट नहीं।',
  'Entry': 'प्रवेश',
  'Living': 'बैठक',
  'Living room': 'बैठक कक्ष',
  'Study': 'अध्ययन कक्ष',
  'Kitchen': 'रसोई',
  'Bathrooms': 'स्नानघर',
  'Pooja /': 'पूजा /',
  'quiet': 'शांत कक्ष',
  'Main bedroom': 'मुख्य शयनकक्ष',
  'Choose a room': 'एक कमरा चुनें',
  'Traditional Vastu lens': 'पारंपरिक वास्तु दृष्टिकोण',
  'Consider the room\'s relationship to direction and the wider plan without treating one placement as a universal rule.': 'दिशा और समग्र योजना के संदर्भ में कमरे पर विचार करें; किसी एक स्थान को सार्वभौमिक नियम न मानें।',
  'Architecture and interiors lens': 'वास्तुकला और इंटीरियर दृष्टिकोण',
  'Review daylight, ventilation, movement, proportions, materials and applicable safety requirements for the actual site.': 'वास्तविक स्थल के लिए प्राकृतिक रोशनी, हवा, आवाजाही, अनुपात, सामग्री और लागू सुरक्षा आवश्यकताओं की समीक्षा करें।',
  '02 / Readiness checklist': '02 / तैयारी सूची',
  'Prepare the information you have.': 'उपलब्ध जानकारी तैयार करें।',
  'A planning checklist, not a score or Vastu certification. Progress is saved locally in this browser.': 'यह योजना सूची है, कोई अंक या वास्तु प्रमाणपत्र नहीं। प्रगति इसी ब्राउज़र में सेव होती है।',
  'Plot and site': 'भूखंड और स्थल',
  'Approximate plot location or site address': 'भूखंड का अनुमानित स्थान या स्थल का पता',
  'Site plan or plot dimensions, if available': 'उपलब्ध हो तो साइट प्लान या भूखंड का माप',
  'Entry and orientation': 'प्रवेश और दिशा',
  'North direction marked on a drawing': 'नक्शे पर उत्तर दिशा अंकित हो',
  'Proposed entry and access route': 'प्रस्तावित प्रवेश और आने-जाने का मार्ग',
  'Layout and rooms': 'लेआउट और कमरे',
  'Current floor plan or sketch': 'मौजूदा फ़्लोर प्लान या स्केच',
  'Intended use of each room': 'हर कमरे का प्रस्तावित उपयोग',
  'Services and constraints': 'सेवाएँ और सीमाएँ',
  'Known plumbing, electrical or HVAC constraints': 'प्लंबिंग, बिजली या HVAC से जुड़ी ज्ञात सीमाएँ',
  'Structural or code constraints from the project team': 'परियोजना टीम से मिली संरचनात्मक या नियम-संबंधी सीमाएँ',
  'Interiors and priorities': 'इंटीरियर और प्राथमिकताएँ',
  'Interior preferences, materials or lighting questions': 'इंटीरियर की पसंद, सामग्री या रोशनी से जुड़े प्रश्न',
  'A short list of priorities and open questions': 'प्राथमिकताओं और अनसुलझे प्रश्नों की छोटी सूची',
  'Clear my progress': 'मेरी प्रगति मिटाएँ',
  'Request a review': 'समीक्षा का अनुरोध करें',
  '03 / Before and after comparison': '03 / पहले और बाद की तुलना',
  'Compare an illustrative layout response.': 'लेआउट के उदाहरणात्मक बदलाव की तुलना करें।',
  'This schematic demonstrates a possible furniture and circulation adjustment. It is not a real client plan, a construction drawing or a guarantee of improved performance.': 'यह उदाहरण फ़र्नीचर और आवाजाही में संभावित बदलाव दिखाता है। यह वास्तविक ग्राहक योजना, निर्माण नक्शा या बेहतर परिणाम की गारंटी नहीं है।',
  'Living / shared': 'बैठक / साझा स्थान',
  'Kitchen': 'रसोई',
  'Private room': 'निजी कक्ष',
  'Clear arrival': 'स्पष्ट प्रवेश',
  'Entry turn': 'प्रवेश का मोड़',
  'Illustrative change: shifting a furniture boundary can create a clearer arrival sequence. Any real intervention depends on project-specific structure, circulation and code review.': 'उदाहरणात्मक बदलाव: फ़र्नीचर की सीमा बदलने से प्रवेश का मार्ग अधिक स्पष्ट हो सकता है। वास्तविक बदलाव परियोजना की संरचना, आवाजाही और नियमों की समीक्षा पर निर्भर करता है।',
  '04 / Project brief builder': '04 / परियोजना विवरण तैयार करें',
  'Shape a short project brief.': 'परियोजना का संक्षिप्त विवरण बनाएँ।',
  'Complete each step to draft a summary. It stays in this browser until you explicitly send it through the form or open WhatsApp.': 'सारांश बनाने के लिए हर चरण पूरा करें। फ़ॉर्म से भेजने या व्हाट्सऐप खोलने तक यह इसी ब्राउज़र में रहेगा।',
  'Step 1 of 3: Project basics': 'चरण 1/3: परियोजना की जानकारी',
  'Step 2 of 3: Location and goals': 'चरण 2/3: स्थान और उद्देश्य',
  'Step 3 of 3: Constraints and contact': 'चरण 3/3: सीमाएँ और संपर्क',
  'Property type': 'संपत्ति का प्रकार',
  'Project stage': 'परियोजना का चरण',
  'Choose one': 'एक विकल्प चुनें',
  'Home': 'घर',
  'Workplace / office': 'कार्यस्थल / कार्यालय',
  'Development': 'विकास परियोजना',
  'Interior project': 'इंटीरियर परियोजना',
  'Exploring a site': 'स्थल की खोज',
  'Early planning': 'प्रारंभिक योजना',
  'Under construction': 'निर्माणाधीन',
  'Existing space / renovation': 'मौजूदा स्थान / नवीनीकरण',
  'City and country': 'शहर और देश',
  'Primary goal': 'मुख्य उद्देश्य',
  'Vastu consultation': 'वास्तु परामर्श',
  'Architecture and spatial planning': 'वास्तुकला और स्थानिक योजना',
  'Vastu + spatial design': 'वास्तु + स्थानिक डिज़ाइन',
  'Vastu with spatial design': 'वास्तु और स्थानिक डिज़ाइन',
  'Interior design consultation': 'इंटीरियर डिज़ाइन परामर्श',
  'Key constraints or open questions': 'मुख्य सीमाएँ या अनसुलझे प्रश्न',
  'Your email': 'आपका ईमेल',
  'Back': 'वापस',
  'Continue': 'आगे बढ़ें',
  'Send with Web3Forms': 'Web3Forms से भेजें',
  'Open draft in WhatsApp': 'व्हाट्सऐप में विवरण खोलें',
  'Clear draft': 'ड्राफ़्ट मिटाएँ',
  'Your project summary will appear here as you complete the steps.': 'चरण पूरे करने पर परियोजना का सारांश यहाँ दिखेगा।',
  '05 / Service recommender': '05 / सेवा सुझाव',
  'Which kind of support fits your project?': 'आपकी परियोजना के लिए कौन-सी सहायता उपयुक्त है?',
  'Choose the closest match. This guide is an orientation aid; the right scope is confirmed in conversation.': 'सबसे उपयुक्त विकल्प चुनें। यह केवल मार्गदर्शन है; सही कार्य-क्षेत्र बातचीत में तय होगा।',
  'Project type': 'परियोजना का प्रकार',
  'Workplace': 'कार्यस्थल',
  'Interior-only scope': 'केवल इंटीरियर',
  'What kind of support are you looking for?': 'आप किस तरह की सहायता चाहते हैं?',
  'A focused Vastu review': 'केंद्रित वास्तु समीक्षा',
  'Vastu and spatial planning together': 'वास्तु और स्थानिक योजना साथ में',
  'Show a possible fit': 'उपयुक्त विकल्प देखें',
  'Discuss the scope': 'कार्य-क्षेत्र पर बात करें',
  '06 / Insight of the week': '06 / इस सप्ताह का विचार',
  'A small prompt for a more considered plan.': 'बेहतर योजना के लिए एक छोटा सुझाव।',
  'A useful layout question can start with one simple check: where does daylight enter, and how does the room work at different times of day?': 'लेआउट से जुड़ा एक उपयोगी प्रश्न: प्राकृतिक रोशनी कहाँ से आती है, और दिन के अलग-अलग समय में कमरा कैसे काम करता है?',
  'Before moving a wall, map the everyday route through the room. Can people pass without interrupting the main activity?': 'दीवार बदलने से पहले कमरे में रोज़मर्रा के रास्ते देखें। क्या मुख्य गतिविधि में बाधा डाले बिना लोग आ-जा सकते हैं?',
  'An orientation mark on a plan is only helpful if it is verified. Confirm north and the site context before comparing directional preferences.': 'नक्शे पर दिशा का निशान तभी उपयोगी है जब उसकी पुष्टि हो। दिशाओं से जुड़ी पसंद की तुलना से पहले उत्तर और स्थल की जानकारी सत्यापित करें।',
  'Air movement depends on openings, pressure, climate and obstructions. Review ventilation with the project professionals responsible for building services.': 'हवा का आवागमन खुले स्थानों, दबाव, जलवायु और अवरोधों पर निर्भर करता है। भवन सेवाओं के ज़िम्मेदार विशेषज्ञों के साथ वेंटिलेशन की समीक्षा करें।',
  'Interior decisions connect to the plan: test furniture clearances, light levels, materials and maintenance together rather than as isolated choices.': 'इंटीरियर के निर्णय योजना से जुड़े होते हैं: फ़र्नीचर की जगह, रोशनी, सामग्री और रखरखाव को अलग-अलग नहीं, साथ में परखें।',
  'Visit the Devagya Vastu insights journal': 'देवग्या वास्तु के विचार पढ़ें',
  '07 / Consultation request': '07 / परामर्श अनुरोध',
  'Ask about a consultation time.': 'परामर्श के समय के बारे में पूछें।',
  'Share a preferred date range and meeting mode. Devagya confirms availability directly; the website does not display invented or live open slots.': 'अपनी पसंद की तारीखें और बैठक का तरीका बताएँ। देवग्या उपलब्धता की पुष्टि सीधे करेगा; वेबसाइट पर काल्पनिक या लाइव समय नहीं दिखाए जाते।',
  '08 / Starter guide': '08 / शुरुआती मार्गदर्शिका',
  'Request the spatial planning starter guide.': 'स्थानिक योजना की शुरुआती मार्गदर्शिका का अनुरोध करें।',
  'The guide is not available yet. We will not collect your email until an approved PDF is supplied.': 'मार्गदर्शिका अभी उपलब्ध नहीं है। स्वीकृत PDF मिलने तक आपका ईमेल नहीं लिया जाएगा।',
  'Email address': 'ईमेल पता',
  'Request the guide': 'मार्गदर्शिका का अनुरोध करें',
  '09 / Language': '09 / भाषा',
  'Choose English or हिन्दी.': 'अंग्रेज़ी या हिन्दी चुनें।',
  'The language control translates navigation, key page text and interactive controls, and saves your choice on this device. Some detailed content may remain in English; Hindi search indexing requires dedicated Hindi pages with appropriate `hreflang` metadata.': 'वेबसाइट का भाषा विकल्प नेविगेशन, मुख्य पेज सामग्री और इंटरैक्टिव नियंत्रणों को हिंदी में दिखाता है तथा आपकी पसंद इस डिवाइस पर सेव करता है। कुछ विस्तृत सामग्री अंग्रेज़ी में रह सकती है; हिंदी खोज परिणामों के लिए अलग हिंदी पेज और उपयुक्त hreflang जानकारी आवश्यक है।',
  'Traditional guidance may consider entry direction and its relationship to the plan. Treat these as discussion prompts, not universal placement rules.': 'पारंपरिक मार्गदर्शन में प्रवेश की दिशा और योजना से उसके संबंध पर विचार किया जा सकता है। इसे चर्चा के संकेत मानें, सार्वभौमिक स्थान-नियम नहीं।',
  'Review clear access, door swing, weather protection, daylight, privacy and an unobstructed route into the home.': 'सुगम पहुँच, दरवाज़े के खुलने की दिशा, मौसम से सुरक्षा, प्राकृतिक रोशनी, निजता और घर तक बिना रुकावट के रास्ते की समीक्षा करें।',
  'Consider how the room relates to the wider directional framework and the intended use of shared space.': 'कमरे का व्यापक दिशात्मक ढाँचे और साझा स्थान के प्रस्तावित उपयोग से संबंध देखें।',
  'Check seating, movement paths, glare, cross-ventilation, views and how the room supports different household activities.': 'बैठने की व्यवस्था, आवाजाही के रास्ते, चकाचौंध, आर-पार हवा, दृश्य और घरेलू गतिविधियों के लिए कमरे की उपयोगिता जाँचें।',
  'Traditional preferences for kitchen placement vary. Discuss them alongside the building layout and the people who will use the kitchen.': 'रसोई के स्थान को लेकर पारंपरिक प्राथमिकताएँ अलग-अलग हो सकती हैं। भवन के लेआउट और रसोई का उपयोग करने वाले लोगों की ज़रूरतों के साथ इन पर चर्चा करें।',
  'Coordinate safe appliance clearances, heat, exhaust, make-up air, daylight, cleaning access and plumbing with qualified project professionals.': 'उपकरणों के सुरक्षित अंतर, गर्मी, एग्ज़ॉस्ट, ताज़ी हवा, प्राकृतिक रोशनी, सफ़ाई की पहुँच और प्लंबिंग का समन्वय योग्य परियोजना विशेषज्ञों के साथ करें।',
  'Traditional room-placement ideas can be one input when the layout is still flexible; they do not establish an outcome or certify a plan.': 'लेआउट में बदलाव संभव होने पर कमरे के स्थान से जुड़े पारंपरिक विचार एक पहलू हो सकते हैं; वे किसी परिणाम की पुष्टि या योजना को प्रमाणित नहीं करते।',
  'Review privacy, acoustics, daylight control, accessible circulation, storage and comfortable furniture clearances.': 'निजता, ध्वनि, प्राकृतिक रोशनी पर नियंत्रण, सुलभ आवाजाही, भंडारण और फ़र्नीचर के लिए आरामदायक जगह की समीक्षा करें।',
  'Use directional considerations as an optional planning lens rather than a fixed rule for attention or achievement.': 'ध्यान या उपलब्धि के लिए निश्चित नियम के बजाय दिशाओं से जुड़े विचारों को वैकल्पिक योजना-दृष्टिकोण के रूप में देखें।',
  'Consider task lighting, glare, sound, ventilation, power access, sightlines and separation from busy routes.': 'काम की रोशनी, चकाचौंध, ध्वनि, वेंटिलेशन, बिजली की पहुँच, दृश्य और व्यस्त रास्तों से दूरी पर विचार करें।',
  'Where a quiet or reflective room is part of the brief, discuss its placement in relation to tradition and household preferences.': 'यदि परियोजना में शांत या चिंतन का कमरा शामिल है, तो परंपरा और परिवार की प्राथमिकताओं के संदर्भ में उसके स्थान पर चर्चा करें।',
  'Plan for calm access, privacy, ventilation, safe lighting and materials that suit the intended use and maintenance.': 'शांत पहुँच, निजता, वेंटिलेशन, सुरक्षित रोशनी और प्रस्तावित उपयोग व रखरखाव के अनुकूल सामग्री की योजना बनाएँ।',
  'Traditional preferences can be discussed, while existing plumbing, waterproofing and building constraints remain central.': 'मौजूदा प्लंबिंग, वॉटरप्रूफिंग और भवन की सीमाओं को प्राथमिकता देते हुए पारंपरिक प्राथमिकताओं पर चर्चा की जा सकती है।',
  'Prioritise drainage, waterproofing, ventilation, slip resistance, privacy and safe electrical separation with qualified professionals.': 'योग्य विशेषज्ञों के साथ जल-निकासी, वॉटरप्रूफिंग, वेंटिलेशन, फिसलन से बचाव, निजता और बिजली की सुरक्षित दूरी को प्राथमिकता दें।',
  'Read how local preferences are stored': 'स्थानीय प्राथमिकताएँ कैसे सेव होती हैं, पढ़ें',
  'Important:': 'महत्वपूर्ण:',
  'These tools are general planning aids, not Vastu ratings, site surveys, architectural or engineering assessments, or safety/code reviews. Vastu is presented as a traditional spatial framework and no health, wealth, career or other outcome is promised.': 'ये उपकरण सामान्य योजना सहायता हैं; वास्तु रेटिंग, स्थल सर्वेक्षण, वास्तुकला या इंजीनियरिंग मूल्यांकन अथवा सुरक्षा/नियम समीक्षा नहीं। वास्तु को पारंपरिक स्थानिक ढाँचे के रूप में प्रस्तुत किया गया है; स्वास्थ्य, धन, करियर या किसी अन्य परिणाम का वादा नहीं किया जाता।',
  'Consultation request': 'परामर्श अनुरोध',
  'Request an online Vastu consultation.': 'ऑनलाइन वास्तु परामर्श का अनुरोध करें।',
  'Devagya Vastu offers traditional spatial consultation alongside architectural and interior-design considerations for homes, workplaces and developments. Share a preferred date range and meeting mode; this form is a request, not a confirmed appointment.': 'देवग्या वास्तु घरों, कार्यस्थलों और विकास परियोजनाओं के लिए पारंपरिक स्थानिक परामर्श के साथ वास्तुकला और इंटीरियर पर विचार करता है। अपनी पसंद की तारीखें और बैठक का तरीका बताएँ; यह अनुरोध है, पक्की नियुक्ति नहीं।',
  'Name': 'नाम',
  'Preferred date from': 'पसंदीदा तारीख से',
  'Preferred date to': 'पसंदीदा तारीख तक',
  'Preferred mode': 'पसंदीदा माध्यम',
  'Online video call': 'ऑनलाइन वीडियो कॉल',
  'Phone': 'फ़ोन',
  'In person, if practical': 'संभव हो तो आमने-सामने',
  'City / time zone': 'शहर / समय क्षेत्र',
  'City and country': 'शहर और देश',
  'What would you like to discuss?': 'आप किस विषय पर बात करना चाहेंगे?',
  'The preferred dates are requests only. No live availability is displayed, and submitting this form does not reserve a time.': 'पसंदीदा तारीखें केवल अनुरोध हैं। लाइव उपलब्धता नहीं दिखाई जाती और फ़ॉर्म भेजने से समय आरक्षित नहीं होता।',
  'Send consultation request': 'परामर्श अनुरोध भेजें',
  'Optional scheduler embed:': 'वैकल्पिक शेड्यूलर:',
  'No third-party booking URL has been supplied. Until one is provided, consultation timing is coordinated directly after an enquiry.': 'किसी बाहरी बुकिंग लिंक की जानकारी नहीं दी गई है। ऐसा लिंक मिलने तक परामर्श का समय पूछताछ के बाद सीधे तय होगा।',
  'Vastu architecture projects, documented honestly.': 'वास्तु और वास्तुकला परियोजनाएँ, ईमानदारी से दर्ज।',
  'No client case studies are published here yet.': 'अभी यहाँ किसी ग्राहक की परियोजना-कथा प्रकाशित नहीं है।',
  'We share project details only when they are verified and the client has approved publication. Contact us to discuss your own project and the support it may need.': 'परियोजना का विवरण सत्यापित होने और ग्राहक की अनुमति मिलने पर ही साझा किया जाता है। अपनी परियोजना और आवश्यक सहायता पर चर्चा के लिए हमसे संपर्क करें।',
  'What a project story will cover.': 'परियोजना-कथा में क्या शामिल होगा।',
  'The project question': 'परियोजना का प्रश्न',
  'The brief, priorities and key constraints, described with the client\'s permission.': 'ग्राहक की अनुमति से परियोजना का उद्देश्य, प्राथमिकताएँ और मुख्य सीमाएँ।',
  'Site and drawings': 'स्थल और नक्शे',
  'Relevant site conditions and design information, shared only at an approved level of detail.': 'संबंधित स्थल परिस्थितियाँ और डिज़ाइन जानकारी, केवल स्वीकृत विवरण के साथ।',
  'What was considered': 'किन बातों पर विचार हुआ',
  'Relevant spatial questions such as orientation, circulation, daylight and room use.': 'दिशा, आवाजाही, प्राकृतिक रोशनी और कमरों के उपयोग जैसे स्थानिक प्रश्न।',
  'Options and outcomes': 'विकल्प और परिणाम',
  'Design options discussed and decisions made; outcomes appear only when documented and approved.': 'चर्चित डिज़ाइन विकल्प और लिए गए निर्णय; परिणाम दस्तावेज़ित और स्वीकृत होने पर ही प्रकाशित होंगे।',
  'Have a space to plan?': 'क्या आप किसी स्थान की योजना बना रहे हैं?',
  'Notes on Vastu & spatial design.': 'वास्तु और स्थानिक डिज़ाइन पर विचार।',
  'Practical notes on Vastu, architecture, spatial planning and interiors—grounded in traditional principles, site conditions and the way people use a space.': 'वास्तु, वास्तुकला, स्थानिक योजना और इंटीरियर पर व्यावहारिक विचार—पारंपरिक सिद्धांतों, स्थल की परिस्थितियों और लोगों के उपयोग पर आधारित।',
  'A planning prompt': 'योजना के लिए एक सुझाव',
  'Themes we explore': 'हम जिन विषयों पर विचार करते हैं',
  'Questions that shape a space.': 'स्थान को आकार देने वाले प्रश्न।',
  'Long-form articles are not published yet. Explore the planning tools for practical prompts you can use now.': 'विस्तृत लेख अभी प्रकाशित नहीं हैं। अभी उपयोगी सुझावों के लिए योजना उपकरण देखें।',
  'Start with a clearer conversation.': 'स्पष्ट बातचीत से शुरुआत करें।',
  'Frequently asked questions.': 'अक्सर पूछे जाने वाले प्रश्न।',
  'Still have a question?': 'क्या आपका कोई और प्रश्न है?',
  'Speak with our team.': 'हमारी टीम से बात करें।',
  'Contact Devagya Vastu about your project.': 'अपनी परियोजना के बारे में देवग्या वास्तु से संपर्क करें।',
  'Full name *': 'पूरा नाम *',
  'Email address *': 'ईमेल पता *',
  'Phone / WhatsApp *': 'फ़ोन / व्हाट्सऐप *',
  'Project location *': 'परियोजना का स्थान *',
  'Project scope *': 'परियोजना का दायरा *',
  'Choose a scope': 'दायरा चुनें',
  'Residential Custom Home': 'निजी आवास',
  'Office': 'कार्यालय',
  'Commercial Development': 'व्यावसायिक विकास परियोजना',
  'Site layout status *': 'स्थल की स्थिति *',
  'Choose the current status': 'वर्तमान स्थिति चुनें',
  'Existing Structure': 'मौजूदा संरचना',
  'Vacant Land': 'खाली भूखंड',
  'Architectural plans or sketches': 'वास्तु नक्शे या स्केच',
  'Drop plans here, or browse files': 'नक्शे यहाँ छोड़ें या फ़ाइलें चुनें',
  'What is not working in the space? *': 'स्थान में क्या ठीक से काम नहीं कर रहा? *',
  'I would also like occasional updates about spatial design (optional).': 'मैं स्थानिक डिज़ाइन पर कभी-कभार अपडेट भी पाना चाहूँगा/चाहूँगी (वैकल्पिक)।',
  'Send project enquiry': 'परियोजना की पूछताछ भेजें',
  'Direct channels': 'सीधे संपर्क के विकल्प',
  'WhatsApp Direct': 'सीधे व्हाट्सऐप करें',
  'Message +91 94674 96725': '+91 94674 96725 पर संदेश भेजें',
  'Direct voice call': 'सीधे फ़ोन करें',
  'Corporate email': 'व्यावसायिक ईमेल',
  'Instagram': 'इंस्टाग्राम',
  '@devagyavastu on Instagram': 'इंस्टाग्राम पर @devagyavastu',
  'About Devagya Vastu: our story & philosophy.': 'देवग्या वास्तु: हमारी कहानी और विचार।',
  'Want to know more before reaching out?': 'संपर्क करने से पहले और जानना चाहते हैं?',
  'Tradition, considered. Design, grounded.': 'परंपरा पर विचार। डिज़ाइन का ठोस आधार।',
  'Architectural Vastu and spatial design services.': 'वास्तु और स्थानिक डिज़ाइन सेवाएँ।',
  'Architectural spatial planning & Vastu for homes': 'घरों के लिए वास्तु और वास्तु-योजना',
  'Vastu for offices and workplaces': 'कार्यालयों और कार्यस्थलों के लिए वास्तु',
  'Developer & Multi-Unit Planning': 'डेवलपर और बहु-इकाई योजना',
  'Vastu interior design, considered with the architecture.': 'वास्तुकला के साथ विचार किया गया वास्तु इंटीरियर डिज़ाइन।',
  'Vastu and architecture, considered together.': 'वास्तु और वास्तुकला पर साथ-साथ विचार।',
  'Interior design within the architectural plan.': 'वास्तु-योजना के भीतर इंटीरियर डिज़ाइन।',
  '1. Vastu Shastra': '1. वास्तु शास्त्र',
  '2. Architectural Physics': '2. वास्तुकला भौतिकी',
  '3. Environmental & Positive Psychology': '3. पर्यावरण और सकारात्मक मनोविज्ञान',
  'A note on scientific integrity.': 'वैज्ञानिक ईमानदारी पर एक टिप्पणी।',
  'Ready to apply this to your project?': 'क्या इसे अपनी परियोजना में लागू करने के लिए तैयार हैं?',
  'A spatial framework, read through the plan.': 'नक्शे के माध्यम से समझा गया स्थानिक ढाँचा।',
  'Forty-five points of reference.': 'पैंतालीस संदर्भ बिंदु।',
  'One complete plan.': 'एक समग्र योजना।',
  'See how the framework applies to your plan.': 'देखें कि यह ढाँचा आपकी योजना पर कैसे लागू होता है।',
  'Request a Vastu spatial design consultation.': 'वास्तु और स्थानिक डिज़ाइन परामर्श का अनुरोध करें।',
  'Practical planning aids': 'व्यावहारिक योजना सहायता',
  '0 of 10 items checked. Check any details you already have.': '10 में से 0 जानकारी चुनी गई। जो विवरण उपलब्ध हैं, उन्हें चुनें।',
  'Switch language to English': 'अंग्रेज़ी में बदलें',
  'Switch language to Hindi': 'हिंदी में बदलें',
  'Devagya Vastu | Architectural Vastu & Interior Design': 'देवग्या वास्तु | वास्तु और इंटीरियर डिज़ाइन',
  'About Devagya Vastu | Our Story & Philosophy': 'देवग्या वास्तु | हमारी कहानी और विचार',
  'Services | Vastu for Residential, Corporate & Developer Projects': 'सेवाएँ | आवासीय, व्यावसायिक और विकास परियोजनाओं के लिए वास्तु',
  'Spatial Design Methodology | Devagya Vastu': 'स्थानिक डिज़ाइन पद्धति | देवग्या वास्तु',
  'Methodology | Vastu + Architectural Physics + Environmental Psychology': 'पद्धति | वास्तु + वास्तुकला भौतिकी + पर्यावरण मनोविज्ञान',
  'Vastu Checklist and Spatial Planning Tools | Devagya Vastu': 'वास्तु चेकलिस्ट और स्थानिक योजना उपकरण | देवग्या वास्तु',
  'Project Intake | Devagya Vastu': 'परियोजना पूछताछ | देवग्या वास्तु',
  'Book a Vastu Consultation Online | Devagya Vastu': 'ऑनलाइन वास्तु परामर्श बुक करें | देवग्या वास्तु',
  'Project Planning Calendar | Devagya Vastu': 'परियोजना योजना कैलेंडर | देवग्या वास्तु',
  'Vastu Architecture Projects | Devagya Vastu': 'वास्तु और वास्तुकला परियोजनाएँ | देवग्या वास्तु',
  'Insights — Devagya | Vastu & Signature Spaces': 'विचार — देवग्या | वास्तु और विशेष स्थान',
  'FAQ — Devagya | Vastu & Signature Spaces': 'सामान्य प्रश्न — देवग्या | वास्तु और विशेष स्थान',
  'Privacy and Website Terms | Devagya Vastu': 'गोपनीयता और वेबसाइट की शर्तें | देवग्या वास्तु',
  'This page is not here.': 'यह पेज उपलब्ध नहीं है।',
  'The planning tools have moved.': 'योजना उपकरण स्थानांतरित हो गए हैं।',
  'The project archive has moved.': 'परियोजना संग्रह स्थानांतरित हो गया है।',
  'Contact Devagya Vastu': 'देवग्या वास्तु से संपर्क करें',
  'Frequently asked questions.': 'अक्सर पूछे जाने वाले प्रश्न।',
  'Still have a question?': 'क्या आपका कोई और प्रश्न है?',
  'Speak with our team.': 'हमारी टीम से बात करें।',
  'Notes on Vastu & spatial design.': 'वास्तु और स्थानिक डिज़ाइन पर विचार।',
  'Questions that shape a space.': 'स्थान को आकार देने वाले प्रश्न।',
  'Start with a clearer conversation.': 'स्पष्ट बातचीत से शुरुआत करें।',
  'Have a project question?': 'क्या परियोजना से जुड़ा कोई प्रश्न है?',
  'Have a space to plan?': 'क्या आपके पास योजना बनाने के लिए कोई स्थान है?',
  'What a project story will cover.': 'परियोजना-कथा में क्या शामिल होगा।',
  'Request a consultation': 'परामर्श का अनुरोध करें',
  'Request a consultation time': 'परामर्श के समय का अनुरोध करें',
  'Previous month': 'पिछला महीना',
  'Next month': 'अगला महीना',
  'Preferred date': 'पसंदीदा तारीख',
  'Consultation scheduling': 'परामर्श का समय तय करना',
  'Devagya Vastu offers spatial-design consultations that consider traditional Vastu principles alongside architecture and site conditions. Choose a preferred date to request a conversation; this calendar does not show live availability or select construction dates.': 'देवग्या वास्तु पारंपरिक वास्तु सिद्धांतों के साथ वास्तुकला और स्थल की परिस्थितियों पर विचार करते हुए स्थानिक डिज़ाइन परामर्श देता है। बातचीत का अनुरोध करने के लिए पसंदीदा तारीख चुनें; यह कैलेंडर लाइव उपलब्धता या निर्माण की तारीखें नहीं दिखाता।',
  'Select a future date to request a consultation': 'परामर्श का अनुरोध करने के लिए भविष्य की तारीख चुनें',
  'Dates are preferences, not confirmed availability': 'तारीखें केवल पसंद हैं, उपलब्धता की पुष्टि नहीं',
  'About': 'परिचय',
  'Pooja or quiet room': 'पूजा या शांत कक्ष',
  'Reveal more of the adjusted plan': 'बदली हुई योजना का अधिक भाग दिखाएँ',
  'Devagya Vastu project brief': 'देवग्या वास्तु परियोजना विवरण',
  'Property: Not selected': 'संपत्ति: चयन नहीं किया गया',
  'Stage: Not selected': 'चरण: चयन नहीं किया गया',
  'Location: Not provided': 'स्थान: नहीं दिया गया',
  'Goal: Not selected': 'उद्देश्य: चयन नहीं किया गया',
  'Constraints / questions: Not provided': 'सीमाएँ / प्रश्न: नहीं दिए गए',
  'Email: Not provided': 'ईमेल: नहीं दिया गया',
  'How this website handles your information.': 'यह वेबसाइट आपकी जानकारी का उपयोग कैसे करती है।',
  'Information you submit': 'आपके द्वारा भेजी गई जानकारी',
  'Files and project drawings': 'फ़ाइलें और परियोजना के नक्शे',
  'Planning tools and local storage': 'योजना उपकरण और स्थानीय संग्रहण',
  'Email updates': 'ईमेल अपडेट',
  'Third-party services': 'बाहरी सेवाएँ',
  'Website information and limits': 'वेबसाइट की जानकारी और सीमाएँ',
  'Progress cleared from this browser.': 'इस ब्राउज़र से प्रगति मिटा दी गई।',
  'Browser storage is unavailable, so this progress will not persist.': 'ब्राउज़र संग्रहण उपलब्ध नहीं है, इसलिए यह प्रगति सेव नहीं होगी।',
  'Browser storage is unavailable. The draft stays on this page but will not persist.': 'ब्राउज़र संग्रहण उपलब्ध नहीं है। ड्राफ़्ट इस पेज पर रहेगा, पर सेव नहीं होगा।',
  'Draft cleared from this browser.': 'इस ब्राउज़र से ड्राफ़्ट मिटा दिया गया।',
  'Your project summary will appear here as you complete the steps.': 'चरण पूरे करने पर परियोजना का सारांश यहाँ दिखेगा।',
  'Sending your project brief...': 'परियोजना का विवरण भेजा जा रहा है...',
  'Your project brief was sent. We will follow up using the email you provided.': 'परियोजना का विवरण भेज दिया गया। दिए गए ईमेल पर आपसे संपर्क किया जाएगा।',
  'We could not confirm delivery. Your draft remains saved; please try again or use WhatsApp.': 'भेजे जाने की पुष्टि नहीं हो सकी। आपका ड्राफ़्ट सेव है; फिर कोशिश करें या व्हाट्सऐप इस्तेमाल करें।',
  'Choose an option to continue.': 'आगे बढ़ने के लिए एक विकल्प चुनें।',
  'You can request a conversation if useful.': 'चाहें तो बातचीत का अनुरोध करें।',
  'Check any details you already have.': 'जो जानकारी उपलब्ध है, उसे चुनें।',
  'Property': 'संपत्ति',
  'Stage': 'चरण',
  'Location': 'स्थान',
  'Goal': 'उद्देश्य',
  'Constraints / questions': 'सीमाएँ / प्रश्न',
  'Not selected': 'चयन नहीं किया गया',
  'Not provided': 'नहीं दिया गया',
  'a home': 'एक घर',
  'a workplace': 'एक कार्यस्थल',
  'a development': 'एक विकास परियोजना',
  'an interior scope': 'एक इंटीरियर परियोजना',
  'A focused review can consider traditional Vastu principles alongside the information available about the existing or planned space.': 'केंद्रित समीक्षा मौजूदा या नियोजित स्थान की उपलब्ध जानकारी के साथ पारंपरिक वास्तु सिद्धांतों पर विचार कर सकती है।',
  'This option focuses on layout, circulation, orientation and design decisions within the project brief.': 'यह विकल्प परियोजना के दायरे में लेआउट, आवाजाही, दिशा और डिज़ाइन निर्णयों पर केंद्रित है।',
  'This combines traditional spatial principles with architectural planning from the early design conversation.': 'यह शुरुआती डिज़ाइन चर्चा से पारंपरिक स्थानिक सिद्धांतों को वास्तु-योजना के साथ जोड़ता है।',
  'This focuses on proportion, materials, lighting, furniture and the relationship between interiors and the architectural plan.': 'यह अनुपात, सामग्री, रोशनी, फ़र्नीचर और इंटीरियर व वास्तु-योजना के संबंध पर केंद्रित है।',
  'The exact scope depends on project stage, available drawings and responsibilities of your appointed design professionals.': 'सटीक कार्य-क्षेत्र परियोजना के चरण, उपलब्ध नक्शों और नियुक्त डिज़ाइन विशेषज्ञों की ज़िम्मेदारियों पर निर्भर करता है।',
  'Choose an end date on or after the start date.': 'समाप्ति की तारीख, आरंभ की तारीख के बराबर या उसके बाद चुनें।',
  'Sending your consultation request...': 'परामर्श अनुरोध भेजा जा रहा है...',
  'Your request was sent. Devagya Vastu will confirm actual availability directly.': 'आपका अनुरोध भेज दिया गया। देवग्या वास्तु वास्तविक उपलब्धता की सीधे पुष्टि करेगा।',
  'We could not confirm delivery. Please try again or contact Devagya Vastu directly.': 'भेजे जाने की पुष्टि नहीं हो सकी। फिर कोशिश करें या सीधे देवग्या वास्तु से संपर्क करें।',
  'The guide is not available yet. We will not collect your email until an approved PDF is supplied.': 'मार्गदर्शिका अभी उपलब्ध नहीं है। स्वीकृत PDF मिलने तक आपका ईमेल नहीं लिया जाएगा।',
  'This is your preferred consultation date, not a confirmed appointment. Please share your time zone and preferred time so our team can check actual availability.': 'यह आपकी पसंदीदा परामर्श तारीख है, पक्की नियुक्ति नहीं। उपलब्धता जाँचने के लिए अपना समय क्षेत्र और पसंदीदा समय बताएँ।',
  'Consultation request': 'परामर्श अनुरोध',
  'Select a room in the schematic plan. Traditional Vastu considerations are shown separately from architectural and interior-design questions. The diagram is illustrative, not a recommended layout.': 'योजनाबद्ध नक्शे में एक कमरा चुनें। पारंपरिक वास्तु विचारों को वास्तुकला और इंटीरियर से जुड़े प्रश्नों से अलग दिखाया गया है। यह चित्र केवल उदाहरण है, सुझाया गया लेआउट नहीं।'
};
const englishTranslations = Object.keys(hindiTranslations).reduce((translations, english) => {
  translations[hindiTranslations[english]] = english;
  return translations;
}, {});
const normalizedHindiTranslations = Object.keys(hindiTranslations).reduce((translations, english) => {
  translations[english.toLowerCase()] = hindiTranslations[english];
  return translations;
}, {});
const normalizedEnglishTranslations = Object.keys(englishTranslations).reduce((translations, hindi) => {
  translations[hindi.toLowerCase()] = englishTranslations[hindi];
  return translations;
}, {});
const translateText = (value, nextLanguage) => {
  if (value.includes('\n')) return value.split('\n').map((line) => translateText(line, nextLanguage)).join('\n');
  const checklistCount = value.match(/^(\d+) of (\d+) items checked\.(.*)$/);
  if (checklistCount) {
    return nextLanguage === 'hi'
      ? `${checklistCount[2]} में से ${checklistCount[1]} जानकारी चुनी गई।${checklistCount[3] ? ` ${translateText(checklistCount[3].trim(), nextLanguage)}` : ''}`
      : `${checklistCount[1]} of ${checklistCount[2]} items checked.${checklistCount[3] ? ` ${translateText(checklistCount[3].trim(), nextLanguage)}` : ''}`;
  }
  const hindiChecklistCount = value.match(/^(\d+) में से (\d+) जानकारी चुनी गई।(.*)$/);
  if (hindiChecklistCount) {
    return nextLanguage === 'en'
      ? `${hindiChecklistCount[2]} of ${hindiChecklistCount[1]} items checked.${hindiChecklistCount[3] ? ` ${translateText(hindiChecklistCount[3].trim(), nextLanguage)}` : ''}`
      : value;
  }
  const comparisonValue = value.match(/^(\d+)% adjusted plan visible$/);
  if (comparisonValue) {
    return nextLanguage === 'hi'
      ? `${comparisonValue[1]}% समायोजित योजना दिखाई दे रही है`
      : `${comparisonValue[1]}% adjusted plan visible`;
  }
  const hindiComparisonValue = value.match(/^(\d+)% समायोजित योजना दिखाई दे रही है$/);
  if (hindiComparisonValue) {
    return nextLanguage === 'en' ? `${hindiComparisonValue[1]}% adjusted plan visible` : value;
  }
  const serviceResult = value.match(/^(Vastu consultation|Architecture and spatial planning|Vastu \+ spatial design|Interior design consultation) may be a useful starting point for (a home|a workplace|a development|an interior scope)\. (.*) The exact scope depends on project stage, available drawings and responsibilities of your appointed design professionals\.$/);
  if (serviceResult) {
    const translatedService = translateText(serviceResult[1], nextLanguage);
    const translatedProperty = translateText(serviceResult[2], nextLanguage);
    const translatedExplanation = translateText(serviceResult[3], nextLanguage);
    return nextLanguage === 'hi'
      ? `${translatedProperty} के लिए ${translatedService} एक उपयोगी शुरुआत हो सकती है। ${translatedExplanation} ${translateText('The exact scope depends on project stage, available drawings and responsibilities of your appointed design professionals.', nextLanguage)}`
      : `${translatedService} may be a useful starting point for ${translatedProperty}. ${translatedExplanation} ${translateText('The exact scope depends on project stage, available drawings and responsibilities of your appointed design professionals.', nextLanguage)}`;
  }
  const hindiServiceResult = value.match(/^(एक घर|एक कार्यस्थल|एक विकास परियोजना|एक इंटीरियर परियोजना) के लिए (वास्तु परामर्श|वास्तुकला और स्थानिक योजना|वास्तु \+ स्थानिक डिज़ाइन|इंटीरियर डिज़ाइन परामर्श) एक उपयोगी शुरुआत हो सकती है। (.*) सटीक कार्य-क्षेत्र परियोजना के चरण, उपलब्ध नक्शों और नियुक्त डिज़ाइन विशेषज्ञों की ज़िम्मेदारियों पर निर्भर करता है।$/);
  if (hindiServiceResult && nextLanguage === 'en') {
    const propertyName = translateText(hindiServiceResult[1], nextLanguage);
    const serviceName = translateText(hindiServiceResult[2], nextLanguage);
    const explanation = translateText(hindiServiceResult[3], nextLanguage);
    return `${serviceName} may be a useful starting point for ${propertyName}. ${explanation} The exact scope depends on project stage, available drawings and responsibilities of your appointed design professionals.`;
  }
  const labelSeparator = value.indexOf(': ');
  if (labelSeparator > 0) {
    const label = value.slice(0, labelSeparator);
    const fieldValue = value.slice(labelSeparator + 2);
    if (label === 'Constraints / questions' && fieldValue === 'Not provided' && nextLanguage === 'hi') {
      return 'सीमाएँ / प्रश्न: नहीं दिए गए';
    }
    if (label === 'सीमाएँ / प्रश्न' && fieldValue === 'नहीं दिए गए' && nextLanguage === 'en') {
      return 'Constraints / questions: Not provided';
    }
    const translatedLabel = translateText(label, nextLanguage);
    if (translatedLabel !== label) {
      return `${translatedLabel}: ${translateText(fieldValue, nextLanguage)}`;
    }
  }
  if (nextLanguage === 'hi') return hindiTranslations[value] || normalizedHindiTranslations[value.toLowerCase()] || value;
  return englishTranslations[value] || normalizedEnglishTranslations[value.toLowerCase()] || value;
};
const translateTextNode = (textNode, nextLanguage) => {
  const original = textNode.nodeValue;
  const trimmed = original.trim();
  const translated = translateText(trimmed, nextLanguage);
  if (translated === trimmed) return;
  const leadingWhitespace = (original.match(/^\s*/) || [''])[0];
  const trailingWhitespace = (original.match(/\s*$/) || [''])[0];
  textNode.nodeValue = `${leadingWhitespace}${translated}${trailingWhitespace}`;
};
const languageButtons = document.querySelectorAll('[data-language-toggle]');
let language = window.devagyaStorage.get('devagya-language') === 'hi' ? 'hi' : 'en';
const setLanguage = (nextLanguage) => {
  language = nextLanguage;
  document.documentElement.lang = language;
  const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let textNode;
  while ((textNode = textNodes.nextNode())) translateTextNode(textNode, language);
  document.title = translateText(document.title, language);
  document.querySelectorAll('[title], [placeholder], [aria-label], [aria-valuetext]').forEach((element) => {
    ['title', 'placeholder', 'aria-label', 'aria-valuetext'].forEach((attribute) => {
      if (!element.hasAttribute(attribute) || element.hasAttribute('data-language-toggle')) return;
      const currentValue = element.getAttribute(attribute);
      element.setAttribute(attribute, translateText(currentValue, language));
    });
  });
  languageButtons.forEach((button) => {
    button.textContent = language === 'hi' ? 'English' : 'हिन्दी';
    const label = language === 'hi' ? 'Switch language to English' : 'Switch language to Hindi';
    button.setAttribute('aria-label', translateText(label, language));
  });
  document.dispatchEvent(new CustomEvent('devagya:languagechange', { detail: { language } }));
};
languageButtons.forEach((button) => button.addEventListener('click', () => {
  const nextLanguage = language === 'en' ? 'hi' : 'en';
  window.devagyaStorage.set('devagya-language', nextLanguage);
  setLanguage(nextLanguage);
}));
setLanguage(language);

const languageObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'characterData') {
      translateTextNode(mutation.target, language);
    } else if (mutation.type === 'attributes') {
      const currentValue = mutation.target.getAttribute(mutation.attributeName);
      const translated = translateText(currentValue, language);
      if (translated !== currentValue) mutation.target.setAttribute(mutation.attributeName, translated);
    } else {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          translateTextNode(node, language);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
          let addedText;
          while ((addedText = walker.nextNode())) translateTextNode(addedText, language);
        }
      });
    }
  });
});
languageObserver.observe(document.body, {
  attributes: true,
  attributeFilter: ['aria-label', 'aria-valuetext', 'placeholder', 'title'],
  childList: true,
  characterData: true,
  subtree: true
});

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
