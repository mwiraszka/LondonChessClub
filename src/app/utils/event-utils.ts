import moment from 'moment-timezone';

import type { ClubEvent } from '@app/types';
import { setLocalTime } from '@app/utils/time-utils';

/**
 * Filters out a limited number of future events (using 9:00pm as the cut-off time) from
 * an array of sorted events
 *
 * @returns {ClubEvent[]} An array of upcoming club events
 */
export function getUpcomingEvents(
  sortedEvents: ClubEvent[],
  limit?: number,
): ClubEvent[] {
  const now = moment().tz('America/Toronto').format();

  const upcomingEvents = sortedEvents.filter(event => {
    const endOfEvent = setLocalTime(event.eventDate, '21:00');
    return moment(endOfEvent).isAfter(now);
  });

  if (!upcomingEvents.length || (limit && limit < 1)) {
    return [];
  }

  if (limit) {
    return upcomingEvents.slice(0, limit);
  }

  return upcomingEvents;
}
