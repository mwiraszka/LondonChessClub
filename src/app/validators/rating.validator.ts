import { AbstractControl, ValidationErrors } from '@angular/forms';

export function ratingValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  return /^[1-9]\d{0,3}(?:\/\d)?$/.test(control.value) ? null : { invalidRating: true };
}
