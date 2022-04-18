import { FormControl } from '@angular/forms';

export const hasLowercaseCharValidator = (
  control: FormControl
): { noLowercaseChar: true } => {
  const regExp = new RegExp(/[a-z]/);
  return regExp.test(control.value) ? null : { noLowercaseChar: true };
};
