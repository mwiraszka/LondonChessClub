import { StripMarkdownPipe } from './strip-markdown.pipe';

describe('StripMarkdownPipe', () => {
  const pipe = new StripMarkdownPipe();

  it('transforms `undefined` and string values correctly', () => {
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(' ')).toBe(' ');
    expect(pipe.transform('abc')).toBe('abc');

    expect(pipe.transform('|-')).toBe('-');
    expect(pipe.transform('|--')).toBe('');
    expect(pipe.transform('|---')).toBe('-');
    expect(pipe.transform('|--text|--')).toBe('text');

    expect(pipe.transform('&#39')).toBe('&#39');
    expect(pipe.transform('&#39;')).toBe("'");
    expect(pipe.transform('&#39;text&#39;')).toBe("'text'");

    expect(pipe.transform('&#39;text&#39; abc |--text|--')).toBe("'text' abc text");
  });
});
