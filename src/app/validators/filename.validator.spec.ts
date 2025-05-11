import { FormControl, ValidationErrors } from '@angular/forms';

import { filenameValidator } from './filename.validator';

describe('filenameValidator', () => {
  describe('as a string', () => {
    it('returns `null` for an empty string', () => {
      expect(getErrorForStringValue('')).toBeNull();
    });

    it('returns `null` if valid', () => {
      expect(getErrorForStringValue('my-file')).toBeNull();
      expect(getErrorForStringValue('ABCabc-_123')).toBeNull();
    });

    it('returns `invalidFilename` error if invalid', () => {
      const error = { invalidFilename: true };

      expect(getErrorForStringValue('my file')).toEqual(error);
      expect(getErrorForStringValue(' my-file ')).toEqual(error);
      expect(getErrorForStringValue('my-file$')).toEqual(error);
      expect(getErrorForStringValue('my-file😎')).toEqual(error);
    });
  });

  describe('as an object containing a filename property', () => {
    it('returns `null` for an empty string', () => {
      expect(getErrorForObjectValue('')).toBeNull();
    });

    it('returns `null` if valid', () => {
      expect(getErrorForObjectValue('my-file')).toBeNull();
      expect(getErrorForObjectValue('ABCabc-_123')).toBeNull();
    });

    it('returns `invalidFilename` error if invalid', () => {
      const error = { invalidFilename: true };

      expect(getErrorForObjectValue('my file')).toEqual(error);
      expect(getErrorForObjectValue(' my-file ')).toEqual(error);
      expect(getErrorForObjectValue('my-file$')).toEqual(error);
      expect(getErrorForObjectValue('my-file😎')).toEqual(error);
    });
  });
});

function getErrorForStringValue(value: string): ValidationErrors | null {
  const control = new FormControl(value, filenameValidator);
  return control.errors;
}

function getErrorForObjectValue(value: string): ValidationErrors | null {
  const mockObject = {
    propertyA: 'valueA',
    propertyB: 'valueB',
    filename: value,
  };

  const control = new FormControl(mockObject, filenameValidator);
  return control.errors;
}
