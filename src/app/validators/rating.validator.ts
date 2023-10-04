import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ratingValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const regExp = new RegExp(/^[1-9]\d{0,3}(?:\/\d)?$/);
  return regExp.test(control.value) ? null : { invalidRating: true };
}
