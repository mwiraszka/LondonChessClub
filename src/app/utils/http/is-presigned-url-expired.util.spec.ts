import { isPresignedUrlExpired } from './is-presigned-url-expired.util';

describe('isPresignedUrlExpired', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Set current time to November 15, 2025, 12:00:00 UTC
    jest.setSystemTime(new Date('2025-11-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return null for null or undefined URLs', () => {
    expect(isPresignedUrlExpired(null)).toBeNull();
    expect(isPresignedUrlExpired(undefined)).toBeNull();
    expect(isPresignedUrlExpired('')).toBeNull();
  });

  it('should return null for non-AWS presigned URLs', () => {
    const regularUrl = 'https://example.com/image.jpg';
    expect(isPresignedUrlExpired(regularUrl)).toBeNull();
  });

  it('should return true for AWS presigned URLs >10 hours old', () => {
    // URL created on November 12, 2025 at 01:06:07 UTC (>10 hours ago)
    const expiredUrl =
      'https://lcc-image-storage.s3.us-east-2.amazonaws.com/image-thumb?' +
      'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
      'X-Amz-Date=20251112T010607Z&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(expiredUrl)).toBe(true);
  });

  it('should return false for AWS presigned URLs <10 hours old', () => {
    // URL created on November 15, 2025 at 10:00:00 UTC (only 2 hours ago)
    const recentUrl =
      'https://lcc-image-storage.s3.us-east-2.amazonaws.com/image-thumb?' +
      'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
      'X-Amz-Date=20251115T100000Z&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(recentUrl)).toBe(false);
  });

  it('should handle URLs exactly 10 hours old', () => {
    // URL created on November 15, 2025 at 02:00:00 UTC (exactly 10 hours ago)
    const tenHoursOldUrl =
      'https://s3.amazonaws.com/image-thumb?' +
      'X-Amz-Date=20251115T020000Z&' +
      'X-Amz-Expires=43200';

    // moment.isBefore() returns false for equal times, so URL is not expired yet
    expect(isPresignedUrlExpired(tenHoursOldUrl)).toBe(false);
  });

  it('should handle URLs just over 10 hours old', () => {
    // URL created on November 15, 2025 at 01:59:59 UTC (just over 10 hours ago)
    const justExpiredUrl =
      'https://s3.amazonaws.com/image-thumb?' +
      'X-Amz-Date=20251115T015959Z&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(justExpiredUrl)).toBe(true);
  });

  it('should still check expiry for URLs with X-Amz-Date but no explicit expiration info', () => {
    const urlWithoutExpires =
      'https://s3.amazonaws.com/image-thumb?' + 'X-Amz-Date=20251112T010607Z';

    // Still checks date even without explicit expiration param
    expect(isPresignedUrlExpired(urlWithoutExpires)).toBe(true);
  });

  it('should return null for URLs without X-Amz-Date', () => {
    const urlWithoutDate =
      'https://s3.amazonaws.com/image-thumb?' + 'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(urlWithoutDate)).toBeNull();
  });

  it('should return null for URLs with invalid date format', () => {
    const invalidDateUrl =
      'https://s3.amazonaws.com/image-thumb?' +
      'X-Amz-Date=invalid-date&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(invalidDateUrl)).toBeNull();
  });

  it('should return null for malformed URLs', () => {
    const malformedUrl = 'not-a-valid-url';
    expect(isPresignedUrlExpired(malformedUrl)).toBeNull();
  });

  it('should handle the actual expired URL from the issue', () => {
    const actualExpiredUrl =
      'https://lcc-image-storage.s3.us-east-2.amazonaws.com/3cdfee6bfb041036aaaabbbb-thumb?' +
      'X-Amz-Algorithm=AWS4-HMAC-SHA256&' +
      'X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&' +
      'X-Amz-Credential=AKIAT3GL3PMR76AA24NG%2F20251112%2Fus-east-2%2Fs3%2Faws4_request&' +
      'X-Amz-Date=20251112T010607Z&' +
      'X-Amz-Expires=43200&' +
      'X-Amz-Signature=f889831046f60a665bd8fd65b224b9093a5442e114fbd8235e8634297f9fc777&' +
      'X-Amz-SignedHeaders=host&' +
      'x-id=GetObject';

    expect(isPresignedUrlExpired(actualExpiredUrl)).toBe(true);
  });

  it('should return null for URLs with different date formats', () => {
    // Malformed date with wrong length
    const malformedDateUrl =
      'https://s3.amazonaws.com/image-thumb?' + 'X-Amz-Date=2025111201Z';

    expect(isPresignedUrlExpired(malformedDateUrl)).toBeNull();
  });

  it('should handle URLs created in the future', () => {
    // URL created in the future (November 16, 2025)
    const futureUrl =
      'https://s3.amazonaws.com/image-thumb?' +
      'X-Amz-Date=20251116T120000Z&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(futureUrl)).toBe(false);
  });

  it('should handle very old URLs', () => {
    // URL created a year ago
    const veryOldUrl =
      'https://s3.amazonaws.com/image-thumb?' +
      'X-Amz-Date=20241115T120000Z&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(veryOldUrl)).toBe(true);
  });

  it('should handle URLs with milliseconds precision', () => {
    // Standard AWS format doesn't include milliseconds, but test edge case
    const urlWithSeconds =
      'https://s3.amazonaws.com/image-thumb?' +
      'X-Amz-Date=20251115T100030Z&' +
      'X-Amz-Expires=43200';

    expect(isPresignedUrlExpired(urlWithSeconds)).toBe(false);
  });
});
