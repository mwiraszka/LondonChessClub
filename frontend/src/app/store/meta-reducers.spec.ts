import { Action, ActionReducer } from '@ngrx/store';

import { CallState } from '@app/models';

import { version } from '../../../package.json';
import { initialState as articlesInitialState } from './articles/articles.reducer';
import { initialState as eventsInitialState } from './events/events.reducer';
import { initialState as imagesInitialState } from './images/images.reducer';
import { initialState as membersInitialState } from './members/members.reducer';
import {
  MetaState,
  actionLogMetaReducer,
  loadingStateResetMetaReducer,
  metaReducers,
  updateStateVersionsInLocalStorageMetaReducer,
  versionedStorage,
} from './meta-reducers';

describe('Meta Reducers', () => {
  let mockReducer: ActionReducer<MetaState>;
  let mockState: MetaState;

  beforeEach(() => {
    localStorage.clear();

    mockReducer = vi.fn(
      (state: MetaState | undefined) => state || mockState,
    ) as ActionReducer<MetaState, Action<string>>;
    mockState = {};
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('updateStateVersionsInLocalStorageMetaReducer', () => {
    it('should remove stale keys from previous versions', () => {
      // Setup: Add stale keys
      localStorage.setItem('eventsState_v1.0.0', '{"events": "old"}');
      localStorage.setItem('appState_v1.0.0', '{"theme": "dark"}');

      const updateStateMetaReducer =
        updateStateVersionsInLocalStorageMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/init' };

      updateStateMetaReducer(mockState, action);

      // Should not contain old version keys
      expect(localStorage.getItem('eventsState_v1.0.0')).toBeNull();
    });

    it('should preserve state from previous version', () => {
      const oldAppState = JSON.stringify({ theme: 'dark' });
      localStorage.setItem('appState_v10.50.0', oldAppState);

      const updateStateMetaReducer =
        updateStateVersionsInLocalStorageMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/init' };

      updateStateMetaReducer(mockState, action);

      // Should preserve appState with current version
      const preserved = localStorage.getItem(`appState_v${version}`);
      expect(preserved).toBe(oldAppState);
    });

    it('should not remove keys with current version', () => {
      const currentKey = `appState_v${version}`;
      localStorage.setItem(currentKey, '{"theme": "dark"}');

      const updateStateMetaReducer =
        updateStateVersionsInLocalStorageMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/init' };

      updateStateMetaReducer(mockState, action);

      expect(localStorage.getItem(currentKey)).toBe('{"theme": "dark"}');
    });
  });

  describe('actionLogMetaReducer', () => {
    let consoleInfoSpy: MockInstance;

    beforeEach(() => {
      consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    });

    afterEach(() => {
      consoleInfoSpy.mockRestore();
    });

    it('should log actions with timestamp', () => {
      const wrappedActionLogMetaReducer = actionLogMetaReducer(mockReducer);
      const action = { type: '[Auth] Login Requested' };

      wrappedActionLogMetaReducer(mockState, action);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Auth] Login Requested'),
        expect.any(String),
      );
    });

    it('should pass state through reducer', () => {
      const expectedState = { ...mockState, modified: true };
      mockReducer = vi.fn(() => expectedState);

      const wrappedActionLogMetaReducer = actionLogMetaReducer(mockReducer);
      const action = { type: 'TEST_ACTION' };

      const result = wrappedActionLogMetaReducer(mockState, action);

      expect(result).toBe(expectedState);
      expect(mockReducer).toHaveBeenCalledWith(mockState, action);
    });
  });

  describe('versionedStorage', () => {
    const testKey = 'testKey';
    const testValue = 'testValue';

    it('should store and retrieve items with version suffix', () => {
      versionedStorage.setItem(testKey, testValue);

      const retrieved = versionedStorage.getItem(testKey);
      expect(retrieved).toBe(testValue);

      // Check that it's actually stored with version
      const rawKey = `${testKey}_v${version}`;
      expect(localStorage.getItem(rawKey)).toBe(testValue);
    });

    it('should remove items with version suffix', () => {
      versionedStorage.setItem(testKey, testValue);
      versionedStorage.removeItem(testKey);

      expect(versionedStorage.getItem(testKey)).toBeNull();
    });

    it('should clear all versioned items', () => {
      versionedStorage.setItem('key1', 'value1');
      versionedStorage.setItem('key2', 'value2');
      // Add a non-versioned key that shouldn't be removed
      localStorage.setItem('unversioned', 'keep');

      versionedStorage.clear();

      expect(versionedStorage.getItem('key1')).toBeNull();
      expect(versionedStorage.getItem('key2')).toBeNull();
      expect(localStorage.getItem('unversioned')).toBe('keep');
    });

    it('should return correct length of versioned items', () => {
      versionedStorage.setItem('key1', 'value1');
      versionedStorage.setItem('key2', 'value2');
      localStorage.setItem('unversioned', 'should not count');

      expect(versionedStorage.length).toBe(2);
    });

    it('should retrieve key by index', () => {
      versionedStorage.setItem('key1', 'value1');

      const key = versionedStorage.key(0);
      expect(key).toContain('key1');
      expect(key).toContain(`_v${version}`);
    });

    it('should return null for invalid index', () => {
      expect(versionedStorage.key(999)).toBeNull();
    });
  });

  describe('loadingStateResetMetaReducer', () => {
    it('should reset loading state for articlesState on rehydration', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      };

      const state: MetaState = {
        articlesState: {
          ...articlesInitialState,
          callState: loadingCallState,
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.articlesState?.callState).toEqual(articlesInitialState.callState);
    });

    it('should reset loading state for eventsState on rehydration', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      };

      const state: MetaState = {
        eventsState: {
          ...eventsInitialState,
          callState: loadingCallState,
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.eventsState?.callState).toEqual(eventsInitialState.callState);
    });

    it('should reset loading state for imagesState on rehydration', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      };

      const state: MetaState = {
        imagesState: {
          ...imagesInitialState,
          callState: loadingCallState,
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.imagesState?.callState).toEqual(imagesInitialState.callState);
    });

    it('should reset loading state for membersState on rehydration', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      };

      const state: MetaState = {
        membersState: {
          ...membersInitialState,
          callState: loadingCallState,
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.membersState?.callState).toEqual(membersInitialState.callState);
    });

    it('should reset loading state for multiple states on rehydration', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      };

      const state: MetaState = {
        articlesState: {
          ...articlesInitialState,
          callState: loadingCallState,
        },
        eventsState: {
          ...eventsInitialState,
          callState: { status: 'idle', loadStart: null, error: null },
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.articlesState?.callState).toEqual(articlesInitialState.callState);
      expect(result.eventsState?.callState.status).toBe('idle');
    });

    it('should not modify state when no loading states exist', () => {
      const state: MetaState = {
        articlesState: {
          ...articlesInitialState,
          callState: { status: 'idle', loadStart: null, error: null },
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result).toBe(state);
    });

    it('should preserve error states on rehydration', () => {
      const errorCallState: CallState = {
        status: 'error',
        loadStart: null,
        error: { name: 'LCCError', message: 'Test error' },
      };

      const state: MetaState = {
        articlesState: {
          ...articlesInitialState,
          callState: errorCallState,
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.articlesState?.callState).toEqual(errorCallState);
    });

    it('should not modify state on non-rehydration actions', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        loadStart: new Date().toISOString(),
        error: null,
      };

      const state: MetaState = {
        articlesState: {
          ...articlesInitialState,
          callState: loadingCallState,
        },
      };

      mockReducer = vi.fn(() => state);

      const wrappedLoadingStateResetMetaReducer =
        loadingStateResetMetaReducer(mockReducer);
      const action = { type: '[Articles] Publish article requested' };

      const result = wrappedLoadingStateResetMetaReducer(mockState, action);

      expect(result.articlesState?.callState).toEqual(loadingCallState);
    });
  });

  describe('metaReducers array', () => {
    it('should export metaReducers array', () => {
      expect(metaReducers).toBeDefined();
      expect(Array.isArray(metaReducers)).toBe(true);
    });

    it('should include loadingStateResetMetaReducer', () => {
      const loadingStateReset = metaReducers.find(
        metaReducer => metaReducer.name === 'loadingStateResetMetaReducer',
      );
      expect(loadingStateReset).toBeDefined();
    });

    it('should include updateStateVersionsInLocalStorageMetaReducer', () => {
      const updateState = metaReducers.find(
        metaReducer =>
          metaReducer.name === 'updateStateVersionsInLocalStorageMetaReducer',
      );
      expect(updateState).toBeDefined();
    });
  });
});
