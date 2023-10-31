import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from '../auth/auth.actions';
import * as NavActions from './nav.actions';
import { NavState, initialState } from './nav.state';

const navReducer = createReducer(
  initialState,
  on(NavActions.dropdownToggled, state => ({
    ...state,
    isDropdownOpen: !state.isDropdownOpen,
  })),
  on(NavActions.dropdownClosed, state => ({
    ...state,
    isDropdownOpen: false,
  })),
  on(AuthActions.logoutSucceeded, state => ({
    ...state,
    isDropdownOpen: false,
  })),
);

export function reducer(state: NavState, action: Action): NavState {
  return navReducer(state, action);
}
