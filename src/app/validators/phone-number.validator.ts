import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function phoneNumberValidator(control?: AbstractControl): ValidationErrors | null {
  return !isDefined(control?.value) || /^[1-9]\d{2}-\d{3}-\d{4}$/.test(control!.value)
    ? null
    : { invalidPhoneNumberFormat: true };
}
