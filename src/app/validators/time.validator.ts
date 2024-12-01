import { AbstractControl, ValidationErrors } from '@angular/forms';

export function timeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  return control.value.match(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AP][Mm]|[ap]m)$/)
    ? null
    : { invalidTimeFormat: true };
}
