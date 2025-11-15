import { CallState, User } from '@app/models';

import { AuthState } from './auth.reducer';
import * as AuthSelectors from './auth.selectors';

describe('Auth Selectors', () => {
  const mockUser: User = {
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@example.com',
    isAdmin: true,
  };

  const mockCallState: CallState = {
    status: 'idle',
    error: null,
    loadStart: null,
  };

  const mockAuthState: AuthState = {
    user: mockUser,
    callState: mockCallState,
    hasCode: false,
    sessionStartTime: 1737028800000, // 2025-01-15T10:00:00.000Z in ms
  };

  describe('selectAuthState', () => {
    it('should select the auth state', () => {
      const state = {
        authState: mockAuthState,
      };

      const result = AuthSelectors.selectAuthState(state as { authState: AuthState });

      expect(result).toEqual(mockAuthState);
    });
  });

  describe('selectCallState', () => {
    it('should select the call state', () => {
      const result = AuthSelectors.selectCallState.projector(mockAuthState);

      expect(result).toEqual(mockCallState);
    });

    it('should select call state when loading', () => {
      const loadingCallState: CallState = {
        status: 'loading',
        error: null,
        loadStart: null,
      };
      const state: AuthState = {
        ...mockAuthState,
        callState: loadingCallState,
      };

      const result = AuthSelectors.selectCallState.projector(state);

      expect(result).toEqual(loadingCallState);
    });
  });

  describe('selectIsAdmin', () => {
    it('should return true when user is admin', () => {
      const result = AuthSelectors.selectIsAdmin.projector(mockAuthState);

      expect(result).toBe(true);
    });

    it('should return false when user is not admin', () => {
      const state: AuthState = {
        ...mockAuthState,
        user: {
          ...mockUser,
          isAdmin: false,
        },
      };

      const result = AuthSelectors.selectIsAdmin.projector(state);

      expect(result).toBe(false);
    });

    it('should return false when user is null', () => {
      const state: AuthState = {
        ...mockAuthState,
        user: null,
      };

      const result = AuthSelectors.selectIsAdmin.projector(state);

      expect(result).toBe(false);
    });
  });

  describe('selectUser', () => {
    it('should select the user', () => {
      const result = AuthSelectors.selectUser.projector(mockAuthState);

      expect(result).toEqual(mockUser);
    });

    it('should return null when user is null', () => {
      const state: AuthState = {
        ...mockAuthState,
        user: null,
      };

      const result = AuthSelectors.selectUser.projector(state);

      expect(result).toBeNull();
    });
  });

  describe('selectUserId', () => {
    it('should select the user id', () => {
      const result = AuthSelectors.selectUserId.projector(mockUser);

      expect(result).toBe('user-123');
    });

    it('should return undefined when user is null', () => {
      const result = AuthSelectors.selectUserId.projector(null);

      expect(result).toBeUndefined();
    });
  });

  describe('selectHasCode', () => {
    it('should return false when hasCode is false', () => {
      const result = AuthSelectors.selectHasCode.projector(mockAuthState);

      expect(result).toBe(false);
    });

    it('should return true when hasCode is true', () => {
      const state: AuthState = {
        ...mockAuthState,
        hasCode: true,
      };

      const result = AuthSelectors.selectHasCode.projector(state);

      expect(result).toBe(true);
    });
  });

  describe('selectSessionStartTime', () => {
    it('should select the session start time', () => {
      const result = AuthSelectors.selectSessionStartTime.projector(mockAuthState);

      expect(result).toBe(1737028800000);
    });

    it('should return null when session start time is null', () => {
      const state: AuthState = {
        ...mockAuthState,
        sessionStartTime: null,
      };

      const result = AuthSelectors.selectSessionStartTime.projector(state);

      expect(result).toBeNull();
    });

    it('should select a different session start time', () => {
      const newTime = Date.now();
      const state: AuthState = {
        ...mockAuthState,
        sessionStartTime: newTime,
      };

      const result = AuthSelectors.selectSessionStartTime.projector(state);

      expect(result).toBe(newTime);
    });
  });
});
