import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from '@app/services';
import { SignUpResponse, User } from '@app/types';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ request }) => {
        return this.authService.logIn(request).pipe(
          map((loginResponse) => {
            // temp - see note above auth service's userData() method
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
                  session: loginResponse.session,
                });
          }),
          catchError(() =>
            of(
              AuthActions.loginFailed({
                error: new Error('[Auth] Unknown login error'),
              })
            )
          )
        );
      })
    );
  });

  logOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      map(() => {
        this.authService.logOut();
        return AuthActions.logoutSucceeded();
      })
    );
  });

  signUp$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.signUpRequested),
      switchMap(({ request }) => {
        return this.authService.signUp(request).pipe(
          map((response: SignUpResponse) => {
            const user: User = {
              id: 'test-3nfo13-1j3nf',
              email: 'michal@test.com*',
              isVerified: false,
              isAdmin: false,
            };
            return AuthActions.signUpSucceeded({
              user,
              session: response.session,
            });
          }),
          catchError(() =>
            of(
              AuthActions.signUpFailed({
                error: new Error('[Auth] Unknown sign-up error'),
              })
            )
          )
        );
      })
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
                  '[Auth] Unknown error attempting to send password change request'
                ),
              })
            )
          )
        );
      })
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
              : AuthActions.passwordChangeSucceeded();
          }),
          catchError(() =>
            of(
              AuthActions.passwordChangeFailed({
                error: new Error('[Auth] Unknown password change error'),
              })
            )
          )
        );
      })
    );
  });

  constructor(private actions$: Actions, private authService: AuthService) {}
}
