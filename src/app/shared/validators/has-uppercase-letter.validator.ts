import { FormControl } from '@angular/forms';

export const hasUppercaseLetterValidator = (
  control: FormControl
): { noUppercaseLetter: true } => {
  const regExp = new RegExp(/[A-Z]/);
  return regExp.test(control.value) ? null : { noUppercaseLetter: true };
};
