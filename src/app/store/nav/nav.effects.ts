import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatLatestFrom } from '@ngrx/operators';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ImageFileService } from '@app/services';
import { ArticlesActions, ArticlesSelectors } from '@app/store/articles';
import { AuthActions } from '@app/store/auth';
import { EventsActions } from '@app/store/events';
import { ImagesActions, ImagesSelectors } from '@app/store/images';
import { MembersActions } from '@app/store/members';
import { isDefined, isValidCollectionId } from '@app/utils';

import { NavActions, NavSelectors } from '.';

@Injectable()
export class NavEffects {
  appendPathToHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => NavActions.appendPathToHistory({ path: payload.event.url })),
    ),
  );

  redirectOnAccessDenied$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.pageAccessDenied),
        concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
        tap(([, previousPath]) => this.router.navigate([previousPath ?? '/'])),
      ),
    { dispatch: false },
  );

  navigate$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(NavActions.navigationRequested),
        tap(({ path }) => {
          if (path.includes('www.') || path.includes('http')) {
            window.open(path, '_blank');
          } else {
            this.router.navigate([path]);
          }
        }),
      ),
    { dispatch: false },
  );

  navigateHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSucceeded, AuthActions.passwordChangeSucceeded),
      map(() => NavActions.navigationRequested({ path: '' })),
    ),
  );

  navigateToMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        MembersActions.cancelSelected,
        MembersActions.addMemberSucceeded,
        MembersActions.updateMemberSucceeded,
        MembersActions.fetchMemberFailed,
      ),
      map(() => NavActions.navigationRequested({ path: 'members' })),
    ),
  );

  navigateToSchedule$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        EventsActions.cancelSelected,
        EventsActions.addEventSucceeded,
        EventsActions.updateEventSucceeded,
        EventsActions.fetchEventFailed,
      ),
      map(() => NavActions.navigationRequested({ path: 'schedule' })),
    ),
  );

  navigateToNews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArticlesActions.cancelSelected,
        ArticlesActions.fetchArticleFailed,
        ArticlesActions.publishArticleSucceeded,
        ArticlesActions.updateArticleSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: 'news' })),
    ),
  );

  navigateToPhotoGallery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ImagesActions.cancelSelected,
        ImagesActions.addImageSucceeded,
        ImagesActions.updateImageSucceeded,
      ),
      map(() => NavActions.navigationRequested({ path: 'photo-gallery' })),
    ),
  );

  navigateToLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSucceeded),
      map(() => NavActions.navigationRequested({ path: 'login' })),
    ),
  );

  handleEventRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/event/')),
      map(currentPath => {
        const [controlMode, eventId] = currentPath.split('/event/')[1].split('/');

        if (controlMode === 'add' && !isDefined(eventId)) {
          return EventsActions.addAnEventSelected();
        } else if (controlMode === 'edit' && isValidCollectionId(eventId)) {
          return EventsActions.fetchEventRequested({ eventId });
        } else {
          return NavActions.navigationRequested({ path: 'schedule' });
        }
      }),
    ),
  );

  resetEventFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/event/') && !currentPath?.startsWith('/event/')
        );
      }),
      map(([, previousPath]) => {
        const eventId = previousPath!.split('/event/')[1]?.split('/')[1] ?? null;
        return EventsActions.eventFormDataReset({ eventId });
      }),
    ),
  );

  handleMemberRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/member/')),
      map(currentPath => {
        const [controlMode, memberId] = currentPath.split('/member/')[1].split('/');

        if (controlMode === 'add' && !isDefined(memberId)) {
          return MembersActions.addAMemberSelected();
        } else if (controlMode === 'edit' && isValidCollectionId(memberId)) {
          return MembersActions.fetchMemberRequested({ memberId });
        } else {
          return NavActions.navigationRequested({ path: 'members' });
        }
      }),
    ),
  );

  resetMemberFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/member/') && !currentPath?.startsWith('/member/')
        );
      }),
      map(([, previousPath]) => {
        const memberId = previousPath!.split('/member/')[1]?.split('/')[1] ?? null;
        return MembersActions.memberFormDataReset({ memberId });
      }),
    ),
  );

  handleArticleRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/article/')),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(
        ([currentPath, previousPath]) =>
          previousPath?.split('#')[0] !== currentPath?.split('#')[0],
      ),
      map(([currentPath]) => {
        const [controlMode, articleIdWithFragment] = currentPath
          .split('/article/')[1]
          .split('/');
        const articleId = articleIdWithFragment?.split('#')[0];

        if (controlMode === 'add' && !isDefined(articleId)) {
          return ArticlesActions.createAnArticleSelected();
        } else if (
          ['edit', 'view'].includes(controlMode) &&
          isValidCollectionId(articleId)
        ) {
          return ArticlesActions.fetchArticleRequested({ articleId });
        } else {
          return NavActions.navigationRequested({ path: 'news' });
        }
      }),
    ),
  );

  resetArticleFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/article/') && !currentPath?.startsWith('/article/')
        );
      }),
      map(([, previousPath]) => {
        const articleId = previousPath!.split('/article/')[1]?.split('/')[1] ?? null;
        return ArticlesActions.articleFormDataReset({ articleId });
      }),
    ),
  );

  redirectToNewsRouteAfterArticleDeletion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArticlesActions.deleteArticleSucceeded),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(
        ([{ articleId }, previousPath]) => previousPath === `/article/view/${articleId}`,
      ),
      map(() => NavActions.navigationRequested({ path: 'news' })),
    ),
  );

  handleImageRouteNavigation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/image/')),
      map(currentPath => {
        const [controlMode, imageId] = currentPath.split('/image/')[1].split('/');

        if (controlMode === 'add' && !isDefined(imageId)) {
          return ImagesActions.addAnImageSelected();
        } else if (controlMode === 'edit' && isValidCollectionId(imageId)) {
          return ImagesActions.fetchImageRequested({ imageId });
        } else {
          return NavActions.navigationRequested({ path: 'photo-gallery' });
        }
      }),
    ),
  );

  resetImageFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/image/') && !currentPath?.startsWith('/image/')
        );
      }),
      map(([, previousPath]) => {
        const imageId = previousPath!.split('/image/')[1]?.split('/')[1] ?? null;
        return ImagesActions.imageFormDataReset({ imageId });
      }),
    ),
  );

  resetImagesFormData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.select(NavSelectors.selectPreviousPath)),
      filter(([{ payload }, previousPath]) => {
        const currentPath = payload.event.url;
        return (
          !!previousPath?.startsWith('/images/') && !currentPath?.startsWith('/images/')
        );
      }),
      map(
        ([, previousPath]) => previousPath!.split('/images/')[1]?.split('/')[1] ?? null,
      ),
      filter(isDefined),
      switchMap(album =>
        this.store.select(ImagesSelectors.selectImageEntitiesByAlbum(album)),
      ),
      map(entities => {
        const imageIds = entities.map(entity => entity.image.id);
        return ImagesActions.imagesFormDataReset({ imageIds });
      }),
    ),
  );

  redirectToPhotoGalleryRouteOnImageFetchFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ImagesActions.fetchImageFailed),
      map(() => NavActions.navigationRequested({ path: '' })),
    ),
  );

  fetchImageForArticleViewRoute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => payload.event.url),
      filter(currentPath => currentPath.startsWith('/article/view/')),
      map(currentPath => currentPath.split('/article/view/')[1]),
      filter(isDefined),
      concatLatestFrom(articleId =>
        this.store.select(ArticlesSelectors.selectArticleById(articleId)),
      ),
      filter(([, article]) => isDefined(article?.bannerImageId)),
      map(([, article]) =>
        ImagesActions.fetchImageRequested({ imageId: article!.bannerImageId! }),
      ),
    ),
  );

  clearIndexedDbImageFileData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ImagesActions.imageFormDataReset, ImagesActions.imagesFormDataReset),
        tap(() => this.imageFileService.clearAllImages()),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly imageFileService: ImageFileService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}
}
