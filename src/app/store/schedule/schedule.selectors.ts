import { createFeatureSelector, createSelector } from '@ngrx/store';
import moment from 'moment-timezone';

import { StoreFeatures } from '@app/types';
import { areSame, customSort } from '@app/utils';

import { ScheduleState } from './schedule.state';

export const scheduleFeatureSelector = createFeatureSelector<ScheduleState>(
  StoreFeatures.SCHEDULE,
);

export const events = createSelector(scheduleFeatureSelector, state => {
  return [...state.events].sort(customSort('eventDate', false));
});

export const eventById = (id: string) =>
  createSelector(events, allEvents => {
    return allEvents ? allEvents.find(event => event.id === id) : null;
  });

export const upcomingEvents = createSelector(events, allEvents => {
  return allEvents.filter(event =>
    moment(event.eventDate).add(3, 'hours').isAfter(moment()),
  );
});

export const nextEvent = createSelector(upcomingEvents, allUpcomingEvents => {
  return allUpcomingEvents.length > 0 ? allUpcomingEvents[0] : null;
});

export const setEvent = createSelector(scheduleFeatureSelector, state => state.setEvent);

export const setEventTitle = createSelector(setEvent, event => event?.title);

export const formEvent = createSelector(
  scheduleFeatureSelector,
  state => state.formEvent,
);

export const controlMode = createSelector(
  scheduleFeatureSelector,
  state => state.controlMode,
);

export const showPastEvents = createSelector(
  scheduleFeatureSelector,
  state => state.showPastEvents,
);

export const hasUnsavedChanges = createSelector(
  scheduleFeatureSelector,
  state => !areSame(state.formEvent, state.setEvent),
);
