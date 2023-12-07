import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imageSizeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control || !control.value || !control.value?.size) {
    return null;
  }

  return control.value.size < 1048576 ? null : { imageTooLarge: true };
}
