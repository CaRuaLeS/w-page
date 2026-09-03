# Google Apps Script Setup for RSVP Form

This guide walks you through connecting your wedding website's RSVP form directly to a private Google Sheet in under 3 minutes, with **zero hosting cost**, **hardened anti-bot security**, and **zero maintenance**.

---

## Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Name the spreadsheet (e.g. `Wedding RSVPs 2026`).

---

## Step 2: Open the Apps Script Editor
1. In your Google Sheet menu, click **Extensions** > **Apps Script**.
2. Delete any default code in the script editor.

---

## Step 3: Paste the Hardened Code
1. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it into the editor.
2. Click the **Save icon** (💾 or `Ctrl+S` / `Cmd+S`).

---

## Step 4: Deploy as a Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Wedding RSVP API v2 (Hardened)`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Allows your guests to submit their RSVP without logging into Google)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, select your Google account, and grant access (click *Advanced* > *Go to Wedding RSVP (unsafe)* if prompted).
6. Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

---

## Step 5: Connect URL to `content.json`
1. Open your project's [`content.json`](../content.json).
2. Find the `"rsvp"` section and paste your URL into the `"googleAppsScriptUrl"` field:
   ```json
   "rsvp": {
     "googleAppsScriptUrl": "https://script.google.com/macros/s/AKfycb.../exec",
     ...
   }
   ```
3. Save `content.json`. Your RSVP form is now live and recording entries directly to your Google Sheet!

---

## 🛡️ Security & Privacy Checklist

1. **Keep the Google Sheet Strictly Private:**
   - In Google Sheets, click the green **Share** button in the top right.
   - Ensure *General access* is set to **Restricted** (only you and your partner's specific email addresses).
   - **Never** change it to *"Anyone with the link can view"*.
2. **Formula Injection Defense:**
   - [`Code.gs`](./Code.gs) automatically sanitizes all user input cells by prepending a single quote (`'`) to any string starting with `=`, `+`, `-`, or `@`. This neutralizes malicious formulas (e.g. `=IMPORTXML`, `=HYPERLINK`) from executing when you open the spreadsheet.
3. **Spam & Bot Protection:**
   - The form contains an invisible honeypot field (`honeypot_check`) that traps automated web scrapers. If populated, the script silently discards the entry without wasting Google quota or cluttering your sheet.
4. **Account Safety:**
   - Web App submissions execute write-only operations (`appendRow`) on this specific spreadsheet. Guests **never** receive access to your Google account, password, emails, or Google Drive files.

---

## Google Sheet Output Schema

When guests submit their RSVP, rows are automatically appended with the following 13 columns:

| Col A | Col B | Col C | Col D | Col E | Col F | Col G | Col H | Col I | Col J | Col K | Col L | Col M |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Timestamp** | **First Name** | **Last Name** | **Email** | **Attending** | **Has Plus One** | **Plus One First Name** | **Plus One Last Name** | **Dietary Preference** | **Allergies** | **Needs Bus** | **Bus Stop** | **Bus Notes** |
| `2026-09-03 18:30` | `Maria` | `Garcia` | `maria@example.com` | `Yes` | `Yes` | `Carlos` | `Sanchez` | `gluten_free` | `Celiac` | `Yes` | `plaza_espana` | `Stroller onboard` |
| `2026-09-03 19:10` | `David` | `Smith` | `david@example.com` | `No` | `No` | `""` | `""` | `none` | `None` | `No` | `""` | `""` |
