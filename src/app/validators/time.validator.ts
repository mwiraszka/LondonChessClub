import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isTime } from '@app/utils';

export function timeValidator(control: AbstractControl): ValidationErrors | null {
  return isTime(control.value) ? null : { invalidTimeFormat: true };
}
