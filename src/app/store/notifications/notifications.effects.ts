import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { delay, filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { AppActions } from '@app/store/app';
import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { MembersActions } from '@app/store/members';
import type { Toast } from '@app/types';

import { environment } from '@env';

import * as NotificationsActions from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  // TODO: Streamline toast flow with a generalized Notification Service

  //#region Articles
  addPublishArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleSucceeded),
      map(({ article }) => {
        const toast: Toast = {
          title: 'New article',
          message: `Successfully published ${article.title} and updated database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.updateArticleSucceeded),
      map(({ originalArticleTitle }) => {
        const toast: Toast = {
          title: 'Article update',
          message: `Successfully updated ${originalArticleTitle} in the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      map(({ article }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `Successfully deleted ${article.title} from the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchArticlesFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticlesFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load articles',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load article',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  //#region Events
  addAddEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.addEventSucceeded),
      map(({ event }) => {
        const toast: Toast = {
          title: 'New event',
          message: `Successfully added ${event.title} to the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addAddEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.addEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'New event',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventSucceeded),
      map(({ originalEventTitle }) => {
        const toast: Toast = {
          title: 'Event update',
          message: `Successfully updated ${originalEventTitle} in the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Event update',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventSucceeded),
      map(({ event }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: `Successfully deleted ${event.title} from the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchEventsFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventsFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load events',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load event',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
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
          message: `Successfully added ${member.firstName} ${member.lastName} to the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addAddMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'New member',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateMemberSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberSucceeded),
      map(({ originalMemberName }) => {
        const toast: Toast = {
          title: 'Member update',
          message: `Successfully updated ${originalMemberName} in the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Member update',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteMemberSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberSucceeded),
      map(({ member }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: `Successfully deleted ${member.firstName} ${member.lastName} from the database`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchMembersFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMembersFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load members',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load member',
          message: `[${error.status}] ${error.message}`,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addNewPasswordChallengeRequestedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.newPasswordChallengeRequested),
      map(({ user }) => {
        const toast: Toast = {
          title: `Welcome, ${user.firstName}`,
          message: "Just need to create a new password and you're all set!",
          type: 'info',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addSendPasswordChangeCodeSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.codeForPasswordChangeSucceeded),
      map(() => {
        const toast: Toast = {
          title: 'Password change',
          message: 'A 6-digit code has been sent to your email',
          type: 'info',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
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
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  //#region Local storage
  addLocalStorageDetectedUnsupportedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.localStorageDetectedUnsupported),
      map(() => {
        const toast: Toast = {
          title: 'Unsupported local storage',
          message: `
            Local storage is not supported on this browser,
            which just means some fancy features may not work as expected.
          `,
          type: 'info',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addLocalStorageDetectedFullToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AppActions.localStorageDetectedFull),
      map(({ fileSize }) => {
        const toast: Toast = {
          title: 'Local storage quota exceeded',
          message: `
            Oops! File (${fileSize}) does not fit in your browser's local storage - try a smaller file.
          `,
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  expireToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NotificationsActions.toastAdded),
      delay(4900),
      map(({ toast }) => NotificationsActions.toastExpired({ toast })),
    );
  });

  displayErrorNotificationInConsole$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          AppActions.deleteImageFailed,
          ArticlesActions.publishArticleFailed,
          ArticlesActions.updateArticleFailed,
          ArticlesActions.deleteArticleFailed,
          ArticlesActions.fetchArticlesFailed,
          ArticlesActions.fetchArticleFailed,
          EventsActions.addEventFailed,
          EventsActions.updateEventFailed,
          EventsActions.deleteEventFailed,
          EventsActions.fetchEventsFailed,
          EventsActions.fetchEventFailed,
          MembersActions.addMemberFailed,
          MembersActions.updateMemberFailed,
          MembersActions.deleteMemberFailed,
          MembersActions.fetchMembersFailed,
          MembersActions.fetchMemberFailed,
          AuthActions.loginFailed,
          AuthActions.codeForPasswordChangeFailed,
          AuthActions.passwordChangeFailed,
        ),
        tap(error => console.error('[LCC]', error)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {}
}
