import { AbstractControl, ValidationErrors } from '@angular/forms';

export function matchingPasswordsValidator(
  control: AbstractControl,
): ValidationErrors | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPassword = (control as any)._parent?.controls['newPassword'].value;
  const confirmPassword = control.value;
  return newPassword === '' || confirmPassword === '' || newPassword === confirmPassword
    ? null
    : { passwordMismatch: true };
}
