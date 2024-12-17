import { Url } from '@app/types';

/**
 * @param dataUrl Data URL of the file (as a base-64 string)
 *
 * @returns {Blob} A blob representing the same data
 */
export function dataUrlToBlob(dataUrl: Url): Blob {
  const byteString = atob(dataUrl.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([int8Array], { type: 'image/jpeg' });
}

/**
 * @param filePath The path to the local CSV file
 * @param includeHeader Whether to include data from the first row; defaults to false
 *
 * @returns {Promise<Array<string[]> | null>} An array of string arrays wrapped in a promise, where
 * the inner arrays represent the rows in the original CSV file; returns null if for whatever
 * reason the CSV cannot be parsed
 */
export async function parseCsv(
  filePath?: string,
  includeHeader = false,
): Promise<Array<string[]> | null> {
  if (!filePath || !filePath.endsWith('.csv')) {
    return null;
  }

  const response = await fetch('assets/eco-openings.csv');
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
  return !includeHeader && rowsOfData.length > 0 ? rowsOfData.slice(1) : rowsOfData;
}

/**
 * Converts a raw number of Bytes to a more user-friendly size in KB/MB units
 */
export function formatBytes(input?: string | number | null, decimals = 2): string {
  const bytes = Number(input);

  if (isNaN(bytes)) {
    return '0 B';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'kB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
