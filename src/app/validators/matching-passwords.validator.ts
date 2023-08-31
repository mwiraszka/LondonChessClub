import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchingPasswordsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // TODO: Find a better way to pass in the new password value for this validation
    // (temporarily hardcoded to an empty string)

    // const newPassword = control?.parent?.controls['newPassword'].value;
    const newPassword = '';
    const confirmPassword = control.value;
    return newPassword === '' || confirmPassword === '' || newPassword === confirmPassword
      ? null
      : { passwordMismatch: true };
  };
}
