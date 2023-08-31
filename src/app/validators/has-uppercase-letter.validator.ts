import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasUppercaseLetterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regExp = new RegExp(/[A-Z]/);
    return regExp.test(control.value) ? null : { noUppercaseLetter: true };
  };
}
