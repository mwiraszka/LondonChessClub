import { createReducer, Action, on } from '@ngrx/store';

import * as NavActions from './nav.actions';
import { NavState } from './nav.state';

const initialState: NavState = {
  isDropdownOpen: false,
};

const navReducer = createReducer(
  initialState,
  on(NavActions.dropdownToggled, (state) => ({
    ...state,
    isDropdownOpen: !state.isDropdownOpen,
  })),
  on(NavActions.dropdownClosed, (state) => ({
    ...state,
    isDropdownOpen: false,
  })),
  on(NavActions.logOutSelected, (state) => ({
    ...state,
    isDropdownOpen: false,
  })),
  on(NavActions.resendVerificationLinkSelected, (state) => ({
    ...state,
    isDropdownOpen: false,
  }))
);

export function reducer(state: NavState, action: Action) {
  return navReducer(state, action);
}
