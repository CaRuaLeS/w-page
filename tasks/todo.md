# Task Breakdown: Centralized Content Hydration & Schema Alignment

- [x] Task 1: DOM Hook Preparation & Structural Fixes (`dom-hooks`)
  - Acceptance: `index.html` contains dedicated semantic IDs for all static labels, section headers, badges, and countdown labels. Inner address text nodes are wrapped in `#church-address-text` and `#venue-address-text` preserving `<svg>` icons. Missing Bank Concept and Transport Note elements are added.
  - Verify: Inspect `index.html` structure; confirm SVG pin icons remain untouched when text updates.
  - Files: `index.html`

- [x] Task 2: Implement Complete Hydration Engine in `app.js` (`hydration-engine`)
  - Acceptance: `js/app.js` hydrates 100% of fields from `content.json`: meta tags, countdown unit labels, church/venue times and badges, transport notes, gifts concept, and initial button labels.
  - Verify: Load page and verify that all values in `content.json` reflect in DOM.
  - Files: `js/app.js`

- [x] Task 3: Implement Dynamic RSVP Labels & Select Options (`rsvp-hydration`)
  - Acceptance: `js/rsvp.js` and `js/app.js` dynamically hydrate all RSVP field labels, placeholders, radio labels, toggle questions, and `<select id="dietary_preference">` options from `content.rsvp.labels`.
  - Verify: Modify a dietary option or label in `content.json` and verify UI updates dynamically; verify form validation and submission payload remain unchanged.
  - Files: `js/app.js`, `js/rsvp.js`

- [x] Task 4: Verification Suite & Live DOM Proof (`verification-audit`)
  - Acceptance: Automated verification confirming every single leaf key in `content.json` updates its respective DOM node when changed. Zero console errors.
  - Verify: Run browser/DOM audit verification script and verify test passes for all keys.
  - Files: `scratch/verify-hydration.js` (or test runner)

- [x] Task 5: Documentation Synchronization (`docs-sync`)
  - Acceptance: `README.md`, `ADR-003`, `docs/intent/wedding_page.md` are updated with the exact `content.json` schema reference and accurate configuration instructions.
  - Verify: Review documentation files for consistency with `content.json` and current codebase.
  - Files: `README.md`, `docs/decisions/ADR-003-content-json-decoupling.md`, `docs/intent/wedding_page.md`


---

