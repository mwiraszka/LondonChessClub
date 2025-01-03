import moment from 'moment-timezone';

import { formatDate } from './format-date.util';

describe('formatDate', () => {
  const currentDate = moment();
  const currentDateLong = currentDate.format('dddd, MMMM Do YYYY [at] h:mm A');

  it('transforms undefined to the current date in "long" format', () => {
    expect(formatDate(undefined)).toBe(currentDateLong);
  });

  it('transforms non-date strings to "Invalid date"', () => {
    expect(formatDate('')).toBe('Invalid date');
    expect(formatDate(' ')).toBe('Invalid date');
    expect(formatDate('abc')).toBe('Invalid date');
    expect(formatDate('15#d$E*__f15')).toBe('Invalid date');
    expect(formatDate('15 15')).toBe('Invalid date');
  });

  it('transforms valid date strings correctly when no `format` provided', () => {
    expect(formatDate('1')).toBe('Monday, January 1st 2001 at 12:00 AM');
    expect(formatDate('1999')).toBe('Friday, January 1st 1999 at 12:00 AM');
    expect(formatDate('2000-01-01')).toBe('Saturday, January 1st 2000 at 12:00 AM');
    expect(formatDate('January 15, 1991')).toBe('Tuesday, January 15th 1991 at 12:00 AM');
    expect(formatDate(new Date('1991-01-15').toDateString())).toBe(
      'Tuesday, January 15th 1991 at 12:00 AM',
    );
    expect(formatDate(new Date().toISOString())).toBe(currentDateLong);
  });

  it('transforms valid date strings correctly when `format` is explicitly set to "long"', () => {
    expect(formatDate('1', 'long')).toBe('Monday, January 1st 2001 at 12:00 AM');
    expect(formatDate('1999', 'long')).toBe('Friday, January 1st 1999 at 12:00 AM');
    expect(formatDate('2000-01-01', 'long')).toBe(
      'Saturday, January 1st 2000 at 12:00 AM',
    );
    expect(formatDate('January 15, 1991', 'long')).toBe(
      'Tuesday, January 15th 1991 at 12:00 AM',
    );
    expect(formatDate(new Date('1991-01-15').toDateString(), 'long')).toBe(
      'Tuesday, January 15th 1991 at 12:00 AM',
    );
    expect(formatDate(new Date().toISOString(), 'long')).toBe(currentDateLong);
  });

  it('transforms valid date strings correctly when `format` is set to "long no-time"', () => {
    expect(formatDate('1', 'long no-time')).toBe('Monday, January 1st 2001');
    expect(formatDate('1999', 'long no-time')).toBe('Friday, January 1st 1999');
    expect(formatDate('2000-01-01', 'long no-time')).toBe('Saturday, January 1st 2000');
    expect(formatDate('January 15, 1991', 'long no-time')).toBe(
      'Tuesday, January 15th 1991',
    );
    expect(formatDate(new Date('1991-01-15').toDateString(), 'long no-time')).toBe(
      'Tuesday, January 15th 1991',
    );
    expect(formatDate(new Date().toISOString(), 'long no-time')).toBe(
      currentDate.format('dddd, MMMM Do YYYY'),
    );
  });

  it('transforms valid date strings correctly when `format` is set to "short"', () => {
    expect(formatDate('1', 'short')).toBe('Mon, Jan 1, 2001, 12:00 AM');
    expect(formatDate('1999', 'short')).toBe('Fri, Jan 1, 1999, 12:00 AM');
    expect(formatDate('2000-01-01', 'short')).toBe('Sat, Jan 1, 2000, 12:00 AM');
    expect(formatDate('January 15, 1991', 'short')).toBe('Tue, Jan 15, 1991, 12:00 AM');
    expect(formatDate(new Date('1991-01-15').toDateString(), 'short')).toBe(
      'Tue, Jan 15, 1991, 12:00 AM',
    );
    expect(formatDate(new Date().toISOString(), 'short')).toBe(
      currentDate.format('ddd, MMM D, YYYY, h:mm A'),
    );
  });

  it('transforms valid date strings correctly when `format` is set to "short no-time"', () => {
    expect(formatDate('1', 'short no-time')).toBe('Mon, Jan 1, 2001');
    expect(formatDate('1999', 'short no-time')).toBe('Fri, Jan 1, 1999');
    expect(formatDate('2000-01-01', 'short no-time')).toBe('Sat, Jan 1, 2000');
    expect(formatDate('January 15, 1991', 'short no-time')).toBe('Tue, Jan 15, 1991');
    expect(formatDate(new Date('1991-01-15').toDateString(), 'short no-time')).toBe(
      'Tue, Jan 15, 1991',
    );
    expect(formatDate(new Date().toISOString(), 'short no-time')).toBe(
      currentDate.format('ddd, MMM D, YYYY'),
    );
  });
});
