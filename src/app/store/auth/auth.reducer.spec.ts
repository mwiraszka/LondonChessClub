import { LccError, User } from '@app/models';

import * as AuthActions from './auth.actions';
import { AuthState, authReducer, initialState } from './auth.reducer';

describe('Auth Reducer', () => {
  const mockUser: User = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    isAdmin: true,
  };
  const mockError: LccError = {
    name: 'LCCError',
    message: 'Authentication failed',
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = authReducer(initialState, action);

      expect(state).toBe(initialState);
    });
  });

  describe('initialState', () => {
    it('should have the correct initial state', () => {
      expect(initialState).toEqual({
        callState: {
          status: 'idle',
          loadStart: null,
          error: null,
        },
        user: null,
        hasCode: false,
        sessionStartTime: null,
      });
    });
  });

  describe('loading states', () => {
    it('should set callState to loading on loginRequested', () => {
      const action = AuthActions.loginRequested({
        email: 'test@example.com',
        password: 'password',
      });
      const state = authReducer(initialState, action);

      expect(state.callState.status).toBe('loading');
      expect(state.callState.loadStart).toBeTruthy();
      expect(state.callState.error).toBeNull();
    });

    it('should set callState to loading on logoutRequested', () => {
      const action = AuthActions.logoutRequested({ sessionExpired: false });
      const state = authReducer(initialState, action);

      expect(state.callState.status).toBe('loading');
      expect(state.callState.loadStart).toBeTruthy();
      expect(state.callState.error).toBeNull();
    });

    it('should set callState to loading on codeForPasswordChangeRequested', () => {
      const action = AuthActions.codeForPasswordChangeRequested({
        email: 'test@example.com',
      });
      const state = authReducer(initialState, action);

      expect(state.callState.status).toBe('loading');
      expect(state.callState.loadStart).toBeTruthy();
      expect(state.callState.error).toBeNull();
    });

    it('should set callState to loading on passwordChangeRequested', () => {
      const action = AuthActions.passwordChangeRequested({
        email: 'test@example.com',
        password: 'newPassword',
        code: '123456',
      });
      const state = authReducer(initialState, action);

      expect(state.callState.status).toBe('loading');
      expect(state.callState.loadStart).toBeTruthy();
      expect(state.callState.error).toBeNull();
    });
  });

  describe('error states', () => {
    const errorActions = [
      { action: AuthActions.loginFailed, name: 'loginFailed' },
      { action: AuthActions.logoutFailed, name: 'logoutFailed' },
      { action: AuthActions.passwordChangeFailed, name: 'passwordChangeFailed' },
      { action: AuthActions.sessionRefreshFailed, name: 'sessionRefreshFailed' },
    ];

    errorActions.forEach(({ action, name }) => {
      it(`should set error state on ${name}`, () => {
        const state = authReducer(initialState, action({ error: mockError }));

        expect(state.callState.status).toBe('error');
        expect(state.callState.loadStart).toBeNull();
        expect(state.callState.error).toEqual(mockError);
      });

      it(`should preserve user state on ${name}`, () => {
        const previousState: AuthState = {
          ...initialState,
          user: mockUser,
        };

        const state = authReducer(previousState, action({ error: mockError }));

        expect(state.user).toEqual(mockUser);
      });
    });
  });

  describe('loginSucceeded', () => {
    let dateNowSpy: jest.SpyInstance;
    const mockTimestamp = 1234567890;

    beforeEach(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    it('should set user and reset callState', () => {
      const action = AuthActions.loginSucceeded({ user: mockUser });
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.callState).toEqual(initialState.callState);
    });

    it('should set sessionStartTime to current timestamp', () => {
      const action = AuthActions.loginSucceeded({ user: mockUser });
      const state = authReducer(initialState, action);

      expect(state.sessionStartTime).toBe(mockTimestamp);
      expect(dateNowSpy).toHaveBeenCalled();
    });

    it('should clear previous error state', () => {
      const previousState: AuthState = {
        ...initialState,
        callState: {
          status: 'error',
          loadStart: null,
          error: mockError,
        },
      };

      const action = AuthActions.loginSucceeded({ user: mockUser });
      const state = authReducer(previousState, action);

      expect(state.callState.error).toBeNull();
      expect(state.callState.status).toBe('idle');
    });
  });

  describe('passwordChangeSucceeded', () => {
    let dateNowSpy: jest.SpyInstance;
    const mockTimestamp = 1234567890;

    beforeEach(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    it('should set user and reset callState', () => {
      const action = AuthActions.passwordChangeSucceeded({ user: mockUser });
      const state = authReducer(initialState, action);

      expect(state.user).toEqual(mockUser);
      expect(state.callState).toEqual(initialState.callState);
    });

    it('should set sessionStartTime', () => {
      const action = AuthActions.passwordChangeSucceeded({ user: mockUser });
      const state = authReducer(initialState, action);

      expect(state.sessionStartTime).toBe(mockTimestamp);
    });

    it('should reset hasCode to false', () => {
      const previousState: AuthState = {
        ...initialState,
        hasCode: true,
      };

      const action = AuthActions.passwordChangeSucceeded({ user: mockUser });
      const state = authReducer(previousState, action);

      expect(state.hasCode).toBe(false);
    });
  });

  describe('sessionRefreshSucceeded', () => {
    let dateNowSpy: jest.SpyInstance;
    const mockTimestamp = 9876543210;

    beforeEach(() => {
      dateNowSpy = jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
    });

    afterEach(() => {
      dateNowSpy.mockRestore();
    });

    it('should reset callState', () => {
      const previousState: AuthState = {
        ...initialState,
        callState: {
          status: 'loading',
          loadStart: new Date().toISOString(),
          error: null,
        },
      };

      const action = AuthActions.sessionRefreshSucceeded();
      const state = authReducer(previousState, action);

      expect(state.callState).toEqual(initialState.callState);
    });

    it('should update sessionStartTime', () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
        sessionStartTime: 1111111111,
      };

      const action = AuthActions.sessionRefreshSucceeded();
      const state = authReducer(previousState, action);

      expect(state.sessionStartTime).toBe(mockTimestamp);
      expect(state.sessionStartTime).not.toBe(previousState.sessionStartTime);
    });

    it('should preserve user state', () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
      };

      const action = AuthActions.sessionRefreshSucceeded();
      const state = authReducer(previousState, action);

      expect(state.user).toEqual(mockUser);
    });
  });

  describe('logoutSucceeded', () => {
    it('should reset to initial state', () => {
      const previousState: AuthState = {
        callState: {
          status: 'loading',
          loadStart: new Date().toISOString(),
          error: null,
        },
        user: mockUser,
        hasCode: true,
        sessionStartTime: Date.now(),
      };

      const action = AuthActions.logoutSucceeded({ sessionExpired: false });
      const state = authReducer(previousState, action);

      expect(state).toEqual(initialState);
    });

    it('should clear all user data', () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
        sessionStartTime: Date.now(),
      };

      const action = AuthActions.logoutSucceeded({ sessionExpired: false });
      const state = authReducer(previousState, action);

      expect(state.user).toBeNull();
      expect(state.sessionStartTime).toBeNull();
      expect(state.hasCode).toBe(false);
    });
  });

  describe('codeForPasswordChangeSucceeded', () => {
    it('should set hasCode to true', () => {
      const action = AuthActions.codeForPasswordChangeSucceeded();
      const state = authReducer(initialState, action);

      expect(state.hasCode).toBe(true);
    });

    it('should reset callState', () => {
      const previousState: AuthState = {
        ...initialState,
        callState: {
          status: 'loading',
          loadStart: new Date().toISOString(),
          error: null,
        },
      };

      const action = AuthActions.codeForPasswordChangeSucceeded();
      const state = authReducer(previousState, action);

      expect(state.callState).toEqual(initialState.callState);
    });
  });

  describe('codeForPasswordChangeFailed', () => {
    it('should set error state and hasCode to false', () => {
      const action = AuthActions.codeForPasswordChangeFailed({ error: mockError });
      const state = authReducer(initialState, action);

      expect(state.callState.status).toBe('error');
      expect(state.callState.error).toEqual(mockError);
      expect(state.hasCode).toBe(false);
    });

    it('should reset hasCode from true to false', () => {
      const previousState: AuthState = {
        ...initialState,
        hasCode: true,
      };

      const action = AuthActions.codeForPasswordChangeFailed({ error: mockError });
      const state = authReducer(previousState, action);

      expect(state.hasCode).toBe(false);
    });
  });

  describe('requestNewCodeSelected', () => {
    it('should reset hasCode to false', () => {
      const previousState: AuthState = {
        ...initialState,
        hasCode: true,
      };

      const action = AuthActions.requestNewCodeSelected();
      const state = authReducer(previousState, action);

      expect(state.hasCode).toBe(false);
    });

    it('should reset callState', () => {
      const previousState: AuthState = {
        ...initialState,
        callState: {
          status: 'error',
          loadStart: null,
          error: mockError,
        },
        hasCode: true,
      };

      const action = AuthActions.requestNewCodeSelected();
      const state = authReducer(previousState, action);

      expect(state.callState).toEqual(initialState.callState);
    });
  });

  describe('requestTimedOut', () => {
    it('should set timeout error', () => {
      const action = AuthActions.requestTimedOut();
      const state = authReducer(initialState, action);

      expect(state.callState.status).toBe('error');
      expect(state.callState.error).toEqual({
        name: 'LCCError',
        message: 'Request timed out',
      });
      expect(state.callState.loadStart).toBeNull();
    });

    it('should preserve user state', () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
      };

      const action = AuthActions.requestTimedOut();
      const state = authReducer(previousState, action);

      expect(state.user).toEqual(mockUser);
    });
  });

  describe('state immutability', () => {
    it('should not mutate the previous state', () => {
      const previousState: AuthState = {
        ...initialState,
        user: mockUser,
      };
      const originalState = { ...previousState };

      const action = AuthActions.logoutSucceeded({ sessionExpired: false });
      const state = authReducer(previousState, action);

      expect(previousState).toEqual(originalState);
      expect(state).not.toBe(previousState);
    });
  });
});
