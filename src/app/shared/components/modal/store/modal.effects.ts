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
import { ModalButtonAction, ModalButtonStyle } from '../types/modal-button.model';

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
              style: ModalButtonStyle.SECONDARY,
              action: ModalButtonAction.ADD_MEMBER_CANCEL,
            },
            {
              text: 'Add',
              style: ModalButtonStyle.PRIMARY_SUCCESS,
              action: ModalButtonAction.ADD_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ modal });
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
              style: ModalButtonStyle.SECONDARY,
              action: ModalButtonAction.UPDATE_MEMBER_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyle.PRIMARY_SUCCESS,
              action: ModalButtonAction.UPDATE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ modal });
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
              style: ModalButtonStyle.SECONDARY,
              action: ModalButtonAction.DELETE_MEMBER_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyle.PRIMARY_WARNING,
              action: ModalButtonAction.DELETE_MEMBER_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ modal });
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
              style: ModalButtonStyle.SECONDARY,
              action: ModalButtonAction.PUBLISH_ARTICLE_CANCEL,
            },
            {
              text: 'Publish',
              style: ModalButtonStyle.PRIMARY_SUCCESS,
              action: ModalButtonAction.PUBLISH_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ modal });
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
              style: ModalButtonStyle.SECONDARY,
              action: ModalButtonAction.UPDATE_ARTICLE_CANCEL,
            },
            {
              text: 'Update',
              style: ModalButtonStyle.PRIMARY_SUCCESS,
              action: ModalButtonAction.UPDATE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ modal });
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
              style: ModalButtonStyle.SECONDARY,
              action: ModalButtonAction.DELETE_ARTICLE_CANCEL,
            },
            {
              text: 'Delete',
              style: ModalButtonStyle.PRIMARY_WARNING,
              action: ModalButtonAction.DELETE_ARTICLE_OK,
            },
          ],
        };
        return ModalActions.modalCreated({ modal });
      })
    )
  );

  broadcastSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ModalActions.selectionMade),
      filter(
        ({ action }) =>
          action === ModalButtonAction.ADD_MEMBER_OK ||
          action === ModalButtonAction.ADD_MEMBER_CANCEL ||
          action === ModalButtonAction.UPDATE_MEMBER_OK ||
          action === ModalButtonAction.UPDATE_MEMBER_CANCEL ||
          action === ModalButtonAction.DELETE_MEMBER_OK ||
          action === ModalButtonAction.DELETE_MEMBER_CANCEL ||
          action === ModalButtonAction.PUBLISH_ARTICLE_OK ||
          action === ModalButtonAction.PUBLISH_ARTICLE_CANCEL ||
          action === ModalButtonAction.UPDATE_ARTICLE_OK ||
          action === ModalButtonAction.UPDATE_ARTICLE_CANCEL ||
          action === ModalButtonAction.DELETE_ARTICLE_OK ||
          action === ModalButtonAction.DELETE_ARTICLE_CANCEL
      ),
      map(({ action }) => {
        switch (action) {
          case ModalButtonAction.ADD_MEMBER_OK:
            return MemberEditorActions.addMemberConfirmed();
          case ModalButtonAction.ADD_MEMBER_CANCEL:
            return MemberEditorActions.addMemberCancelled();
          case ModalButtonAction.UPDATE_MEMBER_OK:
            return MemberEditorActions.updateMemberConfirmed();
          case ModalButtonAction.UPDATE_MEMBER_CANCEL:
            return MemberEditorActions.updateMemberCancelled();
          case ModalButtonAction.DELETE_MEMBER_OK:
            return MemberListActions.deleteMemberConfirmed();
          case ModalButtonAction.DELETE_MEMBER_CANCEL:
            return MemberListActions.deleteMemberCancelled();
          case ModalButtonAction.PUBLISH_ARTICLE_OK:
            return ArticleEditorActions.publishArticleConfirmed();
          case ModalButtonAction.PUBLISH_ARTICLE_CANCEL:
            return ArticleEditorActions.publishArticleCancelled();
          case ModalButtonAction.UPDATE_ARTICLE_OK:
            return ArticleEditorActions.updateArticleConfirmed();
          case ModalButtonAction.UPDATE_ARTICLE_CANCEL:
            return ArticleEditorActions.updateArticleCancelled();
          case ModalButtonAction.DELETE_ARTICLE_OK:
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
        filter(({ action }) => action === ModalButtonAction.ACTIVATE_VERSION_UPDATE),
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
