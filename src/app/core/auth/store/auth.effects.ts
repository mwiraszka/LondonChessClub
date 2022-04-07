import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { User } from '@app/shared/types';

import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      map((loginRequest) => {
        const mockUser: User = {
          id: '123123',
          email: 'michal@test.com',
          firstName: 'Michal',
          lastName: 'Wiraszka',
          token: '123',
        };
        return AuthActions.loginSucceeded({ user: mockUser });
      }),
      catchError(() => {
        return of(
          AuthActions.loginFailed({
            errorMessage: '[Auth Effects] Unknown login error',
          })
        );
      })
    )
  );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUpRequested),
      map((signUpRequest) => {
        const mockUser: User = {
          id: '123123',
          email: 'michal@test.com',
          firstName: 'Michal',
          lastName: 'Wiraszka',
          token: '123',
        };
        return AuthActions.signUpSucceeded({ user: mockUser });
      }),
      catchError(() => {
        return of(
          AuthActions.signUpFailed({
            errorMessage: '[Auth Effects] Unknown sign-up error',
          })
        );
      })
    )
  );

  constructor(private actions$: Actions, private authService: AuthService) {}
}
