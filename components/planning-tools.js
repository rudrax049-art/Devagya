const roomGuidance = {
  entry: {
    name: 'Entry',
    vastu: 'Traditional guidance may consider entry direction and its relationship to the plan. Treat these as discussion prompts, not universal placement rules.',
    design: 'Review clear access, door swing, weather protection, daylight, privacy and an unobstructed route into the home.'
  },
  living: {
    name: 'Living room',
    vastu: 'Consider how the room relates to the wider directional framework and the intended use of shared space.',
    design: 'Check seating, movement paths, glare, cross-ventilation, views and how the room supports different household activities.'
  },
  kitchen: {
    name: 'Kitchen',
    vastu: 'Traditional preferences for kitchen placement vary. Discuss them alongside the building layout and the people who will use the kitchen.',
    design: 'Coordinate safe appliance clearances, heat, exhaust, make-up air, daylight, cleaning access and plumbing with qualified project professionals.'
  },
  bedroom: {
    name: 'Main bedroom',
    vastu: 'Traditional room-placement ideas can be one input when the layout is still flexible; they do not establish an outcome or certify a plan.',
    design: 'Review privacy, acoustics, daylight control, accessible circulation, storage and comfortable furniture clearances.'
  },
  study: {
    name: 'Study',
    vastu: 'Use directional considerations as an optional planning lens rather than a fixed rule for attention or achievement.',
    design: 'Consider task lighting, glare, sound, ventilation, power access, sightlines and separation from busy routes.'
  },
  quiet: {
    name: 'Pooja or quiet room',
    vastu: 'Where a quiet or reflective room is part of the brief, discuss its placement in relation to tradition and household preferences.',
    design: 'Plan for calm access, privacy, ventilation, safe lighting and materials that suit the intended use and maintenance.'
  },
  bathroom: {
    name: 'Bathrooms',
    vastu: 'Traditional preferences can be discussed, while existing plumbing, waterproofing and building constraints remain central.',
    design: 'Prioritise drainage, waterproofing, ventilation, slip resistance, privacy and safe electrical separation with qualified professionals.'
  }
};
const siteStorage = window.devagyaStorage || {
  get: (key) => window.localStorage.getItem(key),
  set: (key, value) => { window.localStorage.setItem(key, value); return true; },
  remove: (key) => { window.localStorage.removeItem(key); return true; }
};
const completedToolEvents = new Set();

function trackToolCompletion(tool) {
  if (completedToolEvents.has(tool)) return;
  completedToolEvents.add(tool);
  window.dispatchEvent(new CustomEvent('devagya:tool-complete', { detail: { tool } }));
}

function readStoredJson(key, fallback) {
  const raw = siteStorage.get(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    siteStorage.remove(key);
    console.warn(`Removed invalid saved planning data for "${key}".`);
    return fallback;
  }
}

const roomMap = document.querySelector('.room-map');
const roomName = document.getElementById('roomName');
const vastuNote = document.getElementById('vastuNote');
const designNote = document.getElementById('designNote');

function chooseRoom(roomButton) {
  const guidance = roomGuidance[roomButton.dataset.room];
  if (!guidance || !roomName || !vastuNote || !designNote) return;
  roomMap.querySelectorAll('[data-room]').forEach((room) => {
    room.setAttribute('aria-pressed', String(room === roomButton));
  });
  roomName.textContent = guidance.name;
  vastuNote.textContent = guidance.vastu;
  designNote.textContent = guidance.design;
  trackToolCompletion('room-planner');
}

if (roomMap) {
  roomMap.querySelectorAll('[data-room]').forEach((roomButton) => {
    roomButton.addEventListener('click', () => chooseRoom(roomButton));
    roomButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        chooseRoom(roomButton);
      }
    });
  });
}

const readinessItems = document.querySelectorAll('#readinessItems input[name="readiness"]');
const readinessKey = 'devagya-readiness-v1';
const checklistProgress = document.getElementById('checklistProgress');
const checklistSummary = document.getElementById('checklistSummary');

