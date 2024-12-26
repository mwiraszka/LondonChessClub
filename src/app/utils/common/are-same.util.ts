import { isEqual, mapValues } from 'lodash';

/**
 * Check whether two objects are (deeply) equal.
 *
 * @param a The first object to compare
 * @param b The second object to compare
 * @param strict Treat null, undefined and empty string property values as unique
 */
export function areSame(a: unknown, b: unknown, strict: boolean = false): boolean {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (!strict) {
    a = mapValues(a, value => (value === undefined || value === '' ? null : value));
    b = mapValues(b, value => (value === undefined || value === '' ? null : value));
  }

  return isEqual(a, b);
}
