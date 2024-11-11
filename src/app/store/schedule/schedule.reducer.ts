import { Action, createReducer, on } from '@ngrx/store';

import { ControlModes, newClubEventFormTemplate } from '@app/types';
import { getUpcomingEvents } from '@app/utils';

import * as ScheduleActions from './schedule.actions';
import { ScheduleState, initialState } from './schedule.state';

const scheduleReducer = createReducer(
  initialState,

  on(ScheduleActions.setEvent, (state, { event, controlMode }) => ({
    ...state,
    selectedEvent: event,
    formEvent: event,
    controlMode,
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
      formEvent: null,
      controlMode: 'view' as ControlModes,
    }),
  ),

  on(ScheduleActions.addEventSucceeded, state => ({
    ...state,
    selectedEvent: newClubEventFormTemplate,
    formEvent: newClubEventFormTemplate,
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
    controlMode: 'edit' as ControlModes,
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
    formEvent: event,
  })),

  on(ScheduleActions.togglePastEvents, state => ({
    ...state,
    showPastEvents: !state.showPastEvents,
  })),
);

export function reducer(state: ScheduleState, action: Action): ScheduleState {
  return scheduleReducer(state, action);
}
