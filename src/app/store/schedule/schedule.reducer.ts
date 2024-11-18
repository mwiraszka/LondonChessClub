import { Action, createReducer, on } from '@ngrx/store';

import { type ControlModes, newClubEventFormTemplate } from '@app/types';
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

  on(ScheduleActions.eventAddRequested, state => ({
    ...state,
    setEvent: newClubEventFormTemplate,
    formEvent: newClubEventFormTemplate,
    controlMode: 'add' as ControlModes,
  })),

  on(ScheduleActions.eventEditRequested, state => ({
    ...state,
    controlMode: 'edit' as ControlModes,
  })),

  on(ScheduleActions.eventSet, (state, { event }) => ({
    ...state,
    setEvent: event,
  })),

  on(ScheduleActions.eventUnset, state => ({
    ...state,
    setEvent: null,
    formEvent: null,
    controlMode: null,
  })),

  on(
    ScheduleActions.addEventSucceeded,
    ScheduleActions.updateEventSucceeded,
    (state, { event }) => ({
      ...state,
      events: [
        ...state.events.map(storedEvent =>
          storedEvent.id === event.id ? event : storedEvent,
        ),
      ],
      setEvent: null,
      formEvent: null,
    }),
  ),

  on(ScheduleActions.fetchEventSucceeded, (state, { event }) => ({
    ...state,
    events: [...state.events.filter(storedEvent => storedEvent.id !== event.id), event],
    setEvent: event,
    formEvent: state.controlMode === 'edit' ? event : null,
  })),

  on(ScheduleActions.deleteEventSelected, (state, { event }) => ({
    ...state,
    setEvent: event,
  })),

  on(ScheduleActions.deleteEventSucceeded, (state, { event }) => ({
    ...state,
    events: state.events.filter(storedEvent => storedEvent.id !== event.id),
    setEvent: null,
    formEvent: null,
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
