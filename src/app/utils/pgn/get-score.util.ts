import type { GameScore } from '@app/models';
import { isGameScore } from '@app/models/game-details.model';

import { isDefined } from '../common/is-defined.util';

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

  const _firstSplit = pgn.split('[Result "');
  if (!_firstSplit?.length || _firstSplit.length < 2) {
    return;
  }

  const _secondSplit = _firstSplit[1].split('"]')[0];
  if (!isDefined(_secondSplit)) {
    return;
  }

  const [whiteScore, blackScore] = _secondSplit.split('-');
  if (whiteScore === '*') {
    return '*';
  }

  if (!isGameScore(whiteScore) || !isGameScore(blackScore)) {
    return;
  }

  return color === 'White' ? whiteScore : blackScore;
}
