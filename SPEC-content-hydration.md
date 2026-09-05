# Spec: Centralized Content Hydration & Schema Alignment (`content-hydration`)

## Objective
Establish a complete, robust, and verifiable hydration engine so that **100% of the content defined in `content.json` can be edited by non-technical users and will dynamically and faithfully reflect in `index.html` via `app.js` and `rsvp.js`**. 

Additionally, resolve existing DOM bugs where text injection currently breaks nested SVG icons, sync missing schema elements (such as bank concept, transportation notes, section headers, badges, and all form labels/placeholders), and synchronize all project documentation (`README.md`, `ADR-003`, `docs/intent/wedding_page.md`, `tasks/plan.md`, `tasks/todo.md`) with the single source of truth.

---

## Tech Stack & Commands
- **Frontend Core:** Semantic HTML5, Vanilla ES6+ Modules, CSS Custom Properties (CSS variables).
- **Execution Environment:** Static Web (served via any local static server or Cloudflare Pages/Vercel).
- **Commands:**
  ```bash
  # Local Development Server
  python -m http.server 8000
  # OR
  npx serve .

  # Git status & diff checks
  git status
  git diff
  ```

---

## Project Structure
```
/
├── content.json                         # Canonical single source of truth for all copy, dates, & labels
├── index.html                           # Semantic HTML skeleton with pre-rendered fallback content
├── css/
│   ├── variables.css                    # Design system tokens (colors, fonts, spacing)
│   └── style.css                        # Mobile-first responsive styling rules
├── js/
│   ├── app.js                           # Main orchestrator & dynamic DOM hydration engine
│   ├── calendar.js                      # Google Calendar intent & .ics generator
│   ├── countdown.js                     # Real-time countdown ticker
│   └── rsvp.js                          # Reactive RSVP form controller & Apps Script dispatcher
├── google-apps-script/
│   ├── Code.gs                          # Hardened backend endpoint for Google Sheets
│   └── README.md                        # Step-by-step Apps Script deployment guide
├── docs/
│   ├── decisions/
│   │   ├── ADR-001-frontend-architecture-and-framework.md
│   │   ├── ADR-002-backendless-rsvp-via-google-apps-script-and-sheets.md
│   │   ├── ADR-003-content-json-decoupling.md
│   │   └── ADR-004-hosting-and-custom-domain-deployment.md
│   └── intent/
│       └── wedding_page.md              # Project intent & boundary definitions
├── tasks/
│   ├── plan.md                          # Implementation plan & architecture
│   └── todo.md                          # Actionable task list & status tracking
└── SPEC-content-hydration.md            # This specification
```

---

## Code Style & Architectural Patterns

### 1. Non-Destructive DOM Text Hydration
Never call `.textContent = ...` on container elements that house child icons (e.g. `<svg>` location pins). Always bind text to dedicated inner text elements (`<span>`).

**Good (Preserves Icon):**
```html
<p class="card-address">
  <svg width="16" height="16" ... aria-hidden="true"></svg>
  <span id="church-address-text">Calle del General Castaños 2, 28004 Madrid</span>
</p>
```
```javascript
function setText(id, text) {
  if (text === undefined || text === null) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
```

### 2. Form Input & Attribute Hydration
Provide dedicated helper functions for attributes, placeholders, and meta tags:
```javascript
function setAttr(id, attr, value) {
  if (value === undefined || value === null) return;
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

function setMeta(selector, value) {
  if (!value) return;
  const el = document.querySelector(selector);
  if (el) el.setAttribute('content', value);
}
```

