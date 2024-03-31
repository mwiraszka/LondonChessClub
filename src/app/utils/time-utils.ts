/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment';

/**
 * @param {string} date The date either as a JS Date object or as a string in YYYY-MM-DD format
 *
 * @returns {string} A user-friendly version of the input date, e.g.:
 *
 * Long with time (default): Thursday, January 1, 2024 at 6:00 PM
 *
 * Short with time: Thu, Jan 1, 2024, 6:00 PM
 *
 * Long without time: Thursday, January 1, 2024
 *
 * Short without time: Thu, Jan 1, 2024
 */
export function formatDate(
  date: string | Date,
  length: 'long' | 'short' = 'long',
  showTime: 'time' | 'no-time' = 'time',
): string {
  const today = new Date(date);
  const formatOptions: any = {
    weekday: length,
    year: 'numeric',
    month: length,
    day: 'numeric',
    hour: showTime === 'time' ? 'numeric' : undefined,
    minute: showTime === 'time' ? 'numeric' : undefined,
  };

  return new Date(today.getTime()).toLocaleDateString('en-US', formatOptions);
}

/**
 * Set time on event date to 6:00 PM local time
 *
 * @param {string} date The date as a string in YYYY-MM-DD format
 *
 * @returns {string} A JS Date object representing the same day at 6:00 PM in the local timezone
 */
export function setLocalTime(date: string): Date {
  return moment(date + ' 18:00').toDate();
}
