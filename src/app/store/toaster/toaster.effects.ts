import { Actions, createEffect, ofType } from '@ngrx/effects';
import { delay, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { MembersActions } from '@app/store/members';
import { ScheduleActions } from '@app/store/schedule';
import { type Toast, ToastTypes } from '@app/types';

import * as ToasterActions from './toaster.actions';

@Injectable()
export class ToasterEffects {
  //#region Articles
  addPublishArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleSucceeded),
      map(({ article }) => {
        const toast: Toast = {
          title: 'New article',
          message: `Successfully published ${article.title}`,
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
      map(({ article }) => {
        const toast: Toast = {
          title: 'Article update',
          message: `Successfully updated ${article.title}`,
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
          title: 'Article image URL',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addGetArticleThumbnailImageUrlsFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleThumbnailImageUrlsFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Article thumbnail image URLs',
          message: error.message,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addGetArticleImageFileFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.getArticleImageFileFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Article image file',
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
      map(({ article }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `Successfully deleted ${article.title}`,
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

  addFetchArticlesFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticlesFailed),
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

  addFetchArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load article',
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
      map(({ member }) => {
        const toast: Toast = {
          title: 'New member',
          message: `Successfully added ${member.firstName} ${member.lastName}`,
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
      map(({ member }) => {
        const toast: Toast = {
          title: 'Member update',
          message: `Successfully updated ${member.firstName} ${member.lastName}`,
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
      map(({ member }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: `Successfully deleted ${member.firstName} ${member.lastName}`,
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

  addFetchMembersFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMembersFailed),
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

  addFetchMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load member',
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
      map(({ event }) => {
        const toast: Toast = {
          title: 'New event',
          message: `Successfully added ${event.title}`,
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
      map(({ event }) => {
        const toast: Toast = {
          title: 'Event update',
          message: `Successfully updated ${event.title}`,
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
      map(({ event }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: `Successfully deleted ${event.title}`,
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

  addFetchEventsFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.fetchEventsFailed),
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

  addFetchEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ScheduleActions.fetchEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load event',
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
          title: 'Admin login',
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
          title: 'Admin login',
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
          title: 'Admin logout',
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

  constructor(private readonly actions$: Actions) {}
}
