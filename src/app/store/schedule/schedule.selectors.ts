import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AppStoreFeatureTypes, ClubEvent } from '@app/types';
import { areSame } from '@app/utils';

import { ScheduleState } from './schedule.state';

export const scheduleFeatureSelector = createFeatureSelector<ScheduleState>(
  AppStoreFeatureTypes.SCHEDULE
);

export const events = createSelector(scheduleFeatureSelector, (state) => state.events);

export const nextEvent = createSelector(scheduleFeatureSelector, (state) =>
  getNextEvent(state?.events)
);

export const selectedEvent = createSelector(
  scheduleFeatureSelector,
  (state) => state.selectedEvent
);

export const isLoading = createSelector(
  scheduleFeatureSelector,
  (state) => state.isLoading
);

export const eventBeforeEdit = createSelector(
  scheduleFeatureSelector,
  (state) => state.eventBeforeEdit
);

export const eventCurrently = createSelector(
  scheduleFeatureSelector,
  (state) => state.eventCurrently
);

export const isEditMode = createSelector(
  scheduleFeatureSelector,
  (state) => state.isEditMode
);

export const hasUnsavedChanges = createSelector(
  scheduleFeatureSelector,
  (state) => !areSame(state.eventCurrently, state.eventBeforeEdit)
);

function getNextEvent(events: ClubEvent[]): ClubEvent | null {
  for (let event of events) {
    // Since events are already sorted, find the first future date
    if (new Date(event.eventDate) >= new Date(Date.now())) {
      return event;
    }
  }
  return null;
}
