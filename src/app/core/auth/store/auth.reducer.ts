import { createReducer, Action, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { AuthState } from '../types/auth.state';

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isAuthenticated: false,
  token: null,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.logoutSelected, () => initialState),
  on(AuthActions.signUpSucceeded, (state, action) => ({
    ...state,
    isLoggedIn: true,
    user: action.user,
  })),
  on(AuthActions.confirmSignUpSucceeded, (state, action) => ({
    ...state,
    isAuthenticated: true,
    token: action.token,
  }))
);

export function reducer(state: AuthState, action: Action) {
  return authReducer(state, action);
}
