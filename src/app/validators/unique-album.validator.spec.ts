import { FormBuilder, ValidationErrors } from '@angular/forms';

import { uniqueAlbumValidator } from './unique-album.validator';

describe('uniqueAlbumValidator', () => {
  const EXISTING_ALBUMS = ['one', 'two'];

  it('returns `null` if the new album value is empty', () => {
    expect(getErrorForValue('', EXISTING_ALBUMS)).toBeNull();
  });

  it('returns `null` if the new album value is only whitespace', () => {
    expect(getErrorForValue('   ', EXISTING_ALBUMS)).toBeNull();
  });

  it('returns `null` if the new album is unique', () => {
    expect(getErrorForValue('three', EXISTING_ALBUMS)).toBeNull();
    expect(getErrorForValue('unique_album', EXISTING_ALBUMS)).toBeNull();
  });

  it('returns `albumAlreadyExists` error if the new album exists in the provided albums array', () => {
    const error = { albumAlreadyExists: true };

    expect(getErrorForValue('one', EXISTING_ALBUMS)).toEqual(error);
    expect(getErrorForValue('two', EXISTING_ALBUMS)).toEqual(error);
  });

  it('works with different arrays of existing albums', () => {
    const customAlbums = ['custom1', 'custom2', 'custom3'];

    expect(getErrorForValue('custom1', customAlbums)).toEqual({
      albumAlreadyExists: true,
    });
    expect(getErrorForValue('custom3', customAlbums)).toEqual({
      albumAlreadyExists: true,
    });
    expect(getErrorForValue('custom4', customAlbums)).toBeNull();
  });

  it('returns `null` if no albums array is provided', () => {
    expect(getErrorForValue('anything', [])).toBeNull();
    expect(getErrorForValue('one', undefined)).toBeNull();
  });
});

/**
 * Helper function to test the validator with different values
 * @param newAlbumValue The value to test
 * @param existingAlbums The array of existing albums to check against
 * @returns The validation errors or null
 */
function getErrorForValue(
  newAlbumValue: string,
  existingAlbums: string[] | undefined,
): ValidationErrors | null {
  const fb = new FormBuilder();

  // Create a form group with a newAlbum control
  const formGroup = fb.group(
    {
      newAlbum: newAlbumValue,
      albums: [['other_album']], // Not relevant for this test
    },
    {
      validators: uniqueAlbumValidator(existingAlbums),
    },
  );

  return formGroup.errors;
}
