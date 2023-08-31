import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Courtesy of Borislav Hadzhiev
 * https://bobbyhadz.com/blog/javascript-validate-date-yyyy-mm-dd
 */
export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const timestamp = new Date(control.value).getTime();

    return control.value.match(/^\d{4}-\d{2}-\d{2}$/) === null ||
      typeof timestamp !== 'number' ||
      Number.isNaN(timestamp)
      ? { invalidDateFormat: true }
      : null;
  };
}
