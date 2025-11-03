import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthApiService } from '@app/services';
import { parseError } from '@app/utils';

import { AuthActions, AuthSelectors } from '.';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ email, password }) => {
        return this.authApiService.logIn(email, password).pipe(
          map(response => AuthActions.loginSucceeded({ user: response.data })),
          catchError(error => of(AuthActions.loginFailed({ error: parseError(error) }))),
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
        return this.authApiService.logOut().pipe(
          map(() => AuthActions.logoutSucceeded({ sessionExpired })),
          catchError(error => of(AuthActions.logoutFailed({ error: parseError(error) }))),
        );
      }),
    );
  });

  sendCodeForPasswordChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeRequested),
      switchMap(({ email }) => {
        return this.authApiService.sendCodeForPasswordChange(email).pipe(
          map(() => AuthActions.codeForPasswordChangeSucceeded()),
          catchError(error =>
            of(AuthActions.codeForPasswordChangeFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  changePassword$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordChangeRequested),
      switchMap(({ email, password, code }) => {
        return this.authApiService.changePassword(email, password, code).pipe(
          map(response => AuthActions.passwordChangeSucceeded({ user: response.data })),
          catchError(error =>
            of(AuthActions.passwordChangeFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  refreshSession$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.sessionRefreshRequested),
      switchMap(() => {
        return this.authApiService.refreshSession().pipe(
          map(() => AuthActions.sessionRefreshSucceeded()),
          catchError(error =>
            of(AuthActions.sessionRefreshFailed({ error: parseError(error) })),
          ),
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
