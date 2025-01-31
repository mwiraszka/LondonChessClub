import { createReducer, on } from '@ngrx/store';

import * as navActions from './nav.actions';

export interface NavState {
  pathHistory: string[] | null;
}

export const navInitialState: NavState = {
  pathHistory: null,
};

export const navReducer = createReducer(
  navInitialState,

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