function updateReadiness(save = true) {
  const checked = Array.from(readinessItems).filter((input) => input.checked).map((input) => input.value);
  const percentage = readinessItems.length ? Math.round((checked.length / readinessItems.length) * 100) : 0;
  if (checklistProgress) {
    checklistProgress.setAttribute('aria-valuenow', String(percentage));
    checklistProgress.querySelector('span').style.width = `${percentage}%`;
  }
  if (percentage === 100) trackToolCompletion('readiness-checklist');
  if (checklistSummary) checklistSummary.textContent = `${checked.length} of ${readinessItems.length} items checked. ${checked.length === readinessItems.length ? 'You can request a conversation if useful.' : 'Check any details you already have.'}`;
  if (save && readinessItems.length) {
    const stored = siteStorage.set(readinessKey, JSON.stringify(checked));
    if (!stored && checklistSummary) checklistSummary.textContent += ' Browser storage is unavailable, so this progress will not persist.';
  }
}

if (readinessItems.length) {
  const savedReadiness = readStoredJson(readinessKey, []);
  if (!Array.isArray(savedReadiness)) {
    siteStorage.remove(readinessKey);
  }
  readinessItems.forEach((input) => {
    input.checked = Array.isArray(savedReadiness) && savedReadiness.includes(input.value);
    input.addEventListener('change', () => updateReadiness());
  });
  updateReadiness(false);
  const clearReadinessButton = document.getElementById('clearReadiness');
  if (clearReadinessButton) clearReadinessButton.addEventListener('click', () => {
    readinessItems.forEach((input) => { input.checked = false; });
    siteStorage.remove(readinessKey);
    updateReadiness(false);
    checklistSummary.textContent = 'Progress cleared from this browser.';
  });
}

const comparisonRange = document.getElementById('comparisonRange');
const comparisonFrame = document.getElementById('comparisonFrame');
if (comparisonRange && comparisonFrame) {
  const setComparison = () => {
    comparisonFrame.style.setProperty('--comparison', `${comparisonRange.value}%`);
    comparisonRange.setAttribute('aria-valuetext', `${comparisonRange.value}% adjusted plan visible`);
    trackToolCompletion('plan-comparison');
  };
  comparisonRange.addEventListener('input', setComparison);
  setComparison();
}

