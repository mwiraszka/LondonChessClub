import { isNaN } from 'lodash';

import { GameScore, isGameScore } from '@app/types';

/**
 * @param pgn The PGN of the chess game
 * @param name First name only, last name only, or space-separated full name
 * @param color Which player's name to get
 *
 * @returns {string | undefined} A player's name, if included in the PGN
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

  for (const pgn of pgns) {
    const ecoOpeningCode = getEcoOpeningCode(pgn);
    const talliesForThisEco = openingTallies.get(ecoOpeningCode) ?? 0;
    openingTallies.set(ecoOpeningCode, talliesForThisEco + 1);
  }

  const sortedOpeningTallies = [...openingTallies.entries()].sort((a, b) => b[1] - a[1]);

  if (sortedOpeningTallies.length <= 5) {
    return new Map(sortedOpeningTallies);
  }

  const otherOpeningTally = sortedOpeningTallies
    .slice(5)
    .reduce((acc, curr) => acc + curr[1], 0);

  const cappedOpeningsTallies = [
    ...sortedOpeningTallies.slice(0, 4),
    ['X99', otherOpeningTally] as [string, number],
  ];

  return new Map(cappedOpeningsTallies);
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

  for (const pgn of pgns) {
    const score = getScore(pgn, 'White');

    const result =
      score === '1'
        ? 'White wins'
        : score === '0'
          ? 'Black wins'
          : score === '1/2'
            ? 'Draw'
            : score === '*'
              ? 'Inconclusive'
              : 'Unknown';

    const talliesForThisResult = resultTallies.get(result) ?? 0;
    resultTallies.set(result, talliesForThisResult + 1);
  }

  const sortedResultTallies = new Map(
    [...resultTallies.entries()].sort((a, b) => b[1] - a[1]),
  );
  return sortedResultTallies;
}

/**
 * @param pgn The PGN of the chess game
 *
 * @returns {string} The game's ECO opening code or custom 'X98' code if it cannot be found in the PGN
 */
function getEcoOpeningCode(pgn: string): string {
  return pgn.split('[ECO "')?.[1]?.split('"]')[0] ?? 'X98';
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
