import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { pick } from 'lodash';

import { EVENT_FORM_DATA_PROPERTIES, INITIAL_EVENT_FORM_DATA } from '@app/constants';
import { CallState, Event, EventFormData, IsoDate } from '@app/models';
import { customSort } from '@app/utils';

import * as EventsActions from './events.actions';

export interface EventsState
  extends EntityState<{ event: Event; formData: EventFormData }> {
  callState: CallState;
  newEventFormData: EventFormData;
  showPastEvents: boolean;
  lastFetch: IsoDate | null;
}

export const eventsAdapter = createEntityAdapter<{
  event: Event;
  formData: EventFormData;
}>({
  selectId: ({ event }) => event.id,
  sortComparer: (a, b) => customSort(a, b, 'event.eventDate'),
});

export const initialState: EventsState = eventsAdapter.getInitialState({
  callState: 'idle',
  newEventFormData: INITIAL_EVENT_FORM_DATA,
  showPastEvents: false,
  lastFetch: null,
});

export const eventsReducer = createReducer(
  initialState,

  on(
    EventsActions.fetchEventsRequested,
    EventsActions.fetchEventRequested,
    EventsActions.addEventRequested,
    EventsActions.updateEventRequested,
    EventsActions.deleteEventRequested,
    (state): EventsState => ({
      ...state,
      callState: 'loading',
    }),
  ),

  on(
    EventsActions.fetchEventsFailed,
    EventsActions.fetchEventFailed,
    EventsActions.addEventFailed,
    EventsActions.updateEventFailed,
    EventsActions.deleteEventFailed,
    (state): EventsState => ({
      ...state,
      callState: 'error',
    }),
  ),

  on(EventsActions.fetchEventsSucceeded, (state, { events }): EventsState => {
    return eventsAdapter.setAll(
      events.map(event => ({
        event,
        formData: pick(event, EVENT_FORM_DATA_PROPERTIES),
      })),
      { ...state, callState: 'idle', lastFetch: new Date().toISOString() },
    );
  }),

  on(EventsActions.fetchEventSucceeded, (state, { event }): EventsState => {
    const previousFormData = state.entities[event.id]?.formData;
    return eventsAdapter.upsertOne(
      {
        event,
        formData: previousFormData ?? pick(event, EVENT_FORM_DATA_PROPERTIES),
      },
      { ...state, callState: 'idle' },
    );
  }),

  on(
    EventsActions.addEventSucceeded,
    (state, { event }): EventsState =>
      eventsAdapter.upsertOne(
        {
          event,
          formData: pick(event, EVENT_FORM_DATA_PROPERTIES),
        },
        { ...state, callState: 'idle', newEventFormData: INITIAL_EVENT_FORM_DATA },
      ),
  ),

  on(
    EventsActions.updateEventSucceeded,
    (state, { event }): EventsState =>
      eventsAdapter.upsertOne(
        {
          event,
          formData: pick(event, EVENT_FORM_DATA_PROPERTIES),
        },
        { ...state, callState: 'idle' },
      ),
  ),

  on(
    EventsActions.deleteEventSucceeded,
    (state, { eventId }): EventsState =>
      eventsAdapter.removeOne(eventId, { ...state, callState: 'idle' }),
  ),

  on(EventsActions.formValueChanged, (state, { eventId, value }): EventsState => {
    const originalEvent = eventId ? state.entities[eventId] : null;

    if (!originalEvent) {
      return {
        ...state,
        newEventFormData: {
          ...state.newEventFormData,
          ...value,
        },
      };
    }

    return eventsAdapter.upsertOne(
      {
        ...originalEvent,
        formData: {
          ...(originalEvent?.formData ?? INITIAL_EVENT_FORM_DATA),
          ...value,
        },
      },
      state,
    );
  }),

  on(EventsActions.eventFormDataReset, (state, { eventId }): EventsState => {
    const originalEvent = eventId ? state.entities[eventId]?.event : null;

    if (!originalEvent) {
      return {
        ...state,
        newEventFormData: INITIAL_EVENT_FORM_DATA,
      };
    }

    return eventsAdapter.upsertOne(
      {
        event: originalEvent,
        formData: pick(originalEvent, EVENT_FORM_DATA_PROPERTIES),
      },
      state,
    );
  }),

  on(
    EventsActions.pastEventsToggled,
    (state): EventsState => ({
      ...state,
      showPastEvents: !state.showPastEvents,
    }),
  ),
);
