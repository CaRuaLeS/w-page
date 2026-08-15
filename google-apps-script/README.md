# Google Apps Script Setup for RSVP Form

This guide walks you through connecting your wedding website's RSVP form directly to a private Google Sheet in under 3 minutes, with **zero hosting cost** and **no technical maintenance**.

---

## Step 1: Create a Google Sheet
1. Open [Google Sheets](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Name the spreadsheet (e.g. `Wedding RSVPs 2026`).

---

## Step 2: Open the Apps Script Editor
1. In your Google Sheet menu, click **Extensions** > **Apps Script**.
2. A new tab will open with the script editor. Delete any default code in `Code.gs`.

---

## Step 3: Paste the Code
1. Copy the entire contents of [`Code.gs`](./Code.gs) and paste it into the editor.
2. Click the **Save icon** (💾 or `Ctrl+S` / `Cmd+S`).

---

## Step 4: Deploy as a Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon (⚙️) next to *Select type* and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `Wedding RSVP API v1`
   - **Execute as**: `Me (your_email@gmail.com)`
   - **Who has access**: `Anyone` *(Crucial: Allows your guests to submit their RSVP without logging into Google)*
4. Click **Deploy**.
5. When prompted, click **Authorize access**, select your Google account, and grant access (if you see an *Advanced* warning, click *Advanced* > *Go to Wedding RSVP (unsafe)* to approve).
6. Copy the generated **Web App URL** (it looks like `https://script.google.com/macros/s/AKfycb.../exec`).

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

## Google Sheet Output Schema

When guests submit their RSVP, rows are automatically appended with the following columns:

| Column A | Column B | Column C | Column D | Column E | Column F |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Timestamp** | **Full Name** | **Email** | **Dietary Notes** | **Allergies** | **Will Come** |
| `2026-08-15 15:30:00` | `Maria Gonzalez` | `maria@example.com` | `vegetarian` | `Lactose intolerant` | `Yes` |
| `2026-08-15 16:10:22` | `David Smith` | `david@example.com` | `none` | `None` | `No` |
