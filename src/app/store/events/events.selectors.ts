import { createFeatureSelector, createSelector } from '@ngrx/store';
import moment from 'moment-timezone';

import { newEventFormTemplate } from '@app/components/event-form/new-event-form-template';
import type { Id } from '@app/models';
import { AuthSelectors } from '@app/store/auth';
import { areSame } from '@app/utils';

import { EventsState, eventsAdapter } from './events.reducer';

const selectEventsState = createFeatureSelector<EventsState>('eventsState');

const { selectAll: selectAllEvents } = eventsAdapter.getSelectors(selectEventsState);

export const selectEventById = (id: Id) =>
  createSelector(selectAllEvents, allEvents =>
    allEvents ? allEvents.find(event => event.id === id) : null,
  );

export const selectEventId = createSelector(selectEventsState, state => state.eventId);

export const selectEvent = createSelector(
  selectAllEvents,
  selectEventId,
  (allEvents, eventId) =>
    eventId ? allEvents.find(event => event.id === eventId) : null,
);

export const selectEventTitle = createSelector(selectEvent, event => event?.title);

export const selectEventFormData = createSelector(
  selectEventsState,
  state => state.eventFormData,
);

export const selectUpcomingEvents = createSelector(selectAllEvents, allEvents =>
  allEvents.filter(event => moment(event.eventDate).add(3, 'hours').isAfter(moment())),
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
    if (!eventFormData) {
      return null;
    }

    if (controlMode === 'add') {
      return !areSame(eventFormData, newEventFormTemplate);
    }

    if (!event) {
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
  allEvents: selectAllEvents,
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
