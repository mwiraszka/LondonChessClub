import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { NavActions } from '@app/core/nav';
import { User } from '@app/shared/types';

import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions';
import { SignUpResponse } from '../types/sign-up-response.model';
import { LoginResponse } from '../types/login-response.model';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ loginRequest }) => {
        return this.authService.logIn(loginRequest).pipe(
          map((loginResponse: LoginResponse) => {
            const user: User = {
              id: 'test-3nfo13-1j3nf',
              firstName: 'Michal*',
              lastName: 'Wiraszka*',
              email: 'michal@test.com*',
              role: 'admin',
              isAuthenticated: true,
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
      ofType(NavActions.logoutSelected),
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
              firstName: 'Michal*',
              lastName: 'Wiraszka*',
              email: 'michal@test.com*',
              role: 'admin',
              isAuthenticated: true,
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

  constructor(private actions$: Actions, private authService: AuthService) {}
}
