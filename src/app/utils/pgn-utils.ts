import { isNaN } from 'lodash';

import { GameScore, isValidGameScore } from '@app/types';

/**
 * @param pgn The PGN of the chess game
 * @param color Which player's name to get
 *
 * @returns {string | undefined} The player's full name, if included in the PGN
 */
export function getPlayerName(
  pgn?: string,
  color?: 'White' | 'Black',
): string | undefined {
  if (!pgn || !color) {
    return;
  }

  const name = pgn.split(`[${color} "`)[1].split('"]')[0];
  const [lastName, firstName] = name.split(', ');

  if (!firstName && !lastName) {
    return;
  }
  return `${firstName} ${lastName}`;
}

/**
 * @param pgn The PGN of the chess game
 * @param color Which player's score to get
 *
 * @returns {GameScore | undefined} The player's score (1, 1/2, 0 or *),
 * if the result is included in the PGN
 */
export function getScore(pgn?: string, color?: 'White' | 'Black'): GameScore | undefined {
  if (!pgn || !color) {
    return;
  }

  const [whiteScore, blackScore] = pgn.split('[Result "')[1].split('"]')[0].split('-');

  if (whiteScore === '*') {
    return '*';
  }

  if (!isValidGameScore(whiteScore) || !isValidGameScore(blackScore)) {
    return;
  }

  return color === 'White' ? whiteScore : blackScore;
}

/**
 * @param pgn The PGN of the chess game
 *
 * @returns {number | undefined} The game's ply count, if included in the PGN
 */
export function getPlyCount(pgn?: string): number | undefined {
  if (!pgn) {
    return;
  }

  const plyCount = pgn.split('[PlyCount "')[1].split('"]')[0];
  return !plyCount || isNaN(+plyCount) ? undefined : +plyCount;
}
