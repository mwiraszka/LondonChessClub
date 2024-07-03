/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthService } from '@app/services';

import * as AuthActions from './auth.actions';
import * as AuthSelectors from './auth.selectors';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ request }) => {
        return this.authService.logIn(request).pipe(
          map((loginResponse) => {
            if (loginResponse.error) {
              return AuthActions.loginFailed({ error: loginResponse.error });
            } else if (
              loginResponse.unverifiedUser &&
              loginResponse.tempInitialPassword
            ) {
              return AuthActions.newPasswordChallengeRequested({
                user: loginResponse.unverifiedUser,
                tempInitialPassword: loginResponse.tempInitialPassword,
              });
            } else {
              return AuthActions.loginSucceeded({ user: loginResponse.adminUser! });
            }
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
          map((response) => {
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
          map((response) => {
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
      concatLatestFrom(() => this.store.select(AuthSelectors.user)),
      filter(([, user]) => !user),
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
    private readonly actions$: Actions,
    private readonly store: Store,
    private authService: AuthService,
  ) {}
}
