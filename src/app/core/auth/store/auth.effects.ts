import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { User } from '@app/shared/types';

import { AuthService } from '../auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  // logIn$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.loginRequested),
  //     map((loginRequestData) => {
  //       return AuthActions.loginSucceeded({ user });
  //     }),
  //     catchError(() => {
  //       return of(
  //         AuthActions.loginFailed({
  //           errorMessage: '[Auth Effects] Unknown login error',
  //         })
  //       );
  //     })
  //   )
  // );

  signUp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signUpRequested),
      switchMap(({ signUpRequestData }) => {
        return this.authService
          .signUp(signUpRequestData.email, signUpRequestData.password)
          .pipe(
            tap((val) => console.log('::: signUp returned `user` as:', val)),
            map((user) => AuthActions.signUpSucceeded({ user })),
            // ::: show email confirmation code form?
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
