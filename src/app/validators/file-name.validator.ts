import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDefined } from '@app/utils';

export function fileNameValidator(control?: AbstractControl): ValidationErrors | null {
  return isDefined(control?.value) && /^[a-zA-Z0-9-_]+$/.test(control!.value)
    ? null
    : { invalidFileName: true };
}