const briefForm = document.getElementById('projectBriefForm');
if (briefForm) {
  const briefSteps = Array.from(briefForm.querySelectorAll('.brief-step'));
  const briefBack = document.getElementById('briefBack');
  const briefNext = document.getElementById('briefNext');
  const briefSend = document.getElementById('briefSend');
  const briefStatus = document.getElementById('briefStatus');
  const briefSummary = document.getElementById('briefSummary');
  const briefSummaryField = document.getElementById('briefSummaryField');
  const briefWhatsApp = document.getElementById('briefWhatsApp');
  const draftKey = 'devagya-project-brief-v1';
  let activeStep = 0;

  const fields = Array.from(briefForm.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]), select, textarea'));
  const restoreDraft = () => {
    const saved = readStoredJson(draftKey, {});
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
      siteStorage.remove(draftKey);
      return;
    }
    fields.forEach((field) => {
      if (typeof saved[field.name] === 'string') field.value = saved[field.name];
    });
  };
  const summaryText = () => {
    const data = new FormData(briefForm);
    return [
      'Devagya Vastu project brief',
      `Property: ${data.get('property_type') || 'Not selected'}`,
      `Stage: ${data.get('project_stage') || 'Not selected'}`,
      `Location: ${data.get('project_city') || 'Not provided'}`,
      `Goal: ${data.get('project_goal') || 'Not selected'}`,
      `Constraints / questions: ${data.get('project_constraints') || 'Not provided'}`,
      `Email: ${data.get('email') || 'Not provided'}`
    ].join('\n');
  };
  const updateSummary = (save = true) => {
    const summary = summaryText();
    briefSummary.textContent = summary;
    briefSummaryField.value = summary;
    briefWhatsApp.href = `https://wa.me/919467496725?text=${encodeURIComponent(summary)}`;
    if (save) {
      const draft = fields.reduce((saved, field) => {
        saved[field.name] = field.value;
        return saved;
      }, {});
      const saved = siteStorage.set(draftKey, JSON.stringify(draft));
      if (!saved) briefStatus.textContent = 'Browser storage is unavailable. The draft stays on this page but will not persist.';
    }
  };
  const renderStep = () => {
    briefSteps.forEach((step, index) => { step.hidden = index !== activeStep; });
    briefBack.disabled = activeStep === 0;
    briefNext.hidden = activeStep === briefSteps.length - 1;
    briefSend.hidden = activeStep !== briefSteps.length - 1;
  };
  const validateStep = (step, report = true) => {
    const invalidField = Array.from(step.querySelectorAll('input, select, textarea')).find((field) => !field.checkValidity());
    if (invalidField) {
      if (report) invalidField.reportValidity();
      return false;
    }
    return true;
  };

  restoreDraft();
  updateSummary(false);
  renderStep();
  fields.forEach((field) => {
    field.addEventListener('input', () => updateSummary());
    field.addEventListener('change', () => updateSummary());
  });
  briefNext.addEventListener('click', () => {
    if (!validateStep(briefSteps[activeStep])) return;
    activeStep = Math.min(activeStep + 1, briefSteps.length - 1);
    renderStep();
    const firstField = briefSteps[activeStep].querySelector('input, select, textarea');
    if (firstField) firstField.focus();
  });
  briefBack.addEventListener('click', () => {
    activeStep = Math.max(activeStep - 1, 0);
    renderStep();
    const firstField = briefSteps[activeStep].querySelector('input, select, textarea');
    if (firstField) firstField.focus();
  });
  briefForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const firstInvalidStep = briefSteps.findIndex((step) => !validateStep(step, false));
    if (firstInvalidStep !== -1) {
      activeStep = firstInvalidStep;
      renderStep();
      validateStep(briefSteps[activeStep]);
      return;
    }
    trackToolCompletion('project-brief');
    updateSummary();
    briefSend.disabled = true;
    briefStatus.textContent = 'Sending your project brief...';
    try {
      await window.devagyaForms.submit(briefForm);
      briefStatus.textContent = 'Your project brief was sent. We will follow up using the email you provided.';
      siteStorage.remove(draftKey);
    } catch (error) {
      briefStatus.textContent = 'We could not confirm delivery. Your draft remains saved; please try again or use WhatsApp.';
    } finally {
      briefSend.disabled = false;
    }
  });
  document.getElementById('clearBrief').addEventListener('click', () => {
    briefForm.reset();
    activeStep = 0;
    renderStep();
    siteStorage.remove(draftKey);
    updateSummary(false);
    briefStatus.textContent = 'Draft cleared from this browser.';
  });
}

const recommendButton = document.getElementById('recommendButton');
if (recommendButton) {
  recommendButton.addEventListener('click', () => {
    const type = document.getElementById('recommendType').value;
    const need = document.getElementById('recommendNeed').value;
    const result = document.getElementById('serviceResult');
    const title = document.getElementById('serviceResultTitle');
    const reason = document.getElementById('serviceResultReason');
    if (!type || !need) {
      result.hidden = true;
      const field = !type ? document.getElementById('recommendType') : document.getElementById('recommendNeed');
      field.setCustomValidity('Choose an option to continue.');
      field.reportValidity();
      return;
    }
    document.getElementById('recommendType').setCustomValidity('');
    document.getElementById('recommendNeed').setCustomValidity('');
    const services = {
      review: ['Vastu consultation', 'A focused review can consider traditional Vastu principles alongside the information available about the existing or planned space.'],
      planning: ['Architecture and spatial planning', 'This option focuses on layout, circulation, orientation and design decisions within the project brief.'],
      combined: ['Vastu + spatial design', 'This combines traditional spatial principles with architectural planning from the early design conversation.'],
      interior: ['Interior design consultation', 'This focuses on proportion, materials, lighting, furniture and the relationship between interiors and the architectural plan.']
    };
    const [serviceName, explanation] = services[need];
    const propertyName = { home: 'a home', workplace: 'a workplace', development: 'a development', interior: 'an interior scope' }[type];
    title.textContent = serviceName;
    reason.textContent = `${serviceName} may be a useful starting point for ${propertyName}. ${explanation} The exact scope depends on project stage, available drawings and responsibilities of your appointed design professionals.`;
    result.hidden = false;
    trackToolCompletion('service-recommender');
  });
}

