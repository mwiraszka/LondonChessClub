import { Pipe, PipeTransform } from '@angular/core';

import type { IsoDate } from '@app/models';
import { formatDate } from '@app/utils';

/**
 * {@link formatDate()} as a pipe.
 */
@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(
    date?: IsoDate,
    format?: 'long' | 'long no-time' | 'short' | 'short no-time',
  ): string {
    return formatDate(date, format);
  }
}
