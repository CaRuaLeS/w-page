# ADR-001: Frontend Architecture and Framework Choice

## Status
Accepted

## Date
2026-08-15

## Context
We need to develop a mobile-first wedding landing page for wedding guests.
Key constraints and requirements:
- **Mobile-first performance:** The vast majority of wedding guests open the page on mobile phones (via WhatsApp, SMS, QR codes on paper invitations) over cellular connections (4G/5G). Load times must be sub-second (<1s).
- **Simplicity and maintenance:** The website should have zero runtime node server requirements, zero complex build pipeline friction, and be completely static.
- **Longevity and stability:** The website needs to remain functional without dependency rot or vulnerability updates before and during the wedding date.

## Decision
We choose **Vanilla HTML5, Modern CSS (Design System Tokens), and lightweight Vanilla JavaScript** (optionally bundled with a zero-config dev server like Vite for local preview).

## Alternatives Considered

### Next.js / React (SSR / Hydration)
- **Pros:** Component ecosystem, popular framework.
- **Cons:** Heavy JavaScript bundle payload (several hundred kilobytes of JS just for a single-page landing), slower First Input Delay (FID) / Interaction to Next Paint (INP) on mid-tier mobile phones, requires Node.js runtime or complex static export setup.
- **Rejected:** Over-engineered for a 5-section static landing page with an RSVP form.

### Heavy Site Builders (WordPress / Wix / Squarespace)
- **Pros:** Visual drag-and-drop.
- **Cons:** Paid subscriptions ($15–$30/month), bloated HTML/JS, limited customization for seamless Google Sheets integration without third-party plugins.
- **Rejected:** Unnecessary recurring costs and lack of bespoke design control.

### Static Site Generators (Astro / 11ty)
- **Pros:** Fast static output, content-driven.
- **Cons:** Adds extra abstraction and node build steps when simple standard HTML/CSS/JS delivers the exact same 100/100 Lighthouse score without any build tooling.
- **Decision:** Vanilla architecture gives identical performance with zero build complexity.

## Consequences
- **Zero build fatigue:** Can be previewed and deployed directly by pushing to any static host.
- **Instant load speeds:** Page weighs <50 KB uncompressed (excluding images/fonts), ensuring instantaneous mobile loading.
- **Broad compatibility:** Works across all mobile browsers (iOS Safari, Android Chrome, Samsung Internet, in-app Instagram/WhatsApp browsers).
