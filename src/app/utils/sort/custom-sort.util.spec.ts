import { customSort } from './custom-sort.util';

describe('customSort', () => {
  it('should handle `undefined` and `null` correctly', () => {
    const result = [undefined, null, null].sort(customSort('key'));
    expect(result).toEqual([null, null, undefined]);
  });

  describe('should sort correctly based on types:', () => {
    it('number', () => {
      const a = { key: 4 };
      const b = { key: 6 };
      const c = { key: 2 };

      const result = [a, b, c].sort(customSort('key'));
      expect(result).toEqual([c, a, b]);
    });

    it('string', () => {
      const a = { key: 'abc' };
      const b = { key: 'xyz' };
      const c = { key: 'def' };

      const result = [a, b, c].sort(customSort('key'));
      expect(result).toEqual([a, c, b]);
    });

    it('boolean', () => {
      const a = { key: false };
      const b = { key: false };
      const c = { key: true };

      const result = [a, b, c].sort(customSort('key'));
      expect(result).toEqual([c, a, b]);
    });

    it('null', () => {
      const a = { key: null };
      const b = { key: null };
      const c = { key: null };

      const result = [a, b, c].sort(customSort('key'));
      expect(result).toEqual([a, b, c]);
    });

    it('undefined', () => {
      const a = { key: undefined };
      const b = { key: undefined };
      const c = { key: undefined };

      const result = [a, b, c].sort(customSort('key'));
      expect(result).toEqual([a, b, c]);
    });

    it('empty object', () => {
      const a = {};
      const b = {};
      const c = {};

      const result = [a, b, c].sort(customSort('key'));
      expect(result).toEqual([a, b, c]);
    });

    it('nested object', () => {
      const a = { outerKey: { innerKey: '3' } };
      const b = { outerKey: { innerKey: '5' } };
      const c = { outerKey: { innerKey: '1' } };

      const result = [a, b, c].sort(customSort('outerKey.innerKey'));
      expect(result).toEqual([c, a, b]);
    });

    it('deep-nested object', () => {
      const a = { outerKey: { innerKey: '3', x: null } };
      const b = { outerKey: { innerKey: '5', x: 'value' } };
      const c = { outerKey: { innerKey: '1', x: undefined } };

      const result = [a, b, c].sort(customSort('outerKey.innerKey.x'));
      expect(result).toEqual([c, a, b]);
    });
  });
});
