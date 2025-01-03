import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function ratingValidator(control?: AbstractControl): ValidationErrors | null {
  return !isDefined(control?.value) || /^[1-9]\d{0,3}(?:\/\d)?$/.test(control!.value)
    ? null
    : { invalidRating: true };
}
