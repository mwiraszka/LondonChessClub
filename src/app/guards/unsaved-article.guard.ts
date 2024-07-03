import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesSelectors } from '@app/store/articles';
import { ModalActions, ModalSelectors } from '@app/store/modal';
import { ModalButtonActionTypes } from '@app/types';

@Injectable({ providedIn: 'root' })
export class UnsavedArticleGuard {
  constructor(private readonly store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(ArticlesSelectors.hasUnsavedChanges).pipe(
      switchMap((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) {
          return of(true);
        }

        this.store.dispatch(ModalActions.leaveWithUnsavedChangesRequested());
        return this.store.select(ModalSelectors.selection).pipe(
          filter((selection) => !!selection),
          map((selection) => selection === ModalButtonActionTypes.LEAVE_OK)
        );
      })
    );
  }
}
