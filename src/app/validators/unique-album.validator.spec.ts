import { FormControl, ValidationErrors } from '@angular/forms';

import { uniqueAlbumValidator } from './unique-album.validator';

describe('uniqueAlbumValidator', () => {
  const EXISTING_ALBUMS = ['album1', 'album2', 'london chess'];

  it('returns `null` when the album name does not exist in the existing albums array', () => {
    expect(getErrorForValue('', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue(' ', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('   ', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('newAlbum', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('another album', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('chess london', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('Album1', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('ALBUM1', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('London Chess', EXISTING_ALBUMS)).toBeNull();
  });

  it('returns `null` when existing albums array is empty', () => {
    expect(getErrorForValue('any album', [])).toBeNull();
    expect(getErrorForValue('album1', [])).toBeNull();
  });

  it('returns `albumAlreadyExists` error when the album name exists in the existing albums array', () => {
    const error = { albumAlreadyExists: true };

    expect(getErrorForValue('album1', EXISTING_ALBUMS)).toEqual(error);
    expect(getErrorForValue('album2', EXISTING_ALBUMS)).toEqual(error);
    expect(getErrorForValue('london chess', EXISTING_ALBUMS)).toEqual(error);
  });
});

function getErrorForValue(
  value: string,
  existingAlbums: string[] | undefined,
): ValidationErrors | null {
  const control = new FormControl(value);
  const validator = uniqueAlbumValidator(existingAlbums);

  return validator(control);
}
