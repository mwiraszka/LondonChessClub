import { FormControl } from '@angular/forms';

export const ratingValidator = (control: FormControl): { invalidRating: true } => {
  if (!control.value) {
    return null;
  }

  const regExp = new RegExp(/^[1-9]\d{0,3}(?:\/\d)?$/);
  return regExp.test(control.value) ? null : { invalidRating: true };
};
