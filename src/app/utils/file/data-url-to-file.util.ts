import { FileData, Url } from '@app/models';

/**
 * Convert a data URL (base-64 string) and file data to a File representing the same data.
 */
export function dataUrlToFile(
  dataUrl?: Url | null,
  filename?: string,
  fileData?: FileData,
): File | null {
  try {
    if (!dataUrl || !filename || !fileData) {
      return null;
    }

    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new File([int8Array], `${filename}${fileData.extension}`, {
      type: fileData.type,
    });
  } catch {
    console.error('[LCC] Unable to convert data URL to File.');
    return null;
  }
}
