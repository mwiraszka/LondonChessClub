import { createReducer, on, Action } from '@ngrx/store';

import { MOCK_EVENTS } from '@app/screens/schedule/mock-events';

import * as AlertActions from './alert.actions';
import { AlertAction } from '../types/alert-action.model';
import { AlertState } from '../types/alert.state';

const initialState: AlertState = {
  alert: {
    message: `Upcoming event: ${MOCK_EVENTS[0].title} on ${MOCK_EVENTS[0].date}`,
    action: AlertAction.SEE_SCHEDULE,
  },
};

const alertReducer = createReducer(
  initialState,
  on(AlertActions.created, (action) => ({ alert: action.alert })),
  on(AlertActions.seeScheduleSelected, () => ({ alert: null })),
  on(AlertActions.dismissed, () => ({ alert: null })),
  on(AlertActions.expired, () => ({ alert: null }))
);

export function reducer(state: AlertState, action: Action) {
  return alertReducer(state, action);
}
