import { customSort } from './general-utils';

describe('customSort', () => {
  describe('should correctly sort based on values and their types', () => {
    it('numbers', () => {
      const a = { prop: 4 };
      const b = { prop: 6 };
      const c = { prop: 2 };

      const result = [a, b, c].sort(customSort('prop'));
      expect(result).toEqual([c, a, b]);
    });

    it('strings', () => {
      const a = { prop: 'abc' };
      const b = { prop: 'xyz' };
      const c = { prop: 'def' };

      const result = [a, b, c].sort(customSort('prop'));
      expect(result).toEqual([a, c, b]);
    });
  });
});
