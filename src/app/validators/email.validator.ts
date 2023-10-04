import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const regExp = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
  return regExp.test(control.value) ? null : { invalidEmailFormat: true };
}
