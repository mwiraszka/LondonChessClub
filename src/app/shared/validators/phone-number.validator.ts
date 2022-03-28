import { FormControl } from '@angular/forms';

export const phoneNumberValidator = (
  control: FormControl
): { invalidPhoneNumberFormat: true } => {
  const inputPhoneNumber = control.value;
  const phoneNumberRegExp = new RegExp(/^[1-9]\d{2}-\d{3}-\d{4}$/);
  return phoneNumberRegExp.test(inputPhoneNumber)
    ? null
    : { invalidPhoneNumberFormat: true };
};
