import { createReducer, Action } from '@ngrx/store';

import { AuthState } from '../types/auth.state';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = createReducer(initialState);

export function reducer(state: AuthState, action: Action) {
  return authReducer(state, action);
}
