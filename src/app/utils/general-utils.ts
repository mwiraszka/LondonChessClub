import { isEqual } from 'lodash';

/**
 * @returns A type predicate to eliminate `null` and `undefined` types
 */
export function isDefined<T extends unknown>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

/**
 * @returns {boolean} Whether the user is on a touch screen device
 */
export function isTouchScreen(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * @returns {boolean} Whether the user has dark mode set as a preference on their device
 */
export function isSystemDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * A wrapper for lodash's `isEqual()`
 *
 * @param {Object | null} a The first object to compare
 * @param {Object | null} b The second object to compare
 *
 * @returns {boolean} Whether the two objects are (deeply) equal
 */
export function areSame(a: Object | null, b: Object | null): boolean {
  if (a === null && b === null) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  return isEqual(a, b);
}

/**
 * @param {any} value
 *
 * @returns {boolean} Whether the given value is `null`, `undefined`, or an empty object
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  return value && Object.keys(value).length === 0 && value.constructor === Object;
}

/**
 * A custom sorting algorithm, to be used within an array sort method, for example
 * `sortedItems = items.sort(customSort(key, order))`
 *
 * @param {string} key The object property to sort by
 * @param {boolean} isAscending Whether sort is in ascending order (i.e. 1 -> 9, a -> z)
 *
 * @returns a custom sort function, set to sort the given keys based on their types
 * returning -1 if the first value is less; 0 if equal; 1 if the first value is greater
 */
export function customSort(key: string) {
  return function _sort(a: any, b: any, _key = key): -1 | 0 | 1 {
    if (
      _key.includes('.') &&
      a.hasOwnProperty(_key.split('.')[0]) &&
      b.hasOwnProperty(_key.split('.')[0])
    ) {
      // Call _sort() recursively until lowest-level property reached
      const aInnerObject = (a as any)[_key.split('.')[0]];
      const bInnerObject = (b as any)[_key.split('.')[0]];
      return _sort(aInnerObject, bInnerObject, _key.split('.')[1]);
    }

    if (!a.hasOwnProperty(_key) || !b.hasOwnProperty(_key)) {
      console.error(
        `[LCC] Sort error: property '${_key}' does not exist on both objects.`,
      );
      return 0;
    }

    let aVal = a[_key];
    let bVal = b[_key];

    if (!isDefined(aVal) && !isDefined(bVal)) {
      return 0;
    }

    if (!isDefined(aVal)) {
      return 1;
    }

    if (!isDefined(bVal)) {
      return -1;
    }

    if (typeof aVal !== typeof bVal) {
      console.error(
        `[LCC] Sort error: cannot compare ${typeof aVal} with ${typeof bVal}.`,
      );
      return 0;
    }

    if (aVal instanceof Date || bVal instanceof Date) {
      console.error(`[LCC] Sort error: JS date object detected while sorting '${_key}'`);
      return 0;
    }

    if (typeof aVal === 'number') {
      return aVal < bVal ? -1 : aVal === bVal ? 0 : 1;
    }

    if (typeof aVal !== 'string') {
      console.error(
        `[LCC] Sort error: unknown property type detected while sorting '${_key}': '${typeof aVal}'`,
      );
      return 0;
    }

    if (typeof bVal !== 'string') {
      console.error(
        `[LCC] Sort error: unknown property type detected while sorting '${_key}': '${typeof bVal}'`,
      );
      return 0;
    }

    let aCompare;
    let bCompare;

    if (['rating', 'peakRating'].includes(key)) {
      aCompare = Number(aVal.split('/')[0]);
      bCompare = Number(bVal.split('/')[0]);
      return aCompare < bCompare ? -1 : aCompare === bCompare ? 0 : 1;
    } else {
      aCompare = aVal.toUpperCase();
      bCompare = bVal.toUpperCase();
      return aCompare < bCompare ? -1 : aCompare === bCompare ? 0 : 1;
    }
  };
}

/**
 * Takes 'n' random items from an array
 *
 * @param {T[]} array The array (any type)
 * @param {number} n The number of items to take
 *
 * @returns {T[]} 'n' items from the given array if 'n' is passed in, otherwise the
 * entire array
 */
export function takeRandomly<T>(array: T[], n?: number): T[] {
  return array.sort(() => 0.5 - Math.random()).slice(0, n ?? array?.length ?? 0);
}
