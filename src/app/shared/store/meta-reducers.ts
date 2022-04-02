import { ActionReducer, INIT, MetaReducer, UPDATE } from '@ngrx/store';

import { AppState } from './app.state';

function actionLogMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const timestamp = new Date().toLocaleTimeString();
    console.info(`%c [${timestamp}] ${action.type} `, 'background: #ddd; color: #222');
    console.log('State:', state);
    console.log('Action:', action);

    const nextState = reducer(state, action);

    return nextState;
  };
}

/*
 * Source: https://nils-mehlhorn.de/posts/ngrx-keep-state-refresh
 */
function hydrationMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('state');
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('state');
        }
      }
    }

    const nextState = reducer(state, action);
    localStorage.setItem('state', JSON.stringify(nextState));

    return nextState;
  };
}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];
