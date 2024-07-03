import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';
import { areSame, getUpcomingEvents } from '@app/utils';

import { ScheduleState } from './schedule.state';

export const scheduleFeatureSelector = createFeatureSelector<ScheduleState>(
  AppStoreFeatureTypes.SCHEDULE
);

export const events = createSelector(scheduleFeatureSelector, (state) => state.events);

export const eventById = (id: string) =>
  createSelector(events, (allEvents) => {
    return allEvents ? allEvents.find((event) => event.id === id) : null;
  });

export const upcomingEvents = createSelector(scheduleFeatureSelector, (state) => {
  return getUpcomingEvents(state?.events);
});

export const upcomingEvent = createSelector(scheduleFeatureSelector, (state) => {
  const upcomingEvents = getUpcomingEvents(state?.events, 1);
  return upcomingEvents.length ? upcomingEvents[0] : null;
});

export const selectedEvent = createSelector(
  scheduleFeatureSelector,
  (state) => state.selectedEvent
);

export const selectedEventTitle = createSelector(selectedEvent, (event) => event?.title);

export const eventCurrently = createSelector(
  scheduleFeatureSelector,
  (state) => state.eventCurrently
);

export const isEditMode = createSelector(
  scheduleFeatureSelector,
  (state) => state.isEditMode
);

export const nextEventId = createSelector(
  scheduleFeatureSelector,
  (state) => state.nextEventId
);

export const showPastEvents = createSelector(
  scheduleFeatureSelector,
  (state) => state.showPastEvents
);

export const hasUnsavedChanges = createSelector(
  scheduleFeatureSelector,
  (state) => !areSame(state.eventCurrently, state.selectedEvent)
);
