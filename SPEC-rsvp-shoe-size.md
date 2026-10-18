# Spec: RSVP Comfortable Shoe Size (`rsvp-shoe-size`)

> Status: **APPROVED (2026-10-05)** · Source idea: [docs/ideas/rsvp-shoe-size.md](docs/ideas/rsvp-shoe-size.md) · Plan: [tasks/plan.md](tasks/plan.md) · Tasks: [tasks/todo.md](tasks/todo.md)

## Assumptions
1. The field is the **last field in the form**: after the bus block (toggle + stop/notes), directly before the Submit button. *(UI review: keeps Dietary/Allergies together and puts the optional gift last.)*
2. The field is **always visible**, like the other fields. When the guest picks "No, I decline", the stored value is cleared in both `rsvp.js` and `Code.gs`.
3. The copy is Spanish and comes from `content.json`, split into a **short label** and a **hint**:
   - Label: *"Talla de calzado"*
   - Hint: *"Si quieres unos zapatos cómodos para el baile, selecciona tu talla"*
   - No "(opcional)" marker. The form only marks required fields with `*`.
4. Sizes are **strings** (`"35"`), so the sizes don't depend on number formatting and could later include `"38.5"` if needed.
5. The live Google Sheet is **empty or has only test data**, so `setupSheet()` writes the new header itself.
6. **No new dependencies** and no build step. The project stays vanilla HTML/CSS/JS ([ADR-001](docs/decisions/ADR-001-frontend-architecture-and-framework.md)).

## Objective
The couple gives comfortable shoes to guests after dinner and needs to know **which sizes to order**. Guests who want shoes pick their size in the RSVP form. Guests who don't want shoes leave it blank.

**User stories**
- As a **guest**, I can optionally pick my shoe size in the RSVP, or skip it, without being asked my gender.
- As the **couple**, I see a `Shoe Size` column in the Google Sheet and can count pairs per size.
- As the **couple**, I can change the available sizes by editing one array in `content.json` (plus its copy in `Code.gs`), without touching HTML or JS.

**Decisions**
- One dropdown per RSVP, regardless of plus-one.
- Blank default (`""`, "-- No, gracias --"). Never required.
- Sizes are individual EU sizes **35–43**, confirmed with the seller.
- No gender field, no toggle, no extra-pairs field.

## UI Decisions (from the frontend review)
| # | Decision | Rationale |
|---|---|---|
| U1 | Place it **last, after the bus block, before Submit** | Planning fields first, optional gift last; keeps Dietary/Allergies together; Allergies is a medical question and a shoe question next to it would read like one too |
| U2 | **Short label + hint**, connected with `aria-describedby` | The 65-character label wrapped to 3 bold lines at 320px; the hint is announced by screen readers |
| U3 | Use the **native `<select>`**, not radio pills | Opens the phone's own picker, accessible without extra work, matches the Dietary dropdown, no new interaction CSS |
| U4 | "-- No, gracias --" option is **selectable** (not `disabled`) | A guest who picked a size must be able to change their mind; the bus-stop placeholder is `disabled`, this one must not be |
| U5 | **Full width** select | Consistent with the Dietary select |
| U6 | New `.form-hint` class using **existing tokens only** | No new colours or spacing values |

## Tech Stack
- Semantic HTML5, vanilla ES6 modules (`js/app.js`, `js/rsvp.js`), CSS custom properties (`css/variables.css`).
- Content in `content.json`, loaded with `fetch` ([ADR-003](docs/decisions/ADR-003-content-json-decoupling.md)).
- Backend: Google Apps Script web app writing to Google Sheets ([ADR-002](docs/decisions/ADR-002-backendless-rsvp-via-google-apps-script-and-sheets.md)).

## Commands
```bash
# Local dev server (from repo root)
python -m http.server 8000      # → http://localhost:8000/#rsvp
# OR
npx serve .

# Validate content.json syntax (PowerShell)
Get-Content content.json -Raw | ConvertFrom-Json | Out-Null

# Review changes
git status
git diff
```
**Apps Script deploy (manual, in Google):** Extensions → Apps Script → paste `Code.gs` → **Deploy → Manage deployments → Edit → New version → Deploy**. The `/exec` URL stays the same.

