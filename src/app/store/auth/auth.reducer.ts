import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState, initialState } from './auth.state';

const authReducer = createReducer(
  initialState,

  on(AuthActions.loginSucceeded, (state, { user }) => ({
    ...state,
    user,
    tempInitialPassword: null,
  })),

  on(AuthActions.logoutSucceeded, () => initialState),

  on(AuthActions.codeForPasswordChangeSucceeded, (state) => ({
    ...state,
    hasCode: true,
  })),

  on(AuthActions.codeForPasswordChangeFailed, (state) => ({
    ...state,
    hasCode: false,
  })),

  on(AuthActions.requestNewCodeSelected, (state) => ({
    ...state,
    hasCode: false,
  })),

  on(
    AuthActions.newPasswordChallengeRequested,
    (state, { tempInitialPassword, user }) => ({
      ...state,
      user,
      tempInitialPassword,
    }),
  ),

  on(AuthActions.passwordChangeSucceeded, (state) => ({
    ...state,
    hasCode: false,
  })),
);

export function reducer(state: AuthState, action: Action): AuthState {
  return authReducer(state, action);
}
