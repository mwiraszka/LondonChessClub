import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function hasSpecialCharValidator(
  control?: AbstractControl,
): ValidationErrors | null {
  return isDefined(control?.value) && /[*.!@#$%^&(){}[\]:;,.?~_+-=|]/.test(control!.value)
    ? null
    : { noSpecialChar: true };
}
