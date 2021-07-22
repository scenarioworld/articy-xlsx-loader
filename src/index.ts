import { LoaderDefinition } from 'webpack';
import Excel from 'exceljs';

// Expected name of the sheet with the localization information
const ExpectedSheetName = 'ArticyStrings';

// Our asyncronous loader
const loader: LoaderDefinition = function() {
  // Use async
  const callback = this.async();

  // Load XLSX file
  const workbook = new Excel.Workbook();
  workbook.xlsx.readFile(this.resourcePath).then(
    function(workbook) {
      // Get the appropriate worksheet
      const stringWorksheet = workbook.getWorksheet(ExpectedSheetName);
      if (stringWorksheet === undefined) {
        return callback(
          new Error(
            `Could not worksheet named '${ExpectedSheetName}'. This is not a valid Articy Localization XLSX.`
          )
        );
      }

      // Create language map from rows
      const localizationMap: Record<string, string> = {};
      stringWorksheet.getColumn(1).eachCell((cell, row) => {
        localizationMap[cell.text] = stringWorksheet.getCell(
          row,
          cell.col + 1
        ).text;
      });

      // Return string map
      callback(null, `export default ${JSON.stringify(localizationMap)}`);
    },
    function(reason) {
      // Forward fail reason along to Webpack
      callback(reason);
    }
  );
};

export default loader;
