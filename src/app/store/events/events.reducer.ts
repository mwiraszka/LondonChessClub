import { Action, createReducer, on } from '@ngrx/store';

import { type ControlModes, newEventFormTemplate } from '@app/types';

import * as EventsActions from './events.actions';
import { EventsState, initialState } from './events.state';

const scheduleReducer = createReducer(
  initialState,

  on(EventsActions.fetchEventsSucceeded, (state, { events }) => ({
    ...state,
    events,
  })),

  on(EventsActions.eventAddRequested, state => ({
    ...state,
    setEvent: newEventFormTemplate,
    formEvent: newEventFormTemplate,
    controlMode: 'add' as ControlModes,
  })),

  on(EventsActions.eventEditRequested, state => ({
    ...state,
    controlMode: 'edit' as ControlModes,
  })),

  on(EventsActions.eventSet, (state, { event }) => ({
    ...state,
    setEvent: event,
  })),

  on(EventsActions.eventUnset, state => ({
    ...state,
    setEvent: null,
    formEvent: null,
    controlMode: null,
  })),

  on(
    EventsActions.addEventSucceeded,
    EventsActions.updateEventSucceeded,
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

  on(EventsActions.fetchEventSucceeded, (state, { event }) => ({
    ...state,
    events: [...state.events.filter(storedEvent => storedEvent.id !== event.id), event],
    setEvent: event,
    formEvent: state.controlMode === 'edit' ? event : null,
  })),

  on(EventsActions.deleteEventSelected, (state, { event }) => ({
    ...state,
    setEvent: event,
  })),

  on(EventsActions.deleteEventSucceeded, (state, { event }) => ({
    ...state,
    events: state.events.filter(storedEvent => storedEvent.id !== event.id),
    setEvent: null,
    formEvent: null,
  })),

  on(EventsActions.formDataChanged, (state, { event }) => ({
    ...state,
    formEvent: event,
  })),

  on(EventsActions.togglePastEvents, state => ({
    ...state,
    showPastEvents: !state.showPastEvents,
  })),
);

export function reducer(state: EventsState, action: Action): EventsState {
  return scheduleReducer(state, action);
}
