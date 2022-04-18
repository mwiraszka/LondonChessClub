import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { ArticleEditorComponent, ArticleEditorSelectors } from '@app/pages/articles';
import { MemberEditorComponent, MemberEditorSelectors } from '@app/pages/members';
import {
  Modal,
  ModalActions,
  ModalButtonAction,
  ModalButtonStyle,
  ModalSelectors,
} from '@app/shared/components/modal';

@Injectable({
  providedIn: 'root',
})
export class UnsavedGuard
  implements CanDeactivate<MemberEditorComponent | ArticleEditorComponent>
{
  unsavedChangesModal: Modal = {
    title: 'Unsaved changes',
    body: 'Are you sure you want to leave this page? Any unsaved changes will be lost.',
    buttons: [
      {
        text: 'Cancel',
        style: ModalButtonStyle.SECONDARY,
        action: ModalButtonAction.LEAVE_CANCEL,
      },
      {
        text: 'Leave',
        style: ModalButtonStyle.PRIMARY_DEFAULT,
        action: ModalButtonAction.LEAVE_OK,
      },
    ],
  };

  constructor(private store: Store) {}

  canDeactivate(): Observable<boolean> {
    return combineLatest([
      this.store.select(ArticleEditorSelectors.hasUnsavedChanges),
      this.store.select(MemberEditorSelectors.hasUnsavedChanges),
    ]).pipe(
      switchMap(([unsavedArticle, unsavedMember]) => {
        if (!unsavedArticle && !unsavedMember) {
          return of(true);
        }
        this.store.dispatch(
          ModalActions.modalCreated({ modal: this.unsavedChangesModal })
        );
        return this.store.select(ModalSelectors.selection).pipe(
          filter((selectedAction) => !!selectedAction),
          map((actionSelected) => actionSelected === ModalButtonAction.LEAVE_OK)
        );
      })
    );
  }
}
