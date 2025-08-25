import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { Store } from '@ngrx/store';
import { ActionCreator } from '@ngrx/store';
import moment from 'moment-timezone';
import { timer } from 'rxjs';
import { filter, map, mergeMap, take, tap, withLatestFrom } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { CallState, LccError, Toast } from '@app/models';
import { ToastService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions, AuthSelectors } from '@app/store/auth';
import { EventsActions, EventsSelectors } from '@app/store/events';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { MembersActions, MembersSelectors } from '@app/store/members';
import { NavActions } from '@app/store/nav';
import { isDefined } from '@app/utils';

import { environment } from '@env';

import { AppActions, AppSelectors } from '.';

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
    ArticlesActions.fetchFilteredArticlesFailed,
    ArticlesActions.fetchHomePageArticlesFailed,
    ArticlesActions.publishArticleFailed,
    ArticlesActions.publishArticleSucceeded,
    ArticlesActions.requestTimedOut,
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
    AuthActions.requestTimedOut,

    EventsActions.addEventFailed,
    EventsActions.addEventSucceeded,
    EventsActions.deleteEventFailed,
    EventsActions.deleteEventSucceeded,
    EventsActions.fetchEventFailed,
    EventsActions.fetchEventsFailed,
    EventsActions.requestTimedOut,
    EventsActions.updateEventFailed,
    EventsActions.updateEventSucceeded,

    ImagesActions.addImageFailed,
    ImagesActions.addImagesFailed,
    ImagesActions.addImageSucceeded,
    ImagesActions.addImagesSucceeded,
    ImagesActions.automaticAlbumCoverSwitchFailed,
    ImagesActions.automaticAlbumCoverSwitchSucceeded,
    ImagesActions.deleteAlbumFailed,
    ImagesActions.deleteAlbumSucceeded,
    ImagesActions.deleteImageFailed,
    ImagesActions.deleteImageSucceeded,
    ImagesActions.fetchAllImagesMetadataFailed,
    ImagesActions.fetchBatchThumbnailsFailed,
    ImagesActions.fetchFilteredThumbnailsFailed,
    ImagesActions.fetchMainImageFailed,
    ImagesActions.imageFileActionFailed,
    ImagesActions.requestTimedOut,
    ImagesActions.updateAlbumFailed,
    ImagesActions.updateImageFailed,
    ImagesActions.updateAlbumSucceeded,
    ImagesActions.updateImageSucceeded,

    MembersActions.addMemberFailed,
    MembersActions.addMemberSucceeded,
    MembersActions.deleteMemberFailed,
    MembersActions.deleteMemberSucceeded,
    MembersActions.exportMembersToCsvFailed,
    MembersActions.exportMembersToCsvSucceeded,
    MembersActions.fetchMemberFailed,
    MembersActions.fetchAllMembersFailed,
    MembersActions.fetchFilteredMembersFailed,
    MembersActions.parseMemberRatingsFromCsvFailed,
    MembersActions.requestTimedOut,
    MembersActions.updateMemberFailed,
    MembersActions.updateMemberSucceeded,
    MembersActions.updateMemberRatingsSucceeded,
    MembersActions.updateMemberRatingsFailed,

    NavActions.pageAccessDenied,
  ] as const;

  readonly SUPPRESSED_TOASTS_IN_PROD = [
    ArticlesActions.fetchFilteredArticlesFailed,
    ArticlesActions.fetchHomePageArticlesFailed,
    ArticlesActions.fetchArticleFailed,

    EventsActions.fetchEventsFailed,
    EventsActions.fetchEventFailed,

    ImagesActions.fetchAllImagesMetadataFailed,
    ImagesActions.fetchBatchThumbnailsFailed,
    ImagesActions.fetchFilteredThumbnailsFailed,
    ImagesActions.fetchMainImageFailed,

    MembersActions.fetchAllMembersFailed,
    MembersActions.fetchFilteredMembersFailed,
    MembersActions.fetchMemberFailed,
  ] as const;

  readonly REQUEST_TIMEOUT_MS = 10000;

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

  reinstateUpcomingEventBanner$ = createEffect(() =>
    this.store.select(AppSelectors.selectBannerLastCleared).pipe(
      take(1),
      filter(
        bannerLastCleared =>
          isDefined(bannerLastCleared) && moment().diff(bannerLastCleared, 'days') > 0,
      ),
      map(() => AppActions.upcomingEventBannerReinstated()),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly toastService: ToastService,
  ) {}

  private readonly articlesRequested = [
    ArticlesActions.fetchFilteredArticlesRequested,
    ArticlesActions.fetchHomePageArticlesRequested,
    ArticlesActions.fetchArticleRequested,
    ArticlesActions.publishArticleRequested,
    ArticlesActions.updateArticleRequested,
    ArticlesActions.updateArticleBookmarkRequested,
    ArticlesActions.deleteArticleRequested,
  ];

  private readonly eventsRequested = [
    EventsActions.fetchEventsRequested,
    EventsActions.fetchEventRequested,
    EventsActions.addEventRequested,
    EventsActions.updateEventRequested,
    EventsActions.deleteEventRequested,
  ];

  private readonly imagesRequested = [
    ImagesActions.fetchAllImagesMetadataRequested,
    ImagesActions.fetchFilteredThumbnailsRequested,
    ImagesActions.fetchBatchThumbnailsRequested,
    ImagesActions.fetchMainImageRequested,
    ImagesActions.addImageRequested,
    ImagesActions.addImagesRequested,
    ImagesActions.updateImageRequested,
    ImagesActions.updateAlbumRequested,
    ImagesActions.deleteImageRequested,
    ImagesActions.deleteAlbumRequested,
  ];

  private readonly membersRequested = [
    MembersActions.fetchAllMembersRequested,
    MembersActions.fetchFilteredMembersRequested,
    MembersActions.fetchMemberRequested,
    MembersActions.addMemberRequested,
    MembersActions.updateMemberRequested,
    MembersActions.deleteMemberRequested,
    MembersActions.updateMemberRatingsRequested,
    MembersActions.exportMembersToCsvRequested,
  ];

  private readonly authRequested = [
    AuthActions.loginRequested,
    AuthActions.logoutRequested,
    AuthActions.codeForPasswordChangeRequested,
    AuthActions.passwordChangeRequested,
  ];

  private createTimeoutEffect(
    requestedActions: ActionCreator[],
    selectCallState: (state: object) => CallState,
    timeoutAction: () => { type: string },
  ) {
    return createEffect(
      () =>
        this.actions$.pipe(
          ofType(...requestedActions),
          withLatestFrom(this.store.select(selectCallState)),
          map(([, callState]) => callState.loadStart),
          filter(isDefined),
          mergeMap(loadStart =>
            timer(this.REQUEST_TIMEOUT_MS).pipe(
              withLatestFrom(this.store.select(selectCallState)),
              filter(([, latest]) => {
                return (
                  latest.status === 'loading' &&
                  !!latest.loadStart &&
                  latest.loadStart === loadStart &&
                  Date.now() - new Date(latest.loadStart).getTime() >=
                    this.REQUEST_TIMEOUT_MS
                );
              }),
              map(() => timeoutAction()),
            ),
          ),
        ),
      { dispatch: true },
    );
  }

  // Individual timeout effects per feature slice
  articlesTimeout$ = this.createTimeoutEffect(
    this.articlesRequested,
    ArticlesSelectors.selectCallState,
    () => ArticlesActions.requestTimedOut(),
  );

  authTimeout$ = this.createTimeoutEffect(
    this.authRequested,
    AuthSelectors.selectCallState,
    () => AuthActions.requestTimedOut(),
  );

  eventsTimeout$ = this.createTimeoutEffect(
    this.eventsRequested,
    EventsSelectors.selectCallState,
    () => EventsActions.requestTimedOut(),
  );

  imagesTimeout$ = this.createTimeoutEffect(
    this.imagesRequested,
    ImagesSelectors.selectCallState,
    () => ImagesActions.requestTimedOut(),
  );

  membersTimeout$ = this.createTimeoutEffect(
    this.membersRequested,
    MembersSelectors.selectCallState,
    () => MembersActions.requestTimedOut(),
  );

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
      case ArticlesActions.fetchFilteredArticlesFailed.type:
        return {
          title: 'Load articles',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ArticlesActions.fetchHomePageArticlesFailed.type:
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
      case ArticlesActions.requestTimedOut.type:
        return {
          title: 'Articles request',
          message: 'Request timed out',
          type: 'warning',
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
      case AuthActions.requestTimedOut.type:
        return {
          title: 'Auth request',
          message: 'Request timed out',
          type: 'warning',
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
      case EventsActions.requestTimedOut.type:
        return {
          title: 'Events request',
          message: 'Request timed out',
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
          message: `Failed to add image: ${this.getErrorMessage(action.error)}`,
          type: 'warning',
        };
      case ImagesActions.addImagesFailed.type:
        return {
          title: 'Add images',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.addImageSucceeded.type:
        return {
          title: 'Add image',
          message: `Successfully uploaded ${action.image.filename}`,
          type: 'success',
        };
      case ImagesActions.addImagesSucceeded.type:
        return {
          title: 'Add images',
          message: `Successfully uploaded ${action.images.length === 1 ? '1 image' : `${action.images.length} images`}`,
          type: 'success',
        };
      case ImagesActions.automaticAlbumCoverSwitchFailed.type:
        return {
          title: 'Album cover update',
          message: `Failed to automatically switch album cover for ${action.album}: ${this.getErrorMessage(action.error)}`,
          type: 'warning',
        };
      case ImagesActions.automaticAlbumCoverSwitchSucceeded.type:
        return {
          title: 'Album cover update',
          message: `Automatically switched ${action.baseImage.album} album cover to ${action.baseImage.filename}`,
          type: 'info',
        };
      case ImagesActions.deleteAlbumFailed.type:
        return {
          title: 'Album deletion',
          message: `Failed to delete ${action.album}: ${this.getErrorMessage(action.error)}`,
          type: 'warning',
        };
      case ImagesActions.deleteAlbumSucceeded.type:
        return {
          title: 'Album deletion',
          message: `Successfully deleted ${action.album} and all ${action.imageIds.length} of its images`,
          type: 'success',
        };
      case ImagesActions.deleteImageFailed.type:
        return {
          title: 'Image deletion',
          message: `Failed to delete ${action.image.filename}: ${this.getErrorMessage(action.error)}`,
          type: 'warning',
        };
      case ImagesActions.deleteImageSucceeded.type:
        return {
          title: 'Image deletion',
          message: `Successfully deleted ${action.image.filename}`,
          type: 'success',
        };
      case ImagesActions.fetchAllImagesMetadataFailed.type:
        return {
          title: "Fetch images' metadata",
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.fetchBatchThumbnailsFailed.type:
        return {
          title: 'Fetch images',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.fetchFilteredThumbnailsFailed.type:
        return {
          title: 'Fetch images',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.fetchMainImageFailed.type:
        return {
          title: 'Fetch image',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.imageFileActionFailed.type:
        return {
          title: 'Image file',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case ImagesActions.requestTimedOut.type:
        return {
          title: 'Images request',
          message: 'Request timed out',
          type: 'warning',
        };
      case ImagesActions.updateAlbumFailed.type:
        return {
          title: 'Album update',
          message: `Failed to update album ${action.album}: ${this.getErrorMessage(action.error)}`,
          type: 'warning',
        };
      case ImagesActions.updateAlbumSucceeded.type:
        return {
          title: 'Album update',
          message: `Successfully updated ${action.album}`,
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
      case MembersActions.exportMembersToCsvFailed.type:
        return {
          title: 'CSV export',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.exportMembersToCsvSucceeded.type:
        return {
          title: 'CSV export',
          message: `Successfully exported ${action.exportedCount} members to CSV`,
          type: 'success',
        };
      case MembersActions.fetchMemberFailed.type:
        return {
          title: 'Load member',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.fetchAllMembersFailed.type:
        return {
          title: 'Load members',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.fetchFilteredMembersFailed.type:
        return {
          title: 'Load members',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.parseMemberRatingsFromCsvFailed.type:
        return {
          title: 'CSV import',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.requestTimedOut.type:
        return {
          title: 'Members request',
          message: 'Request timed out',
          type: 'warning',
        };
      case MembersActions.updateMemberFailed.type:
        return {
          title: 'Member update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.updateMemberRatingsFailed.type:
        return {
          title: 'Members update',
          message: this.getErrorMessage(action.error),
          type: 'warning',
        };
      case MembersActions.updateMemberRatingsSucceeded.type:
        return {
          title: 'Members update',
          message: `Successfully updated ${action.members.length} members`,
          type: 'success',
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
