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

export const newEventRequested = createAction('[Events] New event requested');
export const fetchEventRequested = createAction(
  '[Events] Fetch event requested',
  props<{ controlMode: ControlMode; eventId: Id }>(),
);
export const fetchEventSucceeded = createAction(
  '[Events] Fetch event succeeded',
  props<{ event: Event }>(),
);
export const fetchEventFailed = createAction(
  '[Events] Fetch event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const addEventRequested = createAction('[Events] Add event requested');
export const addEventSucceeded = createAction(
  '[Events] Add event succeeded',
  props<{ event: Event }>(),
);
export const addEventFailed = createAction(
  '[Events] Add event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const updateEventRequested = createAction('[Events] Update event requested');
export const updateEventSucceeded = createAction(
  '[Events] Update event succeeded',
  props<{ event: Event; originalEventTitle: string }>(),
);
export const updateEventFailed = createAction(
  '[Events] Update event failed',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const deleteEventRequested = createAction(
  '[Events] Delete event requested',
  props<{ event: Event }>(),
);
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
