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

function cleanLocalStorage(): void {
  const oldKeys = ['articles', 'auth', 'members', 'nav', 'schedule', 'user-settings'];
  oldKeys.forEach(key => localStorage.removeItem(key));

  const entityKeys = ['articlesState', 'eventsState', 'imagesState', 'membersState'];
  entityKeys.forEach(key => {
    const item = localStorage.getItem(key);
    if (item !== null) {
      const parsedItem = JSON.parse(item);
      if (parsedItem.entities && Object.keys(parsedItem.entities).length === 0) {
        localStorage.removeItem(key);
      } else if (parsedItem.entities) {
        const updatedItem = { ...parsedItem };
        for (const entityKey of Object.keys(updatedItem.entities)) {
          if (Object.keys(updatedItem.entities[entityKey]).length === 0) {
            delete updatedItem.entities[entityKey];
          }
        }
        localStorage.setItem(key, JSON.stringify(updatedItem));
      }
    }
  });
}

function clearStaleLocalStorageMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  let hasRun = false;

  return (state, action) => {
    if (!hasRun) {
      cleanLocalStorage();
      hasRun = true;
      console.info('[LCC] Cleaned stale data from local storage.');
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
  'articlesState',
  'authState',
  'eventsState',
  'imagesState',
  'membersState',
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
