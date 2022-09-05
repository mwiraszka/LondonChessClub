import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppState } from './app.state';

function actionLogMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    const timestamp = new Date().toLocaleTimeString();
    console.info(
      `%c [${timestamp}] ${action.type} `,
      'background-color: #ddd; color: #222'
    );
    console.log('State:', state);
    console.log('Action:', action);

    const nextState = reducer(state, action);

    return nextState;
  };
}

/**
 * Source: https://nils-mehlhorn.de/posts/ngrx-keep-state-refresh
 */
function hydrationMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  const keysOfStoresToSync = ['articles', 'auth', 'members', 'schedule'];
  return localStorageSync({ keys: keysOfStoresToSync, rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = [hydrationMetaReducer];
