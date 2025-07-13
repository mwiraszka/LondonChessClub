/**
 * Parse a local CSV file and return an array of string arrays, where the inner arrays represent
 * the rows in the original CSV file.
 *
 * Return `null` if for whatever reason the CSV cannot be parsed.
 */
export async function parseCsv(
  filePath?: string,
  skipFirstRow = true,
): Promise<Array<string[]> | null> {
  try {
    if (!filePath?.endsWith('.csv')) {
      return null;
    }

    const response = await fetch(filePath);

    if (!response) {
      return null;
    }

    const blob = await response.blob();

    if (!blob) {
      return null;
    }

    const arrayBuffer = await blob.text();
    if (!arrayBuffer) {
      return null;
    }

    let rowsOfData: Array<string[]> = [[]];
    rowsOfData = arrayBuffer.split('\n')?.map(row => row.split(','));

    return skipFirstRow && rowsOfData.length > 0 ? rowsOfData.slice(1) : rowsOfData;
  } catch {
    console.error('[LCC] Unable to parse CSV file');
    return null;
  }
}
