/**
 * Reactive RSVP Controller Module
 * Handles conditional field expansion, accessible ARIA state,
 * client-side validation, async submission, and multi-guest reset.
 */

export function initRsvp(config = {}) {
  const form = document.getElementById('rsvp-form');
  const successCard = document.getElementById('rsvp-success-card');
  const submitBtn = document.getElementById('rsvp-submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitSpinner = document.getElementById('submit-spinner');
  const errorBanner = document.getElementById('rsvp-error-banner');
  const submitAnotherBtn = document.getElementById('submit-another-btn');

  const plusOneToggle = document.getElementById('has_plus_one');
  const companionFields = document.getElementById('companion-fields');
  const plusOneFirstInput = document.getElementById('plus_one_first_name');
  const plusOneLastInput = document.getElementById('plus_one_last_name');

  const busToggle = document.getElementById('needs_bus');
  const busFields = document.getElementById('bus-fields');
  const busSeatsNotice = document.getElementById('bus-seats-notice');
  const commentsTextarea = document.getElementById('comments');

  const successHeading = document.getElementById('success-heading');
  const successMessage = document.getElementById('success-message');

  if (!form) return;

  function updateBusSeatsNotice() {
    if (!busSeatsNotice) return;
    const isPlusOne = plusOneToggle ? plusOneToggle.checked : false;
    const bs = config.labels?.busSection || {};
    const singular = bs.seatsNoticeSingular || 'Tu reserva incluirá 1 plaza en los tramos seleccionados.';
    const plural = bs.seatsNoticePlural || 'Tu reserva incluirá 2 plazas (tú y tu acompañante) en los tramos seleccionados.';
    busSeatsNotice.textContent = isPlusOne ? plural : singular;
  }

  function resetBusLegDefaults() {
    const leg1Default = form.querySelector('input[name="bus_to_church"][value="none"]');
    const leg2Default = form.querySelector('input[name="bus_church_to_venue"][value="yes"]');
    const leg3Default = form.querySelector('input[name="bus_return"][value="none"]');
    if (leg1Default) leg1Default.checked = true;
    if (leg2Default) leg2Default.checked = true;
    if (leg3Default) leg3Default.checked = true;
  }

  // 1. Reactive Toggling: Companion Fields
  if (plusOneToggle && companionFields) {
    plusOneToggle.addEventListener('change', () => {
      const isChecked = plusOneToggle.checked;
      plusOneToggle.setAttribute('aria-expanded', String(isChecked));
      companionFields.setAttribute('aria-hidden', String(!isChecked));
      companionFields.classList.toggle('open', isChecked);

      if (isChecked) {
        plusOneFirstInput?.setAttribute('required', '');
        plusOneLastInput?.setAttribute('required', '');
        plusOneFirstInput?.focus();
      } else {
        plusOneFirstInput?.removeAttribute('required');
        plusOneLastInput?.removeAttribute('required');
        if (plusOneFirstInput) plusOneFirstInput.value = '';
        if (plusOneLastInput) plusOneLastInput.value = '';
      }

      updateBusSeatsNotice();
    });
  }

  // 2. Reactive Toggling: Shuttle Bus Fields
  if (busToggle && busFields) {
    busToggle.addEventListener('change', () => {
      const isChecked = busToggle.checked;
      busToggle.setAttribute('aria-expanded', String(isChecked));
      busFields.setAttribute('aria-hidden', String(!isChecked));
      busFields.classList.toggle('open', isChecked);

      if (!isChecked) {
        resetBusLegDefaults();
      }
    });
  }

  // 3. Form Submission Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    // Collect values
    const firstName = form.querySelector('#first_name')?.value.trim() || '';
    const lastName = form.querySelector('#last_name')?.value.trim() || '';
    const email = form.querySelector('#email')?.value.trim() || '';
    const attendingRadio = form.querySelector('input[name="attending"]:checked');
    const attending = attendingRadio ? attendingRadio.value === 'true' : true;
    
    const hasPlusOne = plusOneToggle ? plusOneToggle.checked : false;
    const plusOneFirst = plusOneFirstInput?.value.trim() || '';
    const plusOneLast = plusOneLastInput?.value.trim() || '';

    const dietaryPref = form.querySelector('#dietary_preference')?.value || 'none';
    const allergies = form.querySelector('#allergies')?.value.trim() || '';

    const needsBus = attending && busToggle ? busToggle.checked : false;
    const busToChurch = needsBus
      ? (form.querySelector('input[name="bus_to_church"]:checked')?.value || 'none')
      : '';
    const busChurchToVenue = needsBus
      ? (form.querySelector('input[name="bus_church_to_venue"]:checked')?.value || 'no')
      : '';
    const busReturn = needsBus
      ? (form.querySelector('input[name="bus_return"]:checked')?.value || 'none')
      : '';
    const shoeSize = form.querySelector('#shoe_size')?.value || '';
    const comments = commentsTextarea?.value.trim() || '';
    const honeypot = form.querySelector('#honeypot_check')?.value || '';

    // Client-side validation
    if (!firstName || !lastName) {
      showError('Porfavor ingresa tu nombre y apellido.');
      return;
    }

    if (!isValidEmail(email)) {
      showError('Porfavor ingresa un correo electrónico válido.');
      return;
    }

    if (hasPlusOne && (!plusOneFirst || !plusOneLast)) {
      showError("Porfavor ingresa el nombre y apellidos de tu acompañante.");
      return;
    }

    // Build payload matching strict schema
    const payload = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      attending: attending,
      has_plus_one: hasPlusOne,
      plus_one_first_name: hasPlusOne ? plusOneFirst : '',
      plus_one_last_name: hasPlusOne ? plusOneLast : '',
      dietary_preference: dietaryPref,
      allergies: allergies,
      needs_bus: needsBus,
      bus_to_church: busToChurch,
      bus_church_to_venue: busChurchToVenue,
      bus_return: busReturn,
      shoe_size: attending ? shoeSize : '',
      comments: comments,
      honeypot_check: honeypot
    };

    // UI Loading State
    setLoading(true);

    try {
      const endpoint = config.googleAppsScriptUrl;
      if (endpoint && endpoint.trim().length > 0) {
        // Send to Google Apps Script endpoint
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } else {
        // Local preview simulation if URL not yet configured
        console.info('[RSVP Simulation] Payload submitted successfully:', payload);
        await new Promise((res) => setTimeout(res, 700));
      }

      // Display Success Celebration Screen
      showSuccess(attending, config);

    } catch (err) {
      console.error('[RSVP Error]', err);
      showError('Unable to send your confirmation right now. Please try again or contact the couple.');
    } finally {
      setLoading(false);
    }
  });

  // 4. Multi-Guest Reset: "Submit Another RSVP"
  if (submitAnotherBtn) {
    submitAnotherBtn.addEventListener('click', () => {
      // Hide success card, show form
      successCard.classList.remove('active');
      form.style.display = 'block';

      // Reset form controls
      form.reset();

      // Reset companion fields
      if (plusOneToggle) {
        plusOneToggle.checked = false;
        plusOneToggle.setAttribute('aria-expanded', 'false');
      }
      if (companionFields) {
        companionFields.classList.remove('open');
        companionFields.setAttribute('aria-hidden', 'true');
      }
      plusOneFirstInput?.removeAttribute('required');
      plusOneLastInput?.removeAttribute('required');

      // Reset bus fields
      if (busToggle) {
        busToggle.checked = false;
        busToggle.setAttribute('aria-expanded', 'false');
      }
      if (busFields) {
        busFields.classList.remove('open');
        busFields.setAttribute('aria-hidden', 'true');
      }
      resetBusLegDefaults();
      updateBusSeatsNotice();

      // Reset defaults
      const yesRadio = form.querySelector('input[name="attending"][value="true"]');
      if (yesRadio) yesRadio.checked = true;

      const dietarySelect = form.querySelector('#dietary_preference');
      if (dietarySelect) dietarySelect.value = dietarySelect.options[0]?.value || 'none';

      const honeypotEl = form.querySelector('#honeypot_check');
      if (honeypotEl) honeypotEl.value = '';

      const shoeSelect = form.querySelector('#shoe_size');
      if (shoeSelect) shoeSelect.value = '';

      if (commentsTextarea) commentsTextarea.value = '';

      // Focus first input for next entry
      form.querySelector('#first_name')?.focus();
    });
  }

  // Helper: Email Regex
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Helper: Loading UI
  function setLoading(isLoading) {
    if (submitBtn) submitBtn.disabled = isLoading;
    if (submitSpinner) submitSpinner.classList.toggle('sr-only', !isLoading);
    if (submitText) {
      submitText.textContent = isLoading
        ? (config.labels?.submittingButton || 'Sending Confirmation...')
        : (config.labels?.submitButton || 'Confirm RSVP');
    }
  }

  // Helper: Error UI
  function showError(msg) {
    if (errorBanner) {
      errorBanner.textContent = msg;
      errorBanner.classList.remove('sr-only');
    }
  }

  function hideError() {
    if (errorBanner) {
      errorBanner.textContent = '';
      errorBanner.classList.add('sr-only');
    }
  }

  // Helper: Success UI
  function showSuccess(attending, cfg = {}) {
    form.style.display = 'none';
    successCard.classList.add('active');

    if (attending) {
      if (successHeading) successHeading.textContent = cfg.successHeading || 'Thank You!';
      if (successMessage) {
        successMessage.textContent = cfg.successMessage || 'Your RSVP has been successfully recorded. We cannot wait to celebrate with you!';
      }
    } else {
      if (successHeading) successHeading.textContent = cfg.successHeading || 'Thank You';
      if (successMessage) {
        successMessage.textContent = cfg.successDeclineMessage || 'Thank you for letting us know. We will miss you dearly on our special day!';
      }
    }
  }
}
