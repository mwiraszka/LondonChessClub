/**
 * Check whether value is a valid time, formatted as `hh:mm A`
 * (e.g. `5:45 PM`, `6:00 am`, or `12:00 PM`).
 */
export function isValidTime(value: unknown): boolean {
  return (
    typeof value === 'string' &&
    /^([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AP][Mm]|[ap]m)$/.test(value)
  );
}
