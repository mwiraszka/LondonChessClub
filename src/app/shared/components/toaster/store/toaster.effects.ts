import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map } from 'rxjs/operators';

import { AuthActions } from '@app/core/auth';
import { ArticleEditorScreenActions, ArticleGridActions } from '@app/screens/articles';
import { MemberEditorScreenActions, MemberListScreenActions } from '@app/screens/members';
import { Toast, ToastTypes } from '@app/shared/components/toast';

import * as ToasterActions from './toaster.actions';

@Injectable()
export class ToasterEffects {
  // ARTICLES -------------------------------------------------------------------------------------
  addPublishArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorScreenActions.publishArticleSucceeded),
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
      ofType(ArticleEditorScreenActions.publishArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to publish article',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleEditorScreenActions.updateArticleSucceeded),
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
      ofType(ArticleEditorScreenActions.updateArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to update article',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.deleteArticleSucceeded),
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
      ofType(ArticleGridActions.deleteArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to delete article',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLoadArticlesFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticleGridActions.loadArticlesFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to load articles',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  // MEMBERS --------------------------------------------------------------------------------------
  addAddMemberSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorScreenActions.addMemberSucceeded),
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
      ofType(MemberEditorScreenActions.addMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to add member',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateMemberSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberEditorScreenActions.updateMemberSucceeded),
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
      ofType(MemberEditorScreenActions.updateMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to update member',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteMemberSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.deleteMemberSucceeded),
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
      ofType(MemberListScreenActions.deleteMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to delete Member',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLoadMembersFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MemberListScreenActions.loadMembersFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to load members',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  // AUTH ---------------------------------------------------------------------------------------
  addLoginSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Login',
          message: 'Successfully logged in',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLogoutSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Logout',
          message: 'Successfully logged out',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addResendVerificationLinkSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resendVerificationLinkSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Verification link',
          message:
            'Verification link successfully sent to the email used to register this LCC account',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  // EXPIRE ---------------------------------------------------------------------------------------
  expireToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ToasterActions.toastAdded),
      delay(5000),
      map(({ toast }) => ToasterActions.toastExpired({ toast }))
    )
  );

  constructor(private actions$: Actions) {}
}
