import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { ArticleEditorComponent, ArticleEditorSelectors } from '@app/pages/articles';
import {
  ModalActions,
  ModalButtonAction,
  ModalSelectors,
} from '@app/shared/components/modal';

@Injectable({
  providedIn: 'root',
})
export class UnsavedArticleGuard implements CanDeactivate<ArticleEditorComponent> {
  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.select(ArticleEditorSelectors.hasUnsavedChanges).pipe(
      switchMap((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) {
          return of(true);
        }

        this.store.dispatch(ModalActions.leaveWithUnsavedChangesRequested());
        return this.store.select(ModalSelectors.selection).pipe(
          filter((selection) => !!selection),
          map((selection) => selection === ModalButtonAction.LEAVE_OK)
        );
      })
    );
  }
}
