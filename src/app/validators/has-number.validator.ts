import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regExp = new RegExp(/\d/);
    return regExp.test(control.value) ? null : { noNumber: true };
  };
}
