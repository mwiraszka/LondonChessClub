import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { delay, filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import type { LccError, Toast } from '@app/models';
import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { ImagesActions } from '@app/store/images';
import { MembersActions } from '@app/store/members';
import { NavActions } from '@app/store/nav';

import { environment } from '@env';

import { NotificationsActions } from '.';

@Injectable()
export class NotificationsEffects {
  // TODO: Streamline toast flow with a generalized Notification Service

  //#region Navigation
  addPageAccessDeniedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(NavActions.pageAccessDenied),
      map(({ pageTitle }) => {
        const toast: Toast = {
          title: 'Access denied',
          message: `Please log in as admin to access ${pageTitle} page`,
          type: 'info',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  //#region Articles
  addPublishArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.publishArticleSucceeded),
      map(({ article }) => {
        const toast: Toast = {
          title: 'New article',
          message: `Successfully published ${article.title} and updated database`,
          type: 'info',
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteArticleSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      map(({ articleTitle }) => {
        const toast: Toast = {
          title: 'Article deletion',
          message: `Successfully deleted ${articleTitle} from the database`,
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteEventSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(EventsActions.deleteEventSucceeded),
      map(({ eventTitle }) => {
        const toast: Toast = {
          title: 'Event deletion',
          message: `Successfully deleted ${eventTitle} from the database`,
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });
  //#endregion

  // #region Images
  addAddImageSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImageSucceeded),
      map(({ image }) => {
        const toast: Toast = {
          title: 'Add image',
          message: `Successfully uploaded ${image.filename}`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addAddImageFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.addImageFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Add image',
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteImageSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageSucceeded),
      map(({ imageFilename }) => {
        const toast: Toast = {
          title: 'Image deletion',
          message: `Successfully deleted image ${imageFilename}`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteImageFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.deleteImageFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Image deletion',
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addImageThumbnailsFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchImageThumbnailsFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load image thumbnails',
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addFetchImageFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.fetchImageFailed),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(([, isAdmin]) => isAdmin || !environment.production),
      map(([{ error }]) => {
        const toast: Toast = {
          title: 'Load image',
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addImageFileLoadSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.imageFileLoadSucceeded),
      map(({ numFiles }) => {
        const toast: Toast = {
          title: 'Load image file',
          message: `Successfully loaded ${numFiles} files into Image Explorer`,
          type: 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addImageFileLoadFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ImagesActions.imageFileLoadFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Load image file',
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addDeleteMemberSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MembersActions.deleteMemberSucceeded),
      map(({ memberName }) => {
        const toast: Toast = {
          title: 'Member deletion',
          message: `Successfully deleted ${memberName} from the database`,
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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
          message: this.getErrorMessage(error),
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

  addLoginFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loginFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Admin login',
          message: this.getErrorMessage(error),
          type: 'warning',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addLogoutSucceededToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutSucceeded),
      map(({ sessionExpired }) => {
        const toast: Toast = {
          title: 'Admin logout',
          message: sessionExpired
            ? 'Session expired - please log back in'
            : 'Successfully logged out',
          type: sessionExpired ? 'info' : 'success',
        };
        return NotificationsActions.toastAdded({ toast });
      }),
    );
  });

  addLogoutFailedToast$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logoutFailed),
      map(({ error }) => {
        const toast: Toast = {
          title: 'Admin logout',
          message: this.getErrorMessage(error),
          type: 'warning',
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
          message: this.getErrorMessage(error),
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
          message: 'Successfully changed password and logged in',
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
          message: this.getErrorMessage(error),
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
          ArticlesActions.publishArticleFailed,
          ArticlesActions.updateArticleFailed,
          ArticlesActions.deleteArticleFailed,
          ArticlesActions.fetchArticlesFailed,
          ArticlesActions.fetchArticleFailed,
          AuthActions.loginFailed,
          AuthActions.logoutFailed,
          AuthActions.codeForPasswordChangeFailed,
          AuthActions.passwordChangeFailed,
          EventsActions.addEventFailed,
          EventsActions.updateEventFailed,
          EventsActions.deleteEventFailed,
          EventsActions.fetchEventsFailed,
          EventsActions.fetchEventFailed,
          ImagesActions.addImageFailed,
          ImagesActions.deleteImageFailed,
          ImagesActions.fetchImageFailed,
          ImagesActions.fetchImageThumbnailsFailed,
          ImagesActions.imageFileLoadFailed,
          MembersActions.addMemberFailed,
          MembersActions.updateMemberFailed,
          MembersActions.deleteMemberFailed,
          MembersActions.fetchMembersFailed,
          MembersActions.fetchMemberFailed,
        ),
        tap(({ error }) => console.error('[LCC]', error)),
      );
    },
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {}

  private getErrorMessage(error: LccError): string {
    return error.status ? `[${error.status}] ${error.message}` : error.message;
  }
}
