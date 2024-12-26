import moment from 'moment-timezone';

/**
 * Check whether value is a valid ISO 8601 date string (i.e. in the form of `YYYY-MM-DDTHH:mm:ss`).
 */
export function isValidIsoDate(value: unknown): boolean {
  return typeof value === 'string' && moment(value, moment.ISO_8601, true).isValid();
}
