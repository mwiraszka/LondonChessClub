import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export const dateValidator = (control: FormControl): { invalidDateFormat: true } => {
  const inputDate = control.value;
  return moment(inputDate, 'YYYY-MM-DD', true).isValid()
    ? null
    : { invalidDateFormat: true };
};
