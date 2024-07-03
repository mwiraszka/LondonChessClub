import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasUppercaseLetterValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const regExp = new RegExp(/[A-Z]/);
  return regExp.test(control.value) ? null : { noUppercaseLetter: true };
}
