import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions } from '@app/store/schedule';
import { Toast, ToastTypes } from '@app/types';

import * as ToasterActions from './toaster.actions';

@Injectable()
export class ToasterEffects {
  //#region Articles
  addPublishArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleSucceeded),
      map(({ publishedArticle }) => {
        const toast: Toast = {
          title: 'New article',
          message: `Successfully published ${publishedArticle.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addPublishArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'New article',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleSucceeded),
      map(({ updatedArticle }) => {
        const toast: Toast = {
          title: 'Article update',
          message: `Successfully updated ${updatedArticle.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Article update',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addGetArticleImageUrlFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleImageUrlFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Article image',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      map(({ deletedArticle }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `Successfully deleted ${deletedArticle.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addLoadArticlesFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.loadArticlesFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load articles',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  //#region Members
  addAddMemberSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberSucceeded),
      map(({ addedMember }) => {
        const toast: Toast = {
          title: 'New member',
          message: `Successfully added ${addedMember.firstName} ${addedMember.lastName}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addAddMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'New member',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateMemberSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberSucceeded),
      map(({ updatedMember }) => {
        const toast: Toast = {
          title: 'Member update',
          message: `Successfully updated ${updatedMember.firstName} ${updatedMember.lastName}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Member update',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteMemberSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberSucceeded),
      map(({ deletedMember }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: `Successfully deleted ${deletedMember.firstName} ${deletedMember.lastName}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addLoadMembersFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.loadMembersFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load members',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  //#region Schedule
  addAddEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.addEventSucceeded),
      map(({ addedEvent }) => {
        const toast: Toast = {
          title: 'New event',
          message: `Successfully added ${addedEvent.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addAddEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.addEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'New event',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.updateEventSucceeded),
      map(({ updatedEvent }) => {
        const toast: Toast = {
          title: 'Event update',
          message: `Successfully updated ${updatedEvent.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.updateEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Event update',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.deleteEventSucceeded),
      map(({ deletedEvent }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: `Successfully deleted ${deletedEvent.title}`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.deleteEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addLoadEventsFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.loadEventsFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load events',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  //#region Auth
  addLoginSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Admin Login',
          message: 'Successfully logged in',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addLoginFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Login',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addLogoutSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Admin Logout',
          message: 'Successfully logged out',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addSendPasswordChangeCodeSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Password change',
          message: 'A 6-digit code has been sent to the email provided',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addSendPasswordChangeCodeFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Password change',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addChangePasswordSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordChangeSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Password change',
          message: 'Successfully changed password',
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addChangePasswordFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.passwordChangeFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Password change',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  expireToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ToasterActions.toastAdded),
      delay(5000),
      map(({ toast }) => ToasterActions.toastExpired({ toast })),
    );
  });

  constructor(private actions$: Actions) {}
}
