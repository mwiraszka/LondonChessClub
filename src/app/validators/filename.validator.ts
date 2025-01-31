import { AbstractControl, ValidationErrors } from '@angular/forms';

export function filenameValidator(control: AbstractControl): ValidationErrors | null {
  return control.value === '' || /^[a-zA-Z0-9-_]+$/.test(control.value)
    ? null
    : { invalidFilename: true };
}
