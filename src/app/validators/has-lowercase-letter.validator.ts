import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasLowercaseLetterValidator(
  control: AbstractControl,
): ValidationErrors | null {
  return control.value === '' || /[a-z]/.test(control.value)
    ? null
    : { noLowercaseLetter: true };
}
