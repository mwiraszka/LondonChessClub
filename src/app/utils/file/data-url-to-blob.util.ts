import { Url } from '@app/types';

/**
 * Convert a data URL (base-64 string) of a File to a Blob representing the same data.
 */
export function dataUrlToBlob(dataUrl: Url): Blob | null {
  try {
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([int8Array], { type: 'image/jpeg' });
  } catch {
    console.error('[LCC] Unable to convert data URL to Blob.');
    return null;
  }
}
