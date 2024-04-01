import type { ClubEvent } from '@app/types';

/**
 * Filters out a limited number of future events from an array of sorted events
 *
 * @returns {ClubEvent[]} An array of upcoming club events
 */
export function getUpcomingEvents(
  sortedEvents: ClubEvent[],
  limit?: number,
): ClubEvent[] {
  const today = Date.now();
  const upcomingEvents = sortedEvents.filter(event => {
    const eventDateAsUtc = new Date(event.eventDate);
    return eventDateAsUtc.setDate(eventDateAsUtc.getDate() + 1) >= today;
  });

  if (!upcomingEvents.length || (limit && limit < 1)) {
    return [];
  }

  if (limit) {
    return upcomingEvents.slice(0, limit);
  }

  return upcomingEvents;
}

/**
 * @returns {boolean} Whether the event id is in a valid UUID format
 */
export function isValidEventId(eventId: string): boolean {
  const regExp = new RegExp(
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
  );
  return regExp.test(eventId);
}