## Project Structure (files touched)
```
content.json                     → rsvp.labels.shoeSize, shoeSizeHint, shoeSizePlaceholder, shoeSizeOptions[]
index.html                       → shoe-size form-group after #bus-fields, before the Submit button
css/style.css                    → .form-hint (existing tokens only)
js/app.js                        → label + hint hydration, hydrateShoeSizeOptions()
js/rsvp.js                       → collect, payload field, reset
google-apps-script/Code.gs       → SHOE_SIZES, header, validation, appendRow column
google-apps-script/README.md     → column list + sync rule
docs/decisions/ADR-002-*.md      → payload schema
docs/ideas/rsvp-shoe-size.md     → source idea (already exists)
```

## Data Contract
| Layer | Key | Allowed values |
|---|---|---|
| `content.json` | `rsvp.labels.shoeSizeOptions` | array of strings, currently `["35"…"43"]` |
| `content.json` | `rsvp.labels.shoeSize` / `shoeSizeHint` / `shoeSizePlaceholder` | label, hint, and blank-option text |
| DOM | `#shoe_size` (`name="shoe_size"`) | `""` or one entry of `shoeSizeOptions` |
| Payload | `shoe_size` | the chosen size, or `""` when blank **or** `attending === false` |
| `Code.gs` | `SHOE_SIZES` | **same list** as `shoeSizeOptions` |
| Sheet | column **N**, header `Shoe Size` | size, or an empty cell |

> [!IMPORTANT]
> `Code.gs` cannot read `content.json`. Any change to the sizes must be made in **both** lists, and then the Apps Script must be **redeployed**.

## Code Style
Follow the existing patterns. Model the new code on `hydrateDietaryOptions` and the existing `.form-group` markup.

```html
<!-- index.html — after #bus-fields, before the Submit button -->
<!-- Shoe Size (optional: blank = no shoes wanted) -->
<div class="form-group">
  <label for="shoe_size" class="form-label" id="label-shoe-size">Talla de calzado</label>
  <p class="form-hint" id="shoe-size-hint">Si quieres unos zapatos cómodos para el baile, selecciona tu talla</p>
  <select id="shoe_size" name="shoe_size" class="form-control" aria-describedby="shoe-size-hint">
    <option value="" selected>-- No, gracias --</option>
    <option value="35">35</option>
    <!-- … 36–42 … -->
    <option value="43">43</option>
  </select>
</div>
```
```css
/* css/style.css — next to .form-label; existing tokens only */
.form-hint {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.375rem;
}
```
```js
// js/app.js — in the RSVP labels block
setText('label-shoe-size', labels.shoeSize);
setText('shoe-size-hint', labels.shoeSizeHint);
hydrateShoeSizeOptions(content);

// escape every value, keep the blank option first and NOT disabled
function hydrateShoeSizeOptions(content) {
  const select = document.getElementById('shoe_size');
  if (!select) return;

  const labels = content.rsvp?.labels || {};
  const sizes = labels.shoeSizeOptions;
  if (!Array.isArray(sizes) || sizes.length === 0) return;

  const currentVal = select.value;
  const placeholder = labels.shoeSizePlaceholder || '-- No, gracias --';
  select.innerHTML =
    `<option value="" ${!currentVal ? 'selected' : ''}>${escapeHtml(placeholder)}</option>` +
    sizes.map(size =>
      `<option value="${escapeHtml(size)}" ${currentVal === String(size) ? 'selected' : ''}>${escapeHtml(size)}</option>`
    ).join('');
}
```
```js
// google-apps-script/Code.gs — validate against the list, column goes LAST
// Keep in sync with content.json → rsvp.labels.shoeSizeOptions
var SHOE_SIZES = ["35", "36", "37", "38", "39", "40", "41", "42", "43"];

var shoeSizeRaw = String(data.shoe_size || "").trim();
var shoeSize = (attending === "Yes" && SHOE_SIZES.indexOf(shoeSizeRaw) !== -1) ? shoeSizeRaw : "";
```
**Conventions:** snake_case for DOM ids and payload keys, camelCase for `content.json` keys and JS variables, Spanish user-facing copy, a pre-rendered HTML fallback so the form still works if `content.json` fails to load, design tokens from `css/variables.css` (no raw hex or values off the spacing scale).

