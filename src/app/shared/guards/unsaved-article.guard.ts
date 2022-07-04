import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import {
  ArticleEditorScreenComponent,
  ArticleEditorScreenSelectors,
} from '@app/screens/articles';
import {
  ModalActions,
  ModalButtonActionTypes,
  ModalSelectors,
} from '@app/shared/components/modal';

@Injectable({ providedIn: 'root' })
export class UnsavedArticleGuard implements CanDeactivate<ArticleEditorScreenComponent> {
  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(ArticleEditorScreenSelectors.hasUnsavedChanges).pipe(
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
