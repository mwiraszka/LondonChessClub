import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function hasLowercaseLetterValidator(
  control?: AbstractControl,
): ValidationErrors | null {
  return isDefined(control?.value) && /[a-z]/.test(control!.value)
    ? null
    : { noLowercaseLetter: true };
}
