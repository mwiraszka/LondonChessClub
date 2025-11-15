import moment from 'moment-timezone';

import { Url } from '@app/models';

/**
 * Check if an AWS presigned URL has expired or is near expiry (>10 hours old)
 * by parsing the X-Amz-Date parameter in the URL.
 *
 * @param url The URL to check
 * @returns true if the URL is an AWS presigned URL created >10 hours ago,
 * false if not expired, null if invalid in any way
 */
export function isPresignedUrlExpired(url?: Url | null): boolean | null {
  if (!url) {
    return null;
  }

  try {
    const urlObj = new URL(url);
    const amzDate = urlObj.searchParams.get('X-Amz-Date');

    if (!amzDate) {
      return null;
    }

    // Parse AWS date format: YYYYMMDDTHHMMSSZ
    const year = amzDate.substring(0, 4);
    const month = amzDate.substring(4, 6);
    const day = amzDate.substring(6, 8);
    const hour = amzDate.substring(9, 11);
    const minute = amzDate.substring(11, 13);
    const second = amzDate.substring(13, 15);

    const dateString = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    const urlCreatedAt = moment.utc(dateString);

    if (!urlCreatedAt.isValid()) {
      return null;
    }

    const tenHoursAgo = moment.utc().subtract(10, 'hours');
    return urlCreatedAt.isBefore(tenHoursAgo);
  } catch {
    return null;
  }
}
