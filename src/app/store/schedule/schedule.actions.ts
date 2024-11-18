import { createAction, props } from '@ngrx/store';

import type { ClubEvent } from '@app/types';

enum ScheduleActionTypes {
  FETCH_EVENTS_REQUESTED = '[Schedule] Fetch events requested',
  FETCH_EVENTS_SUCCEEDED = '[Schedule] Fetch events succeeded',
  FETCH_EVENTS_FAILED = '[Schedule] Fetch events failed',

  EVENT_ADD_REQUESTED = '[Schedule] Event add requested',
  EVENT_EDIT_REQUESTED = '[Schedule] Event edit requested',

  FETCH_EVENT_REQUESTED = '[Schedule] Fetch event requested',
  FETCH_EVENT_SUCCEEDED = '[Schedule] Fetch event succeeded',
  FETCH_EVENT_FAILED = '[Schedule] Fetch event failed',

  EVENT_SET = '[Schedule] Event set',
  EVENT_UNSET = '[Schedule] Event unset',

  ADD_EVENT_SELECTED = '[Schedule] Add event selected',
  ADD_EVENT_CONFIRMED = '[Schedule] Add event confirmed',
  ADD_EVENT_CANCELLED = '[Schedule] Add event cancelled',
  ADD_EVENT_SUCCEEDED = '[Schedule] Add event succeeded',
  ADD_EVENT_FAILED = '[Schedule] Add event failed',

  UPDATE_EVENT_SELECTED = '[Schedule] Update event selected',
  UPDATE_EVENT_CONFIRMED = '[Schedule] Update event confirmed',
  UPDATE_EVENT_CANCELLED = '[Schedule] Update event cancelled',
  UPDATE_EVENT_SUCCEEDED = '[Schedule] Update event succeeded',
  UPDATE_EVENT_FAILED = '[Schedule] Update event failed',

  DELETE_EVENT_SELECTED = '[Schedule] Delete event selected',
  DELETE_EVENT_CONFIRMED = '[Schedule] Delete event confirmed',
  DELETE_EVENT_CANCELLED = '[Schedule] Delete event cancelled',
  DELETE_EVENT_SUCCEEDED = '[Schedule] Delete event succeeded',
  DELETE_EVENT_FAILED = '[Schedule] Delete event failed',

  CANCEL_SELECTED = '[Schedule] Cancel selected',
  CANCEL_CONFIRMED = '[Schedule] Cancel confirmed',

  FORM_DATA_CHANGED = '[Schedule] Form data changed',

  TOGGLE_PAST_EVENTS = '[Schedule] Toggle past events',
}

export const fetchEventsRequested = createAction(
  ScheduleActionTypes.FETCH_EVENTS_REQUESTED,
);
export const fetchEventsSucceeded = createAction(
  ScheduleActionTypes.FETCH_EVENTS_SUCCEEDED,
  props<{ allEvents: ClubEvent[] }>(),
);
export const fetchEventsFailed = createAction(
  ScheduleActionTypes.FETCH_EVENTS_FAILED,
  props<{ error: Error }>(),
);

export const eventAddRequested = createAction(ScheduleActionTypes.EVENT_ADD_REQUESTED);
export const eventEditRequested = createAction(
  ScheduleActionTypes.EVENT_EDIT_REQUESTED,
  props<{ eventId: string }>(),
);

export const fetchEventRequested = createAction(
  ScheduleActionTypes.FETCH_EVENT_REQUESTED,
  props<{ eventId: string }>(),
);
export const fetchEventSucceeded = createAction(
  ScheduleActionTypes.FETCH_EVENT_SUCCEEDED,
  props<{ event: ClubEvent }>(),
);
export const fetchEventFailed = createAction(
  ScheduleActionTypes.FETCH_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const eventSet = createAction(
  ScheduleActionTypes.EVENT_SET,
  props<{ event: ClubEvent }>(),
);
export const eventUnset = createAction(ScheduleActionTypes.EVENT_UNSET);

export const addEventSelected = createAction(
  ScheduleActionTypes.ADD_EVENT_SELECTED,
  props<{ event: ClubEvent }>(),
);
export const addEventConfirmed = createAction(ScheduleActionTypes.ADD_EVENT_CONFIRMED);
export const addEventCancelled = createAction(ScheduleActionTypes.ADD_EVENT_CANCELLED);
export const addEventSucceeded = createAction(
  ScheduleActionTypes.ADD_EVENT_SUCCEEDED,
  props<{ event: ClubEvent }>(),
);
export const addEventFailed = createAction(
  ScheduleActionTypes.ADD_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const updateEventSelected = createAction(
  ScheduleActionTypes.UPDATE_EVENT_SELECTED,
  props<{ event: ClubEvent }>(),
);
export const updateEventConfirmed = createAction(
  ScheduleActionTypes.UPDATE_EVENT_CONFIRMED,
);
export const updateEventCancelled = createAction(
  ScheduleActionTypes.UPDATE_EVENT_CANCELLED,
);
export const updateEventSucceeded = createAction(
  ScheduleActionTypes.UPDATE_EVENT_SUCCEEDED,
  props<{ event: ClubEvent }>(),
);
export const updateEventFailed = createAction(
  ScheduleActionTypes.UPDATE_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const deleteEventSelected = createAction(
  ScheduleActionTypes.DELETE_EVENT_SELECTED,
  props<{ event: ClubEvent }>(),
);
export const deleteEventConfirmed = createAction(
  ScheduleActionTypes.DELETE_EVENT_CONFIRMED,
);
export const deleteEventCancelled = createAction(
  ScheduleActionTypes.DELETE_EVENT_CANCELLED,
);
export const deleteEventSucceeded = createAction(
  ScheduleActionTypes.DELETE_EVENT_SUCCEEDED,
  props<{ event: ClubEvent }>(),
);
export const deleteEventFailed = createAction(
  ScheduleActionTypes.DELETE_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const cancelSelected = createAction(ScheduleActionTypes.CANCEL_SELECTED);

export const formDataChanged = createAction(
  ScheduleActionTypes.FORM_DATA_CHANGED,
  props<{ event: ClubEvent }>(),
);

export const togglePastEvents = createAction(ScheduleActionTypes.TOGGLE_PAST_EVENTS);
