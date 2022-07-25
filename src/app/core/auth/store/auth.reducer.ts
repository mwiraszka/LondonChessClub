import { createReducer, Action, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState } from './auth.state';

const initialState: AuthState = {
  user: null,
  cognitoUserSession: null,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSucceeded, (state, action) => ({
    ...state,
    user: action.user,
    cognitoUserSession: action.cognitoUserSession,
  })),
  on(AuthActions.logoutSucceeded, () => initialState),
  on(AuthActions.signUpSucceeded, (state, action) => ({
    ...state,
    user: action.user,
    cognitoUserSession: action.cognitoUserSession,
  }))
);

export function reducer(state: AuthState, action: Action) {
  return authReducer(state, action);
}
