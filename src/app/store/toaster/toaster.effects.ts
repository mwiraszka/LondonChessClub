import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map } from 'rxjs/operators';

import { Toast, ToastTypes } from '@app/types';
import { ArticlesActions } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions } from '@app/store/schedule';

import * as ToasterActions from './toaster.actions';

@Injectable()
export class ToasterEffects {
  // ARTICLES -------------------------------------------------------------------------------------
  addPublishArticleSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.publishArticleSucceeded),
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
      ofType(ArticlesActions.publishArticleFailed),
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
      ofType(ArticlesActions.updateArticleSucceeded),
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
      ofType(ArticlesActions.updateArticleFailed),
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
      ofType(ArticlesActions.deleteArticleSucceeded),
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
      ofType(ArticlesActions.deleteArticleFailed),
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
      ofType(ArticlesActions.loadArticlesFailed),
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
      ofType(MembersActions.addMemberSucceeded),
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
      ofType(MembersActions.addMemberFailed),
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
      ofType(MembersActions.updateMemberSucceeded),
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
      ofType(MembersActions.updateMemberFailed),
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
      ofType(MembersActions.deleteMemberSucceeded),
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
      ofType(MembersActions.deleteMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to delete member',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLoadMembersFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MembersActions.loadMembersFailed),
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

  // SCHEDULE --------------------------------------------------------------------------------------
  addAddEventSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addEventSucceeded),
      map(({ addedEvent }) => {
        const toast: Toast = {
          title: 'Event added to schedule',
          message: `Successfully added ${addedEvent.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addAddEventFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.addEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to add event to schedule',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateEventSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.updateEventSucceeded),
      map(({ updatedEvent }) => {
        const toast: Toast = {
          title: 'Event updated in schedule',
          message: `Successfully updated ${updatedEvent.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addUpdateEventFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.updateEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to update event in schedule',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteEventSucceededToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.deleteEventSucceeded),
      map(({ deletedEvent }) => {
        const toast: Toast = {
          title: 'Event deleted from schedule',
          message: `Successfully deleted ${deletedEvent.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addDeleteEventFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.deleteEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to delete event from schedule',
          message: `${error.message}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      })
    )
  );

  addLoadEventsFailedToast$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ScheduleActions.loadEventsFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Failed to load events',
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
