import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { delay, filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { MembersActions } from '@app/store/members';
import { type Toast, ToastTypes } from '@app/types';

import { environment } from '@env';

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
          message: `Successfully published ${article.title} and updated database`,
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
          message: `Successfully updated ${article.title} in the database`,
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

  addDeleteArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      map(({ article }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `Successfully deleted ${article.title} from the database`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addFetchArticlesFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticlesFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ errorResponse }]) => {
        const toast: Toast = {
          title: 'Load articles',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addFetchArticleFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.fetchArticleFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ errorResponse }]) => {
        const toast: Toast = {
          title: 'Load article',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
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
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addAddEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.addEventFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'New event',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventSucceeded),
      map(({ event }) => {
        const toast: Toast = {
          title: 'Event update',
          message: `Successfully updated ${event.title} in the database`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.updateEventFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'Event update',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
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
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: errorResponse.error,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addFetchEventsFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventsFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ errorResponse }]) => {
        const toast: Toast = {
          title: 'Load events',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addFetchEventFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.fetchEventFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ errorResponse }]) => {
        const toast: Toast = {
          title: 'Load event',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
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
          message: `Successfully added ${member.firstName} ${member.lastName} to the database`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addAddMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.addMemberFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'New member',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
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
          message: `Successfully updated ${member.firstName} ${member.lastName} in the database`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addUpdateMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.updateMemberFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'Member update',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
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
          message: `Successfully deleted ${member.firstName} ${member.lastName} from the database`,
          type: ToastTypes.SUCCESS,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberFailed),
      map(({ errorResponse }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addFetchMembersFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMembersFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ errorResponse }]) => {
        const toast: Toast = {
          title: 'Load members',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
          type: ToastTypes.WARNING,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addFetchMemberFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.fetchMemberFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ errorResponse }]) => {
        const toast: Toast = {
          title: 'Load member',
          message: `[${errorResponse.status}] ${errorResponse.error}`,
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

  addNewPasswordChallengeRequestedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.newPasswordChallengeRequested),
      map(({ user }) => {
        const toast: Toast = {
          title: `Welcome, ${user.firstName}`,
          message: "Just need to create a new password and you're all set!",
          type: ToastTypes.INFO,
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
          message: 'A 6-digit code has been sent to your email',
          type: ToastTypes.INFO,
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

  //#region Local storage
  addLocalStorageDetectedUnsupportedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ToasterActions.localStorageDetectedUnsupported),
      map(() => {
        const toast: Toast = {
          title: 'Unsupported local storage',
          message: `
            Local storage is not supported on this browser,
            which just means some fancy features may not work as expected.
          `,
          type: ToastTypes.INFO,
        };
        return ToasterActions.toastAdded({ toast });
      }),
    );
  });

  addLocalStorageDetectedFullToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ToasterActions.localStorageDetectedFull),
      map(({ fileSize }) => {
        const toast: Toast = {
          title: 'Local storage quota exceeded',
          message: `
            Oops! File (${fileSize}) does not fit in your browser's local storage - try a smaller file.
          `,
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
      delay(4900),
      map(({ toast }) => ToasterActions.toastExpired({ toast })),
    );
  });

  displayErrorNotificationInConsole$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
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
        tap(error => console.info('[LCC Error]', error)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {}
}
