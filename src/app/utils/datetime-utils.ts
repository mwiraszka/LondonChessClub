import moment from 'moment-timezone';

import { IsoDate, ModificationInfo } from '@app/types';

/**
 * Convert ISO8601 date string (YYYY-MM-DDTHH:mm:ss) to one of the following user-friendly formats:
 *
 * Long (default): Thursday, January 1st 2024 at 6:00 PM
 *
 * Long without time: Thursday, January 1st 2024
 *
 * Short: Thu, Jan 1, 2024, 6:00 PM
 *
 * Short without time: Thu, Jan 1, 2024
 *
 * Also automatically converts UTC time to local London time (EST/EDT) due to default timezone
 * set in app.component
 */
export function formatDate(
  date: IsoDate,
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

/**
 * Check is the value provided is in the format [hh:mm A] (e.g. 5:45 PM, 6:00 am, 12:00 PM)
 */
export function isTime(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    !!value.match(/^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AP][Mm]|[ap]m)$/)
  );
}

/**
 * Check is the value provided is a valid ISO 8601 date string (i.e. YYYY-MM-DDTHH:mm:ss)
 */
export function isIsoDate(value: unknown): boolean {
  return typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid();
}

/**
 * Check if dateLastEdited and dateCreated properties on a ModificationInfo object are the same
 * to some level of granularity (defaults to 'day'); return null if modification info is null
 * or undefined, or if either date is not in a valid ISO 8601 date string format
 */
export function wasEdited(
  modificationInfo?: ModificationInfo | null,
  granularity: moment.unitOfTime.StartOf = 'day',
): boolean | null {
  if (
    !modificationInfo ||
    !isIsoDate(modificationInfo.dateCreated) ||
    !isIsoDate(modificationInfo.dateLastEdited)
  ) {
    return null;
  }

  return moment(modificationInfo.dateLastEdited).isSame(
    modificationInfo.dateCreated,
    granularity,
  );
}
