import { Action, createReducer, on } from '@ngrx/store';

import * as navActions from './nav.actions';
import { NavState, initialState } from './nav.state';

const navReducer = createReducer(
  initialState,

  on(navActions.appendPathToHistory, (state, { path }): NavState => {
    const currentPathHistory = state.pathHistory;
    return {
      pathHistory: !currentPathHistory
        ? [path]
        : currentPathHistory[currentPathHistory.length - 1] === path
          ? currentPathHistory
          : [...currentPathHistory, path].slice(-5),
    };
  }),
);

export function reducer(state: NavState, action: Action): NavState {
  return navReducer(state, action);
}
