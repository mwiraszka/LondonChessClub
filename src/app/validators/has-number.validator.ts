import { AbstractControl, ValidationErrors } from '@angular/forms';

export function hasNumberValidator(control: AbstractControl): ValidationErrors | null {
  const regExp = new RegExp(/\d/);
  return regExp.test(control.value) ? null : { noNumber: true };
}
