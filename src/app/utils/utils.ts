import { Action } from '@ngrx/store';

import { AuthActions } from '@app/store/auth';

/**
 * Checks each of a's parameters' values against b's
 * (b could still have additional properties unaccounted for)
 * @param {Object} a The first object to compare
 * @param {Object} b The second object to compare
 */
export function areSame(a: Object, b: Object): boolean {
  for (const key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

/**
 * A custom sorting algorithm, to be used within an array sort method, for example
 * `sortedItems = items.sort(customSort(key, order))`
 * @param {string} key The object property to sort by
 * @param {boolean} isAscending Whether sort is in ascending order (i.e. 1..10, a..z)
 */
export function customSort(key: string, isAscending: boolean) {
  return function innerSort(a: Object, b: Object): number {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0; // Property doesn't exist on either object
    }

    let varA: any = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    let varB: any = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    // If both objects (before a potential slash) are valid numbers, convert to number type
    if (!isNaN(varA.split('/')[0]) && !isNaN(varB.split('/')[0])) {
      varA = +varA.split('/')[0];
      varB = +varB.split('/')[0];
    }

    const ascendingOrder = varA > varB ? 1 : varA < varB ? -1 : 0;

    return isAscending ? ascendingOrder : ascendingOrder * -1;
  };
}

/**
 * Converts any string to kebab-case
 * @param {string} anyString The input string Like This, LikeThis, or Like_This
 * @returns {string} The same text in kebab-case
 */
export function kebabize(anyString: string): string {
  return anyString
    .replace('.', '')
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .join('-')
    .toLowerCase();
}

/**
 * Converts kebab-case to CamelCase
 * @param {string} kebabString The input string in kebab-case
 * @returns {string} The same text in camelCase
 */
export function camelize(kebabString: string): string {
  return kebabString.replace(/-./g, (hyphen) => hyphen[1].toUpperCase());
}

/**
 * Recursively searches for the given class name by traversing all of
 * the given element's parent nodes in the DOM
 * @param {Node} node The current HTML node
 * @param {string} className The CSS class being searched for up the DOM tree
 * @returns {boolean} Whether the class was found
 */
export function hasParentNodeWithClass(element: Element, className: string): boolean {
  const currentElement = element.parentElement;
  return currentElement.classList.contains(className)
    ? true
    : hasParentNodeWithClass(currentElement, className);
}

/**
 * @returns {boolean} Whether the user is on a touch screen device
 */
export function isTouchScreen(): boolean {
  return window.matchMedia('(pointer: coarse)').matches;
}

/**
 * @param {string} date The date in YYYY-MM-DD format
 * @returns {string} User-friendly version of the input date
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  return new Date(d.getTime() + Math.abs(d.getTimezoneOffset() * 60000)).toDateString();
}

/**
 * Sanitizes the action by replacing sensitive props if it includes any;
 * otherwise returns the same action
 * @param {Action} action
 * @returns {Action}
 */
export function actionSanitizer(action: Action) {
  if (
    action.type === AuthActions.loginRequested.type ||
    action.type === AuthActions.passwordChangeRequested.type
  ) {
    return {
      ...action,
      request: '¯\\_(ツ)_/¯',
    };
  }
  return action;
}
