# Project Intent: Mobile-First Wedding Website

## Overview
A high-performance, mobile-first wedding landing page with a bespoke design, driven by an editable `content.json` configuration file, featuring a seamless RSVP form connected directly to Google Sheets.

## Core Intent
- **Outcome:** A bespoke, mobile-first single-page wedding website where all copy, dates, schedule entries, placeholder section, and bank details are configured via an external `content.json` file, with a custom-styled RSVP form submitting directly to Google Sheets and auto-clearing for multi-guest entries.
- **User:** Wedding guests browsing primarily on smartphones (frictionless RSVP submission, ability to register multiple guests/family members sequentially) and the couple (effortless text updates via JSON and live guest management via Google Sheets).
- **Why now:** Preparing wedding invitations and QR codes with a custom domain to collect guest confirmations, emails, dietary preferences, and allergies.
- **Success Criteria:**
  - Fast mobile load time (<1 second).
  - 100% theme consistency without external iframes.
  - Effortless text customization via `content.json` without touching HTML/CSS.
  - Zero-cost hosting with custom domain support and automatic SSL.
  - Seamless RSVP submissions delivered live into Google Sheets via Google Apps Script.
  - Automatic form field clearing post-submission with a "Submit Another RSVP" action to allow frictionless multi-guest/family registrations.
- **Constraints:**
  - Zero server maintenance ($0/mo hosting).
  - Open RSVP flow (no login, no complex password gating).
  - Pure, optimized frontend (Vanilla HTML5, semantic modern CSS, lightweight JS).
- **Out of Scope:**
  - Heavy CMS installations or complex backend databases.
  - Multi-page navigation (everything lives on a fluid single-page scroll).
  - Paid hosting plans.

## 5 Core Sections & Features
1. **Hero & Live Countdown**
   - Names, date, location, and real-time live countdown timer calculated from `content.json`.
2. **Schedule & Locations**
   - Timeline cards with one-tap "Open in Google Maps" and "Add to Google Calendar" buttons.
3. **Custom Information / Placeholder Section**
   - Modular section (e.g. Travel & Accommodations, FAQ, or Our Story) configured via `content.json`.
4. **Custom RSVP Form & Multi-Guest Reset**
   - **Full Name \*** (Required)
   - **Email \*** (Required)
   - **Dietary Notes** (Dropdown: `none` [default], `vegan`, `vegetarian`, `no meat`, `carbotarian`)
   - **Allergies** (Text input for specific food allergies or medical considerations)
   - **Will come? \*** (Required toggle: `Yes` / `No`)
   - **Send Button** with loading spinner and success confirmation feedback.
   - **Auto-Clear Flow:** After submission, all fields automatically reset and a "Submit Another RSVP" button allows guests to easily register another family member/partner.
5. **Gifts & Bank Details**
   - Registry note and bank transfer details with a 1-tap "Copy IBAN" button.

## Architecture
- **Frontend:** Vanilla HTML5 + CSS (Design System Tokens) + Vanilla JS (JSON dynamic renderer & form handler).
- **Configuration:** `content.json` containing all copy, dates, locations, and settings.
- **Backend:** Google Apps Script Web App endpoint writing to Google Sheets.
- **Hosting:** Cloudflare Pages or Vercel (Free tier) with Custom Domain support.
