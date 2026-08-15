/**
 * Google Apps Script Web App for Wedding RSVP
 * 
 * Instructions:
 * 1. Open Google Sheets (create a new sheet named e.g. "Wedding RSVPs 2026").
 * 2. In Google Sheets, click Extensions > Apps Script.
 * 3. Replace all code in the script editor with this file (Code.gs).
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone" (important: allows guests to submit without Google login).
 * 8. Click "Deploy", authorize permissions, and copy the Web App URL.
 * 9. Paste the Web App URL into your content.json (field: "rsvp.googleAppsScriptUrl").
 */

function setupSheet() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getActiveSheet();
  
  // Set headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp",
      "Full Name",
      "Email",
      "Dietary Notes",
      "Allergies",
      "Will Come"
    ];
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EFECE6");
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10s for concurrent submissions

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    
    // Ensure header row exists
    setupSheet();

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var timestamp = new Date();
    var fullName = data.fullName || "";
    var email = data.email || "";
    var dietaryNotes = data.dietaryNotes || "none";
    var allergies = data.allergies || "";
    var willCome = data.willCome || "";

    // Append row to sheet
    sheet.appendRow([
      timestamp,
      fullName,
      email,
      dietaryNotes,
      allergies,
      willCome
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "RSVP recorded successfully."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
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