## Testing Strategy
There is no automated test framework in this repo, and adding one is out of scope. Verification is **manual and repeatable**:

| Level | What | How |
|---|---|---|
| Static | `content.json` is valid | the PowerShell `ConvertFrom-Json` command above |
| Browser (simulation) | Rendering, payload, reset | Temporarily clear `googleAppsScriptUrl` locally (do not commit) → submit → read `[RSVP Simulation]` payload in the DevTools console |
| Browser (DevTools MCP) | Options, ARIA, layout | `evaluate_script` to read the `#shoe_size` options and `aria-describedby`; `resize_page` to 320 / 768 / 1024 / 1440 + `take_screenshot` |
| Accessibility | Keyboard and screen reader | Tab order reaches the field after the bus block and before Submit; the hint is announced with the select; no console or a11y warnings |
| Backend | Validation and column alignment | Apps Script editor: run `doPost` with a mock `e.postData.contents`, or submit the live form → check Sheet column N |

## Boundaries
- **Always:** escape values from `content.json` before putting them in `innerHTML`; append the Sheet column **last**; keep `SHOE_SIZES` and `shoeSizeOptions` identical; keep the HTML fallback options for when `content.json` fails to load; use existing CSS tokens; update ADR-002 and the Apps Script README in the same change.
- **Ask first:** reordering or inserting Sheet columns anywhere except the end; making the field required or conditional; changing `googleAppsScriptUrl`; adding any dependency or test framework; deploying the Apps Script; adding new design tokens.
- **Never:** commit a cleared or changed `googleAppsScriptUrl`; store unvalidated `shoe_size` values in the Sheet; add a gender field; make the blank option `disabled`; touch unrelated RSVP fields or styling.

## Success Criteria
1. The field is the **last field in the form**: after the bus block, directly before Submit, in both the visual order and the Tab order.
2. The label reads "Talla de calzado", **fits on one line at 320px**, and has no `*` or "(opcional)" marker.
3. The hint is shown under the label, styled with `.form-hint`, and **announced with the select** through `aria-describedby="shoe-size-hint"`.
4. The dropdown shows the blank option selected, followed by exactly the sizes in `shoeSizeOptions`, in the same order.
5. After picking a size, "-- No, gracias --" **can be chosen again** (it is not `disabled`).
6. With `content.json` unavailable, the HTML fallback still shows the label, hint, blank option and 35–43.
7. Adding `"44"` to `shoeSizeOptions` and `SHOE_SIZES` makes 44 selectable and saved, with **no** HTML or JS edits.
8. Payload: blank → `shoe_size: ""`. Size 38 → `"38"`. Size 38 then "No, I decline" → `""`.
9. Sheet: header `Shoe Size` in column N, values line up under it, and columns A–M are unchanged.
10. Forged payloads (`"=HYPERLINK(...)"`, `"99"`, a valid size while not attending) → empty cell, with no formula run.
11. "Enviar otro RSVP" resets the dropdown to blank.
12. Changing the label, hint or placeholder in `content.json` changes them on the page.
13. Renders without console errors and stays readable at 320 / 768 / 1024 / 1440 px.
14. ADR-002 and `google-apps-script/README.md` list `shoe_size` / `Shoe Size`.

## Out of Scope (found in UI review, separate changes)
- **iOS zoom on tap:** `.form-control` is `0.9375rem` (15px), so iOS Safari zooms on every form field. Fixing it means changing all fields to ≥16px.
- **Hiding fields when declining:** food, bus and shoe fields stay visible after "No, I decline". The data is cleared anyway.
- **Mixed fallback languages:** HTML fallback labels mix English and Spanish (the same as today).

## Open Questions
- None blocking. Please confirm the hint wording, or edit it later in `content.json`.
