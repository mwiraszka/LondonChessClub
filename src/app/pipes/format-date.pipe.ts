import { Pipe, PipeTransform } from '@angular/core';

import { formatDate } from '@app/utils';

/**
 * Formats date as Monday, January 1, 2023
 */
@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(date?: string, format?: 'long' | 'short'): string {
    return date ? formatDate(date, format ?? 'long') : '';
  }
}
