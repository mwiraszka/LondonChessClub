import moment from 'moment-timezone';

import { IsoDate } from '@app/models';

import { isValidIsoDate } from './is-valid-iso-date.util';

/**
 * Check whether the provided date is X seconds in the past (defaults to 600 seconds).
 */
export function isExpired(date?: IsoDate | null, seconds = 600): boolean {
  if (!isValidIsoDate(date)) {
    return true;
  }

  return moment(date).isBefore(moment().subtract(seconds, 'seconds'));
}
