import { RouterState } from '@ngrx/router-store';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { compact } from 'lodash';
import { localStorageSync } from 'ngrx-store-localstorage';

import { UserActivityService } from '@app/services';

import { environment } from '@env';

import { version as currentVersion } from '../../../package.json';
import { AppState } from './app';
import { ArticlesState } from './articles';
import { AuthState } from './auth';
import { EventsState } from './events';
import { ImagesState } from './images';
import { MembersState } from './members';
import { NavState } from './nav';

export interface MetaState {
  appState?: AppState;
  articlesState?: ArticlesState;
  authState?: AuthState;
  eventsState?: EventsState;
  imagesState?: ImagesState;
  membersState?: MembersState;
  navState?: NavState;
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
] as Array<keyof Exclude<MetaState, RouterState>>;

/**
 * Updates hydrated state keys to new app version in local storage
 */
export function updateStateVersionsInLocalStorageMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  const keysToUpdate = Object.keys(localStorage).filter(key => {
    const [stateName, version] = key.split('_v');
    return (hydratedStates as string[]).includes(stateName) && version !== currentVersion;
  });

  return (state, action) => {
    if (keysToUpdate.length) {
      console.info(`[LCC] Welcome to version ${currentVersion}`);

      keysToUpdate.forEach(key => {
        localStorage.setItem(
          key.split('_v')[0] + `_v${currentVersion}`,
          localStorage.getItem(key) || '',
        );
        localStorage.removeItem(key);
      });
    }

    return reducer(state, action);
  };
}

export function actionLogMetaReducer(
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
export const versionedStorage = {
  getItem: (key: string) => {
    return localStorage.getItem(`${key}_v${currentVersion}`);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(`${key}_v${currentVersion}`, value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(`${key}_v${currentVersion}`);
  },
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.endsWith(`_v${currentVersion}`))
      .forEach(k => localStorage.removeItem(k));
  },
  key: (index: number) => {
    const keys = Object.keys(localStorage).filter(k => k.endsWith(`_v${currentVersion}`));
    return keys[index] || null;
  },
  get length() {
    return Object.keys(localStorage).filter(k => k.endsWith(`_v${currentVersion}`))
      .length;
  },
};

/**
 * Re-hydrates state from local storage
 */
export function hydrationMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  return localStorageSync({
    keys: hydratedStates,
    rehydrate: true,
    restoreDates: false,
    storage: versionedStorage,
  })(reducer);
}

/**
 * Validates and clears expired auth state to invalidate a potential expired session on rehydration
 */
export function sessionValidationMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  return (state, action) => {
    const nextState = reducer(state, action);

    // Only validate on update-reducers action (after hydration completes)
    if (
      action.type === '@ngrx/store/update-reducers' &&
      nextState?.authState?.sessionStartTime
    ) {
      const timeElapsed = Date.now() - nextState.authState.sessionStartTime;

      if (timeElapsed > UserActivityService.SESSION_DURATION_MS) {
        console.info('[LCC] Session expired during offline period - clearing auth state');
        return {
          ...nextState,
          authState: {
            ...nextState.authState,
            user: null,
            sessionStartTime: null,
          },
        };
      }
    }

    return nextState;
  };
}

export const metaReducers: Array<MetaReducer<MetaState, Action<string>>> = compact([
  environment.production ? undefined : actionLogMetaReducer,
  updateStateVersionsInLocalStorageMetaReducer,
  hydrationMetaReducer,
  sessionValidationMetaReducer,
]);
