import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import type { ControlMode, Event, EventFormData, Id } from '@app/models';
import { customSort } from '@app/utils';

import * as EventsActions from './events.actions';

export interface EventsState extends EntityState<Event> {
  eventId: Id | null;
  eventFormData: EventFormData | null;
  controlMode: ControlMode | null;
  showPastEvents: boolean;
}

export const eventsAdapter = createEntityAdapter<Event>({
  sortComparer: (a, b) => customSort(a, b, 'eventDate'),
});

export const eventsInitialState: EventsState = eventsAdapter.getInitialState({
  eventId: null,
  eventFormData: null,
  controlMode: null,
  showPastEvents: false,
});

export const eventsReducer = createReducer(
  eventsInitialState,

  on(
    EventsActions.fetchEventsSucceeded,
    (state, { events }): EventsState => eventsAdapter.addMany(events, state),
  ),

  on(
    EventsActions.newEventRequested,
    (state): EventsState => ({
      ...state,
      controlMode: 'add',
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
    EventsActions.fetchEventSucceeded,
    (state, { event }): EventsState =>
      eventsAdapter.upsertOne(event, { ...state, eventId: event.id }),
  ),

  on(
    EventsActions.addEventSucceeded,
    EventsActions.updateEventSucceeded,
    (state, { event }): EventsState =>
      eventsAdapter.upsertOne(event, { ...state, eventId: null, eventFormData: null }),
  ),

  on(
    EventsActions.deleteEventSucceeded,
    (state, { event }): EventsState =>
      eventsAdapter.removeOne(event.id!, {
        ...state,
        eventId: null,
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
      eventId: null,
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
