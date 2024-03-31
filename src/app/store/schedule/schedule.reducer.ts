import { Action, createReducer, on } from '@ngrx/store';

import { getUpcomingEvents } from '@app/utils';

import * as ScheduleActions from './schedule.actions';
import { ScheduleState, initialState } from './schedule.state';

const scheduleReducer = createReducer(
  initialState,

  on(ScheduleActions.fetchEventsSucceeded, (state, action) => {
    const upcomingEvents = getUpcomingEvents(action.allEvents, 1);
    const nextEvent = upcomingEvents.length ? upcomingEvents[0] : null;

    return {
      ...state,
      events: action.allEvents,
      nextEventId: nextEvent?.id ?? null,
    };
  }),

  on(ScheduleActions.addEventSelected, (state, action) => ({
    ...state,
    eventCurrently: action.eventToAdd,
  })),

  on(ScheduleActions.fetchEventForEventEditRouteSucceeded, (state, action) => ({
    ...state,
    selectedEvent: action.event,
    eventBeforeEdit: action.event,
    eventCurrently: action.event,
    isEditMode: true,
  })),

  on(ScheduleActions.updateEventSelected, (state, action) => ({
    ...state,
    eventCurrently: action.eventToUpdate,
  })),

  on(ScheduleActions.deleteEventSelected, (state, action) => ({
    ...state,
    selectedEvent: action.eventToDelete,
  })),

  on(ScheduleActions.deleteEventSucceeded, (state, action) => ({
    ...state,
    events: state.events.filter(event => event.id !== action.deletedEvent.id),
    selectedEvent: null,
  })),

  on(ScheduleActions.deleteEventFailed, state => ({
    ...state,
    selectedEvent: null,
  })),

  on(ScheduleActions.deleteEventCancelled, state => ({
    ...state,
    selectedEvent: null,
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

  on(ScheduleActions.formDataChanged, (state, action) => ({
    ...state,
    eventCurrently: action.event,
  })),
);

export function reducer(state: ScheduleState, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}
