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
import { ModalContent } from '../types/modal-content.model';
import { ModalButtonClassTypes } from '../types/modal-button-class.model';
import { ModalButtonActionTypes } from '../types/modal-button-action.model';

@Injectable()
export class ModalEffects {
  openAddMemberModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.addMemberSelected),
      map(({ memberToAdd }) => {
        const content: ModalContent = {
          title: 'Confirm new member',
          body: `Add ${memberToAdd.firstName} ${memberToAdd.lastName} to database?`,
          buttons: [
            {
              text: 'Cancel',
              class: ModalButtonClassTypes.DEFAULT,
              action: ModalButtonActionTypes.ADD_MEMBER_CANCEL,
            },
            {
              text: 'Add',
              class: ModalButtonClassTypes.CONFIRM_GREEN,
              action: ModalButtonActionTypes.ADD_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ content });
      })
    )
  );

  openUpdateMemberModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.updateMemberSelected),
      concatLatestFrom(() => this.store.select(MemberEditorSelectors.memberBeforeEdit)),
      map(([, memberBeforeEdit]) => {
        const content: ModalContent = {
          title: 'Confirm member update',
          body: `Update ${memberBeforeEdit.firstName} ${memberBeforeEdit.lastName}?`,
          buttons: [
            {
              text: 'Cancel',
              class: ModalButtonClassTypes.DEFAULT,
              action: ModalButtonActionTypes.UPDATE_MEMBER_CANCEL,
            },
            {
              text: 'Update',
              class: ModalButtonClassTypes.CONFIRM_GREEN,
              action: ModalButtonActionTypes.UPDATE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ content });
      })
    )
  );

  openDeleteMemberModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.deleteMemberSelected),
      map(({ memberToDelete }) => {
        const modalContent: ModalContent = {
          title: 'Confirm member deletion',
          body: `Delete ${memberToDelete.firstName} ${memberToDelete.lastName}?`,
          buttons: [
            {
              text: 'Cancel',
              class: ModalButtonClassTypes.DEFAULT,
              action: ModalButtonActionTypes.DELETE_MEMBER_CANCEL,
            },
            {
              text: 'Delete',
              class: ModalButtonClassTypes.CONFIRM_RED,
              action: ModalButtonActionTypes.DELETE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ content: modalContent });
      })
    )
  );

  openPublishArticleModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.publishArticleSelected),
      map(({ articleToPublish }) => {
        const content: ModalContent = {
          title: 'Confirm new article',
          body: `Publish ${articleToPublish.title}`,
          buttons: [
            {
              text: 'Cancel',
              class: ModalButtonClassTypes.DEFAULT,
              action: ModalButtonActionTypes.PUBLISH_ARTICLE_CANCEL,
            },
            {
              text: 'Publish',
              class: ModalButtonClassTypes.CONFIRM_GREEN,
              action: ModalButtonActionTypes.PUBLISH_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ content });
      })
    )
  );

  openUpdateArticleModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.updateArticleSelected),
      concatLatestFrom(() => this.store.select(ArticleEditorSelectors.articleBeforeEdit)),
      map(([, articleBeforeEdit]) => {
        const content: ModalContent = {
          title: 'Confirm article update',
          body: `Update ${articleBeforeEdit.title}?`,
          buttons: [
            {
              text: 'Cancel',
              class: ModalButtonClassTypes.DEFAULT,
              action: ModalButtonActionTypes.UPDATE_ARTICLE_CANCEL,
            },
            {
              text: 'Update',
              class: ModalButtonClassTypes.CONFIRM_GREEN,
              action: ModalButtonActionTypes.UPDATE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ content });
      })
    )
  );

  openDeleteArticleModal$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.deleteArticleSelected),
      map(({ articleToDelete }) => {
        const modalContent: ModalContent = {
          title: 'Confirm article deletion',
          body: `Update ${articleToDelete.title}?`,
          buttons: [
            {
              text: 'Cancel',
              class: ModalButtonClassTypes.DEFAULT,
              action: ModalButtonActionTypes.DELETE_ARTICLE_CANCEL,
            },
            {
              text: 'Delete',
              class: ModalButtonClassTypes.CONFIRM_RED,
              action: ModalButtonActionTypes.DELETE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ content: modalContent });
      })
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
