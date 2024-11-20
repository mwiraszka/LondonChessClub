import moment from 'moment-timezone';

/**
 * @param {string} date A JS Date object
 * @param {string} format 'long' | 'long no-time' | 'short' | 'short no-time' keyword to
 * signal how to format the date
 *
 * @returns {string} A user-friendly version of the input date, e.g.:
 *
 * Long (default): Thursday, January 1st 2024 at 6:00 PM
 *
 * Long without time: Thursday, January 1st 2024
 *
 * Short: Thu, Jan 1, 2024, 6:00 PM
 *
 * Short without time: Thu, Jan 1, 2024
 */
export function formatDate(
  date: Date,
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
