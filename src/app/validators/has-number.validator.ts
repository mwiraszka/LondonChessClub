import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasNumberValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === '' || /\d/.test(control.value) ? null : { noNumber: true };
}
