/**
 * @returns {boolean} Whether the member id is in a valid UUID format
 */
export function isValidMemberId(memberId: string): boolean {
  const regExp = new RegExp(
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
  );
  return regExp.test(memberId);
}
