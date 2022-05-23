import { FormControl } from '@angular/forms';

export const ratingValidator = (control: FormControl): { invalidRating: true } => {
  const regExp = new RegExp(/^[1-9]\d{0,3}$/);
  return regExp.test(control.value) ? null : { invalidRating: true };
};
