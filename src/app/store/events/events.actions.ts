import { createAction, props } from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';

import type { Event, Id } from '@app/types';

enum EventsActionTypes {
  FETCH_EVENTS_REQUESTED = '[Events] Fetch events requested',
  FETCH_EVENTS_SUCCEEDED = '[Events] Fetch events succeeded',
  FETCH_EVENTS_FAILED = '[Events] Fetch events failed',

  EVENT_ADD_REQUESTED = '[Events] Event add requested',
  EVENT_EDIT_REQUESTED = '[Events] Event edit requested',

  FETCH_EVENT_REQUESTED = '[Events] Fetch event requested',
  FETCH_EVENT_SUCCEEDED = '[Events] Fetch event succeeded',
  FETCH_EVENT_FAILED = '[Events] Fetch event failed',

  EVENT_SET = '[Events] Event set',
  EVENT_UNSET = '[Events] Event unset',

  ADD_EVENT_SELECTED = '[Events] Add event selected',
  ADD_EVENT_CONFIRMED = '[Events] Add event confirmed',
  ADD_EVENT_CANCELLED = '[Events] Add event cancelled',
  ADD_EVENT_SUCCEEDED = '[Events] Add event succeeded',
  ADD_EVENT_FAILED = '[Events] Add event failed',

  UPDATE_EVENT_SELECTED = '[Events] Update event selected',
  UPDATE_EVENT_CONFIRMED = '[Events] Update event confirmed',
  UPDATE_EVENT_CANCELLED = '[Events] Update event cancelled',
  UPDATE_EVENT_SUCCEEDED = '[Events] Update event succeeded',
  UPDATE_EVENT_FAILED = '[Events] Update event failed',

  DELETE_EVENT_SELECTED = '[Events] Delete event selected',
  DELETE_EVENT_CONFIRMED = '[Events] Delete event confirmed',
  DELETE_EVENT_CANCELLED = '[Events] Delete event cancelled',
  DELETE_EVENT_SUCCEEDED = '[Events] Delete event succeeded',
  DELETE_EVENT_FAILED = '[Events] Delete event failed',

  CANCEL_SELECTED = '[Events] Cancel selected',
  CANCEL_CONFIRMED = '[Events] Cancel confirmed',

  FORM_DATA_CHANGED = '[Events] Form data changed',

  TOGGLE_PAST_EVENTS = '[Events] Toggle past events',
}

export const fetchEventsRequested = createAction(
  EventsActionTypes.FETCH_EVENTS_REQUESTED,
);
export const fetchEventsSucceeded = createAction(
  EventsActionTypes.FETCH_EVENTS_SUCCEEDED,
  props<{ events: Event[] }>(),
);
export const fetchEventsFailed = createAction(
  EventsActionTypes.FETCH_EVENTS_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const eventAddRequested = createAction(EventsActionTypes.EVENT_ADD_REQUESTED);
export const eventEditRequested = createAction(
  EventsActionTypes.EVENT_EDIT_REQUESTED,
  props<{ eventId: Id }>(),
);

export const fetchEventRequested = createAction(
  EventsActionTypes.FETCH_EVENT_REQUESTED,
  props<{ eventId: Id }>(),
);
export const fetchEventSucceeded = createAction(
  EventsActionTypes.FETCH_EVENT_SUCCEEDED,
  props<{ event: Event }>(),
);
export const fetchEventFailed = createAction(
  EventsActionTypes.FETCH_EVENT_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const eventSet = createAction(
  EventsActionTypes.EVENT_SET,
  props<{ event: Event }>(),
);
export const eventUnset = createAction(EventsActionTypes.EVENT_UNSET);

export const addEventSelected = createAction(
  EventsActionTypes.ADD_EVENT_SELECTED,
  props<{ event: Event }>(),
);
export const addEventConfirmed = createAction(EventsActionTypes.ADD_EVENT_CONFIRMED);
export const addEventCancelled = createAction(EventsActionTypes.ADD_EVENT_CANCELLED);
export const addEventSucceeded = createAction(
  EventsActionTypes.ADD_EVENT_SUCCEEDED,
  props<{ event: Event }>(),
);
export const addEventFailed = createAction(
  EventsActionTypes.ADD_EVENT_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const updateEventSelected = createAction(
  EventsActionTypes.UPDATE_EVENT_SELECTED,
  props<{ event: Event }>(),
);
export const updateEventConfirmed = createAction(
  EventsActionTypes.UPDATE_EVENT_CONFIRMED,
);
export const updateEventCancelled = createAction(
  EventsActionTypes.UPDATE_EVENT_CANCELLED,
);
export const updateEventSucceeded = createAction(
  EventsActionTypes.UPDATE_EVENT_SUCCEEDED,
  props<{ event: Event }>(),
);
export const updateEventFailed = createAction(
  EventsActionTypes.UPDATE_EVENT_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const deleteEventSelected = createAction(
  EventsActionTypes.DELETE_EVENT_SELECTED,
  props<{ event: Event }>(),
);
export const deleteEventConfirmed = createAction(
  EventsActionTypes.DELETE_EVENT_CONFIRMED,
);
export const deleteEventCancelled = createAction(
  EventsActionTypes.DELETE_EVENT_CANCELLED,
);
export const deleteEventSucceeded = createAction(
  EventsActionTypes.DELETE_EVENT_SUCCEEDED,
  props<{ event: Event }>(),
);
export const deleteEventFailed = createAction(
  EventsActionTypes.DELETE_EVENT_FAILED,
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const cancelSelected = createAction(EventsActionTypes.CANCEL_SELECTED);

export const formDataChanged = createAction(
  EventsActionTypes.FORM_DATA_CHANGED,
  props<{ event: Event }>(),
);

export const togglePastEvents = createAction(EventsActionTypes.TOGGLE_PAST_EVENTS);
