import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasUppercaseLetterValidator(
  control: AbstractControl,
): ValidationErrors | null {
  return control.value === '' || /[A-Z]/.test(control.value)
    ? null
    : { noUppercaseLetter: true };
}
