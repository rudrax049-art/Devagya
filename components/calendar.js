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
  const events = {};
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const daysAhead = Math.round((date - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
    if (daysAhead >= 3 && date.getDay() !== 0 && date.getDay() !== 6 && day % 5 === 1) {
      events[day] = { title: 'Bhumi Pujan / groundbreaking planning', time: '10:00–12:00 local time (indicative)' };
    } else if (daysAhead >= 3 && date.getDay() !== 0 && date.getDay() !== 6 && day % 7 === 3) {
      events[day] = { title: 'Renovations launch planning', time: '14:00–16:00 local time (indicative)' };
    }
  }
  return { firstDay, daysInMonth, events };
}

function showEvent(day, event) {
  const date = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), day);
  const formattedDate = new Intl.DateTimeFormat(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = event.title;
  modalDetails.textContent = `${formattedDate}. Suggested discussion window: ${event.time}. This sample is not confirmed availability; request a consultation to check current scheduling and the local time zone.`;
  const message = encodeURIComponent(`Hello Devagya, I would like to discuss ${event.title.toLowerCase()} on ${formattedDate}. Please confirm availability and the relevant local time zone.`);
  whatsappDateLink.href = `https://wa.me/?text=${message}`;
  calendarModal.hidden = false;
  closeCalendarModal.focus();
}

function renderCalendar() {
  if (!calendarGrid || !monthTitle) return;
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const { firstDay, daysInMonth, events } = getPlanningEvents(year, month);
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
    const event = events[day];
    const dayButton = document.createElement('button');
    dayButton.type = 'button';
    dayButton.className = 'calendar-day';
    dayButton.setAttribute('role', 'gridcell');
    dayButton.textContent = String(day);
    if (dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || !event) {
      dayButton.disabled = true;
    } else {
      dayButton.setAttribute('aria-label', `${dayDate.toLocaleDateString()}, ${event.title}`);
      const eventLabel = document.createElement('span');
      eventLabel.className = 'calendar-event';
      eventLabel.textContent = event.title.includes('Bhumi') ? 'Groundbreaking' : 'Renovation';
      dayButton.appendChild(eventLabel);
      dayButton.addEventListener('click', () => showEvent(day, event));
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
