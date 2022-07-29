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
 * @param {boolean} isAscending Whether sort is in ascending order
 */
export function customSort(key: string, isAscending: boolean) {
  return function innerSort(a: Object, b: Object): number {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0; // Property doesn't exist on either object
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
    const comparison = varA > varB ? 1 : varA < varB ? -1 : 0;

    return isAscending ? comparison : comparison * -1;
  };
}

/**
 * Converts any string to kebab-case
 * @param {string} anyString The input string Like This, LikeThis, or Like_This
 * @returns {string} The same text in kebab-case
 */
export function kebabize(anyString: string): string {
  return anyString
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
