import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '@env';

import { AppState } from './app.state';

function actionLogMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    console.info(
      `%c [${new Date().toLocaleTimeString()}] ${action.type}`,
      'background-color: #ddd; color: #222',
    );
    return reducer(state, action);
  };
}

/**
 * Source: https://nils-mehlhorn.de/posts/ngrx-keep-state-refresh
 */
function hydrationMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  const keysOfStoresToSync = [
    'articles',
    'auth',
    'events',
    'members',
    'nav',
    'user-settings',
  ];
  return localStorageSync({ keys: keysOfStoresToSync, rehydrate: true })(reducer);
}

export const metaReducers: Array<MetaReducer<any, any>> = environment.production
  ? [hydrationMetaReducer]
  : [actionLogMetaReducer, hydrationMetaReducer];
