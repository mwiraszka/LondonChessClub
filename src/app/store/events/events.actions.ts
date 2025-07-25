import { createAction, props } from '@ngrx/store';

import type { Event, EventFormData, Id, LccError } from '@app/models';

export const fetchEventsRequested = createAction('[Events] Fetch events requested');
export const fetchEventsSucceeded = createAction(
  '[Events] Fetch events succeeded',
  props<{ events: Event[] }>(),
);
export const fetchEventsFailed = createAction(
  '[Events] Fetch events failed',
  props<{ error: LccError }>(),
);

export const fetchEventRequested = createAction(
  '[Events] Fetch event requested',
  props<{ eventId: Id }>(),
);
export const fetchEventSucceeded = createAction(
  '[Events] Fetch event succeeded',
  props<{ event: Event }>(),
);
export const fetchEventFailed = createAction(
  '[Events] Fetch event failed',
  props<{ error: LccError }>(),
);

export const addAnEventSelected = createAction('[Events] Add an event selected');

export const addEventRequested = createAction('[Events] Add event requested');
export const addEventSucceeded = createAction(
  '[Events] Add event succeeded',
  props<{ event: Event }>(),
);
export const addEventFailed = createAction(
  '[Events] Add event failed',
  props<{ error: LccError }>(),
);

export const updateEventRequested = createAction(
  '[Events] Update event requested',
  props<{ eventId: Id }>(),
);
export const updateEventSucceeded = createAction(
  '[Events] Update event succeeded',
  props<{ event: Event; originalEventTitle: string }>(),
);
export const updateEventFailed = createAction(
  '[Events] Update event failed',
  props<{ error: LccError }>(),
);

export const deleteEventRequested = createAction(
  '[Events] Delete event requested',
  props<{ event: Event }>(),
);
export const deleteEventSucceeded = createAction(
  '[Events] Delete event succeeded',
  props<{ eventId: Id; eventTitle: string }>(),
);
export const deleteEventFailed = createAction(
  '[Events] Delete event failed',
  props<{ error: LccError }>(),
);

export const cancelSelected = createAction('[Events] Cancel selected');

export const formValueChanged = createAction(
  '[Events] Form value changed',
  props<{ eventId: Id | null; value: Partial<EventFormData> }>(),
);

export const eventFormDataReset = createAction(
  '[Events] Event form data reset',
  props<{ eventId: Id | null }>(),
);

export const pastEventsToggled = createAction('[Events] Past events toggled');
