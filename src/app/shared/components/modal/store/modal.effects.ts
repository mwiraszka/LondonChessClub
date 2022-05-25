import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import {
  ArticleEditorActions,
  ArticleEditorSelectors,
  ArticleListActions,
} from '@app/pages/articles';
import {
  MemberEditorActions,
  MemberEditorSelectors,
  MemberListActions,
} from '@app/pages/members';
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
      ofType(MemberEditorActions.addMemberSelected),
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
      ofType(MemberEditorActions.updateMemberSelected),
      concatLatestFrom(() => this.store.select(MemberEditorSelectors.memberBeforeEdit)),
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
      ofType(MemberListActions.deleteMemberSelected),
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
      ofType(ArticleEditorActions.publishArticleSelected),
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
      ofType(ArticleEditorActions.updateArticleSelected),
      concatLatestFrom(() => this.store.select(ArticleEditorSelectors.articleBeforeEdit)),
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
      ofType(ArticleListActions.deleteArticleSelected),
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
          body: 'Are you sure you want to leave this page? Any unsaved changes will be lost.',
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
            return MemberEditorActions.addMemberConfirmed();
          case ModalButtonActionTypes.ADD_MEMBER_CANCEL:
            return MemberEditorActions.addMemberCancelled();
          case ModalButtonActionTypes.UPDATE_MEMBER_OK:
            return MemberEditorActions.updateMemberConfirmed();
          case ModalButtonActionTypes.UPDATE_MEMBER_CANCEL:
            return MemberEditorActions.updateMemberCancelled();
          case ModalButtonActionTypes.DELETE_MEMBER_OK:
            return MemberListActions.deleteMemberConfirmed();
          case ModalButtonActionTypes.DELETE_MEMBER_CANCEL:
            return MemberListActions.deleteMemberCancelled();
          case ModalButtonActionTypes.PUBLISH_ARTICLE_OK:
            return ArticleEditorActions.publishArticleConfirmed();
          case ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL:
            return ArticleEditorActions.publishArticleCancelled();
          case ModalButtonActionTypes.UPDATE_ARTICLE_OK:
            return ArticleEditorActions.updateArticleConfirmed();
          case ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL:
            return ArticleEditorActions.updateArticleCancelled();
          case ModalButtonActionTypes.DELETE_ARTICLE_OK:
            return ArticleListActions.deleteArticleConfirmed();
          default:
            return ArticleListActions.deleteArticleCancelled();
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
