/* eslint-disable no-prototype-builtins */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action } from '@ngrx/store';
import { isEqual } from 'lodash';
import moment from 'moment';
import * as uuid from 'uuid';

import { AuthActions } from '@app/store/auth';
import { ClubEvent } from '@app/types';

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
 * Takes 'n' random items from an array
 * @param {T[]} array The array (any type)
 * @param {number} n The number of items to take
 */
export function takeRandomly<T>(array: T[], n: number): T[] {
  if (array?.length <= n) {
    return array;
  }

  return array.sort(() => 0.5 - Math.random()).slice(0, n);
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
 * @param {string} date The date either as a JS Date object or as a string in YYYY-MM-DD format
 * @returns {string} A user-friendly version of the input date
 *
 * Long with time (default): Thursday, January 1, 2024 at 6:00 PM
 * Short with time: Thu, Jan 1, 2024, 6:00 PM
 * Long without time: Thursday, January 1, 2024
 * Short without time: Thu, Jan 1, 2024
 */
export function formatDate(
  date: string | Date,
  length: 'long' | 'short' = 'long',
  showTime: 'time' | 'no-time' = 'time',
): string {
  const today = new Date(date);
  const formatOptions: any = {
    weekday: length,
    year: 'numeric',
    month: length,
    day: 'numeric',
    hour: showTime === 'time' ? 'numeric' : undefined,
    minute: showTime === 'time' ? 'numeric' : undefined,
  };

  const temp = new Date(today.getTime()).toLocaleDateString('en-US', formatOptions);
  return temp;
}

/**
 * Filters out a limited number of future events from an array of sorted events
 * @returns {ClubEvent[] | null} An array of upcoming club events
 */
export function getUpcomingEvents(
  sortedEvents: ClubEvent[],
  limit?: number,
): ClubEvent[] | null {
  const today = Date.now();
  const upcomingEvents = sortedEvents.filter(event => {
    const eventDateAsUtc = new Date(event.eventDate);
    return eventDateAsUtc.setDate(eventDateAsUtc.getDate() + 1) >= today;
  });

  if (!upcomingEvents.length || (limit && limit < 1)) {
    return null;
  }

  if (limit) {
    return upcomingEvents.slice(0, limit);
  }

  return upcomingEvents;
}

/**
 * Sanitizes the action by replacing sensitive props if it includes any;
 * otherwise returns the same action
 * @param {Action} action
 * @returns {Action}
 */
export function actionSanitizer(action: Action) {
  const shruggy = '¯\\_(ツ)_/¯';
  if (
    action.type === AuthActions.loginRequested.type ||
    action.type === AuthActions.passwordChangeRequested.type
  ) {
    return {
      ...action,
      request: shruggy,
    };
  }

  if (action.type === AuthActions.passwordChangeSucceeded.type) {
    return {
      ...action,
      newPassword: shruggy,
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
