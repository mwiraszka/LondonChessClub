import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const timestamp = new Date(control.value).getTime();

  const validityConditions =
    control.value.match(/^\d{4}-\d{2}-\d{2}$/) &&
    typeof timestamp === 'number' &&
    !Number.isNaN(timestamp);

  return validityConditions ? null : { invalidDateFormat: true };
}
