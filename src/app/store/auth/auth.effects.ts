import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { AuthService } from '@app/services/auth.service';
import { LoginResponse, SignUpResponse, User, UserRoleTypes } from '@app/types';
import { NavActions } from '@app/store/nav';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ loginRequest }) => {
        return this.authService.logIn(loginRequest).pipe(
          map((loginResponse: LoginResponse) => {
            /**
             * TODO: need to find a way to get real user data using the
             * tokens received from the loginResponse object
             */
            const user: User = {
              id: 'test-3nfo13-1j3nf',
              email: 'michal@test.com*',
              role: UserRoleTypes.ADMIN,
              isVerified: true,
            };
            return AuthActions.loginSucceeded({
              user,
              cognitoUserSession: loginResponse.cognitoUserSession,
            });
          }),
          catchError(() =>
            of(
              AuthActions.loginFailed({
                errorMessage: '[Auth Effects] Unknown sign-up error',
              })
            )
          )
        );
      })
    )
  );

  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavActions.logOutSelected),
      map(() => {
        this.authService.logOut();
        return AuthActions.logoutSucceeded();
      })
    )
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUpRequested),
      switchMap(({ signUpRequest }) => {
        return this.authService.signUp(signUpRequest).pipe(
          map((signUpResponse: SignUpResponse) => {
            const user: User = {
              id: 'test-3nfo13-1j3nf',
              email: 'michal@test.com*',
              role: UserRoleTypes.ADMIN,
              isVerified: true,
            };
            return AuthActions.signUpSucceeded({
              user,
              cognitoUserSession: signUpResponse.cognitoUserSession,
            });
          }),
          catchError(() =>
            of(
              AuthActions.signUpFailed({
                errorMessage: '[Auth Effects] Unknown sign-up error',
              })
            )
          )
        );
      })
    )
  );

  resendVerificationLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NavActions.resendVerificationLinkSelected),
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
