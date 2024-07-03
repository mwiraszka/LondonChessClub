import { Action, createReducer, on } from '@ngrx/store';

import * as navActions from './nav.actions';
import { NavState, initialState } from './nav.state';

const navReducer = createReducer(
  initialState,

  on(navActions.appendPathToHistory, (state, { path }) => ({
    pathHistory: updatePathHistory(state.pathHistory, path),
  })),
);

export function reducer(state: NavState, action: Action): NavState {
  return navReducer(state, action);
}

function updatePathHistory(
  currentPathHistory: string[] | null,
  newPath: string,
): string[] {
  return !currentPathHistory
    ? [newPath]
    : currentPathHistory[currentPathHistory.length - 1] === newPath
      ? currentPathHistory
      : [...currentPathHistory, newPath].slice(-5);
}
