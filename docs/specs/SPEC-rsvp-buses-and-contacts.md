# Spec: RSVP Shuttle Bus Legs, General Comments & Couple Contact (`SPEC-rsvp-buses-and-contacts`)

> Status: **DRAFT FOR REVIEW (Frontend UI Engineering Enhanced)** · Plan: [C:/Users/carua/.gemini/antigravity-cli/brain/33eef985-8944-4a34-8b0d-3ddeb613d5b8/implementation-plan.md](file:///C:/Users/carua/.gemini/antigravity-cli/brain/33eef985-8944-4a34-8b0d-3ddeb613d5b8/implementation-plan.md)

---

## Assumptions I'm Making

1. **3 Independent Bus Legs**:
   - **Tramo 1 (Origen ➔ Iglesia)**: `madrid`, `pozuelo`, `none`
   - **Tramo 2 (Iglesia ➔ Finca)**: `yes`, `no`
   - **Tramo 3 (Finca ➔ Vuelta)**: `madrid`, `pozuelo`, `none`
2. **Mobile-First Touch Selectors**: Radio pill groups with min 46px height for effortless 1-tap thumb interaction on smartphones instead of native `<select>` dropdowns.
3. **Companion Seat Awareness**: When `has_plus_one` is checked, the reservation automatically reserves 2 seats for both attendees, with dynamic visual confirmation announced politely to assistive technologies (`aria-live="polite"`).
4. **General Comments Textarea**: Placed at the very end of the form, directly before the Submit button (after Shoe Size), allowing up to 500 characters.
5. **Independent Contact Section (At the End of the Page)**:
   - Located as the very last content section on the page: after the gifts section (`#gifts`), right before `<footer>`.
   - **No border, no card container, no background card box**: purely clean typography and styled links rendered directly against `var(--color-bg)`.
   - Desktop: Lourdes on the left (`.contact-left`), Carlos on the right (`.contact-right`).
   - Mobile: Refined stacked or centered layout with generous 44px+ touch targets.
   - Channels: Phone (`tel:`) and Email (`mailto:`) for both.
6. **Decoupled Architecture**: All Spanish copy, phone numbers, and emails live in `content.json` and hydrate into the DOM.
7. **No new build tools or external npm dependencies**: Pure semantic HTML5, CSS3 with design tokens (`css/variables.css`), ES modules, and Google Apps Script.

---

## Objective

Provide guests with a frictionless, accessible, mobile-first RSVP experience for wedding transportation logistics across three distinct legs, give guests a dedicated space for personal notes to the couple, and provide direct, accessible contact channels for Lourdes and Carlos without cluttering the gift section.

### User Stories
- **As a guest**, I can select which legs of the shuttle bus I need (Madrid/Pozuelo to church, church to venue, venue back to Madrid/Pozuelo) in seconds without typing or navigating awkward dropdowns.
- **As a guest with a companion**, I can see clearly that our bus selections cover both of us without having to duplicate entries.
- **As a guest**, I can leave a warm message, special request, or question in the general comments box before submitting my RSVP.
- **As a guest with questions**, I can easily find direct phone and email links for Lourdes and Carlos at the bottom of the page, outside the gift registry, and initiate a call or email in one tap.
- **As the couple**, we receive clear, structured bus numbers per leg and guest comments directly in our private Google Sheet.

---

## Frontend UI Engineering & Design System Standards

### 1. Token Adherence (Zero "AI Aesthetic")
- **Palette**: Warm Mediterranean Elegance adhering strictly to `css/variables.css`:
  - Background: `--color-bg` (`#fcfbf8`)
  - Accent / Brand: `--color-accent` (`#8b7d63`), `--color-accent-dark` (`#6e624c`), `--color-accent-light` (`#f2eee6`)
  - Typography: `--font-display` (`'Cormorant Garamond'`) for titles/names, `--font-body` (`'Plus Jakarta Sans'`) for controls/labels.
  - Borders & Radii: `--radius-sm` (`6px`) for form pills and inputs, `--radius-md` (`12px`) for subtle cards. Never arbitrary `rounded-2xl` or ungrounded purple gradients.
- **Spacing Scale**: Enforced via `--space-xs` (8px), `--space-sm` (12px), `--space-md` (16px), `--space-lg` (24px), `--space-xl` (32px), `--space-2xl` (48px).

### 2. Accessibility (WCAG 2.1 AA Compliance)
- **Keyboard Navigation**:
  - All radio pills respond to arrow keys within their group and Space/Enter selection.
  - Visible `:focus-visible` ring (`outline: 2px solid var(--color-accent); outline-offset: 3px;`).
- **Touch Targets**:
  - All interactive labels and contact links maintain a minimum target area of `44px x 44px`.
- **Screen Reader Support**:
  - Each leg is wrapped in `<div role="radiogroup" aria-labelledby="...">`.
  - Seat count message uses `<p class="form-hint" id="bus-seats-notice" aria-live="polite">` so changes are announced immediately when companion status toggles.
  - Contact SVG icons use `aria-hidden="true"` with explicit text nodes.
- **Color Contrast**:
  - Active radio pill state uses `--color-accent` / `--color-accent-dark` with white text, achieving a contrast ratio > 4.5:1 against light backgrounds.

### 3. Responsive Layout & Breakpoint Strategy
- **320px (Small Mobile / iPhone SE)**:
  - Bus pills: 3 buttons use `flex: 1 1 0; min-width: 0; font-size: 0.8125rem; line-height: 1.2; text-align: center;` to avoid text clipping.
  - Contact section: Gracefully collapses to a clean single column with centered alignment and generous touch padding.
- **560px - 680px (Standard Mobile & Phablet)**:
  - Full width container (`--container-max-width: 680px`) with natural padding.
- **> 680px (Desktop)**:
  - Contact section: Two-column layout with `display: flex; justify-content: space-between; align-items: flex-start;`.
  - Lourdes left-aligned, Carlos right-aligned.

---

## Tech Stack & Commands

- **Frontend**: Semantic HTML5, vanilla ES6 modules (`js/app.js`, `js/rsvp.js`), CSS custom properties (`css/variables.css`, `css/style.css`).
- **Configuration**: `content.json` (hydrated dynamically at runtime).
- **Backend**: Google Apps Script (`google-apps-script/Code.gs`) writing to Google Sheets via `LockService`.

```bash
# Local test server (PowerShell / Windows)
python -m http.server 8000
# URL: http://localhost:8000/#rsvp

# Syntax validation of content.json
Get-Content content.json -Raw | ConvertFrom-Json | Out-Null
```

---

## Project Structure (Files Touched)

```
content.json                     → bus leg labels, comments labels, contact details (phone, email)
index.html                       → #bus-fields 3 radio-pill groups, #comments-group, #contact section
css/style.css                    → .bus-leg-group styles, .contact-section borderless grid & links
js/rsvp.js                       → collect bus_to_church, bus_church_to_venue, bus_return, comments; dynamic seat notice
js/app.js                        → hydration for bus legs, comments, and contact section
google-apps-script/Code.gs       → new headers, sanitization, row append
google-apps-script/README.md     → updated column schema
```

---

## Data Contract

| Layer | Key / Field | Allowed Values / Format |
|---|---|---|
| `content.json` | `busSection.leg1.options` | `{"madrid": "Madrid", "pozuelo": "Pozuelo", "none": "No necesito"}` |
| `content.json` | `busSection.leg2.options` | `{"yes": "Sí, necesito", "no": "No necesito"}` |
| `content.json` | `busSection.leg3.options` | `{"madrid": "A Madrid", "pozuelo": "A Pozuelo", "none": "No necesito"}` |
| `content.json` | `contact.partner1` / `partner2` | `name`, `phone`, `phoneLink`, `email`, `emailLink` |
| DOM (RSVP Form) | `bus_to_church` | Radio input: `"madrid"`, `"pozuelo"`, `"none"` |
| DOM (RSVP Form) | `bus_church_to_venue` | Radio input: `"yes"`, `"no"` |
| DOM (RSVP Form) | `bus_return` | Radio input: `"madrid"`, `"pozuelo"`, `"none"` |
| DOM (RSVP Form) | `comments` | Textarea string (max 500 chars) |
| JSON Payload | `bus_to_church`, `bus_church_to_venue`, `bus_return`, `comments` | Sanitized strings, empty strings if `attending === false` |
| Google Sheet | Columns: `Bus: Origen -> Iglesia`, `Bus: Iglesia -> Finca`, `Bus: Finca -> Vuelta`, `Comments` | Stored text values |

---

## Code Style & Snippets

### 1. Accessible Bus Legs Markup (`index.html`)
```html
<div class="conditional-fields" id="bus-fields" aria-hidden="true">
  <div class="conditional-inner">
    <!-- Tramo 1 -->
    <div class="form-group bus-leg-group">
      <span class="form-label" id="label-bus-leg1">1. Hacia la Iglesia</span>
      <p class="form-hint" id="hint-bus-leg1">Salida hacia la ceremonia</p>
      <div class="radio-pill-group" role="radiogroup" aria-labelledby="label-bus-leg1">
        <label class="radio-pill-label">
          <input type="radio" name="bus_to_church" value="madrid">
          <span id="label-bus-leg1-madrid">Madrid</span>
        </label>
        <label class="radio-pill-label">
          <input type="radio" name="bus_to_church" value="pozuelo">
          <span id="label-bus-leg1-pozuelo">Pozuelo</span>
        </label>
        <label class="radio-pill-label">
          <input type="radio" name="bus_to_church" value="none" checked>
          <span id="label-bus-leg1-none">No necesito</span>
        </label>
      </div>
    </div>

    <!-- Tramo 2 -->
    <div class="form-group bus-leg-group">
      <span class="form-label" id="label-bus-leg2">2. De la Iglesia a la Finca</span>
      <p class="form-hint" id="hint-bus-leg2">Traslado a la celebración</p>
      <div class="radio-pill-group" role="radiogroup" aria-labelledby="label-bus-leg2">
        <label class="radio-pill-label">
          <input type="radio" name="bus_church_to_venue" value="yes" checked>
          <span id="label-bus-leg2-yes">Sí, necesito</span>
        </label>
        <label class="radio-pill-label">
          <input type="radio" name="bus_church_to_venue" value="no">
          <span id="label-bus-leg2-no">No necesito</span>
        </label>
      </div>
    </div>

    <!-- Tramo 3 -->
    <div class="form-group bus-leg-group">
      <span class="form-label" id="label-bus-leg3">3. Vuelta tras la fiesta</span>
      <p class="form-hint" id="hint-bus-leg3">Regreso desde la Finca</p>
      <div class="radio-pill-group" role="radiogroup" aria-labelledby="label-bus-leg3">
        <label class="radio-pill-label">
          <input type="radio" name="bus_return" value="madrid">
          <span id="label-bus-leg3-madrid">A Madrid</span>
        </label>
        <label class="radio-pill-label">
          <input type="radio" name="bus_return" value="pozuelo">
          <span id="label-bus-leg3-pozuelo">A Pozuelo</span>
        </label>
        <label class="radio-pill-label">
          <input type="radio" name="bus_return" value="none" checked>
          <span id="label-bus-leg3-none">No necesito</span>
        </label>
      </div>
    </div>

    <p class="form-hint bus-seats-notice" id="bus-seats-notice" aria-live="polite">
      Tu reserva incluirá 1 plaza en los tramos seleccionados.
    </p>
  </div>
</div>
```

### 2. General Comments Section Markup (`index.html`)
```html
<div class="form-group" id="comments-group">
  <label for="comments" class="form-label" id="label-comments">Comentarios o notas</label>
  <p class="form-hint" id="hint-comments">¿Alguna duda, petición o mensaje especial para los novios?</p>
  <textarea id="comments" name="comments" class="form-control" placeholder="Escribe aquí tu mensaje..." maxlength="500" rows="3" aria-describedby="hint-comments"></textarea>
</div>
```

### 3. Borderless Contact Section Markup (`index.html`)
```html
<section class="section contact-section" id="contact" aria-labelledby="contact-title">
  <div class="contact-header">
    <h2 class="contact-title" id="contact-title">¿Tienes alguna duda?</h2>
    <p class="contact-subtitle" id="contact-subtitle">Estamos a tu disposición para lo que necesites</p>
  </div>
  <div class="contact-grid">
    <div class="contact-person contact-left" id="contact-partner1">
      <h3 class="contact-person-name" id="contact-name-1">Lourdes</h3>
      <div class="contact-channels">
        <a href="tel:+34600000000" class="contact-link" id="contact-phone-1">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span id="contact-phone-text-1">+34 600 000 000</span>
        </a>
        <a href="mailto:lourdes@example.com" class="contact-link" id="contact-email-1">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span id="contact-email-text-1">lourdes@example.com</span>
        </a>
      </div>
    </div>
    <div class="contact-person contact-right" id="contact-partner2">
      <h3 class="contact-person-name" id="contact-name-2">Carlos</h3>
      <div class="contact-channels">
        <a href="tel:+34600000000" class="contact-link" id="contact-phone-2">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <span id="contact-phone-text-2">+34 600 000 000</span>
        </a>
        <a href="mailto:carlos@example.com" class="contact-link" id="contact-email-2">
          <svg class="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <span id="contact-email-text-2">carlos@example.com</span>
        </a>
      </div>
    </div>
  </div>
</section>
```

---

## Boundaries

- **Always**:
  - Keep styling strictly adhering to `css/variables.css` design tokens.
  - Enforce anti-formula sanitization (`sanitizeCell`) on all submitted strings in `Code.gs`.
  - Maintain mobile responsiveness down to 320px viewport width without horizontal scrollbars.
  - Ensure all clickable phone and email targets meet accessibility minimum size (>= 44px touch targets).
- **Ask First**:
  - Changing Google Sheets endpoint deployment URLs or modifying existing non-bus form logic.
- **Never**:
  - Add heavy external libraries (React, Vue, jQuery, Tailwind).
  - Wrap the contact section in a card border or colored card background.
  - Hardcode copy directly in JS files when `content.json` is available.

---

## Success Criteria

- [x] Selecting "Sí" to "¿Necesitas autobús?" expands 3 clear, distinct legs:
  1. Origen ➔ Iglesia (`Madrid`, `Pozuelo`, `No necesito`)
  2. Iglesia ➔ Finca (`Sí, necesito`, `No necesito`)
  3. Finca ➔ Vuelta (`A Madrid`, `A Pozuelo`, `No necesito`)
- [x] Toggling companion dynamically updates the seat notice from 1 to 2 seats with live accessibility announcement (`aria-live="polite"`).
- [x] Comments textarea renders at the end of the form with clear label and hint, successfully bundled in the submission payload.
- [x] Contact section renders cleanly after `#gifts` without any card box or border, with Lourdes on the left and Carlos on the right.
- [x] Both phone numbers and email links are clickable, touch-friendly (>= 44px), and point to `tel:` and `mailto:`.
- [x] `Code.gs` handles and appends `bus_to_church`, `bus_church_to_venue`, `bus_return`, and `comments` safely.

---

## Open Questions

None currently pending. All requirements and structure have been aligned.
