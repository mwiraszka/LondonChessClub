import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasSpecialCharValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regExp = new RegExp(/[*.!@#$%^&(){}[\]:;,.?~_+-=|]/);
    return regExp.test(control.value) ? null : { noSpecialChar: true };
  };
}
