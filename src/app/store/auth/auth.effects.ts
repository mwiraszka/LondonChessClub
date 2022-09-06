import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from '@app/services';
import { LoginResponse, SignUpResponse, User } from '@app/types';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ request }) => {
        return this.authService.logIn(request).pipe(
          map((response: LoginResponse) => {
            const user: User = {
              id: 'test-3nfo13-1j3nf',
              firstName: response?.firstName,
              email: response?.email,
              isVerified: response?.isVerified,
              isAdmin: true,
            };
            return response?.error
              ? AuthActions.loginFailed({ error: response.error })
              : AuthActions.loginSucceeded({
                  user,
                  session: response.session,
                });
          }),
          catchError(() =>
            of(
              AuthActions.loginFailed({
                error: new Error('[Auth Effects] Unknown login error'),
              })
            )
          )
        );
      })
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      map(() => {
        this.authService.logOut();
        return AuthActions.logoutSucceeded();
      })
    )
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
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
                error: new Error('[Auth Effects] Unknown sign-up error'),
              })
            )
          )
        );
      })
    )
  );

  requestPasswordChangeCode$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
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
    )
  );

  resendVerificationLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resendVerificationLinkRequested),
      map(() => {
        /**
         * Configured in AWS to only send email to the user (no SMS);
         * Note: no callback function configured - it's simply assumed that this email gets sent
         */
        this.authService.resendVerificationLink();
        return AuthActions.resendVerificationLinkSucceeded();
      })
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
