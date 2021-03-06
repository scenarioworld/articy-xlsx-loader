import compiler from './compiler';
import webpack from 'webpack';

const beginning = 'export default ';

test('Can get localization data from xlsx file', async () => {
  // Compile and collect output
  const stats = await compiler('loc_All objects_en.xlsx');
  let output = stats.toJson({ source: true }).modules?.[0].source;

  // Make sure we actually get output
  expect(output).toBeDefined();
  if (!output) {
    return;
  }

  // Convert output to a string
  if (output instanceof Buffer) {
    output = output.toString();
  }

  // Remove export default
  expect(output.substr(0, beginning.length)).toBe(beginning);
  const json = output.substr(beginning.length);

  // Parse to JSON
  const localizationMap = JSON.parse(json);

  // Test a few strings
  expect(localizationMap['FFr_10EB377E.DisplayName']).toBe('Text Node');
  expect(localizationMap['$Enum.Sex.DisplayName']).toBe('Sex');
});

test('Fails when first sheet is missing', async () => {
  try {
    await compiler('loc_All objects_bad.xlsx');
    fail('compiler should fail');
  } catch (error) {
    if (Array.isArray(error)) {
      const errors = error as webpack.StatsError[];
      expect(errors[0]).toBeDefined();
      const match = errors[0].message.match(/Error:.*$/gm);
      expect(match?.[0]).toMatchSnapshot();
    } else {
      fail('Expected an array of webpack errors.');
    }
  }
});
