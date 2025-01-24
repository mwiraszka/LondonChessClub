import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasSpecialCharValidator(
  control: AbstractControl,
): ValidationErrors | null {
  return control.value === '' || /[*.!@#$%^&(){}[\]:;,.?~_+=|-]/.test(control.value)
    ? null
    : { noSpecialChar: true };
}
