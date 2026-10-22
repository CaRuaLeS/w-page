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
    startIso: '20270220T110000Z',
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
  // 1. Meta & SEO tags
  if (content.meta) {
    if (content.meta.title) {
      document.title = content.meta.title;
    }
    setMeta('meta[name="description"]', content.meta.description);
    setMeta('meta[property="og:title"]', content.meta.ogTitle);
    setMeta('meta[property="og:description"]', content.meta.ogDescription);
    setMeta('meta[name="theme-color"]', content.meta.themeColor);
  }

  // 2. Hero Section
  setText('hero-tagline', content.hero?.tagline);
  setText('hero-names', content.hero?.heading);
  setText('hero-subheading', content.hero?.subheading);
  setText('hero-message', content.hero?.welcomeMessage);
  setText('hero-rsvp-btn', content.hero?.rsvpButtonText);
  setText('hero-details-btn', content.hero?.detailsButtonText);
  setAttr('hero-portrait-img', 'src', content.hero?.imageSrc);
  setAttr('hero-portrait-img', 'alt', content.hero?.imageAlt);

  // 3. Countdown & Date Section
  setText('countdown-title', content.countdown?.title);
  const displayDate = content.countdown?.dateText || content.couple?.dateDisplay;
  if (displayDate) {
    setText('countdown-date-display', displayDate);
  }
  if (content.countdown?.timeText) {
    const city = content.couple?.locationCity ? ` • ${content.couple.locationCity}` : '';
    setText('countdown-time-display', `${content.countdown.timeText}${city}`);
  }
  setText('countdown-label-days', content.countdown?.daysLabel);
  setText('countdown-label-hours', content.countdown?.hoursLabel);
  setText('countdown-label-minutes', content.countdown?.minutesLabel);
  setText('countdown-label-seconds', content.countdown?.secondsLabel);

  // 4. Locations Section (Titles, Subtitles, Badges, Times, and Content)
  setText('locations-title', content.locations?.title);
  setText('locations-subtitle', content.locations?.subtitle);

  // Church (Ceremony)
  if (content.locations?.church) {
    setText('church-badge', content.locations.church.badge);
    setText('church-time', content.locations.church.time);
    setText('church-name', content.locations.church.name);
    setText('church-address-text', content.locations.church.address);
    setText('church-desc', content.locations.church.description);
    const churchLink = document.getElementById('church-maps-link');
    if (churchLink && content.locations.church.mapsUrl) {
      churchLink.href = content.locations.church.mapsUrl;
    }
  }

  // Venue (Reception)
  if (content.locations?.venue) {
    setText('venue-badge', content.locations.venue.badge);
    setText('venue-time', content.locations.venue.time);
    setText('venue-name', content.locations.venue.name);
    setText('venue-address-text', content.locations.venue.address);
    setText('venue-desc', content.locations.venue.description);
    const venueLink = document.getElementById('venue-maps-link');
    if (venueLink && content.locations.venue.mapsUrl) {
      venueLink.href = content.locations.venue.mapsUrl;
    }
  }

  // 5. Transportation & Shuttle Buses
  if (content.transportation) {
    hydrateTransportation(content.transportation);
  }

  // 6. RSVP Section & Form Controls
  if (content.rsvp) {
    setText('rsvp-title', content.rsvp.title);
    if (content.rsvp.subtitle) {
      const fullSubtitle = content.rsvp.description
        ? `${content.rsvp.subtitle}. ${content.rsvp.description}`
        : content.rsvp.subtitle;
      setText('rsvp-subtitle', fullSubtitle);
    }

    const labels = content.rsvp.labels;
    if (labels) {
      setLabel('label-first-name', labels.firstName, true);
      setAttr('first_name', 'placeholder', labels.firstNamePlaceholder);

      setLabel('label-last-name', labels.lastName, true);
      setAttr('last_name', 'placeholder', labels.lastNamePlaceholder);

      setLabel('label-email', labels.email, true);
      setAttr('email', 'placeholder', labels.emailPlaceholder);

      setLabel('label-attending', labels.attendingQuestion, true);
      setText('label-attending-yes', labels.attendingYes);
      setText('label-attending-no', labels.attendingNo);

      setText('label-has-plus-one', labels.hasPlusOneQuestion);
      setLabel('label-plus-one-first', labels.plusOneFirstName, true);
      setAttr('plus_one_first_name', 'placeholder', labels.plusOneFirstNamePlaceholder);

      setLabel('label-plus-one-last', labels.plusOneLastName, true);
      setAttr('plus_one_last_name', 'placeholder', labels.plusOneLastNamePlaceholder);

      setLabel('label-dietary', labels.dietaryPreference, true);
      hydrateDietaryOptions(content);

      setText('label-allergies', labels.allergies);
      setAttr('allergies', 'placeholder', labels.allergiesPlaceholder);

      setText('label-needs-bus', labels.needsBusQuestion);
      if (labels.busSection) {
        const bs = labels.busSection;
        setText('label-bus-leg1', bs.leg1?.label);
        setText('hint-bus-leg1', bs.leg1?.hint);
        setText('label-bus-leg1-madrid', bs.leg1?.options?.madrid);
        setText('label-bus-leg1-pozuelo', bs.leg1?.options?.pozuelo);
        setText('label-bus-leg1-none', bs.leg1?.options?.none);

        setText('label-bus-leg2', bs.leg2?.label);
        setText('hint-bus-leg2', bs.leg2?.hint);
        setText('label-bus-leg2-yes', bs.leg2?.options?.yes);
        setText('label-bus-leg2-no', bs.leg2?.options?.no);

        setText('label-bus-leg3', bs.leg3?.label);
        setText('hint-bus-leg3', bs.leg3?.hint);
        setText('label-bus-leg3-madrid', bs.leg3?.options?.madrid);
        setText('label-bus-leg3-pozuelo', bs.leg3?.options?.pozuelo);
        setText('label-bus-leg3-none', bs.leg3?.options?.none);

        setText('bus-seats-notice', bs.seatsNoticeSingular);
      }

      setText('label-shoe-size', labels.shoeSize);
      setText('shoe-size-hint', labels.shoeSizeHint);
      hydrateShoeSizeOptions(content);

      setText('label-comments', labels.commentsLabel);
      setText('hint-comments', labels.commentsHint);
      setAttr('comments', 'placeholder', labels.commentsPlaceholder);

      setText('submit-text', labels.submitButton);
      setText('submit-another-text', labels.submitAnotherButton);
    }
  }

  // 7. Gifts & Bank Details
  if (content.gifts) {
    setText('gifts-title', content.gifts.title);
    setText('gifts-subtitle', content.gifts.subtitle);
    setText('gifts-message', content.gifts.message);
    setText('copy-iban-text', content.gifts.copyIbanButtonText);

    if (content.gifts.bankDetails) {
      const b = content.gifts.bankDetails;
      setText('bank-holder', b.accountHolder);
      setText('bank-name', b.bankName);
      setText('bank-iban', b.iban);
      setText('bank-bic', b.bic);
      setText('bank-concept', b.concept);

      const copyBtn = document.getElementById('copy-iban-btn');
      if (copyBtn && b.iban) {
        copyBtn.setAttribute('data-iban', b.iban);
      }
    }
  }

  // 8. Couple Contact Section
  if (content.contact) {
    setText('contact-title', content.contact.title);
    setText('contact-subtitle', content.contact.subtitle);

    if (content.contact.partner1) {
      const p1 = content.contact.partner1;
      setText('contact-name-1', p1.name);
      setAttr('contact-phone-1', 'href', p1.phoneLink);
      setText('contact-phone-text-1', p1.phone);
      setAttr('contact-email-1', 'href', p1.emailLink);
      setText('contact-email-text-1', p1.email);
    }

    if (content.contact.partner2) {
      const p2 = content.contact.partner2;
      setText('contact-name-2', p2.name);
      setAttr('contact-phone-2', 'href', p2.phoneLink);
      setText('contact-phone-text-2', p2.phone);
      setAttr('contact-email-2', 'href', p2.emailLink);
      setText('contact-email-text-2', p2.email);
    }
  }

  // 9. Footer Section
  if (content.footer) {
    setText('footer-names', content.footer.signature);
    if (content.footer.date) {
      setText('footer-date', `${content.footer.date}`);
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
  setText('transport-note', transportData.note);

  const container = document.getElementById('transport-container');
  if (!container || !Array.isArray(transportData.routes) || transportData.routes.length === 0) {
    return;
  }

  const pickupLabel = transportData.labels?.pickupPoint || 'Pickup Point:';
  const outboundHeading = transportData.labels?.outboundHeading || 'Outbound to Wedding';
  const returnHeading = transportData.labels?.returnHeading || 'Return Trips';

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
        </div>
        ${outboundHtml ? `
          <div class="timetable-block">
            <p class="timetable-heading">${escapeHtml(outboundHeading)}</p>
            <ul class="timetable-list">
              ${outboundHtml}
            </ul>
          </div>
        ` : ''}
        ${returnHtml ? `
          <div class="timetable-block">
            <p class="timetable-heading">${escapeHtml(returnHeading)}</p>
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
 * Dynamically populates dietary preference options from content.json
 */
function hydrateDietaryOptions(content) {
  const dietarySelect = document.getElementById('dietary_preference');
  if (!dietarySelect) return;

  const options = content.rsvp?.labels?.dietaryOptions;
  if (Array.isArray(options) && options.length > 0) {
    const currentVal = dietarySelect.value;
    dietarySelect.innerHTML = options.map(opt =>
      `<option value="${escapeHtml(opt.value)}" ${currentVal === opt.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`
    ).join('');
  }
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
    const defaultPlaceholder = content.rsvp?.labels?.busStopPlaceholder || '-- Selecciona una de las opciones --';
    busStopSelect.innerHTML = `<option value="" disabled ${!currentVal ? 'selected' : ''}>${escapeHtml(defaultPlaceholder)}</option>` +
      options.map(opt => `<option value="${escapeHtml(opt.value)}" ${currentVal === opt.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`).join('');
  }
}

/**
 * Dynamically populates shoe size options from content.json
 */
function hydrateShoeSizeOptions(content) {
  const select = document.getElementById('shoe_size');
  if (!select) return;

  const labels = content.rsvp?.labels || {};
  const sizes = labels.shoeSizeOptions;
  if (!Array.isArray(sizes) || sizes.length === 0) return;

  const currentVal = select.value;
  const placeholder = labels.shoeSizePlaceholder || '-- No, gracias --';
  select.innerHTML =
    `<option value="" ${!currentVal ? 'selected' : ''}>${escapeHtml(placeholder)}</option>` +
    sizes.map(size =>
      `<option value="${escapeHtml(size)}" ${currentVal === String(size) ? 'selected' : ''}>${escapeHtml(size)}</option>`
    ).join('');
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
  if (text === undefined || text === null || text === '') return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setAttr(id, attr, value) {
  if (value === undefined || value === null || value === '') return;
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

function setMeta(selector, value) {
  if (!value) return;
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', value);
}

function setLabel(id, text, isRequired = false) {
  if (!text) return;
  const el = document.getElementById(id);
  if (!el) return;
  if (isRequired || el.querySelector('.req')) {
    el.innerHTML = `${escapeHtml(text)} <span class="req" aria-hidden="true">*</span>`;
  } else {
    el.textContent = text;
  }
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
