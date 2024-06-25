/* eslint-disable no-prototype-builtins */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from 'lodash';

/**
 * @returns A type predicate to eliminate `null` and `undefined` types
 */
export function isDefined<T extends {}>(x: T | null | undefined): x is T {
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
 * @param {boolean} isAscending Whether sort is in ascending order (i.e. 1..10, a..z)
 *
 * @returns The sorting function used to determine the order of the elements.
 * It is expected to return a negative value if the first argument is less than the
 * second argument, zero if they're equal, and a positive value otherwise. If omitted,
 * the elements are sorted in ascending, ASCII character order:
 * `[11,2,22,1].sort((a, b) => a - b)`
 */
export function customSort(key: string, isAscending: boolean) {
  return function innerSort(a: Object, b: Object, _key = key): number {
    if (
      _key.includes('.') &&
      a.hasOwnProperty(_key.split('.')[0]) &&
      b.hasOwnProperty(_key.split('.')[0])
    ) {
      // Call innerSort recursively until lowest-level property reached
      const aInnerObject = (a as any)[_key.split('.')[0]];
      const bInnerObject = (b as any)[_key.split('.')[0]];
      return innerSort(aInnerObject, bInnerObject, _key.split('.')[1]);
    }

    if (!a.hasOwnProperty(_key) || !b.hasOwnProperty(_key)) {
      return 0; // Property doesn't exist on either object
    }

    let aVal = (a as any)[_key];
    let bVal = (b as any)[_key];

    if (aVal instanceof Date && bVal instanceof Date) {
      aVal = aVal.getTime();
      bVal = bVal.getTime();
    } else if (!isNaN(aVal?.split('/')[0]) && !isNaN(bVal?.split('/')[0])) {
      // If both objects (before a potential slash) are valid numbers, convert
      // to number type (used specifically for provisional ratings in the format 1234/5)
      aVal = +aVal.split('/')[0];
      bVal = +bVal.split('/')[0];
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toUpperCase();
      bVal = bVal.toUpperCase();
    }

    let ascendingOrder = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      ascendingOrder *= -1;
    }

    return isAscending ? ascendingOrder : ascendingOrder * -1;
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
