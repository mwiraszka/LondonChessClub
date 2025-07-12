import moment from 'moment-timezone';

import type { IsoDate } from '@app/models';

import { isValidIsoDate } from './is-valid-iso-date.util';

/**
 * Check whether the provided date is X seconds in the past (defaults to 0 seconds).
 */
export function isSecondsInPast(date?: IsoDate, seconds = 0): boolean | null {
  if (!isValidIsoDate(date)) {
    return null;
  }

  return moment(date).isBefore(moment().subtract(seconds, 'seconds'));
}
