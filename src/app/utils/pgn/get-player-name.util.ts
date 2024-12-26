/**
 * Parse PGN for one of the two players' names.
 *
 * @param pgn
 * @param name First name only, last name only, or space-separated full name
 * @param color Which player's name to get
 */
export function getPlayerName(
  pgn?: string,
  name?: 'first' | 'last' | 'full',
  color?: 'White' | 'Black',
): string | undefined {
  if (!pgn || !name || !color) {
    return;
  }

  try {
    const [lastName, firstName] = pgn.split(`[${color} "`)[1].split('"]')[0].split(', ');

    return name === 'first'
      ? firstName
      : name === 'last'
        ? lastName
        : `${firstName} ${lastName}`;
  } catch (error) {
    console.error('[LCC] Unable to parse player name:', error);
    return;
  }
}
