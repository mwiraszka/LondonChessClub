import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { ArticleEditorComponent } from '@app/pages/articles';
import { MemberEditorComponent } from '@app/pages/members';
import {
  ModalActions,
  ModalButtonActionTypes,
  ModalButtonClassTypes,
  ModalContent,
  ModalSelectors,
} from '@app/shared/components/modal';
import { AppSelectors } from '@app/shared/store';

@Injectable({
  providedIn: 'root',
})
export class UnsavedGuard
  implements CanDeactivate<MemberEditorComponent | ArticleEditorComponent>
{
  unsavedChangesContent: ModalContent = {
    title: 'Unsaved changes',
    body: 'Are you sure you want to leave this page? Any unsaved changes will be lost.',
    buttons: [
      {
        text: 'Cancel',
        class: ModalButtonClassTypes.DEFAULT,
        action: ModalButtonActionTypes.LEAVE_CANCEL,
      },
      {
        text: 'Leave',
        class: ModalButtonClassTypes.DEFAULT,
        action: ModalButtonActionTypes.LEAVE_OK,
      },
    ],
  };

  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return this.store.pipe(
      select(AppSelectors.hasUnsavedChanges),
      switchMap((hasUnsavedChanges) => {
        if (!hasUnsavedChanges) {
          return of(true);
        }
        this.store.dispatch(
          ModalActions.modalCreated({ content: this.unsavedChangesContent })
        );
        return this.store.select(ModalSelectors.actionSelected).pipe(
          filter((actionSelected) => !!actionSelected),
          map((actionSelected) => actionSelected === ModalButtonActionTypes.LEAVE_OK)
        );
      })
    );
  }
}
