import { RouterState } from '@ngrx/router-store';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '@env';

import { AppState } from './app';
import { ArticlesState } from './articles';
import { AuthState } from './auth';
import { EventsState } from './events';
import { ImagesState } from './images';
import { MembersState } from './members';
import { NavState } from './nav';
import { NotificationsState } from './notifications';

export interface MetaState {
  appState?: AppState;
  articlesState?: ArticlesState;
  authState?: AuthState;
  eventsState?: EventsState;
  imagesState?: ImagesState;
  membersState?: MembersState;
  navState?: NavState;
  notificationsState?: NotificationsState;
  routerState?: RouterState;
}

function clearStaleLocalStorageMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  let hasRun = false;

  return (state, action) => {
    if (!hasRun) {
      const oldKeys = ['articles', 'auth', 'members', 'nav', 'schedule', 'user-settings'];
      oldKeys.forEach(key => localStorage.removeItem(key));

      const entityKeys = ['articlesState', 'eventsState', 'imagesState', 'membersState'];
      entityKeys.forEach(key => {
        const storedValue = localStorage.getItem(key);

        if (storedValue) {
          const rawValue = JSON.stringify(JSON.parse(storedValue));

          if (
            rawValue.includes('bannerImageFileData') ||
            rawValue.includes('-thumb"') ||
            rawValue.includes('articleFormData') ||
            rawValue.includes('eventFormData') ||
            rawValue.includes('memberFormData')
          ) {
            console.info(`[LCC] Removed key ${key}.`);
            localStorage.removeItem(key);
          }
        }
      });
      hasRun = true;
      console.info('[LCC] Completed clearing stale data from local storage.');
    }

    return reducer(state, action);
  };
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

const hydratedStates = [
  'appState',
  // 'articlesState',
  'authState',
  // 'eventsState',
  // 'imagesState',
  // 'membersState',
  'navState',
] as Array<keyof Exclude<MetaState, NotificationsState | RouterState>>;

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
    ? [clearStaleLocalStorageMetaReducer, hydrationMetaReducer]
    : [actionLogMetaReducer, clearStaleLocalStorageMetaReducer, hydrationMetaReducer];
