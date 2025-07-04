import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { oneAlbumMinimumValidator } from './one-album-minimum.validator';

describe('oneAlbumMinimumValidator', () => {
  it('returns `null` if either form control contains a value', () => {
    expect(getErrorForValue(['one', 'two'], 'three')).toBeNull();
    expect(getErrorForValue(['one', 'two'], 'three')).toBeNull();
    expect(getErrorForValue([], 'three')).toBeNull();
    expect(getErrorForValue([], ' ')).toBeNull();
    expect(getErrorForValue([' '], '')).toBeNull();
  });

  it('returns `albumRequired` error if both form controls are empty', () => {
    const error = { albumRequired: true };

    expect(getErrorForValue([], '')).toEqual(error);
  });
});

function getErrorForValue(albums: string[], album: string): ValidationErrors | null {
  const formGroup = new FormGroup(
    {
      albums: new FormControl(albums),
      album: new FormControl(album),
    },
    oneAlbumMinimumValidator,
  );

  return formGroup.errors;
}
