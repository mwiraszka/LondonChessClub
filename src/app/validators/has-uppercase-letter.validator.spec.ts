import { FormControl, ValidationErrors } from '@angular/forms';

import { hasUppercaseLetterValidator } from './has-uppercase-letter.validator';

describe('hasUppercaseLetterValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeFalsy();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('A')).toBeFalsy();
    expect(getErrorForValue('ABC')).toBeFalsy();
    expect(getErrorForValue('123 $ # a A()')).toBeFalsy();
  });

  it('returns `noUppercaseLetter` error if invalid', () => {
    const error = { noUppercaseLetter: true };

    expect(getErrorForValue('a')).toEqual(error);
    expect(getErrorForValue('abc')).toEqual(error);
    expect(getErrorForValue('123 $ # a ()')).toEqual(error);
  });
});

function getErrorForValue(value: string | null): ValidationErrors | null {
  const control = new FormControl(value, hasUppercaseLetterValidator);
  return control.errors;
}
