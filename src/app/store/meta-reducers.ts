import { RouterState } from '@ngrx/router-store';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppState } from '@app/store/app/app.state';
import { ArticlesState } from '@app/store/articles/articles.state';
import { AuthState } from '@app/store/auth/auth.state';
import { EventsState } from '@app/store/events/events.state';
import { MembersState } from '@app/store/members/members.state';
import { NavState } from '@app/store/nav/nav.state';
import { NotificationsState } from '@app/store/notifications/notifications.state';

import { environment } from '@env';

class MetaStateClass {
  constructor(
    readonly app?: AppState,
    readonly articles?: ArticlesState,
    readonly auth?: AuthState,
    readonly events?: EventsState,
    readonly members?: MembersState,
    readonly nav?: NavState,
    readonly notifications?: NotificationsState,
    readonly router?: RouterState,
  ) {}
}

export type MetaState = MetaStateClass;

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

const hydratedStates = Object.keys(new MetaStateClass()).filter(
  key => !['notifications', 'router'].includes(key),
) as Array<keyof Exclude<MetaState, RouterState>>;

function hydrationMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  return localStorageSync({
    keys: hydratedStates,
    rehydrate: true,
    restoreDates: false,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<MetaState, Action<string>>> =
  environment.production
    ? [hydrationMetaReducer]
    : [actionLogMetaReducer, hydrationMetaReducer];
