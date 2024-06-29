import { Action, createReducer, on } from '@ngrx/store';

import { newClubEventFormTemplate } from '@app/types';
import { getUpcomingEvents } from '@app/utils';

import * as ScheduleActions from './schedule.actions';
import { ScheduleState, initialState } from './schedule.state';

const scheduleReducer = createReducer(
  initialState,

  on(ScheduleActions.setEvent, (state, { event, isEditMode }) => ({
    ...state,
    selectedEvent: event,
    eventCurrently: event,
    isEditMode,
  })),

  on(
    ScheduleActions.cancelSelected,
    ScheduleActions.fetchEventFailed,
    ScheduleActions.updateEventSucceeded,
    ScheduleActions.deleteEventFailed,
    ScheduleActions.deleteEventCancelled,
    state => ({
      ...state,
      selectedEvent: null,
      eventCurrently: null,
      isEditMode: null,
    }),
  ),

  on(ScheduleActions.addEventSucceeded, state => ({
    ...state,
    selectedEvent: newClubEventFormTemplate,
    eventCurrently: newClubEventFormTemplate,
  })),

  on(ScheduleActions.fetchEventsSucceeded, (state, { allEvents }) => {
    const upcomingEvents = getUpcomingEvents(allEvents, 1);
    const nextEvent = upcomingEvents.length ? upcomingEvents[0] : null;

    return {
      ...state,
      events: allEvents,
      nextEventId: nextEvent?.id ?? null,
    };
  }),

  on(ScheduleActions.fetchEventRequested, state => ({
    ...state,
    isEditMode: true,
  })),

  on(ScheduleActions.fetchEventSucceeded, (state, { event }) => ({
    ...state,
    events: [...state.events.filter(storedEvent => storedEvent.id !== event.id), event],
  })),

  on(ScheduleActions.deleteEventSelected, (state, { event }) => ({
    ...state,
    selectedEvent: event,
  })),

  on(ScheduleActions.deleteEventSucceeded, (state, { event }) => ({
    ...state,
    events: state.events.filter(storedEvent => storedEvent.id !== event.id),
    selectedEvent: null,
  })),

  on(ScheduleActions.formDataChanged, (state, { event }) => ({
    ...state,
    eventCurrently: event,
  })),

  on(ScheduleActions.togglePastEvents, (state, { showPastEvents }) => ({
    ...state,
    showPastEvents,
  })),
);

export function reducer(state: ScheduleState, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}
