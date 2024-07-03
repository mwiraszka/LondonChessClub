import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasLowercaseLetterValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const regExp = new RegExp(/[a-z]/);
  return regExp.test(control.value) ? null : { noLowercaseLetter: true };
}
