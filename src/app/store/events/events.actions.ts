import { createAction, props } from '@ngrx/store';

import { HttpErrorResponse } from '@angular/common/http';

import type { ControlMode, Event, EventFormData, Id } from '@app/types';

export const fetchEventsRequested = createAction('[Events] Fetch events requested');
export const fetchEventsSucceeded = createAction(
  '[Events] Fetch events succeeded',
  props<{ events: Event[] }>(),
);
export const fetchEventsFailed = createAction(
  '[Events] Fetch events failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const fetchEventRequested = createAction(
  '[Events] Fetch event requested',
  props<{ controlMode: ControlMode; eventId?: Id }>(),
);
export const newEventFormTemplateLoaded = createAction(
  '[Events] New event form template loaded',
);
export const fetchEventSucceeded = createAction(
  '[Events] Fetch event succeeded',
  props<{ event: Event }>(),
);
export const fetchEventFailed = createAction(
  '[Events] Fetch event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const addEventSelected = createAction(
  '[Events] Add event selected',
  props<{ eventTitle: string }>(),
);
export const addEventConfirmed = createAction('[Events] Add event confirmed');
export const addEventCancelled = createAction('[Events] Add event cancelled');
export const addEventSucceeded = createAction(
  '[Events] Add event succeeded',
  props<{ event: Event }>(),
);
export const addEventFailed = createAction(
  '[Events] Add event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const updateEventSelected = createAction(
  '[Events] Update event selected',
  props<{ eventTitle: string }>(),
);
export const updateEventConfirmed = createAction('[Events] Update event confirmed');
export const updateEventCancelled = createAction('[Events] Update event cancelled');
export const updateEventSucceeded = createAction(
  '[Events] Update event succeeded',
  props<{ event: Event }>(),
);
export const updateEventFailed = createAction(
  '[Events] Update event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const deleteEventSelected = createAction(
  '[Events] Delete event selected',
  props<{ event: Event }>(),
);
export const deleteEventConfirmed = createAction('[Events] Delete event confirmed');
export const deleteEventCancelled = createAction('[Events] Delete event cancelled');
export const deleteEventSucceeded = createAction(
  '[Events] Delete event succeeded',
  props<{ event: Event }>(),
);
export const deleteEventFailed = createAction(
  '[Events] Delete event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const cancelSelected = createAction('[Events] Cancel selected');

export const formValueChanged = createAction(
  '[Events] Form value changed',
  props<{ value: Partial<EventFormData> }>(),
);

export const eventUnset = createAction('[Events] Event unset');

export const pastEventsToggled = createAction('[Events] Past events toggled');
