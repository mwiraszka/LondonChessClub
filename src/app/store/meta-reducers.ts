import { RouterState } from '@ngrx/router-store';
import { Action, ActionReducer, MetaReducer } from '@ngrx/store';
import { compact } from 'lodash';
import { localStorageSync } from 'ngrx-store-localstorage';

import { UserActivityService } from '@app/services';

import { environment } from '@env';

import { version } from '../../../package.json';
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
 * Clears stale data from previous app versions from local storage
 */
export function clearStaleLocalStorageDataMetaReducer(
  reducer: ActionReducer<MetaState>,
): ActionReducer<MetaState> {
  const keysToRemove = Object.keys(localStorage).filter(
    key => !key.endsWith(`_v${version}`),
  );

  return (state, action) => {
    if (keysToRemove.length) {
      console.info(`[LCC] Clearing stale data from local storage for version ${version}`);

      keysToRemove.forEach(key => {
        // Only reset imagesState from previous version
        // TODO: Include imagesState once caching issues have been resolved
        const state = key.split('_v')[0];
        if ((hydratedStates as string[]).includes(state) && state !== 'imagesState') {
          const oldState = localStorage.getItem(key);
          if (oldState) {
            localStorage.setItem(`${state}_v${version}`, oldState);
          }
        }

        localStorage.removeItem(key);
        console.info(`[LCC] Removed stale key: ${key}`);
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
    return localStorage.getItem(`${key}_v${version}`);
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(`${key}_v${version}`, value);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(`${key}_v${version}`);
  },
  clear: () => {
    Object.keys(localStorage)
      .filter(k => k.endsWith(`_v${version}`))
      .forEach(k => localStorage.removeItem(k));
  },
  key: (index: number) => {
    const keys = Object.keys(localStorage).filter(k => k.endsWith(`_v${version}`));
    return keys[index] || null;
  },
  get length() {
    return Object.keys(localStorage).filter(k => k.endsWith(`_v${version}`)).length;
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
  clearStaleLocalStorageDataMetaReducer,
  hydrationMetaReducer,
  sessionValidationMetaReducer,
]);
