import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of, race, timer } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthApiService } from '@app/services';
import { parseError } from '@app/utils';

import { AuthActions, AuthSelectors } from '.';

const AUTH_REQUEST_TIMEOUT = 5000; // 5 seconds

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ email, password }) => {
        return race(
          this.authApiService.logIn(email, password).pipe(
            map(response => AuthActions.loginSucceeded({ user: response.data })),
            catchError(error =>
              of(AuthActions.loginFailed({ error: parseError(error) })),
            ),
          ),
          timer(AUTH_REQUEST_TIMEOUT).pipe(map(() => AuthActions.requestTimedOut())),
        );
      }),
    );
  });

  logOut$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutRequested),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectUser)),
      filter(([, user]) => !!user),
      switchMap(([{ sessionExpired }]) => {
        return race(
          this.authApiService.logOut().pipe(
            map(() => AuthActions.logoutSucceeded({ sessionExpired })),
            catchError(error =>
              of(AuthActions.logoutFailed({ error: parseError(error) })),
            ),
          ),
          timer(AUTH_REQUEST_TIMEOUT).pipe(map(() => AuthActions.requestTimedOut())),
        );
      }),
    );
  });

  sendCodeForPasswordChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeRequested),
      switchMap(({ email }) => {
        return race(
          this.authApiService.sendCodeForPasswordChange(email).pipe(
            map(() => AuthActions.codeForPasswordChangeSucceeded()),
            catchError(error =>
              of(AuthActions.codeForPasswordChangeFailed({ error: parseError(error) })),
            ),
          ),
          timer(AUTH_REQUEST_TIMEOUT).pipe(map(() => AuthActions.requestTimedOut())),
        );
      }),
    );
  });

  changePassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordChangeRequested),
      switchMap(({ email, password, code }) => {
        return race(
          this.authApiService.changePassword(email, password, code).pipe(
            map(response => AuthActions.passwordChangeSucceeded({ user: response.data })),
            catchError(error =>
              of(AuthActions.passwordChangeFailed({ error: parseError(error) })),
            ),
          ),
          timer(AUTH_REQUEST_TIMEOUT).pipe(map(() => AuthActions.requestTimedOut())),
        );
      }),
    );
  });

  refreshSession$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sessionRefreshRequested),
      switchMap(() => {
        return race(
          this.authApiService.refreshSession().pipe(
            map(() => AuthActions.sessionRefreshSucceeded()),
            catchError(error =>
              of(AuthActions.sessionRefreshFailed({ error: parseError(error) })),
            ),
          ),
          timer(AUTH_REQUEST_TIMEOUT).pipe(map(() => AuthActions.requestTimedOut())),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authApiService: AuthApiService,
    private readonly store: Store,
  ) {}
}
