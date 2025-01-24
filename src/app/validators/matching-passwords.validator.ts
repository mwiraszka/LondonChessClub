import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchingPasswordsValidator(
  formGroup: AbstractControl,
): ValidationErrors | null {
  return formGroup.get('newPassword')?.value === formGroup.get('confirmPassword')?.value
    ? null
    : { passwordMismatch: true };
}
