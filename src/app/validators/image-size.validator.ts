import { AbstractControl, ValidationErrors } from '@angular/forms';

export function imageSizeValidator(control: AbstractControl): ValidationErrors | null {
  const ONE_MEGABYTE = 1048576;
  if (!control || !control.value || !control.value?.size) {
    return null;
  }

  return control.value.size < ONE_MEGABYTE ? null : { imageTooLarge: true };
}
