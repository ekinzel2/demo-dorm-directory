/**
 * Get data from both tabs including headers
 * @returns {Object} Data from both sheets
 */
function getSheetData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const result = {};

  // Iterate through all sheets
  sheets.forEach((sheet) => {
    const sheetName = sheet.getName();
    const data = sheet.getDataRange().getValues();
    
    // Include all rows including the header row
    result[sheetName] = {
      headers: data[0],
      rows: data.slice(1),
      data: data // All data including headers
    };
  });

  return result;
}

/**
 * Web service endpoint to serve sheet data as JSON
 * Deploy as a web app to use this endpoint
 * @param {Object} e - Event parameters
 * @returns {TextOutput} JSON response
 */
function doGet(e) {
  try {
    const data = getSheetData();
    const response = {
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Alternative function to get data in a more structured format
 * @returns {Object} Formatted data from both sheets
 */
function getFormattedData() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const result = {};

  sheets.forEach((sheet) => {
    const sheetName = sheet.getName();
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    // Convert to array of objects with header keys
    const rows = data.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    result[sheetName] = rows;
  });

  return result;
}
