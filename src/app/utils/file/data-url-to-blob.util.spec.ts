import { dataUrlToBlob } from './data-url-to-blob.util';

describe('dataUrlToBlob', () => {
  it('returns `null` if `undefined`, `null` or invalid data URL provided', () => {
    expect(dataUrlToBlob(undefined)).toBe(null);
    expect(dataUrlToBlob(null)).toBe(null);
    expect(dataUrlToBlob('')).toBe(null);
    expect(dataUrlToBlob('$')).toBe(null);
    expect(dataUrlToBlob('invalid')).toBe(null);
  });

  it('converts a PNG image data URL to a JPEG Blob type representing the same data', () => {
    const dataUrl = 'data:image/png;base64,VEhJUyBJUyBUSEUgQU5TV0VSCg==';
    expect(dataUrlToBlob(dataUrl)?.type).toStrictEqual('image/jpeg');
  });
});
