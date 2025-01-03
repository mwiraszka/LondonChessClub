import { getNewPeakRating } from './get-new-peak-rating.util';

describe('getNewPeakRating', () => {
  it('returns an empty string if either rating is `undefined` or a non-numeric value', () => {
    expect(getNewPeakRating(undefined, '1000')).toBe('');
    expect(getNewPeakRating('1000', undefined)).toBe('');
    expect(getNewPeakRating(undefined, undefined)).toBe('');
    expect(getNewPeakRating('', '')).toBe('');
    expect(getNewPeakRating('abc', 'abc')).toBe('');
    expect(getNewPeakRating('1000/5', 'd/5')).toBe('');
    expect(getNewPeakRating('1000/a', '1000')).toBe('');
  });

  it('returns correct new peak rating', () => {
    expect(getNewPeakRating('1000', '1000')).toBe('1000');
    expect(getNewPeakRating('1000', '800')).toBe('1000');
    expect(getNewPeakRating('1000', '1200/5')).toBe('1000');
    expect(getNewPeakRating('1000/5', '1200/5')).toBe('1200/5');
    expect(getNewPeakRating('1000/5', '800/5')).toBe('1000/5');
  });
});
