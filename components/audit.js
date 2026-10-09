const tabButtons = document.querySelectorAll('[role="tab"]');
const toolPanels = document.querySelectorAll('[role="tabpanel"]');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    tabButtons.forEach((tab) => tab.setAttribute('aria-selected', 'false'));
    toolPanels.forEach((panel) => {
      panel.classList.remove('is-active');
      panel.hidden = true;
    });
    button.setAttribute('aria-selected', 'true');
    const activePanel = document.getElementById(button.getAttribute('aria-controls'));
    if (activePanel) {
      activePanel.hidden = false;
      activePanel.classList.add('is-active');
      if (activePanel.id === 'panel-audit') {
        history.replaceState(null, '', '#panel-audit');
      } else if (location.hash === '#panel-audit') {
        history.replaceState(null, '', location.pathname + location.search);
      }
    }
  });
  button.addEventListener('keydown', (event) => {
    const currentIndex = Array.from(tabButtons).indexOf(button);
    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % tabButtons.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabButtons.length - 1;
    if (nextIndex !== currentIndex) {
      event.preventDefault();
      tabButtons[nextIndex].focus();
      tabButtons[nextIndex].click();
    }
  });
});

const sectorDetails = [
  { name: 'North', tip: 'Review north-facing openings for glare, privacy and cross-ventilation; confirm window sizing against climate and local code.' },
  { name: 'North-East', tip: 'Check circulation and daylight around this sector. Keep access routes clear and coordinate any wet-area changes with plumbing design.' },
  { name: 'East', tip: 'Evaluate morning daylight, solar shading and privacy before setting the size and position of east-facing openings.' },
  { name: 'South-East', tip: 'Review heat gain and ventilation where cooking or equipment is planned. Exhaust and fire-safety provisions take priority.' },
  { name: 'South', tip: 'Assess afternoon solar exposure and specify shading, glazing and insulation according to the local climate.' },
  { name: 'South-West', tip: 'Review privacy, thermal comfort and structural constraints before placing quieter or more enclosed functions in this sector.' },
  { name: 'West', tip: 'Consider low-angle afternoon sun, glare control and shading depth when locating west-facing doors and windows.' },
  { name: 'North-West', tip: 'Check through-routes, door swings and ventilation paths so circulation remains clear and accessible.' }
];

const degreeSlider = document.getElementById('degreeSlider');
const degreeValue = document.getElementById('degreeValue');
const dialNeedle = document.getElementById('dialNeedle');
const zoneName = document.getElementById('zoneName');
const zoneTip = document.getElementById('zoneTip');
const sectorLabel = document.getElementById('sectorLabel');

function updateDial() {
  if (!degreeSlider || !degreeValue || !dialNeedle || !zoneName || !zoneTip || !sectorLabel) return;
  const degree = Number(degreeSlider.value) % 360;
  const sectorIndex = Math.floor(((degree + 22.5) % 360) / 45);
  const sector = sectorDetails[sectorIndex];
  degreeValue.textContent = `${degreeSlider.value}°`;
  dialNeedle.style.transform = `rotate(${degree}deg)`;
  zoneName.textContent = sector.name;
  zoneTip.textContent = sector.tip;
  sectorLabel.textContent = `Directional sector · ${sector.name}`;
  degreeSlider.setAttribute('aria-valuetext', `${degreeSlider.value} degrees, ${sector.name}`);
}

if (degreeSlider) {
  degreeSlider.addEventListener('input', updateDial);
  updateDial();
}

const auditQuestions = [
  { key: 'entrance', title: 'How is the main entrance positioned in the current plan?', options: [{ text: 'Known and shown on a north-aligned plan', score: 25 }, { text: 'Known, but orientation is not confirmed', score: 18 }, { text: 'Not yet determined', score: 10 }] },
  { key: 'kitchen', title: 'Where is the kitchen located, and has ventilation been considered?', options: [{ text: 'Location and exhaust route are documented', score: 25 }, { text: 'Kitchen is located; ventilation needs review', score: 18 }, { text: 'Kitchen location is still flexible', score: 14 }] },
  { key: 'suite', title: 'What is the current master suite arrangement?', options: [{ text: 'Location, privacy and daylight are mapped', score: 25 }, { text: 'Room is identified; adjacency needs review', score: 18 }, { text: 'Room location is undecided', score: 14 }] },
  { key: 'site', title: 'What stage is the site or project at?', options: [{ text: 'Vacant land / early planning', score: 25 }, { text: 'Existing structure / planning a renovation', score: 20 }, { text: 'Under construction / changes are constrained', score: 14 }] }
];
const answers = {};
let currentQuestion = 0;
let auditTriggered = false;
const quizQuestion = document.getElementById('quizQuestion');
const quizProgress = document.getElementById('quizProgress');
const leadGate = document.getElementById('leadGate');
const lockedResults = document.getElementById('lockedResults');
const resultsContent = document.getElementById('resultsContent');

