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
