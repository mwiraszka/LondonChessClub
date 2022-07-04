import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import {
  ArticleEditorScreenActions,
  ArticleEditorScreenSelectors,
  ArticleGridActions,
} from '@app/screens/articles';
import {
  MemberEditorScreenActions,
  MemberEditorScreenSelectors,
  MemberListScreenActions,
} from '@app/screens/members';
import { UpdateService } from '@app/shared/services';

import * as ModalActions from './modal.actions';
import { Modal } from '../types/modal.model';
import {
  ModalButtonActionTypes,
  ModalButtonStyleTypes,
} from '../types/modal-button.model';

@Injectable()
export class ModalEffects {
  openAddMemberModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorScreenActions.addMemberSelected),
      map(({ memberToAdd }) => {
        const modal: Modal = {
          title: 'Confirm new member',
          body: `Add ${memberToAdd.firstName} ${memberToAdd.lastName} to database?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.ADD_MEMBER_CANCEL,
            },
            {
              text: 'Add',
              style: ModalButtonStyleTypes.PRIMARY_SUCCESS,
              action: ModalButtonActionTypes.ADD_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  openUpdateMemberModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorScreenActions.updateMemberSelected),
      concatLatestFrom(() =>
        this.store.select(MemberEditorScreenSelectors.memberBeforeEdit)
      ),
      map(([, memberBeforeEdit]) => {
        const modal: Modal = {
          title: 'Confirm member update',
          body: `Update ${memberBeforeEdit.firstName} ${memberBeforeEdit.lastName}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.UPDATE_MEMBER_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyleTypes.PRIMARY_SUCCESS,
              action: ModalButtonActionTypes.UPDATE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  openDeleteMemberModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.deleteMemberSelected),
      map(({ memberToDelete }) => {
        const modal: Modal = {
          title: 'Confirm member deletion',
          body: `Delete ${memberToDelete.firstName} ${memberToDelete.lastName}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.DELETE_MEMBER_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyleTypes.PRIMARY_WARNING,
              action: ModalButtonActionTypes.DELETE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  openPublishArticleModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorScreenActions.publishArticleSelected),
      map(({ articleToPublish }) => {
        const modal: Modal = {
          title: 'Confirm new article',
          body: `Publish ${articleToPublish.title}`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL,
            },
            {
              text: 'Publish',
              style: ModalButtonStyleTypes.PRIMARY_SUCCESS,
              action: ModalButtonActionTypes.PUBLISH_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  openUpdateArticleModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorScreenActions.updateArticleSelected),
      concatLatestFrom(() =>
        this.store.select(ArticleEditorScreenSelectors.articleBeforeEdit)
      ),
      map(([, articleBeforeEdit]) => {
        const modal: Modal = {
          title: 'Confirm article update',
          body: `Update ${articleBeforeEdit.title}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyleTypes.PRIMARY_SUCCESS,
              action: ModalButtonActionTypes.UPDATE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  openDeleteArticleModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.deleteArticleSelected),
      map(({ articleToDelete }) => {
        const modal: Modal = {
          title: 'Confirm article deletion',
          body: `Update ${articleToDelete.title}?`,
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.DELETE_ARTICLE_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyleTypes.PRIMARY_WARNING,
              action: ModalButtonActionTypes.DELETE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  openUnsavedChangesModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModalActions.leaveWithUnsavedChangesRequested),
      map(() => {
        const modal: Modal = {
          title: 'Unsaved changes',
          body: 'Are you sure you want to leave this screen? Any unsaved changes will be lost.',
          buttons: [
            {
              text: 'Cancel',
              style: ModalButtonStyleTypes.SECONDARY,
              action: ModalButtonActionTypes.LEAVE_CANCEL,
            },
            {
              text: 'Leave',
              style: ModalButtonStyleTypes.PRIMARY_DEFAULT,
              action: ModalButtonActionTypes.LEAVE_OK,
            },
          ],
        };
        return ModalActions.modalOpened({ modal });
      })
    )
  );

  closeModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModalActions.selectionMade),
      map(() => ModalActions.modalClosed())
    )
  );

  broadcastSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModalActions.selectionMade),
      filter(
        ({ action }) =>
          action === ModalButtonActionTypes.ADD_MEMBER_OK ||
          action === ModalButtonActionTypes.ADD_MEMBER_CANCEL ||
          action === ModalButtonActionTypes.UPDATE_MEMBER_OK ||
          action === ModalButtonActionTypes.UPDATE_MEMBER_CANCEL ||
          action === ModalButtonActionTypes.DELETE_MEMBER_OK ||
          action === ModalButtonActionTypes.DELETE_MEMBER_CANCEL ||
          action === ModalButtonActionTypes.PUBLISH_ARTICLE_OK ||
          action === ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL ||
          action === ModalButtonActionTypes.UPDATE_ARTICLE_OK ||
          action === ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL ||
          action === ModalButtonActionTypes.DELETE_ARTICLE_OK ||
          action === ModalButtonActionTypes.DELETE_ARTICLE_CANCEL
      ),
      map(({ action }) => {
        switch (action) {
          case ModalButtonActionTypes.ADD_MEMBER_OK:
            return MemberEditorScreenActions.addMemberConfirmed();
          case ModalButtonActionTypes.ADD_MEMBER_CANCEL:
            return MemberEditorScreenActions.addMemberCancelled();
          case ModalButtonActionTypes.UPDATE_MEMBER_OK:
            return MemberEditorScreenActions.updateMemberConfirmed();
          case ModalButtonActionTypes.UPDATE_MEMBER_CANCEL:
            return MemberEditorScreenActions.updateMemberCancelled();
          case ModalButtonActionTypes.DELETE_MEMBER_OK:
            return MemberListScreenActions.deleteMemberConfirmed();
          case ModalButtonActionTypes.DELETE_MEMBER_CANCEL:
            return MemberListScreenActions.deleteMemberCancelled();
          case ModalButtonActionTypes.PUBLISH_ARTICLE_OK:
            return ArticleEditorScreenActions.publishArticleConfirmed();
          case ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL:
            return ArticleEditorScreenActions.publishArticleCancelled();
          case ModalButtonActionTypes.UPDATE_ARTICLE_OK:
            return ArticleEditorScreenActions.updateArticleConfirmed();
          case ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL:
            return ArticleEditorScreenActions.updateArticleCancelled();
          case ModalButtonActionTypes.DELETE_ARTICLE_OK:
            return ArticleGridActions.deleteArticleConfirmed();
          default:
            return ArticleGridActions.deleteArticleCancelled();
        }
      })
    )
  );

  activateVersionUpdate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ModalActions.selectionMade),
        filter(({ action }) => action === ModalButtonActionTypes.ACTIVATE_VERSION_UPDATE),
        tap(() => this.updateService.activateUpdate())
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private updateService: UpdateService
  ) {}
}