function renderQuestion() {
  if (!quizQuestion) return;
  const question = auditQuestions[currentQuestion];
  const optionsMarkup = question.options.map((option, index) => {
    const selected = answers[question.key] === index;
    return `<button class="quiz-option" type="button" data-option="${index}" aria-pressed="${selected}">${option.text}</button>`;
  }).join('');
  quizQuestion.innerHTML = `<p class="eyebrow">Question ${currentQuestion + 1} of ${auditQuestions.length}</p><h2>${question.title}</h2><div class="quiz-options">${optionsMarkup}</div><p class="quiz-error" id="quizError" aria-live="polite"></p><div class="quiz-controls"><button class="button button-secondary" id="quizPrevious" type="button" ${currentQuestion === 0 ? 'disabled' : ''}>Previous</button><button class="button" id="quizNext" type="button">${currentQuestion === auditQuestions.length - 1 ? 'Calculate structural rating' : 'Continue'}</button></div>`;
  quizQuestion.querySelectorAll('.quiz-option').forEach((optionButton) => {
    optionButton.addEventListener('click', () => {
      answers[question.key] = Number(optionButton.dataset.option);
      quizQuestion.querySelectorAll('.quiz-option').forEach((option) => option.setAttribute('aria-pressed', 'false'));
      optionButton.setAttribute('aria-pressed', 'true');
    });
  });
  document.getElementById('quizPrevious').addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      renderQuestion();
      updateProgress();
    }
  });
  document.getElementById('quizNext').addEventListener('click', () => {
    if (typeof answers[question.key] !== 'number') {
      document.getElementById('quizError').textContent = 'Select an option to continue.';
      return;
    }
    if (currentQuestion < auditQuestions.length - 1) {
      currentQuestion += 1;
      renderQuestion();
      updateProgress();
      return;
    }
    auditTriggered = true;
    if (lockedResults) lockedResults.classList.add('is-locked');
    if (resultsContent) resultsContent.setAttribute('aria-hidden', 'true');
    if (leadGate) leadGate.hidden = false;
    const nameInput = document.getElementById('auditName');
    if (nameInput) nameInput.focus();
  });
}

function updateProgress() {
  if (!quizProgress) return;
  quizProgress.querySelectorAll('span').forEach((step, index) => {
    step.classList.toggle('is-current', index === currentQuestion);
    step.classList.toggle('is-complete', index < currentQuestion);
  });
}

if (quizQuestion) {
  renderQuestion();
}
if (location.hash === '#panel-audit') {
  const auditTab = document.getElementById('tab-audit');
  if (auditTab) auditTab.click();
}

const auditLeadForm = document.getElementById('auditLeadForm');
if (auditLeadForm) {
  auditLeadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('auditName');
    const email = document.getElementById('auditEmail');
    const phone = document.getElementById('auditPhone');
    const message = document.getElementById('auditFormMessage');
    if (!auditTriggered || !name.value.trim() || !email.validity.valid || !phone.value.trim()) {
      message.textContent = 'Enter your name, a valid email and a phone number to continue.';
      if (!name.value.trim()) name.focus();
      else if (!email.validity.valid) email.focus();
      else phone.focus();
      return;
    }
    const total = auditQuestions.reduce((sum, question) => sum + question.options[answers[question.key]].score, 0);
    const entranceScore = auditQuestions[0].options[answers.entrance].score;
    const kitchenScore = auditQuestions[1].options[answers.kitchen].score;
    document.getElementById('scoreResult').textContent = `${total} / 100 · planning snapshot`;
    document.getElementById('winResult').textContent = entranceScore >= 18
      ? 'An entrance location is already known. Confirm its orientation with a site plan and check door swing, approach and accessible clearance.'
      : 'Your entrance is still flexible. Test several entry positions against circulation, access, daylight and structural constraints before fixing the plan.';
    document.getElementById('riskResult').textContent = kitchenScore < 25
      ? 'Kitchen ventilation and exhaust routing need a coordinated review before the layout is finalized.'
      : 'Confirm that kitchen exhaust, make-up air and fire-safety provisions are coordinated with the mechanical design.';
    lockedResults.classList.remove('is-locked');
    resultsContent.setAttribute('aria-hidden', 'false');
    leadGate.hidden = true;
    message.textContent = '';
    resultsContent.focus();
  });
}
