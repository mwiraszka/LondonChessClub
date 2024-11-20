import { Pipe, PipeTransform } from '@angular/core';

import { formatDate } from '@app/utils';

/**
 * Accepts a date as a Date or string and converts to a user-friendly format
 * @see {@link formatDate} for formatting details
 */
@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(
    date?: Date | null,
    format?: 'long' | 'long no-time' | 'short' | 'short no-time',
  ): string {
    return date ? formatDate(date, format) : '';
  }
}
