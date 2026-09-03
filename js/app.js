/**
 * Main Application Orchestrator
 * Dynamic content hydration from content.json, module initialization,
 * and 1-tap IBAN clipboard utility.
 */

import { initCountdown } from './countdown.js';
import { initCalendar } from './calendar.js';
import { initRsvp } from './rsvp.js';

document.addEventListener('DOMContentLoaded', async () => {
  let content = null;

  try {
    const response = await fetch('./content.json');
    if (response.ok) {
      content = await response.json();
    }
  } catch (err) {
    console.warn('[Hydration] Could not fetch content.json, relying on pre-rendered semantic HTML.', err);
  }

  // Hydrate DOM from content.json if loaded
  if (content) {
    hydrateContent(content);
  }

  // Initialize Modules
  const targetDateIso = content?.couple?.targetDateIso || '2027-02-20T13:00:00+02:00';
  initCountdown(targetDateIso);

  const calendarData = content?.countdown?.calendarEvent || {
    title: 'Lourdes & Carlos Wedding',
    description: 'Wedding ceremony and reception of Lourdes & Carlos in Madrid.',
    location: 'Madrid, Spain',
    startIso: '20270220T120000Z',
    endIso: '20270221T000000Z'
  };
  initCalendar(calendarData);

  initRsvp(content?.rsvp || {});

  // 1-Tap Copy IBAN Utility
  initCopyIban(content?.gifts);
});

/**
 * Hydrates DOM elements from content.json
 */
function hydrateContent(content) {
  // Page Title
  if (content.meta?.title) {
    document.title = content.meta.title;
  }

  // Hero
  setText('hero-tagline', content.hero?.tagline);
  setText('hero-names', content.hero?.heading);
  setText('hero-subheading', content.hero?.subheading);
  setText('hero-message', content.hero?.welcomeMessage);
  setText('hero-rsvp-btn', content.hero?.rsvpButtonText);
  setText('hero-details-btn', content.hero?.detailsButtonText);

  // Countdown & Date
  setText('countdown-title', content.countdown?.title);
  if (content.couple?.dateDisplay) {
    setText('countdown-date-display', content.couple.dateDisplay);
  }
  if (content.countdown?.timeText) {
    const city = content.couple?.locationCity ? ` • ${content.couple.locationCity}` : '';
    setText('countdown-time-display', `${content.countdown.timeText}${city}`);
  }

  // Church
  if (content.locations?.church) {
    setText('church-name', content.locations.church.name);
    setText('church-address', content.locations.church.address);
    setText('church-desc', content.locations.church.description);
    const churchLink = document.getElementById('church-maps-link');
    if (churchLink && content.locations.church.mapsUrl) {
      churchLink.href = content.locations.church.mapsUrl;
    }
  }

  // Venue
  if (content.locations?.venue) {
    setText('venue-name', content.locations.venue.name);
    setText('venue-address', content.locations.venue.address);
    setText('venue-desc', content.locations.venue.description);
    const venueLink = document.getElementById('venue-maps-link');
    if (venueLink && content.locations.venue.mapsUrl) {
      venueLink.href = content.locations.venue.mapsUrl;
    }
  }

  // Transportation & Shuttle Buses
  if (content.transportation) {
    hydrateTransportation(content.transportation);
  }

  // RSVP Bus Stop Dropdown Sync
  hydrateBusStopOptions(content);

  // Gifts & Bank Details
  if (content.gifts) {
    setText('gifts-title', content.gifts.title);
    setText('gifts-subtitle', content.gifts.subtitle);
    setText('gifts-message', content.gifts.message);

    if (content.gifts.bankDetails) {
      const b = content.gifts.bankDetails;
      setText('bank-holder', b.accountHolder);
      setText('bank-name', b.bankName);
      setText('bank-iban', b.iban);
      setText('bank-bic', b.bic);

      const copyBtn = document.getElementById('copy-iban-btn');
      if (copyBtn && b.iban) {
        copyBtn.setAttribute('data-iban', b.iban);
      }
    }
  }

  // Footer
  if (content.footer) {
    setText('footer-names', content.footer.signature);
    if (content.footer.date) {
      const city = content.couple?.locationCity ? ` • ${content.couple.locationCity}` : '';
      setText('footer-date', `${content.footer.date}${city}`);
    }
    setText('footer-tagline', content.footer.tagline);
  }
}

