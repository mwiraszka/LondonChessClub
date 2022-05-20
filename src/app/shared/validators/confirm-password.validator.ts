import { FormControl } from '@angular/forms';

export const confirmPasswordValidator = (
  control: FormControl
): { passwordMismatch: true } => {
  return control.value === control?.parent?.controls['password'].value
    ? null
    : { passwordMismatch: true };
};
