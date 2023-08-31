import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function hasLowercaseLetterValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regExp = new RegExp(/[a-z]/);
    return regExp.test(control.value) ? null : { noLowercaseLetter: true };
  };
}
