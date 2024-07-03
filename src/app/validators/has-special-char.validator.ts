import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasSpecialCharValidator(
  control: AbstractControl
): ValidationErrors | null {
  const regExp = new RegExp(/[*.!@#$%^&(){}[\]:;,.?~_+-=|]/);
  return regExp.test(control.value) ? null : { noSpecialChar: true };
}
