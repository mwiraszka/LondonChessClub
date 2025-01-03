import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function hasUppercaseLetterValidator(
  control?: AbstractControl,
): ValidationErrors | null {
  return isDefined(control?.value) && /[A-Z]/.test(control!.value)
    ? null
    : { noUppercaseLetter: true };
}
