import { FormControl, ValidationErrors } from '@angular/forms';

import { yearOfBirthValidator } from './year-of-birth.validator';

describe('yearOfBirthValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeNull();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('2024')).toBeNull();
    expect(getErrorForValue('1999')).toBeNull();
    expect(getErrorForValue('1890')).toBeNull();
  });

  it('returns `invalidYearOfBirth` error if invalid', () => {
    const error = { invalidYearOfBirth: true };

    expect(getErrorForValue('a')).toEqual(error);
    expect(getErrorForValue('Abc123$')).toEqual(error);
    expect(getErrorForValue('100')).toEqual(error);
    expect(getErrorForValue('1874')).toEqual(error);
    expect(getErrorForValue('2050')).toEqual(error);
  });
});

function getErrorForValue(value: string | null): ValidationErrors | null {
  const control = new FormControl(value, yearOfBirthValidator);
  return control.errors;
}
