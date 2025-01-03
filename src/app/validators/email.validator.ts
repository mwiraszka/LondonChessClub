import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  return !isDefined(control.value) ||
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(control.value)
    ? null
    : { invalidEmailFormat: true };
}
