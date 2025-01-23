import { FileData } from '@app/models';

import { dataUrlToFile } from './data-url-to-file.util';

const MOCK_DATA_URL = 'data:image/png;base64,VEhJUyBJUyBUSEUgQU5TV0VSCg==';
const MOCK_FILENAME = 'my-file';
const MOCK_FILE_DATA: FileData = {
  extension: '.png',
  type: 'image/png',
};

describe('dataUrlToFile', () => {
  it('returns `null` if `undefined`, `null` or invalid data URL provided', () => {
    expect(dataUrlToFile(undefined, MOCK_FILENAME, MOCK_FILE_DATA)).toBe(null);
    expect(dataUrlToFile(null, MOCK_FILENAME, MOCK_FILE_DATA)).toBe(null);
    expect(dataUrlToFile('', MOCK_FILENAME, MOCK_FILE_DATA)).toBe(null);
    expect(dataUrlToFile('$', MOCK_FILENAME, MOCK_FILE_DATA)).toBe(null);
    expect(dataUrlToFile('invalid', MOCK_FILENAME, MOCK_FILE_DATA)).toBe(null);
  });

  it('returns `null` if `filename` or `fileData` are not defined', () => {
    expect(dataUrlToFile(MOCK_DATA_URL, MOCK_FILENAME, undefined)).toBe(null);
    expect(dataUrlToFile(MOCK_DATA_URL, undefined, MOCK_FILE_DATA)).toBe(null);
    expect(dataUrlToFile(MOCK_DATA_URL, undefined, undefined)).toBe(null);
  });

  it('converts a PNG image data URL to a File type representing the same data', () => {
    const file = dataUrlToFile(MOCK_DATA_URL, MOCK_FILENAME, MOCK_FILE_DATA);

    expect(file?.name).toStrictEqual('image/png');
  });
});
