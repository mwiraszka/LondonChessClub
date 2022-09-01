import { FormControl } from '@angular/forms';

/**
 * Courtesy of Borislav Hadzhiev
 * https://bobbyhadz.com/blog/javascript-validate-date-yyyy-mm-dd
 */
export const dateValidator = (control: FormControl): { invalidDateFormat: true } => {
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
