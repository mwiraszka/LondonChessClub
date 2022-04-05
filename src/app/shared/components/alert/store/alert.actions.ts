import { createAction, props } from '@ngrx/store';

import { AlertAction } from '../types/alert-action.model';
import { Alert } from '../types/alert.model';

enum AlertActionTypes {
  ALERT_CREATED = '[Alert] Alert created',
  ACTION_TAKEN = '[Alert] Action taken',
  ALERT_EXPIRED = '[Alert] Alert expired',
}

export const alertCreated = createAction(
  AlertActionTypes.ALERT_CREATED,
  props<{ alert: Alert }>()
);

export const actionTaken = createAction(
  AlertActionTypes.ACTION_TAKEN,
  props<{ action: AlertAction }>()
);

export const alertExpired = createAction(AlertActionTypes.ALERT_EXPIRED);
