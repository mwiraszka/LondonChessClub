import { createAction, props } from '@ngrx/store';

import { Alert } from '../../../types/alert.model';

enum AlertActionTypes {
  CREATED = '[Alert] Created',
  SEE_SCHEDULE_SELECTED = '[Alert] See schedule selected',
  DISMISSED = '[Alert] Dismissed',
  EXPIRED = '[Alert] Expired',
}

export const created = createAction(AlertActionTypes.CREATED, props<{ alert: Alert }>());

export const seeScheduleSelected = createAction(AlertActionTypes.SEE_SCHEDULE_SELECTED);

export const dismissed = createAction(AlertActionTypes.DISMISSED);

// WIP: Not implemented yet
export const expired = createAction(AlertActionTypes.EXPIRED);
