import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReplaySubject, of, throwError } from 'rxjs';

import { TestBed } from '@angular/core/testing';

import { ApiResponse, LccError, User } from '@app/models';
import { AuthApiService } from '@app/services';

import { AuthActions, AuthSelectors } from '.';
import { AuthEffects } from './auth.effects';

const mockParseError = jest.fn();

jest.mock('@app/utils', () => ({
  isDefined: <T>(value: T | null | undefined): value is T => value != null,
  parseError: (error: unknown) => mockParseError(error),
}));

describe('AuthEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: AuthEffects;
  let authApiService: jest.Mocked<AuthApiService>;
  let store: MockStore;

  const mockUser: User = {
    id: 'user123',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    isAdmin: true,
  };

  const mockError: LccError = {
    name: 'LCCError',
    message: 'Test error',
  };

  beforeEach(() => {
    const authApiServiceMock = {
      logIn: jest.fn(),
      logOut: jest.fn(),
      sendCodeForPasswordChange: jest.fn(),
      changePassword: jest.fn(),
      refreshSession: jest.fn(),
    };

    const mockAuthState = {
      user: null,
      callState: { status: 'idle' as const, loadStart: null, error: null },
    };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthApiService, useValue: authApiServiceMock },
        provideMockStore({
          initialState: {
            authState: mockAuthState,
          },
          selectors: [
            { selector: AuthSelectors.selectUser, value: null },
            { selector: AuthSelectors.selectIsAdmin, value: false },
            { selector: AuthSelectors.selectCallState, value: mockAuthState.callState },
          ],
        }),
      ],
    });

    effects = TestBed.inject(AuthEffects);
    authApiService = TestBed.inject(AuthApiService) as jest.Mocked<AuthApiService>;
    store = TestBed.inject(MockStore);
    actions$ = new ReplaySubject<Action>(1);

    mockParseError.mockReturnValue(mockError);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('logIn$', () => {
    it('should dispatch loginSucceeded on successful login', done => {
      const email = 'test@example.com';
      const password = 'password123';
      const apiResponse: ApiResponse<User> = { data: mockUser };

      authApiService.logIn.mockReturnValue(of(apiResponse));

      actions$.next(AuthActions.loginRequested({ email, password }));

      effects.logIn$.subscribe(action => {
        expect(action).toEqual(AuthActions.loginSucceeded({ user: mockUser }));
        expect(authApiService.logIn).toHaveBeenCalledWith(email, password);
        done();
      });
    });

    it('should dispatch loginFailed on error', done => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const rawError = new Error('Unauthorized');

      authApiService.logIn.mockReturnValue(throwError(() => rawError));

      actions$.next(AuthActions.loginRequested({ email, password }));

      effects.logIn$.subscribe(action => {
        expect(action).toEqual(AuthActions.loginFailed({ error: mockError }));
        expect(mockParseError).toHaveBeenCalledWith(rawError);
        done();
      });
    });
  });

  describe('logOut$', () => {
    it('should dispatch logoutSucceeded on successful logout', done => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();

      const apiResponse: ApiResponse<'success'> = { data: 'success' };
      authApiService.logOut.mockReturnValue(of(apiResponse));

      actions$.next(AuthActions.logoutRequested({ sessionExpired: false }));

      effects.logOut$.subscribe(action => {
        expect(action).toEqual(AuthActions.logoutSucceeded({ sessionExpired: false }));
        expect(authApiService.logOut).toHaveBeenCalled();
        done();
      });
    });

    it('should dispatch logoutSucceeded with sessionExpired flag', done => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();

      const apiResponse: ApiResponse<'success'> = { data: 'success' };
      authApiService.logOut.mockReturnValue(of(apiResponse));

      actions$.next(AuthActions.logoutRequested({ sessionExpired: true }));

      effects.logOut$.subscribe(action => {
        expect(action).toEqual(AuthActions.logoutSucceeded({ sessionExpired: true }));
        done();
      });
    });

    it('should dispatch logoutFailed on error', done => {
      store.overrideSelector(AuthSelectors.selectUser, mockUser);
      store.refreshState();

      const rawError = new Error('Logout failed');
      authApiService.logOut.mockReturnValue(throwError(() => rawError));

      actions$.next(AuthActions.logoutRequested({ sessionExpired: false }));

      effects.logOut$.subscribe(action => {
        expect(action).toEqual(AuthActions.logoutFailed({ error: mockError }));
        expect(mockParseError).toHaveBeenCalledWith(rawError);
        done();
      });
    });

    it('should not call logOut when user is not present', done => {
      store.overrideSelector(AuthSelectors.selectUser, null);
      store.refreshState();

      actions$.next(AuthActions.logoutRequested({ sessionExpired: false }));

      setTimeout(() => {
        expect(authApiService.logOut).not.toHaveBeenCalled();
        done();
      }, 10);
    });
  });

  describe('sendCodeForPasswordChange$', () => {
    it('should dispatch codeForPasswordChangeSucceeded on success', done => {
      const email = 'test@example.com';

      const apiResponse: ApiResponse<'success'> = { data: 'success' };
      authApiService.sendCodeForPasswordChange.mockReturnValue(of(apiResponse));

      actions$.next(AuthActions.codeForPasswordChangeRequested({ email }));

      effects.sendCodeForPasswordChange$.subscribe(action => {
        expect(action).toEqual(AuthActions.codeForPasswordChangeSucceeded());
        expect(authApiService.sendCodeForPasswordChange).toHaveBeenCalledWith(email);
        done();
      });
    });

    it('should dispatch codeForPasswordChangeFailed on error', done => {
      const email = 'test@example.com';
      const rawError = new Error('Email not found');

      authApiService.sendCodeForPasswordChange.mockReturnValue(
        throwError(() => rawError),
      );

      actions$.next(AuthActions.codeForPasswordChangeRequested({ email }));

      effects.sendCodeForPasswordChange$.subscribe(action => {
        expect(action).toEqual(
          AuthActions.codeForPasswordChangeFailed({ error: mockError }),
        );
        expect(mockParseError).toHaveBeenCalledWith(rawError);
        done();
      });
    });
  });

  describe('changePassword$', () => {
    it('should dispatch passwordChangeSucceeded on successful password change', done => {
      const email = 'test@example.com';
      const password = 'newpassword123';
      const code = '123456';
      const apiResponse: ApiResponse<User> = { data: mockUser };

      authApiService.changePassword.mockReturnValue(of(apiResponse));

      actions$.next(AuthActions.passwordChangeRequested({ email, password, code }));

      effects.changePassword$.subscribe(action => {
        expect(action).toEqual(AuthActions.passwordChangeSucceeded({ user: mockUser }));
        expect(authApiService.changePassword).toHaveBeenCalledWith(email, password, code);
        done();
      });
    });

    it('should dispatch passwordChangeFailed on error', done => {
      const email = 'test@example.com';
      const password = 'newpassword123';
      const code = 'wrongcode';
      const rawError = new Error('Invalid code');

      authApiService.changePassword.mockReturnValue(throwError(() => rawError));

      actions$.next(AuthActions.passwordChangeRequested({ email, password, code }));

      effects.changePassword$.subscribe(action => {
        expect(action).toEqual(AuthActions.passwordChangeFailed({ error: mockError }));
        expect(mockParseError).toHaveBeenCalledWith(rawError);
        done();
      });
    });
  });

  describe('refreshSession$', () => {
    it('should dispatch sessionRefreshSucceeded on successful refresh', done => {
      const apiResponse: ApiResponse<'success'> = { data: 'success' };
      authApiService.refreshSession.mockReturnValue(of(apiResponse));

      actions$.next(AuthActions.sessionRefreshRequested());

      effects.refreshSession$.subscribe(action => {
        expect(action).toEqual(AuthActions.sessionRefreshSucceeded());
        expect(authApiService.refreshSession).toHaveBeenCalled();
        done();
      });
    });

    it('should dispatch sessionRefreshFailed on error', done => {
      const rawError = new Error('Session expired');

      authApiService.refreshSession.mockReturnValue(throwError(() => rawError));

      actions$.next(AuthActions.sessionRefreshRequested());

      effects.refreshSession$.subscribe(action => {
        expect(action).toEqual(AuthActions.sessionRefreshFailed({ error: mockError }));
        expect(mockParseError).toHaveBeenCalledWith(rawError);
        done();
      });
    });
  });
});
