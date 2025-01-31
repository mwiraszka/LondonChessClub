import { isValidCollectionId } from './is-valid-collection-id.util';

describe('isValidCollectionId', () => {
  it('transforms values correctly', () => {
    expect(isValidCollectionId(undefined)).toBe(false);
    expect(isValidCollectionId(null)).toBe(false);
    expect(isValidCollectionId(true)).toBe(false);
    expect(isValidCollectionId(false)).toBe(false);
    expect(isValidCollectionId({})).toBe(false);
    expect(isValidCollectionId(15)).toBe(false);
    expect(isValidCollectionId(new Date())).toBe(false);

    expect(isValidCollectionId('')).toBe(false);
    expect(isValidCollectionId(' ')).toBe(false);
    expect(isValidCollectionId('abc')).toBe(false);
    expect(isValidCollectionId('123')).toBe(false);
    expect(isValidCollectionId('!?')).toBe(false);
    expect(isValidCollectionId('#d$E*__f')).toBe(false);
    expect(isValidCollectionId('abcd abcd abcd abcd abcd abcd')).toBe(false);
    expect(isValidCollectionId('12345678901234567890123')).toBe(false);
    expect(isValidCollectionId('1234567890123456789012345')).toBe(false);

    expect(isValidCollectionId('12345678901234567890123x')).toBe(false);
    expect(isValidCollectionId('12345678901234$678901234')).toBe(false);
    expect(isValidCollectionId('A23456789012345678901234')).toBe(false);
    expect(isValidCollectionId(' 23456789012345678901234')).toBe(false);

    expect(isValidCollectionId('123456789012345678901234')).toBe(true);
    expect(isValidCollectionId('12345678901234b678901234')).toBe(true);
    expect(isValidCollectionId('a23456789012345678901234')).toBe(true);
  });
});
