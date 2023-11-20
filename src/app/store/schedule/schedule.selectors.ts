import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes } from '@app/types';
import { areSame, getUpcomingEvents } from '@app/utils';

import { ScheduleState } from './schedule.state';

export const scheduleFeatureSelector = createFeatureSelector<ScheduleState>(
  AppStoreFeatureTypes.SCHEDULE,
);

export const events = createSelector(scheduleFeatureSelector, state => state.events);

export const upcomingEvent = createSelector(scheduleFeatureSelector, state => {
  const upcomingEvents = getUpcomingEvents(state?.events, 1);
  return upcomingEvents?.length ? upcomingEvents[0] : null;
});

export const selectedEvent = createSelector(
  scheduleFeatureSelector,
  state => state.selectedEvent,
);

export const isLoading = createSelector(
  scheduleFeatureSelector,
  state => state.isLoading,
);

export const eventBeforeEdit = createSelector(
  scheduleFeatureSelector,
  state => state.eventBeforeEdit,
);

export const eventCurrently = createSelector(
  scheduleFeatureSelector,
  state => state.eventCurrently,
);

export const isEditMode = createSelector(
  scheduleFeatureSelector,
  state => state.isEditMode,
);

export const nextEventId = createSelector(
  scheduleFeatureSelector,
  state => state.nextEventId,
);

export const hasUnsavedChanges = createSelector(
  scheduleFeatureSelector,
  state => !areSame(state.eventCurrently, state.eventBeforeEdit),
);
