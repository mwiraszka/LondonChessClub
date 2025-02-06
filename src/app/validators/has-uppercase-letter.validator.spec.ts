import { FormControl, ValidationErrors } from '@angular/forms';

import { hasUppercaseLetterValidator } from './has-uppercase-letter.validator';

describe('hasUppercaseLetterValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeNull();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('A')).toBeNull();
    expect(getErrorForValue('ABC')).toBeNull();
    expect(getErrorForValue('123 $ # a A()')).toBeNull();
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
