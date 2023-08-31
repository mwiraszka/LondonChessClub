import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const regExp = new RegExp(/^[1-9]\d{2}-\d{3}-\d{4}$/);
    return regExp.test(control.value) ? null : { invalidPhoneNumberFormat: true };
  };
}
