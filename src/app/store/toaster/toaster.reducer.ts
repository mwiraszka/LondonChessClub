import { createReducer, on, Action } from '@ngrx/store';

import * as ToasterActions from './toaster.actions';
import { initialState, ToasterState } from './toaster.state';

const toasterReducer = createReducer(
  initialState,
  on(ToasterActions.toastAdded, (state, action) => ({
    ...state,
    toasts: [...state.toasts.slice(-2), action.toast],
  })),
  on(ToasterActions.toastExpired, (state, action) => ({
    ...state,
    toasts: state.toasts.filter((toast) => toast !== action.toast),
  }))
);

export function reducer(state: ToasterState, action: Action) {
  return toasterReducer(state, action);
}