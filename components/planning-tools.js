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
    vastu: 'Traditional room-placement ideas can be one input when the layout is still flexible, alongside the plan, household needs and project constraints.',
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

const spatialDialGrid = document.getElementById('spatialDialGrid');
if (spatialDialGrid) {
  const spatialDialStatus = document.getElementById('spatialDialStatus');
  const spatialDialWhatsApp = document.getElementById('spatialDialWhatsApp');
  const devtaGroups = window.devagyaVastuDevtaGroups || [];
  let index = 0;
  devtaGroups.forEach((group) => {
    const section = document.createElement('section');
    section.className = `devta-group devta-group-${group.id}`;
    const heading = document.createElement('h3');
    heading.textContent = group.label;
    const fields = document.createElement('div');
    fields.className = 'devta-group-fields';
    fields.setAttribute('role', 'group');
    fields.setAttribute('aria-label', group.label);
    group.devtas.forEach((name) => {
      const referenceIndex = index + 1;
      index = referenceIndex;
      const reference = document.createElement('button');
      reference.type = 'button';
      reference.className = 'spatial-dial-reference';
      reference.textContent = `${String(referenceIndex).padStart(2, '0')} · ${name}`;
      reference.setAttribute('aria-pressed', 'false');
      reference.setAttribute('aria-label', `Select ${name}, Vastu Devta field ${referenceIndex}`);
      reference.addEventListener('click', () => {
        spatialDialGrid.querySelectorAll('.spatial-dial-reference').forEach((item) => item.setAttribute('aria-pressed', 'false'));
        reference.setAttribute('aria-pressed', 'true');
        spatialDialStatus.textContent = `${name} selected · ${group.label}.`;
        spatialDialWhatsApp.dataset.waMessage = `Hi Devagya Vastu, I would like to discuss the ${name} Vastu Devta field (${group.label}) in relation to my oriented floor plan.`;
        document.querySelector('#spatial-dial').dataset.activeToolState = `${name} · ${group.label}`;
        document.dispatchEvent(new CustomEvent('devagya:tool-interaction', {
          detail: { event: 'tool_interaction_45_zone_dial', devta_name: name, devta_group: group.id, zone_reference: referenceIndex }
        }));
      });
      fields.appendChild(reference);
    });
    section.append(heading, fields);
    spatialDialGrid.appendChild(section);
  });
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

const entryDirection = document.getElementById('entryDirection');
const checkDirectionButton = document.getElementById('checkDirection');
const directionResult = document.getElementById('directionResult');
const directionResultTitle = document.getElementById('directionResultTitle');
const directionResultNote = document.getElementById('directionResultNote');
if (entryDirection && checkDirectionButton && directionResult && directionResultTitle && directionResultNote) {
  const directionNames = {
    north: 'North',
    'north-east': 'North-east',
    east: 'East',
    'south-east': 'South-east',
    south: 'South',
    'south-west': 'South-west',
    west: 'West',
    'north-west': 'North-west'
  };
  const planningNote = 'Use a verified north mark, then review access, door swing, daylight, privacy and circulation with your project team.';
  const renderDirectionResult = () => {
    const language = window.devagyaI18n ? window.devagyaI18n.language : 'en';
    const translate = (text) => window.devagyaI18n ? window.devagyaI18n.translate(text, language) : text;
    const directionName = directionNames[entryDirection.value];
    if (!directionName) {
      directionResult.hidden = true;
      return;
    }
    directionResultTitle.replaceChildren(
      document.createTextNode(translate('Selected entrance direction:')),
      document.createTextNode(` ${translate(directionName)}`)
    );
    directionResultNote.textContent = translate(planningNote);
    directionResult.hidden = false;
  };

  entryDirection.addEventListener('change', () => {
    entryDirection.setCustomValidity('');
    directionResult.hidden = true;
  });
  checkDirectionButton.addEventListener('click', () => {
    if (!entryDirection.value) {
      const message = window.devagyaI18n
        ? window.devagyaI18n.translate('Choose a direction first.')
        : 'Choose a direction first.';
      entryDirection.setCustomValidity(message);
      entryDirection.reportValidity();
      return;
    }
    entryDirection.setCustomValidity('');
    renderDirectionResult();
    trackToolCompletion('direction-check');
  });
  document.addEventListener('devagya:languagechange', renderDirectionResult);
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
  const renderComparison = () => {
    comparisonFrame.style.setProperty('--comparison', `${comparisonRange.value}%`);
    comparisonRange.setAttribute('aria-valuetext', `${comparisonRange.value}% adjusted plan visible`);
  };
  comparisonRange.addEventListener('input', () => {
    renderComparison();
    trackToolCompletion('plan-comparison');
  });
  renderComparison();
}

const briefForm = document.getElementById('projectBriefForm');
if (briefForm) {
  briefForm.addEventListener('submit', () => {
    trackToolCompletion('project-brief');
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
    const whatsappLink = document.getElementById('recommendWhatsApp');
    if (whatsappLink) {
      whatsappLink.dataset.waMessage = `Hi Devagya Vastu, I would like to discuss ${serviceName.toLowerCase()} for ${propertyName}.`;
      whatsappLink.dataset.waContext = 'service-recommender';
    }
    result.hidden = false;
    title.focus();
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

const zoneButton = document.getElementById('checkVastuZone');
if (zoneButton) {
  const roomSelect = document.getElementById('zoneRoom');
  const directionSelect = document.getElementById('zoneDirection');
  const zoneAnalysis = document.getElementById('zoneAnalysis');
  const zoneLabel = document.getElementById('zoneAnalysisLabel');
  const zoneTitle = document.getElementById('zoneAnalysisTitle');
  const zoneCopy = document.getElementById('zoneAnalysisCopy');
  const solarNote = document.getElementById('zoneSolarNote');
  const functionNote = document.getElementById('zoneFunctionNote');
  const experienceNote = document.getElementById('zoneExperienceNote');
  const zoneStatus = document.getElementById('zoneStatus');
  const zoneWhatsApp = document.getElementById('zoneWhatsApp');
  const directionalGuidance = {
    N: {
      traditional: 'Traditional Vastu references often associate the north with openness and flow. Treat this as a prompt to compare room use with the complete oriented plan.',
      solar: 'At Hisar’s latitude, a north-facing opening generally receives softer, more diffuse daylight and less direct sun than a south- or west-facing opening. Check nearby buildings and seasonal sky exposure.',
      function: 'A study, living area or workspace can be considered where steady daylight, access and the household brief align.',
      experience: 'Review glare, view quality, privacy and visual comfort. These conditions—not the compass point alone—shape how a room may feel.'
    },
    NE: {
      traditional: 'Traditional Vastu discussions often favour a sense of openness in the north-east. Compare that reference with circulation, services and the way the room will be used.',
      solar: 'North-east openings can receive gentle early-day light when unobstructed. Seasonal sun angles, external shade and neighbouring buildings change the actual exposure.',
      function: 'A quiet room, reading corner or shared space may suit this area when the plan supports calm access and useful daylight.',
      experience: 'Consider whether the space offers a clear view, comfortable brightness and separation from noisy routes; avoid assigning a psychological effect to direction itself.'
    },
    E: {
      traditional: 'Traditional Vastu references commonly consider the east in relation to daily activity and morning light. Read this alongside the property’s orientation and use.',
      solar: 'East-facing windows receive low-angle morning sun, which can create useful early daylight as well as glare. Adjustable shading and window placement help manage it.',
      function: 'A breakfast area, living room or study can be explored where morning use, furniture layout and privacy work well.',
      experience: 'Morning brightness may support a pleasant start to the day for some occupants; check glare, sleep needs, views and personal routines.'
    },
    SE: {
      traditional: 'The south-east is often discussed in traditional Vastu in relation to active or heat-generating functions. Room placement remains subject to services, safety and the complete plan.',
      solar: 'South-east rooms can receive morning and near-midday sun. Review solar gain, exhaust routes, heat sources and safe appliance clearances for the actual site.',
      function: 'A kitchen or other active-use room can be considered when ventilation, electrical planning, fire safety and plumbing are coordinated by the project team.',
      experience: 'Heat, noise, task lighting and ventilation shape comfort in active rooms. Assess those conditions directly rather than inferring them from direction.'
    },
    S: {
      traditional: 'Traditional references may associate the south with stable or private uses. Compare those preferences with local climate, privacy, daylight and building requirements.',
      solar: 'South-facing elevations receive meaningful direct sun through the year in this northern-hemisphere location. External shading can limit high summer sun while admitting lower winter sun.',
      function: 'A family room, bedroom or work area can be assessed here when solar control, privacy and the intended daily schedule are suitable.',
      experience: 'Warmth, brightness and outlook can affect perceived comfort. Review seasonal temperature, shading, room use and individual preference.'
    },
    SW: {
      traditional: 'The south-west is frequently considered for private or more settled uses in traditional Vastu. Treat this as one design input, not a universal placement rule.',
      solar: 'South-west rooms can receive strong afternoon and late-day sun. Test external shading, glazing, insulation and ventilation to reduce unwanted heat gain.',
      function: 'A private bedroom or quieter room may be considered where the plan provides comfortable access, privacy and effective solar control.',
      experience: 'Afternoon heat and brightness can influence rest and concentration. Assess actual indoor temperatures, noise, privacy and light control.'
    },
    W: {
      traditional: 'Traditional Vastu references may discuss the west in relation to enclosure and use. Read the direction together with entry, room relationships and site constraints.',
      solar: 'West-facing openings receive low-angle afternoon sun, often the most difficult exposure to shade. External vertical shading and careful glazing can help manage glare and heat.',
      function: 'A utility, circulation or flexible-use room may work here; any occupied room should be tested for afternoon glare, heat and ventilation.',
      experience: 'Late-day brightness can create visual discomfort or warmth. Review shading, views, privacy and the time of day occupants use the room.'
    },
    NW: {
      traditional: 'Traditional Vastu discussions often consider the north-west for flexible or transitional uses. Check that the proposed function fits the household or workplace brief.',
      solar: 'North-west rooms can receive late-afternoon sun, with exposure shaped by season and obstructions. Assess cross-ventilation only against real openings and local wind conditions.',
      function: 'A guest room, flexible living space or secondary work area can be explored when access, privacy and daylight are appropriate.',
      experience: 'Changing use, movement and sound may matter more here than a fixed directional label. Review circulation, privacy, thermal comfort and occupant preference.'
    }
  };
  zoneButton.addEventListener('click', () => {
    if (!roomSelect.value || !directionSelect.value) {
      const missing = !roomSelect.value ? roomSelect : directionSelect;
      missing.setCustomValidity('Choose a room and direction to continue.');
      missing.reportValidity();
      return;
    }
    roomSelect.setCustomValidity('');
    directionSelect.setCustomValidity('');
    const direction = directionalGuidance[directionSelect.value];
    if (!direction) {
      directionSelect.setCustomValidity('Choose one of the eight compass directions.');
      directionSelect.reportValidity();
      return;
    }
    const directionName = directionSelect.selectedOptions[0].textContent.replace(/^[A-Z]+ · /, '');
    zoneLabel.textContent = `${directionSelect.value} · ${directionName} · Traditional and architectural lenses`;
    zoneTitle.textContent = `${roomSelect.value} in the ${directionName} sector`;
    zoneCopy.textContent = direction.traditional;
    solarNote.textContent = direction.solar;
    functionNote.textContent = direction.function;
    experienceNote.textContent = direction.experience;
    zoneAnalysis.hidden = false;
    zoneTitle.focus();
    zoneStatus.textContent = 'Direction explored. Share an oriented plan to review site-specific conditions and room use.';
    document.querySelector('#vastu-zone-checker').dataset.activeToolState = `${roomSelect.value} · ${directionSelect.value}`;
    zoneWhatsApp.dataset.waMessage = `Hi Devagya Vastu, I would like to discuss ${roomSelect.value} in the ${directionName} direction. Please help me review its Vastu context, sunlight and thermal comfort in relation to my floor plan.`;
    document.dispatchEvent(new CustomEvent('devagya:tool-interaction', {
      detail: { event: 'tool_interaction_vastu_checker', room: roomSelect.value, direction: directionSelect.value }
    }));
    trackToolCompletion('vastu-zone-checker');
  });
  [roomSelect, directionSelect].forEach((field) => field.addEventListener('change', () => field.setCustomValidity('')));
}

const scopeButton = document.getElementById('calculateScope');
if (scopeButton) {
  const propertySelect = document.getElementById('estimateProperty');
  const tierSelect = document.getElementById('estimateTier');
  const areaInput = document.getElementById('estimateArea');
  const areaOutput = document.getElementById('estimateAreaValue');
  const scopeAnalysis = document.getElementById('scopeAnalysis');
  const scopeTitle = document.getElementById('scopeAnalysisTitle');
  const scopeCopy = document.getElementById('scopeAnalysisCopy');
  const scopeList = document.getElementById('scopeDeliverables');
  const scopeStatus = document.getElementById('scopeStatus');
  const scopeWhatsApp = document.getElementById('scopeWhatsApp');
  const scopeBookLink = document.getElementById('scopeBookLink');
  const formatArea = (area) => `${Number(area).toLocaleString('en-IN')} sq ft`;
  propertySelect.addEventListener('change', () => propertySelect.setCustomValidity(''));
  tierSelect.addEventListener('change', () => tierSelect.setCustomValidity(''));
  const updateArea = () => {
    const area = Number(areaInput.value);
    areaOutput.textContent = area >= Number(areaInput.max) ? '25,000+ sq. ft.' : formatArea(area);
    areaInput.setAttribute('aria-valuetext', `${area >= Number(areaInput.max) ? '25,000 or more' : area.toLocaleString('en-IN')} square feet`);
  };
  areaInput.addEventListener('input', updateArea);
  updateArea();
  scopeButton.addEventListener('click', () => {
    if (!propertySelect.reportValidity() || !tierSelect.reportValidity() || !areaInput.reportValidity()) return;
    const propertyTypes = {
      residential: {
        name: 'Residential home',
        deliverables: [
          'Review the oriented floor plan, entry sequence and room-to-room relationships.',
          'Discuss bedroom, kitchen, living and service functions against household routines.',
          'Identify daylight, privacy, circulation and thermal-comfort questions for the design team.',
          'Prioritise practical layout and interior options, considering non-demolition changes first where feasible.'
        ]
      },
      commercial: {
        name: 'Office or commercial space',
        deliverables: [
          'Review the oriented plan, public and staff entries, and main circulation routes.',
          'Map work areas, meeting spaces, visitor areas and service functions by their operational relationships.',
          'Identify daylight, glare, privacy, noise and thermal-comfort questions for the design team.',
          'Prioritise practical layout and interior options, considering non-demolition changes first where feasible.'
        ]
      },
      industrial: {
        name: 'Industrial or factory site',
        deliverables: [
          'Review the available site plan, orientation, access points and surrounding context.',
          'Discuss people, vehicle and material routes alongside production, storage and service adjacencies.',
          'Identify site-planning, daylight, ventilation and operational questions for the project team.',
          'Prepare a prioritised discussion brief; engineering, structural, fire and code decisions stay with qualified project professionals.'
        ]
      }
    };
    const propertyType = propertyTypes[propertySelect.value];
    if (!propertyType) {
      propertySelect.setCustomValidity('Choose a property type to continue.');
      propertySelect.reportValidity();
      return;
    }
    propertySelect.setCustomValidity('');
    const propertyName = propertyType.name;
    const area = Number(areaInput.value);
    const formatLabels = {
      online: 'Online plan review · India and worldwide',
      onsite_hisar: 'On-site visit · Hisar',
      onsite_delhi_ncr: 'On-site visit · Delhi-NCR'
    };
    const format = formatLabels[tierSelect.value];
    if (!format) {
      tierSelect.setCustomValidity('Choose an available consultation format.');
      tierSelect.reportValidity();
      return;
    }
    tierSelect.setCustomValidity('');
    const scale = area <= 2500
      ? 'Focused review · one home or a defined area'
      : area <= 10000
        ? 'Expanded review · multiple rooms or work areas'
        : 'Phased review · larger property or operational zones';
    const deliverables = [
      `${scale} for approximately ${formatArea(area)}`,
      ...propertyType.deliverables,
      tierSelect.value === 'online'
        ? 'A remote review of the drawings and project brief you share, followed by prioritised observations and next-step questions.'
        : 'A scheduled site visit in the selected service area, with orientation and spatial observations discussed against the available plan.',
      'A concise set of project priorities to discuss with your architect, interior designer or appointed technical team.'
    ];
    scopeTitle.textContent = `${scale.split(' · ')[0]} · ${propertyName}`;
    scopeCopy.textContent = `${format} for approximately ${formatArea(area)}; deliverables below are based on the information selected. The studio confirms the final scope and fee after reviewing the project brief and visit requirements.`;
    scopeList.replaceChildren(...deliverables.map((item) => {
      const listItem = document.createElement('li');
      listItem.textContent = item;
      return listItem;
    }));
    scopeAnalysis.hidden = false;
    scopeTitle.focus();
    scopeStatus.textContent = 'Scope summary ready. Open WhatsApp to discuss this review with Devagya Vastu.';
    const summary = `Hi Devagya Vastu, I would like to discuss a consultation for my ${propertyName.toLowerCase()} (${formatArea(area)}). Preferred format: ${format}. Please share the fee and next steps after reviewing my brief.`;
    scopeWhatsApp.dataset.waMessage = summary;
    document.querySelector('#scope-estimator').dataset.activeToolState = `${propertyName} · ${format} · ${formatArea(area)}`;
    const bookUrl = new URL('../book/', window.location.href);
    bookUrl.searchParams.set('property_type', propertySelect.value);
    bookUrl.searchParams.set('area_sq_ft', String(area));
    bookUrl.searchParams.set('consultation_format', formatLabels[tierSelect.value].replace(/[ ·]+/g, '-').toLowerCase());
    bookUrl.hash = 'consultation-request';
    scopeBookLink.href = bookUrl.toString();
    document.dispatchEvent(new CustomEvent('devagya:tool-interaction', {
      detail: { event: 'estimate_calculated', property_type: propertySelect.value, consultation_format: tierSelect.value, area_sq_ft: area }
    }));
    trackToolCompletion('scope-estimator');
  });
}
