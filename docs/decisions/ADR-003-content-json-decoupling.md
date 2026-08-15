# ADR-003: Centralized Content Configuration via `content.json`

## Status
Accepted

## Date
2026-08-15

## Context
Wedding planning is iterative: ceremony times change, venue addresses get updated, dress code guidance is refined, and bank account / gift links are added over time.
Key constraints:
- The couple or non-technical contributors should be able to update texts, dates, and information without editing HTML structure or CSS styles.
- Avoid introducing heavy headless CMS services (Sanity, Strapi, Contentful) that require authentication, API keys, or build webhooks.

## Decision
Decouple all user-facing copy, event details, countdown targets, color palettes, and banking info into a single root `content.json` file.
The application will:
1. Load `content.json` at initialization via `fetch('./content.json')`.
2. Provide pre-rendered static semantic HTML defaults for instant SEO and zero-JS accessibility.
3. Dynamically hydrate and bind all DOM elements, countdown targets, timeline events, and palette swatches from `content.json`.

## Alternatives Considered

### Hardcoded HTML Text
- **Pros:** Zero JavaScript required to render text.
- **Cons:** Any text update requires modifying HTML tags, risking accidental tag breakage or syntax errors by non-developers.
- **Rejected:** Lacks flexibility for frequent copy changes during wedding planning.

### Headless CMS (Contentful / Sanity / Prismic)
- **Pros:** Visual content editor dashboard.
- **Cons:** Requires account management, API tokens, webhook re-build triggers, and potential service deprecation or limits.
- **Rejected:** Overkill for a single-page wedding website.

## Consequences
- **Single Source of Truth:** All text, dates, venues, bank accounts, and RSVP labels live in one human-readable JSON file.
- **Safe Editing:** Editing copy does not touch layout, responsive styling, or form submission code.
- **Dynamic Extensibility:** Adding a new event to the timeline or a new color swatch is as simple as adding an item to the JSON array.
