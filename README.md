# 💍 Bespoke Wedding Landing Page & RSVP Tracker

A high-performance, mobile-first wedding landing page with zero server maintenance, decoupled text management via `content.json`, and seamless RSVP data collection directly into a private Google Sheet.

---

## 🌟 Highlights

- **Mobile-First & Ultra-Fast:** Sub-second mobile load time, zero framework bloat, 100/100 Lighthouse performance.
- **Single Source of Truth (`content.json`):** Change couple names, event dates, schedule items, informational text, and banking details in one JSON file without touching HTML/CSS.
- **Custom-Styled RSVP:** Guests fill out an elegant form matching the wedding aesthetic—no third-party iframes or redirects.
- **Zero Cost Hosting ($0/mo):** Deploy with 1-click on Cloudflare Pages or Vercel with free automated SSL certificates and custom domain support.
- **Live Google Sheets Sync:** RSVPs write directly into your Google Sheet via a lightweight Google Apps Script endpoint.

---

## 📋 The 5 Core Sections

1. **Hero & Live Countdown** — Couple names, date, venue location, real-time countdown timer, and localized unit labels.
2. **Event Locations & Schedule** — Stacked Ceremony (Church) and Reception (Finca) cards with customizable badges, times, addresses, and 1-tap *"Abrir en Maps"* navigation links.
3. **Transportation & Shuttle Buses** — Shuttle bus service details, pickup points, outbound and return timetables, and custom logistical notes.
4. **Reactive RSVP Form** — Fully decoupled form fields with:
   - First & Last Name *
   - Email *
   - Attendance Confirmation (Yes / No) *
   - Conditional Companion / Plus-One toggle with first & last name
   - Dynamic Dietary Preferences dropdown (configured via JSON array)
   - Allergies & Medical Restrictions input
   - Conditional Shuttle Bus selection with route dropdown
   - Anti-bot honeypot spam protection
   - "Submit Another RSVP" multi-guest registration reset
5. **Gifts & Wishing Well** — Bank transfer details (Account Holder, Bank, IBAN, BIC, Concept reference) with 1-tap *"Copy IBAN"* clipboard button.

---

## 🚀 Quick Start

### 1. Local Preview
Since the project uses Vanilla HTML/CSS/JS with standard fetch for `content.json`, run a lightweight local HTTP server:

```bash
# Using Python (built-in)
python -m http.server 8000

# OR using Node npx
npx serve .
```
Then visit `http://localhost:8000` in your browser.

---

## ✏️ How to Customize Text & Content

All content is managed in [`content.json`](./content.json). Every single element updates dynamically without editing HTML or CSS:

- **Metadata & SEO (`"meta"`):** Edit `"title"`, `"description"`, OpenGraph tags, and browser `"themeColor"`.
- **Couple & Countdown (`"couple"`, `"countdown"`):** Update `"dateDisplay"` or `"dateText"`, `"targetDateIso"` (for the countdown ticker), and timer labels (`"daysLabel"`, `"hoursLabel"`, etc.).
- **Locations (`"locations"`):** Customize Ceremony (`"church"`) and Reception (`"venue"`) badges, times, venue names, addresses, descriptions, and Google Maps URLs.
- **Transportation (`"transportation"`):** Configure titles, notes, timetable labels (`"pickupPoint"`, `"outboundHeading"`, `"returnHeading"`), and route departure/return schedules.
- **RSVP Labels & Options (`"rsvp"`):** 
  - Set your Google Apps Script endpoint in `"googleAppsScriptUrl"`.
  - Customize all question labels, placeholders, and confirmation button copy under `"labels"`.
  - Add or reorder dietary options in `"rsvp.labels.dietaryOptions"`.
- **Bank & Gifts (`"gifts"`):** Update `"bankDetails"` (Account Holder, Bank Name, IBAN, BIC, and Concept reference).
- **Footer (`"footer"`):** Update names, date, and closing tagline.

---

## 📊 Google Sheets RSVP Setup (3 Minutes)

Follow the complete step-by-step instructions in [**`google-apps-script/README.md`**](./google-apps-script/README.md):

1. Create a blank Google Sheet.
2. Open **Extensions** > **Apps Script**, paste the code from [`google-apps-script/Code.gs`](./google-apps-script/Code.gs), and click **Deploy as Web App**.
3. Copy your Web App URL and paste it into `"rsvp.googleAppsScriptUrl"` in `content.json`.

---

## 🌐 Free Deployment & Custom Domain

### Option A: Cloudflare Pages (Recommended — 100% Free)
1. Push this repository to GitHub.
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository. (Build command: *leave blank*, Output directory: `/`).
4. Click **Save and Deploy**.
5. In **Custom Domains**, add your domain (e.g. `lucasyelena.com`). Cloudflare automatically provisions free SSL/TLS.

### Option B: Vercel ($0/mo)
1. Import your GitHub repository in [Vercel Dashboard](https://vercel.com).
2. Framework Preset: **Other** (Root directory: `./`).
3. Click **Deploy**.
4. Go to **Settings** > **Domains** and enter your custom domain.

---

## 🏛️ Architecture Decision Records (ADRs)

Key architectural and technical decisions are documented in the `docs/decisions/` directory:

- [**ADR-001: Frontend Architecture & Framework Choice**](./docs/decisions/ADR-001-frontend-architecture-and-framework.md) — Why Vanilla HTML/CSS/JS was chosen for mobile performance and simplicity over heavy frameworks.
- [**ADR-002: Backendless RSVP via Google Apps Script & Sheets**](./docs/decisions/ADR-002-backendless-rsvp-via-google-apps-script-and-sheets.md) — Form field specifications, Google Sheet schema, and asynchronous data flow.
- [**ADR-003: Centralized Content Configuration via `content.json`**](./docs/decisions/ADR-003-content-json-decoupling.md) — Decoupled text architecture for safe, zero-code updates.
- [**ADR-004: Static Hosting Platform & Custom Domain Strategy**](./docs/decisions/ADR-004-hosting-and-custom-domain-deployment.md) — Zero-cost hosting on Cloudflare Pages / Vercel with custom domain DNS setup.
- [**Statement of Intent**](./docs/intent/wedding_page.md) — Product requirements and boundary definitions.
