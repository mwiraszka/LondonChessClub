import { createAction, props } from '@ngrx/store';

import { ClubEvent } from '@app/types';

enum ScheduleActionTypes {
  LOAD_EVENTS_STARTED = '[Schedule] Load events started',
  LOAD_EVENTS_SUCCEEDED = '[Schedule] Load events succeeded',
  LOAD_EVENTS_FAILED = '[Schedule] Load events failed',

  CREATE_EVENT_SELECTED = '[Schedule] Create event selected',
  EDIT_EVENT_SELECTED = '[Schedule] Edit event selected',

  DELETE_EVENT_SELECTED = '[Schedule] Delete event selected',
  DELETE_EVENT_CONFIRMED = '[Schedule] Delete event confirmed',
  DELETE_EVENT_CANCELLED = '[Schedule] Delete event cancelled',
  DELETE_EVENT_SUCCEEDED = '[Schedule] Delete event succeeded',
  DELETE_EVENT_FAILED = '[Schedule] Delete event failed',

  EVENT_TO_EDIT_RECEIVED = '[Schedule] Event to edit received',
  GET_EVENT_TO_EDIT_SUCCEEDED = '[Schedule] Get event to edit succeeded',
  RESET_EVENT_FORM = '[Schedule] Reset event form',

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

  CANCEL_SELECTED = '[Schedule] Cancel selected',
  CANCEL_CONFIRMED = '[Schedule] Cancel confirmed',

  FORM_DATA_CHANGED = '[Schedule] Form data changed',
}

export const loadEventsStarted = createAction(ScheduleActionTypes.LOAD_EVENTS_STARTED);
export const loadEventsSucceeded = createAction(
  ScheduleActionTypes.LOAD_EVENTS_SUCCEEDED,
  props<{ allEvents: ClubEvent[] }>(),
);
export const loadEventsFailed = createAction(
  ScheduleActionTypes.LOAD_EVENTS_FAILED,
  props<{ error: Error }>(),
);

export const createEventSelected = createAction(
  ScheduleActionTypes.CREATE_EVENT_SELECTED,
);
export const editEventSelected = createAction(
  ScheduleActionTypes.EDIT_EVENT_SELECTED,
  props<{ eventToEdit: ClubEvent }>(),
);

export const deleteEventSelected = createAction(
  ScheduleActionTypes.DELETE_EVENT_SELECTED,
  props<{ eventToDelete: ClubEvent }>(),
);
export const deleteEventConfirmed = createAction(
  ScheduleActionTypes.DELETE_EVENT_CONFIRMED,
);
export const deleteEventCancelled = createAction(
  ScheduleActionTypes.DELETE_EVENT_CANCELLED,
);
export const deleteEventSucceeded = createAction(
  ScheduleActionTypes.DELETE_EVENT_SUCCEEDED,
  props<{ deletedEvent: ClubEvent }>(),
);
export const deleteEventFailed = createAction(
  ScheduleActionTypes.DELETE_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const getEventToEditSucceeded = createAction(
  ScheduleActionTypes.GET_EVENT_TO_EDIT_SUCCEEDED,
  props<{ eventToEdit: ClubEvent }>(),
);
export const resetEventForm = createAction(ScheduleActionTypes.RESET_EVENT_FORM);

export const addEventSelected = createAction(
  ScheduleActionTypes.ADD_EVENT_SELECTED,
  props<{ eventToAdd: ClubEvent }>(),
);
export const addEventConfirmed = createAction(ScheduleActionTypes.ADD_EVENT_CONFIRMED);
export const addEventCancelled = createAction(ScheduleActionTypes.ADD_EVENT_CANCELLED);
export const addEventSucceeded = createAction(
  ScheduleActionTypes.ADD_EVENT_SUCCEEDED,
  props<{ addedEvent: ClubEvent }>(),
);
export const addEventFailed = createAction(
  ScheduleActionTypes.ADD_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const updateEventSelected = createAction(
  ScheduleActionTypes.UPDATE_EVENT_SELECTED,
  props<{ eventToUpdate: ClubEvent }>(),
);
export const updateEventConfirmed = createAction(
  ScheduleActionTypes.UPDATE_EVENT_CONFIRMED,
);
export const updateEventCancelled = createAction(
  ScheduleActionTypes.UPDATE_EVENT_CANCELLED,
);
export const updateEventSucceeded = createAction(
  ScheduleActionTypes.UPDATE_EVENT_SUCCEEDED,
  props<{ updatedEvent: ClubEvent }>(),
);
export const updateEventFailed = createAction(
  ScheduleActionTypes.UPDATE_EVENT_FAILED,
  props<{ error: Error }>(),
);

export const cancelSelected = createAction(ScheduleActionTypes.CANCEL_SELECTED);
export const cancelConfirmed = createAction(ScheduleActionTypes.CANCEL_CONFIRMED);

export const formDataChanged = createAction(
  ScheduleActionTypes.FORM_DATA_CHANGED,
  props<{ event: ClubEvent }>(),
);
