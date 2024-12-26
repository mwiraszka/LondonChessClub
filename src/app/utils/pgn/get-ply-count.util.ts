/**
 * Parse PGN for the game's ply count.
 *
 * @param pgn
 */
export function getPlyCount(pgn?: string): number | undefined {
  if (!pgn) {
    return;
  }

  const plyCount = pgn.split('[PlyCount "')[1]?.split('"]')[0];

  return isNaN(Number(plyCount)) ? undefined : Number(plyCount);
}