/**
 * Dynamically renders transportation routes and schedules from content.json
 */
function hydrateTransportation(transportData) {
  if (!transportData) return;

  setText('transport-title', transportData.title);
  setText('transport-subtitle', transportData.subtitle);

  const container = document.getElementById('transport-container');
  if (!container || !Array.isArray(transportData.routes) || transportData.routes.length === 0) {
    return;
  }

  container.innerHTML = transportData.routes.map(route => {
    const outboundList = Array.isArray(route.outboundSchedule) ? route.outboundSchedule : [];
    const returnList = Array.isArray(route.returnSchedule) ? route.returnSchedule : [];

    const outboundHtml = outboundList.map(item => `
      <li class="timetable-item">
        <span class="time-tag">${escapeHtml(item.time || '')}</span>
        <span class="time-desc">${escapeHtml(item.destination || item.description || '')}</span>
      </li>
    `).join('');

    const returnHtml = returnList.map(item => `
      <li class="timetable-item">
        <span class="time-tag">${escapeHtml(item.time || '')}</span>
        <span class="time-desc">${escapeHtml(item.description || item.destination || '')}</span>
      </li>
    `).join('');

    return `
      <article class="route-card" id="${escapeHtml(route.id || '')}">
        <div class="card-header-row">
          <span class="pill-badge route-badge">${escapeHtml(route.name || 'Route')}</span>
          ${route.badge ? `<span class="pill-time">${escapeHtml(route.badge)}</span>` : ''}
        </div>
        ${route.departurePoint ? `
          <div class="route-location">
            <strong>Pickup Point:</strong> ${escapeHtml(route.departurePoint)}
          </div>
        ` : ''}
        ${outboundHtml ? `
          <div class="timetable-block">
            <p class="timetable-heading">Outbound to Wedding</p>
            <ul class="timetable-list">
              ${outboundHtml}
            </ul>
          </div>
        ` : ''}
        ${returnHtml ? `
          <div class="timetable-block">
            <p class="timetable-heading">Return Trips</p>
            <ul class="timetable-list">
              ${returnHtml}
            </ul>
          </div>
        ` : ''}
      </article>
    `;
  }).join('');
}

/**
 * Syncs the RSVP bus stop dropdown with routes defined in content.json
 */
function hydrateBusStopOptions(content) {
  const busStopSelect = document.getElementById('bus_stop');
  if (!busStopSelect) return;

  const currentVal = busStopSelect.value;
  let options = content.rsvp?.labels?.busStopOptions;

  if (!options && content.transportation?.routes) {
    options = content.transportation.routes.map(r => ({
      value: r.id,
      label: r.name + (r.badge ? ` (${r.badge})` : '')
    }));
  }

  if (Array.isArray(options) && options.length > 0) {
    const defaultPlaceholder = content.rsvp?.labels?.busStopPlaceholder || '-- Choose your departure location --';
    busStopSelect.innerHTML = `<option value="" disabled ${!currentVal ? 'selected' : ''}>${escapeHtml(defaultPlaceholder)}</option>` +
      options.map(opt => `<option value="${escapeHtml(opt.value)}" ${currentVal === opt.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`).join('');
  }
}

/**
 * 1-Tap Copy IBAN Helper
 */
function initCopyIban(giftsConfig = {}) {
  const copyBtn = document.getElementById('copy-iban-btn');
  const copyText = document.getElementById('copy-iban-text');

  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const iban = copyBtn.getAttribute('data-iban') || 'ES91 0049 1500 0512 3456 7890';
    const copiedLabel = giftsConfig?.copiedText || 'IBAN Copied!';
    const originalLabel = giftsConfig?.copyIbanButtonText || 'Copy IBAN';

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(iban);
      } else {
        // Fallback for non-HTTPS or in-app webviews
        const textArea = document.createElement('textarea');
        textArea.value = iban;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      if (copyText) copyText.textContent = copiedLabel;
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-outline');

      setTimeout(() => {
        if (copyText) copyText.textContent = originalLabel;
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-outline');
      }, 2000);

    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  });
}

function setText(id, text) {
  if (!text) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

