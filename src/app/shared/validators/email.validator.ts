import { FormControl } from '@angular/forms';

export const emailValidator = (control: FormControl): { invalidEmailFormat: true } => {
  const inputPassword = control.value;
  const passwordRegExp = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
  return passwordRegExp.test(inputPassword) ? null : { invalidEmailFormat: true };
};
