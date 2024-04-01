import { Action, createReducer, on } from '@ngrx/store';

import { getUpcomingEvents } from '@app/utils';

import * as ScheduleActions from './schedule.actions';
import { ScheduleState, initialState } from './schedule.state';

const scheduleReducer = createReducer(
  initialState,

  on(ScheduleActions.fetchEventsSucceeded, (state, { allEvents }) => {
    const upcomingEvents = getUpcomingEvents(allEvents, 1);
    const nextEvent = upcomingEvents.length ? upcomingEvents[0] : null;

    return {
      ...state,
      events: allEvents,
      nextEventId: nextEvent?.id ?? null,
    };
  }),

  on(ScheduleActions.fetchEventForEditScreenSucceeded, (state, { event }) => ({
    ...state,
    events: [...state.events.filter(storedEvent => storedEvent.id !== event.id), event],
  })),

  on(ScheduleActions.eventSetForEditing, (state, { event }) => ({
    ...state,
    selectedEvent: event,
    eventBeforeEdit: event,
    eventCurrently: event,
    isEditMode: true,
  })),

  on(ScheduleActions.addEventSelected, (state, { eventToAdd }) => ({
    ...state,
    eventCurrently: eventToAdd,
  })),

  on(ScheduleActions.updateEventSelected, (state, { eventToUpdate }) => ({
    ...state,
    eventCurrently: eventToUpdate,
  })),

  on(ScheduleActions.deleteEventSelected, (state, { eventToDelete }) => ({
    ...state,
    selectedEvent: eventToDelete,
  })),

  on(ScheduleActions.deleteEventSucceeded, (state, { deletedEvent }) => ({
    ...state,
    events: state.events.filter(event => event.id !== deletedEvent.id),
    selectedEvent: null,
  })),

  on(ScheduleActions.deleteEventFailed, ScheduleActions.deleteEventCancelled, state => ({
    ...state,
    selectedEvent: null,
  })),

  on(ScheduleActions.deleteEventCancelled, state => ({
    ...state,
    selectedEventId: null,
  })),

  on(
    ScheduleActions.resetEventForm,
    ScheduleActions.addEventSucceeded,
    ScheduleActions.addEventFailed,
    ScheduleActions.updateEventSucceeded,
    ScheduleActions.updateEventFailed,
    ScheduleActions.cancelConfirmed,
    state => ({
      ...state,
      eventBeforeEdit: initialState.eventBeforeEdit,
      eventCurrently: initialState.eventCurrently,
      isEditMode: false,
    }),
  ),

  on(ScheduleActions.formDataChanged, (state, { event }) => ({
    ...state,
    eventCurrently: event,
  })),
);

export function reducer(state: ScheduleState, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}
