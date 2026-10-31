const calendarGrid = document.getElementById('calendarGrid');
const monthTitle = document.getElementById('monthTitle');
const previousMonth = document.getElementById('previousMonth');
const nextMonth = document.getElementById('nextMonth');
const calendarModal = document.getElementById('calendarModal');
const closeCalendarModal = document.getElementById('closeCalendarModal');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
const whatsappDateLink = document.getElementById('whatsappDateLink');
let visibleMonth = new Date();
visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
let lastFocusedElement = null;
let selectedDate = null;

function getCalendarLocale() {
  return ({ en: 'en-IN', hi: 'hi-IN', es: 'es-ES', de: 'de-DE', fr: 'fr-FR' })[document.documentElement.lang] || 'en-IN';
}

function getPlanningEvents(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function updateSelectedDate() {
  if (!selectedDate) return;
  const formattedDate = new Intl.DateTimeFormat(getCalendarLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(selectedDate);
  const language = document.documentElement.lang;
  const messageText = {
    en: `Hello Devagya, I would like to request a spatial design consultation on ${formattedDate}. My time zone and preferred time are:`,
    hi: `नमस्ते देवग्या, मैं ${formattedDate} को स्थानिक डिज़ाइन परामर्श का अनुरोध करना चाहता/चाहती हूँ। मेरा समय क्षेत्र और पसंदीदा समय है:`,
    es: `Hola, Devagya. Quisiera solicitar una consulta de diseño espacial para el ${formattedDate}. Mi zona horaria y el horario que prefiero son:`,
    de: `Hallo Devagya, ich möchte am ${formattedDate} eine Beratung zur Raumgestaltung anfragen. Meine Zeitzone und bevorzugte Uhrzeit sind:`,
    fr: `Bonjour, Devagya. Je souhaiterais demander une consultation en aménagement de l’espace le ${formattedDate}. Mon fuseau horaire et l’heure qui me conviendrait sont :`
  }[language] || `Hello Devagya, I would like to request a spatial design consultation on ${formattedDate}. My time zone and preferred time are:`;
  modalTitle.textContent = formattedDate;
  modalDetails.textContent = 'This is your preferred consultation date, not a confirmed appointment. Please share your time zone and preferred time so our team can check actual availability.';
  whatsappDateLink.href = `https://wa.me/919467496725?text=${encodeURIComponent(messageText)}`;
}

function showEvent(day) {
  selectedDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
  lastFocusedElement = document.activeElement;
  updateSelectedDate();
  calendarModal.hidden = false;
  closeCalendarModal.focus();
}

function renderCalendar() {
  if (!calendarGrid || !monthTitle) return;
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const { firstDay, daysInMonth } = getPlanningEvents(year, month);
  const locale = getCalendarLocale();
  monthTitle.textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(visibleMonth);
  calendarGrid.innerHTML = '';
  const weekStart = new Date(2024, 0, 7);
  Array.from({ length: 7 }, (_, offset) => {
    const weekday = new Date(weekStart);
    weekday.setDate(weekStart.getDate() + offset);
    return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(weekday);
  }).forEach((dayName) => {
    const weekday = document.createElement('div');
    weekday.className = 'calendar-weekday';
    weekday.setAttribute('role', 'columnheader');
    weekday.textContent = dayName;
    calendarGrid.appendChild(weekday);
  });
  for (let empty = 0; empty < firstDay.getDay(); empty += 1) {
    const blank = document.createElement('div');
    blank.className = 'calendar-day is-empty';
    blank.setAttribute('aria-hidden', 'true');
    calendarGrid.appendChild(blank);
  }
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dayDate = new Date(year, month, day);
    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'calendar-day';
    dayButton.setAttribute('role', 'gridcell');
    dayButton.textContent = String(day);
    if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      dayButton.disabled = true;
    } else {
      const requestLabel = window.devagyaI18n
        ? window.devagyaI18n.translate('Request a consultation')
        : (document.documentElement.lang === 'hi' ? 'परामर्श का अनुरोध करें' : 'Request a consultation');
      const formattedDay = new Intl.DateTimeFormat(locale).format(dayDate);
      dayButton.setAttribute('aria-label', `${requestLabel} ${formattedDay}`);
      const eventLabel = document.createElement('span');
      eventLabel.className = 'calendar-event';
      eventLabel.textContent = 'Consultation request';
      dayButton.appendChild(eventLabel);
      dayButton.addEventListener('click', () => showEvent(day));
    }
    calendarGrid.appendChild(dayButton);
  }
}
document.addEventListener('devagya:languagechange', () => {
  const focusedDay = lastFocusedElement && lastFocusedElement.classList.contains('calendar-day')
    ? Number.parseInt(lastFocusedElement.textContent, 10)
    : null;
  renderCalendar();
  if (focusedDay) {
    lastFocusedElement = Array.from(calendarGrid.querySelectorAll('.calendar-day'))
      .find((button) => Number.parseInt(button.textContent, 10) === focusedDay) || lastFocusedElement;
  }
  if (calendarModal && !calendarModal.hidden) updateSelectedDate();
});

if (previousMonth) {
  previousMonth.addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });
}
if (nextMonth) {
  nextMonth.addEventListener('click', () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });
}
function hideCalendarModal() {
  if (!calendarModal) return;
  calendarModal.hidden = true;
  if (lastFocusedElement) lastFocusedElement.focus();
  selectedDate = null;
}
if (closeCalendarModal) closeCalendarModal.addEventListener('click', hideCalendarModal);
if (calendarModal) {
  calendarModal.addEventListener('click', (event) => {
    if (event.target === calendarModal) hideCalendarModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !calendarModal.hidden) hideCalendarModal();
    if (event.key === 'Tab' && !calendarModal.hidden) {
      const focusable = Array.from(calendarModal.querySelectorAll('button:not([disabled]), a[href]'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}
renderCalendar();
