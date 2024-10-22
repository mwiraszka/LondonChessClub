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
  color: 'White' | 'Black' = 'White',
): string | undefined {
  if (!pgn) {
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

  const [whiteScore, blackScore] = pgn
    .split('[Result "')?.[1]
    ?.split('"]')?.[0]
    ?.split('-');

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

  const plyCount = pgn.split('[PlyCount "')[1]?.split('"]')[0];
  return !plyCount || isNaN(+plyCount) ? undefined : +plyCount;
}

/**
 * @param pgns The PGNs of the chess games
 *
 * @returns {Map<string, number> | undefined} The Encyclopedia of Chess Openings (ECO)'s
 * opening codes mapped to the number of occurrences in the given array
 */
export function getOpeningTallies(pgns?: string[]): Map<string, number> | undefined {
  if (!pgns || !pgns.length) {
    return;
  }

  const openingTallies: Map<string, number> = new Map([]);

  for (let pgn of pgns) {
    const eco = getEcoOpeningCode(pgn) ?? 'X99';

    const talliesForThisEco = openingTallies.get(eco);

    if (talliesForThisEco) {
      openingTallies.set(eco, talliesForThisEco + 1);
    } else {
      openingTallies.set(eco, 1);
    }
  }

  return openingTallies;
}

/**
 * @param pgns The PGNs of the chess games
 *
 * @returns {Map<string, number> | undefined} The game result mapped to the number
 * of occurrences of the result in the given array
 */
export function getResultTallies(pgns?: string[]): Map<string, number> | undefined {
  if (!pgns || !pgns.length) {
    return;
  }

  const resultTallies: Map<string, number> = new Map([]);

  for (let pgn of pgns) {
    const score = getScore(pgn, 'White');

    if (!score) {
      continue;
    }

    const result =
      score === '1'
        ? 'White wins'
        : score === '0'
          ? 'Black wins'
          : score === '1/2'
            ? 'Draw'
            : 'Inconclusive';

    const talliesForThisResult = resultTallies.get(result);

    if (talliesForThisResult) {
      resultTallies.set(result, talliesForThisResult + 1);
    } else {
      resultTallies.set(result, 1);
    }
  }

  return resultTallies;
}

/**
 * @param pgn The PGN of the chess game
 *
 * @returns {number | undefined} The game's ECO opening code
 */
function getEcoOpeningCode(pgn?: string): string | undefined {
  if (!pgn) {
    return;
  }

  return pgn.split('[ECO "')?.[1]?.split('"]')[0];
}

/**
 * @param pgn The full PGN of the chess game
 *
 * @returns {string} A URL to Lichess' analysis board, with only the moves and score portion
 * of the PGN passed in; returns an empty string if pgn is undefined or no moves exist
 */
export function getLichessAnalysisUrl(pgn?: string): string | null {
  if (!pgn) {
    return '';
  }

  const moves = pgn.split('"]\n\n')[1].replaceAll('\n', ' ');
  return moves.startsWith('1. ') ? 'https://lichess.org/analysis/pgn/' + moves : null;
}
