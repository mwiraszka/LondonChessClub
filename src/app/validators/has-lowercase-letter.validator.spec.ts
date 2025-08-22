import { FormControl, ValidationErrors } from '@angular/forms';

import { hasLowercaseLetterValidator } from './has-lowercase-letter.validator';

describe('hasLowercaseLetterValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeFalsy();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('a')).toBeFalsy();
    expect(getErrorForValue('abc')).toBeFalsy();
    expect(getErrorForValue('123 $ # A a()')).toBeFalsy();
  });

  it('returns `noLowercaseLetter` error if invalid', () => {
    const error = { noLowercaseLetter: true };

    expect(getErrorForValue('A')).toEqual(error);
    expect(getErrorForValue('ABC')).toEqual(error);
    expect(getErrorForValue('123 $ # A ()')).toEqual(error);
  });
});

function getErrorForValue(value: string): ValidationErrors | null {
  const control = new FormControl(value, hasLowercaseLetterValidator);
  return control.errors;
}
