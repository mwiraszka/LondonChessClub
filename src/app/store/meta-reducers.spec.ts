import { Action, ActionReducer } from '@ngrx/store';

import { UserActivityService } from '@app/services';

import { version } from '../../../package.json';
import {
  MetaState,
  actionLogMetaReducer,
  metaReducers,
  sessionValidationMetaReducer,
  updateStateVersionsInLocalStorageMetaReducer,
  versionedStorage,
} from './meta-reducers';

describe('Meta Reducers', () => {
  let mockReducer: ActionReducer<MetaState>;
  let mockState: MetaState;

  beforeEach(() => {
    localStorage.clear();

    mockReducer = jest.fn(
      (state: MetaState | undefined) => state || mockState,
    ) as ActionReducer<MetaState, Action<string>>;
    mockState = {
      authState: {
        callState: {
          status: 'idle',
          loadStart: null,
          error: null,
        },
        user: null,
        hasCode: false,
        sessionStartTime: null,
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateStateVersionsInLocalStorageMetaReducer', () => {
    it('should remove stale keys from previous versions', () => {
      // Setup: Add stale keys
      localStorage.setItem('authState_v1.0.0', '{"user": "old"}');
      localStorage.setItem('appState_v1.0.0', '{"theme": "dark"}');

      const updateStateMetaReducer =
        updateStateVersionsInLocalStorageMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/init' };

      updateStateMetaReducer(mockState, action);

      // Should not contain old version keys
      expect(localStorage.getItem('authState_v1.0.0')).toBeNull();
    });

    it('should preserve state from previous version', () => {
      const oldAppState = JSON.stringify({ theme: 'dark' });
      localStorage.setItem('appState_v1.0.0', oldAppState);

      const updateStateMetaReducer =
        updateStateVersionsInLocalStorageMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/init' };

      updateStateMetaReducer(mockState, action);

      // Should preserve appState with current version
      const preserved = localStorage.getItem(`appState_v${version}`);
      expect(preserved).toBe(oldAppState);
    });

    it('should not remove keys with current version', () => {
      const currentKey = `authState_v${version}`;
      localStorage.setItem(currentKey, '{"user": "current"}');

      const updateStateMetaReducer =
        updateStateVersionsInLocalStorageMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/init' };

      updateStateMetaReducer(mockState, action);

      expect(localStorage.getItem(currentKey)).toBe('{"user": "current"}');
    });
  });

  describe('actionLogMetaReducer', () => {
    let consoleInfoSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
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
      mockReducer = jest.fn(() => expectedState);

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

  describe('sessionValidationMetaReducer', () => {
    let consoleInfoSpy: jest.SpyInstance;
    let dateNowSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
      dateNowSpy = jest.spyOn(Date, 'now');
    });

    afterEach(() => {
      consoleInfoSpy.mockRestore();
      dateNowSpy.mockRestore();
    });

    it('should clear auth state when session is expired on update-reducers', () => {
      const now = Date.now();
      const expiredSessionStartTime =
        now - UserActivityService.SESSION_DURATION_MS - 1000; // Expired by 1 second

      dateNowSpy.mockReturnValue(now);

      const stateWithExpiredSession: MetaState = {
        authState: {
          callState: { status: 'idle', loadStart: null, error: null },
          user: {
            id: '1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            isAdmin: false,
          },
          hasCode: false,
          sessionStartTime: expiredSessionStartTime,
        },
      };

      mockReducer = jest.fn(() => stateWithExpiredSession);

      const wrappedSessionValidationMetaReducer =
        sessionValidationMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedSessionValidationMetaReducer(mockState, action);

      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[LCC] Session expired during offline period - clearing auth state',
      );
      expect(result.authState?.user).toBeNull();
      expect(result.authState?.sessionStartTime).toBeNull();
    });

    it('should not clear auth state when session is still valid', () => {
      const now = Date.now();
      const validSessionStartTime = now - 1000; // Started 1 second ago

      dateNowSpy.mockReturnValue(now);

      const stateWithValidSession: MetaState = {
        authState: {
          callState: { status: 'idle', loadStart: null, error: null },
          user: {
            id: '1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            isAdmin: false,
          },
          hasCode: false,
          sessionStartTime: validSessionStartTime,
        },
      };

      mockReducer = jest.fn(() => stateWithValidSession);

      const wrappedSessionValidationMetaReducer =
        sessionValidationMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedSessionValidationMetaReducer(mockState, action);

      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(result.authState?.user).toBeTruthy();
      expect(result.authState?.sessionStartTime).toBe(validSessionStartTime);
    });

    it('should only validate on @ngrx/store/update-reducers action', () => {
      const now = Date.now();
      const expiredSessionStartTime =
        now - UserActivityService.SESSION_DURATION_MS - 1000;

      dateNowSpy.mockReturnValue(now);

      const stateWithExpiredSession: MetaState = {
        authState: {
          callState: { status: 'idle', loadStart: null, error: null },
          user: {
            id: '1',
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            isAdmin: false,
          },
          hasCode: false,
          sessionStartTime: expiredSessionStartTime,
        },
      };

      mockReducer = jest.fn(() => stateWithExpiredSession);

      const wrappedSessionValidationMetaReducer =
        sessionValidationMetaReducer(mockReducer);

      // Try with different action type
      const differentAction = { type: '@ngrx/store/init' };
      const result = wrappedSessionValidationMetaReducer(mockState, differentAction);

      // Should not clear auth state for other actions
      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(result.authState?.user).toBeTruthy();
    });

    it('should not clear auth state when sessionStartTime is null', () => {
      const stateWithoutSession: MetaState = {
        authState: {
          callState: { status: 'idle', loadStart: null, error: null },
          user: null,
          hasCode: false,
          sessionStartTime: null,
        },
      };

      mockReducer = jest.fn(() => stateWithoutSession);

      const wrappedSessionValidationMetaReducer =
        sessionValidationMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedSessionValidationMetaReducer(mockState, action);

      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(result).toBe(stateWithoutSession);
    });

    it('should not clear auth state when authState is undefined', () => {
      const stateWithoutAuth: MetaState = {};

      mockReducer = jest.fn(() => stateWithoutAuth);

      const wrappedSessionValidationMetaReducer =
        sessionValidationMetaReducer(mockReducer);
      const action = { type: '@ngrx/store/update-reducers' };

      const result = wrappedSessionValidationMetaReducer(mockState, action);

      expect(consoleInfoSpy).not.toHaveBeenCalled();
      expect(result).toBe(stateWithoutAuth);
    });
  });

  describe('metaReducers array', () => {
    it('should export metaReducers array', () => {
      expect(metaReducers).toBeDefined();
      expect(Array.isArray(metaReducers)).toBe(true);
    });

    it('should include sessionValidationMetaReducer', () => {
      const sessionValidation = metaReducers.find(
        metaReducer => metaReducer.name === 'sessionValidationMetaReducer',
      );
      expect(sessionValidation).toBeDefined();
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
