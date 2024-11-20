import moment from 'moment-timezone';

import type { ClubEvent } from '@app/types';

/**
 * Filter some number of future events from an array of sorted events;
 * assume each event lasts 3 hours
 *
 * @returns {ClubEvent[]} An array of upcoming club events
 */
export function getUpcomingEvents(
  sortedEvents: ClubEvent[],
  limit?: number,
): ClubEvent[] {
  const upcomingEvents = sortedEvents.filter(event =>
    moment(event.eventDate).add(3, 'hours').isAfter(moment()),
  );

  if (!upcomingEvents.length || (limit && limit < 1)) {
    return [];
  }
  return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
}
