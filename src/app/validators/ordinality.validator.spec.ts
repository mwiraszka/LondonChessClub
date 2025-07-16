import { FormControl, ValidationErrors } from '@angular/forms';

import { ordinalityValidator } from './ordinality.validator';

describe('ordinalityValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeNull();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('1')).toBeNull();
    expect(getErrorForValue('9')).toBeNull();
    expect(getErrorForValue('10')).toBeNull();
    expect(getErrorForValue('42')).toBeNull();
    expect(getErrorForValue('99')).toBeNull();
  });

  it('returns `invalidOrdinal` error if invalid', () => {
    const error = { invalidOrdinal: true };

    expect(getErrorForValue('0')).toEqual(error);
    expect(getErrorForValue('100')).toEqual(error);
    expect(getErrorForValue('01')).toEqual(error);
    expect(getErrorForValue('abc')).toEqual(error);
    expect(getErrorForValue('-5')).toEqual(error);
    expect(getErrorForValue('3.14')).toEqual(error);
  });
});

function getErrorForValue(value: string): ValidationErrors | null {
  const control = new FormControl(value, ordinalityValidator);
  return control.errors;
}
