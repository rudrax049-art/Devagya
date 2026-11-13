(() => {
  const whatsappBase = 'https://wa.me/919467496725';
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const storageKey = 'devagya-utm-attribution-v1';
  const pageParams = new URLSearchParams(window.location.search);
  const incomingAttribution = {};
  utmKeys.forEach((key) => {
    const value = pageParams.get(key);
    if (value) incomingAttribution[key] = value.slice(0, 200);
  });

  let attribution = {};
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) attribution = JSON.parse(stored);
    if (Object.keys(incomingAttribution).length) {
      attribution = Object.assign({}, attribution, incomingAttribution);
      sessionStorage.setItem(storageKey, JSON.stringify(attribution));
    }
  } catch (error) {
    console.warn('Campaign attribution could not be saved for this browser session.', error);
    attribution = incomingAttribution;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const currentToolState = () => {
    const activeSection = document.querySelector('[data-active-section="true"]');
    const activeTool = activeSection && (
      activeSection.closest('[data-active-tool-state]')
      || activeSection.querySelector('[data-active-tool-state]')
    );
    return activeTool ? activeTool.dataset.activeToolState : '';
  };
  const currentContext = () => {
    const activeSection = document.querySelector('[data-active-section="true"]');
    return activeSection ? activeSection.dataset.waContext : window.location.pathname;
  };
  const attributionText = () => {
    const source = utmKeys
      .filter((key) => attribution[key])
      .map((key) => `${key.replace('utm_', '')}=${attribution[key]}`);
    return source.length ? `\nTraffic source: ${source.join(', ')}` : '';
  };
  window.devagyaAttribution = Object.freeze({
    getValues: () => Object.assign({}, attribution),
    getText: () => attributionText()
  });
  const prepareWhatsAppLink = (link, context) => {
    const toolState = currentToolState();
    const contextLabel = context || currentContext();
    const currentMessage = new URL(link.href, window.location.href).searchParams.get('text') || '';
    const originalMessage = currentMessage.replace(/\n(?:Tool selection:|Enquiry context:|Traffic source:)[\s\S]*$/, '');
    const baseMessage = link.dataset.waMessage
      || originalMessage
      || (contextLabel === 'vastu-zone-report'
        ? 'Hi Devagya Vastu, I would like to unlock the detailed report for my Vastu zone.'
        : contextLabel === 'scope-estimate'
          ? 'Hi Devagya Vastu, I would like to discuss my consultation scope.'
          : 'Hi Devagya Vastu, I would like to discuss a spatial design consultation.');
    const details = [];
    if (toolState) details.push(`Tool selection: ${toolState}`);
    else if (contextLabel) details.push(`Enquiry context: ${contextLabel}`);
    const message = `${baseMessage}${details.length ? `\n${details.join('\n')}` : ''}${attributionText()}`;
    link.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
    return { context: contextLabel, toolState };
  };

  const contextSections = Array.from(document.querySelectorAll('[data-wa-context]'));
  if ('IntersectionObserver' in window && contextSections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          contextSections.forEach((section) => section.removeAttribute('data-active-section'));
          entry.target.setAttribute('data-active-section', 'true');
        }
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    contextSections.forEach((section) => observer.observe(section));
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="wa.me/"]');
    if (!link) return;
    const ancestorContext = link.closest('[data-wa-context]');
    const assignedContext = link.dataset.waContext || (ancestorContext ? ancestorContext.dataset.waContext : '');
    const context = assignedContext === 'floating-contact' ? currentContext() : assignedContext;
    const state = prepareWhatsAppLink(link, context);
    window.gtag('event', 'generate_lead_whatsapp', {
      button_location: state.context,
      active_tool_state: state.toolState || 'none',
      page_location: window.location.pathname
    });
  }, true);

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.action.includes('web3forms.com')) return;
    let attributionField = form.querySelector('input[name="utm_attribution"]');
    if (!attributionField) {
      attributionField = document.createElement('input');
      attributionField.type = 'hidden';
      attributionField.name = 'utm_attribution';
      form.appendChild(attributionField);
    }
    attributionField.value = attributionText().replace(/^\nTraffic source: /, '');
  }, true);

  document.addEventListener('devagya:tool-interaction', (event) => {
    const detail = event.detail || {};
    if (detail.event) {
      const eventName = detail.event;
      const parameters = Object.assign({}, detail);
      delete parameters.event;
      window.gtag('event', eventName, parameters);
    }
  });

  document.addEventListener('devagya:form-success', (event) => {
    window.gtag('event', 'consultation_form_submit', {
      form_id: event.detail && event.detail.form ? event.detail.form : 'consultation'
    });
  });
})();
