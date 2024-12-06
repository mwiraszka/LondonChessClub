import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  return /^[1-9]\d{2}-\d{3}-\d{4}$/.test(control.value)
    ? null
    : { invalidPhoneNumberFormat: true };
}
