import { FormControl, ValidationErrors } from '@angular/forms';

import { ratingValidator } from './rating.validator';

describe('ratingValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeNull();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('1')).toBeNull();
    expect(getErrorForValue('9999')).toBeNull();
  });

  it('returns `invalidRating` error if invalid', () => {
    const error = { invalidRating: true };

    expect(getErrorForValue('0')).toEqual(error);
    expect(getErrorForValue('10000')).toEqual(error);
  });
});

function getErrorForValue(value: string | null): ValidationErrors | null {
  const control = new FormControl(value, ratingValidator);
  return control.errors;
}
