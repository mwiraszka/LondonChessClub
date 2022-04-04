import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';

import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.loginRequested)), {
    dispatch: false,
  });

  logout$ = createEffect(() => this.actions$.pipe(ofType(AuthActions.logoutRequested)), {
    dispatch: false,
  });

  constructor(private actions$: Actions) {}
}
