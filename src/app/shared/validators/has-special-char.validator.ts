import { FormControl } from '@angular/forms';

export const hasSpecialCharValidator = (
  control: FormControl
): { noSpecialChar: true } => {
  const regExp = new RegExp(/[*.!@#$%^&(){}[\]:;,.?~_+-=|]/);
  return regExp.test(control.value) ? null : { noSpecialChar: true };
};
