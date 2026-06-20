import { FormControl, ValidationErrors } from '@angular/forms';

import { hasNumberValidator } from './has-number.validator';

describe('hasNumberValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeFalsy();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('1')).toBeFalsy();
    expect(getErrorForValue('123')).toBeFalsy();
    expect(getErrorForValue('Abc123-_ #$')).toBeFalsy();
  });

  it('returns `noNumber` error if invalid', () => {
    const error = { noNumber: true };

    expect(getErrorForValue('A')).toEqual(error);
    expect(getErrorForValue('a')).toEqual(error);
    expect(getErrorForValue('Abc $ # ()')).toEqual(error);
  });
});

function getErrorForValue(value: string): ValidationErrors | null {
  const control = new FormControl(value, hasNumberValidator);
  return control.errors;
}
