import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { filter, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { LccError, Toast } from '@app/models';
import { ToastService } from '@app/services';
import { ArticlesActions } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { ImagesActions } from '@app/store/images';
import { MembersActions } from '@app/store/members';
import { NavActions } from '@app/store/nav';
import { isDefined } from '@app/utils';

import { environment } from '@env';

import { AppActions } from '.';

type NotifyAction = ReturnType<
  | (typeof ArticlesActions)[keyof typeof ArticlesActions]
  | (typeof AuthActions)[keyof typeof AuthActions]
  | (typeof EventsActions)[keyof typeof EventsActions]
  | (typeof ImagesActions)[keyof typeof ImagesActions]
  | (typeof MembersActions)[keyof typeof MembersActions]
  | (typeof NavActions)[keyof typeof NavActions]
>;

@Injectable()
export class AppEffects {
  readonly ACTIONS_TO_NOTIFY = [
    ArticlesActions.deleteArticleFailed,
    ArticlesActions.deleteArticleSucceeded,
    ArticlesActions.fetchArticleFailed,
    ArticlesActions.fetchArticlesFailed,
    ArticlesActions.publishArticleFailed,
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.updateArticleFailed,
    ArticlesActions.updateArticleSucceeded,
    AuthActions.codeForPasswordChangeFailed,
    AuthActions.codeForPasswordChangeSucceeded,
    AuthActions.loginFailed,
    AuthActions.loginSucceeded,
    AuthActions.logoutFailed,
    AuthActions.logoutSucceeded,
    AuthActions.passwordChangeFailed,
    AuthActions.passwordChangeSucceeded,
    EventsActions.addEventFailed,
    EventsActions.addEventSucceeded,
    EventsActions.deleteEventFailed,
    EventsActions.deleteEventSucceeded,
    EventsActions.fetchEventFailed,
    EventsActions.fetchEventsFailed,
    EventsActions.updateEventFailed,
    EventsActions.updateEventSucceeded,
    ImagesActions.addImageFailed,
    ImagesActions.addImageSucceeded,
    ImagesActions.deleteImageFailed,
    ImagesActions.deleteImageSucceeded,
    ImagesActions.fetchImageFailed,
    ImagesActions.fetchImageThumbnailsFailed,
    ImagesActions.fetchImagesForAlbumFailed,
    ImagesActions.imageFileLoadFailed,
    ImagesActions.imageFileLoadSucceeded,
    ImagesActions.updateCoverImageFailed,
    ImagesActions.updateCoverImageSucceeded,
    ImagesActions.updateImageFailed,
    ImagesActions.updateImageSucceeded,
    MembersActions.addMemberFailed,
    MembersActions.addMemberSucceeded,
    MembersActions.deleteMemberFailed,
    MembersActions.deleteMemberSucceeded,
    MembersActions.fetchMemberFailed,
    MembersActions.fetchMembersFailed,
    MembersActions.updateMemberFailed,
    MembersActions.updateMemberSucceeded,
    NavActions.pageAccessDenied,
  ] as const;

  readonly SUPPRESSED_TOASTS_IN_PROD = [
    ArticlesActions.fetchArticlesFailed,
    ArticlesActions.fetchArticleFailed,
    EventsActions.fetchEventsFailed,
    EventsActions.fetchEventFailed,
    ImagesActions.fetchImageThumbnailsFailed,
    ImagesActions.fetchImageFailed,
    MembersActions.fetchMembersFailed,
    MembersActions.fetchMemberFailed,
  ] as const;

  notify$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(...this.ACTIONS_TO_NOTIFY),
      tap(action => {
        if ('error' in action) {
          console.error('[LCC]', action.error);
        }
      }),
      concatLatestFrom(() => this.store.select(AuthSelectors.selectIsAdmin)),
      filter(
        ([action, isAdmin]) =>
          isAdmin ||
          !environment.production ||
          !this.SUPPRESSED_TOASTS_IN_PROD.some(
            actionCreator => actionCreator.type === action.type,
          ),
      ),
      map(([action]) => this.mapActionToToast(action)),
      filter(isDefined),
      tap(toast => this.toastService.displayToast(toast)),
      map(toast => AppActions.toastDisplayed({ toast })),
    );
  });

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly toastService: ToastService,
  ) {}

  private getErrorMessage(error: LccError): string {
    return error.status ? `[${error.status}] ${error.message}` : error.message;
  }

  private mapActionToToast(action: NotifyAction): Toast | null {
    switch (action.type) {
      case ArticlesActions.deleteArticleFailed.type:
        return {
          title: 'Article deletion',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ArticlesActions.deleteArticleSucceeded.type:
        return {
          title: 'Article deletion',
          message: `Successfully deleted ${action.articleTitle}`,
          type: 'success',
        };
      case ArticlesActions.fetchArticleFailed.type:
        return {
          title: 'Load article',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ArticlesActions.fetchArticlesFailed.type:
        return {
          title: 'Load articles',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ArticlesActions.publishArticleFailed.type:
        return {
          title: 'New article',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ArticlesActions.publishArticleSucceeded.type:
        return {
          title: 'New article',
          message: `Successfully published ${action.article.title}`,
          type: 'success',
        };
      case ArticlesActions.updateArticleFailed.type:
        return {
          title: 'Article update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ArticlesActions.updateArticleSucceeded.type:
        return {
          title: 'Article update',
          message: `Successfully updated ${action.originalArticleTitle}`,
          type: 'success',
        };
      case AuthActions.codeForPasswordChangeFailed.type:
        return {
          title: 'Password change',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case AuthActions.codeForPasswordChangeSucceeded.type:
        return {
          title: 'Password change',
          message: 'A 6-digit code has been sent to your email',
          type: 'info',
        };
      case AuthActions.loginFailed.type:
        return {
          title: 'Admin login',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case AuthActions.loginSucceeded.type:
        return {
          title: 'Admin login',
          message: 'Successfully logged in',
          type: 'success',
        };
      case AuthActions.logoutFailed.type:
        return {
          title: 'Admin logout',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case AuthActions.logoutSucceeded.type:
        return {
          title: 'Admin logout',
          message: action.sessionExpired
            ? 'Session expired - please log back in'
            : 'Successfully logged out',
          type: action.sessionExpired ? 'info' : 'success',
        };
      case AuthActions.passwordChangeFailed.type:
        return {
          title: 'Password change',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case AuthActions.passwordChangeSucceeded.type:
        return {
          title: 'Password change',
          message: 'Successfully changed password and logged in',
          type: 'success',
        };
      case EventsActions.addEventFailed.type:
        return {
          title: 'New event',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case EventsActions.addEventSucceeded.type:
        return {
          title: 'New event',
          message: `Successfully added ${action.event.title}`,
          type: 'success',
        };
      case EventsActions.deleteEventFailed.type:
        return {
          title: 'Event deletion',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case EventsActions.deleteEventSucceeded.type:
        return {
          title: 'Event deletion',
          message: `Successfully deleted ${action.eventTitle}`,
          type: 'success',
        };
      case EventsActions.fetchEventFailed.type:
        return {
          title: 'Load event',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case EventsActions.fetchEventsFailed.type:
        return {
          title: 'Load events',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case EventsActions.updateEventFailed.type:
        return {
          title: 'Event update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case EventsActions.updateEventSucceeded.type:
        return {
          title: 'Event update',
          message: `Successfully updated ${action.originalEventTitle}`,
          type: 'success',
        };
      case ImagesActions.addImageFailed.type:
        return {
          title: 'Add image',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.addImageSucceeded.type:
        return {
          title: 'Add image',
          message: `Successfully uploaded ${action.image.filename}`,
          type: 'success',
        };
      case ImagesActions.deleteImageFailed.type:
        return {
          title: 'Image deletion',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.deleteImageSucceeded.type:
        return {
          title: 'Image deletion',
          message: `Successfully deleted ${action.image.filename}`,
          type: 'success',
        };
      case ImagesActions.fetchImageFailed.type:
        return {
          title: 'Load image',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.fetchImageThumbnailsFailed.type:
        return {
          title: 'Load image thumbnails',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.fetchImagesForAlbumFailed.type:
        return {
          title: 'Load album images',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.imageFileLoadFailed.type:
        return {
          title: 'Load image file',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.imageFileLoadSucceeded.type:
        return {
          title: 'Load image file',
          message: `Successfully loaded ${action.numFiles} files into Image Explorer`,
          type: 'success',
        };
      case ImagesActions.updateCoverImageFailed.type:
        return {
          title: 'Image album cover update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.updateCoverImageSucceeded.type:
        return {
          title: 'Image album cover update',
          message: `Successfully switched ${action.baseImage.coverForAlbum} album cover to ${action.baseImage.filename}`,
          type: 'success',
        };
      case ImagesActions.updateImageFailed.type:
        return {
          title: 'Image update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.updateImageSucceeded.type:
        return {
          title: 'Image update',
          message: `Successfully updated ${action.baseImage.filename}`,
          type: 'success',
        };
      case MembersActions.addMemberFailed.type:
        return {
          title: 'New member',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.addMemberSucceeded.type:
        return {
          title: 'New member',
          message: `Successfully added ${action.member.firstName} ${action.member.lastName}`,
          type: 'success',
        };
      case MembersActions.deleteMemberFailed.type:
        return {
          title: 'Member deletion',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.deleteMemberSucceeded.type:
        return {
          title: 'Member deletion',
          message: `Successfully deleted ${action.memberName}`,
          type: 'success',
        };
      case MembersActions.fetchMemberFailed.type:
        return {
          title: 'Load member',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.fetchMembersFailed.type:
        return {
          title: 'Load members',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.updateMemberFailed.type:
        return {
          title: 'Member update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.updateMemberSucceeded.type:
        return {
          title: 'Member update',
          message: `Successfully updated ${action.originalMemberName}`,
          type: 'success',
        };
      case NavActions.pageAccessDenied.type:
        return {
          title: 'Access denied',
          message: `Please log in as admin to access ${action.pageTitle} page`,
          type: 'info',
        };

      default:
        console.warn('No toast mapping found for action:', action.type);
        return null;
    }
  }
}
