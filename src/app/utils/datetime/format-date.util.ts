import moment from 'moment-timezone';

import type { IsoDate } from '@app/types';

/**
 * Convert ISO8601 date string (`YYYY-MM-DDTHH:mm:ss`) to one of the following formats:
 * * `long`: Thursday, January 1st 2024 at 6:00 PM (default)
 * * `long no-time`: Thursday, January 1st 2024
 * * `short`: Thu, Jan 1, 2024, 6:00 PM
 * * `short no-time`: Thu, Jan 1, 2024

 * Timezone automatically displayed as EST/EDT due to default timezone set in root App Component.
 *
 * Return `'Invalid date'` if date provided is undefined or has invalid ISO860 format.
 */
export function formatDate(
  date?: IsoDate,
  format: 'long' | 'long no-time' | 'short' | 'short no-time' = 'long',
): string {
  switch (format) {
    case 'long':
      return moment(date).format('dddd, MMMM Do YYYY [at] h:mm A');
    case 'long no-time':
      return moment(date).format('dddd, MMMM Do YYYY');
    case 'short':
      return moment(date).format('ddd, MMM D, YYYY, h:mm A');
    case 'short no-time':
      return moment(date).format('ddd, MMM D, YYYY');
  }
}