# Tasks: RSVP Comfortable Shoe Size (`rsvp-shoe-size`)
> Spec: [SPEC-rsvp-shoe-size.md](../SPEC-rsvp-shoe-size.md) · Plan: [plan.md](plan.md#technical-implementation-plan-rsvp-comfortable-shoe-size-rsvp-shoe-size)

- [x] Task 1: Content keys (`shoe-content`)
  - Acceptance: `rsvp.labels` has `shoeSize: "Talla de calzado"`, `shoeSizeHint: "Si quieres unos zapatos cómodos para el baile, selecciona tu talla"`, `shoeSizePlaceholder: "-- No, gracias --"`, `shoeSizeOptions: ["35"…"43"]`.
  - Verify: `Get-Content content.json -Raw | ConvertFrom-Json | Out-Null` runs without errors.
  - Files: `content.json`

- [x] Task 2: Markup + hint style (`shoe-markup`)
  - Acceptance: Shoe-size `form-group` placed after `#bus-fields` and before the Submit button; label, `<p class="form-hint" id="shoe-size-hint">`, `<select id="shoe_size" aria-describedby="shoe-size-hint">` with a selectable blank option + fallback 35–43; not `required`. `.form-hint` uses existing tokens only.
  - Verify: Load the page with `content.json` blocked → field is last, fallback shown; label fits on one line at 320px.
  - Files: `index.html`, `css/style.css`

- [x] Task 3: Fill in the dropdown and copy from content.json (`shoe-hydration`)
  - Acceptance: `setText` for the label and hint; `hydrateShoeSizeOptions()` builds the blank option + `shoeSizeOptions`, escaping every value.
  - Verify: Add `"44"` temporarily to `content.json` → it appears; change the label/hint text → it updates; no console errors.
  - Files: `js/app.js`

- [x] Task 4: Payload + reset (`shoe-payload`)
  - Acceptance: Payload has `shoe_size` = chosen size, or `""` when blank or declining; "Enviar otro RSVP" resets to blank.
  - Verify: Clear `googleAppsScriptUrl` locally (**do not commit**) → `[RSVP Simulation]` console payload shows correct values for blank / 38 / 38 + decline.
  - Files: `js/rsvp.js`

- [x] Task 5: Google Sheet script (`shoe-apps-script`)
  - Acceptance: `SHOE_SIZES` array with a sync comment; `"Shoe Size"` added as the **last** header; whitelist check (only when attending); `shoeSize` added as the **last** `appendRow` value.
  - Verify: Apps Script editor: a mock `doPost` writes 38 to column N; `"=HYPERLINK(...)"`, `"99"`, and a size while declining → empty cell; columns A–M unchanged.
  - Files: `google-apps-script/Code.gs`

- [x] Task 6: Redeploy Apps Script (`shoe-deploy`) — **manual, by the couple**
  - Acceptance: Sheet confirmed empty (or N1 header added by hand); new version deployed; `/exec` URL unchanged.
  - Verify: The `doGet` URL returns `status: ok`; Manage deployments shows the new version.
  - Files: none (Google UI)

- [x] Task 7: Docs + end-to-end check (`shoe-docs-e2e`)
  - Acceptance: ADR-002 payload schema lists `shoe_size`; the Apps Script README lists column N `Shoe Size` and the 3-step size-change checklist; all 14 spec success criteria pass.
  - Verify: Live RSVP with size 38 → Sheet row shows 38 in column N; check at 320 / 768 / 1024 / 1440 px; `git diff content.json` shows the original `googleAppsScriptUrl`.
  - Files: `docs/decisions/ADR-002-backendless-rsvp-via-google-apps-script-and-sheets.md`, `google-apps-script/README.md`


---

# Tasks: RSVP Shuttle Bus Legs, General Comments & Couple Contact (`SPEC-rsvp-buses-and-contacts`)
> Spec: [SPEC-rsvp-buses-and-contacts.md](../docs/specs/SPEC-rsvp-buses-and-contacts.md) · Plan: [plan.md](plan.md#technical-implementation-plan-rsvp-shuttle-bus-legs-general-comments--couple-contact-spec-rsvp-buses-and-contacts)

- [x] Task 1: Add Bus Legs, Comments & Contact Keys to `content.json` (`content-schema`)
  - Acceptance: `rsvp.labels.busSection` (leg1, leg2, leg3, seatsNoticeSingular, seatsNoticePlural), `rsvp.labels.commentsLabel`/`commentsHint`/`commentsPlaceholder`, and top-level `contact` (title, subtitle, partner1, partner2) exist in `content.json`.
  - Verify: `Get-Content content.json -Raw | ConvertFrom-Json | Out-Null` runs without errors.
  - Files: `content.json`

- [x] Task 2: 3-Leg Shuttle Bus Selector & Dynamic Companion Seat Notice (`bus-legs-slice`)
  - Acceptance: `#bus-fields` renders 3 `.radio-pill-group` blocks (`bus_to_church`, `bus_church_to_venue`, `bus_return`) and `#bus-seats-notice` (`aria-live="polite"`). Toggling `#has_plus_one` updates seat notice between 1 and 2 seats. Payload sends the 3 leg values (or `""` if not attending / no bus).
  - Verify: Toggle `#needs_bus` and `#has_plus_one`, check live seat text and console payload at 320px and desktop viewports.
  - Files: `index.html`, `css/style.css`, `js/app.js`, `js/rsvp.js`

- [x] Task 3: General Comments Field Slice (`comments-slice`)
  - Acceptance: `#comments-group` renders after `#shoe_size` and before `#rsvp-submit-btn` with `maxlength="500"` and `aria-describedby="hint-comments"`, hydrates from `content.json`, and sends `comments` in payload.
  - Verify: Inspect DOM order and simulated RSVP payload with comments.
  - Files: `index.html`, `js/app.js`, `js/rsvp.js`

- [x] Task 4: Borderless Couple Contact Section Slice (`contact-section-slice`)
  - Acceptance: `#contact` renders after `#gifts` and before `<footer>` with no card border/background, Lourdes on the left and Carlos on the right on desktop (>680px), stacked on mobile, with >= 44px `tel:` and `mailto:` links and preserved SVG icons.
  - Verify: Inspect `#contact` computed styles, SVG icon preservation, and responsive layout at 320px and 1024px.
  - Files: `index.html`, `css/style.css`, `js/app.js`

## Checkpoint 1: After Tasks 1–4 (Frontend Complete)
- [x] `content.json` parses cleanly without syntax errors.
- [x] All new DOM elements hydrate from `content.json` without wiping inline SVGs or throwing console errors.
- [x] Simulated RSVP submissions log accurate payloads for attending (with 1 or 2 seats) and declining guests.
- [x] Responsive layout verified at 320px, 375px, 768px, and 1024px.

- [x] Task 5: Update Google Apps Script Schema & Validation (`apps-script-update`)
  - Acceptance: `Code.gs` defines `BUS_LEG_1_3_OPTIONS` and `BUS_LEG_2_OPTIONS`, updates headers to 16 columns, validates the 3 bus legs, sanitizes `comments` (max 500 chars via `sanitizeCell`), and appends 16 columns in `doPost`.
  - Verify: Verify 16 headers match 16 `appendRow` items and formula-injection strings are prefixed with `'`.
  - Files: `google-apps-script/Code.gs`

- [x] Task 6: Documentation Sync & End-to-End Verification (`docs-and-e2e`)
  - Acceptance: `google-apps-script/README.md` and `docs/decisions/ADR-002-backendless-rsvp-via-google-apps-script-and-sheets.md` document the 16-column schema and all 6 spec success criteria pass.
  - Verify: End-to-end verification script / headless check + `git diff` audit.
  - Files: `google-apps-script/README.md`, `docs/decisions/ADR-002-backendless-rsvp-via-google-apps-script-and-sheets.md`

## Checkpoint 2: Complete (After Task 6)
- [x] All 6 tasks completed and verified.
- [x] Zero console errors, zero horizontal scroll at 320px, WCAG 2.1 AA touch targets and ARIA attributes verified.

