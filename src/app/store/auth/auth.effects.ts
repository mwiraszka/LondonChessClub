/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthService } from '@app/services';
import { User } from '@app/types';

import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ request }) => {
        return this.authService.logIn(request).pipe(
          map(loginResponse => {
            // Create fake user object since this information is currently
            // not received from Cognito when logging in
            const user: User = {
              id: 'test-3nfo13-1j3nf',
              firstName: loginResponse?.firstName,
              email: loginResponse?.email,
              isVerified: loginResponse?.isVerified,
              isAdmin: true,
            };
            return loginResponse?.error
              ? AuthActions.loginFailed({ error: loginResponse.error })
              : AuthActions.loginSucceeded({
                  user,
                  session: loginResponse.session!,
                });
          }),
          catchError(() =>
            of(
              AuthActions.loginFailed({
                error: new Error('Unknown login error'),
              }),
            ),
          ),
        );
      }),
    );
  });

  logOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      map(() => {
        this.authService.logOut();
        return AuthActions.logoutSucceeded();
      }),
    );
  });

  requestPasswordChangeCode$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeRequested),
      switchMap(({ email }) => {
        return this.authService.sendChangePasswordCode(email).pipe(
          map(response => {
            return response?.error
              ? AuthActions.codeForPasswordChangeFailed({ error: response.error })
              : AuthActions.codeForPasswordChangeSucceeded();
          }),
          catchError(() =>
            of(
              AuthActions.codeForPasswordChangeFailed({
                error: new Error(
                  'Unknown error attempting to send password change request',
                ),
              }),
            ),
          ),
        );
      }),
    );
  });

  changePassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordChangeRequested),
      switchMap(({ request }) => {
        return this.authService.changePassword(request).pipe(
          map(response => {
            return response?.error
              ? AuthActions.passwordChangeFailed({ error: response.error })
              : AuthActions.passwordChangeSucceeded({
                  email: response!.email!,
                  newPassword: response!.newPassword!,
                });
          }),
          catchError(() =>
            of(
              AuthActions.passwordChangeFailed({
                error: new Error('Unknown password change error'),
              }),
            ),
          ),
        );
      }),
    );
  });

  loginAfterSuccessfulPasswordChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordChangeSucceeded),
      concatLatestFrom(() => this.store.select(AuthSelectors.session)),
      filter(([, session]) => !session),
      map(([response]) =>
        AuthActions.loginRequested({
          request: {
            email: response.email,
            password: response.newPassword,
          },
        }),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private store: Store,
    private authService: AuthService,
  ) {}
}
