import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function hasNumberValidator(control?: AbstractControl): ValidationErrors | null {
  return isDefined(control?.value) && /\d/.test(control!.value)
    ? null
    : { noNumber: true };
}
