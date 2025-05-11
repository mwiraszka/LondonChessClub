import { AbstractControl, ValidationErrors } from '@angular/forms';

export function filenameValidator(control: AbstractControl): ValidationErrors | null {
  if (typeof control.value !== 'string' && typeof control.value?.filename !== 'string') {
    console.error(
      '[LCC] Filename Validator: control value must either be a string or an object with a filename property.',
    );
    return null;
  }

  const value: string =
    typeof control.value === 'string' ? control.value : control.value.filename;

  return value === '' || /^[a-zA-Z0-9-_]+$/.test(value)
    ? null
    : { invalidFilename: true };
}
