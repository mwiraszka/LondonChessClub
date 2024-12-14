import { AbstractControl, ValidationErrors } from '@angular/forms';

const ONE_MEGABYTE = 1048576;

export function imageSizeValidator(control: AbstractControl): ValidationErrors | null {
  if (!control?.value?.size) {
    return null;
  }
  return control.value.size < ONE_MEGABYTE ? null : { imageTooLarge: true };
}
