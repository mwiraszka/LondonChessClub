import { mockPgns } from '@app/mocks/pgns';

import { getPlayerName } from './get-player-name.util';

describe('getPlayerName', () => {
  it('returns `undefined` if any of the arguments are `undefined`', () => {
    expect(getPlayerName()).toBe(undefined);
    expect(getPlayerName(mockPgns[0])).toBe(undefined);
    expect(getPlayerName(mockPgns[0], 'first')).toBe(undefined);
    expect(getPlayerName(mockPgns[0], undefined, 'White')).toBe(undefined);
  });

  it("returns the player's name if it can be found in the PGN", () => {
    expect(getPlayerName(mockPgns[0], 'first', 'White')).toBe('J.');
    expect(getPlayerName(mockPgns[0], 'first', 'Black')).toBe('G.');
    expect(getPlayerName(mockPgns[0], 'last', 'White')).toBe('Whiteman');
    expect(getPlayerName(mockPgns[0], 'last', 'Black')).toBe('Blackley');
    expect(getPlayerName(mockPgns[0], 'full', 'White')).toBe('J. Whiteman');
    expect(getPlayerName(mockPgns[0], 'full', 'Black')).toBe('G. Blackley');
  });

  it('returns `undefined` if unable to parse the name', () => {
    expect(getPlayerName(mockPgns[4], 'full', 'White')).toBe(undefined);
  });
});
