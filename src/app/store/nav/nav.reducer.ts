import { createReducer, Action, on } from '@ngrx/store';

import * as NavActions from './nav.actions';
import { initialState, NavState } from './nav.state';

const navReducer = createReducer(
  initialState,
  on(NavActions.dropdownToggled, (state) => ({
    ...state,
    isDropdownOpen: !state.isDropdownOpen,
  })),
  on(NavActions.dropdownClosed, (state) => ({
    ...state,
    isDropdownOpen: false,
  }))
);

export function reducer(state: NavState, action: Action) {
  return navReducer(state, action);
}
