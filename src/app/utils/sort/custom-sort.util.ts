import { has } from 'lodash';

import { isDefined } from '@app/utils';

/**
 * A custom sorting algorithm, to be used within an array sort method, e.g.
 * `sortedItems = items.sort(customSort(key))`.
 *
 * Return a sort function which sorts based on keys' types, which returns `-1` if the first value
 * is less; `0` if equal; and `1` if the first value is greater.
 *
 * @param {string} key The object property to sort by
 */
export function customSort(key: string) {
  return function _sort(a: unknown, b: unknown, _key = key): -1 | 0 | 1 {
    const [nestedObject, nestedKey] = _key.split('.');
    if (_key.includes('.') && has(a, nestedObject) && has(b, nestedObject)) {
      // Call _sort() recursively until lowest-level property is reached
      return _sort(a[nestedObject], b[nestedObject], nestedKey);
    }

    if (!has(a, _key) || !has(b, _key)) {
      console.error(
        `[LCC] Sort error: property '${_key}' does not exist on both objects.`,
      );
      return 0;
    }

    const aVal = a[_key as keyof typeof a];
    const bVal = b[_key as keyof typeof b];

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
        `[LCC] Sort error: cannot compare ${aVal} (${typeof aVal}) with ${bVal} (${typeof bVal}).`,
        a,
        b,
      );
      return 0;
    }

    if (aVal instanceof Date || bVal instanceof Date) {
      console.error(`[LCC] Sort error: JS date object detected while sorting '${_key}'`);
      return 0;
    }

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal < bVal ? -1 : aVal === bVal ? 0 : 1;
    }

    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      return aVal && !bVal ? -1 : !aVal && bVal ? 1 : 0;
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
