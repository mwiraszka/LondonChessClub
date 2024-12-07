import { createFeatureSelector, createSelector } from '@ngrx/store';
import moment from 'moment-timezone';

import { Id, StoreFeatures } from '@app/types';
import { areSame, customSort } from '@app/utils';

import { EventsState } from './events.state';

export const eventsFeatureSelector = createFeatureSelector<EventsState>(
  StoreFeatures.EVENTS,
);

export const events = createSelector(eventsFeatureSelector, state => {
  return [...state.events].sort(customSort('eventDate', false));
});

export const eventById = (id: Id) =>
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

export const setEvent = createSelector(eventsFeatureSelector, state => state.setEvent);

export const setEventTitle = createSelector(setEvent, event => event?.title);

export const formEvent = createSelector(eventsFeatureSelector, state => state.formEvent);

export const controlMode = createSelector(
  eventsFeatureSelector,
  state => state.controlMode,
);

export const showPastEvents = createSelector(
  eventsFeatureSelector,
  state => state.showPastEvents,
);

export const hasUnsavedChanges = createSelector(
  eventsFeatureSelector,
  state => !areSame(state.formEvent, state.setEvent),
);
