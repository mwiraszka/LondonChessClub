import { AbstractControl, ValidationErrors } from '@angular/forms';

export function yearOfBirthValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const isValidYear = /^[1-2]\d{3}$/.test(control.value);
  const inLast150Years = new Date().getFullYear() - control.value < 150;

  return isValidYear && inLast150Years ? null : { invalidYear: true };
}
