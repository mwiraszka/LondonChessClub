import { FormControl } from '@angular/forms';

export const hasNumberValidator = (control: FormControl): { noNumber: true } => {
  const regExp = new RegExp(/\d/);
  return regExp.test(control.value) ? null : { noNumber: true };
};
