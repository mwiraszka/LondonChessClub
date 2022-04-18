import { createReducer, on, Action } from '@ngrx/store';

import * as AlertActions from './alert.actions';
import { AlertAction } from '../types/alert-action.model';
import { AlertState } from '../types/alert.state';

const initialState: AlertState = {
  alert: {
    message: "Registration for this Thursday's Blitz tournament now open",
    action: AlertAction.REGISTER,
  },
};

const alertReducer = createReducer(
  initialState,
  on(AlertActions.actionTaken, () => ({ alert: null })),
  on(AlertActions.alertCreated, (state, action) => ({
    ...state,
    alert: action.alert,
  }))
);

export function reducer(state: AlertState, action: Action) {
  return alertReducer(state, action);
}
