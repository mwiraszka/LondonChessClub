import { RouterState } from '@ngrx/router-store';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { environment } from '@env';

import { version } from '../../../package.json';
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

const hydratedStates = [
  'appState',
  'articlesState',
  'authState',
  'eventsState',
  'imagesState',
  'membersState',
  'navState',
] as Array<keyof Exclude<MetaState, NotificationsState | RouterState>>;

// Define a version for local storage based on the app version
const STATE_VERSION = version;

/**
 * Returns a versioned key for localStorage
 * @param key The original key
 * @returns The versioned key
 */
function getVersionedKey(key: string): string {
  return `${key}_v${STATE_VERSION}`;
}

function clearStaleLocalStorageDataMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  let hasRun = false;

  const nonVersionedKeys = [
    'articles',
    'auth',
    'members',
    'nav',
    'schedule',
    'user-settings',
    ...hydratedStates,
  ];

  return (state, action) => {
    const keysToRemove = nonVersionedKeys.filter(key => !!localStorage.getItem(key));

    if (!hasRun && keysToRemove.length) {
      console.info(
        `[LCC] Clearing stale data from local storage for version ${STATE_VERSION}.`,
      );

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.info(`[LCC] Removed non-versioned key: ${key}`);
      });

      hasRun = true;
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

/**
 * Custom storage mechanism that adds versioning to keys
 */
const versionedStorage = {
  getItem: (key: string) => {
    const versionedKey = getVersionedKey(key);
    return localStorage.getItem(versionedKey);
  },
  setItem: (key: string, value: string) => {
    const versionedKey = getVersionedKey(key);
    localStorage.setItem(versionedKey, value);
  },
  removeItem: (key: string) => {
    const versionedKey = getVersionedKey(key);
    localStorage.removeItem(versionedKey);
  },
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.endsWith(`_v${STATE_VERSION}`))
      .forEach(k => localStorage.removeItem(k));
  },
  key: (index: number) => {
    const keys = Object.keys(localStorage).filter(k => k.endsWith(`_v${STATE_VERSION}`));
    return keys[index] || null;
  },
  get length() {
    return Object.keys(localStorage).filter(k => k.endsWith(`_v${STATE_VERSION}`)).length;
  },
};

function hydrationMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  return localStorageSync({
    keys: hydratedStates,
    rehydrate: true,
    restoreDates: false,
    storage: versionedStorage,
  })(reducer);
}

export const metaReducers: Array<MetaReducer<MetaState, Action<string>>> =
  environment.production
    ? [clearStaleLocalStorageDataMetaReducer, hydrationMetaReducer]
    : [actionLogMetaReducer, clearStaleLocalStorageDataMetaReducer, hydrationMetaReducer];
