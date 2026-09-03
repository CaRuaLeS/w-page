# Technical Implementation Plan: Mobile-First Wedding Website

## Overview
This plan defines the architecture, vertical slicing, and implementation sequence for the bespoke, mobile-first wedding landing page for Elena & Lucas. It adheres strictly to the approved specification: Option 1 typography (*Cormorant Garamond* + *Plus Jakarta Sans*), 5 stacked sections, and a reactive, conditional RSVP form backed by Google Apps Script and Google Sheets.

---

## 1. Architectural Strategy & Dependencies

### Technology Stack
- **Structure:** Semantic HTML5 (`index.html`) with pre-rendered fallback text for instant SEO and zero-JS accessibility.
- **Styling:** CSS Modern Custom Properties (`css/variables.css`) and responsive Mobile-First rules (`css/style.css`).
- **Typography:** Option 1: *Cormorant Garamond* (headings/display) + *Plus Jakarta Sans* (body). Preconnected and subsetted for sub-second FCP.
- **Logic:** Vanilla ES6+ modules (`js/app.js`, `js/countdown.js`, `js/calendar.js`, `js/rsvp.js`).
- **Data Source:** External configuration `content.json`.
- **RSVP Backend:** Google Apps Script Web App writing directly to a private Google Sheet.

### Dependency Graph & Build Order
```
[css/variables.css (Tokens & Fonts)]
         │
         ▼
[css/style.css (Mobile-First Layout)] ──┐
         │                              │
         ▼                              ▼
[index.html (Semantic Fallback DOM)] ───┼─► [js/app.js (Hydration Engine)]
                                        │          │
                                        ├──────────┼─► [js/countdown.js]
                                        ├──────────┼─► [js/calendar.js]
                                        └──────────┴─► [js/rsvp.js (Reactive Form)]
```

---

## 2. Implementation Phases & Vertical Slices

### Phase 2.1: Foundation & Design System (`theme-tokens`)
- Establish CSS custom properties in `css/variables.css` for typography, color palette, spacing scale, border radii, shadows, and smooth transitions.
- Configure Google Fonts preconnect and font loading strategy with `font-display: swap`.

### Phase 2.2: Semantic Skeleton & Mobile Layout (`layout-skeleton`)
- Construct `index.html` with semantic structure for all 5 vertical sections.
- Populate pre-rendered fallback content from `content.json` to guarantee immediate readability without JavaScript.
- Apply mobile-first responsive layout in `css/style.css`.

### Phase 2.3: Date, Calendar & Live Countdown (`countdown-calendar`)
- Implement `js/countdown.js` to compute real-time remaining days, hours, minutes, and seconds.
- Implement `js/calendar.js` with dual capability:
  1. Direct Google Calendar intent link with pre-filled UTC start/end times.
  2. RFC 5545 `.ics` dynamic Blob generator for native Apple Calendar / Outlook import.

### Phase 2.4: Locations & Transportation (`locations-transport`)
- Style stacked cards: Church (Ceremony) first, Finca (Reception) second.
- Implement "Open in Maps" deep links for mobile navigation.
- Implement shuttle bus timetable cards for Route 1 (Plaza de España) and Route 2 (Pozuelo ESIC).

### Phase 2.5: Reactive Conditional RSVP Form (`rsvp-engine`)
- Implement accessible form controls with proper `for`/`id` bindings and ARIA tags.
- Implement reactive conditional expansion:
  - Companion fields (`plus_one_first_name`, `plus_one_last_name`) expand when `has_plus_one` is checked.
  - Bus stop route (`bus_stop`) and notes (`bus_notes`) expand when `needs_bus` is checked.
- Implement client-side validation for required fields and email syntax.
- Implement submission pipeline:
  - Button state management (loading spinner, disabled state).
  - Asynchronous `POST` dispatch to Google Apps Script.
  - Celebratory confirmation screen display.
  - Automatic input wiping and field state restoration for multi-guest submissions ("Submit Another RSVP").

### Phase 2.6: Dynamic Content Hydration & Utilities (`content-engine`)
- Hydrate copy, dates, and labels from `content.json` via `fetch('./content.json')`.
- Implement 1-tap "Copy IBAN" button with clipboard API and toast feedback.

---

## 3. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **CORS on Google Apps Script** | Network error on form submission | Apps Script endpoint redirects via 302; send payload with `Content-Type: text/plain;charset=utf-8` or standard URL-encoded body to bypass preflight issues. |
| **Mobile Layout Shift (CLS)** | Degraded user experience during font or JSON load | Pre-render initial HTML with identical fallback typography dimensions and semantic text so zero shift occurs on hydration. |
| **Form Validation on Hidden Inputs** | Native browser validation blocking submit on hidden fields | Dynamically add/remove `required` attributes and update `aria-hidden` whenever toggles change. |
| **In-App Browser Clipboard Blocks** | "Copy IBAN" fails on Instagram/WhatsApp webviews | Implement fallback to `document.execCommand('copy')` if `navigator.clipboard` is restricted. |

---

## 4. Verification Checkpoints

1. **Checkpoint 1 (Visual & Mobile-First):** Test on iPhone SE (375px), iPhone 15 (393px), and Android devices; ensure all touch targets >= 48px and typography scales fluidly.
2. **Checkpoint 2 (Countdown & Calendar):** Confirm ticker ticks accurately to September 19, 2026; test Google Calendar link and open `.ics` file in Apple/Outlook calendar.
3. **Checkpoint 3 (Conditional RSVP Flow):** 
   - Check/uncheck Companion toggle -> verify smooth expansion and required field toggling.
   - Check/uncheck Bus toggle -> verify bus stop selection appears.
   - Submit invalid email -> verify error message.
   - Submit valid payload -> verify spinner, success card, and "Submit Another RSVP" reset.
4. **Checkpoint 4 (Lighthouse Audit):** Verify Performance >= 95, Accessibility = 100, Best Practices = 100.
