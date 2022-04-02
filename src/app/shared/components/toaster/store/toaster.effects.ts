import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map } from 'rxjs/operators';

import { ArticleEditorActions, ArticleListActions } from '@app/pages/articles';
import { MemberEditorActions, MemberListActions } from '@app/pages/members';
import { Toast, ToastTypes } from '@app/shared/components/toast';

import * as ToasterActions from './toaster.actions';

@Injectable()
export class ToasterEffects {
  // ARTICLES -------------------------------------------------------------------------------------
  addPublishArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.publishArticleSucceeded),
      map(({ publishedArticle }) => {
        const toast: Toast = {
          title: 'Article published',
          message: `Successfully published ${publishedArticle.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addPublishArticleFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.publishArticleFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to publish article',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.updateArticleSucceeded),
      map(({ updatedArticle }) => {
        const toast: Toast = {
          title: 'Article updated',
          message: `Successfully updated ${updatedArticle.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateArticleFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorActions.updateArticleFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to update article',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.deleteArticleSucceeded),
      map(({ deletedArticle }) => {
        const toast: Toast = {
          title: 'Article deleted',
          message: `Successfully deleted ${deletedArticle.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteArticleFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.deleteArticleFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to delete article',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLoadArticlesFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleListActions.loadArticlesFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to load articles',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  // MEMBERS --------------------------------------------------------------------------------------
  addAddMemberSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.addMemberSucceeded),
      map(({ addedMember }) => {
        const toast: Toast = {
          title: 'Member added',
          message: `Successfully added ${addedMember.firstName} ${addedMember.lastName}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addAddMemberFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.addMemberFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to add member',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateMemberSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.updateMemberSucceeded),
      map(({ updatedMember }) => {
        const toast: Toast = {
          title: 'Member updated',
          message: `Successfully updated ${updatedMember.firstName} ${updatedMember.lastName}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateMemberFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorActions.updateMemberFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to update member',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteMemberSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.deleteMemberSucceeded),
      map(({ deletedMember }) => {
        const toast: Toast = {
          title: 'Member deleted',
          message: `Successfully deleted ${deletedMember.firstName} ${deletedMember.lastName}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteMemberFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.deleteMemberFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to delete Member',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLoadMembersFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListActions.loadMembersFailed),
      map(({ errorMessage }) => {
        const toast: Toast = {
          title: 'Failed to load members',
          message: `${errorMessage}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  // EXPIRE ---------------------------------------------------------------------------------------
  expireToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToasterActions.toastAdded),
      delay(3000),
      map(({ toast }) => ToasterActions.toastExpired({ toast }))
    )
  );

  constructor(private actions$: Actions) {}
}
