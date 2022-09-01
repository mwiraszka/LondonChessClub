import { FormControl } from '@angular/forms';

export const hasLowercaseLetterValidator = (
  control: FormControl
): { noLowercaseLetter: true } => {
  const regExp = new RegExp(/[a-z]/);
  return regExp.test(control.value) ? null : { noLowercaseLetter: true };
};
