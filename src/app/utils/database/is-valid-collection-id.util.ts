/**
 * Check whether value is a valid MongoDB ID (used for identifying articles, events and members).
 */
export function isValidCollectionId(value: unknown): boolean {
  return typeof value === 'string' && /^[a-f\d]{24}$/.test(value);
}
