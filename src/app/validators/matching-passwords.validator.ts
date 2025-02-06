import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchingPasswordsValidator(
  formGroup: AbstractControl,
): ValidationErrors | null {
  const newPassword = formGroup.get('newPassword')?.value;
  const confirmPassword = formGroup.get('confirmPassword')?.value;

  return !newPassword || !confirmPassword || newPassword === confirmPassword
    ? null
    : { passwordMismatch: true };
}
