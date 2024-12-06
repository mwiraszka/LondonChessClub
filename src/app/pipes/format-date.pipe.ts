import { Pipe, PipeTransform } from '@angular/core';

import { IsoDate } from '@app/types';
import { formatDate } from '@app/utils';

/**
 * Accepts a date in ISO 8601 date string in UTC and converts to a user-friendly format in EST/EDT
 * @see {@link formatDate} for formatting details
 */
@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(
    date?: IsoDate | null,
    format?: 'long' | 'long no-time' | 'short' | 'short no-time',
  ): string {
    return date ? formatDate(date, format) : '';
  }
}
