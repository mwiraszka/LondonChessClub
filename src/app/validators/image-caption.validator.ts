import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imageCaptionValidator(control: AbstractControl): ValidationErrors | null {
  // Regex matches all printable ASCII characters (from space to tilde)
  return control.value === '' || /^[ -~]+$/.test(control.value)
    ? null
    : { invalidImageCaption: true };
}
