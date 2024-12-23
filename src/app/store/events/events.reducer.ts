import { Action, createReducer, on } from '@ngrx/store';

import { EventFormData, newEventFormTemplate } from '@app/types';

import * as EventsActions from './events.actions';
import { EventsState, initialState } from './events.state';

const scheduleReducer = createReducer(
  initialState,

  on(
    EventsActions.fetchEventsSucceeded,
    (state, { events }): EventsState => ({
      ...state,
      events,
    }),
  ),

  on(
    EventsActions.fetchEventRequested,
    (state, { controlMode }): EventsState => ({
      ...state,
      controlMode,
    }),
  ),

  on(
    EventsActions.newEventFormTemplateLoaded,
    (state): EventsState => ({
      ...state,
      eventFormData: newEventFormTemplate,
    }),
  ),

  on(EventsActions.fetchEventSucceeded, (state, { event }): EventsState => {
    const { id, modificationInfo, ...eventFormData } = event;
    return {
      ...state,
      events: [
        ...state.events.map(storedEvent =>
          storedEvent.id === event.id ? event : storedEvent,
        ),
      ],
      event,
      eventFormData,
    };
  }),

  on(
    EventsActions.addEventSucceeded,
    EventsActions.updateEventSucceeded,
    (state, { event }): EventsState => ({
      ...state,
      events: [
        ...state.events.map(storedEvent =>
          storedEvent.id === event.id ? event : storedEvent,
        ),
      ],
      event: null,
      eventFormData: null,
    }),
  ),

  on(
    EventsActions.deleteEventSelected,
    (state, { event }): EventsState => ({
      ...state,
      event,
    }),
  ),

  on(
    EventsActions.deleteEventSucceeded,
    (state, { event }): EventsState => ({
      ...state,
      events: state.events.filter(storedEvent => storedEvent.id !== event.id),
      event: null,
      eventFormData: null,
    }),
  ),

  on(
    EventsActions.formValueChanged,
    (state, { value }): EventsState => ({
      ...state,
      eventFormData: value as Required<EventFormData>,
    }),
  ),

  on(
    EventsActions.eventUnset,
    (state): EventsState => ({
      ...state,
      event: null,
      eventFormData: null,
      controlMode: null,
    }),
  ),

  on(
    EventsActions.pastEventsToggled,
    (state): EventsState => ({
      ...state,
      showPastEvents: !state.showPastEvents,
    }),
  ),
);

export function reducer(state: EventsState, action: Action): EventsState {
  return scheduleReducer(state, action);
}
