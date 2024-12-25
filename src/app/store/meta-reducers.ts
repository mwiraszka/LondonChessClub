import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppState } from '@app/store/app/app.state';
import { ArticlesState } from '@app/store/articles/articles.state';
import { AuthState } from '@app/store/auth/auth.state';
import { EventsState } from '@app/store/events/events.state';
import { MembersState } from '@app/store/members/members.state';
import { NavState } from '@app/store/nav/nav.state';

import { environment } from '@env';

class MetaState {
  constructor(
    readonly app?: AppState,
    readonly articles?: ArticlesState,
    readonly auth?: AuthState,
    readonly events?: EventsState,
    readonly members?: MembersState,
    readonly nav?: NavState,
  ) {}
}

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
    keys: Object.keys(new MetaState()) as Array<keyof MetaState>,
    rehydrate: true,
    restoreDates: false,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<any, Action<string>>> =
  environment.production
    ? [hydrationMetaReducer]
    : [actionLogMetaReducer, hydrationMetaReducer];
