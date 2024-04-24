import moment from 'moment-timezone';

const HH_MM_REG_EXP = new RegExp(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);

/**
 * @param {string} date The date either as a JS Date object or as a string in YYYY-MM-DD format
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
  date: string | Date,
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
 * @param {string} date The date as a string in YYYY-MM-DD format
 * @param {string} time The time to set in HH:MM format (defaults to club start time of 18:00)
 *
 * @returns {string} A JS Date string representing the same day at the given time in EST/EDT timezone
 */
export function setLocalTime(date: string, time = '18:00'): string {
  if (!HH_MM_REG_EXP.test(time)) {
    console.error(`Invalid time provided to setLocalTime util function: ${time}`);
    time = '00:00';
  }

  return moment(date + ' ' + time)
    .tz('America/Toronto')
    .format();
}
