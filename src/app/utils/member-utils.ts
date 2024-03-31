/**
 * @returns {boolean} Whether the member id is in a valid UUID format
 */
export function isValidMemberId(memberId: string): boolean {
  // TODO: Improve check with a specific UUID format regex test
  return memberId.length === 36;
}
