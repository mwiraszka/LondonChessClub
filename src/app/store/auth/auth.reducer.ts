import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState, initialState } from './auth.state';

const authReducer = createReducer(
  initialState,

  on(AuthActions.loginSucceeded, (state, action) => ({
    ...state,
    user: action.user,
  })),

  on(AuthActions.logoutSucceeded, () => initialState),

  on(AuthActions.codeForPasswordChangeSucceeded, state => ({
    ...state,
    hasCode: false,
  })),

  on(AuthActions.codeForPasswordChangeFailed, state => ({
    ...state,
    hasCode: false,
  })),

  on(AuthActions.requestNewCodeSelected, state => ({
    ...state,
    hasCode: false,
  })),

  on(AuthActions.passwordChangeSucceeded, state => ({
    ...state,
    hasCode: false,
  })),
);

export function reducer(state: AuthState, action: Action): AuthState {
  return authReducer(state, action);
}
