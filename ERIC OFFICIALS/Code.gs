const SPREADSHEET_ID = "12ouLbtyguh2VWYX0_DQlJUU_KCCEZ4qQBtH0RL2UFP8";

// ─── Column headers (must match doPost row order) ───
const COLUMNS = [
  "ID", "Timestamp", "Division", "Sub Category", "Level", "Team Name",
  "Leader Name", "Leader Email", "Leader WhatsApp", "Leader Institution",
  "Leader Address", "Leader Congenital Disease",
  "Leader ID Card", "Leader Twibbon",
  "Member 1 Name", "Member 1 WhatsApp", "Member 1 Disease",
  "Member 1 ID Card", "Member 1 Twibbon",
  "Member 2 Name", "Member 2 WhatsApp", "Member 2 Disease",
  "Member 2 ID Card", "Member 2 Twibbon",
  "Lecturer Name", "Lecturer Email", "Lecturer WhatsApp", "Lecturer Disease",
  "Lecturer ID Card", "Lecturer Twibbon",
  "Payment Method", "Payment Status", "Amount Paid", "Payment Proof", "Ref Code",
  // RIC fields
  "RIC Stage 1 Status", "RIC Stage 2 Status", "RIC Stage 3 Status",
  "RIC Abstract Name", "RIC Abstract URL",
  "RIC Proposal Name", "RIC Proposal URL",
  "RIC Video Link",
  "RIC Poster Name", "RIC Poster URL",
  "RIC PPT Name", "RIC PPT URL"
];

// ─── Map human-readable column → frontend camelCase key ───
const KEY_MAP = {
  "ID": "id",
  "Division": "divisionId",
  "Sub Category": "subCategory",
  "Level": "level",
  "Team Name": "teamName",
  "Leader Name": "leaderName",
  "Leader Email": "leaderEmail",
  "Leader WhatsApp": "leaderWhatsApp",
  "Leader Institution": "leaderInstitution",
  "Leader Address": "leaderAddress",
  "Leader Congenital Disease": "leaderCongenitalDisease",
  "Leader ID Card": "leaderIdCardUrl",
  "Leader Twibbon": "leaderTwibbonUrl",
  "Lecturer ID Card": "lecturerIdCardUrl",
  "Lecturer Twibbon": "lecturerTwibbonUrl",
  "Member 1 Name": "m1Name",
  "Member 1 WhatsApp": "m1WhatsApp",
  "Member 1 Disease": "m1CongenitalDisease",
  "Member 1 ID Card": "m1IdCardUrl",
  "Member 1 Twibbon": "m1TwibbonUrl",
  "Member 2 Name": "m2Name",
  "Member 2 WhatsApp": "m2WhatsApp",
  "Member 2 Disease": "m2CongenitalDisease",
  "Member 2 ID Card": "m2IdCardUrl",
  "Member 2 Twibbon": "m2TwibbonUrl",
  "Lecturer Name": "lecturerName",
  "Lecturer Email": "lecturerEmail",
  "Lecturer WhatsApp": "lecturerWhatsApp",
  "Lecturer Disease": "lecturerCongenitalDisease",
  "Payment Method": "paymentMethod",
  "Payment Status": "paymentStatus",
  "Amount Paid": "amount",
  "Payment Proof": "paymentProofUrl",
  "Ref Code": "refCode",
  "RIC Stage 1 Status": "ricStage1Status",
  "RIC Stage 2 Status": "ricStage2Status",
  "RIC Stage 3 Status": "ricStage3Status",
  "RIC Abstract Name": "ricAbstractName",
  "RIC Abstract URL": "ricAbstractUrl",
  "RIC Proposal Name": "ricProposalName",
  "RIC Proposal URL": "ricProposalUrl",
  "RIC Video Link": "ricVideoLink",
  "RIC Poster Name": "ricPosterName",
  "RIC Poster URL": "ricPosterUrl",
  "RIC PPT Name": "ricPptName",
  "RIC PPT URL": "ricPptUrl"
};

