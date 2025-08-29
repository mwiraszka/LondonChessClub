import moment from 'moment-timezone';

import { IsoDate } from '@app/models';

import { isValidIsoDate } from './is-valid-iso-date.util';

/**
 * Check whether the provided date is X seconds in the past (defaults to 600 seconds).
 */
export function isExpired(date?: IsoDate, seconds = 600): boolean | null {
  if (!isValidIsoDate(date)) {
    return null;
  }

  return moment(date).isBefore(moment().subtract(seconds, 'seconds'));
}
