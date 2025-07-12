import moment from 'moment-timezone';

import { isSecondsInPast } from './is-seconds-in-past.util';

describe('isSecondsInPast', () => {
  it('returns null for invalid dates', () => {
    expect(isSecondsInPast('')).toBeNull();
    expect(isSecondsInPast('invalid-date')).toBeNull();
    expect(isSecondsInPast('2023-13-32')).toBeNull();
    expect(isSecondsInPast('2023/01/01')).toBeNull();
    expect(isSecondsInPast(undefined)).toBeNull();
  });

  it('returns true when date is in the past (default 0 seconds)', () => {
    const pastDate = moment().subtract(5, 'minute').toISOString();
    const justPastDate = moment().subtract(1, 'millisecond').toISOString();

    expect(isSecondsInPast(pastDate)).toBe(true);
    expect(isSecondsInPast(justPastDate)).toBe(true);
    expect(isSecondsInPast('2020-01-01T00:00:00Z')).toBe(true);
  });

  it('returns false when date is not in the past (default 0 seconds)', () => {
    const futureDate = moment().add(5, 'minute').toISOString();
    const farFutureDate = moment().add(1, 'year').toISOString();

    expect(isSecondsInPast(futureDate)).toBe(false);
    expect(isSecondsInPast(farFutureDate)).toBe(false);
  });

  it('correctly checks if date is X seconds in the past', () => {
    const now = moment();

    const seconds59Past = now.clone().subtract(59, 'seconds').toISOString();
    const seconds60Past = now.clone().subtract(60, 'seconds').toISOString();
    const seconds61Past = now.clone().subtract(61, 'seconds').toISOString();

    expect(isSecondsInPast(seconds59Past, 60)).toBe(false);
    expect(isSecondsInPast(seconds60Past, 60)).toBe(true);
    expect(isSecondsInPast(seconds61Past, 60)).toBe(true);
  });
});
