import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';

import { matchingPasswordsValidator } from './matching-passwords.validator';

describe('matchingPasswordsValidator', () => {
  it('returns `null` if either of the two password is an empty string', () => {
    expect(getErrorForValue('', 'passw0rd_123')).toBeNull();
    expect(getErrorForValue('monkey15', '')).toBeNull();
  });

  it('returns `null` if passwords match', () => {
    expect(getErrorForValue('passw0rd_123', 'passw0rd_123')).toBeNull();
    expect(getErrorForValue('monkey15', 'monkey15')).toBeNull();
  });

  it('returns `passwordMismatch` error if passwords do not match', () => {
    const error = { passwordMismatch: true };

    expect(getErrorForValue('passw0rd_123', 'monkey15')).toEqual(error);
    expect(getErrorForValue('  ', ' ')).toEqual(error);
  });
});

function getErrorForValue(
  newPassword: string,
  confirmPassword: unknown,
): ValidationErrors | null {
  const formGroup = new FormGroup(
    {
      newPassword: new FormControl(newPassword),
      confirmPassword: new FormControl(confirmPassword),
    },
    matchingPasswordsValidator,
  );

  return formGroup.errors;
}
