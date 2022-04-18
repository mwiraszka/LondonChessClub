import { createReducer, Action, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState } from '../types/auth.state';

const initialState: AuthState = {
  user: null,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.logoutSelected, () => initialState)
);

export function reducer(state: AuthState, action: Action) {
  return authReducer(state, action);
}
