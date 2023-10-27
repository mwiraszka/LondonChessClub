/* eslint-disable no-prototype-builtins */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@ngrx/store';
import { isEqual } from 'lodash';
import * as uuid from 'uuid';

import { AuthActions } from '@app/store/auth';

/**
 * A wrapper for lodash's isEqual()
 * @param {Object} a The first object to compare
 * @param {Object} b The second object to compare
 */
export function areSame(a: Object, b: Object): boolean {
  return isEqual(a, b);
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

    let varA: any =
      typeof (a as any)[key] === 'string'
        ? (a as any)[key].toUpperCase()
        : (a as any)[key];
    let varB: any =
      typeof (b as any)[key] === 'string'
        ? (b as any)[key].toUpperCase()
        : (b as any)[key];

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
 * (see https://www.geeksforgeeks.org/how-to-convert-a-string-into-kebab-case-using-javascript)
 * @param {string} anyString The input string Like This, LikeThis, or Like_This
 * @returns {string} The same text in kebab-case
 */
export function kebabize(anyString: string): string {
  const wordArray = anyString
    .replace('.', '')
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g);
  return wordArray?.join('-').toLowerCase() ?? '';
}

/**
 * Converts kebab-case to CamelCase
 * @param {string} kebabString The input string in kebab-case
 * @returns {string} The same text in camelCase
 */
export function camelize(kebabString: string): string {
  return kebabString.replace(/-./g, hyphen => hyphen[1].toUpperCase());
}

/**
 * Recursively searches for the given class name by traversing all of
 * the given element's parent nodes in the DOM
 * @param {Node} node The current HTML node
 * @param {string} className The CSS class being searched for up the DOM tree
 * @returns {boolean} Whether the class was found
 */
export function hasParentNodeWithClass(
  element: Element | null,
  className: string,
): boolean {
  if (!element) {
    return false;
  }
  const currentElement = element.parentElement;
  return currentElement?.classList.contains(className)
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

/**
 * Generates an article ID based on the current date and a random string of hex values
 * @returns {string}
 */
export function generateArticleId(): string {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split('T')[0].replaceAll('-', '');
  const uniqueId = uuid.v4().slice(-8);
  return `art-${formattedDate}-${uniqueId}`;
}

/**
 * Generates an article image ID based on the article ID, the current date,
 * and a random string of hex values
 * @returns {string}
 */
export function generateArticleImageId(articleId: string): string {
  const uniqueId = uuid.v4().slice(-8);
  return `${articleId}-img1-${uniqueId}`;
}
