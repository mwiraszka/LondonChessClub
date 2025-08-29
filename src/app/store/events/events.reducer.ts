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
  callState: {
    status: 'idle',
    loadStart: null,
    error: null,
  },
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
      callState: {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      },
    }),
  ),

  on(
    EventsActions.fetchEventsFailed,
    EventsActions.fetchEventFailed,
    EventsActions.addEventFailed,
    EventsActions.updateEventFailed,
    EventsActions.deleteEventFailed,
    (state, { error }): EventsState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error,
      },
    }),
  ),

  on(EventsActions.fetchEventsSucceeded, (state, { events }): EventsState => {
    return eventsAdapter.setAll(
      events.map(event => ({
        event,
        formData: pick(event, EVENT_FORM_DATA_PROPERTIES),
      })),
      {
        ...state,
        callState: initialState.callState,
        lastFetch: new Date().toISOString(),
      },
    );
  }),

  on(EventsActions.fetchEventSucceeded, (state, { event }): EventsState => {
    const previousFormData = state.entities[event.id]?.formData;
    return eventsAdapter.upsertOne(
      {
        event,
        formData: previousFormData ?? pick(event, EVENT_FORM_DATA_PROPERTIES),
      },
      { ...state, callState: initialState.callState },
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
        {
          ...state,
          callState: initialState.callState,
          newEventFormData: INITIAL_EVENT_FORM_DATA,
          lastFetch: null,
        },
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
        {
          ...state,
          callState: initialState.callState,
          lastFetch: null,
        },
      ),
  ),

  on(
    EventsActions.deleteEventSucceeded,
    (state, { eventId }): EventsState =>
      eventsAdapter.removeOne(eventId, {
        ...state,
        callState: initialState.callState,
        lastFetch: null,
      }),
  ),

  on(
    EventsActions.requestTimedOut,
    (state): EventsState => ({
      ...state,
      callState: {
        status: 'error',
        loadStart: null,
        error: { name: 'LCCError', message: 'Request timed out' },
      },
    }),
  ),

  on(EventsActions.formDataChanged, (state, { eventId, formData }): EventsState => {
    const originalEvent = eventId ? state.entities[eventId] : null;

    if (!originalEvent) {
      return {
        ...state,
        newEventFormData: {
          ...state.newEventFormData,
          ...formData,
        },
      };
    }

    return eventsAdapter.upsertOne(
      {
        ...originalEvent,
        formData: {
          ...(originalEvent?.formData ?? INITIAL_EVENT_FORM_DATA),
          ...formData,
        },
      },
      state,
    );
  }),

  on(EventsActions.formDataRestored, (state, { eventId }): EventsState => {
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
