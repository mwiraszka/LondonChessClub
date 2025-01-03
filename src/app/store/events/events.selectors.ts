import { createFeatureSelector, createSelector } from '@ngrx/store';
import moment from 'moment-timezone';

import { newEventFormTemplate } from '@app/components/event-form/new-event-form-template';
import { AuthSelectors } from '@app/store/auth';
import type { Id } from '@app/types';
import { areSame, customSort } from '@app/utils';

import { EventsState } from './events.state';

export const selectEventsState = createFeatureSelector<EventsState>('events');

export const selectEvents = createSelector(selectEventsState, state =>
  [...state.events].sort(customSort('eventDate')),
);

export const selectEventById = (id: Id) =>
  createSelector(selectEvents, allEvents =>
    allEvents ? allEvents.find(event => event.id === id) : null,
  );

export const selectEvent = createSelector(selectEventsState, state => state.event);

export const selectEventTitle = createSelector(selectEvent, event => event?.title);

export const selectEventFormData = createSelector(
  selectEventsState,
  state => state.eventFormData,
);

export const selectUpcomingEvents = createSelector(selectEvents, events =>
  events.filter(event => moment(event.eventDate).add(3, 'hours').isAfter(moment())),
);

export const selectNextEvent = createSelector(selectUpcomingEvents, upcomingEvents =>
  upcomingEvents.length > 0 ? upcomingEvents[0] : null,
);

export const selectControlMode = createSelector(
  selectEventsState,
  state => state.controlMode,
);

export const selectShowPastEvents = createSelector(
  selectEventsState,
  state => state.showPastEvents,
);

export const selectHasUnsavedChanges = createSelector(
  selectControlMode,
  selectEvent,
  selectEventFormData,
  (controlMode, event, eventFormData) => {
    if (controlMode === 'add') {
      return !areSame(eventFormData, newEventFormTemplate);
    }

    if (!event || !eventFormData) {
      return null;
    }

    const { id, modificationInfo, ...relevantPropertiesOfEvent } = event;
    return !areSame(relevantPropertiesOfEvent, eventFormData);
  },
);

export const selectEventEditorScreenViewModel = createSelector({
  eventTitle: selectEventTitle,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});

export const selectScheduleViewModel = createSelector({
  events: selectEvents,
  upcomingEvents: selectUpcomingEvents,
  nextEvent: selectNextEvent,
  showPastEvents: selectShowPastEvents,
  isAdmin: AuthSelectors.selectIsAdmin,
});

export const selectEventFormViewModel = createSelector({
  event: selectEvent,
  eventFormData: selectEventFormData,
  controlMode: selectControlMode,
  hasUnsavedChanges: selectHasUnsavedChanges,
});
