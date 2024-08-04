/**
 * There are four possible ways of scoring in a chess game:
 *
 * 1 - win;
 * 1/2 - draw;
 * 0 - loss;
 * \* - incomplete/inconclusive
 */
const gameScores = ['1', '1/2', '0', '*'] as const;
export type GameScore = (typeof gameScores)[number];

export function isValidGameScore(value: string): value is GameScore {
  return gameScores.indexOf(value as GameScore) !== -1;
}

export interface GameDetails {
  pgn: string;
  whiteName?: string;
  whiteScore?: GameScore;
  blackName?: string;
  blackScore?: GameScore;
  plyCount?: number;
}