const weeklyInsight = document.getElementById('weeklyInsight');
if (weeklyInsight) {
  const insights = [
    'A useful layout question can start with one simple check: where does daylight enter, and how does the room work at different times of day?',
    'Before moving a wall, map the everyday route through the room. Can people pass without interrupting the main activity?',
    'An orientation mark on a plan is only helpful if it is verified. Confirm north and the site context before comparing directional preferences.',
    'Air movement depends on openings, pressure, climate and obstructions. Review ventilation with the project professionals responsible for building services.',
    'Interior decisions connect to the plan: test furniture clearances, light levels, materials and maintenance together rather than as isolated choices.'
  ];
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  weeklyInsight.textContent = insights[weekNumber % insights.length];
}

document.querySelectorAll('[data-date-min]').forEach((input) => {
  const today = new Date();
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  input.min = localDate;
});

const schedulerForm = document.getElementById('schedulerForm');
if (schedulerForm) {
  schedulerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!schedulerForm.reportValidity()) return;
    const from = schedulerForm.elements.preferred_date_from.value;
    const to = schedulerForm.elements.preferred_date_to.value;
    const status = document.getElementById('schedulerStatus');
    if (to < from) {
      schedulerForm.elements.preferred_date_to.setCustomValidity('Choose an end date on or after the start date.');
      schedulerForm.elements.preferred_date_to.reportValidity();
      schedulerForm.elements.preferred_date_to.addEventListener('input', () => schedulerForm.elements.preferred_date_to.setCustomValidity(''), { once: true });
      return;
    }
    const button = schedulerForm.querySelector('button[type="submit"]');
    button.disabled = true;
    status.textContent = 'Sending your consultation request...';
    try {
      await window.devagyaForms.submit(schedulerForm);
      schedulerForm.reset();
      trackToolCompletion('consultation-scheduler');
      status.textContent = 'Your request was sent. Devagya Vastu will confirm actual availability directly.';
    } catch (error) {
      status.textContent = 'We could not confirm delivery. Please try again or contact Devagya Vastu directly.';
    } finally {
      button.disabled = false;
    }
  });
}

const guideForm = document.getElementById('guideForm');
if (guideForm) {
  const guideUrl = guideForm.dataset.guideUrl.trim();
  const email = guideForm.querySelector('input[type="email"]');
  const button = guideForm.querySelector('button[type="submit"]');
  const message = document.getElementById('guideMessage');
  const status = document.getElementById('guideStatus');
  if (guideUrl) {
    email.disabled = false;
    button.disabled = false;
    message.textContent = 'Enter your email to request the guide. The download link will appear after the form service confirms delivery.';
    guideForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!guideForm.reportValidity()) return;
      button.disabled = true;
      status.textContent = 'Sending your request...';
      try {
        await window.devagyaForms.submit(guideForm);
        trackToolCompletion('starter-guide');
        const download = document.createElement('a');
        download.href = guideUrl;
        download.textContent = 'Download the spatial planning starter guide';
        download.className = 'text-link';
        download.setAttribute('download', '');
        status.replaceChildren(document.createTextNode('Your request was received. '), download);
      } catch (error) {
        status.textContent = 'We could not confirm delivery. Please try again later.';
      } finally {
        button.disabled = false;
      }
    });
  }
}
