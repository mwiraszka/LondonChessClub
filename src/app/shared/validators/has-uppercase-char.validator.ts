import { FormControl } from '@angular/forms';

export const hasUppercaseCharValidator = (
  control: FormControl
): { noUppercaseChar: true } => {
  const regExp = new RegExp(/[A-Z]/);
  return regExp.test(control.value) ? null : { noUppercaseChar: true };
};
