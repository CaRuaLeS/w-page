/**
 * Hardened Google Apps Script Web App for Wedding RSVP
 * 
 * Security features:
 * - Anti-Formula Injection: Neutralizes =, +, -, @, and control characters to protect Google Sheets.
 * - Anti-Bot Honeypot: Silently drops automated spam submissions.
 * - Server-side validation: Enforces presence and length boundaries on all inputs.
 * - Information disclosure prevention: Suppresses internal error traces and sheet IDs.
 * - Concurrency control: Uses LockService to prevent race conditions during simultaneous writes.
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Replace the code in Code.gs with this hardened version.
 * 4. Click Deploy > Manage deployments > Edit > New version, then click Deploy.
 */

function setupSheet() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getActiveSheet();
  
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp",
      "First Name",
      "Last Name",
      "Email",
      "Attending",
      "Has Plus One",
      "Plus One First Name",
      "Plus One Last Name",
      "Dietary Preference",
      "Allergies",
      "Needs Bus",
      "Bus Stop",
      "Bus Notes"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EFECE6");
    sheet.setFrozenRows(1);
  }
}

/**
 * Sanitizes input cells to prevent CSV/Formula Injection attacks.
 * If a string begins with =, +, -, @, tab, or carriage return,
 * it prepends a single quote (') so Google Sheets stores it strictly as plain text.
 */
function sanitizeCell(val, maxLen) {
  if (val === null || val === undefined) return "";
  var str = String(val).trim();
  
  // Enforce maximum permissible length
  if (maxLen && str.length > maxLen) {
    str = str.substring(0, maxLen);
  }
  
  // Neutralize formula injection
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // Wait up to 10s for concurrent submissions
  if (!lock.tryLock(10000)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "Server busy. Please try again."
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    setupSheet();

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    // 1. Anti-Bot Honeypot trap: If filled, silently acknowledge without saving
    if (data.honeypot_check && String(data.honeypot_check).trim().length > 0) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "success",
          message: "RSVP recorded successfully."
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 2. Validate mandatory fields
    var firstName = sanitizeCell(data.first_name, 60);
    var lastName = sanitizeCell(data.last_name, 60);
    var email = sanitizeCell(data.email, 120);

    if (!firstName || !lastName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: "Invalid or incomplete submission."
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Extract and sanitize remaining fields
    var attending = (data.attending === true || data.attending === "true" || data.attending === "Yes") ? "Yes" : "No";
    var hasPlusOne = (data.has_plus_one === true || data.has_plus_one === "true" || data.has_plus_one === "Yes") ? "Yes" : "No";
    var plusOneFirstName = hasPlusOne === "Yes" ? sanitizeCell(data.plus_one_first_name, 60) : "";
    var plusOneLastName = hasPlusOne === "Yes" ? sanitizeCell(data.plus_one_last_name, 60) : "";

    var dietaryPreference = sanitizeCell(data.dietary_preference, 30) || "none";
    var allergies = sanitizeCell(data.allergies, 200);

    var needsBus = (data.needs_bus === true || data.needs_bus === "true" || data.needs_bus === "Yes") ? "Yes" : "No";
    var busStop = needsBus === "Yes" ? sanitizeCell(data.bus_stop, 40) : "";
    var busNotes = needsBus === "Yes" ? sanitizeCell(data.bus_notes, 300) : "";

    // 4. Append sanitized row to private spreadsheet
    sheet.appendRow([
      new Date(),
      firstName,
      lastName,
      email,
      attending,
      hasPlusOne,
      plusOneFirstName,
      plusOneLastName,
      dietaryPreference,
      allergies,
      needsBus,
      busStop,
      busNotes
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "RSVP recorded successfully."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return safe generic error — do not expose internal error messages or sheet IDs
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "Unable to process RSVP at this time."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      message: "Wedding RSVP Endpoint is live."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
