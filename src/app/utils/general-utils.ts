/* eslint-disable no-prototype-builtins */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { isEqual } from 'lodash';

/**
 * @returns {boolean} Whether the user is on a touch screen device
 */
export function isTouchScreen(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * A wrapper for lodash's `isEqual()`
 *
 * @param {Object} a The first object to compare
 * @param {Object} b The second object to compare
 *
 * @returns {boolean} Whether the two objects are (deeply) equal
 */
export function areSame(a: Object, b: Object): boolean {
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

    let varA: any =
      typeof (a as any)[_key] === 'string'
        ? (a as any)[_key].toUpperCase()
        : (a as any)[_key];
    let varB: any =
      typeof (b as any)[_key] === 'string'
        ? (b as any)[_key].toUpperCase()
        : (b as any)[_key];

    if (varA instanceof Date && varB instanceof Date) {
      varA = varA.getTime();
      varB = varB.getTime();
    } else if (!isNaN(varA?.split('/')[0]) && !isNaN(varB?.split('/')[0])) {
      // If both objects (before a potential slash) are valid numbers, convert
      // to number type (used specifically for provisional ratings in the format 1234/5)
      varA = +varA.split('/')[0];
      varB = +varB.split('/')[0];
    }

    const ascendingOrder = varA > varB ? 1 : varA < varB ? -1 : 0;

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
