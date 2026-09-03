# Task Breakdown: Mobile-First Wedding Website

- [x] Task 1: Establish Design System Tokens & Typography (`theme-tokens`)
  - Acceptance: `css/variables.css` contains complete tokens for Option 1 typography (*Cormorant Garamond* + *Plus Jakarta Sans*), color palette, spacing scale, and mobile touch target dimensions.
  - Verify: Load CSS in browser and verify CSS custom properties resolve correctly.
  - Files: `css/variables.css`

- [x] Task 2: Build Mobile-First Semantic Skeleton & Layout (`layout-skeleton`)
  - Acceptance: `index.html` and `css/style.css` render all 5 vertical sections with pre-rendered fallback content matching `content.json`, responsive on all mobile viewports.
  - Verify: View `index.html` on mobile viewports (375px–430px) to verify zero overflow, proper hierarchy, and accessible tags.
  - Files: `index.html`, `css/style.css`

- [x] Task 3: Implement Countdown Timer & Calendar Generation (`countdown-calendar`)
  - Acceptance: `js/countdown.js` ticks in real-time to September 19, 2026. `js/calendar.js` generates both a valid Google Calendar URL and downloads a compliant `.ics` file.
  - Verify: Test ticker in browser; trigger "Add to Google Calendar" and test `.ics` file download.
  - Files: `js/countdown.js`, `js/calendar.js`

- [x] Task 4: Implement Event Locations & Transportation Cards (`locations-transport`)
  - Acceptance: Locations section displays Church (first) and Reception Finca (second) with scheduled times and working "Open in Maps" CTAs. Transportation section clearly details Route 1 (Plaza de España) and Route 2 (Pozuelo ESIC) with departure and return timetables.
  - Verify: Inspect cards on mobile viewports and test Maps links.
  - Files: `index.html`, `css/style.css`

- [x] Task 5: Implement Reactive Conditional RSVP Engine (`rsvp-engine`)
  - Acceptance: `js/rsvp.js` reactively toggles companion fields on `has_plus_one` and bus fields on `needs_bus` with smooth CSS expansion and accessible ARIA attributes. Validates input, submits POST to Google Apps Script, displays celebration card, and provides "Submit Another RSVP" button that cleanly resets fields for the next entry.
  - Verify: Test form with/without companion and bus toggles; verify validation errors; verify reset state on "Submit Another RSVP".
  - Files: `js/rsvp.js`, `index.html`, `css/style.css`

- [x] Task 6: Implement Dynamic Hydration Engine & Clipboard Utility (`content-engine`)
  - Acceptance: `js/app.js` loads `content.json` via `fetch('./content.json')`, dynamically binds texts, dates, and labels, and activates the 1-tap "Copy IBAN" button with toast feedback.
  - Verify: Modify a field in `content.json` and verify UI updates dynamically; test IBAN copy.
  - Files: `js/app.js`

- [x] Task 7: Quality Gate & Mobile Performance Audit (`audit-verification`)
  - Acceptance: 100/100 Lighthouse on Accessibility and Best Practices, >= 95 on Performance. Zero console errors. Complete compliance with ADR-001 through ADR-004.
  - Verify: Run syntax and structure checks; verified form payload matches ADR-002 schema.
  - Files: `index.html`, `css/style.css`, `js/app.js`
