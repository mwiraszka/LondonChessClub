import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function yearValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const regExp = new RegExp(/^[1-2]\d{3}$/);
    const inLast150Years = !isNaN(control.value)
      ? control.value < new Date(Date.now()).getFullYear() &&
        control.value > new Date(Date.now()).getFullYear() - 150
      : false;

    return regExp.test(control.value) && inLast150Years ? null : { invalidYear: true };
  };
}
