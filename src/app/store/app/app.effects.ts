import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LocalStorageService } from '@app/services';

import * as AppActions from './app.actions';

@Injectable()
export class AppEffects {
  setItemInLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AppActions.itemSetInLocalStorage),
        tap(({ key, item }) => this.localStorageService.set(key, item)),
      );
    },
    { dispatch: false },
  );

  removeItemFromLocalStorage$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AppActions.itemRemovedFromLocalStorage),
        tap(({ key }) => this.localStorageService.remove(key)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly localStorageService: LocalStorageService,
  ) {}
}
