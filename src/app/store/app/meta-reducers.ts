import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppState } from './app.state';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function actionLogMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return (state, action) => {
    console.info(
      `%c [${new Date().toLocaleTimeString()}] ${action.type} `,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const metaReducers: Array<MetaReducer<any, any>> = [
  actionLogMetaReducer,
  hydrationMetaReducer,
];
