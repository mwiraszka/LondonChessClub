import { createReducer, Action } from '@ngrx/store';

import { NavState } from '../types/nav.state';

const initialState: NavState = {};

const navReducer = createReducer(initialState);

export function reducer(state: NavState, action: Action) {
  return navReducer(state, action);
}
