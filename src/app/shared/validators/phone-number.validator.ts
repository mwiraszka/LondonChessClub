import { FormControl } from '@angular/forms';

export const phoneNumberValidator = (
  control: FormControl
): { invalidPhoneNumberFormat: true } => {
  const regExp = new RegExp(/^[1-9]\d{2}-\d{3}-\d{4}$/);
  return regExp.test(control.value) ? null : { invalidPhoneNumberFormat: true };
};
