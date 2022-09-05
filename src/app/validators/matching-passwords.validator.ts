import { FormControl } from '@angular/forms';

export const matchingPasswordsValidator = (
  control: FormControl
): { passwordMismatch: true } => {
  const newPassword = control?.parent?.controls['newPassword'].value;
  const confirmPassword = control.value;
  return newPassword === '' || confirmPassword === '' || newPassword === confirmPassword
    ? null
    : { passwordMismatch: true };
};
