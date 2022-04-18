import { FormControl } from '@angular/forms';

export const hasSpecialCharValidator = (
  control: FormControl
): { noSpecialChar: true } => {
  const regExp = new RegExp(/[!@#$%^&*()_+-=[]{};':"|,.?]/); // Omit the following: / < >
  return regExp.test(control.value) ? null : { noSpecialChar: true };
};
