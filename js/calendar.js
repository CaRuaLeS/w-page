/**
 * Calendar Integration Module
 * Handles Google Calendar intent redirect and RFC 5545 .ics file download.
 */

export function initCalendar(eventData) {
  const triggerBtn = document.getElementById('calendar-trigger-btn');
  const dropdown = document.getElementById('calendar-dropdown');
  const googleBtn = document.getElementById('add-to-google-cal');
  const icsBtn = document.getElementById('download-ics-cal');

  if (!triggerBtn || !dropdown) return;

  // Toggle dropdown
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    triggerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    triggerBtn.setAttribute('aria-expanded', 'false');
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Google Calendar Link
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      const gcalUrl = buildGoogleCalendarUrl(eventData);
      window.open(gcalUrl, '_blank', 'noopener,noreferrer');
      dropdown.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // .ics File Download
  if (icsBtn) {
    icsBtn.addEventListener('click', () => {
      downloadIcs(eventData);
      dropdown.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    });
  }
}

function buildGoogleCalendarUrl(event = {}) {
  const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const title = encodeURIComponent(event.title || 'Elena & Lucas Wedding');
  const dates = `${event.startIso || '20260919T150000Z'}/${event.endIso || '20260920T040000Z'}`;
  const details = encodeURIComponent(event.description || 'Wedding celebration of Elena and Lucas.');
  const location = encodeURIComponent(event.location || 'Madrid, Spain');

  return `${baseUrl}&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

function downloadIcs(event = {}) {
  const title = event.title || 'Elena & Lucas Wedding';
  const description = event.description || 'Wedding celebration of Elena and Lucas.';
  const location = event.location || 'Madrid, Spain';
  const start = event.startIso || '20260919T150000Z';
  const end = event.endIso || '20260920T040000Z';
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Elena and Lucas Wedding//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${Date.now()}@weddingpage`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'wedding-invitation.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
