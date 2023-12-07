import { Pipe, PipeTransform } from '@angular/core';

import { formatDate } from '@app/utils';

/**
 * Accepts a date as a Date or string and converts to a user-friendly format
 *
 * Long format (default): Monday, January 1, 2023
 *
 * Short format: Mon, Jan 1, 2023
 */
@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(
    date?: string | Date,
    format?: 'long' | 'short',
    showTime?: 'time' | 'no-time',
  ): string {
    return date ? formatDate(date, format, showTime) : '';
  }
}
