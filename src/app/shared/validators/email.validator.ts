import { FormControl } from '@angular/forms';

export const emailValidator = (control: FormControl): { invalidEmailFormat: true } => {
  const regExp = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
  return regExp.test(control.value) ? null : { invalidEmailFormat: true };
};
