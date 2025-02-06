import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AuthService, LoaderService } from '@app/services';
import { parseError } from '@app/utils';

import { AuthSelectors } from '.';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  logIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginRequested),
      switchMap(({ email, password }) => {
        return this.authService.logIn(email, password).pipe(
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
        return this.authService.logOut().pipe(
          map(() => AuthActions.logoutSucceeded({ sessionExpired })),
          catchError(error => of(AuthActions.logoutFailed({ error: parseError(error) }))),
        );
      }),
      tap(() => this.loaderService.setIsLoading(false)),
    );
  });

  sendCodeForPasswordChange$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeRequested),
      switchMap(({ email }) => {
        return this.authService.sendCodeForPasswordChange(email).pipe(
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
        return this.authService.changePassword(email, password, code).pipe(
          map(response => AuthActions.passwordChangeSucceeded({ user: response.data })),
          catchError(error =>
            of(AuthActions.passwordChangeFailed({ error: parseError(error) })),
          ),
        );
      }),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly loaderService: LoaderService,
    private readonly store: Store,
  ) {}
}
