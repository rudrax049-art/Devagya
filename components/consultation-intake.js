(() => {
  const whatsappBase = 'https://wa.me/919467496725';
  const propertyTypes = {
    residential: 'Residential home',
    commercial: 'Office or commercial space',
    industrial: 'Industrial or factory site',
    plot: 'Plot or property under consideration'
  };
  const params = new URLSearchParams(window.location.search);

  document.querySelectorAll('[data-consultation-intake]').forEach((form) => {
    const detailsStep = form.querySelector('[data-intake-step="details"]');
    const shareStep = form.querySelector('[data-intake-step="share"]');
    const summary = form.querySelector('[data-intake-summary]');
    const whatsappLink = form.querySelector('[data-intake-whatsapp]');
    const editButton = form.querySelector('[data-intake-edit]');
    const status = form.querySelector('[data-intake-status]');
    const propertyField = form.elements.namedItem('property_type');
    const noteField = form.elements.namedItem('note');

    if (!detailsStep || !shareStep || !summary || !whatsappLink || !editButton || !status) {
      throw new Error(`Consultation intake form "${form.id || 'unnamed'}" is missing required step markup.`);
    }

    if (form.id === 'bookConsultationForm') {
      const propertyType = params.get('property_type');
      if (propertyType && propertyTypes[propertyType]) propertyField.value = propertyTypes[propertyType];
      const area = params.get('area_sq_ft');
      const format = params.get('consultation_format');
      if (area || format) {
        const scopeNote = [
          area ? `Scope planner area: ${area} sq. ft.` : '',
          format ? `Preferred consultation format: ${format.replace(/-/g, ' ')}.` : ''
        ].filter(Boolean).join(' ');
        noteField.value = [noteField.value, scopeNote].filter(Boolean).join('\n');
      }
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const values = new FormData(form);
      const name = String(values.get('name') || '').trim();
      const phone = String(values.get('phone') || '').trim();
      const location = String(values.get('location') || '').trim();
      const property = String(values.get('property_type') || '').trim();
      const note = String(values.get('note') || '').trim();
      const message = [
        `Hi Devagya Vastu, I would like to discuss a consultation for my ${property.toLowerCase()}.`,
        `Name: ${name}`,
        `WhatsApp: ${phone}`,
        `Project location: ${location}`,
        `Property type: ${property}`,
        note ? `Project note: ${note}` : '',
        'I will share my floor plan or site photos in this WhatsApp chat.'
      ].filter(Boolean).join('\n');

      form.dataset.activeToolState = `${property} · ${location}`;
      whatsappLink.dataset.waMessage = message;
      whatsappLink.href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
      summary.textContent = `${property} · ${location}. Your name and WhatsApp number are included in the draft.`;
      detailsStep.hidden = true;
      shareStep.hidden = false;
      status.textContent = 'Your brief is ready. Open WhatsApp, attach your drawing if available, and send the message to our studio.';
      whatsappLink.focus();
      document.dispatchEvent(new CustomEvent('devagya:form-success', {
        detail: { form: form.id || 'consultation-intake' }
      }));
    });

    editButton.addEventListener('click', () => {
      shareStep.hidden = true;
      detailsStep.hidden = false;
      status.textContent = 'Your details are still here. Make any changes, then continue to WhatsApp.';
      detailsStep.querySelector('input, select, textarea').focus();
    });
  });
})();
