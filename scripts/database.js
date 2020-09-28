var server = '';
var port = 3306;
var dbName = '';
var username = '';
var password = '';
var url = 'jdbc:mysql://' + server + ':' + port + '/' + dbName;

function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  var results = stmt.executeQuery('SELECT * FROM sheet_range_wow_role');
  var metaData = results.getMetaData();
  var numCols = metaData.getColumnCount();
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('mysql');
  sheet.clearContents();
  var arr = [];

  for (var col = 0; col < numCols; col++) {
    arr.push(metaData.getColumnName(col + 1));
  }

  sheet.appendRow(arr);

while (results.next()) {
  arr = [];
  for (var col = 0; col < numCols; col++) {
    arr.push(results.getString(col + 1));
  }
  sheet.appendRow(arr);
}

results.close();
stmt.close();
sheet.autoResizeColumns(1, numCols+1);
}