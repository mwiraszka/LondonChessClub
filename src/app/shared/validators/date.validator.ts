import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export const dateValidator = (control: FormControl): { invalidDateFormat: true } => {
  return moment(control.value, 'YYYY-MM-DD', true).isValid()
    ? null
    : { invalidDateFormat: true };
};