### 3. Accessible Dynamic Select Rendering
For select dropdowns (dietary preferences, bus stops), generate options dynamically from `content.json` arrays while preserving any currently selected or pre-rendered value:
```javascript
function hydrateSelectOptions(selectId, optionsArray, defaultPlaceholder) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl || !Array.isArray(optionsArray) || optionsArray.length === 0) return;
  
  const currentVal = selectEl.value;
  let html = '';
  if (defaultPlaceholder) {
    html += `<option value="" disabled ${!currentVal ? 'selected' : ''}>${escapeHtml(defaultPlaceholder)}</option>`;
  }
  html += optionsArray.map(opt => 
    `<option value="${escapeHtml(opt.value)}" ${currentVal === opt.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`
  ).join('');
  selectEl.innerHTML = html;
}
```

---

## Testing & Verification Strategy
1. **Automated Structural Verification:**
   - Scripted audit that walks every key path in `content.json` and verifies that a matching hydration target exists in `app.js` and in `index.html`.
2. **Visual & Behavioral Verification:**
   - Modify each section in `content.json` with distinctive canary values (e.g. `"Test Title"`, `"Test Badge"`, `"Test Address"`, custom dietary options) and inspect the rendered DOM to verify exact dynamic updates.
   - Verify that church and venue address SVG pin icons remain visible after hydration.
   - Verify countdown label translations (Days, Hours, Minutes, Seconds) update when changed in JSON.
   - Verify RSVP form labels, placeholders, dietary select dropdown, and honeypot remain intact and operational.
   - Verify Bank Details "Concept" row is visible and hydrated.
3. **No Console Errors:** Zero runtime exceptions or unhandled rejections during initial load or form interactions.

---

## Boundaries

### Always Do:
- Preserve pre-rendered semantic HTML fallback text for SEO and zero-JS accessibility.
- Escape all dynamic strings injected via `innerHTML` using `escapeHtml()` to prevent XSS.
- Keep CSS class-based styling decoupled from element IDs.
- Ensure all form inputs retain valid `for`/`id` pairings and ARIA attributes (`aria-expanded`, `aria-hidden`, `aria-live`).

### Ask First:
- Modifying the Google Apps Script POST payload schema (must match `Code.gs` and Google Sheet column structure).
- Introducing new external libraries or build dependencies.

### Never Do:
- Wipe out SVG icons by using `textContent` on parent elements.
- Hardcode user-facing copy or labels in JavaScript files.
- Remove fallback HTML content leaving blank nodes before hydration.

---

## Success Criteria
- [ ] Every single element in `content.json` is mapped to an identifiable target and verified to update the UI when edited.
- [ ] `church-address` and `venue-address` preserve their location pin SVG icons upon hydration.
- [ ] All RSVP field labels, placeholders, and select options (`dietary_preference`) are hydrated from `content.rsvp.labels`.
- [ ] Section titles, subtitles, and badges in `locations` and `rsvp` sections are dynamically bound.
- [ ] Missing elements in HTML (`bankDetails.concept`, `transportation.note`, countdown unit labels) are integrated into `index.html` and hydrated.
- [ ] Meta tags (`meta.description`, `og:title`, `og:description`, `theme-color`) are dynamically hydrated.
- [ ] Project documentation (`README.md`, `ADR-003`, `docs/intent/wedding_page.md`, `tasks/plan.md`, `tasks/todo.md`) accurately reflects the actual `content.json` schema and eliminates outdated references.

---

## Resolutions to Design Decisions
1. **Countdown Date Formatting (`dateText` vs `dateDisplay`):**
   - `app.js` will prioritize `content.countdown?.dateText` or `content.couple?.dateDisplay` so editing either property in `content.json` updates `#countdown-date-display` in the DOM without conflict.
2. **Transportation Route Headings (Internationalization):**
   - Add an optional `transportation.labels` object in `content.json` (e.g. `pickupPoint`, `outboundHeading`, `returnHeading`).
   - `hydrateTransportation()` in `app.js` will read these optional labels, falling back to sensible English defaults if omitted.
3. **Preservation of SVG Icons:**
   - Address elements will use dedicated text children (`#church-address-text` and `#venue-address-text`) to ensure the map pin SVGs remain permanently intact.
