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

function getPlanningEvents(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

function showEvent(day) {
  const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
  const formattedDate = new Intl.DateTimeFormat(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = formattedDate;
  modalDetails.textContent = 'This is your preferred consultation date, not a confirmed appointment. Please share your time zone and preferred time so our team can check actual availability.';
  const message = encodeURIComponent(`Hello Devagya, I would like to request a spatial design consultation on ${formattedDate}. My time zone and preferred time are:`);
  whatsappDateLink.href = `https://wa.me/919467496725?text=${message}`;
  calendarModal.hidden = false;
  closeCalendarModal.focus();
}

function renderCalendar() {
  if (!calendarGrid || !monthTitle) return;
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const { firstDay, daysInMonth } = getPlanningEvents(year, month);
  monthTitle.textContent = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(visibleMonth);
  calendarGrid.innerHTML = '';
  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((dayName) => {
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
      dayButton.setAttribute('aria-label', `Request a consultation on ${dayDate.toLocaleDateString()}`);
      const eventLabel = document.createElement('span');
      eventLabel.className = 'calendar-event';
      eventLabel.textContent = 'Consultation request';
      dayButton.appendChild(eventLabel);
      dayButton.addEventListener('click', () => showEvent(day));
    }
    calendarGrid.appendChild(dayButton);
  }
}

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
