import { Url } from '@app/models';

/**
 * Convert a data URL (base-64 string) and filename to a File representing the same data.
 */
export function dataUrlToFile(
  dataUrl?: Url | null,
  filename?: string | null,
): File | null {
  try {
    if (!dataUrl || !filename) {
      return null;
    }

    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new File([int8Array], filename);
  } catch {
    console.error('[LCC] Unable to convert data URL and filename to File.');
    return null;
  }
}
