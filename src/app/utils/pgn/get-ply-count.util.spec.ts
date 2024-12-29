import { mockPgns } from '@app/mocks/pgns';

import { getPlyCount } from './get-ply-count.util';

describe('getPlyCount', () => {
  it('returns `undefined` if the PGN is `undefined`', () => {
    expect(getPlyCount()).toBe(undefined);
  });

  it("returns the player's name if it can be found in the PGN", () => {
    expect(getPlyCount(mockPgns[0])).toBe(57);
    expect(getPlyCount(mockPgns[1])).toBe(67);
    expect(getPlyCount(mockPgns[2])).toBe(108);
    expect(getPlyCount(mockPgns[3])).toBe(67);
  });

  it('returns `undefined` if unable to parse the ply count', () => {
    expect(getPlyCount(mockPgns[4])).toBe(undefined);
  });
});
