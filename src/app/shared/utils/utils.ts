/**
 * Checks each of a's parameters' values against b's
 * (b could still have additional properties unaccounted for)
 */
export function areSame(a: Object, b: Object): boolean {
  for (const property in a) {
    if (a[property] !== b[property]) {
      return false;
    }
  }
  return true;
}
