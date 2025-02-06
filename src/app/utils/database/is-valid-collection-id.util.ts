import { isString } from '../common/is-string.util';

/**
 * Check whether value is a valid MongoDB ID (used for identifying articles, events and members).
 */
export function isValidCollectionId(value: unknown): boolean {
  return isString(value) && /^[a-f\d]{24}$/.test(value);
}
