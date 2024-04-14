/**
 * @param url Data URL of the file (as base-64 string)
 * @param name Name of the file (optional)
 *
 * @returns {File} A file object
 */
export async function getFileFromDataUrl(url: string, name?: string): Promise<File> {
  const response = await fetch(url);
  const data = await response.blob();

  return new File([data], name ?? 'lcc-file', {
    type: data.type ?? 'image/jpeg',
  });
}
