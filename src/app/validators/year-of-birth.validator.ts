import { AbstractControl, ValidationErrors } from '@angular/forms';

export function yearOfBirthValidator(control: AbstractControl): ValidationErrors | null {
  const isValidYear = /^[1-2]\d{3}$/.test(control.value);
  const yearsToNow = new Date().getFullYear() - control.value;

  return control.value === '' || (isValidYear && yearsToNow > 0 && yearsToNow < 150)
    ? null
    : { invalidYearOfBirth: true };
}