// ─── doGet — return ALL rows as JSONP for admin dashboard ───
function doGet(e) {
  var action = e.parameter.action || "";
  if (action !== "getRegistrations") {
    var empty = JSON.stringify([]);
    var cb = e.parameter.callback || "";
    if (cb) return ContentService.createTextOutput(cb + "(" + empty + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
    return ContentService.createTextOutput(empty).setMimeType(ContentService.MimeType.JSON);
  }
  var callback = e.parameter.callback || "";
  var email = e.parameter.email || "";

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getActiveSheet();
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  if (values.length < 2) {
    // Only header or empty
    var result = JSON.stringify([]);
    if (callback) return ContentService.createTextOutput(callback + "(" + result + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  }

  var headers = values[0];
  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var obj = {};
    for (var c = 0; c < headers.length; c++) {
      var key = KEY_MAP[headers[c]] || headers[c];
      obj[key] = row[c] || "";
    }
    rows.push(obj);
  }

  // Filter by email if provided
  if (email) {
    rows = rows.filter(function(row) { return row.leaderEmail === email; });
  }

  var result = JSON.stringify(rows);
  if (callback) {
    return ContentService.createTextOutput(callback + "(" + result + ")").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
}

// ─── doPost — store registration + RIC data ───
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getActiveSheet();

    // Ensure RIC columns exist
    ensureColumns(sheet);

    // Upload ID cards, twibbons, payment proof (only if base64 data: URLs)
    var idFolder = getOrCreateFolder("ERIC_ID_Cards");
    var twibbonFolder = getOrCreateFolder("ERIC_Twibbons");
    var proofFolder = getOrCreateFolder("ERIC_Payment_Proofs");

    var leaderIdUrl = uploadBase64File(data.leaderIdCardUrl, "LEADER_ID_" + data.teamName + "_" + (data.leaderIdCardName || "id_card"), idFolder);
    var leaderTwibbonUrl = uploadBase64File(data.leaderTwibbonUrl, "LEADER_TWIBBON_" + data.teamName + "_" + (data.leaderTwibbonName || "twibbon"), twibbonFolder);

    var m1IdUrl = uploadBase64File(data.m1IdCardUrl, "MEMBER1_ID_" + data.teamName + "_" + (data.m1IdCardName || "id_card"), idFolder);
    var m1TwibbonUrl = uploadBase64File(data.m1TwibbonUrl, "MEMBER1_TWIBBON_" + data.teamName + "_" + (data.m1TwibbonName || "twibbon"), twibbonFolder);

    var m2IdUrl = uploadBase64File(data.m2IdCardUrl, "MEMBER2_ID_" + data.teamName + "_" + (data.m2IdCardName || "id_card"), idFolder);
    var m2TwibbonUrl = uploadBase64File(data.m2TwibbonUrl, "MEMBER2_TWIBBON_" + data.teamName + "_" + (data.m2TwibbonName || "twibbon"), twibbonFolder);

    var lecturerIdUrl = uploadBase64File(data.lecturerIdCardUrl, "LECTURER_ID_" + data.teamName + "_" + (data.lecturerIdCardName || "id_card"), idFolder);
    var lecturerTwibbonUrl = uploadBase64File(data.lecturerTwibbonUrl, "LECTURER_TWIBBON_" + data.teamName + "_" + (data.lecturerTwibbonName || "twibbon"), twibbonFolder);

    var payProofUrl = uploadBase64File(data.paymentProofUrl, "PAY_PROOF_" + data.teamName + "_" + (data.paymentProofName || "proof"), proofFolder);

    // Build row — order must match COLUMNS
    var row = [
      data.id, new Date().toLocaleString(), data.divisionId, data.subCategory || "-", data.level || "-", data.teamName,
      data.leaderName, data.leaderEmail, data.leaderWhatsApp, data.leaderInstitution,
      data.leaderAddress || "-", data.leaderCongenitalDisease || "-",
      leaderIdUrl, leaderTwibbonUrl,
      data.m1Name || "-", data.m1WhatsApp || "-", data.m1CongenitalDisease || "-", m1IdUrl, m1TwibbonUrl,
      data.m2Name || "-", data.m2WhatsApp || "-", data.m2CongenitalDisease || "-", m2IdUrl, m2TwibbonUrl,
      data.lecturerName || "-", data.lecturerEmail || "-", data.lecturerWhatsApp || "-",
      data.lecturerCongenitalDisease || "-", lecturerIdUrl, lecturerTwibbonUrl,
      data.paymentMethod, data.paymentStatus, data.amount || "IDR 250,000", payProofUrl, data.refCode,
      // RIC fields
      data.ricStage1Status || "-", data.ricStage2Status || "-", data.ricStage3Status || "-",
      data.ricAbstractName || "", data.ricAbstractUrl || "",
      data.ricProposalName || "", data.ricProposalUrl || "",
      data.ricVideoLink || "",
      data.ricPosterName || "", data.ricPosterUrl || "",
      data.ricPptName || "", data.ricPptUrl || ""
    ];

    // Upsert: update row if ID exists, else append
    var existingRow = findRowById(sheet, data.id);
    if (existingRow > 0) {
      var range = sheet.getRange(existingRow, 1, 1, row.length);
      range.setValues([row]);
    } else {
      sheet.appendRow(row);
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: data.id }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Helpers ───

function getOrCreateFolder(name) {
  var folders = DriveApp.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(name);
}

function uploadBase64File(base64Data, filename, folder) {
  if (!base64Data || !base64Data.startsWith("data:")) return base64Data || "-";
  try {
    var parts = base64Data.split(",");
    var mimeMatch = parts[0].match(/:(.*?);/);
    var mimeType = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    var decoded = Utilities.base64Decode(parts[1]);
    var blob = Utilities.newBlob(decoded, mimeType, filename);
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return "Upload Error: " + err.toString();
  }
}

function findRowById(sheet, id) {
  var ids = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0].toString() === id.toString()) return i + 2;
  }
  return -1;
}

function ensureColumns(sheet) {
  // If sheet has fewer columns than COLUMNS, add missing headers
  var lastCol = sheet.getLastColumn();
  if (lastCol < COLUMNS.length) {
    var headerRange = sheet.getRange(1, lastCol + 1, 1, COLUMNS.length - lastCol);
    var newHeaders = [];
    for (var i = lastCol; i < COLUMNS.length; i++) {
      newHeaders.push(COLUMNS[i]);
    }
    headerRange.setValues([newHeaders]);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#FFD700");
    headerRange.setFontColor("#000000");
  }
}
