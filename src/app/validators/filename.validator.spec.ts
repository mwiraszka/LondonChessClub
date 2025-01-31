import { FormControl, ValidationErrors } from '@angular/forms';

import { filenameValidator } from './filename.validator';

describe('filenameValidator', () => {
  it('returns `null` for an empty string', () => {
    expect(getErrorForValue('')).toBeNull();
  });

  it('returns `null` if valid', () => {
    expect(getErrorForValue('my-file')).toBeNull();
    expect(getErrorForValue('ABCabc-_123')).toBeNull();
  });

  it('returns `invalidFilename` error if invalid', () => {
    const error = { invalidFilename: true };

    expect(getErrorForValue('my file')).toEqual(error);
    expect(getErrorForValue(' my-file ')).toEqual(error);
    expect(getErrorForValue('my-file$')).toEqual(error);
    expect(getErrorForValue('my-file😎')).toEqual(error);
  });
});

function getErrorForValue(value: string): ValidationErrors | null {
  const control = new FormControl(value, filenameValidator);
  return control.errors;
}
