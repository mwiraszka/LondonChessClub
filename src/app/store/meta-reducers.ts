import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { MetaState } from '@app/types';

import { environment } from '@env';

function actionLogMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  return (state, action) => {
    console.info(
      `%c [${new Date().toLocaleTimeString()}] ${action.type}`,
      'background-color: #ddd; color: #222',
    );
    return reducer(state, action);
  };
}

function hydrationMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  return localStorageSync({
    keys: Object.keys({} as MetaState) as (keyof MetaState)[],
    rehydrate: true,
    restoreDates: false,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, Action<string>>> =
  environment.production
    ? [hydrationMetaReducer]
    : [actionLogMetaReducer, hydrationMetaReducer];
