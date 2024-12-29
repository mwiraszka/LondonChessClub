import { mockPgns } from '@app/mocks/pgns';

import { getLichessAnalysisUrl } from './get-lichess-analysis-url.util';

describe('getLichessAnalysisUrl', () => {
  it('returns `null` if the PGN is `undefined`', () => {
    expect(getLichessAnalysisUrl(undefined)).toBe(null);
  });

  it("returns the game's moves if the PGN contains at least one", () => {
    const urlWithMoves = `
      https://lichess.org/analysis/pgn/1. d4 e6 2. c4 f5 3. g3 Nf6 4. Bg2 d5 5. Nf3 c6 6. O-O Bd6
      7. b3 Qe7 8. Bb2 b6 9. Nbd2 O-O 10. Ne5 Bb7 11. Rc1 c5 12. dxc5 bxc5 13. cxd5 exd5 14. Ndc4
      dxc4 15. Bxb7 Bxe5 16. Bd5+ Nxd5 17. Qxd5+ Qf7 18. Qxa8 Bxb2 19. Rxc4 Nd7 20. Qxa7 Qd5 21.
      Qa5 Bd4 22. Rc2 f4 23. Qd2 f3 24. e3 Qf5 25. Kh1 Qh3 26. Rg1 Ne5 27. Rxc5 Ng4 28. Rh5 Qxh5
      29. h4 1-0
    `;
    expect(getLichessAnalysisUrl(mockPgns[0])).toBe(
      urlWithMoves.replaceAll('\n', ' ').replace(/\s+/g, ' ').trim(),
    );
  });

  it('returns `null` if the PGN does not contain any moves`', () => {
    expect(getLichessAnalysisUrl(mockPgns[4])).toBe(null);
  });
});
