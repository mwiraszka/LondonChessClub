import { mockPgns } from '@app/mocks/pgns';

import { getScore } from './get-score.util';

describe('getScore', () => {
  it('returns `undefined` if any of the arguments are `undefined`', () => {
    expect(getScore()).toBe(undefined);
    expect(getScore(mockPgns[0])).toBe(undefined);
    expect(getScore(undefined, 'White')).toBe(undefined);
  });

  it("returns the player's name if it can be found in the PGN", () => {
    expect(getScore(mockPgns[0], 'White')).toBe('1');
    expect(getScore(mockPgns[0], 'Black')).toBe('0');
    expect(getScore(mockPgns[1], 'White')).toBe('1/2');
    expect(getScore(mockPgns[1], 'Black')).toBe('1/2');
    expect(getScore(mockPgns[2], 'White')).toBe('0');
    expect(getScore(mockPgns[2], 'Black')).toBe('1');
    expect(getScore(mockPgns[3], 'White')).toBe('*');
    expect(getScore(mockPgns[3], 'Black')).toBe('*');
  });

  it('returns `undefined` if unable to parse the name', () => {
    expect(getScore(mockPgns[4], 'White')).toBe(undefined);
  });
});
