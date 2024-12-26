import type { GameScore } from '@app/types';
import { isGameScore } from '@app/types/game-details.model';

/**
 * Parse PGN for a player's score (`1`, `1/2`, `0` or `*`).
 *
 * @param pgn
 * @param color Which player's score to get
 */
export function getScore(pgn?: string, color?: 'White' | 'Black'): GameScore | undefined {
  if (!pgn || !color) {
    return;
  }

  try {
    const [whiteScore, blackScore] = pgn.split('[Result "')[1].split('"]')[0].split('-');
    if (whiteScore === '*') {
      return '*';
    }

    if (!isGameScore(whiteScore) || !isGameScore(blackScore)) {
      return;
    }

    return color === 'White' ? whiteScore : blackScore;
  } catch (error) {
    console.error('[LCC] Unable to parse game score:', error);
    return;
  }
}
