import { FormControl, ValidationErrors } from '@angular/forms';

import { hasSpecialCharValidator } from './has-special-char.validator';

describe('hasSpecialCharValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeFalsy();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('#')).toBeFalsy();
    expect(getErrorForValue('@@@')).toBeFalsy();
    expect(getErrorForValue('Abc123 $')).toBeFalsy();
  });

  it('returns `noSpecialChar` error if invalid', () => {
    const error = { noSpecialChar: true };

    expect(getErrorForValue('A')).toEqual(error);
    expect(getErrorForValue(' a ')).toEqual(error);
    expect(getErrorForValue('Abc123')).toEqual(error);
  });
});

function getErrorForValue(value: string): ValidationErrors | null {
  const control = new FormControl(value, hasSpecialCharValidator);
  return control.errors;
}
